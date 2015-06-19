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

##Overview

This topic shows you how to use Azure Mobile Services as a backend datasource for an Android app. In this tutorial, you will create a new mobile service, download an Eclipse Android project for an app that stores data in memory, integrate the mobile service with the app, and view the changes to data made when running the app.

The mobile service that you create in this tutorial supports the .NET runtime in the Mobile Service. This allows you to use .NET languages and Visual Studio for server-side business logic in the mobile service. To create a mobile service that lets you write your server-side business logic in JavaScript, see the [JavaScript backend version](mobile-services-android-get-started-data-EC.md) of this topic.

To complete this tutorial, you need the following:

+ <a href="https://go.microsoft.com/fwLink/p/?LinkID=391934" target="_blank">Visual Studio 2013</a> (Update 3 or a later version). 

+ An Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=AE564AB28&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-services-dotnet-backend-android-get-started-data-EC%2F). 

##<a name="create-service"></a>Create a new mobile service

[AZURE.INCLUDE [mobile-services-dotnet-backend-create-new-service](../includes/mobile-services-dotnet-backend-create-new-service.md)]


##<a name="download-the-service"></a>Download the service to your local computer

[AZURE.INCLUDE [mobile-services-download-service-locally](../includes/mobile-services-download-service-locally.md)]

##<a name="test-the-service"></a>Test the mobile service

[AZURE.INCLUDE [mobile-services-dotnet-backend-test-local-service](../includes/mobile-services-dotnet-backend-test-local-service.md)]

##<a name="publish-the-service"></a>Publish the mobile service to Azure

[AZURE.INCLUDE [mobile-services-dotnet-backend-publish-service](../includes/mobile-services-dotnet-backend-publish-service.md)]

##<a name="download-app"></a>Download the GetStartedWithData project

###Get the sample code

[AZURE.INCLUDE [mobile-services-dotnet-backend-create-new-service](../includes/download-android-sample-code-EC.md)]

###Verify Android SDK Version

[AZURE.INCLUDE [mobile-services-verify-android-sdk-version](../includes/mobile-services-verify-android-sdk-version-EC.md)]


###Inspect and run the sample code

[AZURE.INCLUDE [mobile-services-android-run-sample-code](../includes/mobile-services-android-run-sample-code-EC.md)]

##<a name="update-app"></a>Update the app to use the mobile service for data access

[AZURE.INCLUDE [mobile-services-android-getting-started-with-data](../includes/mobile-services-android-getting-started-with-data-EC.md)]

##<a name="test-app"></a>Test the app against the published mobile service

Now that the app has been updated to use Mobile Services for back end storage, you can test it against Mobile Services, using either the Android emulator or an Android phone.

1. From the **Run** menu, click **Run** to start the project.

	This executes your app, built with the Android SDK, that uses the client library to send a query that returns items from your mobile service.

5. As before, type meaningful text, then click **Add**.

   	This sends a new item as an insert to the mobile service.

    You can restart the app to see that the changes were persisted to the database in Azure. You can also examine the database using the Azure Management portal:  the next two steps do this to view the changes in your database.


4. In the Azure Management Portal, click manage for the database associated with your mobile service.

    ![](./media/mobile-services-dotnet-backend-android-get-started-data/manage-sql-azure-database.png)

5. In the Management portal execute a query to view the changes made by the Windows Store app. Your query will be similar to the following query but use your database name instead of `todolist`.

        SELECT * FROM [todolist].[todoitems]

    ![](./media/mobile-services-dotnet-backend-android-get-started-data/sql-azure-query.png)

This concludes the **Get started with data** tutorial for Android.


## <a name="next-steps"> </a>Next steps

This tutorial demonstrated the basics of enabling an Android app to work with data in Mobile Services. 

Try one of these other tutorials:

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app.

* [Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app.

* [Mobile Services Android How-to Conceptual Reference](mobile-services-android-how-to-use-client-library.md)
  <br/>Learn more about how to use Mobile Services with Android.
  
<!-- Anchors. -->

[Create a new mobile service]: #create-service
[Download the service locally]: #download-the-service-locally
[Test the mobile service]: #test-the-service
[Download the GetStartedWithData project]: #download-app
[Update the app to use the mobile service for data access]: #update-app
[Test the Android App against the service hosted locally]: #test-locally-hosted
[Publish the mobile service to Azure]: #publish-mobile-service
[Test the Android App against the service hosted in Azure]: #test-azure-hosted
[Test the app against the published mobile service]: #test-app
[Next Steps]:#next-steps

<!-- Images. -->

<!-- URLs. -->
[Get started with Mobile Services]: mobile-services-dotnet-backend-windows-store-dotnet-get-started.md
[Get started with authentication]: mobile-services-dotnet-backend-android-get-started-users.md
[Get started with push notifications]: mobile-services-dotnet-backend-android-get-started-push-EC.md

[Azure Management Portal]: https://manage.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Mobile Services SDK]: http://go.microsoft.com/fwlink/p/?LinkId=257545
[Developer Code Samples site]:  http://go.microsoft.com/fwlink/p/?LinkId=328660
[MobileServiceClient class]: http://go.microsoft.com/fwlink/p/?LinkId=302030  