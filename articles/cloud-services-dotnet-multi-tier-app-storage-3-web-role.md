<properties linkid="develop-net-tutorials-multi-tier-web-site-3-web-role" pageTitle="Azure Cloud Service Tutorial: ASP.NET Web Role with Azure Storage Tables, Queues, and Blobs" metaKeywords="Azure tutorial, Azure storage tutorial, Azure multi-tier tutorial, ASP.NET MVC tutorial, Azure web role tutorial, Azure blobs tutorial, Azure tables tutorial, Azure queues tutorial" description="Learn how to create a multi-tier app using ASP.NET MVC and Azure. The app runs in a cloud service, with web role and worker roles, and uses Azure storage tables, queues, and blobs." metaCanonical="" services="cloud-services,storage" documentationCenter=".NET" title="Azure Cloud Service Tutorial: ASP.NET MVC Web Role, Worker Role, Azure Storage Tables, Queues, and Blobs" authors="tdykstra,riande" solutions="" manager="wpickett" editor="mollybos" />

# Building the web role for the Azure Email Service application - 3 of 5. 

This is the third tutorial in a series of five that show how to build and deploy the Azure Email Service sample application.  For information about the application and the tutorial series, see [the first tutorial in the series][firsttutorial].

In this tutorial you'll learn:

* How to create a solution that contains a Cloud Service project with a web role and a worker role. 
* How to work with Azure tables, blobs, and queues in MVC 4 controllers and views.
* How to handle concurrency conflicts when you are working with Azure tables.
* How to configure a web role or web project to use your Azure Storage account.

## Segments of this tutorial

- [Create the Visual Studio solution](#cloudproject)
- [Configure tracing](#tracing)
- [Add code to efficiently handle restarts.](#restarts)
- [Update the Storage Client Library NuGet Package](#updatescl)
- [Add a reference to an SCL 1.7 assembly](#addref2)
- [Add code to create tables, queue, and blob container in the Application_Start method](#createifnotexists)
- [Create and test the Mailing List](#mailinglist)
- [Configure the web role to use your test Azure Storage account](#configurestorage)
- [Create and test the Subscriber controller and views](#subscriber)
- [Create and test the Message controller and views](#message)
- [Create and test the Unsubscribe controller and view](#unsubscribe)
- [(Optional) Build the Alternative Architecture](#alternativearchitecture)
- [Next steps](#nextsteps)

  
<h2><a name="cloudproject"></a><span class="short-header">Create solution</span>Create the Visual Studio solution</h2>

You begin by creating a Visual Studio solution with a project for the web front-end and a project for one of the back-end Azure worker roles. You'll add the second worker role later. 

(If you want to run the web UI in an Azure Web Site instead of an Azure Cloud Service, see the [Alternative Architecture][alternativearchitecture] section later in this tutorial for changes to these instructions.)

### Create a cloud service project with a web role and a worker role

1. Start Visual Studio with elevated privileges.

	>[WACOM.NOTE] For Visual Studio 2013, you don't have to use elevated privileges, because new projects use the compute emulator express by default.
   
2. From the **File** menu select **New Project**.

	![New Project menu][mtas-file-new-project]

3. Expand **C#** and select **Cloud** under **Installed Templates**, and then select **Azure Cloud Service**.  

4. Name the application **AzureEmailService** and click **OK**.

	![New Project dialog box][mtas-new-cloud-project]

5. In the **New Azure Cloud Service** dialog box, select **ASP.NET Web Role** and click the arrow that points to the right.

	>[WACOM.NOTE] The downloaded code that you use for this tutorial is MVC 4 but you can't create an MVC 4 Web Role in Visual Studio 2013 using instructions written for Visual Studio 2012. For Visual Studio 2013 do the following: (1) Skip the steps here for creating the web role and do the step for the worker role. (2) After the worker role is created, right-click the solution in **Solution Explorer**, and click **Add** -- **New Project**. In the left pane of the **Add New Project** dialog expand **Web** and select **Visual Studio 2012**.  (3) Choose **ASP.NET MVC 4 Web Application**, name the project **MvcWebRole**, and then click **OK**. (4) In the **New ASP.NET Project** dialog box, select the **Internet Application** template. (5) Right-click **Roles** under **AzureEmailService** in **Solution Explorer**, and then click **Add** - **Web Role Project in Solution**. (6) In the **Associate with Role Project** box, select the **MvcWebRole** project, and then click **OK**.

	![New Azure Cloud Project dialog box][mtas-new-cloud-service-dialog]

6. In the column on the right, hover the pointer over **MvcWebRole1**, and then click the pencil icon to change the name of the web role. 

7. Enter MvcWebRole as the new name, and then press Enter.

	![New Azure Cloud Project dialog box - renaming the web role][mtas-new-cloud-service-dialog-rename]

8. Follow the same procedure to add a **Worker Role**, name it WorkerRoleA, and then click **OK**.

	![New Azure Cloud Project dialog box - adding a worker role][mtas-new-cloud-service-add-worker-a]

5. In the **New ASP.NET Project** dialog box, select the **Internet Application** template.

6. In the **View Engine** drop-down list make sure that **Razor** is selected, and then click **OK**.

	![New Project dialog box][mtas-new-mvc4-project]

### Set the page header, menu, and footer

In this section you update the headers, footers, and menu items that are shown on every page for the administrator web UI.  The application will have three sets of administrator web pages:  one for Mailing Lists, one for Subscribers to mailing lists, and one for Messages.

1. In **Solution Explorer**, expand the Views\Shared folder and open the &#95;Layout.cshtml file.

	![_Layout.cshtml in Solution Explorer][mtas-opening-layout-cshtml]

2. In the **&lt;title&gt;** element, change "My ASP.NET MVC Application" to "Azure Email Service".

3. In the **&lt;p&gt;** element with class "site-title", change "your logo here" to "Azure Email Service", and change "Home" to "MailingList".

	![title and header in _Layout.cshtml][mtas-title-and-logo-in-layout]

4. Delete the menu section:

	![menu in _Layout.cshtml][mtas-menu-in-layout]

4. Insert a new menu section where the old one was:

        <ul id="menu">
            <li>@Html.ActionLink("Mailing Lists", "Index", "MailingList")</li>
            <li>@Html.ActionLink("Messages", "Index", "Message")</li>
            <li>@Html.ActionLink("Subscribers", "Index", "Subscriber")</li>
        </ul>

4. In the **&lt;footer&gt;** element, change "My ASP.NET MVC Application" to "Azure Email Service".<br/>

	![footer in _Layout.cshtml][mtas-footer-in-layout]

### Run the application locally

1. Press CTRL+F5 to run the application.

	The application home page appears in the default browser.

	![home page][mtas-home-page-before-adding-controllers]

	The application runs in the Azure compute emulator.  You can see the compute emulator icon in the Windows system tray:

	![Compute emulator in system tray][mtas-compute-emulator-icon]


<h2><a name="tracing"></a><span class="short-header">Configure Tracing</span>Configure Tracing</h2>

To enable tracing data to be saved, open the *WebRole.cs* file and add the following `ConfigureDiagnostics` method. Add code that calls the new method in the `OnStart` method.

>[WACOM.NOTE] For Visual Studio 2013, in place of the following steps that manually change code in *WebRole.cs*, right-click the MvcWebRole project, click **Add Existing Item**, and add the *WebRole.cs* file from the downloaded project.

    private void ConfigureDiagnostics()
    {
        DiagnosticMonitorConfiguration config = DiagnosticMonitor.GetDefaultInitialConfiguration();
        config.Logs.BufferQuotaInMB = 500;
        config.Logs.ScheduledTransferLogLevelFilter = LogLevel.Verbose;
        config.Logs.ScheduledTransferPeriod = TimeSpan.FromMinutes(1d);

        DiagnosticMonitor.Start(
            "Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString",
            config);
    }

    public override bool OnStart()
    {
        ConfigureDiagnostics();
        return base.OnStart();
    }

The `ConfigureDiagnostics` method is explained in [the second tutorial][tut2].





<h2><a name="restarts"></a><span class="short-header">Restarts</span>Add code to efficiently handle restarts.</h2>

Azure Cloud Service applications  are restarted approximately twice per month for operating system updates. (For more information on OS updates, see [Role Instance Restarts Due to OS Upgrades](http://blogs.msdn.com/b/kwill/archive/2012/09/19/role-instance-restarts-due-to-os-upgrades.aspx).) When a web application is going to be shut down, an `OnStop` event is raised. The web role boiler plate created by Visual Studio does not override the `OnStop` method, so the application will have only a few seconds to finish processing HTTP requests before it is shut down. You can add code to override the `OnStop` method in order to ensure that shutdowns are handled gracefully.

To handle shutdowns and restarts, open the *WebRole.cs* file and add the following `OnStop` method override.

      public override void OnStop()
      {
          Trace.TraceInformation("OnStop called from WebRole");
          var rcCounter = new PerformanceCounter("ASP.NET", "Requests Current", "");
          while (rcCounter.NextValue() > 0)
          {
              Trace.TraceInformation("ASP.NET Requests Current = " + rcCounter.NextValue().ToString());
              System.Threading.Thread.Sleep(1000);
          }           
      }

This code requires an additional `using` statement:

      using System.Diagnostics;

The `OnStop` method has up to 5 minutes to exit before the application is shut down. You could add a sleep call for 5 minutes to the `OnStop` method to give your application the maximum amount of time to process the current requests, but if your application is scaled correctly, it should be able to process the remaining requests in much less than 5 minutes. It is best to stop as quickly as possible, so that the application can restart as quickly as possible and continue processing requests.

Once a role is taken off-line by Azure, the load balancer stops sending requests to the role instance, and after that the `OnStop` method is called. If you don't have another instance of your role, no requests will be processed  until your role completes shutting down and is restarted (which typically takes several minutes). That is one reason why the Azure service level agreement requires you to have at least two instances of each role in order to take advantage of the up-time guarantee.

In the code shown for the `OnStop` method, an ASP.NET performance counter is created for `Requests Current`. The `Requests Current` counter value contains the current number of requests, including those that are queued, currently executing, or waiting to be written to the client. The `Requests Current` value is checked every second, and once it falls to zero, the `OnStop` method returns. Once `OnStop` returns, the role shuts down.

Trace data is not saved when called from the `OnStop` method without performing an [On-Demand Transfer](http://msdn.microsoft.com/en-us/library/windowsazure/gg433075.aspx). You can view the `OnStop` trace information in real time with the  [dbgview](http://technet.microsoft.com/en-us/sysinternals/bb896647.aspx) utility from a remote desktop connection.

<h2><a name="updatescl"></a><span class="short-header">Update Storage Client Library</span>Update the Storage Client Library NuGet Package</h2>

>[WACOM.NOTE] This step may not be necessary. If the Azure Storage NuGet package does not show up in the Updates list, the installed version is current.

The API framework that you use to work with Azure Storage tables, queues, and blobs is the Storage Client Library (SCL). This API is included in a NuGet package in the Cloud Service project template. However, as of the date this tutorial is being written, the project templates include the 1.7 version of SCL, not the current 2.0 version. Therefore, before you begin writing code you'll update the NuGet package.

1. In the Visual Studio **Tools** menu, hover over **Library Package Manager**, and then click **Manage NuGet Packages for Solution**.

	![Manage NuGet Packages for Solution in menu][mtas-manage-nuget-for-solution]

2. In the left pane of the **Manage NuGet Packages** dialog box, select **Updates**, then scroll down to the **Azure Storage** package and click **Update**.

	![Azure Storage package in Manage NuGet Packages dialog box][mtas-update-storage-nuget-pkg]

3. In the **Select Projects** dialog box, make sure both projects are selected, and then click **OK**.

	![Selecting both projects in the Select Projects dialog box][mtas-nuget-select-projects]
 
4. Accept the license terms to complete installation of the package, and then close the **Manage NuGet Packages** dialog box.

5. In the WorkerRoleA project in *WorkerRole.cs*, if the following `using` statement is present, delete it because it is no longer needed:

		using Microsoft.WindowsAzure.StorageClient;


The 1.7 version of the SCL includes a LINQ provider that simplifies coding for table queries. As of the date this tutorial is being written, the 2.0 Table Service Layer (TSL) does not yet have a LINQ provider. If you want to use LINQ, you still have access to the SCL 1.7 LINQ provider in the [Microsoft.WindowsAzure.Storage.Table.DataServices](http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.storage.table.dataservices.aspx) namespace. The 2.0 TSL was designed to improve performance, and the 1.7 LINQ provider does not benefit from all of these improvements. The sample application uses the 2.0 TSL, so it does not use LINQ for queries. For more information about SCL and TSL 2.0, see the resources at the end of [the last tutorial in this series][tut5].

>[WACOM.NOTE] Storage Client Library 2.1 added back LINQ support, but this tutorial does not use LINQ for storage table queries. The current SCL also supports asynchronous programming, but async code is not shown in this tutorial. For more information about asynchronous programming and an example of code that uses it with the Azure SCL, see the following e-book chapter and the downloadable project that goes with it: [Use .NET 4.5’s async support to avoid blocking calls](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/web-development-best-practices#async).


<h2><a name="addref2"></a><span class="short-header">Add SCL 1.7 reference</span>Add a reference to an SCL 1.7 assembly</h2>

>[WACOM.NOTE] If you're using SCL 2.1 or later (Visual Studio 2013 with the latest SDK), skip this section.

Version 2.0 of the Storage Client Library (SCL) 2.0 does not have everything needed for diagnostics, so you have to add a reference to a 1.7 assembly.

4. Right-click the MvcWebRole project, and choose **Add Reference**.

5. Click the **Browse...** button at the bottom of the dialog box.

6. Navigate to the following folder:

        C:\Program Files\Microsoft SDKs\Windows Azure\.NET SDK\2012-10\ref

7. Select *Microsoft.WindowsAzure.StorageClient.dll*, and then click **Add**.

8. In the **Reference Manager** dialog box, click **OK**.

1. Repeat the process for the WorkerRoleA project.



<h2><a name="createifnotexists"></a><span class="short-header">App_Start Code</span>Add code to create tables, queue, and blob container in the Application_Start method</h2>

The web application will use the `MailingList` table, the `Message` table, the `azuremailsubscribequeue` queue, and the `azuremailblobcontainer` blob container. You could create these manually by using a tool such as Azure Storage Explorer, but then you would have to do that manually every time you started to use the application with a new storage account. In this section you'll add code that runs when the application starts, checks if the required tables, queues, and blob containers exist, and creates them if they don't. 

You could add this one-time startup code to the `OnStart` method in the *WebRole.cs* file, or to the *Global.asax* file. For this tutorial you'll initialize Azure Storage in the *Global.asax* file since that works with Azure Web Sites as well as Azure Cloud Service web roles.

1. In **Solution Explorer**, expand *Global.asax* and then open *Global.asax.cs*.

2. Add a new `CreateTablesQueuesBlobContainers` method after the `Application_Start` method, and then call the new method from the `Application_Start` method, as shown in the following example:

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();
            // Verify that all of the tables, queues, and blob containers used in this application
            // exist, and create any that don't already exist.
            CreateTablesQueuesBlobContainers();
        }

        private static void CreateTablesQueuesBlobContainers()
        {
            var storageAccount = CloudStorageAccount.Parse(RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));
            // If this is running in an Azure Web Site (not a Cloud Service) use the Web.config file:
            //    var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString);
            var tableClient = storageAccount.CreateCloudTableClient();
            var mailingListTable = tableClient.GetTableReference("MailingList");
            mailingListTable.CreateIfNotExists();
            var messageTable = tableClient.GetTableReference("Message");
            messageTable.CreateIfNotExists();
            var blobClient = storageAccount.CreateCloudBlobClient();
            var blobContainer = blobClient.GetContainerReference("azuremailblobcontainer");
            blobContainer.CreateIfNotExists();
            var queueClient = storageAccount.CreateCloudQueueClient();
            var subscribeQueue = queueClient.GetQueueReference("azuremailsubscribequeue");
            subscribeQueue.CreateIfNotExists();
        }
	
3. Right click on the blue squiggly line under `RoleEnvironment`, select **Resolve** then select **using Microsoft.WindowsAzure.ServiceRuntime**. 

	![rightClick][mtas-4]

1. Right click the blue squiggly line under `CloudStorageAccount`, select **Resolve**, and then select **using Microsoft.WindowsAzure.Storage**.  

1. Alternatively, you can manually add the following using statements:

	    using Microsoft.WindowsAzure.ServiceRuntime;
	    using Microsoft.WindowsAzure.Storage;
	
1. Build the application, which saves the file and verifies that you don't have any compile errors.

In the following sections you build the components of the web application, and you can test them with development storage or your storage account without having to manually create tables, queues, or blob container first.



<h2><a name="mailinglist"></a><span class="short-header">Mailing List</span>Create and test the Mailing List controller and views</h2>

The **Mailing List** web UI is used by administrators to create, edit and display mailing lists, such as "Contoso University History Department announcements" and "Fabrikam Engineering job postings".

### Add the MailingList entity class to the Models folder

The `MailingList` entity class is used for the rows in the `MailingList` table that contain information about the list, such as its description and the "From" email address for emails sent to the list.  

1. In **Solution Explorer**, right-click the `Models` folder in the MVC project, and choose **Add Existing Item**.

	![Add existing item to Models folder][mtas-add-existing-item-to-models]

2. Navigate to the folder where you downloaded the sample application, select the *MailingList.cs* file in the `Models` folder, and click **Add**.

3. Open *MailingList.cs* and examine the code.

	    public class MailingList : TableEntity
	    {
	        public MailingList()
	        {
	            this.RowKey = "mailinglist";
	        }
	
	        [Required]
	        [RegularExpression(@"[\w]+",
	         ErrorMessage = @"Only alphanumeric characters and underscore (_) are allowed.")]
	        [Display(Name = "List Name")]
	        public string ListName
	        {
	            get
	            {
	                return this.PartitionKey;
	            }
	            set
	            {
	                this.PartitionKey = value;
	            }
	        }
	
	        [Required]
	        [Display(Name = "'From' Email Address")]
	        public string FromEmailAddress { get; set; }
	
	        public string Description { get; set; }
	    }
			

	The Azure Storage TSL 2.0 API requires that the entity classes that you use for table operations derive from [TableEntity][]. This class defines `PartitionKey`, `RowKey`, `TimeStamp`, and `ETag` fields. The `TimeStamp` and `ETag` properties are used by the system. You'll see how the `ETag` property is used for concurrency handling later in the tutorial. 

	(There is also a [DynamicTableEntity] class for use when you want to work with table rows as Dictionary collections of key value pairs instead of by using predefined model classes. For more information, see [Azure Storage Client Library 2.0 Tables Deep Dive][deepdive].)

	The `mailinglist` table partition key is the list name. In this entity class the partition key value can be accessed either by using the `PartitionKey` property (defined in the `TableEntity` class) or the `ListName` property (defined in the `MailingList` class).  The `ListName` property uses `PartitionKey` as its backing variable. Defining the `ListName` property enables you to use a more descriptive variable name in code and makes it easier to program the web UI, since formatting and validation DataAnnotations attributes can be added to the `ListName` property, but they can't be added directly to the `PartitionKey` property.

	The `RegularExpression` attribute on the `ListName` property causes MVC to validate user input to ensure that the list name value entered only contains alphanumeric characters or underscores. This restriction was implemented in order to keep list names simple so that they can easily be used in query strings in URLs. 

	**Note:**  If you wanted the list name format to be less restrictive, you could allow other characters and URL-encode list names when they are used in query strings. However, certain characters are not allowed in Azure Table partition keys or row keys, and you would have to exclude at least those characters. For information about characters that are not allowed or cause problems in the partition key or row key fields, see [Understanding the Table Service Data Model][tabledatamodel] and [% Character in PartitionKey or RowKey][percentinkeyfields].

	The `MailingList` class defines a default constructor that sets `RowKey` to the hard-coded string "mailinglist", because all of the mailing list rows in this table have that value as their row key. (For an explanation of the table structure, see the [first tutorial in the series][firsttutorial].) Any constant value could have been chosen for this purpose, as long as it could never be the same as an email address, which is the row key for the subscriber rows in this table.

	The list name and the "from" email address must always be entered when a new `MailingList` entity is created, so they have `Required` attributes.

	The `Display` attributes specify the default caption to be used for a field in the MVC UI. 

### Add the MailingList MVC controller

1. In **Solution Explorer**, right-click the Controllers folder in the MVC project, and choose **Add Existing Item**.

	![Add existing item to Controllers folder][mtas-add-existing-item-to-controllers]

2. Navigate to the folder where you downloaded the sample application, select the *MailingListController.cs* file in the `Controllers` folder, and click **Add**.

3. Open *MailingListController.cs* and examine the code.

	The default constructor creates a `CloudTable` object to use for working with the `mailinglist` table.

	    public class MailingListController : Controller
	    {
	        private CloudTable mailingListTable;
	
	        public MailingListController()
	        {
	            var storageAccount = Microsoft.WindowsAzure.Storage.CloudStorageAccount.Parse(RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));
	            // If this is running in an Azure Web Site (not a Cloud Service) use the Web.config file:
	            //    var storageAccount = Microsoft.WindowsAzure.Storage.CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString);
	
	            var tableClient = storageAccount.CreateCloudTableClient();
	            mailingListTable = tableClient.GetTableReference("mailinglist");
	        }
		
	The code gets the credentials for your Azure Storage account from the Cloud Service project settings file in order to make a connection to the storage account. (You'll configure those settings later in this tutorial, before you test the controller.) If you are going to run the MVC project in an Azure Web Site, you can get the connection string from the Web.config file instead.

	Next is a `FindRow` method that is called whenever the controller needs to look up a specific mailing list entry of the `MailingList` table, for example to edit a mailing list entry. The code retrieves a single `MailingList` entity by using the partition key and row key values passed in to it. The rows that this controller edits are the ones that have "MailingList" as the row key, so "MailingList" could have been hard-coded for the row key, but specifying both partition key and row key is a pattern used for the `FindRow` methods in all of the controllers.

        private MailingList FindRow(string partitionKey, string rowKey)
        {
            var retrieveOperation = TableOperation.Retrieve<MailingList>(partitionKey, rowKey);
            var retrievedResult = mailingListTable.Execute(retrieveOperation);
            var mailingList = retrievedResult.Result as MailingList;
            if (mailingList == null)
            {
                throw new Exception("No mailing list found for: " + partitionKey);
            }

            return mailingList;
        }

	It's instructive to compare the `FindRow` method in the `MailingList` controller, which returns a mailing list row, with the `FindRow` method in the `Subscriber` controller, which returns a subscriber row from the same `mailinglist` table.

        private Subscriber FindRow(string partitionKey, string rowKey)
        {
            var retrieveOperation = TableOperation.Retrieve<Subscriber>(partitionKey, rowKey);
            var retrievedResult = mailingListTable.Execute(retrieveOperation);
            var subscriber = retrievedResult.Result as Subscriber;
            if (subscriber == null)
            {
                throw new Exception("No subscriber found for: " + partitionKey + ", " + rowKey);
            }
            return subscriber;
        }

	The only difference in the two queries is the model type that they pass to the [TableOperation.Retrieve](http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.storage.table.tableoperation.retrieve.aspx) method. The model type specifies the schema (the properties) of the row or rows that you expect the query to return. A single table may have different schemas in different rows. Typically you specify the same model type when reading a row that was used to create the row.
        
	The **Index** page displays all of the mailing list rows, so the query in the `Index` method returns all `MailingList` entities that have "mailinglist" as the row key (the other rows in the table have email address as the row key, and they contain subscriber information).

                var query = new TableQuery<MailingList>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, "mailinglist"));
                lists = mailingListTable.ExecuteQuery(query, reqOptions).ToList();

	The `Index` method surrounds this query with code that is designed to handle timeout conditions. 

        public ActionResult Index()
        {
            TableRequestOptions reqOptions = new TableRequestOptions()
            {
                MaximumExecutionTime = TimeSpan.FromSeconds(1.5),
                RetryPolicy = new LinearRetry(TimeSpan.FromSeconds(3), 3)
            };
            List<MailingList> lists;
            try
            {
                var query = new TableQuery<MailingList>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, "mailinglist"));
                lists = mailingListTable.ExecuteQuery(query, reqOptions).ToList();
            }
            catch (StorageException se)
            {
                ViewBag.errorMessage = "Timeout error, try again. ";
                Trace.TraceError(se.Message);
                return View("Error");
            }

            return View(lists);
        }

	If you don't specify timeout parameters, the API automatically retries three times with exponentially increasing timeout limits. For a web interface with a user waiting for a page to appear, this could result in unacceptably long wait times. Therefore, this code specifies linear retries (so the timeout limit doesn't increase each time) and a timeout limit that is reasonable for the user to wait. 

	When the user clicks the **Create** button on the **Create** page, the MVC model binder creates a `MailingList` entity from input entered in the view, and the `HttpPost Create` method adds the entity to the table.

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(MailingList mailingList)
        {
            if (ModelState.IsValid)
            {
                var insertOperation = TableOperation.Insert(mailingList);
                mailingListTable.Execute(insertOperation);
                return RedirectToAction("Index");
            }

            return View(mailingList);
        }

	For the **Edit** page, the `HttpGet Edit` method looks up the row, and the `HttpPost` method updates the row.

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(string partitionKey, string rowKey, MailingList editedMailingList)
        {
            if (ModelState.IsValid)
            {
                var mailingList = new MailingList();
                UpdateModel(mailingList);
                try
                {
                    var replaceOperation = TableOperation.Replace(mailingList);
                    mailingListTable.Execute(replaceOperation);
                    return RedirectToAction("Index");
                }
                catch (StorageException ex)
                {
                    if (ex.RequestInformation.HttpStatusCode == 412)
                    {
                        // Concurrency error
                        var currentMailingList = FindRow(partitionKey, rowKey);
                        if (currentMailingList.FromEmailAddress != editedMailingList.FromEmailAddress)
                        {
                            ModelState.AddModelError("FromEmailAddress", "Current value: " + currentMailingList.FromEmailAddress);
                        }
                        if (currentMailingList.Description != editedMailingList.Description)
                        {
                            ModelState.AddModelError("Description", "Current value: " + currentMailingList.Description);
                        }
                        ModelState.AddModelError(string.Empty, "The record you attempted to edit "
                            + "was modified by another user after you got the original value. The "
                            + "edit operation was canceled and the current values in the database "
                            + "have been displayed. If you still want to edit this record, click "
                            + "the Save button again. Otherwise click the Back to List hyperlink.");
                         ModelState.SetModelValue("ETag", new ValueProviderResult(currentMailingList.ETag, currentMailingList.ETag, null));
                    }
                    else
                    {
                        throw; 
                    }
                }
            }
            return View(editedMailingList);
        }

	The try-catch block handles concurrency errors. A concurrency exception is raised if a user selects a mailing list for editing, then while the **Edit** page is displayed in the browser another user edits the same mailing list. When that happens, the code displays a warning message and indicates which fields were changed by the other user.  The TSL API uses the `ETag` to check for concurrency conflicts. Every time a table row is updated, the `ETag` value is changed.  When you get a row to edit, you save the `ETag` value, and when you execute an update or delete operation you pass in the `ETag` value that you saved. (The `Edit` view has a hidden field for the ETag value.) If the update operation finds that the `ETag` value on the record you are updating is different than the `ETag` value that you passed in to the update operation, it raises a concurrency exception. If you don't care about concurrency conflicts, you can set the ETag field to an asterisk ("*") in the entity that you pass in to the update operation, and conflicts are ignored. 

	Note: The HTTP 412 error is not unique to concurrency errors. It can be raised for other errors by the SCL API.

	For the **Delete** page, the `HttpGet Delete` method looks up the row in order to display its contents, and the `HttpPost` method deletes the `MailingList` row along with any `Subscriber` rows that are associated with it in the `MailingList` table.

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(string partitionKey)
        {
            // Delete all rows for this mailing list, that is, 
            // Subscriber rows as well as MailingList rows.
            // Therefore, no need to specify row key.
            var query = new TableQuery<MailingList>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, partitionKey));
            var listRows = mailingListTable.ExecuteQuery(query).ToList();
            var batchOperation = new TableBatchOperation();
            int itemsInBatch = 0;
            foreach (MailingList listRow in listRows)
            {
                batchOperation.Delete(listRow);
                itemsInBatch++;
                if (itemsInBatch == 100)
                {
                    mailingListTable.ExecuteBatch(batchOperation);
                    itemsInBatch = 0;
                    batchOperation = new TableBatchOperation();
                }
            }
            if (itemsInBatch > 0)
            {
                mailingListTable.ExecuteBatch(batchOperation);
            }
            return RedirectToAction("Index");
        }

	In case a large number of subscribers need to be deleted, the code deletes the records in batches. The transaction cost of deleting one row is the same as deleting 100 rows in a batch. The maximum number of operations that you can perform in one batch is 100. 

	Although the loop processes both `MailingList` rows and `Subscriber` rows, it reads them all into the `MailingList` entity class because the only fields needed for the `Delete` operation are the `PartitionKey`, `RowKey`, and `ETag` fields.

### Add the MailingList MVC views

2. In **Solution Explorer**, create a new folder under the *Views* folder  in the MVC project, and name it *MailingList*.

1. Right-click the new *Views\MailingList* folder, and choose **Add Existing Item**.

	![Add existing item to Views folder][mtas-add-existing-item-to-views]

2. Navigate to the folder where you downloaded the sample application, select all four of the .cshtml files in the *Views\MailingList* folder, and click **Add**.

3. Open the *Edit.cshtml* file and examine the code.

		@model MvcWebRole.Models.MailingList
				@{
		    ViewBag.Title = "Edit Mailing List";
		}
				<h2>Edit Mailing List</h2>
              @using (Html.BeginForm()) {
              @Html.AntiForgeryToken()
              @Html.ValidationSummary(true)
              @Html.HiddenFor(model => model.ETag)
              <fieldset>
		        <legend>MailingList</legend>
		        <div class="editor-label">
		            @Html.LabelFor(model => model.ListName)
		        </div>
		        <div class="editor-field">
		            @Html.DisplayFor(model => model.ListName)
		        </div>
		        <div class="editor-label">
		            @Html.LabelFor(model => model.Description)
		        </div>
		        <div class="editor-field">
		            @Html.EditorFor(model => model.Description)
		            @Html.ValidationMessageFor(model => model.Description)
		        </div>
		        <div class="editor-label">
		            @Html.LabelFor(model => model.FromEmailAddress)
		        </div>
		        <div class="editor-field">
		            @Html.EditorFor(model => model.FromEmailAddress)
		            @Html.ValidationMessageFor(model => model.FromEmailAddress)
		        </div>
		        <p>
		            <input type="submit" value="Save" />
		        </p>
		    </fieldset>
		}
		<div>
		    @Html.ActionLink("Back to List", "Index")
		</div>		
		@section Scripts {
		    @Scripts.Render("~/bundles/jqueryval")
		}
				
	This code is typical for MVC views.  Notice the hidden field that is included to preserve the `ETag` value which is used for handling concurrency conflicts. Notice also that the `ListName` field has a `DisplayFor` helper instead of an `EditorFor` helper. We didn't enable the **Edit** page to change the list name, because that would have required complex code in the controller:  the `HttpPost Edit` method would have had to delete the existing mailing list row and all associated subscriber rows, and re-insert them all with the new key value. In a production application you might decide that the additional complexity is worthwhile. As you'll see later, the `Subscriber` controller does allow list name changes, since only one row at a time is affected. 

	The *Create.cshtml* and *Delete.cshtml* code is similar to *Edit.cshtml*.

4. Open *Index.cshtml* and examine the code.

	    @model IEnumerable<MvcWebRole.Models.MailingList>
	    @{
	        ViewBag.Title = "Mailing Lists";
	    }
	    <h2>Mailing Lists</h2>
	    <p>
	        @Html.ActionLink("Create New", "Create")
	    </p>
	    <table>
	        <tr>
	            <th>
	                @Html.DisplayNameFor(model => model.ListName)
	            </th>
	            <th>
	                @Html.DisplayNameFor(model => model.Description)
	            </th>
	            <th>
	                @Html.DisplayNameFor(model => model.FromEmailAddress)
	            </th>
	            <th></th>
	        </tr>
	    @foreach (var item in Model) {
	        <tr>
	            <td>
	                @Html.DisplayFor(modelItem => item.ListName)
	            </td>
	            <td>
	                @Html.DisplayFor(modelItem => item.Description)
	            </td>
	            <td>
	                @Html.DisplayFor(modelItem => item.FromEmailAddress)
	            </td>
	            <td>
	                @Html.ActionLink("Edit", "Edit", new { PartitionKey = item.PartitionKey, RowKey=item.RowKey }) |
	                @Html.ActionLink("Delete", "Delete", new { PartitionKey = item.PartitionKey, RowKey=item.RowKey  })
	            </td>
	        </tr>
	    }
	    </table>
	
	This code is also typical for MVC views. The **Edit** and **Delete** hyperlinks specify partition key and row key query string parameters in order to identify a specific row.  For `MailingList` entities only the partition key is actually needed since row key is always "MailingList", but both are kept so that the MVC view code is consistent across all controllers and views.

### Make MailingList the default controller

1. Open *Route.config.cs* in the *App_Start* folder.

2. In the line that specifies defaults, change the default controller from "Home" to "MailingList".

         routes.MapRoute(
             name: "Default",
             url: "{controller}/{action}/{id}",
             defaults: new { controller = "MailingList", action = "Index", id = UrlParameter.Optional }





<h2><a name="configurestorage"></a><span class="short-header">Configure storage</span>Configure the web role to use your test Azure Storage account</h2>

You are going to enter settings for your test storage account, which you will use while running the project locally.  To add a new setting you have to add it for both cloud and local, but you can change the cloud value later. You'll add the same settings for worker role A later.

(If you want to run the web UI in an Azure Web Site instead of an Azure Cloud Service, see the [Alternative Architecture][alternativearchitecture] section later in this tutorial for changes to these instructions.)

1. In **Solution Explorer**, right-click **MvcWebRole** under **Roles** in the **AzureEmailService** cloud project, and then choose **Properties**.

	![Web role properties][mtas-mvcwebrole-properties-menu]

2. Make sure that **All Configurations** is selected in the **Service Configuration** drop-down list.

2. Select the **Settings** tab and then click **Add Setting**.

3. Enter "StorageConnectionString" in the **Name** column.

4. Select **Connection String** in the **Type** drop-down list.  

6. Click the ellipsis (**...**) button at the right end of the line to open the **Storage Account Connection String** dialog box.

	![Right Click Properties][mtas-elip]<br/>

7. In the **Create Storage Connection String** dialog, click the **Your subscription** radio button, and then click the **Download Publish Settings** link. 

	>[WACOM.NOTE] With the latest SDK you don't need to download anything; you choose from available storage accounts in a drop-down list.

	**Note:** If you configured storage settings for tutorial 2 and you're doing this tutorial on the same machine, you don't have to download the settings again, you just have to click **Your subscription** and then choose the correct **Subscription** and **Account Name**.

	![Right Click Properties][mtas-enter]<br/>

	When you click the **Download Publish Settings** link, Visual Studio launches a new instance of your default browser with the URL for the Azure Management Portal download publish settings page. If you are not logged into the portal, you are prompted to log in. Once you are logged in your browser prompts you to save the publish settings. Make a note of where you save the settings.

	![publish settings][mtas-3]

1. In the **Create Storage Connection String** dialog, click  **Import**, and then navigate to the publish settings file that you saved in the previous step.

1. Select the subscription and storage account that you wish to use, and then click **OK**.

	![select storage account][mtas-5]

1. Follow the same procedure that you used for the `StorageConnectionString` connection string to set the `Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString` connection string.

	You don't have to download the publish settings file again. When you click the ellipsis for the `Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString` connection string, you'll find that the **Create Storage Connection String** dialog box remembers your subscription information. When you click the **Your subscription** radio button, all you have to do is select the same **Subscription** and **Account Name** that you selected earlier, and then click **OK**. 

2. Follow the same procedure that you used for the two connection strings for the MvcWebRole role to set the connection strings for the WorkerRoleA role.

When you added a new setting with the **Add Settings** button, the new setting was added to the XML in the *ServiceDefinition.csdf* file and in each of the two *.cscfg* configuration files. The following XML is added by Visual Studio to the *ServiceDefinition.csdf* file.

      <ConfigurationSettings>
        <Setting name="StorageConnectionString" />
      </ConfigurationSettings>

The following XML is added to each *.cscfg* configuration file.

	   <Setting name="StorageConnectionString"
	   value="DefaultEndpointsProtocol=https;
	   AccountName=azuremailstorage;
	   AccountKey=[your account key]" />

You can manually add settings to the *ServiceDefinition.csdf* file and the two *.cscfg* configuration files, but using the properties editor has the following advantages for connection strings:

- You only add the new setting in one place, and the correct setting XML is added to all three files.
- The correct XML is generated for the three settings files. The *ServiceDefinition.csdf* file defines settings that must be in each *.cscfg* configuration file. If the *ServiceDefinition.csdf* file and the two *.cscfg* configuration files settings are inconsistent, you can get the following error message from Visual Studio: "The current service model is out of sync. Make sure both the service configuration and definition files are valid."

	![Invalid service configuration and definition files error][mtas-er1]

If you get this error, the properties editor will not work until you resolve the inconsistency problem.

### Test the application

1. Run the project by pressing CTRL+F5.

	![Empty MailingList Index page][mtas-mailing-list-empty-index-page]

2. Use the **Create** function to add some mailing lists, and try the **Edit** and **Delete** functions to make sure they work.

	![MailingList Index page with rows][mtas-mailing-list-index-page]



<h2><a name="subscriber"></a><span class="short-header">Subscriber</span>Create and test the Subscriber controller and views</h2>

The **Subscriber** web UI is used by administrators to add new subscribers to a mailing list, and to edit, display, and delete existing subscribers. 

### Add the Subscriber entity class to the Models folder

The `Subscriber` entity class is used for the rows in the `MailingList` table that contain information about subscribers to a list. These rows contain information such as the person's email address and whether the address is verified.  

1. In **Solution Explorer**, right-click the *Models* folder in the MVC project, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select the *Subscriber.cs* file in the *Models* folder, and click **Add**.

3. Open *Subscriber.cs* and examine the code.

		    public class Subscriber : TableEntity
		    {
		        [Required]
		        public string ListName
		        {
		            get
		            {
		                return this.PartitionKey;
		            }
		            set
		            {
		                this.PartitionKey = value;
		            }
		        }
		
		        [Required]
		        [Display(Name = "Email Address")]
		        public string EmailAddress
		        {
		            get
		            {
		                return this.RowKey;
		            }
		            set
		            {
		                this.RowKey = value;
		            }
		        }
		
		        public string SubscriberGUID { get; set; }
		
                public bool? Verified { get; set; }
		    }
		

	Like the `MailingList` entity class, the `Subscriber` entity class is used to read and write rows in the `mailinglist` table. `Subscriber` rows use the email address instead of the constant "mailinglist" for the row key.  (For an explanation of the table structure, see the [first tutorial in the series][firsttutorial].) Therefore an `EmailAddress` property is defined that uses the `RowKey` property as its backing field, the same way that `ListName` uses `PartitionKey` as its backing field. As explained earlier, this enables you to put formatting and validation DataAnnotations attributes on the properties.

	The `SubscriberGUID` value is generated when a `Subscriber` entity is created. It is used in subscribe and unsubscribe links to help ensure that only authorized persons can subscribe or unsubscribe email addresses.
	When a row is initially created for a new subscriber, the `Verified ` value is `false`. The `Verified` value changes to `true` only after the new subscriber clicks the **Confirm** hyperlink in the welcome email. If a message is sent to a list while a subscriber has `Verified` = `false`, no email is sent to that subscriber.

	The `Verified` property in the `Subscriber` entity is defined as nullable. When you specify that a query should return `Subscriber` entities, it is possible that some of the retrieved rows might not have a `Verified` property. Therefore the `Subscriber` entity defines its `Verified` property as nullable so that it can more accurately reflect the actual content of a row if table rows that don't have a *Verified* property are returned by a query. You might be accustomed to working with SQL Server tables, in which every row of a table has the same schema. In an Azure Storage table, each row is just a collection of properties, and each row can have a different set of properties. For example, in the Azure Email Service sample application, rows that have "MailingList" as the row key don't have a `Verified` property.  If a query returns a table row that doesn't have a `Verified` property, when the `Subscriber` entity class is instantiated, the `Verified` property in the entity object will be null.  If the property were not nullable, you would get the same value of `false` for rows that have `Verified` = `false` and for rows that don't have a `Verified` property at all. Therefore, a best practice for working with Azure Tables is to make each property of an entity class nullable in order to accurately read rows that were created by using different entity classes or different versions of the current entity class. 

### Add the Subscriber MVC controller

1. In **Solution Explorer**, right-click the *Controllers* folder in the MVC project, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select the *SubscriberController.cs* file in the *Controllers* folder, and click **Add**. (Make sure that you get *Subscriber.cs* and not *Subscribe.cs*; you'll add *Subscribe.cs* later.)

3. Open *SubscriberController.cs* and examine the code.

	Most of the code in this controller is similar to what you saw in the `MailingList` controller. Even the table name is the same because subscriber information is kept in the `MailingList` table. After the `FindRow` method you see a `GetListNames` method. This method gets the data for a drop-down list on the **Create** and **Edit** pages, from which you can select the mailing list to subscribe an email address to.

        private List<MailingList> GetListNames()
        {
            var query = (new TableQuery<MailingList>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, "mailinglist")));
            var lists = mailingListTable.ExecuteQuery(query).ToList();
            return lists;
        }

	This is the same query you saw in the `MailingList` controller. For the drop-down list you want rows that have information about mailing lists, so you select only those that have RowKey = "mailinglist".

	For the method that retrieves data for the **Index** page, you want rows that have subscriber information, so you select all rows that do not have RowKey = "MailingList".

        public ActionResult Index()
        {
            var query = (new TableQuery<Subscriber>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.NotEqual, "mailinglist")));
            var subscribers = mailingListTable.ExecuteQuery(query).ToList();
            return View(subscribers);
        }

	Notice that the query specifies that data will be read into `Subscriber` objects (by specifying `<Subscriber>`) but the data will be read from the `mailinglist` table.

	**Note:** The number of subscribers could grow to be too large to handle this way in a single query. In a future release of the tutorial we hope to implement paging functionality and show how to handle continuation tokens. You need to handle continuation tokens when you execute queries that would return more than 1,000 rows: Azure returns 1,000 rows and a continuation token that you use to execute another query that starts where the previous one left off. (Azure Storage Explorer does not handle continuation tokens; therefore its queries will not return more than 1,000 rows.) For more information about large result sets and continuation tokens, see [How to get most out of Azure Tables][howtogetthemost] and [Azure Tables: Expect Continuation Tokens, Seriously](http://blog.smarx.com/posts/windows-azure-tables-expect-continuation-tokens-seriously). 

	In the `HttpGet Create` method, you set up data for the drop-down list; and in the `HttpPost` method, you set default values before saving the new entity.

        public ActionResult Create()
        {
            var lists = GetListNames();
            ViewBag.ListName = new SelectList(lists, "ListName", "Description");
            var model = new Subscriber() { Verified = false };
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Subscriber subscriber)
        {
            if (ModelState.IsValid)
            {
                subscriber.SubscriberGUID = Guid.NewGuid().ToString();
                if (subscriber.Verified.HasValue == false)
                {
                    subscriber.Verified = false;
                }

                var insertOperation = TableOperation.Insert(subscriber);
                mailingListTable.Execute(insertOperation);
                return RedirectToAction("Index");
            }

            var lists = GetListNames();
            ViewBag.ListName = new SelectList(lists, "ListName", "Description", subscriber.ListName);

            return View(subscriber);
        }

	The `HttpPost Edit` page is more complex than what you saw in the `MailingList` controller because the `Subscriber` page enables you to change the list name or email address, both of which are key fields. If the user changes one of these fields, you have to delete the existing record and add a new one instead of updating the existing record. The following code shows the part of the edit method that handles the different procedures for key versus non-key changes:
     
            if (ModelState.IsValid)
            {
                try
                {
                    UpdateModel(editedSubscriber, string.Empty, null, excludeProperties);
                    if (editedSubscriber.PartitionKey == partitionKey && editedSubscriber.RowKey == rowKey)
                    {
                        //Keys didn't change -- Update the row
                        var replaceOperation = TableOperation.Replace(editedSubscriber);
                        mailingListTable.Execute(replaceOperation);
                    }
                    else
                    {
                        // Keys changed, delete the old record and insert the new one.
                        if (editedSubscriber.PartitionKey != partitionKey)
                        {
                            // PartitionKey changed, can't do delete/insert in a batch.
                            var deleteOperation = TableOperation.Delete(new Subscriber { PartitionKey = partitionKey, RowKey = rowKey, ETag = editedSubscriber.ETag });
                            mailingListTable.Execute(deleteOperation);
                            var insertOperation = TableOperation.Insert(editedSubscriber);
                            mailingListTable.Execute(insertOperation);
                        }
                        else
                        {
                            // RowKey changed, do delete/insert in a batch.
                            var batchOperation = new TableBatchOperation();
                            batchOperation.Delete(new Subscriber { PartitionKey = partitionKey, RowKey = rowKey, ETag = editedSubscriber.ETag });
                            batchOperation.Insert(editedSubscriber);
                            mailingListTable.ExecuteBatch(batchOperation);
                        }
                    }
                    return RedirectToAction("Index");

	The parameters that the MVC model binder passes to the `Edit` method include the original list name and email address values (in the `partitionKey` and `rowKey` parameters) and the values entered by the user (in the `listName` and `emailAddress` parameters): 

        public ActionResult Edit(string partitionKey, string rowKey, string listName, string emailAddress)

	The parameters passed to the `UpdateModel` method exclude `PartitionKey` and `RowKey` properties from model binding:

            var excludeProperties = new string[] { "PartitionKey", "RowKey" };
            
	The reason for this is that the `ListName` and `EmailAddress` properties use `PartitionKey` and `RowKey` as their backing properties, and the user might have changed one of these values. When the model binder updates the model by setting the `ListName` property, the `PartitionKey` property is automatically updated. If the model binder were to update the `PartitionKey` property with that property's original value after updating the `ListName` property, it would overwrite the new value that was set by the `ListName` property. The `EmailAddress` property automatically updates the `RowKey` property in the same way.  

	After updating the `editedSubscriber` model object, the code then determines whether the partition key or row key was changed. If either key value changed, the existing subscriber row has to be deleted and a new one inserted. If only the row key changed, the deletion and insertion can be done in an atomic batch transaction.

	Notice that the code creates a new entity to pass in to the `Delete` operation:

            // RowKey changed, do delete/insert in a batch.
            var batchOperation = new TableBatchOperation();
            batchOperation.Delete(new Subscriber { PartitionKey = partitionKey, RowKey = rowKey, ETag = editedSubscriber.ETag });
            batchOperation.Insert(editedSubscriber);
            mailingListTable.ExecuteBatch(batchOperation);

	Entities that you pass in to operations in a batch must be distinct entities. For example, you can't create a `Subscriber` entity, pass it in to a `Delete` operation, then change a value in the same `Subscriber` entity and pass it in to an `Insert` operation. If you did that, the state of the entity after the property change would be in effect for both the Delete and the Insert operation.

	**Note:**  Operations in a batch must all be on the same partition. Because a change to the list name changes the partition key, it can't be done in a transaction.



### Add the Subscriber MVC views

2. In **Solution Explorer**, create a new folder under the *Views* folder in the MVC project, and name it *Subscriber*.

1. Right-click the new *Views\Subscriber* folder, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select all five of the .cshtml files in the *Views\Subscriber* folder, and click **Add**.

3. Open the *Edit.cshtml* file and examine the code.

		@model MvcWebRole.Models.Subscriber
		
		@{
		    ViewBag.Title = "Edit Subscriber";
		}
		
		<h2>Edit Subscriber</h2>
		
		@using (Html.BeginForm()) {
		    @Html.AntiForgeryToken()
		    @Html.ValidationSummary(true)
		     @Html.HiddenFor(model => model.SubscriberGUID)
             @Html.HiddenFor(model => model.ETag)
		     <fieldset>
		        <legend>Subscriber</legend>
		        <div class="display-label">
		             @Html.DisplayNameFor(model => model.ListName)
		        </div>
		        <div class="editor-field">
		            @Html.DropDownList("ListName", String.Empty)
		            @Html.ValidationMessageFor(model => model.ListName)
		        </div>
		        <div class="editor-label">
		            @Html.LabelFor(model => model.EmailAddress)
		        </div>
		        <div class="editor-field">
		            @Html.EditorFor(model => model.EmailAddress)
		            @Html.ValidationMessageFor(model => model.EmailAddress)
		        </div>
		        <div class="editor-label">
		            @Html.LabelFor(model => model.Verified)
		        </div>
		        <div class="display-field">
		            @Html.EditorFor(model => model.Verified)
		        </div>
		        <p>
		            <input type="submit" value="Save" />
		        </p>
		    </fieldset>
		}
		
		<div>
		    @Html.ActionLink("Back to List", "Index")
		</div>
		
		@section Scripts {
		    @Scripts.Render("~/bundles/jqueryval")
		}
						
	This code is similar to what you saw earlier for the `MailingList` **Edit** view. The `SubscriberGUID` value is not shown, so the value is not automatically provided in a form field for the `HttpPost` controller method. Therefore, a hidden field is included in order to preserve this value.

	The other views contain code that is similar to what you already saw for the `MailingList` controller.

### Test the application

1. Run the project by pressing CTRL+F5, and then click **Subscribers**.

	![Empty Subscriber Index page][mtas-subscribers-empty-index-page]

2. Use the **Create** function to add some mailing lists, and try the **Edit** and **Delete** functions to make sure they work.

	![Subscribers Index page with rows][mtas-subscribers-index-page]



<h2><a name="message"></a><span class="short-header">Message</span>Create and test the Message controller and views</h2>

The **Message** web UI is used by administrators to create, edit, and display information about messages that are scheduled to be sent to mailing lists.

### Add the Message entity class to the Models folder

The `Message` entity class is used for the rows in the `Message` table that contain information about a message that is scheduled to be sent to a list. These rows include information such as the subject line, the list to send a message to, and the scheduled date to send it. 

1. In **Solution Explorer**, right-click the *Models* folder in the MVC project, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select the *Message.cs* file in the Models folder, and click **Add**.

3. Open *Message.cs* and examine the code.

	    public class Message : TableEntity
	    {
	        private DateTime? _scheduledDate;
	        private long _messageRef;
	
	        public Message()
	        {
	            this.MessageRef = DateTime.Now.Ticks;
	            this.Status = "Pending";
	        }
	
	        [Required]
	        [Display(Name = "Scheduled Date")]
	        // DataType.Date shows Date only (not time) and allows easy hook-up of jQuery DatePicker
	        [DataType(DataType.Date)]
	        public DateTime? ScheduledDate 
	        {
	            get
	            {
	                return _scheduledDate;
	            }
	            set
	            {
	                _scheduledDate = value;
	                this.PartitionKey = value.Value.ToString("yyyy-MM-dd");
	            }
	        }
	        
	        public long MessageRef 
	        {
	            get
	            {
	                return _messageRef;
	            }
	            set
	            {
	                _messageRef = value;
	                this.RowKey = "message" + value.ToString();
	            }
	        }
	
	        [Required]
	        [Display(Name = "List Name")]
	        public string ListName { get; set; }
	
	        [Required]
	        [Display(Name = "Subject Line")]
	        public string SubjectLine { get; set; }
	
	        // Pending, Queuing, Processing, Complete
	        public string Status { get; set; }
	    }
		
	The `Message` class defines a default constructor that sets the `MessageRef` property to a unique value for the message. Since this value is part of the row key, the setter for the `MessageRef` property automatically sets the `RowKey` property also. The `MessageRef` property setter concatenates the "message" literal and the `MessageRef` value and puts that in the `RowKey` property.

	The `MessageRef` value is created by getting the `Ticks` value from `DateTime.Now`. This ensures that by default when displaying messages in the web UI they will be displayed in the order in which they were created for a given scheduled date (`ScheduledDate` is the partition key). You could use a GUID to make message rows unique, but then the default retrieval order would be random.

	The default constructor also sets default status of Pending for new `message` rows.

	For more information about the `Message` table structure, see the [first tutorial in the series][firsttutorial].

### Add the Message MVC controller

1. In **Solution Explorer**, right-click the Controllers folder in the MVC project, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select the *MessageController.cs* file in the *Controllers* folder, and click **Add**.

3. Open *MessageController.cs* and examine the code.

	Most of the code in this controller is similar to what you saw in the `Subscriber` controller. What is new here is code for working with blobs. For each message, the HTML and plain text content of the email is uploaded in the form of .htm and .txt files and stored in blobs.

	Blobs are stored in blob containers. The Azure Email Service application stores all of its blobs in a single blob container named "azuremailblobcontainer", and code in the controller constructor gets a reference to this blob container:

	    public class MessageController : Controller
	    {
	        private TableServiceContext serviceContext;
	        private static CloudBlobContainer blobContainer;

		      public MessageController()
	        {
	            var storageAccount = CloudStorageAccount.Parse(RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));
	            // If this is running in an Azure Web Site (not a Cloud Service) use the Web.config file:
	            //    var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString);
	
	            // Get context object for working with tables and a reference to the blob container.
	            var tableClient = storageAccount.CreateCloudTableClient();
            serviceContext = tableClient.GetTableServiceContext();
	            var blobClient = storageAccount.CreateCloudBlobClient();
	            blobContainer = blobClient.GetContainerReference("azuremailblobcontainer");
	        }
	
	For each file that a user selects to upload, the MVC view provides an `HttpPostedFile` object that contains information about the file. When the user creates a new message, the `HttpPostedFile` object is used to save the file to a blob. When the user edits a message, the user can choose to upload a replacement file or leave the blob unchanged.

	The controller includes a method that the `HttpPost Create` and `HttpPost Edit` methods call to save a blob:

        private void SaveBlob(string blobName, HttpPostedFileBase httpPostedFile)
        {
            // Retrieve reference to a blob. 
            CloudBlockBlob blob = blobContainer.GetBlockBlobReference(blobName);
            // Create the blob or overwrite the existing blob by uploading a local file.
            using (var fileStream = httpPostedFile.InputStream)
            {
                blob.UploadFromStream(fileStream);
            }
        }

	The `HttpPost Create` method saves the two blobs and then adds the `Message` table row. Blobs are named by concatenating the `MessageRef` value with the file name extension ".htm" or ".txt". 

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Message message, HttpPostedFileBase file, HttpPostedFileBase txtFile)
        {
            if (file == null)
            {
                ModelState.AddModelError(string.Empty, "Please provide an HTML file path");
            }

            if (txtFile == null)
            {
                ModelState.AddModelError(string.Empty, "Please provide a Text file path");
            }

            if (ModelState.IsValid)
            {
                SaveBlob(message.MessageRef + ".htm", file);
                SaveBlob(message.MessageRef + ".txt", txtFile);

                var insertOperation = TableOperation.Insert(message);
                messageTable.Execute(insertOperation);

                return RedirectToAction("Index");
            }

            var lists = GetListNames();
            ViewBag.ListName = new SelectList(lists, "ListName", "Description");
            return View(message);
        }

	The `HttpGet Edit` method validates that the retrieved message is in `Pending` status so that the user can't change a message once worker role B has begun processing it.  Similar code is in the `HttpPost Edit` method and the `Delete` and `DeleteConfirmed` methods.

        public ActionResult Edit(string partitionKey, string rowKey)
        {
            var message = FindRow(partitionKey, rowKey);
            if (message.Status != "Pending")
            {
                throw new Exception("Message can't be edited because it isn't in Pending status.");
            }

            var lists = GetListNames();
            ViewBag.ListName = new SelectList(lists, "ListName", "Description", message.ListName);
            return View(message);
        }

	In the `HttpPost Edit` method, the code saves a new blob only if the user chose to upload a new file. The following code omits the concurrency handling part of the method, which is the same as what you saw earlier for the `MailingList` controller. 
 
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(string partitionKey, string rowKey, Message editedMsg,
            DateTime scheduledDate, HttpPostedFileBase httpFile, HttpPostedFileBase txtFile)
        {
            if (ModelState.IsValid)
            {
                var excludePropLst = new List<string>();
                excludePropLst.Add("PartitionKey");
                excludePropLst.Add("RowKey");

                if (httpFile == null)
                {
                    // They didn't enter a path or navigate to a file, so don't update the file.
                    excludePropLst.Add("HtmlPath");
                }
                else
                {
                    // They DID enter a path or navigate to a file, assume it's changed.
                    SaveBlob(editedMsg.MessageRef + ".htm", httpFile);
                }

                if (txtFile == null)
                {
                    excludePropLst.Add("TextPath");
                }
                else
                {
                    SaveBlob(editedMsg.MessageRef + ".txt", txtFile);
                }

                string[] excludeProperties = excludePropLst.ToArray();

                try
                {
                    UpdateModel(editedMsg, string.Empty, null, excludeProperties);
                    if (editedMsg.PartitionKey == partitionKey)
                    {
                        // Keys didn't change -- update the row.
                        var replaceOperation = TableOperation.Replace(editedMsg);
                        messageTable.Execute(replaceOperation);
                    }
                    else
                    {
                        // Partition key changed -- delete and insert the row.
                        // (Partition key has scheduled date which may be changed;
                        // row key has MessageRef which does not change.)
                        var deleteOperation = TableOperation.Delete(new Message { PartitionKey = partitionKey, RowKey = rowKey, ETag = editedMsg.ETag });
                        messageTable.Execute(deleteOperation);
                        var insertOperation = TableOperation.Insert(editedMsg);
                        messageTable.Execute(insertOperation);
                    }
                    return RedirectToAction("Index");
                }

	If the scheduled date is changed, the partition key is changed, and a row has to be deleted and inserted. This can't be done in a transaction because it affects more than one partition.

	The `HttpPost Delete` method deletes the blobs when it deletes the row in the table:

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(String partitionKey, string rowKey)
        {
            // Get the row again to make sure it's still in Pending status.
            var message = FindRow(partitionKey, rowKey);
            if (message.Status != "Pending")
            {
                throw new Exception("Message can't be deleted because it isn't in Pending status.");
            }

            DeleteBlob(message.MessageRef + ".htm");
            DeleteBlob(message.MessageRef + ".txt");
            var deleteOperation = TableOperation.Delete(message);
            messageTable.Execute(deleteOperation);
            return RedirectToAction("Index");
        }

        private void DeleteBlob(string blobName)
        {
            var blob = blobContainer.GetBlockBlobReference(blobName);
            blob.Delete();
        }

### Add the Message MVC views

2. In **Solution Explorer**, create a new folder under the *Views* folder  in the MVC project, and name it `Message`.

1. Right-click the new *Views\Message* folder, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select all five of the .cshtml files in the *Views\Message* folder, and click **Add**.

3. Open the *Edit.cshtml* file and examine the code.

		@model MvcWebRole.Models.Message
		
		@{
		    ViewBag.Title = "Edit Message";
		}
		
		<h2>Edit Message</h2>
		
		@using (Html.BeginForm("Edit", "Message", FormMethod.Post, new { enctype = "multipart/form-data" }))
		{
		    @Html.AntiForgeryToken()
		    @Html.ValidationSummary(true)
            @Html.HiddenFor(model => model.ETag)
		    <fieldset>
		        <legend>Message</legend>
		        @Html.HiddenFor(model => model.MessageRef)
		        @Html.HiddenFor(model => model.PartitionKey)
		        @Html.HiddenFor(model => model.RowKey)
		        <div class="editor-label">
		            @Html.LabelFor(model => model.ListName, "MailingList")
		        </div>
		        <div class="editor-field">
		            @Html.DropDownList("ListName", String.Empty)
		            @Html.ValidationMessageFor(model => model.ListName)
		        </div>
		        <div class="editor-label">
		            @Html.LabelFor(model => model.SubjectLine)
		        </div>
		        <div class="editor-field">
		            @Html.EditorFor(model => model.SubjectLine)
		            @Html.ValidationMessageFor(model => model.SubjectLine)
		        </div>
		        <div class="editor-label">
		            HTML Path: Leave blank to keep current HTML File.
		        </div>
		        <div class="editor-field">
		            <input type="file" name="file" />
		        </div>
		        <div class="editor-label">
		            Text Path: Leave blank to keep current Text File.
		        </div>
		        <div class="editor-field">
		            <input type="file" name="TxtFile" />
		        </div>
		        <div class="editor-label">
		            @Html.LabelFor(model => model.ScheduledDate)
		        </div>
		        <div class="editor-field">
		            @Html.EditorFor(model => model.ScheduledDate)
		            @Html.ValidationMessageFor(model => model.ScheduledDate)
		        </div>
		        <div class="display-label">
		            @Html.DisplayNameFor(model => model.Status)
		        </div>
		        <div class="editor-field">
		            @Html.EditorFor(model => model.Status)
		        </div>
		       <p>
		            <input type="submit" value="Save" />
		        </p>
		    </fieldset>
		}
		
		<div>
		    @Html.ActionLink("Back to List", "Index")
		</div>
		
		@section Scripts {
		    @Scripts.Render("~/bundles/jqueryval")
		}
				
	The `HttpPost Edit` method needs the partition key and row key, so the code provides these in hidden fields. The hidden fields were not needed in the `Subscriber` controller because (a) the `ListName` and `EmailAddress` properties in the `Subscriber` model update the `PartitionKey` and `RowKey` properties, and (b) the `ListName` and `EmailAddress` properties were included with `EditorFor` helpers in the Edit view. When the MVC model binder for the `Subscriber` model updates the `ListName` property, the `PartitionKey` property is automatically updated, and when the MVC model binder updates the `EmailAddress` property in the `Subscriber` model, the `RowKey` property is automatically updated. In the `Message` model, the fields that map to partition key and row key are not editable fields, so they don't get set that way.

	A hidden field is also included for the `MessageRef` property. This is the same value as the partition key, but it is included in order to enable better code clarity in the `HttpPost Edit` method. Including the `MessageRef` hidden field enables the code in the `HttpPost Edit` method to refer to the `MessageRef` value by that name when it constructs file names for the blobs. 
   
3. Open the *Index.cshtml* file and examine the code.

		@model IEnumerable<MvcWebRole.Models.Message>
		
		@{
		    ViewBag.Title = "Messages";
		}
		
		<h2>Messages</h2>
		
		<p>
		    @Html.ActionLink("Create New", "Create")
		</p>
		<table>
		    <tr>
		        <th>
		            @Html.DisplayNameFor(model => model.ListName)
		        </th>
		        <th>
		            @Html.DisplayNameFor(model => model.SubjectLine)
		        </th>
		        <th>
		            @Html.DisplayNameFor(model => model.ScheduledDate)
		        </th>
		        <th>
		            @Html.DisplayNameFor(model => model.Status)
		        </th>
		        <th></th>
		    </tr>
		    @foreach (var item in Model)
		    {
		        <tr>
		            <td>
		                @Html.DisplayFor(modelItem => item.ListName)
		            </td>
		            <td>
		                @Html.DisplayFor(modelItem => item.SubjectLine)
		            </td>
		            <td>
		                @Html.DisplayFor(modelItem => item.ScheduledDate)
		            </td>
		            <td>
		                @item.Status
		            </td>
		            <td>
		                @if (item.Status == "Pending")
		                {
		                    @Html.ActionLink("Edit", "Edit", new { PartitionKey = item.PartitionKey, RowKey = item.RowKey })  @: | 
		                    @Html.ActionLink("Delete", "Delete", new { PartitionKey = item.PartitionKey, RowKey = item.RowKey }) @: |
		                }
		                @Html.ActionLink("Details", "Details", new { PartitionKey = item.PartitionKey, RowKey = item.RowKey })
		            </td>
		        </tr>
		    }
		
		</table>
				
	A difference here from the other **Index** views is that the **Edit** and **Delete** links are shown only for messages that are in `Pending` status:

        @if (item.Status == "Pending")
        {
            @Html.ActionLink("Edit", "Edit", new { PartitionKey = item.PartitionKey, RowKey = item.RowKey })  @: | 
            @Html.ActionLink("Delete", "Delete", new { PartitionKey = item.PartitionKey, RowKey = item.RowKey }) @: |
        }

	This helps prevent the user from making changes to a message after worker role A has begun to process it.

	The other views contain code that is similar to the **Edit** view or the other views you saw for the other controllers.

### Test the application

1. Run the project by pressing CTRL+F5, then click **Messages**.

	![Empty Message Index page][mtas-message-empty-index-page]

2. Use the **Create** function to add some mailing lists, and try the **Edit** and **Delete** functions to make sure they work.

	![Subscribers Index page with rows][mtas-message-index-page]




<h2><a name="unsubscribe"></a><span class="short-header">Unsubscribe</span>Create and test the Unsubscribe controller and view</h2>

Next, you'll implement the UI for the unsubscribe process.

**Note:**  This tutorial only builds the controller for the unsubscribe process, not the subscribe process. As was explained in [the first tutorial][firsttutorial], the UI and service method for the subscription process have been left out until we implement appropriate security for the service method. Until then, you can use the **Subscriber** administrator pages to subscribe email addresses to lists.

### Add the Unsubscribe view model to the Models folder

The `UnsubscribeVM` view model is used to pass data between the `Unsubscribe` controller and its view.  

1. In **Solution Explorer**, right-click the `Models` folder in the MVC project, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select the `UnsubscribeVM.cs` file in the Models folder, and click **Add**.

3. Open `UnsubscribeVM.cs` and examine the code.


	    public class UnsubscribeVM
	    {
	        public string EmailAddress { get; set; }
	        public string ListName { get; set; }
	        public string ListDescription { get; set; }
	        public string SubscriberGUID { get; set; }
	        public bool? Confirmed { get; set; }
	    }

	Unsubscribe links contain the `SubscriberGUID`. That value is used to get the email address, list name, and list description from the `MailingList` table. The view displays the email address and the description of the list that is to be unsubscribed from, and it displays a **Confirm** button that the user must click to complete the unsubscription process.

### Add the Unsubscribe controller

1. In **Solution Explorer**, right-click the `Controllers` folder in the MVC project, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select the *UnsubscribeController.cs* file in the *Controllers* folder, and click **Add**.

3. Open *UnsubscribeController.cs* and examine the code.

	This controller has an `HttpGet Index` method that displays the initial unsubscribe page, and an `HttpPost Index` method that processes the **Confirm** or **Cancel** button.

	The `HttpGet Index` method uses the GUID and list name in the query string to get the `MailingList` table row for the subscriber. Then it puts all the information needed by the view into the view model and displays the **Unsubscribe** page. It sets the `Confirmed` property to null in order to tell the view to display the initial version of the **Unsubscribe** page.
 
	     public ActionResult Index(string id, string listName)
	     {
	         if (string.IsNullOrEmpty(id) == true || string.IsNullOrEmpty(listName))
	         {
	             ViewBag.errorMessage = "Empty subscriber ID or list name.";
	             return View("Error");
	         }
	         string filter = TableQuery.CombineFilters(
	             TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, listName),
	             TableOperators.And,
	             TableQuery.GenerateFilterCondition("SubscriberGUID", QueryComparisons.Equal, id));
	         var query = new TableQuery<Subscriber>().Where(filter);
	         var subscriber = mailingListTable.ExecuteQuery(query).ToList().Single();
	         if (subscriber == null)
	         {
	             ViewBag.Message = "You are already unsubscribed";
	             return View("Message");
	         }
	         var unsubscribeVM = new UnsubscribeVM();
	         unsubscribeVM.EmailAddress = MaskEmail(subscriber.EmailAddress);
	         unsubscribeVM.ListDescription = FindRow(subscriber.ListName, "mailinglist").Description;
	         unsubscribeVM.SubscriberGUID = id;
	         unsubscribeVM.Confirmed = null;
	         return View(unsubscribeVM);
	     }

	Note: The SubscriberGUID is not in the partition key or row key, so the performance of this query will degrade as partition size (the number of email addresses in a mailing list) increases.  For more information about alternatives to make this query more scalable, see [the first tutorial in the series][firsttutorial].

	The `HttpPost Index` method again uses the GUID and list name to get the subscriber information and populates the view model properties. Then, if the **Confirm** button was clicked, it deletes the subscriber row in the `MailingList` table. If the **Confirm** button was pressed it also sets the `Confirm` property to `true`, otherwise it sets the `Confirm` property to `false`. The value of the `Confirm` property is what tells the view to display the confirmed or canceled version of the **Unsubscribe** page.

        [HttpPost] 
        [ValidateAntiForgeryToken]
        public ActionResult Index(string subscriberGUID, string listName, string action)
        {
            string filter = TableQuery.CombineFilters(
                TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, listName),
                TableOperators.And,
                TableQuery.GenerateFilterCondition("SubscriberGUID", QueryComparisons.Equal, subscriberGUID));
            var query = new TableQuery<Subscriber>().Where(filter);
            var subscriber = mailingListTable.ExecuteQuery(query).ToList().Single();

            var unsubscribeVM = new UnsubscribeVM();
            unsubscribeVM.EmailAddress = MaskEmail(subscriber.EmailAddress);
            unsubscribeVM.ListDescription = FindRow(subscriber.ListName, "mailinglist").Description;
            unsubscribeVM.SubscriberGUID = subscriberGUID;
            unsubscribeVM.Confirmed = false;

            if (action == "Confirm")
            {
                unsubscribeVM.Confirmed = true;
                var deleteOperation = TableOperation.Delete(subscriber);
                mailingListTable.Execute(deleteOperation);
            }

            return View(unsubscribeVM);
        }

### Create the MVC views

2. In **Solution Explorer**, create a new folder under the *Views* folder in the MVC project, and name it *Unsubscribe*.

1. Right-click the new *Views\Unsubscribe* folder, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select the *Index.cshtml* file in the *Views\Unsubscribe* folder, and click **Add**.

3. Open the *Index.cshtml* file and examine the code.
		
		@model MvcWebRole.Models.UnsubscribeVM
		
		@{
		    ViewBag.Title = "Unsubscribe";
		    Layout = null;
		}
		
		<h2>Email List Subscription Service</h2>
		
		@using (Html.BeginForm()) {
		    @Html.AntiForgeryToken()
		    @Html.ValidationSummary(true)
		    <fieldset>
		        <legend>Unsubscribe from Mailing List</legend>
		        @Html.HiddenFor(model => model.SubscriberGUID)
                @Html.HiddenFor(model => model.EmailAddress)
                @Html.HiddenFor(model => model.ListName)
		        @if (Model.Confirmed == null) {
		            <p>
		                Do you want to unsubscribe  @Html.DisplayFor(model => model.EmailAddress) from:  @Html.DisplayFor(model => model.ListDescription)?
		           </p>
		            <br />
		            <p>
		                <input type="submit" value="Confirm" name="action"/> 
		                &nbsp; &nbsp;
		                <input type="submit" value="Cancel" name="action"/>
		            </p>
		        }
		        @if (Model.Confirmed == false) {
		            <p>
		                @Html.DisplayFor(model => model.EmailAddress)  will NOT be unsubscribed from: @Html.DisplayFor(model => model.ListDescription).
		            </p>
		        }
		        @if (Model.Confirmed == true) {
		            <p>
		                @Html.DisplayFor(model => model.EmailAddress)  has been unsubscribed from:  @Html.DisplayFor(model => model.ListDescription).
		            </p>
		        }
		    </fieldset>
		}
		
		@section Scripts {
		    @Scripts.Render("~/bundles/jqueryval")
		}
						
	The `Layout = null` line specifies that the _Layout.cshtml file should not be used to display this page. The **Unsubscribe** page displays a very simple UI without the headers and footers that are used for the administrator pages.

	In the body of the page, the `Confirmed` property determines what will be displayed on the page:  **Confirm** and **Cancel** buttons if the property is null, unsubscribe-confirmed message if the property is true, unsubscribe-canceled message if the property is false.

### Test the application

1. Run the project by pressing CTRL-F5, and then click **Subscribers**.

2. Click **Create** and create a new subscriber for any mailing list that you created when you were testing earlier.

	Leave the browser window open on the **Subscribers** **Index** page.

3. Open Azure Storage Explorer, and then select your test storage account.

4. Click **Tables** under **Storage Type**, select the **MailingList** table, and then click **Query**.

5. Double-click the subscriber row that you added.

	![Azure Storage Explorer][mtas-ase-unsubscribe]

6. In the **Edit Entity** dialog box, select and copy the `SubscriberGUID` value.

	![Azure Storage Explorer][mtas-ase-edit-entity-unsubscribe]

7. Switch back to your browser window.  In the address bar of the browser, change "Subscriber" in the URL to "unsubscribe?ID=[guidvalue]&listName=[listname]" where [guidvalue] is the GUID that you copied from Azure Storage Explorer, and [listname] is the name of the mailing list.  For example:

        http://127.0.0.1/unsubscribe?ID=b7860242-7c2f-48fb-9d27-d18908ddc9aa&listName=contoso1

	The version of the **Unsubscribe** page that asks for confirmation is displayed:

	![Unsubscribe page][mtas-unsubscribe-page]

2. Click **Confirm** and you see confirmation that the email address has been unsubscribed.

	![Unsubscribe confirmed page][mtas-unsubscribe-confirmed-page]

3. Go back to the **Subscribers** **Index** page to verify that the subscriber row is no longer there.




<h2><a name="alternativearchitecture"></a><span class="short-header">Alternative Architecture</span>(Optional) Build the Alternative Architecture</h2>

The following changes to the instructions apply if you want to build the alternative architecture -- that is, running the web UI in an Azure Web Site instead of an Azure Cloud Service web role.

* When you create the solution, create the **ASP.NET MVC 4 Web Application** project first, and then add to the solution a **Azure Cloud Service** project with a worker role.

* Store the Azure Storage connection string in the Web.config file instead of the cloud service settings file. (This only works for Azure Web Sites. If you try to use the Web.config file for the storage connection string in an Azure Cloud Service web role, you'll get an HTTP 500 error.) 

Add a new connection string named `StorageConnectionString` to the *Web.config* file, as shown in the following example:

	       <connectionStrings>
	          <add name="DefaultConnection" connectionString="Data Source=(LocalDb)\v11.0;Initial Catalog=aspnet-MvcWebRole-20121010185535;Integrated Security=SSPI;AttachDBFilename=|DataDirectory|\aspnet-MvcWebRole-20121010185535.mdf" providerName="System.Data.SqlClient" />
	          <add name="StorageConnectionString" connectionString="DefaultEndpointsProtocol=https;AccountName=[accountname];AccountKey=[primarykey]" />
	       </connectionStrings>
	
Get the values for the connection string from the [Azure Management Portal][managementportal]:  select the **Storage** tab and your storage account, and then click **Manage keys** at the bottom of the page.

* Wherever you see `RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString")` in the code, replace it with `ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString`.



<h2><a name="nextsteps"></a><span class="short
-header">Next steps</span>Next steps</h2>

As explained in [the first tutorial in the series][firsttutorial], we are not showing how to build the subscribe process in detail in this tutorial until we implement a shared secret to secure the ASP.NET Web API service method. However, the IP restriction also protects the service method and you can add the subscribe functionality by copying the following files from the downloaded project.

For the ASP.NET Web API service method:

* Controllers\SubscribeAPI.cs

For the web page that subscribers get when they click on the **Confirm** link in the email that is generated by the service method:

* Models\SubscribeVM.cs
* Controllers\SubscribeController.cs
* Views\Subscribe\Index.cshtml

In the [next tutorial][nexttutorial] you'll configure and program worker role A, the worker role that schedules emails.

For links to additional resources for working with Azure Storage tables, queues, and blobs, see [the last tutorial in this series][tut5ns].

<div><a href="/en-us/develop/net/tutorials/multi-tier-web-site/4-worker-role-a/" class="site-arrowboxcta download-cta">Tutorial 4</a></div>



[alternativearchitecture]: #alternativearchitecture


[tut5]: /en-us/develop/net/tutorials/multi-tier-web-site/5-worker-role-b/
[tut5ns]: /en-us/develop/net/tutorials/multi-tier-web-site/5-worker-role-b/#nextsteps
[tut2]: /en-us/develop/net/tutorials/multi-tier-web-site/2-download-and-run/
[firsttutorial]: /en-us/develop/net/tutorials/multi-tier-web-site/1-overview/
[nexttutorial]: /en-us/develop/net/tutorials/multi-tier-web-site/4-worker-role-a/

[TableEntity]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.storage.table.tableentity.aspx
[DynamicTableEntity]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.storage.table.dynamictableentity.aspx
[managementportal]: http://manage.windowsazure.com

[percentinkeyfields]: http://blogs.msdn.com/b/windowsazurestorage/archive/2012/05/28/partitionkey-or-rowkey-containing-the-percent-character-causes-some-windows-azure-tables-apis-to-fail.aspx
[tabledatamodel]: http://msdn.microsoft.com/en-us/library/windowsazure/dd179338.aspx 
[deepdive]: http://blogs.msdn.com/b/windowsazurestorage/archive/2012/11/06/windows-azure-storage-client-library-2-0-tables-deep-dive.aspx
[howtogetthemost]: http://blogs.msdn.com/b/windowsazurestorage/archive/2010/11/06/how-to-get-most-out-of-windows-azure-tables.aspx

[mtas-home-page-before-adding-controllers]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-home-page-before-adding-controllers.png
[mtas-menu-in-layout]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-menu-in-layout.png
[mtas-footer-in-layout]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-footer-in-layout.png
[mtas-title-and-logo-in-layout]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-title-and-logo-in-layout.png
[mtas-new-cloud-service-dialog-rename]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-new-cloud-service-dialog-rename.png
[mtas-new-mvc4-project]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-new-mvc4-project.png
[mtas-new-cloud-service-dialog]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-new-cloud-service-dialog.png
[mtas-new-cloud-project]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-new-cloud-project.png
[mtas-new-cloud-service-add-worker-a]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-new-cloud-service-add-worker-a.png
[mtas-mailing-list-empty-index-page]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-mailing-list-empty-index-page.png
[mtas-mailing-list-index-page]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-mailing-list-index-page.png
[mtas-file-new-project]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-file-new-project.png
[mtas-opening-layout-cshtml]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-opening-layout-cshtml.png

[mtas-add-existing-item-to-models]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-add-existing-item-to-models.png
[mtas-add-existing-item-to-controllers]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-add-existing-item-to-controllers.png
[mtas-add-existing-item-to-views]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-add-existing-item-to-views.png
[mtas-mvcwebrole-properties-menu]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-mvcwebrole-properties-menu.png




[mtas-subscribers-empty-index-page]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-subscribers-empty-index-page.png
[mtas-subscribers-index-page]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-subscribers-index-page.png
[mtas-message-empty-index-page]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-message-empty-index-page.png
[mtas-message-index-page]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-message-index-page.png
[mtas-ase-edit-entity-unsubscribe]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-ase-edit-entity-unsubscribe.png
[mtas-ase-unsubscribe]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-ase-unsubscribe.png
[mtas-unsubscribe-page]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-unsubscribe-query-page.png
[mtas-unsubscribe-confirmed-page]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-unsubscribe-confirmation-page.png
[mtas-er1]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-er1.png
[mtas-4]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-4.png
[mtas-3]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-3.png
[mtas-5]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-5.png
[mtas-enter]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-enter.png
[mtas-elip]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-elip.png
[mtas-manage-nuget-for-solution]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-manage-nuget-for-solution.png
[mtas-update-storage-nuget-pkg]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-update-storage-nuget-pkg.png
[mtas-nuget-select-projects]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-nuget-select-projects.png
[mtas-compute-emulator-icon]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-web-role/mtas-compute-emulator-icon.png

