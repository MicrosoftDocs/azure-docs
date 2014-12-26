<properties pageTitle="Get started with push notification using a JavaScript backend mobile service" metaKeywords="" description="Learn how to use Azure Mobile Services and Notification Hubs to send push notifications to your universal Windows app." metaCanonical="" services="mobile-services,notification-hubs" documentationCenter="Mobile" title="Get started with push notifications in Mobile Services" authors="glenga" solutions="mobile" manager="dwrede" editor="" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-store" ms.devlang="dotnet" ms.topic="article" ms.date="09/27/2014" ms.author="glenga" />


# Add push notifications to your Mobile Services app

[WACOM.INCLUDE [mobile-services-selector-get-started-push](../includes/mobile-services-selector-get-started-push.md)]

This topic shows you how to use Azure Mobile Services with a JavaScript backend to send push notifications to a universal Windows app. In this tutorial you enable push notifications using Azure Notification Hubs in a universal Windows app project. When complete, your mobile service will send a push notification from the JavaScript backend to all registered Windows Store and Windows Phone Store apps each time a record is inserted in the TodoList table. The notification hub that you create is free with your mobile service, can be managed independent of the mobile service, and can be used by other applications and services.

>[AZURE.NOTE]This topic shows you how to use the tooling in Visual Studio 2013 with Update 3 to add support for push notifications from Mobile Services to a universal Windows app. The same steps can be used to add push notifications from Mobile Services to a Windows Store or Windows Phone Store 8.1 app. To add push notifications to a Windows Phone 8 or Windows Phone Silverlight 8.1 app, see this version of [Get started with push notifications in Mobile Services](/en-us/documentation/articles/mobile-services-javascript-backend-windows-phone-get-started-push).

> If you cannot upgrade to Visual Studio 2013 Update 3 or you prefer to manually add your mobile service project to a Windows Store app solution, see [this version](/en-us/documentation/articles/mobile-services-javscript-backend-windows-store-dotnet-get-started-push) of the topic.

This tutorial walks you through these basic steps to enable push notifications:

1. [Register your app for push notifications](#register)
2. [Update the service to send push notifications](#update-service)
3. [Test push notifications in your app](#test)

To complete this tutorial, you need the following:

* An active [Microsoft Store account](http://go.microsoft.com/fwlink/p/?LinkId=280045).
* [Visual Studio 2013 Express for Windows](http://go.microsoft.com/fwlink/?LinkId=257546) with Update 3, or a later version

##<a id="register"></a>Register your app for push notifications

[WACOM.INCLUDE [mobile-services-create-new-push-vs2013](../includes/mobile-services-create-new-push-vs2013.md)]

<ol start="6">
<li><p>Browse to the <code>\Services\MobileServices\your_service_name</code> project folder, open the generated push.register.cs code file, and inspect the <strong>UploadChannel</strong> method that registers the device's channel URL with the notification hub.</p></li> 
<li><p>Open the shared App.xaml.cs code file and notice that a call to the new <strong>UploadChannel</strong> method was added in the <strong>OnLaunched</strong> event handler.</p> <p>This makes sure that registration of the device is attempted whenever the app is launched.</p></li>
<li><p>Repeat the previous steps to add push notifications to the Windows Phone Store app project, then in the shared App.xaml.cs file, remove the extra call to <strong>UploadChannel</strong> and the remaining <code>#if...#endif</code> conditional wrapper.</p> <p>Both projects can now share a single call to <strong>UploadChannel</strong>.</p>
<div class="dev-callout"><strong>Note</strong> <p>You can also simplify the generated code by unifying the <code>#if...#endif</code> wrapped <a href="http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobileservices.mobileserviceclient.aspx">MobileServiceClient</a> definitions into a single  unwrapped definition used by both versions of the app.</p></div></li>
</ol>

Now that push notifications are enabled in the app, you must update the mobile service to send push notifications. 

##<a id="update-service"></a>Update the service to send push notifications

The following steps update the insert script registered to the TodoItem table. You can implement similar code in any server script or anywhere else in your backend services. 

[WACOM.INCLUDE [mobile-services-javascript-update-script-notification-hubs](../includes/mobile-services-javascript-update-script-notification-hubs.md)]


##<a id="test"></a> Test push notifications in your app

[WACOM.INCLUDE [mobile-services-javascript-backend-windows-universal-test-push](../includes/mobile-services-javascript-backend-windows-universal-test-push.md)]

## <a name="next-steps"> </a>Next steps

This tutorial demonstrated the basics of enabling a Windows Store app to use Mobile Services and Notification Hubs to send push notifications. Next, consider completing the next tutorial, [Send push notifications to authenticated users], which shows how to use tags to send push notifications from a Mobile Service to only an authenticated user.

Learn more about Mobile Services and Notification Hubs in the following topics:

* [Get started with data]
  <br/>Learn more about storing and querying data using mobile services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with different account types using mobile services.

* [What are Notification Hubs?]
  <br/>Learn more about how Notification Hubs works to deliver notifications to your apps across all major client platforms.

* [Debug Notification Hubs applications](http://go.microsoft.com/fwlink/p/?linkid=386630)
  </br>Get guidance troubleshooting and debugging Notification Hubs solutions. 

* [How to use a .NET client for Azure Mobile Services]
  <br/>Learn more about how to use Mobile Services from C# Windows apps.

<!-- Anchors. -->

<!-- Images. -->

<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started
[Get started with data]: /en-us/documentation/articles/mobile-services-javascript-backend-windows-universal-dotnet-get-started-data
[Get started with authentication]: /en-us/documentation/articles/mobile-services-javascript-backend-windows-universal-dotnet-get-started-users

[Send push notifications to authenticated users]: /en-us/documentation/articles/mobile-services-javascript-backend-windows-store-dotnet-push-notifications-app-users/

[What are Notification Hubs?]: /en-us/documentation/articles/notification-hubs-overview/

[How to use a .NET client for Azure Mobile Services]: /en-us/documentation/articles/mobile-services-windows-dotnet-how-to-use-client-library/
