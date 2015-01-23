<properties urlDisplayName="Get Started with Data" pageTitle="Get started with data (Windows Store) | Mobile Dev Center" metaKeywords="" description="Learn how to get started using Mobile Services to leverage data in your Windows Store app." metaCanonical="" services="mobile-services" documentationCenter="windows" title="" authors="wesmc7777" solutions="" manager="dwrede" editor=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-store" ms.devlang="dotnet" ms.topic="article" ms.date="09/27/2014" ms.author="wesmc" />

# Add Mobile Services to an existing app

[AZURE.INCLUDE [mobile-services-selector-get-started-data](../includes/mobile-services-selector-get-started-data.md)]

This topic shows you how to use Azure Mobile Services as a backend data source for a Windows Store app. In this tutorial, you will download a Visual Studio 2013 project for an app that stores data in memory, create a new mobile service, integrate the mobile service with the app, and view the changes to data made when running the app.

The mobile service that you will create in this tutorial is a .NET backend mobile service. .NET backend enables you to use .NET languages and Visual Studio for server-side business logic in the mobile service, and you can run and debug your mobile service on your local computer. To create a mobile service that lets you write your server-side business logic in JavaScript, see the JavaScript backend version of this topic.

>[AZURE.NOTE]This topic shows you how to use the tooling in Visual Studio Professional 2013 with Update 3 to connect a new mobile service to a universal Windows app. The same steps can be used to connect a mobile service to a Windows Store or Windows Phone Store 8.1 app. To connect a mobile service to a Windows Phone 8.0 or Windows Phone Silverlight 8.1 app, see [Get started with data for Windows Phone](/en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-data).

> If you cannot upgrade to Visual Studio Professional 2013 Update 3 or you prefer manually add your mobile service project to a Windows Store app solution, see [this version](/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started-data) of the topic.

This tutorial walks you through these basic steps:

1. [Download the Windows Store app project]
2. [Create a new mobile service from Visual Studio]
3. [Test the mobile service project locally]
4. [Update the app to use the mobile service]
5. [Publish the mobile service to Azure]
6. [Test the app against the service hosted in Azure]
7. [View the data stored in the SQL Database]

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-services-dotnet-backend-windows-universal-dotnet-get-started-data%2F).
* <a href="https://go.microsoft.com/fwLink/p/?LinkID=391934" target="_blank">Visual Studio Professional 2013</a> (Update 3 or a later version). <br/>A free trial version is available. 

##<a name="download-app"></a>Download the GetStartedWithData project

[AZURE.INCLUDE [mobile-services-windows-universal-dotnet-download-project](../includes/mobile-services-windows-universal-dotnet-download-project.md)]

##<a name="create-service"></a>Create a new mobile service from Visual Studio

[AZURE.INCLUDE [mobile-services-dotnet-backend-create-new-service-vs2013](../includes/mobile-services-dotnet-backend-create-new-service-vs2013.md)]

<ol start="7"><li><p>In Solution Explorer, open the App.xaml.cs code file in the GetStartedWithData.Shared project folder, and notice the new static field that was added to the <strong>App</strong> class inside a Windows Store app conditional compilation block, which looks like the following example:</p> 

		<pre><code>public static Microsoft.WindowsAzure.MobileServices.MobileServiceClient 
		    todolistClient = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(
		        "https://todolist.azure-mobile.net/",
		        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
		</code></pre>

	<p>This code provides access to your new mobile service in your app by using an instance of the <a href="http://go.microsoft.com/fwlink/p/?LinkId=302030">MobileServiceClient class</a>. The client is created by supplying the URI and the application key of the new mobile service. This static field is available to all pages in your app.</p>
</li>
<li><p>Right-click the Windows Phone app project, click <strong>Add</strong>, click <strong>Connected Service...</strong>, select the mobile service that you just created, and then click <strong>OK</strong>. </p>
<p>The same code is added to the shared App.xaml.cs file, but this time within a Windows Phone app conditional compilation block.</p></li>
</ol>

At this point, both the Windows Store and Windows Phone Store apps are connected to the new mobile service. The next step is to test the new mobile service project.


##<a name="test-the-service-locally"></a>Test the mobile service project locally

[AZURE.INCLUDE [mobile-services-dotnet-backend-test-local-service-api-documentation](../includes/mobile-services-dotnet-backend-test-local-service-api-documentation.md)]


##<a name="update-app"></a>Update the app to use the mobile service

In this section you will update the universal Windows app to use the mobile service as a backend service for the application. You only need to make changes to the MainPage.xaml.cs project file in the GetStartedWithData.Shared project folder. 

[AZURE.INCLUDE [mobile-services-windows-dotnet-update-data-app](../includes/mobile-services-windows-dotnet-update-data-app.md)]


##<a name="publish-mobile-service"></a>Publish the mobile service to Azure

[AZURE.INCLUDE [mobile-services-dotnet-backend-publish-service](../includes/mobile-services-dotnet-backend-publish-service.md)]


##<a name="test-azure-hosted"></a>Test the mobile service hosted in Azure

Now we can test both versions of the universal Windows app against the mobile service hosted in Azure.

[AZURE.INCLUDE [mobile-services-windows-universal-test-app](../includes/mobile-services-windows-universal-test-app.md)]

##<a name="view-stored-data"></a>View the data stored in the SQL Database

[AZURE.INCLUDE [mobile-services-dotnet-backend-view-sql-data](../includes/mobile-services-dotnet-backend-view-sql-data.md)]
 
This concludes the **Get started with data** tutorial.

## <a name="next-steps"> </a>Next steps

This tutorial demonstrated the basics of enabling a universal Windows app project to work with data in Mobile Services. Next, consider completing one of the following tutorials that is based on the GetStartedWithData app that you created in this tutorial:

* [Validate and modify data with scripts]
  <br/>Learn more about using server scripts in Mobile Services to validate and change data sent from your app.

* [Refine queries with paging]
  <br/>Learn how to use paging in queries to control the amount of data handled in a single request.

Once you have completed the data series, try one of these other tutorials:

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app.

* [Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app.

* [Mobile Services .NET How-to Conceptual Reference]
  <br/>Learn more about how to use Mobile Services with .NET.
  
<!-- Anchors. -->

[Download the Windows Store app project]: #download-app
[Create a new mobile service from Visual Studio]: #create-service
[Test the mobile service project locally]: #test-the-service-locally
[Update the app to use the mobile service]: #update-app
[Test the app against the service hosted locally]: #test-locally-hosted
[Publish the mobile service to Azure]: #publish-mobile-service
[Test the app against the service hosted in Azure]: #test-azure-hosted
[View the data stored in the SQL Database]: #view-stored-data
[Next Steps]:#next-steps

<!-- Images. -->



<!-- URLs. -->
[Validate and modify data with scripts]: /en-us/develop/mobile/tutorials/validate-modify-and-augment-data-dotnet
[Refine queries with paging]: /en-us/develop/mobile/tutorials/add-paging-to-data-dotnet
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started/
[Get started with authentication]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started-users/
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started-push/

[Get started with offline data sync]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-offline-data/

[Azure Management Portal]: https://manage.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Mobile Services SDK]: http://go.microsoft.com/fwlink/p/?LinkId=257545
[Developer Code Samples site]:  http://go.microsoft.com/fwlink/p/?LinkID=510826
[Mobile Services .NET How-to Conceptual Reference]: /en-us/documentation/articles/mobile-services-windows-dotnet-how-to-use-client-library/
[MobileServiceClient class]: http://go.microsoft.com/fwlink/p/?LinkId=302030
 