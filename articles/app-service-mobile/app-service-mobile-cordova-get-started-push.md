<properties
	pageTitle="Add Push Notifications to Apache Cordova App with Azure Mobile Apps | Azure App Service"
	description="Learn how to use Azure Mobile Apps to send push notifications to your Apache Cordova app."
	services="app-service\mobile"
	documentationCenter="javascript"
	manager="ggailey777"
	editor=""
	authors="adrianhall"/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-html"
	ms.devlang="javascript"
	ms.topic="article"
	ms.date="05/02/2016"
	ms.author="glenga"/>

# Add push notifications to your Apache Cordova app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-push](../../includes/app-service-mobile-selector-get-started-push.md)]

## Overview

In this tutorial, you add push notifications to the [Apache Cordova quick start] project so that every time a record is inserted, a push notification is sent. This tutorial is based on the [Apache Cordova quick start] tutorial, which you must complete first. If you have an ASP.NET backend and do not use the downloaded quick start server project, you must add the push notification extension package to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps].

##<a name="prerequisites"></a>Prerequisites

This tutorial covers an Apache Cordova application being developed within Visual Studio 2015 and being run on the Google Android Emulator. You may additionally complete this tutorial on other emulators or devices and on different development platforms.

To complete this tutorial, you need the following:

* A [Google account] with a verified email address.
* A PC with [Visual Studio Community 2015] or newer.
* [Visual Studio Tools for Apache Cordova].
* An [active Azure account](https://azure.microsoft.com/pricing/free-trial/).
* A completed [Apache Cordova quick start] project.  Completing other tutorials (like [authentication]) can happen first, but is not required.
* An Android device.

Although push notifications are supported on Android Emulators, we have found them to be unstable and do not recommend that you test push notifications on emulators.

##<a name="create-hub"></a>Create a notification hub

[AZURE.INCLUDE [app-service-mobile-create-notification-hub](../../includes/app-service-mobile-create-notification-hub.md)]

##<a name="enable-gcm"></a>Enable Google Cloud Messaging

Since we are targetting the Google Android platform, you must enable Google Cloud Messaging.  If you were targetting Apple iOS devices, you would enable APNS support.  Similarly, if you were targetting Microsoft Windows devices, you would enable WNS or MPNS support.

[AZURE.INCLUDE [mobile-services-enable-google-cloud-messaging](../../includes/mobile-services-enable-google-cloud-messaging.md)]

##<a name="configure-backend"></a>Configure the Mobile App backend to send push requests

[AZURE.INCLUDE [app-service-mobile-android-configure-push](../../includes/app-service-mobile-android-configure-push.md)]

##<a name="update-service"></a>Update the server project to send push notifications

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-configure-push-google](../../includes/app-service-mobile-dotnet-backend-configure-push-google.md)]

##<a name="configure-device"></a>Configure your Android device for USB debugging

Before you can deploy your application to your Android Device, you need to enable USB Debugging.  Perform the following steps on your Android phone:

1. Go to **Settings** > **About phone**, then tap the **Build number** until developer mode is enabled (about 7 times).
 
2. Back in **Settings** > **Developer Options** enable **USB debugging**, then connect your Android phone to your development PC with a USB Cable.

We tested this using a Google Nexus 5X device running Android 6.0 (Marshmallow).  However, the techniques are common across any modern Android release.

##<a name="add-push-to-app"></a>Add push notifications to your app

You must make sure that your Apache Cordova app project is ready to handle push notifications. You must install the Cordova push plugin, plus any platform-specific push services.

### Install the push plugin

Apache Cordova applications do not natively handle device or network capabilities.  These capabilities are provided
by plugins that are published either on [npm](https://www.npmjs.com/) or on GitHub.  The `phonegap-plugin-push` plugin is used to handle network push notifications.

You can install the push plugin in one of these ways:

**From the command-prompt:**

Execute the following command:

    cordova plugin add phonegap-plugin-push

**From within Visual Studio:**

1.  In Solution Explorer, open the `config.xml` file click **Plugins** > **Custom**, select **Git** as the installation source, then enter `https://github.com/phonegap/phonegap-plugin-push` as the source.

	![](./media/app-service-mobile-cordova-get-started-push/add-push-plugin.png)

2.  Click on the arrow next to the installation source and click on **Add**

The push plugin is now installed.

### Install Google Play Services

The push plugin relies on Android Google Play Services for push notifications.  

1.  In **Visual Studio**,  click **Tools** > **Android** > **Android SDK Manager**, expand the **Extras** folder and check the box to make sure that each of the following SDKs is installed.    
    * Android Support Library version 23 or greater
    * Android Support Repository version 20 or greater
    * Google Play Services version 27 or greater
    * Google Repository version 22 or greater
     
2.  Click on **Install Packages** and wait for the installation to complete.

The current required libraries are listed in the [phonegap-plugin-push installation documentation].

### Register your device for push on start-up

1. Add a call to **registerForPushNotifications** during the callback for the login process, or at the bottom of the **onDeviceReady** method:


		// Login to the service.
		client.login('google')
		    .then(function () {
		        // Create a table reference
		        todoItemTable = client.getTable('todoitem');

		        // Refresh the todoItems
		        refreshDisplay();

		        // Wire up the UI Event Handler for the Add Item
		        $('#add-item').submit(addItemHandler);
		        $('#refresh').on('click', refreshDisplay);

				// Added to register for push notifications.
		        registerForPushNotifications();

		    }, handleError);

	In this example shows calling **registerForPushNotifications** after authentication succeeds, which is recommended when using both push notifications and authentication in your app.

2. Add the new `registerForPushNotifications()` method as follows:

	    // Register for Push Notifications.
		// Requires that phonegap-plugin-push be installed.
	    var pushRegistration = null;
	    function registerForPushNotifications() {
	        pushRegistration = PushNotification.init({
	            android: {
	                senderID: 'Your_Project_ID'
	            },
	            ios: {
	                alert: 'true',
	                badge: 'true',
	                sound: 'true'
	            },
	            wns: {

	            }
	        });

	        pushRegistration.on('registration', function (data) {
	            client.push.register('gcm', data.registrationId);
	        });

	        pushRegistration.on('notification', function (data, d2) {
	            alert('Push Received: ' + data.message);
	        });

	        pushRegistration.on('error', handleError);
	    }

3. In the above code, replace `Your_Project_ID` with the numeric project ID for your app from the [Google Developer Console].

## Test push notifications in the app 

You can now test push notifications by running the app and inserting items in the TodoItem table. You can do this from the same device or from a second device, as long as you are using the same backend. Test your Cordova app on the Android platform in one of the following ways:

- **On a physical device:**  
Attach your Android device to your development computer with a USB cable.  Instead of **Google Android Emulator**, select **Device**. Visual Studio will deploy the application to the device and run it.  You can then interact with the application on the device.  
Improve your development experience.  Screen sharing applications such as [Mobizen] can assist you in developing an Android application by projecting your Android screen on to a web browser on your PC.

- **On an an Android emulator:**  
Before you can receive push notifications, you must add a Google account on the emulator.

##<a name="next-steps"></a>Next Steps

* Read about [Notification Hubs] to learn about push notifications.
* If you have not already done so, continue the tutorial by [Adding Authentication] to your Apache Cordova app.

Learn how to use the SDKs.

* [Apache Cordova SDK]
* [ASP.NET Server SDK]
* [Node.js Server SDK]

<!-- URLs -->
[Adding Authentication]: app-service-mobile-cordova-get-started-users.md
[Apache Cordova quick start]: app-service-mobile-cordova-get-started.md
[authentication]: app-service-mobile-cordova-get-started-users.md
[Work with the .NET backend server SDK for Azure Mobile Apps]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
[Google account]: http://go.microsoft.com/fwlink/p/?LinkId=268302
[Google Developer Console]: https://console.developers.google.com/home/dashboard
[phonegap-plugin-push installation documentation]: https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/INSTALLATION.md
[Mobizen]: https://www.mobizen.com/
[Visual Studio Community 2015]: http://www.visualstudio.com/
[Visual Studio Tools for Apache Cordova]: https://www.visualstudio.com/en-us/features/cordova-vs.aspx
[Notification Hubs]: ../notification-hubs/notification-hubs-overview.md
[Apache Cordova SDK]: app-service-mobile-cordova-how-to-use-client-library.md
[ASP.NET Server SDK]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
[Node.js Server SDK]: app-service-mobile-node-backend-how-to-use-server-sdk.md
