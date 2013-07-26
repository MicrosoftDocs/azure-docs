<properties linkid="notification-hubs-how-to-guides-howto-register-user-with-mobile-service-windowsphonedotnet" urlDisplayName="Notify Windows Store app users by using Mobile Services" pageTitle="Register the current user for push notifications by using a mobile service - Notification Hubs" metaKeywords="Windows Azure registering application, Notification Hubs, Azure push notifications, push notification Windows Store app" metaDescription="Learn how to request push notification registration in a Windows Store app with Windows Azure Notification Hubs when registeration is performed by Windows Azure Mobile Services." metaCanonical="" disqusComments="0" umbracoNaviHide="1" />

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14798" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Register the current user for push notifications by using a mobile service

<div class="dev-center-tutorial-selector sublanding">
 <!--   <a href="/en-us/ITPro/mobile/tutorials/notify-users-mobile-dotnet" title="Mobile Services" class="current">Mobile Services</a>
    <a href="/en-us/develop/mobile/tutorials/notify-users-webapi-dotnet" title="ASP.NET">ASP.NET</a>
|-->
    <a href="/en-us/develop/mobile/tutorials/notify-users-mobile-dotnet" title="Windows Store C#" class="current">Windows Store C#</a>
    <a href="/en-us/develop/mobile/tutorials/notify-users-mobile-ios" title="iOS">iOS</a>

</div>

This topic shows you how to request push notification registration with Windows Azure Notification Hubs when registeration is performed by Windows Azure Mobile Services. This topic extends the tutorial [Notify users with Notification Hubs]. You must have already completed the required steps in that tutorial to create the authenticated mobile service. For more information on the notify users scenario, see [Notify users with Notification Hubs].  

1. In Visual Studio 2012 Express for Windows 8, open the MainPage.xaml.cs file in the project that you created when you completed the prerequisite tutorial [Get started with authentication].

2. Add the following code that defines the **NotificationRequest** and **RegistrationResult** classes:

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

3. In the **MainPage** class, add the following method:

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

4. Add the following line of code to the **OnNavigatedTo** method, just after the **Authenticate** method is called:

		await RegisterNotification();

	<div class="dev-callout"><b>Note</b>
	<p>This makes sure that registration is requested every time that the page is loaded. In your app, you may only want to make this registration periodically to ensure that the registration is current.</p>
	</div>

Now that the client app has been updated, return to the [Notify users with Notification Hubs] and update the mobile service to send notifications by using Notification Hubs.

<!-- Anchors. -->

<!-- Images. -->


<!-- URLs. -->
[Notify users with Notification Hubs]: ./tutorial-notify-users-mobileservices.md
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet/
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/