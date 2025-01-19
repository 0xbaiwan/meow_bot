import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import fs from 'fs/promises';
import { logger, logMessages } from './logger.js';
const log = logger;

// 延迟函数，单位为秒
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
}

// 保存数据到文件
export async function saveToFile(filename, data) {
    try {
        await fs.appendFile(filename, `${data}\n`, 'utf-8');
        log.info(logMessages.fileSaved(filename));
    } catch (error) {
        log.error(logMessages.saveFailed(filename), error.message);
    }
}


// 从文件读取账户信息
export async function readAccountsFromFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const lines = data.trim().split('\n');
        const accounts = lines.map(line => {
            const [address, provateKey] = line.split('|');
            return { address, provateKey };
        });
        return accounts;
    } catch (error) {
        console.error('Error reading accounts file:', error.message);
        return [];
    }
}


// 读取文件内容并返回非空行数组
export async function readFile(pathFile) {
    try {
        const datas = await fs.readFile(pathFile, 'utf8');
        return datas.split('\n')
            .map(data => data.trim())
            .filter(data => data.length > 0);
    } catch (error) {
        log.error(logMessages.fileReadError, error.message);
        return [];
    }
}


// 创建代理agent，支持http和socks代理
export const newAgent = (proxy = null) => {
    if (proxy) {
        if (proxy.startsWith('http://')) {
            return new HttpsProxyAgent(proxy);
        } else if (proxy.startsWith('socks4://') || proxy.startsWith('socks5://')) {
            return new SocksProxyAgent(proxy);
        } else {
            log.warn(logMessages.unsupportedProxy, proxy);
            return null;
        }
    }
    return null;
};
