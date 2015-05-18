<properties 
	pageTitle="Get started with data (Android) | Mobile Dev Center" 
	description="Learn how to get started using Mobile Services to leverage data in your Android app." 
	services="mobile-services" 
	documentationCenter="android" 
	authors="RickSaling" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-android" 
	ms.devlang="java" 
	ms.topic="article" 
	ms.date="05/06/2015" 
	ms.author="ricksal"/>

# Add Mobile Services to an existing app

[AZURE.INCLUDE [mobile-services-selector-get-started-data](../includes/mobile-services-selector-get-started-data-EC.md)]

<div class="dev-onpage-video-clear clearfix">
<div class="dev-onpage-left-content">

<p>This topic shows you how to use Azure Mobile Services to leverage data in an Android app. In this tutorial, you will download an app that stores data in memory, create a new mobile service, integrate the mobile service with the app, and then login to the Azure Management Portal to view changes to data made when running the app.</p>

</div>
<div class="dev-onpage-video-wrapper"><a href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Android-Getting-Started-With-Data-Connecting-your-app-to-Windows-Azure-Mobile-Services" target="_blank" class="label">watch the tutorial</a> <a style="background-image: url('/media/devcenter/mobile/videos/mobile-android-get-started-data-180x120.png') !important;" href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Android-Getting-Started-With-Data-Connecting-your-app-to-Windows-Azure-Mobile-Services" target="_blank" class="dev-onpage-video"><span class="icon">Play Video</span></a><span class="time">15:32</span></div>
</div>

> [AZURE.NOTE] This tutorial is intended to help you better understand how Mobile Services enables you to use Azure to store and retrieve data from an Android app. As such, this topic walks you through many of the steps that are completed for you in the Mobile Services quickstart. If this is your first experience with Mobile Services, consider first completing the tutorial [Get started with Mobile Services](get-started-android-EC.md).
> 
> If you would like to see the source code of the completed app, go [here](https://github.com/RickSaling/mobile-services-samples/tree/futures/GettingStartedWithData/Android/GetStartedWithData).

To complete this tutorial, you need the following:

+ An Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=AE564AB28&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-services-android-get-started-data-EC%2F). 

+ The [Mobile Services Android SDK]; the <a href="https://go.microsoft.com/fwLink/p/?LinkID=280125" target="_blank">Android SDK</a>, which includes the Eclipse integrated development environment (IDE) and Android Developer Tools (ADT) plugin; and Android 4.2 or a later version. 

> [AZURE.NOTE] This tutorial provides instructions for installing both the Android SDK and the Mobile Services Android SDK. The downloaded GetStartedWithData project requires Android 4.2 or a later version. However, the Mobile Services SDK requires only Android 2.2 or a later version.

<!-- -->

> [AZURE.NOTE] This tutorial uses the latest version of the Mobile Services SDK. You can find an earlier version of it <a href="http://go.microsoft.com/fwlink/p/?LinkID=280126"> here</a> for backward compatibility purposes, but the code contained in these tutorials does not work with it.

##<a name="download-app"></a>Download the GetStartedWithData project

###Get the sample code

[AZURE.INCLUDE [download-android-sample-code](../includes/download-android-sample-code-EC.md)]

###Verify Android SDK Version

[AZURE.INCLUDE [Verify SDK](../includes/mobile-services-verify-android-sdk-version-EC.md)]


###Inspect and run the sample code

[AZURE.INCLUDE [mobile-services-android-run-sample-code](../includes/mobile-services-android-run-sample-code-EC.md)]

##<a name="create-service"></a>Create a new mobile service in the Management Portal

[AZURE.INCLUDE [mobile-services-create-new-service-data](../includes/mobile-services-create-new-service-data.md)]

##<a name="add-table"></a>Add a new table to the mobile service

[AZURE.INCLUDE [mobile-services-create-new-service-data-2](../includes/mobile-services-create-new-service-data-2.md)]

##<a name="update-app"></a>Update the app to use the mobile service for data access

[AZURE.INCLUDE [mobile-services-android-getting-started-with-data](../includes/mobile-services-android-getting-started-with-data-EC.md)]

##<a name="test-app"></a>Test the app against your new mobile service

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

Next, try these other Android tutorials:

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
[Get started with authentication]: mobile-services-android-get-started-users.md
[Get started with push notifications]: mobile-services-javascript-backend-android-get-started-push-EC.md

[Azure Management Portal]: https://manage.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Mobile Services Android SDK]: http://aka.ms/Iajk6q
[GitHub]:  http://go.microsoft.com/fwlink/p/?LinkID=282122
[Android SDK]: https://go.microsoft.com/fwLink/p/?LinkID=280125
