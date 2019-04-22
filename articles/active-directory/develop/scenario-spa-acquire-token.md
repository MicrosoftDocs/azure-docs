---
title: Single Page Application - acquiring a token to call an API | Azure
description: Learn how to build a Single Page Application (acquiring a token to call an API)
services: active-directory
documentationcenter: dev-center-name
author: navyasric
manager: CelesteDG
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/18/2019
ms.author: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a Single Page Application using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Single Page Application - acquiring a token to call an API

The pattern for acquiring tokens for APIs with MSAL.js is to first attempt a silent token request using the `acquireTokenSilent` method. The library performs this request from a hidden iframe. This method also allows the library to renew tokens. If the silent token request fails for some reasons such as an expired Azure AD session or a password change, you can invoke an interactive method(which will prompt the user) such as `acquireTokenPopup` or `acquireTokenRedirect` to acquire tokens.

You can set the API scopes that you want the access token to include when building the access token request. Note that all requested scopes may not be granted in the access token and depends on the user's consent.

## Acquire token with popup

### JavaScript

The above pattern using Popup methods:

```JS
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

```JS
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

For success and failure of the silent token acquisition, MSAL Angular provides callbacks you can subscribe to. It is also important to remember to unsubscribe.

```JS
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

The pattern is as described above but shown with a redirect method to acquire token interactively. Note that you will need to register the redirect callbacks as mentioned above.

```JS
function tokenReceivedCallback(response) {
    // use response in callback code
}

function errorReceivedCallback(error) {
    // handle error in callback code
}

userAgentApplication.handleRedirectCallbacks(tokenReceivedCallback, errorReceivedCallback);

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
