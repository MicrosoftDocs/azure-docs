<properties 
	pageTitle="Create a .NET web app on Azure with MongoDB using the MongoLab add-on" 
	description="Learn how to create an ASP.NET web app on Azure App Service that stores data in MongoDB hosted by MongoLab." 
	tags="azure-classic-portal"
	services="app-service\web" 
	documentationCenter=".net" 
	authors="chrisckchang" 
	manager="partners@mongolab.com" 
	editor="mollybos"/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="04/20/2015" 
	ms.author="chris@mongolab.com"/>



# Create a .NET web app on Azure with MongoDB using the MongoLab add-on

  	<!-- The MongoLab workflow is not yet supported in the Preview Portal -->

<p><em>By Eric Sedor, MongoLab</em></p>

Greetings, adventurers! Welcome to MongoDB-as-a-Service. In this tutorial, you will:

1. [Provision the Database][provision] - The Azure Marketplace [MongoLab](http://mongolab.com) add-on will provide you with a MongoDB database hosted in the Azure cloud and managed by MongoLab's cloud database platform.
1. [Create the App][create] - It'll be a simple C# ASP.NET MVC app for making notes.
1. [Deploy the app][deploy] - By tying a few configuration hooks together, we'll make pushing our code to [Azure App Service Web Apps](http://go.microsoft.com/fwlink/?LinkId=529714) a breeze.
1. [Manage the database][manage] - Finally, we'll show you MongoLab's web-based database management portal where you can search, visualize, and modify data with ease.

At any time throughout this tutorial, feel free to kick off an email to [support@mongolab.com](mailto:support@mongolab.com) if you have any questions.

## Quick start
If you already have a web app in Azure App Service that you want to work with or you have some familiarity with the Azure Marketplace, use this section to get a quick start. Otherwise, continue to [Provision the Database][provision] below.
 
1. Open the Azure Marketplace by clicking **New** > **Markeplace**.  
	<!-- ![Store][button-store] -->

1. Purchase the MongoLab add-on.  
	![MongoLab][entry-mongolab]

1. Click your MongoLab add-on in the Add-Ons list, and click **Connection Info**.  
	![ConnectionInfoButton][button-connectioninfo]  

1. Copy the MONGOLAB_URI to your clipboard.  
	![ConnectionInfoScreen][screen-connectioninfo]  
	**This URI contains your database user name and password.  Treat it as sensitive information and do not share it.**

1. Add the value to the Connection Strings list in the Configuration menu of your Azure Web application:  
	![WebSiteConnectionStrings][focus-website-connectinfo]

1. For **Name**, enter MONGOLAB\_URI.

1. For **Value**, paste the connection string we obtained in the previous section.

1. Select **Custom** in the Type drop-down (instead of the default **SQLAzure**).

1. In Visual Studio, install the Mongo C# Driver by selecting **Tools > Library Package Manager > Package Manager Console**. At the PM Console, type **Install-Package mongocsharpdriver** and press **Enter**.

1. Set up a hook in your code to obtain your MongoLab connection URI from an environment variable:

        using MongoDB.Driver;  
        ...
        private string connectionString = System.Environment.GetEnvironmentVariable("CUSTOMCONNSTR_MONGOLAB_URI");
        ...
        MongoUrl url = new MongoUrl(connectionString);
        MongoClient client = new MongoClient(url);

> **Note:** Azure adds the **CUSTOMCONNSTR\_** prefix to the originally-declared connection string, which is why the code references **CUSTOMCONNSTR\_MONGOLAB\_URI.** instead of **MONGOLAB\_URI**.

Now, on to the full tutorial...

<a name="provision"></a>
## Provision the database

[AZURE.INCLUDE [howto-provision-mongolab](../includes/howto-provision-mongolab.md)]

<a name="create"></a>
## Create the app

In this section, you'll cover the creation of a C# ASP.NET Visual Studio project and walk through the use of the C# MongoDB driver to create a simple Note app. You want to be able to visit your web app, write a note, and view all the notes that have left.

You'll perform this development in Visual Studio Express 2013 for Web.

### Create the project
Your sample app will make use of a Visual Studio template to get started. Be sure to use .NET Framework 4.5.

1. Select **File > New Project**. The New Project dialog displays:    
	![NewProject][dialog-mongolab-csharp-newproject]

1. Select **Installed > Templates > Visual C# > Web**.

1. Select **.NET Framework 4.5** from the .NET version drop-down menu.

1. Choose **MVC Application**.  

1. Enter _mongoNotes_ as your **Project Name**. If you choose a different name, you will need to modify the code provided in throughout the tutorial.

1. Select **Tools > Library Package Manager > Package Manager Console**. At the PM Console, type **Install-Package mongocsharpdriver** and press **Enter**.  
	![PMConsole][focus-mongolab-csharp-pmconsole] 
	The MongoDB C# Driver is integrated with the project, and the following line is automatically added to the _packages.config_ file:

        < package id="mongocsharpdriver" version="1.9.2" targetFramework="net45" / >

### Add a note model
First, establish a model for Notes, with simply a date and a text content.

1. Right-click **Models** in the Solution Explorer and select **Add > Class**. Call this new class *Note.cs*.

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

### Add a data access layer
It's important that you establish a means of accessing MongoDB to retrieve and save the notes. Your data access layer will make use of the Note model and be tied into your HomeController later on.

1. Right-click the **mongoNotes** project in the Solution Explorer and select **Add > New Folder**. Call the folder **DAL**.

1. Right-click **DAL** in the Solution Explorer and select **Add > Class**. Call this new class *Dal.cs*.

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
                MongoUrl url;
        
                private string dbName = "myMongoApp";
                private string collectionName = "Notes";
        
                // Default constructor.        
                public Dal()
                {
                    url = new MongoUrl(connectionString);
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
                        collection.Insert(note);
                    }
                    catch (MongoCommandException ex)
                    {
                        string msg = ex.Message;
                    }
                }
        
                private MongoCollection<Note> GetNotesCollection()
                {
                    MongoClient client = new MongoClient(url);
                    mongoServer = client.GetServer();
                    MongoDatabase database = mongoServer.GetDatabase(dbName);
                    MongoCollection<Note> noteCollection = database.GetCollection<Note>(collectionName);
                    return noteCollection;
                }
        
                private MongoCollection<Note> getNotesCollectionForEdit()
                {
                    MongoClient client = new MongoClient(url);
                    mongoServer = client.GetServer();
                    MongoDatabase database = mongoServer.GetDatabase(dbName);
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

1. Note the following code above:  
            
        private string connectionString = System.Environment.GetEnvironmentVariable("CUSTOMCONNSTR_MONGOLAB_URI");
        private string dbName = "myMongoApp";  
Here, you access an environment variable that you'll configure later. If you have a local mongo instance running for development purposes, you may want to temporarily set this value to "localhost".  
  
  Also set your database name. Specifically, set the **dbName** value to the name you entered when you provisioned the MongoLab Add-On.

1. Finally, examine the following code in **GetNotesCollection()**:  

        MongoClient client = new MongoClient(url);
        mongoServer = client.GetServer();
        MongoDatabase database = mongoServer.GetDatabase(dbName);
        MongoCollection<Note> noteCollection = database.GetCollection<Note>(collectionName);
  There's nothing to change here; Just be aware that this is how you get a MongoCollection object for performing inserts, updates, and queries, such as the following in **GetAllNotes()**:  

        collection.FindAll().ToList<Note>();

For more information about leveraging the C# MongoDB driver, check out the [CSharp Driver QuickStart](http://www.mongodb.org/display/DOCS/CSharp+Driver+Quickstart "CSharp Driver Quickstart") at mongodb.org.

### Add a create view
Now, you'll add a view for creating a new note.

1. Right-click the **Views > Home** entry in the Solution Explorer and select **Add > View**. Call this new view **Create** and click **Add**.

1. Replace the auto-generated code for this view (**Create.cshtml**) with the following:  

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

### Modify index.cshtml
Next, drop in a simple layout for viewing and creating notes on your web app.

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

### Modify HomeController.cs
Finally, your HomeController needs to instantiate your data access layer and apply it against your views.

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
    
<a name="deploy"></a> 
## Deploy the app

Now that the application has been developed, it's time to create a web app in Azure App Service to host it, configure that web app, and deploy the code. Central to this section is the use of the MongoDB connection string (URI). You're going to configure an environment variable in your web app with this URI to keep the URI separate from your code.  You should treat the URI as sensitive information as it contains credentials to connect to your database.

### Create a New web app and obtain the Publish Settings File
Creating a web app in Azure App Service is very easy, especially as Azure auto-generates a publish profile for Visual Studio.

1. In the Azure portal, click **New**.  
	![New][button-new]

1. Select **Compute > Web app > Quick create**.  
	<!-- ![CreateWebApp][screen-mongolab-newwebsite] -->

1. Enter a URL prefix. Choose a name you prefer, but keep in mind this must be unique ('mongoNotes' will likely not be available).

1. Click **Create web app**.

1. When the web app creation completes, click the web app name in the Web Apps list. The Web App dashboard displays.  
	![WebAppDashboard][screen-mongolab-websitedashboard]

1. Click **Download publish profile** under **quick glance**, and save the .PublishSettings file to a directory of your choice.  
![DownloadPublishProfile][button-website-downloadpublishprofile]

Alternatively, you can also configure a web app directly from Visual Studio. When you link your Azure account to Visual Studio, follow the prompts to configure a web app from there. Once you're done, you can simply right-click on the project name in the Solution Explorer to deploy to Azure. You'll still need to configure the MongoLab connection string, as detailed in the steps below.

### Get the MongoLab connection string

[AZURE.INCLUDE [howto-get-connectioninfo-mongolab](../includes/howto-get-connectioninfo-mongolab.md)]

### Add the connection string to the web app's environment variables

[AZURE.INCLUDE [howto-save-connectioninfo-mongolab](../includes/howto-save-connectioninfo-mongolab.md)]

### Publish the web app
1. In Visual Studio, right-click the **mongoNotes** project in the Solution Explorer and select **Publish**. The Publish dialog displays:  
	<!-- ![Publish][dialog-mongolab-vspublish] -->

1. Click **Import** and select the .PublishSettings file from your chosen download directory. This file automatically populates the values in the Publish dialog.

1. Click **Validate Connection** to test the file.

1. Once the validation succeeds, click **Publish**. Once publishing is complete, a new browser tab opens and the web app displays.

1. Enter some note text, click **Create** and see the results!  
	![HelloMongoAzure][screen-mongolab-sampleapp]

<a name="manage"></a>
## Manage the database

[AZURE.INCLUDE [howto-access-mongolab-ui](../includes/howto-access-mongolab-ui.md)]

Congratulations! You've just launched a C# ASP.NET application backed by a MongoLab-hosted MongoDB database! Now that you have a MongoLab database, you can contact [support@mongolab.com](mailto:support@mongolab.com) with any questions or concerns about your database, or for help with MongoDB or the C# driver itself. Good luck out there!

[AZURE.INCLUDE [app-service-web-whats-changed](../includes/app-service-web-whats-changed.md)]

[AZURE.INCLUDE [app-service-web-try-app-service](../includes/app-service-web-try-app-service.md)]

[screen-mongolab-sampleapp]: ./media/partner-mongodb-web-sites-dotnet-use-mongolab/screen-mongolab-sampleapp.png
[dialog-mongolab-vspublish]: ./media/partner-mongodb-web-sites-dotnet-use-mongolab/dialog-mongolab-vspublish.png
[button-website-downloadpublishprofile]: ./media/partner-mongodb-web-sites-dotnet-use-mongolab/button-website-downloadpublishprofile.png
[screen-mongolab-websitedashboard]: ./media/partner-mongodb-web-sites-dotnet-use-mongolab/screen-mongolab-websitedashboard.png
[screen-mongolab-newwebsite]: ./media/partner-mongodb-web-sites-dotnet-use-mongolab/screen-mongolab-newwebsite.png
[button-new]: ./media/partner-mongodb-web-sites-dotnet-use-mongolab/button-new.png
[dialog-mongolab-csharp-newproject]: ./media/store-mongolab-web-sites-dotnet-store-data-mongodb/dialog-mongolab-csharp-newproject.png
[dialog-mongolab-csharp-projecttemplate]: ./media/store-mongolab-web-sites-dotnet-store-data-mongodb/dialog-mongolab-csharp-projecttemplate.png
[focus-mongolab-csharp-pmconsole]: ./media/store-mongolab-web-sites-dotnet-store-data-mongodb/focus-mongolab-csharp-pmconsole.png
[button-store]: ./media/partner-mongodb-web-sites-dotnet-use-mongolab/button-store.png
[entry-mongolab]: ./media/partner-mongodb-web-sites-dotnet-use-mongolab/entry-mongolab.png 
[button-connectioninfo]: ./media/partner-mongodb-web-sites-dotnet-use-mongolab/button-connectioninfo.png
[screen-connectioninfo]: ./media/partner-mongodb-web-sites-dotnet-use-mongolab/dialog-mongolab_connectioninfo.png
[focus-website-connectinfo]: ./media/partner-mongodb-web-sites-dotnet-use-mongolab/focus-mongolab-websiteconnectionstring.png
[provision]: #provision
[create]: #create
[deploy]: #deploy
[manage]: #manage

