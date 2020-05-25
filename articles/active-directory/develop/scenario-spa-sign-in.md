---
title: Single-page app sign-in & sign-out - Microsoft identity platform | Azure
description: Learn how to build a single-page application (sign-in)
services: active-directory
author: navyasric
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 02/11/2020
ms.author: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a single-page application by using the Microsoft identity platform for developers.
---

# Single-page application: Sign-in and Sign-out

Learn how to add sign-in to the code for your single-page application.

Before you can get tokens to access APIs in your application, you need an authenticated user context. You can sign in users to your application in MSAL.js in two ways:

* [Pop-up window](#sign-in-with-a-pop-up-window), by using the `loginPopup` method
* [Redirect](#sign-in-with-redirect), by using the `loginRedirect` method

You can also optionally pass the scopes of the APIs for which you need the user to consent at the time of sign-in.

> [!NOTE]
> If your application already has access to an authenticated user context or ID token, you can skip the login step and directly acquire tokens. For details, see [SSO without MSAL.js login](msal-js-sso.md#sso-without-msaljs-login).

## Choosing between a pop-up or redirect experience

You can't use both the pop-up and redirect methods in your application. The choice between a pop-up or redirect experience depends on your application flow:

* If you don't want users to move away from your main application page during authentication, we recommend the pop-up method. Because the authentication redirect happens in a pop-up window, the state of the main application is preserved.

* If users have browser constraints or policies where pop-up windows are disabled, you can use the redirect method. Use the redirect method with the Internet Explorer browser, because there are [known issues with pop-up windows on Internet Explorer](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser).

## Sign-in with a pop-up window

# [JavaScript](#tab/javascript)

```javascript

const config = {
    auth: {
        clientId: 'your_app_id',
        redirectUri: "your_app_redirect_uri", //defaults to application start page
        postLogoutRedirectUri: "your_app_logout_redirect_uri"
    }
}

const loginRequest = {
    scopes: ["User.ReadWrite"]
}

const myMsal = new userAgentApplication(config);

myMsal.loginPopup(loginRequest)
    .then(function (loginResponse) {
        //login success
        let idToken = loginResponse.idToken;
    }).catch(function (error) {
        //login failure
        console.log(error);
    });
```

# [Angular](#tab/angular)

The MSAL Angular wrapper allows you to secure specific routes in your application by adding `MsalGuard` to the route definition. This guard will invoke the method to sign in when that route is accessed.

```javascript
// In app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [
      MsalGuard
    ]
  },
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

For a pop-up window experience, enable the `popUp` configuration option. You can also pass the scopes that require consent as follows:

```javascript
// In app.module.ts
@NgModule({
    imports: [
        MsalModule.forRoot({
            auth: {
                clientId: 'your_app_id',
            }
        }, {
            popUp: true,
            consentScopes: ["User.ReadWrite"]
        })
    ]
})
```
---

## Sign-in with redirect

# [JavaScript](#tab/javascript)

The redirect methods don't return a promise because of the move away from the main app. To process and access the returned tokens, you need to register success and error callbacks before you call the redirect methods.

```javascript

const config = {
    auth: {
        clientId: 'your_app_id',
        redirectUri: "your_app_redirect_uri", //defaults to application start page
        postLogoutRedirectUri: "your_app_logout_redirect_uri"
    }
}

const loginRequest = {
    scopes: ["User.ReadWrite"]
}

const myMsal = new userAgentApplication(config);

function authCallback(error, response) {
    //handle redirect response
}

myMsal.handleRedirectCallback(authCallback);

myMsal.loginRedirect(loginRequest);
```

# [Angular](#tab/angular)

The code here is the same as described earlier in the section about sign-in with a pop-up window. The default flow is redirect.

> [!NOTE]
> The ID token doesn't contain the consented scopes and only represents the authenticated user. The consented scopes are returned in the access token, which you'll acquire in the next step.

---

## Sign-out

The MSAL library provides a `logout` method that clears the cache in browser storage and sends a sign-out request to Azure Active Directory (Azure AD). After sign-out, the library redirects back to the application start page by default.

You can configure the URI to which it should redirect after sign-out by setting `postLogoutRedirectUri`. This URI should also be registered as the logout URI in your application registration.

# [JavaScript](#tab/javascript)

```javascript
const config = {
    auth: {
        clientId: 'your_app_id',
        redirectUri: "your_app_redirect_uri", //defaults to application start page
        postLogoutRedirectUri: "your_app_logout_redirect_uri"
    }
}

const myMsal = new UserAgentApplication(config);

myMsal.logout();
```

# [Angular](#tab/angular)

```javascript
//In app.module.ts
@NgModule({
    imports: [
        MsalModule.forRoot({
            auth: {
                clientId: 'your_app_id',
                postLogoutRedirectUri: "your_app_logout_redirect_uri"
            }
        })
    ]
})

// In app.component.ts
this.authService.logout();
```

---

## Next steps

> [!div class="nextstepaction"]
> [Acquiring a token for the app](scenario-spa-acquire-token.md)
