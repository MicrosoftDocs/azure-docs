<properties 
	pageTitle="Send push notifications to a specific user with Xamarin iOS Configuration" 
	description="Learn how to send push notifications to all devices of a user" 
	services="app-service\mobile" 
	documentationCenter="windows" 
	authors="yuaxu" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-mobile" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-xamarin-ios" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="03/17/2015"
	ms.author="yuaxu"/>

# Send x-plat push notifications to all devices of a specific user with templates

[AZURE.INCLUDE [app-service-mobile-selector-push-users-preview](../includes/app-service-mobile-selector-push-users-preview.md)]

This topic shows you how to send notifications to all registered devices of a specific user from your mobile backend.
 
##Prerequisites 

Before you start this tutorial, you must have already completed these App Service tutorials for each client platform you want working:

+ [Get started with authentication]<br/>Adds a login requirement to the TodoList sample app.

+ [Get started with push notifications]<br/>Configures the TodoList sample app for push notifications.

##<a name="client"></a>Update your client to register for templates to handle cross-platform pushes

1. In **App.xaml.cs**, replace the **InitNotificationsAsync** method with the following:

        private async void InitNotificationsAsync()
        {
            var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();

            string apnsTemplatesJson = '{\"simpleNotification\":{body: "{\"aps\":{\"alert\":\"'+ $message +'\"}}';

            JObject apnsTemplates = JObject.Parse(apnsTemplatesJson);
            
			var result = MobileService.GetPush().RegisterAsync(channel.Uri, apnsTemplates);
        }

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

            // get the current user id and create given user tag
            ServiceUser authenticatedUser = this.User as ServiceUser;
            string userTag = "_UserId:" + authenticatedUser.Id;

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
[Get started with authentication]: ../articles/app-service-mobile-dotnet-backend-xamarin-ios-get-started-users-preview/
[Get started with push notifications]: ../articles/app-service-mobile-dotnet-backend-xamarin-ios-get-started-push-preview/