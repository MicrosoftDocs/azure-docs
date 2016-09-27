
This section shows how to send breaking news as tagged template notifications from a .NET console app.

If you are using Mobile Apps please refer to the [Add push notifications for Mobile Apps](../articles/app-service-mobile/app-service-mobile-windows-store-dotnet-get-started-push.md) tutorial and select your platform at the top. 

If you want to use Java or PHP refer to [How to use Notification Hubs from Java/PHP](../articles/notification-hubs/notification-hubs-java-push-notification-tutorial.md). You can send notifications from any backend using the [Notification Hub REST interface](http://msdn.microsoft.com/library/windowsazure/dn223264.aspx).

Skip steps 1-3 if you created the console app for sending notifications when you completed [Get started with Notification Hubs][get-started].

1. In Visual Studio create a new Visual C# console application: 

   	![][13]

2. In the Visual Studio main menu, click **Tools**, **Library Package Manager**, and **Package Manager Console**, then in the console window type the following and press **Enter**:

        Install-Package Microsoft.Azure.NotificationHubs
 	
	This adds a reference to the Azure Notification Hubs SDK using the <a href="http://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/">Microsoft.Azure.Notification Hubs NuGet package</a>. 

3. Open the file Program.cs and add the following `using` statement:

        using Microsoft.Azure.NotificationHubs;

4. In the `Program` class, add the following method, or replace it if it already exists:

        private static async void SendTemplateNotificationAsync()
        {
			// Define the notification hub.
		    NotificationHubClient hub = 
				NotificationHubClient.CreateClientFromConnectionString(
					"<connection string with full access>", "<hub name>");

            // Create an array of breaking news categories.
            var categories = new string[] { "World", "Politics", "Business", 
											"Technology", "Science", "Sports"};

            // Sending the notification as a template notification. All template registrations that contain 
			// "messageParam" and the proper tags will receive the notifications. 
			// This includes APNS, GCM, WNS, and MPNS template registrations.

            Dictionary<string, string> templateParams = new Dictionary<string, string>();

            foreach (var category in categories)
            {
                templateParams["messageParam"] = "Breaking " + category + " News!";            
                await hub.SendTemplateNotificationAsync(templateParams, category);
            }
		 }

	This code sends a template notification for each of the six tags in the string array. The use of tags makes sure that devices receive notifications only for the registered categories.	

6. In the above code, replace the `<hub name>` and `<connection string with full access>` placeholders with your notification hub name and the connection string for *DefaultFullSharedAccessSignature* from the dashboard of your notification hub.

7. Add the following lines in the **Main** method:

         SendTemplateNotificationAsync();
		 Console.ReadLine();

8. Build the console app.

<!-- Anchors -->
[From a console app]: #console
[From Mobile Services]: #mobile-services
[Run the app and generate notifications]: #test-app

<!-- Images. -->
[13]: ./media/notification-hubs-back-end/notification-hub-create-console-app.png

[15]: ./media/notification-hubs-back-end/notification-hub-scheduler1.png
[16]: ./media/notification-hubs-back-end/notification-hub-scheduler2.png

<!-- URLs. -->
[get-started]: ../articles/notification-hubs/notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md
[Use Notification Hubs to send notifications to users]: ../articles/tutorial-notify-users-mobileservices.md
[Get started with Mobile Services]: /develop/mobile/tutorials/get-started/#create-new-service
[wns object]: http://go.microsoft.com/fwlink/p/?LinkId=260591
[Notification Hubs Guidance]: http://msdn.microsoft.com/library/jj927170.aspx
[Notification Hubs How-To for Windows Store]: http://msdn.microsoft.com/library/jj927172.aspx
[Notification Hubs REST interface]: http://msdn.microsoft.com/library/windowsazure/dn223264.aspx
