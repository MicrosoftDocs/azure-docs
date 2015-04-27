<properties 
	pageTitle="Send x-plat notifications to a specific user with Windows Store client"
	description="Learn how to send push notifications to all devices of a specific user."
	services="app-service\mobile" 
	documentationCenter="windows" 
	authors="yuaxu" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-mobile" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="03/17/2015"
	ms.author="yuaxu"/>

# Send cross-platform notifications to a specific user

[AZURE.INCLUDE [app-service-mobile-selector-push-users-preview](../includes/app-service-mobile-selector-push-users-preview.md)]

This topic shows you how to send notifications to all registered devices of a specific user from your mobile backend. It introduced the concept of [templates], which gives client applications the freedom of specifying payload formats and variable placeholders at registration. Send then hits every platform with these placeholders, enabling cross-platform notifications.

> [AZURE.NOTE] To get push working with cross-platform clients, you will need to complete this tutorial for each platform you would like to enable. You will only need to do the [mobile backend update](#backend) once for clients that share the same mobile backend.
 
##Prerequisites 

Before you start this tutorial, you must have already completed these App Service tutorials for each client platform you want working:

+ [Get started with authentication]<br/>Adds a login requirement to the TodoList sample app.

+ [Get started with push notifications]<br/>Configures the TodoList sample app for push notifications.

##<a name="client"></a>Update your client to register for templates to handle cross-platform pushes

1. We will instead perform **InitNotificationAsync** in **MainPage.cs** to work with user authentication. Delete your **InitNotificationAsync** method definition and call in **App.xmal.cs**, and add the following in **MainPage.cs** in the **MainPage** class:

        private async void InitNotificationsAsync()
        {
            var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
 
            // building templates for wns
            var toastTemplate = "<toast><visual><binding template=\"ToastText01\"><text id=\"1\">$(message)</text></binding></visual></toast>";
            JObject templateBody = new JObject();
            templateBody["body"] = toastTemplate;
 
            JObject wnsToastHeaders = new JObject();
            wnsToastHeaders["X-WNS-Type"] = "wns/toast";
            templateBody["headers"] = wnsToastHeaders;
 
            JObject templates = new JObject();
            templates["testTemplate"] = templateBody;
 
            await App.MobileService.GetPush().RegisterAsync(channel.Uri, templates);
        }

    You will also want to transfer some using statements to **MainPage.cs**.

2. Use this method right after the **AuthenticateAsync** call in **ButtonLogin_Click**.

        await AuthenticateAsync();
        InitNotificationAsync();

Your app is now set up to register user device with the user login information.

##<a name="backend"></a>Update your service backend to send notifications to a specific user

1. In Visual Studio, update the `PostTodoItem` method definition with the following code:  

        public async Task<IHttpActionResult> PostTodoItem(TodoItem item)
        {
            TodoItem current = await InsertAsync(item);

            // get notification hubs credentials associated with this mobile app
            string notificationHubName = this.Services.Settings.NotificationHubName;
            string notificationHubConnection = this.Services.Settings.Connections[ServiceSettingsKeys.NotificationHubConnectionString].ConnectionString;

            // connect to notification hub
            NotificationHubClient Hub = NotificationHubClient.CreateClientFromConnectionString(notificationHubConnection, notificationHubName)

            // get the current user id and create tag to identify user
            ServiceUser authenticatedUser = this.User as ServiceUser;
            string userTag = "_UserId:" + authenticatedUser.Id;

            // build dictionary for template
            var notification = new Dictionary<string, string>{{"message", item.Text}};

            try
            {
            	await Hub.Push.SendTemplateNotificationAsync(notification, userTag);
            }
            catch (System.Exception ex)
            {
                throw;
            }
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

##<a name="test"></a>Test the app

Re-publish your mobile backend project and run any of the client apps you have set up. On item insertion, the backend will send notifications to all client apps where the user is logged in.

<!-- URLs. -->
[Get started with authentication]: app-service-mobile-dotnet-backend-windows-store-dotnet-get-started-users-preview.md
[Get started with push notifications]: app-service-mobile-dotnet-backend-windows-store-dotnet-get-started-push-preview.md
[templates]: https://msdn.microsoft.com/en-us/library/dn530748.aspx
