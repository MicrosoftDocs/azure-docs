#Create a Windows Azure web site that connects to MongoDB running on a virtual machine in Windows Azure

Using Git, you can deploy an ASP.NET application to a Windows Azure web site. In this tutorial, you will build a simple front-end ASP.NET MVC task list application that connects to a MongoDB database running in a virtual machine in Windows Azure.  [MongoDB][MongoDB] is a popular open source, high performance NoSQL database. After running and testing the ASP.NET application on your development computer, you will upload the application to a Windows Azure web site using Git.

The ASP.NET application you'll build will look like this:
![My Task List Application][Image0]

## Overview

In this tutorial you will:

*  Set up a virtual machine running Linux or Windows and install MongoDB
*  Create and run the Task List ASP.NET application on your development computer
*  Create a Windows Azure web site
*  Deploy the Task List ASP.NET application to the Windows Azure web site using Git

## Background knowledge

Knowledge of the following is useful for this tutorial, though not required:

* The C# driver for MongoDB. For more information on developing C# applications against MongoDB, see [CSharp Language Center][MongoC#LangCenter]. 
* The ASP .NET web application framework. You can learn all about it at the [ASP.net website][ASP.NET].
* The ASP .NET MVC 3.0 web application framework. You can learn all about it at the [ASP.NET MVC 3 website][MVC3].
* Windows Azure. You can get started reading at [Windows Azure][WindowsAzure].

## Preparation

In this section you will learn how to create a virtual machine in Windows Azure and install MongoDB, set up your development environment, and install the MongoDB C# driver.

###Create a virtual machine and install MongoDB

This tutorial assumes you have created a virtual machine in Windows Azure. After creating the virtual machine you need to install MongoDB on the virtual machine:

* To create a Windows virtual machine and install MongoDB, see [Install MongoDB on a virtual machine running Windows Server 2008 R2 in Windows Azure][InstallMongoOnWindowsVM].
* Alternatively, to create a Linux virtual machine and install MongoDB, see [Install MongoDB on a virtual machine running CentOS Linux in Windows Azure][InstallMongoOnCentOSLinuxVM].

After you have created the virtual machine in Windows Azure and installed MongoDB, be sure to remember the DNS name of the virtual machine ("testlinuxvm.cloudapp.net", for example) and the external port for MongoDB that you specified in the endpoint.  You will need this information later in the tutorial.

### Sign up for the Windows Azure Web Sites preview feature

You will need to sign up for the Windows Azure Web Sites preview feature in order to create a Windows Azure web site. You can also sign up for a free trial account if you do not have a Windows Azure account.

<div chunk="../../Shared/Chunks/create-azure-account.md" />

### Enable Windows Azure Web Sites

<div chunk="../../Shared/Chunks/antares-iaas-signup.md" />

### Set up the development environment

This tutorial uses Microsoft Visual Studio 2010.  You can also use Microsoft Visual Web Developer 2010 Express Service Pack 1, which is a free version of Microsoft Visual Studio. Before you start, make sure you've installed the prerequisites listed below on your local development computer. You can install all of them by clicking the following link: [Web Platform Installer] [WebPlatformInstaller]. Alternatively, you can individually install the prerequisites using the following links:

* [Visual Studio 2010 prerequisites] [VsPreReqs]
* [ASP.NET MVC 3 Tools Update] [MVCPrereqs]

If you're using Visual Web Developer 2010 instead of Visual Studio 2010, install the prerequisites by clicking the following link: [Visual Studio Web Developer Express SP1 prerequisites] [VsWebExpressPreReqs] 

## Create the Task List ASP.NET application and run it  

In this section you will create the Task List ASP.NET application using Visual Studio.  You will also run the application locally against the MongoDB instance you created in the virtual machine hosted on Windows Azure.

###Create the application
Start by running Visual Studio and select **New Project** from the **Start** page.

Select **Visual C#** and then **Web** on the left and then select **ASP.NET MVC 3 Web Application** from the list of templates. Name your project "MyTaskListApp" and then click **OK**.

![New Project Screen][Image00]

In the **New ASP.NET MVC 3 Project** dialog box, select **Internet Application**. Check **Use HTML5 markup** and leave **Razor** as the default view engine.

Click **OK**.

![New Internet Application][Image1]

###Install the MongoDB C# driver

MongoDB offers client-side support for C# applications through a driver, which you need to install on your local development computer. The C# driver is available through NuGet.

To install the MongoDB C# driver:

1. In **Solution Explorer**, right-click the **MyTaskListApplication** project references and select **Add Library Package Reference...**.

	![Add Library Package Reference][Image2]

2. In the **Add Library Package Reference** window, click **Online** and then search for "mongocsharpdriver".  Click **Install** to install the driver.

	![Search for MongoDB C# Driver][Image2.1]

3. Click **I Accept** to accept the 10gen, Inc. license terms.

4. Click **Close** after the driver has installed.
	![MongoDB C# Driver Installed][Image2.2]


The MongoDB C# driver is now installed.  References to the **MongoDB.Driver.dll** and **MongoDB.Bson.dll** libraries have been added to the project.

![MongoDB C# Driver References][Image2.3]

###Add a model
In **Solution Explorer**, right-click the *Models* folder and **Add** a new **Class** *TaskModel.cs*.  In *TaskModel.cs*, replace the existing code with the following code:

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

###Add the data access layer
In **Solution Explorer**, right-click the *MyTaskListApp* project and **Add** a **New Folder** named *DAL*.  Right-click the *DAL* folder and **Add** a new class file named *Dal.cs*.  In *Dal.cs*, replace the existing code with the following code:

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

###Add a controller
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

###Set up the site style
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


To add the ability to create a new task, right-click the *Views\Home\\* folder and **Add** a **View**.  Name the view *Create*. Replace the code with the following:

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

###Set the MongoDB connection string
In **Solution Explorer**, open the *DAL/Dal.cs* file. Find the following line of code:

	private string connectionString = "mongodb://<vm-dns-name>";

Replace `<vm-dns-name>` with the DNS name of the virtual machine running MongoDB you created in the **Create a Virtual Machine and Install MongoDB** step of this tutorial.  To find the DNS name of your virtual machine, go to the Windows Azure management portal, select **Virtual Machines**, and find **DNS Name**.

If the DNS name of the virtual machine is "testlinuxvm.cloudapp.net" and MongoDB is listening on the default port 27017, the connection string line of code will look like:

	private string connectionString = "mongodb://testlinuxvm.cloudapp.net";

If the virtual machine endpoint specifies a different external port for MongoDB, you can specifiy the port in the connection string:

 	private string connectionString = "mongodb://testlinuxvm.cloudapp.net:12345";

For more information on MongoDB connection strings, see [Connections][MongoConnectionStrings].

###Test the local deployment

To run your application on your development computer, select **Start Debugging** from the **Debug** menu or hit **F5**. A development web server starts and a browser opens and launches the application's home page.  You can add a new task, which will be added to the MongoDB database running on your virtual machine in Windows Azure.

![My Task List Application][Image4]

## Deploy the ASP.NET application to a Windows Azure web site

In this section you will create a web site and deploy your Task List ASP.NET application using Git.

### Create the web site
In this section you will create a Windows Azure web site.

1. Open a web browser and browse to the [Windows Azure (Preview) Management Portal][AzurePreviewPortal]. Sign in with your Windows Azure account. 
2. At the bottom of the page, click **+New**, then **Web Site**, and finally **Quick Create**.
3. Enter a unique prefix for the application's URL.
4. Select a region.
5. Click **Create Web Site**.
![Create a new web site][Image7]
6. Your web site will be created quickly and will be listed in **Web sites**.
![Dashboard][Image8]

### Deploy the ASP.NET application using Git
In this section you will deploy the Task List application using Git.

1. Click your web site name in **Web sites**, then click **Dashboard**.  Click **Set up Git publishing** at the bottom of the **Dashboard** page for the **mytasklistapp** site. 
2. Enter a user name and password in the **New user name and password** page and click the checkmark. Make note of the instructions on the resulting page as they will be used in the next section.
3. The Git repository should be created quickly.

	![Git Repository is Ready][Image9]
4. Select **Push my local files to Windows Azure** to display instructions on pushing your code to Windows Azure. The instructions will look similar to the following:

	![Push local files to Windows Azure][Image10]
5. If you do not have Git installed, install it using the **Get it here** link in step 1.
6. Following these instructions in step 2, commit your local files.  
7. Add the remote Windows Azure repository and push your files to the Windows Azure web site by following the instructions in step 3.
8. When the deployment has completed you will see the following confirmation:
	![Deployment Complete][Image11]
9. Your Windows Azure web site is now available.  Check the **Dashboard** page for your site and the **Site URL** field to find the URL for your site. Following the procedures in this tutorial, your site would be available at this URL: <a href="http://mytasklistapp.azurewebsites.net">http://mytasklistapp.azurewebsites.net</a>.

##Summary

You have now successfully deployed your ASP.NET application to a Windows Azure web site.  To view the site, click the link in the **Site URL** field of the **Dashboard** page. For more information on developing C# applications against MongoDB, see [CSharp Language Center][MongoC#LangCenter]. 

[AzurePreviewPortal]: http://manage.windowsazure.com
[WindowsAzure]: http://www.windowsazure.com
[ASP.NET]: http://www.asp.net
[MVC3]: http://www.asp.net/mvc
[MVCPrereqs]: http://www.microsoft.com/web/gallery/install.aspx?appsxml=&appid=MVC3
[VsPreReqs]: http://www.microsoft.com/web/gallery/install.aspx?appsxml=&appid=VS2010SP1Pack
[VsWebExpressPreReqs]: http://www.microsoft.com/web/gallery/install.aspx?appid=VWD2010SP1Pack
[MongoConnectionStrings]: http://www.mongodb.org/display/DOCS/Connections
[WebPlatformInstaller]: http://www.microsoft.com/web/gallery/install.aspx?appid=VWD2010SP1Pack
[MongoC#LangCenter]: http://www.mongodb.org/display/DOCS/CSharp+Language+Center
[MongoDB]: http://www.mongodb.org
[MongoCSharpDriverDownload]: http://github.com/mongodb/mongo-csharp-driver/downloads
[InstallMongoWinVM]: ../../../Shared/Tutorials/InstallMongoDbOnWin2k8VM.md
[InstallMongoOnCentOSLinuxVM]: /en-us/manage/linux/common-tasks/mongodb-on-a-linux-vm/
[InstallMongoOnWindowsVM]: /en-us/manage/windows/common-tasks/install-mongodb/


[Image0]: ../../../DevCenter/dotNET/Media/TaskListAppFull.png
[Image00]: ../../../DevCenter/dotNET/Media/NewProject.png
[Image1]: ../../../DevCenter/dotNET/Media/NewProject2.png
[Image2]: ../../../DevCenter/dotNET/Media/AddReference.png
[Image2.1]: ../../../DevCenter/dotNET/Media/AddReference2.png
[Image2.2]: ../../../DevCenter/dotNET/Media/AddReference3.png
[Image2.3]: ../../../DevCenter/dotNET/Media/AddReference4.png
[Image3]: ../../../DevCenter/dotNET/Media/SolnExplorer.png
[Image4]: ../../../DevCenter/dotNET/Media/TaskListAppBlank.png
[Image7]: ../../../DevCenter/dotNET/Media/NewWebSite.png
[Image8]: ../../../DevCenter/dotNET/Media/Dashboard.png
[Image9]: ../../../DevCenter/dotNET/Media/RepoReady.png
[Image10]: ../../../DevCenter/dotNET/Media/GitInstructions.png
[Image11]: ../../../DevCenter/dotNET/Media/GitDeploymentComplete.png