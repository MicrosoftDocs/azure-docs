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
	ms.date="10/28/2015"
	ms.author="krisragh"/>

#Create an iOS app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-preview](../../includes/app-service-mobile-selector-get-started-preview.md)]
&nbsp;  
[AZURE.INCLUDE [app-service-mobile-note-mobile-services-preview](../../includes/app-service-mobile-note-mobile-services-preview.md)]

## Overview

This tutorial shows you how to add a cloud-based backend service to an iOS mobile app by using an Azure mobile app backend.  You will create both a new mobile app backend and a simple _Todo list_ iOS app that stores app data in Azure.

Completing this tutorial is a prerequisite for all other iOS tutorials about using the Mobile Apps feature in Azure App Service.

## Prerequisites

To complete this tutorial, you need the following:

* An [active Azure account](http://azure.microsoft.com/pricing/free-trial/)

* A PC with [Visual Studio Community 2013] or newer

* A Mac with Xcode v7.0 or newer

* [Azure Mobile iOS framework](https://go.microsoft.com/fwLink/?LinkID=529823), which is automatically included as part of the quickstart project you download

## Create a new Azure mobile app backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service-preview](../../includes/app-service-mobile-dotnet-backend-create-new-service-preview.md)]

## Download the server project

1. On your PC, visit the [Azure portal]. Click **Browse All** > **Mobile Apps**, and then click the mobile app backend that you just created.

2. In the Mobile App blade, click **Settings**, and then under **Mobile App**, click **Quickstart** > **iOS (Objective-C)**. If you prefer Swift, click **Quickstart** > **iOS (Swift)** instead.

3. Under **Download and run your server project**, click **Download**. Extract the compressed project files to your PC, and open the solution in Visual Studio.

## Publish the server project to Azure

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-publish-service-preview](../../includes/app-service-mobile-dotnet-backend-publish-service-preview.md)]

## Download and run the iOS app

[AZURE.INCLUDE [app-service-mobile-ios-run-app-preview](../../includes/app-service-mobile-ios-run-app-preview.md)]


<!-- Images. -->

<!-- URLs -->
[Azure portal]: https://portal.azure.com/
[Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[Visual Studio Community 2013]: https://go.microsoft.com/fwLink/p/?LinkID=534203
