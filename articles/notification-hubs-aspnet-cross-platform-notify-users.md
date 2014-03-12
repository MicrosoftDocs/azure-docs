<properties linkid="manage-services-notification-hubs-notify-users-xplat-aspnet" urlDisplayName="Notify Users xplat aspnet" pageTitle="Send cross-platform notifications to users with Notification Hubs (ASP.NET)" metaKeywords="" description="Learn how to use Notification Hubs templates to send, in a single request, a platform-agnostic notification that targets all platforms." metaCanonical="" services="notification-hubs" documentationCenter="" title="Send cross-platform notifications to users with Notification Hubs" authors="glenga" solutions="" manager="" editor="" />
# Send cross-platform notifications to users with Notification Hubs

<div class="dev-center-tutorial-selector sublanding">
    <a href="/en-us/manage/services/notification-hubs/notify-users-xplat-mobile-services/" title="Mobile Services">Mobile Services</a><a href="/en-us/manage/services/notification-hubs/notify-users-xplat-aspnet/" title="ASP.NET" class="current">ASP.NET</a>
</div> 

In the previous tutorial [Notify users with Notification Hubs], you learned how to push notifications to all devices registered by a specific authenticated user. In that tutorial, multiple requests were required to send a notification to each supported client platform. Notification Hubs supports templates, which let you specify how a specific device wants to receive notifications. This simplifies sending cross-platform notifications. This topic demonstrates how to take advantage of templates to send, in a single request, a platform-agnostic notification that targets all platforms. For more detailed information about templates, see [Windows Azure Notification Hubs Overview][Templates].

<div class="dev-callout"><b>Note</b>
	<p>Notification Hubs allows a device to register multiple templates with the same tag. In this case, an incoming message targeting that tag results in multiple notifications delivered to the device, one for each template. This enables you to display the same message in multiple visual notifications, such as both as a badge and as a toast notification in a Windows Store app.</p>
</div>

Complete the following steps to send cross-platform notifications using templates:

1. In the Solution Explorer in Visual Studio, expand the **Controllers** folder, then open the RegisterController.cs file. 

2. Locate the block of code in the **Post** method that creates a new registration when the value of `updated` is **false** and replace it with the following code:

		if (!updated)
        {
            switch (platform)
            {
                case "windows":
                    var template = @"<toast><visual><binding template=""ToastText01""><text id=""1"">$(message)</text></binding></visual></toast>";
                    await hubClient.CreateWindowsTemplateRegistrationAsync(channelUri, template, new string[] { instId, userTag });
                    break;
                case "ios":
                    template = "{\"aps\":{\"alert\":\"$(message)\"}, \"inAppMessage\":\"$(message)\"}";
                    await hubClient.CreateAppleTemplateRegistrationAsync(deviceToken, template, new string[] { instId, userTag });
                    break;
            } 
        }
	
	This code calls the platform-specific method to create a template registration instead of a native registration. Existing registrations need not be modified because template registrations derive from native registrations.

3. Replace the **sendNotification** method with the following code:

        // Send a cross-plaform notification by using templates. 
        private async Task sendNotification(string notificationText, string tag)
        {           
                var notification = new Dictionary<string, string> { { "message", "Hello, " + tag } };
                await hubClient.SendTemplateNotificationAsync(notification, tag);        
        }

	This code sends a notification to all platforms at the same time and without having to specify a native payload. Notification Hubs builds and delivers the correct payload to every device with the provided _tag_ value, as specified in the registered templates.

4. Run the client app again and verify that registration succeeds.

5. (Optional) Deploy the client app to a second device, then run the app. 

	Note that a notification is displayed on each device.

## Next Steps

Now that you have completed this tutorial, find out more about Notification Hubs and templates in these topics:

+ **Use Notification Hubs to send breaking news ([Windows Store C#][Breaking news .NET] / [iOS][Breaking news iOS])**<br/>Demonstrates another scenario for using templates 

+  **[Windows Azure Notification Hubs Overview][Templates]**<br/>Overview topic has more detailed information on templates.

+  **[Notification Hub How to for Windows Store]**<br/>Includes a template expression language reference.



<!-- Anchors. -->

<!-- Images. -->




<!-- URLs. -->
[Push to users ASP.NET]: /en-us/manage/services/notification-hubs/notify-users-aspnet
[Push to users Mobile Services]: /en-us/manage/services/notification-hubs/notify-users/
[Visual Studio 2012 Express for Windows 8]: http://go.microsoft.com/fwlink/?LinkId=257546

[Management Portal]: https://manage.windowsazure.com/
[Send cross-platform notifications to users with Notification Hubs]: /en-us/manage/services/notification-hubs/notify-users-xplat-mobile-services/
[Breaking news .NET]: /en-us/manage/services/notification-hubs/breaking-news-dotnet
[Breaking news iOS]: /en-us/manage/services/notification-hubs/breaking-news-dotnet
[Windows Azure Notification Hubs]: http://go.microsoft.com/fwlink/p/?LinkId=314257
[Notify users with Notification Hubs]: /en-us/manage/services/notification-hubs/notify-users-aspnet
[Templates]: http://go.microsoft.com/fwlink/p/?LinkId=317339
[Notification Hub How to for Windows Store]: http://msdn.microsoft.com/en-us/library/windowsazure/jj927172.aspx
