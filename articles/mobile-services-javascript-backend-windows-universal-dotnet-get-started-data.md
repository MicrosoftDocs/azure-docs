<properties 
	pageTitle="Add Mobile Services to an existing app (Windows Universal) | Mobile Dev Center" 
	description="Learn how to get started using Mobile Services to leverage data in your universal Windows app." 
	services="mobile-services" 
	documentationCenter="windows" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="05/02/2015" 
	ms.author="glenga"/>

# Add Mobile Services to an existing app

[AZURE.INCLUDE [mobile-services-selector-get-started-data](../includes/mobile-services-selector-get-started-data.md)]

##Overview

This topic shows you how to use Azure Mobile Services to leverage data in a universal Windows app. Universal Windows app solutions include projects for both Windows Store 8.1 and Windows Phone Store 8.1 apps and a common shared project. For more information, see [Build universal Windows apps that target Windows and Windows Phone](http://msdn.microsoft.com/library/windows/apps/xaml/dn609832.aspx).

In this tutorial, you will download a Visual Studio 2013 project for a universal Windows app that stores data in memory, create a new mobile service, integrate the mobile service with the app, and then sign-in to the Azure Management Portal to view changes to data made when running the app.

>[AZURE.NOTE]This topic shows you how to use the tooling in Visual Studio Professional 2013 with Update 3 to connect a new mobile service to a universal Windows app. The same steps can be used to connect a mobile service to a Windows Store or Windows Phone Store 8.1 app. To connect a mobile service to an Windows Phone 8.0 or Windows Phone Silverlight 8.1 app, see [Get started with data for Windows Phone](mobile-services-windows-phone-get-started-data.md).

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-services-javascript-backend-windows-universal-dotnet-get-started-data%2F).
* <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Express 2013 for Windows</a> (Update 2 or a later version). 

##<a name="download-app"></a>Download the GetStartedWithData project

[AZURE.INCLUDE [mobile-services-windows-universal-dotnet-download-project](../includes/mobile-services-windows-universal-dotnet-download-project.md)]
 

##<a name="create-service"></a>Create a new mobile service from Visual Studio

[AZURE.INCLUDE [mobile-services-create-new-service-vs2013](../includes/mobile-services-create-new-service-vs2013.md)]

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

At this point, both the Windows Store and Windows Phone Store apps are connected to the new mobile service. The next step is to create a new TodoItem table in the mobile service.

##<a name="add-table"></a>Add a new table to the mobile service

[AZURE.INCLUDE [mobile-services-create-new-table-vs2013](../includes/mobile-services-create-new-table-vs2013.md)]

##<a name="update-app"></a>Update the app to use the mobile service

[AZURE.INCLUDE [mobile-services-windows-dotnet-update-data-app](../includes/mobile-services-windows-dotnet-update-data-app.md)]

##<a name="test-azure-hosted"></a>Test the mobile service hosted in Azure

Now we can test both versions of the universal Windows app against the mobile service hosted in Azure.

[AZURE.INCLUDE [mobile-services-windows-universal-test-app](../includes/mobile-services-windows-universal-test-app.md)]

<ol start="4">
<li><p>In the <a href="https://manage.windowsazure.com/" target="_blank">Management Portal</a>, click <strong>Mobile Services</strong>, and then click your mobile service.<p></li>
<li><p>Click the <strong>Data</strong> tab, then click <strong>Browse</strong>.</p>
<p>Notice that the <strong>TodoItem</strong> table now contains data, with id values generated by Mobile Services, and that columns have been automatically added to the table to match the TodoItem class in the app.</p></li>
</ol>
     
This concludes the tutorial.

## <a name="next-steps"> </a>Next steps

This tutorial demonstrated the basics of enabling a universal Windows app to work with data in Mobile Services. Next, consider reading up on one of these other topics:

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app.

* [Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app.

* [Mobile Services C# How-to Conceptual Reference](mobile-services-windows-dotnet-how-to-use-client-library.md)
  <br/>Learn more about how to use Mobile Services with .NET.
  
<!-- Anchors. -->

[Get the Windows Store app]: #download-app
[Create the mobile service from Visual Studio]: #create-service
[Add a data table for storage]: #add-table
[Update the app to use the mobile service]: #update-app
[Test the app against Mobile Services]: #test-app
[View uploaded data in the Azure Management Portal]: #view-data
[Next Steps]:#next-steps

<!-- Images. -->

<!-- URLs. -->
[Validate and modify data with scripts]: mobile-services-windows-store-dotnet-validate-modify-data-server-scripts.md
[Refine queries with paging]: mobile-services-windows-store-dotnet-add-paging-data.md
[Get started with Mobile Services]: mobile-services-javascript-backend-windows-store-dotnet-get-started.md
[Get started with data]: mobile-services-windows-store-dotnet-get-started-data.md
[Get started with authentication]: mobile-services-windows-store-dotnet-get-started-users.md
[Get started with push notifications]: mobile-services-javascript-backend-windows-store-dotnet-get-started-push.md
[Mobile Services .NET How-to Conceptual Reference]: mobile-services-windows-dotnet-how-to-use-client-library.md

[Azure Management Portal]: https://manage.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Mobile Services SDK]: http://go.microsoft.com/fwlink/p/?LinkId=257545
[Developer Code Samples site]:  http://go.microsoft.com/fwlink/p/?LinkID=510826

[MobileServiceClient class]: http://go.microsoft.com/fwlink/p/?LinkId=302030
