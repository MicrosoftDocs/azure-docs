<properties linkid="manage-services-notification-hubs-notify-users-xplat-mobile-services" urlDisplayName="notify users xplat mobile services" pageTitle="Send cross-platform notifications to users with Notification Hubs (Mobile Services)" metaKeywords="" description="Learn how to use Notification Hubs templates to send, in a single request, a platform-agnostic notification that targets all platforms." metaCanonical="" services="mobile-services,notification-hubs" documentationCenter="" title="Send cross-platform notifications to users with Notification Hubs" authors="glenga" solutions="" manager="" editor="" />

<tags ms.service="notification-hubs" ms.workload="mobile" ms.tgt_pltfrm="mobile-multiple" ms.devlang="multiple" ms.topic="article" ms.date="01/01/1900" ms.author="glenga" />

# Send cross-platform notifications to users with Notification Hubs

<div class="dev-center-tutorial-selector sublanding">
    <a href="/en-us/documentation/articles/notification-hubs-mobile-services-cross-platform-notify-users/" title="Mobile Services" class="current">Mobile Services</a>
    <a href="/en-us/documentation/articles/notification-hubs-aspnet-cross-platform-notify-users/" title="ASP.NET">ASP.NET</a>
</div> 

In the previous tutorial [Notify users with Notification Hubs], you learned how to push notifications to all devices registered by a specific authenticated user. In that tutorial, multiple requests were required to send a notification to each supported client platform. Notification Hubs supports templates, which let you specify how a specific device wants to receive notifications. This simplifies sending cross-platform notifications. This topic demonstrates how to take advantage of templates to send, in a single request, a platform-agnostic notification that targets all platforms. For more detailed information about templates, see [Azure Notification Hubs Overview][Templates].

<div class="dev-callout"><b>Note</b>
	<p>Notification Hubs allows a device to register multiple templates with the same tag. In this case, an incoming message targeting that tag results in multiple notifications delivered to the device, one for each template. This enables you to display the same message in multiple visual notifications, such as both as a badge and as a toast notification in a Windows Store app.</p>
</div>

Complete the following steps to send cross-platform notifications using templates:
	
1. Log into the [Azure Management Portal][Management Portal], click **Mobile Services**, and then click your app.

   	![][0]

2. Click the **API** tab, then click the **register_notifications** entry in the API table.

	![][1]

5. Click the **Script** tab, locate the **else** block that creates a new registration when the value of `existingRegs` is **false**, and replace it with the following code:

		else {
            // Create a new registration.
            var template;
            if (platform === 'win8') {                
                template = { text1: '$(message)' };              
                hub.wns.createToastText01Registration(request.body.channelUri, 
                [userId, installationId], template, registrationComplete);
            } else if (platform === 'ios') {
                template = '{\"aps\":{\"alert\":\"$(message)\"}, \"inAppMessage\":\"$(message)\"}';
                hub.apns.createTemplateRegistration(request.body.deviceToken, 
                [userId, installationId], template, registrationComplete);
            } else {
                response.send(500, 'Unknown client.');
            }
        }
	
	This code calls the platform-specific method to create a template registration instead of a native registration. Existing registrations need not be modified because template registrations derive from native registrations.

3. Click the **Data** tab and then click the **TodoItem** table. 

   	![][2]

2. In **todoitem**, click the **Script** tab, select **Insert**, and then replace the existing **insert** function with the following code:
   
  	![][3]

   	This displays the function that is invoked when an insert occurs in the **TodoItem** table.

3. Replace the insert function with the following code:

		function insert(item, user, request) {
		    var azure = require('azure');
		    var hub = azure.createNotificationHubService('<NOTIFICATION_HUB_NAME>', 
		    '<FULL_SAS_CONNECTION_STRING>');
		
		    // Execute the request and send notifications.
		    request.execute({
		        success: function() {
		            // Write the default response and send a notification 
		            // to the user on all devices by using the userId tag.
		            request.respond();
					// Create a template-based payload.
		            var payload = '{ "message" : "New item added: ' + item.text + '" }';            
		            // Send a notification to the current user on all platforms. 
		            hub.send(user.userId, payload,  
		            function(error, outcome){
		                // Do something here with the outcome or error.
		            });     
		        }
		    });
		}

	This code sends a notification to all platforms at the same time and without having to specify a native payload. Notification Hubs builds and delivers the correct payload to every device with the provided _tag_ value, as specified in the registered templates.

4. Update the script to replace _`<NOTIFICATION_HUB_NAME>`_ and _`<FULL_SAS_CONNECTION_STRING>`_ with values for your notification hub, then click **Save**.

5. Stop the device emulator or uninstall the existing client app from the device.

	This makes sure that a new installation ID is generated by the Mobile Services client. If you don't do this, the service tries to use the existing, non-template registration. 

5. Deploy and run the client app again and verify that registration succeeds and a new registration ID is displayed.

6. Enter text as before and add the new item.	

	Note that after the insert completes, the app receives a push notification from Notification Hubs.

7. (Optional) Deploy the client app to a second device, then run the app and insert text. 

	Note that a notification is displayed on each device.

## Next Steps

Now that you have completed this tutorial, find out more about Notification Hubs and templates in these topics:

+ **Use Notification Hubs to send breaking news ([Windows Store C#][Breaking news .NET] / [iOS][Breaking news iOS])**<br/>Demonstrates another scenario for using templates 

+  **[Azure Notification Hubs Overview][Templates]**<br/>Overview topic has more detailed information on templates.

+  **[Notification Hub How to for Windows Store]**<br/>Includes a template expression language reference.



<!-- Anchors. -->
[ASP.NET backend]: #aspnet
[Mobile Services backend]: #mobileservices

<!-- Images. -->
[0]: ./media/notification-hubs-mobile-services-cross-platform-notify-users/mobile-services-selection.png
[1]: ./media/notification-hubs-mobile-services-cross-platform-notify-users/mobile-custom-api-select.png
[2]: ./media/notification-hubs-mobile-services-cross-platform-notify-users/mobile-portal-data-tables.png
[3]: ./media/notification-hubs-mobile-services-cross-platform-notify-users/mobile-insert-script-push2.png
<!-- URLs. -->
[Push to users ASP.NET]: /en-us/manage/services/notification-hubs/notify-users-aspnet/
[Push to users Mobile Services]: /en-us/manage/services/notification-hubs/notify-users/
[Visual Studio 2012 Express for Windows 8]: http://go.microsoft.com/fwlink/?LinkId=257546

[Management Portal]: https://manage.windowsazure.com/
[Send cross-platform notifications to users with Notification Hubs]: /en-us/manage/services/notification-hubs/notify-users-xplat-mobile-services/
[Breaking news .NET]: /en-us/manage/services/notification-hubs/breaking-news-dotnet
[Breaking news iOS]: /en-us/manage/services/notification-hubs/breaking-news-ios
[Azure Notification Hubs]: http://go.microsoft.com/fwlink/p/?LinkId=314257
[Notify users with Notification Hubs]: /en-us/manage/services/notification-hubs/notify-users 
[Templates]: http://go.microsoft.com/fwlink/p/?LinkId=317339
[Notification Hub How to for Windows Store]: http://msdn.microsoft.com/en-us/library/windowsazure/jj927172.aspx
