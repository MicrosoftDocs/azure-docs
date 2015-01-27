<properties 
	pageTitle=".NET REST service using Web API - Azure tutorial" 
	description="A tutorial that teaches you how to deploy an app that uses the ASP.NET Web API to an Azure website by using Visual Studio." 
	services="web-sites" 
	documentationCenter=".net" 
	authors="riande" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="web-sites" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="11/06/2014" 
	ms.author="riande"/>

# REST service using ASP.NET Web API and SQL Database 

***By [Rick Anderson](https://twitter.com/RickAndMSFT) and Tom Dykstra.***

This tutorial shows how to deploy an ASP.NET web application to an Azure Website by using the Publish Web wizard in Visual Studio 2013 or Visual Studio 2013 for Web Express. 

You can open an Azure account for free, and if you don't already have Visual Studio 2013, the SDK automatically installs Visual Studio 2013 for Web Express. So you can start developing for Azure entirely for free.

This tutorial assumes that you have no prior experience using Azure. On completing this tutorial, you'll have a simple web application up and running in the cloud.
 
You'll learn:

* How to enable your machine for Azure development by installing the Azure SDK.
* How to create a Visual Studio ASP.NET MVC 5 project and publish it to an Azure Website.
* How to use the ASP.NET Web API to enable Restful API calls.
* How to use a SQL database to store data in Azure.
* How to publish application updates to Azure.

You'll build a simple contact list web application that is built on ASP.NET MVC 5 and uses the ADO.NET Entity Framework for database access. The following illustration shows the completed application:

![screenshot of web site][intro001]

In this tutorial:

* [Set up the development environment][setupdbenv]
* [Set up the Azure environment][setupwindowsazureenv]
* [Create an ASP.NET MVC 5 application][createapplication]
* [Deploy the application to Azure][deployapp1]
* [Add a database to the application][adddb]
* [Add a Controller and a view for the data][addcontroller]
* [Add a Web API Restful interface][addwebapi]
* [Add XSRF Protection][]
* [Publish the application update to Azure and SQL Database][deploy2]

<a name="bkmk_setupdevenv"></a>
<!-- the next line produces the "Set up the development environment" section as see at http://www.windowsazure.com/en-us/documentation/articles/web-sites-dotnet-get-started/ -->
[AZURE.INCLUDE [create-account-and-websites-note](../includes/create-account-and-websites-note.md)]

<h2><a name="bkmk_setupwindowsazure"></a>Set up the Azure environment</h2>

Next, set up the Azure environment by creating an Azure Website and a SQL database.

### Create a website and a SQL database in Azure

The next step is to create the Azure website and the SQL database that your application will use.

Your Azure Website will run in a shared hosting environment, which means it runs on virtual machines (VMs) that are shared with other Azure clients. A shared hosting environment is a low-cost way to get started in the cloud. Later, if your web traffic increases, the application can scale to meet the need by running on dedicated VMs. If you need a more complex architecture, you can migrate to an Azure Cloud Service. Cloud services run on dedicated VMs that you can configure according to your needs.

SQL Database is a cloud-based relational database service that is built on SQL Server technologies. The tools and applications that work with SQL Server also work with SQL Database.

1. In the [Azure Management Portal](https://manage.windowsazure.com), click **Websites** in the left tab, and then click  **New**.

2. Click **CUSTOM CREATE**.

	![Create with Database link in Management Portal](./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rr6.PNG)

	The **New Website - Custom Create** wizard opens. 

3. In the **New Website** step of the wizard, enter a string in the **URL** box to use as the unique URL for your application. The complete URL will consist of what you enter here plus the suffix that you see below the text box. The illustration shows "contactmgr11", but that URL is probably taken so you'll have to choose a different one.

1. In the **Region** drop-down list, choose the region that is closest to you.

1. In the **Database** drop-down list, choose **Create a free 20 MB SQL database**.

	![Create a New Website step of New Website - Create with Database wizard](./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rrCWS.png)

6. Click the arrow that points to the right at the bottom of the box.

	The wizard advances to the **Database Settings** step.

7. In the **Name** box, enter *ContactDB*.

8. In the **Server** box, select **New SQL Database server**. Alternatively, if you previously created a SQL Server database, you can select that SQL Server from the dropdown control.

9. Click the arrow that points to the right at the bottom of the box.

10. Enter an administrator **LOGIN NAME** and **PASSWORD**. If you selected **New SQL Database server** you aren't entering an existing name and password here, you're entering a new name and password that you're defining now to use later when you access the database. If you selected a SQL Server you've created previously, you'll be prompted for the password to the previous SQL Server account name you created. For this tutorial, we won't check the **Advanced ** box. The **Advanced ** box allows you to set the DB size (the default is 1 GB but you can increase this to 150 GB) and the collation.

11. Click the check mark at the bottom of the box to indicate you're finished.

	![Database Settings step of New Website - Create with Database wizard][setup007]

	 The following image shows using an existing SQL Server and Login.
	
	![Database Settings step of New Website - Create with Database wizard][rxPrevDB]

	The Management Portal returns to the Websites page, and the **Status** column shows that the site is being created. After a while (typically less than a minute), the **Status** column shows that the site was successfully created. In the navigation bar at the left, the number of sites you have in your account appears next to the **Websites** icon, and the number of databases appears next to the **SQL Databases** icon.

<!-- [Websites page of Management Portal, website created][setup009] -->

<h2><a name="bkmk_createmvc4app"></a>Create an ASP.NET MVC 5 application</h2>

You have created an Azure Website, but there is no content in it yet. Your next step is to create the Visual Studio web application project that you'll publish to Azure.

### Create the project

1. Start Visual Studio 2013.
1. From the **File** menu click **New Project**.
3. In the **New Project** dialog box, expand **Visual C#** and select **Web**  and then select **ASP.NET MVC 5 Web Application**. Keep the default **.NET Framework 4.5**. Name the application **ContactManager** and click **OK**.
	![New Project dialog box](./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rr4.PNG)]
1. In the **New ASP.NET Project** dialog box, select the **MVC** template, check **Web API** and then click **Change Authentication**.

	![New ASP.NET Project dialog box](./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rt3.PNG)

1. In the **Change Authentication** dialog box, click **No Authentication**, and then click **OK**.

	![No Authentication](./media/web-sites-dotnet-get-started-vs2013/GS13noauth.png)

	The sample application you're creating won't have features that require users to log in. For information about how to implement authentication and authorization features, see the [Next Steps](#nextsteps) section at the end of this tutorial. 

1. In the **New ASP.NET Project** dialog box, click **OK**.

	![New ASP.NET Project dialog box](./media/web-sites-dotnet-get-started-vs2013/GS13newaspnetprojdb.png)

### Set the page header and footer


1. In **Solution Explorer**, expand the *Views\Shared* folder and open the *_Layout.cshtml* file.

	![_Layout.cshtml in Solution Explorer][newapp004]

1. Replace the contents of the *_Layout.cshtml* file with the following code:


		<!DOCTYPE html>
		<html lang="en">
		<head>
		    <meta charset="utf-8" />
		    <title>@ViewBag.Title - Contact Manager</title>
		    <link href="~/favicon.ico" rel="shortcut icon" type="image/x-icon" />
		    <meta name="viewport" content="width=device-width" />
		    @Styles.Render("~/Content/css")
		    @Scripts.Render("~/bundles/modernizr")
		</head>
		<body>
		    <header>
		        <div class="content-wrapper">
		            <div class="float-left">
		                <p class="site-title">@Html.ActionLink("Contact Manager", "Index", "Home")</p>
		            </div>
		        </div>
		    </header>
		    <div id="body">
		        @RenderSection("featured", required: false)
		        <section class="content-wrapper main-content clear-fix">
		            @RenderBody()
		        </section>
		    </div>
		    <footer>
		        <div class="content-wrapper">
		            <div class="float-left">
		                <p>&copy; @DateTime.Now.Year - Contact Manager</p>
		            </div>
		        </div>
		    </footer>
		    @Scripts.Render("~/bundles/jquery")
		    @RenderSection("scripts", required: false)
		</body>
		</html>
			
The markup above changes the app name from "My ASP.NET App" to "Contact Manager", and it removes the links to **Home**, **About** and **Contact**.

### Run the application locally

1. Press CTRL+F5 to run the application.
The application home page appears in the default browser.
	![To Do List home page](./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rr5.PNG)

This is all you need to do for now to create the application that you'll deploy to Azure. Later you'll add database functionality.

<h2><a name="bkmk_deploytowindowsazure1"></a>Deploy the application to Azure</h2>

1. In Visual Studio, right-click the project in **Solution Explorer** and select **Publish** from the context menu.

	![Publish in project context menu][PublishVSSolution]

	The **Publish Web** wizard opens.

2. In the **Profile** tab of the **Publish Web** wizard, click **Import**.

	![Import publish settings][ImportPublishSettings]

	The **Import Publish Profile** dialog box appears.

 3.	Select Import from an Azure Website. You must first sign in if you have not previously done so. Click **Sign In**. Enter the user associated with your subscription and follow the steps to sign in.

	![sign in](./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rr7.png)

	Select your website from the drop-down list, and then click **OK**.

	![Import Publish Profile](./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rr8.png)

8. In the **Connection** tab, click **Validate Connection** to make sure that the settings are correct.

	![Validate connection][ValidateConnection]

9. When the connection has been validated, a green check mark is shown next to the **Validate Connection** button.

	![connection successful icon and Next button in Connection tab][firsdeploy007]

1. Click **Next**.

	![Settings tab](./media/web-sites-dotnet-get-started-vs2013/GS13SettingsTab.png)

	You can accept the default settings on this tab.  You're deploying a Release build configuration and you don't need to delete files at the destination server, precompile the application, or exclude files in the App_Data folder. If you want to debug on the live Azure site, you will need to deploy a debug configuration (not release). See the [Next Steps](#nextsteps) section at the end of this tutorial.

12. In the **Preview** tab, click **Start Preview**.

	The tab displays a list of the files that will be copied to the server. Displaying the preview isn't required to publish the application but is a useful function to be aware of. In this case, you don't need to do anything with the list of files that is displayed. The next time you publish, only the files that have changed will be in the preview list.

	![StartPreview button in the Preview tab][firsdeploy009]

12. Click **Publish**.

	Visual Studio begins the process of copying the files to the Azure server. The **Output** window shows what deployment actions were taken and reports successful completion of the deployment.

14. The default browser automatically opens to the URL of the deployed site.

	The application you created is now running in the cloud.
	
	![To Do List home page running in Azure][rxz2]

<h2><a name="bkmk_addadatabase"></a>Add a database to the application</h2>

Next, you'll update the MVC application to add the ability to display and update contacts and store the data in a database. The application will use the Entity Framework to create the database and to read and update data in the database.

### Add data model classes for the contacts

You begin by creating a simple data model in code.

1. In **Solution Explorer**, right-click the Models folder, click **Add**, and then **Class**.

	![Add Class in Models folder context menu][adddb001]

2. In the **Add New Item** dialog box, name the new class file *Contact.cs*, and then click **Add**.

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

The **Contacts** class defines the data that you will store for each contact, plus a primary key, ContactID, that is needed by the database. You can get more information about data models in the [Next Steps](#nextsteps) section at the end of this tutorial.

### Create web pages that enable app users to work with the contacts

The ASP.NET MVC the scaffolding feature can automatically generate code that performs create, read, update, and delete (CRUD) actions.

<h2><a name="bkmk_addcontroller"></a>Add a Controller and a view for the data</h2>

1. In **Solution Explorer**, expand the Controllers folder.

3. Build the project **(Ctrl+Shift+B)**. (You must build the project before using scaffolding mechanism.) 

4. Right-click the Controllers folder and click **Add**, and then click **Controller**.

	![Add Controller in Controllers folder context menu][addcode001]

1. In the **Add Scaffold** dialog box, select **MVC Controller with views, using Entity Framework** and click **Add**.

 ![Add controller](./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rrAC.PNG)

6. Set the controller name to **HomeController**. Select **Contact** as your model class. Click the **New data context** button and accept the default "ContactManager.Models.ContactManagerContext" for the **New data context type**. Click **Add**.

	![Add Controller dialog box](./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rr9.PNG)

	A dialog box will prompt you: "A file with the name HomeController already exits. Do you want to replace it?". Click **Yes**. We are overwriting the Home Controller that was created with the new project. We will use the new Home Controller for our contact list.

	Visual Studio creates a controller methods and views for CRUD database operations for **Contact** objects.

## Enable Migrations, create the database, add sample data and a data initializer ##

The next task is to enable the [Code First Migrations](http://curah.microsoft.com/55220) feature in order to create the database based on the data model you created.

1. In the **Tools** menu, select **Library Package Manager** and then **Package Manager Console**.

	![Package Manager Console in Tools menu][addcode008]

2. In the **Package Manager Console** window, enter the following command:

		enable-migrations 
  
	The **enable-migrations** command creates a *Migrations* folder and it puts in that folder a *Configuration.cs* file that you can edit to configure Migrations. 

2. In the **Package Manager Console** window, enter the following command:

		add-migration Initial

	The **add-migration Initial** command generates a class named **&lt;date_stamp&gt;Initial** that creates the database. The first parameter ( *Initial* ) is arbitrary and used to create the name of the file. You can see the new class files in **Solution Explorer**.

	In the **Initial** class, the **Up** method creates the Contacts table, and the **Down** method (used when you want to return to the previous state) drops it.

3. Open the *Migrations\Configuration.cs* file. 

4. Add the following namespaces. 

    	 using ContactManager.Models;

5. Replace the *Seed* method with the following code:
		
        protected override void Seed(ContactManager.Models.ContactManagerContext context)
        {
            context.Contacts.AddOrUpdate(p => p.Name,
               new Contact
               {
                   Name = "Debra Garcia",
                   Address = "1234 Main St",
                   City = "Redmond",
                   State = "WA",
                   Zip = "10999",
                   Email = "debra@example.com",
                   Twitter = "debra_example"
               },
                new Contact
                {
                    Name = "Thorsten Weinrich",
                    Address = "5678 1st Ave W",
                    City = "Redmond",
                    State = "WA",
                    Zip = "10999",
                    Email = "thorsten@example.com",
                    Twitter = "thorsten_example"
                },
                new Contact
                {
                    Name = "Yuhong Li",
                    Address = "9012 State st",
                    City = "Redmond",
                    State = "WA",
                    Zip = "10999",
                    Email = "yuhong@example.com",
                    Twitter = "yuhong_example"
                },
                new Contact
                {
                    Name = "Jon Orton",
                    Address = "3456 Maple St",
                    City = "Redmond",
                    State = "WA",
                    Zip = "10999",
                    Email = "jon@example.com",
                    Twitter = "jon_example"
                },
                new Contact
                {
                    Name = "Diliana Alexieva-Bosseva",
                    Address = "7890 2nd Ave E",
                    City = "Redmond",
                    State = "WA",
                    Zip = "10999",
                    Email = "diliana@example.com",
                    Twitter = "diliana_example"
                }
                );
        }

	This code above will initialize the database with the contact information. For more information on seeding the database, see [Debugging Entity Framework (EF) DBs](http://blogs.msdn.com/b/rickandy/archive/2013/02/12/seeding-and-debugging-entity-framework-ef-dbs.aspx).


1. In the **Package Manager Console** enter the command:

		update-database

	![Package Manager Console commands][addcode009]

	The **update-database** runs the first migration which creates the database. By default, the database is created as a SQL Server Express LocalDB database.

1. Press CTRL+F5 to run the application. 

The application shows the seed data and provides edit, details and delete links.

![MVC view of data][rxz3]

<h2><a name="bkmk_addview"></a>Edit the View</h2>

1. Open the *Views\Home\Index.cshtml* file. In the next step, we will replace the generated markup with code that uses [jQuery](http://jquery.com/) and [Knockout.js](http://knockoutjs.com/). This new code retrieves the list of contacts from using web API and JSON and then binds the contact data to the UI using knockout.js. For more information, see the [Next Steps](#nextsteps) section at the end of this tutorial. 


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

3. Right-click the Content folder and click **Add**, and then click **New Item...**.

	![Add style sheet in Content folder context menu][addcode005]

4. In the **Add New Item** dialog box, enter **Style** in the upper right search box and then select **Style Sheet**.
	![Add New Item dialog box][rxStyle]

5. Name the file *Contacts.css* and click **Add**. Replace the contents of the file with the following code.
    
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

	We will use this style sheet for the layout, colors and styles used in the contact manager app.

6. Open the *App_Start\BundleConfig.cs* file.


7. Add the following code to register the [Knockout](http://knockoutjs.com/index.html "KO") plugin.

		bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
		            "~/Scripts/knockout-{version}.js"));
	This sample using knockout to simplify dynamic JavaScript code that handles the screen templates.

8. Modify the contents/css entry to register the *contacts.css* style sheet. Change the following line:

                 bundles.Add(new StyleBundle("~/Content/css").Include(
                   "~/Content/bootstrap.css",
                   "~/Content/site.css"));
To:

        bundles.Add(new StyleBundle("~/Content/css").Include(
                   "~/Content/bootstrap.css",
                   "~/Content/contacts.css",
                   "~/Content/site.css"));

1. In the Package Manager Console, run the following command to install Knockout.

	Install-Package knockoutjs

<h2><a name="bkmk_addwebapi"></a>Add a controller for the Web API Restful interface</h2>

1. In **Solution Explorer**, right-click Controllers and click **Add** and then **Controller....** 

1. In the **Add Scaffold** dialog box, enter **Web API 2 Controller with actions, using Entity Framework** and then click **Add**.

	![Add API controller](./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rt1.PNG)

4. In the **Add Controller** dialog box, enter "ContactsController" as your controller name. Select "Contact (ContactManager.Models)" for the **Model class**.  Keep the default value for the **Data context class**. 

6. Click **Add**.

### Run the application locally

1. Press CTRL+F5 to run the application.

	![Index page][intro001]

2. Enter a contact and click **Add**. The app returns to the home page and displays the contact you entered.

	![Index page with to-do list items][addwebapi004]

3. In the browser, append **/api/contacts** to the URL.

	The resulting URL will resemble http://localhost:1234/api/contacts. The RESTful web API you added returns the stored contacts. Firefox and Chrome will display the data in XML format.

	![Index page with to-do list items][rxFFchrome]
	

	IE will prompt you to open or save the contacts.

	![Web API save dialog][addwebapi006]
	
	
	You can open the returned contacts in notepad or a browser.
	
	This output can be consumed by another application such as mobile web page or application.

	![Web API save dialog][addwebapi007]

	**Security Warning**: At this point, your application is insecure and vulnerable to CSRF attack. Later in the tutorial we will remove this vulnerability. For more information see [Preventing Cross-Site Request Forgery (CSRF) Attacks][prevent-csrf-attacks].

<h2><a name="xsrf"></a>Add XSRF Protection</h2>

Cross-site request forgery (also known as XSRF or CSRF) is an attack against web-hosted applications whereby a malicious website can influence the interaction between a client browser and a website trusted by that browser. These attacks are made possible because web browsers will send authentication tokens automatically with every request to a website. The canonical example is an authentication cookie, such as ASP.NET's Forms Authentication ticket. However, websites which use any persistent authentication mechanism (such as Windows Authentication, Basic, and so forth) can be targeted by these attacks.

An XSRF attack is distinct from a phishing attack. Phishing attacks require interaction from the victim. In a phishing attack, a malicious website will mimic the target website, and the victim is fooled into providing sensitive information to the attacker. In an XSRF attack, there is often no interaction necessary from the victim. Rather, the attacker is relying on the browser automatically sending all relevant cookies to the destination website.

For more information, see the [Open Web Application Security Project](https://www.owasp.org/index.php/Main_Page) (OWASP) [XSRF](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)).

1. In **Solution Explorer**, right **ContactManager** project and click **Add** and then click **Class**.

2. Name the file *ValidateHttpAntiForgeryTokenAttribute.cs* and add the following code:

        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Net;
        using System.Net.Http;
        using System.Web.Helpers;
        using System.Web.Http.Controllers;
        using System.Web.Http.Filters;
        using System.Web.Mvc;
        namespace ContactManager.Filters
        {
            public class ValidateHttpAntiForgeryTokenAttribute : AuthorizationFilterAttribute
            {
                public override void OnAuthorization(HttpActionContext actionContext)
                {
                    HttpRequestMessage request = actionContext.ControllerContext.Request;
                    try
                    {
                        if (IsAjaxRequest(request))
                        {
                            ValidateRequestHeader(request);
                        }
                        else
                        {
                            AntiForgery.Validate();
                        }
                    }
                    catch (HttpAntiForgeryException e)
                    {
                        actionContext.Response = request.CreateErrorResponse(HttpStatusCode.Forbidden, e);
                    }
                }
                private bool IsAjaxRequest(HttpRequestMessage request)
                {
                    IEnumerable<string> xRequestedWithHeaders;
                    if (request.Headers.TryGetValues("X-Requested-With", out xRequestedWithHeaders))
                    {
                        string headerValue = xRequestedWithHeaders.FirstOrDefault();
                        if (!String.IsNullOrEmpty(headerValue))
                        {
                            return String.Equals(headerValue, "XMLHttpRequest", StringComparison.OrdinalIgnoreCase);
                        }
                    }
                    return false;
                }
                private void ValidateRequestHeader(HttpRequestMessage request)
                {
                    string cookieToken = String.Empty;
                    string formToken = String.Empty;
					IEnumerable<string> tokenHeaders;
                    if (request.Headers.TryGetValues("RequestVerificationToken", out tokenHeaders))
                    {
                        string tokenValue = tokenHeaders.FirstOrDefault();
                        if (!String.IsNullOrEmpty(tokenValue))
                        {
                            string[] tokens = tokenValue.Split(':');
                            if (tokens.Length == 2)
                            {
                                cookieToken = tokens[0].Trim();
                                formToken = tokens[1].Trim();
                            }
                        }
                    }
                    AntiForgery.Validate(cookieToken, formToken);
                }
            }
        }

1. Add the following *using* statement to the contracts controller so you have access to the **[ValidateHttpAntiForgeryToken]** attribute.

	using ContactManager.Filters;

1. Add the **[ValidateHttpAntiForgeryToken]** attribute to the Post methods of the **ContactsController** to protect it from XSRF threats. You will add it to the "PutContact",  "PostContact" and **DeleteContact** action methods.

	[ValidateHttpAntiForgeryToken]
        public IHttpActionResult PutContact(int id, Contact contact)
        {

1. Update the *Scripts* section of the *Views\Home\Index.cshtml* file to include code to get the XSRF tokens.

         @section Scripts {
            @Scripts.Render("~/bundles/knockout")
            <script type="text/javascript">
                @functions{
                   public string TokenHeaderValue()
                   {
                      string cookieToken, formToken;
                      AntiForgery.GetTokens(null, out cookieToken, out formToken);
                      return cookieToken + ":" + formToken;                
                   }
                }

               function ContactsViewModel() {
                  var self = this;
                  self.contacts = ko.observableArray([]);
                  self.addContact = function () {

                     $.ajax({
                        type: "post",
                        url: "api/contacts",
                        data: $("#addContact").serialize(),
                        dataType: "json",
                        success: function (value) {
                           self.contacts.push(value);
                        },
                        headers: {
                           'RequestVerificationToken': '@TokenHeaderValue()'
                        }
                     });

                  }
                  self.removeContact = function (contact) {
                     $.ajax({
                        type: "DELETE",
                        url: contact.Self,
                        success: function () {
                           self.contacts.remove(contact);
                        },
                        headers: {
                           'RequestVerificationToken': '@TokenHeaderValue()'
                        }

                     });
                  }

                  $.getJSON("api/contacts", function (data) {
                     self.contacts(data);
                  });
               }
               ko.applyBindings(new ContactsViewModel());
            </script>


<h2><a name="bkmk_deploydatabaseupdate"></a>Publish the application update to Azure and SQL Database</h2>

To publish the application, you repeat the procedure you followed earlier.

1. In **Solution Explorer**, right click the project and select **Publish**.

	![Publish][rxP]

5. Click the **Settings** tab.
	

1. Under **ContactsManagerContext(ContactsManagerContext)**, click the **v** icon to change *Remote connection string* to the connection string for the contact database. Click **ContactDB**.

	![Settings](./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rt5.png)

7. Check the box for **Execute Code First Migrations (runs on application start)**.

1. Click **Next** and then click **Preview**. Visual Studio displays a list of the files that will be added or updated.

8. Click **Publish**.
After the deployment completes, the browser opens to the home page of the application.

	![Index page with no contacts][intro001]

	The Visual Studio publish process automatically configured the connection string in the deployed *Web.config* file to point to the SQL database. It also configured Code First Migrations to automatically upgrade the database to the latest version the first time the application accesses the database after deployment.

	As a result of this configuration, Code First created the database by running the code in the **Initial** class that you created earlier. It did this the first time the application tried to access the database after deployment.

9. Enter a contact as you did when you ran the app locally, to verify that database deployment succeeded.

When you see that the item you enter is saved and appears on the contact manager page, you know that it has been stored in the database.

![Index page with contacts][addwebapi004]

The application is now running in the cloud, using SQL Database to store its data. After you finish testing the application in Azure, delete it. The application is public and doesn't have a mechanism to limit access.

<h2><a name="nextsteps"></a>Next Steps</h2>

A real application would require authentication and authorization, and you would use the membership database for that purpose. The tutorial [Deploy a Secure ASP.NET MVC application with OAuth, Membership and SQL Database](http://www.windowsazure.com/en-us/develop/net/tutorials/web-site-with-sql-database/) is based on this tutorial and shows how to deploy a web application with the membership database.

Another way to store data in an Azure application is to use Azure storage, which provide non-relational data storage in the form of blobs and tables. The following links provide more information on Web API, ASP.NET MVC and Window Azure.
 

* [Getting Started with Entity Framework using MVC][EFCodeFirstMVCTutorial]
* [Intro to ASP.NET MVC 5](http://www.asp.net/mvc/tutorials/mvc-5/introduction/getting-started)
* [Your First ASP.NET Web API](http://www.asp.net/web-api/overview/getting-started-with-aspnet-web-api/tutorial-your-first-web-api)
* [Debugging WAWS](http://www.windowsazure.com/en-us/documentation/articles/web-sites-dotnet-troubleshoot-visual-studio/)

This tutorial and the sample application was written by [Rick Anderson](http://blogs.msdn.com/b/rickandy/) (Twitter [@RickAndMSFT](https://twitter.com/RickAndMSFT)) with assistance from Tom Dykstra and Barry Dorrans (Twitter [@blowdart](https://twitter.com/blowdart)). 

Please leave feedback on what you liked or what you would like to see improved, not only about the tutorial itself but also about the products that it demonstrates. Your feedback will help us prioritize improvements. We are especially interested in finding out how much interest there is in more automation for the process of configuring and deploying the membership database. 

<!-- bookmarks -->
[Add an OAuth Provider]: #addOauth
[Add Roles to the Membership Database]:#mbrDB
[Create a Data Deployment Script]:#ppd
[Update the Membership Database]:#ppd2
[setupdbenv]: #bkmk_setupdevenv
[setupwindowsazureenv]: #bkmk_setupwindowsazure
[createapplication]: #bkmk_createmvc4app
[deployapp1]: #bkmk_deploytowindowsazure1
[adddb]: #bkmk_addadatabase
[addcontroller]: #bkmk_addcontroller
[addwebapi]: #bkmk_addwebapi
[deploy2]: #bkmk_deploydatabaseupdate

<!-- links -->
[EFCodeFirstMVCTutorial]: http://www.asp.net/mvc/tutorials/getting-started-with-ef-using-mvc/creating-an-entity-framework-data-model-for-an-asp-net-mvc-application
[dbcontext-link]: http://msdn.microsoft.com/en-us/library/system.data.entity.dbcontext(v=VS.103).aspx


<!-- images-->
[rxE]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxE.png
[rxP]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxP.png
[rx22]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/
[rxb2]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxb2.png
[rxz]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxz.png
[rxzz]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxzz.png
[rxz2]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxz2.png
[rxz3]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxz3.png
[rxStyle]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxStyle.png
[rxz4]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxz4.png
[rxz44]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxz44.png
[rxNewCtx]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxNewCtx.png
[rxPrevDB]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxPrevDB.png
[rxOverwrite]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxOverwrite.png
[rxPWS]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxPWS.png
[rxNewCtx]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxNewCtx.png
[rxAddApiController]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxAddApiController.png
[rxFFchrome]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxFFchrome.png
[intro001]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobil-intro-finished-web-app.png
[rxCreateWSwithDB]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/rxCreateWSwithDB.png
[setup007]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-setup-azure-site-004.png
[setup009]: ../Media/dntutmobile-setup-azure-site-006.png
[newapp002]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-createapp-002.png
[newapp004]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-createapp-004.png
[firsdeploy007]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-deploy1-publish-005.png
[firsdeploy009]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-deploy1-publish-007.png
[adddb001]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-adddatabase-001.png
[adddb002]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-adddatabase-002.png
[addcode001]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-controller-add-context-menu.png
[addcode002]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-controller-add-controller-dialog.png
[addcode004]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-controller-modify-index-context.png
[addcode005]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-controller-add-contents-context-menu.png
[addcode007]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-controller-modify-bundleconfig-context.png
[addcode008]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-migrations-package-manager-menu.png
[addcode009]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-migrations-package-manager-console.png
[addwebapi004]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-webapi-added-contact.png
[addwebapi006]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-webapi-save-returned-contacts.png
[addwebapi007]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/dntutmobile-webapi-contacts-in-notepad.png
[Add XSRF Protection]: #xsrf
[WebPIAzureSdk20NetVS12]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/WebPIAzureSdk20NetVS12.png
[Add XSRF Protection]: #xsrf
[ImportPublishSettings]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/ImportPublishSettings.png
[ImportPublishProfile]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/ImportPublishProfile.png
[PublishVSSolution]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/PublishVSSolution.png
[ValidateConnection]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/ValidateConnection.png
[WebPIAzureSdk20NetVS12]: ./media/web-sites-dotnet-rest-service-aspnet-api-sql-database/WebPIAzureSdk20NetVS12.png
[prevent-csrf-attacks]: http://www.asp.net/web-api/overview/security/preventing-cross-site-request-forgery-(csrf)-attacks
