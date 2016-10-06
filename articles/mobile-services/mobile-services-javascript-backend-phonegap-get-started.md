<properties
	pageTitle="Get started with Azure Mobile Services for PhoneGap/cordova apps | Microsoft Azure"
	description="Follow this tutorial to get started using Azure Mobile Services for PhoneGap development for iOS, Android, and Windows Phone."
	services="mobile-services"
	documentationCenter=""
	authors="ggailey777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-phonegap"
	ms.devlang="multiple"
	ms.topic="get-started-article" 
	ms.date="07/21/2016"
	ms.author="ggailey777"/>

# Get started with Mobile Services

[AZURE.INCLUDE [mobile-services-selector-get-started](../../includes/mobile-services-selector-get-started.md)]
&nbsp;

[AZURE.INCLUDE [mobile-services-hero-slug](../../includes/mobile-services-hero-slug.md)]

This tutorial shows you how to add a cloud-based backend service to an app using Azure Mobile Services. In this tutorial, you will create both a new mobile service and a simple _To do list_ app that stores app data in the new mobile service.

A screenshot from the completed app is below:

![][3]

### Additional Requirements

Completing this tutorial requires the following:

+ PhoneGap tools (v3.2+ required for Windows Phone 8 projects).

+ An active Microsoft Azure account.

+ PhoneGap supports developing for multiple platforms. In addition to the PhoneGap tools themselves, you must install the tools for each platform you are targeting:

	- Windows Phone: Install [Visual Studio 2012 Express for Windows Phone](https://go.microsoft.com/fwLink/p/?LinkID=268374)
	- iOS: Install [Xcode] (v4.4+ required)
	- Android: Install the [Android Developer Tools][Android SDK]
		<br/>(The Mobile Services SDK for Android supports apps for Android 2.2 or a later version. Android 4.2 or higher is required to run the quick start app.)

## Create a new mobile service

[AZURE.INCLUDE [mobile-services-create-new-service](../../includes/mobile-services-create-new-service.md)]

## Create a new PhoneGap app

In this section you will create a new PhoneGap app that is connected to your mobile service.

1.  In the [Azure classic portal], click **Mobile Services**, and then click the mobile service that you just created.

2. In the quickstart tab, click **PhoneGap** under **Choose platform** and expand **Create a new PhoneGap app**.

   	![][0]

   	This displays the three easy steps to create a PhoneGap app connected to your mobile service.

  	![][1]

3. If you haven't already done so, download and install PhoneGap and at least one of the platform development tools (Windows Phone, iOS, or Android).

4. Click **Create TodoItem table** to create a table to store app data.

5. Under **Download and run your app**, click **Download**.

	This downloads the project for the sample _To do list_ application that is connected to your mobile service, along with the Mobile Services JavaScript SDK. Save the compressed project file to your local computer, and make a note of where you saved it.

## Run your new PhoneGap app

The final stage of this tutorial is to build and run your new app.

1.	Browse to the location where you saved the compressed project files and expand the files on your computer.

2.	Open and run the project according to the instructions below for each platform.

	+ **Windows Phone 8**

		1. Windows Phone 8: Open the .sln file in the **platforms\wp8** folder in Visual Studio 2012 Express for Windows Phone.

		2. Press the **F5** key to rebuild the project and start the app.

	  	![][2]

	+ **iOS**

		1. Open the project in the **platforms/ios** folder in Xcode.

		2. Press the **Run** button to build the project and start the app in the iPhone emulator, which is the default for this project.

	  	![][3]

	+ **Android**

		1. In Eclipse, click **File** then **Import**, expand **Android**, click **Existing Android Code into Workspace**, and then click **Next.**

		2. Click **Browse**, browse to the location of the expanded project files, click **OK**, make sure that the TodoActivity project is checked, then click **Finish**. <p>This imports the project files into the current workspace.</p>

		3. From the **Run** menu, click **Run** to start the project in the Android emulator.

			![][4]

		>[AZURE.NOTE]To be able to run the project in the Android emulator, you must define a least one Android Virtual Device (AVD). Use the AVD Manager to create and manage these devices.


3. After launching the app in one of the mobile emulators above, type some text into the textbox and then click **Add**.

	This sends a POST request to the new mobile service hosted in Azure. Data from the request is inserted into the **TodoItem** table. Items stored in the table are returned by the mobile service, and the data is displayed in the list.

	> [AZURE.IMPORTANT] Changes to this platform project will be overwritten if the main project is rebuilt with the PhoneGap tools. Instead, make changes in the project's root www directory as outlined in the section below.

4. Back in the [Azure classic portal], click the **Data** tab and then click the **TodoItem** table.

	![](./media/mobile-services-javascript-backend-phonegap-get-started/mobile-data-tab.png)

	This lets you browse the data inserted by the app into the table.

	![](./media/mobile-services-javascript-backend-phonegap-get-started/mobile-data-browse.png)


## Make app updates and rebuild projects for each platform

1. Make changes to code files in the ´www´ directory, which in this case is ´todolist/www´.

2. Verify that all of the target platform tools are accessible in the system path.

2. Open a command prompt in the root project directory, and run one of the following platform-specific commands:

	+ **Windows Phone**

		Run the following command from the Visual Studio Developer command prompt:

    		phonegap local build wp8

	+ **iOS**

		Open terminal and run the following command:

    		phonegap local build ios

	+ **Android**

		Open a command prompt or terminal window and run the following command.

		    phonegap local build android

4. Open each project in the appropriate development environment as outlined in the previous section.

>[AZURE.NOTE]You can review the code that accesses your mobile service to query and insert data, which is found in the js/index.js file.

## Next Steps
Now that you have completed the quickstart, learn how to perform additional important tasks in Mobile Services:

* **[Add authentication to your app]**  
  Learn how to authenticate users of your app with an identity provider.  

* **[Add push notifications to your app](https://msdn.microsoft.com/magazine/dn879353.aspx)**  
  Learn how to register for and send push notifications to your app.

* **[Mobile Services HTML/JavaScript How-to Conceptual Reference](mobile-services-html-how-to-use-client-library.md)**  
  Learn more about how to use the JavaScript client library to access data, call custom APIs, and perform authentication.

[AZURE.INCLUDE [app-service-disqus-feedback-slug](../../includes/app-service-disqus-feedback-slug.md)]

<!-- Images. -->
[0]: ./media/mobile-services-javascript-backend-phonegap-get-started/portal-screenshot1.png
[1]: ./media/mobile-services-javascript-backend-phonegap-get-started/portal-screenshot2.png
[2]: ./media/mobile-services-javascript-backend-phonegap-get-started/mobile-portal-quickstart-wp8.png
[3]: ./media/mobile-services-javascript-backend-phonegap-get-started/mobile-portal-quickstart-ios.png
[4]: ./media/mobile-services-javascript-backend-phonegap-get-started/mobile-portal-quickstart-android.png

<!-- URLs. -->
[Add authentication to your app]: mobile-services-html-get-started-users.md
[Android SDK]: https://go.microsoft.com/fwLink/p/?LinkID=280125
[Azure classic portal]: https://manage.windowsazure.com/
[Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[Visual Studio 2012 Express for Windows Phone]: https://go.microsoft.com/fwLink/p/?LinkID=268374
 