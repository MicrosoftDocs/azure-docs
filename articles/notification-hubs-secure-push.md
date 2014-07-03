<properties title="Azure Notification Hubs Secure Push" pageTitle="Azure Notification Hubs Secure Push" metaKeywords="Azure push notifications, Azure notification hubs, Azure messaging, secure push" description="Learn how to send secure push notifications in Azure. Code samples written in C# using the .NET API." documentationCenter="Mobile" metaCanonical="" disqusComments="1" umbracoNaviHide="0" authors="sethm" />

#Azure Notification Hubs Secure Push

Push notification support in Azure enables you to access an easy-to-use, multiplatform, and scaled-out push infrastructure, which greatly simplifies the implementation of push notifications for both consumer and enterprise applications for mobile platforms. 

Due to regulatory or security constraints, sometimes an application might want to include something in the notification that cannot be transmitted through the standard push notification infrastructure. This tutorial describes how to achieve the same experience by sending sensitive information through a secure, authenticated connection between the client device and the app backend.

At a high level, the flow is as follows:

1. The app back-end:
	- Stores secure payload in back-end database.
	- Sends the ID of this notification to the device (no secure information is sent).
2. The app on the device, when receiving the notification:
	- The device contacts the back-end requesting the secure payload.
	- The app can show the payload as a notification on the device.

It is important to note that in the preceding flow (and in this tutorial), we assume that the device stores an authentication token in local storage, after the user logs in. This guarantees a completely seamless experience, as the device can retrieve the notification’s secure payload using this token. If your application does not store authentication tokens on the device, or these tokens can be expired, the device app, upon receiving the notification, should display a generic notification prompting the user to launch the app, which results in authenticating the user and showing the notification payload.

Note that this tutorial also implements user authentication as explained in [Registering from your app backend](http://msdn.microsoft.com/en-us/library/dn743807.aspx).

> [AZURE.NOTE] This tutorial assumes that you have created and configured your notification hub as described in [Getting Started with Notification Hubs (Windows Store)](http://azure.microsoft.com/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/).

> [AZURE.NOTE] Windows Phone 8.1 requires Windows (not Windows Phone) credentials.

> [AZURE.NOTE] Background tasks do not work on Windows Phone 8.0 or Silverlight 8.1. For Windows Store applications, you can receive notifications via a background task only if the app is lock-screen enabled (click the checkbox in the Appmanifest).

## Create and Configure the Notification Hub

Before you begin this tutorial, you must reserve an application name, then create an Azure Notification Hub and connect it to that application. Please follow the steps in [Getting Started with Notification Hubs (Windows Store)](http://azure.microsoft.com/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/); specifically, the sections [Register your app for the Windows Store](http://azure.microsoft.com/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/#register) and [Configure your Notification Hub](http://azure.microsoft.com/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/#configure-hub). In particular, make sure that you have configured the **Package SID** and **Client Secret** values on your Notification Hub **Configure** tab in the portal. This configuration procedure is described in the section [Configure your Notification Hub](http://azure.microsoft.com/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/#configure-hub).

## Create the WebAPI Project

The first step is to create an ASP.NET WebAPI project.

> [AZURE.NOTE] **Important**: before starting this tutorial, please ensure that you have installed the latest version of the NuGet Package Manager. To check, start Visual Studio. From the **Tools** menu, click **Extensions and Updates**. Search for **NuGet Package Manager for Visual Studio 2013**, and make sure you have version 2.8.50313.46 or later. If not, please uninstall, then reinstall the NuGet Package Manager.
> 
> ![][4]

1. Start Visual Studio with elevated privileges (run as Administrator).
2. In Visual Studio or Visual Studio Express, click **File**, then click **New**, then **Project**, expand **Templates**, **Visual C#**, then click **Web** and **ASP.NET Web Application**, type the name **SecurePush**, and then click **OK**. 
	
	![][1]

2. In the **New ASP.NET Project** dialog, click **Web API**, then click **OK**.

	![][2]

3. In the **Configure Azure Site** dialog, choose a subscription, region, and database to use for this project. Then click **OK** to create the project. 

	![][5]

4. In Solution Explorer, right-click the **SecurePush** project and then click **Manage NuGet Packages**.

5. On the left-hand side, click **Online**.

6. In the **Search** box, type **servicebus**.

7. In the results list, click **Windows Azure Service Bus**, and then click **Install**. Complete the installation, then close the NuGet package manager window.

	![][14]

8. In Solution Explorer, right-click the **Models** folder, then click **Add**, then click **Class**. Name the new class **Notifications.cs**. Click **Add** to generate the class. This module represents the different secure notifications that will be sent. In a complete implementation, the notifications are stored in a database. In this case, for simplicity we store them in memory.

	![][6]

9. Add code to Notifications.cs, replacing the `Notifications` class definition with the following:

	    public class Notification
	    {
	        public int Id { get; set; }
	        public string Payload { get; set; }
	        public bool Read { get; set; }
	    }
	    
	    public class Notifications
	    {
	        public static Notifications Instance = new Notifications();
	        
	        private List<Notification> notifications = new List<Notification>();
	
	        public NotificationHubClient Hub { get; set; }
	
	        private Notifications() {
	            Hub = NotificationHubClient.CreateClientFromConnectionString("{conn string with full access}", "{hub name}");
	        }
	
	        public Notification CreateNotification(string payload)
	        {
	            var notification = new Notification() {
	                Id = notifications.Count,
	                Payload = payload,
	                Read = false
	            };
	
	            notifications.Add(notification);
	
	            return notification;
	        }
	
	        public Notification ReadNotification(int id)
	        {
	            return notifications.ElementAt(id);
	        }
	    }

10. Add the following `using` statement at the top of the file:

		using Microsoft.ServiceBus.Notifications;

11. In the `Notifications()` method, replace the two placeholders in the following line of code with the connection string (with full access) for your notification hub, and the hub name. You can obtain these values from the [Azure Management Portal](http://manage.windowsazure.com):

		Hub = NotificationHubClient.CreateClientFromConnectionString("{conn string with full access}", "{hub name}");

12. In Solution Explorer, right-click the **SecurePush** project, then click **Add**, then click **Class**. Name the new class **AuthenticationTestHandler.cs**. Click **Add** to generate the class. This class is used to authenticate users using *Basic Authentication*. Note that your app can use any authentication scheme.

13. Add code to AuthenticationTestHandler.cs, replacing the `AuthenticationTestHandler` class definition with the following:

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
	            }
	            else return Unauthorised();
	
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

	> [AZURE.NOTE] **Security Note**: The `AuthenticationTestHandler` class does not provide true authentication. It is used only to mimic basic authentication and return a principle. The user name is required to create Notification Hub registrations. The preceding implementation is not secure. You must implement a secure authentication mechanism in your production applications and services.

14. Add the following `using` statements at the top of the AuthenticationTestHandler.cs file:

		using System.Net.Http;
		using System.Threading.Tasks;
		using System.Threading;
		using System.Text;
		using System.Security.Principal;
		using System.Net;				

14. Add the following code at the end of the `Register` method in the **App_Start/WebApiConfig.cs** class:

		config.MessageHandlers.Add(new AuthenticationTestHandler());

15. In Solution Explorer, right-click the **Controllers** folder, then click **Add**, then click **Controller**. Click the **Web API 2 Controller -- Empty** item, and then click **Add**. 

	![][7]

16. Name the new class **RegisterController**, and then click **Add** again to generate the controller.

	![][8]
	  
16. Add the following code inside the `RegisterController` class definition:

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
        public async Task<string> Post()
        {
            return await hub.CreateRegistrationIdAsync();
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

17. Add the following `using` statements at the top of the RegisterController.cs file:

		using Microsoft.ServiceBus.Notifications;
		using SecurePush.Models;
		using System.Threading.Tasks;
		using Microsoft.ServiceBus.Messaging;
		using System.Web;
		
18. Note that in this code, we add the user tag for the user that has been authenticated by the handler. You can also add optional checks to verify that the user has rights to register for the requested tags.

19. In Solution Explorer, right-click the **Controllers** folder, then click **Add**, then click **Controller**. Click the **Web API 2 Controller -- Empty** item, and then click **Add**. Name the new class **NotificationsController**, and then click **Add** again to generate the controller. This component exposes a way for the device to retrieve the notification securely, and also it provides a way (for the purposes of this tutorial) for a user to trigger a secure push to his or her devices. Note that when sending the notification to the Notification Hub, we send a raw notification with only the ID of the notification (no actual message).

20. Add the following code inside the **NotificationsController** class definition:

		public NotificationsController()
        {
            Notifications.Instance.CreateNotification("This is a secure notification!");
        }

        // GET api/notifications/id
        public Notification Get(int id)
        {
            return Notifications.Instance.ReadNotification(id);
        }

        public async Task<HttpResponseMessage> Post()
        {
            var secureNotificationInTheBackend = Notifications.Instance.CreateNotification("Secure confirmation.");
            var rawNotificationToBeSent = new Microsoft.ServiceBus.Notifications.WindowsNotification(secureNotificationInTheBackend.Id.ToString(),
                new Dictionary<string, string> {
                    {"X-WNS-Type", "wns/raw"}
            });
            var usernameTag = "username:" + HttpContext.Current.User.Identity.Name;
            await Notifications.Instance.Hub.SendNotificationAsync(rawNotificationToBeSent, usernameTag);

            return Request.CreateResponse(HttpStatusCode.OK);
        }

21. Add the following `using` statements at the top of the NotificationsController.cs file:

		using SecurePush.Models;
		using System.Threading.Tasks;
		using System.Web;

22. Press **F5** to run the application and to ensure the accuracy of your work so far. The app should launch a web browser and display the ASP.NET home page. **Important**: make a note of the *localhost* port in the URL of this web page, as it is required later in this tutorial.

## Create the Windows Phone Project

The next step is to create the Windows Phone application. To add this project to the current solution, do the following:

1. In Solution Explorer, right-click the top-level node of the solution (**Solution SecurePush** in this case), then click **Add**, then click **New Project**.

2. Expand **Store Apps**, then click **Windows Phone Apps**, then click **Blank App (Windows Phone)**.

	![][9]

3. In the **Name** box, type **SecurePushWindowsPhone**, then click **OK** to generate the project.

 
4. Associate this application with the Windows Phone Store: in Solution Explorer, right-click **SecurePushWindowsPhone (Windows Phone 8.1)**, then click **Store**, and then click **Associate App with the Store...**.

	![][10]
 
5. Follow the steps in the wizard to sign in and associate the app with the Store.

	![][11]
	
	> [AZURE.NOTE] Be sure to make a note of the name of the application you choose during this procedure. You must configure the notification hub on the portal using the credentials you obtain from the [Windows Dev Center](http://go.microsoft.com/fwlink/p/?linkid=266582&clcid=0x409) for this specific reserved app name. This configuration procedure is described in [Configure your Notification Hub](http://azure.microsoft.com/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/#configure-hub). This is an important step: if the credentials on the portal do not match those specified for the app name you choose, the push notification may not be received.

6. In Solution Explorer, right-click the **SecurePushWindowsPhone (Windows Phone 8.1)** project and then click **Manage NuGet Packages**.

7. On the left-hand side, click **Online**.

8. In the **Search** box, type **Http Client**.

9. In the results list, click **Microsoft HTTP Client Libraries**, and then click **Install**. Complete the installation.

10. Back in the NuGet **Search** box, type **Json.net**. Install the **Json.NET** package, and then close the NuGet Package Manager window.

11. In Solution Explorer, in the **SecurePushWindowsPhone (Windows Phone 8.1)** project, double-click **MainPage.xaml** to open it in the Visual Studio editor.

12. In the **MainPage.xaml** XML code, replace the `<Grid>` section with the following code:

		<Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
        </Grid.RowDefinitions>

        <TextBlock Grid.Row="0" Text="Secure Push" HorizontalAlignment="Center" FontSize="48"/>

        <StackPanel Grid.Row="1" VerticalAlignment="Center">
            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto"/>
                    <RowDefinition Height="Auto"/>
                    <RowDefinition Height="Auto"/>
                    <RowDefinition Height="Auto"/>
                    <RowDefinition Height="Auto"/>
                    <RowDefinition Height="*"/>
                </Grid.RowDefinitions>
                <TextBlock Grid.Row="0" Text="Username" FontSize="24" Margin="20,0,20,0"/>
                <TextBox Name="UsernameTextBox" Grid.Row="1" Margin="20,0,20,0"/>
                <TextBlock Grid.Row="2" Text="Password" FontSize="24" Margin="20,0,20,0" />
                <PasswordBox Name="PasswordTextBox" Grid.Row="3" Margin="20,0,20,0"/>

                <Button Grid.Row="4" HorizontalAlignment="Center" VerticalAlignment="Center" Content="1. Log in and register" Click="LoginAndRegisterClick" />

                <Button Grid.Row="5" HorizontalAlignment="Center" VerticalAlignment="Center" Content="2. Send secure push" Click="SecurePushClick" />
            </Grid>
        </StackPanel>
    </Grid>

13. In Solution Explorer, right-click the **SecurePushWindowsPhone (Windows Phone 8.1)** project, then click **Add**, and then click **Class**. Name the class **RegisterClient.cs**, then click **OK** to generate the class. This component implements the REST calls required to contact the app backend, in order to register for push notifications. It also locally stores the *registrationIds* created by the Notification Hub as detailed in [link to SMDN registering from back-end]. Note that it uses an authorization token stored in local storage when you click the **Log in and register** button.

14. Add the following code inside the `RegisterClient` class definition. Be sure to replace `[yourPortNum]` with the number of your localhost port:

		private string POST_URL = "http://localhost:[yourPortNum]/api/register";

        private class DeviceRegistration
        {
            public string Platform { get; set; }
            public string Handle { get; set; }
            public string[] Tags { get; set; }
        }

        public async Task RegisterAsync(string handle, IEnumerable<string> tags)
        {
            var regId = await RetrieveRegistrationIdOrRequestNewOneAsync();

            var deviceRegistration = new DeviceRegistration
            {
                Platform = "wns",
                Handle = handle,
                Tags = tags.ToArray<string>()
            };

            var statusCode = await UpdateRegistrationAsync(regId, deviceRegistration);

            if (statusCode == HttpStatusCode.Gone)
            {
                // regId is expired, deleting from local storage & recreating
                var settings = ApplicationData.Current.LocalSettings.Values;
                settings.Remove("__NHRegistrationId");
                regId = await RetrieveRegistrationIdOrRequestNewOneAsync();
                statusCode = await UpdateRegistrationAsync(regId, deviceRegistration);
            }

            if (statusCode != HttpStatusCode.Accepted)
            {
                // log or throw
            }
        }

        private async Task<HttpStatusCode> UpdateRegistrationAsync(string regId, DeviceRegistration deviceRegistration)
        {
            using (var httpClient = new HttpClient())
            {
                var settings = ApplicationData.Current.LocalSettings.Values;
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", (string) settings["AuthenticationToken"]);

                var putUri = POST_URL + "/" + regId;

                string json = JsonConvert.SerializeObject(deviceRegistration);
                                var response = await httpClient.PutAsync(putUri, new StringContent(json, Encoding.UTF8, "application/json"));
                return response.StatusCode;
            }
        }

        private async Task<string> RetrieveRegistrationIdOrRequestNewOneAsync()
        {
            var settings = ApplicationData.Current.LocalSettings.Values;
            if (!settings.ContainsKey("__NHRegistrationId"))
            {
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", (string)settings["AuthenticationToken"]);

                    var response = await httpClient.PostAsync(POST_URL, new StringContent(""));
                    if (response.IsSuccessStatusCode)
                    {
                        string regId = await response.Content.ReadAsStringAsync();
                        regId = regId.Substring(1, regId.Length - 2);
                        settings.Add("__NHRegistrationId", regId);
                    }
                    else
                    {
                        throw new Exception();
                    }
                }
            }
            return (string)settings["__NHRegistrationId"];

        }

15. Add the following `using` statements at the top of the RegisterClient.cs file:

		using Windows.Storage;
		using System.Net;
		using System.Net.Http;
		using System.Net.Http.Headers;
		using Newtonsoft.Json;
		
16. Add code for buttons in MainPage.xaml.cs. The callback for **Log in and register** stores the basic authentication token in local storage (note that this represents any token your authentication scheme uses), then uses `RegisterClient` to call the backend. The callback for **SecurePush** calls the backend to trigger a secure notification to all devices of this user. 

	Add the following code to MainPage.xaml.cs after the `OnNavigatedTo()` method. Be sure to replace `[yourPortNum]` with the number of your localhost port:

		private async void SecurePushClick(object sender, RoutedEventArgs e)
        {
            var POST_URL = "http://localhost:[yourPortNum]/api/notifications";

            using (var httpClient = new HttpClient())
            {
                var settings = ApplicationData.Current.LocalSettings.Values;
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", (string) settings["AuthenticationToken"]);

                await httpClient.PostAsync(POST_URL, new StringContent(""));
            }
        }

        private async void LoginAndRegisterClick(object sender, RoutedEventArgs e)
        {
            SetAuthenticationTokenInLocalStorage();
            
            var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
            await new RegisterClient().RegisterAsync(channel.Uri, new string[] { "myTag" });

            var dialog = new MessageDialog("Registered as: " + UsernameTextBox.Text);
            dialog.Commands.Add(new UICommand("OK"));
            await dialog.ShowAsync();
        }

        private void SetAuthenticationTokenInLocalStorage()
        {
            string username = UsernameTextBox.Text;
            string password = PasswordTextBox.Password;
            
            var token = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(username + ":" + password));
            ApplicationData.Current.LocalSettings.Values["AuthenticationToken"] = token;
        }

17. Add the following `using` statements at the top of the MainPage.xaml.cs file:

		using System.Net.Http;
		using Windows.Storage;
		using System.Net.Http.Headers;
		using Windows.Networking.PushNotifications;
		using Windows.UI.Popups;

18. Add code to App.xaml.cs to register the push background task. Add the following two lines of code at the end of the `OnLaunched()` method:

		InitNotificationsAsync();

		RegisterBackgroundTask();

19. Still in App.xaml.cs, add the following code immediately after the `OnLaunched()` method:

		private async void RegisterBackgroundTask()
        {
            if (!Windows.ApplicationModel.Background.BackgroundTaskRegistration.AllTasks.Any(i => i.Value.Name == "PushBackgroundTask"))
            {
                var result = await BackgroundExecutionManager.RequestAccessAsync();
                var builder = new BackgroundTaskBuilder();

                builder.Name = "PushBackgroundTask";
                builder.TaskEntryPoint = typeof(PushBackgroundComponent.PushBackgroundTask).FullName;
                builder.SetTrigger(new Windows.ApplicationModel.Background.PushNotificationTrigger());
                BackgroundTaskRegistration task = builder.Register();
            }
        }

        private async void InitNotificationsAsync()
        {
        }

20. Add the following `using` statements at the top of the App.xaml.cs file:

		using Windows.Networking.PushNotifications;
		using Windows.ApplicationModel.Background;

21. From the **File** menu in Visual Studio, click **Save All**.
		
## Create the Push Background Component

The next step is to create the push background component.

1. In Solution Explorer, right-click the top-level node of the solution (**Solution SecurePush** in this case), then click **Add**, then click **New Project**.

2. Expand **Store Apps**, then click **Windows Phone Apps**, then click **Windows Runtime Component (Windows Phone)**. Name the project **PushBackgroundComponent**, and then click **OK** to create the project.

	![][12]

3. In Solution Explorer, right-click the **PushBackgroundComponent (Windows Phone 8.1)** project, then click **Add**, then click **Class**. Name the new class **PushBackgroundTask.cs**. Click **Add** to generate the class.

4. Replace the entire contents of the **PushBackgroundComponent** namespace definition with the following code. Be sure to replace `[yourPortNum]` with the number of your localhost port:

		public sealed class Notification
	    {
	        public int Id { get; set; }
	        public string Payload { get; set; }
	        public bool Read { get; set; }
	    }
	    
	    public sealed class PushBackgroundTask : IBackgroundTask
	    {
	        private string GET_URL = "http://localhost:[yourPortNum]/api/notifications/";
	
	        async void IBackgroundTask.Run(IBackgroundTaskInstance taskInstance)
	        {
	            // Store the content received from the notification so it can be retrieved from the UI.
	            RawNotification raw = (RawNotification)taskInstance.TriggerDetails;
	            var notificationId = raw.Content;
	
	            // retrieve content
	            BackgroundTaskDeferral deferral = taskInstance.GetDeferral();
	            var httpClient = new HttpClient();
	            var settings = ApplicationData.Current.LocalSettings.Values;
	            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", (string)settings["AuthenticationToken"]);
	
	            var notificationString = await httpClient.GetStringAsync(GET_URL + notificationId);
	
	            var notification = JsonConvert.DeserializeObject<Notification>(notificationString);
	
	            ShowToast(notification);
	
	            deferral.Complete();
	        }
	
	        private void ShowToast(Notification notification)
	        {
	            ToastTemplateType toastTemplate = ToastTemplateType.ToastText01;
	            XmlDocument toastXml = ToastNotificationManager.GetTemplateContent(toastTemplate);
	            XmlNodeList toastTextElements = toastXml.GetElementsByTagName("text");
	            toastTextElements[0].AppendChild(toastXml.CreateTextNode(notification.Payload));
	            ToastNotification toast = new ToastNotification(toastXml);
	            ToastNotificationManager.CreateToastNotifier().Show(toast);
	        }
	    }

5. In Solution Explorer, right-click the **PushBackgroundComponent (Windows Phone 8.1)** project and then click **Manage NuGet Packages**.

6. On the left-hand side, click **Online**.

7. In the **Search** box, type **Http Client**.

8. In the results list, click **Microsoft HTTP Client Libraries**, and then click **Install**. Complete the installation.

9. Back in the NuGet **Search** box, type **Json.net**. Install the **Json.NET** package, then close the NuGet Package Manager window.

10. Add the following `using` statements at the top of the **PushBackgroundTask.cs** file:

		using Windows.ApplicationModel.Background;
		using Windows.Networking.PushNotifications;
		using System.Net.Http;
		using Windows.Storage;
		using System.Net.Http.Headers;
		using Newtonsoft.Json;
		using Windows.UI.Notifications;
		using Windows.Data.Xml.Dom;

11. In Solution Explorer, in the **SecurePushWindowsPhone (Windows Phone 8.1)** project, right-click **References**, then click **Add Reference...**. In the Reference Manager dialog, check the box next to **PushBackgroundComponent**, and then click **OK**.

12. In Solution Explorer, double-click **Package.appxmanifest** in the **SecurePushWindowsPhone (Windows Phone 8.1)** project. Under **Notifications**, set **Toast Capable** to **Yes**.

	![][3]

13. Still in **Package.appxmanifest**, click the **Declarations** menu near the top. In the **Available Declarations** dropdown, click **Background Tasks**, and then click **Add**.
 
14. In **Package.appxmanifest**, under **Properties**, check **Push notification**.

15. In **Package.appxmanifest**, under **App Settings**, type **PushBackgroundComponent.PushBackgroundTask** in the **Entry Point** field.

	![][13]

16. From the **File** menu, click **Save All**.

## Run the Application

To run the application, do the following:

1. In Visual Studio, run the **SecurePush** Web API application. An ASP.NET web page is displayed.

2. In Visual Studio, run the **SecurePushWindowsPhone (Windows Phone 8.1)** Windows Phone app. The Windows Phone emulator runs and loads the app automatically.

3. In the **SecurePushWindowsPhone** app UI, enter a username and password. These can be any string, but they must be the same value.

4. In the **SecurePushWindowsPhone** app UI, click **Log in and register**. Then click **Send secure push**.

[1]: ./media/notification-hubs-secure-push/notification-hubs-secure-push1.png
[2]: ./media/notification-hubs-secure-push/notification-hubs-secure-push2.png
[3]: ./media/notification-hubs-secure-push/notification-hubs-secure-push3.png
[4]: ./media/notification-hubs-secure-push/notification-hubs-secure-push4.png
[5]: ./media/notification-hubs-secure-push/notification-hubs-secure-push5.png
[6]: ./media/notification-hubs-secure-push/notification-hubs-secure-push6.png
[7]: ./media/notification-hubs-secure-push/notification-hubs-secure-push7.png
[8]: ./media/notification-hubs-secure-push/notification-hubs-secure-push8.png
[9]: ./media/notification-hubs-secure-push/notification-hubs-secure-push9.png
[10]: ./media/notification-hubs-secure-push/notification-hubs-secure-push10.png
[11]: ./media/notification-hubs-secure-push/notification-hubs-secure-push11.png
[12]: ./media/notification-hubs-secure-push/notification-hubs-secure-push12.png
[13]: ./media/notification-hubs-secure-push/notification-hubs-secure-push13.png
[14]: ./media/notification-hubs-secure-push/notification-hubs-secure-push14.png