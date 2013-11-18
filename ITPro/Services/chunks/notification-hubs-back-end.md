
This section shows how to send notifications in two different ways:

- [From a console app]
- [From Mobile Services]

Both backends send notifications to both Windows Store and iOS devices. You can send notifications from any backend using the [Notification Hubs REST interface]. 

<h3><a name="console"></a>To send notifications from a console app in C#</h3>

Skip steps 1-3 if you created a console app when you completed [Get started with Notification Hubs].

1. In Visual Studio create a new Visual C# console application: 

   ![][13]

2. In the Visual Studio main menu, click **Tools**, **Library Package Manager**, and **Package Manager Console**, then in the console window type the following and press **Enter**:

        Install-Package WindowsAzure.ServiceBus
 	
	This adds a reference to the Windows Azure Service Bus SDK by using the <a href="http://nuget.org/packages/WindowsAzure.ServiceBus/">WindowsAzure.ServiceBus NuGet package</a>. 

3. Open the file Program.cs and add the following `using` statement:

        using Microsoft.ServiceBus.Notifications;

4. In the `Program` class, add the following method, or replace it if it already exists:

        private static async void SendNotificationAsync()
        {
			// Define the notification hub.
		    NotificationHubClient hub = 
				NotificationHubClient.CreateClientFromConnectionString(
					"<connection string with full access>", "<hub name>");
		
		    // Create an array of breaking news categories.
		    var categories = new string[] { "World", "Politics", "Business", 
		        "Technology", "Science", "Sports"};
		
            foreach (var category in categories)
            {
                try
                {
                    // Define a Windows Store toast.
                    var wnsToast = "<toast><visual><binding template=\"ToastText01\">" 
                        + "<text id=\"1\">Breaking " + category + " News!" 
                        + "</text></binding></visual></toast>";
                    // Send a WNS notification using the template.            
                    await hub.SendWindowsNativeNotificationAsync(wnsToast, category);

                    // Define a Windows Phone toast.
                    var mpnsToast =
                        "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                        "<wp:Notification xmlns:wp=\"WPNotification\">" +
                            "<wp:Toast>" +
                                "<wp:Text1>Breaking " + category + " News!</wp:Text1>" +
                            "</wp:Toast> " +
                        "</wp:Notification>";
                    // Send an MPNS notification using the template.            
                    await hub.SendMpnsNativeNotificationAsync(mpnsToast, category);

                    // Define an iOS alert.
                    var alert = "{\"aps\":{\"alert\":\"Breaking " + category + " News!\"}}";
                    // Send an APNS notification using the template.
                    await hub.SendAppleNativeNotificationAsync(alert, category);
                }
                catch (ArgumentException)
                {
                    // An exception is raised when the notification hub hasn't been 
                    // registered for the iOS, Windows Store, or Windows Phone platform. 
                }
            }
		 }

	This code sends notifications for each of the six tags in the string array to Windows Store, Windows Phone and iOS devices. The use of tags makes sure that devices receive notifications only for the registered categories.
	
	<div class="dev-callout"><strong>Note</strong> 
		<p>This backend code supports Windows Store, Windows Phone and iOS clients. Send methods return an error response when the notification hub hasn't yet been configured for particular client platform. </p>
	</div>

6. In the above code, replace the `<hub name>` and `<connection string with full access>` placeholders with your notification hub name and the connection string for *DefaultFullSharedAccessSignature* that you obtained earlier.

7. Add the following lines in the **Main** method:

         SendNotificationAsync();
		 Console.ReadLine();

You can now proceed to [Run the app and generate notifications].

###<a name="mobile-services"></a>To send notifications from Mobile Services

To send a notification using a Mobile Service do the following:

0. Complete the tutorial [Get started with Mobile Services] to create your mobile service.

1. Log on to the [Windows Azure Management Portal], click Mobile Services, then click your mobile service.

2. Click the **Scheduler** tab, then click **Create**.

   ![][15]

3. In **Create new job**, type a name, select **On demand**, and then click the check to accept.

   ![][16]

4. After the job is created, click the job name and then in the **Script** tab insert the following script inside the scheduled job function: 

	    var azure = require('azure');
	    var notificationHubService = azure.createNotificationHubService(
				'<hub name>', 
				'<connection string with full access>');

   		 // Create an array of breaking news categories.
		    var categories = ['World', 'Politics', 'Business', 'Technology', 'Science', 'Sports'];
		    for (var i = 0; i < categories.length; i++) {
		        // Send a WNS notification.
		        notificationHubService.wns.sendToastText01(categories[i], {
		            text1: 'Breaking ' + categories[i] + ' News!'
		        }, sendComplete);
		        // Send a MPNS notification.
		        notificationHubService.mpns.sendToast(categories[i], {
		            text1: 'Breaking ' + categories[i] + ' News!'
		        }, sendComplete);
		        // Send an APNS notification.
		        notificationHubService.apns.send(categories[i], {
		            alert: 'Breaking ' + categories[i] + ' News!'
		        }, sendComplete);
		    }

	This code sends notifications for each of the six tags in the string array to Windows Store, Windows Phone and iOS devices. The use of tags makes sure that devices receive notifications only for the registered categories.

6. In the above code, replace the `<hub name>` and `<connection string with full access>` placeholders with your notification hub name and the connection string for *DefaultFullSharedAccessSignature* that you obtained earlier.

7. Add the following helper function after the scheduled job function, then click **Save**.: 
	
        function sendComplete(error) {
 		   if (error) {
	            // An exception is raised when there are no devices registered for 
	            // the iOS, Windows Store, or Windows Phone platforms. Consider using template 
	            // notifications instead.
	            //console.warn("Notification failed:" + error);
	        }
	    }
	
	<div class="dev-callout"><strong>Note</strong> 
		<p>This code supports Windows Store, Windows Phone and iOS clients. Send methods return an error response when a registration doesn't exist for a particular platform. To avoid this, consider using template registrations to send a single notification to multiple platforms. For an example, see <a href="/en-us/manage/services/notification-hubs/breaking-news-localized-dotnet/">Use Notification Hubs to broadcast localized breaking news</a>. </p>
	</div>

You can now proceed to [Run the app and generate notifications].

<!-- Anchors -->
[From a console app]: #console
[From Mobile Services]: #mobile-services
[Run the app and generate notifications]: #test-app

<!-- Images. -->
[13]: ../media/notification-hub-create-console-app.png
[14]: ../media/notification-hub-windows-toast.png
[15]: ../media/notification-hub-scheduler1.png
[16]: ../media/notification-hub-scheduler2.png

<!-- URLs. -->
[Get started with Notification Hubs]: ../notificationhubs/getting-started-windowsdotnet.md
[Use Notification Hubs to send notifications to users]: ../notificationhubs/tutorial-notify-users-mobileservices.md
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[wns object]: http://go.microsoft.com/fwlink/p/?LinkId=260591
[Notification Hubs Guidance]: http://msdn.microsoft.com/en-us/library/jj927170.aspx
[Notification Hubs How-To for Windows Store]: http://msdn.microsoft.com/en-us/library/jj927172.aspx
[Notification Hubs REST interface]: http://msdn.microsoft.com/en-us/library/windowsazure/dn223264.aspx