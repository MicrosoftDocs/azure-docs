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
* A completed [Apache Cordova quick start] project.  Completing other tutorials (like authentication) can happen first, but is not required.

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

##<a name="add-push-to-app"></a>Add push notifications to your app

You must make sure that your Apache Cordova app project is ready to handle push notifications.

### Install the Apache Cordova Push Plugin

### Register your Device for Push on startup

### Handle Push Notifications

## Test the app against the published mobile service

You can test the app by directly attaching an Android phone with a USB cable, or by using a virtual device in the emulator.

<!-- URLs -->
[Apache Cordova quick start]: app-service-mobile-cordova-get-started.md
[Work with the .NET backend server SDK for Azure Mobile Apps]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
[Google account]: http://go.microsoft.com/fwlink/p/?LinkId=268302