<properties linkid="develop-dotnet-rest-service-using-web-api" urlDisplayName="REST service using Web API" pageTitle=".NET REST service using Web API - Windows Azure tutorial" metaKeywords="Azure tutorial web site, ASP.NET API web site, Azure VS" metaDescription="A tutorial that teaches you how to deploy an app that uses the ASP.NET Web API to a Windows Azure web site by using Visual Studio." metaCanonical="" disqusComments="1" umbracoNaviHide="1" writer="tdykstra" />


<div chunk="../chunks/article-left-menu.md" />
# REST service using ASP.NET Web API and SQL Database 

***By [Rick Anderson](https://twitter.com/RickAndMSFT) and Tom Dykstra. Updated 15 April 2013.***

This tutorial shows how to deploy an ASP.NET web application that uses the ASP.NET Web API to a Windows Azure Web Site by using the Publish Web wizard in Visual Studio 2012 or Visual Studio 2012 for Web Express.

You can open a Windows Azure account for free, and if you don't already have Visual Studio 2012, the SDK automatically installs Visual Studio 2012 for Web Express. So you can start developing for Windows Azure entirely for free.

This tutorial assumes that you have no prior experience using Windows Azure. On completing this tutorial, you'll have a data-driven web application up and running in the cloud and using a cloud database.

You'll learn:

* How to enable your machine for Windows Azure development by installing the Windows Azure SDK.
* How to create a Visual Studio ASP.NET MVC 4 project and publish it to a Windows Azure Web Site.
* How to use the ASP.NET Web API to enable Restful API calls.
* How to use a SQL database to store data in Windows Azure.
* How to publish application updates to Windows Azure.

You'll build a simple contact list web application that is built on ASP.NET MVC 4 and uses the ADO.NET Entity Framework for database access. The following illustration shows the completed application:

![screenshot of web site][intro001]

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />

In this tutorial:

* [Set up the development environment][setupdbenv]
* [Set up the Windows Azure environment][setupwindowsazureenv]
* [Create an ASP.NET MVC 4 application][createapplication]
* [Deploy the application to Windows Azure][deployapp1]
* [Add a database to the application][adddb]
* [Add a Controller and a view for the data][addcontroller]
* [Add a Web API Restful interface][addwebapi]
* [Add XSRF Protection][]
* [Publish the application update to Windows Azure and SQL Database][deploy2]

<h2><a name="bkmk_setupdevenv"></a>Set up the development environment</h2>

To start, set up your development environment by installing the Windows Azure SDK for the .NET Framework. 


1. To install the Windows Azure SDK for .NET, click the link below. If you don't have Visual Studio 2012 installed yet, it will be installed by the link. This tutorial requires Visual Studio 2012. <br/>

	[Windows Azure SDK for Visual Studio 2012]( http://go.microsoft.com/fwlink/?LinkId=254364)<br/>

1. When you are prompted to run or save the installation executable, click **Run**.<br/>

1. In the Web Platform Installer window, click **Install** and proceed with the installation.<br/>

	![Web Platform Installer - Windows Azure SDK for .NET][WebPIAzureSdk20NetVS12]<br/>

When the installation is complete, you have everything necessary to start developing.

<h2><a name="bkmk_setupwindowsazure"></a>Set up the Windows Azure environment</h2>

Next, set up the Windows Azure environment by creating a Windows Azure Web Site and a SQL database.

### Create a web site and a SQL database in Windows Azure

The next step is to create the Windows Azure web site and the SQL database that your application will use.

Your Windows Azure Web Site will run in a shared hosting environment, which means it runs on virtual machines (VMs) that are shared with other Windows Azure clients. A shared hosting environment is a low-cost way to get started in the cloud. Later, if your web traffic increases, the application can scale to meet the need by running on dedicated VMs. If you need a more complex architecture, you can migrate to a Windows Azure Cloud Service. Cloud services run on dedicated VMs that you can configure according to your needs.

SQL Database is a cloud-based relational database service that is built on SQL Server technologies. The tools and applications that work with SQL Server also work with SQL Database.

1. In the [Windows Azure Management Portal](https://manage.windowsazure.com), click **Web Sites** in the left tab, and then click  **New**.<br/>

2. Click **CUSTOM CREATE**.<br/>

	![Create with Database link in Management Portal][rxCreateWSwithDB]<br/>

	The **New Web Site - Custom Create** wizard opens. 

3. In the **New Web Site** step of the wizard, enter a string in the **URL** box to use as the unique URL for your application. The complete URL will consist of what you enter here plus the suffix that you see below the text box. The illustration shows "contactmgr22", but that URL is probably taken so you’ll have to choose a different one.

1. In the **Region** drop-down list, choose the region that is closest to you.<br/>

1. In the **Database** drop-down list, choose **Create a new SQL database**.

	Accept the default connection string.

	![Create a New Web Site step of New Web Site - Create with Database wizard][rxz]<br/>

6. Click the arrow that points to the right at the bottom of the box.

	The wizard advances to the **Database Settings** step.

7. In the **Name** box, enter *ContactDB*.

8. In the **Server** box, select **New SQL Database server**. Alternatively, if you previously created a SQL Server database, you can select that SQL Server from the dropdown control.

9. Click the arrow that points to the right at the bottom of the box.<br/>

10. Enter an administrator **LOGIN NAME** and **PASSWORD**. If you selected **New SQL Database server** you aren't entering an existing name and password here, you're entering a new name and password that you're defining now to use later when you access the database. If you selected a SQL Server you’ve created previously, you’ll be prompted for the password to the previous SQL Server account name you created. For this tutorial, we won't check the **Advanced ** box. The **Advanced ** box allows you to set the DB size (the default is 1 GB but you can increase this to 150 GB) and the collation.

11. Click the check mark at the bottom of the box to indicate you're finished.

	![Database Settings step of New Web Site - Create with Database wizard][setup007]<br/>

	<br/> The following image shows using an existing SQL Server and Login.
	
	![Database Settings step of New Web Site - Create with Database wizard][rxPrevDB]<br/>

	The Management Portal returns to the Web Sites page, and the **Status** column shows that the site is being created. After a while (typically less than a minute), the **Status** column shows that the site was successfully created. In the navigation bar at the left, the number of sites you have in your account appears next to the **Web Sites** icon, and the number of databases appears next to the **SQL Databases** icon.<br/>

<!-- [Web Sites page of Management Portal, web site created][setup009] -->

<h2><a name="bkmk_createmvc4app"></a>Create an ASP.NET MVC 4 application</h2>

You have created a Windows Azure Web Site, but there is no content in it yet. Your next step is to create the Visual Studio web application project that you'll publish to Windows Azure.

### Create the project

1. Start Visual Studio 2012.
1. From the **File** menu click **New Project**.
3. In the **New Project** dialog box, expand **Visual C#** and select **Web** under **Installed Templates** and then select **ASP.NET MVC 4 Web Application**. Keep the default **.NET Framework 4.5**. Name the application **ContactManager** and click **OK**.<br/>
	![New Project dialog box][newapp002]
6. In the **New ASP.NET MVC 4 Project** dialog box, select the **Internet Application** template. Keep the default Razor **View Engine** and then click **OK**.<br/>
	![New ASP.NET MVC 4 Project dialog box][rxb2]

### Set the page header and footer


1. In **Solution Explorer**, expand the *Views\Shared* folder and open the *_Layout.cshtml* file.<br/>

	![_Layout.cshtml in Solution Explorer][newapp004]

1. Replace the contents of the *_Layout.cshtml* file with the following code:
<br/>

		&lt;!DOCTYPE html&gt;<br/>
	    &lt;html lang=&quot;en&quot;&gt;<br/>
	    &lt;head&gt;<br/>
	        &lt;meta charset=&quot;utf-8&quot; /&gt;<br/>
	        &lt;title&gt;@ViewBag.Title - Contact Manager&lt;/title&gt;<br/>
	        &lt;link href=&quot;~/favicon.ico&quot; rel=&quot;shortcut icon&quot; type=&quot;image/x-icon&quot; /&gt;<br/>
	        &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot; /&gt;<br/>
	        @Styles.Render(&quot;~/Content/css&quot;)<br/>
	        @Scripts.Render(&quot;~/bundles/modernizr&quot;)<br/>
	    &lt;/head&gt;<br/>
	    &lt;body&gt;<br/>
	        &lt;header&gt;<br/>
	            &lt;div class=&quot;content-wrapper&quot;&gt;<br/>
	                &lt;div class=&quot;float-left&quot;&gt;<br/>
	                    &lt;p class=&quot;site-title&quot;&gt;@Html.ActionLink(&quot;Contact Manager&quot;, &quot;Index&quot;, &quot;Home&quot;)&lt;/p&gt;<br/>              
	                &lt;/div&gt;<br/>
	            &lt;/div&gt;<br/>
	        &lt;/header&gt;<br/>
	        &lt;div id=&quot;body&quot;&gt;<br/>
	            @RenderSection(&quot;featured&quot;, required: false)<br/>
	            &lt;section class=&quot;content-wrapper main-content clear-fix&quot;&gt;<br/>
	                @RenderBody()<br/>
	            &lt;/section&gt;<br/>
	        &lt;/div&gt;<br/>
	        &lt;footer&gt;<br/>
	            &lt;div class=&quot;content-wrapper&quot;&gt;<br/>
	                &lt;div class=&quot;float-left&quot;&gt;<br/>
	                    &lt;p&gt;&amp;copy; @DateTime.Now.Year - Contact Manager&lt;/p&gt;<br/>
	                &lt;/div&gt;<br/>
	            &lt;/div&gt;<br/>
	        &lt;/footer&gt;<br/><br/>
	    	@Scripts.Render("~/bundles/jquery")<br/>
	    	@RenderSection("scripts", required: false)
	    &lt;/body&gt;<br/>
	    &lt;/html&gt;
	

### Run the application locally

1. Press CTRL+F5 to run the application.
The application home page appears in the default browser.<br/>

	![To Do List home page][rxzz]

This is all you need to do for now to create the application that you'll deploy to Windows Azure. Later you'll add database functionality.

<h2><a name="bkmk_deploytowindowsazure1"></a>Deploy the application to Windows Azure</h2>

5. In Visual Studio, right-click the project in **Solution Explorer** and select **Publish** from the context menu.<br/>

	![Publish in project context menu][PublishVSSolution]<br/>

	The **Publish Web** wizard opens.

6. In the **Profile** tab of the **Publish Web** wizard, click **Import**.<br/>

	![Import publish settings][ImportPublishSettings]

	The **Import Publish Profile** dialog box appears.

1. If you have not previously added your Windows Azure subscription in Visual Studio, perform the following steps. In these steps you add your subscription so that the drop-down list under **Import from a Windows Azure web site** will include your web site.

    a. In the **Import Publish Profile** dialog box, click **Add Windows Azure subscription**.<br/> 
    
	![add win az sub](../Media/rzAddWAsub.png)
    
	b. In the **Import Windows Azure Subscriptions** dialog box, click **Download subscription file**.<br/>
    
	![download sub](../Media/rzDownLoad.png)
    
	c. In your browser window, save the *.publishsettings* file.<br/>
    
	![download pub file](../Media/rzDown2.png)
    
	<div chunk="../../shared/chunks/publishsettingsfilewarningchunk.md" />
    
	d. In the **Import Windows Azure Subscriptions** dialog box, click **Browse** and navigate to the *.publishsettings* file.<br/>
    
	![download sub](../Media/rzDownLoad.png)
    
	e. Click **Import**.<br/>
    
	![import](../Media/rzImp.png)

7. In the **Import Publish Profile** dialog box, select **Import from a Windows Azure web site**, select your web site from the drop-down list, and then click **OK**.<br/>

	![Import Publish Profile][ImportPublishProfile]

8. In the **Connection** tab, click **Validate Connection** to make sure that the settings are correct.<br/>

	![Validate connection][ValidateConnection]<br/>

9. When the connection has been validated, a green check mark is shown next to the **Validate Connection** button.<br/>

	![connection successful icon and Next button in Connection tab][firsdeploy007]

10. You can accept all of the default settings on this page.  You are deploying a Release build configuration and you don't need to delete files at the destination server. The **UsersContext (DefaultConnection)** entry under **Databases** comes from the *UsersContext:DbContext* class which uses the DefaultConnection string. <br/>

	Click **Next**.<br/>

	![connection successful icon and Next button in Connection tab][rxPWS]

12. In the **Preview** tab, click **Start Preview**.<br/>

	The tab displays a list of the files that will be copied to the server. Displaying the preview isn't required to publish the application but is a useful function to be aware of. In this case, you don't need to do anything with the list of files that is displayed. The next time you publish, only the files that have changed will be in the preview list.<br/>

	![StartPreview button in the Preview tab][firsdeploy009]<br/>

12. Click **Publish**.<br/>

	Visual Studio begins the process of copying the files to the Windows Azure server. The **Output** window shows what deployment actions were taken and reports successful completion of the deployment.

14. The default browser automatically opens to the URL of the deployed site.<br/>

	The application you created is now running in the cloud.
	
	![To Do List home page running in Windows Azure][rxz2]

<h2><a name="bkmk_addadatabase"></a>Add a database to the application</h2>

Next, you'll update the MVC application to add the ability to display and update contacts and store the data in a database. The application will use the Entity Framework to create the database and to read and update data in the database.

### Add data model classes for the contacts

You begin by creating a simple data model in code.

1. In **Solution Explorer**, right-click the Models folder, click **Add**, and then **Class**.<br/>

	![Add Class in Models folder context menu][adddb001]

2. In the **Add New Item** dialog box, name the new class file *Contact.cs*, and then click **Add**.<br/>

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

The **Contacts** class defines the data that you will store for each contact, plus a primary key, ContactID, that is needed by the database.

### Create web pages that enable app users to work with the contacts

The ASP.NET MVC the scaffolding feature can automatically generate code that performs create, read, update, and delete (CRUD) actions.

<h2><a name="bkmk_addcontroller"></a>Add a Controller and a view for the data</h2>

1. In **Solution Explorer**, expand the Controllers folder.

3. Build the project **(Ctrl+Shift+B)**. (You must build the project before using scaffolding mechanism.) <br/>

4. Right-click the Controllers folder and click **Add**, and then click **Controller**.<br/>

	![Add Controller in Controllers folder context menu][addcode001]<br/>

5. In the **Add Controller** dialog box, enter "HomeController" as your controller name. Set the **Scaffolding options Template** to  **MVC Controller with read/write actions and views, using Entity Framework**.

6. Select **Contact** as your model class and **&lt;New data context...>** as your data context class.

	![Add Controller dialog box][addcode002]<br/>

7. On the **New Data Context** dialog box, accept the default value *ContactManager.Models.ContactManagerContext*.

	<br/>![Add Controller dialog box][rxNewCtx]<br/>

8. Click **OK**, then click **Add** in the **Add Controller** dialog box.<br/>

9. On the **Add Controller** overwrite dialog, make sure all options are checked and click **OK**.

	![Add Controller message box][rxOverwrite] <br/>

	Visual Studio creates a controller methods and views for CRUD database operations for **Contact** objects.

## Enable Migrations, create the database, add sample data and a data initializer ##

The next task is to enable the [Code First Migrations](http://atlas.asp.net/mvc/tutorials/getting-started-with-ef-using-mvc/creating-an-entity-framework-data-model-for-an-asp-net-mvc-application "code first MVC") feature in order to create the database based on the data model you created.

1. In the **Tools** menu, select **Library Package Manager** and then **Package Manager Console**.

	![Package Manager Console in Tools menu][addcode008]

2. In the **Package Manager Console** window, enter the following command:<br/>

		enable-migrations -ContextTypeName ContactManagerContext

	<br/>![enable-migrations][rxE] <br/>
	
	You must specify the context type name (**ContactManagerContext**) because the project contains two [DbContext](http://msdn.microsoft.com/en-us/library/system.data.entity.dbcontext(v=VS.103).aspx) derived classes, the **ContactManagerContext** we just added and the **UsersContext**, which is used for the membership database. The **ContactManagerContext** class was added by the Visual Studio scaffolding wizard.<br/>
  
	The **enable-migrations** command creates a *Migrations* folder and it puts in that folder a *Configuration.cs* file that you can edit to configure Migrations. <br/>

2. In the **Package Manager Console** window, enter the following command:<br/>

		add-migration Initial

	The **add-migration Initial** command generates a class named **&lt;date_stamp&gt;Initial** that creates the database. The first parameter ( *Initial* ) is arbitrary and used to create the name of the file. You can see the new class files in **Solution Explorer**.<br/>

	In the **Initial** class, the **Up** method creates the Contacts table, and the **Down** method (used when you want to return to the previous state) drops it.<br/>

3. Right-click the Migrations folder and open the **Configuration.cs** file. 

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


6. In the **Package Manager Console** enter the command:

		update-database

	![Package Manager Console commands][addcode009]

	The **update-database** runs the first migration which creates the database. By default, the database is created as a SQL Server Express LocalDB database. (Unless you have SQL Server Express installed, in which case the database is created using the SQL Server Express instance.)

7. Press CTRL+F5 to run the application. 

The application shows the seed data and provides edit, details and delete links.

<br/>![MVC view of data][rxz3]

<h2><a name="bkmk_addview"></a>Edit the View</h2>

1. Expand the Views\Home folder and open the Index.cshtml file.
	
	<!--<br/>![Modify index.cshtml in views\home folder context menu][addcode004]-->

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

	<br/><br/>![Add style sheet in Content folder context menu][addcode005]

4. In the **Add New Item** dialog box, enter **Style** in the upper right search box and then select **Style Sheet**.
	<br/>![Add New Item dialog box][rxStyle]

5. Name the file Contacts.css and click **Add**. Replace the contents of the file with the following code.
    
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

6. Expand the App\_Start folder and open the BundleConfig.cs file.

	<!--<br/>![Modify BundleConfig.cs in App_Start folder context menu][addcode007]-->

7. Add the following statement to register the [Knockout](http://knockoutjs.com/index.html "KO") plugin.

		bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
		            "~/Scripts/knockout-{version}.js"));
	This sample using knockout to simplify dynamic JavaScript code that handles the screen templates.

8. Modify the contents/css entry to register the contacts.css style sheet. Change the following line:

        bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));
To:

        bundles.Add(new StyleBundle("~/Content/css").Include(
                    "~/Content/site.css",
                    "~/Content/contacts.css"));

<h2><a name="bkmk_addwebapi"></a>Add a controller for the Web API Restful interface</h2>

1. In **Solution Explorer**, right-click Controllers and click **Add** and then **Controller....** 

4. In the **Add Controller** dialog box, enter "ContactsController" as your controller name, select the **API controller with read/write actions, using Entity Framework** template. 

5. In **Model Class** select *Contact (ContactManager.Models)* and in **Data Context Class** select *ContactManagerContext (ContactManager.Models)*.

	<br/>![Add API controller][rxAddApiController]<br/>

6. Click **Add**.

### Run the application locally

1. Press CTRL+F5 to run the application.<br/>

	![Index page][intro001]

2. Enter a contact and click **Add**. The app returns to the home page and displays the contact you entered.<br/>

	![Index page with to-do list items][addwebapi004]

3. In the browser, append /api/contacts to the URL.

	The resulting URL will resemble http://localhost:1234/api/contacts. The RESTful web API you added returns the stored contacts.<br/> FireFox and Chrome will display the data in XML format.

	<br/>![Index page with to-do list items][rxFFchrome]<br/>

	IE will prompt you to open or save the contacts.

	![Web API save dialog][addwebapi006]<br/>
	
	You can open the returned contacts in notepad or a browser.
	
	This output can be consumed by another application such as mobile web page or application.<br/>

	![Web API save dialog][addwebapi007]

<h2><a name="xsrf"></a><span class="short-header">XSRF</span>Add XSRF Protection</h2>

Cross-site request forgery (also known as XSRF or CSRF) is an attack against web-hosted applications whereby a malicious web site can influence the interaction between a client browser and a web site trusted by that browser. These attacks are made possible because web browsers will send authentication tokens automatically with every request to a web site. The canonical example is an authentication cookie, such as ASP.NET’s Forms Authentication ticket. However, web sites which use any persistent authentication mechanism (such as Windows Authentication, Basic, and so forth) can be targeted by these attacks.

An XSRF attack is distinct from a phishing attack. Phishing attacks require interaction from the victim. In a phishing attack, a malicious web site will mimic the target web site, and the victim is fooled into providing sensitive information to the attacker. In an XSRF attack, there is often no interaction necessary from the victim. Rather, the attacker is relying on the browser automatically sending all relevant cookies to the destination web site.

For more information, see the [Open Web Application Security Project](https://www.owasp.org/index.php/Main_Page) (OWASP) [XSRF](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)).

1. In **Solution Explorer**, right click **Filters** and click **Add** and then click **Class**.

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

1. You can add the **[ValidateHttpAntiForgeryToken]** attribute to the **ContactsController** to protect it from XSRF threats. A better approach is to add the **ValidateHttpAntiForgeryToken** attribute globally to the *App_Start\WebApiConfig.cs* file as shown below:
  
        public static class WebApiConfig
        {
            public static void Register(HttpConfiguration config)
            {
                config.Routes.MapHttpRoute(
                    name: "DefaultApi",
                    routeTemplate: "api/{controller}/{id}",
                    defaults: new { id = RouteParameter.Optional }
                );

                GlobalConfiguration.Configuration.Filters.Add(new ValidateHttpAntiForgeryTokenAttribute());
                //config.EnableQuerySupport();
            }
        }


<h2><a name="bkmk_deploydatabaseupdate"></a>Publish the application update to Windows Azure and SQL Database</h2>

To publish the application, you repeat the procedure you followed earlier.

1. In **Solution Explorer**, right click the project and select **Publish**.

	<br/>![Publish][rxP]<br/><br/>

5. Click the **Settings** tab.

	![Settings tab of Publish Web wizard][rxz4]<br/>

1. Under **ContactsManagerContext(ContactsManagerContext)**, click the **v** icon to change *Remote connection string* to the connection string for the contact database.

6. The remote connection string box for the **ContactsManagerContext(ContactsManagerContext)** database now contains the SQL Database connection string that was provided in the *publishsettings* file. Click on the ellipsis (**...**) to see the *ContactDB* settings.<br/>

	<br/>![DB settings][rx22]<br/><br/>

7. Close the **Destination Connections String Dialog** and in the **Publish Web** dialog check the box for **Execute Code First Migrations (runs on application start)** for the **UsersContext(DefaultConnection)** database.<br/>

	![Settings tab of Publish Web wizard][rxz44]<br/>

1. You can click the **^** icon next to the **UsersContext(DefaultConnection)** database, that is the connection information for the membership database and we're not using it in this tutorial. A real application would require authentication and authorization, and you would use the membership database for that purpose. See [Deploy a Secure ASP.NET MVC application with OAuth, Membership and SQL Database](http://www.windowsazure.com/en-us/develop/net/tutorials/web-site-with-sql-database/) which is based on this tutorial and shows how to deploy a web application with the membership database.

1. Click **Next** and then click **Preview**. Visual Studio displays a list of the files that will be added or updated.

8. Click **Publish**.<br/>
After the deployment completes, the browser opens to the home page of the application.<br/>

	![Index page with no contacts][intro001]<br/>

	The Visual Studio publish process automatically configured the connection string in the deployed *Web.config* file to point to the SQL database. It also configured Code First Migrations to automatically upgrade the database to the latest version the first time the application accesses the database after deployment.

	As a result of this configuration, Code First created the database by running the code in the **Initial** class that you created earlier. It did this the first time the application tried to access the database after deployment.

9. Enter a contact as you did when you ran the app locally, to verify that database deployment succeeded.

When you see that the item you enter is saved and appears on the contact manager page, you know that it has been stored in the database.<br/>

	![Index page with contacts][addwebapi004]

The application is now running in the cloud, using SQL Database to store its data. After you finish testing the application in Windows Azure, delete it. The application is public and doesn't have a mechanism to limit access.

<h2><a name="nextsteps"></a>Next Steps</h2>

A real application would require authentication and authorization, and you would use the membership database for that purpose. The tutorial [Deploy a Secure ASP.NET MVC application with OAuth, Membership and SQL Database](http://www.windowsazure.com/en-us/develop/net/tutorials/web-site-with-sql-database/) is based on this tutorial and shows how to deploy a web application with the membership database.
<br/>
Another way to store data in a Windows Azure application is to use Windows Azure storage, which provide non-relational data storage in the form of blobs and tables. The following links provide more information on Web API, ASP.NET MVC and Window Azure.
 

* [.NET Multi-Tier Application Using Storage Tables, Queues, and Blobs](http://www.windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/1-overview/).
* [Getting Started with Entity Framework using MVC][EFCodeFirstMVCTutorial]
* [Intro to ASP.NET MVC 4](http://www.asp.net/mvc/tutorials/mvc-4/getting-started-with-aspnet-mvc4/intro-to-aspnet-mvc-4)
* [Your First ASP.NET Web API](http://www.asp.net/web-api/overview/getting-started-with-aspnet-web-api/tutorial-your-first-web-api)


This tutorial and the sample application was written by [Rick Anderson](http://blogs.msdn.com/b/rickandy/) (Twitter [@RickAndMSFT](https://twitter.com/RickAndMSFT)) with assistance from Tom Dykstra, Tom FitzMacken and Barry Dorrans (Twitter [@blowdart](https://twitter.com/blowdart)). 

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
[deployapp11]: #bkmk_deploytowindowsazure11
[adddb]: #bkmk_addadatabase
[addcontroller]: #bkmk_addcontroller
[addwebapi]: #bkmk_addwebapi
[deploy2]: #bkmk_deploydatabaseupdate

<!-- links -->
[WTEInstall]: http://go.microsoft.com/fwlink/?LinkID=208120
[MVC4Install_20012]: http://go.microsoft.com/fwlink/?LinkID=275131
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
[rxE]: ../Media/rxE.png
[rx2]: ../Media/rx2.png
[rxP]: ../Media/rxP.png
[rx22]: ../Media/rx22.png
[rxFBapp]: ../Media/rxFBapp.png
[rxFB]: ../Media/rxFB.png
[rxFBt]: ../Media/rxFBt.png
[rxSTD]: ../Media/rxSTD.png
[rxUid]: ../Media/rxUid.png
[rxRoleID]: ../Media/rxRoleID.png
[rxUR]: ../Media/rxUR.png
[rxC2S]: ../Media/rxC2S.png
[rxGenScripts]: ../Media/rxGenScripts.png
[rx11]: ../Media/rx11.png
[rxAdv]: ../Media/rxAdv.png
[rx1]: ../Media/rx1.png
[rxd]: ../Media/rxd.png
[rxSettings]: ../Media/rxSettings.png
[rxD2]: ../Media/rxD2.png
[rxAddSQL2]: ../Media/rxAddSQL2.png
[rxc]: ../Media/rxc.png
[rx3]: ../Media/rx3.png
[rx4]: ../Media/rx4.png
[rx5]: ../Media/rx5.png
[rx6]: ../Media/rx6.png
[rx7]: ../Media/rx7.png
[rx8]: ../Media/rx8.png
[rx9]: ../Media/rx9.png
[rxa]: ../Media/rxa.png
[rxb]: ../Media/rxb.png
[rxSS]: ../Media/rxSS.png
[rxp2]: ../Media/rxp2.png
[rxp3]: ../Media/rxp3.png
[rxSSL]: ../Media/rxSSL.png
[rxS2]: ../Media/rxS2.png
[rxNOT]: ../Media/rxNOT.png
[rxNOT2]: ../Media/rxNOT2.png
[rxb2]: ../Media/rxb2.png
[rxz]: ../Media/rxz.png
[rxzz]: ../Media/rxzz.png
[rxz2]: ../Media/rxz2.png
[rxz3]: ../Media/rxz3.png
[rxStyle]: ../Media/rxStyle.png
[rxz4]: ../Media/rxz4.png
[rxz44]: ../Media/rxz44.png
[rzAddWAsub]: ../Media/rzAddWAsub.png
[rzDownLoad]: ../Media/rzDownLoad.png
[rzDown2]: ../Media/rzDown2.png
[rzImp]: ../Media/rzImp.png
[rx]: ../Media/rx.png
[rx]: ../Media/rx.png
[rx]: ../Media/rx.png
[rx]: ../Media/rx.png
[rx]: ../Media/rx.png

[rxCreateWSwithDB_2]: ../Media/rxCreateWSwithDB_2.png
[rxNewCtx]: ../Media/rxNewCtx.png
[rxCreateWSwithDB_2]: ../Media/rxCreateWSwithDB_2.png 
[rxPrevDB]: ../Media/rxPrevDB.png
[rxOverwrite]: ../Media/rxOverwrite.png
[rxWebConfig]: ../Media/rxWebConfig.png
[rxPWS]: ../Media/rxPWS.png
[rxNewCtx]: ../Media/rxNewCtx.png
[rxAddApiController]: ../Media/rxAddApiController.png
[rxFFchrome]: ../Media/rxFFchrome.png
[rxSettings]: ../Media/rxSettings.png
[intro001]: ../Media/dntutmobil-intro-finished-web-app.png
[setup001]: ../Media/dntutmobile-setup-run-sdk-setup-exe.png
[setup002]: ../Media/dntutmobile-setup-web-pi.png
[setup003]: ../Media/dntutmobile-setup-azure-account-1.png
[rxWSnew]: ../Media/rxWSnew.png
[rxCreateWSwithDB]: ../Media/rxCreateWSwithDB.png
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
[newapp005]: ../Media/newapp005.png
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
[rxf]: ../Media/rxf.png
[Add XSRF Protection]: #xsrf


[WebPIAzureSdk20NetVS12]: ../Media/WebPIAzureSdk20NetVS12.png
[rxf]: ../Media/rxf.png
[Add XSRF Protection]: #xsrf
[ClickWebSite]: ../Media/ClickWebSite.png
[CreateWebsite]: ../Media/CreateWebsite.png
[CreateWebsite]: ../Media/CreateWebsite.png
[DeployedWebSite]: ../Media/DeployedWebSite.png
[DownloadPublishProfile]: ../Media/DownloadPublishProfile.png
[ImportPublishSettings]: ../Media/ImportPublishSettings.png
[ImportPublishProfile]: ../Media/ImportPublishProfile.png
[InternetAppTemplate]: ../Media/InternetAppTemplate.png
[NewMVC4WebApp]: ../Media/NewMVC4WebApp.png
[NewVSProject]: ../Media/NewVSProject.png
[PublishOutput]: ../Media/PublishOutput.png
[PublishVSSolution]: ../Media/PublishVSSolution.png
[PublishWebSettingsTab]: ../Media/PublishWebSettingsTab.png
[PublishWebStartPreview]: ../Media/PublishWebStartPreview.png
[PublishWebStartPreviewOutput]: ../Media/PublishWebStartPreviewOutput.png
[SavePublishSettings]: ../Media/SavePublishSettings.png
[ValidateConnection]: ../Media/ValidateConnection.png
[ValidateConnectionSuccess]: ../Media/ValidateConnectionSuccess.png
[WebPIAzureSdk20NetVS12]: ../Media/WebPIAzureSdk20NetVS12.png
[WebSiteNew]: ../Media/WebSiteNew.png
[WebSiteStatusRunning]: ../Media/WebSiteStatusRunning.png

