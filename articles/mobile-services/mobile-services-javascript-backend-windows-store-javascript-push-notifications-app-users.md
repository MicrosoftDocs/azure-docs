<properties 
	pageTitle="Send push notifications to authenticated users" 
	description="Learn how to send push notifications to specific" 
	services="mobile-services,notification-hubs" 
	documentationCenter="windows" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-store" 
	ms.devlang="javascript" 
	ms.topic="article" 
	ms.date="06/04/2015" 
	ms.author="glenga"/>

# Send push notifications to authenticated users

[AZURE.INCLUDE [mobile-services-selector-push-users](../../includes/mobile-services-selector-push-users.md)]

This topic shows you how to send push notifications to an authenticate user on any registered device. Unlike the previous [Add push notifications to your app] tutorial, this tutorial changes your mobile service to require that a user be authenticated before the client can register with the notification hub for push notifications. Registration is also modified to add a tag based on the assigned user ID. Finally, the server script is updated to send the notification only to the authenticated user instead of to all registrations.
 
This tutorial supports both Windows Store and Windows Phone Store apps.

##Prerequisites 

Before you start this tutorial, you must have already completed these Mobile Services tutorials:

+ [Add authentication to your app]<br/>Adds a login requirement to the TodoList sample app.

+ [Add push notifications to your app]<br/>Configures the TodoList sample app for push notifications by using Notification Hubs. 

After you have completed both tutorials, you can prevent unauthenticated users from registering for push notifications from your mobile service.

##<a name="register"></a>Update the service to require authentication to register

[AZURE.INCLUDE [mobile-services-javascript-backend-push-notifications-app-users](../../includes/mobile-services-javascript-backend-push-notifications-app-users.md)] 

<ol start="5"><li><p>Replace the insert function with the following code, then click <strong>Save</strong>:</p>
<pre><code>function insert(item, user, request) {
    // Define a payload for the Windows Store toast notification.
    var payload = '&lt;?xml version="1.0" encoding="utf-8"?&gt;&lt;toast&gt;&lt;visual&gt;' +    
    '&lt;binding template="ToastText01"&gt;&lt;text id="1"&gt;' +
    item.text + '&lt;/text&gt;&lt;/binding&gt;&lt;/visual&gt;&lt;/toast&gt;';

    // Get the ID of the logged-in user.
    var userId = user.userId;		

    request.execute({
        success: function() {
            // If the insert succeeds, send a notification to all devices 
	    	// registered to the logged-in user as a tag.
            	push.wns.send(userId, payload, 'wns/toast', {
                success: function(pushResponse) {
                    console.log("Sent push:", pushResponse);
	    			request.respond();
                    },              
                    error: function (pushResponse) {
                            console.log("Error Sending push:", pushResponse);
	    				request.respond(500, { error: pushResponse });
                        }
                    });
                }
            });
}</code></pre>

<p>This insert script uses the user ID tag to send a push notification (with the text of the inserted item) to all Windows Store app registrations created by the logged-in user.</p></li></ol>

##<a name="update-app"></a>Update the app to log in before registration

[AZURE.INCLUDE [mobile-services-windows-store-javascript-push-notifications-app-users](../../includes/mobile-services-windows-store-javascript-push-notifications-app-users.md)] 

##<a name="test"></a>Test the app

[AZURE.INCLUDE [mobile-services-windows-test-push-users](../../includes/mobile-services-windows-test-push-users.md)] 

<!-- Anchors. -->
[Updating the service to require authentication for registration]: #register
[Updating the app to log in before registration]: #update-app
[Testing the app]: #test
[Next Steps]:#next-steps


<!-- URLs. -->
[Add authentication to your app]: mobile-services-windows-store-javascript-get-started-users.md
[Add push notifications to your app]: mobile-services-javascript-backend-windows-store-javascript-get-started-push.md

[Azure Management Portal]: https://manage.windowsazure.com/
 