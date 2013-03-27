<properties linkid="dev-nodejs-how-to-service-bus-notification-hub" urlDisplayName="Service Bus Notification Hubs" pageTitle="How to use Service Bus Notification Hubs (Node.js) - Windows Azure" metaKeywords="Get started Azure Service Bus Notification Hubs, Get Started Service Bus Notification Hubs, Azure notification, Azure messaging notifications, Service Bus notification Node.js" metaDescription="Learn how to use Service Bus Hubs in Windows Azure. Code samples are written for Node.js applications." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="larryfr" />


<div chunk="../chunks/article-left-menu.md" />

# How to Use Service Bus Notification Hubs

This guide will show you how to use Service Bus topics and subscriptions
from Node.js applications. The scenarios covered include **creating
topics and subscriptions, creating subscription filters, sending
messages** to a topic, **receiving messages from a subscription**, and
**deleting topics and subscriptions**. For more information on topics
and subscriptions, see the [Next Steps][] section.

## Table of Contents

-   [What are Service Bus Topics and Subscriptions?][]
-   [Create a Service Namespace][]
-   [Obtain the Default Management Credentials for the Namespace][]
-   [Create a Node.js Application][]
-   [Configure Your Application to Use Service Bus][]
-   [How to: Create a Topic][]
-   [How to: Create Subscriptions][]
-   [How to: Send Messages to a Topic][]
-   [How to: Receive Messages from a Subscription][]
-   [How to: Handle Application Crashes and Unreadable Messages][]
-   [How to: Delete Topics and Subscriptions][]
-   [Next Steps][1]

<div chunk="../../shared/chunks/howto-service-bus-topics.md" />

## Create a Node.js Application

Create a blank Node.js application. For instructions creating a Node.js application, see [Create and deploy a Node.js application to a Windows Azure Web Site], [Node.js Cloud Service] (using Windows PowerShell), or [Web Site with WebMatrix].

## Configure Your Application to Use Service Bus

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

The azure module will read the environment variables AZURE\_SERVICEBUS\_NAMESPACE and AZURE\_SERVICEBUS\_ACCESS\_KEY for information required to connect to your Windows Azure Service Bus. If these environment variables are not set, you must specify the account information when calling **createServiceBusService**.

For an example of setting the environment variables in a configuration file for a Windows Azure Cloud Service, see [Node.js Cloud Service with Storage].

For an example of setting the environment variables in the management portal for a Windows Azure Web Site, see [Node.js Web Application with Storage]

## How to send notifications

The **NotificationHubService** object lets you work with notification hubs. The
following code creates a **NotificationHubService** object for the nofication hub named **hubname**. Add it near the
top of the **server.js** file, after the statement to import the azure
module:

    var notificationHubService = azure.createNotificationHubService('hubname');

The **NotificationHubService** object exposes an instance of the **ApnsService** (notificationHubService.apns) and **WnsService** (notificationHubService.wns) objects. The **ApnsService** object is used to send notification to iOS applications. The **WnsService** object is used to send notifications to Windows Store applications. Both objects expose methods for sending notifications.

### How to send iOS application notifications

The **ApnsService** object provides a **send** method that can be used to send notifications to applications running on iOS devices. The **send** method accepts the following parameters:

* Tags - a comma-seperated list or array of tag identifiers
* Payload - the message's JSON or string payload
* Callback - the callback function



### How to send Windows Store application notifications

The **WnsService** object provides 

## Next Steps

Now that you've learned the basics of Service Bus topics, follow these
links to learn more.

-   See the MSDN Reference: [Queues, Topics, and Subscriptions][].
-   API reference for [SqlFilter][].
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
  [Queues, Topics, and Subscriptions]: http://msdn.microsoft.com/en-us/library/hh367516.aspx
  [SqlFilter]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.aspx
  [Web Site with WebMatrix]: /en-us/develop/nodejs/tutorials/web-site-with-webmatrix/
  [Node.js Cloud Service]: {localLink:2221} "Node.js Web Application"
[Previous Management Portal]: ../../Shared/Media/previous-portal.png
  [Create and deploy a Node.js application to a Windows Azure Web Site]: /en-us/develop/nodejs/tutorials/create-a-website-(mac)/
  [Node.js Cloud Service with Storage]: /en-us/develop/nodejs/tutorials/web-app-with-storage/
  [Node.js Web Application with Storage]: /en-us/develop/nodejs/tutorials/web-site-with-storage/