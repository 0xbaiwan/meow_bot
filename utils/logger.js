import chalk from 'chalk';

const logger = {
    log: (level, message, value = '') => {
        const now = new Date().toLocaleString();

        const colors = {
            info: chalk.cyanBright,
            warn: chalk.yellow,
            error: chalk.red,
            success: chalk.blue,
            debug: chalk.magenta,
        };

        const color = colors[level] || chalk.white;
        const levelMap = {
            info: '信息',
            warn: '警告', 
            error: '错误',
            success: '成功',
            debug: '调试'
        };
        
        const levelTag = `[ ${levelMap[level] || level.toUpperCase()} ]`;
        const timestamp = `[ ${now} ]`;

        const formattedMessage = `${chalk.cyanBright("[ 喵喵机器人 ]")} ${chalk.grey(timestamp)} ${color(levelTag)} ${message}`;

        let formattedValue = ` ${chalk.green(value)}`;
        if (level === 'error') {
            formattedValue = ` ${chalk.red(value)}`;
        } else if (level === 'warn') {
            formattedValue = ` ${chalk.yellow(value)}`;
        }
        if (typeof value === 'object') {
            const valueColor = level === 'error' ? chalk.red : chalk.green;
            formattedValue = ` ${valueColor(JSON.stringify(value))}`;
        }

        console.log(`${formattedMessage}${formattedValue}`);
    },

    info: (message, value = '') => logger.log('info', message, value),
    warn: (message, value = '') => logger.log('warn', message, value),
    error: (message, value = '') => logger.log('error', message, value),
    success: (message, value = '') => logger.log('success', message, value),
    debug: (message, value = '') => logger.log('debug', message, value),
};

// 日志消息翻译
const logMessages = {
    fileSaved: (filename) => `文件已保存到 ${filename}`,
    saveFailed: (filename) => `保存文件 ${filename} 失败`,
    fileReadError: '读取文件时出错',
    unsupportedProxy: '不支持的代理类型',
    retrying: (attempt) => `重试中... (第 ${attempt} 次)`,
    maxRetries: '已达到最大重试次数',
    givingUp: '放弃操作'
};

export { logger, logMessages };
