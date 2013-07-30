<properties linkid="" urlDisplayName="Notify Users" pageTitle="Notify Users of your ASP.NET service with Notification Hubs" metaKeywords="" writer="glenga" metaDescription="Follow this tutorial to register to receive notifications from your ASP.NET service by using Notification Hubs" metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/notification-hubs-left-nav.md" />

# Notify users with Notification Hubs

<div class="dev-center-tutorial-selector sublanding">
    <a href="/en-us/manage/services/notification-hubs/notify-users" title="Mobile Services">Mobile Services</a>
    <a href="/en-us/manage/services/notification-hubs/notify-users-aspnet" title="ASP.NET" class="current">ASP.NET</a>
</div> 

This tutorial shows you how to use Windows Azure Notification Hubs to send push notifications to a specific app user on a specific device. An ASP.NET Web API backend is used to authenticate clients and to generate notifications. This tutorial builds on the notification hub that you created in the previous **Get started with Notification Hubs** tutorial. The notification registration code is moved from the client to the backend service. This ensures that registration is only completed after a client has been positively authenticated by the service. It also means that notification hub credentials aren't distributed with the client app. The service also controls the tags requested during registration.

This tutorial walks you through the following basic steps: 

+ [Create an ASP.NET application with authentication]
+ [Update your ASP.NET application to register for notifications]
+ [Update the app to log in and request registration]

## Prerequisites

+ Visual Studio 2012. You can also use both Visual Studio Express 2012 for Web and Visual Studio Express 2012 for Windows 8 to create the ASP.NET application and the Windows Store app, respective. 
+ This tutorial builds upon the app and notification hub that you created in **Get started with Notification Hubs**.  Before you start this tutorial, you must first complete the tutorial **Get started with Notification Hubs** ([Windows Store C#][Get started Windows Store]/[iOS][Get started iOS]/[Android][Get started Android]). 

<div class="dev-callout"><b>Note</b>
	<p>The ASP.NET Web API project that you create in this tutorial runs on your local computer. You can also publish an ASP.NET Web API project to Windows Azure. For more information, see <a href="/en-us/develop/net/tutorials/rest-service-using-web-api/" target="_blank">Create a mobile-friendly REST service using ASP.NET Web API and SQL Database</a>.</p>
</div>

<a name="create-application"></a><h2><span class="short-header">Create the ASP.NET app</span>Create an ASP.NET application with authentication</h2>

First you will create an ASP.NET Web API application. This backend service will authenticate clients, register for push notifications on behalf of an authenticated user, and send out notifications.

1. In Visual Studio or Visual Studio Express 2012 for Web, click **File** then **New project from the File menu, expand **Templates**, **Visual C#**, then click **Web** and **ASP.NET MVC 4 Web Application**, enter the name  _NotificationService_, and click **OK**.

	![][0]

2. In the **New ASP.NET MVC Project** dialog, click **Empty**, then click **OK**.

	This creates an ASP.NET MVC project.

3. In Solution Explorer, right-click the project, click **Add** and then **Class**, then type `AuthenticationTestHandler` and click **Add**.

	![][1] 

	This adds a code file for the **AuthenticationTestHandler** class to the project.

4. Open the new AuthenticationTestHandler.cs project file and replace the class definition with the following code:

		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Net;
		using System.Net.Http;
		using System.Threading;
		using System.Threading.Tasks;
		using System.Security.Principal;
		using System.Text;
		using System.Web;
		
		namespace NotificationService
		{
		    public class AuthenticationTestHandler : DelegatingHandler
		    {
		        protected override Task<HttpResponseMessage> SendAsync(
		        HttpRequestMessage request, CancellationToken cancellationToken)
		        {
		            var authorizationHeader = request.Headers.GetValues("Authorization").First();
		
		            if (authorizationHeader != null && authorizationHeader
		                .StartsWith("Basic ", StringComparison.InvariantCultureIgnoreCase))
		            {
		                string authorizationUserAndPwdBase64 = 
		                    authorizationHeader.Substring("Basic ".Length);
		                string authorizationUserAndPwd = Encoding.Default
		                    .GetString(Convert.FromBase64String(authorizationUserAndPwdBase64));
		                string user = authorizationUserAndPwd.Split(':')[0];
		                string password = authorizationUserAndPwd.Split(':')[1];
		
		                if (verifyUserAndPwd(user, password))
		                {
		                    // Attach the new principal object to the current HttpContext object
		                    HttpContext.Current.User = 
		                        new GenericPrincipal(new GenericIdentity(user), new string[0]);
		                    System.Threading.Thread.CurrentPrincipal = 
		                        System.Web.HttpContext.Current.User;
		                }
		                else return Unauthorised();
		            } else return Unauthorised();
		
		            return base.SendAsync(request, cancellationToken);
		        }
		
		        private bool verifyUserAndPwd(string user, string password)
		        {
		            // This is not a real authentication scheme.
		            return user == password;
		        }
		
		        private Task<HttpResponseMessage> Unauthorised()
		        {
		            var response = new HttpResponseMessage(HttpStatusCode.Forbidden);
		            var tsc = new TaskCompletionSource<HttpResponseMessage>();
		            tsc.SetResult(response);
		            return tsc.Task;
		        }
		    }
		} 

	<div class="dev-callout"><b>Security Note</b>
		<p>The <strong>AuthenticationTestHandler</strong> class does not provide true authentication. It is used only to mimic basic authentication and return a principle. The user name is required to create Notification Hub registrations. The above implementation is not secure. You must implement a secure authentication mechanism in your production applications and services.</p>
	</div>

5. Expand the **App_Start** folder, open the WebApiConfig.cs file, and add the following line of code at the end of the **Register** method:

		config.MessageHandlers.Add(new AuthenticationTestHandler());

	This requires that requests to the ASP.NET application contain the Authorization header.

Now that we have created the basic application with a mock authentication scheme to provide us with a user name. 

<a name="register-notification"></a><h2><span class="short-header">Register for notifications</span>Update your ASP.NET application to register for notifications</h2>

The next step is to add the registration logic for notification hubs to the ASP.NET application by creating a new **Registration** controller. 

1. Log into the [Windows Azure Management Portal][Management Portal], click **Service Bus**, your namespace, **Notification Hubs**, then choose your notification hub and click **Connection Information**.  

	![][6]

2. Note the name of your notification hub and copy the connection string for the **DefaultFullSharedAccessSignature**.

	![][7]

	You will use this connection string, along with the notification hub name, to both register for and send notifications.

3. In **Solution Explorer**, right-click the project name, and then select **Manage NuGet Packages**.

4. In the left pane, select the **Online** category, search for `WindowsAzure.ServiceBus`, click **Install** on the **Windows Azure Service Bus** package, then accept the license agreement. 

  ![][2]

  This adds the Microsoft.ServiceBus.dll assembly to your project.

5. In Solution Explorer, right-click the **Controllers** folder, click **Add**, click **Controller...**, then type `RegisterController` for **Controller name**, choose **Empty API controller**, and click **Add**.

	![][3]

	This adds a controller class to the project. This controller, when invoked, will do the work of registering a device with Notification Hubs.

6. Open the new RegisterController.cs project file and add the following **using** statements.

		using Microsoft.ServiceBus.Notifications;
		using Newtonsoft.Json.Linq;
		using System.Threading.Tasks;
		using System.Web;

7. Add the following code into the new RegisterController class: 

		// Define the Notification Hubs client.
		private NotificationHubClient hubClient;

		// Create the client in the constructor.
        public RegisterController()
        {
            var cn = "<FULL_SAS_CONNECTION_STRING>";
            hubClient = NotificationHubClient
				.CreateClientFromConnectionString(cn, "<NOTIFICATION_HUB_NAME>");
        }

8. Update the code in the constructor to replace _`<NOTIFICATION_HUB_NAME>`_ and _`<FULL_SAS_CONNECTION_STRING>`_ with values for your notification hub, then click **Save**.

	<div class="dev-callout"><b>Note</b>
		<p>Make sure to use the <strong>DefaultFullSharedAccessSignature</strong> for <em><code>&lt;FULL_SAS_CONNECTION_STRING&gt;</code></em>. This claim allows your custom API method to create and update registrations.</p>
	</div>

9. Add the following Post method code into the RegisterController class:

        public async Task<RegistrationDescription> Post([FromBody]JObject registrationCall)
        {
            // Get the registration info that we need from the request. 
            var platform = registrationCall["platform"].ToString();
            var installationId = registrationCall["instId"].ToString();
            var channelUri = registrationCall["channelUri"] != null ? 
                registrationCall["channelUri"].ToString() : null;
            var deviceToken = registrationCall["deviceToken"] != null ? 
                registrationCall["deviceToken"].ToString() : null;       
            var userName = HttpContext.Current.User.Identity.Name;

            // Get registrations for the current installation ID.
            var regsForInstId = await hubClient.GetRegistrationsByTagAsync(installationId, 100);

            bool updated = false;
            bool firstRegistration = true;
            RegistrationDescription registration = null;

            // Check for existing registrations.
            foreach (var registrationDescription in regsForInstId)
            {
                if (firstRegistration)
                {
 					// Update the tags.
                    registrationDescription.Tags = new HashSet<string>() { installationId, userName };

                    // We need to handle each platform separately.
                    switch (platform)
                    {
                        case "windows":
                            var winReg = registrationDescription as WindowsRegistrationDescription;
                            winReg.ChannelUri = new Uri(channelUri);
                            registration = await hubClient.UpdateRegistrationAsync(winReg);                            
                            break;
                        case "ios":
                            var iosReg = registrationDescription as AppleRegistrationDescription;
                            iosReg.DeviceToken = deviceToken;
                            registration = await hubClient.UpdateRegistrationAsync(iosReg);
                            break;
                    }
                    updated = true;
                    firstRegistration = false;
                }
                else
                {
                    // We shouldn't have any extra registrations; delete if we do.
                    await hubClient.DeleteRegistrationAsync(registrationDescription);
                }
            }

            // Create a new registration.
            if (!updated)
            {
                switch (platform)
                {
                    case "windows":
                        registration = await hubClient.CreateWindowsNativeRegistrationAsync(channelUri, 
                            new string[] { installationId, userName });
                        break;
                    case "ios":
                        registration = await hubClient.CreateAppleNativeRegistrationAsync(deviceToken, 
                            new string[] { installationId, userName });
                        break;
                }
            }

            // Send out a test notification.
            sendNotification(string.Format("Test notification for {0}", userName), userName);

            return registration;
        }

	This code is invoked by a POST request and gets platform and deviceID information from the message body. This data, along with the installation ID from the request header and the user ID of the logged-in user, is used to update a registration. If a registration does not exists, it creates a new registration. This registration is tagged with the user ID and installation ID.

10. Add the following sendNotification method:

        // Basic implementation that sends a not ification to Windows Store and iOS app clients.
        private async Task sendNotification(string notificationText, string tag)
        {
            try
            {
                // Create notifications for both Windows Store and iOS platforms.
                var toast = @"<toast><visual><binding template=""ToastText01""><text id=""1"">" +
                    notificationText + "</text></binding></visual></toast>";
                var alert = "{\"aps\":{\"alert\":\"" + notificationText + 
                    "\"}, \"inAppMessage\":\"" + notificationText + "\"}";

                // Send a notification to the logged-in user on both platforms.
                await hubClient.SendWindowsNativeNotificationAsync(toast, tag);
                await hubClient.SendAppleNativeNotificationAsync(alert, tag);
            }
            catch(ArgumentException ex)
            {
                // This is expected when an APNS registration doesn't exist.
                Console.WriteLine(ex.Message);
            }
        }

	This method is called to send a notification immediately when the registration is completed.

Next, we will update the client app that you created when you completed the tutorial **Get started with Notification Hubs**. 

<a name="update-app"></a><h2><span class="short-header">Update the app</span>Update the app to log in and request registration</h2>

The app that you created when you completed the tutorial **Get started with Notification Hubs** requests registration directly from the notification hub. You will remove this registration code from the client app and replace it with a call to the new Register API in the ASP.NET Web API application.

1. Press F5 to start the ASP.NET application and attempt to load the default page. 

	When the browser is displayed, make a note of the hostname of the requested site. You will need this root URL when you update the client app.

	<div class="dev-callout"><b>Note</b>
		<p>When you are using the local IIS Web server or Visual Studio Development Server, you must also specify the port number. Note that a 404 error is returned because we have not implemented a default page in this application.</p>
	</div>

2. Follow the steps in one of the following versions of **Register the current user for push notifications by using ASP.NET Web API**, depending on your client platform:

	+ <a href="/en-us/manage/services/notification-hubs/howto-register-user-with-aspnet-windowsdotnet" target="_blank">Windows Store C# version</a>
	+ <a href="/en-us/manage/services/notification-hubs/howto-register-user-with-aspnet-ios" target="_blank">iOS version</a>

3. Run the updated app, login with the service by using the same string for username and password, and then verify that the registration ID assigned to the notification is displayed.

	You will also receive a push notification.

	<div class="dev-callout"><b>Note</b>
		<p>An error is raised on the backend when there is no registration for a platform to which a notification is requested to be sent. In this case, this error can be ignored. To see how to leverage templates to avoid this situation, see <a href="/en-us/manage/services/notification-hubs/notify-users-cross-platform" target="_blank">Send cross-platform notifications to users with Notification Hubs</a>.</p>
	</div>

4. (Optional) Deploy the client app to a second device, then run the app and insert text. 

	Note that a notification is displayed on each device.

## <a name="next-steps"> </a>Next Steps
Now that you have completed this tutorial, consider completing the following tutorials:

+ **Use Notification Hubs to send breaking news ([Windows Store C#][Breaking news .NET] / [iOS][Breaking news iOS])**<br/>This platform-specific tutorial shows you how to use tags to enable users to subscribe to types of notifications in which they are interested. 

+ **[Send cross-platform notifications to users with Notification Hubs]**<br/>This tutorial extends the current **Notify users with Notification Hubs** tutorial to use platform-specific templates to register for notifications. This enables you to send notifications from a single method in your server-side code.

For more information about Notification Hubs, see [Windows Azure Notification Hubs].

<!-- Anchors. -->
[Create an ASP.NET application with authentication]: #create-application
[Update your ASP.NET application to register for notifications]: #register-notification
[Update the app to log in and request registration]: #update-app
[Update your ASP.NET application to send notifications]: #send-notifications

<!-- Images. -->
[0]: ../Media/notification-hub-create-mvc-app.png
[1]: ../Media/notification-hub-create-aspnet-class.png
[2]: ../Media/notification-hub-add-nuget-package.png
[3]: ../Media/notification-hub-add-register-controller2.png
[6]: ../Media/notification-hub-select-hub-connection.png
[7]: ../Media/notification-hub-connection-strings.png
[5]: ../Media/mobile-insert-script-push2.png

<!-- URLs. -->
[Get started Windows Store]: ./getting-started-windowsdotnet.md
[Get started iOS]: ./getting-started-ios.md
[Get started Android]: ./getting-started-android.md
[Get started auth Windows Store]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet/
[Get started auth iOS]: /en-us/develop/mobile/tutorials/get-started-with-users-ios/
[Get started auth Android]: /en-us/develop/mobile/tutorials/get-started-with-users-android/
[Client topic Windows Store C# version]: ./howto-register-user-with-aspnet-windowsdotnet.md 
[Client topic iOS version]: ./howto-register-user-with-mobile-service-ios.md 
[Visual Studio 2012 Express for Windows 8]: http://go.microsoft.com/fwlink/?LinkId=257546
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Create a mobile-friendly REST service using ASP.NET Web API and SQL Database]: /en-us/develop/net/tutorials/rest-service-using-web-api/
[Send cross-platform notifications to users with Notification Hubs]: ./tutorial-notify-users-cross-platform-aspnet.md
[Breaking news .NET]: ./breaking-news-dotnet.md
[Breaking news iOS]: ./breaking-news-dotnet.md
[Windows Azure Notification Hubs]: http://go.microsoft.com/fwlink/p/?LinkId=314257
