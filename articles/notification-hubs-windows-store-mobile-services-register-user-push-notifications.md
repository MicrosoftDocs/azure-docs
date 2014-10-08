<properties urlDisplayName="Notify Windows Store app users by using Mobile Services" pageTitle="Register the current user for push notifications by using a mobile service - Notification Hubs" metaKeywords="Azure registering application, Notification Hubs, Azure push notifications, push notification Windows Store app" description="Learn how to request push notification registration in a Windows Store app with Azure Notification Hubs when registeration is performed by Azure Mobile Services." metaCanonical="" services="mobile-services,notification-hubs" documentationCenter="" title="Register the current user for push notifications by using a mobile service" authors="glenga" solutions="" manager="dwrede" editor="" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-store" ms.devlang="javascript" ms.topic="article" ms.date="01/01/1900" ms.author="glenga" />
# Register the current user for push notifications by using a mobile service

<div class="dev-center-tutorial-selector sublanding">
    <a href="/en-us/documentation/articles/notification-hubs-windows-store-mobile-services-register-user-push-notifications/" title="Windows Store C#" class="current">Windows Store C#</a><a href="/en-us/documentation/articles/notification-hubs-ios-mobile-services-register-user-push-notifications/" title="iOS">iOS</a>
</div>

This topic shows you how to request push notification registration with Azure Notification Hubs when registration is performed by Azure Mobile Services. This topic extends the tutorial [Notify users with Notification Hubs]. You must have already completed the required steps in that tutorial to create the authenticated mobile service. For more information on the notify users scenario, see [Notify users with Notification Hubs].  

1. In Visual Studio 2012 Express for Windows 8, open the project that you created when you completed the prerequisite tutorial [Get started with authentication].

2. In solution explorer, right-click the project, click **Store**, and then click **Associate App with the Store...**. 

  	![][1]

   	This displays the **Associate Your App with the Windows Store** Wizard.

3. In the wizard, click **Sign in** and then login with your Microsoft account.

4. Select the app that you registered in [Notify users with Notification Hubs], click **Next**, and then click **Associate**.

   	![][2]

   	This adds the required Windows Store registration information to the application manifest.  

	<div class="dev-callout"><b>Note</b>
	<p>This reuses the Windows Store registration from the Notification Hubs tutorial app with this Mobile Services app. This may prevent the Notification Hubs tutorial app from receiving notifications</p>
	</div>

5. In Solution Explorer, double-click the Package.appxmanifest project file to open it in the Visual Studio editor.

6. Scroll down to **All Image Assets** and click **Badge Logo**. In **Notifications**, set **Toast capable** to **Yes**:

   	![][3]

	This enables this Mobile Services tutorial app to receive toast notifications.

7. In Visual Studio, open the MainPage.xaml.cs file and add the following code that defines the **NotificationRequest** and **RegistrationResult** classes:

        public class NotificationRequest
        {
            public string channelUri { get; set; }
            public string platform { get; set; }
        }

        public class RegistrationResult
        {
            public string RegistrationId { get; set; }
            public string ExpirationTime { get; set; }
        }

	These classes will hold the request body and the registration ID returned when the custom API is called, respectively.

8. In the **MainPage** class, add the following method:

        private async System.Threading.Tasks.Task RegisterNotification()
        {
            string message;

            // Get a channel for push notifications.
            var channel =
                await Windows.Networking.PushNotifications
                .PushNotificationChannelManager
                .CreatePushNotificationChannelForApplicationAsync();

            // Create the body of the request.
            var body = new NotificationRequest 
            {
                channelUri = channel.Uri, 
                platform = "win8" 
            }; 

            try
            {
                // Call the custom API POST method with the supplied body.
                var result = await App.MobileService
                    .InvokeApiAsync<NotificationRequest, 
                    RegistrationResult>("register_notifications", body,
                    System.Net.Http.HttpMethod.Post, null);

                // Set the response, which is the ID of the registration.
                message = string.Format("Registration ID: {0}", result.RegistrationId);
            }
            catch (MobileServiceInvalidOperationException ex)
            {
                message = ex.Message;
            }

            // Display a message dialog.
            var dialog = new MessageDialog(message);
            dialog.Commands.Add(new UICommand("OK"));
            await dialog.ShowAsync();
        }

	This method creates a channel for push notifications and sends it, along with the device type, to the custom API method that creates a registration in Notification Hubs. This custom API was defined in [Notify users with Notification Hubs].

9. Add the following line of code to the **OnNavigatedTo** method, just after the **Authenticate** method is called:

		await RegisterNotification();

	<div class="dev-callout"><b>Note</b>
	<p>This makes sure that registration is requested every time that the page is loaded. In your app, you may only want to make this registration periodically to ensure that the registration is current.</p>
	</div>

Now that the client app has been updated, return to the [Notify users with Notification Hubs] and update the mobile service to send notifications by using Notification Hubs.

<!-- Anchors. -->

<!-- Images. -->
[1]: ./media/notification-hubs-windows-store-mobile-services-register-user-push-notifications/mobile-services-select-app-name.png
[2]: ./media/notification-hubs-windows-store-mobile-services-register-user-push-notifications/notification-hub-associate-win8-app.png
[3]: ./media/notification-hubs-windows-store-mobile-services-register-user-push-notifications/notification-hub-win8-app-toast.png

<!-- URLs. -->
[Notify users with Notification Hubs]: /en-us/manage/services/notification-hubs/notify-users
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet/

[Azure Management Portal]: https://manage.windowsazure.com/
