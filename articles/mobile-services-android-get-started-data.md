<properties linkid="develop-mobile-tutorials-get-started-with-data-android" urlDisplayName="Get Started with Data - Android" pageTitle="Get started with data (Android) | Mobile Dev Center" metaKeywords="Azure android data, Azure mobile services data, windows droid, windows android, microsoft droid, microsoft android" description="Learn how to get started using Mobile Services to leverage data in your Android app." metaCanonical="" services="mobile-services" documentationCenter="Mobile" title="Get started with data in Mobile Services" authors="ricksal,glenga" solutions="" manager="dwrede" editor="" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="Mobile-Android" ms.devlang="Java" ms.topic="article" ms.date="10/16/2014" ms.author="ricksal,glenga" />

# Add Mobile Services to an existing app

[WACOM.INCLUDE [mobile-services-selector-get-started-data](../includes/mobile-services-selector-get-started-data.md)]

<div class="dev-onpage-video-clear clearfix">
<div class="dev-onpage-left-content">

<p>This topic shows you how to use Azure Mobile Services to leverage data in an Android app. In this tutorial, you will download an app that stores data in memory, create a new mobile service, integrate the mobile service with the app, and then login to the Azure Management Portal to view changes to data made when running the app.</p>

</div>
<div class="dev-onpage-video-wrapper"><a href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Android-Getting-Started-With-Data-Connecting-your-app-to-Windows-Azure-Mobile-Services" target="_blank" class="label">watch the tutorial</a> <a style="background-image: url('/media/devcenter/mobile/videos/mobile-android-get-started-data-180x120.png') !important;" href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Android-Getting-Started-With-Data-Connecting-your-app-to-Windows-Azure-Mobile-Services" target="_blank" class="dev-onpage-video"><span class="icon">Play Video</span></a><span class="time">15:32</span></div>
</div>

> [AZURE.NOTE] This tutorial is intended to help you better understand how Mobile Services enables you to use Azure to store and retrieve data from an Android app. As such, this topic walks you through many of the steps that are completed for you in the Mobile Services quickstart. If this is your first experience with Mobile Services, consider first completing the tutorial [Get started with Mobile Services](/en-us/develop/mobile/tutorials/get-started-android).
> 
> If you would like to see the source code of the completed app, go [here](https://github.com/RickSaling/mobile-services-samples/tree/futures/GettingStartedWithData/Android/GetStartedWithData).


This tutorial walks you through these basic steps:

1. [Download the Android app project] 
2. [Create the mobile service]
3. [Add a data table for storage]
4. [Update the app to use Mobile Services]
5. [Test the app against Mobile Services]

> [AZURE.IMPORTANT] To complete this tutorial, you need an Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=AED8DE357"%20target="_blank). 

This tutorial requires the [Mobile Services Android SDK]; the <a href="https://go.microsoft.com/fwLink/p/?LinkID=280125" target="_blank">Android SDK</a>, which includes the Eclipse integrated development environment (IDE) and Android Developer Tools (ADT) plugin; and Android 4.2 or a later version. 

> [AZURE.NOTE] This tutorial provides instructions for installing both the Android SDK and the Mobile Services Android SDK. The downloaded GetStartedWithData project requires Android 4.2 or a later version. However, the Mobile Services SDK requires only Android 2.2 or a later version.

>[AZURE.NOTE] This tutorial uses the latest version of the Mobile Services SDK. You can find an earlier version of it <a href="http://go.microsoft.com/fwlink/p/?LinkID=280126"> here</a> for backward compatibility purposes, but the code contained in these tutorials does not work with it.

<h2><a name="download-app"></a>Download the GetStartedWithData project</h2>

###Get the sample code

[WACOM.INCLUDE [download-android-sample-code](../includes/download-android-sample-code.md)]

###Verify Android SDK Version

[WACOM.INCLUDE [Verify SDK](../includes/mobile-services-verify-android-sdk-version.md)]


###Inspect and run the sample code

[WACOM.INCLUDE [mobile-services-android-run-sample-code](../includes/mobile-services-android-run-sample-code.md)]

<h2><a name="create-service"></a>Create a new mobile service in the Management Portal</h2>

[WACOM.INCLUDE [mobile-services-create-new-service-data](../includes/mobile-services-create-new-service-data.md)]

<h2><a name="add-table"></a>Add a new table to the mobile service</h2>

[WACOM.INCLUDE [mobile-services-create-new-service-data-2](../includes/mobile-services-create-new-service-data-2.md)]

<h2><a name="update-app"></a>Update the app to use the mobile service for data access</h2>

[WACOM.INCLUDE [mobile-services-android-getting-started-with-data](../includes/mobile-services-android-getting-started-with-data.md)]


<h2><a name="test-app"></a>Test the app against your new mobile service</h2>

Now that the app has been updated to use Mobile Services for back end storage, you can test it against Mobile Services, using either the Android emulator or an Android phone.

1. From the **Run** menu, click **Run** to start the project.

	This executes your app, built with the Android SDK, that uses the client library to send a query that returns items from your mobile service.

5. As before, type meaningful text, then click **Add**.

   	This sends a new item as an insert to the mobile service.

3. In the [Management Portal], click **Mobile Services**, and then click your mobile service.

4. Click the **Data** tab, then click **Browse**.

   	![][9]
  
   	Notice that the **TodoItem** table now contains data, with some values generated by Mobile Services, and that columns have been automatically added to the table to match the TodoItem class in the app.

This concludes the **Get started with data** tutorial for Android.

## <a name="next-steps"> </a>Next steps

This tutorial demonstrated the basics of enabling an Android app to work with data in Mobile Services. 

Next, consider completing one of the following tutorials that is based on the GetStartedWithData app that you created in this tutorial:

* [Validate and modify data with scripts]
  <br/>Learn more about using server scripts in Mobile Services to validate and change data sent from your app.

* [Refine queries with paging]
  <br/>Learn how to use paging in queries to control the amount of data handled in a single request.

Once you have completed the data series, try these other Android tutorials:

* [Get started with authentication] 
	<br/>Learn how to authenticate users of your app.

* [Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app with Mobile Services.

<!-- Anchors. -->
[Download the Android app project]: #download-app
[Create the mobile service]: #create-service
[Add a data table for storage]: #add-table
[Update the app to use Mobile Services]: #update-app
[Test the app against Mobile Services]: #test-app
[Next Steps]:#next-steps

<!-- Images. -->
[8]: ./media/mobile-services-android-get-started-data/mobile-dashboard-tab.png
[9]: ./media/mobile-services-android-get-started-data/mobile-todoitem-data-browse.png
[12]: ./media/mobile-services-android-get-started-data/mobile-eclipse-project.png
[13]: ./media/mobile-services-android-get-started-data/mobile-quickstart-startup-android.png
[14]: ./media/mobile-services-android-get-started-data/mobile-services-import-android-workspace.png
[15]: ./media/mobile-services-android-get-started-data/mobile-services-import-android-project.png


<!-- URLs. -->
[Validate and modify data with scripts]: /en-us/develop/mobile/tutorials/validate-modify-and-augment-data-dotnet
[Refine queries with paging]: /en-us/develop/mobile/tutorials/add-paging-to-data-android
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-android
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-android
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-android
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-android

[Azure Management Portal]: https://manage.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Mobile Services Android SDK]: http://aka.ms/Iajk6q
[GitHub]:  http://go.microsoft.com/fwlink/p/?LinkID=282122
[Android SDK]: https://go.microsoft.com/fwLink/p/?LinkID=280125
