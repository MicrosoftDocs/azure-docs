<properties 
	pageTitle="Get Started with Azure Mobile Services for Appcelerator Titanium" 
	description="Follow this tutorial to get started using Azure Mobile Services for Appcelerator development." 
	services="mobile-services" 
	documentationCenter="" 
	authors="mattchenderson" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-appcelerator" 
	ms.devlang="multiple" 
	ms.topic="hero-article" 
	ms.date="04/24/2015" 
	ms.author="mahender"/>

# <a name="getting-started"> </a>Get started with Mobile Services

[AZURE.INCLUDE [mobile-services-selector-get-started](../includes/mobile-services-selector-get-started.md)]

This tutorial will show you how to leverage Azure Mobile Services in your Appcelerator-built applications.

In this tutorial, you will create both a new mobile service and a simple _To do list_ app that stores app data in the new mobile service. The mobile service that you create uses JavaScript for server-side business logic.

Completing this tutorial requires [Appcelerator Titanium].

If building for iOS, you will also need Xcode 5.1 and iOS 7.1 SDK or later versions. 

If building for Android, you will also need Android 4.3 or greater SDK.

## <a name="create-new-service"> </a>Create a new mobile service

[AZURE.INCLUDE [mobile-services-create-new-service](../includes/mobile-services-create-new-service.md)]

## Create a new Appcelerator app

1. In the Mobile Services portal, select the **Data** tab for your mobile service.

2. Click **Add a Table** and create a new table named **TodoItem**.

3. Download a new Appcelerator [Todolist application] and unzip the project.

4. If you haven&#39;t already done so, download and install [Appcelerator Titanium Studio][Appcelerator Titanium] and SDK v3.2.1 or greater. You also need Xcode (v 5.0 +) &/or Android SDK (v 4.3+) to run the project.

5. Back in the Mobile Services portal, under **Dashboard**, select **Manage Keys** and copy out the **Application Key**.

5. In the app's index.js, replace `<---App Name---->` and `<------------APP KEY------------>` with the values from your mobile service.

## Run your new Appcelerator app ##

The final stage of this tutorial is to build and run your new app.

1. Open Titanium studio and go to **File -> Import** to import the project, which you downloaded previously.

    ![][0]

2.	In next screen select **Existing Projects into Workspace** and click **Next**.

    ![][1]

3.	In project selection screen use Browse option and locate the Azure Titanium Project, which you have downloaded from Azure Management Portal.

    ![][2]

4.	Finally it displays the project, which you have selected in projects section. Optionally, you can check &quot;Copy projects into workspace&quot; option, which will copy downloaded project into your workspace. Lastly click on Finish to open the project in your Titanium Studio.

    ![][3]

5.	Select on which platform (iOS/Android) you are interested to run the project.

    ![][4]

6.	Press the Run button to build the project and start the app in the iPhone simulator or in the Android emulator.

7.	Select your choice based on Azure Management Portal settings.

    ![][5]

8.	In next screen, click the plus (+) icon and type meaning full text such as &quot;Complete this tutorial&quot; and click Save button.<br />

    ![][6]

    ![][7]

This sends a POST request to the new mobile service hosted in Microsoft Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile service, and the data is displayed in the list.

![][8]


>[AZURE.NOTE] You can review the code that accesses your mobile service to query and insert data, which is found in the TodoService.m file.

4. Back in the Management Portal, click the **Data** tab and then click the **TodoItems** table.

   	![][9]

   	This lets you browse the data inserted by the app into the table.

   	![][10]


## <a name="next-steps"> </a>Next Steps
Now that you have completed the quickstart, learn how to perform additional important tasks in Mobile Services: 

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with an identity provider.

* [Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app.



<!-- Images. -->
[0]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started/image007.png
[1]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started/image008.png
[2]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started/image009.png
[3]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started/image010.png
[4]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started/image011.png
[5]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started/image012.png
[6]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started/image013.png
[7]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started/image014.png
[8]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started/image015.png
[9]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started/mobile-data-tab.png
[10]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started/mobile-data-browse.png

<!-- URLs. -->
[Todolist application]: http://go.microsoft.com/fwlink/p/?LinkId=506859
[Appcelerator Titanium]: http://go.microsoft.com/fwlink/p/?LinkID=509987
[Get started with authentication]: partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started-users.md
[Get started with push notifications]: partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started-push.md
