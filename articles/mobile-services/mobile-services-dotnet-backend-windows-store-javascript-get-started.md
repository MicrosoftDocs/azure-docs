<properties
	pageTitle="Get Started with Mobile Services for Windows Store apps | Mobile Dev Center"
	description="Follow this tutorial to get started using Azure Mobile Services for Windows Store development in C#, VB, or JavaScript."
	services="mobile-services"
	documentationCenter="windows"
	authors="ggailey777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-windows"
	ms.devlang="javascript"
	ms.topic="article" 
	ms.date="08/08/2015"
	ms.author="glenga"/>


# <a name="getting-started"> </a>Get started with Mobile Services

[AZURE.INCLUDE [mobile-services-selector-get-started](../../includes/mobile-services-selector-get-started.md)]

##Overview
This tutorial shows you how to add a cloud-based backend service to a universal Windows app using Azure Mobile Services. In this tutorial, you will create both a new mobile service and a simple *To do list* app in HTML and JavaScript that stores app data in the new mobile service. The mobile service that you create uses the supported .NET languages using Visual Studio for server-side business logic and to manage the mobile service. To create a mobile service that lets you write your server-side business logic in JavaScript, see the JavaScript version of this topic.

[AZURE.INCLUDE [mobile-services-windows-universal-get-started](../../includes/mobile-services-windows-universal-get-started.md)]

##Prerequisites

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-services-javascript-backend-windows-store-javascript-get-started%2F).
* <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Professional 2013</a>. A free trial version is available.


## Create a new mobile service

[AZURE.INCLUDE [mobile-services-dotnet-backend-create-new-service](../../includes/mobile-services-dotnet-backend-create-new-service.md)]

## Create a new universal Windows app

Once you have created your mobile service, you can follow an easy quickstart in the Management Portal to either create a new app or modify an existing app to connect to your mobile service.

In this section you will create a new universal Windows app that is connected to your mobile service.

1. In the Management Portal, click **Mobile Services**, and then click the mobile service that you just created.

2. In the quickstart tab, click **Windows** under **Choose platform** and expand **Create a new Windows Store app**.

   	![][6]

   	This displays the three easy steps to create a Windows Store app connected to your mobile service.

  	![][7]

3. If you haven't already done so, download and install <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Professional 2013</a> on your local computer or virtual machine.

4. Under **Download and run your app and service locally**, select a language for your Windows Store app, then click **Download**.

  	This downloads a solution contains projects for both the mobile service and for the sample _To do list_ application that is connected to your mobile service. Save the compressed project file to your local computer, and make a note of where you save it.


## Test the app against the local mobile service

[AZURE.INCLUDE [mobile-services-dotnet-backend-test-local-service-dotnet](../../includes/mobile-services-dotnet-backend-test-local-service-dotnet.md)]

>[AZURE.NOTE]You can review the code that accesses your mobile service to query and insert data, which is found in the default.js file.

## Publish your mobile service

[AZURE.INCLUDE [mobile-services-dotnet-backend-publish-service](../../includes/mobile-services-dotnet-backend-publish-service.md)]

&nbsp;&nbsp;4. In the Shared code project, open the default.js file, locate the code that creates a [WindowsAzure.MobileServiceClient](http://msdn.microsoft.com/library/azure/jj554219.aspx) instance, comment-out the code that creates this client using *localhost* and uncomment the code that creates the client using the remote mobile service URL, which looks like the following:

	var client = new WindowsAzure.MobileServiceClient(
	    "https://todolist.azure-mobile.net/",
	    "XXXXXX-APPLICATION-KEY-XXXXXX"
	);

&nbsp;&nbsp;The client will now access the mobile service published to Azure.

&nbsp;&nbsp;5. Press the **F5** key to rebuild the project and start the app.

&nbsp;&nbsp;6. In the app, type meaningful text, such as *Complete the tutorial*, in **Insert a TodoItem**, and then click **Save**.

&nbsp;&nbsp;This sends a POST request to the new mobile service hosted in Azure.

&nbsp;&nbsp;7. (Optional) In a universal Windows solution, change the default start up project to the other app and press **F5** again and notice that data saved from the previous step is loaded from the mobile service after the app starts.

For more information about universal Windows apps, see [Supporting multiple device platforms from a single mobile service](mobile-services-how-to-use-multiple-clients-single-service.md#shared-vs).

<!-- Anchors. -->
[Getting started with Mobile Services]:#getting-started
[Create a new mobile service]:#create-new-service
[Define the mobile service instance]:#define-mobile-service-instance
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ./media/mobile-services-dotnet-backend-windows-store-javascript-get-started/mobile-quickstart-completed.png

[6]: ./media/mobile-services-dotnet-backend-windows-store-javascript-get-started/mobile-portal-quickstart.png
[7]: ./media/mobile-services-dotnet-backend-windows-store-javascript-get-started/mobile-quickstart-steps.png
[8]: ./media/mobile-services-dotnet-backend-windows-store-javascript-get-started/mobile-service-startup.png

[10]: ./media/mobile-services-dotnet-backend-windows-store-javascript-get-started/mobile-quickstart-startup.png
[11]: ./media/mobile-services-dotnet-backend-windows-store-javascript-get-started/mobile-quickstart-publish.png
[12]: ./media/mobile-services-dotnet-backend-windows-store-javascript-get-started/mobile-data-browse.png


<!-- URLs. -->
[Get started with authentication]: ../mobile-services-dotnet-backend-windows-store-javascript-get-started-users.md
[Get started with push notifications]: ../mobile-services-dotnet-backend-windows-store-javascript-get-started-push.md
[Visual Studio Professional 2013]: https://go.microsoft.com/fwLink/p/?LinkID=257546
[Mobile Services SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[JavaScript and HTML]: mobile-services-win8-javascript/
[Management Portal]: https://manage.windowsazure.com/
[JavaScript version]: ../mobile-services-windows-store-get-started.md 