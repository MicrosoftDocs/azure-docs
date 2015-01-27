<properties pageTitle="Azure Notification Hubs Notify Users" description="Learn how to send secure push notifications in Azure. Code samples written in C# using the .NET API." documentationCenter="" authors="ggailey777" manager="dwrede" services="notification-hubs" editor=""/>

<tags ms.service="notification-hubs" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows" ms.devlang="dotnet" ms.topic="article" ms.date="11/22/2014" ms.author="glenga"/>

#Azure Notification Hubs Notify Users

<div class="dev-center-tutorial-selector sublanding"> 
    	<a href="/en-us/documentation/articles/notification-hubs-windows-dotnet-notify-users/" title="Windows Universal" class="current">Windows Universal</a><a href="/en-us/documentation/articles/notification-hubs-aspnet-backend-ios-notify-users/" title="iOS">iOS</a>
		<a href="/en-us/documentation/articles/notification-hubs-aspnet-backend-android-notify-users/" title="Android">Android</a>
</div>

Push notification support in Azure enables you to access an easy-to-use, multiplatform, and scaled-out push infrastructure, which greatly simplifies the implementation of push notifications for both consumer and enterprise applications for mobile platforms. This tutorial shows you how to use Azure Notification Hubs to send push notifications to a specific app user on a specific device. An ASP.NET WebAPI backend is used to authenticate clients and to generate notifications, as shown in the guidance topic [Registering from your app backend](http://msdn.microsoft.com/en-us/library/dn743807.aspx). This tutorial builds on the notification hub that you created in the **Get started with Notification Hubs** tutorial.

This tutorial is also the prerequisite to the **Secure Push** tutorial. After you have completed the steps in this **Notify Users** tutorial, you can proceed to the **Secure Push** tutorial, which shows how to modify the **Notify Users** code to send a push notification securely. 

> [AZURE.NOTE] This tutorial assumes that you have created and configured your notification hub as described in [Getting Started with Notification Hubs (Windows Store)](http://azure.microsoft.com/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/).
> If you are using Mobile Services as your backend service, see the [Mobile Services version](/en-us/documentation/articles/mobile-services-javascript-backend-windows-store-dotnet-push-notifications-app-users/) of this tutorial.
>Also note that in this tutorial you will create a Windows Phone Store 8.1 app. The same code can be used for Windows Store and Windows Universal apps. All of these apps have to use Windows (not Windows Phone) credentials.

## Create and Configure the Notification Hub

Before you begin this tutorial, you must reserve an application name, then create an Azure Notification Hub and connect it to that application. Please follow the steps in [Getting Started with Notification Hubs (Windows Store)](http://azure.microsoft.com/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/); specifically, the sections [Register your app for the Windows Store](http://azure.microsoft.com/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/#register) and [Configure your Notification Hub](http://azure.microsoft.com/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/#configure-hub). In particular, make sure that you have entered the **Package SID** and **Client Secret** values in the portal, in the **Configure** tab for your notification hub. This configuration procedure is described in the section [Configure your Notification Hub](http://azure.microsoft.com/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/#configure-hub). This is an important step: if the credentials on the portal do not match those specified for the app name you choose, the push notification will not succeed.

[AZURE.INCLUDE [notification-hubs-aspnet-backend-notifyusers](../includes/notification-hubs-aspnet-backend-notifyusers.md)]

## Create the Windows Phone Project

The next step is to create the Windows Phone application. To add this project to the current solution, do the following:

1. In Solution Explorer, right-click the top-level node of the solution (**Solution NotifyUsers** in this case), then click **Add**, then click **New Project**.

2. Expand **Store Apps**, then click **Windows Phone Apps**, then click **Blank App (Windows Phone)**.

	![][9]

3. In the **Name** box, type **NotifyUserWindowsPhone**, then click **OK** to generate the project.

 
4. Associate this application with the Windows Phone Store: in Solution Explorer, right-click **NotifyUserWindowsPhone (Windows Phone 8.1)**, then click **Store**, and then click **Associate App with the Store...**.

	![][10]
 
5. Follow the steps in the wizard to sign in and associate the app with the Store.

	![][11]
	
	> [AZURE.NOTE] Be sure to make a note of the name of the application you choose during this procedure. You must configure the notification hub on the portal using the credentials you obtain from the [Windows Dev Center](http://go.microsoft.com/fwlink/p/?linkid=266582&clcid=0x409) for this specific reserved app name. This configuration procedure is described in [Configure your Notification Hub](http://azure.microsoft.com/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/#configure-hub). This is an important step: if the credentials on the portal do not match those specified for the app name you choose, the push notification will not succeed.

6. In Solution Explorer, right-click the **NotifyUserWindowsPhone (Windows Phone 8.1)** project and then click **Manage NuGet Packages**.

7. On the left-hand side, click **Online**.

8. In the **Search** box, type **Http Client**.

9. In the results list, click **Microsoft HTTP Client Libraries**, and then click **Install**. Complete the installation.

10. Back in the NuGet **Search** box, type **Json.net**. Install the **Json.NET** package, and then close the NuGet Package Manager window.

11. In Solution Explorer, in the **NotifyUserWindowsPhone (Windows Phone 8.1)** project, double-click **MainPage.xaml** to open it in the Visual Studio editor.

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
	
            	    <Button Grid.Row="4" HorizontalAlignment="Center" VerticalAlignment="Center" Content="1. Login and register" Click="LoginAndRegisterClick" />

            	    <Button Grid.Row="5" HorizontalAlignment="Center" VerticalAlignment="Center" Content="2. Send push" Click="PushClick" />
            	</Grid>
        	</StackPanel>
    	</Grid>


13. In Solution Explorer, right-click the **NotifyUserWindowsPhone (Windows Phone 8.1)** project, then click **Add**, and then click **Class**. Name the class **RegisterClient.cs**, then click **OK** to generate the class. This component implements the REST calls required to contact the app backend, in order to register for push notifications. It also locally stores the *registrationIds* created by the Notification Hub as detailed in [Registering from your app backend](http://msdn.microsoft.com/en-us/library/dn743807.aspx). Note that it uses an authorization token stored in local storage when you click the **Log in and register** button.

14. Add the following code inside the `RegisterClient` class definition. Be sure to replace `{backend endpoint}` with the your backend endpoint obtained in the previous section:

		private string POST_URL = "{backend endpoint}/api/register";

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
		
16. Add code for buttons in MainPage.xaml.cs. The callback for **Log in and register** stores the basic authentication token in local storage (note that this represents any token your authentication scheme uses), then uses `RegisterClient` to call the backend. The callback for **AppBackend** calls the backend to trigger a secure notification to all devices of this user. 

	Add the following code to MainPage.xaml.cs after the `OnNavigatedTo()` method. Be sure to replace `{backend endpoint}` with the backend endpoint obtained in the previous section:

		private async void PushClick(object sender, RoutedEventArgs e)
        {
            var POST_URL = "{backend endpoint}/api/notifications";

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

## Run the Application

To run the application, do the following:

1. In Visual Studio, run the **NotifyUserWindowsPhone (Windows Phone 8.1)** Windows Phone app. The Windows Phone emulator runs and loads the app automatically.

2. In the **NotifyUserWindowsPhone** app UI, enter a username and password. These can be any string, but they must be the same value.

3. In the **NotifyUserWindowsPhone** app UI, click **Log in and register**. Then click **Send push**.


[9]: ./media/notification-hubs-aspnet-backend-windows-dotnet-notify-users/notification-hubs-secure-push9.png
[10]: ./media/notification-hubs-aspnet-backend-windows-dotnet-notify-users/notification-hubs-secure-push10.png
[11]: ./media/notification-hubs-aspnet-backend-windows-dotnet-notify-users/notification-hubs-secure-push11.png
[12]: ./media/notification-hubs-aspnet-backend-windows-dotnet-notify-users/notification-hubs-secure-push12.png
[13]: ./media/notification-hubs-aspnet-backend-windows-dotnet-notify-users/notification-hubs-secure-push13.png
