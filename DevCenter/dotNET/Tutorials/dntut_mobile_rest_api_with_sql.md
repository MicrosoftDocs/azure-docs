# Mobile-friendly REST service using ASP.NET Web API and SQL Database

This tutorial shows how to deploy an ASP.NET web application that uses the ASP.NET Web API to a Windows Azure Web Site by using the Publish Web wizard in Visual Studio 2010. Visual Studio 2012 RC or Visual Studio 2012 for Web Express RC. If you prefer, you can follow the tutorial steps by using Visual Web Developer Express 2010, Visual Studio 2012 RC or Visual Studio 2012 for Web Express RC.

You can open a Windows Azure account for free, and if you don't already have Visual Studio 2010, the SDK automatically installs Visual Studio 2012 for Web Express. So you can start developing for Windows Azure entirely for free.

This tutorial assumes that you have no prior experience using Windows Azure. On completing this tutorial, you'll have a data-driven web application up and running in the cloud and using a cloud database.

You'll learn:

* How to enable your machine for Windows Azure development by installing the Windows Azure SDK.
* How to create a Visual Studio ASP.NET MVC 4 project and publish it to a Windows Azure Web Site.
* How to use the ASP.NET Web API to enable Restful API calls.
* How to use a SQL database to store data in Windows Azure.
* How to publish application updates to Windows Azure.

You'll build a simple contact list web application that is built on ASP.NET MVC 4 and uses the ADO.NET Entity Framework for database access. The following illustration shows the completed application:

![screenshot of website][intro001]

In this tutorial:

- [Set up the development environment][setupdbenv]
- [Set up the Windows Azure environment][setupwindowsazureenv]
- [Create an ASP.NET MVC 4 application][createapplication]
- [Deploy the application to Windows Azure][deployapp1]
- [Add a database to the application][adddb]
- [Add a Controller and a view for the data][addcontroller]
- [Add a Web API Restful interface][addwebapi]
- [Publish the application update to Windows Azure and SQL Database][deploy2]

<h2><a name="bkmk_setupdevenv"></a>Set up the development environment</h2>

To start, set up your development environment by installing the Windows Azure SDK for the .NET Framework. (If you already have Visual Studio or Visual Web Developer, the SDK isn't required for this tutorial. It will be required later if you follow the suggestionsaa for further learning at the end of the tutorial.)

1. To install the Windows Azure SDK for .NET, click the button that corresponds to the version of Visual Studio you are using. If you don't have Visual Studio installed yet, use the Visual Studio 2012 button.<br/>
<a href="http://go.microsoft.com/fwlink/?LinkID=252834" class="site-arrowboxcta download-cta">Get Tools and SDK for Visual Studio 2012</a><br/>
<a href="http://go.microsoft.com/fwlink/?LinkID=252835" class="site-arrowboxcta download-cta">Get Tools and SDK for Visual Studio 2010</a>
2. When you are prompted to run or save WindowsAzureSDKForNet.exe, click Run.<br/>
![run the WindowsAzureSDKForNet.exe file][setup001]
3. In the Web Platform Installer window, click **Install** and proceed with the installation.<br/>
![Web Platform Installer - Windows Azure SDK for .NET][setup002]<br/>
4. If you are using Visual Studio 2010 or Visual Web Developer 2010 Express, install [Visual Studio 2010 Web Publish Update][WTEInstall] and [MVC 4][MVC4Install].

When the installation is complete, you have everything necessary to start developing

<h2><a name="bkmk_setupwindowsazure"></a>Set up the Windows Azure environment</h2>

Next, set up the Windows Azure environment by creating a Windows Azure account, a Windows Azure Web Site, and a SQL database.

### Create a Windows Azure account

1. Open a web browser, and browse to [http://www.windowsazure.com][windowsazure.com].
2. To get started with a free account, click **Free Trial** in the upper-right corner and follow the steps.<br/>
![Free trial screenshot][setup003]

### Create a website and a SQL database in Windows Azure

The next step is to create the Windows Azure website and the SQL database that your application will use.

Your Windows Azure Web Site will run in a shared hosting environment, which means it runs on virtual machines (VMs) that are shared with other Windows Azure clients. A shared hosting environment is a low-cost way to get started in the cloud. Later, if your web traffic increases, the application can scale to meet the need by running on dedicated VMs. If you need a more complex architecture, you can migrate to a Windows Azure Cloud Service. Cloud services run on dedicated VMs that you can configure according to your needs.

SQL Database is a cloud-based relational database service that is built on SQL Server technologies. The tools and applications that work with SQL Server also work with SQL Database.

1. In the Windows Azure Management Portal, click **New**.<br/>
![New button in Management Portal][setup004]
2. Click **Web Site**, and then click **Create with Database**.<br/>
![Create with Database link in Management Portal][setup005]<br/>
The **New Web Site - Create with Database** wizard opens. The Create with Database wizard enables you to create a website and a database at the same time.
3. In the **New Web Site** step of the wizard, enter a string in the **URL** box to use as the unique URL for your application.<br/>The complete URL will consist of what you enter here plus the suffix that you see below the text box. The illustration shows "contactmanager", but if someone has already taken that URL you have to choose a different one.
4. In the **Database** drop-down list, choose **Create a new SQL database**.
5. In the **Region** drop-down list, choose the region that is closest to you.<br/>
This setting specifies which data center your VM will run in.
6. Click the arrow that points to the right at the bottom of the box.
![Create a New Web Site step of New Web Site - Create with Database wizard][setup006]<br/>
The wizard advances to the **Database Settings** step.
7. In the **Name** box, enter a name for your database.
8. In the **Server** box, select **New SQL Database server**.
9. Click the arrow that points to the right at the bottom of the box.<br/>
![Database Settings step of New Web Site - Create with Database wizard][setup007]
The wizard advances to the **Create a Server** step.
10. Enter an administrator name and password.
You aren't entering an existing name and password here. You're entering a new name and password that you're defining now to use later when you access the database.
11. In the **Region** box, choose the same region that you chose for the website.
Keeping the web server and the database server in the same region gives you the best performance.
12. Make sure that **Allow Windows Azure Services to access the server** is selected.
This option is selected by default. It creates a firewall rule that allows your Windows Azure website to access this database.
13. Click the check mark at the bottom of the box to indicate you're finished.
![Create a Server step of New Web Site - Create with Database wizard][setup008]
The Management Portal returns to the Web Sites page, and the **Status** column shows that the site is being created. After a while (typically less than a minute), the **Status** column shows that the site was successfully created. In the navigation bar at the left, the number of sites you have in your account appears in the **Web Sites** icon, and the number of databases appears in the **SQL Databases** icon.<br/>
![Web Sites page of Management Portal, website created][setup009]

<h2><a name="bkmk_createmvc4app"></a>Create an ASP.NET MVC 4 application</h2>

You have created a Windows Azure Web Site, but there is no content in it yet. Your next step is to create the Visual Studio web application project that you'll publish to Windows Azure.

### Create the project

1. Start Visual Studio 2010 .
2. From the **File** menu click **New** and select **Project**.
	![New Project in File menu][newapp001]
3. In the **New Project** dialog box, expand **Visual C#** and select **Web** under **Installed Templates** and then select **ASP.NET MVC 4 Web Application**.
3. In the **.NET Framework** make sure **.NET Framework 4** is selected.a
4. Name the application **ContactManager** and click **OK**.<br/>
	![New Project dialog box][newapp002]
5. In the **New ASP.NET MVC 4 Project** dialog box, select the **Internet Application** template.
6. In the **View Engine** drop-down list make sure that **Razor** is selected, and then click **OK**.<br/>
	![New ASP.NET MVC 4 Project dialog box][newapp003]

### Add the jQuery templating plugin

1. In the **Tools** menu, select **Library Package Manager** and then **Manage NuGet Packages for Solution...**.<br/>![NuGet in Tools menu][newapp006]
2. In the **Manage NuGet Packages** dialog, type jQuery in the search box, select **jQuery Templates (Beta)** and click **Install**.<br/>![NuGet manage package dialog][newapp007]
3. In the **Select Project**s dialog, make sure the ContactsManager project is selected and click **OK**.
4. Click **Close**.

### Set the page header and footer

1. In **Solution Explorer**, expand the Views\Shared folder and open the &#95;Layout.cshtml file.<br/>![_Layout.cshtml in Solution Explorer][newapp004]
2. In the **&lt;title&gt;** element, change "My ASP.NET MVC Application" to "Contact Manager".

	    <head>
	        <meta charset="utf-8" />
	        <title>@ViewBag.Title - Contact Manager</title>
	        <link href="~/favicon.ico" rel="shortcut icon" type="image/x-icon" />
3. In the **&lt;header&gt;** element, change "your logo here." to "Contact Manager".

        <header>
            <div class="content-wrapper">
                <div class="float-left">
                    <p class="site-title">@Html.ActionLink("Contact Manager", "Index", "Home")</p>
                </div>
4. In the **&lt;footer&gt;** element, change "Contact Manager" to "Contact Managert".

        <footer>
            <div class="content-wrapper">
                <div class="float-left">
                    <p>&copy; @DateTime.Now.Year - My ASP.NET MVC Application</p>
                </div>

### Run the application locally

1. Press CTRL+F5 to run the application.
The application home page appears in the default browser.<br/>
![To Do List home page][newapp005]

This is all you need to do for now to create the application that you'll deploy to Windows Azure. Later you'll add database functionality.

<h2><a name="bkmk_deploytowindowsazure1"></a>Deploy the application to Windows Azure</h2>

1. In your browser, open the Windows Azure Management Portal.
2. In the **Web Sites** tab, click the name of the site you created earlier.<br/>
![todolistapp in Management Portal Web Sites tab][setup009]
1. Near the right corner of the windo, click **Download publishing profile**.<br/>
![Quickstart tab and Download Publishing Profile button][firsdeploy001]<br/>
This step downloads a file that contains all of the settings that you need in order to deploy an application to your Web Site. You'll import this file into Visual Studio so you don't have to enter this information manually.
1. Save the .publishsettings file in a folder that you can access from Visual Studio.<br/>
![saving the .publishsettings file][firsdeploy002]
1. In Visual Studio, right-click the project in **Solution Explorer** and select **Publish** from the context menu.<br/>
![Publish in project context menu][firsdeploy003]<br/>
The **Publish Web** wizard opens.
1. In the **Profile** tab of the **Publish Web** wizard, click **Import**.<br/>
![Import button in Publish Web wizard][firsdeploy004]
1. Select the .publishsettings file you downloaded earlier, and then click **Open**.<br/>
![Import Publish Settings dialog box][firsdeploy005]
1. In the **Connection** tab, click **Validate Connection** to make sure that the settings are correct.<br/>
![Connection tab of Publish Web wizard][firsdeploy006]<br/>
When the connection has been validated, a green check mark is shown next to the **Validate Connection** button.
1. Click **Next**.<br/>
![connection successful icon and Next button in Connection tab][firsdeploy007]
1. In the **Settings** tab, click **Next**.<br/>
You can accept all of the default settings on this page.  You are deploying a Release build configuration and you don't need to delete files at the destination server. The **DefaultConnection** entry under **Databases** is for the ASP.NET membership (log on) functionality built into the default MVC 4 project template. You aren't using that membership functionality for this tutorial, so you don't need to enter any settings for **DefaultConnection**.<br/>
![Settings tab of the Publish Web wizard][firsdeploy007]
1. In the **Preview** tab, click **Start Preview**.<br/>
The tab displays a list of the files that will be copied to the server. Displaying the preview isn't required to publish the application but is a useful function to be aware of. In this case, you don't need to do anything with the list of files that is displayed.<br/>
![StartPreview button in the Preview tab][firsdeploy008]<br/>
1. Click **Publish**.<br/>
Visual Studio begins the process of copying the files to the Windows Azure server.<br/>
![Publish button in the Preview tab][firsdeploy009]
1. The **Output** window shows what deployment actions were taken and reports successful completion of the deployment.
1. The default browser automatically opens to the URL of the deployed site.<br/>
The application you created is now running in the cloud.<br/>
![To Do List home page running in Windows Azure][newapp005]<br/>

<h2><a name="bkmk_addadatabase"></a>Add a database to the application</h2>

Next, you'll update the MVC application to add the ability to display and update contacts and store the data in a database. The application will use the Entity Framework to create the database and to read and update data in the database.

### Add data model classes for the contacts

You begin by creating a simple data model in code.

1. In **Solution Explorer**, right-click the Models folder, click **Add**, and then **Class**.<br/>
![Add Class in Models folder context menu][adddb001]
2. In the **Add New Item** dialog box, name the new class file Contact.cs, and then click **Add**.<br/>
![Add New Item dialog box][adddb002]
3. Replace the contents of the Contacts.cs file with the following code.

		using System.Globalization;
		namespace ContactManager.Models
		{
    		public class Contact
   			{
        		public int ContactId { get; set; }
				public string Name { get; set; }
				public string Address { get; set; }
	        	public string City { get; set; }
				public string State { get; set; }
				public string Zip { get; set; }
				public string Email { get; set; }
				public string Twitter { get; set; }
				public string Self
        		{
            		get { return string.Format(CultureInfo.CurrentCulture,
				         "api/contacts/{0}", this.ContactId); }
            		set { }
        		}
    		}
		}
The **Contacts** class defines the data that you want to store for each contact, plus a primary key that is needed by the database.
4. Add another class file named ContactManagerContext.cs and replace the contents of the file with the following code.

		using System.Data.Entity;
		namespace ContactManager.Models
		{
    		public class ContactManagerContext : DbContext
    		{
        		// You can add custom code to this file. Changes will not be overwritten.
        		//
        		// If you want Entity Framework to drop and regenerate your database
        		// automatically whenever you change your model schema, add the following
        		// code to the Application_Start method in your Global.asax file.
        		// Note: this will destroy and re-create your database with every model change.
        		//
        		// System.Data.Entity.Database.SetInitializer(new System.Data.Entity.DropCreateDatabaseIfModelChanges<ContactManager.Models.ContactManagerContext>());
        		public ContactManagerContext() : base("name=ContactManagerContext")
       			{
        		}
        		public DbSet<Contact> Contacts { get; set; }
			}
		}

The **ContactManagerContext** class lets the Entity Framework know that you want to use **Contacts** objects as entities in an entity set.  An entity set in the Entity Framework corresponds to a table in a database. This is all the information the Entity Framework needs in order to create the database for you.
5. Build the project. For example, you can press F6.<br/>
Visual Studio compiles the data model classes that you created and makes them available for the following procedures that enable Code First Migrations and use MVC scaffolding.
6. Open the Web.config file.
7. In the connectionstrings section of the configuration add the ContactManagerContext Connection string.

		<add name="ContactManagerContext" providerName="System.Data.SqlClient" connectionString="Data Source=.\SQLEXPRESS; Initial Catalog=ContactManagerContext-20120515141224; Integrated Security=True; MultipleActiveResultSets=True" />

### Enable Migrations and create the database

The next task is to enable the Code First Migrations feature in order to create the database based on the data model you created.

1. In the **Tools** menu, select **Library Package Manager** and then **Package Manager Console**.<br/>
![Package Manager Console in Tools menu][migrations001]
2. In the **Package Manager Console** window, enter the following commands:<br/>
enable-migrations<br/>
add-migration Initial<br/>
update-database<br/>
![Package Manager Console commands][migrations002]

The **enable-migrations** command creates a Migrations folder and a **Configuration** class that the Entity Framework uses to control database updates.<br/>
The **add-migration Initial** command generates a class named **Initial** that creates the database. You can see the new class files in **Solution Explorer**.<br/>
![Migrations folder in Solution Explorer][migrations003]<br/>
In the **Initial** class, the **Up** method creates the Contacts table, and the **Down** method (used when you want to return to the previous state) drops it:<br/>
![Initial Migration class][migrations004]<br/>
Finally, **update-database** runs this first migration which creates the database. By default, the database is created as a SQL Server Express adatabase. (Unless you have SQL Server Express installed, in which case the database is created using the SQL Server Express instance.)

### Create web pages that enable app users to work with the contacts

In ASP.NET MVC the scaffolding feature can automatically generate code that performs create, read, update, and delete actions.

<h2><a name="bkmk_addcontroller"></a>Add a Controller and a view for the data</h2>

1. In **Solution Explorer**, right-click Controllers and click **Add**, and then click **Controller...**.<br/>![Add Controller in Controllers folder context menu][addcode001]
2. In the **Add Controller** dialog box, enter "HomeController" as your controller name, and select the **MVC Controller with read/write actions and views, using Entity Framework** template.
3. Select **Contacts** as your model class and **ContactsMangerContext** as your data context class, and then click **Add**.<br/>
![Add Controller dialog box][addcode002]
The MVC template created a default home page for your application, and you are replacing the default functionality with the contact list read and update functionality.
![Add Controller message box][addcode003] <br/>
Visual Studio creates a controller and views for each of the four main database operations (create, read, update, delete) for **Contacts** objects.
4. Expand the Views\Shared folder and open the Index.cshtml file.<br/>![Modify index.cshtml in views\home folder context menu][addcode004]
5. Replace the contents of the file with the following code.

		@model IEnumerable<ContactManager.Models.Contact>
		@{
	    	ViewBag.Title = "Home";
		}
		@section Scripts {
	    	@Scripts.Render("~/bundles/jquerytmpl")
	    	<script type="text/javascript">
	        	$(function () {
	            	// POST
	            	$("#addContact").submit(function () {
	                	$.post(
	                	"api/contacts",
	                	$("#addContact").serialize(),
	                	function (value) {
	                    	$("#contactTemplate").tmpl(value).appendTo("#contacts");
	               	 	},
	                	"json"
	            	);
	                	return false;
	            	});
	            	// DELETE
	           	 	$(".removeContact").live("click", function () {
	                	$.ajax({
	                    	type: "DELETE",
	                    	url: $(this).attr("href"),
	                    	context: this,
	                    	success: function () {
	                        	$(this).closest("li").remove();
	                    	}
	                	});
	                	return false;
	            	});
	        	});
	    	</script>
	    	<script id="contactTemplate" type="text/html">
	            	<li class="ui-widget-content ui-corner-all">
	                	<h1 class="ui-widget-header">${ Name }</h1>
	               	 	<p>${ Address }, <br />${ City } ${ State } ${ Zip }<br />
	                   	<a href="mailto:${ Email }">${ Email }</a><br/>
	                   	<a href="http://twitter.com/${ Twitter }">@@${ Twitter }</a></p>
	                	<p><a href="${ Self }.png" class="viewImage ui-state-default ui-corner-all" target="_blank">Image</a>
	                   	<a href="${ Self }" class="removeContact ui-state-default ui-corner-all">Remove</a></p>
	           	 	</li>
	    	</script>
		}
		<ul id="contacts">
	    	@foreach (var contact in Model)
	    	{
	        	<li class="ui-widget-content ui-corner-all">
	           	<h1 class="ui-widget-header">@contact.Name</h1>
	           	<p>@contact.Address, <br />@contact.City @contact.State @contact.Zip<br />
	                	<a href="mailto:@contact.Email">@contact.Email</a><br/>
	                	<a href="http://twitter.com/@contact.Twitter">@@@contact.Twitter</a></p>
	            	<p><a href="@contact.Self" class="removeContact ui-state-default ui-corner-all">Remove</a></p>
	        	</li>
	    	}
		</ul>
		<form method="post" id="addContact">
	    <fieldset>
	        <legend>Add New Contact</legend>
	        <ol>
	            <li>
	                <label for="Name">Name</label>
	                <input type="text" name="Name" />
	            </li>
	             <li>
	                <label for="Address">Address</label>
	                <input type="text" name="Address" />
	            </li>
	             <li>
	                <label for="City">City</label>
	                <input type="text" name="City" />
	            </li>
	             <li>
	                <label for="State">State</label>
	                <input type="text" name="State" />
	            </li>
	             <li>
	                <label for="Zip">Zip</label>
	                <input type="text" name="Zip" />
	            </li>
	             <li>
	                <label for="Email">E-mail</label>
	                <input type="text" name="Email" />
	            </li>
	             <li>
	                <label for="Twitter">Twitter</label>
	                <input type="text" name="Twitter" />
	            </li>
	        </ol>
	        <input type="submit" value="Add" />
	    	</fieldset>
		</form>

6. Right-click the Content folder and click **Add**, and then click **New Item...**.<br/>![Add style sheet in Content folder context menu][addcode005]
7. In the **Add New Item** dialog box, expand C# and select Web under Installed Templates and then select **Style Sheet**.<br/>![Add New Item dialog box][addcode006]
8. Name the file **Contacts.css** and click **Add**. Replace the contents of the file with the following code.

		.column {
	    	float: left;
	    	width: 50%;
	    	padding: 0;
	    	margin: 5px 0;
		}

		form ol {
	    	list-style-type: none;
	    	padding: 0;
	    	margin: 0;
		}

		form li {
	    	padding: 1px;
	    	margin: 3px;
		}

		form input[type="text"] {
	    	width: 100%;
		}

		#addContact {
	    	width: 300px;
	    	float: left;
	    	width:30%;
		}

		#contacts {
	    	list-style-type: none;
	    	margin: 0;
	    	padding: 0;
	    	float:left;
	    	width: 70%;
		}

		#contacts li {
	    	margin: 3px 3px 3px 0;
	    	padding: 1px;
	    	float: left;
	    	width: 300px;
	    	text-align: center;
	    	background-image: none;
	    	background-color: #F5F5F5;
		}

		#contacts li h1
		{
	    	padding: 0;
	    	margin: 0;
	    	background-image: none;
	    	background-color: Orange;
	    	color: White;
	    	font-family: Trebuchet MS, Tahoma, Verdana, Arial, sans-serif;
		}

		.removeContact, .viewImage
		{
	   	 	padding: 3px;
	    	text-decoration: none;
		}

9. Expand the App\_Start folder and open the BundleConfig.cs file.<br/>![Modify BundleConfig.cs in App_Start folder context menu][addcode007]
13. Add the following statement to register the jQuery templating plugin that you installed from nuGet.

		bundles.Add(new ScriptBundle("~/bundles/jquerytmpl").Include(
                        "~/Scripts/jQuery.tmpl*"));
14. Modify the contents/css entry to register the contacts.css style sheet.

        bundles.Add(new StyleBundle("~/Content/css").Include(
                    "~/Content/site.css",
                    "~/Content/contacts.css"));

<h2><a name="bkmk_addwebapi"></a>Add a Web API Restful interface</h2>

1. In **Solution Explorer**, right-click Controllers and click **Add**, and then click **New Folder**.<br/>
![Add new folder context menu][addwebapi001]
2. Enter "Apis" and the press the **Enter** key.
3. Right-click on the Apis folder and click **Add**, and then click **Controller...**.<br/>
![Add class in  folder context menu][addwebapi002]
4. In the **Add Controller** dialog box, enter "ContactsController" as your controller name, and select the **API contorller with empty read/write actions** template. Click **Add**.<br/>
![Add controller dialog box for web api][addwebapi003]

### Run the application locally

1. Press CTRL+F5 to run the application.<br/>
![Index page][intro001]
2. Enter a contact and click **Add**. The app returns to the home page and displays the item you entered.<br/>
![Index page with to-do list items][addwebapi004]
3. Copy the URL from the address bar. Open a new browser window and paste the URL into the address bar.<br/>![Index page with to-do list items][addwebapi005]
The RESTful web API you added returns the the stored contacts.<br/>![Web API save dialog][addwebapi006]
You can open the returned contacts in notepad or a broswer.
This output can be consumed by another application such as mobile web page or application.<br/>![Web API save dialog][addwebapi007]

<h2><a name="bkmk_deploydatabaseupdate"></a>Publish the application update to Windows Azure and SQL Database</h2>

To publish the application, you repeat the procedure you followed earlier, adding a step to configure database deployment.

1. In **Solution Explorer**, right click the project and select **Publish**.
2. In the **Publish Web** wizard, select the **Profile** tab.
3. Click **Import**.
4. Select the same .publishsettings file that you selected earlier.
You're importing the .publishsettings file again because it has the SQL Database connection string you need for configuring database publishing.
5. Click the **Settings** tab.
6. In the connection string box for the **Contacts** database, select the SQL Database connection string that was provided in the .publishsettings file.<br/>
7. Select **Execute Code First Migrations (runs on application start)**.<br/>
![Settings tab of Publish Web wizard][lastdeploy001]<br/>
(As was noted earlier, the **DefaultConnection** database is for the ASP.NET membership system. You are not using membership functionality in this tutorial, so you aren't configuring this database for deployment.)
8. Click **Publish**.<br/>
After the deployment completes, the browser opens to the home page of the application.<br/>
![Index page with no to-do list items][intro001]<br/>
The Visual Studio publish process automatically configured the connection string in the deployed Web.config file to point to the SQL database. It also configured Code First Migrations to automatically upgrade the database to the latest version the first time the application accesses the database after deployment.
As a result of this configuration, Code First created the database by running the code in the **Initial** class that you created earlier. It did this the first time the application tried to access the database after deployment.
9. Enter a to-do list item as you did when you ran the app locally, to verify that database deployment succeeded.
When you see that the item you enter is saved and appears on the Index page, you know that it has been stored in the database.<br/>
![Index page with to-do list items][addwebapi004]

The application is now running in the cloud, using SQL Database to store its data.

<h2><a name="aspnetwindowsazureinfo"></a>Important Information about ASP.NET in Windows Azure Web Sites</h2>

Here are some things to be aware of when you plan and develop an ASP.NET application for Windows Azure Web Sites:

* The application must target ASP.NET 4.0 or earlier (not ASP.NET 4.5).
* The application runs in Integrated mode (not Classic mode).
* The application should not use Windows Authentication. Windows Authentication is usually not used as an authentication mechanism for Internet-based applications.
* In order to use provider-based features such as membership, profile, role manager, and session state, the application must use the ASP.NET Universal Providers (the [System.Web.Providers][UniversalProviders] NuGet package).
* If the applications writes to files, the files should be located in the application's content folder or one of its subfolders.

<h2><a name="nextsteps"></a>Next Steps</h2>

You've seen how to deploy a web application that implements RESTful web API to a Windows Azure Web Site. To learn more about how to configure, manage, and scale Windows Azure Web Sites, see the how-to topics on the [Common Tasks][CommonTasks] page.

To learn how to deploy an application to a Windows Azure Cloud Service, see [The Cloud Service version of this tutorial][NetAppWithSqlAzure]. Some reasons for choosing to run an ASP.NET web application in a Windows Azure Cloud Service rather than a Windows Azure Web Site include the following:

* You want administrator permissions on the web server that the application runs on.
* You want to use Remote Desktop Connection to access the web server that the application runs on.

Another way to store data in a Windows Azure application is to use Windows Azure Storage Services, which provides non-relational data storage in the form of blobs and tables. The to-do list application could have been designed to use Windows Azure Storage instead of SQL Database. For more information about both SQL Database and Windows Azure Storage, see [Data Storage Offerings on the Windows Azure Platform][WindowsAzureDataStorageOfferings].

To learn more about how to use SQL Database, see the following resources:

* [Data Migration to SQL Database: Tools and Techniques][SQLAzureDataMigration]
* [Migrating a Database to SQL Database using SSDT][SQLAzureDataMigrationBlog]
* [General Guidelines and Limitations (SQL Database)][SQLAzureGuidelines]
* [How to Use SQL Database][SQLAzureHowTo]
* [Transact-SQL Reference (SQL Database)][TSQLReference]
* [Minimizing Connection Pool errors in SQL Database][SQLAzureConnPoolErrors]

You might want to use the ASP.NET membership system in Windows Azure. For information about how to use either Windows Azure Storage or SQL Database for the membership database, see [Real World: ASP.NET Forms-Based Authentication Models for Windows Azure][ASP.NETFormsAuth].

To learn more about the Entity Framework and Code First Migrations, see the following resources:

* [Getting Started with Entity Framework using MVC][EFCodeFirstMVCTutorial]
* [Code First Migrations][EFCFMigrations]

<!-- bookmarks -->
[setupdbenv]: #bkmk_setupdevenv
[setupwindowsazureenv]: #bkmk_setupwindowsazure
[createapplication]: #bkmk_createmvc4app
[deployapp1]: #bkmk_deploytowindowsazure1
[adddb]: #bkmk_addadatabase
[addcontroller]: #bkmk_addcontroller
[addwebapi]: #bkmk_addwebapi
[deploy2]: #bkmk_deploydatabaseupdate

<!-- links -->
[WTEInstall]: http://go.microsoft.com/fwlink/?LinkID=208120
[MVC4Install]: http://www.asp.net/mvc/mvc4
[VS2012ExpressForWebInstall]: http://www.microsoft.com/web/gallery/install.aspx?appid=VWD11_BETA&prerelease=true
[windowsazure.com]: http://www.windowsazure.com
[WindowsAzureDataStorageOfferings]: http://social.technet.microsoft.com/wiki/contents/articles/data-storage-offerings-on-the-windows-azure-platform.aspx
[GoodFitForAzure]: http://msdn.microsoft.com/en-us/library/windowsazure/hh694036(v=vs.103).aspx
[NetAppWithSQLAzure]: http://www.windowsazure.com/en-us/develop/net/net-app-with-sql-azure
[MultiTierApp]: http://www.windowsazure.com/en-us/develop/net/tutorials/multi-tier-application/
[HybridApp]: http://www.windowsazure.com/en-us/develop/net/tutorials/hybrid-solution/
[SQLAzureHowTo]: https://www.windowsazure.com/en-us/develop/net/how-to-guides/sql-azure/
[SQLAzureDataMigration]: http://msdn.microsoft.com/en-us/library/windowsazure/hh694043(v=vs.103).aspx
[ASP.NETFormsAuth]: http://msdn.microsoft.com/en-us/library/windowsazure/hh508993.aspx
[CommonTasks]: http://windowsazure.com/develop/net/common-tasks/
[TSQLReference]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336281.aspx
[SQLAzureGuidelines]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336245.aspx
[SQLAzureDataMigrationBlog]: http://blogs.msdn.com/b/ssdt/archive/2012/04/19/migrating-a-database-to-sql-azure-using-ssdt.aspx
[SQLAzureConnPoolErrors]: http://blogs.msdn.com/b/adonet/archive/2011/11/05/minimizing-connection-pool-errors-in-sql-azure.aspx
[UniversalProviders]: http://nuget.org/packages/System.Web.Providers
[EFCodeFirstMVCTutorial]: http://www.asp.net/mvc/tutorials/getting-started-with-ef-using-mvc/creating-an-entity-framework-data-model-for-an-asp-net-mvc-application
[EFCFMigrations]: http://msdn.microsoft.com/en-us/library/hh770484

<!-- images-->
[intro001]: ../Media/dntutmobil-intro-finished-web-app.png
[setup001]: ../Media/dntutmobile-setup-run-sdk-setup-exe.png
[setup002]: ../Media/dntutmobile-setup-web-pi.png
[setup003]: ../Media/dntutmobile-setup-azure-account-1.png
[setup004]: ../Media/dntutmobile-setup-azure-site-001.png
[setup005]: ../Media/dntutmobile-setup-azure-site-002.png
[setup006]: ../Media/dntutmobile-setup-azure-site-003.png
[setup007]: ../Media/dntutmobile-setup-azure-site-004.png
[setup008]: ../Media/dntutmobile-setup-azure-site-005.png
[setup009]: ../Media/dntutmobile-setup-azure-site-006.png
[newapp001]: ../Media/dntutmobile-createapp-001.png
[newapp002]: ../Media/dntutmobile-createapp-002.png
[newapp003]: ../Media/dntutmobile-createapp-003.png
[newapp004]: ../Media/dntutmobile-createapp-004.png
[newapp005]: ../Media/dntutmobile-createapp-005.png
[newapp006]: ../Media/dntutmobile-setup-add-nuget-jquery-package.png
[newapp007]: ../Media/dntutmobile-setup-manage-nuget-package.png
[firsdeploy001]: ../Media/dntutmobile-deploy1-download-profile.png
[firsdeploy002]: ../Media/dntutmobile-deploy1-save-profile.png
[firsdeploy003]: ../Media/dntutmobile-deploy1-publish-001.png
[firsdeploy004]: ../Media/dntutmobile-deploy1-publish-002.png
[firsdeploy005]: ../Media/dntutmobile-deploy1-publish-003.png
[firsdeploy006]: ../Media/dntutmobile-deploy1-publish-004.png
[firsdeploy007]: ../Media/dntutmobile-deploy1-publish-005.png
[firsdeploy008]: ../Media/dntutmobile-deploy1-publish-006.png
[firsdeploy009]: ../Media/dntutmobile-deploy1-publish-007.png
[adddb001]: ../Media/dntutmobile-adddatabase-001.png
[adddb002]: ../Media/dntutmobile-adddatabase-002.png
[migrations001]: ../Media/dntutmobile-migrations-tools-context.png
[migrations002]: ../Media/dntutmobile-migrations-output.png
[migrations003]: ../Media/dntutmobile-migrations-solution-explorer-migrations-folder.png
[migrations004]: ../Media/dntutmobile-migrations-code-output.png
[addcode001]: ../Media/dntutmobile-controller-add-context-menu.png
[addcode002]: ../Media/dntutmobile-controller-add-controller-dialog.png
[addcode003]: ../Media/dntutmobile-controller-add-controller-override-dialog.png
[addcode004]: ../Media/dntutmobile-controller-modify-index-context.png
[addcode005]: ../Media/dntutmobile-controller-add-contents-context-menu.png
[addcode006]: ../Media/dntutmobile-controller-add-new-item-style-sheet.png
[addcode007]: ../Media/dntutmobile-controller-modify-bundleconfig-context.png
[addwebapi001]: ../Media/dntutmobile-webapi-add-folder-context-menu.png
[addwebapi002]: ../Media/dntutmobile-webapi-add-controller-context-menu.png
[addwebapi003]: ../Media/dntutmobile-webapi-add-controller-dialog.png
[addwebapi004]: ../Media/dntutmobile-webapi-added-contact.png
[addwebapi005]: ../Media/dntutmobile-webapi-new-browser.png
[addwebapi006]: ../Media/dntutmobile-webapi-save-returned-contacts.png
[addwebapi007]: ../Media/dntutmobile-webapi-contacts-in-notepad.png
[lastdeploy001]: ../Media/dntutmobile-web-publish-settings.png



