---
title: Configure authentication options in an Angular application by using Azure Active Directory B2C
description:  Enable the use of Angular application options in several ways.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/23/2023
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Configure authentication options in an Angular application by using Azure Active Directory B2C

This article describes how you can customize and enhance the Azure Active Directory B2C (Azure AD B2C) authentication experience for your Angular single-page application (SPA). 

## Prerequisites

Familiarize yourself with the article [Configure authentication in an Angular SPA](configure-authentication-sample-angular-spa-app.md) or [Enable authentication in your own Angular SPA](enable-authentication-angular-spa-app.md).


## Sign-in and sign-out behavior

You can configure your single-page application to sign in users with MSAL.js in two ways:

- **Pop-up window**: The authentication happens in a pop-up window, and the state of the application is preserved. Use this approach if you don't want users to move away from your application page during authentication.  However, there are known issues with pop-up windows on Internet Explorer.
  - To sign in with pop-up windows, in the `src/app/app.component.ts` class, use the `loginPopup` method.  
  - In the `src/app/app.module.ts` class, set the `interactionType` attribute to `InteractionType.Popup`.
  - To sign out with pop-up windows, in the `src/app/app.component.ts` class, use the `logoutPopup` method. You can also configure `logoutPopup` to redirect the main window to a different page, such as the home page or sign-in page, after sign-out is complete by passing `mainWindowRedirectUri` as part of the request.
- **Redirect**: The user is redirected to Azure AD B2C to complete the authentication flow. Use this approach if users have browser constraints or policies where pop-up windows are disabled. 
  - To sign in with redirection, in the `src/app/app.component.ts` class, use the `loginRedirect` method.  
  - In the `src/app/app.module.ts` class, set the `interactionType` attribute to `InteractionType.Redirect`.
  - To sign out with redirection, in the `src/app/app.component.ts` class, use the `logoutRedirect` method. Configure the URI to which it should redirect after a sign-out by setting `postLogoutRedirectUri`. You should add this URI as a redirect URI in your application registration.
  
The following sample demonstrates how to sign in and sign out:

#### [Pop-up](#tab/popup)


```typescript
//src/app/app.component.ts
login() {
  if (this.msalGuardConfig.authRequest){
    this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest);
  } else {
    this.authService.loginPopup();
  }
}

logout() { 
  this.authService.logoutPopup({
    mainWindowRedirectUri: '/',
  });
}
```

#### [Redirect](#tab/redirect)

```typescript
//src/app/app.component.ts
login() {
  if (this.msalGuardConfig.authRequest){
    this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
  } else {
    this.authService.loginRedirect();
  }
}

logout() { 
  this.authService.logoutRedirect({
    postLogoutRedirectUri: 'http://localhost:4200'
  });
}
```

---

The MSAL Angular library has three sign-in flows: interactive sign-in (where a user selects the sign-in button), MSAL Guard, and MSAL Interceptor. The MSAL Guard and MSAL Interceptor configurations take effect when a user tries to access a protected resource without a valid access token. In such cases, the MSAL library forces the user to sign in. 

The following samples demonstrate how to configure MSAL Guard and MSAL Interceptor for sign-in with a pop-up window or redirection: 

#### [Pop-up](#tab/popup)

```typescript
// src/app/app.module.ts
MsalModule.forRoot(new PublicClientApplication(msalConfig),
  {
    interactionType: InteractionType.Popup,
    authRequest: {
      scopes: protectedResources.todoListApi.scopes,
    }
  },
  {
    interactionType: InteractionType.Popup,
    protectedResourceMap: new Map([
      [protectedResources.todoListApi.endpoint, protectedResources.todoListApi.scopes]
    ])
  })
```

#### [Redirect](#tab/redirect)

```typescript
// src/app/app.module.ts
MsalModule.forRoot(new PublicClientApplication(msalConfig),
  {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: protectedResources.todoListApi.scopes,
    }
  },
  {
    interactionType: InteractionType.Redirect,
    protectedResourceMap: new Map([
      [protectedResources.todoListApi.endpoint, protectedResources.todoListApi.scopes]
    ])
  })
```

---  

[!INCLUDE [active-directory-b2c-app-integration-login-hint](../../includes/active-directory-b2c-app-integration-login-hint.md)]

1. If you use a custom policy, add the required input claim as described in [Set up direct sign-in](direct-signin.md#prepopulate-the-sign-in-name). 
1. Create or use an existing `PopupRequest` or `RedirectRequest` MSAL configuration object.
1. Set the `loginHint` attribute with the corresponding sign-in hint. 

The following code snippets demonstrate how to pass the sign-in hint parameter. They use `bob@contoso.com` as the attribute value.

#### [Pop-up](#tab/popup)

```typescript
// src/app/app.component.ts
let authRequestConfig: PopupRequest;

if (this.msalGuardConfig.authRequest) {
  authRequestConfig = { ...this.msalGuardConfig.authRequest } as PopupRequest
}

authRequestConfig.loginHint = "bob@contoso.com"

this.authService.loginPopup(authRequestConfig);

// src/app/app.module.ts
MsalModule.forRoot(new PublicClientApplication(msalConfig),
  {
    interactionType: InteractionType.Popup,
    authRequest: {
      scopes: protectedResources.todoListApi.scopes,
      loginHint: "bob@contoso.com"
    }
  },
```

#### [Redirect](#tab/redirect)

```typescript
// src/app/app.component.ts
let authRequestConfig: RedirectRequest;

if (this.msalGuardConfig.authRequest) {
  authRequestConfig = { ...this.msalGuardConfig.authRequest } as RedirectRequest
}

authRequestConfig.loginHint = "bob@contoso.com"

this.authService.loginRedirect(authRequestConfig);

// src/app/app.module.ts
MsalModule.forRoot(new PublicClientApplication(msalConfig),
  {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: protectedResources.todoListApi.scopes,
      loginHint: "bob@contoso.com"
    }
  },
```

---  


[!INCLUDE [active-directory-b2c-app-integration-domain-hint](../../includes/active-directory-b2c-app-integration-domain-hint.md)]

1. Check the domain name of your external identity provider. For more information, see [Redirect sign-in to a social provider](direct-signin.md#redirect-sign-in-to-a-social-provider). 
1. Create or use an existing `PopupRequest` or `RedirectRequest` MSAL configuration object.
1. Set the `domainHint` attribute with the corresponding domain hint.

The following code snippets demonstrate how to pass the domain hint parameter. They use `facebook.com` as the attribute value.

#### [Pop-up](#tab/popup)

```typescript
// src/app/app.component.ts
let authRequestConfig: PopupRequest;

if (this.msalGuardConfig.authRequest) {
  authRequestConfig = { ...this.msalGuardConfig.authRequest } as PopupRequest
}

authRequestConfig.domainHint = "facebook.com";

this.authService.loginPopup(authRequestConfig);

// src/app/app.module.ts
MsalModule.forRoot(new PublicClientApplication(msalConfig),
  {
    interactionType: InteractionType.Popup,
    authRequest: {
      scopes: protectedResources.todoListApi.scopes,
      domainHint: "facebook.com"
    }
  },
```

#### [Redirect](#tab/redirect)

```typescript
// src/app/app.component.ts
let authRequestConfig: RedirectRequest;

if (this.msalGuardConfig.authRequest) {
  authRequestConfig = { ...this.msalGuardConfig.authRequest } as RedirectRequest
}

authRequestConfig.domainHint = "facebook.com";

this.authService.loginRedirect(authRequestConfig);

// src/app/app.module.ts
MsalModule.forRoot(new PublicClientApplication(msalConfig),
  {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: protectedResources.todoListApi.scopes,
      domainHint: "facebook.com"
    }
  },
```

---  

[!INCLUDE [active-directory-b2c-app-integration-ui-locales](../../includes/active-directory-b2c-app-integration-ui-locales.md)]

1. [Configure Language customization](language-customization.md). 
1. Create or use an existing `PopupRequest` or `RedirectRequest` MSAL configuration object with `extraQueryParameters` attributes.
1. Add the `ui_locales` parameter with the corresponding language code to the `extraQueryParameters` attributes.

The following code snippets demonstrate how to pass the domain hint parameter. They use `es-es` as the attribute value.

#### [Pop-up](#tab/popup)

```typescript
// src/app/app.component.ts
let authRequestConfig: PopupRequest;

if (this.msalGuardConfig.authRequest) {
  authRequestConfig = { ...this.msalGuardConfig.authRequest } as PopupRequest
}

authRequestConfig.extraQueryParameters = {"ui_locales" : "es-es"};

this.authService.loginPopup(authRequestConfig);

// src/app/app.module.ts
MsalModule.forRoot(new PublicClientApplication(msalConfig),
  {
    interactionType: InteractionType.Popup,
    authRequest: {
      scopes: protectedResources.todoListApi.scopes,
      extraQueryParameters: {"ui_locales" : "es-es"}
    }
  },
```

#### [Redirect](#tab/redirect)

```typescript
// src/app/app.component.ts
let authRequestConfig: RedirectRequest;

if (this.msalGuardConfig.authRequest) {
  authRequestConfig = { ...this.msalGuardConfig.authRequest } as RedirectRequest
}

authRequestConfig.extraQueryParameters = {"ui_locales" : "es-es"};

this.authService.loginRedirect(authRequestConfig);

// src/app/app.module.ts
MsalModule.forRoot(new PublicClientApplication(msalConfig),
  {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: protectedResources.todoListApi.scopes,
      extraQueryParameters: {"ui_locales" : "es-es"}
    }
  },
```

---   
 

[!INCLUDE [active-directory-b2c-app-integration-custom-parameters](../../includes/active-directory-b2c-app-integration-custom-parameters.md)]

1. Configure the [ContentDefinitionParameters](customize-ui-with-html.md#configure-dynamic-custom-page-content-uri) element.
1. Create or use an existing `PopupRequest` or `RedirectRequest` MSAL configuration object with `extraQueryParameters` attributes.
1. Add the custom query string parameter, such as `campaignId`. Set the parameter value. 

The following code snippets demonstrate how to pass a custom query string parameter. They use `germany-promotion` as the attribute value.

#### [Pop-up](#tab/popup)

```typescript
// src/app/app.component.ts
let authRequestConfig: PopupRequest;

if (this.msalGuardConfig.authRequest) {
  authRequestConfig = { ...this.msalGuardConfig.authRequest } as PopupRequest
}

authRequestConfig.extraQueryParameters = {"campaignId": 'germany-promotion'}

this.authService.loginPopup(authRequestConfig);

// src/app/app.module.ts
MsalModule.forRoot(new PublicClientApplication(msalConfig),
  {
    interactionType: InteractionType.Popup,
    authRequest: {
      scopes: protectedResources.todoListApi.scopes,
      extraQueryParameters: {"ui_locales" : "es-es"}
    }
  },
```

#### [Redirect](#tab/redirect)

```typescript
// src/app/app.component.ts
let authRequestConfig: RedirectRequest;

if (this.msalGuardConfig.authRequest) {
  authRequestConfig = { ...this.msalGuardConfig.authRequest } as RedirectRequest
}

authRequestConfig.extraQueryParameters = {"campaignId": 'germany-promotion'}

this.authService.loginRedirect(authRequestConfig);

// src/app/app.module.ts
MsalModule.forRoot(new PublicClientApplication(msalConfig),
  {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: protectedResources.todoListApi.scopes,
      extraQueryParameters: {"campaignId" : "germany-promotion"}
    }
  },
```

---

[!INCLUDE [active-directory-b2c-app-integration-id-token-hint](../../includes/active-directory-b2c-app-integration-id-token-hint.md)]

1. In your custom policy, define the [technical profile of an ID token hint](id-token-hint.md).
1. Create or use an existing `PopupRequest` or `RedirectRequest` MSAL configuration object with `extraQueryParameters` attributes.
1. Add the `id_token_hint` parameter with the corresponding variable that stores the ID token.

The following code snippets demonstrate how to define an ID token hint:

#### [Pop-up](#tab/popup)

```typescript
// src/app/app.component.ts
let authRequestConfig: PopupRequest;

if (this.msalGuardConfig.authRequest) {
  authRequestConfig = { ...this.msalGuardConfig.authRequest } as PopupRequest
}

authRequestConfig.extraQueryParameters = {"id_token_hint": idToken};

this.authService.loginPopup(authRequestConfig);

// src/app/app.module.ts
MsalModule.forRoot(new PublicClientApplication(msalConfig),
  {
    interactionType: InteractionType.Popup,
    authRequest: {
      scopes: protectedResources.todoListApi.scopes,
      extraQueryParameters: {"id_token_hint" : idToken}
    }
  },
```

#### [Redirect](#tab/redirect)

```typescript
// src/app/app.component.ts
let authRequestConfig: RedirectRequest;

if (this.msalGuardConfig.authRequest) {
  authRequestConfig = { ...this.msalGuardConfig.authRequest } as RedirectRequest
}

authRequestConfig.extraQueryParameters = {"id_token_hint": idToken};;

this.authService.loginRedirect(authRequestConfig);

// src/app/app.module.ts
MsalModule.forRoot(new PublicClientApplication(msalConfig),
  {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: protectedResources.todoListApi.scopes,
      extraQueryParameters: {"id_token_hint" : idToken}
    }
  },
```

---

[!INCLUDE [active-directory-b2c-app-integration-custom-domain](../../includes/active-directory-b2c-app-integration-custom-domain.md)]

To use your custom domain for your tenant ID in the authentication URL, follow the guidance in [Enable custom domains](custom-domain.md). Open the `src/app/auth-config.ts` MSAL configuration object and change `authorities` and `knownAuthorities` to use your custom domain name and tenant ID.  

The following JavaScript shows the MSAL configuration object before the change: 

```typescript
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

```typescript
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


[!INCLUDE [active-directory-b2c-app-integration-logging](../../includes/active-directory-b2c-app-integration-logging.md)]

To configure Angular [logging](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/logging.md), in *src/app/auth-config.ts*, configure the following keys:

- `loggerCallback` is the logger callback function. 
- `logLevel` lets you specify the level of logging. Possible values: `Error`, `Warning`, `Info`, and `Verbose`.
- `piiLoggingEnabled` enables the input of personal data. Possible values: `true` or `false`.
 
The following code snippet demonstrates how to configure MSAL logging:

```typescript
export const msalConfig: Configuration = {
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

- Learn more: [MSAL.js configuration options](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md).
