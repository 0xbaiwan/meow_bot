
import axios from 'axios';
import { logger } from './logger.js';
const log = logger;
import {
    newAgent,
    delay
} from './helper.js'

const URL_API = `https://api-mewtopia.slimerevolution.com/api/v1/`

export async function playGame(authToken, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const payload = {}
    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const response = await axios.post(`${URL_API}game/play`, payload, { headers, httpsAgent: useragent });
        return response.data;
    } catch (error) {
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await playGame(authToken, proxy, retries - 1)
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}


export async function updateGame(authToken, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const payload = {}
    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const response = await axios.post(`${URL_API}game/update-level`, payload, { headers, httpsAgent: useragent });
        return response.data;
    } catch (error) {
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await updateGame(authToken, proxy, retries - 1);
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}


export async function submitGame(authToken, Move, GameId, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const payload = { Move, GameId }
    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const response = await axios.post(`${URL_API}game/result`, payload, { headers, httpsAgent: useragent });
        return response.data;
    } catch (error) {
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await submitGame(authToken, Move, GameId, proxy, retries - 1);
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}


export async function claimFarm(authToken, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const payload = { "type": 1 }
    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const response = await axios.post(`${URL_API}farming/claim`, payload, { headers, httpsAgent: useragent });
        return response.data;
    } catch (error) {
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await claimFarm(authToken, proxy, retries - 1);
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}

export async function updateRoom(authToken, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const payload = { "type": 1 }
    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const response = await axios.post(`${URL_API}room/update`, payload, { headers, httpsAgent: useragent });
        return response.data;
    } catch (error) {
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await updateRoom(authToken, proxy, retries - 1);
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}

export async function buidDecor(authToken, DecorId, DecorSkinId, Room, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const payload = { DecorId, DecorSkinId, Room }
    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const response = await axios.post(`${URL_API}room/decor-skin`, payload, { headers, httpsAgent: useragent });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message;
        if (message === "Wait building" || message === "Not enough diamond") return "Wait building";
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await buidDecor(authToken, DecorId, DecorSkinId, Room, proxy, retries - 1);
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}


export async function loginUser(WalletAddress, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const payload = { WalletAddress, "ReferId": 1942365516, "TelegramId": 0 }
    try {
        const response = await axios.post(`${URL_API}user/login`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
            httpsAgent: useragent
        });
        return response.data;
    } catch (error) {
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await loginUser(WalletAddress, proxy, retries - 1);
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}


export async function gatcha(authToken, address_wallet, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const payload = { "type": 1, address_wallet }
    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const response = await axios.post(`${URL_API}gacha`, payload, { headers, httpsAgent: useragent });
        return response.data;
    } catch (error) {
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await gatcha(authToken, address_wallet, proxy, retries - 1);
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}


export async function skipBuilding(authToken, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const payload = {}
    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const response = await axios.post(`${URL_API}room/skip-building`, payload, { headers, httpsAgent: useragent });
        return response.data;
    } catch (error) {
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await skipBuilding(authToken, proxy, retries, retries - 1);
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}


export async function dailyClaim(authToken, Day, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const payload = { Day }
    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const response = await axios.post(`${URL_API}7day/claim`, payload, { headers, httpsAgent: useragent });
        return response.data;
    } catch (error) {
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await dailyClaim(authToken, Day, proxy, retries - 1);
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}


export async function getUserInfo(authToken, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const response = await axios.get(`${URL_API}user/info`, { headers, httpsAgent: useragent });
        return response.data;
    } catch (error) {
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await getUserInfo(authToken, proxy, retries - 1);
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}

export async function getUserRoomInfo(authToken, roomId, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const response = await axios.get(`${URL_API}room/list?room=${roomId}`, { headers, httpsAgent: useragent });
        return response.data;
    } catch (error) {
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await getUserRoomInfo(authToken, roomId, proxy, retries - 1);
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}

export async function getUserDecor(authToken, decorId, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const response = await axios.get(`${URL_API}room/decor-skin?DecorId=${decorId}`, { headers, httpsAgent: useragent });
        return response.data;
    } catch (error) {
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await getUserDecor(authToken, decorId, proxy, retries - 1);
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}


export async function getRoomCost(authToken, roomId, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const response = await axios.get(`${URL_API}room/cost?id=${roomId}`, { headers, httpsAgent: useragent });
        return response.data;
    } catch (error) {
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await getRoomCost(authToken, roomId, proxy, retries - 1);
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}


export async function currentRoom(authToken, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const response = await axios.get(`${URL_API}room/current`, { headers, httpsAgent: useragent });
        return response.data;
    } catch (error) {
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await currentRoom(authToken, proxy, retries - 1);
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}

export async function getUserFarm(authToken, proxy, retries = 5) {
    const useragent = newAgent(proxy);
    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const response = await axios.get(`${URL_API}farming/info`, { headers, httpsAgent: useragent });
        return response.data;
    } catch (error) {
        const attempt = 6 - retries;
        log.error(`Error on attempt ${attempt}:`, error.response ? error.response.data : error.message);

        if (retries > 0) {
            log.info(`Retrying in ${attempt} second(s)...`);
            await delay(attempt)
            return await getUserFarm(authToken, proxy, retries - 1);
        }

        log.error('Max retries reached. Giving up.');
        return null;
    }
}
