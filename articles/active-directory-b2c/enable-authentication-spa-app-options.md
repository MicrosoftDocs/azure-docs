---
title: Enable SPA application options by using Azure Active Directory B2C
description:  This article discusses several ways to enable the use of SPA applications.
services: active-directory-b2c
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 07/05/2021
ms.author: mimart
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Configure authentication options in a single-page application by using Azure AD B2C

This article describes how to customize and enhance the Azure Active Directory B2C (Azure AD B2C) authentication experience for your single-page application (SPA). 

Before you start, familiarize yourself with the following article: [Configure authentication in a sample web application](configure-authentication-sample-spa-app.md).

[!INCLUDE [active-directory-b2c-app-integration-custom-domain](../../includes/active-directory-b2c-app-integration-custom-domain.md)]

To use a custom domain and your tenant ID in the authentication URL, follow the guidance in [Enable custom domains](custom-domain.md). Find your Microsoft Authentication Library (MSAL) configuration object and change the *authorities* and *knownAuthorities* to use your custom domain name and tenant ID.

The following JavaScript code shows the MSAL configuration object *before* the change: 

```Javascript
const msalConfig = {
    auth: {
      ...
      authority: "https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/B2C_1_susi",
      knownAuthorities: ["fabrikamb2c.b2clogin.com"],
      ...
    },
  ...
}
```  

The following JavaScript code shows the MSAL configuration object *after* the change: 

```Javascript
const msalConfig = {
    auth: {
      ...
      authority: "https://custom.domain.com/00000000-0000-0000-0000-000000000000/B2C_1_susi",
      knownAuthorities: ["custom.domain.com"],
      ...
    },
  ...
}
```  

[!INCLUDE [active-directory-b2c-app-integration-login-hint](../../includes/active-directory-b2c-app-integration-login-hint.md)]

1. If you're using a custom policy, add the required input claim, as described in [Set up direct sign-in](direct-signin.md#prepopulate-the-sign-in-name). 
1. Create an object to store the **login_hint**, and pass this object into the **MSAL loginPopup()** method.

    ```javascript
    let loginRequest = {
        loginHint: "bob@contoso.com"
    }
    
    myMSALObj.loginPopup(loginRequest);
    ```

[!INCLUDE [active-directory-b2c-app-integration-domain-hint](../../includes/active-directory-b2c-app-integration-domain-hint.md)]

1. Check the domain name of your external identity provider. For more information, see [Redirect sign-in to a social provider](direct-signin.md#redirect-sign-in-to-a-social-provider). 
1. Create an object to store **extraQueryParameters**, and pass this object into the **MSAL loginPopup()** method.

    ```javascript
    let loginRequest = {
         extraQueryParameters: {domain_hint: 'facebook.com'}
    }
    
    myMSALObj.loginPopup(loginRequest);
    ```

[!INCLUDE [active-directory-b2c-app-integration-ui-locales](../../includes/active-directory-b2c-app-integration-ui-locales.md)]

1. [Configure language customization](language-customization.md).
1. Create an object to store **extraQueryParameters**, and pass this object into the **MSAL loginPopup()** method.

    ```javascript
    let loginRequest = {
         extraQueryParameters: {ui_locales: 'en-us'}
    }
    
    myMSALObj.loginPopup(loginRequest);
    ```

[!INCLUDE [active-directory-b2c-app-integration-custom-parameters](../../includes/active-directory-b2c-app-integration-custom-parameters.md)]

1. Configure the [ContentDefinitionParameters](customize-ui-with-html.md#configure-dynamic-custom-page-content-uri) element.
1. Create an object to store **extraQueryParameters**, and pass this object into the **MSAL loginPopup()** method.

    ```javascript
    let loginRequest = {
         extraQueryParameters: {campaignId: 'germany-promotion'}
    }
    
    myMSALObj.loginPopup(loginRequest);
    ```

[!INCLUDE [active-directory-b2c-app-integration-id-token-hint](../../includes/active-directory-b2c-app-integration-id-token-hint.md)]

1. In your custom policy, define an [ID token hint technical profile](id-token-hint.md).
1. Create an object to store **extraQueryParameters**, and pass this object into the **MSAL loginPopup()** method.

    ```javascript
    let loginRequest = {
         extraQueryParameters: {id_token_hint: 'id-token-hint-value'}
    }
    
    myMSALObj.loginPopup(loginRequest);
    ```

## Enable single logout

Single logout in Azure AD B2C uses OpenId Connect front-channel logout to make logout requests to all applications the user has signed into through Azure AD B2C.

These logout requests are made from the Azure AD B2C logout page, in a hidden Iframe. The Iframes make HTTP requests to all the front-channel logout endpoints registered for the apps that Azure AD B2C has recorded as being logged in. 

Your logout endpoint for each application must call the **MSAL logout()** method. You must also explicitly configure MSAL to run within an Iframe in this scenario by setting `allowRedirectInIframe` to `true`.

The following code sample sets `allowRedirectInIframe` to `true`:

```javascript
const msalConfig = {
    auth: {
        clientId: "enter_client_id_here",
        .....
    },
    cache: {
        cacheLocation: "..",
        ....
    },
    system: {
        allowRedirectInIframe: true
    };
}

async function logoutSilent(MSAL) {
   return MSAL.logout({
      onRedirectNavigate: (url) => {
         return false;
       }
```

## Next steps

Learn more about [MSAL.js configuration options](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md).
