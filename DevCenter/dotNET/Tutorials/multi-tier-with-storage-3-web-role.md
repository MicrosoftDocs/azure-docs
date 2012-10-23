<div chunk="../chunks/article-left-menu.md" />

# Building the web role for the Windows Azure Email Service application - 3 of 5. 

This is the third tutorial in a series of five that show how to build and deploy the Windows Azure Email Service sample application.  For information about the application and the tutorial series, see the [first tutorial in the series][firsttutorial].

In this tutorial you'll learn:

* How to create a solution that contains a Cloud Service project, an ASP.NET MVC 4 web role, and a worker role; or how to create a solution that contains an ASP.NET MVC 4 web project and a Cloud Service project with a worker role.
* How to configure the web role or web project to use your Windows Azure Storage account.
* How to create MVC 4 controllers and views that work with Windows Azure tables.
* How to create a Web API controller that works with Windows Azure tables and queues.
 
<h2><a name="cloudproject"></a><span class="short-header">Create cloud project</span>Create the Visual Studio solution</h2>

As [the first tutorial in the series][firsttutorial] explains, the application architecture used in the downloaded sample is a Windows Azure Cloud Service with a web role and two worker roles. An alternative is to run the web UI and the Web API service method in a Windows Azure Web Site, and keep only the worker roles in a Cloud Service. If you want to build the application with this alternative architecture, skip the following section.

### Create a cloud service project with a web role and a worker role

Skip this section if you want to run the web UI and Web API service method in a Windows Azure Web Site instead of a Windows Azure Cloud Service.

1. Start Visual Studio 2012 or Visual Studio 2012 for Web Express, with administrative privileges.

   The Windows Azure compute emulator which enables you to test your cloud project locally requires administrative privileges.

2. From the **File** menu select **New Project**.

   ![New Project menu][mtas-file-new-project]

3. In the **New Project** dialog box, make sure that the **.NET Framework** drop-down list is set to **.NET Framework 4**. 

   As this tutorial is being written, Windows Azure Cloud Service web roles do not yet support ASP.NET 4.5 by default.

1. Expand **C#** and select **Cloud** under **Installed Templates** and then select **Windows Azure Cloud Service**.

2. Name the application **AzureEmailService** and click **OK**.<br/>

   ![New Project dialog box][mtas-new-cloud-project]

5. In the **New Windows Azure Cloud Service** dialog box, select **ASP.NET MVC 4 Web Role** and click the arrow that points to the right.

   ![New Windows Azure Cloud Project dialog box][mtas-new-cloud-service-dialog]

6. In the column on the right, hover the pointer over **MvcWebRole1**, and then click the pencil icon to change the name of the web role. 

7. Enter MvcWebRole as the new name, and then click **OK**.

   ![New Windows Azure Cloud Project dialog box - renaming the web role][mtas-new-cloud-service-dialog-rename]

8. Follow the same procedure to add a **Worker Role**, name it WorkerRoleA, and then click **OK**.

   ![New Windows Azure Cloud Project dialog box - adding a worker role][mtas-new-cloud-service-add-worker-a]

5. In the **New ASP.NET MVC 4 Project** dialog box, select the **Internet Application** template.

6. In the **View Engine** drop-down list make sure that **Razor** is selected, and then click **OK**.

   ![New Project dialog box][mtas-new-mvc4-project]

### Create a web application project and add a Cloud Service project with a web role to the solution

Follow the steps in this section only if you are building the alternative architecture -- running the web UI and Web API service method in a Windows Azure Web Site instead of a Windows Azure Cloud Service web role.

1. Start Visual Studio 2012 or Visual Studio 2012 for Web Express, with administrative privileges.
   
2. From the **File** menu select **New Project**.

1. Select **Web** under **Installed Templates**, and then select the **ASP.NET MVC 4 Web Application** template. 

2. Name the application **AzureEmailService** and click **OK**.

5. In the **New ASP.NET MVC 4 Project** dialog box, select the **Internet Application** template.

6. In the **View Engine** drop-down list make sure that **Razor** is selected, and then click **OK**.

7. In **Solution Explorer**, right-click the new solution and select **Add Project**.

1. Expand **C#** and select **Cloud** under **Installed Templates** and then select **Windows Azure Cloud Service**.

2. Name the project **WindowsAzureCloudService** and click **OK**.

5. In the **New Windows Azure Cloud Service** dialog box, select **Worker Role** and click the arrow that points to the right.

6. In the column on the right, hover the pointer over **WorkerRole1**, and then click the pencil icon to change the name of the worker role. 

7. Enter WorkerRoleA as the new name, then click **OK**.

### Set the page header, menu, and footer

In this section you update the headers, footers, and menu items that are shown on every page for the administrator web UI.  The application will have three sets of administrator web pages:  one for Mailing Lists, one for Messages, and one for Subscribers.

1. In **Solution Explorer**, expand the Views\Shared folder and open the &#95;Layout.cshtml file.

   ![_Layout.cshtml in Solution Explorer][mtas-opening-layout-cshtml]

2. In the **&lt;title&gt;** element, change "My ASP.NET MVC Application" to "To Do List".

3. In the **&lt;p&gt;** element with class "site-title", change "your logo here" to "Windows Azure Email Service" and change "Home" to "MailingList".

    ![title and header in _Layout.cshtml][mtas-title-and-logo-in-layout]

4. Delete menu section:

    ![menu in _Layout.cshtml][mtas-menu-in-layout]

4. Insert a new menu section where the old one was:

        <ul id="menu">
            <li>@Html.ActionLink("Mailing Lists", "Index", "MailingList")</li>
            <li>@Html.ActionLink("Messages", "Index", "Message")</li>
            <li>@Html.ActionLink("Subscribers", "Index", "Subscriber")</li>
        </ul>

4. In the **&lt;footer&gt;** element, change "My ASP.NET MVC Application" to "Windows Azure Email Service".<br/>

![footer in _Layout.cshtml][mtas-footer-in-layout]

### Run the application locally

1. Press CTRL+F5 to run the application.

   The application home page appears in the default browser.

   ![home page][mtas-home-page-before-adding-controllers]

   If you created a cloud service, the application runs in the Windows Azure compute emulator.  You can see the compute emulator icon in the Windows system tray:

   ![Compute emulator in system tray][mtas-compute-emulator-icon]






<h2><a name="mailinglist"></a><span class="short-header">Mailing List</span>Create and test the Mailing List controller and views</h2>

### Add the MailingList entity class to the Models folder

The `MailingList` entity class is used for the rows in the `MailingList` table that contain information about the list, such as its description and the "From" email address for emails sent to the list.  

1. In **Solution Explorer**, right-click the Models folder in the MVC project, and choose **Add Existing Item**.

   ![Add existing item to Models folder][mtas-add-existing-item-to-models]

2. Navigate to the folder where you downloaded the sample application, select the MailingList.cs file in the Models folder, and click **Add**.

3. Open MailingList.cs and examine the code.

		public class MailingList : TableServiceEntity
		{
		    public MailingList()
		    {
		        this.RowKey = "0";
		    }
		    
		    [Required]
		    [RegularExpression(@"^[^/\\#?]*$",
		     ErrorMessage = @"/ \ # ? are not allowed")]
            [Display(Name="List Name")]
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
		    [Display(Name="'From' Email Address")]
		    public string FromEmailAddress { get; set; }

		    public string Description { get; set; }
		}
		

   The class derives from [TableServiceEntity][]. The Windows Azure Tables API requires that entity classes you use for table operations include `PartitionKey`, `RowKey`, and `TimeStamp` fields. You could define them yourself, but it's easier to let the `TableServiceEntity` abstract class define them for you.

   ![TableServiceEntity][mtas-tableserviceentity]

   The `TimeStamp` field is intended only for internal system use, but can be used for concurrency handling. (Concurrency handling may be covered in a future release of the tutorial.)

   The `MailingList` class defines a default constructor that sets `RowKey` to "MailingList", because all of the mailing list rows in this table have that value as their row key. (For an explanation of the table structure, see the [first tutorial in the series][firsttutorial].) Any constant value could have been chosen for this purpose, as long as it would never be the same as an email address, which is the row key for the subscriber rows in this table.

   The partition key is the list name. In this model class the partition key value can be accessed either by using the `PartitionKey` property (defined in the `TableServiceEntity` class) or the `ListName` property (defined here).  The `ListName` property uses `PartitionKey` as its backing variable. Defining the `ListName` property enables you to use a more descriptive variable name in code and makes it easier to program the web UI, since formatting and validation DataAnnotations attributes can be added to the `ListName` property, but they can't be added directly to the `PartitionKey` property.

   The `RegularExpression` attribute on the `ListName` property causes MVC to validate user input to ensure that the list name value entered does not contain any characters that are not allowed in Windows Azure Table partition keys.

   The list name and the "from" email address must always be entered when a new `MailingList` entity is created, so they have `Required` attributes.

   The `Display` attributes specify the default caption to be used for a field in the MVC UI. 

### Add the MailingList controller

1. In **Solution Explorer**, right-click the Controllers folder in the MVC project, and choose **Add Existing Item**.

   ![Add existing item to Controllers folder][mtas-add-existing-item-to-controllers]

2. Navigate to the folder where you downloaded the sample application, select the MailingListController.cs file in the Controllers folder, and click **Add**.

3. Open MailingListController.cs and examine the code.

   The default constructor creates a context object that you can use to work with the MailingList table.

        public MailingListController()
        {
            var storageAccount = CloudStorageAccount.Parse(RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));
            // If this is running in a Windows Azure Web Site (not a Cloud Service) use the Web.config file:
            //    var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString);
         
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
            tableClient.CreateTableIfNotExist("MailingList");
            serviceContext = tableClient.GetDataServiceContext();
        }

   The code gets the credentials for your Windows Azure Storage account from the Cloud Service project settings file in order to make a connection to the storage account. (You'll configure those settings before you test the controller.) If you are going to run the MVC project in a Windows Azure Web Site, you can get the connection string from the Web.config file instead.

   The code then creates the context object and makes sure that the `MailingList` table that is used in this controller exists.

   Next is a method that is called whenever the controller needs to look up a specific row of the `MailingList` table, such as to edit a row. The code uses LINQ to look up and pass back a single MailingList entity using the partition key and row key values passed in to it. The rows that this controller edits are the ones that have "MailingList" as the row key, so that could have been hard-coded, but specifying both partition key and row key is a pattern used for the `FindRow` methods in all of the controllers.

        private MailingList FindRow(string partitionKey, string rowKey)
        {
            var mailingList =
                (from e in serviceContext.CreateQuery<MailingList>("MailingList")
                 where e.PartitionKey == partitionKey && e.RowKey == rowKey
                 select e).Single();
            return mailingList;
        }
        
   The Index page displays all of the mailing list rows, so the `Index` method returns all `MailingList` entities that have "MailingList" as the row key (the other rows in the table have email address as the row key and they contain subscriber information).

        public ActionResult Index()
        {
            CloudTableQuery<MailingList> query =
                (from e in serviceContext.CreateQuery<MailingList>("MailingList")
                 where e.RowKey == "MailingList"
                select e).AsTableServiceQuery<MailingList>();
            var lists = new List<MailingList>();
            foreach (MailingList list in query)
            {
                lists.Add(list);
            }
            return View(lists);
        }

   When the user clicks the **Create** button on the Create page, the MVC model binder creates a `MailingList` entity from input entered in the view, and the `HttpPost Create` method adds the entity to the table.

        [HttpPost]
        public ActionResult Create(MailingList mailingList)
        {
            if (ModelState.IsValid)
            {
                serviceContext.AddObject("MailingList", mailingList);
                serviceContext.SaveChangesWithRetries();
                return RedirectToAction("Index");
            }

            return View(mailingList);
        }

	For the Edit page, the `HttpGet Edit` method looks up the row, and the `HttpPost` method updates the row by using the MVC model binder.

        public ActionResult Edit(string partitionKey, string rowKey)
        {
            var mailingList = FindRow(partitionKey, rowKey);
            return View(mailingList);
        }

        [HttpPost]
        public ActionResult Edit(string partitionKey, string rowKey, MailingList editedMailingList)
        {
            if (ModelState.IsValid)
            {
                var mailingList = FindRow(partitionKey, rowKey);
                UpdateModel(mailingList);
                serviceContext.UpdateObject(mailingList);
                serviceContext.SaveChangesWithRetries();
                return RedirectToAction("Index");
            }
            return View(editedMailingList);
        }

   For the Delete page, the `HttpGet Delete` method looks up the row in order to display its contents, and the HttpPost method deletes both the `MailingList` row and the `Subscriber` rows that are associated with it in the `MailingList` table.

        public ActionResult Delete(string partitionKey, string rowKey)
        {
            var mailingList = FindRow(partitionKey, rowKey);
            return View(mailingList);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(string partitionKey, string rowKey)
        {
            // Delete all rows that have this partition key 
            // (Subscriber rows as well as MailingList rows).
            CloudTableQuery<MailingList> query =
                (from e in serviceContext.CreateQuery<MailingList>("MailingList")
                 where e.PartitionKey == partitionKey
                 select e).AsTableServiceQuery<MailingList>();
            var listRows = new List<MailingList>();
            foreach (MailingList list in query)
            {
                serviceContext.DeleteObject(list);
            }
            serviceContext.SaveChangesWithRetries();
            return RedirectToAction("Index");
        }

### Create the MVC views

2. In **Solution Explorer**, create a new folder under the Views folder  in the MVC project, and name it MailingList.

1. Right-click the new Views\MailingList folder, and choose **Add Existing Item**.

   ![Add existing item to Views folder][mtas-add-existing-item-to-views]

2. Navigate to the folder where you downloaded the sample application, select all four of the .cshtml files in the Views\MailingList folder, and click **Add**.

3. Open the Edit.cshtml file and examine the code.

		@model AzureEmailService.Models.MailingList
		
		@{
		    ViewBag.Title = "Edit Mailing List";
		}
		
		<h2>Edit Mailing List</h2>
		
		@using (Html.BeginForm()) {
		    @Html.ValidationSummary(true)
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
		
   This code is typical for MVC views.  Notice that the `ListName` field has a `DisplayFor` helper instead of an `EditorFor` helper. We didn't enable the `MailingList` Edit page to change the list name, because that would have required complex code in the controller:  the `HttpPost Edit` method would have had to delete the existing mailing list row and all associated subscriber rows, and re-insert them all with the new key value. In a production application you might decide that the additional complexity is worthwhile. As you'll see later, the `Subscriber` controller does allow list name changes, since only one row at a time is affected. 

   The Create.cshtml and Delete.cshtml code is similar to Edit.cshtml.

4. Open Index.cshtml and examine the code.

		@model IEnumerable<AzureEmailService.Models.MailingList>
		
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
		
   This code is also typical for MVC views. The Edit and Delete hyperlinks specify partition key and row key query string parameters in order to identify a specific row.  For `MailingList` entities only the partition key is actually needed since row key is always "MailingList", but both are kept so that the MVC view code is consistent across all controllers and views.

### Make MailingList the default controller

1. Open Route.config.cs in the App_Start folder.

2. In the line that specifies defaults, change the default controller from "Home" to "MailingList".

         routes.MapRoute(
             name: "Default",
             url: "{controller}/{action}/{id}",
             defaults: new { controller = "MailingList", action = "Index", id = UrlParameter.Optional }

### Configure the web role to use your test Windows Azure Storage account

If you are building the alternative architecture -- running the web project in a Windows Azure Web Site instead of a Windows Azure Cloud Service web role -- skip this section.

You are going to enter settings for your test storage account, which you will use while running the project locally, but to add a new setting you have to add it for both cloud and local. You can change the cloud value later. You'll also add the same settings for worker role A later.

1. In Solution Explorer, right-click **MvcWebRole** under **Roles** in the **AzureEmailService** cloud project, and then choose **Properties**.

   ![Web role properties][mtas-mvcwebrole-properties-menu]

2. Make sure that **All Configurations** is selected in the **Service Configuration** drop-down list.

2. Select the **Settings** tab and then click **Add Setting**.

3. Enter StorageConnectionString in the **Name** column.

4. Select **Connection String** in the **Type** drop-down list.  
  
5. Click the ellipsis (**...**) at the right end of the line to create a new connection string.

   ![Click ellipsis to create connection string][mtas-mvcwebrole-settings-tab]

6. In the **Storage Account Connection String** dialog box, select *Enter storage account credentials*.

   ![Storage Account Connection String dialog box][mtas-storage-acct-conn-string-dialog]

Next, you'll get the values that need to go in the **Account name** and **Account key** boxes.

7. In a browser window, go to the Windows Azure management portal.

8. Select the **Storage** tab, and then click **Manage keys** at the bottom of the page.

   ![Selecting Manage keys in the portal][mtas-manage-keys-in-portal]

   ![Manage Access Keys dialog box][mtas-manage-access-keys-dialog]

9. Copy the **Storage account name** value, and paste it into the **Account name** box in the **Storage Account Connection String** dialog box in Visual Studio.

9. Copy the **Primary access key** value, and paste it into the **Account key** box in the **Storage Account Connection String** dialog box in Visual Studio.

10. Press CTRL-S to save your changes.

When you added a new setting with the **Add Settings** button, the new setting was added to the XML in the *ServiceDefinition.csdf* file and in each of the two *.cscfg* configuration files. The following XML is added by Visual Studio to the *ServiceDefinition.csdf* file.

    <ConfigurationSettings>
      <Setting name="StorageConnectionString" />
    </ConfigurationSettings>

The following XML is added to each *.cscfg* configuration file.

	<Setting name="StorageConnectionString" value="UseDevelopmentStorage=true" />

You can manually add settings to the *ServiceDefinition.csdf* file and the two *.cscfg* configuration files, but using the properties editor has the following advantages for connection strings:

- You only add the new setting in one place, and the correct setting XML is added to all three files.
- The correct XML is generated for the three settings files. The *ServiceDefinition.csdf* file defines settings that must be in each *.cscfg* configuration file. If the *ServiceDefinition.csdf* file and the two *.cscfg* configuration files settings are inconsistent, you can get the following error message from Visual Studio: *The current service model is out of sync. Make sure both the service configuration and definition files are valid.*

   ![Config error][mtas-er1]

If you get this error, the properties editor will not work until you resolve the inconsistency problem.

### Store a connection string for your test Windows Azure Storage account in the Web.config file

Follow the steps in this section only if you are building the alternative architecture -- running the MVC web project in a Windows Azure Web Site. If you run the web project in a Windows Azure Cloud Service web role, you can't keep the storage connection string in the Web.config file -- you'll get an HTTP 500 error.) 

8. Add a new connection string named StorageConnectionString to the Web.config file, as shown in the following example:

       <connectionStrings>
          <add name="DefaultConnection" connectionString="Data Source=(LocalDb)\v11.0;Initial Catalog=aspnet-MvcWebRole-20121010185535;Integrated Security=SSPI;AttachDBFilename=|DataDirectory|\aspnet-MvcWebRole-20121010185535.mdf" providerName="System.Data.SqlClient" />
          <add name="StorageConnectionString" connectionString="DefaultEndpointsProtocol=https;AccountName=[accountname];AccountKey=[primarykey]" />
       </connectionStrings>

7. In a browser window, go to the Windows Azure management portal.

8. Select the **Storage** tab, and then click **Manage keys** at the bottom of the page.

9. Copy the **Storage account name** value, and paste it over [accountname] in the Web.config file connection string.

9. Copy the **Primary access key** value, and paste it over [primarykey] in the Web.config file connection string.

### Test the application

1. Run the project by pressing F5

    ![Empty MailingList Index page][mtas-mailing-list-empty-index-page]

2. Use the Create function to add some mailing lists, and try the Edit and Delete functions to make sure they work.

    ![MailingList Index page with rows][mtas-mailing-list-index-page]






<h2><a name="subscriber"></a><span class="short-header">Subscriber</span>Create and test the Subscriber controller and views</h2>

### Add the Subscriber entity class to the Models folder

The `Subscriber` entity class is used for the rows in the `MailingList` table that contain information about subscribers to a list, such as the person's email address and whether the address is verified.  

1. In **Solution Explorer**, right-click the Models folder in the MVC project, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select the Subscriber.cs file in the Models folder, and click **Add**.

3. Open Subscriber.cs and examine the code.

        using Microsoft.WindowsAzure.StorageClient;
        using System.Collections.Generic;
        using System.ComponentModel.DataAnnotations;

		namespace AzureEmailService.Models
		{
		    public class Subscriber : TableServiceEntity
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
		
		        [Display(Name = "Subscriber GUID")]
		        public string SubscriberGUID { get; set; }
		
                public bool? Verified { get; set; }
		    }
		}
		

   Like the `MailingList` entity class, the `Subscriber` entity class is used to read and write rows in the `MailingList` table. `Subscriber` rows have email address instead of the constant "MailingList" in the row key.  (For an explanation of the table structure, see the [first tutorial in the series][firsttutorial].) Therefore an `EmailAddress` property is defined that uses the `RowKey` property as its backing field, the same way that `ListName` uses `PartitionKey` as its backing field.
   As explained earlier, this enables you to put formatting and validation DataAnnotations attributes on the properties.

   The `SubscriberGUID` value is generated when the email address is added to a list. It is used in subscribe and unsubscribe links so that it's difficult to subscribe or unsubscribe someone else's email address.
 
   When a row is initially created for a new subscriber, the `Verified ` value is `false`. The `Verified` value changes to `true` only after the new subscriber clicks the **Confirm** hyperlink in the welcome email. If a message is sent to a list while a subscriber has `Verified` = `false`, no email is sent to that subscriber.

   The `Verified` property is defined as nullable, because when this entity is used to read rows from the table, some of the rows might be mailing list rows rather than subscriber rows. For example, suppose you execute a query like the following one:

           CloudTableQuery<Subscriber> query =
                 (from e in serviceContext.CreateQuery<Subscriber>("MailingList")
                  where e.Verified == true
                  select e).AsTableServiceQuery<Subscriber>();

   This query reads through the `MailingList` table using the `Subscriber` model to instantiate rows. When it reads a mailing list row, the row doesn't have a `Verified` property, so an exception would be thrown if `Verified` were not nullable, since the code would not know what value to set it.

### Add the Subscriber controller

1. In **Solution Explorer**, right-click the Controllers folder in the MVC project, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select the SubscriberController.cs file in the Controllers folder, and click **Add**. (Make sure that you get Subscriber.cs and not Subscribe.cs; you'll add Subscribe.cs later.)

3. Open SubscriberController.cs and examine the code.

   Most of the code in this controller is similar to what you saw in the `MailingList` controller. Even the table name is the same because subscriber information is kept in the `MailingList` table. After the `FindRow` method you see a `GetListNames` method. This method gets the data for a drop-down list on the Create and Edit pages from which you can select the mailing list to subscribe an email address to.

        private List<MailingList> GetListNames()
        {
            CloudTableQuery<MailingList> query =
                (from e in serviceContext.CreateQuery<MailingList>("MailingList")
                 where e.RowKey == "MailingList"
                 select e).AsTableServiceQuery<MailingList>();
            var lists = new List<MailingList>();
            foreach (MailingList list in query)
            {
                lists.Add(list);
            }
            return lists;
        }

   This is the same query you saw in the `MailingList` controller. For this list you want the rows that have information about the mailing lists, so you select only those that have RowKey = "MailingList".

   For the method that retrieves data for the Index page, you want the rows that have subscriber information, so you select all rows that do not have RowKey = "MailingList".

        public ActionResult Index()
        {
            CloudTableQuery<Subscriber> query =
                 (from e in serviceContext.CreateQuery<Subscriber>("MailingList")
                  where e.RowKey != "MailingList"
                  select e).AsTableServiceQuery<Subscriber>();
            var subscribers = new List<Subscriber>();
            foreach (Subscriber subscriber in query)
            {
                subscribers.Add(subscriber);
            }

            return View(subscribers);
        }

   In the `HttpGet Create` method, you set up data for the drop-down list; and in the `HttpPost` method, you set default values before saving the new entity.

        public ActionResult Create()
        {
            var lists = GetListNames();
            ViewBag.ListName = new SelectList(lists, "ListName", "Description");
            var model = new Subscriber() { Verified = false};
            return View(model);
        }

        [HttpPost]
        public ActionResult Create(Subscriber subscriber)
        {
            if (ModelState.IsValid)
            {
                subscriber.SubscriberGUID = Guid.NewGuid().ToString();
                if (subscriber.Verified.HasValue == false)
                {
                    subscriber.Verified = false;
                }

                serviceContext.AddObject("MailingList", subscriber);
                serviceContext.SaveChangesWithRetries();
                return RedirectToAction("Index");
            }

            var lists = GetListNames();
            ViewBag.ListName = new SelectList(lists, "ListName", "Description", subscriber.ListName);

            return View(subscriber);
        }

	The `Edit HttpPost` page is more complex than what you saw in the `MailingList` controller because the `Subscriber` page enables you to change the list name or email address, which are key fields. If the user changes one of these fields, you have to delete the existing record and add a new one instead of updating the existing record.

        [HttpPost]
        public ActionResult Edit(string partitionKey, string rowKey, string listName, string emailAddress)
        {
            var subscriber = FindRow(partitionKey, rowKey);

            if (ModelState.IsValid)
            {
                if (listName == partitionKey && emailAddress == rowKey)
                {
                    //Keys didn't change -- Update the row
                    UpdateModel(subscriber, "", null, new string[] { "PartitionKey", "RowKey" });
                    serviceContext.UpdateObject(subscriber);
                    serviceContext.SaveChangesWithRetries();
                    return RedirectToAction("Index");
                }
                else
                {
                    //Keys changed -- Add a new row and delete the old row.
                    var newSubscriber = new Subscriber();
                    UpdateModel(newSubscriber, "", null, new string[] { "PartitionKey", "RowKey" });
                    serviceContext.AddObject("MailingList", newSubscriber);
                    serviceContext.DeleteObject(subscriber);
                    serviceContext.SaveChangesWithRetries();
                    return RedirectToAction("Index");
                }
            }

            var lists = GetListNames();
            ViewBag.ListName = new SelectList(lists, "ListName", "Description", listName);

            return View(subscriber);
        }

    The parameters that the MVC model binder passes to the `Edit` method include the original list name and email address values (in the `partitionKey` and `rowKey` parameters) and the values entered by the user (in the `listName` and `emailAddress` parameters). If either key value changes, the existing record is deleted and a new one created.

    The parameters passed to the `UpdateModel` method exclude `PartitionKey` and `RowKey` properties from model binding. 

                    UpdateModel(newSubscriber, "", null, new string[] { "PartitionKey", "RowKey" });

    The reason for this is that the `ListName` and `EmailAddress` properties use `PartitionKey` and `RowKey` as their backing properties, and the user might have changed one of these values. When the model binder updates the model by setting the `ListName` property, the `PartitionKey` property is automatically updated. If the model binder were to update the `PartitionKey` property with that property's original value after updating the `ListName` property, it would overwrite the new value that was set by the `ListName` property.

### Create the MVC views

2. In **Solution Explorer**, create a new folder under the Views folder in the MVC project, and name it Subscriber.

1. Right-click the new Views\Subscriber folder, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select all five of the .cshtml files in the Views\Subscriber folder, and click **Add**.

3. Open the Edit.cshtml file and examine the code.

@model MvcWebRole.Models.Subscriber

@{
    ViewBag.Title = "Edit Subscriber";
}

<h2>Edit Subscriber</h2>

		@using (Html.BeginForm()) {
		    @Html.AntiForgeryToken()
		    @Html.ValidationSummary(true)
            @Html.HiddenFor(model => model.SubscriberGUID)
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
				
   This code is similar to what you saw earlier for the `MailingList` Edit view. The `SubscriberGUID` value is not editable, so the code specifies the `DisplayFor` helper for it instead of the `EditorFor` helper. This means the value is not automatically provided in a form field for the `HttpPost` controller method, so a hidden field is specified to preserve this value.

   The other views contain code that is similar to what you already saw for the MailingList controller.

### Test the application

1. Run the project by pressing F5, then click **Subscribers** to display the Subscribers page.

    ![Empty Subscriber Index page][mtas-subscribers-empty-index-page]

2. Use the Create function to add some mailing lists, and try the Edit and Delete functions to make sure they work.

    ![Subscribers Index page with rows][mtas-subscribers-index-page]






<h2><a name="message"></a><span class="short-header">Message</span>Create and test the Message controller and views</h2>

### Add the Message entity class to the Models folder

The Message entity class is used for the rows in the Message table that contain information about a message that is scheduled to be sent to a list, such as the subject line, the list to send it to, and the scheduled date to send it. 

1. In **Solution Explorer**, right-click the Models folder in the MVC project, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select the Message.cs file in the Models folder, and click **Add**.

3. Open Message.cs and examine the code.

		using Microsoft.WindowsAzure.StorageClient;
		using System;
		using System.ComponentModel.DataAnnotations;
		
		namespace AzureEmailService.Models
		{
		    public class Message : TableServiceEntity
		    {
		        public Message()
		        {
		            this.RowKey = "0";
                    this.PartitionKey = DateTime.Now.Ticks.ToString();
		        }
		
		        [Required]
		        [Display(Name = "Scheduled Date")]
		        // DataType.Date shows Date only (not time) and allows easy hook-up of jQuery DatePicker
		        [DataType(DataType.Date)]
		        public DateTime? ScheduledDate { get; set; }
		
		        public long MessageRef
		        {
		            get
		            {
		                return long.Parse(this.PartitionKey);
		            }
		            set
		            {
		                this.PartitionKey = value.ToString();
		            }
		        }
		
		        [Required]
		        [Display(Name = "List Name")]
		        public string ListName { get; set; }
		
		        [Required]
		        [Display(Name = "Subject Line")]
		        public string SubjectLine { get; set; }
		
		        [Display(Name = "Status")]
		        public string Status { get; set; }
		        
		    }
		}

   The `Message` class defines a default constructor that sets the partition key (also known as `MessageRef`) to a unique identifier for the message. The constructor also sets the row key to "Message".  In the `Message` table, there is a row with row key = "Message" for each message, followed by rows with row key = email address for each email to be sent or that has been sent. 

   The `MessageRef` value is created by getting the `Ticks` value from `DateTime.Now`. This ensures that by default when displaying messages in the web UI they will be displayed in the order in which they were created. (You could use a GUID for this field, but then the default retrieval order would be random.)

   For more information about the `Message` table structure, see the [first tutorial in the series][firsttutorial].

### Add the Message controller

1. In **Solution Explorer**, right-click the Controllers folder in the MVC project, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select the MessageController.cs file in the Controllers folder, and click **Add**.

3. Open MessageController.cs and examine the code.

   Most of the code in this controller is similar to what you saw in the `Subscriber` controller. What is new here is code for working with blobs. For each message, the HTML and plain text content of the email is uploaded in the form of .htm and .txt files.

   Blobs are stored in blob containers. The Windows Azure Email Service application stores all of its blobs in a single blob container named "azuremailblobcontainer", and code in the controller constructor creates the container if it doesn't already exist:

        public MessageController()
        {
            var storageAccount = CloudStorageAccount.Parse(RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));
            // If this is running in a Windows Azure Web Site (not a Cloud Service) use the Web.config file:
            //    var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString);

            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
            tableClient.CreateTableIfNotExist("Message");
            serviceContext = tableClient.GetDataServiceContext();

            // Create blob container for email body blobs.
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            blobContainer = blobClient.GetContainerReference("azuremailblobcontainer");
            blobContainer.CreateIfNotExist();
        }

   For each file that a user selects to upload, the MVC view provides an `HttpPostedFile` object that contains information about the file. When the user creates a new message, the `HttpPostedFile` object is used to save the file to a blob. When the user edits a message, the user can choose to upload a replacement file or leave the blob unchanged.

   The controller includes a method that the `HttpPost Create` and `Edit` methods call to save a blob:

        private void SaveBlob(string blobName, HttpPostedFileBase httpPostedFile)
        {
            // Retrieve reference to a blob 
            CloudBlob blob = blobContainer.GetBlobReference(blobName);
            // Create or overwrite the  blob with contents from a local file
            using (var fileStream = httpPostedFile.InputStream)
            {
                blob.UploadFromStream(fileStream);
            }
        }

   The `HttpPost Create` method saves the two blobs and then adds the `Message` table row. Blobs are named by concatenating the `MessageRef` value with the file name extension ".htm" or ".txt". 

        [HttpPost]
        public ActionResult Create(Message message, HttpPostedFileBase file, HttpPostedFileBase TxtFile)
        {

            if (file == null)
                ModelState.AddModelError("", "Please provide an HTML file path");

            if (TxtFile == null)
                ModelState.AddModelError("", "Please provide an Text file path");


            if (ModelState.IsValid)
            {
                message.MessageRef = DateTime.Now.Ticks;
                message.Status = "Pending";

                SaveBlob(message.MessageRef + ".htm", file);
                SaveBlob(message.MessageRef + ".txt", TxtFile);

                serviceContext.AddObject("Message", message);
                serviceContext.SaveChangesWithRetries();

                return RedirectToAction("Index");
            }

            var lists = GetListNames();
            ViewBag.ListName = new SelectList(lists, "ListName", "Description");
            return View(message);
        }

   In the `HttpPost Edit` method, the code saves a new blob only if the user chose to upload a new file. 
 
        [HttpPost]
        public ActionResult Edit(string partitionKey, string rowKey, Message editedMsg,
            DateTime scheduledDate, HttpPostedFileBase httpFile, HttpPostedFileBase txtFile)
        {

            if (ModelState.IsValid)
            {
                var message = FindRow(partitionKey, rowKey);

                var excludePropLst = new List<string>();
                excludePropLst.Add("PartitionKey");
                excludePropLst.Add("RowKey");

                if (httpFile == null)
                {
                    // They didn't enter a path, so don't update the file
                    excludePropLst.Add("HtmlPath");
                }
                else
                {
                    // They DID navigate to a file, assume it's changed
                    SaveBlob(editedMsg.MessageRef + ".htm", httpFile);
                }

                if (txtFile == null)
                {
                    excludePropLst.Add("TextPath");
                }
                else
                {
                    SaveBlob(editedMsg.MessageRef + ".txt", httpFile);
                }

                string[] excludeProperties = excludePropLst.ToArray();

                UpdateModel(message, "", null, excludeProperties);
                serviceContext.UpdateObject(message);
                serviceContext.SaveChangesWithRetries();
                return RedirectToAction("Index");
            }

            var lists = GetListNames();
            ViewBag.ListName = new SelectList(lists, "ListName", "Description", editedMsg.ListName);

            return View(editedMsg);
        }

   The `HttpPost Delete` method deletes the blobs when it deletes the row in the table:

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(String partitionKey, string rowKey)
        {
            var message = FindRow(partitionKey, rowKey);

            DeleteBlob(message.MessageRef + ".htm");
            DeleteBlob(message.MessageRef + ".txt");
            serviceContext.DeleteObject(message);
            serviceContext.SaveChangesWithRetries();
            return RedirectToAction("Index");
        }

        private void DeleteBlob(string blobName)
        {
            // Retrieve reference to a blob 
            CloudBlob blob = blobContainer.GetBlobReference(blobName);
            blob.Delete();
        }

### Create the MVC views

2. In **Solution Explorer**, create a new folder under the Views folder  in the MVC project, and name it Message.

1. Right-click the new Views\Message folder, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select all five of the .cshtml files in the Views\Message folder, and click **Add**.

3. Open the Edit.cshtml file and examine the code.

		@model AzureEmailService.Models.Message
		
		@{
		    ViewBag.Title = "Edit Message";
		}
		
		<h2>Edit Message</h2>
		
		@using (Html.BeginForm("Edit", "Message", FormMethod.Post, new { enctype = "multipart/form-data" }))
		{
		    @Html.ValidationSummary(true)
		
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
		            @Html.LabelFor(model => model.ScheduledDate)
		        </div>
		        <div class="editor-field">
		            @Html.EditorFor(model => model.ScheduledDate)
		            @Html.ValidationMessageFor(model => model.ScheduledDate)
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

   A hidden field is also included for the `MessageRef` property. This is the same value as the partition key, but it is included for code clarity in the `HttpPost Edit` method. Including the `MessageRef` hidden field enables the code in the `HttpPost Edit` method to refer to the `MessageRef` value by that name when it constructs file names for the blobs. 
   
   The other views contain code that is similar to the Edit view or the other views you saw for the other controllers.

### Test the application

1. Run the project by pressing F5, then click **Messages** to open the Messages Index page.

    ![Empty Message Index page][mtas-message-empty-index-page]

2. Use the Create function to add some mailing lists, and try the Edit and Delete functions to make sure they work.

    ![Subscribers Index page with rows][mtas-message-index-page]




<h2><a name="unsubscribe"></a><span class="short-header">Unsubscribe</span>Create and test the Unsubscribe controller and view</h2>

### Add the Unsubscribe view model to the Models folder

The UnsubscribeVM view model is used to pass data between the Unsubscribe controller and its view.  

1. In **Solution Explorer**, right-click the Models folder in the MVC project, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select the UnsubscribeVM.cs file in the Models folder, and click **Add**.

3. Open UnsubscribeVM.cs and examine the code.


	    public class UnsubscribeVM
	    {
	        public string EmailAddress { get; set; }
	        public string ListName { get; set; }
	        public string ListDescription { get; set; }
	        public string SubscriberGUID { get; set; }
	        public bool? Confirmed { get; set; }
	    }

   Unsubscribe links contain the SubscriberGUID. That is used to get the email address, list name, and list description from the MailingList table. The view displays the email address and the description of the list that is to be unsubscribed from, and it displays a Confirm button that the user must click to complete the unsubscription process.

### Add the Unsubscribe controller

1. In **Solution Explorer**, right-click the Controllers folder in the MVC project, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select the UnsubscribeController.cs file in the Controllers folder, and click **Add**.

3. Open UnsubscribeController.cs and examine the code.

   This controller has an `HttpGet Index` method that displays the initial unsubscribe page, and an `HttpPost Index` method that processes the **Confirm** or **Cancel** button.

   The `HttpGet Index` method uses the guid in the query string to get the `MailingList` table row for the subscriber. Then it puts all the information needed by the view in the view model and displays the unsubscribe page. It sets the `Confirmed` property to null in order to tell the view to display the initial unsubscribe page.

        public ActionResult Index(string guid)
        {
            var subscriberTableRow =
                (from e in serviceContext.CreateQuery<Subscriber>("MailingList")
                 where e.SubscriberGUID == guid
                 select e).Single();

            var unsubscribeVM = new UnsubscribeVM();
            unsubscribeVM.EmailAddress = MaskEmail(subscriberTableRow.EmailAddress);
            unsubscribeVM.ListDescription = FindRow(subscriberTableRow.ListName, "MailingList").Description;
            unsubscribeVM.SubscriberGUID = guid;
            unsubscribeVM.Confirmed = null;
            return View(unsubscribeVM);
        }

   The HttpPost Index method again uses the GUID to get the subscriber information and populates the view model properties. Then, if the Confirm button was clicked, it deletes the subscriber row in the `MailingList` table. If the **Confirm** button was pressed it sets the `Confirm` property to `true`, otherwise it sets the `Confirm` property to `false`. This is what tells the view to display the unsubscribe confirmed or unsubscribe canceled page.

        [HttpPost] 
        [ValidateAntiForgeryToken]
        public ActionResult Index(string subscriberGUID, string action)
        {
            var subscriberTableRow =
                (from e in serviceContext.CreateQuery<Subscriber>("MailingList")
                 where e.SubscriberGUID == subscriberGUID
                 select e).Single();

            var unsubscribeVM = new UnsubscribeVM();
            unsubscribeVM.EmailAddress = MaskEmail(subscriberTableRow.EmailAddress);
            unsubscribeVM.ListDescription = FindRow(subscriberTableRow.ListName, "MailingList").Description;
            unsubscribeVM.SubscriberGUID = subscriberGUID;
            unsubscribeVM.Confirmed = false;

            if (action == "Confirm")
            {
                unsubscribeVM.Confirmed = true;
                serviceContext.DeleteObject(subscriberTableRow);
                serviceContext.SaveChangesWithRetries();
            }

            return View(unsubscribeVM);
        }

### Create the MVC views

2. In **Solution Explorer**, create a new folder under the Views folder  in the MVC project, and name it Unsubscribe.

1. Right-click the new Views\Unsubscribe folder, and choose **Add Existing Item**.

2. Navigate to the folder where you downloaded the sample application, select the Index.cshtml files in the Views\Unsubscribe folder, and click **Add**.

3. Open the Index.cshtml file and examine the code.
		
		@model MvcWebRole.Models.UnsubscribeVM
		
		@{
		    ViewBag.Title = "Unsubscribe";
		    Layout = null;
		}
		
		<h2>Email List Subscription Service</h2>
		
		@using (Html.BeginForm()) {
		    @Html.ValidationSummary(true)
		
		    <fieldset>
		        <legend>Unsubscribe from Mailing List</legend>
		
		        @Html.HiddenFor(model => model.SubscriberGUID)
		
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
				
   The Layout = null line specifies that the _Layout.cshtml file should not be used to display this page. The unsubscribe page displays a very simple UI without the headers and footers that are used for the administrator pages.

   In the body of the page, the `Confirmed` property determines what will be displayed on the page:  **Confirm** and **Cancel** buttons if the property is null, unsubscribe-confirmed message if the property is true, unsubscribe-canceled message if the property is false.

### Test the application

1. Run the project by pressing F5, then click **Subscribers** to open the **Subscribers** Index page.

2. Click Create and create a new subscriber for any mailing list that you created when you were testing earlier.

   Leave the browser window open on the Subscribers Index page.

3. Open Azure Storage Explorer, and then select your test storage account.

4. Click **Tables** under **Storage Type**, select the **MailingList** table, and then click **Query**.

5. Double-click the subscriber row that you added.

    ![Azure Storage Explorer][mtas-ase-unsubscribe]

6. In the **Edit Entity** dialog box, select and copy the `SubscriberGUID` value.

    ![Azure Storage Explorer][mtas-ase-edit-entity-unsubscribe]

7. Switch back to your browser window.  In the address bar of the browser, change "Subscriber" in the URL to "unsubscribe?guid=[guidvalue]" where in place of [guidvalue] you paste in the guid that you copied from Azure Storage Explorer.  For example:

        http://127.0.0.1/unsubscribe?guid=b7860242-7c2f-48fb-9d27-d18908ddc9aa

   The unsubscribe page that asks for confirmation is displayed:

    ![Unsubscribe page][mtas-unsubscribe-page]

2. Click Confirm and you see the unsubscribe confirmed page.

    ![Unsubscribe confirmed page][mtas-unsubscribe-confirmed-page]

3. Go back to the Subscribers Index page to verify that the subscriber row is no longer there.

<h2><a name="nextsteps"></a><span class="short-header">Next steps</span>Next steps</h2>

In the [next tutorial][nexttutorial] you'll configure and program worker role A.

[createsolution]: #cloudproject
[mailinglist]: #mailinglist
[message]: #message
[subscriber]: #subscriber
[webapi]: #webapi
[nextsteps]: #nextsteps

[firsttutorial]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/1-overview/
[nexttutorial]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/4-worker-role-a/
[TableServiceEntity]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.storageclient.tableserviceentity.aspx

[mtas-compute-emulator-icon]: ../Media/mtas-compute-emulator-icon.png
[mtas-home-page-before-adding-controllers]: ../Media/mtas-home-page-before-adding-controllers.png
[mtas-menu-in-layout]: ../Media/mtas-menu-in-layout.png
[mtas-footer-in-layout]: ../Media/mtas-footer-in-layout.png
[mtas-title-and-logo-in-layout]: ../Media/mtas-title-and-logo-in-layout.png
[mtas-new-cloud-service-dialog-rename]: ../Media/mtas-new-cloud-service-dialog-rename.png
[mtas-new-mvc4-project]: ../Media/mtas-new-mvc4-project.png
[mtas-new-cloud-service-dialog]: ../Media/mtas-new-cloud-service-dialog.png
[mtas-new-cloud-project]: ../Media/mtas-new-cloud-project.png
[mtas-new-cloud-service-add-worker-a]: ../Media/mtas-new-cloud-service-add-worker-a.png
[mtas-mailing-list-empty-index-page]: ../Media/mtas-mailing-list-empty-index-page.png
[mtas-mailing-list-index-page]: ../Media/mtas-mailing-list-index-page.png
[mtas-file-new-project]: ../Media/mtas-file-new-project.png
[mtas-opening-layout-cshtml]: ../Media/mtas-opening-layout-cshtml.png
[mtas-tableserviceentity]: ../Media/mtas-tableserviceentity.png
[mtas-add-existing-item-to-models]: ../Media/mtas-add-existing-item-to-models.png
[mtas-add-existing-item-to-controllers]: ../Media/mtas-add-existing-item-to-controllers.png
[mtas-add-existing-item-to-views]: ../Media/mtas-add-existing-item-to-views.png
[mtas-mvcwebrole-properties-menu]: ../Media/mtas-mvcwebrole-properties-menu.png
[mtas-mvcwebrole-settings-tab]: ../Media/mtas-mvcwebrole-settings-tab.png
[mtas-storage-acct-conn-string-dialog]: ../Media/mtas-storage-acct-conn-string-dialog.png
[mtas-manage-keys-in-portal]: ../Media/mtas-manage-keys-in-portal.png
[mtas-manage-access-keys-dialog]: ../Media/mtas-manage-access-keys-dialog.png
[mtas-subscribers-empty-index-page]: ../Media/mtas-subscribers-empty-index-page.png
[mtas-subscribers-index-page]: ../Media/mtas-subscribers-index-page.png
[mtas-message-empty-index-page]: ../Media/mtas-message-empty-index-page.png
[mtas-message-index-page]: ../Media/mtas-message-index-page.png
[mtas-ase-edit-entity-unsubscribe]: ../Media/mtas-ase-edit-entity-unsubscribe.png
[mtas-ase-unsubscribe]: ../Media/mtas-ase-unsubscribe.png
[mtas-unsubscribe-page]: ../Media/mtas-unsubscribe-query-page.png
[mtas-unsubscribe-confirmed-page]: ../Media/mtas-unsubscribe-confirmation-page.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png

