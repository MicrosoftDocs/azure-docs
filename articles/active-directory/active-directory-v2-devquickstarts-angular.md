<properties
	pageTitle="Azure AD AngularJS Getting Started | Microsoft Azure"
	description="How to build a Angular JS Single Page app that signs in users with both personal Microsoft accounts and work or school accounts."
	services="active-directory"
	documentationCenter=""
	authors="dstrockis"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="javascript"
	ms.topic="article"
	ms.date="09/11/2015"
	ms.author="dastrock"/>


# App model v2.0 preview: Add sign-in to an AngularJS single page app

The quick-start tutorial for AngularJS apps isn't quite ready... Check back soon & look for updates from @AzureAD on Twitter.

> [AZURE.NOTE]
	This information applies to the v2.0 app model public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

<!-- TOOD:

Microsoft Identity makes it simple and straightforward for you to add sign-in, sign out, and secure OAuth API calls to your single page apps.  It enables your app to authenticate users with their MSA or Azure AD/Office 365 accounts and consume any web API protected by Azure AD, such as the Office 365 APIs or the Azure API.

For javascript apps running in a browser, you can use the Active Directory Authentication Library, or adal.js.  To demonstrate, we'll build an AngularJS To Do List app that uses adal.js to:

- Sign the user into the app using Microsoft Identity.
- Display some information about the user.
- Securely call the app's backend using OAuth Bearer tokens from AAD.
- Sign the user out of the app.

To build the complete working app, you'll need to:

2. Register a Microsoft App.
3. Install ADAL & Configure the SPA.
5. Use ADAL to secure pages in the SPA.

To get started, you'll need to download & install [node.js](https://nodejs.org).  Then you can [download the app skeleton](https://github.com/AzureADQuickStarts/SinglePageApp-AngularJS-NodeJS/archive/skeleton.zip)

``` git clone --branch skeleton https://github.com/AzureADSamples/SinglePageApp-AngularJS-DotNet.git```

or [download the completed sample](https://github.com/AzureADQuickStarts/SinglePageApp-AngularJS-DotNet/archive/complete.zip).

``` git clone https://github.com/AzureADSamples/SinglePageApp-AngularJS-NodeJS.git```

## *1. Register a Microsoft App*
Create a new app in the [App Registration Portal](https://apps.dev.microsoft.com), or follow these [detailed steps]().  Make sure to:
- Add the **web** platform for your app.
- Enter the correct **Redirect URI**. The default for this sample is `https://localhost:44322`.
- Enable the [**Allow Implicit Flow**]() checkbox for the web platform.  

## *2. Install ADAL & Configure the SPA*
Now that you have an app created, you can install adal.js and write your identity-related code.  Begin by adding adal.js to the TodoSPA project:

- With bower:
``` bower install adal-angular```
- Or manually:
  - Download [adal.js](https://raw.githubusercontent.com/AzureAD/azure-activedirectory-library-for-js/master/dist/adal.min.js) and add it to the `App/bower_components/` project directory.
  - Download [adal-angular.js](https://raw.githubusercontent.com/AzureAD/azure-activedirectory-library-for-js/master/dist/adal-angular.min.js) and add it to the `App/bower_components/` project directory.
  - Load each script before the the `</body>` tag in `index.html`:
```js
...
<script src="App/bower_components/dist/adal.min.js"></script>
<script src="App/bower_components/dist/adal-angular.min.js"></script>
...
```
-	For the SPA's backend API to accept tokens sent in AJAX requests, the backend needs some information about the app registration. Open `config.js`.  Replace the value of the `appId` with the **App ID** of your app.

## *3.	Use ADAL to secure pages in the SPA*
Adal.js has been built to integrate with AngularJS route and http providers, which enables you to secure individual views in your SPA.

- In `App/Scripts/app.js`, bring in the adal.js module:

```js
angular.module('todoApp', ['ngRoute','AdalAngular'])
.config(['$routeProvider','$httpProvider', 'adalAuthenticationServiceProvider',
 function ($routeProvider, $httpProvider, adalProvider) {
...
```
- You can now initialize the `adalProvider` with the configuration values of your app registration, also in `App/Scripts/app.js`:

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
- Now to secure the `TodoList` view in the app, only one line of code is necessary - `requireADLogin`.

```js
...
}).when("/TodoList", {
        controller: "todoListCtrl",
        templateUrl: "/App/Views/TodoList.html",
        requireADLogin: true,
...
```

You now have a secure single page app with the ability to sign users in and issue Bearer token protected requests to its backend API.  When a user clicks the `TodoList` link, adal.js will automatically redirect to Azure AD for sign-in if necessary.  In addition, adal.js will automatically attach an access_token to any ajax requests that are sent to the app's backend.  The above is the bare minimum necessary to build a SPA with adal.js - but there are a number of other features that are useful in SPAs:

- To explicitly issue sign-in and sign-out requests you can define functions in your controllers that invoke adal.js.  In `App/Scripts/homeCtrl.js`:

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
- You might also want to present user information in the app's UI.  The adal service has already been added to the `userDataCtrl` controller, so you can access the `userInfo` object in the associated view, `App/Scripts/UserData.html`:

```js
<p>{{userInfo.userName}}</p>
<p>aud:{{userInfo.profile.aud}}</p>
<p>iss:{{userInfo.profile.iss}}</p>
...
```

- There are also many scenarios in which you will want to know if the user is signed in or not.  You can also use the `userInfo` object to gather this information.  For instance, in `index.html` you can show either the "Login" or "Logout" button based on authentication status:

```js
<li><a class="btn btn-link" ng-show="userInfo.isAuthenticated" ng-click="logout()">Logout</a></li>
<li><a class="btn btn-link" ng-hide=" userInfo.isAuthenticated" ng-click="login()">Login</a></li>
```

Congratulations! Your Azure AD integrated Single Page App is now complete.  It can authenticate users, securely call its backend using OAuth 2.0, and get basic information about the user.  If you haven't already, now is the time to populate your tenant with some users.  Run your To Do List SPA, and sign-in with one of those users.  Add tasks to the users to do list, sign out, and sign back in.

Adal.js makes it easy to incorporate all of these common identity features into your app.  It takes care of all the dirty work for you - cache management, OAuth protocol support, presenting the user with a login UI, refreshing expired tokens, and more.

For reference, the completed sample (without your configuration values) is provided [here](https://github.com/AzureADQuickStarts/SinglePageApp-AngularJS-DotNet/archive/complete.zip).  You can now move on to additional scenarios.  You may want to try:

[Call a CORS Web API from a SPA >>](https://github.com/AzureAdSamples/SinglePageApp-WebAPI-AngularJS-DotNet)

For additional resources, check out:
- [AzureADSamples on GitHub >>](https://github.com/AzureAdSamples)
- [CloudIdentity.com >>](https://cloudidentity.com)
- Azure AD documentation on [Azure.com >>](http://azure.microsoft.com/documentation/services/active-directory/)

-->
