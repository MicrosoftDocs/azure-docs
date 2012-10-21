# Tutorial: Create a C# ASP.NET, MongoDB-backed, Azure-Hosted Application

## Provision Your Database

<div chunk="../../Shared/Chunks/howto-provision-mongolab.md" />

## Create Your App

In this section, we'll cover the creation of your C# ASP.NET Visual Studio project and walk you through the use of the C# MongoDB driver.

### Create the Project

1. Select **File > New Project**. The New Project dialog displays:    
![NewProject][dialog-mongolab-csharp-newproject]
1. Select **Installed > Templates > Visual C# > Web**.
1. Select **.NET Framework 4** from the .NET version drop-down menu.
1. Choose **ASP.NET MVC 4 Web Application**.
1. Enter _mongoNotes_ as your **Project Name**. If you choose a different name, you will need to modify the code provided in this tutorial.
1. Click **Next**. The Project Template dialog displays:  
![ProjectTemplate][dialog-mongolab-csharp-projecttemplate]
1. Select **Internet Application** and click **Next**. Your project is built.
1. Select **Tools > Library Package Manager > Package Manager Console**. At the PM Console, type **Install-Package mongocsharpdriver** and press **Enter**.  
![PMConsole][focus-mongolab-csharp-pmconsole] 
The MongoDB C# Driver is integrated with your project, and the following line is automatically added to your _packages.config_ file:

		< package id="mongocsharpdriver" version="1.6" targetFramework="net40" / >

### Add a Note Model
1. Right-click **Models** in the Solution Explorer and select **Add > Class**. Call your new class *Note.cs*.
1. Replace the auto-generated code for this class with the following:  

		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Web;
		using MongoDB.Bson.Serialization.Attributes;
		using MongoDB.Bson.Serialization.IdGenerators;
		using MongoDB.Bson;
		
		namespace mongoNotes.Models
		{
		    public class Note
		    {
		        public Note()
		        {
		            Date = DateTime.UtcNow;
		        }
		
		        private DateTime date;
		
		        [BsonId(IdGenerator = typeof(CombGuidGenerator))]
		        public Guid Id { get; set; }
		
		        [BsonElement("Note")]
		        public string Text { get; set; }
		
		        [BsonElement("Date")]
		        public DateTime Date {
		            get { return date.ToLocalTime(); }
		            set { date = value;}
		        }
		    }
		}

### Add a Data Access Layer
1. Right-click the **mongoNotes** project in the Solution Explorer and select **Add > New Folder**. Call the folder **DAL**.
1. Right-click **DAL** in the Solution Explorer and select **Add > Class**. Call your new class *Dal.cs*.
1. Replace the auto-generated code for this class with the following:  

		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Web;
		using mongoNotes.Models;
		using MongoDB.Driver;
		using System.Configuration;

		namespace mongoNotes
		{
		    public class Dal : IDisposable
		    {
		        private MongoServer mongoServer = null;
		        private bool disposed = false;
		
		        private string connectionString = System.Environment.GetEnvironmentVariable("CUSTOMCONNSTR_MONGOLAB_URI");
		
		        private string dbName = "myMongoApp";
		        private string collectionName = "Notes";
		
		        // Default constructor.        
		        public Dal()
		        {
		        }
		   
		        public List<Note> GetAllNotes()
		        {
		            try
		            {
		                MongoCollection<Note> collection = GetNotesCollection();
		                return collection.FindAll().ToList<Note>();
		            }
		            catch (MongoConnectionException)
		            {
		                return new List<Note>();
		            }
		        }
		
		        // Creates a Note and inserts it into the collection in MongoDB.
		        public void CreateNote(Note note)
		        {
		            MongoCollection<Note> collection = getNotesCollectionForEdit();
		            try
		            {
		                collection.Insert(note, SafeMode.True);
		            }
		            catch (MongoCommandException ex)
		            {
		                string msg = ex.Message;
		            }
		        }
		
		        private MongoCollection<Note> GetNotesCollection()
		        {
		            MongoServer server = MongoServer.Create(connectionString);
		            MongoDatabase database = server[dbName];
		            MongoCollection<Note> noteCollection = database.GetCollection<Note>(collectionName);
		            return noteCollection;
		        }
		
		        private MongoCollection<Note> getNotesCollectionForEdit()
		        {
		            MongoServer server = MongoServer.Create(connectionString);
		            MongoDatabase database = server[dbName];
		            MongoCollection<Note> notesCollection = database.GetCollection<Note>(collectionName);
		            return notesCollection;
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


### Add a Create View
1. Right-click the **Views > Home** entry in the Solution Explorer and select **Add > View**. Call your new class *Create* and click **Add**.
1. Replace the auto-generated code for this view with the following:  

		@model mongoNotes.Models.Note
		
		<script src="@Url.Content("~/Scripts/jquery-1.5.1.min.js")" type="text/javascript"></script>
		<script src="@Url.Content("~/Scripts/jquery.validate.min.js")" type="text/javascript"></script>
		<script src="@Url.Content("~/Scripts/jquery.validate.unobtrusive.min.js")" type="text/javascript"></script>
		
		@using (Html.BeginForm("Create", "Home")) {
		    @Html.ValidationSummary(true)
		    <fieldset>
		        <legend>New Note</legend>
		        <h3>New Note</h3>
		
		        <div class="editor-label">
		            @Html.LabelFor(model => model.Text)
		        </div>
		        <div class="editor-field">
		            @Html.EditorFor(model => model.Text)
		        </div>
		
		       <p>
		       	    <input type="submit" value="Create" />
		   	   </p>
		   </fieldset>
		}

### Replace the Index.cshtml
1. Open **Index.cshtml** under **Views > Home** and replace its contents with the following:  

		@model IEnumerable<mongoNotes.Models.Note>
		
		@{
		    ViewBag.Title = "Notes";
		}
		
		<h2>My Notes</h2>

		<table border="1">
		    <tr>
		        <th>Date</th>
		        <th>Note Text</th>
		
		    </tr>
		
		@foreach (var item in Model) {
		    <tr>
		        <td>
		            @Html.DisplayFor(modelItem => item.Date)
		        </td>
		        <td>
		            @Html.DisplayFor(modelItem => item.Text)
		        </td>
		
		    </tr>
		}
		
		</table>
		<div>  @Html.Partial("Create", new mongoNotes.Models.Note())</div>

### Replace the Home Controller

1. Open **HomeController.cs** under **Controllers** in the Solution Explorer and replace its contents with the following:  

		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Web;
		using System.Web.Mvc;
		using mongoNotes.Models;
		using System.Configuration;
		
		namespace mongoNotes.Controllers
		{
		    public class HomeController : Controller, IDisposable
		    {
		        private Dal dal = new Dal();
		        private bool disposed = false;
		        //
		        // GET: /Task/
		
		        public ActionResult Index()
		        {
		            return View(dal.GetAllNotes());
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
		        public ActionResult Create(Note note)
		        {
		            try
		            {
		                dal.CreateNote(note);
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
	
	
## Deploy Your App

Now that your application has been developed, it's time to create an Azure Web Site to host it, configure that web site, and deploy your code. Central to this section is the use of your MongoDB connection string (URI). When you provisioned your MongoLab database, MongoLab transmitted your URI to Azure. We recommend transferring this URI--which you can access from your Add-On page--to an environment variable in your web site. This will allow your URI to change without requiring a redeployment.

### Create a New Web Site and Obtain Your Publish Settings File
1. In the Azure Portal, click **New**.  
![New][button-new]
1. Select **Compute > Web Site > Quick Create**.  
![CreateSite][screen-mongolab-newwebsite]
1. Enter a URL prefix. Choose a name you prefer, as mongoNotes will not be available.
1. Click **Create Web Site**.
1. When the web site creation completes, click the Web Site name in your list of web sites. The web site dashboard displays.  
![WebSiteDashboard][screen-mongolab-websitedashboard]
1. Click **Download publish profile** under **quick glance**, and save the .PublishSettings file to a directory of your chice.  
![DownloadPublishProfile][button-website-downloadpublishprofile]

### Get Your MongoLab Connection String

<div chunk="../../Shared/Chunks/howto-get-connectioninfo-mongolab.md" />

### Add Your Connection String to Your Web Site Environment Variables

1. In the Azure Portal, select **Web Sites**.
1. Click the name of the web site in the web site list.  
![WebSiteEntry][entry-website]
The Web Site Dashboard displays.  
![WebSiteDashboard][screen-mongolab-websitedashboard]
1. Click **Configure** in the menu bar.
1. Scroll down to the Connection Strings section.  
![WebSiteConnectionStrings][focus-mongolab-websiteconnectionstring]
1. For **Key**, enter MONGOLAB_URI.
1. For **Value**, paste the connection string you obtained in the previous section.
1. Select **Custom** in the Type drop-down (instead of the default **SQLAzure**).
1. Click **Save** on the toolbar.  
![SaveWebSite][button-website-save]

### Publish Your Web Site
1. In Visual Studio, right-click the **mongoNotes** project in the Solution Explorer and select **Publish**. The Publish dialog displays:  
![Publish][dialog-mongolab-vspublish]
1. Click **Import** and select the .PublishSettings file from your chosen download directory. This file automatically populates the values in the Publish dialog.
1. Click **Validate Connection** to test the file.
1. Once the validation succeeds, click **Publish**. Once publishing is complete, a new browser tab opens and your web site displays.
1. Enter some note text, click **Create** and see the results!  
![HelloMongoAzure][screen-mongolab-sampleapp]

Congratulations! You've just launched a C# ASP.NET application backed by a MongoLab-hosted MongoDB database!

[entry-website]: ..\Media\entry-website.png
[screen-mongolab-sampleapp]: ..\Media\screen-mongolab-sampleapp.png
[dialog-mongolab-vspublish]: ..\Media\dialog-mongolab-vspublish.png
[button-website-save]: ..\Media\button-website-save.png
[focus-mongolab-websiteconnectionstring]: ..\Media\focus-mongolab-websiteconnectionstring.png
[button-website-downloadpublishprofile]: ..\Media\button-website-downloadpublishprofile.png
[screen-mongolab-websitedashboard]: ..\Media\screen-mongolab-websitedashboard.png
[screen-mongolab-newwebsite]: ..\Media\screen-mongolab-newwebsite.png
[button-new]: ..\Media\button-new.png
[dialog-mongolab-csharp-newproject]: ..\Media\dialog-mongolab-csharp-newproject.png
[dialog-mongolab-csharp-projecttemplate]: ..\Media\dialog-mongolab-csharp-projecttemplate.png
[focus-mongolab-csharp-pmconsole]: ..\Media\focus-mongolab-csharp-pmconsole.png

## Manage Your Database

<div chunk="../../Shared/Chunks/howto-access-mongolab-ui.md" />