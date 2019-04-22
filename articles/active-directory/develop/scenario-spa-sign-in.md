---
title: Single Page Application - sign-in | Azure
description: Learn how to build a Single Page Application (sign-in)
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

# Single Page Application - sign-in

Learn how to add sign-in to the code for your Single Page Application.

Before you can get tokens to access APIs in your application, you will need an authenticated user context. Use the `loginRedirect` or `loginPopup` methods to login users with MSAL.js. You can also optionally pass the scopes of the APIs for which you need the user to consent at the time of login.

> [!NOTE]
> If your application already has access to an authenticated user context or id token, you can skip the login step and directly acquire tokens. See [sso without msal.js login](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Sso#sso-to-an-app-without-msaljs-login) for more details.

## Login with popup

### JavaScript

```JS
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

The MSAL Angular wrapper allows you to secure specific routes in your application by just adding the `MsalGuard` to the route definition. This will invoke the login method when that route is accessed.

```JS
// In app.routes.ts
{ path: 'product', component: ProductComponent, canActivate : [MsalGuard],
    children: [
      { path: 'detail/:id', component: ProductDetailComponent  }
    ]
   },
  { path: 'myProfile' ,component: MsGraphComponent, canActivate : [MsalGuard] },
```

For Popup experience, enable the `popUp` config option. You can also pass the scopes that require consent as follows:

```JS
//In app.module.ts
@NgModule({
  imports: [ MsalModule.forRoot({
                clientID: 'your_app_id',
                popUp: true,
                consentScopes: ["user.read", "user.write"]
            })]
         })
```

## Login with redirect

### JavaScript

The redirect methods do not return a promise  due to the navigation away from the main app. To process and access the returned tokens, you will need to register success and error callbacks before calling the redirect methods.

```JS
function tokenReceivedCallback(response) {
    // use response in callback code
}

function errorReceivedCallback(error) {
    // handle error in callback code
}

userAgentApplication.handleRedirectCallbacks(tokenReceivedCallback, errorReceivedCallback);

const loginRequest = {
    scopes: ["user.read", "user.write"]
}

userAgentApplication.loginRedirect(loginRequest);
```

### Angular

This is the same as described above under popup section. The default flow is redirect.

> [!NOTE]
> The ID token does not contain the consented scopes and only represents the authenticated user. The consented scopes are returned in the access token which you will acquire in the next step.

## Logout

The MSAL library provides a logout method that will clear the cache in the browser storage and send a logout request to Azure AD. After logout, it redirects back to the application start page by default.

You can configure the URI to which it should redirect after logout by setting the `postLogoutRedirectUri`. Note that this URI should also be registered as the Logout URI in your application registration.

### JavaScript

```JS
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

```JS
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
