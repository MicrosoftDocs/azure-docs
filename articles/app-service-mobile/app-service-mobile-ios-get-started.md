<properties
	pageTitle="Create an iOS app on Azure App Service Mobile Apps | Microsoft Azure"
	description="Follow this tutorial to get started with using Azure mobile app backends for iOS development in Objective-C or Swift"
	services="app-service\mobile"
	documentationCenter="ios"
	authors="krisragh"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="na"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="hero-article"
	ms.date="03/09/2016"
	ms.author="krisragh"/>

#Create an iOS app

[AZURE.INCLUDE [app-service-mobile-selector-get-started](../../includes/app-service-mobile-selector-get-started.md)]

## Overview

This tutorial shows you how to use a cloud-based backend service ([Azure Mobile Apps](app-service-mobile-value-prop.md)) to an iOS mobile app.  You will create  a new mobile backend and use a simple _Todo list_ iOS app that stores app data in Azure.

## Prerequisites

To complete this tutorial, you need the following:

* An [active Azure account](https://azure.microsoft.com/pricing/free-trial/)

* A PC with [Visual Studio Community 2013] or newer

* A Mac with Xcode v7.0 or newer

* [Azure Mobile iOS framework](https://go.microsoft.com/fwLink/?LinkID=529823), which is automatically included as part of the quickstart project you download

## Create a new Azure mobile app backend

Follow these steps to create a new Mobile App backend.

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

You have now provisioned an Azure Mobile App backend that can be used by your mobile client applications. Next, you will download a server project for a simple "todo list" backend and publish it to Azure.

## Download the server project

1. On your PC, visit the [Azure portal]. Click **Browse All** > **Mobile Apps**, and then click the mobile app backend that you just created.

2. In the Mobile App blade, click **Settings**, and then under **Mobile App**, click **Quickstart** > **iOS (Objective-C)**. If you prefer Swift, click **Quickstart** > **iOS (Swift)** instead.

## Configure the server project

[AZURE.INCLUDE [app-service-mobile-configure-new-backend.md](../../includes/app-service-mobile-configure-new-backend.md)]


## Download and run the iOS app

[AZURE.INCLUDE [app-service-mobile-ios-run-app](../../includes/app-service-mobile-ios-run-app.md)]


<!-- Images. -->

<!-- URLs -->
[Azure portal]: https://portal.azure.com/
[Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[Visual Studio Community 2013]: https://go.microsoft.com/fwLink/p/?LinkID=534203
