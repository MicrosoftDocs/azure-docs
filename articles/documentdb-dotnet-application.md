<properties title="Build a web application with ASP.NET MVC using DocumentDB" pageTitle="Build a web application with ASP.NET MVC using DocumentDB | Azure" description="Learn how to use DocumentDB to build a todo list web application. You'll store and access data from an ASP.NET MVC web application hosted on Azure."  metaKeywords="NoSQL, DocumentDB,  database, document-orientated database, JSON, account" services="documentdb"  solutions="data-management" documentationCenter=""  authors="ryancraw" manager="jhubbard" editor="cgronlun" videoId="" scriptId="" />


<tags ms.service="documentdb" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="01/08/2014" ms.author="ryancraw" />

#<a name="_Toc395809351"></a>Build a web application with ASP.NET MVC using DocumentDB

To highlight how you can efficiently leverage Azure DocumentDB to store and query JSON documents, this article provides an end-to-end walk-through showing you how to build a todo list web application using Azure DocumentDB. The tasks will be stored as JSON documents in Azure DocumentDB.

![Screen shot of the todo list web application created by this tutorial](./media/documentdb-dotnet-application/image1.png)

This walk-through shows you how to use the DocumentDB service provided by Azure to store and access data from an ASP.NET MVC web application hosted on Azure.

> [AZURE.TIP] This tutorial assumes that you have prior experience using ASP.NET MVC and Azure Websites. If you are new to ASP.NET or the [prerequisite tools](#_Toc395637760), we recommend downloading the complete [todo](https://github.com/Azure/azure-documentdb-net/tree/master/tutorials/todo) tutorial project from [GitHub](https://github.com/Azure/azure-documentdb-net) and building it using the [instructions at the end of this article](#GetProject). Once you have it built, you can review the article to gain insight on the code in the context of the project.

## In this tutorial 

Step | Description
-----| -----------
[Prerequisites](#_Toc395637760) | Prerequisite software for completing the tutorial.
[Step 1: Create a DocumentDB database account.](#_Toc395637761) | Create a DocumentDB account and retrieve your Key values. 
[Step 2: Create a new ASP.NET MVC application.](#_Toc395637762) | Create an ASP.NET web application.
[Step 3: Add DocumentDB to your project.](#_Toc395637767) | Add the DocumentDB .NET client libraries to your project.
[Step 4: Set up the ASP.NET MVC application.](#_Toc395637763) |  Add the model, views, and controllers to your MVC app.
[Step 5: Wiring up DocumentDB](#_Toc395637769) | Add code to list incomplete Items, add Items, and edit Items.
[Step 6: Run the application locally.](#_Toc395637773) | Build the solution and run it locally.
[Step 7: Deploy the application to Azure Websites.](_Toc395637774) | Quickly get your app published to Azure Websites.
[Next steps](#_Toc395637775) | You're done. What next?
[Get the solution from GitHub](#GetProject) | Too busy to complete the tutorial and just want the finished app? Go here.

## <a name="_Toc395637760"></a>Prerequisites

Before following the instructions in this article, you should ensure that you have the following installed:

- [Visual Studio 2013](http://www.visualstudio.com/) or higher, or [Visual Studio Express], which is the free version.
- Azure SDK for .NET version 2.3 or higher, available through the [Microsoft Web Platform Installer][].

All the screen shots in this article have been taken using Visual Studio 2013 with Update 3 applied and the Azure SDK for .NET version 2.4. If your system is configured with different versions it is possible that your screens and options won't match entirely, but if you meet the above prerequisites this solution should work.

## <a name="_Toc395637761"></a>Create a DocumentDB database account

Let's start by creating a DocumentDB account.

1. If you don't already have a database account, create one by following the instructions in [Create a database account](/documentation/articles/documentdb-create-account/). If you already have an account, proceed to step 2.
2. Using the **Keys** blade shown in the following illustration, copy your endpoint **URI** and the **PRIMARY KEY** to your clipboard and keep them handy as we will use these values in the web application we create next.

  	![Screen shot of the Azure Preview portal, showing a DocumentDB account, with the ACTIVE hub highlighted, the KEYS tile highlighted on the DocumentDB account blade, and the URI, PRIMARY KEY and SECONDARY KEY values highlighted on the Keys blade](./media/documentdb-dotnet-application/keys.png)

We will now walk through how to create a new ASP.NET MVC application from the ground-up. 

## <a name="_Toc395637762"></a>Create a new ASP.NET MVC application

Now let's create our new ASP.NET project.

1. In Visual Studio, on the **File** menu, point to **New**, and then click **Project**.

   	The **New Project** dialog box appears.
2. In the **Project types** pane, expand **Templates**, **Visual C#**, **Web**, and then select **ASP.NET Web Application**.

  	![Screen shot of the New Project dialog box with the ASP.NET Web Application project type highlighted](./media/documentdb-dotnet-application/image10.png)

3. In the **Name** box, type the name of the project. This tutorial uses the name "todo". 
4. Click **Browse** to navigate to the folder where you would like to create the project, and then click **OK**.

  	The **New ASP.NET Project** dialog box appears.

  	![Screen shot of the New ASP.NET Project dialog box with the MVC template highlighted and the Host in the cloud box checked](./media/documentdb-dotnet-application/image11.png)

5. In the templates pane, select **MVC**.
6. If you plan on hosting your application in Azure then select **Host in the cloud** on the lower right to have Azure host the application. We've selected to host in the cloud, and to run the application hosted in an Azure Website. Selecting this option will preprovision an Azure Website for you and make life a lot easier when it comes time to deploy the final working application. If you want to host this elsewhere or don't want to configure Azure upfront, then just clear **Host in the Cloud**.
7. Click **OK** and let Visual Studio do its thing around scaffolding the empty ASP.NET MVC template. 
8. If you chose to host this in the cloud you will see at least one additional screen asking you to login to your Azure account and provide some values for your new website. Supply all the additional values and continue. 

  	I haven't chosen a "Database server" here because we're not using an Azure SQL Database Server here, we're going to be creating a new Azure DocumentDB account later on in the Azure Preview portal. 

  	![Screen shot of the Configure Microsoft Azure Website dialog box](./media/documentdb-dotnet-application/image11_1.png)

9. Once Visual Studio has finished creating the boilerplate MVC application you have an empty ASP.NET application that you can run locally.

We'll skip running the project locally because I'm sure we've all seen the ASP.NET "Hello World" application. Let's go straight to adding DocumentDB to this project and building our application.

## <a name="_Toc395637767"></a>Add DocumentDB to your project


That takes care of most of the ASP.NET MVC plumbing that we need for
this solution. Now let's get to the real purpose of this tutorial, adding Azure DocumentDB to our web application.

1. The DocumentDB .NET SDK is packaged and distributed as a NuGet package. To get the NuGet package in Visual Studio, use the NuGet package manager in Visual Studio by right-clicking on the project in **Solution Explorer** and then clicking **Manage NuGet Packages**.

  	The **Manage NuGet Packages** dialog box appears.

  	![Sreen shot of the right-click options for the project in Solution Explorer, with Manage NuGet Packages highlighted.](./media/documentdb-dotnet-application/image21.png)

2. In the **Search Online** box, type "Azure DocumentDB". From the results, install the **Microsoft Azure DocumentDB Client Libraries** package. This will download and install the DocumentDB package as well as all dependencies, like Newtonsoft.Json.

  	> [AZURE.NOTE] While the service is still in preview, the NuGet package is marked as "Prerelease" so you need to include the option to "Include Prerelease", or else you will not find the package. 

  	Alternatively you could use the Package Command Console to install the package by typing the following.

    	Install-Package Microsoft.Azure.Documents.Client -Pre

3. Once the package is installed, your Visual Studio solution should resemble the following with two new references added, Microsoft.Azure.Documents.Client and Newtonsoft.Json.

  	![Sreen shot of the two references added to the project in Solution Explorer.](./media/documentdb-dotnet-application/image22.png)


##<a name="_Toc395637763"></a>Set up the ASP.NET MVC application
 
Now let's add the models, views, and controllers to this MVC application:

- [Add a model](#_Toc395637764).
- [Add a controller](#_Toc395637765).
- [Add views](#_Toc395637766).


### <a name="_Toc395637764"></a>Add a model

Let's begin by creating the **M** in MVC, the model. 

1. In Solution Explorer, right-click the **Models** folder, click **Add**, and then click **Class**.

  	The **Add New Item** dialog box appears.

2. Name your new class **Item** and then add the following code into the new Item.cs file.

        public class Item
        {
        	[JsonProperty(PropertyName="id")]
        	public string Id { get; set; }
		
        	[JsonProperty(PropertyName="name")]
        	public string Name { get; set; }
		
        	[JsonProperty(PropertyName = "desc")]
        	public string Description { get; set; }
		
       		[JsonProperty(PropertyName="isComplete")]
        	public bool Completed { get; set; }    
		}

	All data in DocumentDB is passed over the wire and stored as JSON. To control the way your objects are serialized/deserialized by JSON.NET you can use the **JsonProperty** attribute as demonstrated in the **Item** class we just created. You don't **have** to do this but I want to ensure that my properties follow the JSON camelCase naming conventions. 

	Not only can you control the format of the property name when it goes into JSON, but you can entirely rename your .NET properties like I did with the **Description** property. 

	You can, if you like, use **JsonConverter** objects here as well to completely control how serialization is handled.  

3. In order to get Visual Studio to resolve the **JsonProperty** attribute used here you need to add the following using statement to the using section of your class file.

    	using Newtonsoft.Json;

### <a name="_Toc395637765"></a>Add a controller

That takes care of the **M**, now let's create the **C** in MVC, a controller class.

1. In **Solution Explorer**, right-click the **Controllers** folder, click **Add**, and then click **Controller**.

    The **Add Scaffold** dialog box appears.

2. Select **MVC 5 Controller - Empty** and then click **Add**.

	![Screen shot of the Add Scaffold dialog box with the MVC 5 Controller - Empty option highlighted](./media/documentdb-dotnet-application/image14.png)

3. Name your new Controller, **ItemController.**

	![Screen shot of the Add Controller dialog box](./media/documentdb-dotnet-application/image15.png)

Once the file is created, your Visual Studio solution should resemble the following with the new ItemController.cs file in **Solution Explorer**.

![Screen shot of Solution Explorer with the new ItemController.cs file and Item.cs file highlighted](./media/documentdb-dotnet-application/image16.png)

### <a name="_Toc395637766"></a>Add views

And finally, let's create the **V** in MVC, the views:

- [Add an Item Index view](#AddItemIndexView).
- [Add a New Item view](#AddNewIndexView).
- [Add an Edit Item view](#_Toc395888515).


#### <a name="AddItemIndexView"></a>Add an Item Index view

1. In **Solution Explorer**, expand the ***Views***  folder, right-click the empty **Item** folder that Visual Studio created for you when you added the **ItemController** earlier, click **Add**, and then click **View**.

	![Screen shot of Solution Explorer showing the Item folder with the Add View commands highlighted](./media/documentdb-dotnet-application/image17.png)

2. In the **Add View** dialog box, do the following:
	- In the **View name** box, type ***Index***.
	- In the **Template** box, select ***List***.
	- In the **Model class** box, select ***Item (todo.Models)***.
	- In the layout page box, type ***~/Views/Shared/_Layout.cshtml***.
	- Click **Add**.
	![Screen shot showing the Add View dialog box](./media/documentdb-dotnet-application/image18.png)

3. Once all these values are set, click **Add** and let Visual Studio create your view for you. Visual Studio will create a template view. Once it is done, it will open the cshtml file created. We can close that file in Visual Studio as we will come back to it later.

#### <a name="AddNewIndexView"></a>Add a New Item view

Similar to how we created an **Item Index** view, we will now create a new view for creating new **Items**.

In the **Add View** dialog box, do the following:

- In the **View name** box, type ***Create***.
- In the **Template** box, select ***Create***.
- In the **Model class** box, select ***Item (todo.Models)***.
- In the layout page box, type ***~/Views/Shared/_Layout.cshtml***.
- Click **Add**.

![Screen shot showing the Add View dialog box](./media/documentdb-dotnet-application/image19.png)

#### <a name="_Toc395888515"></a>Add an Edit Item view

And finally, add one last view for editing an **Item** in the same way as before.


In the **Add View** dialog box, do the following:

- In the **View name** box, type ***Edit***.
- In the **Template** box, select ***Edit***.
- In the **Model class** box, select ***Item (todo.Models)***.
- Select **Create as a partial view**.
- Click **Add**.

![Screen shot showing the Add View dialog box](./media/documentdb-dotnet-application/image20.png)

Once this is done, close the cshtml documents in Visual Studio as we will return to these views later.

## <a name="_Toc395637769"></a>Wiring up DocumentDB

In this section, we'll add code to handle the following:

- [Listing incomplete Items](#_Toc395637770).
- [Adding Items](#_Toc395637771).
- [Editing Items](#_Toc395637772).

### <a name="_Toc395637770"></a>Listing incomplete Items

1. Open the **ItemController** and remove all the code within the class (but leave the class) that Visual Studio added. We'll rebuild it piece by piece using DocumentDB.

2. Add the following code snippet within the now empty **ItemController** class.

    	public ActionResult Index()
    	{
       	 var items = DocumentDBRepository.GetIncompleteItems();
       	 return View(items);
    	}

	This code also uses a "pseudo repository" class called **DocumentDBRepository** that we have yet to create. This is actually just a helper class that contains all the DocumentDB specific code. For the purposes of this walk-through we aren't going to implement a full data access layer with dependency injection, and factories and repository patterns, as you would probably be doing if you were building a real world application. 
	For the purposes of this walk-through we're just going to put all the data access logic directly into one project to keep things simple and focus on the DocumentDB specific bits.

3. Add a new class to your project and name it **DocumentDBRepository**. 
4. Replace the code in the **DocumentDBRepository** class with the following.

    	public static class DocumentDBRepository
    	{
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
					
    	    private static Database database;
    	    private static Database Database
    	    {
				get
				{
					if (database == null)
					{
						database = ReadOrCreateDatabase();
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
						collection = ReadOrCreateCollection(Database.SelfLink);
					}
					
					return collection;
				}
    	    }
			
    	    private static DocumentClient client;
    	    private static DocumentClient Client
    	    {
    	        get
    	        {
    	            if (client == null)
    	            {
						string endpoint = ConfigurationManager.AppSettings["endpoint"];
						string authKey = ConfigurationManager.AppSettings["authKey"];
						Uri endpointUri = new Uri(endpoint);
						client = new DocumentClient(endpointUri, authKey);
    	            }
    	            
    	            return client;
    	        }
    	    }
    	} 

6. Spend some time resolving all the namespaces in Visual Studio, which should include adding the following using directives to the DocumentDBRepository.cs file.

		using Microsoft.Azure.Documents;
		using Microsoft.Azure.Documents.Client;
		using System.Configuration;

 	All namespaces will be easy to resolve in Visual Studio as long as the NuGet package was installed successfully. The references to the **ReadOrCreateDatabase** and **ReadOrCreateCollection** methods remain unresolved until we add them, which comes next. 

7. There are two method calls used here for reading or creating DocumentDB databases and document collections. So add the following two methods to the **DocumentDBRepository** class.

    	private static DocumentCollection ReadOrCreateCollection(string databaseLink)
   		{
    	    var col = Client.CreateDocumentCollectionQuery(databaseLink)
        	                  .Where(c => c.Id == CollectionId)
        	                  .AsEnumerable()
        	                  .FirstOrDefault();
	
        	if (col == null)
        	{
        	    col = Client.CreateDocumentCollectionAsync(databaseLink, new DocumentCollection { Id = CollectionId }).Result;
        	}
			
        	return col;
    	}
	
    	private static Database ReadOrCreateDatabase()
    	{
        	var db = Client.CreateDatabaseQuery()
        	                .Where(d => d.Id == DatabaseId)
        	                .AsEnumerable()
        	                .FirstOrDefault();
			
        	if (db == null)
        	{
        	    db = Client.CreateDatabaseAsync(new Database { Id = DatabaseId }).Result;
        	}
			
        	return db;
    	}

	This takes care setting up the database, a [**DocumentCollection**](http://msdn.microsoft.com/library/azure/microsoft.azure.documents.documentcollection.aspx), and creating some code to connect to DocumentDB through the [**DocumentClient**](http://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.aspx). 

8. We're reading some values from configuration, so open the **Web.config** and add the following lines under the <AppSettings\> section and update the values using the **URI** and key values retrieved in [Create a DocumentDB database account](#_Toc395637761).

    <add key="endpoint" value="enter you endpoint url from the Azure Management Portal"/>
    <add key="authKey" value="enter one of the keys from the Azure Management Portal"/>
    <add key="database" value="ToDoList"/>
    <add key="collection" value="Items"/>
		
	Now let's add some code to do the work. 	

9. The first thing we want to be able to do with a todo list application is to display the incomplete items.  The method below does this for you so copy and paste it anywhere within the **DocumentDBRepository** class.
    
		public static List<Item> GetIncompleteItems()
    	{
    	    return Client.CreateDocumentQuery<Item>(Collection.DocumentsLink)
    	            .Where(d => !d.Completed)
    	            .AsEnumerable()
    	            .ToList<Item>();
    	}
    
10. The reference to *CreateDocumentQuery* will resolve after you need to manually add the following using directive.

    	using Microsoft.Azure.Documents.Linq;

	At this point your solution should be able to build without any errors.

	If you ran the application now, you would go to the **HomeController** and the **Index** view of that controller. This is the default behavior for the MVC template project we chose at the start but we don't want that! Let's change the routing on this MVC application to alter this behavior.

11. Open ***App\_Start\RouteConfig.cs*** and locate the line starting with "defaults:" and change it to resemble the following.

    	defaults: new { controller = "Item", action = "Index", id = UrlParameter.Optional }

	This now tells ASP.NET MVC that if you have not specified a value in the URL to control the routing behavior that instead of **Home**, use **Item** as the controller and user **Index** as the view.
	Now if you run the application, it will call into your **ItemController** and return the results of the **GetIncompleteItems** method to the **Views**\**Item**\**Index** view. 

12. If you build and run this project now, you should now see something that looks this.    

	![Screen shot of the todo list web application created by this tutorial](./media/documentdb-dotnet-application/image23.png)

### <a name="_Toc395637771"></a>Adding Items

Let's put some items into our database so we have something more than an empty grid to look at.

We already have a view for **Create**, and a button on the **Index** view that takes the user to the **Create** view. Let's add some code to the controller and repository to persist the record in DocumentDB.

1. Open the ItemController.cs file and add the following code snippet, which is how ASP.NET MVC knows what to do for the **Create** action. In this case just render the associated Create.cshtml view created earlier.

    	public ActionResult Create()
    	{ 
		return View(); 
   		}

	We now need some more code in this controller that will accept the submission from the **Create** view.

2. Add the next block of code that tells ASP.NET MVC what to do with a form POST for this controller.
	
    	[HttpPost]
    	[ValidateAntiForgeryToken]
   	 	public async Task<ActionResult> Create([Bind(Include = 	"Id,Name,Description,Completed")] Item item)  
  	  	{
			if (ModelState.IsValid)  
			{  
			    await DocumentDBRepository.CreateItemAsync(item);
			    return RedirectToAction("Index");  
			}   
			return View(item);   
		}

	**Security Note**: The **ValidateAntiForgeryToken** attribute is used here to help protect this application against cross-site request forgery attacks. There is more to it than just adding this attribute, your views need to work with this anti-forgery token as well. For more on the subject, and examples of how to implement this correctly, please see [Preventing Cross-Site Request Forgery][]. The source code provided on [Github][] has the full implementation in place.

	**Security Note**: We also use the **Bind** attribute on the method parameter to help protect against over-posting attacks. For more details please see [Basic CRUD Operations in ASP.NET MVC][].

3. Now that the **Create** method is in place, the **ItemController** will pass the **Item** object from the form to the **CreateDocument** method. So now add the following method to your **DocumentDBRepository** class.

    	public static async Task<Document> CreateItemAsync(Item item)
   	 	{
   	   		return await Client.CreateDocumentAsync(Collection.SelfLink, item);
   		}

	This method simply takes an object passed to it and persists it in DocumentDB.

This concludes the code required to add new Items to our database.


### <a name="_Toc395637772"></a>Editing Items

There is one last thing for us to do, and that is to add the ability to edit **Items** in the database and to mark them as complete. The view for editing was already added to the project, so we just need to add some code to our controller and to the **DocumentDBRepository** class again.

1. Add the following to the **ItemController** class.

    	[HttpPost]
   		[ValidateAntiForgeryToken]
    	public async Task<ActionResult> Edit([Bind(Include = "Id,Name,Description,Completed")] Item item)
    	{
     	   if (ModelState.IsValid)
    	    {
    	        await DocumentDBRepository.UpdateItemAsync(item);
    	        return RedirectToAction("Index");
    	    }

  	      return View(item);
 	   	}
		
	    public ActionResult Edit(string id)
	    {
   	     if (id == null)
   	     {
       	     return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
      	  }
	
      	  Item item = (Item)DocumentDBRepository.GetItem(id);
      	  if (item == null)
      	  {
      	      return HttpNotFound();
     	   }
	
    	    return View(item);
  	  	}

	The first method handles the Http GET that happens when the user clicks on the **Edit** link from the **Index** view. This method fetches a [**Document**](http://msdn.microsoft.com/library/azure/microsoft.azure.documents.document.aspx) from DocumentDB and passes it to the **Edit** view.

	The **Edit** view will then do an Http POST to the **IndexController**. 
	
	The second method we added handles passing the updated object to DocumentDB to be persisted in the database.

2. Add the following using directive to the ItemController.cs file.

		using todo.Models;
		using System.Threading.Tasks;
		using System.Net;

3. Add the following to the **DocumentDBRepository** class.

    	public static Item GetItem(string id)
    	{
        	return Client.CreateDocumentQuery<Item>(Collection.DocumentsLink)
                    	.Where(d => d.Id == id)
                    	.AsEnumerable()
                    	.FirstOrDefault();
    	}
		
    	public static async Task<Document> UpdateItemAsync(Item item)
    	{
        	Document doc = Client.CreateDocumentQuery(Collection.DocumentsLink)
                            	.Where(d => d.Id == item.Id)
                            	.AsEnumerable()
                            	.FirstOrDefault();
	
        	return await Client.ReplaceDocumentAsync(doc.SelfLink, item);
    	}

	The first of these two methods fetches an **Item** from DocumentDB which is passed back to the **ItemController** and then on to the **Edit** view.

	The second of the two methods we just added replaces the **Document** in DocumentDB with the version of the **Document** passed in from the **ItemController**.

4. Add the following using directive to the DocumentDBRepository.cs file.

		using System.Threading.Tasks;

	That's it, that is everything we need to run our application, list incomplete **Items**, add new **Items**, and edit **Items**.

## <a name="_Toc395637773"></a>Run the application locally

To test the application on your local machine, do the following:

1. Hit F5 in Visual Studio to build the application in debug mode. It should build the application and launch a browser with the empty grid page we saw before:

	![Screen shot of the todo list web application created by this tutorial](./media/documentdb-dotnet-application/image24.png)

	If you run into errors at this point, you can compare your code against the todo tutorial on [GitHub][].

2. Click the **Create New** link and add values to the **Name** and **Description** fields. Leave the **Completed** check box unselected otherwise the new **Item** will be added in a completed state and will not appear on the initial list.

	![Screen shot of the Create view](./media/documentdb-dotnet-application/image25.png)

3. Click **Create** and you are redirected back to the **Index** view and your **Item** appears in the list.

	![Screen shot of the Index view](./media/documentdb-dotnet-application/image26.png)

	Feel free to add a few more **Items** to your todo list.

3. Click **Edit** next to an **Item** on the list and you are taken to the **Edit** view where you can update any property of your object, including the **Completed** flag. If you mark the **Complete** flag and click **Save**, the **Item** is removed from the list of incomplete tasks.

	![Screen shot of the Index view with the Completed box checked](./media/documentdb-dotnet-application/image27.png)

4. Once you've tested the app, press Ctrl+F5 to stop debugging the app. You're ready to deploy!

##<a name="_Toc395637774"></a>Deploy the application to Azure Websites

Now that you have the complete application working correctly with DocumentDB we're going to deploy this web app to Azure Websites. If you selected **Host in the cloud** when you created the empty ASP.NET MVC project then Visual Studio makes this really easy and does most of the work for you. 

To publish this application all you need to do is right-click on the project in **Solution Explorer** and click **Publish**.

![Screen shot of the Publish option in Solution Explorer](./media/documentdb-dotnet-application/image28.png)

Everything should already be configured according to your credentials; in fact the website has already been created in Azure for you at the **Destination URL** shown, all you need to do is click **Publish**.

![Screen shot of the Publish Web dialog box](./media/documentdb-dotnet-application/image29.png)

In a few seconds, Visual Studio will finish publishing your web application and launch a browser where you can see your handy work running in Azure!

##<a name="_Toc395637775"></a>Next steps

Congratulations! You just built your first ASP.NET MVC application using Azure DocumentDB and published it to Azure Websites. The source code for the complete application, including the detail and delete functionality that were not included in this tutorial can be downloaded or cloned from [Github][]. So if you're interested in adding that to your app, grab the code and add it to this app.

To add additional functionality to your application, review the APIs available in the [Document DB .NET Library](http://msdn.microsoft.com/library/azure/dn783362.aspx) and feel free to contribute to the DocumentDB .NET Library on [GitHub][]. 

##<a id="GetProject"></a>Get the solution from GitHub

If you're looking to save time and just want to build the complete todo solution, and not  add the code yourself, you're in luck. The complete solution is available on GitHub and you can build it and deploy it in a few minutes using the following instructions.

1. Ensure you have the [prerequisite software](#_Toc395637760) installed, which includes Visual Studio and Azure SDK for .NET version 2.3 or higher.

2. Clone the azure-documentdb-net repository using Git for Windows ([http://www.git-scm.com/](http://www.git-scm.com/)), or download the zip file from [GitHub](https://github.com/Azure/azure-documentdb-net/).

2. From Visual Studio, open the todo.sln file from the azure-documentdb-net/tutorials/todo directory.

3. To restore the references to the DocumentDB .NET SDK in Visual Studio 2013, right-click the todo solution in **Solution Explorer**, and then click **Enable NuGet Package Restore**, which will restore the references. 

4. Retrieve the **URI** and **PRIMARY KEY** or **SECONDARY KEY** values from the **Keys** blade of your DocumentDB account in the [Azure Preview portal](https://portal.azure.com/). 

	
	If you don't have an account, see [Create a database account](/documentation/articles/documentdb-create-account/) to set one up.

	![Screen shot of the Azure Preview portal, showing a DocumentDB account, with the ACTIVE hub highlighted, the KEYS tile highlighted on the DocumentDB account blade, and the URI, PRIMARY KEY and SECONDARY KEY values highlighted on the Keys blade](./media/documentdb-dotnet-application/keys.png)

5. In the Web.config file, update the default values for the **endpoint** and **authKey** keys.

    	<add key="endpoint" value="~enter URI for your DocumentDB Account, from Azure Management Portal~" /> 
		<add key="authKey" value="~enter either Primary or Secondary key for your DocumentDB Account, from Azure Management Portal~" /> 

	- Copy the **URI** value from the Keys blade and paste it into the **endpoint** property value. 
	- Copy the **PRIMARY KEY** or **SECONDARY KEY** value from the **Keys** blade and paste it into the **authKey** property value. 


7. You can now [run your application locally](#_Toc395637773) and then [deploy it to Azure Websites](#_Toc395637774).


[\*]: https://microsoft.sharepoint.com/teams/DocDB/Shared%20Documents/Documentation/Docs.LatestVersions/PicExportError
[Visual Studio Express]: http://www.visualstudio.com/products/visual-studio-express-vs.aspx
[Microsoft Web Platform Installer]: http://www.microsoft.com/web/downloads/platform.aspx
[Github]: http://go.microsoft.com/fwlink/?LinkID=509838&clcid=0x409
[Preventing Cross-Site Request Forgery]: http://go.microsoft.com/fwlink/?LinkID=517254
[Basic CRUD Operations in ASP.NET MVC]: http://go.microsoft.com/fwlink/?LinkId=317598
