<properties 
	pageTitle="Get Started with Azure Mobile Services for Android apps" 
	description="Follow this tutorial to get started using Azure Mobile Services for Android development." 
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
	ms.topic="hero-article" 
	ms.date="02/13/2015" 
	ms.author="ricksal;glenga"/>

# <a name="getting-started"> </a>Get started with Mobile Services

[AZURE.INCLUDE [mobile-services-selector-get-started](../includes/mobile-services-selector-get-started-EC.md)]

<div class="dev-onpage-video-clear clearfix">
<div class="dev-onpage-left-content">
<p>This tutorial shows you how to add a cloud-based backend service to an Android app using Azure Mobile Services. In this tutorial, you will create both a new mobile service and a simple <em>To do list</em> app that stores app data in the new mobile service.</p>
<p>A screenshot from the completed app is below:</p>
</div>
<div class="dev-onpage-video-wrapper"><a href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Android-Support-in-Windows-Azure-Mobile-Services" target="_blank" class="label">watch the tutorial</a> <a style="background-image: url('/media/devcenter/mobile/videos/mobile-get-started-android-180x120.png') !important;" href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Android-Support-in-Windows-Azure-Mobile-Services" target="_blank" class="dev-onpage-video"><span class="icon">Play Video</span></a><span class="time">7:26</span></div>
</div>

![][0]

Completing this tutorial requires the [Android Developer Tools][Android SDK], which includes the Eclipse integrated development environment (IDE), Android Developer Tools (ADT) plugin, and the latest Android platform. Android 4.2 or a later version is required. 

The downloaded quickstart project contains the Mobile Services SDK for Android. While this project requires Android 4.2 or a later version, the Mobile Services SDK requires only Android 2.2 or a later version.

> [AZURE.IMPORTANT] To complete this tutorial, you need an Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=AE564AB28"%20target="_blank).

<!-- -->

>[AZURE.NOTE] If you would like to see the source code of the completed app, go <a href="https://github.com/RickSaling/mobile-services-samples/tree/futures/GettingStarted/Android" target="_blank">here</a>.

## <a name="create-new-service"> </a>Create a new mobile service

[AZURE.INCLUDE [mobile-services-create-new-service](../includes/mobile-services-create-new-service.md)]

## Create a new Android app

Once you have created your mobile service, you can follow an easy quickstart in the Management Portal to either create a new app or modify an existing app to connect to your mobile service. 

In this section you will create a new Android app that is connected to your mobile service.

1.  In the Management Portal, click **Mobile Services**, and then click the mobile service that you just created.

2. In the quickstart tab, click **Android** under **Choose platform** and expand **Create a new Android app**.

   	![][6]

   	This displays the three easy steps to create an Android app connected to your mobile service.

  	![][7]

3. If you haven't already done so, download and install the [Android Developer Tools][Android SDK] on your local computer or virtual machine.

4. Click **Create TodoItem table** to create a table to store app data.


5. Now download your app:
	- The latest app version uses the Mobile Services Android SDK 2.0. You can download that version from <a href="https://github.com/RickSaling/mobile-services-samples/tree/futures">here</a>. Click **Download Zip**, unzip it, and the project is in GettingStarted under the Android folder.
	 
	- An earlier versio uses the prior version of the SDK. To use it, under **Download and run your app**, click **Download**. This downloads the project for the sample _To do list_ application that is connected to your mobile service. The project files are compressed, so browse to their location and expand the files on your computer.


## Run your Android app

The final stage of this tutorial is to build and run your new app.

2. In Eclipse, click **File** then **Import**, expand **Android**, click **Existing Android Code into Workspace**, and then click **Next.** 

 	![][14]

3. Click **Browse**, browse to the location of the expanded project files, click **OK**, make sure that the TodoActivity project is checked, then click **Finish**. 

 	![][15]

	This imports the project files into the current workspace.

   	![][8]

4. If you downloaded version 2.0 of the SDK, you need to update the code with the Url and key of your mobile service:
	- 	Find the **OnCreate** method in **TodoActivity.java** and locate the code that instantiates the mobile services client. The code is visible in the preceding image.
	- 	Replace "MobileServiceUrl" with the actual Url of your mobile service.
	- 	Replace "AppKey" with the key of your mobile service.
	- 	For more details consult the tutorial <a href="http://azure.microsoft.com/documentation/articles/mobile-services-android-get-started-data/">Add Mobile Services to an existing app</a>. 



4. From the **Run** menu, click **Run** to start the project in the Android emulator.

	> [AZURE.IMPORTANT] To be able to run the project in the Android emulator, you must define a least one Android Virtual Device (AVD). Use the AVD Manager to create and manage these devices.

5. In the app, type meaningful text, such as _Complete the tutorial_, and then click **Add**.

   	![][10]

   	This sends a POST request to the new mobile service hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile service, and the data is displayed in the list.

	> [AZURE.NOTE] You can review the code that accesses your mobile service to query and insert data, which is found in the ToDoActivity.java file.

6. Back in the Management Portal, click the **Data** tab and then click the **TodoItems** table.

   	![][11]

   	This lets you browse the data inserted by the app into the table.

   	![][12]

## <a name="next-steps"> </a>Next Steps
Now that you have completed the quickstart, learn how to perform additional important tasks in Mobile Services: 

* [Get started with data]
  <br/>Learn more about storing and querying data using Mobile Services.

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
[0]: ./media/mobile-services-android-get-started/mobile-quickstart-completed-android.png





[6]: ./media/mobile-services-android-get-started/mobile-portal-quickstart-android.png
[7]: ./media/mobile-services-android-get-started/mobile-quickstart-steps-android-EC.png
[8]: ./media/mobile-services-android-get-started/mobile-eclipse-quickstart.png

[10]: ./media/mobile-services-android-get-started/mobile-quickstart-startup-android.png
[11]: ./media/mobile-services-android-get-started/mobile-data-tab.png
[12]: ./media/mobile-services-android-get-started/mobile-data-browse.png

[14]: ./media/mobile-services-android-get-started/mobile-services-import-android-workspace.png
[15]: ./media/mobile-services-android-get-started/mobile-services-import-android-project.png

<!-- URLs. -->
[Get started with data]: mobile-services-android-get-started-data.md
[Get started with authentication]: mobile-services-android-get-started-users.md
[Get started with push notifications]: mobile-services-javascript-backend-android-get-started-push.md
[Android SDK]: https://go.microsoft.com/fwLink/p/?LinkID=280125
[Mobile Services Android SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533

[Management Portal]: https://manage.windowsazure.com/
