---
title: Enable Node.js web API authentication options using Azure Active Directory B2C
description:  This article discusses several ways to enable Node.js web API authentication options.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 02/10/2022
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: b2c-support, devx-track-js
---

# Enable Node.js web API authentication options using Azure Active Directory B2C

This article describes how to enable, customize, and enhance the Azure Active Directory B2C (Azure AD B2C) authentication experience for your Node.js web API. 

Before you start, it's important to familiarize yourself with the following articles: 

- [Configure authentication in a sample Node.js web API](configure-authentication-in-sample-node-web-app-with-api.md)
- [Enable authentication in your own Node.js web API](enable-authentication-in-node-web-app-with-api.md).

[!INCLUDE [active-directory-b2c-app-integration-custom-domain](../../includes/active-directory-b2c-app-integration-custom-domain.md)]

To use a custom domain and your tenant ID in the authentication URL, follow the guidance in [Enable custom domains](custom-domain.md). Under the project root folder, open the *.env* file. This file contains information about your Azure AD B2C identity provider.

In the `.env` file of your web app, do the following:

- Replace all instances of `tenant-name.b2clogin.com` with your custom domain. For example, replace `tenant-name.b2clogin.com`, to `login.contoso.com`.
- Replace all instances of `tenant-name.onmicrosoft.com` with your [tenant ID]( tenant-management-read-tenant-name.md#get-your-tenant-id). For more information, see [Use tenant ID](custom-domain.md#optional-use-tenant-id).

The following configuration shows the app settings before the change: 

```text
#B2C sign up and sign in user flow/policy authority
SIGN_UP_SIGN_IN_POLICY_AUTHORITY=https://contoso.b2clogin.com/contoso.onmicrosoft.com/B2C_1_susi
#B2C authority domain
AUTHORITY_DOMAIN=https://contoso.b2clogin.com
#client redirect url
APP_REDIRECT_URI=http://localhost:3000/redirect
#Logout endpoint 
LOGOUT_ENDPOINT=https://contoso.b2clogin.com/contoso.onmicrosoft.com/B2C_1_susi/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:3000
```  

The following configuration shows the app settings after the change: 

```text
#B2C sign up and sign in user flow/policy authority
SIGN_UP_SIGN_IN_POLICY_AUTHORITY=https://login.contoso.com/12345678-0000-0000-0000-000000000000/B2C_1_susi
#B2C authority domain
AUTHORITY_DOMAIN=https://login.contoso.com
#client redirect url
APP_REDIRECT_URI=http://localhost:3000/redirect
#Logout endpoint 
LOGOUT_ENDPOINT=https://login.contoso.com/12345678-0000-0000-0000-000000000000/B2C_1_susi/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:3000
``` 

In the `index.js` file of your web API, do the following:

- Replace all instances of `tenant-name.b2clogin.com` with your custom domain. For example, replace `tenant-name.b2clogin.com`, to `login.contoso.com`.

- Replace all instances of `tenant-name.onmicrosoft.com` with your [tenant ID]( tenant-management-read-tenant-name.md#get-your-tenant-id). For more information, see [Use tenant ID](custom-domain.md#optional-use-tenant-id).

The following configuration shows the app settings before the change: 

```javascript
const options = {
    identityMetadata: `https://${config.credentials.tenantName}.b2clogin.com/${config.credentials.tenantName}.onmicrosoft.com/${config.policies.policyName}/${config.metadata.version}/${config.metadata.discovery}`,
    clientID: config.credentials.clientID,
    ......
}
```

The following configuration shows the app settings after the change: 

```javascript
const options = {
    identityMetadata: `https://login.contoso.com/12345678-0000-0000-0000-000000000000/${config.policies.policyName}/${config.metadata.version}/${config.metadata.discovery}`,
    clientID: config.credentials.clientID,
    ......
}
```

[!INCLUDE [active-directory-b2c-app-integration-login-hint](../../includes/active-directory-b2c-app-integration-login-hint.md)]

1. If you're using a custom policy, add the required input claim, as described in [Set up direct sign-in](direct-signin.md#prepopulate-the-sign-in-name). 
1. Find the `authCodeRequest` object, and set `loginHint` attribute with the login hint.

The following code snippets demonstrate how to pass the sign-in hint parameter. It uses bob@contoso.com as the attribute value.

```javascript
authCodeRequest.loginHint = "bob@contoso.com"

return confidentialClientApplication.getAuthCodeUrl(authCodeRequest)
        .then((response) => {
```

[!INCLUDE [active-directory-b2c-app-integration-domain-hint](../../includes/active-directory-b2c-app-integration-domain-hint.md)]

1. Check the domain name of your external identity provider. For more information, see [Redirect sign-in to a social provider](direct-signin.md#redirect-sign-in-to-a-social-provider).
1. Find the `authCodeRequest` object, and set `domainHint` attribute with the corresponding domain hint.

The following code snippets demonstrate how to pass the domain hint parameter. It uses facebook.com as the attribute value.

```javascript
authCodeRequest.domainHint = "facebook.com"

return confidentialClientApplication.getAuthCodeUrl(authCodeRequest)
        .then((response) => {
```

[!INCLUDE [active-directory-b2c-app-integration-ui-locales](../../includes/active-directory-b2c-app-integration-ui-locales.md)]

1. [Configure language customization](language-customization.md).
1. Find the `authCodeRequest` object, and set `extraQueryParameters` attribute with the corresponding `ui_locales` extra parameter.

The following code snippets demonstrate how to pass the `ui_locales` parameter. It uses `es-es` as the attribute value.

```javascript
authCodeRequest.extraQueryParameters = {"ui_locales" : "es-es"}

return confidentialClientApplication.getAuthCodeUrl(authCodeRequest)
        .then((response) => {
```

[!INCLUDE [active-directory-b2c-app-integration-custom-parameters](../../includes/active-directory-b2c-app-integration-custom-parameters.md)]

1. Configure the [ContentDefinitionParameters](customize-ui-with-html.md#configure-dynamic-custom-page-content-uri) element.
1. Find the `authCodeRequest` object, and set `extraQueryParameters` attribute with the corresponding extra parameter.

The following code snippets demonstrate how to pass the `campaignId` custom query string parameter. It uses `germany-promotion` as the attribute value.

```javascript
authCodeRequest.extraQueryParameters = {"campaignId" : "germany-promotion"}

return confidentialClientApplication.getAuthCodeUrl(authCodeRequest)
        .then((response) => {
```

[!INCLUDE [active-directory-b2c-app-integration-id-token-hint](../../includes/active-directory-b2c-app-integration-id-token-hint.md)]

1. In your custom policy, define an [ID token hint technical profile](id-token-hint.md).
1. Find the `authCodeRequest` object, and set `extraQueryParameters` attribute with the corresponding `id_token_hint` extra parameter.

The following code snippets demonstrate how to define an ID token hint:

```javascript
authCodeRequest.extraQueryParameters = {"id_token_hint": idToken}

return confidentialClientApplication.getAuthCodeUrl(authCodeRequest)
```

[!INCLUDE [active-directory-b2c-app-integration-logging](../../includes/active-directory-b2c-app-integration-logging.md)]

To configure [logging](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/logging.md), in *index.js*, configure the following keys:

- `logLevel` lets you specify the level of logging. Possible values: `Error`, `Warning`, `Info`, and `Verbose`.
- `piiLoggingEnabled` enables the input of personal data. Possible values: `true` or `false`.
 
The following code snippet demonstrates how to configure MSAL logging:

```javascript
 const confidentialClientConfig = {
    ...
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};
```

## Next steps

Learn more about [MSAL.js configuration options](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md).
