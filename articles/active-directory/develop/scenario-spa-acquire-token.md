---
title: Acquire a token to call a web API (single-page apps) - Microsoft identity platform | Azure
description: Learn how to build a single-page application (acquire a token to call an API)
services: active-directory
author: negoe
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 08/20/2019
ms.author: negoe
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a single-page application by using the Microsoft identity platform for developers.
---

# Single-page application: Acquire a token to call an API

The pattern for acquiring tokens for APIs with MSAL.js is to first attempt a silent token request by using the `acquireTokenSilent` method. When this method is called, the library first checks the cache in browser storage to see if a valid token exists and returns it. When no valid token is in the cache, it sends a silent token request to Azure Active Directory (Azure AD) from a hidden iframe. This method also allows the library to renew tokens. For more information about single sign-on session and token lifetime values in Azure AD, see [Token lifetimes](active-directory-configurable-token-lifetimes.md).

The silent token requests to Azure AD might fail for reasons like an expired Azure AD session or a password change. In that case, you can invoke one of the interactive methods (which will prompt the user) to acquire tokens:

* [Pop-up window](#acquire-a-token-with-a-pop-up-window), by using `acquireTokenPopup`
* [Redirect](#acquire-a-token-with-a-redirect), by using `acquireTokenRedirect`

## Choose between a pop-up or redirect experience

 You can't use both the pop-up and redirect methods in your application. The choice between a pop-up or redirect experience depends on your application flow:

* If you don't want users to move away from your main application page during authentication, we recommended the pop-up method. Because the authentication redirect happens in a pop-up window, the state of the main application is preserved.

* If users have browser constraints or policies where pop-ups windows are disabled, you can use the redirect method. Use the redirect method with the Internet Explorer browser, because there are [known issues with pop-up windows on Internet Explorer](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser).

You can set the API scopes that you want the access token to include when it's building the access token request. Note that all requested scopes might not be granted in the access token. That depends on the user's consent.

## Acquire a token with a pop-up window

# [JavaScript](#tab/javascript)

The following code combines the previously described pattern with the methods for a pop-up experience:

```javascript
const accessTokenRequest = {
    scopes: ["user.read"]
}

userAgentApplication.acquireTokenSilent(accessTokenRequest).then(function(accessTokenResponse) {
    // Acquire token silent success
    // Call API with token
    let accessToken = accessTokenResponse.accessToken;
}).catch(function (error) {
    //Acquire token silent failure, and send an interactive request
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

# [Angular](#tab/angular)

The MSAL Angular wrapper provides the HTTP interceptor, which will automatically acquire access tokens silently and attach them to the HTTP requests to APIs.

You can specify the scopes for APIs in the `protectedResourceMap` configuration option. `MsalInterceptor` will request these scopes when automatically acquiring tokens.

```javascript
// app.module.ts
@NgModule({
  declarations: [
    // ...
  ],
  imports: [
    // ...
    MsalModule.forRoot({
      auth: {
        clientId: 'Enter_the_Application_Id_Here',
      }
    },
    {
      popUp: !isIE,
      consentScopes: [
        'user.read',
        'openid',
        'profile',
      ],
      protectedResourceMap: [
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ]
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

For success and failure of the silent token acquisition, MSAL Angular provides callbacks that you can subscribe to. It's also important to remember to unsubscribe.

```javascript
// In app.component.ts
 ngOnInit() {
    this.subscription=  this.broadcastService.subscribe("msal:acquireTokenFailure", (payload) => {
    });
}

ngOnDestroy() {
   this.broadcastService.getMSALSubject().next(1);
   if (this.subscription) {
     this.subscription.unsubscribe();
   }
 }
```

Alternatively, you can explicitly acquire tokens by using the acquire-token methods as described in the core MSAL.js library.

---

## Acquire a token with a redirect

# [JavaScript](#tab/javascript)

The following pattern is as described earlier but shown with a redirect method to acquire tokens interactively. You'll need to register the redirect callback as mentioned earlier.

```javascript
function authCallback(error, response) {
    // Handle redirect response
}

userAgentApplication.handleRedirectCallback(authCallback);

const accessTokenRequest: AuthenticationParameters = {
    scopes: ["user.read"]
}

userAgentApplication.acquireTokenSilent(accessTokenRequest).then(function(accessTokenResponse) {
    // Acquire token silent success
    // Call API with token
    let accessToken = accessTokenResponse.accessToken;
}).catch(function (error) {
    //Acquire token silent failure, and send an interactive request
    console.log(error);
    if (error.errorMessage.indexOf("interaction_required") !== -1) {
        userAgentApplication.acquireTokenRedirect(accessTokenRequest);
    }
});
```

## Request optional claims

You can use optional claims for the following purposes:

- Include additional claims in tokens for your application.
- Change the behavior of certain claims that Azure AD returns in tokens.
- Add and access custom claims for your application.

To request optional claims in `IdToken`, you can send a stringified claims object to the `claimsRequest` field of the `AuthenticationParameters.ts` class.

```javascript
"optionalClaims":
   {
      "idToken": [
            {
                  "name": "auth_time",
                  "essential": true
             }
      ],

var request = {
    scopes: ["user.read"],
    claimsRequest: JSON.stringify(claims)
};

myMSALObj.acquireTokenPopup(request);
```

To learn more, see [Optional claims](active-directory-optional-claims.md).

# [Angular](#tab/angular)

This code is the same as described earlier.

---

## Next steps

> [!div class="nextstepaction"]
> [Calling a web API](scenario-spa-call-api.md)
