<properties linkid="dev-net-service-bus-amqp-overview" urlDisplayName="Service Bus Notification Hubs" pageTitle="Windows Azure Service Bus Notification Hubs" metaKeywords="Azure Service Bus push notifications, Azure Service Bus notification hubs, Azure messaging" metaDescription="Learn how to use Service Bus push notifications in Windows Azure. Code samples written in C# using the .NET API." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />

<div chunk="../chunks/article-left-menu.md" />

#Windows Azure Service Bus Notification Hubs


Push notification support in Windows Azure Service Bus enables you to access an easy-to-use, multiplatform, and scaled-out push infrastructure, which greatly simplifies the implementation of push notifications for both consumer and enterprise applications for mobile platforms.

<h2><span class="short-header">What are Push Notifications?</span>What are Push Notifications?</h2>

Smartphones and tablets have the ability to "notify" users when an event has occurred. On Windows Store applications, the notification can result in a _toast_: a modeless window appears, with a sound, to signal a new push. On Apple iOS devices, the push similarly interrupts the user with a dialog box to view or close the notification. Clicking **View** opens the application that is receiving the message.

Push notifications help mobile devices display fresh information while remaining energy-efficient. Push notifications are a vital component for consumer apps, where they are used to increase app engagement and usage. Notifications are also useful to enterprises, when up-to-date information increases employee responsiveness to business events. 

Some specific examples of mobile engagement scenarios are:

1.  Updating a tile on Windows 8 or Windows Phone with current financial information.
2.  Alerting a user with a toast that some work item has been assigned to that user, in a workflow-based enterprise app.
3.  Displaying a badge with the number of current sales leads in a CRM app (such as Microsoft Dynamics CRM).

<h2><span class="short-header">How Push Notifications Work</span>How Push Notifications Work</h2>

Push notifications are delivered through platform-specific infrastructures called _Platform Notification Systems_ (PNS). A PNS offers barebones functions (that is, no support for broadcast, personalization) and have no common interface. For instance, in order to send a notification to a Windows Store app, a developer must contact the WNS (Windows Notification Service), to send a notification to an iOS device, the same developer has to contact APNS (Apple Push Notification Service), and send the message a second time.

At a high level, though, all platform notification systems follow the same pattern:

1.  The client app contacts the PNS to retrieve its _handle_. The handle type depends on the system. For WNS, it is a URI or "notification channel." For APNS, it is a token.
2.  The client app stores this handle in the app _back-end_ for later usage. For WNS, the back-end is typically a cloud service. For Apple, the system is called a _provider_.
3.  To send a push notification, the app back-end contacts the PNS using the handle to target a specific client app instance.
4.  The PNS forwards the notification to the device specified by the handle.

![][0]

<h2><span class="short-header">The Challenges of Push Notifications</span>The Challenges of Push Notifications</h2>

While these systems are very powerful, they still leave much work to the app developer in order to implement even common push notification scenarios, like broadcast or push notification to a user.

Push notifications are one of the most requested features in cloud services for mobile apps. The reason is that the infrastructure required to make them work is fairly complex and mostly unrelated to the main business logic of the app. Some of the challenges in building an on demand push infrastructure are:

- **Platform dependency.** In order to send notifications to devices of different platforms, multiple interfaces must be coded in the back-end. Not only the low-level details are different but the presentation of the notification (tile, toast, or badge) is also platform-dependent which leads to complex and hard-to-maintain back-end code.

- **Scale.** Scaling this infrastructure has two aspects:
1. Per PNS guidelines, device tokens must be refreshed every time the app is launched. This leads to a large amount of traffic (and consequent database accesses) just to keep the device tokens up to date. When the number of devices grows (possibly to millions), the cost of creating and maintaining this infrastructure is nonnegligible.
2.  Most PNS’ do not support broadcast to multiple devices. It follows that a broadcast to millions of devices results in millions of calls to the PNS’. Being able to scale these requests is nontrivial as usually app developers want to keep the total latency down (i.e. the last device to receive the message should not receive the notification 30 minutes after the notifications has been sent, as for many cases it would defeat the purpose to have push notifications).
- **Routing.** PNS’ provide a way to send a message to a device. In most apps though notifications are targeted to users and/or interest groups (i.e. all employees assigned to a certain customer account). It follows that the app back-end has to maintain a registry that associates interest groups with device tokens in order to route the notifications to the correct devices. This overhead adds to the total time to market and maintenance costs of an app.

<h2><span class="short-header">Why Use the Service Bus Push Notification Hub?</span>Why Use the Service Bus Push Notification Hub?</h2>

The Service Bus eliminates one great complexity: you do not have to manage the challenges of push notifications. Instead, use a **Service Bus Notification Hub**. (The feature is only available in the Windows Azure Service Bus as a preview feature in January 2013. It is expected to transition to General Availability (GA) in midyear 2013.) 

Notification Hubs provide a ready-to-use push notification infrastructure that supports:

- **Multiple-platforms.** Notification Hubs provide a common interface to send notifications to all supported platforms. The app back-end can send notifications in platform-specific formats or in a platform-independent format. As of January 2013, Notification Hubs are able to push notifications to Windows Store apps and iOS apps. Support for Android and Windows Phone will be added soon.
- **Pub/Sub routing.** Each device, when sending its handle to a Notification Hub, can specify one or more _tags_. (See below for more details on tags.) Tags do not have to be pre-provisioned or disposed. Tags provide a simple way to send notifications to users/interest groups. Since tags can contain any app-specific identifier (such as user ids or group ids), their use frees the app back-end from the burden of having to store and manage device handles.
- **Scale.** Notification Hubs scale to millions of devices without the need of rearchitecting or sharding.

Notification Hubs use a full multiplatform, scaled-out push notification infrastructure, and considerably reduce the push-specific code that runs in the app backend. Notification Hubs implement all the functionalities of a push infrastructure. Devices are only responsible for registering their PNS handles, and the back-end responsible for sending platform independent messages to users or interest groups.

![][1]

**Note** As of January 2013, Notification Hubs are able to push notifications to Windows Store apps and iOS apps, from .NET backends. Support for Android and Windows Phone as well as additional back-end technologies (including Windows Azure Mobile Services) will be added soon.

  [0]: ../Media/SBPushNotifications1.gif
  [1]: ../Media/SBPushNotifications2.gif