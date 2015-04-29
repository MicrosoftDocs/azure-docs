<properties
	pageTitle="Azure AD AngularJS Getting Started | Microsoft Azure"
	description="How to build a Angular JS Single Page application that integrates with Azure AD for sign in and calls Azure AD protected APIs using OAuth."
	services="active-directory"
	documentationCenter=""
	authors="dstrockis"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="javascript"
	ms.topic="article"
	ms.date="04/28/2015"
	ms.author="dastrock"/>


# Securing AngularJS Single Page Apps with Azure AD
Azure AD makes it simple and straightforward for you to add sign in, sign out, and secure OAuth API calls to your single page apps.  It enables your app to authenticate users with their Active Directory accounts and consume any web API protected by Azure AD, such as the Office 365 APIs or the Azure API.

For javascript applications running in a browser, Azure AD provides the Active Directory Authentication Library, or adal.js.  Adal.js's sole purpose in life is to make it easy for your app to get access tokens.  To demonstrate just how easy it is, here we'll build an AngularJS To Do List application that:

- Signs the user into the app using Azure AD as the identity provider.
- Displays some information about the user.
- Securely calls the app's To Do List API using Bearer tokens from AAD.
- Signs the user out of the app.

To build the complete working application, you?ll need to:

2. Register your application with Azure AD.
3. Install ADAL & Configure the SPA.
5. Use ADAL to secure pages in the SPA.

To get started, [download the app skeleton](https://github.com/AzureADQuickStarts/SinglePageApp-AngularJS-DotNet/archive/skeleton.zip) or [download the completed sample](https://github.com/AzureADQuickStarts/SinglePageApp-AngularJS-DotNet/archive/complete.zip).  You'll also need an Azure AD tenant in which you can create users and register an application.  If you don't already have a tenant, [learn how to get one](active-directory-howto-tenant.md).

## *1. Register the DirectorySearcher Application*
To enable your app to authenticate users and get tokens, you'll first need to register it in your Azure AD tenant:

-	Sign into the [Azure Management Portal](https://manage.windowsazure.com)
-	In the left hand nav, click on **Active Directory**
-	Select a tenant in which to register the application.
-	Click the **Applications** tab, and click **Add** in the bottom drawer.
-	Follow the prompts and create a new **Web Application and/or WebAPI**.
    -	The **Name** of the application will describe your application to end-users.
    -	The **Redirect Uri** is location to which AAD will return tokens.  The default location for this sample is `https://localhost:44326/`
-	Once you've completed registration, AAD will assign your app a unique **Client ID**.  You'll need this value in the next sections, so copy it from the **Configure** tab.
- Adal.js uses the OAuth implicit flow to communicate with Azure AD.  You must enable the implicit flow for your application by:
    - Download the application manifest by clicking **Manage Manifest**.
    - Open the manifest and locate the `oauth2AllowImplicitFlow` property. Set its value to `true`.
    - Save & upload the application manifest by clicking **Manage Manifest** once again.

## *2. Install ADAL & Configure the SPA*
Now that you have an application in Azure AD, you can install adal.js and write your identity-related code.

-	Begin by adding adal.js to the TodoSPA project using the Package Manager Console:
  - Download [adal.js](https://raw.githubusercontent.com/AzureAD/azure-activedirectory-library-for-js/master/lib/adal.js) and add it to the `App/Scripts/` project directory.
  - Download [adal-angular.js](https://raw.githubusercontent.com/AzureAD/azure-activedirectory-library-for-js/master/lib/adal-angular.js) and add it to the `App/Scripts/` project directory.
  - Load each script before the end of the `</body>` in `index.html`:

```js
...
<script src="App/Scripts/adal.js"></script>
<script src="App/Scripts/adal-angular.js"></script>
...
```

-	For the SPA's backend To Do List API to accept tokens from the browser, the backend needs configuration information about the app registration. In the TodoSPA project, open `web.config`.  Replace the values of the elements in the `<appSettings>` section to reflect the values you input into the Azure Portal.  Your code will reference these values whenever it uses ADAL.
    -	The `ida:Tenant` is the domain of your Azure AD tenant, e.g. contoso.onmicrosoft.com
    -	The `ida:Audience` must be the **Client ID** of your application you copied from the portal.

## *3.	Use ADAL to secure pages in the SPA*
Adal.js has been built to integrate with AngularJS route and http providers, which enables you to secure individual views in your SPA.

- In `App/Scripts/app.js`, bring in the adal.js module:

```js
angular.module('todoApp', ['ngRoute','AdalAngular'])
.config(['$routeProvider','$httpProvider', 'adalAuthenticationServiceProvider',
 function ($routeProvider, $httpProvider, adalProvider) {
...
```
- You can now initialize the `adalProvider` with the configuration values of your application registration, also in `App/Scripts/app.js`:

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

You now have a secure single page application with the ability to sign users in and issue Bearer token protected requests to its backend API.  When a user clicks the `TodoList` link, adal.js will automatically redirect to Azure AD for sign in if necessary.  In addition, adal.js will automatically attach an access_token to any ajax requests that are sent to the application's backend.  The above is the bare minimum necessary to build a SPA with adal.js - but there are a number of other features that are useful in SPAs:

- To explicitly issue sign in and sign out requests you can define functions in your controllers that invoke adal.js.  In `App/Scripts/homeCtrl.js`:

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

Congratulations! Your Azure AD integrated Single Page App is now complete.  It can authenticate users, securely call its backend using OAuth 2.0, and get basic information about the user.  If you haven't already, now is the time to populate your tenant with some users.  Run your To Do List SPA, and sign in with one of those users.  Add tasks to the users to do list, sign out, and sign back in.

Adal.js makes it easy to incorporate all of these common identity features into your application.  It takes care of all the dirty work for you - cache management, OAuth protocol support, presenting the user with a login UI, refreshing expired tokens, and more.

For reference, the completed sample (without your configuration values) is provided [here](https://github.com/AzureADQuickStarts/SinglePageApp-AngularJS-DotNet/archive/complete.zip).  You can now move on to additional scenarios.  You may want to try:

[Call a CORS Web API from a SPA >>](https://github.com/AzureAdSamples/SinglePageApp-WebAPI-AngularJS-DotNet)

For additional resources, check out:
- [AzureADSamples on GitHub >>](https://github.com/AzureAdSamples)
- [CloudIdentity.com >>](https://cloudidentity.com)
- Azure AD documentation on [Azure.com >>](http://azure.microsoft.com/documentation/services/active-directory/)
