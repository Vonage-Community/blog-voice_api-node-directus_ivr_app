import { Vonage } from "@vonage/server-sdk";
import { Auth } from '@vonage/auth';

function getAuth() {
    const privateKeyString = process.env.PRIVATE_KEY || null;
    const applicationId = process.env.API_APPLICATION_ID || null;

    const authData = {
    };
    
    if (privateKeyString && applicationId) {
        authData['privateKey'] = Buffer.from(privateKeyString, 'base64');
        authData['applicationId'] = applicationId;
    }

    return new Auth(authData);
}

export function getVonageClient() {
    return new Vonage(getAuth(), { appendUserAgent: 'vonage-devrel-directus-movie-ivr'})
}