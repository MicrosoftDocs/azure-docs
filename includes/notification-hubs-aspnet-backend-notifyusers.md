## Create the WebAPI Project

The new ASP.NET WebAPI backend will be updated in the sections that follow and it will have three main purposes:

1. **Authenticating Clients**: A message handler will be added later to authenticate client requests and associate the user with the request.
2. **Client Notification Registrations**: Later, you will add a controller to handle new registrations for a client device to receive notifications. The authenticated user name will automatically be added to the registration as a [tag](https://msdn.microsoft.com/library/azure/dn530749.aspx).
3. **Sending Notifications to Clients**: Later, you will also add a controller to provide a way for a user to trigger a secure push to devices and clients associated with the tag. 

The following steps show how to create the new ASP.NET WebAPI backend: 


> [AZURE.NOTE] **Important**: Before starting this tutorial, please ensure that you have installed the latest version of the NuGet Package Manager. To check, start Visual Studio. From the **Tools** menu, click **Extensions and Updates**. Search for **NuGet Package Manager for Visual Studio 2013**, and make sure you have version 2.8.50313.46 or later. If not, please uninstall, then reinstall the NuGet Package Manager.
> 
> ![][B4]

> [AZURE.NOTE] Make sure you have installed the Visual Studio [Azure SDK](http://azure.microsoft.com/downloads/) for website deployment.

1. Start Visual Studio or Visual Studio Express.
2. In Visual Studio, click **File**, then click **New**, then **Project**, expand **Templates**, **Visual C#**, then click **Web** and **ASP.NET Web Application**, type the name **AppBackend**, and then click **OK**. 
	
	![][B1]

3. In the **New ASP.NET Project** dialog, click **Web API**, then click **OK**.

	![][B2]

4. In the **Configure Azure Site** dialog, choose a subscription, region, and database to use for this project. Enter the password for your account and then click **OK** to create the project.

	![][B5]



## Authenticating Clients to the WebAPI Backend

In this section, you will create a new message handler class named **AuthenticationTestHandler** for the new backend. This class is derived from [DelegatingHandler](https://msdn.microsoft.com/library/system.net.http.delegatinghandler.aspx) and added as a message handler so it can process all requests coming into the backend. 



1. In Solution Explorer, right-click the **AppBackend** project, click **Add**, then click **Class**. Name the new class **AuthenticationTestHandler.cs**, and click **Add** to generate the class. This class will be used to authenticate users using *Basic Authentication*. Note that your app can use any authentication scheme.

2. In AuthenticationTestHandler.cs, add the following `using` statements:

        using System.Net.Http;
        using System.Threading;
        using System.Security.Principal;
        using System.Net;
        using System.Web;

3. In AuthenticationTestHandler.cs, replacing the `AuthenticationTestHandler` class definition with the following code. 

	This handler will handle all requests that include an *Authorization* header. If the request uses *basic* authentication, and the user name string matches the password string, then it will be authorized by the back end. Otherwise, the request will be rejected. This is not a true authentication and authorization approach. It is just a very simple example for this tutorial.

	If the request message is authenticated and authorized by the `AuthenticationTestHandler`, then the basic authentication user will be attached to the current request on the [HttpContext](https://msdn.microsoft.com/library/system.web.httpcontext.current.aspx). User information in the HttpContext will be used by another controller (RegisterController) to add a [tag](https://msdn.microsoft.com/library/azure/dn530749.aspx) to the notification registration request.

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
	                else return Unauthorized();
	            }
	            else return Unauthorized();
	
	            return base.SendAsync(request, cancellationToken);
	        }
	
	        private bool verifyUserAndPwd(string user, string password)
	        {
	            // This is not a real authentication scheme.
	            return user == password;
	        }
	
	        private Task<HttpResponseMessage> Unauthorized()
	        {
	            var response = new HttpResponseMessage(HttpStatusCode.Forbidden);
	            var tsc = new TaskCompletionSource<HttpResponseMessage>();
	            tsc.SetResult(response);
	            return tsc.Task;
	        }
	    }

	> [AZURE.NOTE] **Security Note**: The `AuthenticationTestHandler` class does not provide true authentication. It is used only to mimic basic authentication and is not secure. You must implement a secure authentication mechanism in your production applications and services.				

4. Add the following code at the end of the `Register` method in the **App_Start/WebApiConfig.cs** class to register the message handler:

		config.MessageHandlers.Add(new AuthenticationTestHandler());

5. Save your changes.

## Registering for Notifications using the WebAPI Backend

In this section, we will add a new controller to the WebAPI backend to handle requests to register a user and device for notifications using the client library for notification hubs, which is the Azure Service Bus client library. The controller will add a user tag for the user that was authenticated and attached to the HttpContext by the `AuthenticationTestHandler`. The tag will have the string format, `"username:<actual username>"`.


 

1. In Solution Explorer, right-click the **AppBackend** project and then click **Manage NuGet Packages**.

2. On the left-hand side, click **Online**, and search for **servicebus** in the **Search** box.

3. In the results list, click **Microsoft Azure Service Bus**, and then click **Install**. Complete the installation, then close the NuGet package manager window.

	![][B14]

4. We will now create a new class file that represents the different secure notifications that will be sent. In a complete implementation, the notifications are stored in a database. For simplicity, this tutorial stores them in memory. In the Solution Explorer, right-click the **Models** folder, click **Add**, then click **Class**. Name the new class **Notifications.cs**, then click **Add** to generate the class. 

	![][B6]

5. In Notifications.cs, add the following `using` statement at the top of the file:

        using Microsoft.ServiceBus.Notifications;

6. Replace the `Notifications` class definition with the following and make sure to replace the two placeholders with the connection string (with full access) for your notification hub, and the hub name (available at [Azure Management Portal](http://manage.windowsazure.com)):

		public class Notifications
        {
            public static Notifications Instance = new Notifications();
        
            public NotificationHubClient Hub { get; set; }

            private Notifications() {
                Hub = NotificationHubClient.CreateClientFromConnectionString("<conn string with full access>", "<hub name>");
            }
        }



7. Next we create a new controller, **RegisterController**. In Solution Explorer, right-click the **Controllers** folder, then click **Add**, then click **Controller**. Click the **Web API 2 Controller -- Empty** item, and then click **Add**. Name the new class **RegisterController**, and then click **Add** again to generate the controller.

	![][B7]

	![][B8]

8. In RegisterController.cs, add the following `using` statements:

        using Microsoft.ServiceBus.Notifications;
        using AppBackend.Models;
        using System.Threading.Tasks;
        using Microsoft.ServiceBus.Messaging;
        using System.Web;

9. Add the following code inside the `RegisterController` class definition. Note that in this code, we add a user tag for the user this is attached to the HttpContext. The user was authenticated and attached to the HttpContext by the message filter we added, `AuthenticationTestHandler`. You can also add optional checks to verify that the user has rights to register for the requested tags.

		private NotificationHubClient hub;

        public RegisterController()
        {
            hub = Notifications.Instance.Hub;
        }

        public class DeviceRegistration
        {
            public string Platform { get; set; }
            public string Handle { get; set; }
            public string[] Tags { get; set; }
        }

        // POST api/register
        // This creates a registration id
        public async Task<string> Post(string handle = null)
        {
            string newRegistrationId = null;
            
            // make sure there are no existing registrations for this push handle (used for iOS and Android)
            if (handle != null)
            {
                var registrations = await hub.GetRegistrationsByChannelAsync(handle, 100);

                foreach (RegistrationDescription registration in registrations)
                {
                    if (newRegistrationId == null)
                    {
                        newRegistrationId = registration.RegistrationId;
                    }
                    else
                    {
                        await hub.DeleteRegistrationAsync(registration);
                    }
                }
            }

            if (newRegistrationId == null) 
				newRegistrationId = await hub.CreateRegistrationIdAsync();

            return newRegistrationId;
        }

        // PUT api/register/5
        // This creates or updates a registration (with provided channelURI) at the specified id
        public async Task<HttpResponseMessage> Put(string id, DeviceRegistration deviceUpdate)
        {
            RegistrationDescription registration = null;
            switch (deviceUpdate.Platform)
            {
                case "mpns":
                    registration = new MpnsRegistrationDescription(deviceUpdate.Handle);
                    break;
                case "wns":
                    registration = new WindowsRegistrationDescription(deviceUpdate.Handle);
                    break;
                case "apns":
                    registration = new AppleRegistrationDescription(deviceUpdate.Handle);
                    break;
                case "gcm":
                    registration = new GcmRegistrationDescription(deviceUpdate.Handle);
                    break;
                default:
                    throw new HttpResponseException(HttpStatusCode.BadRequest);
            }

            registration.RegistrationId = id;
            var username = HttpContext.Current.User.Identity.Name;

            // add check if user is allowed to add these tags
            registration.Tags = new HashSet<string>(deviceUpdate.Tags);
            registration.Tags.Add("username:" + username);

            try
            {
                await hub.CreateOrUpdateRegistrationAsync(registration);
            }
            catch (MessagingException e)
            {
                ReturnGoneIfHubResponseIsGone(e);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        // DELETE api/register/5
        public async Task<HttpResponseMessage> Delete(string id)
        {
            await hub.DeleteRegistrationAsync(id);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        private static void ReturnGoneIfHubResponseIsGone(MessagingException e)
        {
            var webex = e.InnerException as WebException;
            if (webex.Status == WebExceptionStatus.ProtocolError)
            {
                var response = (HttpWebResponse)webex.Response;
                if (response.StatusCode == HttpStatusCode.Gone)
                    throw new HttpRequestException(HttpStatusCode.Gone.ToString());
            }
        }

10. Save your changes.

## Sending Notifications from the WebAPI Backend

In this section you add a new controller that exposes a way for client devices to send a notification based on the username tag using Azure Service Bus client library in the ASP.NET WebAPI backend.


1. Create another new controller named **NotificationsController**. Create it the same way you created the **RegisterController** in the previous section.

2. In NotificationsController.cs, add the following `using` statements:

        using AppBackend.Models;
        using System.Threading.Tasks;
        using System.Web;

3. Add the following method to the **NotificationsController** class.

	This code send a notification type based on the Platform Notification Service (PNS) `pns` parameter. The value of `to_tag` is used to set the *username* tag on the message. This tag must match a username tag of an active notification hub registration. The notification message is pulled from the body of the POST request. 

        public async Task<HttpResponseMessage> Post(string pns, [FromBody]string message, string to_tag)
        {
            var user = HttpContext.Current.User.Identity.Name;
            string[] userTag = new string[2];
            userTag[0] = "username:" + to_tag;
            userTag[1] = "from:" + user;

            Microsoft.ServiceBus.Notifications.NotificationOutcome outcome = null;
            HttpStatusCode ret = HttpStatusCode.InternalServerError;

            switch (pns.ToLower())
            {
                case "wns":
                    // Windows 8.1 / Windows Phone 8.1
                    var toast = @"<toast><visual><binding template=""ToastText01""><text id=""1"">" + 
                                "From " + user + ": " + message + "</text></binding></visual></toast>";
                    outcome = await Notifications.Instance.Hub.SendWindowsNativeNotificationAsync(toast, userTag);
                    break;
                case "apns":
                    // iOS
                    var alert = "{\"aps\":{\"alert\":\"" + "From " + user + ": " + message + "\"}}";
                    outcome = await Notifications.Instance.Hub.SendAppleNativeNotificationAsync(alert, userTag);
                    break;
                case "gcm":
                    // Android
                    var notif = "{ \"data\" : {\"message\":\"" + "From " + user + ": " + message + "\"}}";
                    outcome = await Notifications.Instance.Hub.SendGcmNativeNotificationAsync(notif, userTag);
                    break;
            }

            if (outcome != null)
            {
                if (!((outcome.State == Microsoft.ServiceBus.Notifications.NotificationOutcomeState.Abandoned) ||
                    (outcome.State == Microsoft.ServiceBus.Notifications.NotificationOutcomeState.Unknown)))
                {
                    ret = HttpStatusCode.OK;
                }
            }

            return Request.CreateResponse(ret);
        }


4. Press **F5** to run the application and to ensure the accuracy of your work so far. The app should launch a web browser and display the ASP.NET home page. 

##Publish the new WebAPI Backend

1. Now we will deploy this app to an Azure Website in order to make it accessible from all devices. Right-click on the **AppBackend** project and select **Publish**.

2. Select Azure Website as your publish target.

    ![][B15]

3. Log in with your Azure account and select an existing or new Website.

    ![][B16]

4. Make a note of the **destination URL** property in the **Connection** tab. We will refer to this URL as your *backend endpoint* later in this tutorial. Click **Publish**.

    ![][B18]


[B1]: ./media/notification-hubs-aspnet-backend-notifyusers/notification-hubs-secure-push1.png
[B2]: ./media/notification-hubs-aspnet-backend-notifyusers/notification-hubs-secure-push2.png
[B3]: ./media/notification-hubs-aspnet-backend-notifyusers/notification-hubs-secure-push3.png
[B4]: ./media/notification-hubs-aspnet-backend-notifyusers/notification-hubs-secure-push4.png
[B5]: ./media/notification-hubs-aspnet-backend-notifyusers/notification-hubs-secure-push5.png
[B6]: ./media/notification-hubs-aspnet-backend-notifyusers/notification-hubs-secure-push6.png
[B7]: ./media/notification-hubs-aspnet-backend-notifyusers/notification-hubs-secure-push7.png
[B8]: ./media/notification-hubs-aspnet-backend-notifyusers/notification-hubs-secure-push8.png
[B14]: ./media/notification-hubs-aspnet-backend-notifyusers/notification-hubs-secure-push14.png
[B15]: ./media/notification-hubs-aspnet-backend-notifyusers/notification-hubs-notify-users15.PNG
[B16]: ./media/notification-hubs-aspnet-backend-notifyusers/notification-hubs-notify-users16.PNG
[B18]: ./media/notification-hubs-aspnet-backend-notifyusers/notification-hubs-notify-users18.PNG
