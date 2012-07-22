# Mobile-friendly REST service using ASP.NET Web API and SQL Database 

This tutorial shows how to deploy an ASP.NET web application that uses the ASP.NET Web API to a Windows Azure Web Site by using the Publish Web wizard in Visual Studio 2010. If you prefer, you can follow the tutorial steps by using Visual Web Developer Express 2010, Visual Studio 2012 RC or Visual Studio 2012 for Web Express RC.

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

To start, set up your development environment by installing the Windows Azure SDK for the .NET Framework. (If you already have Visual Studio or Visual Web Developer, the SDK isn't required for this tutorial. It will be required later if you follow the suggestions for further learning at the end of the tutorial.)

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

<div chunk="../../Shared/Chunks/create-azure-account.md" />

### Enable Windows Azure Web Sites

<div chunk="../../Shared/Chunks/antares-iaas-signup.md" />


### Create a web site and a SQL database in Windows Azure

The next step is to create the Windows Azure web site and the SQL database that your application will use.

Your Windows Azure Web Site will run in a shared hosting environment, which means it runs on virtual machines (VMs) that are shared with other Windows Azure clients. A shared hosting environment is a low-cost way to get started in the cloud. Later, if your web traffic increases, the application can scale to meet the need by running on dedicated VMs. If you need a more complex architecture, you can migrate to a Windows Azure Cloud Service. Cloud services run on dedicated VMs that you can configure according to your needs.

SQL Database is a cloud-based relational database service that is built on SQL Server technologies. The tools and applications that work with SQL Server also work with SQL Database.

1. In the Windows Azure Management Portal, click **New**.<br/>
![New button in Management Portal][setup004]
2. Click **Web Site**, and then click **Create with Database**.<br/>
![Create with Database link in Management Portal][setup005]<br/>
The **New Web Site - Create with Database** wizard opens. The Create with Database wizard enables you to create a web site and a database at the same time.
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
![Database Settings step of New Web Site - Create with Database wizard][setup007]<br/>
The wizard advances to the **Create a Server** step.
10. Enter an administrator name and password.
You aren't entering an existing name and password here. You're entering a new name and password that you're defining now to use later when you access the database.
11. In the **Region** box, choose the same region that you chose for the web site.
Keeping the web server and the database server in the same region gives you the best performance.
12. Make sure that **Allow Windows Azure Services to access the server** is selected.
This option is selected by default. It creates a firewall rule that allows your Windows Azure web site to access this database.
13. Click the check mark at the bottom of the box to indicate you're finished.
![Create a Server step of New Web Site - Create with Database wizard][setup008]<br/>
The Management Portal returns to the Web Sites page, and the **Status** column shows that the site is being created. After a while (typically less than a minute), the **Status** column shows that the site was successfully created. In the navigation bar at the left, the number of sites you have in your account appears next to the **Web Sites** icon, and the number of databases appears next to the **SQL Databases** icon.<br/>
![Web Sites page of Management Portal, website created][setup009]

<h2><a name="bkmk_createmvc4app"></a>Create an ASP.NET MVC 4 application</h2>

You have created a Windows Azure Web Site, but there is no content in it yet. Your next step is to create the Visual Studio web application project that you'll publish to Windows Azure.

### Create the project

1. Start Visual Studio 2010 .
2. From the **File** menu click **New** and select **Project**.<br/>![New Project in File menu][newapp001]
3. In the **New Project** dialog box, expand **Visual C#** and select **Web** under **Installed Templates** and then select **ASP.NET MVC 4 Web Application**.
3. In the **.NET Framework** make sure **.NET Framework 4** is selected.
4. Name the application **ContactManager** and click **OK**.<br/>
	![New Project dialog box][newapp002]
5. In the **New ASP.NET MVC 4 Project** dialog box, select the **Internet Application** template.
6. In the **View Engine** drop-down list make sure that **Razor** is selected, and then click **OK**.<br/>
	![New ASP.NET MVC 4 Project dialog box][newapp003]

### Set the page header and footer

First you will configure the initial layout and view elements for the application.

1. In **Solution Explorer**, expand the Views\Shared folder and open the \_Layout.cshtml file.<br/>![_Layout.cshtml in Solution Explorer][newapp004]
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

4. In the **&lt;header&gt;** element, remove following code.

        <div class="float-right">
            <section id="login">
                @Html.Partial("_LoginPartial")
            </section>
            <nav>
                <ul id="menu">
                    <li>@Html.ActionLink("Home", "Index", "Home")</li>
                    <li>@Html.ActionLink("About", "About", "Home")</li>
                    <li>@Html.ActionLink("Contact", "Contact", "Home")</li>
                </ul>
            </nav>
        </div>
5. In the **&lt;footer&gt;** element, change "My ASP.NET MVC Application" to "Contact Manager".

        <footer>
            <div class="content-wrapper">
                <div class="float-left">
                    <p>&copy; @DateTime.Now.Year - Contact Manager</p>
                </div>
6. In the **&lt;footer&gt;** element, remove following code.

        <div class="float-right">
            <ul id="social">
                <li><a href="http://facebook.com" class="facebook">Facebook</a></li>
                <li><a href="http://twitter.com" class="twitter">Twitter</a></li>
            </ul>
        </div>

7. Right-click the \_LoginPartial.cshtml file and click **Delete**.<br/>![Delete context menu for _logingpartial.cshtml][newapp004.1]
8. Expand the Views\Home folder and delete the About.cshtml and Contact.cshtml files.
9. Right-click the Account folder under views and click **Delete**.<br/>![Delete context menu for the accounts folder][newapp004.2]

### Run the application locally

Run the application locally to see the initial layout of the contact manager page.

1. Press CTRL+F5 to run the application.
The application home page appears in the default browser.<br/>
![To Do List home page][newapp005]

This is all you need to do for now to create the application that you'll deploy to Windows Azure. Later you'll add database functionality.

<h2><a name="bkmk_deploytowindowsazure1"></a>Deploy the application to Windows Azure</h2>

1. In your browser, open the Windows Azure Management Portal.
2. In the **Web Sites** tab, click the name of the site you created earlier.<br/>
![Contact manager application in Management Portal Web Sites tab][setup009]
3. Near the right corner of the window, click **Download publish profile**.<br/>
![Quickstart tab and Download Publishing Profile button][firsdeploy001]<br/>
This step downloads a file that contains all of the settings that you need in order to deploy an application to your Web Site. You'll import this file into Visual Studio so you don't have to enter this information manually.
4. Save the .publishsettings file in a folder that you can access from Visual Studio.<br/>
![saving the .publishsettings file][firsdeploy002]
5. In Visual Studio, right-click the project in **Solution Explorer** and select **Publish** from the context menu.<br/>
![Publish in project context menu][firsdeploy003]<br/>
The **Publish Web** wizard opens.
6. In the **Profile** tab of the **Publish Web** wizard, click **Import**.<br/>
![Import button in Publish Web wizard][firsdeploy004]
7. Select the .publishsettings file you downloaded earlier, and then click **Open**.<br/>
![Import Publish Settings dialog box][firsdeploy005]
8. In the **Connection** tab, click **Validate Connection** to make sure that the settings are correct.<br/>
![Connection tab of Publish Web wizard][firsdeploy006]<br/>
When the connection has been validated, a green check mark is shown next to the **Validate Connection** button.
9. Click **Next**.<br/>
![connection successful icon and Next button in Connection tab][firsdeploy007]
10. In the **Settings** tab, click **Next**.<br/>
You can accept all of the default settings on this page.  You are deploying a Release build configuration and you don't need to delete files at the destination server. The **DefaultConnection** entry under **Databases** is for the ASP.NET membership (log on) functionality built into the default MVC 4 project template. You aren't using that membership functionality for this tutorial, so you don't need to enter any settings for **DefaultConnection**.<br/>
![Settings tab of the Publish Web wizard][firsdeploy008]
12. In the **Preview** tab, click **Start Preview**.<br/>
The tab displays a list of the files that will be copied to the server. Displaying the preview isn't required to publish the application but is a useful function to be aware of. In this case, you don't need to do anything with the list of files that is displayed.<br/>
![StartPreview button in the Preview tab][firsdeploy009]<br/>
12. Click **Publish**.<br/>
Visual Studio begins the process of copying the files to the Windows Azure server.
13. The **Output** window shows what deployment actions were taken and reports successful completion of the deployment.
14. The default browser automatically opens to the URL of the deployed site.<br/>
The application you created is now running in the cloud.<br/>
![To Do List home page running in Windows Azure][newapp005]

<h2><a name="bkmk_addadatabase"></a>Add a database to the application</h2>

Next, you'll update the MVC application to add the ability to display and update contacts and store the data in a database. The application will use the Entity Framework to create the database and to read and update data in the database.

### Add data model classes for the contacts

You begin by creating a simple data model in code.

1. In **Solution Explorer**, right-click the Models folder, click **Add**, and then **Class**.<br/>
![Add Class in Models folder context menu][adddb001]

3. In the **Add New Item** dialog box, name the new class file Contact.cs, and then click **Add**.<br/>
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
The **Contacts** class defines the data that you want to store for each contact, plus a primary key, ContactID, that is needed by the database.
4. Expand the Models folder and delete the AccountModels.cs file.

### Create web pages that enable app users to work with the contacts

In ASP.NET MVC the scaffolding feature can automatically generate code that performs create, read, update, and delete actions.

<h2><a name="bkmk_addcontroller"></a>Add a Controller and a view for the data</h2>

1. In **Solution Explorer**, right-click Controllers and expand the folder.
2. Delete the AccountController.cs file.
3. Build the project. For example, you can press F6.<br/>
Visual Studio compiles the data model classes that you created and makes them available for the following steps that enable Code First Migrations and use MVC scaffolding.
4. Right-click the Controllers folder and click **Add**, and then click **Controller...**.<br/>![Add Controller in Controllers folder context menu][addcode001]
5. In the **Add Controller** dialog box, enter "HomeController" as your controller name, and select the **MVC Controller with read/write actions and views, using Entity Framework** template.
6. Select **Contacts** as your model class and **&lt;New data context...>** as your data context class.<br/>![Add Controller dialog box][addcode002]
7. On the **New Data Context** dialog box, click OK.<br/>![Add Controller dialog box][addcode002.1]
8. on the **Add Controller** dialog box, and then click **Add**.<br/>
The MVC template created a default home page for your application, and you are replacing the default functionality with the contact list read and update functionality.<br/>
9. On the **Add Controller** overwrite dialog, make sure all options are checked and click **OK**.<br/>
![Add Controller message box][addcode003] <br/>
Visual Studio creates a controller and views for each of the four main database operations (create, read, update, delete) for **Contacts** objects.

## Enable Migrations, create the database, add sample data and a data initializer ##

The next task is to enable the Code First Migrations feature in order to create the database based on the data model you created.

1. In the **Tools** menu, select **Library Package Manager** and then **Package Manager Console**.<br/>
![Package Manager Console in Tools menu][addcode008]
2. In the **Package Manager Console** window, enter the following commands:<br/>

		enable-migrations
		add-migration Initial

	The **enable-migrations** command creates a Migrations folder and a **Configuration** class that the Entity Framework uses to control database updates.<br/>
	The **add-migration Initial** command generates a class named **Initial** that creates the database. You can see the new class files in **Solution Explorer**.<br/>
	In the **Initial** class, the **Up** method creates the Contacts table, and the **Down** method (used when you want to return to the previous state) drops it.<br/>
3. Right-click the Migrations folder and open the **Configuration.cs** file. 
4. Add the folloing to list of namespaces. 

    	 using ContactManager.Models;

5. Add the following code to the seed method.
		
		context.Contacts.AddOrUpdate(
		    p => p.Name,
		    new Contact { Name = "Debra Garcia", Address = "1234 Main St", City = "Redmond", State = "WA", Zip = "10999", Email = "debra@example.com", Twitter = "debra_example" },
		    new Contact { Name = "Thorsten Weinrich", Address = "5678 1st Ave W", City = "Redmond", State = "WA", Zip = "10999", Email = "thorsten@example.com", Twitter = "thorsten_example" },
		    new Contact { Name = "Yuhong Li", Address = "9012 State st", City = "Redmond", State = "WA", Zip = "10999", Email = "yuhong@example.com", Twitter = "yuhong_example" },
		    new Contact { Name = "Jon Orton", Address = "3456 Maple St", City = "Redmond", State = "WA", Zip = "10999", Email = "jon@example.com", Twitter = "jon_example" },
		    new Contact { Name = "Diliana Alexieva-Bosseva", Address = "7890 2nd Ave E", City = "Redmond", State = "WA", Zip = "10999", Email = "diliana@example.com", Twitter = "diliana_example" }
		    );

	This will define an initializer to provide sample contacts with which to seed the database.


6. In the **Package Manager Console** enter the command:<br/>

	update-database

	![Package Manager Console commands][addcode009]

	The **update-database** runs the first migration which creates the database. By default, the database is created as a SQL Server Express LocalDB database. (Unless you have SQL Server Express installed, in which case the database is created using the SQL Server Express instance.)

7. Build the solution by pressing F6.

Visual Studio compiles the data model classes that you created and makes them available for the following procedures that enable Code First Migrations and use MVC scaffolding.


<h2><a name="bkmk_addview"></a>Add a view for the data</h2>

1. Expand the Views\Shared folder and open the Index.cshtml file.<br/>![Modify index.cshtml in views\home folder context menu][addcode004]
2. Replace the contents of the file with the following code.

		@model IEnumerable<ContactManager.Models.Contact>

		@{
		    ViewBag.Title = "Home";
		}

		@section Scripts {
		    @Scripts.Render("~/bundles/knockout")
		    <script type="text/javascript">
		        function ContactsViewModel() {
		            var self = this;
		            self.contacts = ko.observableArray([]);
		            self.addContact = function () {
		                $.post("api/contacts",
		                    $("#addContact").serialize(),
		                    function (value) {
		                        self.contacts.push(value);
		                    },
		                    "json");
		            }
		            self.removeContact = function (contact) {
		                $.ajax({
		                    type: "DELETE",
		                    url: contact.Self,
		                    success: function () {
		                        self.contacts.remove(contact);
		                    }
		                });
		            }

		            $.getJSON("api/contacts", function (data) {
		                self.contacts(data);
		            });
		        }

		        ko.applyBindings(new ContactsViewModel());
		    </script>
		}

		<ul id="contacts" data-bind="foreach: contacts">
		    <li class="ui-widget-content ui-corner-all">
		        <h1 data-bind="text: Name" class="ui-widget-header"></h1>
		        <div><span data-bind="text: $data.Address || 'Address?'"></span></div>
		        <div>
		            <span data-bind="text: $data.City || 'City?'"></span>,
		            <span data-bind="text: $data.State || 'State?'"></span>
		            <span data-bind="text: $data.Zip || 'Zip?'"></span>
		        </div>
		        <div data-bind="if: $data.Email"><a data-bind="attr: { href: 'mailto:' + Email }, text: Email"></a></div>
		        <div data-bind="ifnot: $data.Email"><span>Email?</span></div>
		        <div data-bind="if: $data.Twitter"><a data-bind="attr: { href: 'http://twitter.com/' + Twitter }, text: '@@' + Twitter"></a></div>
		        <div data-bind="ifnot: $data.Twitter"><span>Twitter?</span></div>
		        <p><a data-bind="attr: { href: Self }, click: $root.removeContact" class="removeContact ui-state-default ui-corner-all">Remove</a></p>
		    </li>
		</ul>

		<form id="addContact" data-bind="submit: addContact">
		    <fieldset>
		        <legend>Add New Contact</legend>
		        <ol>
		            <li>
		                <label for="Name">Name</label>
		                <input type="text" name="Name" />
		            </li>
		            <li>
		                <label for="Address">Address</label>
		                <input type="text" name="Address" >
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

3. Right-click the Content folder and click **Add**, and then click **New Item...**.<br/>![Add style sheet in Content folder context menu][addcode005]
4. In the **Add New Item** dialog box, expand C# and select Web under Installed Templates and then select **Style Sheet**.<br/>![Add New Item dialog box][addcode006]
5. Name the file **Contacts.css** and click **Add**. Replace the contents of the file with the following code.

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

6. Expand the App\_Start folder and open the BundleConfig.cs file.<br/>![Modify BundleConfig.cs in App_Start folder context menu][addcode007]
7. Add the following statement to register the knockout plugin.

		bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
		            "~/Scripts/knockout-2.0.0.js"));
	This sample using knockout to simplify dynamic JavaScript code that handles the screen templates.

8. Modify the contents/css entry to register the contacts.css style sheet.

        bundles.Add(new StyleBundle("~/Content/css").Include(
                    "~/Content/site.css",
                    "~/Content/contacts.css"));

<h2><a name="bkmk_addwebapi"></a>Add a Web API Restful interface</h2>

1. In **Solution Explorer**, right-click Controllers and click **Add**, and then click **New Folder**.<br/>
![Add new folder context menu][addwebapi001]
2. Enter "Apis" and the press the **Enter** key.
3. Right-click on the Apis folder and click **Add**, and then click **Controller...**.<br/>
![Add class in  folder context menu][addwebapi002]
4. In the **Add Controller** dialog box, enter "ContactsController" as your controller name, select the **API controller with empty read/write actions, using Entity Framework** template
5. In **Model Class** select Contact (ContactManager.Models) and it **Data Context Class** select ContactManagerContext (ContactManager.Models).
6. Click **Add**.<br/>![Add controller dialog box for web api][addwebapi003]
7. Right-click the App\_Start folder and click **Add**, and then click **Class**.
8. In the **Add New Item** dialog type WebApiConfig.cs and then click **Add**.
9. Replace the code with

		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Web;
		using System.Web.Http;
		using ContactManager.Models;
		using System.Net.Http.Formatting;
		using System.Net.Http;

		namespace ContactManager
		{
		    public static class WebApiConfig
		    {
		        public static void Configure(HttpConfiguration config)
		        {
		            // Filters
		            config.Filters.Add(new QueryableAttribute());

		            config.Routes.MapHttpRoute(
		                name: "DefaultApi",
		                routeTemplate: "api/{controller}/{id}",
		                defaults: new { id = RouteParameter.Optional }
		            );
		        }
		    }
		}
	This defined the HTTP routing for the RESTful API call. When a
10. Open the RouteConfig.cs and remove the following code.

        routes.MapHttpRoute(
            name: "DefaultApi",
            routeTemplate: "api/{controller}/{id}",
            defaults: new { id = RouteParameter.Optional }
        );
11. Open Global.asax file and add the following line to the Appplication_Start method.

		WebApiConfig.Configure(GlobalConfiguration.Configuration);

### Run the application locally

1. Press CTRL+F5 to run the application.<br/>
![Index page][intro001]
2. Enter a contact and click **Add**. The app returns to the home page and displays the contact you entered.<br/>
![Index page with to-do list items][addwebapi004]
3. Copy the URL from the address bar. Open a new browser window and paste the URL into the address bar and add /api/contacts to the URL.<br/>
![Index page with to-do list items][addwebapi005]<br/>
The RESTful web API you added returns the stored contacts.<br/>
![Web API save dialog][addwebapi006]<br/>
	You can open the returned contacts in notepad or a browser.
	This output can be consumed by another application such as mobile web page or application.<br/>
![Web API save dialog][addwebapi007]

<h2><a name="bkmk_deploydatabaseupdate"></a>Publish the application update to Windows Azure and SQL Database</h2>

To publish the application, you repeat the procedure you followed earlier, adding a step to configure database deployment.

1. In **Solution Explorer**, right click the project and select **Publish**.
2. In the **Publish Web** wizard, select the **Profile** tab.
3. Click **Import**.
4. Select the same .publishsettings file that you selected earlier.
You're importing the .publishsettings file again because it has the SQL Database connection string you need for configuring database publishing.
5. Click the **Settings** tab.
6. In the connection string box for the **Contacts** database, select the SQL Database connection string that was provided in the .publishsettings file.<br/>
7. Select **Apply Code First Migrations (runs on application start)**.<br/>
![Settings tab of Publish Web wizard][lastdeploy001]<br/>
(As was noted earlier, the **DefaultConnection** database is for the ASP.NET membership system. You are not using membership functionality in this tutorial, so you aren't configuring this database for deployment.)
8. Click **Publish**.<br/>
After the deployment completes, the browser opens to the home page of the application.<br/>
![Index page with no contacts][intro001]<br/>
The Visual Studio publish process automatically configured the connection string in the deployed Web.config file to point to the SQL database. It also configured Code First Migrations to automatically upgrade the database to the latest version the first time the application accesses the database after deployment.
As a result of this configuration, Code First created the database by running the code in the **Initial** class that you created earlier. It did this the first time the application tried to access the database after deployment.
9. Enter a contact as you did when you ran the app locally, to verify that database deployment succeeded.
When you see that the item you enter is saved and appears on the contact manager page, you know that it has been stored in the database.<br/>
![Index page with contacts][addwebapi004]

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

Another way to store data in a Windows Azure application is to use Windows Azure Storage Services, which provides non-relational data storage in the form of blobs and tables. The Contact Manager application could have been designed to use Windows Azure Storage instead of SQL Database. For more information about both SQL Database and Windows Azure Storage, see [Data Storage Offerings on Windows Azure][WindowsAzureDataStorageOfferings].

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
[newapp004.1]: ../Media/dntutmobile-createapp-004.1.png
[newapp004.2]: ../Media/dntutmobile-createapp-004.2.png
[newapp005]: ../Media/dntutmobile-createapp-005.png
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
[addcode001]: ../Media/dntutmobile-controller-add-context-menu.png
[addcode002]: ../Media/dntutmobile-controller-add-controller-dialog.png
[addcode002.1]: ../Media/dntutmobile-controller-002.1.png
[addcode003]: ../Media/dntutmobile-controller-add-controller-override-dialog.png
[addcode003.1]: ../Media/dntutmobile-controller-explorer-globalasas-file.png
[addcode004]: ../Media/dntutmobile-controller-modify-index-context.png
[addcode005]: ../Media/dntutmobile-controller-add-contents-context-menu.png
[addcode006]: ../Media/dntutmobile-controller-add-new-item-style-sheet.png
[addcode007]: ../Media/dntutmobile-controller-modify-bundleconfig-context.png
[addcode008]: ../Media/dntutmobile-migrations-package-manager-menu.png
[addcode009]: ../Media/dntutmobile-migrations-package-manager-console.png
[addwebapi001]: ../Media/dntutmobile-webapi-add-folder-context-menu.png
[addwebapi002]: ../Media/dntutmobile-webapi-add-controller-context-menu.png
[addwebapi003]: ../Media/dntutmobile-webapi-add-controller-dialog.png
[addwebapi004]: ../Media/dntutmobile-webapi-added-contact.png
[addwebapi005]: ../Media/dntutmobile-webapi-new-browser.png
[addwebapi006]: ../Media/dntutmobile-webapi-save-returned-contacts.png
[addwebapi007]: ../Media/dntutmobile-webapi-contacts-in-notepad.png
[lastdeploy001]: ../Media/dntutmobile-web-publish-settings.png



