<properties linkid="dev-nodejs-how-to-service-bus-notification-hub" urlDisplayName="Service Bus Notification Hubs" pageTitle="How to use Service Bus Notification Hubs (Node.js) - Windows Azure" metaKeywords="Get started Azure Service Bus Notification Hubs, Get Started Service Bus Notification Hubs, Azure notification, Azure messaging notifications, Service Bus notification Node.js" metaDescription="Learn how to use Service Bus Hubs in Windows Azure. Code samples are written for Node.js applications." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="larryfr" />


<div chunk="../chunks/article-left-menu.md" />

# How to Use Service Bus Notification Hubs

This guide will show you how to use Service Bus Notification Hubs
from Node.js applications. The scenarios covered include **sending notifications to iOS and Windows Store applications**. For more information on notification hubs, see the [Next Steps][] section.

## Table of Contents

-   [What is are Service Bus Notification Hubs?](#hub)
-   [Create a Node.js application](#create)
-   [Configure the application to use Service Bus](#config)
-   [How to: Send notifications](#send)
-   [Next Steps](#next)

##<a id="hub"></a> What are Service Bus Notification Hubs? 

Windows Azure Service Bus Notification Hubs provide an easy-to-use, multiplatform, scalable infrastructure for sending push notifications to mobile devices. For more information, see [Windows Azure Service Bus Notification Hubs](http://msdn.microsoft.com/en-us/library/windowsazure/jj927170.aspx).

##<a id="create"></a> Create a Node.js Application

Create a blank Node.js application. For instructions creating a Node.js application, see [Create and deploy a Node.js application to a Windows Azure Web Site], [Node.js Cloud Service] (using Windows PowerShell), or [Web Site with WebMatrix].

##<a id="config"></a> Configure Your Application to Use Service Bus

To use Windows Azure Service Bus, you need to download and use the
Node.js azure package. This includes a set of convenience libraries that
communicate with the Service Bus REST services.

### Use Node Package Manager (NPM) to obtain the package

1.  Use a command-line interface such as **PowerShell** (Windows,) **Terminal** (Mac,) or **Bash** (Unix), navigate to the folder where you created your sample application.

2.  Type **npm install azure** in the command window, which should
    result in the following output:

        azure@0.7.0 node_modules\azure
		├── dateformat@1.0.2-1.2.3
		├── xmlbuilder@0.4.2
		├── node-uuid@1.2.0
		├── mime@1.2.9
		├── underscore@1.4.4
		├── validator@0.4.28
		├── tunnel@0.0.2
		├── wns@0.5.3
		├── xml2js@0.2.6 (sax@0.4.2)
		└── request@2.16.6 (forever-agent@0.2.0, aws-sign@0.2.0, tunnel-agent@0.2.0, oauth-sign@0.2.0, json-stringify-safe@3.0.0, cookie-jar@0.2.0, node-uuid@1.4.0, qs@0.5.5, hawk@0.10.2, form-data@0.0.7)

3.  You can manually run the **ls** or **dir** command to verify that a
    **node\_modules** folder was created. Inside that folder find the
    **azure** package, which contains the libraries you need to access
    Service Bus notification hubs.

### Import the module

Using a text editor, add the following to the top of
the **server.js** file of the application:

    var azure = require('azure');

### Setup a Windows Azure Service Bus connection

The **NotificationHubService** object lets you work with notification hubs. The
following code creates a **NotificationHubService** object for the nofication hub named **hubname**. Add it near the
top of the **server.js** file, after the statement to import the azure
module:

    var notificationHubService = azure.createNotificationHubService('hubname','connectionstring');

The connection **connectionstring** value can be obtained from the Windows Azure Management portal by performing the following steps:

1. From the Windows Azure Management portal, select **Service Bus**, and then select the namespace that contains the notification hub.

2. Select **NOTIFICATION HUBS**, and then select the hub you wish to use.

3. Select **View Connection String** from the **quick glance** section, and copy the connection string value.

<div class="dev-callout">
<strong>Note</strong>
<p>You can also retrieve the connection string using the <b>Get-AzureSbNamespace</b> cmdlet provided by Windows Azure PowerShell or the <b>azure sb namespace show</b> command with the Windows Azure Command-Line Tools.</p>

</div>

##<a id="send"></a> How to send notifications

The **NotificationHubService** object exposes an instance of the **ApnsService** (notificationHubService.apns) and **WnsService** (notificationHubService.wns) objects. The **ApnsService** object is used to send notification to iOS applications. The **WnsService** object is used to send notifications to Windows Store applications.

### How to send iOS application notifications

The **ApnsService** object provides a **send** method that can be used to send notifications to iOS applications. The **send** method accepts the following parameters:

* Tags - the tag identifier. If no tag is provided, the notification will be sent to all clients.
* Payload - the message's JSON or string payload
* Callback - the callback function

For more information the payload format, see The Notification Payload section of the [Local and Push Notification Programming Guide](http://developer.apple.com/library/ios/#documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/ApplePushService/ApplePushService.html).

The following code uses the **ApnsService** instance exposed by the **NotificationHubService** to send an alert message to all clients:

	var payload='{ 
	    alert: 'Hello!'
	  }';
	notificationHubService.apns.send(null, payload, 
	  function(error){
	    if(!error){
 	      // notification sent
	    }
	  });

### How to send Windows Store application notifications

The **WnsService** object provides a **send** method that can be used to send notifications to Windows Store applications.  The **send** method accepts the following parameters:

* Tags - the tag identifier. If no tag is provided, the notification will be sent to all clients.
* Payload - the XML message payload
* Type - the notification type; 
* Options - optional request headers
* Callback - the callback function

For a list of valid Types and request headers, see [Push notification service request and response headers](http://msdn.microsoft.com/en-us/library/windows/apps/hh465435.aspx).

The following code uses the **WnsService** instance exposed by the **NotificationHubService** to send a toast alert:

	var payload = '<toast><visual><binding template="ToastText01"><text id="1">Hello!</text></binding></visual></toast>';
	notificationHubService.wns.send(null, payload , 'wns/toast', 
	  function(error){
	    if(!error){
 	      // notification sent
	    }
	  });

The **WnsService** object also exposes additional send methods that support the sending of specific notification types. For example, the **sendBadge** method allows you to send badge notifications by specifying a number or name of a status glyph. For more information on the status glyph values, see [http://msdn.microsoft.com/en-us/library/windows/apps/br212849.aspx](http://msdn.microsoft.com/en-us/library/windows/apps/br212849.aspx).

The following is an example of using the **sendBadge** method:

	notificationHubService.wns.sendBadge(null, 'alert',
      function (error) {
        if(!error){
	      // notification sent
	    }
	  });

##<a id="next"></a> Next Steps

Now that you've learned the basics of Service Bus topics, follow these
links to learn more.

-   See the MSDN Reference: [Windows Azure Service Bus Notification Hubs][].
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
  [Topic Concepts]: ../../dotNet/Media/sb-topics-01.png
  [Windows Azure Management Portal]: http://manage.windowsazure.com
  [image]: ../../dotNet/Media/sb-queues-03.png
  [2]: ../../dotNet/Media/sb-queues-04.png
  [3]: ../../dotNet/Media/sb-queues-05.png
  [4]: ../../dotNet/Media/sb-queues-06.png
  [5]: ../../dotNet/Media/sb-queues-07.png
  [SqlFilter.SqlExpression]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.sqlexpression.aspx
  [Windows Azure Service Bus Notification Hubs]: http://msdn.microsoft.com/en-us/library/windowsazure/jj927170.aspx
  [SqlFilter]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.aspx
  [Web Site with WebMatrix]: /en-us/develop/nodejs/tutorials/web-site-with-webmatrix/
  [Node.js Cloud Service]: {localLink:2221} "Node.js Web Application"
[Previous Management Portal]: ../../Shared/Media/previous-portal.png
  [Create and deploy a Node.js application to a Windows Azure Web Site]: /en-us/develop/nodejs/tutorials/create-a-website-(mac)/
  [Node.js Cloud Service with Storage]: /en-us/develop/nodejs/tutorials/web-app-with-storage/
  [Node.js Web Application with Storage]: /en-us/develop/nodejs/tutorials/web-site-with-storage/