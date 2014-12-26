<properties pageTitle="Get started with push notifications (Windows Store) | Mobile Dev Center" metaKeywords="" description="Learn how to use Azure Mobile Services to send push notifications to your Windows Store app (legacy push)." metaCanonical="" services="mobile-services,notification-hubs" documentationCenter="Mobile" title="Get started with push notifications in Mobile Services (legacy push)" authors="glenga" solutions="" manager="dwrede" editor="" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-store" ms.devlang="dotnet" ms.topic="article" ms.date="09/11/2014" ms.author="glenga" />

# Add push notifications to your Mobile Services app (legacy push)

<div class="dev-center-tutorial-selector sublanding">
    <a href="/en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-push" title="Windows Store C#" class="current">Windows Store C#</a>
    <a href="/en-us/documentation/articles/mobile-services-windows-store-javascript-get-started-push" title="Windows Store JavaScript">Windows Store JavaScript</a>
    <a href="/en-us/documentation/articles/mobile-services-windows-phone-get-started-push" title="Windows Phone">Windows Phone</a>
    <a href="/en-us/documentation/articles/mobile-services-ios-get-started-push" title="iOS">iOS</a>
    <a href="/en-us/documentation/articles/mobile-services-android-get-started-push" title="Android">Android</a>
<!--    <a href="/en-us/documentation/articles/partner-xamarin-mobile-services-ios-get-started-push" title="Xamarin.iOS">Xamarin.iOS</a>
    <a href="/en-us/documentation/articles/partner-xamarin-mobile-services-android-get-started-push" title="Xamarin.Android">Xamarin.Android</a> -->
	<a href="/en-us/documentation/articles/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started-push" title="Appcelerator">Appcelerator</a>
</div>

<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started-push/" title=".NET backend">.NET backend</a> | <a href="/en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-push/"  title="JavaScript backend" class="current">JavaScript backend</a></div>	

This topic shows how Visual Studio 2013 lets you use Azure Mobile Services to send push notifications to your Windows Store app. In this tutorial you add push notifications using the Windows Push Notification service (WNS) to the quickstart project, right from Visual Studio. When complete, your mobile service will send a push notification each time a record is inserted.

>[AZURE.NOTE]This topic supports <em>existing</em> mobile services that have <em>not yet been upgraded</em> to use Notification Hubs integration. When you create a <em>new</em> mobile service, this integrated functionality is automatically enabled. For new mobile services, see [Get started with push notifications](/en-us/documentation/articles/mobile-services-javascript-backend-windows-store-dotnet-get-started-push/).
>
>Mobile Services integrates with Azure Notification Hubs to support additional push notification functionality, such as templates, multiple platforms, and improved scale. <em>You should upgrade your existing mobile services to use Notification Hubs when possible</em>. Once you have upgraded, see this version of [Get started with push notifications](/en-us/documentation/articles/mobile-services-javascript-backend-windows-store-dotnet-get-started-push/).

This tutorial walks you through these basic steps to enable push notifications:

1. [Register your app for push notifications and configure Mobile Services]
2. [Update the generated push notification code]
3. [Insert data to receive notifications]

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete either [Get started with Mobile Services] or [Get started with data] to connect your project to the mobile service. When a mobile service has not been connected, the Add Push Notification wizard creates this connection for you. 

<h2><a name="register"></a>Add and configure push notifications in the app</h2>

[WACOM.INCLUDE [mobile-services-create-new-push-vs2013](../includes/mobile-services-create-new-push-vs2013.md)]

<ol start="6">
<li><p>Expand <strong>services</strong>, <strong>mobile services</strong>, your service name, open the generated code file, and then inspect the <strong>UploadChannel</strong> method that obtains the installation ID and channel for the device and inserts this data into the new channels table.</p> 

<p>A call to this method was also added by the wizard to the <strong>OnLaunched</strong> event handler in the App.xaml.cs code file. This ensures that registration of the device is attempted whenever the app is launched.</p></li> 
<li><p>In Server Explorer, expand <strong>Azure</strong>, <strong>Mobile Services</strong>, your service name, and <strong>channels</strong>, then open the insert.js file.</p> 

<p>This file, which is stored in your mobile service, contains JavaScript code that is executed when a client sends a request to register a device by inserting data into the channels table.</p> 

<div class="dev-callout"><b>Note</b>
	<p>The initial version of this file contains code that checks for an existing registration for the device. It also contains code that sends a push notification when a new registration is added to the channels table. The code that sends a push notification can be included in any registered script file. The location of this script depends on how the notification is triggered. Scripts can be registered against an insert, update, delete or read operation against a table; as a scheduled job; or as a custom API. For more information, see <a href="http://go.microsoft.com/fwlink/p/?LinkID=287178">Work with server scripts in Mobile Services</a>.</p>
</div>
</li> 
<li><p>Press the F5 key to run the app and verify that a notification is immediately received from the mobile service.</p>
<p>This notification was generated by inserting a row into the new channels table, which is the device registration.</p>
</li>
</ol>
While the generated code makes it easy to demonstrate a notification when the app is run, this is not generally a meaningful scenario. Next, you will remove the notification code from the channels table and replace it, with some changes, in the TodoItem table. 

<h2><a name="update-scripts"></a>Update the generated push notification code</h2>

[WACOM.INCLUDE [mobile-services-create-new-push-vs2013-2](../includes/mobile-services-create-new-push-vs2013-2.md)]

<h2><a name="test"></a>Test push notifications in your app</h2>

1. In Visual Studio, press the F5 key to run the app.

2. In the app, type text in **Insert a TodoItem**, and then click **Save**.

   	![][13]

   	Note that after the insert completes, the app receives a push notification from WNS.

   	![][14]

## <a name="next-steps"> </a>Next steps

This tutorial demonstrated the basics of enabling a Windows Store app to work with data in Mobile Services. Next, consider completing one of the following tutorials that is based on the GetStartedWithData app that you created in this tutorial:

+ [Get started with Notification Hubs]
  <br/>Learn how to leverage Notification Hubs in your Windows Store app.

+ [Send notifications to subscribers]
	<br/>Learn how users can register and receive push notifications for categories they're interested in.

+ [Send notifications to users]
	<br/>Learn how to send push notifications from a Mobile Service to specific users on any device.

+ [Send cross-platform notifications to users]
	<br/>Learn how to use templates to send push notifications from a Mobile Service, without having to craft platform-specific payloads in your back-end.

Consider finding out more about the following Mobile Services topics:

* [Get started with data]
  <br/>Learn more about storing and querying data using Mobile Services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with Windows Account.

* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

* [Mobile Services .NET How-to Conceptual Reference]
  <br/>Learn more about how to use Mobile Services with .NET.

<!-- Anchors. -->
[Register your app for push notifications and configure Mobile Services]: #register
[Update the generated push notification code]: #update-scripts
[Insert data to receive notifications]: #test
[Next Steps]:#next-steps

<!-- Images. -->











[13]: ./media/mobile-services-windows-store-dotnet-get-started-push/mobile-quickstart-push1.png
[14]: ./media/mobile-services-windows-store-dotnet-get-started-push/mobile-quickstart-push2.png




<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-dotnet/
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-dotnet
[Push notifications to app users]: /en-us/develop/mobile/tutorials/push-notifications-to-users-dotnet
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-dotnet
[JavaScript and HTML]: /en-us/develop/mobile/tutorials/get-started-with-push-js

[Azure Management Portal]: https://manage.windowsazure.com/
[wns object]: http://go.microsoft.com/fwlink/p/?LinkId=260591
[Mobile Services .NET How-to Conceptual Reference]: /en-us/develop/mobile/how-to-guides/work-with-net-client-library/
[Validate and modify data with scripts]: /en-us/develop/mobile/tutorials/validate-modify-and-augment-data-dotnet
[Refine queries with paging]: /en-us/develop/mobile/tutorials/add-paging-to-data-dotnet
[Get started with Notification Hubs]: /en-us/manage/services/notification-hubs/getting-started-windows-dotnet/
[What are Notification Hubs?]: /en-us/develop/net/how-to-guides/service-bus-notification-hubs/
[Send notifications to subscribers]: /en-us/manage/services/notification-hubs/breaking-news-dotnet/
[Send notifications to users]: /en-us/manage/services/notification-hubs/notify-users/
[Send cross-platform notifications to users]: /en-us/manage/services/notification-hubs/notify-users-xplat-mobile-services/
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
