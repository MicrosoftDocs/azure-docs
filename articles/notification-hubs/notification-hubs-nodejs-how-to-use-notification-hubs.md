<properties
	pageTitle="How to use Notification Hubs with Node.js"
	description="Learn how to use Notification Hubs to send push notifications from a Node.js application."
	services="notification-hubs"
	documentationCenter="nodejs"
	authors="wesmc7777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="notification-hubs"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="javascript"
	ms.topic="article"
	ms.date="06/16/2015"
	ms.author="wesmc"/>

# How to use Notification Hubs from Node.js

> [AZURE.SELECTOR]
- [Java](notification-hubs-java-backend-how-to.md)
- [PHP](notification-hubs-php-backend-how-to.md)
- [Python](notification-hubs-python-backend-how-to)

##Overview

This guide will show you how to use Notification Hubs
from Node.js applications. The scenarios covered include **sending notifications to Android, iOS, Windows Phone and Windows Store applications**. For more information on notification hubs, see the [Next Steps](#next) section.

##What are Notification Hubs?

Azure Notification Hubs provide an easy-to-use, multiplatform, scalable infrastructure for sending push notifications to mobile devices. For more information, see [Azure Notification Hubs](http://msdn.microsoft.com/library/windowsazure/jj927170.aspx).

##Create a Node.js Application

Create a blank Node.js application. For instructions creating a Node.js application, see [Create and deploy a Node.js application to Azure Web Site][nodejswebsite], [Node.js Cloud Service][Node.js Cloud Service] (using Windows PowerShell), or [Web Site with WebMatrix].

##Configure Your Application to Use Notification Hub

To use Azure Notification Hub, you need to download and use the
Node.js azure package. This includes a set of convenience libraries that
communicate with the REST services.

### Use Node Package Manager (NPM) to obtain the package

1.  Use a command-line interface such as **PowerShell** (Windows,) **Terminal** (Mac,) or **Bash** (Unix), navigate to the folder where you created your sample application.

2.  Type **npm install azure** in the command window, which should
    result in the following output:

        azure@0.7.0 node_modules\azure
		|-- dateformat@1.0.2-1.2.3
		|-- xmlbuilder@0.4.2
		|-- node-uuid@1.2.0
		|-- mime@1.2.9
		|-- underscore@1.4.4
		|-- validator@0.4.28
		|-- tunnel@0.0.2
		|-- wns@0.5.3
		|-- xml2js@0.2.6 (sax@0.4.2)
		|-- request@2.16.6 (forever-agent@0.2.0, aws-sign@0.2.0, tunnel-agent@0.2.0, oauth-sign@0.2.0, json-stringify-safe@3.0.0, cookie-jar@0.2.0, node-uuid@1.4.0, qs@0.5.5, hawk@0.10.2, form-data@0.0.7)

3.  You can manually run the **ls** or **dir** command to verify that a
    **node\_modules** folder was created. Inside that folder find the
    **azure** package, which contains the libraries you need to access
    Notification Hub.

### Import the module

Using a text editor, add the following to the top of
the **server.js** file of the application:

    var azure = require('azure');

### Setup an Azure Notification Hub connection

The **NotificationHubService** object lets you work with notification hubs. The
following code creates a **NotificationHubService** object for the nofication hub named **hubname**. Add it near the
top of the **server.js** file, after the statement to import the azure
module:

    var notificationHubService = azure.createNotificationHubService('hubname','connectionstring');

The connection **connectionstring** value can be obtained from the Azure Management portal by performing the following steps:

1. From the Azure Management portal, select **Service Bus**, and then select the namespace that contains the notification hub.

2. Select **NOTIFICATION HUBS**, and then select the hub you wish to use.

3. Select **View Connection String** from the **quick glance** section, and copy the connection string value.

> [AZURE.NOTE] You can also retrieve the connection string using the **Get-AzureSbNamespace** cmdlet provided by Azure PowerShell or the **azure sb namespace show** command with the Azure Command-Line Interface (Azure CLI).

</div>

##How to send notifications

The **NotificationHubService** object exposes the following object instances for sending notifications to specific devices and applications:

* **Android** - use the **GcmService** object, which is available at **notificationHubService.gcm**
* **iOS** - use the **ApnsService** object, which is accessible at **notificationHubService.apns**
* **Windows Phone** - use the **MpnsService** object, which is available at **notificationHubService.mpns**
* **Windows Store applications** - use the **WnsService** object, which is available at **notificationHubService.wns**

### How to send Android application notifications

The **GcmService** object provides a **send** method that can be used to send notifications to Android applications. The **send** method accepts the following parameters:

* Tags - the tag identifier. If no tag is provided, the notification will be sent to al clients
* Payload - the message's JSON or string payload
* Callback - the callback function

For more information on the payload format, see the Payload section of [Implementing GCM Server](http://developer.android.com/google/gcm/server.html#payload).

The following code uses the **GcmService** instance exposed by the **NotificationHubService** to send a message to all clients.

	var payload = {
	  data: {
	    msg: 'Hello!'
	  }
	};
	notificationHubService.gcm.send(null, payload, function(error){
	  if(!error){
	    //notification sent
	  }
	});

### How to send iOS application notifications

The **ApnsService** object provides a **send** method that can be used to send notifications to iOS applications. The **send** method accepts the following parameters:

* Tags - the tag identifier. If no tag is provided, the notification will be sent to all clients
* Payload - the message's JSON or string payload
* Callback - the callback function

For more information the payload format, see The Notification Payload section of the [Local and Push Notification Programming Guide](http://developer.apple.com/library/ios/#documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/ApplePushService/ApplePushService.html).

The following code uses the **ApnsService** instance exposed by the **NotificationHubService** to send an alert message to all clients:

	var payload={
	    alert: 'Hello!'
	  };
	notificationHubService.apns.send(null, payload, function(error){
	  if(!error){
 	    // notification sent
      }
	});

### How to send Windows Phone notifications

The **MpnsService** object provides a **send** method that can be used to send notifications to Windows Phone applications. The **send** method accepts the following parameters:

* Tags - the tag identifier. If no tag is provided, the notification will be sent to all clients
* Payload - the message's XML payload
* TargetName - 'toast' for toast notifications. 'token' for tile notifications.
* NotificationClass - The priority of the notification. See the HTTP Header Elements section of [Push notifications from a server](http://msdn.microsoft.com/library/hh221551.aspx) for valid values.
* Options - optional request headers
* Callback - the callback function

For a list of valid TargetName, NotificationClass, and header options, see [Push notifications from a server](http://msdn.microsoft.com/library/hh221551.aspx).

The following code uses the **MpnsService** instance exposed by the **NotificationHubService** to send a toast alert:

	var payload = '<?xml version="1.0" encoding="utf-8"?><wp:Notification xmlns:wp="WPNotification"><wp:Toast><wp:Text1>string</wp:Text1><wp:Text2>string</wp:Text2></wp:Toast></wp:Notification>';
	notificationHubService.mpns.send(null, payload, 'toast', 22, function(error){
	  if(!error){
	    //notification sent
	  }
	});

### How to send Windows Store application notifications

The **WnsService** object provides a **send** method that can be used to send notifications to Windows Store applications.  The **send** method accepts the following parameters:

* Tags - the tag identifier. If no tag is provided, the notification will be sent to all clients
* Payload - the XML message payload
* Type - the notification type
* Options - optional request headers
* Callback - the callback function

For a list of valid Types and request headers, see [Push notification service request and response headers](http://msdn.microsoft.com/library/windows/apps/hh465435.aspx).

The following code uses the **WnsService** instance exposed by the **NotificationHubService** to send a toast alert:

	var payload = '<toast><visual><binding template="ToastText01"><text id="1">Hello!</text></binding></visual></toast>';
	notificationHubService.wns.send(null, payload , 'wns/toast', function(error){
	  if(!error){
 	    // notification sent
	  }
	});

## Next Steps

Now that you've learned the basics of using Notification Hub, follow these
links to learn more.

-   See the MSDN Reference: [Azure Notification Hubs][].
-   Visit the [Azure SDK for Node] repository on GitHub.

  [Azure SDK for Node]: https://github.com/WindowsAzure/azure-sdk-for-node
  [Next Steps]: #nextsteps
  [What are Service Bus Topics and Subscriptions?]: #what-are-service-bus-topics
  [Create a Service Namespace]: #create-a-service-namespace
  [Obtain the Default Management Credentials for the Namespace]: #obtain-default-credentials
  [Create a Node.js Application]: #Create_a_Nodejs_Application
  [Configure Your Application to Use Service Bus]: #Configure_Your_Application_to_Use_Service_Bus
  [How to: Create a Topic]: #How_to_Create_a_Topic
  [How to: Create Subscriptions]: #How_to_Create_Subscriptions
  [How to: Send Messages to a Topic]: #How_to_Send_Messages_to_a_Topic
  [How to: Receive Messages from a Subscription]: #How_to_Receive_Messages_from_a_Subscription
  [How to: Handle Application Crashes and Unreadable Messages]: #How_to_Handle_Application_Crashes_and_Unreadable_Messages
  [How to: Delete Topics and Subscriptions]: #How_to_Delete_Topics_and_Subscriptions
  [1]: #Next_Steps
  [Topic Concepts]: .media/notification-hubs-nodejs-how-to-use-notification-hubs/sb-topics-01.png
  [Azure Management Portal]: http://manage.windowsazure.com
  [image]: .media/notification-hubs-nodejs-how-to-use-notification-hubs/sb-queues-03.png
  [2]: .media/notification-hubs-nodejs-how-to-use-notification-hubs/sb-queues-04.png
  [3]: .media/notification-hubs-nodejs-how-to-use-notification-hubs/sb-queues-05.png
  [4]: .media/notification-hubs-nodejs-how-to-use-notification-hubs/sb-queues-06.png
  [5]: .media/notification-hubs-nodejs-how-to-use-notification-hubs/sb-queues-07.png
  [SqlFilter.SqlExpression]: http://msdn.microsoft.com/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.sqlexpression.aspx
  [Azure Service Bus Notification Hubs]: http://msdn.microsoft.com/library/windowsazure/jj927170.aspx
  [SqlFilter]: http://msdn.microsoft.com/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.aspx
  [Web Site with WebMatrix]: /develop/nodejs/tutorials/web-site-with-webmatrix/
  [Node.js Cloud Service]: ../cloud-services-nodejs-develop-deploy-app.md
[Previous Management Portal]: .media/notification-hubs-nodejs-how-to-use-notification-hubs/previous-portal.png
  [nodejswebsite]: /develop/nodejs/tutorials/create-a-website-(mac)/
  [Node.js Cloud Service with Storage]: /develop/nodejs/tutorials/web-app-with-storage/
  [Node.js Web Application with Storage]: /develop/nodejs/tutorials/web-site-with-storage/
