<properties urlDisplayName="Notify Windows Store app users by using Web API" pageTitle="Register the current user for push notifications by using Web API - Notification Hubs" metaKeywords="Azure registering application, Notification Hubs, Azure push notifications, push notification Windows Store app" description="Learn how to request push notification registration in a Windows Store app with Azure Notification Hubs when registeration is performed by ASP.NET Web API." metaCanonical="" services="notification-hubs" documentationCenter="" title="Register the current user for push notifications by using ASP.NET" authors="glenga" solutions="" manager="dwrede" editor="" />

<tags ms.service="notification-hubs" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-store" ms.devlang="dotnet" ms.topic="article" ms.date="01/01/1900" ms.author="glenga" />
# Register the current user for push notifications by using ASP.NET

<div class="dev-center-tutorial-selector sublanding">
    <a href="/en-us/documentation/articles/notification-hubs-windows-store-aspnet-register-user-push-notifications/" title="Windows Store C#" class="current">Windows Store C#</a><a href="/en-us/documentation/articles/notification-hubs-ios-aspnet-register-user-push-notifications/" title="iOS">iOS</a>
</div>

This topic shows you how to request push notification registration with Azure Notification Hubs when registration is performed by ASP.NET Web API. This topic extends the tutorial [Notify users with Notification Hubs]. You must have already completed the required steps in that tutorial to create the authenticated mobile service. For more information on the notify users scenario, see [Notify users with Notification Hubs].  

1. In Visual Studio 2012, open the app.xaml.cs file in the project that you created when you completed the prerequisite tutorial [Notify users with Notification Hubs].

2. Locate the **InitNotificationsAsync** method and comment-out the code in the method.

	You will instead use the ASP.NET Web API to register for notifications.

3. In **Solution Explorer**, right-click the project name, and then select **Manage NuGet Packages**.

4. In the left pane, select the **Online** category, search for `json.net`, click **Install** on the **Json.NET** package, then accept the license agreement. 

  	![][0]

  	This adds the third-party Newtonsoft.Json.dll assembly to your project.

3. In Solution Explorer, right-click the project, click **Add** and then **Class**, then type `LocalStorageManager` and click **Add**.

	![][1] 

	This adds code file for the **LocalStorageManager** class to the project.

4. Open the new LocalStorageManager.cs project file and add the following **using** statement:

		using Windows.Storage;

5. Replace the **LocalStorageManager** class definition with the following code:

        class LocalStorageManager
        {
            private static ApplicationDataContainer GetLocalStorageContainer()
            {
                if (!ApplicationData.Current.LocalSettings
                    .Containers.ContainsKey("InstallationContainer"))
                {
                    ApplicationData.Current.LocalSettings
                        .CreateContainer("InstallationContainer",                                                            
                        ApplicationDataCreateDisposition.Always);
                }
                return ApplicationData.Current.LocalSettings
                    .Containers["InstallationContainer"];
            }

            public static string GetInstallationId()
            {
                var container = GetLocalStorageContainer();
                if (!container.Values.ContainsKey("InstallationId"))
                {
                    container.Values["InstallationId"] = Guid.NewGuid().ToString();
                }
                return (string)container.Values["InstallationId"];
            }
        }

	This code creates and stores a device-specific installation ID, which is used as a tag when creating notifications. If an installation ID exists, it is used instead.

6. Open the MainPage.xaml project file, and replace the root **Grid** element with the following XAML code:

        <Grid Background="{StaticResource ApplicationPageBackgroundThemeBrush}">
            <Grid Margin="120, 58, 120, 80" >
                <Grid.RowDefinitions>
                    <RowDefinition />
                    <RowDefinition/>
                    <RowDefinition/>
                    <RowDefinition/>
                    <RowDefinition/>
                </Grid.RowDefinitions>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition MaxWidth="200"/>
                    <ColumnDefinition/>
                </Grid.ColumnDefinitions>
                <TextBlock Grid.Row="0" Grid.Column="0" Grid.ColumnSpan="2"  
	                           TextWrapping="Wrap" Text="Push To Users with Notification Hubs" 
	                           FontSize="42"  VerticalAlignment="Top"/>
                <TextBlock Grid.Row="1" Grid.Column="0" Text="Installation Id:" 
	                           FontSize="24" VerticalAlignment="Center" />
                <TextBlock Grid.Row="1" Grid.Column="1" Name="InstId" FontSize="24" 
	                           VerticalAlignment="Center"/>
                <TextBlock Grid.Row="2" Grid.Column="0" Text="Username:" FontSize="24" 
	                           VerticalAlignment="Center"/>
                <TextBox Grid.Row="2" Grid.Column="1" Name="User" FontSize="24" 
	                         Width="300" Height="40" HorizontalAlignment="Left"/>
                <TextBlock Grid.Row="3" Grid.Column="0" Text="Password:" FontSize="24" 
	                           VerticalAlignment="Center" />
                <PasswordBox Grid.Row="3" Grid.Column="1" Name="Password" FontSize="24" 
	                             Width="300" Height="40" HorizontalAlignment="Left"/>
                <Button Name="Login" Grid.Row="4" Grid.Column="0" Grid.ColumnSpan="2" 
	                        Content="Login and Register for Push" FontSize="24" Click="Login_Click" />
            </Grid>
        </Grid>

	This code creates a UI for collecting a username and password and displaying the installation ID. 

7. Back in the MainPage.xaml.cs file, add the following **using** directives:

		using Newtonsoft.Json;
		using System.Net.Http;
		using System.Text;
		using Windows.Networking.PushNotifications;
		using Windows.UI.Popups;

8. Add the following definition in the **MainPage** class:

		private string registerUri = "https://<SERVICE_ROOT_URL>/api/register";
        
	Replace _`<SERVICE_ROOT_URL>`_ with the root URI of the Web API that you created in **Notify users with Notification Hubs**. 

8. Add the following method to the **MainPage** class:

        private async void Login_Click(object sender, RoutedEventArgs e)
        {
            // Get the info that we need to request registration.
            var installationId = InstId.Text = LocalStorageManager.GetInstallationId();
            var channel = await PushNotificationChannelManager
                .CreatePushNotificationChannelForApplicationAsync();
            var user = User.Text;
            var pwd = Password.Password;

            // Define a registration to pass in the body of the POST request.
            var registration = new Dictionary<string, string>()
                                   {{"platform", "windows"},
                                   {"instId", installationId.ToString()},
                                   {"channelUri", channel.Uri}};

            // Create a client to send the HTTP registration request.
            var client = new HttpClient();
            var request =
                new HttpRequestMessage(HttpMethod.Post, new Uri(registerUri));
            
            // Add the Authorization header with the basic login credentials.
            var auth = "Basic " +
                Convert.ToBase64String(Encoding.UTF8.GetBytes(user + ":" + pwd));
            request.Headers.Add("Authorization", auth);
            request.Content = new StringContent(JsonConvert.SerializeObject(registration),
                Encoding.UTF8, "application/json");

            string message;

            try
            {
                // Send the registration request.
                HttpResponseMessage response = await client.SendAsync(request);

                // Get and display the response, either the registration ID
                // or an error message.
                message = await response.Content.ReadAsStringAsync();
                message = string.Format("Registration ID: {0}", message);
            }
            catch (Exception ex)
            {
                message = ex.Message;
            }

            // Display a message dialog.
            var dialog = new MessageDialog(message);
            dialog.Commands.Add(new UICommand("OK"));
            await dialog.ShowAsync();
        }

	This method gets both an installation ID and channel for push notifications and sends it, along with the device type, to the authenticated Web API method that creates a registration in Notification Hubs. This Web API was defined in [Notify users with Notification Hubs].

Now that the client app has been updated, return to the [Notify users with Notification Hubs] and update the mobile service to send notifications by using Notification Hubs.

<!-- Anchors. -->

<!-- Images. -->
[0]: ./media/notification-hubs-windows-store-aspnet-register-user-push-notifications/notification-hub-add-nuget-package-json.png
[1]: ./media/notification-hubs-windows-store-aspnet-register-user-push-notifications/notification-hub-create-aspnet-class.png

<!-- URLs. -->
[Notify users with Notification Hubs]: /en-us/manage/services/notification-hubs/notify-users-aspnet

[Azure Management Portal]: https://manage.windowsazure.com/
