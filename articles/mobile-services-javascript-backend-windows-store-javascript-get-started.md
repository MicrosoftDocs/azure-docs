<properties 
	pageTitle="Get Started with Mobile Services for Windows Store apps | Mobile Dev Center" 
	description="Follow this tutorial to get started using Azure Mobile Services for Windows Store development in C# or JavaScript." 
	services="mobile-services" 
	documentationCenter="windows" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-store" 
	ms.devlang="javascript" 
	ms.topic="hero-article" 
	ms.date="02/26/2015" 
	ms.author="glenga"/>

# <a name="getting-started"> </a>Get started with Mobile Services

[AZURE.INCLUDE [mobile-services-selector-get-started](../includes/mobile-services-selector-get-started.md)]

This tutorial shows you how to add a cloud-based backend service to a universal Windows app using Azure Mobile Services. 

In this tutorial, you will create both a new mobile service and a simple *To do list* app that stores app data in the new mobile service. The mobile service that you will create uses JavaScript for server-side business logic. To create a mobile service that lets you write your server-side business logic in the supported .NET languages using Visual Studio, see the .NET backend version of this topic.

[AZURE.INCLUDE [mobile-services-windows-universal-get-started](../includes/mobile-services-windows-universal-get-started.md)]

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fdocumentation%2Farticles%2Fmobile-services-javascript-backend-windows-store-javascript-get-started%2F).
* [Visual Studio 2013 Express for Windows] 

## Create a new mobile service

[AZURE.INCLUDE [mobile-services-create-new-service](../includes/mobile-services-create-new-service.md)]

## Create a new universal Windows app

Once you have created your mobile service, you can follow an easy quickstart in the Management Portal to either create a new universal Windows app or modify an existing Windows Store or Windows Phone app project to connect to your mobile service. 

In this section you will create a new universal Windows app that is connected to your mobile service.

1.  In the Management Portal, click **Mobile Services**, and then click the mobile service that you just created.

   
2. In the quickstart tab, click **Windows** under **Choose platform** and expand **Create a new Windows Store app**.

   	![](./media/mobile-services-javascript-backend-windows-store-javascript-get-started/mobile-portal-quickstart.png)

   	This displays the three easy steps to create a Windows Store app connected to your mobile service.

  	![](./media/mobile-services-javascript-backend-windows-store-javascript-get-started/mobile-quickstart-steps.png)

3. If you haven't already done so, download and install [Visual Studio 2013][Visual Studio 2013 Express for Windows] on your local computer or virtual machine.

4. Click **Create TodoItem table** to create a table to store app data.

5. Under **Download and run your app**, select a language for your app, then click **Download**. 

  	This downloads the project for the sample *To do list* application that is connected to your mobile service. Save the compressed project file to your local computer, and make a note of where you save it.

## Run your Windows app

[AZURE.INCLUDE [mobile-services-javascript-backend-run-app](../includes/mobile-services-javascript-backend-run-app.md)]

>[AZURE.NOTE]You can review the code that accesses your mobile service to query and insert data, which is found in the default.js file.

## Next Steps
Now that you have completed the quickstart, learn how to perform additional important tasks in Mobile Services: 

* [Add authentication to your app][Get started with authentication]
  <br/>Learn how to authenticate users of your app with an identity provider.

* [Add push notifications to your app][Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app.

For more information about universal Windows apps, see [Supporting multiple device platforms from a single mobile service](mobile-services-how-to-use-multiple-clients-single-service.md#shared-vs).

<!-- Anchors. -->
[Getting started with Mobile Services]:#getting-started
[Create a new mobile service]:#create-new-service
[Define the mobile service instance]:#define-mobile-service-instance
[Next Steps]:#next-steps

<!-- Images. -->

<!-- URLs. -->
[Get started with data]: mobile-services-javascript-backend-windows-universal-javascript-get-started-data.md
[Get started with authentication]: mobile-services-windows-store-javascript-get-started-users.md
[Get started with push notifications]: mobile-services-javascript-backend-windows-store-javascript-get-started-push.md
[Visual Studio 2013 Express for Windows]: http://go.microsoft.com/fwlink/?LinkId=257546
[Mobile Services SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[Management Portal]: https://manage.windowsazure.com/
