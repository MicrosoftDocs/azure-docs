<properties pageTitle="Get started with data (Windows Universal) | Mobile Dev Center" description="Learn how to get started using Mobile Services to leverage data in your universal Windows app." services="mobile-services" documentationCenter="windows" authors="ggailey777" manager="dwrede" editor=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-store" ms.devlang="dotnet" ms.topic="article" ms.date="09/26/2014" ms.author="glenga"/>

# Add Mobile Services to an existing app

[AZURE.INCLUDE [mobile-services-selector-get-started-data](../includes/mobile-services-selector-get-started-data.md)]

This topic shows you how to use Azure Mobile Services to leverage data in a universal Windows app. Universal Windows app solutions include projects for both Windows Store 8.1 and Windows Phone Store 8.1 apps and a common shared project. For more information, see [Build universal Windows apps that target Windows and Windows Phone](http://msdn.microsoft.com/en-us/library/windows/apps/xaml/dn609832.aspx).

In this tutorial, you will download a Visual Studio 2013 project for a universal Windows app that stores data in memory, create a new mobile service, integrate the mobile service with the app, and then sign-in to the Azure Management Portal to view changes to data made when running the app.

>[AZURE.NOTE]This topic shows you how to use the tooling in Visual Studio Professional 2013 with Update 3 to connect a new mobile service to a universal Windows app. The same steps can be used to connect a mobile service to a Windows Store or Windows Phone Store 8.1 app. To connect a mobile service to an Windows Phone 8.0 or Windows Phone Silverlight 8.1 app, see [Get started with data for Windows Phone](/en-us/documentation/articles/mobile-services-windows-phone-get-started-data).

> If you cannot upgrade to Visual Studio Professional 2013 Update 3 or you prefer manually add your mobile service project to a Windows Store app solution, see [this version](/en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-data) of the topic.

This tutorial walks you through these basic steps:

1. [Download the Windows Store app project][Get the Windows Store app] 
2. [Create the mobile service from Visual Studio]
3. [Add a data table for storage]
4. [Update the app to use the mobile service]
5. [Test the app against Mobile Services]
6. [View uploaded data in the Azure Management Portal]

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-services-javascript-backend-windows-universal-dotnet-get-started-data%2F).
* <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Express 2013 for Windows</a> (Update 2 or a later version). 


##<a name="download-app"></a>Download the GetStartedWithData project

[AZURE.INCLUDE [mobile-services-windows-universal-dotnet-download-project](../includes/mobile-services-windows-universal-dotnet-download-project.md)]
 

##<a name="create-service"></a>Create a new mobile service from Visual Studio

[AZURE.INCLUDE [mobile-services-create-new-service-vs2013](../includes/mobile-services-create-new-service-vs2013.md)]

<ol start="8"><li><p>In Solution Explorer, open the App.xaml.cs code file in the GetStartedWithData.Shared project folder, and notice the new static field that was added to the <strong>App</strong> class inside a Windows Store app conditional compilation block, which looks like the following example:</p> 

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

>[AZURE.NOTE]New tables are created with the Id, __createdAt, __updatedAt, and __version columns. When dynamic schema is enabled, Mobile Services automatically generates new columns based on the JSON object in the insert or update request. For more information, see [Dynamic schema](http://msdn.microsoft.com/en-us/library/windowsazure/jj193175.aspx).

#<a name="update-app"></a>Update the app to use the mobile service

[AZURE.INCLUDE [mobile-services-windows-dotnet-update-data-app](../includes/mobile-services-windows-dotnet-update-data-app.md)]

##<a name="test-azure-hosted"></a>Test the mobile service hosted in Azure

Now we can test both versions of the universal Windows app against the mobile service hosted in Azure.

[AZURE.INCLUDE [mobile-services-windows-universal-test-app](../includes/mobile-services-windows-universal-test-app.md)]

<ol start="4">
<li><p>In the <a href="https://manage.windowsazure.com/" target="_blank">Management Portal</a>, click <strong>Mobile Services</strong>, and then click your mobile service.<p></li>
<li><p>Click the <strong>Data</strong> tab, then click <strong>Browse</strong>.</p>
<p>Notice that the <strong>TodoItem</strong> table now contains data, with id values generated by Mobile Services, and that columns have been automatically added to the table to match the TodoItem class in the app.</p></li>
</ol>

![](./media/mobile-services-javascript-backend-windows-universal-dotnet-get-started-data/mobile-todoitem-data-browse.png)
     	
This concludes the **Get started with data** tutorial.

## <a name="next-steps"> </a>Next steps

This tutorial demonstrated the basics of enabling a universal Windows app to work with data in Mobile Services. Next, consider completing one of the following tutorials that is based on the GetStartedWithData app that you created in this tutorial:

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

[Get the Windows Store app]: #download-app
[Create the mobile service from Visual Studio]: #create-service
[Add a data table for storage]: #add-table
[Update the app to use the mobile service]: #update-app
[Test the app against Mobile Services]: #test-app
[View uploaded data in the Azure Management Portal]: #view-data
[Next Steps]:#next-steps

<!-- Images. -->

<!-- URLs. -->
[Validate and modify data with scripts]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-validate-modify-data-server-scripts/
[Refine queries with paging]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-add-paging-data/
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-javascript-backend-windows-store-dotnet-get-started/
[Get started with data]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-data/
[Get started with authentication]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-users/
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-javascript-backend-windows-store-dotnet-get-started-push/
[Mobile Services .NET How-to Conceptual Reference]: /en-us/documentation/articles/mobile-services-windows-dotnet-how-to-use-client-library/

[Azure Management Portal]: https://manage.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Mobile Services SDK]: http://go.microsoft.com/fwlink/p/?LinkId=257545
[Developer Code Samples site]:  http://go.microsoft.com/fwlink/p/?LinkID=510826

[MobileServiceClient class]: http://go.microsoft.com/fwlink/p/?LinkId=302030
