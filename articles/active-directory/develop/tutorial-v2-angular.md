---
title: Angular single-page app tutorial - Azure
titleSuffix: Microsoft identity platform
description: Learn how Angular SPA applications can call an API that requires access tokens from the Microsoft identity platform endpoint.
services: active-directory
author: hahamil
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: tutorial
ms.workload: identity
ms.date: 03/05/2020
ms.author: hahamil
ms.custom: aaddev, identityplatformtop40
---

# Tutorial: Sign in users and call the Microsoft Graph API from an Angular single-page application

This tutorial demonstrates how an Angular single-page application (SPA) can:
- Sign in personal accounts, work accounts, or school accounts.
- Acquire an access token.
- Call the Microsoft Graph API or other APIs that require access tokens from the *Microsoft identity platform endpoint*.

>[!NOTE]
>This tutorial walks you through how to create a new Angular SPA by using Microsoft Authentication Library (MSAL). If you want to download a sample app, see the [quickstart](quickstart-v2-angular.md).

## How the sample app works

![Diagram that shows how the sample app generated in this tutorial works](media/active-directory-develop-guidedsetup-javascriptspa-introduction/javascriptspa-intro.svg)

### More information

The sample application created in this tutorial enables an Angular SPA to query the Microsoft Graph API or a web API that accepts tokens from the Microsoft identity platform endpoint. The MSAL for Angular library is a wrapper of the core MSAL.js library. It enables Angular (6+) applications to authenticate enterprise users by using Microsoft Azure Active Directory, Microsoft account users, and social identity users (such as Facebook, Google, and LinkedIn). The library also enables the applications to get access to Microsoft cloud services or Microsoft Graph.

In this scenario, after a user signs in, an access token is requested and added to HTTP requests through the authorization header. Token acquisition and renewal are handled by MSAL.

### Libraries

This tutorial uses the following library:

|Library|Description|
|---|---|
|[msal.js](https://github.com/AzureAD/microsoft-authentication-library-for-js)|Microsoft Authentication Library for JavaScript Angular Wrapper|

You can find the source code for the MSAL.js library in the [AzureAD/microsoft-authentication-library-for-js](https://github.com/AzureAD/microsoft-authentication-library-for-js) repository on GitHub.

## Prerequisites

To run this tutorial, you need:

* A local web server, such as [Node.js](https://nodejs.org/en/download/). Instructions in this tutorial are based on Node.js.
* An integrated development environment (IDE), such as [Visual Studio Code](https://code.visualstudio.com/download), to edit the project files.

## Create your project

Generate a new Angular application by using the following npm commands:

```Bash
npm install -g @angular/cli@8                    # Install the Angular CLI
npm install @angular/material@8 @angular/cdk@8   # Install the Angular Material component library (optional, for UI)
ng new my-application --routing=true --style=css # Generate a new Angular app
npm install msal @azure/msal-angular             # Install MSAL and MSAL Angular in your application
ng generate component page-name                  # To add a new page (such as a home or profile page)
```

## Register your application

Follow the [instructions to register a single-page application](https://docs.microsoft.com/azure/active-directory/develop/scenario-spa-app-registration) in the Azure portal.

On the app **Overview** page of your registration, note the **Application (client) ID** value for later use.

Register your **Redirect URI** value as **http://localhost:4200/** and enable implicit grant settings.

## Configure the application

1. In the *src/app* folder, edit *app.module.ts* and add `MSALModule` to `imports` as well as the `isIE` constant:

    ```javascript
    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
    @NgModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        MsalModule.forRoot({
          auth: {
            clientId: 'Enter_the_Application_Id_here', // This is your client ID
            authority: 'Enter_the_Cloud_Instance_Id_Here'/'Enter_the_Tenant_Info_Here', // This is your tenant ID
            redirectUri: 'Enter_the_Redirect_Uri_Here'// This is your redirect URI
          },
          cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
          },
        }, {
          popUp: !isIE,
          consentScopes: [
            'user.read',
            'openid',
            'profile',
          ],
          unprotectedResources: [],
          protectedResourceMap: [
            ['https://graph.microsoft.com/v1.0/me', ['user.read']]
          ],
          extraQueryParameters: {}
        })
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    ```

    Replace these values:

    |Value name|About|
    |---------|---------|
    |Enter_the_Application_Id_Here|On the **Overview** page of your application registration, this is your **Application (client) ID** value. |
    |Enter_the_Cloud_Instance_Id_Here|This is the instance of the Azure cloud. For the main or global Azure cloud, enter **https://login.microsoftonline.com**. For national clouds (for example, China), see [National clouds](https://docs.microsoft.com/azure/active-directory/develop/authentication-national-cloud).|
    |Enter_the_Tenant_Info_Here| Set to one of the following options: If your application supports *accounts in this organizational directory*, replace this value with the directory (tenant) ID or tenant name (for example, **contoso.microsoft.com**). If your application supports *accounts in any organizational directory*, replace this value with **organizations**. If your application supports *accounts in any organizational directory and personal Microsoft accounts*, replace this value with **common**. To restrict support to *personal Microsoft accounts only*, replace this value with **consumers**. |
    |Enter_the_Redirect_Uri_Here|Replace with **http://localhost:4200**.|

    For more information about available configurable options, see [Initialize client applications](msal-js-initializing-client-applications.md).

2. At the top of the same file, add the following import statement:

    ```javascript
    import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
    ```

3. Add the following import statements to the top of `src/app/app.component.ts`:

    ```javascript
    import { MsalService } from '@azure/msal-angular';
    import { Component, OnInit } from '@angular/core';
    ```
## Sign in a user

Add the following code to `AppComponent` to sign in a user:

```javascript
export class AppComponent implements OnInit {
    constructor(private broadcastService: BroadcastService, private authService: MsalService) { }

    login() {
        const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

        if (isIE) {
          this.authService.loginRedirect({
            extraScopesToConsent: ["user.read", "openid", "profile"]
          });
        } else {
          this.authService.loginPopup({
            extraScopesToConsent: ["user.read", "openid", "profile"]
          });
        }
    }
}
```

> [!TIP]
> We recommend using `loginRedirect` for Internet Explorer users.

## Acquire a token

### Angular Interceptor

MSAL Angular provides an `Interceptor` class that automatically acquires tokens for outgoing requests that use the Angular `http` client to known protected resources.

First, include the `Interceptor` class as a provider to your application:

```javascript
import { MsalInterceptor, MsalModule } from "@azure/msal-angular";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

@NgModule({
    // ...
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true
        }
    ]
}
```

Next, provide a map of protected resources to `MsalModule.forRoot()` as `protectedResourceMap` and include those scopes in `consentScopes`:

```javascript
@NgModule({
  // ...
  imports: [
    // ...
    MsalModule.forRoot({
      auth: {
        clientId: 'Enter_the_Application_Id_here', // This is your client ID
        authority: 'https://login.microsoftonline.com/Enter_the_Tenant_Info_Here', // This is your tenant info
        redirectUri: 'Enter_the_Redirect_Uri_Here' // This is your redirect URI
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      },
    },
    {
      popUp: !isIE,
      consentScopes: [
        'user.read',
        'openid',
        'profile',
      ],
      unprotectedResources: [],
      protectedResourceMap: [
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ],
      extraQueryParameters: {}
    })
  ],
});
```

Finally, retrieve a user's profile with an HTTP request:

```JavaScript
const graphMeEndpoint = "https://graph.microsoft.com/v1.0/me";

getProfile() {
  this.http.get(graphMeEndpoint).toPromise()
    .then(profile => {
      this.profile = profile;
    });
}
```

### acquireTokenSilent, acquireTokenPopup, acquireTokenRedirect
MSAL uses three methods to acquire tokens: `acquireTokenRedirect`, `acquireTokenPopup`, and `acquireTokenSilent`. However, we recommend using the `MsalInterceptor` class instead for Angular apps, as shown in the previous section.

#### Get a user token silently

The `acquireTokenSilent` method handles token acquisitions and renewal without user interaction. After the `loginRedirect` or `loginPopup` method is executed for the first time, `acquireTokenSilent` is commonly used to obtain tokens used to access protected resources in later calls. Calls to request or renew tokens are made silently.

```javascript
const requestObj = {
    scopes: ["user.read"]
};

this.authService.acquireTokenSilent(requestObj).then(function (tokenResponse) {
    // Callback code here
    console.log(tokenResponse.accessToken);
}).catch(function (error) {
    console.log(error);
});
```

In that code, `scopes` contains scopes being requested to be returned in the access token for the API.

For example:

* `["user.read"]` for Microsoft Graph
* `["<Application ID URL>/scope"]` for custom web APIs (that is, `api://<Application ID>/access_as_user`)

#### Get a user token interactively

Sometimes you need the user to interact with the Microsoft identity platform endpoint. For example:

* Users might need to reenter their credentials because their password has expired.
* Your application is requesting access to additional resource scopes that the user needs to consent to.
* Two-factor authentication is required.

The recommended pattern for most applications is to call `acquireTokenSilent` first, then catch the exception, and then call `acquireTokenPopup` (or `acquireTokenRedirect`) to start an interactive request.

Calling `acquireTokenPopup` results in a pop-up sign-in window. Alternatively, `acquireTokenRedirect` redirects users to the Microsoft identity platform endpoint. In that window, users need to confirm their credentials, give consent to the required resource, or complete two-factor authentication.

```javascript
  const requestObj = {
      scopes: ["user.read"]
  };

  this.authService.acquireTokenPopup(requestObj).then(function (tokenResponse) {
      // Callback code here
      console.log(tokenResponse.accessToken);
  }).catch(function (error) {
      console.log(error);
  });
```

> [!NOTE]
> This quickstart uses the `loginRedirect` and `acquireTokenRedirect` methods with Microsoft Internet Explorer because of a [known issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser#issues) related to the handling of pop-up windows by Internet Explorer.

## Log out

Add the following code to log out a user:

```javascript
logout() {
  this.authService.logout();
}
```

## Add UI
For an example of how to add UI by using the Angular Material component library, see the [sample application](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-angular).

## Test your code

1.  Start the web server to listen to the port by running the following commands at a command-line prompt from the application folder:

    ```bash
    npm install
    npm start
    ```
1. In your browser, enter **http://localhost:4200** or **http://localhost:{port}**, where *port* is the port that your web server is listening on.


### Provide consent for application access

The first time that you start to sign in to your application, you're prompted to grant it access to your profile and allow it to sign you in:

![The "Permissions requested" window](media/active-directory-develop-guidedsetup-javascriptspa-test/javascriptspaconsent.png)

## Add scopes and delegated permissions

The Microsoft Graph API requires the *user.read* scope to read a user's profile. By default, this scope is automatically added in every application that's registered on the registration portal. Other APIs for Microsoft Graph, as well as custom APIs for your back-end server, might require additional scopes. For example, the Microsoft Graph API requires the *Calendars.Read* scope in order to list the user's calendars.

To access the user's calendars in the context of an application, add the *Calendars.Read* delegated permission to the application registration information. Then, add the *Calendars.Read* scope to the `acquireTokenSilent` call.

>[!NOTE]
>The user might be prompted for additional consents as you increase the number of scopes.

If a back-end API doesn't require a scope (not recommended), you can use *clientId* as the scope in the calls to acquire tokens.

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

## Next steps

If you're new to identity and access management, we have several articles to help you learn modern authentication concepts, starting with [authentication vs. authorization](authentication-vs-authorization.md).

If you'd like to dive deeper into single-page application development on the Microsoft identity platform, the multi-part [Scenario: Single-page application](scenario-spa-overview.md) series of articles can help you get started.
