export const refreshTokenSetup = (res: any) => {
    // refresh timing for the first time
    let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;
    
    const refreshToken = async () => {
        const newAuthRes = await res.reloadAuthResponse();

        // save access token
        
        // refresh after the first time
        refreshTiming = (newAuthRes.tokenObj.expires_in || 3600 - 5 * 60) * 1000;
        setTimeout(refreshToken, refreshTiming);
    }

    // refresh the first time
    setTimeout(refreshToken, refreshTiming);
}