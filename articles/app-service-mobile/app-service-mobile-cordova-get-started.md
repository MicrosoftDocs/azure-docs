<properties
    pageTitle="Create a Cordova app on Azure App Service Mobile Apps | Microsoft Azure"
    description="Follow this tutorial to get started with using Azure mobile app backends for Apache Cordova development"
    services="app-service\mobile"
    documentationCenter="javascript"
    authors="adrianhall"
    manager="erikre"
    editor=""
    tags=""
    keywords="cordova,javascript,mobile,client" />

<tags
    ms.service="app-service-mobile"
    ms.workload="na"
    ms.tgt_pltfrm="mobile-html"
    ms.devlang="javascript"
    ms.topic="hero-article"
    ms.date="08/11/2016"
    ms.author="glenga"/>

#Create an Apache Cordova app

[AZURE.INCLUDE [app-service-mobile-selector-get-started](../../includes/app-service-mobile-selector-get-started.md)]

## Overview

This tutorial shows you how to add a cloud-based backend service to an Apache Cordova mobile app by using an Azure mobile app backend.  You will create both a new mobile app backend and a simple _Todo list_ Apache Cordova app that stores app data in Azure.

Completing this tutorial is a prerequisite for all other Apache Cordova tutorials about using the Mobile Apps feature in Azure App Service.

## Prerequisites

To complete this tutorial, you need the following:

* A PC with [Visual Studio Community 2015] or newer.
* [Visual Studio Tools for Apache Cordova].
* An [active Azure account](https://azure.microsoft.com/pricing/free-trial/).

You may also bypass Visual Studio and use the Apache Cordova command line directly.  This is useful when completing the tutorial on a
Mac computer.  Compiling Apache Cordova client applications using the command line is not covered by this tutorial.

## Create a new Azure mobile app backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

[Watch a video showing similar steps](https://channel9.msdn.com/series/Azure-connected-services-with-Cordova/Azure-connected-services-task-1-Create-an-Azure-Mobile-App)

## Configure the server project

[AZURE.INCLUDE [app-service-mobile-configure-new-backend.md](../../includes/app-service-mobile-configure-new-backend.md)]

## Download and run the Apache Cordova app

[AZURE.INCLUDE [app-service-mobile-cordova-run-app](../../includes/app-service-mobile-cordova-run-app.md)]

## Next Steps

Now that you completed this quick start tutorial, move on to one of the following tutorials:

* [Add Authentication] to your Apache Cordova app.
* [Add Push Notifications] to your Apache Cordova app.

Learn more about key concepts with Azure App Service.

* [Authentication]
* [Push Notifications]

Learn how to use the SDKs.

* [Apache Cordova SDK]
* [ASP.NET Server SDK]
* [Node.js Server SDK]

<!-- Images. -->

<!-- URLs -->
[Azure portal]: https://portal.azure.com/
[Visual Studio Community 2015]: http://www.visualstudio.com/
[Visual Studio Tools for Apache Cordova]: https://www.visualstudio.com/en-us/features/cordova-vs.aspx
[Add Authentication]: app-service-mobile-cordova-get-started-users.md
[Add Push Notifications]: app-service-mobile-cordova-get-started-push.md
[Authentication]: app-service-mobile-auth.md
[Push Notifications]: ../notification-hubs/notification-hubs-overview.md
[Apache Cordova SDK]: app-service-mobile-cordova-how-to-use-client-library.md
[ASP.NET Server SDK]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
[Node.js Server SDK]: app-service-mobile-node-backend-how-to-use-server-sdk.md
