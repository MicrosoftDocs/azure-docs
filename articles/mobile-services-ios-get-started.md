<properties pageTitle="Get Started with Azure Mobile Services for iOS apps" metaKeywords="Azure iOS application, mobile service iOS, getting started Azure iOS" description="Follow this tutorial to get started using Azure Mobile Services for iOS development." metaCanonical="" services="" documentationCenter="ios" title="" authors="krisragh" solutions="" manager="dwrede" editor=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-ios" ms.devlang="objective-c" ms.topic="hero-article" ms.date="10/10/2014" ms.author="krisragh" />

# <a name="getting-started"> </a>Get started with Mobile Services

[AZURE.INCLUDE [mobile-services-selector-get-started](../includes/mobile-services-selector-get-started.md)]

<div class="dev-onpage-video-clear clearfix">
<div class="dev-onpage-left-content">
<p>This tutorial shows you how to add a cloud-based backend service to an iOS app using Azure Mobile Services.</p>
<p>If you prefer to watch a video, the clip to the right follows the same steps as this tutorial.</p>
</div>
<div class="dev-onpage-video-wrapper"><a href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/iOS-Creating-your-first-app-using-the-Windows-Azure-Mobile-Services-Quickstart" target="_blank" class="label">watch the tutorial</a> <a style="background-image: url('/media/devcenter/mobile/videos/get-started-ios-180x120.png') !important;" href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/iOS-Creating-your-first-app-using-the-Windows-Azure-Mobile-Services-Quickstart" target="_blank" class="dev-onpage-video"><span class="icon">Play Video</span></a> <span class="time">9:38</span></div>
</div>

In this tutorial, you will create both a new mobile service and a simple _To do list_ app that stores app data in the new mobile service. The mobile service that you will create uses JavaScript for server-side business logic. To create a mobile service that lets you write your server-side business logic in the supported .NET languages using Visual Studio, see the [.NET backend version] of this topic.

A screenshot from the completed app is below:

![][0]

Completing this tutorial requires XCode 4.5 and iOS 5.0 or later versions.

> [AZURE.NOTE] To complete this tutorial, you need an Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free mobile services that you can keep using even after your trial ends. For details, see [Azure Free Trial](http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=AE564AB28&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started-ios%2F%20 target="_blank").

## <a name="create-new-service"> </a>Create a new mobile service

[AZURE.INCLUDE [mobile-services-create-new-service](../includes/mobile-services-create-new-service.md)]

<h2>Create a new iOS app</h2>

Once you have created your mobile service, you can follow an easy quickstart in the Management Portal to either create a new app or modify an existing app to connect to your mobile service.

In this section you will create a new iOS app that is connected to your mobile service.

1.  In the Management Portal, click **Mobile Services**, and then click the mobile service that you just created.

2. In the quickstart tab, click **iOS** under **Choose platform** and expand **Create a new iOS app**.

   	![][6]

   	This displays the three easy steps to create an iOS app connected to your mobile service.

  	![][7]

3. If you haven't already done so, download and install [Xcode] v4.4 or a later version.

4. Click **Create TodoItems table** to create a table to store app data.

5. Under **Download and run your app**, click **Download**.

  	This downloads the project for the sample _To do list_ application that is connected to your mobile service, along with the Mobile Services iOS SDK. Save the compressed project file to your local computer, and make a note of where you saved it.

## Run your new iOS app

[AZURE.INCLUDE [mobile-services-ios-run-app](../includes/mobile-services-ios-run-app.md)]

<ol start="4">
<li><p>Back in the Management Portal, click the <strong>Data</strong> tab and then click the <strong>TodoItems</strong> table.<p></li></ol>

![](./media/mobile-services-ios-get-started/mobile-data-tab.png)

This lets you browse the data inserted by the app into the table.</p>

![](./media/mobile-services-ios-get-started/mobile-data-browse.png)


## <a name="next-steps"> </a>Next Steps
Now that you have completed the quickstart, learn how to perform additional important tasks in Mobile Services:

* [Get started with data]
  <br/>Learn more about storing and querying data using Mobile Services.

* [Get started with offline data sync]
  <br/>Learn how to use offline data sync to make your app responsive and robust.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with an identity provider.

* [Get started with push notifications]
  <br/>Learn how to send a very basic push notification to your app.


<!-- Anchors. -->
[Getting started with Mobile Services]:#getting-started
[Create a new mobile service]:#create-new-service
[Define the mobile service instance]:#define-mobile-service-instance
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ./media/mobile-services-ios-get-started/mobile-quickstart-completed-ios.png

[6]: ./media/mobile-services-ios-get-started/mobile-portal-quickstart-ios.png
[7]: ./media/mobile-services-ios-get-started/mobile-quickstart-steps-ios.png
[8]: ./media/mobile-services-ios-get-started/mobile-xcode-project.png

[10]: ./media/mobile-services-ios-get-started/mobile-quickstart-startup-ios.png
[11]: ./media/mobile-services-ios-get-started/mobile-data-tab.png
[12]: ./media/mobile-services-ios-get-started/mobile-data-browse.png


<!-- URLs. -->
[Get started with data]: /en-us/documentation/articles/mobile-services-ios-get-started-data/
[Get started with authentication]: /en-us/documentation/articles/mobile-services-ios-get-started-users/
[Get started with offline data sync]: /en-us/documentation/articles/mobile-services-ios-get-started-offline-data
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-javascript-backend-ios-get-started-push/

[Mobile Services iOS SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[Management Portal]: https://manage.windowsazure.com/
[XCode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[.NET backend version]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started
