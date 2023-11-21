---
title: Enable React application options by using Azure Active Directory B2C
description:  Enable the use of React application options in several ways.

author: kengaderdus
manager: CelesteDG
ms.service: active-directory

ms.topic: reference
ms.date: 07/07/2022
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Configure authentication options in a React application by using Azure Active Directory B2C

This article describes ways you can customize and enhance the Azure Active Directory B2C (Azure AD B2C) authentication experience for your React single-page application (SPA). Before you start, familiarize yourself with the article [Configure authentication in an React SPA](configure-authentication-sample-react-spa-app.md) or [Enable authentication in your own React SPA](enable-authentication-react-spa-app.md).


## Sign-in and sign-out behavior


You can configure your single-page application to sign in users with MSAL.js in two ways:

- **Pop-up window**: The authentication happens in a pop-up window, and the state of the application is preserved. Use this approach if you don't want users to move away from your application page during authentication. There are known issues with pop-up windows on Internet Explorer.
  - To sign in with pop-up windows, use the `loginPopup` method.  
  - To sign out with pop-up windows, use the `logoutPopup` method. 
- **Redirect**: The user is redirected to Azure AD B2C to complete the authentication flow. Use this approach if users have browser constraints or policies where pop-up windows are disabled. 
  - To sign in with redirection, use the `loginRedirect` method.  
  - To sign out with redirection, use the `logoutRedirect` method. 
  
The following sample demonstrates how to sign in and sign out:

#### [Pop-up](#tab/popup)


```javascript
// src/components/NavigationBar.jsx
instance.loginPopup(loginRequest)
            .catch((error) => console.log(error))

instance.logoutPopup({ postLogoutRedirectUri: "/", mainWindowRedirectUri: "/" })
```

#### [Redirect](#tab/redirect)

```javascript
// src/components/NavigationBar.jsx
instance.loginRedirect(loginRequest)

instance.logoutRedirect({ postLogoutRedirectUri: "/" })
```

---

[!INCLUDE [active-directory-b2c-app-integration-custom-domain](../../includes/active-directory-b2c-app-integration-custom-domain.md)]

To use your custom domain for your tenant ID in the authentication URL, follow the guidance in [Enable custom domains](custom-domain.md). Open the `src/authConfig.js` MSAL configuration object and change `authorities` and `knownAuthorities` to use your custom domain name and tenant ID.  

The following JavaScript shows the MSAL configuration object before the change: 

```javascript
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

The following JavaScript shows the MSAL configuration object after the change: 

```javascript
export const b2cPolicies = {
    names: {
        signUpSignIn: "b2c_1_susi",
        forgotPassword: "b2c_1_reset",
        editProfile: "b2c_1_edit_profile"
    },
    authorities: {
        signUpSignIn: {
            authority: "https://custom.domain.com/00000000-0000-0000-0000-000000000000/b2c_1_susi",
        },
        forgotPassword: {
            authority: "https://custom.domain.com/00000000-0000-0000-0000-000000000000/b2c_1_reset",
        },
        editProfile: {
            authority: "https://custom.domain.com/00000000-0000-0000-0000-000000000000/b2c_1_edit_profile"
        }
    },
    authorityDomain: "custom.domain.com"
}
```

[!INCLUDE [active-directory-b2c-app-integration-login-hint](../../includes/active-directory-b2c-app-integration-login-hint.md)]

1. If you use a custom policy, add the required input claim as described in [Set up direct sign-in](direct-signin.md#prepopulate-the-sign-in-name). 
1. Create or use an existing `PopupRequest` or `RedirectRequest` MSAL configuration object.
1. Set the `loginHint` attribute with the corresponding sign-in hint. 

The following code snippets demonstrate how to pass the sign-in hint parameter. They use `bob@contoso.com` as the attribute value.

#### [Pop-up](#tab/popup)

```javascript
// src/components/NavigationBar.jsx
loginRequest.loginHint = "bob@contoso.com";
instance.loginPopup(loginRequest);
```

#### [Redirect](#tab/redirect)

```javascript
// src/components/NavigationBar.jsx
loginRequest.loginHint = "bob@contoso.com"; 
instance.loginRedirect(loginRequest);
```

---  


[!INCLUDE [active-directory-b2c-app-integration-domain-hint](../../includes/active-directory-b2c-app-integration-domain-hint.md)]

1. Check the domain name of your external identity provider. For more information, see [Redirect sign-in to a social provider](direct-signin.md#redirect-sign-in-to-a-social-provider). 
1. Create or use an existing `PopupRequest` or `RedirectRequest` MSAL configuration object.
1. Set the `domainHint` attribute with the corresponding domain hint.

The following code snippets demonstrate how to pass the domain hint parameter. They use `facebook.com` as the attribute value.

#### [Pop-up](#tab/popup)

```javascript
// src/components/NavigationBar.jsx
loginRequest.domainHint = "facebook.com";
instance.loginPopup(loginRequest);
```

#### [Redirect](#tab/redirect)

```javascript
loginRequest.domainHint = "facebook.com";
instance.loginRedirect(loginRequest);
```

---  

[!INCLUDE [active-directory-b2c-app-integration-ui-locales](../../includes/active-directory-b2c-app-integration-ui-locales.md)]

1. [Configure Language customization](language-customization.md). 
1. Create or use an existing `PopupRequest` or `RedirectRequest` MSAL configuration object with `extraQueryParameters` attributes.
1. Add the `ui_locales` parameter with the corresponding language code to the `extraQueryParameters` attributes.

The following code snippets demonstrate how to pass the domain hint parameter. They use `es-es` as the attribute value.

#### [Pop-up](#tab/popup)

```javascript
// src/components/NavigationBar.jsx
loginRequest.extraQueryParameters = {"ui_locales" : "es-es"};
instance.loginPopup(loginRequest);
```

#### [Redirect](#tab/redirect)

```javascript
loginRequest.extraQueryParameters = {"ui_locales" : "es-es"};
instance.loginRedirect(loginRequest);
```

--- 
 

[!INCLUDE [active-directory-b2c-app-integration-custom-parameters](../../includes/active-directory-b2c-app-integration-custom-parameters.md)]

1. Configure the [ContentDefinitionParameters](customize-ui-with-html.md#configure-dynamic-custom-page-content-uri) element.
1. Create or use an existing `PopupRequest` or `RedirectRequest` MSAL configuration object with `extraQueryParameters` attributes.
1. Add the custom query string parameter, such as `campaignId`. Set the parameter value. 

The following code snippets demonstrate how to pass a custom query string parameter. They use `germany-promotion` as the attribute value.


#### [Pop-up](#tab/popup)

```javascript
// src/components/NavigationBar.jsx
loginRequest.extraQueryParameters = {"campaignId": 'germany-promotion'};
instance.loginPopup(loginRequest);
```

#### [Redirect](#tab/redirect)

```javascript
loginRequest.extraQueryParameters = {"campaignId": 'germany-promotion'};
instance.loginRedirect(loginRequest);
```

--- 


[!INCLUDE [active-directory-b2c-app-integration-id-token-hint](../../includes/active-directory-b2c-app-integration-id-token-hint.md)]

1. In your custom policy, define the [technical profile of an ID token hint](id-token-hint.md).
1. Create or use an existing `PopupRequest` or `RedirectRequest` MSAL configuration object with `extraQueryParameters` attributes.
1. Add the `id_token_hint` parameter with the corresponding variable that stores the ID token.

The following code snippets demonstrate how to define an ID token hint:

#### [Pop-up](#tab/popup)

```javascript
// src/components/NavigationBar.jsx
loginRequest.extraQueryParameters = {"id_token_hint": idToken};
instance.loginPopup(loginRequest);
```

#### [Redirect](#tab/redirect)

```javascript
loginRequest.extraQueryParameters = {"id_token_hint": idToken};
instance.loginRedirect(loginRequest);
```

---   


[!INCLUDE [active-directory-b2c-app-integration-logging](../../includes/active-directory-b2c-app-integration-logging.md)]

To configure MSAL logging, in *src/authConfig.js*, configure the following keys:

- `loggerCallback` is the logger callback function. 
- `logLevel` lets you specify the level of logging. Possible values: `Error`, `Warning`, `Info`, and `Verbose`.
- `piiLoggingEnabled` enables the input of personal data. Possible values: `true` or `false`.
 
The following code snippet demonstrates how to configure MSAL logging:

```javascript
export const msalConfig = {
  ...
  system: {
    loggerOptions: {
        loggerCallback: (logLevel, message, containsPii) => {  
            console.log(message);
          },
          logLevel: LogLevel.Verbose,
          piiLoggingEnabled: false
      }
  }
  ...
}
```

## Next steps

- Learn more: [MSAL.js configuration options](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react/docs).

