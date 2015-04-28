<properties 
	pageTitle="Get started with push notification using a JavaScript backend mobile service" 
	description="Learn how to use Azure Mobile Services and Notification Hubs to send push notifications to your universal Windows app." 
	services="mobile-services,notification-hubs" 
	documentationCenter="windows" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/25/2015" 
	ms.author="glenga"/>


# Add push notifications to your Mobile Services app

[AZURE.INCLUDE [mobile-services-selector-get-started-push](../includes/mobile-services-selector-get-started-push.md)]

This topic shows you how to use Azure Mobile Services with a JavaScript backend to send push notifications to a universal Windows app. In this tutorial you enable push notifications using Azure Notification Hubs in a universal Windows app project. When complete, your mobile service will send a push notification from the JavaScript backend to all registered Windows Store and Windows Phone Store apps each time a record is inserted in the TodoList table. The notification hub that you create is free with your mobile service, can be managed independent of the mobile service, and can be used by other applications and services.

>[AZURE.NOTE]This topic shows you how to use the tooling in Visual Studio 2013 with Update 3 to add support for push notifications from Mobile Services to a universal Windows app. The same steps can be used to add push notifications from Mobile Services to a Windows Store or Windows Phone Store 8.1 app. To add push notifications to a Windows Phone 8 or Windows Phone Silverlight 8.1 app, see this version of [Get started with push notifications in Mobile Services](mobile-services-javascript-backend-windows-phone-get-started-push.md).

This tutorial walks you through these basic steps to enable push notifications:

1. [Register your app for push notifications](#register)
2. [Update the service to send push notifications](#update-service)
3. [Test push notifications in your app](#test)

To complete this tutorial, you need the following:

* An active [Microsoft Store account](http://go.microsoft.com/fwlink/p/?LinkId=280045).
* [Visual Studio 2013 Express for Windows](http://go.microsoft.com/fwlink/?LinkId=257546) with Update 3, or a later version

##<a id="register"></a>Register your app for push notifications

[AZURE.INCLUDE [mobile-services-create-new-push-vs2013](../includes/mobile-services-create-new-push-vs2013.md)]

<ol start="6">
<li><p>Browse to the <code>\Services\MobileServices\your_service_name</code> project folder, open the generated push.register.cs code file, and inspect the <strong>UploadChannel</strong> method that registers the device's channel URL with the notification hub.</p></li> 
<li><p>Open the shared App.xaml.cs code file and notice that a call to the new <strong>UploadChannel</strong> method was added in the <strong>OnLaunched</strong> event handler.</p> <p>This makes sure that registration of the device is attempted whenever the app is launched.</p></li>
<li><p>Repeat the previous steps to add push notifications to the Windows Phone Store app project, then in the shared App.xaml.cs file, remove the extra call to <strong>UploadChannel</strong> and the remaining <code>#if...#endif</code> conditional wrapper.</p> <p>Both projects can now share a single call to <strong>UploadChannel</strong>.</p>
<p>Note that you can also simplify the generated code by unifying the <code>#if...#endif</code> wrapped <a href="http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.mobileserviceclient.aspx">MobileServiceClient</a> definitions into a single  unwrapped definition used by both versions of the app.</p></li>
</ol>

Now that push notifications are enabled in the app, you must update the mobile service to send push notifications. 

##<a id="update-service"></a>Update the service to send push notifications

The following steps update the insert script registered to the TodoItem table. You can implement similar code in any server script or anywhere else in your backend services. 

[AZURE.INCLUDE [mobile-services-javascript-update-script-notification-hubs](../includes/mobile-services-javascript-update-script-notification-hubs.md)]


##<a id="test"></a> Test push notifications in your app

[AZURE.INCLUDE [mobile-services-javascript-backend-windows-universal-test-push](../includes/mobile-services-javascript-backend-windows-universal-test-push.md)]

## <a name="next-steps"> </a>Next steps

This tutorial demonstrated the basics of enabling a Windows Store app to use Mobile Services and Notification Hubs to send push notifications. Next, consider completing one of the following tutorials:

+ [Send push notifications to authenticated users](mobile-services-javascript-backend-windows-store-dotnet-push-notifications-app-users.md)
	<br/>Learn how to use tags to send push notifications from your mobile service to only an authenticated user.

+ [Send broadcast notifications to subscribers](notification-hubs-windows-store-dotnet-send-breaking-news.md)
	<br/>Learn how users can register and receive push notifications for categories they're interested in.

+ [Send platform-agnostic notifications to subscribers](notification-hubs-aspnet-cross-platform-notify-users.md)
	<br/>Learn how to use templates to send push notifications from your mobile service, without having to craft platform-specific payloads in your back-end.

Learn more about Mobile Services and Notification Hubs in the following topics:

* [Azure Notification Hubs - Diagnosis guidelines](notification-hubs-diagnosing.md)
	<br/>Learn how to troubleshoot your push notification issues.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with different account types using mobile services.

* [What are Notification Hubs?]
  <br/>Learn more about how Notification Hubs works to deliver notifications to your apps across all major client platforms.

* [How to use a .NET client for Azure Mobile Services]
  <br/>Learn more about how to use Mobile Services from C# Windows apps.

<!-- Anchors. -->

<!-- Images. -->

<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: mobile-services-dotnet-backend-windows-store-dotnet-get-started.md
[Get started with data]: mobile-services-javascript-backend-windows-universal-dotnet-get-started-data.md
[Get started with authentication]: mobile-services-javascript-backend-windows-universal-dotnet-get-started-users.md

[Send push notifications to authenticated users]: mobile-services-javascript-backend-windows-store-dotnet-push-notifications-app-users.md

[What are Notification Hubs?]: notification-hubs-overview.md

[How to use a .NET client for Azure Mobile Services]: mobile-services-windows-dotnet-how-to-use-client-library.md
