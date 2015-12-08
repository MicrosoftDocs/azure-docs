<properties 
	pageTitle="Send x-plat notifications to a specific user with Windows Store client"
	description="Learn how to send push notifications to all devices of a specific user."
	services="app-service\mobile,notification-hubs" 
	documentationCenter="windows" 
	authors="ysxu" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-mobile" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="12/02/2015"
	ms.author="yuaxu"/>

# Send cross-platform notifications to a specific user

[AZURE.INCLUDE [app-service-mobile-selector-push-users](../../includes/app-service-mobile-selector-push-users.md)]
&nbsp;  
[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

This topic shows you how to send notifications to all registered devices of a specific user from your mobile backend. It introduced the concept of [templates], which gives client applications the freedom of specifying payload formats and variable placeholders at registration. Send then hits every platform with these placeholders, enabling cross-platform notifications.

> [AZURE.NOTE] To get push working with cross-platform clients, you will need to complete this tutorial for each platform you would like to enable. You will only need to do the [mobile backend update](#backend) once for clients that share the same mobile backend.
 
##Prerequisites 

Before you start this tutorial, you must have already completed these App Service tutorials for each client platform you want working:

+ [Get started with authentication]<br/>Adds a login requirement to the TodoList sample app.

+ [Get started with push notifications]<br/>Configures the TodoList sample app for push notifications.

##<a name="client"></a>Update your client to register for templates to handle cross-platform pushes

You must authenticate the user before registering for push notifications to make sure that the user ID is added as a tag in the registration. To do this you must move **InitNotificationAsync** into MainPage.cs and call it after **AuthenticateAsync**. 

2. In Visual Studio, open the App.xmal.cs and remove the call to **InitNotificationAsync** from the **OnLaunched** method, and also delete the method definition itself. 

3. In the MainPage.cs project file add the following using statement:

		using Windows.Networking.PushNotifications; 

4. Add the **InitNotificationAsync** method back into the **MainPage** class:

        // Registers for template push notifications.
        private async void InitNotificationsAsync()
        {
            var channel = await PushNotificationChannelManager
                .CreatePushNotificationChannelForApplicationAsync();

            // Define a toast templates for WNS.
            var toastTemplate =
                @"<toast><visual><binding template=""ToastText02""><text id=""1"">"
                                + @"New item:</text><text id=""2"">"
                                + @"$(message)</text></binding></visual></toast>";

            JObject templateBody = new JObject();
            templateBody["body"] = toastTemplate;

            // Add the required WNS toast header.
            JObject wnsToastHeaders = new JObject();
            wnsToastHeaders["X-WNS-Type"] = "wns/toast";
            templateBody["headers"] = wnsToastHeaders;

            JObject templates = new JObject();
            templates["testTemplate"] = templateBody;

            // Register for push notifications.
            await App.MobileService.GetPush()
                .RegisterAsync(channel.Uri, templates);
        }

    Note that this registration uses a template. To learn more about template registrations, see [Templates](../notification-hubs/notification-hubs-templates.md) in the Notification Hubs documentation.

2. Re-add the call to **InitNotificationsAsync** in the **ButtonLogin_Click** method as shown here:

		private async void ButtonLogin_Click(object sender, RoutedEventArgs e)
		{
		    // Login the user and then load data from the mobile app.
		    if (await AuthenticateAsync())
		    {

		        // Hide the login button and load items from the mobile app.
		        ButtonLogin.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
		        //await InitLocalStoreAsync(); //offline sync support.
		        await RefreshTodoItems();
		    }
		} 

	This makes sure that the user is authenticated before registering for push notifications. When an authenticated user registers for push notifications, a tag with the user ID is automatically added.


##<a name="backend"></a>Update your service backend to send notifications to a specific user

[AZURE.INCLUDE [app-service-mobile-push-notifications-to-users](../../includes/app-service-mobile-push-notifications-to-users.md)]

##<a name="test"></a>Test the app

Run any of the client apps you have set up, using the same sign-in method and user. When an item is inserted, the Mobile App backend sends notifications to all client apps where the user is signed-in.

<!-- URLs. -->
[Get started with authentication]: app-service-mobile-windows-store-dotnet-get-started-users.md
[Get started with push notifications]: app-service-mobile-windows-store-dotnet-get-started-push.md
[templates]: https://msdn.microsoft.com/library/dn530748.aspx
 
