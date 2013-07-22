<properties linkid="develop-mobile-how-to-guides-register-for-google-authentication" urlDisplayName="Register for Google Authentication" pageTitle="Register for Google authentication - Mobile Services" metaKeywords="Windows Azure registering application, Azure authentication, Google application authenticate, authenticate mobile services" metaDescription="Learn how to register your apps to use Google to authenticate with Windows Azure Mobile Services." metaCanonical="" disqusComments="0" umbracoNaviHide="1" />

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

2. Add the following code that defines the RegistrationResult class:

        public class RegistrationResult
        {
            public string RegistrationId { get; set; }
        }

  This class will hold the registration ID returned when the custom API is called.

3. In the **MainPage** class, add the following method:

        private async System.Threading.Tasks.Task RegisterNotification()
        {
            string message;

            // Get a channel for push notifications.
            var channel =
                await Windows.Networking.PushNotifications
                .PushNotificationChannelManager
                .CreatePushNotificationChannelForApplicationAsync();

            // Define query parameters.
            var parameters = new Dictionary<string, string>();
            parameters.Add("platform", "win8");
            parameters.Add("deviceid", channel.Uri);

            try
            {
                // Call the custom API method with the supplied parameters.
                var result = await App.MobileService
                    .InvokeApiAsync<RegistrationResult>("register_notifications",
                    System.Net.Http.HttpMethod.Post, parameters);

                message = result.RegistrationId;
            }
            catch (MobileServiceInvalidOperationException ex)
            {
                message = ex.Message;
            }

            var dialog = new MessageDialog(message);
            dialog.Commands.Add(new UICommand("OK"));
            await dialog.ShowAsync();
        }

	This method creates a channel for push notifications and sends it, along with the device type, to the custom API method that creates a registration in Notification Hubs. This custom API was defined in [Notify users with Notification Hubs].

4. Add the following line of code to the **OnNavigatedTo** method, just after the **Authenticate** method is called:

		await RegisterNotification();

	This makes sure that registration is requested every time that the page is loaded. In your app, you may only want to make this registration periodically to ensure that the registration is current.

Now that the client app has been updated, return to the [Notify users with Notification Hubs] and update the mobile service to send notifications by using Notification Hubs.

<!-- Anchors. -->

<!-- Images. -->
[1]: ../Media/mobile-services-google-developers.png
[2]: ../Media/mobile-services-google-create-client.png
[3]: ../Media/mobile-services-google-create-client2.png
[4]: ../Media/mobile-services-google-create-client3.png
[5]: ../Media/mobile-services-google-app-details.png

<!-- URLs. -->
[Notify users with Notification Hubs]: ./tutorial-notify-users-mobileservices.md
[accounts.google.com]: http://go.microsoft.com/fwlink/p/?LinkId=268302
[Google apis]: http://go.microsoft.com/fwlink/p/?LinkId=268303
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet/
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/