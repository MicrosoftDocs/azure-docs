---
title: Enable spa application options using Azure Active Directory B2C
description:  Enable the use of spa application options by using several ways.
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

# Configure authentication options in a Single Page application using Azure Active Directory B2C

This article describes ways you can customize and enhance the Azure Active Directory B2C (Azure AD B2C) authentication experience for your Single Page Application. Before you start, familiarize yourself with the following article: [Configure authentication in a sample web application](configure-authentication-sample-spa-app.md).

[!INCLUDE [active-directory-b2c-app-integration-custom-domain](../../includes/active-directory-b2c-app-integration-custom-domain.md)]

To use a custom domain and your tenant ID in the authentication URL, follow the guidance in [Enable custom domains](custom-domain.md). Find your MSAL configuration object and change the **authorities** and **knownAuthorities** to use your custom domain name and tenant ID.

The following JavaScript shows the MSAL config object before the change: 

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

The following JavaScript shows the MSAL config object after the change: 

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

1. If you're using a custom policy, add the required input claim as described in [Set up direct sign-in](direct-signin.md#prepopulate-the-sign-in-name). 
1. Create an object to store the **login_hint** and pass this object into the **MSAL loginPopup()** method.

    ```javascript
    let loginRequest = {
        loginHint: "bob@contoso.com"
    }
    
    myMSALObj.loginPopup(loginRequest);
    ```

[!INCLUDE [active-directory-b2c-app-integration-domain-hint](../../includes/active-directory-b2c-app-integration-domain-hint.md)]

1. Check the domain name of your external identity provider. For more information, see [Redirect sign-in to a social provider](direct-signin.md#redirect-sign-in-to-a-social-provider). 
1. Create an object to store **extraQueryParameters** and pass this object into the **MSAL loginPopup()** method.

    ```javascript
    let loginRequest = {
         extraQueryParameters: {domain_hint: 'facebook.com'}
    }
    
    myMSALObj.loginPopup(loginRequest);
    ```

[!INCLUDE [active-directory-b2c-app-integration-ui-locales](../../includes/active-directory-b2c-app-integration-ui-locales.md)]

1. [Configure Language customization](language-customization.md).
1. Create an object to store **extraQueryParameters** and pass this object into the **MSAL loginPopup()** method.

    ```javascript
    let loginRequest = {
         extraQueryParameters: {ui_locales: 'en-us'}
    }
    
    myMSALObj.loginPopup(loginRequest);
    ```

[!INCLUDE [active-directory-b2c-app-integration-custom-parameters](../../includes/active-directory-b2c-app-integration-custom-parameters.md)]

1. Configure the [ContentDefinitionParameters](customize-ui-with-html.md#configure-dynamic-custom-page-content-uri) element.
1. Create an object to store **extraQueryParameters** and pass this object into the **MSAL loginPopup()** method.

    ```javascript
    let loginRequest = {
         extraQueryParameters: {campaignId: 'germany-promotion'}
    }
    
    myMSALObj.loginPopup(loginRequest);
    ```

[!INCLUDE [active-directory-b2c-app-integration-id-token-hint](../../includes/active-directory-b2c-app-integration-id-token-hint.md)]

1. In your custom policy, define an [ID token hint technical profile](id-token-hint.md).
1. Create an object to store **extraQueryParameters** and pass this object into the **MSAL loginPopup()** method.

    ```javascript
    let loginRequest = {
         extraQueryParameters: {id_token_hint: 'id-token-hint-value'}
    }
    
    myMSALObj.loginPopup(loginRequest);
    ```

## Enable Single Logout

Single logout in Azure AD B2C uses OpenId Connect front channel logout to make logout requests to all applications the user has signed into through Azure AD B2C.

These logout requests are made from the Azure AD B2C logout page, in a hidden Iframe. The Iframes will make HTTP requests to all of the front channel logout endpoints registered for the apps Azure AD B2C has recorded as being logged in. 

Your logout endpoint for each application must call the **MSAL logout()** method. MSAL must also be explicitly configured to execute within an Iframe in this scenario by setting `allowRedirectInIframe` to `true`.

See the code sample below which sets `allowRedirectInIframe` to `true`:

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

- Learn more: [MSAL.js configuration options](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md)
