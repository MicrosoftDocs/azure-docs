---
title: Build an Azure AD AngularJS single-page app for sign in/sign out | Microsoft Docs
description: Learn how to build an AngularJS single-page app that integrates Azure AD for sign-in & sign-out & calls Azure AD-protected APIs using OAuth.
services: active-directory
author: rwike77
manager: CelesteDG

ms.assetid: f2991054-8146-4718-a5f7-59b892230ad7
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.devlang: javascript
ms.topic: quickstart
ms.date: 10/25/2019
ms.author: ryanwi
ms.reviewer: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to build an AngularJS single-page app for sign-in and sign out with Azure Active Directory.
---

# Quickstart: Build an AngularJS single-page app for sign-in and sign out with Azure Active Directory

[!INCLUDE [active-directory-develop-applies-v1-adal](../../../includes/active-directory-develop-applies-v1-adal.md)]

> [!IMPORTANT]
> [Microsoft identity platform](v2-overview.md) is an evolution of the Azure Active Directory (Azure AD) developer platform. It allows developers to build applications that sign in all Microsoft identities and get tokens to call Microsoft APIs such as Microsoft Graph or APIs that developers have built.
> If you need to enable sign-in for personal accounts in addition to work and school accounts, you can use the *[Microsoft identity platform endpoint](azure-ad-endpoint-comparison.md)*.
> This quickstart is for the older, Azure AD v1.0 endpoint. We recommend that you use the v2.0 endpoint for new projects. For more info, see [this JavaScript SPA tutorial](tutorial-v2-javascript-spa.md) as well as [this article](active-directory-v2-limitations.md) explaining the *Microsoft identity platform endpoint*.

Azure Active Directory (Azure AD) makes it simple and straightforward for you to add sign-in, sign-out, and secure OAuth API calls to your single-page apps. It enables your apps to authenticate users with their Windows Server Active Directory accounts and consume any web API that Azure AD helps protect, such as the Office 365 APIs or the Azure API.

For JavaScript applications running in a browser, Azure AD provides the Active Directory Authentication Library (ADAL), or adal.js. The sole purpose of adal.js is to make it easy for your app to get access tokens.

In this quickstart, you'll learn how to build an AngularJS To Do List application that:

* Signs the user in to the app by using Azure AD as the identity provider.
* Displays some information about the user.
* Securely calls the app's To Do List API by using bearer tokens from Azure AD.
* Signs the user out of the app.

To build the complete, working application, you'll need to:

1. Register your app with Azure AD.
2. Install ADAL and configure the single-page app.
3. Use ADAL to help secure pages in the single-page app.

## Prerequisites

To get started, complete these prerequisites:

* [Download the app skeleton](https://github.com/AzureADQuickStarts/SinglePageApp-AngularJS-DotNet/archive/skeleton.zip) or [download the completed sample](https://github.com/AzureADQuickStarts/SinglePageApp-AngularJS-DotNet/archive/complete.zip).
* Have an Azure AD tenant in which you can create users and register an application. If you don't already have a tenant, [learn how to get one](quickstart-create-new-tenant.md).

## Step 1: Register the DirectorySearcher application

To enable your app to authenticate users and get tokens, you first need to register it in your Azure AD tenant:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you are signed in to multiple directories, you may need to ensure you are viewing the correct directory. To do so, on the top bar, click your account. Under the **Directory** list, choose the Azure AD tenant where you want to register your application.
1. Click **All services** in the left pane, and then select **Azure Active Directory**.
1. Click **App registrations**, and then select **New registration**.
1. When the **Register an application** page appears, enter a name for your application.
1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
1. Select the **Web** platform under the **Redirect URI** section and set the value to `https://localhost:44326/` (the location to which Azure AD will return tokens).
1. When finished, select **Register**. On the app **Overview** page, note down the **Application (client) ID** value.
1. Adal.js uses the OAuth implicit flow to communicate with Azure AD. You must enable the implicit flow for your application. In the left-hand navigation pane of the registered application, select **Authentication**.
1. In **Advanced settings**, under **Implicit grant**, enable both **ID tokens** and **Access tokens** checkboxes. ID tokens and access tokens are required since this app needs to sign in users and call an API.
1. Select **Save**.
1. Grant permissions across your tenant for your application. Go to **API permissions**, and select the **Grant admin consent** button under **Grant consent**.
1. Select **Yes** to confirm.

## Step 2: Install ADAL and configure the single-page app

Now that you have an application in Azure AD, you can install adal.js and write your identity-related code.

### Configure the JavaScript client

Begin by adding adal.js to the TodoSPA project by using the Package Manager Console:

1. Download [adal.js](https://raw.githubusercontent.com/AzureAD/azure-activedirectory-library-for-js/master/lib/adal.js) and add it to the `App/Scripts/` project directory.
2. Download [adal-angular.js](https://raw.githubusercontent.com/AzureAD/azure-activedirectory-library-for-js/master/lib/adal-angular.js) and add it to the `App/Scripts/` project directory.
3. Load each script before the end of the `</body>` in `index.html`:

    ```js
    ...
    <script src="App/Scripts/adal.js"></script>
    <script src="App/Scripts/adal-angular.js"></script>
    ...
    ```

### Configure the back end server

For the single-page app's back-end To Do List API to accept tokens from the browser, the back end needs configuration information about the app registration. In the TodoSPA project, open `web.config`. Replace the values of the elements in the `<appSettings>` section to reflect the values that you used in the Azure portal. Your code will reference these values whenever it uses ADAL.

   * `ida:Tenant` is the domain of your Azure AD tenant--for example, contoso.onmicrosoft.com.
   * `ida:Audience` is the client ID of your application that you copied from the portal.

## Step 3: Use ADAL to help secure pages in the single-page app

Adal.js integrates with AngularJS route and HTTP providers, so you can help secure individual views in your single-page app.

1. In `App/Scripts/app.js`, bring in the adal.js module:

    ```js
    angular.module('todoApp', ['ngRoute','AdalAngular'])
    .config(['$routeProvider','$httpProvider', 'adalAuthenticationServiceProvider',
     function ($routeProvider, $httpProvider, adalProvider) {
    ...
    ```
2. Initialize `adalProvider` by using the configuration values of your application registration, also in `App/Scripts/app.js`:

    ```js
    adalProvider.init(
      {
          instance: 'https://login.microsoftonline.com/',
          tenant: 'Enter your tenant name here e.g. contoso.onmicrosoft.com',
          clientId: 'Enter your client ID here e.g. e9a5a8b6-8af7-4719-9821-0deef255f68e',
          extraQueryParameter: 'nux=1',
          //cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
      },
      $httpProvider
    );
    ```
3. Help secure the `TodoList` view in the app by using only one line of code: `requireADLogin`.

    ```js
    ...
    }).when("/TodoList", {
            controller: "todoListCtrl",
            templateUrl: "/App/Views/TodoList.html",
            requireADLogin: true,
    ...
    ```

## Summary

You now have a secure single-page app that can sign in users and issue bearer-token-protected requests to its back-end API. When a user clicks the **TodoList** link, adal.js will automatically redirect to Azure AD for sign-in if necessary. In addition, adal.js will automatically attach an access token to any Ajax requests that are sent to the app's back end.

The preceding steps are the bare minimum necessary to build a single-page app by using adal.js. But a few other features are useful in single-page app:

* To explicitly issue sign-in and sign-out requests, you can define functions in your controllers that invoke adal.js. In `App/Scripts/homeCtrl.js`:

    ```js
    ...
    $scope.login = function () {
        adalService.login();
    };
    $scope.logout = function () {
        adalService.logOut();
    };
    ...
    ```
* You might want to present user information in the app's UI. The ADAL service has already been added to the `userDataCtrl` controller, so you can access the `userInfo` object in the associated view, `App/Views/UserData.html`:

    ```js
    <p>{{userInfo.userName}}</p>
    <p>aud:{{userInfo.profile.aud}}</p>
    <p>iss:{{userInfo.profile.iss}}</p>
    ...
    ```

* There are many scenarios in which you'll want to know if the user is signed in or not. You can also use the `userInfo` object to gather this information. For instance, in `index.html`, you can show either the **Login** or **Logout** button based on authentication status:

    ```js
    <li><a class="btn btn-link" ng-show="userInfo.isAuthenticated" ng-click="logout()">Logout</a></li>
    <li><a class="btn btn-link" ng-hide=" userInfo.isAuthenticated" ng-click="login()">Login</a></li>
    ```

Your Azure AD-integrated single-page app can authenticate users, securely call its back end by using OAuth 2.0, and get basic information about the user. If you haven't already, now is the time to populate your tenant with some users. Run your To Do List single-page app, and sign in with one of those users. Add tasks to the user's to-do list, sign out, and sign back in.

Adal.js makes it easy to incorporate common identity features into your application. It takes care of all the dirty work for you: cache management, OAuth protocol support, presenting the user with a sign-in UI, refreshing expired tokens, and more.

For reference, the completed sample (without your configuration values) is available in [GitHub](https://github.com/AzureADQuickStarts/SinglePageApp-AngularJS-DotNet/archive/complete.zip).

## Next steps

You can now move on to additional scenarios.

> [!div class="nextstepaction"]
> [Call a CORS web API from a single-page app](https://github.com/AzureAdSamples/SinglePageApp-WebAPI-AngularJS-DotNet).
