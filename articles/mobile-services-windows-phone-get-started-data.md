<properties 
	pageTitle="Add Mobile Services to an existing app (WP8) - Azure Mobile Services" 
	description="Learn how to get started using data from your Azure Mobile Services Windows Phone 8 app." 
	services="mobile-services" 
	documentationCenter="windows" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="glenga"/>


# Add Mobile Services to an existing app

[AZURE.INCLUDE [mobile-services-selector-get-started-data-legacy](../includes/mobile-services-selector-get-started-data-legacy.md)]

<div class="dev-onpage-video-clear clearfix">
<div class="dev-onpage-left-content">

<p>This topic shows you how to use Azure Mobile Services to leverage data in a Windows Phone 8 app. In this tutorial, you will download an app that stores data in memory, create a new mobile service, integrate the mobile service with the app, and then login to the Azure Management Portal to view changes to data made when running the app.</p>
</div>
<div class="dev-onpage-video-wrapper"><a href="http://go.microsoft.com/fwlink/?LinkID=298628" target="_blank" class="label">watch the tutorial</a> <a style="background-image: url('/media/devcenter/mobile/videos/mobile-wp8-get-started-data-180x120.png') !important;" href="http://go.microsoft.com/fwlink/?LinkID=298628" target="_blank" class="dev-onpage-video"><span class="icon">Play Video</span></a> <span class="time">12:54</span></div>
</div>

This tutorial walks you through these basic steps:

1. [Download the Windows Phone 8 app project] 
2. [Create the mobile service]
3. [Add a data table for storage]
4. [Update the app to use Mobile Services]
5. [Test the app against Mobile Services]

This tutorial requires Visual Studio 2012 Express for Windows Phone 8 and the [Windows Phone 8 SDK] running on Windows 8. To complete this tutorial to create a Windows Phone 8.1 app, you must use Visual Studio 2013 Update 2, or a later version.

>[AZURE.NOTE]To complete this tutorial, you need an Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/pricing/free-trial/?WT.mc_id=A756A2826&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started-with-data-wp8%2F" target="_blank">Azure Free Trial</a>.

##<a name="download-app"></a>Download the GetStartedWithData project

This tutorial is built on the [GetStartedWithData app][Developer Code Samples site], which is a Windows Phone Silverlight 8 app project.  

1. Download the GetStartedWithData sample app project from the [Developer Code Samples site]. 

	>[AZURE.NOTE]To create a Windows Phone Silverlght 8.1 app, just change the target OS in the downloaded Windows Phone Silverlight 8 app project to Windows Phone 8.1. To create a Windows Phone Store app, download the [Windows Phone Store app version](http://go.microsoft.com/fwlink/p/?LinkId=397372) of the GetStartedWithData sample app project. 

2. In Visual Studio, open the downloaded project and examine the MainPage.xaml.cs file.

   	Notice that added **TodoItem** objects are stored in an in-memory **ObservableCollection&lt;TodoItem&gt;**.

3. Press the **F5** key to rebuild the project and start the app.

4. In the app, type some text in the text box, then click the **Save** button.

   	![][0]  

   	Notice that the saved text is displayed in the list below.

<h2><a name="create-service"></a>Create a new mobile service in the Management Portal</h2>

[AZURE.INCLUDE [mobile-services-create-new-service-data](../includes/mobile-services-create-new-service-data.md)]

<h2><a name="add-table"></a>Add a new table to the mobile service</h2>

[AZURE.INCLUDE [mobile-services-create-new-service-data-2](../includes/mobile-services-create-new-service-data-2.md)]

<h2><a name="update-app"></a>Update the app to use the mobile service for data access</h2>

Now that your mobile service is ready, you can update the app to store items in Mobile Services instead of the local collection. 

1. In **Solution Explorer** in Visual Studio, right-click the project name, and then select **Manage NuGet Packages**.

2. In the left pane, select the **Online** category, search for `WindowsAzure.MobileServices`, click **Install** on the **Azure Mobile Services** package, then accept the license agreement.

  	![][7]

  	This adds the Mobile Services client library to the project.

3. In the Management Portal, click **Mobile Services**, and then click the mobile service you just created.

4. Click the **Dashboard** tab and make a note of the **Site URL**, then click **Manage keys** and make a note of the **Application key**.

   	![][8]

  	You will need these values when accessing the mobile service from your app code.

5. In Visual Studio, open the file App.xaml.cs and add or uncomment the following `using` statement:

       	using Microsoft.WindowsAzure.MobileServices;

6. In this same file, uncomment the code that defines the **MobileService** variable, and supply the URL and application key from the mobile service in the **MobileServiceClient** constructor, in that order.

		//public static MobileServiceClient MobileService = new MobileServiceClient( 
        //    "AppUrl", 
        //    "AppKey" 
        //); 

  	This creates a new instance of **MobileServiceClient** that is used to access your mobile service.

6. In the file MainPage.xaml.cs, add or uncomment the following `using` statements:

       	using Microsoft.WindowsAzure.MobileServices;
		using Newtonsoft.Json;

7. In this same file, replace the **TodoItem** class definition with the following code:

        public class TodoItem
        {
            public string Id { get; set; }

            [JsonProperty(PropertyName = "text")]
            public string Text { get; set; }

            [JsonProperty(PropertyName = "complete")]
            public bool Complete { get; set; }
        }

7. Comment the line that defines the existing **items** collection, then uncomment the following lines:

        private MobileServiceCollection<TodoItem, TodoItem> items;
        private IMobileServiceTable<TodoItem> todoTable = 
			App.MobileService.GetTable<TodoItem>();

   	This code creates a mobile services-aware binding collection (**items**) and a proxy class for the SQL Database table **TodoItem** (**todoTable**). 

7. In the **InsertTodoItem** method, remove the line of code that sets the **TodoItem**.**Id** property, add the **async** modifier to the method, and uncomment the following line of code:

        await todoTable.InsertAsync(todoItem);

  	This code inserts a new item into the table.

8. In the **RefreshTodoItems** method, add the **async** modifier to the method, then uncomment the following line of code:

        items = await todoTable.ToCollectionAsync();

   	This sets the binding to the collection of items in the todoTable, which contains all TodoItem objects returned from the mobile service. 

9. In the **UpdateCheckedTodoItem** method, add the **async** modifier to the method, and uncomment the following line of code:

         await todoTable.UpdateAsync(item);

   	This sends an item update to the mobile service.

Now that the app has been updated to use Mobile Services for backend storage, it's time to test the app against Mobile Services.

<h2><a name="test-app"></a>Test the app against your new mobile service</h2>

1. In Visual Studio, press the F5 key to run the app.

2. As before, type text in the textbox, and then click **Save**.

   	This sends a new item as an insert to the mobile service.

3. In the [Management Portal], click **Mobile Services**, and then click your mobile service.

4. Click the **Data** tab, then click **Browse**.

   	![][9]
  
   	Notice that the **TodoItem** table now contains data, with id values generated by Mobile Services, and that columns have been automatically added to the table to match the TodoItem class in the app.

This concludes the tutorial.

## <a name="next-steps"> </a>Next steps

This tutorial demonstrated the basics of enabling a Windows Phone 8 app to work with data in Mobile Services. Next, consider reading up on one of these other topics:

* [Get started with authentication] 
  <br/>Learn how to authenticate users of your app.

* [Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app with Mobile Services.

* [Mobile Services C# How-to Conceptual Reference](mobile-services-windows-dotnet-how-to-use-client-library.md)
  <br/>Learn more about how to use Mobile Services with .NET.
 
<!-- Anchors. -->
[Download the Windows Phone 8 app project]: #download-app
[Create the mobile service]: #create-service
[Add a data table for storage]: #add-table
[Update the app to use Mobile Services]: #update-app
[Test the app against Mobile Services]: #test-app
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ./media/mobile-services-windows-phone-get-started-data/mobile-quickstart-startup-wp8.png






[7]: ./media/mobile-services-windows-phone-get-started-data/mobile-add-nuget-package-wp.png
[8]: ./media/mobile-services-windows-phone-get-started-data/mobile-dashboard-tab.png
[9]: ./media/mobile-services-windows-phone-get-started-data/mobile-todoitem-data-browse.png



<!-- URLs. -->
[Validate and modify data with scripts]: /develop/mobile/tutorials/validate-modify-and-augment-data-wp8
[Refine queries with paging]: /develop/mobile/tutorials/add-paging-to-data-wp8
[Get started with Mobile Services]: /develop/mobile/tutorials/get-started-wp8
[Get started with data]: /develop/mobile/tutorials/get-started-with-data-wp8
[Get started with authentication]: /develop/mobile/tutorials/get-started-with-users-wp8
[Get started with push notifications]: /develop/mobile/tutorials/get-started-with-push-wp8

[Azure Management Portal]: https://manage.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Windows Phone 8 SDK]: http://go.microsoft.com/fwlink/p/?LinkID=268374
[Mobile Services SDK]: http://go.microsoft.com/fwlink/p/?LinkID=268375
[Developer Code Samples site]:  http://go.microsoft.com/fwlink/p/?LinkId=271146
