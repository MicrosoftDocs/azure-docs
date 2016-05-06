<properties
	pageTitle="Create a Windows Runtime 8.1 universal app on Azure App Service Mobile Apps | Microsoft Azure"
	description="Follow this tutorial to get started with using Azure mobile app backends for Windows Store development in C#, Visual Basic, or JavaScript."
	services="app-service\mobile"
	documentationCenter="windows"
	authors="ggailey777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-windows"
	ms.devlang="dotnet"
	ms.topic="hero-article"
	ms.date="02/04/2016"
	ms.author="glenga"/>

#Create a Windows app

[AZURE.INCLUDE [app-service-mobile-selector-get-started](../../includes/app-service-mobile-selector-get-started.md)]

##Overview

This tutorial shows you how to add a cloud-based backend service to a universal Windows app. For more information, see [What are Mobile Apps](app-service-mobile-value-prop.md).

[AZURE.INCLUDE [app-service-mobile-windows-universal-get-started](../../includes/app-service-mobile-windows-universal-get-started.md)]

##Prerequisites

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free mobile apps that you can keep using even after your trial ends. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).

* [Visual Studio Community 2013] or a later version.

>[AZURE.NOTE] If you want to get started with Azure App Service before you sign up for an Azure account, go to [Try App Service](https://tryappservice.azure.com/?appServiceName=mobile). There, you can immediately create a short-lived starter mobile app in App Service—no credit card required, and no commitments.

##Create a new Azure Mobile App backend

Follow these steps to create a new Mobile App backend.

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

You have now provisioned an Azure Mobile App backend that can be used by your mobile client applications. Next, you will download a server project for a simple "todo list" backend and publish it to Azure.

## Configure the server project

[AZURE.INCLUDE [app-service-mobile-configure-new-backend.md](../../includes/app-service-mobile-configure-new-backend.md)]

##Download and run the client project

Once you have configured your Mobile App backend, you can either create a new client app or modify an existing app to connect to Azure. In this section, you download a universal Windows app template project that is customized to connect to your Mobile App backend.

1. Back in the **Get started** blade for your Mobile App backend, click **Create a new app** > **Download**, then extract the compressed project files to your local computer.

3. (Optional) Add the universal Windows app project to the solution with the server project. This makes it easier to debug and test both the app and the backend in the same Visual Studio solution, if you choose to do so.

4. With the Windows Store app as the startup project, press the F5 key to rebuild the project and start the Windows Store app.

5. In the app, type meaningful text, such as *Complete the tutorial*, in the **Insert a TodoItem** text box, and then click **Save**.

	![](./media/app-service-mobile-windows-store-dotnet-get-started/mobile-quickstart-startup.png)

	This sends a POST request to the new mobile app backend that's hosted in Azure.

6. Stop debugging, right-click the `<your app name>.WindowsPhone` project, click **Set as StartUp Project**, and then press F5 again.

	![](./media/app-service-mobile-windows-store-dotnet-get-started/mobile-quickstart-completed-wp8.png)

	Notice that data saved from the previous step is loaded from the mobile app after the Windows app starts.

##Next steps

* [Add authentication to your app ](app-service-mobile-windows-store-dotnet-get-started-users.md)
  <br/>Learn how to authenticate users of your app with an identity provider.

* [Add push notifications to your app](app-service-mobile-windows-store-dotnet-get-started-push.md)
  <br/>Learn how to send a very basic push notification to your app.

<!-- Anchors. -->
<!-- Images. -->
<!-- URLs. -->
[Mobile App SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[Azure portal]: https://portal.azure.com/
[Visual Studio Community 2013]: https://go.microsoft.com/fwLink/p/?LinkID=534203
