<properties linkid="dev-net-tutorials-web-app-with-sql-azure" urlDisplayName="" pageTitle="" metaKeywords="" description="" metaCanonical="" services="" documentationCenter="" title=" OAuth" authors="riande" solutions="" manager="wpickett" editor="mollybos" />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="01/01/1900" ms.author="riande" />




# Deploy a Secure ASP.NET MVC app with Membership, OAuth, and SQL Database to an Azure Web Site

***Updated 15 October 2013.***


<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/develop/net/tutorials/web-site-with-sql-database/" title="Visual Studio 2013">Visual Studio 2013</a><a href="/en-us/develop/net/tutorials/web-site-with-sql-database-vs2012/" title="Visual Studio 2012" class="current">Visual Studio 2012</a></div>

<div class="dev-callout"><strong>Note</strong><p>A <a href="/en-us/develop/net/tutorials/web-site-with-sql-database/">newer version of this tutorial</a> is available. You can still follow this version if you want to use Visual Studio 2012, but the newer version is significantly easier to follow.</p></div>

This tutorial shows you how to build a secure ASP.NET MVC 4 web application that enables users to log in with credentials from Facebook, Yahoo, and Google. You will also deploy the application to Azure.

You can open an Azure account for free, and if you don't already have Visual Studio 2012, the SDK automatically installs Visual Studio 2012 for Web Express. You can start developing for Azure for free.

This tutorial assumes that you have no prior experience using Azure. On completing this tutorial, you'll have a secure data-driven web application up and running in the cloud and using a cloud database.

You'll learn:

* How to enable your machine for Azure development by installing the Azure SDK.
* How to create a secure ASP.NET MVC 4 project and publish it to an Azure Web Site.
* How to use OAuth and the ASP.NET membership database to secure your application.
* How to deploy a membership database to Azure.
* How to use a SQL database to store data in Azure.
* How to use Visual Studio to update and manage the membership database.

You'll build a simple contact list web application that is built on ASP.NET MVC 4 and uses the ADO.NET Entity Framework for database access. The following illustration shows the login page for the completed application:

![login page](./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxb.png)

[WACOM.INCLUDE [create-account-and-websites-note](../includes/create-account-and-websites-note.md)]

In this tutorial:

- [Set up the development environment][setupdbenv]
- [Set up the Azure environment][setupwindowsazureenv]
- [Create an ASP.NET MVC 4 application][createapplication]
- [Deploy the application to Azure][deployapp1]
- [Add a database to the application][adddb]
- [Add an OAuth Provider][]
- [Add Roles to the Membership Database][]
- [Create a Data Deployment Script][]
- [Deploy the app to Azure][deployapp11]
- [Update the Membership Database][]
- [Next steps][]

<h2><a name="bkmk_setupdevenv"></a>Set up the development environment</h2>

To start, set up your development environment by installing the Azure SDK for the .NET Framework. 

1. To install the Azure SDK for .NET, click the link below. If you don't have Visual Studio 2012 installed yet, it will be installed by the link. This tutorial requires Visual Studio 2012. 
[Azure SDK for Visual Studio 2012]( http://go.microsoft.com/fwlink/?LinkId=254364)
1. When you are prompted to run or save the installation executable, click **Run**.
1. In the Web Platform Installer window, click **Install** and proceed with the installation.

![Web Platform Installer - Azure SDK for .NET][WebPIAzureSdk20NetVS12]


When the installation is complete, you have everything necessary to start developing.



<h2><a name="bkmk_setupwindowsazure"></a>Set up the Azure environment</h2>

Next, set up the Azure environment by creating an Azure Web Site and a SQL database.

### Create a web site and a SQL database in Azure

Your Azure Web Site will run in a shared hosting environment, which means it runs on virtual machines (VMs) that are shared with other Azure clients. A shared hosting environment is a low-cost way to get started in the cloud. Later, if your web traffic increases, the application can scale to meet the need by running on dedicated VMs. If you need a more complex architecture, you can migrate to an Azure Cloud Service. Cloud services run on dedicated VMs that you can configure according to your needs.

Azure SQL Database is a cloud-based relational database service that is built on SQL Server technologies. The tools and applications that work with SQL Server also work with SQL Database.

1. In the [Azure Management Portal](https://manage.windowsazure.com), click **Web Sites** in the left tab, and then click  **New**.

![New button in Management Portal][rxWSnew]

2. Click **CUSTOM CREATE**.

	![Create with Database link in Management Portal][rxCreateWSwithDB]

The **New Web Site - Custom Create** wizard opens. 

3. In the **New Web Site** step of the wizard, enter a string in the **URL** box to use as the unique URL for your application. The complete URL will consist of what you enter here plus the suffix that you see next to the text box. The illustration shows "contactmgr2", but that URL is probably taken so you will have to choose a different one.

	![Create with Database link in Management Portal][rxCreateWSwithDB_2]

4. In the **Database** drop-down list, choose **Create a new SQL database**.

5. In the **Region** drop-down list, choose the same region you selected for the Web site. This setting specifies which data center your VM will run in. In the **DB CONNECTION STRING NAME**, enter *connectionString1*.

	![Create a New Web Site step of New Web Site - Create with Database wizard][rxCreateWSwithDB_2]

6. Click the arrow that points to the right at the bottom of the box. The wizard advances to the **Database Settings** step.

7. In the **Name** box, enter *ContactDB*.

8. In the **Server** box, select **New SQL Database server**. Alternatively, if you previously created a SQL Server database, you can select that SQL Server from the dropdown control.

9. Enter an administrator **LOGIN NAME** and **PASSWORD**. If you selected **New SQL Database server** you aren't entering an existing name and password here, you're entering a new name and password that you're defining now to use later when you access the database. If you selected a SQL Server you've created previously, you'll be prompted for the password to the previous SQL Server account name you created. For this tutorial, we won't check the **Advanced ** box. The **Advanced ** box allows you to set the DB size (the default is 1 GB but you can increase this to 150 GB) and the collation.

10. Click the check mark at the bottom of the box to indicate you're finished.
	
	![Database Settings step of New Web Site - Create with Database wizard][setup007]
	
	The following image shows using an existing SQL Server and Login.
	![Database Settings step of New Web Site - Create with Database wizard][rxPrevDB]

	The Management Portal returns to the Web Sites page, and the **Status** column shows that the site is being created. After a while (typically less than a minute), the **Status** column shows that the site was successfully created. In the navigation bar at the left, the number of sites you have in your account appears next to the **Web Sites** icon, and the number of databases appears next to the **SQL Databases** icon.


<h2><a name="bkmk_createmvc4app"></a>Create an ASP.NET MVC 4 application</h2>

You have created an Azure Web Site, but there is no content in it yet. Your next step is to create the Visual Studio web application project that you'll publish to Azure.

### Create the project

1. Start Visual Studio 2012.
1. From the **File** menu click **New Project**.
3. In the **New Project** dialog box, expand **Visual C#** and select **Web** under **Installed Templates** and then select **ASP.NET MVC 4 Web Application**. Keep the default **.NET Framework 4.5**. Name the application **ContactManager** and click **OK**.

	![New Project dialog box][newapp002]

6. In the **New ASP.NET MVC 4 Project** dialog box, select the **Internet Application** template. Keep the default Razor **View Engine** and then click **OK**.

	![New ASP.NET MVC 4 Project dialog box][rxb2]

### Set the page header and footer


1. In **Solution Explorer**, expand the Views\Shared folder and open the *_Layout.cshtml* file.

	![_Layout.cshtml in Solution Explorer][newapp004]

1. Replace each occurrence of "My ASP.NET MVC Application" with "Contact Manager".
1. Replace "your logo here" with "CM Demo".



### Run the application locally

1. Press CTRL+F5 to run the application. The application home page appears in the default browser.
![To Do List home page][rxa]

This is all you need to do for now to create the application that you'll deploy to Azure. Later you'll add database functionality.

<h2><a name="bkmk_deploytowindowsazure1"></a>Deploy the application to Azure</h2>

1. In your browser, open the [Azure Management Portal](http://manage.windowsazure.com "portal").

2. In the **Web Sites** tab, click the name of the site you created earlier.

	![Contact manager application in Management Portal Web Sites tab][setup009]

3. On the right side of the window, click **Download publish profile**.

	![Quickstart tab and Download Publishing Profile button][firsdeploy001]

	This step downloads a file that contains all of the settings that you need in order to deploy an application to your Web Site. You'll import this file into Visual Studio so you don't have to enter this information manually.

4. Save the .*publishsettings* file in a folder that you can access from Visual Studio.

	![saving the .publishsettings file][firsdeploy002]


	[WACOM.INCLUDE [publishsettingsfilewarningchunk](../includes/publishsettingsfilewarningchunk.md)]

5. In Visual Studio, right-click the project in **Solution Explorer** and select **Publish** from the context menu.

	![Publish in project context menu][PublishVSSolution]
	
	The **Publish Web** wizard opens.

6. In the **Profile** tab of the **Publish Web** wizard, click **Import**.

	![Import publish settings][ImportPublishSettings]

	The **Import Publish Profile** dialog box appears.

1. If you have not previously added your Azure subscription in Visual Studio, perform the following steps. In these steps you add your subscription so that the drop-down list under **Import from an Azure web site** will include your web site.
    
	a.  In the **Import Publish Profile** dialog box, click **Add Azure subscription**. 

	![add win az sub](./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rzAddWAsub.png)
	
	b. In the **Import Azure Subscriptions** dialog box, click **Download subscription file**.
    
	![download sub](./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rzDownLoad.png)
	
	c. In your browser window, save the *.publishsettings* file.
    
	![download pub file](./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rzDown2.png)
    
	> [WACOM.NOTE]
	> The .publishsettings file contains your  credentials (unencoded) that are used to administer your Azure subscriptions and services. The security best practice for this file is to store it temporarily outside your source directories (for example in the Libraries\Documents folder), and then  delete it once the import has completed. A malicious user who gains access to the .publishsettings file can edit, create, and delete your Azure services.
	
    
	d. In the **Import Azure Subscriptions** dialog box, click **Browse** and navigate to the *.publishsettings* file.
    
	![download sub](./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rzDownLoad.png)
	
	e. Click **Import**.
    
	![import](./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rzImp.png)

7. In the **Import Publish Profile** dialog box, select **Import from an Azure web site**, select your web site from the drop-down list, and then click **OK**.

	![Import Publish Profile][ImportPublishProfile]

	The application you created is now running in the cloud. The next time you deploy the application, only the changed (or new) files will be deployed.
	
	![To Do List home page running in Azure][newapp005]


<h2><a name="bkmk_addadatabase"></a>Add a database to the application</h2>

Next, you'll update the MVC application to add the ability to display and update contacts and store the data in a database. The application will use the Entity Framework to create the database and to read and update data in the database.

### Add data model classes for the contacts

You begin by creating a simple data model in code.

1. In **Solution Explorer**, right-click the Models folder, click **Add**, and then **Class**.

![Add Class in Models folder context menu][adddb001]

2. In the **Add New Item** dialog box, name the new class file *Contact.cs*, and then click **Add**.

![Add New Item dialog box][adddb002]

3. Replace the contents of the Contacts.cs file with the following code.

        using System.ComponentModel.DataAnnotations;
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
                [DataType(DataType.EmailAddress)]
                public string Email { get; set; }
            }
        }

The **Contacts** class defines the data that you will store for each contact, plus a primary key, *ContactID*, that is needed by the database.

### Create web pages that enable app users to work with the contacts

The ASP.NET MVC scaffolding feature can automatically generate code that performs create, read, update, and delete (CRUD) actions.

<h2><a name="bkmk_addcontroller"></a>Add a Controller and a view for the data</h2>

1. Build the project **(Ctrl+Shift+B)**. (You must build the project before using scaffolding mechanism.) 
1. In **Solution Explorer**, right-click the Controllers folder and click **Add**, and then click **Controller**.

	![Add Controller in Controllers folder context menu][addcode001]

5. In the **Add Controller** dialog box, enter "HomeController" as your controller name. 
1. Set the **Scaffolding options** Template to  **MVC Controller with read/write actions and views, using Entity Framework**.
6. Select **Contact** as your model class and **&lt;New data context...&gt;** as your data context class.

	![Add Controller dialog box][addcode002]

7. On the **New Data Context** dialog box, accept the default value *ContactManager.Models.ContactManagerContext*.
	![Add Controller dialog box][rxNewCtx]

8. Click **OK**, then click **Add** in the **Add Controller** dialog box.
9. On the **Add Controller** overwrite dialog, make sure all options are checked and click **OK**.

	![Add Controller message box][rxOverwrite] 

Visual Studio creates a controller methods and views for CRUD database operations for **Contact** objects.

## Enable Migrations, create the database, add sample data and a data initializer ##

The next task is to enable the [Code First Migrations](http://msdn.microsoft.com/library/hh770484.aspx) feature in order to create the database based on the data model you created.

1. In the **Tools** menu, select **Library Package Manager** and then **Package Manager Console**.

	![Package Manager Console in Tools menu][addcode008]

2. In the **Package Manager Console** window, enter the following command:

		enable-migrations -ContextTypeName ContactManagerContext

	![enable-migrations][rxE] 
	You must specify the context type name (**ContactManagerContext**) because the project contains two [DbContext](http://msdn.microsoft.com/en-us/library/system.data.entity.dbcontext(v=VS.103).aspx) derived classes, the **ContactManagerContext** we just added and the **UsersContext**, which is used for the membership database. The **ContactManagerContext** class was added by the Visual Studio scaffolding wizard.

	The **enable-migrations** command creates a *Migrations* folder and it puts in that folder a *Configuration.cs* file that you can edit to configure Migrations. 

2. In the **Package Manager Console** window, enter the following command:

		add-migration Initial


	The **add-migration Initial** command generates a file named **&lt;date_stamp&gt;Initial** in the *Migrations* folder that creates the database. The first parameter ( **Initial** ) is arbitrary and is used to create the name of the file. You can see the new class files in **Solution Explorer**.

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
               },
                new Contact
                {
                    Name = "Thorsten Weinrich",
                    Address = "5678 1st Ave W",
                    City = "Redmond",
                    State = "WA",
                    Zip = "10999",
                    Email = "thorsten@example.com",
                },
                new Contact
                {
                    Name = "Yuhong Li",
                    Address = "9012 State st",
                    City = "Redmond",
                    State = "WA",
                    Zip = "10999",
                    Email = "yuhong@example.com",
                },
                new Contact
                {
                    Name = "Jon Orton",
                    Address = "3456 Maple St",
                    City = "Redmond",
                    State = "WA",
                    Zip = "10999",
                    Email = "jon@example.com",
                },
                new Contact
                {
                    Name = "Diliana Alexieva-Bosseva",
                    Address = "7890 2nd Ave E",
                    City = "Redmond",
                    State = "WA",
                    Zip = "10999",
                    Email = "diliana@example.com",
                }
                );
        }

	This code above will initialize the database with the contact information. For more information on seeding the database, see [Seeding and Debugging Entity Framework (EF) DBs](http://blogs.msdn.com/b/rickandy/archive/2013/02/12/seeding-and-debugging-entity-framework-ef-dbs.aspx).


6. In the **Package Manager Console** enter the command:

		update-database

	![Package Manager Console commands][addcode009]

	The **update-database** runs the first migration which creates the database. By default, the database is created as a SQL Server Express LocalDB database. (Unless you have SQL Server Express installed, in which case the database is created using the SQL Server Express instance.)

7. Press CTRL+F5 to run the application. 

The application shows the seed data and provides edit, details and delete links.

![MVC view of data][rx2]

<h2><a name="addOauth"></a><span class="short-header">OAuth</span>Add an OAuth Provider</h2>

[OAuth](http://oauth.net/ "http://oauth.net/") is an open protocol that allows secure authorization in a simple and standard method from web, mobile, and desktop applications. The ASP.NET MVC internet template uses OAuth to expose Facebook, Twitter, Google, Yahoo, and Microsoft as authentication providers. Although this tutorial uses only Facebook, Google, and Yahoo as the authentication providers, you can easily modify the code to use any of the providers. The steps to implement other providers are very similar to the steps you will see in this tutorial. 

In addition to authentication, the tutorial will also use roles to implement authorization. Only those users you add to the canEdit role will be able to create, edit, or delete contacts.

## Registering with an external provider ##

To authenticate users with credentials from some external providers, you must register your web site with the provider and obtain a key and connection secret. Google and Yahoo don't require you to register and obtain keys.

This tutorial does not show all of the steps you must perform to register with these providers. The steps are typically not difficult. To successfully register your site, follow the instructions provided on those sites. To get started with registering your site, see the developer site for:

- [Facebook](http://developers.facebook.com/)
- [Microsoft](http://go.microsoft.com/fwlink/?LinkID=144070)
- [Twitter](http://dev.twitter.com/)

Navigate to  [https://developers.facebook.com/apps](https://developers.facebook.com/apps/)  page and log in if necessary. Click the **Register as a Developer** button and complete the registration process. Once you complete registration, click **Create New App**. Enter a name for the app. You don't need to enter an app namespace.

![Create New FB app](./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxFBapp.png)


Enter localhost for the **App Domain** and http://localhost/ for the **Site URL**. Click **Enabled** for **Sandbox Mode**, then click **Save Changes**.


You will need the **App ID** and the **App Secret** to implement OAuth in this application.
	![New FB app][rxFB]

## Creating test users ##
In the left pane under **Settings** click **Developer Roles**. Click the **Create** link on the **Test Users** row (not the **Testers** row).

![FB testers](./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxFBt.png)

Click on the **Modify** link to get the test users email (which you will use to log into the application). Click the **See More** link, then click **Edit** to set the test users password.

## Adding application id and secret from the provider ##

Open the *App_Start\AuthConfig.cs* file. Remove the comment characters from the *RegisterFacebookClient* method and add the app id and app secret. Use the values you obtained, the values shown below will not work. Remove the comment characters from the *OAuthWebSecurity.RegisterGoogleClient* call and add the *OAuthWebSecurity.RegisterYahooClient* as shown below. The Google and Yahoo providers don't require you to register and obtain keys. 
Warning: Keep your app ID and secret secure. A malicious user who has your app ID and secret can pretend to be your application.

     public static void RegisterAuth()
        {
            OAuthWebSecurity.RegisterFacebookClient(
                appId: "enter numeric key here",
                appSecret: "enter numeric secret here");

            OAuthWebSecurity.RegisterGoogleClient();
            OAuthWebSecurity.RegisterYahooClient();
        }


1. Run the application and click  the **Log In** link. 
1. Click the **Facebook** button. 
1. Enter your Facebook credentials or one of the test users credentials.
1. Click **Okay** to allow the application to access your Facebook resources.
1. You are redirected to the Register page. If you logged in using a test account, you can change the **user name** to something shorter, for example "Bill FB test". Click the **Register** button which will save the user name and email alias to the membership database. 
1. Register another user. Currently a bug in the log in system prevents you from logging off and logging in as another user using the same provider (that is, you can't log off your Facebook account and log back in with a different Facebook account). To work around this, navigate to the site using a different browser and register another user. One user will be added to the manager role and have edit access to application, the other user will only have access to non-edit methods on the site. Anonymous users will only have access to the home page.
1. Register another user using a different provider.
1. **Optional**: You can also create a local account not associated with one of the providers. Later on in the tutorial we will remove the ability to create local accounts. To create a local account, click the **Log out** link (if you are logged in), then click the **Register link**. You might want to create a local account for administration purposes that is not associated with any external authentication provider.

<h2><a name="mbrDB"></a><span class="short-header">Membership DB</span>Add Roles to the Membership Database</h2>
In this section you will add the *canEdit* role to the membership database. Only those users in the canEdit role will be able to edit data. A best practice is to name roles by the actions they can perform, so *canEdit* is preferred over a role called *admin*. When your application evolves you can add new roles such as *canDeleteMembers* rather than *superAdmin*.

1. In the **View** menu click **Server Explorer**. 

1. In **Server Explorer**, expand **DefaultConnection** then expand **Tables**.

1. Right click **UserProfile** and click **Show Table Data**.
 
	![Show table data][rxSTD]
 
1. Record the **UserId** for the user that will have the canEdit role. In the image below, the user *ricka* with **UserId** 2 will have the canEdit role for the site.

	![user IDs][rxUid]
 
1. Right click **webpages_Roles** and click **Show Table Data**.
1. Enter **canEdit** in the **RoleName** cell. The **RoleId** will be 1 if this is the first time you've added a role. Record the RoleID. Be sure there is not a trailing space character, "canEdit " in the role table will not match "canEdit" in the controller code.

	![roleID][rxRoleID] 

1. Right click **webpages UsersInRoles** and click **Show Table Data**. Enter the **UserId** for the user you want to grant *canEdit* access and the **RoleId**.

	![usr role ID tbl][rxUR] 

The  **webpages_OAuthMembership** table contains the OAuth provider, the provider UserID and the UserID for each registered OAuth user. <!-- Don't replace "-" with "_" or it won't validate -->The **webpages-Membership** table contains the ASP.NET membership table. You can add users to this table using the register link. It's a good idea to add a user with the *canEdit* role that is not associated with Facebook or another third party authorization provider so that you can always have *canEdit* access even when the third party authorization provider is not available. Later on in the tutorial we will disable ASP.NET membership registration.

## Protect the Application with the Authorize Attribute ##

In this section we will apply the [Authorize](http://msdn.microsoft.com/en-us/library/system.web.mvc.authorizeattribute(v=vs.100).aspx) attribute to restrict access to the action methods. Anonymous user will be able to view the home page only. Registered users will be able to see contact details, the about and the contacts pages. Only users in the *canEdit* role will be able to access action methods that change data.

1. Add the [Authorize](http://msdn.microsoft.com/en-us/library/system.web.mvc.authorizeattribute(v=vs.100).aspx) filter and the [RequireHttps](http://msdn.microsoft.com/en-us/library/system.web.mvc.requirehttpsattribute(v=vs.108).aspx) filter to the application. An alternative approach is to add the [Authorize](http://msdn.microsoft.com/en-us/library/system.web.mvc.authorizeattribute(v=vs.100).aspx) attribute and the [RequireHttps](http://msdn.microsoft.com/en-us/library/system.web.mvc.requirehttpsattribute(v=vs.108).aspx) attribute to each controller, but it's considered a security best practice to apply them to the entire application. By adding them globally, every new controller and action method you add will automatically be protected, you won't need to remember to apply them. For more information see [Securing your ASP.NET MVC 4 App and the new AllowAnonymous Attribute](http://blogs.msdn.com/b/rickandy/archive/2012/03/23/securing-your-asp-net-mvc-4-app-and-the-new-allowanonymous-attribute.aspx). Open the *App_Start\FilterConfig.cs* file and replace the *RegisterGlobalFilters* method with the following.

        public static void
        RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new System.Web.Mvc.AuthorizeAttribute());
            filters.Add(new RequireHttpsAttribute());
        }

1. Add the [AllowAnonymous](http://blogs.msdn.com/b/rickandy/archive/2012/03/23/securing-your-asp-net-mvc-4-app-and-the-new-allowanonymous-attribute.aspx) attribute to the **Index** method. The [AllowAnonymous](http://blogs.msdn.com/b/rickandy/archive/2012/03/23/securing-your-asp-net-mvc-4-app-and-the-new-allowanonymous-attribute.aspx) attribute enables you to whitelist the methods you want to opt out of authorization.
1. Add   [Authorize(Roles = "canEdit")] to the Get and Post methods that change data (Create, Edit, Delete). 
1. Add the *About* and *Contact* methods. A portion of the completed code is shown below.

	    public class HomeController : Controller
	    {
	        private ContactManagerContext db = new ContactManagerContext();
	        [AllowAnonymous]
	        public ActionResult Index()
	        {
	            return View(db.Contacts.ToList());
	        }
	
	        public ActionResult About()
	        {
	            return View();
	        }
	
	        public ActionResult Contact()
	        {
	            return View();
	        }
	
	        [Authorize(Roles = "canEdit")]
	        public ActionResult Create()
	        {
	            return View();
	        }
	        // Methods moved and omitted for clarity.
	    }

1. Remove ASP.NET membership registration. The current  ASP.NET membership registration in the project does not provide support for password resets and it does not verify that a human is registering (for example with a [CAPTCHA](http://www.asp.net/web-pages/tutorials/security/16-adding-security-and-membership)). Once a user is authenticated using one of the third party providers, they can register. In the AccountController, remove the *[AllowAnonymous]* from the GET and POST *Register* methods. This will prevent bots and anonymous users from registering.
1. In the *Views\Shared\_LoginPartial.cshtml*, remove the Register action link.
1. Enable SSL. In Solution Explorer, click the **ContactManager** project, then click F4 to bring up the properties dialog. Change **SSL Enabled** to true. Copy the **SSL URL**.

	![enable SSL][rxSSL]
 
1. In Solution Explorer, right click the **Contact Manager** project and click **Properties**.
1. In the left tab, click **Web**.
1. Change the **Project Url** to use the **SSL URL**.
1. Click **Create Virtual Directory**.
	
	![enable SSL][rxS2]
 
1. Press CTRL+F5 to run the application. The browser will display a certificate warning. For our application you can safely click on the link **Continue to this website**. Verify only the users in the *canEdit* role can change data. Verify anonymous users can only view the home page.

	![cert Warn][rxNOT]

	![cert Warn][rxNOT2]
 
Azure Web sites include a valid security certificate, so you won't see this warning when you deploy to Azure.
<h2><a name="ppd"></a><span class="short-header">Prepare DB</span>Create a Data Deployment Script</h2>


The membership database isn't managed by Entity Framework Code First so you can't use Migrations to deploy it.  We'll use the [dbDacFx](http://msdn.microsoft.com/en-us/library/dd394698.aspx) provider to deploy the database schema, and we'll configure the publish profile to run a script that will insert initial membership data into membership tables.

This tutorial will use  SQL Server Management Studio (SSMS) to create data deployment scripts. 

Install SSMS  from [Microsoft SQL Server 2012 Express Download Center](http://www.microsoft.com/en-us/download/details.aspx?id=29062):

- [ENU\x64\SQLManagementStudio_x64_ENU.exe](http://download.microsoft.com/download/8/D/D/8DD7BDBA-CEF7-4D8E-8C16-D9F69527F909/ENU/x64/SQLManagementStudio_x64_ENU.exe) for 64 bit systems.
- [ENU\x86\SQLManagementStudio_x86_ENU.exe](http://download.microsoft.com/download/8/D/D/8DD7BDBA-CEF7-4D8E-8C16-D9F69527F909/ENU/x86/SQLManagementStudio_x86_ENU.exe) for 32 bit systems.

 If you choose the wrong one for your system it will fail to install and you can try the other one.

(Note that this is a 600 megabyte download. It may take a long time to install and may require a reboot of your computer.)

On the first page of the SQL Server Installation Center, click **New SQL Server stand-alone installation or add features to an existing installation**, and follow the instructions, accepting the default choices. The following image shows the step that install SSMS.

![SQL Install][rxSS] 

### Create the development database script ###


1. Run SSMS.
1. In the **Connect to Server** dialog box, enter *(localdb)\v11.0* as the Server name, leave **Authentication** set to **Windows Authentication**, and then click **Connect**. If you have installed SQL Express, enter **.\SQLEXPRESS**.
	
	![con to srvr dlg][rxC2S] 

1. In the **Object Explorer** window, expand **Databases**, right-click **aspnet-ContactManager**, click **Tasks**, and then click **Generate Scripts**.
	
	![Gen Scripts][rxGenScripts] 

1. In the **Generate and Publish Scripts** dialog box, click **Set Scripting Options**.
You can skip the **Choose Objects** step because the default is Script entire database and all database objects and that is what you want.

1. Click **Advanced**.

	![Set scripting options][rx11] 

1. In the **Advanced Scripting Options** dialog box, scroll down to **Types of data to script**, and click the **Data only** option in the drop-down list. (See the image below the next step.)

1. Change **Script USE DATABASE** to **False**.  USE statements aren't valid for Azure SQL Database and aren't needed for deployment to SQL Server Express in the test environment. 
	
	![Set scripting options][rxAdv] 

1. Click **OK**.
1. In the **Generate and Publish Scripts** dialog box, the **File name** box specifies where the script will be created. Change the path to your solution folder (the folder that has your *Contacts.sln* file) and change the file name to *aspnet-data-membership.sql*.
1. Click **Next** to go to the **Summary** tab, and then click **Next** again to create the script.

	![Save or pub][rx1] 

1. Click **Finish**.

<h2><a name="bkmk_deploytowindowsazure11"></a>Deploy the app to Azure</h2>

1. Open the application root *Web.config* file. Find the *DefaultConnection* markup, and then copy and paste it under the *DefaultConnection* markup line. Rename the copied element *DefaultConnectionDeploy*. You will need this connection string to deploy the user data in the membership database.
	![3 cons str][rxD] 

1. Build the application.
1. In Visual Studio, right-click the project in **Solution Explorer** and select **Publish** from the context menu.

	![Publish in project context menu][firsdeploy003]

The **Publish Web** wizard opens.

1. Click the **Settings** tab. Click the **v** icon to select the **Remote connection string** for the **ContactManagerContext** and  **DefaultConnectionDeploy**. The three Databases listed will all use the same connection string. The **ContactManagerContext** database stores the contacts, the **DefaultConnectionDeploy** is used only to deploy the user account data to the membership database and the **UsersContext** database is the membership database.
	
	![settings][rxD2] 

1. Under **ContactManagerContext**, check **Execute Code First Migrations**.
	
	![settings][rxSettings] 

1. Under **DefaultConnectionDeploy** check **Update database** then click the **Configure database updates** link.
1. Click the **Add SQL Script** link and navigate to the  *aspnet-data-membership.sql* file. You only need to do this once. The next deployment you uncheck **Update database** because you won't need to add the user data to the membership tables.

	![add sql][rxAddSQL2] 

1. Click **Publish**.
1. Navigate to the [https://developers.facebook.com/apps](https://developers.facebook.com/apps/)  page and change the **App Domains** and **Site URL** settings to the Azure URL.
1. Test the application. Verify only the users in the *canEdit* role can change data. Verify anonymous users can only view the home page. Verify authenticated users can navigate to all links that don't change data.
1. The next time you publish the application be sure to uncheck **Update database** under **DefaultConnectionDeploy**.
	
	![settings][rxSettings]

<h2><a name="ppd2"></a><span class="short-header">Update DB</span>Update the Membership Database</h2>

Once the site is deployed to Azure and you have more registered users you might want to make some of them members of the *canEdit* role. In this section we will use Visual Studio to connect to the SQL database and add users to the *canEdit* role.

![settings][rxSettings] 

1. In **Solution Explorer**, right click the project and click **Publish**.
	![Publish][rxP]

1. Click the **Settings** tab.
2. Copy the connection string. For example, the connection string used in this sample is:
	Data Source=tcp:d015leqjqx.database.windows.net,1433;
	Initial Catalog=ContactDB2;User Id=ricka0@d015lxyze;Password=xyzxyz
1. Close the publish dialog.
1. In the **View** menu click **Server Explorer**. 

1. Click on the **Connect to Database** icon.
	
	![Publish][rxc]

1. If you are prompted for the Data Source, click **Microsoft SQL Server**.
	![Publish][rx3]

1. Copy and paste the **Server Name**, which starts with *tcp* (see the image below).
1. Click **Use SQL Server Authentication**
1. Enter your **User name** and **Password**, which are in the connection string you copied.
1. Enter the database name (ContactDB, or the  string after "Initial Catalog=" in the database if you didn't name it ContactDB.) If you get an error dialog, see the next section. 
1. Click **Test Connection**. If you get an error dialog, see the next section. 
	![add con dlg][rx4]

## Cannot open server login error ##
If you get an error dialog stating "Cannot open server" you will need to add your IP address to the allowed IPs.

![firewall error][rx5]

1. In the Azure Portal, Select **SQL Databases** in the left tab.

	![Select SQL][rx6]

1. Select the database you wish to open.

1. Click the **Set up Azure firewall rules for this IP address** link.

	![firewall rules][rx7]

1. When you are prompted with "The current IP address xxx.xxx.xxx.xxx is not included in existing firewall rules. Do you want to update the firewall rules?", click **Yes**. Adding this address is often not enough, you will need to add a range of IP addresses.

## Adding a Range of Allowed IP Addresses ##

1. In the Azure Portal, Click **SQL Databases**.
1. Click the **Server** hosting your Database.

	![db server][rx8]

1. Click **Configure** on the top of the page.
1. Add a rule name, starting and ending IP addresses.
	![ip range][rx9]

1. At the bottom of the page, click **Save**.
1. You can now edit the membership database using the steps previously shown.

<h2><a name="nextsteps"></a><span class="short-header">Next steps</span>Next steps</h2>

This tutorial and the sample application was written by [Rick Anderson](http://blogs.msdn.com/b/rickandy/) (Twitter [@RickAndMSFT](https://twitter.com/RickAndMSFT)) with assistance from Tom Dykstra, Tom FitzMacken and Barry Dorrans (Twitter [@blowdart](https://twitter.com/blowdart)). 

Please leave feedback on what you liked or what you would like to see improved, not only about the tutorial itself but also about the products that it demonstrates. Your feedback will help us prioritize improvements. We are especially interested in finding out how much interest there is in more automation for the process of configuring and deploying the membership database. 

To get the colorful Facebook, Google and Yahoo log on buttons, see the blog post [Customizing External Login Buttons in ASP.NET MVC 4](http://www.beabigrockstar.com/customizing-external-login-buttons-in-asp-net-mvc-4/). For information on using Windows Authentication, see the following:

- [Azure Authentication ](http://www.asp.net/vnext/overview/fall-2012-update/windows-azure-authentication)
- [How to Create an Intranet Site Using ASP.NET MVC](http://msdn.microsoft.com/en-us/library/gg703322(v=vs.98).aspx)

Another way to store data in an Azure application is to use Azure storage, which provide non-relational data storage in the form of blobs and tables. The following links provide more information on ASP.NET MVC and Window Azure. 

- [.NET Multi-Tier Application Using Storage Tables, Queues, and Blobs](http://www.windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/1-overview/).
- [Intro to ASP.NET MVC 4](http://www.asp.net/mvc/tutorials/mvc-4/getting-started-with-aspnet-mvc4/intro-to-aspnet-mvc-4)
- [Getting Started with Entity Framework using MVC][EFCodeFirstMVCTutorial]
- [OAuth 2.0 and Sign-In](http://blogs.msdn.com/b/vbertocci/archive/2013/01/02/oauth-2-0-and-sign-in.aspx)


You've seen how to deploy a web application to an Azure Web Site. To learn more about how to configure, manage, and scale Azure Web Sites, see the how-to topics on the [Common Tasks][CommonTasks] page.

To learn how to debug Azure Web Sites, see [Troubleshooting Azure Web Sites in Visual Studio](/en-us/develop/net/tutorials/troubleshoot-web-sites-in-visual-studio/).

To learn how to deploy an application to an Azure Cloud Service, see [The Cloud Service version of this tutorial][NetAppWithSqlAzure] and [Developing Web Applications with Azure][DevelopingWebAppsWithWindowsAzure]. Some reasons for choosing to run an ASP.NET web application in an Azure Cloud Service rather than an Azure Web Site include the following:

* You want administrator permissions on the web server that the application runs on.
* You want to use Remote Desktop Connection to access the web server that the application runs on. 
* Your application is multi-tier and you want to distribute work across multiple virtual servers (web and workers).

For more information about both SQL Database and Azure Storage, see [Data Storage Offerings on Azure][WindowsAzureDataStorageOfferings].

To learn more about how to use SQL Database, see [Working with Azure SQL Database in the ASP.NET Data Access Content Map](http://go.microsoft.com/fwlink/p/?LinkId=282414#ssdb).

To learn more about the Entity Framework and Code First Migrations, see the following resources:

* [Getting Started with Entity Framework using MVC][EFCodeFirstMVCTutorial]
* [Code First Migrations][EFCFMigrations]




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




<!-- links -->




[WindowsAzureDataStorageOfferings]: http://social.technet.microsoft.com/wiki/contents/articles/data-storage-offerings-on-the-windows-azure-platform.aspx

[NetAppWithSQLAzure]: http://www.windowsazure.com/en-us/develop/net/net-app-with-sql-azure





[CommonTasks]: http://windowsazure.com/develop/net/common-tasks/





[EFCodeFirstMVCTutorial]: http://www.asp.net/mvc/tutorials/getting-started-with-ef-using-mvc/creating-an-entity-framework-data-model-for-an-asp-net-mvc-application
[EFCFMigrations]: http://msdn.microsoft.com/en-us/library/hh770484


<!-- links from Tom's hopefully no collisions -->

[WindowsAzureDataStorageOfferings]: http://social.technet.microsoft.com/wiki/contents/articles/data-storage-offerings-on-the-windows-azure-platform.aspx

[NetAppWithSQLAzure]: http://www.windowsazure.com/en-us/develop/net/tutorials/cloud-service-with-sql-database/





[CommonTasks]: http://www.windowsazure.com/en-us/develop/net/common-tasks/







[EFCodeFirstMVCTutorial]: http://www.asp.net/mvc/tutorials/getting-started-with-ef-using-mvc/creating-an-entity-framework-data-model-for-an-asp-net-mvc-application
[EFCFMigrations]: http://msdn.microsoft.com/en-us/library/hh770484
[DevelopingWebAppsWithWindowsAzure]: http://msdn.microsoft.com/en-us/library/Hh674484

<!-- images-->
[rxE]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxE.png
[rx2]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rx2.png
[rxP]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxP.png
[rxFB]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxFB.png
[rxSTD]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxSTD.png
[rxUid]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxUid.png
[rxRoleID]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxRoleID.png
[rxUR]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxUR.png
[rxC2S]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxC2S.png
[rxGenScripts]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxGenScripts.png
[rx11]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rx11.png
[rxAdv]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxAdv.png
[rx1]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rx1.png
[rxd]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxd.png
[rxSettings]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxSettings.png
[rxD2]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxD2.png
[rxAddSQL2]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxAddSQL2.png
[rxc]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxc.png
[rx3]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rx3.png
[rx4]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rx4.png
[rx5]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rx5.png
[rx6]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rx6.png
[rx7]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rx7.png
[rx8]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rx8.png
[rx9]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rx9.png
[rxa]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxa.png
[rxb]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxb.png
[rxSS]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxSS.png
[rxp2]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxp2.png
[rxp3]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxp3.png
[rxSSL]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxSSL.png
[rxS2]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxS2.png
[rxNOT]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxNOT.png
[rxNOT2]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxNOT2.png
[rxb2]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxb2.png
[rxNOT]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxNOT.png
[rxNOT]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxNOT.png
[rxNOT]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxNOT.png
[rxCreateWSwithDB_2]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxCreateWSwithDB_2.png
[rxNewCtx]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxNewCtx.png
[rxCreateWSwithDB_2]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxCreateWSwithDB_2.png 
[rxPrevDB]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxPrevDB.png
[rxOverwrite]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxOverwrite.png
[rxNewCtx]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxNewCtx.png
[rxSettings]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxSettings.png
[rxWSnew]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxWSnew2.png
[rxCreateWSwithDB]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/rxCreateWSwithDB.png
[setup007]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/dntutmobile-setup-azure-site-004.png
[setup009]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/dntutmobile-setup-azure-site-006.png
[newapp002]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/dntutmobile-createapp-002.png
[newapp004]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/dntutmobile-createapp-004.png
[newapp005]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/newapp005.png
[firsdeploy001]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/dntutmobile-deploy1-download-profile.png
[firsdeploy002]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/dntutmobile-deploy1-save-profile.png
[firsdeploy003]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/dntutmobile-deploy1-publish-001.png
[adddb001]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/dntutmobile-adddatabase-001.png
[adddb002]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/dntutmobile-adddatabase-002.png
[addcode001]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/dntutmobile-controller-add-context-menu.png
[addcode002]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/dntutmobile-controller-add-controller-dialog.png

[addcode008]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/dntutmobile-migrations-package-manager-menu.png
[addcode009]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/dntutmobile-migrations-package-manager-console.png
[Important information about ASP.NET in Azure Web Sites]: #aspnetwindowsazureinfo
[Next steps]: #nextsteps
[ImportPublishSettings]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/ImportPublishSettings.png
[ImportPublishProfile]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/ImportPublishProfile.png
[PublishVSSolution]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/PublishVSSolution.png
[WebPIAzureSdk20NetVS12]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/WebPIAzureSdk20NetVS12.png
[WebPIAzureSdk20NetVS12]: ./media/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database-vs2012/WebPIAzureSdk20NetVS12.png
