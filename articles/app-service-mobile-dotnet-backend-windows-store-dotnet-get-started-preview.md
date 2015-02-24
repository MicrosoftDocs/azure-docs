<properties
	pageTitle="Get Started with mobile app backends for Windows Store apps | Mobile Dev Center"
	description="Follow this tutorial to get started using Azure mobile app backends for Windows Store development in C#, VB, or JavaScript."
	services="app-service-mobile"
	documentationCenter="windows"
	authors="christopheranderson"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm=""
	ms.devlang="dotnet"
	ms.topic="hero-article"
	ms.date="02/10/2015"
	ms.author="chrande"/>


# <a name="getting-started"> </a>Get started with your mobile app (Windows)

[AZURE.INCLUDE [app-service-mobile-selector-get-started-preview](../includes/app-service-mobile-selector-get-started-preview.md)]

This tutorial shows you how to add a cloud-based backend service to a universal Windows app using an Azure mobile app backend. Universal Windows app solutions include projects for both Windows Store 8.1 and Windows Phone Store 8.1 apps and a common shared project. For more information, see [Build universal Windows apps that target Windows and Windows Phone](http://msdn.microsoft.com/en-us/library/windows/apps/xaml/dn609832.aspx).

In this tutorial, you will create both a new mobile app backend and a simple *To do list* app that stores app data in the new mobile app backend. The mobile app that you will create uses the supported .NET languages using Visual Studio for server-side business logic and to manage the mobile app backend.

[AZURE.INCLUDE [app-service-mobile-windows-universal-get-started-preview](../includes/app-service-mobile-windows-universal-get-started-preview.md)]

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free mobile apps that you can keep using even after your trial ends. For details, see [Azure Free Trial](http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fapp-service-mobile-dotnet-backend-windows-store-dotnet-get-started-preview%2F).
* <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Professional 2013</a>.

## <a name="create-new-service"> </a>Create a new mobile app backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service-preview](../includes/app-service-mobile-dotnet-backend-create-new-service-preview.md)]

## Create a new universal Windows app

Once you have created your mobile app backend, you can follow an easy quickstart in the Azure Portal to either create a new app or modify an existing app to connect to your mobile app backend.

In this section you will create a new universal Windows app that is connected to your mobile app backend.

1. In the Azure Portal, click **Mobile App**, and then click the mobile app that you just created.

2. At the top of the blade, click **Add Client** and expand **Windows (C#)**.

  	![Mobile App quickstart steps](./media/app-service-mobile-dotnet-backend-windows-store-dotnet-get-started-preview/windows-quickstart.png)

 This displays the three easy steps to create a Windows Store app connected to your mobile app backend.

3. If you haven't already done so, download and install <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Professional 2013</a> on your local computer or virtual machine.

4. Under **Download and run your app and service locally**, select a language for your Windows Store app, then click **Download**.

  	This downloads a solution contains projects for both the mobile app backend and for the sample _To do list_ application that is connected to your mobile app backend. Save the compressed project file to your local computer, and make a note of where you save it.

## Test the app against the local mobile app backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-test-local-service-preview](../includes/app-service-mobile-dotnet-backend-test-local-service-preview.md)]

>[AZURE.NOTE]You can review the code that accesses your mobile app backend to query and insert data, which is found in the MainPage.xaml.cs file.


## Publish your mobile app backend

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-publish-service-preview](../includes/app-service-mobile-dotnet-backend-publish-service-preview.md)]


<ol start="4">
<li><p>In the Shared code project, open the App.xaml.cs file, locate the code that creates a <a href="http://msdn.microsoft.com/en-us/library/Windowsazure/microsoft.windowsazure.mobileservices.mobileserviceclient.aspx" target="_blank">MobileServiceClient</a> instance, comment-out the code that creates this client using <em>localhost</em> and uncomment the code that creates the client using the remote mobile app backend URL, which looks like the following:</p>

        <pre><code>public static MobileServiceClient MobileService = new MobileServiceClient(
            "https://todolist.azure-mobile.net/",
            "XXXX-APPLICATION-KEY-XXXXX");</code></pre>

	<p>The client will now access the mobile app backend published to Azure.</p></li>
</ol>

## Test the app against the mobile app backend hosted in Azure

Now that the mobile app backend is published and the client is connected to the remote mobile app backend hosted in Azure, we can run the app using Azure for item storage.

[AZURE.INCLUDE [app-service-mobile-windows-universal-test-app-preview](../includes/app-service-mobile-windows-universal-test-app-preview.md)]


## Next Steps
Now that you have completed the quickstart, learn how to perform additional important tasks:

* [Add authentication to your Mobile app ][Get started with authentication]
  <br/>Learn how to authenticate users of your app with an identity provider.

<!-- Anchors. -->

[Getting started with mobile app backends]:#getting-started
[Create a new mobile app backend]:#create-new-service
[Define the mobile app backend instance]:#define-mobile-app-backend-instance
[Next Steps]:#next-steps

<!-- Images. -->



<!-- URLs. -->
[Get started with authentication]: /en-us/documentation/articles/app-service-mobile-dotnet-backend-windows-store-dotnet-get-started-users-preview
[Visual Studio Professional 2013]: https://go.microsoft.com/fwLink/p/?LinkID=257546
[Mobile App SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[Azure Portal]: https://portal.azure.com/
