#Create a Task List ASP.NET Application that Connects to MongoDB

Introduction blah blah blah

You will learn:

* How to create a task list ASP.NET application
* How to create a Windows Azure Web Site
* How to upload your ASP.NET application to the Windows Azure Web Site

You will build a simple front-end ASP.NET MVC task list application

## Background Knowledge

* Using MongoDB in Microsoft Windows. Visit the Windows Reference Center to learn how.
* The ASP .NET web application framework. You can learn all about it at the ASP.net web site.
* The ASP .NET MVC 3.0 web application framework. You can learn all about it at the ASP .NET MVC 3 web site.
* The Windows Azure Platform. You can get started by reading What Is the Windows Azure Platform?

## Overview

1.  Set up virtual machine running MongoDB
2.  Create and run the ASP.NET application locally
3.  Deploy the ASP.NET application to a Windows Azure website using Git

The ASP.NET app you'll build will look like this:
![My Task List Application][Image0]

## Preparation

In this section you will learn how to create a simple Task List ASP.NET application in Visual Studio.

### Set Up the Development Environment

This tutorial uses Microsoft Visual Studio 2010.  You can also use Microsoft Visual Web Developer 2010 Express Service Pack 1, which is a free version of Microsoft Visual Studio. Before you start, make sure you've installed the prerequisites listed below. You can install all of them by clicking the following link: [Web Platform Installer] [WebPlatformInstaller]. Alternatively, you can individually install the prerequisites using the following links:

* [Visual Studio 2010 prerequisites] [VsPreReqs]
* [ASP.NET MVC 3 Tools Update] [MVCPrereqs]

If you're using Visual Web Developer 2010 instead of Visual Studio 2010, install the prerequisites by clicking the following link: [Visual Studio Web Developer Express SP1 prerequisites] [VsWebExpressPreReqs] 

###Install the MongoDB C# driver

Mongo offers client-side support for C# applications through a driver. The C# driver is hosted at github.com. You can download binary builds in either .msi or .zip formats from: <http://github.com/mongodb/mongo-csharp-driver/downloads>.

If you downloaded the .zip file, simply unzip it and place the contents anywhere you want.

If you downloaded the .msi file, double click on the .msi file to run the setup program, which will install the C# driver DLLs in the `C:\Program Files (x86)\MongoDB\CSharp Driver 1.x` directory (the exact path may vary on your system).

### Sign-in or Create a Windows Azure Account

1. Open a web browser, and browse to [http://www.windowsazure.com][WindowsAzure]. Sign in with your Windows Live ID and password. If you don't have a Windows Azure account, you can get started with a free account by clicking **Free trial** in the upper right corner.
3. Follow the steps to set up a trial account.
2. Your account is now created. You are ready to deploy your application to Windows Azure!

## Creating the Task List ASP.NET application and running it locally 

In this section you will...

###Creating the Application
Start by running Visual Studio and select **New Project** from the **Start** page.

Select **Visual C#** and then **Web** on the left and then select **ASP.NET MVC 3 Web Application** from the list of templates. Name your project "MyTaskListApp" and then click **OK**.

![New Project Screen][Image00]

In the **New ASP.NET MVC 3 Project** dialog box, select **Internet Application**. Check **Use HTML5 markup** and leave **Razor** as the default view engine.

Click **OK**.

![New Internet Application][Image1]

###Add References to the C# MongoDB drivers
In **Solution Explorer**, right-click the *References* folder and select *Add Reference...*. Click *Browse* and then navigate to `C:\Program Files (x86)\MongoDB\CSharp Driver 1.x` (or the path that the drivers were installed to). Select `MongoDB.Driver.dll` and `MongoDB.Bson.dll` and click *OK*.

![Add a reference to the C# MongoDB drivers][Image2]

In **Solution Explorer**, right-click the *References/MongoDB.Bson* file and select **Properties**.  In the **Properties** frame, set **Copy Local** to **True**.
![Set MongoDB.Bson Copy Local to True][Image2.1]

In **Solution Explorer**, right-click the *References/MongoDB.Driver* file and select **Properties**.  In the **Properties** frame, set **Copy Local** to **True**.
![Set MongoDB.Driver Copy Local to True][Image2.2]

###Adding a Model
In **Solution Explorer**, right-click the *Models* folder and **Add** a new class *TaskModel.cs*.  In *TaskModel.cs*, replace the existing code with the following code:

	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Web;
	using MongoDB.Bson.Serialization.Attributes;
	using MongoDB.Bson.Serialization.IdGenerators;
	using MongoDB.Bson;
	
	namespace MyTaskListApp.Models
	{
	    public class Task
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

###Adding the Data Access Layer
In **Solution Explorer**, right-click the *MyTaskListApp* project and **Add** a new folder named *DAL*.  Right-click the *DAL* folder and **Add** a new class file named *Dal.cs*.  In *Dal.cs*, replace the existing code with the following code:

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
	        private MongoDatabase database = null;
	        private bool disposed = false;
	
	        // To do: update the connection string with the hostname or IP address of your server.
	        private string connectionString = "mongodb://<your-host-name>";
	
	        // This sample uses a database named "Tasks" and a collection named "TasksList".  The
	        // database and collection will be automatically created if they don't already exist.
	        private string dbName = "Tasks";
	        private string collectionName = "TasksList";
	
	        // Default constructor.        
	        public Dal()
	        {
	        }        
	
	        // Gets all Task items from the MongoDB server.        
	        public List<Task> GetAllTasks()
	        {
	            try
	            {
	                MongoCollection<Task> collection = GetTasksCollection();
	                return collection.FindAll().ToList<Task>();
	            }
	            catch (MongoConnectionException)
	            {
	                return new List<Task>();
	            }
	        }
	
	        // Creates a Task and inserts it into the collection in MongoDB.
	        public void CreateTask(Task task)
	        {
	            MongoCollection<Task> collection = GetTasksCollectionForEdit();
	            try
	            {
	                collection.Insert(task, SafeMode.True);
	            }
	            catch (MongoCommandException ex)
	            {
	                string msg = ex.Message;
	            }
	        }
	
	        private MongoCollection<Task> GetTasksCollection()
	        {
	            MongoServer server = MongoServer.Create(connectionString);
	            MongoDatabase database = server[dbName];
	            MongoCollection<Task> todoTaskCollection = database.GetCollection<Task>(collectionName);
	            return todoTaskCollection;
	        }
	
	        private MongoCollection<Task> GetTasksCollectionForEdit()
	        {
	            MongoServer server = MongoServer.Create(connectionString);
	            MongoDatabase database = server[dbName];
	            MongoCollection<Task> todoTaskCollection = database.GetCollection<Task>(collectionName);
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

###Adding a Controller
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
	        // GET: /Task/
	
	        public ActionResult Index()
	        {
	            return View(dal.GetAllTasks());
	        }
	
	        //
	        // GET: /Task/Create
	
	        public ActionResult Create()
	        {
	            return View();
	        }
	
	        //
	        // POST: /Task/Create
	
	        [HttpPost]
	        public ActionResult Create(Task task)
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

###Setting Up the Site Style
To change the title at the top of the page, open the *Views\Shared\\_Layout.cshtml* file in **Solution Explorer** and replace the existing **h1** heading text with the following:

	<h1>My Task List Application</h1>
	
In order to set up the Task List menu, open the *\Views\Home\Index.cshtml* file and replace the existing code with the following code:
	
	@model IEnumerable<MyTaskListApp.Models.Task>
	
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
	<div>  @Html.Partial("Create", new MyTaskListApp.Models.Task())</div>


To add the ability to create a new task, right-click the *Views\Home\\* folder and **Add** a view.  Name the view *Create*. Replace the code with the following:

	@model MyTaskListApp.Models.Task
	
	<script src="@Url.Content("~/Scripts/jquery-1.5.1.min.js")" type="text/javascript"></script>
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
![Solution Explorer][Image3]

###Setting the Connection String
In **Solution Explorer**, open the *DAL/Dal.cs* file. Find the following line of code:

	private string connectionString = "mongodb://<vm-dns-name>";

Replace `<vm-dns-name>` with the DNS name of the virtual machine running MongoDB you created in the begining of this tutorial.  To find the DNS name of your virtual machine, go to the Windows Azure management portal, select **Virtual Machines**, and find **DNS NAME**.

If the DNS name of the virtual machine is "testlinuxvm.cloudapp.net" and MongoDB is listening on the default port, the connection string line of code will look like:

	private string connectionString = "mongodb://testlinuxvm.cloudapp.net";

If the virtual machine endpoint specifies a different external port, you can specifiy the port in the connection string:

 	private string connectionString = "mongodb://testlinuxvm.cloudapp.net:12345";

For more information on MongoDB connection strings, see [Connections][MongoConnectionStrings].

###Testing the local deployment

To run your application locally, select **Start Debugging** from the **Debug** menu or hit **F5**. A development web server starts and a browser opens and launches the applications home page.

![My Task List Application][Image4]

## Deploy the ASP.NET application to a Windows Azure website

In this section you will...

### Create the Windows Azure Web Site
In this section you will create a Windows Azure Website.

1. Login to the [Windows Azure portal][WindowsAzure] using your Windows Live ID. 
2. At the bottom of the page, click **+New**, then **Web Site**, and finally **Quick Create**.
3. Enter a unique prefix for the application's URL.
4. Select a region.
5. Click **Create Web Site**.
![Create a new website][Image7]
6. Your web site will be created quickly.
7. Click the **Name** of your site, then **Dashboard**.
![Dashboard][Image8]

### Deploy the ASP.NET Application using Git
In this section you will deploy the application with Git.

1. Click **Set up Git publishing** at the bottom of the *Dashboard* page. Enter a user name and password. Make note of the instructions on the resulting page as they will be used in the next section.
2. The Git repository should be created quickly.
![Git Repository is Ready][Image9]
3. Select **Push my local files to Windows Azure** to display instructions on pushing your code to Windows Azure.
![Push local files to Azure][Image10]

##Wrapping Up

You have now successfully deployed your ASP.NET application to a Windows Azure web site.  To view the site, click the link in the **SITE URL** field of the **Dashboard** page. 

[WindowsAzure]: http://www.windowsazure.com
[MVCPrereqs]: http://www.microsoft.com/web/gallery/install.aspx?appsxml=&appid=MVC3
[VsPreReqs]: http://www.microsoft.com/web/gallery/install.aspx?appsxml=&appid=VS2010SP1Pack
[VsWebExpressPreReqs]: http://www.microsoft.com/web/gallery/install.aspx?appid=VWD2010SP1Pack
[MongoConnectionStrings]: http://www.mongodb.org/display/DOCS/Connections

[WebPlatformInstaller]: http://www.microsoft.com/web/gallery/install.aspx?appid=VWD2010SP1Pack
[Image0]: ../../../DevCenter/dotNE/Media/TaskListAppFull.png
[Image00]: ../../../DevCenter/dotNE/Media/NewProject.png
[Image1]: ../../../DevCenter/dotNE/Media/NewProject2.png
[Image2]: ../../../DevCenter/dotNE/Media/AddReference.png
[Image2.1]: ../../../DevCenter/dotNE/Media/MongoDbBsonCopyLocal.png
[Image2.2]: ../../../DevCenter/dotNE/Media/MongoDbDriverCopyLocal.png
[Image3]: ../../../DevCenter/dotNE/Media/SolnExplorer.png
[Image4]: ../../../DevCenter/dotNE/Media/TaskListAppBlank.png
[Image7]: ../../../DevCenter/dotNE/Media/NewWebSite.png
[Image8]: ../../../DevCenter/dotNE/Media/Dashboard.png
[Image9]: ../../../DevCenter/dotNE/Media/RepoReady.png
[Image10]: ../../../DevCenter/dotNE/Media/GitInstructions.png