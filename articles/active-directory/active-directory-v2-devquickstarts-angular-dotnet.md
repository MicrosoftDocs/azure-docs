<properties
	pageTitle="Azure AD v2.0 AngularJS Getting Started | Microsoft Azure"
	description="How to build an Angular JS Single Page app that signs in users with both personal Microsoft accounts and work or school accounts."
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
	ms.date="05/31/2016"
	ms.author="dastrock"/>


# Add sign-in to an AngularJS single page app - .NET

In this article we'll add sign in with Microsoft powered accounts to an AngularJS app using the Azure Active Directory v2.0 endpoint.  The v2.0 endpoint enables you to perform a single integration in your app and authenticate users with both personal and work/school accounts.

This sample is a simple To-Do List single page app that stores tasks in a backend REST API, written using the .NET 4.5 MVC framework and secured using OAuth bearer tokens from Azure AD.  The AngularJS app will use our open source JavaScript authentication library [adal.js](https://github.com/AzureAD/azure-activedirectory-library-for-js) to handle the entire sign in process and acquire tokens for calling the REST API.  The same pattern can be applied to authenticate to other REST APIs, like the [Microsoft Graph](https://graph.microsoft.com).

> [AZURE.NOTE]
	Not all Azure Active Directory scenarios & features are supported by the v2.0 endpoint.  To determine if you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).

## Download

To get started, you'll need to download & install Visual Studio.  Then you can clone or [download](https://github.com/AzureADQuickStarts/AppModelv2-SinglePageApp-AngularJS-DotNet/archive/skeleton.zip) a skeleton app:

```
git clone --branch skeleton https://github.com/AzureADQuickStarts/AppModelv2-SinglePageApp-AngularJS-DotNet.git
```

The skeleton app includes all the boilerplate code for a simple AngularJS app, but is missing all of the identity-related pieces.  If you don't want to follow along, you can instead clone or [download](https://github.com/AzureADQuickStarts/AppModelv2-SinglePageApp-AngularJS-DotNet/archive/complete.zip) the completed sample.

```
git clone https://github.com/AzureADSamples/SinglePageApp-AngularJS-DotNet.git
```

## Register an app

First, create an app in the [App Registration Portal](https://apps.dev.microsoft.com), or follow these [detailed steps](active-directory-v2-app-registration.md).  Make sure to:

- Add the **Web** platform for your app.
- Enter the correct **Redirect URI**. The default for this sample is `https://localhost:44326/`.
- Leave the **Allow Implicit Flow** checkbox enabled. 

Copy down the **Application ID** that is assigned to your app, you'll need it shortly. 

## Install adal.js
To start, navigate to project you downloaded and install adal.js.  If you have [bower](http://bower.io/) installed, you can just run this command.  For any dependency version mismatches, just choose the higher version.
```
bower install adal-angular#experimental
```

Alternatively, you can manually download [adal.js](https://raw.githubusercontent.com/AzureAD/azure-activedirectory-library-for-js/experimental/dist/adal.min.js) and [adal-angular.js](https://raw.githubusercontent.com/AzureAD/azure-activedirectory-library-for-js/experimental/dist/adal-angular.min.js).  Add both files to the `app/lib/adal-angular-experimental/dist` directory of the `TodoSPA` project.

Now open the project in Visual Studio, and load adal.js at the end of the main page's body:

```html
<!--index.html-->

...

<script src="App/bower_components/dist/adal.min.js"></script>
<script src="App/bower_components/dist/adal-angular.min.js"></script>

...
```

## Set up the REST API

While we're setting things up, let's get the backend REST API working.  In the root of the project, open `web.config` and replace the `audience` value.  The REST API will use this value to validate tokens it receives from the Angular app on AJAX requests.

```xml
<!--web.config-->

...

    <appSettings>
        <add key="ida:Audience" value="[Your-application-id]" />
    </appSettings>
    
...
```

That's all the time we're going to spend discussing how the REST API works.  Feel free to poke around in the code, but if you want to learn more about securing web APIs with Azure AD, check out [this article](active-directory-v2-devquickstarts-dotnet-api.md). 

## Sign users in
Time to write some identity code.  You might have already noticed that adal.js contains an AngularJS provider, which plays nicely with Angular routing mechanisms.  Start by adding the adal module to the app:

```js
// app/scripts/app.js

angular.module('todoApp', ['ngRoute','AdalAngular'])
.config(['$routeProvider','$httpProvider', 'adalAuthenticationServiceProvider',
 function ($routeProvider, $httpProvider, adalProvider) {

...
```

You can now initialize the `adalProvider` with your Application ID:

```js
// app/scripts/app.js

...

adalProvider.init({
        
        // Use this value for the public instance of Azure AD
        instance: 'https://login.microsoftonline.com/', 
        
        // The 'common' endpoint is used for multi-tenant applications like this one
        tenant: 'common',
        
        // Your application id from the registration portal
        clientId: '<Your-application-id>',
        
        // If you're using IE, uncommment this line - the default HTML5 sessionStorage does not work for localhost.
        //cacheLocation: 'localStorage',
         
    }, $httpProvider);
```

Great, now adal.js has all the information it needs to secure your app and sign users in.  To force sign in for a particular route in the app, all it takes is one line of code:

```js
// app/scripts/app.js

...

}).when("/TodoList", {
    controller: "todoListCtrl",
    templateUrl: "/static/views/TodoList.html",
    requireADLogin: true, // Ensures that the user must be logged in to access the route
})

...
```

Now when a user clicks the `TodoList` link, adal.js will automatically redirect to Azure AD for sign-in if necessary.  You can also explicitly send sign-in and sign-out requests by invoking adal.js in your controllers:

```js
// app/scripts/homeCtrl.js

angular.module('todoApp')
// Load adal.js the same way for use in controllers and views   
.controller('homeCtrl', ['$scope', 'adalAuthenticationService','$location', function ($scope, adalService, $location) {
    $scope.login = function () {
        
        // Redirect the user to sign in
        adalService.login();
        
    };
    $scope.logout = function () {
        
        // Redirect the user to log out    
        adalService.logOut();
    
    };
...
```

## Display user info
Now that the user is signed in, you'll probably need to access the signed-in user's authentication data in your application.  Adal.js exposes this information for you in the `userInfo` object.  To access this object in a view, first add adal.js to the root scope of the corresponding controller:

```js
// app/scripts/userDataCtrl.js

angular.module('todoApp')
// Load ADAL for use in view
.controller('userDataCtrl', ['$scope', 'adalAuthenticationService', function ($scope, adalService) {}]);
```

Then you can directly address the `userInfo` object in your view: 

```html
<!--app/views/UserData.html-->

...

    <!--Get the user's profile information from the ADAL userInfo object-->
    <tr ng-repeat="(key, value) in userInfo.profile">
        <td>{{key}}</td>
        <td>{{value}}</td>
    </tr>
...
```

You can also use the `userInfo` object to determine if the user is signed in or not.

```html
<!--index.html-->

...

    <!--Use the ADAL userInfo object to show the right login/logout button-->
    <ul class="nav navbar-nav navbar-right">
        <li><a class="btn btn-link" ng-show="userInfo.isAuthenticated" ng-click="logout()">Logout</a></li>
        <li><a class="btn btn-link" ng-hide="userInfo.isAuthenticated" ng-click="login()">Login</a></li>
    </ul>
...
```

## Call the REST API
Finally, it's time to get some tokens and call the REST API to create, read, update, and delete tasks.  Well guess what?  You don't have to do *a thing*.  Adal.js will automatically take care of getting, caching, and refreshing tokens.  It will also take care of attaching those tokens to outgoing AJAX requests that you send to the REST API.  

How exactly does this work? It's all thanks to the magic of [AngularJS interceptors](https://docs.angularjs.org/api/ng/service/$http), which allows adal.js to transform outgoing and incoming http messages.  Furthermore, adal.js assumes that any requests send to the same domain as the window should use tokens intended for the same Application ID as the AngularJS app.  This is why we used the same Application ID in both the Angular app and in the NodeJS REST API.  Of course, you can override this behavior and tell adal.js to get tokens for other REST APIs if necessary - but for this simple scenario the defaults will do.

Here's a snippet that shows how easy it is to send requests with bearer tokens from Azure AD:

```js
// app/scripts/todoListSvc.js

...
return $http.get('/api/tasks');
...
```

Congratulations!  Your Azure AD integrated single page app is now complete.  Go ahead, take a bow.  It can authenticate users, securely call its backend REST API using OpenID Connect, and get basic information about the user.  Out of the box, it supports any user with a personal Microsoft Account or a work/school account from Azure AD.  Run the app, and in a browser navigate to `https://localhost:44326/`.  Sign in using either a personal Microsoft account or a work/school account.  Add tasks to the user's to-do list, and sign out.  Try signing in with the other type of account. If you need an Azure AD tenant to create work/school users, [learn how to get one here](active-directory-howto-tenant.md) (it's free).

To continue learning about the v2.0 endpoint, head back to our [v2.0 developer guide](active-directory-appmodel-v2-overview.md).  For additional resources, check out:

- [Azure-Samples on GitHub >>](https://github.com/Azure-Samples)
- [Azure AD on Stack Overflow >>](http://stackoverflow.com/questions/tagged/azure-active-directory)
- Azure AD documentation on [Azure.com >>](https://azure.microsoft.com/documentation/services/active-directory/)

## Get security updates for our products

We encourage you to get notifications of when security incidents occur by visiting [this page](https://technet.microsoft.com/security/dd252948) and subscribing to Security Advisory Alerts.
