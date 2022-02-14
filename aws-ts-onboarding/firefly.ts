const axios = require('axios').default;

export const authenticate = (fireflyApi: string, accessKey: string, secretKey: string) => {
    return axios.post(`${fireflyApi}/account/access_keys/login`, {accessKey, secretKey}, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const createIntegration = (fireflyApi: string, token: string, name: string, roleArn: string, externalId: string, fullScanEnabled: boolean, isProd: boolean) => {
    return axios.post(`${fireflyApi}/integrations/aws`, {
        name,
        roleArn,
        externalId,
        fullScanEnabled,
        isProd
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
}
