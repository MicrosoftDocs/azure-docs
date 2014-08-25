<properties title="Build a web application with ASP.NET MVC using DocumentDB" pageTitle="Build a web application with ASP.NET MVC using DocumentDB | Azure" description="Learn how to use DocumentDB to build a To Do List web application. You'll store and access data from an ASP.NET MVC web application hosted on Azure."  metaKeywords="NoSQL, DocumentDB,  database, document-orientated database, JSON, account" services="documentdb"  solutions="data-management" documentationCenter=""  authors="hawong" manager="jhubbard" editor="cgronlun" videoId="" scriptId="" />


<tags ms.service="documentdb" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="08/19/2014" ms.author="hawong" />

<a name="_Toc395809351">Build a web application with ASP.NET MVC using DocumentDB</a>
=======================================================================================================
<a name="_Toc395637758"></a> <a name="_Toc389865467"></a> <a name="_Toc389828008">Overview</a>
==============================================================================================

<a name="_Toc395637759">Scenario</a>
------------------------------------

To highlight how customers can efficiently leverage Azure DocumentDB to
store and query JSON documents, this document provides an end-to-end
walkthrough of building a ToDo List web application using Azure Document
DB.

This walkthrough shows you how to use DocumentDB service provided by
Azure to store and access data from an ASP.NET MVC web application
hosted on Azure and presumes that you have some prior experience using
ASP.NET MVC and Azure Websites.

You will learn:

1\. Creating and provisioning a DocumentDB Account

2\. Creating a ASP.NET MVC Application

3\. Connecting to and using Azure DocumentDB from your web application

4\. Deploying the Web Application to Azure Websites

By following this walkthrough, you will build a simple web-based
task-management application that allows creating, retrieving and
completing of tasks. The tasks will be stored as JSON documents in Azure
DocumentDB.

![Alt text](./media/documentdb-dotnet-application/image1.png)


<a name="_Toc395637760">Prerequisites</a>
================================================================

Before following the instructions in this article, you should ensure
that you have the following installed:

Git for Windows <http://www.git-scm.com/downloads>

Visual Studio 2013 (or [Visual Studio Express][] which is the
free version)

Azure SDK for .NET version 2.3 or higher, available through
[Microsoft Web Platform Installer][]

All the screen shots in this document have been taken using
Visual Studio 2013 with Update 3 applied and Azure SDK for .NET version
2.4. If your system is configured with different versions it is likely
that your screens and options won't match entirely, but if you meet the
above prerequisites this solution should work.



<a name="_Toc395637761">Create a DocumentDB database account</a>
================================================================

To provision a DocumentDB database account in Azure, open the Azure
Management Portal and either Click the Azure Gallery tile on the
homepage or click "+" in the lower left hand corner of the screen.

![Alt text](./media/documentdb-dotnet-application/image2.png)


This will open the Azure Gallery, where you can select from the many
available Azure services. In the Gallery, select "Data, storage and
backup" from the list of categories.

![Alt text](./media/documentdb-dotnet-application/image3.png)

From here, select the option for Azure DocumentDB

![Alt text](./media/documentdb-dotnet-application/image4.png)


Then select "Create" from the bottom of the screen

![Alt text](./media/documentdb-dotnet-application/image5.png)

This will open up the "New DocumentDB" blade where you can specify the
name, region, scale, resource group and other settings for your new
account.

![Alt text](./media/documentdb-dotnet-application/image6.png)


Once you're done supplying the values for your account, click "Create" and the provisioning process will begin creating your database account.
When the provisioning process is complete, you should see a notification
appear in the notifications area of the portal and the tile on your
start screen (if you selected to create one) will change to show the
completed action.

![Alt text](./media/documentdb-dotnet-application/image7.png)


Once provisioning is complete, clicking the DocumentDB tile from the
start screen will bring up the main blade for this newly created
DocumentDB account.

![Alt text](./media/documentdb-dotnet-application/image8.png) 
![Alt text](./media/documentdb-dotnet-application/image9.png)


Using the "Keys" button, access your endpoint URL and the Primary Key,
copy these to your clipboard and keep them handy as we will use these
values in the web application we will use these values in the web application we will create next.

We will now walk through how to create a new ASP.NET MVC application
from the ground-up. For your reference the complete solution can be
downloaded [here].

<a name="_Toc395637762">Create a new ASP.NET MVC application</a>
================================================================

In Visual Studio, click File – New Project and select the option to
create a new ASP.NET MVC Web Application.

![Alt text](./media/documentdb-dotnet-application/image10.png)


Select where you would like to create the project and click Ok.

![Alt text](./media/documentdb-dotnet-application/image11.png)


If you plan on hosting your application in Azure then select the box on
<<<<<<< HEAD
the lower right to "Host in the cloud". We've selected to host in the
=======
the lower right to “Host in the cloud”. We've selected to host in the
>>>>>>> 25a11b4599ae1bdc85a5f4f50a32dcb7774762d4
cloud, and run the application hosted in an Azure Website. Selecting
this option will pre-provision an Azure Website for you and make life a
lot easier when it comes times to deploy the final working application.

Select OK and let Visual Studio do its thing around scaffolding the
empty ASP.NET MVC template. You may see additional screens asking you to
login to your Azure account and provide some values for your new
Website. Proceed to supply all these Azure values and continue.

Once Visual Studio has finished creating the boilerplate MVC application
you have an empty ASP.NET application that you can run locally.

We'll skip running locally because I'm sure we've all seen the ASP.NET
<<<<<<< HEAD
"Hello World" application. Let's go straight to adding DocumentDB to
=======
“Hello World” application. Let's go straight to adding DocumentDB to
>>>>>>> 25a11b4599ae1bdc85a5f4f50a32dcb7774762d4
this project and building our application.

<a name="_Toc395637763">Setting up the ASP.NET MVC application</a>
==================================================================

### 

### <a name="_Toc395637764">Add a Model</a>

Let's begin by creating the **M** in MVC, the model. In Solution
Explorer, right-click the *Models* folder and then click **Add**, then
**Class**

![Alt text](./media/documentdb-dotnet-application/image12.png)

Name your new Class, **Item** and then add the following code in to this
new Class

    public class Item
    {
        [JsonProperty(PropertyName="id")]
        public int ID { get; set; }
        [JsonProperty(PropertyName="name")]
        public string Name { get; set; }
        [JsonProperty(PropertyName = "desc")]
        public string Description { get; set; }
        [JsonProperty(PropertyName="isComplete")]
        public bool Completed { get; set; }    
    }

All data in DocumentDB is passed over the wire, and stored, as JSON. To
control the way your objects are serialized/deserialized by JSON.NET you
can use the JsonProperty attribute like above which ensures that our
property names follow the JSON convention of lowercase property names.
You don't **have** to do this.

### <a name="_Toc395637765">Add a Controller</a>

That takes care of the M, now let's create the **C** in MVC, a
controller class.
 In **Solution Explorer**, right-click the *Controllers* folder and then
click **Add**, then **Controller**.

![Alt text](./media/documentdb-dotnet-application/image13.png)

![Alt text](./media/documentdb-dotnet-application/image14.png)


In the **Add Scaffold** dialog box, click **MVC 5 Controller - Empty.**
Click **Add.**

![Alt text](./media/documentdb-dotnet-application/image15.png)

Name your new Controller, **ItemController.**

Visual Studio will now add the ItemController your Solution
Explorer should look like similar to below.

![Alt text](./media/documentdb-dotnet-application/image16.png)

### <a name="_Toc395637766">Add Views</a>

And finally, let's create the **V** in MVC, a view.


#### Add Item Index View

Expand the ***Views***  folder in Solution Explorer and location the
(empty) Item folder which Visual Studio would've created for you when
you added the *ItemController* earlier. Right click on ***Item***
and choose to Add a new View.

![Alt text](./media/documentdb-dotnet-application/image17.png)

In the "Add View" dialog. Call your view "***Index***", use the
***List*** Template, select the ***Item (Todo.Models)*** which we
created earlier as the class and finally use the ***\_Layout.cshtml***
in the Solution as the Layout page.

![Alt text](./media/documentdb-dotnet-application/image18.png)


Once all these values are set, click Add and let Visual Studio create
your view for you. Visual Studio will create a template view. Once it is
done, it will open the cshtml file created. We can close this document
in Visual Studio as we will come back to it later.

#### Add New Item View

In a similar fashion to above, create a new View for creating new Items
as per the example shown below;

![Alt text](./media/documentdb-dotnet-application/image19.png)

#### Add Edit Item View

<a name="_Toc395888515"></a>
============================

And finally, add one last View for editing an Item in the same way as
before;

![Alt text](./media/documentdb-dotnet-application/image20.png)


Once this is done, close the cshtml documents in Visual Studio as we
will return to these Views later.

</h1>
<a name="_Toc395637767">Adding DocumentDB to your project</a>
=============================================================

That takes care of most of the ASP.NET MVC plumbing that we need for
this solution. Now let's get to the real purpose of this tutorial,
<<<<<<< HEAD
adding Azure DocumentDB to our web application.
=======
adding Azure DoucmentDB to our web application.
>>>>>>> 25a11b4599ae1bdc85a5f4f50a32dcb7774762d4

</h1>
<a name="_Toc395637768">Installing the DocumentDB NuGet package</a>
-------------------------------------------------------------------

The DocumentDB .NET SDK is packaged and distributed as a NuGet package.
Using the NuGet package manager in Visual Studio (which you can get to
by Right-Clicking on the Project and choosing "Manage NuGet Packages"

![Alt text](./media/documentdb-dotnet-application/image21.png)

Search for Online for "Azure DocumentDB" and install the package. This
will download and install the DocumentDB package as well as all
dependencies, like Newtonsoft.Json.

Once installed your Visual Studio solution should resemble the following
with two new references added;

![Alt text](./media/documentdb-dotnet-application/image22.png)

</h1>
<a name="_Toc395637769">Wiring up DocumentDB</a>
------------------------------------------------

### <a name="_Toc395637770">Listing Incomplete Items</a>

Open the **ItemController** and remove all the code within the class
(but leave the class) that Visual Studio added. We'll rebuild it piece
<<<<<<< HEAD
by piece using DocumentDB.
=======
by piece using DoucmentDB.
>>>>>>> 25a11b4599ae1bdc85a5f4f50a32dcb7774762d4

Add the following code snippet within the now empty ItemController
class;

    public async Task<ActionResult> Index() 
    {
    	var items = await repo.GetIncompleteItems();
    	return View(items);
    }

This uses a "pseudo repository" class for DocumentDB, which is actually
just a Helper class that contains all the DocumentDB specific code. For
the purposes of this walkthrough we aren't going to implement a full
data access layer with dependency injection using a repository pattern,
as you might do if you were building a real world application. For the
purposes of this walkthrough we're just going to put all the data access
logic in to one project to keep things simple.

Add a new Class to your project and call it **DocumentDBRepository.**
And replace the code in the class file with the following;

    public static class DocumentDBRepository
    {
	    public static async Task<List<Item>> GetIncompleteItems()
	    {
	    	return await Task<List<Item>>.Run( () => 
	    		Client.CreateDocumentQuery<Item>(Collection.DocumentsLink)
		    		.Where(d => !d.Completed)
		    		.AsEnumerable()
		    		.ToList<Item>());
	    }
    } 

#### 

Spend some time adding the appropriate using statements to resolve the
references. All references will be easy to resolve in Visual Studio as
long as the NuGet package was installed successfully. The reference to
*CreateDocumentQuery* will resolve after you need to manually add the
following using directive;

    using Microsoft.Azure.Documents.Linq; 

There is a little more manual plumbing we need to add to our pseudo
repository class to get everything working as it should. Add the code
below to your repository class;

</h4>

        private static Database database;
        private static Database Database
        {
			get
			{
				if (database == null)
				{
					ReadOrCreateDatabase().Wait();
				}
				
				return database;
			}
        }

        private static DocumentCollection collection;
        private static DocumentCollection Collection
        {
			get
			{
				if (collection == null)
				{
					ReadOrCreateCollection(Database.SelfLink).Wait();
				}
				
				return collection;
			}
        }

        private static string databaseId;
        private static String DatabaseId
        {
			get
			{
				if (string.IsNullOrEmpty(databaseId))
				{
					databaseId = ConfigurationManager.AppSettings["database"];
				}
			
				return databaseId;
			}
        }
	  
        private static string collectionId;
        private static String CollectionId
        {
			get
			{
				if (string.IsNullOrEmpty(collectionId))
				{
					collectionId = ConfigurationManager.AppSettings["collection"];
				}
			
				return collectionId;
			}
        }

        private static DocumentClient client;
        private static DocumentClient Client
        {
            get
            {
                if (client == null)
                {
					String endpoint = ConfigurationManager.GetSetting("endpoint")
					string authKey = ConfigurationManager.GetSetting("authKey");
					Uri endpointUri = new Uri(endpoint);
					client = new DocumentClient(endpointUri, authKey);
                }
                
                return client;
            }
        }

        private static async Task ReadOrCreateCollection(string databaseLink)
        {
			var collections = Client.CreateDocumentCollectionQuery(databaseLink)
							  .Where(col => col.Id == CollectionId).ToArray();
			
			if (collections.Any())
			{
				collection = collections.First();
			}
			else
			{
				collection = await Client.CreateDocumentCollectionAsync(databaseLink, 
					new DocumentCollection { Id = CollectionId });
			}
        }
	 
        private static async Task ReadOrCreateDatabase()
        {
			var databases = Client.CreateDatabaseQuery()
							.Where(db => db.Id == DatabaseId).ToArray();
			
			if (databases.Any())
			{
				database = databases.First();
			}
			else
			{
				Database database = new Database { Id = DatabaseId };	
				database = await Client.CreateDatabaseAsync(database);
			}
        }
</h1>

#### 

When you first access a method like GetIncompleteItems() it calls in to
Client, which will establish a connection to Azure DocumentDB. The first
call in to GetIncompleteItems() will also attempt to read or create the
Database and DocumentCollection for this application. This only has to
be done once, after that you can just cache the SelfLink properties for
both resources and reuse these in the application.

When you want to connect to DocumentDB later within the same application
the same instance of the Client, Database and Collection will be reused
rather than creating a new instance each time.

Open the **web.config** and add the following lines under the
<AppSettings\> section;

    <add key="endpoint" value="enter you endpoint url from the Azure Management Portal"/>
    <add key="authKey" value="enter one of the keys from the Azure Management Portal"/>
    <add key="database" value="ToDoList"/>
    <add key="collection" value="Items"/>


</h4>

At this point your solution should be able to build without any errors.

If you ran the application now, you would go to the Home Controller and
the Index view of that controller. This is the default behavior for the
MVC template project we chose at the start but we don't want that! Let's
change the routing on this MVC application to alter this behavior.

Open ***RouteConfig.cs*** under the App\_Start folder, locate the line
starting with "defaults:" and change it to resemble the following;

    defaults: new { controller = "Item", action = "Index", id = UrlParameter.Optional }

This now tells ASP.NET MVC that if you have not specified a value in the URL to control the routing behavior that instead of "Home" use "Item" as the controller and user Index as the view.
Now if you run the application, it will call in to your **ItemController** and return the results of the **GetIncompleteItems** method to the Views\Item\Index view. 
If you run this project now, you should now see something that looks this;    

![Alt text](./media/documentdb-dotnet-application/image23.png)

### <a name="_Toc395637771">Adding Items</a>

Let's now put some items in to our database so we have something more
than an empty grid to look at.

We have already got a View for Create, and a Button on the Index View
which will take the user to the create view. Let's add some code to the
Controller and Repository to persist the record in DocumentDB.

Open the ***ItemController.cs*** and add the following code snippet
which is how ASP.NET MVC knows what to do for the Create action, in this
case just render the associated Create.cshtml view created earlier.

    public ActionResult Create()
    { 
  		  return View(); 
    }

We now need some more code in this controller which will accept the
submission from the create view.

Go ahead and add the next block of code which tells ASP.NET MVC what to
do with a form POST for this controller.

    [HttpPost]  
    public async Task<ActionResult> Create(Item item)  
    {
		if (ModelState.IsValid)  
		{  
		    await repo.CreateDocument(item);  
		    return RedirectToAction("Index");  
		}   
    	return View(item);   
    }

The Items Controller will now pass the Item, from the form, to the
CreateDocument method of our pseudo repository class, so add the
following method to your DocumentDBRepository class.

    public static async Task<Document> CreateDocument(dynamic item)
    {
        return await Client.CreateDocumentAsync(Collection.SelfLink, item); 
    }

This method simply takes any object passed to it and persists it in
DocumentDB.

 This concludes the code required to add new items to our database.


### <a name="_Toc395637772">Editing Items</a>

There is one last thing for us to do, and that is the ability to edit
items in the database and to mark them complete as we complete the
tasks. As with adding, the view for editing has already been added so we
just need to add some additional code to our Controller and to the
DocumentDBRepository class again.

Add the following to the ItemController class;

    public async Task<ActionResult> Edit(string id)    
    {  
       	if (id == null)  
		{
		    return new HttpStatusCodeResult(HttpStatusCode.BadRequest);   
		}

    	Item item = await repo.GetDocument(id);
    	if (item == null)
        {	    
		    return HttpNotFound();
		}
		
    	return View(item);
    }
	
    [HttpPost] 
    public async Task<ActionResult> Edit(Item item)  
    {
    	if (ModelState.IsValid)
        {
    	     await repo.UpdateDocument(item);
    	     return RedirectToAction("Index");
		}
		
    	return View(item); 
    }

The first method handles the Http Get that will happen when the user
clicks on the "Edit" link from the Index view. This method fetches a
Document from DocumentDB and passes it to the Edit View.

### 

The Edit view will then do a Http Post back to our IndexController and
the second method we added handles this passing the updated object
through to DocumentDB to be persisted in the database.

Add the following to the DocumentDBRepository class;

    public static async Task<Item> GetDocument(string id)
    {
	    return await Task<Item>.Run(() =>
	        Client.CreateDocumentQuery<Item>(Collection.DocumentsLink)
	    		.Where(d => d.ID == id)
	    		.AsEnumerable()
				.FirstOrDefault());
    }
    
    public static async Task<Document> UpdateDocument(Item item)
    {
        var doc = Client.CreateDocumentQuery<Document>(Collection.DocumentsLink)
                    .Where(d => d.Id == item.ID)
                    .AsEnumerable().FirstOrDefault();
		
        return await Client.ReplaceDocumentAsync(doc.SelfLink, item);
    }


The first of these two methods fetches an Item from DocumentDB which is
passed back to the ItemController and then on to the Edit view.

The second of the two methods we just added replaces the document in
DocumentDB with the version of the Document passed in from the
ItemController.

That's it, that is everything we need to run our application, List
incomplete items, Add new items, and lastly Edit items.

</h3>
<a name="_Toc395637773">Run your application locally</a>
=========================================================

### 

To test the application on your local machine, hit F5 in Visual Studio
and it should build the application and launch a browser with the empty
grid page we saw before:

![Alt text](./media/documentdb-dotnet-application/image24.png)

1\.Use the provided fields for Item, Item Name and Category to enter
information, and then click **"Create New"** link and supply some
values. Leave the "Completed" checkbox unselected otherwise the new item will
be added in a completed state and will not appear on the initial list.

![Alt text](./media/documentdb-dotnet-application/image25.png)

If you hit Create, you will be redirected back to the Index page and
hopefully your Item shows in the List.

![Alt text](./media/documentdb-dotnet-application/image26.png)

Feel free to add a few more items to your Todo list.

2\.Click on "Edit" next to an Item on the list and you will be taken
to the Edit view where you can update any property of your object,
including the "Completed" flag. This effectively marks the item as
complete and will remove it from the List of incomplete tasks.

![Alt text](./media/documentdb-dotnet-application/image27.png)

3\.To complete a task, simply check the checkbox and then click
**Save.** You will be redirected back to the list page where now the
item will no longer appear of the list.

</h3>
<a name="_Toc395637774">Deploy application to Azure Websites</a>
================================================================

### 

Now that you have the complete application working correctly against
DocumentDB we're going to deploy this to Azure Websites.

If you selected "Host in the cloud" when we created the empty ASP.NET
MVC project then Visual Studio makes this really easy and does most of
the work for us. To Publish this application to all you need to do, is
Right Click on the Project in Solution Explorer (make sure you're not
still running it locally) and select Publish

![Alt text](./media/documentdb-dotnet-application/image28.png)

Everything should already be configured according to your credentials;
in fact the website has already been created in Azure for you at the
"Destination URL" shown, all you need to is Click **Publish**

![Alt text](./media/documentdb-dotnet-application/image29.png)

In a few seconds, Visual Studio will finish publishing your web
application and launch a browser where you can see your handy work
running in Azure!

</h3>



<a name="_Toc395637775">Conclusion</a>
======================================

### 

Congratulations! You have just built your first ASP.NET MVC Application using Azure DocumentDB and published it to Azure Websites. The source code for the complete reference application can be downloaded here.


  [here] (http://go.microsoft.com/fwlink/?LinkID=509838&clcid=0x409)

  [\*]: https://microsoft.sharepoint.com/teams/DocDB/Shared%20Documents/Documentation/Docs.LatestVersions/PicExportError
  [Visual Studio Express]: http://www.visualstudio.com/en-us/products/visual-studio-express-vs.aspx
  [Microsoft Web Platform Installer]: http://www.microsoft.com/web/downloads/platform.aspx
