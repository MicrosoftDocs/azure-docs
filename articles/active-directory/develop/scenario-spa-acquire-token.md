---
title: Single-page application (acquire a token to call an API) - Microsoft identity platform
description: Learn how to build a single-page application (Acquire a token to call an API)
services: active-directory
documentationcenter: dev-center-name
author: navyasric
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a single-page application using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Single-page application - acquire a token to call an API

The pattern for acquiring tokens for APIs with MSAL.js is to first attempt a silent token request using the `acquireTokenSilent` method. When this method is called, the library first checks the cache in the browser storage to see if a valid token exists and returns it. When there is no valid token in the cache, it sends a silent token request to Azure Active Directory (Azure AD) from a hidden iframe. This method also allows the library to renew tokens. For more details about single sign-on session and token lifetime values in Azure AD, see [token lifetimes](active-directory-configurable-token-lifetimes.md).

The silent token requests to Azure AD may fail for some reasons such as an expired Azure AD session or a password change. In that case, you can invoke one of the interactive methods(which will prompt the user) to acquire tokens.

* [Acquire token with a pop-up window](#acquire-token-with-a-pop-up-window) using `acquireTokenPopup`
* [Acquire token with redirect](#acquire-token-with-redirect) using `acquireTokenRedirect`

**Choosing between a pop-up or redirect experience**

 You cannot use a combination of both the pop-up and redirect methods in your application. The choice between a pop-up or redirect experience depends on your application flow.

* If you don't want the user to navigate away from your main application page during authentication, it's recommended to use the pop-up methods. Since the authentication redirect happens in a pop-up window, the state of the main application is preserved.

* There are certain cases where you may need to use the redirect methods. If users of your application have browser constraints or policies where pop-ups windows are disabled, you can use the redirect methods. It's also recommended to use the redirect methods with Internet Explorer browser since there are certain [known issues with Internet Explorer](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser) when handling pop-up windows.

You can set the API scopes that you want the access token to include when building the access token request. Note that all requested scopes may not be granted in the access token and depends on the user's consent.

## Acquire token with a pop-up window

### JavaScript

The above pattern using the methods for a pop-up experience:

```javascript
const accessTokenRequest = {
    scopes: ["user.read"]
}

userAgentApplication.acquireTokenSilent(accessTokenRequest).then(function(accessTokenResponse) {
    // Acquire token silent success
    // call API with token
    let accessToken = accessTokenResponse.accessToken;
}).catch(function (error) {
    //Acquire token silent failure, send an interactive request.
    if (error.errorMessage.indexOf("interaction_required") !== -1) {
        userAgentApplication.acquireTokenPopup(accessTokenRequest).then(function(accessTokenResponse) {
            // Acquire token interactive success
        }).catch(function(error) {
            // Acquire token interactive failure
            console.log(error);
        });
    }
    console.log(error);
});
```

### Angular

The MSAL Angular wrapper provides the convenience of adding the HTTP interceptor `MsalInterceptor` which will automatically acquire access tokens silently and attach them to the HTTP requests to APIs.

You can specify the scopes for APIs in the `protectedResourceMap` config option which the MsalInterceptor will request when automatically acquiring tokens.

```javascript
//In app.module.ts
@NgModule({
  imports: [ MsalModule.forRoot({
                clientID: 'your_app_id',
                protectedResourceMap: {"https://graph.microsoft.com/v1.0/me", ["user.read", "mail.send"]}
            })]
         })

providers: [ ProductService, {
        provide: HTTP_INTERCEPTORS,
        useClass: MsalInterceptor,
        multi: true
    }
   ],
```

For success and failure of the silent token acquisition, MSAL Angular provides callbacks you can subscribe to. It's also important to remember to unsubscribe.

```javascript
// In app.component.ts
 ngOnInit() {
    this.subscription=  this.broadcastService.subscribe("msal:acquireTokenFailure", (payload) => {
    });
}

ngOnDestroy() {
   this.broadcastService.getMSALSubject().next(1);
   if(this.subscription) {
     this.subscription.unsubscribe();
   }
 }
```

Alternatively, you can also explicitly acquire tokens using the acquire token methods as described in the core MSAL.js library.

## Acquire token with redirect

### JavaScript

The pattern is as described above but shown with a redirect method to acquire token interactively. Note that you will need to register the redirect callback as mentioned above.

```javascript
function authCallback(error, response) {
    //handle redirect response
}

userAgentApplication.handleRedirectCallback(authCallback);

const accessTokenRequest: AuthenticationParameters = {
    scopes: ["user.read"]
}

userAgentApplication.acquireTokenSilent(accessTokenRequest).then(function(accessTokenResponse) {
    // Acquire token silent success
    // call API with token
    let accessToken = accessTokenResponse.accessToken;
}).catch(function (error) {
    //Acquire token silent failure, send an interactive request.
    console.log(error);
    if (error.errorMessage.indexOf("interaction_required") !== -1) {
        userAgentApplication.acquireTokenRedirect(accessTokenRequest);
    }
});
```

### Angular

This is the same as described above.

## Next steps

> [!div class="nextstepaction"]
> [Calling a Web API](scenario-spa-call-api.md)
