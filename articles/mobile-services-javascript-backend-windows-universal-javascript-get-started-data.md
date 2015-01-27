<properties pageTitle="Get started with data (Windows Store JavaScript) | Mobile Dev Center" description="Learn how to get started using Mobile Services to leverage data in your Windows Store JavaScript app." services="mobile-services" documentationCenter="windows" authors="ggailey777" manager="dwrede" editor=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-store" ms.devlang="javascript" ms.topic="article" ms.date="09/26/2014" ms.author="glenga"/>


# Add Mobile Services to an existing app
[AZURE.INCLUDE [mobile-services-selector-get-started-data](../includes/mobile-services-selector-get-started-data.md)]

This topic shows you how to use Azure Mobile Services to leverage data in a universal Windows app. Universal Windows app solutions include projects for both Windows Store 8.1 and Windows Phone Store 8.1 apps and a common shared project. For more information, see [Build universal Windows apps that target Windows and Windows Phone](http://msdn.microsoft.com/en-us/library/windows/apps/xaml/dn609832.aspx).

In this tutorial, you will download a Visual Studio 2013 project for a universal Windows app that stores data in memory, create a new mobile service, integrate the mobile service with the app, and then sign-in to the Azure Management Portal to view changes to data made when running the app.

>[AZURE.NOTE]This topic shows you how to use the tooling in Visual Studio Express 2013 with Update 3 for Windows to connect a new mobile service to a universal Windows app. The same steps can be used to connect a mobile service to a Windows Store or Windows Phone Store 8.1 app. To connect a mobile service to an Windows Phone 8.0 or Windows Phone Silverlight 8.1 app, see [Get started with data for Windows Phone](/en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-data).

This tutorial walks you through these basic steps:

1. [Download the Windows Store app project][Get the Windows Store app] 
2. [Create the mobile service]
3. [Add a data table for storage]
4. [Update the app to use Mobile Services]
5. [Test the app against Mobile Services]

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-services-javascript-backend-windows-universal-javascript-get-started-data%2F).
* <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Express 2013 for Windows</a> (Update 2 or a later version). 

##<a name="download-app"></a>Download the GetStartedWithData project

[AZURE.INCLUDE [mobile-services-windows-universal-javascript-download-project](../includes/mobile-services-windows-universal-dotnet-download-project.md)]

##<a name="create-service"></a>Create a new mobile service from Visual Studio

[AZURE.INCLUDE [mobile-services-create-new-service-vs2013](../includes/mobile-services-create-new-service-vs2013.md)]

<ol start="8">
<li><p>In Solution Explorer, navigate to the <strong>services\mobileService\scripts</strong> subfolder, open the service.js script file, and notice the new global variable, which looks like the following example:</p> 

		<pre><code>var todolistClient = new WindowsAzure.MobileServiceClient(
                "https://todolist.azure-mobile.net/",
		        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");</code></pre>

	<p>This code provides access to your new mobile service in your app by using a global variable. The client is created by supplying the URI and the application key of the new mobile service. Because a reference to this script was was added to the default.html file, this variable is available to all script files that are also referenced from this page.</p>
</li>
<li><p>Open the default.html project file, locate the reference to the new service.js script file, and make sure that the referenced path is like the following:</p>
<pre><code>&lt;script src="/services/mobileServices/scripts/todolist.js"&gt;</script></code></pre>
<p>There is currently a bug in Visual Studio that generates an incorrect folder name in the path.</p></li>
<li><p>Right-click the Windows Phone app project, click <strong>Add</strong>, click <strong>Connected Service...</strong>, select the mobile service that you just created, and then click <strong>OK</strong>. </p>
<p>The same new code file is added to the Windows Phone Store app project. Make sure to also fix the reference path added to the default.html file.</p></li>
</ol>

##<a name="add-table"></a>Add a new table to the mobile service

[AZURE.INCLUDE [mobile-services-create-new-table-vs2013](../includes/mobile-services-create-new-table-vs2013.md)]

>[AZURE.NOTE]New tables are created with the Id, __createdAt, __updatedAt, and __version columns. When dynamic schema is enabled, Mobile Services automatically generates new columns based on the JSON object in the insert or update request. For more information, see [Dynamic schema](http://msdn.microsoft.com/en-us/library/windowsazure/jj193175.aspx).

#<a name="update-app"></a>Update the app to use the mobile service

[AZURE.INCLUDE [mobile-services-windows-javascript-update-data-app](../includes/mobile-services-windows-javascript-update-data-app.md)]

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

* [Mobile Services HTML/JavaScript How-to Conceptual Reference]
  <br/>Learn more about how to use Mobile Services with HTML and JavaScript.

<!-- Anchors. -->

[Get the Windows Store app]: #download-app
[Create the mobile service]: #create-service
[Add a data table for storage]: #add-table
[Update the app to use Mobile Services]: #update-app
[Test the app against Mobile Services]: #test-app
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ./media/mobile-services-windows-store-javascript-get-started-data-vs2013/mobile-quickstart-startup.png

[9]: ./media/mobile-services-windows-store-javascript-get-started-data-vs2013/mobile-todoitem-data-browse.png
[10]: ./media/mobile-services-windows-store-javascript-get-started-data-vs2013/mobile-data-sample-download-js-vs12.png


<!-- URLs. -->
[Validate and modify data with scripts]: /en-us/documentation/articles/mobile-services-windows-store-javascript-validate-modify-data-server-scripts/
[Refine queries with paging]: /en-us/documentation/articles/mobile-services-windows-store-javascript-add-paging-data/
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-javascript-backend-windows-store-javascript-get-started/
[Get started with data]: /en-us/documentation/articles/mobile-services-windows-store-javascript-get-started-data/
[Get started with authentication]: /en-us/documentation/articles/mobile-services-windows-store-javascript-get-started-users/
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-javascript-backend-windows-store-javascript-get-started-push/

[Azure Management Portal]: https://manage.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Mobile Services SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[Developer Code Samples site]:  http://go.microsoft.com/fwlink/p/?LinkID=510826
[Mobile Services HTML/JavaScript How-to Conceptual Reference]: /en-us/documentation/articles/mobile-services-html-how-to-use-client-library/
