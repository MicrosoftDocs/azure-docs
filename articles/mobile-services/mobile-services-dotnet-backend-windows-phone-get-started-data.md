<properties
	pageTitle="Add Mobile Services to an existing app (Windows Phone) | Microsoft Azure"
	description="Learn how to get started using Mobile Services to leverage data in your Windows Phone app."
	services="mobile-services"
	documentationCenter="windows"
	authors="wesmc7777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-windows-phone"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="08/18/2015" 
	ms.author="wesmc"/>

# Add Mobile Services to an existing app

##Overview

[AZURE.INCLUDE [mobile-services-selector-get-started-data-legacy](../../includes/mobile-services-selector-get-started-data-legacy.md)]

This topic shows you how to add Azure Mobile Services as a backend data source for a Windows Phone 8.1 Silverlight app. In this tutorial, you will download a Visual Studio project for an app that stores data in memory, create a new mobile service, integrate the mobile service with the app, and view the changes to data made when running the app. To add Mobile Services to a Windows Phone Store 8.1 app, see [this version of the tutorial](mobile-services-dotnet-backend-windows-universal-dotnet-get-started-data.md).

The mobile service that you create in this tutorial supports the .NET runtime in the Mobile Service. This will allow you to use .NET languages and Visual Studio for server-side business logic in the mobile service. To create a mobile service that lets you write your server-side business logic in JavaScript, see the [JavaScript backend version](mobile-services-windows-phone-get-started-data.md) of this topic.


##Prerequisites

This tutorial requires the following:

+ Visual Studio 2013 Update 2, or a later version.
+ A Microsoft Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=AE564AB28&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-services-dotnet-backend-windows-store-dotnet-get-started-data%2F" target="_blank">Azure Free Trial</a>.

##Download the GetStartedWithData project

This tutorial is built on the [GetStartedWithMobileServices app](https://code.msdn.microsoft.com/Add-Azure-Mobile-to-a-8b906f72), which is a Windows Phone Silverlight 8.1 app project for Visual Studio 2013.  

1. Download the C# version of the GetStartedWithMobileServices sample app from the [Developer Code Samples site](https://code.msdn.microsoft.com/Add-Azure-Mobile-to-a-8b906f72).

	>[AZURE.NOTE]To create a Windows Phone Silverlght 8.1 app, just change the target OS in the downloaded Windows Phone Silverlight 8 app project to Windows Phone 8.1. To create a Windows Phone Store app, download the [Windows Phone Store app version](http://go.microsoft.com/fwlink/p/?LinkId=397372) of the GetStartedWithData sample app project.

2. Run Visual Studio with administrative privileges by right clicking Visual Studio and clicking **Run as administrator**.

3. In Visual Studio, open the downloaded project and examine the MainPage.xaml.cs file.

   	Notice that added **TodoItem** objects are stored in an in-memory **ObservableCollection&lt;TodoItem&gt;**.

4. In Visual Studio, choose a deployment target for the app. You can deploy to a Windows Phone device or to one of the emulators that are included with the Windows Phone SDK. In this tutorial we demonstrate deploying to an emulator.

5. Press the **F5** key. This will build, deploy, and start the app for debugging.

6. In the app, type some text in textbox, then click **Save** to save a few items in-memory in the app.

   	![App with in-memory storage](./media/mobile-services-dotnet-backend-windows-phone-get-started-data/app-view.png)

   	Notice that the text for each `TodoItem` is displayed below the refresh button along with a check box that allows you to mark the item completed.

##Create a new mobile service

[AZURE.INCLUDE [mobile-services-dotnet-backend-create-new-service](../../includes/mobile-services-dotnet-backend-create-new-service.md)]


##Download the mobile service project and add it to the solution

1. If you haven't already done so, download and install [Visual Studio Professional 2013](https://go.microsoft.com/fwLink/p/?LinkID=391934), or a later version.

2. In the [Azure Management Portal](https://manage.windowsazure.com/), click your new Mobile Service and in the quickstart page click the **Windows** platform, then under **Get Started**, expand **Connect an existing Windows or Windows Phone app**.

    ![Download the mobile service project](./media/mobile-services-dotnet-backend-windows-phone-get-started-data/download-service-project.png)

4. Under **Download and publish your service to the cloud**, click **Download**.

	This downloads the Visual Studio project that implements your mobile service.

4. Unzip the personalized service starter solution you downloaded and copy the folders that were in the zip file into the same **C#** directory where the Get Started with Data solution file (.sln) is located. This makes it easier for NuGet Package Manager to keep all the packages in sync.

5. In Visual Studio's Solution Explorer, right click your solution for the Getting Started with Data Windows Store app. Click **Add** and then click **Existing Project**.

6. In the **Add Existing Project** dialog, navigate to the mobile service project folder that you moved into the **C#** directory, select the C# project file (.csproj) in the service subdirectory, and click **Open** to add the project to your solution.

7. In Visual Studio in Solution Explorer, right click the service project you just added and click **Build** to verify that it builds with no errors. During the build, NuGet package manager may need to restore some NuGet packages that are referenced in the project.

8. Right click the service project again. This time click **Start new instance** under the **Debug** context menu.

    Visual Studio opens the default web page for your service. You can click **try it now** to test methods in your mobile service from the default web page.

    ![Mobile service try it now page](./media/mobile-services-dotnet-backend-windows-phone-get-started-data/service-welcome-page.png)

    Visual Studio hosted your mobile service locally in IIS Express by default. You can see this by right clicking the tray icon for IIS Express on your taskbar.


##Update the Windows Phone app to use the mobile service

In this section you will update the Windows Phone app to use the mobile service as a backend service for the application.


1. In Solution Explorer in Visual Studio, right click the Windows Phone app project and click **Manage NuGet Packages**.

2. In the Manage NuGet Packages dialog, search for **WindowsAzure.MobileServices** in the online packages collection and click to install the Azure Mobile Services Nuget Package. Then close the dialog.

    ![Install NuGet package](./media/mobile-services-dotnet-backend-windows-phone-get-started-data/manage-nuget-packages.png)

3. Back in the Azure Management Portal, find the step labeled **Connect your app and store data in your service**. Copy the code snippet that creates the `MobileServiceClient` connection.

    ![Connect your app snippet](./media/mobile-services-dotnet-backend-windows-phone-get-started-data/copy-mobileserviceclient-snippet.png)

4. In Visual Studio, open App.xaml.cs. Paste the code snippet at the beginning of the `App` class definition. Also add the following `using` statement at the top of that file and save the file.

		using Microsoft.WindowsAzure.MobileServices;

5. In Visual Studio, open MainPage.xaml.cs, add the using statement at the top of the file:

		using Microsoft.WindowsAzure.MobileServices;

6. In Visual Studio in MainPage.xaml.cs, replace the `MainPage` class definition with the following definition and save the file.

    This code uses the Mobile Services SDK to enable the app to store it's data in a table provided by the service instead of being stored locally in-memory. The main three methods are `InsertTodoItem`, `RefreshTodoItems`, and `UpdateCheckedTodoItem`. These three methods allow you to asynchronously insert, query, and update your data collection to a table in Azure.

        public sealed partial class MainPage : PhoneApplicationPage
        {
            private MobileServiceCollection<TodoItem, TodoItem> items;
            private IMobileServiceTable<TodoItem> todoTable =
                App.MobileService.GetTable<TodoItem>();
            public MainPage()
            {
                this.InitializeComponent();
            }
            private async void InsertTodoItem(TodoItem todoItem)
            {
                await todoTable.InsertAsync(todoItem);
                items.Add(todoItem);
            }
            private async void RefreshTodoItems()
            {
                items = await todoTable
                    .ToCollectionAsync();
                ListItems.ItemsSource = items;
            }
            private async void UpdateCheckedTodoItem(TodoItem item)
            {
                await todoTable.UpdateAsync(item);
            }
            private void ButtonRefresh_Click(object sender, RoutedEventArgs e)
            {
                RefreshTodoItems();
            }
            private void ButtonSave_Click(object sender, RoutedEventArgs e)
            {
                var todoItem = new TodoItem { Text = InputText.Text };
                InsertTodoItem(todoItem);
            }
            private void CheckBoxComplete_Checked(object sender, RoutedEventArgs e)
            {
                CheckBox cb = (CheckBox)sender;
                TodoItem item = cb.DataContext as TodoItem;
                item.Complete = (bool)cb.IsChecked;
                UpdateCheckedTodoItem(item);
            }
            protected override void OnNavigatedTo(NavigationEventArgs e)
            {
                RefreshTodoItems();
            }
        }


##Test the Windows Phone app with the service hosted locally</h2>

In this section you will use Visual Studio to test the app and mobile service locally on your development workstation. In order to test the mobile service hosted locally in IIS Express from a Windows Phone device or one of the Windows Phone emulators, you have to configure IIS Express and the workstation to allow connections to the workstation's IP address and port. Windows Phone devices and emulators connect as non-local network clients.

#### Configure IIS Express to allow remote connections

[AZURE.INCLUDE [mobile-services-how-to-configure-iis-express](../../includes/mobile-services-how-to-configure-iis-express.md)]

#### Test the app against the mobile service in IIS Express

6. In Visual Studio open the App.xaml.cs file and comment out the `MobileService` definition you recently pasted to the file. Add a new definition to make the connection based on the IP address and port that you configured on the workstation. Then save the file. Your code should look similar to the following...

        public static MobileServiceClient MobileService = new MobileServiceClient(
            "http://192.168.111.11:54321");

        //public static MobileServiceClient MobileService = new MobileServiceClient(
        //    "https://todolist.azure-mobile.net/",
        //    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        //);


7. In Visual Studio, press the F7 key or click **Build Solution** from the Build menu to build both the Windows Phone app and the mobile service. Verify both projects build with no errors in the output window of Visual Studio

8. In Visual Studio, press the F5 key or click **Start Debugging** from the Debug menu to run the app and host the mobile service locally in IIS Express.

    >[AZURE.NOTE] Make you you did run Visual Studio with the **Run as administrator** option. Otherwise, IIS Express may not load your applicationhost.config changes.

9. Enter a new todoitem's text. Then click **Save**. This inserts a new todoItem in the database created by the mobile service hosted locally in IIS Express. Click the checkbox for one of the items to mark it as completed.

10. In Visual Studio stop debugging the app. You can view the changes in the database created for the backend service by opening Server Explorer and expanding the Data Connections. Right click the TodoItems table under **MS_TableConnectionString** and click **Show Table Data**

    ![Show data in the table]([14]: ./media/mobile-services-dotnet-backend-windows-phone-get-started-data/vs-show-local-table-data.png)

11. Once you are finished with your testing with the mobile service hosted locally, delete the Windows Firewall rule you created that opened the port on your workstation.


##Publish the mobile service to Azure

[AZURE.INCLUDE [mobile-services-dotnet-backend-publish-service](../../includes/mobile-services-dotnet-backend-publish-service.md)]


##<a name="test-azure-hosted"></a>Test the mobile service published to Azure

1. In Visual Studio, open App.xaml.cs.  Comment out the code that creates the `MobileServiceClient` that connects to the locally hosted mobile service. Uncomment the code that creates the `MobileServiceClient` that connects to your service in Azure. Save your changes to the file.

        sealed partial class App : Application
        {
            //public static MobileServiceClient MobileService = new MobileServiceClient(
            //          "http://192.168.111.11:54321");

            // Use this constructor instead after publishing to the cloud
            public static MobileServiceClient MobileService = new MobileServiceClient(
                 "https://todolist.azure-mobile.net/",
                 "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            );
            ....

2. In Visual Studio, press the F5 key or click **Start Debugging** from the Debug menu. This will cause the app to be rebuilt with the previous change before running the app to connect to the mobile service hosted remotely in Azure.

3. Enter some new todoitems and click **Save** for each one. Click the checkbox to complete some of the new items. Each new todoItem will be stored and updated in the SQL database you previously configured for your mobile service in the Azure Management Portal.

    You can restart the app to see that the changes were persisted to the database in Azure. You can also examine the database using the Azure Management portal or Visual Studio's SQL Server Object Explorer. The next two steps will use the Azure Management portal to view the changes in your database.


4. In the Azure Management Portal, click manage for the database associated with your mobile service.

    ![Manage the SQL Database](./media/mobile-services-dotnet-backend-windows-phone-get-started-data/manage-sql-azure-database.png)

5. In the Management portal execute a query to view the changes made by the app. Your query will be similar to the following query but use your database name instead of `todolist`.

        SELECT * FROM [todolist].[todoitems]

    ![Query the SQL Database](./media/mobile-services-dotnet-backend-windows-phone-get-started-data/sql-azure-query.png)

This concludes the **Get started with data** tutorial.

##Next steps

This tutorial demonstrated the basics of enabling a Windows Phone 8 app to work with data in Mobile Services that are built using the .Net runtime. Next, try one of these other tutorials:

* [Add push notifications to your app]()
  <br/>Learn how to send a very basic push notification to your app.

* [Mobile Services .NET How-to Conceptual Reference]
  <br/>Learn more about how to use Mobile Services with .NET.



<!-- Images. -->

<!-- URLs. -->
[Get started with Mobile Services]: ../mobile-services-dotnet-backend-windows-phone-get-started.md
[Get started with data]: mobile-services-dotnet-backend-windows-phone-get-started-data.md

[Windows Phone 8 SDK]: http://go.microsoft.com/fwlink/p/?linkid=268374
[Azure Management Portal]: https://manage.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Mobile Services SDK]: http://go.microsoft.com/fwlink/p/?LinkId=257545
[Developer Code Samples site]:  https://code.msdn.microsoft.com/Add-Azure-Mobile-to-a-8b906f72
[Mobile Services .NET How-to Conceptual Reference]: mobile-services-windows-dotnet-how-to-use-client-library.md
[MobileServiceClient class]: http://go.microsoft.com/fwlink/p/?LinkId=302030
[How to add a new Windows Firewall port rule]:  http://go.microsoft.com/fwlink/?LinkId=392240
