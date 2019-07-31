---
title: Single-page application (sign in) - Microsoft identity platform
description: Learn how to build a single-page application (Sign in)
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
ms.date: 05/06/2019
ms.author: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a single-page application using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Single-page application - sign in

Learn how to add sign in to the code for your single-page application.

Before you can get tokens to access APIs in your application, you will need an authenticated user context. You can sign in users to your application in MSAL.js in two ways:

* [Sign in with a pop-up window](#sign-in-with-a-pop-up-window) using `loginPopup` method
* [Sign in with redirect](#sign-in-with-redirect) using `loginRedirect` method

You can also optionally pass the scopes of the APIs for which you need the user to consent at the time of sign in.

> [!NOTE]
> If your application already has access to an authenticated user context or id token, you can skip the login step and directly acquire tokens. For more details, see [sso without msal.js login](msal-js-sso.md#sso-without-msaljs-login).

## Choosing between a pop-up or redirect experience

You cannot use a combination of both the pop-up and redirect methods in your application. The choice between a pop-up or redirect experience depends on your application flow.

* If you don't want the user to navigate away from your main application page during authentication, it's recommended to use the pop-up methods. Since the authentication redirect happens in a pop-up window, the state of the main application is preserved.

* There are certain cases where you may need to use the redirect methods. If users of your application have browser constraints or policies where pop-ups windows are disabled, you can use the redirect methods. Use the redirect methods with Internet Explorer browser since there are certain [known issues with Internet Explorer](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser) when handling pop-up windows.

## Sign in with a pop-up window

### JavaScript

```javascript
const loginRequest = {
    scopes: ["user.read", "user.write"]
}

userAgentApplication.loginPopup(loginRequest).then(function (loginResponse) {
    //login success
    let idToken = loginResponse.idToken;
}).catch(function (error) {
    //login failure
    console.log(error);
});
```

### Angular

The MSAL Angular wrapper allows you to secure specific routes in your application by just adding the `MsalGuard` to the route definition. This guard will invoke the method to sign in when that route is accessed.

```javascript
// In app.routes.ts
{ path: 'product', component: ProductComponent, canActivate : [MsalGuard],
    children: [
      { path: 'detail/:id', component: ProductDetailComponent  }
    ]
   },
  { path: 'myProfile' ,component: MsGraphComponent, canActivate : [MsalGuard] },
```

For a pop-up window experience, enable the `popUp` config option. You can also pass the scopes that require consent as follows:

```javascript
//In app.module.ts
@NgModule({
  imports: [ MsalModule.forRoot({
                clientID: 'your_app_id',
                popUp: true,
                consentScopes: ["user.read", "user.write"]
            })]
         })
```

## Sign in with redirect

### JavaScript

The redirect methods do not return a promise due to the navigation away from the main app. To process and access the returned tokens, you will need to register success and error callbacks before calling the redirect methods.

```javascript
function authCallback(error, response) {
    //handle redirect response
}

userAgentApplication.handleRedirectCallback(authCallback);

const loginRequest = {
    scopes: ["user.read", "user.write"]
}

userAgentApplication.loginRedirect(loginRequest);
```

### Angular

The code here is the same as described above under the sign in with a pop-up window section. The default flow is redirect.

> [!NOTE]
> The ID token doesn't contain the consented scopes and only represents the authenticated user. The consented scopes are returned in the access token which you will acquire in the next step.

## Sign out

The MSAL library provides a `logout` method that will clear the cache in the browser storage and sends a sign out request to Azure AD. After sign out, it redirects back to the application start page by default.

You can configure the URI to which it should redirect after sign out by setting the `postLogoutRedirectUri`. This URI should also be registered as the Logout URI in your application registration.

### JavaScript

```javascript
const config = {

    auth: {
        clientID: 'your_app_id',
        redirectUri: "your_app_redirect_uri", //defaults to application start page
        postLogoutRedirectUri: "your_app_logout_redirect_uri"
    }
}

const userAgentApplication = new UserAgentApplication(config);
userAgentApplication.logout();

```

### Angular

```javascript
//In app.module.ts
@NgModule({
  imports: [ MsalModule.forRoot({
                clientID: 'your_app_id',
                postLogoutRedirectUri: "your_app_logout_redirect_uri"
            })]
         })

// In app.component.ts
this.authService.logout();
```

## Next steps

> [!div class="nextstepaction"]
> [Acquiring a token for the app](scenario-spa-acquire-token.md)
