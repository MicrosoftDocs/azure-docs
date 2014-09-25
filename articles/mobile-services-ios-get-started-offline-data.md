<properties linkid="develop-mobile-tutorials-get-started-offline-data-ios" urlDisplayName="Getting Started with Offline Data" pageTitle="Get started with offline data in Mobile Services (iOS) | Mobile Dev Center" metaKeywords="" description="Learn how to use Azure Mobile Services to cache and sync offline data in your iOS application" metaCanonical="" disqusComments="1" umbracoNaviHide="1" documentationCenter="Mobile" title="Get started with offline data sync in Mobile Services" authors="wesmc" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-ios" ms.devlang="objective-c" ms.topic="article" ms.date="09/23/2014" ms.author="wesmc" />

# Get started with offline data sync in Mobile Services

<div class="dev-center-tutorial-selector sublanding">
<a href="/en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-offline-data" title="Windows Store C#">Windows Store C#</a>
<a href="/en-us/documentation/articles/mobile-services-windows-phone-get-started-offline-data" title="Windows Phone">Windows Phone</a>
<a href="/en-us/documentation/articles/mobile-services-ios-get-started-offline-data" title="iOS" class="current">iOS</a>
<a href="/en-us/documentation/articles/mobile-services-xamarin-ios-get-started-offline-data" title="Xamarin.iOS">Xamarin.iOS</a>
<a href="/en-us/documentation/articles/mobile-services-xamarin-android-get-started-offline-data" title="Xamarin.Android">Xamarin.Android</a>
</div>

This tutorial covers the offline sync feature of Mobile Services, which allows developers to write apps that are usable even when the end user has no network access. 

Offline sync has several potential uses:

* Improve app responsiveness by caching server data locally on the device
* Make apps resilient against intermittent network connectivity 
* Allow end-users to create and modify data even when there is no network access, supporting scenarios with little or no connectivity
* Sync data across multiple devices and detect conflicts when the same record is modified by two devices

This tutorial will show how to update the app from [Get started with Mobile Services] or [Get Started with Data] tutorial to support the offline features of Azure Mobile Services. Then you will add data in a disconnected offline scenario, sync those items to the online database, and then log in to the Azure Management Portal to view changes to data made when running the app.

>[WACOM.NOTE] To complete this tutorial, you need a Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=AE564AB28" target="_blank">Azure Free Trial</a>. 


## Get the sample app

**A full tutorial is coming soon. In the meantime, see the sample [iOS Offline ToDo list] and [companion blog post](http://aka.ms/iosoffline).**

<!-- ## Next steps

* [How to use the Mobile Services client library for iOS]
   -->

<!-- URLs. -->

[How to use the Mobile Services client library for iOS]: /en-us/documentation/articles/mobile-services-ios-how-to-use-client-library/
[iOS Offline ToDo list]: https://github.com/Azure/mobile-services-samples/tree/master/TodoOffline/iOS/blog20140611

[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-ios-get-started/
[Get started with data]: /en-us/documentation/articles/mobile-services-ios-get-started-data/
