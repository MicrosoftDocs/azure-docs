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
	ms.date="02/11/2016"
	ms.author="adrianha"/>

# Add Push Notifications to your Apache Cordova App

[AZURE.INCLUDE [app-service-mobile-selector-get-started-push](../../includes/app-service-mobile-selector-get-started-push.md)]

## Overview

In this tutorial, you add push notifications to the [Apache Cordova quick start] project so that every time a record is inserted, a
push notification is sent. This tutorial is based on the [Apache Cordova quick start] tutorial, which you must complete first. If
you have an ASP.NET backend and do not use the downloaded quick start server project, you must add the push notification extension
package to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps].

##<a name="prerequisites"></a>Prerequisites

This tutorial covers an Apache Cordova application being developed within Visual Studio 2015 and being run on the Google Android Emulator.
You may additionally complete this tutorial on other emulators or devices and on different development platforms.

To complete this tutorial, you need the following:

* A [Google account] with a verified email address.
* A PC with [Visual Studio Community 2015] or newer.
* [Visual Studio Tools for Apache Cordova].
* An [active Azure account](https://azure.microsoft.com/pricing/free-trial/).
* A completed [Apache Cordova quick start] project.  Completing other tutorials (like [authentication]) can happen first, but is not required.
* An Android device.

Although push notifications are supported on Android Emulators, we have found them to be unstable and do not recommend
that you test push notifications on emulators.

##<a name="create-hub"></a>Create a Notification Hub

[AZURE.INCLUDE [app-service-mobile-create-notification-hub](../../includes/app-service-mobile-create-notification-hub.md)]

##<a name="enable-gcm"></a>Enable Google Cloud Messaging

Since we are targetting the Google Android platform, you must enable Google Cloud Messaging.  If you were targetting Apple iOS
devices, you would enable APNS support.  Similarly, if you were targetting Microsoft Windows devices, you would enable WNS or
MPNS support.

[AZURE.INCLUDE [mobile-services-enable-google-cloud-messaging](../../includes/mobile-services-enable-google-cloud-messaging.md)]

##<a name="configure-backend"></a>Configure the Mobile App backend to send push requests

[AZURE.INCLUDE [app-service-mobile-android-configure-push](../../includes/app-service-mobile-android-configure-push.md)]

##<a name="update-service"></a>Update the server project to send push notifications

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-configure-push-google](../../includes/app-service-mobile-dotnet-backend-configure-push-google.md)]

##<a name="configure-device"></a>Configure your Android Device for USB Debugging

Before you can deploy your application to your Android Device, you need to enable USB Debugging.  Perform the following
steps on your Android phone:

1. Go to **Settings** > **About phone**
2. Tap on the **Build number** until developer mode is enabled
3. Return to **Settings**
4. Select **Developer Options**
5. Turn on **USB debugging**
6. Connect your Android phone to your development PC with a USB Cable.

In testing this tutorial, we used a Google Nexus 5X running Android 6.0 (Marshmallow) release.  However, the techniques
are common across any modern Android release.

##<a name="add-push-to-app"></a>Add push notifications to your app

You must make sure that your Apache Cordova app project is ready to handle push notifications.

### Install the Apache Cordova Push Plugin

Apache Cordova applications do not natively handle device or network capabilities.  These capabilities are provided
by plugins that are published either on [npm](https://www.npmjs.com/) or on GitHub.  The `phonegap-plugin-push` plugin is used to handle network push notifications.

You can install the push plugin in one of these ways:

**From the command-prompt:**

    cordova plugin add phonegap-plugin-push

**From within Visual Studio:**

1.  Open the `config.xml` file from Solution Explorer.
2.  Click on **Plugins** > **Custom**, select **Git** as the installation source, then enter `https://github.com/phonegap/phonegap-plugin-push` as the source.

	![](./media/app-service-mobile-cordova-get-started-push/add-push-plugin.png)

4.  Click on the arrow next to the installation source, then click on **Add**

The push plugin is now installed.

### Install Android Google Play Services

The PhoneGap Push Plugin relies on Google Play Services for push notifications.  To install:

1.  Open **Visual Studio**
2.  Click on **Tools** > **Android** > **Android SDK Manager**
3.  Check the box next to each required SDK in the Extras folder that is not installed.  The following packages are required:
    * Android Support Library version 23 or greater
    * Android Support Repository version 20 or greater
    * Google Play Services version 27 or greater
    * Google Repository version 22 or greater
4.  Click on **Install Packages**.
5.  Wait for the installation to complete.

The current required libraries are listed in the [phonegap-plugin-push installation documentation].

### Register your Device for Push on startup

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

## Test the app against the published mobile service

You can test the app by directly attaching an Android phone with a USB cable.  Instead of **Google Android Emulator**, select **Device**. Visual Studio will download the application to the device and run the application.  You will then interact with the application on the device.

Improve your development experience.  Screen sharing applications such as [Mobizen] can assist you in developing an Android application by projecting your Android screen on to a web browser on your PC.

You can also test the Android app on the Android emulator. Remember to first add a Google account on the emulator.

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
[Apache Cordova SDK]: app-service-mobile-codova-how-to-use-client-library.md
[ASP.NET Server SDK]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
[Node.js Server SDK]: app-service-mobile-node-backend-how-to-use-server-sdk.md
