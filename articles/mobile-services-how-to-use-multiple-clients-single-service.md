<properties linkid="" urlDisplayName="" pageTitle="How to use multiple clients with a single mobile service backend | Azure Mobile" metaKeywords="mobile services single backend" description="Learn how to use a single mobile service back-end from multiple client apps that target different mobile platforms, including Windows Store and Windows Phone." metaCanonical="" services="mobile-services,notification-hubs" documentationCenter="Mobile" title="Considerations for supporting multiple clients from a single mobile service" authors="glenga" solutions="" manager="" editor="mollybos" />

# Considerations for supporting multiple clients from a single mobile service
 
One of the major benefits of using Azure Mobile Services to support mobile app development is the ability to use a single backend service that supports an app on multiple client platforms. Mobile Services provides native client libraries for all major device platforms. 

Mobile Services makes it easy to develop apps on multiple client platforms using a single backend service and cross-platform developer tools. This topic discusses the following considerations for getting your app running on multiple client platforms while using a single mobile service backend:

+ [Cross-platform push notifications](#push)
+ [Cross-platform app development](#xplat-app-dev)
+ [Sharing code in Visual Studio projects](#shared-vs)


For more general information about Mobile Services, see the [Mobile Services developer center](/en-us/documentation/services/mobile-services/).

##<a id="push"></a>Cross-platform push notifications

Mobile Services uses Azure Notification Hubs for sending push notifications from your mobile service to your client apps on all major device platforms. Notification Hubs provide a consistent and unified infrastructure for creating and managing device registrations and for sending push notifications to devices running on all major device platforms. For more information, see [Azure Notification Hubs].

Platform-specific client registrations are created by calling the register function provided by the Mobile Services client for a specific platform. Notifications can then be sent from the mobile service by calling platform-specific APIs for the following platforms:

+ Apple Push Notification Service (APNS) for iOS apps
+ Google Cloud Messaging (GCM) service for Android apps
+ Windows Notification Service (WNS) for Windows Store, Windows Phone 8.1 Store, and universal Windows apps 
+ Microsoft Push Notification Service (MPNS) for Windows Phone Silverlight apps

>[WACOM.NOTE]Notification Hubs does not currently support using WNS to send push notifications to Windows Phone Silverlight 8.1 apps. You must use MPNS to send notifications to Silverlight and Windows Phone 8.0 and 7.0 apps.

Notification Hubs also supports platform-specific template registrations, which enables you to use a single API call to send a notification to your app running on any registered platform. For more information, see [Send cross-platform notifications to users].

>[WACOM.NOTE]An error occurs when a message is sent to a native device platform for which no device registrations exists. This error does not occur when sending template notifications.

Tables in the following sections link to the client-specific tutorials that show you how to implement push notifications for both mobile service backends.  

###.NET backend

In a .NET backend, you send notifications by calling the [SendAsync] method on the [PushClient](http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobile.service.notifications.pushclient.aspx) object obtained from the [ApiServices.Push](http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobile.service.apiservices.push.aspx) property. The push notification sent (native or template) depends on the specific [IPushMessage](http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobile.service.notifications.ipushmessage.aspx)-derived object that is passed to the [SendAsync] method, as shown in the following table: 

|Platform |[APNS](/en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started-push)|[GCM](/en-us/documentation/articles/mobile-services-dotnet-backend-android-get-started-push) |[WNS](/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started-push) |[MPNS](/en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-push)|
|-----|-----|----|----|-----|
|Native|[ApplePushMessage](http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobile.service.applepushmessage.aspx)   |[GooglePushMessage](http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobile.service.googlepushmessage.aspx)     |[WindowsPushMessage](http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobile.service.windowspushmessage.aspx) | [MnsPushMessage](http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobile.service.mpnspushmessage.aspx) |
|Template   |[TemplatePushMessage]|[TemplatePushMessage]|[TemplatePushMessage]|[TemplatePushMessage]

The following code sends a push notification from a .NET backend service to all iOS and Windows Store device registrations: 

	// Define a push notification for APNS.
	ApplePushMessage apnsMessage = new ApplePushMessage(item.Text, TimeSpan.FromHours(1));    

	// Define a push notification for WNS.
	WindowsPushMessage wnsMessage = new WindowsPushMessage();
    message.XmlPayload = @"<?xml version=""1.0"" encoding=""utf-8""?>" +
                         @"<toast><visual><binding template=""ToastText01"">" +
                         @"<text id=""1"">" + item.Text + @"</text>" +
                         @"</binding></visual></toast>";
    
	// Send push notifications to all registered iOS and Windows Store devices. 
    await Services.Push.SendAsync(apnsMessage);
	await Services.Push.SendAsync(wnsMessage);

For examples of how to send push notifications to the other native client platforms, click the platform links in the header of the above table. 

When you use template client registrations rather than native client registrations, you can send the same notification with only a single call to [SendAsync], as follows: 

	// Create a new template message and add the 'message' parameter.    
	var template = new TemplatePushMessage();
    template.Add("message", item.Text);

	// Send a push notification to all template registrations.
    await Services.Push.SendAsync(template); 
 
###JavaScript backend

In a JavaScript backend, you send notifications by calling the [SendAsync] method on the [PushClient](http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobile.service.notifications.pushclient.aspx) object obtained from the [ApiServices.Push](http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobile.service.apiservices.push.aspx) property. The push notification sent (native or template) depends on the specific [IPushMessage](http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobile.service.notifications.ipushmessage.aspx)-derived object that is passed to the **SendAsync** method, as shown in the following table: 

|Platform |[APNS](/en-us/documentation/articles/mobile-services-javascript-backend-ios-get-started-push)|[GCM](/en-us/documentation/articles/mobile-services-dotnet-backend-android-get-started-push) |[WNS](/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started-push) |[MPNS](/en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-push)|
|-----|-----|----|----|-----|
|Native|[ApplePushMessage](http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobile.service.applepushmessage.aspx)   |[GooglePushMessage](http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobile.service.googlepushmessage.aspx)     |[WindowsPushMessage](http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobile.service.windowspushmessage.aspx) | [MnsPushMessage](http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobile.service.mpnspushmessage.aspx) |
|Template   |[TemplatePushMessage]|[TemplatePushMessage]|[TemplatePushMessage]|[TemplatePushMessage]

The following code sends push notification to all iOS app registrations: 

	ApplePushMessage message = new ApplePushMessage("Hello from Mobile Services!", TimeSpan.FromHours(1));
    var result = await Services.Push.SendAsync(message);

For examples of how to send push notifications to the other native client platforms, click the platform links in the header of the above table.

>[WACOM.NOTE]An error occurs when a message is sent to a native device platform for which no device registrations exists. This error does not occur when sending template notifications.


##<a id="xplat-app-dev"></a>Cross-platform app development
Developing native mobile device apps for all of the major mobile device platforms requires you (or your organization) to have expertise in at least Objective-C, Java, and .NET programming languages. Because of the expense of developing across these disparate platforms, some developers elect to have customers run their using a fully browser-based web experience. However, these web-based apps only receive limited access to the native resources that provide the rich experience that users have come to expect on a mobile device. 

Cross-platform tools have been developed to provide a richer native experience on a mobile device, while still sharing a single code base. Mobile Services makes it easy to create and manage a backend service for cross-platform app development platforms by providing quickstart tutorials for the following development platforms: 

+ **Appcelerator**<br/>Appcelerator lets you use JavaScript to develop a single app that is compiled to run  as native on all mobile device platforms. This provides a rich user experience in UI, access to all native device resources, and native app performance. For more information, see the [Appcelerator tutorial][Appcelerator].
 
+ **PhoneGap**<br/>PhoneGap (a distribution of the Apache Cordova project) is a free and open source framework that lets you use standardized web APIs, HTML and JavaScript to develop a single app that runs on Android, iOS and Windows devices. PhoneGap provides a web view based UI, but with a user experience enhanced by accessing native resources on the device, such as such as push notifications, the accelerometer, camera, storage, geolocation, and the in-app browser. For more information, see the [PhoneGap quickstart tutorial][PhoneGap].

+ **Sencha Touch**<br/>Sencha Touch provides a set of controls, optimized for touch screens, that provide a like-native experience on a wide variety of mobile devices from a single HTML and JavaScript code base. Sencha Touch can be used along with PhoneGap or Cordova libraries to provide users access to native device resources. For more information, see the [Sencha Touch quickstart tutorial][Sencha].

+ **Xamarin**<br/>Xamarin lets you create fully native apps for both iOS and Android devices, UI to device resources. Xamarin apps are coded in C# instead of Objective-C and Java. This enables .NET developers to publish apps to iOS and Android and share code from Windows projects. Xamarin provides a fully native user experience, from . For more information, see [Xamarin development](#xamarin) below.


##<a id="shared-vs"></a>Sharing code in Visual Studio projects

You can now leverage your Visual Studio and C# development experience with Windows apps and even some code, by using Xamarin and Visual Studio to develop apps for iOS and Android.

### Windows universal apps

>[WACOM.NOTE]In order to use single sign-on client authentication using Microsoft Account in both Windows Store and Windows Phone 8.0 or Windows Phone 8.1 "Silverlight" apps, you must register the Windows Store app on the Windows Store dashboard first. This is because once you create a Live Connect registration for Windows Phone, you cannot create one for Windows Store. For more information about how to do this, please read the topic **Authenticate your Windows Store app with Live Connect single sign-on** ([Windows Store][SSO Windows Store]/[Windows Phone][SSO Windows Phone]).

###<a id="xamarin"></a>Xamarin development

### Windows Store and Windows Phone Silverlight apps

Windows Phone 8 apps use the same .NET Framework-based version of XAML as Silverlight, whereas Windows Store apps used a different WinRT-specific version of XAML. Universal Windows apps, which are supported in Windows 8.1 as Windows Store and Windows Phone Store apps, use the WinRT version of XAML. Windows Phone 8.1 Silverlight apps are still supported, using the .NET Framework and XAML version as Silverlight, although this flavor of XAML is being phased-out to provide a better single-source experience for Windows app development. For more information about this, see 

Portable class libraries enable you to write and build managed assemblies that work on more than one platform, such as Windows Store and Windows Phone. You can create classes that contain code you wish to share across many projects, and then reference those classes from different types of projects. 

You can use the .NET Framework Portable Class Library to implement the Model-View-View Model (MVVM) pattern and share assemblies across multiple platforms. You can implement the model and view model classes in a Portable Class Library project in Visual Studio 2012, and then create views that are customized for different platforms. The model code, common across platforms, may (as an example) retrieve the data from a source such as an Azure Mobile Service in a platform-agnostic manner. The MSDN Library provides an <a href="http://msdn.microsoft.com/en-us/library/gg597391(v=vs.110)">overview and example</a>, discussion of <a href="http://msdn.microsoft.com/en-us/library/gg597392(v=vs.110)">API differences</a>, an example of <a href="http://msdn.microsoft.com/en-us/library/hh563947(v=vs.110)">using portable class libraries to implement the MVVM pattern</a>, additional <a href="http://msdn.microsoft.com/en-us/library/windowsphone/develop/jj714086(v=vs.105).aspx">prescriptive guidance</a>, and information about <a href="http://msdn.microsoft.com/en-us/library/hh871422(v=vs.110)">managing resources</a> in portable class library projects.





<!-- URLs -->
[Azure Management portal]: https://manage.windowsazure.com
[Azure Notification Hubs]: /en-us/develop/net/how-to-guides/service-bus-notification-hubs/
[SSO Windows Store]: /en-us/develop/mobile/tutorials/single-sign-on-windows-8-dotnet/
[SSO Windows Phone]: /en-us/develop/mobile/tutorials/single-sign-on-wp8/
[Tutorials and resources]: /en-us/develop/mobile/resources/
[Get started with Notification Hubs]: /en-us/manage/services/notification-hubs/getting-started-windows-dotnet/
[Send cross-platform notifications to users]: /en-us/manage/services/notification-hubs/notify-users-xplat-mobile-services/
[Get started with push Windows dotnet]: /en-us/develop/mobile/tutorials/get-started-with-push-dotnet-vs2012/
[Get started with push Windows js]: /en-us/develop/mobile/tutorials/get-started-with-push-js-vs2012/
[Get started with push Windows Phone]: /en-us/develop/mobile/tutorials/get-started-with-push-wp8/
[Get started with push iOS]: /en-us/develop/mobile/tutorials/get-started-with-push-ios/
[Get started with push Android]: /en-us/develop/mobile/tutorials/get-started-with-push-android/
[Dynamic schema]: http://msdn.microsoft.com/en-us/library/windowsazure/jj193175.aspx
[push object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554217.aspx
[TemplatePushMessage]:http://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.mobile.service.templatepushmessage.aspx
[PhoneGap]: /en-us/documentation/articles/mobile-services-javascript-backend-phonegap-get-started/
[Sencha]: /en-us/documentation/articles/partner-sencha-mobile-services-get-started/
[Appcelerator]: /en-us/documentation/articles/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started
[SendAsync]: http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.mobile.service.notifications.pushclient.sendasync.aspx