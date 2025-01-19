import { delay, readFile } from './utils/helper.js';
import { logger, logMessages } from './utils/logger.js';
const log = logger;
import { banner as bedduSalaam } from './utils/banner.js';
import * as Kopi from './utils/api.js';

// 检查用户信息
async function checkingUser(token, proxy, i) {
    try {
        log.info(`正在检查用户信息...\n`);
        const userFarmres = await Kopi.getUserFarm(token, proxy);
        const farmingReward = userFarmres?.data?.farming_reward || 0;

        const userInfoRes = await Kopi.getUserInfo(token, proxy);
        const checkIn = await autoCheckin(token, userInfoRes, proxy, i)
        const userInfo = userInfoRes?.data || { user_name: 'unknown', asset_info: { diamond: 0, gacha_ticket: 0, METO: 0 } };
        const { user_name, asset_info } = userInfo;
        const { diamond, gacha_ticket, METO } = asset_info;
        log.info(`账户 ${i + 1} 的用户信息:`, { user_name, diamond, gacha_ticket, METO, farmingReward })
        return { gacha_ticket, diamond, farmingReward };
    } catch (error) {
        log.info(`检查账户 ${i + 1} 信息时出错:`, error.message);
        return { gacha_ticket: 0, diamond: 0, farmingReward: 0 };
    }
}

// 自动签到功能
async function autoCheckin(token, response, proxy, i) {
    if (!response || !response.success) {
        return;
    }

    try {
        log.info(`正在获取每日签到信息...`);
        const claimedReward = response.data.week_reward
            .slice()
            .reverse()
            .find(daily => daily.tbl_user_7day.is_claim === 1);

        const lastCheckIn = claimedReward?.tbl_user_7day?.updated_at || null;
        const lastDay = claimedReward?.tbl_user_7day?.week_day_id || 0;

        const lastDateCheckIn = new Date(lastCheckIn).toISOString().split('T')[0];
        const currentDate = new Date().toISOString().split('T')[0];
        log.info(`账户 #${i + 1} 上次签到时间:`, `[ ${lastDateCheckIn} ]`)

        if (lastDateCheckIn !== currentDate) {
            log.info(`正在为账户 #${i + 1} 进行每日签到...`);
            const daily = await Kopi.dailyClaim(token, lastDay + 1, proxy);
            log.info(`账户 #${i + 1} 每日签到结果:`, daily?.data || `第 ${lastDay + 1} 天已签到`);
        } else {
            log.warn(`跳过账户 #${i + 1} 的每日签到，今天已经签到过了。`);
        }
    } catch (error) {
        log.error(`签到过程中出错`, error.message)
    }
}

// 主运行函数，负责管理所有账户的自动化流程
async function run() {
    log.info(bedduSalaam);
    await delay(3);

    const wallets = await readFile('accounts.txt');
    const proxies = await readFile('proxy.txt');

    if (wallets.length === 0) {
        log.error(`未找到账户 - 退出程序`);
        return;
    } else {
        log.info(`正在为所有账户运行程序:`, wallets.length);
    }

    while (true) {
        for (let i = 0; i < wallets.length; i++) {
            const wallet = wallets[i];
            const proxy = proxies[i % proxies.length] || null;

            if (proxy) log.info(`正在使用代理运行账户 #${i + 1}:`, proxy);
            else log.info(`正在运行账户 #${i + 1} (无代理)`);

            const loginRes = await Kopi.loginUser(wallet, proxy);
            const token = loginRes?.data?.access_token;
            if (!token) continue;
            let { gacha_ticket, diamond, farmingReward } = await checkingUser(token, proxy, i);

            while (gacha_ticket > 0) {
                log.info(`正在为账户 #${i + 1} 进行抽奖...`);
                const gatchaRes = await Kopi.gatcha(token, wallet, proxy);
                const reward = gatchaRes?.data[0] || "ZONK";
                log.info(`账户 #${i + 1} 抽奖结果:`, reward);
                gacha_ticket--;
            }

            if (farmingReward > 1) {
                log.info(`正在为账户 #${i + 1} 领取农场奖励...`);
                const farmRes = await Kopi.claimFarm(token, proxy);
                const { idClaim, amount } = farmRes?.data || { idClaim: 0, amount: 0 };
                log.info(`账户 #${i + 1} 领取农场奖励结果:`, { idClaim, amount });
            }

            await playingGame(token, proxy, i);
            await upgradeDecortion(token, diamond, proxy, i);
        }
        log.warn(`所有账户运行完成，等待10分钟后继续...`);
        await delay(10 * 60); // 10 minutes
    }
}

// 玩拼图游戏功能
async function playingGame(token, proxy, i) {
    try {
        log.info(`正在为账户 #${i + 1} 玩拼图游戏...`)
        const playGameRes = await Kopi.playGame(token, proxy);
        const current_level = playGameRes?.data?.current_level || 31;
        log.info(`账户 #${i + 1} 当前关卡:`, current_level)
        const move = 10

        if (current_level <= 30) {
            try {
                const gameRes = await Kopi.submitGame(token, move, current_level, proxy);
                log.info(`账户 #${i + 1} 游戏结果:`, gameRes)
                const update = await Kopi.updateGame(token, proxy);
                log.info(`账户 #${i + 1} 更新拼图到下一关:`, update?.data?.info || {})
                await delay(1)
            } catch (error) {
                log.info(`账户 #${i + 1} 玩拼图时出错:`, error.message)
            }
        } else {
            log.warn('该账户已达到最大关卡...')
        }
    } catch (error) {
        log.info(`账户 #${i + 1} 玩游戏时出错:`, error.message)
    }
}

// 升级装饰功能，管理房间装饰和升级
async function upgradeDecortion(token, diamond, proxy, i) {
    try {
        const roomRes = await Kopi.currentRoom(token, proxy);
        const room_id = roomRes?.data?.room_id || 0;
        if (room_id) {
            const availDecor = roomRes?.data?.decor;
            const unlockDecorIds = roomRes.data.decor.flatMap(item => item.unlock_decor);
            log.info(`账户 #${i + 1} 已解锁的装饰皮肤数量:`, unlockDecorIds.length)

            const roomInfo = await Kopi.getUserRoomInfo(token, room_id, proxy);
            if (roomInfo) {
                const decor_limit = roomInfo?.data?.decor_limit || 100;
                const decorIds = roomInfo.data.decors.map(decor => decor.id);

                log.info(`账户 #${i + 1} 当前房间可用装饰数量:`, decorIds.length)
                for (const decorId of decorIds) {

                    const decors = await Kopi.getUserDecor(token, decorId, proxy);
                    const list_skins = decors?.data?.list_skin || [];
                    if (list_skins.length === 0) continue;

                    for (const skin of list_skins) {
                        if (skin.type === 1 && skin.price > diamond) continue; // 钻石不足时跳过高级装饰
                        else if (unlockDecorIds.includes(skin.id)) continue; // 跳过已解锁的装饰
                        log.info(`账户 #${i + 1} 正在尝试建造装饰:`, { room_id, decorId, skinId: skin.id })
                        const build = await Kopi.buidDecor(token, decorId, skin.id, room_id, proxy);
                        if (build === "Wait building") {
                            log.warn(`已有待完成的建造 - 跳过...`);
                            break;
                        }
                        if (skin.type === 1) {
                            diamond -= skin.price;
                        }
                        log.info(`装饰建造是否成功?`, build?.success || false)
                    };
                }

                if (decor_limit === availDecor.length) {
                    log.info(`正在获取账户 #${i + 1} 升级房间的钻石价格...`);
                    const getCost = await Kopi.getRoomCost(token, room_id + 1, proxy);
                    const cost = getCost?.data[0]?.value || 0;
                    log.info(`账户 #${i + 1} 升级房间费用:`, `${cost} 钻石 | 当前钻石: ${diamond}`);
                    if (cost !== 0 && +cost < diamond) {
                        log.info(`正在为账户 #${i + 1} 升级房间...`)
                        const updateRes = await Kopi.updateRoom(token, proxy);
                        log.info(`账户 #${i + 1} 升级结果:`, updateRes)
                    } else {
                        log.warn(`钻石不足，无法升级房间...`)
                    }
                }
            }
        }

    } catch (error) {
        log.info(`升级装饰时出错:`, error.message)
    }
}

run()
