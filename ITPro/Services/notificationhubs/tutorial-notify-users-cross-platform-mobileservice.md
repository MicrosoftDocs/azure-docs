<properties linkid="" urlDisplayName="Notify Users" pageTitle="Notify cross-platform users of your ASP.NET service with Notification Hubs" metaKeywords="" writer="glenga" metaDescription="Follow this tutorial to register to receive notifications from your ASP.NET service by using Notification Hubs" metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/notification-hubs-left-nav.md" />

# Send cross-platform notifications to users with Notification Hubs

<div class="dev-center-tutorial-selector sublanding">
    <a href="/en-us/manage/services/notification-hubs/notify-users-crossplat" title="Mobile Services" class="current">Mobile Services</a>
    <a href="/en-us/manage/services/notification-hubs/notify-users-crossplat-aspnet" title="ASP.NET">ASP.NET</a>
</div> 

In the previous tutorial [Notify users with Notification Hubs], you learned how to push notifications to all devices registered by a specific authenticated user. In that tutorial, multiple requests were required to send a notification to each supported client platform. Notification Hubs supports templates, which let you specify how a specific device wants to receive notifications. This simplifies sending cross-platform notifications. This topic demonstrates how to take advantage of templates to send, in a single request, a platform-agnostic notification that targets all platforms. For more detailed information on templates, see [Windows Azure Notification Hubs Overview][Templates].

<div class="dev-callout"><b>Note</b>
	<p>Notification Hubs allows a device to register multiple templates with the same tag. In this case, an incoming message targeting that tag results in multiple notifications delivered to the device, one for each template. This enables you to display the same message in multiple visual notifications, such as both as a badge and as a toast notification in a Windows Store app.</p>
</div>

Complete the following steps to send cross-platform notifications using templates:
	
1. Log into the [Windows Azure Management Portal][Management Portal], click **Mobile Services**, and then click your app.

   ![][0]

2. Click the **API** tab, then click the **register_notifications** entry in the API table.

	![][1]

5. Click the **Script** tab, locate the **else** block that creates a new registration when the value of `existingRegs` is **false**, and replace it with the following code:

		else {
            // Create a new registration.
            var template;
            if (platform === 'win8') {                
                template = '{ text1: "$(message)" }';
                hub.wns.createToastText01Registration(request.body.channelUri, 
                [userId, installationId], template, function(error, registration) {
                    if (!error) {
                        // Return the registration.
                        response.send(200, registration);
                    } else {
                        response.send(500, 'Registration failed!');
                    }
                });
            } else if (platform === 'ios') {
                template = '{\"aps\":{\"alert\":\"$(message)\"}, \"inAppMessage\":\"$(message)\"}';
                hub.apns.createTemplateRegistration(request.body.deviceToken, 
                [userId, installationId], template, function(error, registration) {
                    if (!error) {
                        // Return the registration.
                        response.send(200, registration);
                    } else {
                        response.send(500, 'Registration failed!');
                    }
                });
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
		            // Send a notification to the current user on all platforms. 
		            hub.send(user.userId, { 'message': "Hello, " + user.userId }, 
		            function(error, outcome){
		                // Do something here with the outcome or error.
		                console.error(error);
		                console.log(outcome);
		            });     
		        }
		    });
		}

	This code sends a notification to all platforms at the same time and without having to specify a native payload. Notification Hubs builds and delivers the correct payload to every device with the provided _tag_ value, as specified in the registered templates.

4. Update the script to replace _`<NOTIFICATION_HUB_NAME>`_ and _`<FULL_SAS_CONNECTION_STRING>`_ with values for your notification hub, then click **Save**.

5. Run the client app again and verify that registration succeeds.

6. Enter text as before and add the new item.

	Note that after the insert completes, the app receives a push notification from Notification Hubs.

7. (Optional) Deploy the client app to a second device, then run the app and insert text. 

	Note that a notification is displayed on each device.

## Next Steps

Now that you have completed this tutorial, find out more about Notification Hubs and templates in these topics:

+ **Use Notification Hubs to send breaking news ([Windows Store C#][Breaking news .NET] / [iOS][Breaking news iOS])**<br/>Demonstrates another scenario for using templates 

+  **[Windows Azure Notification Hubs Overview][Templates]**<br/>Overview topic has more detailed information on templates.

+  **[Notification Hub How to for Windows Store]**<br/>Includes a template expression language reference.

<!-- Anchors. -->
[ASP.NET backend]: #aspnet
[Mobile Services backend]: #mobileservices

<!-- Images. -->
[0]: ../Media/mobile-services-selection.png
[1]: ../Media/mobile-custom-api-select.png
[2]: ../Media/mobile-portal-data-tables.png
[3]: ../Media/mobile-insert-script-push2.png
<!-- URLs. -->
[Push to users ASP.NET]: ./tutorial-notify-users-aspnet.md
[Push to users Mobile Services]: ./tutorial-notify-users-mobile-services.md
[Visual Studio 2012 Express for Windows 8]: http://go.microsoft.com/fwlink/?LinkId=257546
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Send cross-platform notifications to users with Notification Hubs]: ./tutorial-notify-users-cross-platform.md
[Breaking news .NET]: ./breaking-news-dotnet.md
[Breaking news iOS]: ./breaking-news-dotnet.md
[Windows Azure Notification Hubs]: http://go.microsoft.com/fwlink/p/?LinkId=314257
[Notify users with Notification Hubs]: ./tutorial-notify-users-aspnet.md 
[Templates]: http://go.microsoft.com/fwlink/p/?LinkId=317339
[Notification Hub How to for Windows Store]: http://msdn.microsoft.com/en-us/library/windowsazure/jj927172.aspx