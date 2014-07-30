<properties pageTitle="Get Started with the Azure WebJobs SDK" metaKeywords="Azure tutorial, Azure WebJobs tutorial, Azure multi-tier tutorial, MVC tutorial, Azure blobs tutorial, Azure queues tutorial, Azure storage tutorial" description="Learn how to create a multi-tier app using ASP.NET MVC and Azure. The frontend runs in a website, and the backend runs as a WebJob. The app uses Entity Framework, SQL Database, and Azure storage queues and blobs." metaCanonical="" services="web-sites,storage" documentationCenter=".NET" title="Get Started with the Azure WebJobs SDK" authors="tdykstra" solutions="" manager="wpickett" editor="mollybos" />

# Get Started with the Azure WebJobs SDK

This tutorial introduces the WebJobs SDK and shows how to create a multi-tier ASP.NET MVC application that uses the WebJobs SDK in an [Azure Website](/en-us/documentation/articles/fundamentals-application-models/#WebSites). The application uses [Azure SQL Database](http://msdn.microsoft.com/library/azure/ee336279), the [Azure Blob service](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/unstructured-blob-storage), and the [Azure Queue service](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/queue-centric-work-pattern). 

The sample application is an advertising bulletin board. Users create an ad by entering text and uploading an image. They can see a list of ads with thumbnail images, and they can see the full size image when they select an ad to see the details. Here's a screenshot:

![Ad list](./media/websites-dotnet-webjobs-sdk-get-started/list.png)

You can [download the Visual Studio project][download] from the MSDN Code Gallery. 

[download]: http://code.msdn.microsoft.com/Simple-Azure-Website-with-b4391eeb

## Table of Contents

The tutorial includes the following sections:

- [Prerequisites](#prerequisites)
- [Introduction](#learn)
	- [What You'll Learn](#learn)
	- [The WebJobs SDK](#webjobssdk)
	- [Contoso Ads application architecture](#contosoads)
- [Set up the development environment](#setupdevenv)
- [Build, run, and deploy the application](#storage)
	- [Create an Azure Storage account](#storage)
	- [Configure the application to use your storage account](#configurestorage)
	- [Run the application locally](#runlocal)
	- [Deploy the application to Azure](#deploy)
- [Create the application from scratch](#create)
- [Review the application code](#code)
- [Troubleshoot](#troubleshoot)
- [Next Steps](#next-steps)

## <a id="prerequisites"></a>Prerequisites

The tutorial assumes that you know how to work with [ASP.NET MVC](http://www.asp.net/mvc/tutorials/mvc-5/introduction/getting-started) or [Web Forms](http://www.asp.net/web-forms/tutorials/aspnet-45/getting-started-with-aspnet-45-web-forms/introduction-and-overview) projects in Visual Studio. The sample application uses MVC, but most of the tutorial also applies to Web Forms. 

The tutorial instructions work with either of the following products:

* Visual Studio 2013
* Visual Studio 2013 Express for Web

If you don't have one of these, Visual Studio 2013 Express for web will be installed automatically when you install the Azure SDK.

[WACOM.INCLUDE [free-trial-note](../includes/free-trial-note.md)]

## <a id="learn"></a>What you'll learn

The tutorial shows how to do the following tasks:

* Enable your machine for Azure development by installing the Azure SDK.
* Create a Console Application project that automatically deploys as an Azure WebJob when you deploy the associated web project.
* Test a WebJobs SDK backend locally on the development computer.
* Publish an application with a WebJobs backend to an Azure Website.
* Upload files and store them in the Azure Blob service.
* Use the Azure WebJobs SDK to work with Azure Storage queues and blobs.

## <a id="webjobssdk"></a>Introduction to the WebJobs SDK 

[WebJobs](/en-us/documentation/articles/web-sites-create-web-jobs/) is a feature of Azure Websites that enables you to run a program or script in the same context as your website. You don't have to use the WebJobs SDK in order to run a program as a WebJob. The purpose of the WebJobs SDK is to simplify the task of writing code that works with Azure Storage queues, blobs, and tables, and Service Bus queues.
 
The WebJobs SDK includes the following components:

* **NuGet packages**. NuGet packages that you add to a Visual Studio project provide a framework that your code uses to work with the Azure Storage service or Service Bus queues.
* **Dashboard**. Part of the WebJobs SDK is included in Azure Websites and provides rich monitoring and diagnostics for the programs that you write by using the NuGet packages. You don't have to write code to use these monitoring and diagnostics features.

You can run a program that uses the WebJobs SDK NuGet packages anywhere; it does not have to run as an Azure WebJob. However, the Dashboard is only available as a site extension for an Azure Website. For example, you can run a program that uses the WebJobs SDK locally on the development computer or in an Azure Cloud Service worker role. You could then get monitoring information by configuring the WebJobs SDK dashboard of an Azure Website to use the same storage account that your WebJobs SDK program uses.

As this tutorial is being written, the WebJobs SDK is a beta release. It is not supported for production use.

### Typical Scenarios

Here are some typical scenarios you can handle more easily with the Azure WebJobs SDK:

* Image processing or other CPU-intensive work. A common feature of websites is the ability to upload images or videos. Often you want to manipulate the content after it's uploaded, but you don't want to make the user wait while you do that.
* Queue processing. A common way for a web frontend to communicate with a backend service is to use queues. When the website needs to get work done, it pushes a message onto a queue. A backend service pulls messages from the queue and does the work. For example, you could use queues with image processing: after the user uploads a number of files, put the file names in a queue message to be picked up by the backend for processing. Or you could use queues to improve site responsiveness. For example, instead of writing directly to a SQL database, write to a queue, tell the user you're done, and let the backend service handle high-latency relational database work.
* RSS aggregation. If you have a site that maintains a list of RSS feeds, you could pull in all of the articles from the feeds in a background process.
* File maintenance, such as aggregating or cleaning up log files.  You might have log files being created by several sites or for separate time spans which you want to combine in order to run analysis jobs on them. Or you might want to schedule a task to run weekly to clean up old log files.
* Other long-running tasks that you want to run in a background thread, such as sending emails. 

To prevent your website from going to sleep after a period of inactivity, which would interrupt a long-running background task, you can use the [AlwaysOn](http://weblogs.asp.net/scottgu/archive/2014/01/16/windows-azure-staging-publishing-support-for-web-sites-monitoring-improvements-hyper-v-recovery-manager-ga-and-pci-compliance.aspx) feature of Azure Websites.

### Code samples

The code for handling typical tasks that work with Azure Storage is simple. In a Console Application, you write methods for the background tasks that you want to execute, and you decorate them with attributes from the WebJobs SDK. Your `Main` method creates a `JobHost` object that coordinates the calls to methods you write. The WebJobs SDK framework knows when to call your methods based on the WebJobs SDK attributes you use in them. For example:

		static void Main()
		{
		    JobHost host = new JobHost();
		    host.RunAndBlock();
		}

		public static void ProcessQueueMessage([QueueTrigger("webjobsqueue")] string inputText, 
            [Blob("containername/blobname")]TextWriter writer)
		{
		    writer.WriteLine(inputText);
		}

The `JobHost` object is a container for a set of background functions. The `JobHost` object monitors the functions, watches for events that trigger them, and executes the functions when trigger events occur. You call a `JobHost` method to indicate whether you want the container process to run on the current thread or a background thread. In the example, the `RunAndBlock` method runs the process continuously on the current thread.

Because the `ProcessQueueMessage` method in this example has a `QueueTrigger` attribute, the trigger for that function is the reception of a new queue message. The `JobHost` object watches for new queue messages on the specified queue ("webjobsqueue" in this sample) and when one is found, it calls `ProcessQueueMessage`. The `QueueTrigger` attribute also notifies the framework to bind the `inputText` parameter to the value of the queue message: 

<pre class="prettyprint">public static void ProcessQueueMessage([QueueTrigger(&quot;webjobsqueue&quot;)]] <mark>string inputText</mark>, 
    [Blob("containername/blobname")]TextWriter writer)</pre>

The framework also binds a `TextWriter` object to a blob named "blobname" in a container named "containername":

<pre class="prettyprint">public static void ProcessQueueMessage([QueueTrigger(&quot;webjobsqueue&quot;)]] string inputText, 
    <mark>[Blob("containername/blobname")]TextWriter writer</mark>)</pre>

The function then uses these parameters to write the value of the queue message to the blob:

		writer.WriteLine(inputText);

As you can see, the trigger and binder features of the WebJobs SDK greatly simplify the code you have to write to work with Azure Storage objects. The low-level code required to handle queue and blob processing is done for you by the WebJobs SDK framework -- the framework creates queues that don't exist yet, opens the queue, reads queue messages, deletes queue messages when processing is completed, creates blob containers that don't exist yet, writes to blobs, and so on.

The WebJobs SDK provides many ways to work with  Azure Storage. For example, if the parameter you decorate with the `QueueTrigger` attribute is a byte array or a custom type, it is automatically deserialized from JSON. And you can use a `BlobTrigger` attribute to trigger a process whenever a new blob is created in your Azure Storage account. (Note that while `QueueTrigger` finds new queue messages within a few seconds, `BlobTrigger` can take up to 20 minutes to detect a new blob. `BlobTrigger` scans for blobs whenever the `JobHost` starts and then periodically checks the Azure Storage logs to detect new blobs.)

## <a id="contosoads"></a>Contoso Ads application architecture

The sample application uses the [queue-centric work pattern](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/queue-centric-work-pattern) to off-load the CPU-intensive work of creating thumbnails to a backend process. 

The app stores ads in a SQL database, using Entity Framework Code First to create the tables and access the data. For each ad the database stores two URLs, one for the full-size image and one for the thumbnail.

![Ad table](./media/websites-dotnet-webjobs-sdk-get-started/adtable.png)

When a user uploads an image, the frontend website stores the image in an [Azure blob](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/unstructured-blob-storage), and it stores the ad information in the database with a URL that points to the blob. At the same time, it writes a message to an Azure queue. A backend process running as an Azure WebJob uses the WebJobs SDK to poll the queue for new messages. When a new message appears, the WebJob creates a thumbnail for that image and updates the thumbnail URL database field for that ad. Here's a diagram that shows how the parts of the application interact:

![Contoso Ads architecture](./media/websites-dotnet-webjobs-sdk-get-started/apparchitecture.png)

### Alternative architecture

WebJobs run in the context of a website and are not scalable separately. For example, if you have one Standard website instance, you can only have 1 instance of your background process running, and it is using some of the server resources (CPU, memory, etc.) that otherwise would be available to serve web content. 

If traffic varies by time of day or day of week, and if the backend processing you need to do can wait, you could schedule your WebJobs to run at low-traffic times. If the load is still too high for that solution, you can consider alternative environments for your backend program, such as the following:

* Run the program as a WebJob in a separate website dedicated for that purpose. You can then scale your backend website independently from your frontend website.
* Run the program in an Azure Cloud Service worker role. If you choose this option, you could run the frontend in either a Cloud Service web role or a Website.

This tutorial shows how to run the frontend in a website and the backend as a WebJob in the same website. For information about how to choose the best environment for your scenario, see [Azure Websites, Cloud Services, and Virtual Machines Comparison](/en-us/documentation/articles/choose-web-site-cloud-service-vm/).

[WACOM.INCLUDE [install-sdk-2013-only](../includes/install-sdk-2013-only.md)]

## <a id="storage"></a>Create an Azure Storage account

An Azure storage account provides resources for storing queue and blob data in the cloud. It is also used by the WebJobs SDK to store logging data for the Dashboard.

In a real-world application, you typically create separate accounts for application data versus logging data, and separate accounts for test data versus production data. For this tutorial you'll use just one account.

1. In the [Azure Management Portal](http://manage.windowsazure.com), click **New** - **Data Services** - **Storage** - **Quick Create**.

4. In the **URL** box, enter a URL prefix. 

	This prefix plus the text you see under the box will be the unique URL to your storage account. If the prefix you enter has already been used by someone else, choose a different prefix.

	In the image at the end of this section, a storage account is created with the URL `contosoads.core.windows.net`.

5. Set the **Region** drop-down list to the region closest to you.

	This setting specifies which Azure datacenter will host your storage account. For this tutorial your choice won't make a noticeable difference, but for a production site you want your web server and your storage account to be in the same region to minimize latency and data egress charges. The website (which you'll create later) should be as close as possible to the browsers accessing your site in order to minimize latency.

6. Set the **Replication** drop-down list to **Locally redundant**. 

	When geo-replication is enabled for a storage account, the stored content is replicated to a secondary datacenter to enable failover to that location in case of a major disaster in the primary location. Geo-replication can incur additional costs. For test and development accounts, you generally don't want to pay for geo-replication. For more information, see [How To Manage Storage Accounts](/en-us/documentation/articles/storage-manage-storage-account/).

5. Click **Create Storage Account**. 

	![New storage account](./media/websites-dotnet-webjobs-sdk-get-started/newstorage.png)	


## <a id="download"></a>Download the application
 
1. Download and unzip the [completed solution][download].

2. Start Visual Studio.

3. From the **File** menu choose **Open** > **Project/Solution**, navigate to where you downloaded the solution, and then open the solution file.

3. Press CTRL+SHIFT+B to build the solution.

	By default, Visual Studio automatically restores the NuGet package content, which was not included in the *.zip* file. If the packages don't restore, install them manually by going to the **Manage NuGet Packages for Solution** dialog and clicking the **Restore** button at the top right. 

3. In **Solution Explorer**, make sure that **ContosoAdsWeb** is selected as the startup project.

## <a id="configurestorage"></a>Configure the application to use your storage account

2. Open the application *Web.config* file in the ContosoAdsWeb project.
 
	The file contains a SQL connection string and an Azure storage connection string for working with blobs and queues. 

	<pre class="prettyprint">&lt;connectionStrings&gt;
	  &lt;add name="ContosoAdsContext" connectionString="Data Source=(localdb)\v11.0; Initial Catalog=ContosoAds; Integrated Security=True; MultipleActiveResultSets=True;" providerName="System.Data.SqlClient" /&gt;
	  &lt;add name="AzureJobsStorage" connectionString="DefaultEndpointsProtocol=https;AccountName=<mark>[accountname]</mark>;AccountKey=<mark>[accesskey]</mark>"/&gt;
	&lt;/connectionStrings&gt;</pre>

	The SQL connection string points to a [SQL Server Express LocalDB](http://msdn.microsoft.com/en-us/library/hh510202.aspx) database.
 
	The storage connection string has placeholders where you'll insert your storage account name and access key in the following steps.

	The storage connection string is named AzureJobsStorage because that is the name the WebJobs SDK uses by default. The same name is used here so you only have to set one connection string value in the Azure environment.
 
2. In the [Azure Management Portal](http://manage.windowsazure.com/), select your storage account and click **Manage Access Keys** at the bottom of the page.

	![Manage Access Keys button](./media/websites-dotnet-webjobs-sdk-get-started/mak.png)	

	![Manage Access Keys dialog](./media/websites-dotnet-webjobs-sdk-get-started/cpak.png)	

3. Replace *[accountname]* in the connection string with the value in the **Storage Account Name** box.

3. Replace *[accesskey]* in the connection string with the value in the **Primary Access Key** box.

4. Open the *App.config* file in the ContosoAdsWebJob project.

	This file has two storage connection strings, one for application data and one for logging. For this tutorial you'll use the same account for both. The connection strings have the same placeholders that you saw earlier.
  	<pre class="prettyprint">&lt;configuration&gt;
    &lt;connectionStrings&gt;
        &lt;add name="AzureJobsDashboard" connectionString="DefaultEndpointsProtocol=https;AccountName=<mark>[accountname]</mark>;AccountKey=<mark>[accesskey]</mark>"/&gt;
        &lt;add name="AzureJobsStorage" connectionString="DefaultEndpointsProtocol=https;AccountName=<mark>[accountname]</mark>;AccountKey=<mark>[accesskey]</mark>"/&gt;
        &lt;add name="ContosoAdsContext" connectionString="Data Source=(localdb)\v11.0; Initial Catalog=ContosoAds; Integrated Security=True; MultipleActiveResultSets=True;"/&gt;
    &lt;/connectionStrings&gt;
        &lt;startup&gt; 
            &lt;supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5" /&gt;
    &lt;/startup&gt;
&lt;/configuration&gt;</pre>

	By default, the WebJobs SDK looks for connection strings named AzureJobsStorage and AzureJobsDashboard. As an alternative, you can store the connection string however you want and pass it in explicitly to the `JobHost` object.

1. Replace all occurrences of *[accountname]* and *[accesskey]* with the values for your storage account, as you did for the web project. (Or you can copy the completed connection string from the *Web.config* file into both *App.config* file connection strings.)

5. Save your changes.

## <a id="run"></a>Run the application locally

1. To start the web frontend of the application, press CTRL+F5. 

	The default browser opens to the home page. (The web project runs because you've made it the startup project.)

	![Contoso Ads home page](./media/websites-dotnet-webjobs-sdk-get-started/home.png)

2. To start the WebJob backend of the application, right-click the ContosoAdsWebJob project in **Solution Explorer**, and then click **Debug** > **Start new instance**.

	A console application window opens and starts to slowly display a string of periods to show that it is running.

	![Console application window showing that the backend is running](./media/websites-dotnet-webjobs-sdk-get-started/backendrunning.png)

2. In your browser, click  **Create an Ad**.

2. Enter some test data and select an image to upload, and then click **Create**.

	![Create page](./media/websites-dotnet-webjobs-sdk-get-started/create.png)

	The app goes to the Index page, but it doesn't show a thumbnail for the new ad because that processing hasn't happened yet.

	Meanwhile, logging messages in the console application window show that a queue message was received and has been processed.   

	![Console application window showing that a queue message has been processed](./media/websites-dotnet-webjobs-sdk-get-started/backendlogs.png)

3. After you see the logging messages in the console application window, refresh the Index page to see the thumbnail.

	![Index page](./media/websites-dotnet-webjobs-sdk-get-started/list.png)

4. Click **Details** for your ad to see the full-size image.

	![Details page](./media/websites-dotnet-webjobs-sdk-get-started/details.png)

You've been running the application on your local computer, and it's using a SQL Server database located on your computer, but it's working with queues and blobs in the cloud. In the following section you'll run the application in the cloud, using a cloud database as well as cloud blobs and queues.  

## <a id="runincloud"></a>Run the application in the cloud

You'll do the following steps to run the application in the cloud:

* Deploy to an Azure Website. Visual Studio will automatically create a new Azure Website and SQL Database instance.
* Configure the website to use your Azure SQL database and storage account.

After you've created some ads while running in the cloud, you'll view the WebJobs SDK dashboard to see the rich monitoring features it has to offer.

### Deploy to an Azure Website

1. Close the browser and the console application window.

3. In **Solution Explorer**, right-click the ContosoAdsWeb project, and then click **Publish**.

3. In the **Profile** step of the **Publish Web** wizard, click **Microsoft Azure Websites**.

	![Select Azure Website publish target](./media/websites-dotnet-webjobs-sdk-get-started/pubweb.png)	

2. In the **Select Existing Website** box, click **Sign In**.
 
	![Click Sign In](./media/websites-dotnet-webjobs-sdk-get-started/signin.png)	

5. Click New.

	![Click New](./media/websites-dotnet-webjobs-sdk-get-started/clicknew.png)

9. In the **Create site on Microsoft Azure** dialog box, enter a unique name in the **Site name** box.

	The complete URL will consist of what you enter here plus .azurewebsites.net (as shown next to the **Site name** text box). For example, if the site name is ContosoAds, the URL will be ContosoAds.azurewebsites.net.

9. In the **Region** drop-down list choose the region closest to you.

	This setting specifies which Azure datacenter your web site will run in. Choose the same region you chose for your storage account.

9. In the **Database server** drop-down list choose **Create new server**.

	Alternatively, if your subscription already has a server, you can select that server from the drop-down list.

1. Enter an administrator **Database username** and **Database password**. 

	If you selected **New SQL Database server** you aren't entering an existing name and password here, you're entering a new name and password that you're defining now to use later when you access the database. If you selected a server that you created previously, you'll be prompted for the password to the administrative user account you already created.

1. Click **Create**.

	![Create site on Microsoft Azure dialog](./media/websites-dotnet-webjobs-sdk-get-started/newdb.png)	

	Visual Studio creates the solution, the web project, the Azure Website, and the Azure SQL Database instance.

2. In the **Connection** step of the **Publish Web** wizard, click **Next**.

	![Connection step](./media/websites-dotnet-webjobs-sdk-get-started/connstep.png)	

3. In the **Settings** step, click Next.

	![Settings step](./media/websites-dotnet-webjobs-sdk-get-started/settingsstep.png)	

	You can ignore the warnings on this page. 

	* Normally the storage account you use when running in Azure would be different from the one you use when running locally, but for this tutorial you're using the same one in both environments. So the AzureJobsStorage connection string does not need to be transformed. Even if you did want to use a different storage account in the cloud, you wouldn't need to transform the connection string because the app will use an Azure environment setting when it runs in Azure. You'll see this later in the tutorial.

	* For this tutorial you aren't going to be making changes to the data model used for the ContosoAdsContext database, so there is no need to use Entity Framework Code First Migrations for deployment. Code First will automatically create a new database the first time the app tries to access SQL data.

4. In the **Preview** step, click **Start Preview**.

	![Click Start Preview](./media/websites-dotnet-webjobs-sdk-get-started/previewstep.png)	

	You can ignore the warning about no databases being published. Entity Framework Code First will create the database; it doesn't need to be published.

	the preview window shows that binaries and configuration files from the WebJob project will be copied to the *app_data\jobs\continuous* folder of the website.

	![WebJobs files in preview window](./media/websites-dotnet-webjobs-sdk-get-started/previewwjfiles.png)	

5. Click **Publish**.

	Visual Studio deploys the application and opens the home page URL in the browser. 

	The browser opens to an error page because you haven't configured the connection strings in Azure yet. (The storage connection strings are OK because they aren't changing but the app is trying to access the LocalDB database, and that doesn't work in Azure.)

### Configure the website to use your Azure SQL database and storage account.

It's a security best practice to [avoid putting sensitive information such as connection strings in files that are stored in source code repositories](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/source-control#secrets). Azure provides a way to do that: you can set connection string and other setting values in the Azure environment, and ASP.NET configuration APIs automatically pick up those values when the app runs in Azure. In this section you'll set connection string values in Azure.

7. In your browser, go to the Azure management portal, and select the website that you deployed the Contoso Ads application to.

8. Click the **Configure** tab, and then scroll down to the **Connection strings** section.

9. Change the name of the DefaultConnection connection string to ContosoAdsContext.

	Azure automatically created this connection string when you created the site with an associated database, so it already has the right connection string value. You're just changing the name to what your code is looking for.

9. Add two new connection strings, named AzureJobsStorage and AzureJobsDashboard. Set type to Custom, and set the connection string value to the same value that you used earlier for the *Web.config* and *App.config* files. (Make sure you include the entire connection string, not just the access key, and don't include the quotation marks.)

	These connection strings are used by the WebJobs SDK, one for application data and one for logging. As you saw earlier, the one for application data is also used by the web frontend code.
	
9. Click **Save**.

	![Connection strings in management portal](./media/websites-dotnet-webjobs-sdk-get-started/azconnstr.png)	
 
9. Refresh the browser window that is showing the error page.

	The home page appears. You can now test the app by creating, viewing, and editing ads, as you did when you ran the application locally.

### View the WebJobs SDK dashboard

1. In the Azure management portal, select your website.

2. Click the **WebJobs** tab.

3. click the URL in the Logs column for your WebJob.

	![WebJobs tab](./media/websites-dotnet-webjobs-sdk-get-started/wjtab.png)	

	A new browser tab opens to the WebJobs SDK dashboard. The dashboard shows that the WebJob is running and shows a list of functions in your code that the WebJobs SDK triggered.

4. Click one of the functions to see details about its execution 
 
	![WebJobs SDK dashboard](./media/websites-dotnet-webjobs-sdk-get-started/wjdashboardhome.png)	

	![WebJobs SDK dashboard](./media/websites-dotnet-webjobs-sdk-get-started/wjfunctiondetails.png)	

	The **Replay Function** button on this page causes the WebJobs SDK framework to call the function again, and it gives you a chance to change the data passed to the function first.

>[WACOM.NOTE] When you're finished testing, delete the website and the SQL Database instance. The website is free, but the SQL Database instance and storage account accrue charges (minimal due to small size). Also, if you leave the site running, anyone who finds your URL can create and view ads. In the Azure management portal, go to the **Dashboard** tab for your website, and then click the **Delete** button at the bottom of the page. You can then select a check box to delete the SQL Database instance at the same time. If you just want to temporarily prevent others from accessing the site, click **Stop** instead. In that case, charges will continue to accrue for the SQL Database and Storage account. You can follow a similar procedure to delete the SQL database and storage account when you no longer need them.

## <a id="create"></a>Create the application from scratch 

In this section you'll do the following tasks:

* Create a Visual Studio solution with a web project.
* Add a class library project for the data access layer that is shared between frontend and backend.
* Add a Console Application project for the backend, with WebJobs deployment enabled.
* Add NuGet packages.
* Set project references.
* Copy application code and configuration files from the downloaded application that you worked with in the previous section of the tutorial.
* Review the parts of the code that work with Azure blobs and queues and the WebJobs SDK.
 
### Create a Visual Studio solution with a web project and class library project

1. In Visual Studio, choose **New** > **Project** from the **File** menu.

2. In the **New Project** dialog, choose **Visual C#** > **Web** > **ASP.NET Web Application**.

3. Name the project ContosoAdsWeb, name the solution ContosoAdsWebJobsSDK (change the solution name if you're putting it in the same folder as the downloaded solution), and then click **OK**.

	![New Project](./media/websites-dotnet-webjobs-sdk-get-started/newproject.png)	

5. In the **New ASP.NET Project** dialog, choose the MVC template, and clear the **Host in the cloud** check box under **Microsoft Azure**.

	Selecting **Host in the cloud** enables Visual Studio to automatically create a new Azure Website and SQL Database. Since you already created these earlier, you don't need to do so now while creating the project. If you want to create a new one, select the check box. You can then configure the new website and SQL database the same way you did earlier when you were deploying the application.

5. Click **Change Authentication**.

	![Change Authentication](./media/websites-dotnet-webjobs-sdk-get-started/chgauth.png)	

7. In the **Change Authentication** dialog, choose **No Authentication**, and then click **OK**.

	![No Authentication](./media/websites-dotnet-webjobs-sdk-get-started/noauth.png)	

8. In the **New ASP.NET Project** dialog, click **OK**. 

	Visual Studio creates the solution and the web project.

9. In **Solution Explorer**, right-click the solution (not the project), and choose **Add** > **New Project**.

11. In the **Add New Project** dialog, choose **Visual C#** > **Windows Desktop** > **Class Library** template.  

10. Name the project *ContosoAdsCommon*, and then click **OK**.

	This project will contain the Entity Framework context and the data model which both the frontend and backend will use. As an alternative you could define the EF-related classes in the web project and reference that project from the WebJob project. But then your WebJob project would have a reference to web assemblies which it doesn't need.

### Add a Console Application project that has WebJobs deployment enabled

11. Right-click the web project (not the solution or the class library project), and then click **Add** > **New Azure WebJob Project**.

	![New Azure WebJob Project menu selection](./media/websites-dotnet-webjobs-sdk-get-started/newawjp.png)	

1. In the **Add Azure WebJob** dialog, enter ContosoAdsWebJob as both the **Project name** and the **WebJob name**. Leave **WebJob run mode** set to **Run Continuously**.

2.  Click **OK**.
  
	Visual Studio creates a Console application that is configured to deploy as a WebJob whenever you deploy the web project. To do that it performed the following tasks after creating the project:

	* Added a *webjob-publish-settings.json* file in the WebJob project Properties folder.
	* Added a *webjobs-list.json* file in the web project Properties folder.
	* Installed the Microsoft.Web.WebJobs.Publish NuGet package in the WebJob project.
	 
	For more information about these changes, see [How to Deploy WebJobs by using Visual Studio](/en-us/documentation/articles/websites-dotnet-deploy-webjobs/).

### Add NuGet packages

First, install the WebJobs SDK in the WebJob project.

11. Open the **Manage NuGet Packages** dialog for the solution.

12. In the left pane, select **Online**.
   
17. Change **Stable Only** to **Include Prerelease**.

19. Find the *Microsoft.Azure.Jobs* NuGet package, and install it in the ContosoAdsWebJob project.

	![Install SCL](./media/websites-dotnet-webjobs-sdk-get-started/updstg.png)	

	![Install SCL only in web and WebJob projects](./media/websites-dotnet-webjobs-sdk-get-started/updstg2.png)	

	This also installs dependent packages, including another WebJobs SDK package, *Microsoft.Jobs.Core*. (You use the other WebJobs SDK package separately only when you create your user functions in a separate DLL; for this tutorial you are writing all of your code in Console Application.)You'll need the Azure Storage Client Library (SCL) to work with queues and blobs in the web project and the WebJob project. 

The Azure Storage Client Library (SCL) NuGet package is installed automatically in the WebJob project as a dependency of the WebJobs SDK. But you also need to use it to work with blobs and queues in the web project.

12. In the left pane, select **Installed packages**.
   
13. Find the *Azure Storage* package, and then click **Manage**.

13. In the **Select Projects** box, select the **ContosoAdsWeb** check box, and then click **OK**. 

All three projects use the Entity Framework to work with data in SQL Database.

12. In the left pane, select **Online**.
   
16. Find the *EntityFramework* NuGet package, and install it in all three projects.


### Set project references

Both web and WebJob projects will work with the SQL database, so both need a reference to the ContosoAdsCommon project.

10. In the ContosoAdsWeb project, set a reference to the ContosoAdsCommon project. (Right-click the ContosoAdsWeb project, and then click **Add** > **Reference**. In the **Reference Manager** dialog box, select **Solution** > **Projects** > **ContosoAdsCommon**, and then click **OK**.)

11. In the ContosoAdsWebJob project, set a reference to the ContosAdsCommon project.

The WebJob project needs references for working with images and for accessing connection strings.

11. In the ContosoAdsWebJob project, set a reference to `System.Drawing` and `System.Configuration`.

### Add code and configuration files

In this section you copy files from the downloaded solution into the new solution. The following sections will show and explain key parts of the code.

(This tutorial does not explain how to [create MVC controllers and views using scaffolding](http://www.asp.net/mvc/tutorials/mvc-5/introduction/getting-started), how to [write Entity Framework code that works with SQL Server databases](http://www.asp.net/mvc/tutorials/getting-started-with-ef-using-mvc), or [the basics of asynchronous programming in ASP.NET 4.5](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/web-development-best-practices#async).) 

To add files to a project or a folder, right-click the project or folder and click **Add** > **Existing Item**. Select the files you want and click **Add**. If asked whether you want to replace existing files, click **Yes**.

3. In the ContosoAdsCommon project, delete the *Class1.cs* file and add in its place the following files from the downloaded project.

	- *Ad.cs*
	- *ContosoAdscontext.cs*
	- *BlobInformation.cs*<br/><br/>

3. In the ContosoAdsWeb project, add the following files from the downloaded project.

	- *Web.config*
	- *Global.asax.cs*  
	- In the *Controllers* folder: *AdController.cs* 
	- In the *Views\Shared* folder: <em>_Layout.cshtml</em> file. 
	- In the *Views\Home* folder: *Index.cshtml*. 
	- In the *Views\Ad* folder (create the folder first): five *.cshtml* files.<br/><br/>

3. In the ContosoAdsWebJob project, add the following files from the downloaded project.

	- *App.config* (change the file type filter to **All Files**)
	- *Program.cs*

You can now build, run, and deploy the application as instructed earlier in the tutorial.

## <a id="code"></a>Review the application code

The following sections explain the code related to working with the WebJobs SDK and Azure Storage blobs and queues. For the code specific to the WebJobs SDK, see the [Program.cs section](#programcs).

### ContosoAdsCommon - Ad.cs

The Ad.cs file defines an enum for ad categories and a POCO entity class for ad information.

		public enum Category
		{
		    Cars,
		    [Display(Name="Real Estate")]
		    RealEstate,
		    [Display(Name = "Free Stuff")]
		    FreeStuff
		}

		public class Ad
		{
		    public int AdId { get; set; }

		    [StringLength(100)]
		    public string Title { get; set; }

		    public int Price { get; set; }

		    [StringLength(1000)]
		    [DataType(DataType.MultilineText)]
		    public string Description { get; set; }

		    [StringLength(1000)]
		    [DisplayName("Full-size Image")]
		    public string ImageURL { get; set; }

		    [StringLength(1000)]
		    [DisplayName("Thumbnail")]
		    public string ThumbnailURL { get; set; }

		    [DataType(DataType.Date)]
		    [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
		    public DateTime PostedDate { get; set; }

		    public Category? Category { get; set; }
		    [StringLength(12)]
		    public string Phone { get; set; }
		}

### ContosoAdsCommon - ContosoAdsContext.cs

The ContosoAdsContext class specifies that the Ad class is used in a DbSet collection, which Entity Framework will store in a SQL database.

		public class ContosoAdsContext : DbContext
		{
		    public ContosoAdsContext() : base("name=ContosoAdsContext")
		    {
		    }
		    public ContosoAdsContext(string connString)
		        : base(connString)
		    {
		    }
		    public System.Data.Entity.DbSet<Ad> Ads { get; set; }
		}
 
The class has two constructors. The first of them is used by the web project, and specifies the name of a connection string that is stored in the Web.config file or the Azure runtime environment. The second constructor enables you to pass in the actual connection string. That is needed by the WebJob project, since it doesn't have a Web.config file. You saw earlier where this connection string was stored, and you'll see later how the code retrieves the connection string when it instantiates the DbContext class.

### ContosoAdsCommon - BlobInformation.cs

The `BlobInformation` class is used to store information about an image blob in a queue message.

		public class BlobInformation
		{
		    public Uri BlobUri { get; set; }
		    
		    public string BlobName
		    {
		        get
		        {
		            return BlobUri.Segments[BlobUri.Segments.Length - 1];
		        }
		    }
		    public string BlobNameWithoutExtension
		    {
		        get
		        {
		            return Path.GetFileNameWithoutExtension(BlobName);
		        }
		    }
		    public int AdId { get; set; }
		}


### ContosoAdsWeb - Global.asax.cs

Code that is called from the `Application_Start` method creates an *images* blob container and an *images* queue if they don't already exist. This ensures that whenever you start using a new storage account, the required blob container and queue will be created automatically.

The code gets access to the storage account by using the storage connection string from the *Web.config* file or Azure runtime environment.

		var storageAccount = CloudStorageAccount.Parse
		    (ConfigurationManager.ConnectionStrings["AzureJobsStorage"].ToString());

Then it gets a reference to the *images* blob container, creates the container if it doesn't already exist, and sets access permissions on the new container. By default new containers only allow clients with storage account credentials to access blobs. The website needs the blobs to be public so that it can display images using URLs that point to the image blobs.

		var blobClient = storageAccount.CreateCloudBlobClient();
		var imagesBlobContainer = blobClient.GetContainerReference("images");
		if (imagesBlobContainer.CreateIfNotExists())
		{
		    imagesBlobContainer.SetPermissions(
		        new BlobContainerPermissions
		        {
		            PublicAccess = BlobContainerPublicAccessType.Blob
		        });
		}

Similar code gets a reference to the *blobnamerequest* queue and creates a new queue. In this case no permissions change is needed. The [ResolveBlobName](#resolveblobname) section later in the tutorial explains why the queue that the web application writes to is used just for getting blob names and not for generating thumbnails.

		CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
		var imagesQueue = queueClient.GetQueueReference("blobnamerequest");
		imagesQueue.CreateIfNotExists();

### ContosoAdsWeb - _Layout.cshtml

The *_Layout.cshtml* file sets the app name in the header and footer, and creates an "Ads" menu entry.

### ContosoAdsWeb - Views\Home\Index.cshtml

The *Views\Home\Index.cshtml* file displays category links on the home page. The links pass the integer value of the `Category` enum in a querystring variable to the Ads Index page.
	
		<li>@Html.ActionLink("Cars", "Index", "Ad", new { category = (int)Category.Cars }, null)</li>
		<li>@Html.ActionLink("Real estate", "Index", "Ad", new { category = (int)Category.RealEstate }, null)</li>
		<li>@Html.ActionLink("Free stuff", "Index", "Ad", new { category = (int)Category.FreeStuff }, null)</li>
		<li>@Html.ActionLink("All", "Index", "Ad", null, null)</li>

### ContosoAdsWeb - AdController.cs

In the *AdController.cs* file the constructor calls the `InitializeStorage` method to create Azure Storage Client Library objects that provide an API for working with blobs and queues. 

Then the code gets a reference to the *images* blob container as you saw earlier in *Global.asax.cs*. While doing that it sets a default [retry policy](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/transient-fault-handling) appropriate for a web app. The default exponential backoff retry policy could hang the web app for longer than a minute on repeated retries for a transient fault. The retry policy specified here waits 3 seconds after each try for up to 3 tries.

		var blobClient = storageAccount.CreateCloudBlobClient();
		blobClient.DefaultRequestOptions.RetryPolicy = new LinearRetry(TimeSpan.FromSeconds(3), 3);
		imagesBlobContainer = blobClient.GetContainerReference("images");

Similar code gets a reference to the *images* queue.

		CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
		queueClient.DefaultRequestOptions.RetryPolicy = new LinearRetry(TimeSpan.FromSeconds(3), 3);
		imagesQueue = queueClient.GetQueueReference("blobnamerequest");

Most of the controller code is typical for working with an Entity Framework data model using a DbContext class. An exception is the HttpPost `Create` method, which uploads a file and saves it in blob storage. The model binder provides an [HttpPostedFileBase](http://msdn.microsoft.com/en-us/library/system.web.httppostedfilebase.aspx) object to the method.

		[HttpPost]
		[ValidateAntiForgeryToken]
		public async Task<ActionResult> Create(
		    [Bind(Include = "Title,Price,Description,Category,Phone")] Ad ad,
		    HttpPostedFileBase imageFile)

If the user selected a file to upload, the code uploads the file, saves it in a blob, and updates the Ad database record with a URL that points to the blob.

		if (imageFile != null && imageFile.ContentLength != 0)
		{
		    blob = await UploadAndSaveBlobAsync(imageFile);
		    ad.ImageURL = blob.Uri.ToString();
		}

The code that does the upload is in the `UploadAndSaveBlobAsync` method. It creates a GUID name for the blob, uploads and saves the file, and returns a reference to the saved blob.

		private async Task<CloudBlockBlob> UploadAndSaveBlobAsync(HttpPostedFileBase imageFile)
		{
		    string blobName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
		    CloudBlockBlob imageBlob = imagesBlobContainer.GetBlockBlobReference(blobName);
		    using (var fileStream = imageFile.InputStream)
		    {
		        await imageBlob.UploadFromStreamAsync(fileStream);
		    }
		    return imageBlob;
		}

After the HttpPost `Create` method uploads a blob and updates the database, it creates a queue message to inform the back-end process that an image is ready for conversion to a thumbnail.

		BlobInformation blobInfo = new BlobInformation() { AdId = ad.AdId, BlobUri = new Uri(ad.ImageURL) };
		var queueMessage = new CloudQueueMessage(JsonConvert.SerializeObject(blobInfo));
		await thumbnailRequestQueue.AddMessageAsync(queueMessage);

The code for the HttpPost `Edit` method is similar except that if the user selects a new image file any blobs that already exist for this ad must be deleted.
 
		if (imageFile != null && imageFile.ContentLength != 0)
		{
		    await DeleteAdBlobsAsync(ad);
		    imageBlob = await UploadAndSaveBlobAsync(imageFile);
		    ad.ImageURL = imageBlob.Uri.ToString();
		}

Here is the DeleteAdBlobsAsync method:

		private async Task DeleteAdBlobsAsync(Ad ad)
		{
		    if (!string.IsNullOrWhiteSpace(ad.ImageURL))
		    {
		        CloudBlockBlob blobToDelete = imagesBlobContainer.GetBlockBlobReference(ad.ImageURL);
		        await blobToDelete.DeleteAsync();
		    }
		    if (!string.IsNullOrWhiteSpace(ad.ThumbnailURL))
		    {
		        CloudBlockBlob blobToDelete = imagesBlobContainer.GetBlockBlobReference(ad.ThumbnailURL);
		        await blobToDelete.DeleteAsync();
		    }
		}
 
### ContosoAdsWeb - Views\Ad\Index.cshtml and Details.cshtml

The *Index.cshtml* file displays thumbnails with the other ad data:

		<img  src="@Html.Raw(item.ThumbnailURL)" />

The *Details.cshtml* file displays the full-size image:

		<img src="@Html.Raw(Model.ImageURL)" />

### ContosoAdsWeb - Views\Ad\Create.cshtml and Edit.cshtml

The *Create.cshtml* and *Edit.cshtml* files specify form encoding that enables the controller to get the `HttpPostedFileBase` object.

		@using (Html.BeginForm("Create", "Ad", FormMethod.Post, new { enctype = "multipart/form-data" }))

An `<input>` element tells the browser to provide a file selection dialog.

		<input type="file" name="imageFile" accept="image/*" class="form-control fileupload" />

### <a id="programcs"></a>ContosoAdsWebJob - Program.cs - Main and Initialize methods

When the WebJob starts, the `Main` method calls `Initialize` to instantiate the Entity Framework database context. Then it calls the  WebJobs SDK `JobHost.RunAndBlock` method to begin single-threaded execution of triggered functions on the current thread.

		static void Main(string[] args)
		{
		    Initialize();
		
		    JobHost host = new JobHost();
		    host.RunAndBlock();
		}
		
		private static void Initialize()
		{
		    db = new ContosoAdsContext();
		}

### <a id="generatethumbnail"></a>ContosoAdsWebJob - Program.cs - GenerateThumbnail method

The WebJobs SDK calls this method when a queue message is received. The method creates a thumbnail and puts the thumbnail URL in the database.

		public static void GenerateThumbnail(
		[QueueTrigger("thumbnailrequest")] BlobInformation blobInfo,
		[Blob("images/{BlobName}")] Stream input,
		[Blob("images/{BlobNameWithoutExtension}_thumbnail.jpg")] CloudBlockBlob outputBlob)
		{
		    using (Stream output = outputBlob.OpenWrite())
		    {
		        ConvertImageToThumbnailJPG(input, output);
		        outputBlob.Properties.ContentType = "image/jpeg";
		    }
		
		    var id = blobInfo.AdId;
		    Ad ad = db.Ads.Find(id);
		    if (ad == null)
		    {
		        throw new Exception(String.Format("AdId {0} not found, can't create thumbnail", id.ToString()));
		    }
		    ad.ThumbnailURL = outputBlob.Uri.ToString();
		    db.SaveChanges();
		}

* The `QueueTrigger` attribute directs the WebJobs SDK to call this method when a new message is received on the thumbnailrequest queue.

		[QueueTrigger("thumbnailrequest")] BlobInformation blobInfo,

	The `BlobInformation` object in the queue message is automatically deserialized into the `blobInfo` parameter. When the method completes, the queue message is deleted. If the method fails before completing, the queue message is not deleted; after a 10-minute lease expires, the message is released to be picked up again and processed. In the current beta release of the WebJobs SDK this sequence could be repeated indefinitely if a message always causes an exception.  The next release will handle poison messages: after 5 unsuccessful attempts to process a message, the message is moved to a queue named {queuename}-poison.  The maximum number of attempts will be configurable. 

* The two `Blob` attributes provide objects that are bound to blobs: one to the existing image blob and one to a new thumbnail blob that the method creates. 

		[Blob("images/{BlobName}")] Stream input,
		[Blob("images/{BlobNameWithoutExtension}_thumbnail.jpg")] CloudBlockBlob outputBlob)

	Blob names come from properties of the `BlobInformation` object received in the queue message (`BlobName` and `BlobNameWithoutExtension`). To get the full functionality of the Storage Client Library you can use the `CloudBlockBlob` class to work with blobs. If you want to reuse code that was written to work with `Stream` objects, you can use the `Stream` class. 

>[WACOM.NOTE] 
>* If your website runs on multiple VMs, this program will run on each machine, and each machine will wait for triggers and attempt to run functions. In some scenarios this can lead to some functions processing the same data twice, so functions should be idempotent (written so that calling them repeatedly with the same input data doesn't produce duplicate results).
>* For information about how to implement graceful shutdown, see [the WebJobs SDK 0.3.0 beta announcement](http://azure.microsoft.com/blog/2014/06/18/announcing-the-0-3-0-beta-preview-of-microsoft-azure-webjobs-sdk/http://azure.microsoft.com/blog/2014/06/18/announcing-the-0-3-0-beta-preview-of-microsoft-azure-webjobs-sdk/).   
>* The code in the `ConvertImageToThumbnailJPG` method (not shown) uses classes in the `System.Drawing` namespace for simplicity. However, the classes in this namespace were designed for use with Windows Forms. They are not supported for use in a Windows or ASP.NET service.

### WebJobs versus Cloud Service Worker Role

If you compare the amount of code in the `GenerateThumbnails` method in this sample application with the worker role code in the [Cloud Service version of the application](/en-us/documentation/articles/cloud-services-dotnet-get-started/), you can see how much work the WebJobs SDK is doing for you. The advantage is greater than it appears, because the Cloud Service sample application code doesn't do all of the things (such as poison message handling) that you would do in a production application, and which the WebJobs SDK does for you.

The Cloud Service version of this sample application has a `ProcessQueueMessage` method that performs the following tasks:

* Get the database record ID from the queue message.
* Read the database to get the URL of the blob.
* Convert the image to a thumbnail, and save the thumbnail in a new blob.
* Update the database record by adding the thumbnail blob URL. 

In the Cloud Service version of the application, the record ID is the only information in the queue message, and the background process gets the image URL from the database. In the WebJobs SDK version of the application, the queue message includes the image URL so that it can be provided to the `Blob` attributes. If the queue message didn't have the blob URL, you would have to write code in the method to get the blob URL, and then you'd have to write code to bind objects to the input and output blobs instead of letting the WebJos SDK do that work for you.

## Next steps

In this tutorial you've seen a simple multi-tier application that uses the WebJobs SDK for backend processing. The application has intentionally been kept simple for a getting-started tutorial. For example, it doesn't implement [dependency injection](http://www.asp.net/mvc/tutorials/hands-on-labs/aspnet-mvc-4-dependency-injection) or the [repository and unit of work patterns](http://www.asp.net/mvc/tutorials/getting-started-with-ef-using-mvc/advanced-entity-framework-scenarios-for-an-mvc-web-application#repo), it doesn't [use an interface for logging](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/monitoring-and-telemetry#log), it doesn't use [EF Code First Migrations](http://www.asp.net/mvc/tutorials/getting-started-with-ef-using-mvc/migrations-and-deployment-with-the-entity-framework-in-an-asp-net-mvc-application) to manage data model changes or [EF Connection Resiliency](http://www.asp.net/mvc/tutorials/getting-started-with-ef-using-mvc/connection-resiliency-and-command-interception-with-the-entity-framework-in-an-asp-net-mvc-application) to manage transient network errors, and so forth.

For additional samples that show how to use the WebJobs SDK in other scenarios, see the [AzureWebJobs](http://aspnet.codeplex.com/SourceControl/latest#Samples/AzureWebJobs/ReadMe.txt) folder in the ASP.NET CodePlex project.

WebJobs run as part of a website, so you can troubleshoot by running in debug mode remotely as you can for websites.  For more information, see [Troubleshooting Azure Web Sites in Visual Studio](/en-us/documentation/articles/web-sites-dotnet-troubleshoot-visual-studio/). You have to attach to the WebJob process; see the Visual Studio 2012 instructions in the tutorial for information about how to attach to a process.

For more information, see the following resources:

* [Azure Web Jobs Recommended Resources](http://go.microsoft.com/fwlink/?LinkId=390226)
* [Azure Storage](/en-us/documentation/services/storage/)
* [How to use Blob Storage from .NET](/en-us/documentation/articles/storage-dotnet-how-to-use-blobs/)
* [How to use Queue Storage from .NET](/en-us/documentation/articles/storage-dotnet-how-to-use-queues/)
* [Microsoft Azure Storage – What's New, Best Practices and Patterns (Channel 9 Video)](http://channel9.msdn.com/Events/Build/2014/3-628)
