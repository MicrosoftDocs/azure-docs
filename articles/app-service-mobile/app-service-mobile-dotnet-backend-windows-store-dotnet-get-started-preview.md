<properties
	pageTitle="Get Started with mobile app backends for Windows Store apps | Azure App Service Mobile Apps"
	description="Follow this tutorial to get started using Azure mobile app backends for Windows Store development in C#, VB, or JavaScript."
	services="app-service\mobile"
	documentationCenter="windows"
	authors="christopheranderson"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-windows"
	ms.devlang="dotnet"
	ms.topic="get-started-article"
	ms.date="07/24/2015"
	ms.author="chrande"/>


#Create a Windows app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-preview](../../includes/app-service-mobile-selector-get-started-preview.md)]

[AZURE.INCLUDE [app-service-mobile-note-mobile-services-preview](../../includes/app-service-mobile-note-mobile-services-preview.md)]

##Overview

This tutorial shows you how to add a cloud-based backend service to a Windows Runtime 8.1 universal app using an Azure mobile app backend. Universal Windows app solutions include projects for both Windows Store 8.1 and Windows Phone Store 8.1 apps and a common shared project.

[AZURE.INCLUDE [app-service-mobile-windows-universal-get-started-preview](../../includes/app-service-mobile-windows-universal-get-started-preview.md)]

##Prerequisites

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free mobile apps that you can keep using even after your trial ends. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).

* [Visual Studio Community 2013] or a later version.

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751&appServiceName=mobile), where you can immediately create a short-lived starter mobile app in App Service. No credit cards required; no commitments.

##Create a new mobile app backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service-preview](../../includes/app-service-mobile-dotnet-backend-create-new-service-preview.md)]

##Download the quickstart projects

Once you have created your mobile app backend, you can follow an easy quickstart in the Azure Portal to either create a new app or modify an existing app to connect to your mobile app backend.

In this section you download the mobile app backend project and a new universal Windows app that is customized to connect to the mobile app backend. 

1. If you haven't already done so, download and install Visual Studio Community 2013 or a later version on your local computer or virtual machine.

2. In the Azure Portal, click **Browse all** > **Mobile Apps**, and then click the mobile app that you just created.

3. At the top of the blade, click **Add Client** > **Windows (C#)**.

    This displays the steps to download a universal Windows app connected to your mobile app backend.

4. Under **Download and run your server project**, click **Download**, extract the compressed project files to your local computer, and make a note of where you save it.    

5. Repeat the previous step for the Windows project, extract the compressed universal Windows app to your local computer, open the solution in Visual Studio, then add the service project that you downloaded in the previous step to the solution. 

Now, you can debug and test both the app and the backend in the same Visual Studio solution.

##Test the mobile app

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-test-local-service-preview](../../includes/app-service-mobile-dotnet-backend-test-local-service-preview.md)]

##Publish your mobile app backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-publish-service-preview](../../includes/app-service-mobile-dotnet-backend-publish-service-preview.md)]

##Run the Windows app

Now that the mobile app backend is published and the client is connected to the remote mobile app backend hosted in Azure, we can run the app using Azure for item storage.

[AZURE.INCLUDE [app-service-mobile-windows-universal-test-app-preview](../../includes/app-service-mobile-windows-universal-test-app-preview.md)]

<!-- Anchors. -->
<!-- Images. -->
<!-- URLs. -->
[Get started with authentication]: app-service-mobile-dotnet-backend-windows-store-dotnet-get-started-users-preview.md
[Mobile App SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[Azure Portal]: https://portal.azure.com/

[Visual Studio Community 2013]: https://go.microsoft.com/fwLink/p/?LinkID=534203
 
