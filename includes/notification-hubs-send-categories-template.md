
In this section, you send breaking news as tagged template notifications from a .NET console app.

If you are using the Mobile Apps feature of Microsoft Azure App Service, refer to the [Add push notifications for Mobile Apps] tutorial, and select your platform at the top.

If you want to use Java or PHP, refer to [How to use Notification Hubs from Java or PHP]. You can send notifications from any back end by using the
[Notification Hubs REST interface].

If you created the console app for sending notifications when you completed [Get started with Notification Hubs], skip steps 1-3.

1. In Visual Studio, create a new Visual C# console application:
   
      ![The Console Application link][13]

2. On the Visual Studio main menu, select **Tools** > **Library Package Manager** > **Package Manager Console** and then, in the console window, enter the following string:
   
        Install-Package Microsoft.Azure.NotificationHubs
   
3. Select **Enter**.  
    This action adds a reference to the Azure Notification Hubs SDK by using the [Microsoft.Azure.Notification Hubs NuGet package].

4. Open the Program.cs file, and add the following `using` statement:
   
        using Microsoft.Azure.NotificationHubs;

5. In the `Program` class, add the following method, or replace it if it already exists:
   
        private static async void SendTemplateNotificationAsync()
        {
            // Define the notification hub.
            NotificationHubClient hub =
                NotificationHubClient.CreateClientFromConnectionString(
                    "<connection string with full access>", "<hub name>");
   
            // Create an array of breaking news categories.
            var categories = new string[] { "World", "Politics", "Business",
                                            "Technology", "Science", "Sports"};
   
            // Send the notification as a template notification. All template registrations that contain
            // "messageParam" and the proper tags will receive the notifications.
            // This includes APNS, GCM, WNS, and MPNS template registrations.
   
            Dictionary<string, string> templateParams = new Dictionary<string, string>();
   
            foreach (var category in categories)
            {
                templateParams["messageParam"] = "Breaking " + category + " News!";
                await hub.SendTemplateNotificationAsync(templateParams, category);
            }
         }
   
    This code sends a template notification for each of the six tags in the string array. The use of tags ensures that devices receive notifications only for the registered categories.

5. In the preceding code, replace the `<hub name>` and `<connection string with full access>` placeholders with your notification hub name and the connection string for *DefaultFullSharedAccessSignature* from the dashboard of your notification hub.

6. In the **Main** method, add the following lines:
   
         SendTemplateNotificationAsync();
         Console.ReadLine();

7. Build the console app.

<!-- Images. -->
[13]: ./media/notification-hubs-back-end/notification-hub-create-console-app.png

<!-- URLs. -->
[Get started with Notification Hubs]: ../articles/notification-hubs/notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md
[Notification Hubs REST interface]: http://msdn.microsoft.com/library/windowsazure/dn223264.aspx
[Add push notifications for Mobile Apps]: ../articles/app-service-mobile/app-service-mobile-windows-store-dotnet-get-started-push.md
[How to use Notification Hubs from Java or PHP]: ../articles/notification-hubs/notification-hubs-java-push-notification-tutorial.md
[Microsoft.Azure.Notification Hubs NuGet package]: http://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/
