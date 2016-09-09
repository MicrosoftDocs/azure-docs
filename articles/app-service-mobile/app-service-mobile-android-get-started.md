<properties
    pageTitle="Create an Android app on Azure App Service Mobile Apps | Microsoft Azure"
    description="Follow this tutorial to get started with using Azure mobile app backends for Android development"
    services="app-service\mobile"
    documentationCenter="android"
    authors="RickSaling"
    manager="erikre"
    editor=""/>

<tags
    ms.service="app-service-mobile"
    ms.workload="na"
    ms.tgt_pltfrm="mobile-android"
    ms.devlang="java"
    ms.topic="hero-article"
    ms.date="07/21/2016"
    ms.author="ricksal"/>

#Create an Android app

[AZURE.INCLUDE [app-service-mobile-selector-get-started](../../includes/app-service-mobile-selector-get-started.md)]

## Overview

This tutorial shows you how to add a cloud-based backend service to an Android mobile app by using an Azure mobile app backend.  You will create both a new mobile app backend and a simple _Todo list_ Android app that stores app data in Azure.

Completing this tutorial is a prerequisite for all other Android tutorials about using the Mobile Apps feature in Azure App Service.

## Prerequisites

To complete this tutorial, you need the following:

* [Android Developer Tools](https://developer.android.com/sdk/index.html), which includes the Android Studio integrated development environment, and the latest Android platform.
* Azure Mobile Android SDK, which is automatically referenced as part of the quickstart project you download.
* A PC with [Visual Studio Community 2013] or newer&mdash;not required for a Node.js backend.
* An [active Azure account](https://azure.microsoft.com/pricing/free-trial/).

## Create a new Azure mobile app backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

## Configure the server project

[AZURE.INCLUDE [app-service-mobile-configure-new-backend.md](../../includes/app-service-mobile-configure-new-backend.md)]

## Download and run the Android app

[AZURE.INCLUDE [app-service-mobile-android-run-app](../../includes/app-service-mobile-android-run-app.md)]


<!-- Images. -->

<!-- URLs -->
[Azure portal]: https://portal.azure.com/
[Visual Studio Community 2013]: https://go.microsoft.com/fwLink/p/?LinkID=534203
