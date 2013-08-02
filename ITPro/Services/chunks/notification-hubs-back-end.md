

You can send notifications using notification hubs from any back-end using the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dn223264.aspx">REST interface</a>. 

This section shows how to send notifications in two different ways:

- using a console app
- using a Mobile Services script

We also include the needed code to broadcast to both Windows Store and iOS devices, since the backend can broadcast to any of the supported devices



## To send notifications using a C# console app ##

1. In Visual Studio create a new Visual C# console application: 

   ![][13]

2. Add a reference to the Windows Azure Service Bus SDK with the <a href="http://nuget.org/packages/WindowsAzure.ServiceBus/">WindowsAzure.ServiceBus NuGet package</a>. In the Visual Studio main menu, click **Tools**, then click **Library Package Manager**, then click **Package Manager Console**. Then, in the console window type the following:

        Install-Package WindowsAzure.ServiceBus

    then press **Enter**.

3. Open the file Program.cs and add the following `using` statement:

        using Microsoft.ServiceBus.Notifications;

4. In the `Program` class, add the following method:

        private static async void SendNotificationAsync()
        {
		    NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString("<connection string with full access>", "<hub name>");
		
            var categories = new string[] { "World", "Politics", "Business", "Technology", "Science", "Sports"};
            foreach (var category in categories) {
                var toast = @"<toast><visual><binding template=""ToastText02""><text id=""1"">" + "Breaking " + category + " News!" + "</text></binding></visual></toast>";
                await hub.SendWindowsNativeNotificationAsync(toast, category);

                var alert = "{\"aps\":{\"alert\":\"Breaking "+ category +" News!\"}}";
                await hub.SendAppleNativeNotificationAsync(alert, category);
            }
		 }

   Make sure to insert the name of your hub and the connection string called **DefaultFullSharedAccessSignature** that you obtained in the section "Configure your Notification Hub." Note that this is the connection string with **Full** access, not **Listen** access.

Note that this code sends one notification for each of 6 tags. Your device will only receive notitications for the ones you have registered for.

Also note the last line of code sends an alert to an iOS device. this shows how a single notification hub can push notifications to multiple device types. In this line, replace the category placeholder with any one of the category tags that we used in our client apps ("World", "Politics", "Business", "Technology", "Science", "Sports").

7. Then add the following lines in the `Main` method:

         SendNotificationAsync();
		 Console.ReadLine();

8. Press the **F5** key to run the app. You should receive a toast notification for each category that you registered for.

   ![][14]

## Mobile Services ##

To send a notification using a Mobile Service, follow [Get started with Mobile Services], then do the following:

1. Log on to the [Windows Azure Management Portal], and click your Mobile Service.

2. Select the tab **Scheduler** on the top.

   ![][15]

3. Create a new scheduled job, insert a name, and then click **On demand**.

   ![][16]

4. When the job is created, click the job name. Then click the **Script** tab in the top bar.

5. Insert the following script inside your scheduler function. Make sure to replace the placeholders with your notification hub name and the connection string for *DefaultFullSharedAccessSignature* that you obtained earlier. When you are finished, click **Save** on the bottom bar.

	    var azure = require('azure');
	    var notificationHubService = azure.createNotificationHubService(
				'<hub name>', 
				'<connection string with full access>');
	    notificationHubService.wns.sendToastText01(
	        '<category>',
	        {
	            text1: 'Breaking News!'
	        },
	        function (error) {
	            if (!error) {
	                console.warn("Notification successful");
	            }
	    });
	    notificationHubService.apns.send(
	        '<category>',
	        {
	            alert: "Breaking News!"
	        },
	        function (error)
	        {
	            if (!error) {
	                console.warn("Notification successful");
	            }
	        }
	    );
	


6. Click **Run Once** on the bottom bar. You should receive a toast notification.




<!-- Images. -->
[13]: ../media/notification-hub-create-console-app.png
[14]: ../media/notification-hub-windows-toast.png
[15]: ../media/notification-hub-scheduler1.png
[16]: ../media/notification-hub-scheduler2.png


<!-- URLs. -->
[Get started with Notification Hubs]: mobile-services-get-started-with-notification-hub-ios.md
[Use Notification Hubs to send notifications to users] : tutorial-notify-users-mobileservices.md

[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-dotnet.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-dotnet.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-dotnet.md
[Push notifications to app users]: ../tutorials/mobile-services-push-notifications-to-app-users-dotnet.md
[Authorize users with scripts]: ../tutorials/mobile-services-authorize-users-dotnet.md
[JavaScript and HTML]: ../tutorials/mobile-services-get-started-with-push-js.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Windows Developer Preview registration steps for Mobile Services]: ../HowTo/mobile-services-windows-developer-preview-registration.md
[wns object]: http://go.microsoft.com/fwlink/p/?LinkId=260591
[Notification Hubs Guidance]: http://msdn.microsoft.com/en-us/library/jj927170.aspx
[Notification Hubs How-To for Windows Store]: http://msdn.microsoft.com/en-us/library/jj927172.aspx