<properties pageTitle=".NET website with MongoDB on a virtual machine - Azure" description="A tutorial that teaches you how to use Git to deploy an ASP.NET app to an Azure website connected to MongoDB on a virtual machine." services="web-sites, virtual-machines" documentationCenter=".net" authors="cephalin" manager="wpickett" editor=""/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="11/24/2014" ms.author="cephalin"/>


# Create an Azure website that connects to MongoDB running on a virtual machine in Azure

Using Git, you can deploy an ASP.NET application to an Azure website. In this tutorial, you will build a simple front-end ASP.NET MVC task list application that connects to a MongoDB database running in a virtual machine in Azure.  [MongoDB][MongoDB] is a popular open source, high performance NoSQL database. After running and testing the ASP.NET application on your development computer, you will upload the application to an Azure website using Git.

[AZURE.INCLUDE [create-account-and-websites-and-vms-note](../includes/create-account-and-websites-and-vms-note.md)]



##Overview##

In this tutorial you will:

- [Create a virtual machine and install MongoDB](#virtualmachine)
- [Create and run the My Task List ASP.NET application on your development computer](#createapp)
- [Create an Azure web site](#createwebsite)
- [Deploy the ASP.NET application to the web site using Git](#deployapp)


##Background knowledge##

Knowledge of the following is useful for this tutorial, though not required:

* The C# driver for MongoDB. For more information on developing C# applications against MongoDB, see the MongoDB [CSharp Language Center][MongoC#LangCenter]. 
* The ASP .NET web application framework. You can learn all about it at the [ASP.net web site][ASP.NET].
* The ASP .NET MVC web application framework. You can learn all about it at the [ASP.NET MVC web site][MVCWebSite].
* Azure. You can get started reading at [Azure][WindowsAzure].


##Preparation##

In this section you will learn how to create a virtual machine in Azure and install MongoDB, and set up your development environment.

<a id="virtualmachine"></a> 
###Create a virtual machine and install MongoDB###

This tutorial assumes you have created a virtual machine in Azure. After creating the virtual machine you need to install MongoDB on the virtual machine:

* To create a Windows virtual machine and install MongoDB, see [Install MongoDB on a virtual machine running Windows Server in Azure][InstallMongoOnWindowsVM].
* Alternatively, to create a Linux virtual machine and install MongoDB, see [Install MongoDB on a virtual machine running CentOS Linux in Azure][InstallMongoOnCentOSLinuxVM].

After you have created the virtual machine in Azure and installed MongoDB, be sure to remember the DNS name of the virtual machine ("testlinuxvm.cloudapp.net", for example) and the external port for MongoDB that you specified in the endpoint.  You will need this information later in the tutorial.

### Install Visual Studio###

Start by installing and running  [Visual Studio Express 2013 for Web] [VSEWeb] or [Visual Studio 2013] [VSUlt].

Visual Studio is an IDE, or integrated development environment. Just like you use Microsoft Word to write documents, you'll use an IDE to create applications. This tutorial uses Microsoft Visual Studio 2013, but you can use Microsoft Visual Studio Express 2013, which is a free version of Microsoft Visual Studio.

<a id="createapp"></a>
##Create and run the My Task List ASP.NET application on your development computer##

In this section you will create an ASP.NET application called "My Task List" by using Visual Studio.  You will run the application locally, but it will connect to your virtual machine on Azure and use the MongoDB instance that you created there.

###Create the application###
In Visual Studio, click **New Project**.

![Start Page New Project][StartPageNewProject]

In the **New Project** window, in the left pane, select **Visual C#**, and then select **Web**. In the middle pane, select **ASP.NET  Web Application**. At the bottom, name your project "MyTaskListApp," and then click **OK**.

![New Project Dialog][NewProjectMyTaskListApp]

In the **New ASP.NET Project** dialog box, select **MVC**, and then click **OK**.

![Select MVC Template][VS2013SelectMVCTemplate]

After the project completes, the default page created by the template appears.

![Default ASP.NET MVC Application][VS2013DefaultMVCApplication]

###Install the MongoDB C# driver

MongoDB offers client-side support for C# applications through a driver, which you need to install on your local development computer. The C# driver is available through NuGet.

To install the MongoDB C# driver:

1. In **Solution Explorer**, under the **MyTaskListApp** project, right-click **References** and select **Manage NuGetPackages**.

	![Manage NuGet Packages][VS2013ManageNuGetPackages]

2. In the **Manage NuGet Packages** window, in the left pane, click **Online**. In the **Search Online** box on the right, type "mongocsharpdriver".  Click **Install** to install the driver.

	![Search for MongoDB C# Driver][SearchforMongoDBCSharpDriver]

3. Click **I Accept** to accept the 10gen, Inc. license terms.

4. Click **Close** after the driver has installed.
	![MongoDB C# Driver Installed][MongoDBCsharpDriverInstalled]


The MongoDB C# driver is now installed.  References to the **MongoDB.Driver.dll** and **MongoDB.Bson.dll** libraries have been added to the project.

![MongoDB C# Driver References][MongoDBCSharpDriverReferences]

###Add a model###
In **Solution Explorer**, right-click the *Models* folder and **Add** a new **Class** and name it *TaskModel.cs*.  In *TaskModel.cs*, replace the existing code with the following code:

	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Web;
	using MongoDB.Bson.Serialization.Attributes;
	using MongoDB.Bson.Serialization.IdGenerators;
	using MongoDB.Bson;
	
	namespace MyTaskListApp.Models
	{
	    public class MyTask
	    {
	        [BsonId(IdGenerator = typeof(CombGuidGenerator))]
	        public Guid Id { get; set; }
	
	        [BsonElement("Name")]
	        public string Name { get; set; }
	
	        [BsonElement("Category")]
	        public string Category { get; set; }
	
	        [BsonElement("Date")]
	        public DateTime Date { get; set; }
	
	        [BsonElement("CreatedDate")]
	        public DateTime CreatedDate { get; set; }
	
	    }
	}

###Add the data access layer###
In **Solution Explorer**, right-click the *MyTaskListApp* project and **Add** a **New Folder** named *DAL*.  Right-click the *DAL* folder and **Add** a new **Class**. Name the class file *Dal.cs*.  In *Dal.cs*, replace the existing code with the following code:

	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Web;
	using MyTaskListApp.Models;
	using MongoDB.Driver;
	using System.Configuration;
	
	namespace MyTaskListApp
	{
	    public class Dal : IDisposable
	    {
	        private MongoServer mongoServer = null;
	        private bool disposed = false;
	
	        // To do: update the connection string with the DNS name
			// or IP address of your server. 
			//For example, "mongodb://testlinux.cloudapp.net"
	        private string connectionString = "mongodb://<vm-dns-name>";
	
	        // This sample uses a database named "Tasks" and a 
			//collection named "TasksList".  The database and collection 
			//will be automatically created if they don't already exist.
	        private string dbName = "Tasks";
	        private string collectionName = "TasksList";
	
	        // Default constructor.        
	        public Dal()
	        {
	        }        
	
	        // Gets all Task items from the MongoDB server.        
	        public List<MyTask> GetAllTasks()
	        {
	            try
	            {
	                MongoCollection<MyTask> collection = GetTasksCollection();
	                return collection.FindAll().ToList<MyTask>();
	            }
	            catch (MongoConnectionException)
	            {
	                return new List<MyTask >();
	            }
	        }
	
	        // Creates a Task and inserts it into the collection in MongoDB.
	        public void CreateTask(MyTask task)
	        {
	            MongoCollection<MyTask> collection = GetTasksCollectionForEdit();
	            try
	            {
	                collection.Insert(task, SafeMode.True);
	            }
	            catch (MongoCommandException ex)
	            {
	                string msg = ex.Message;
	            }
	        }
	
	        private MongoCollection<MyTask> GetTasksCollection()
	        {
	            MongoServer server = MongoServer.Create(connectionString);
	            MongoDatabase database = server[dbName];
	            MongoCollection<MyTask> todoTaskCollection = database.GetCollection<MyTask>(collectionName);
	            return todoTaskCollection;
	        }
	
	        private MongoCollection<MyTask> GetTasksCollectionForEdit()
	        {
	            MongoServer server = MongoServer.Create(connectionString);
	            MongoDatabase database = server[dbName];
	            MongoCollection<MyTask> todoTaskCollection = database.GetCollection<MyTask>(collectionName);
	            return todoTaskCollection;
	        }
	
	        # region IDisposable
	
	        public void Dispose()
	        {
	            this.Dispose(true);
	            GC.SuppressFinalize(this);
	        }
	
	        protected virtual void Dispose(bool disposing)
	        {
	            if (!this.disposed)
	            {
	                if (disposing)
	                {
	                    if (mongoServer != null)
	                    {
	                        this.mongoServer.Disconnect();
	                    }
	                }
	            }
	
	            this.disposed = true;
	        }
	
	        # endregion
	    }
	}

###Add a controller###
Open the *Controllers\HomeController.cs* file in **Solution Explorer** and replace the existing code with the following:

	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Web;
	using System.Web.Mvc;
	using MyTaskListApp.Models;
	using System.Configuration;
	
	namespace MyTaskListApp.Controllers
	{
	    public class HomeController : Controller, IDisposable
	    {
	        private Dal dal = new Dal();
	        private bool disposed = false;
	        //
	        // GET: /MyTask/
	
	        public ActionResult Index()
	        {
	            return View(dal.GetAllTasks());
	        }
	
	        //
	        // GET: /MyTask/Create
	
	        public ActionResult Create()
	        {
	            return View();
	        }
	
	        //
	        // POST: /MyTask/Create
	
	        [HttpPost]
	        public ActionResult Create(MyTask task)
	        {
	            try
	            {
	                dal.CreateTask(task);
	                return RedirectToAction("Index");
	            }
	            catch
	            {
	                return View();
	            }
	        }
	
	        public ActionResult About()
	        {
	            return View();
	        }
	
	        # region IDisposable
	
	        new protected void Dispose()
	        {
	            this.Dispose(true);
	            GC.SuppressFinalize(this);
	        }
	
	        new protected virtual void Dispose(bool disposing)
	        {
	            if (!this.disposed)
	            {
	                if (disposing)
	                {
	                    this.dal.Dispose();
	                }
	            }
	
	            this.disposed = true;
	        }
	
	        # endregion
	
	    }
	}

###Set up the site style###
To change the title at the top of the page, open the *Views\Shared\\_Layout.cshtml* file in **Solution Explorer** and replace "Application name" in the navbar header with "My Task List Application" so that it looks like this:

 	@Html.ActionLink("My Task List Application", "Index", "Home", null, new { @class = "navbar-brand" })

In order to set up the Task List menu, open the *\Views\Home\Index.cshtml* file and replace the existing code with the following code:
	
	@model IEnumerable<MyTaskListApp.Models.MyTask>
	
	@{
	    ViewBag.Title = "My Task List";
	}
	
	<h2>My Task List</h2>
	
	<table border="1">
	    <tr>
	        <th>Task</th>
	        <th>Category</th>
	        <th>Date</th>
	        
	    </tr>
	
	@foreach (var item in Model) {
	    <tr>
	        <td>
	            @Html.DisplayFor(modelItem => item.Name)
	        </td>
	        <td>
	            @Html.DisplayFor(modelItem => item.Category)
	        </td>
	        <td>
	            @Html.DisplayFor(modelItem => item.Date)
	        </td>
	        
	    </tr>
	}
	
	</table>
	<div>  @Html.Partial("Create", new MyTaskListApp.Models.MyTask())</div>


To add the ability to create a new task, right-click the *Views\Home\\* folder and **Add** a **View**.  Name the view *Create*. Replace the code with the following:

	@model MyTaskListApp.Models.MyTask
	
	<script src="@Url.Content("~/Scripts/jquery-1.10.2.min.js")" type="text/javascript"></script>
	<script src="@Url.Content("~/Scripts/jquery.validate.min.js")" type="text/javascript"></script>
	<script src="@Url.Content("~/Scripts/jquery.validate.unobtrusive.min.js")" type="text/javascript"></script>
	
	@using (Html.BeginForm("Create", "Home")) {
	    @Html.ValidationSummary(true)
	    <fieldset>
	        <legend>New Task</legend>
	
	        <div class="editor-label">
	            @Html.LabelFor(model => model.Name)
	        </div>
	        <div class="editor-field">
	            @Html.EditorFor(model => model.Name)
	            @Html.ValidationMessageFor(model => model.Name)
	        </div>
	
	        <div class="editor-label">
	            @Html.LabelFor(model => model.Category)
	        </div>
	        <div class="editor-field">
	            @Html.EditorFor(model => model.Category)
	            @Html.ValidationMessageFor(model => model.Category)
	        </div>
	
	        <div class="editor-label">
	            @Html.LabelFor(model => model.Date)
	        </div>
	        <div class="editor-field">
	            @Html.EditorFor(model => model.Date)
	            @Html.ValidationMessageFor(model => model.Date)
	        </div>
	
	        <p>
	            <input type="submit" value="Create" />
	        </p>
	    </fieldset>
	}

**Solution Explorer** should look like this:

![Solution Explorer][SolutionExplorerMyTaskListApp]

###Set the MongoDB connection string###
In **Solution Explorer**, open the *DAL/Dal.cs* file. Find the following line of code:

	private string connectionString = "mongodb://<vm-dns-name>";

Replace `<vm-dns-name>` with the DNS name of the virtual machine running MongoDB you created in the [Create a virtual machine and install MongoDB][] step of this tutorial.  To find the DNS name of your virtual machine, go to the Azure Management Portal, select **Virtual Machines**, and find **DNS Name**.

If the DNS name of the virtual machine is "testlinuxvm.cloudapp.net" and MongoDB is listening on the default port 27017, the connection string line of code will look like:

	private string connectionString = "mongodb://testlinuxvm.cloudapp.net";

If the virtual machine endpoint specifies a different external port for MongoDB, you can specifiy the port in the connection string:

 	private string connectionString = "mongodb://testlinuxvm.cloudapp.net:12345";

For more information on MongoDB connection strings, see [Connections][MongoConnectionStrings].

###Test the local deployment###

To run your application on your development computer, select **Start Debugging** from the **Debug** menu or hit **F5**. IIS Express starts and a browser opens and launches the application's home page.  You can add a new task, which will be added to the MongoDB database running on your virtual machine in Azure.

![My Task List Application][TaskListAppBlank]

<h2>Deploy the ASP.NET application to an Azure website</h2>

In this section you will create a website and deploy the My Task List ASP.NET application using Git.

<a id="createwebsite"></a> 
###Create an Azure website###
In this section you will create an Azure website.

1. Open a web browser and browse to the [Azure Management Portal][AzurePortal]. Sign in with your Azure account. 
2. At the bottom of the page, click **+New**, then **Website**, and finally **Quick Create**.
3. Enter a unique prefix for the application's URL.
4. Select a region.
5. Click **Create Website**.

![Create a new web site][WAWSCreateWebSite]

6. Your website will be created quickly and will be listed in **Websites**.

![WAWSDashboardMyTaskListApp][WAWSDashboardMyTaskListApp]

<a id="deployapp"></a> 
###Deploy the ASP.NET application to the website using Git
In this section you will deploy the My Task List application using Git.

1. Click your website name in **Websites**, then click **Dashboard**.  On the right side, under Quick Glance, click **Set up deployment from source control**.
2. On the **Where is your source code?** page, choose **Local Git repository**, and the click the **Next** arrow. 
3. The Git repository should be created quickly. Make note of the instructions on the resulting page as they will be used in the next section.

	![Git Repository is Ready][Image9]

4. Under **Push my local files to Azure** there are instructions for pushing your code to Azure. The instructions will look similar to the following:

	![Push local files to Azure][Image10]
	
5. If you do not have Git installed, install it using the **Get it here** link in step 1.
6. Following the instructions in step 2, commit your local files.  
7. Add the remote Azure repository and push your files to the Azure website by following the instructions in step 3.
8. When the deployment has completed you will see the following confirmation:

	![Deployment Complete][Image11]

9. Your Azure website is now available.  Check the **Dashboard** page for your site and the **Site URL** field to find the URL for your site. Following the procedures in this tutorial, your site would be available at this URL: http://mytasklistapp.azurewebsites.net.

##Summary##

You have now successfully deployed your ASP.NET application to an Azure website.  To view the site, click the link in the **Site URL** field of the **Dashboard** page. For more information on developing C# applications against MongoDB, see [CSharp Language Center][MongoC#LangCenter]. 


<!-- HYPERLINKS -->

[AzurePortal]: http://manage.windowsazure.com
[WindowsAzure]: http://www.windowsazure.com
[MongoC#LangCenter]: http://docs.mongodb.org/ecosystem/drivers/csharp/
[MVCWebSite]: http://www.asp.net/mvc
[ASP.NET]: http://www.asp.net/
[MongoConnectionStrings]: http://www.mongodb.org/display/DOCS/Connections
[MongoDB]: http://www.mongodb.org
[InstallMongoOnCentOSLinuxVM]: /en-us/manage/linux/common-tasks/mongodb-on-a-linux-vm/
[InstallMongoOnWindowsVM]: /en-us/manage/windows/common-tasks/install-mongodb/
[VSEWeb]: http://www.microsoft.com/visualstudio/eng/2013-downloads#d-2013-express
[VSUlt]: http://www.microsoft.com/visualstudio/eng/2013-downloads

<!-- IMAGES -->


[StartPageNewProject]: ./media/web-sites-dotnet-store-data-mongodb-vm/NewProject.png
[NewProjectMyTaskListApp]: ./media/web-sites-dotnet-store-data-mongodb-vm/NewProjectMyTaskListApp.png
[VS2013SelectMVCTemplate]: ./media/web-sites-dotnet-store-data-mongodb-vm/VS2013SelectMVCTemplate.png
[VS2013DefaultMVCApplication]: ./media/web-sites-dotnet-store-data-mongodb-vm/VS2013DefaultMVCApplication.png
[VS2013ManageNuGetPackages]: ./media/web-sites-dotnet-store-data-mongodb-vm/VS2013ManageNuGetPackages.png
[SearchforMongoDBCSharpDriver]: ./media/web-sites-dotnet-store-data-mongodb-vm/SearchforMongoDBCSharpDriver.png
[MongoDBCsharpDriverInstalled]: ./media/web-sites-dotnet-store-data-mongodb-vm/MongoDBCsharpDriverInstalled.png
[MongoDBCSharpDriverReferences]: ./media/web-sites-dotnet-store-data-mongodb-vm/MongoDBCSharpDriverReferences.png
[SolutionExplorerMyTaskListApp]: ./media/web-sites-dotnet-store-data-mongodb-vm/SolutionExplorerMyTaskListApp.png
[TaskListAppBlank]: ./media/web-sites-dotnet-store-data-mongodb-vm/TaskListAppBlank.png
[WAWSCreateWebSite]: ./media/web-sites-dotnet-store-data-mongodb-vm/WAWSCreateWebSite.png
[WAWSDashboardMyTaskListApp]: ./media/web-sites-dotnet-store-data-mongodb-vm/WAWSDashboardMyTaskListApp.png
[Image9]: ./media/web-sites-dotnet-store-data-mongodb-vm/RepoReady.png
[Image10]: ./media/web-sites-dotnet-store-data-mongodb-vm/GitInstructions.png
[Image11]: ./media/web-sites-dotnet-store-data-mongodb-vm/GitDeploymentComplete.png

<!-- TOC BOOKMARKS -->
[Create a virtual machine and install MongoDB]: #virtualmachine
[Create and run the My Task List ASP.NET application on your development computer]: #createapp
[Create an Azure web site]: #createwebsite
[Deploy the ASP.NET application to the web site using Git]: #deployapp
