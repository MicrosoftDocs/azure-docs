<properties
	pageTitle="Add authentication on Apache Cordova with Mobile Apps | Azure App Service"
	description="Learn how to use Mobile Apps in Azure App Service to authenticate users of your Apache Cordova app through a variety of identity providers, including Google, Facebook, Twitter, and Microsoft."
	services="app-service\mobile"
	documentationCenter="javascript"
	authors="adrianhall"
	manager="erikre"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="na"
	ms.tgt_pltfrm="mobile-html"
	ms.devlang="javascript"
	ms.topic="article"
	ms.date="08/11/2016"
	ms.author="glenga"/>

# Add authentication to your Apache Cordova app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-users](../../includes/app-service-mobile-selector-get-started-users.md)]

## Summary

In this tutorial, you add authentication to the todolist quickstart project on Apache Cordova using a supported identity provider. This
tutorial is based on the [Get started with Mobile Apps] tutorial, which you must complete first.

##<a name="register"></a>Register your app for authentication and configure the App Service

[AZURE.INCLUDE [app-service-mobile-register-authentication](../../includes/app-service-mobile-register-authentication.md)]

[Watch a video showing similar steps](https://channel9.msdn.com/series/Azure-connected-services-with-Cordova/Azure-connected-services-task-8-Azure-authentication)

##<a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)]

Now, you can verify that anonymous access to your backend has been disabled. In Visual Studio, open the project that you created when you completed the tutorial [Get started with Mobile Apps], then run your application
in the **Google Android Emulator** and verify that an Unexpected Connection Failure is shown after the app starts.

Next, you will update the app to authenticate users before requesting resources from the Mobile App backend.

##<a name="add-authentication"></a>Add authentication to the app

1. Open your project in **Visual Studio**, then open the `www/index.html` file for editing.

2. Locate the `Content-Security-Policy` meta tag in the head section.  You will need to add the OAuth host to the list of allowed sources.

    | Provider               | SDK Provider Name | OAuth Host                  |
    | :--------------------- | :---------------- | :-------------------------- |
    | Azure Active Directory | aad               | https://login.windows.net   |
    | Facebook               | facebook          | https://www.facebook.com    |
    | Google                 | google            | https://accounts.google.com |
    | Microsoft              | microsoftaccount  | https://login.live.com      |
    | Twitter                | twitter           | https://api.twitter.com     |

    An example Content-Security-Policy (implemented for Azure Active Directory) is as follows:

        <meta http-equiv="Content-Security-Policy" content="default-src 'self'
			data: gap: https://login.windows.net https://yourapp.azurewebsites.net; style-src 'self'">

    You should replace `https://login.windows.net` with the OAuth host from the table above.  Consult the [Content-Security-Policy documentation] for more information about this meta tag.

    Note that some authentication providers do not require Content-Security-Policy changes when used on appropriate
    mobile devices.  For example, no Content-Security-Policy changes are required when using Google authentication
    on an Android device.

3. Open the `www/js/index.js` file for editing, locate the `onDeviceReady()` method, and under the client creation code add the following:

        // Login to the service
        client.login('SDK_Provider_Name')
            .then(function () {

                // BEGINNING OF ORIGINAL CODE

                // Create a table reference
                todoItemTable = client.getTable('todoitem');

                // Refresh the todoItems
                refreshDisplay();

                // Wire up the UI Event Handler for the Add Item
                $('#add-item').submit(addItemHandler);
                $('#refresh').on('click', refreshDisplay);

                // END OF ORIGINAL CODE

            }, handleError);

    Note that this code replace the existing code that creates the table reference and refreshes the UI.

    The login() method starts authentication with the provider. The login() method is an async function that returns a JavaScript Promise.  The rest of the initialization is placed inside the promise response so that it is not executed until the login() method completes.

4. In the code that you just added, replace `SDK_Provider_Name` with the name of your login provider. For example, for Azure Active Directory, use `client.login('aad')`.

4. Run your project.  When the project has finished initializing, your application will show the OAuth login page for the
   chosen authentication provider.

##<a name="next-steps"></a>Next Steps

* Learn more [About Authentication] with Azure App Service.
* Continue the tutorial by adding [Push Notifications] to your Apache Cordova app.

Learn how to use the SDKs.

* [Apache Cordova SDK]
* [ASP.NET Server SDK]
* [Node.js Server SDK]

<!-- URLs. -->
[Get started with Mobile Apps]: app-service-mobile-cordova-get-started.md
[Content-Security-Policy documentation]: https://cordova.apache.org/docs/en/latest/guide/appdev/whitelist/index.html
[Push Notifications]: app-service-mobile-cordova-get-started-push.md
[About Authentication]: app-service-mobile-auth.md
[Apache Cordova SDK]: app-service-mobile-codova-how-to-use-client-library.md
[ASP.NET Server SDK]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
[Node.js Server SDK]: app-service-mobile-node-backend-how-to-use-server-sdk.md
