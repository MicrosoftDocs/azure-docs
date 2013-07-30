<properties linkid="" urlDisplayName="Notify Users" pageTitle="Notify Users of your mobile service with Notification Hubs" metaKeywords="" writer="glenga" metaDescription="Follow this tutorial to register to receive notifications from your mobile service by using Notification Hubs" metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/notification-hubs-left-nav.md" />

# <a name="getting-started"> </a>Notify users with Notification Hubs

<div class="dev-center-tutorial-selector sublanding">
    <a href="/en-us/manage/services/notification-hubs/notify-users" title="Mobile Services" class="current">Mobile Services</a>
    <a href="/en-us/manage/services/notification-hubs/notify-users-aspnet" title="ASP.NET">ASP.NET</a>
</div> 

This tutorial shows you how to use Windows Azure Notification Hubs to send push notifications to a specific app user on a specific device. A Windows Azure Mobile Services backend is used to authenticate clients and to generate notifications. This tutorial builds on the notification hub that you created in the previous **Get started with Notification Hubs** tutorial. The notification registration code is moved from the client to the backend service. This ensures that registration is only completed after a client has been positively authenticated by the service. It also means that notification hub credentials aren't distributed with the client app. The service also controls the tags requested during registration.

This tutorial walks you through the following basic steps: 

+ [Update your mobile service to register for notifications]
+ [Update the app to log in and request registration]
+ [Update your mobile service to send notifications]

## Prerequisites

Before you start this tutorial, you must first complete the following tutorials:

+ **Get started with Notification Hubs** ([Windows Store C#][Get started Windows Store]/[iOS][Get started iOS]/[Android][Get started Android]). 

+ **Get started with authentication in Mobile Services** ([Windows Store C#][Get started auth Windows Store]/[iOS][Get started auth iOS]/[Android][Get started auth Android])

This tutorial builds upon the app and notification hub that you created in **Get started with Notification Hubs**. It also leverages the authenticated mobile service that you configured in **Get started with authentication in Mobile Services**. 

<div class="dev-callout"><b>Note</b>
	<p>By default, the <strong>Get started with authentication in Mobile Services</strong> tutorial uses Facebook authentication. You cannot use Microsoft Account authentication in this tutorial, because two Windows Store apps cannot share a single Live Connect registration. To use Microsoft Account authentication, the mobile service and notification hub must be registered to the same app in Live Connect.</p>
</div>

<a name="register-notification"></a><h2><span class="short-header">Register for notifications</span>Update your mobile service to register for notifications</h2>

Because notification registration must only be completed after a client has been positively authenticated by the service, the registration is performed a custom API defined in the mobile service. This custom API is called by an authenticated client to request notification registration. In this section, you will update the authenticated mobile service that you defined when you completed the **Get started with authentication in Mobile Services** tutorial. 

1. Log into the [Windows Azure Management Portal][Management Portal], click **Service Bus**, your namespace, **Notification Hubs**, then choose your notification hub and click **Connection Information**.  

	![][6]

2. Note the name of your notification hub and copy the connection string for the **DefaultFullSharedAccessSignature**.

	![][7]

	You will use this connection string, along with the notification hub name, to both register for and send notifications.

2. Still in the Management Portal, click **Mobile Services**, and then click your app.

   ![][0]

2. Click the **API** tab, and then click **Create a custom API**.

   ![][1]

   This displays the **Create a new custom API** dialog.

3. Type <em>register_notifications</em> in **API name**, select **Only Authenticated Users** for **POST Permissions**, then click the check button.

   ![][2]

  This creates the API that requires users to be authenticated before calling by using the HTTP POST method. We don't need to set the other HTTP methods because we won't implement them.

4. Click the new **register_notifications** entry in the API table.

	![][3]

5. Click the **Script** tab and replace the existing code with the following:

		exports.post = function(request, response) {

			// Create a notification hub instance.
		    var azure = require('azure');
		    var hub = azure.createNotificationHubService('<NOTIFICATION_HUB_NAME>', 
				'<FULL_SAS_CONNECTION_STRING>');
		
		    // Get the registration info that we need from the request. 
		    var platform = request.body.platform;
		    var userId = request.user.userId;
		    var installationId = request.header('X-ZUMO-INSTALLATION-ID');
		
		    // Function called when registration is completed.
		    var registrationComplete = function(error, registration) {
		            if (!error) {
		                // Return the registration.
		                response.send(200, registration);
		            } else {
		                response.send(500, 'Registration failed!');
		            }
		        }
		
		        // Function called to log errors.
		    var logErrors = function(error) {
		            if (error) {
		                console.error(error)
		            }
		        }
		    // Check for existing registrations.
		    hub.listRegistrationsByTag(installationId, function(error, existingRegs) {
		        var firstRegistration = true;
		        if (existingRegs) {
		            for (var i = 0; i < existingRegs.length; i++) {
		                if (firstRegistration) {
		                    // Update an existing registration.
		                    if (platform === 'win8') {
		                        existingRegs[i].channelUri = request.body.channelUri;
		                        hub.updateRegistration(existingRegs[i], registrationComplete);
		                    } else if (platform === 'ios') {
		                        existingRegs[i].deviceToken = request.body.deviceToken;
		                        hub.updateRegistration(existingRegs[i], registrationComplete);
		                    } else {
		                        response.send(500, 'Unknown client.');
		                    }
		                } else {
		                    // We shouldn't have any extra registrations; delete if we do.
		                    hub.deleteRegistration(existingRegs[i].RegistrationId, logErrors);
		                }
                    	firstRegistration = false;
		            }
		        } else {
		            // Create a new registration.
		            if (platform === 'win8') {
		                hub.wns.createNativeRegistration(request.body.channelUri, 
		                [userId, installationId], function(error, registration) {
		                    if (!error) {
		                        // Return the registration.
		                        response.send(200, registration);
		                    } else {
		                        response.send(500, 'Registration failed!');
		                    }
		                });
		            } else if (platform === 'ios') {
		                hub.apns.createNativeRegistration(request.body.deviceToken, 
		                [userId, installationId], function(error, registration) {
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
		    });
		}

	This code gets platform and deviceID information from the message body. This data, along with the installation ID from the request header and the user ID of the logged-in user, is used to update a registration, if it exists, or create a new registration. This registration is tagged with the user ID and installation ID.

6. Update the script to replace _`<NOTIFICATION_HUB_NAME>`_ and _`<FULL_SAS_CONNECTION_STRING>`_ with values for your notification hub, then click **Save**.

	<div class="dev-callout"><b>Note</b>
		<p>Make sure to use the <strong>DefaultFullSharedAccessSignature</strong> for <em><code>&lt;FULL_SAS_CONNECTION_STRING&gt;</code></em>. This claim allows your custom API method to create and update registrations.</p>
	</div>

<a name="update-app"></a><h2><span class="short-header">Update the app</span>Update the app to log in and request registration</h2>

Next, you need to update the TodoList app to request registration for notification by calling the new custom API.

1. Follow the steps in one of the following versions of **Register the current user for push notifications by using a mobile service**, depending on your client platform:

	+ <a href="/en-us/manage/services/notification-hubs/howto-register-user-with-mobile-service-windowsdotnet" target="_blank">Windows Store C# version</a>
	+ <a href="/en-us/manage/services/notification-hubs/howto-register-user-with-mobile-service-ios" target="_blank">iOS version</a>

2. Run the updated app, login using Facebook, and then verify that the registration ID assigned to the notification is displayed.

<a name="send-notifications"></a><h2><span class="short-header">Send notifications</span>Update your mobile service to send notifications</h2>

The final step is to add code that sends notifications in the mobile service. This notification code is added to the server script registered to the insert handler of the **TodoItem** table.

1. Back in the Management Portal, click the **Data** tab and then click the **TodoItem** table. 

   ![][4]

2. In **todoitem**, click the **Script** tab and select **Insert**.
   
  ![][5]

   This displays the function that is invoked when an insert occurs in the **TodoItem** table.

3. Replace the insert function with the following code:

		function insert(item, user, request) {
		    var azure = require('azure');
		    var hub = azure.createNotificationHubService('<NOTIFICATION_HUB_NAME>', 
		    '<FULL_SAS_CONNECTION_STRING>');
		
 		   // Create the payload for a Windows Store app.
		    var wnsPayload = '<toast><visual><binding template="ToastText02"><text id="1">New item added:</text><text id="2">' + item.text + '</text></binding></visual></toast>';
		
		    // Execute the request and send notifications.
		    request.execute({
		        success: function() {
		            // Write the default response and send a notification 
		            // to the user on all devices by using the userId tag.
		            request.respond();
		            // Send to Windows Store apps.
		            hub.wns.send(user.userId, wnsPayload, 'wns/toast', function(error) {
		                if (error) {
		                    console.log(error);
		                }
		            });
		            // Send to iOS apps.
		            hub.apns.send(user.userId, {
		                alert: item.text
		            }, function(error) {
		                if (error) {
		                    console.log(error);
		                }
		            });
		        }
		    });
		}
	
	This attempts to send notifications to the tag for the current logged-in user in both Windows Store and iOS apps.
		
4. Update the script to replace _`<NOTIFICATION_HUB_NAME>`_ and _`<FULL_SAS_CONNECTION_STRING>`_ with values for your notification hub, then click **Save**.

   This registers a new insert script, which uses Notification Hubs to send a push notification (the inserted text) to the channel provided in the insert request.

	<div class="dev-callout"><b>Note</b>
		<p>Make sure to use the <strong>DefaultFullSharedAccessSignature</strong> for <em><code>&lt;FULL_SAS_CONNECTION_STRING&gt;</code></em>. This claim provides your insert script with full access, including the ability to send notifications to registered clients.</p>
	</div>

<h2><a name="test"></a><span class="short-header">Test the app</span>Test push notifications in your app</h2>

Now that the notifications are configured, it's time to test the app by inserting data to generate a notification.

1. Run the app. 

	A registration notification is again displayed on start-up.

2. Enter text as before and add the new item.

	Note that after the insert completes, the app receives a push notification from Notification Hubs.

	<div class="dev-callout"><b>Note</b>
		<p>An error is raised on the backend when there is no registration for a platform to which a notification is requested to be sent. In this case, this error can be ignored. To see how to use templates to avoid this situation, see <a href="/en-us/manage/services/notification-hubs/notify-users-cross-platform" target="_blank">Send cross-platform notifications to users with Notification Hubs</a>.</p>
	</div>

3. (Optional) Deploy the client app to a second device, then run the app and insert text. 

	A notification is displayed on each device.

## <a name="next-steps"> </a>Next Steps
Now that you have completed this tutorial, consider completing the following tutorials:

+ **Use Notification Hubs to send breaking news ([Windows Store C#][Breaking news .NET] / [iOS][Breaking news iOS])**<br/>This platform-specific tutorial shows you how to use tags to enable users to subscribe to types of notifications in which they are interested. 

+ **[Send cross-platform notifications to users with Notification Hubs]**<br/>This tutorial extends the current **Notify users with Notification Hubs** tutorial to use platform-specific templates to register for notifications. This enables you to send notifications from a single method in your server-side code.

For more information about Notification Hubs, see [Windows Azure Notification Hubs].

<!-- Anchors. -->
[Update your mobile service to register for notifications]: #register-notification
[Update the app to log in and request registration]: #update-app
[Update your mobile service to send notifications]: #send-notifications

<!-- Images. -->
[0]: ../Media/mobile-services-selection.png
[1]: ../Media/mobile-custom-api-create.png
[2]: ../Media/mobile-custom-api-create2.png
[3]: ../Media/mobile-custom-api-select.png
[4]: ../Media/mobile-portal-data-tables.png
[5]: ../Media/mobile-insert-script-push2.png
[6]: ../Media/notification-hub-select-hub-connection.png
[7]: ../Media/notification-hub-connection-strings.png

<!-- URLs. -->
[Get started Windows Store]: ./getting-started-windowsdotnet.md
[Get started iOS]: ./getting-started-ios.md
[Get started Android]: ./getting-started-android.md
[Get started auth Windows Store]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet/
[Get started auth iOS]: /en-us/develop/mobile/tutorials/get-started-with-users-ios/
[Get started auth Android]: /en-us/develop/mobile/tutorials/get-started-with-users-android/
[Client topic Windows Store C# version]: ./howto-register-user-with-mobile-service-windowsdotnet.md 
[Client topic iOS version]: ./howto-register-user-with-mobile-service-ios.md 
[Visual Studio 2012 Express for Windows 8]: http://go.microsoft.com/fwlink/?LinkId=257546
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Send cross-platform notifications to users with Notification Hubs]: ./tutorial-notify-users-cross-platform-mobileservice.md
[Breaking news .NET]: ./breaking-news-dotnet.md
[Breaking news iOS]: ./breaking-news-dotnet.md
