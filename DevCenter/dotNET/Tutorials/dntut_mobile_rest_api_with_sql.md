<div chunk="../chunks/article-left-menu.md" />
# Deploy an ASP.NET MVC application with OAuth, Membership and SQL Database 

This tutorial shows you how to build a secure ASP.NET MVC 4 web application that enables users to log in with credentials from Facebook, Yahoo and Google. You will also deploy the application to Windows Azure.

You can open a Windows Azure account for free, and if you don't already have Visual Studio 2012, the SDK automatically installs Visual Studio 2012 for Web Express. You can start developing for Windows Azure for free.

This tutorial assumes that you have no prior experience using Windows Azure. On completing this tutorial, you'll have a secure data-driven web application up and running in the cloud and using a cloud database.

You'll learn:

* How to enable your machine for Windows Azure development by installing the Windows Azure SDK.
* How to create a secure ASP.NET MVC 4 project and publish it to a Windows Azure Web Site.
* How to use OAuth and the ASP.NET membership database to secure your application.
* How to deploy a membership database to Windows Azure.
* How to use a SQL database to store data in Windows Azure.
* How to use Visual Studio to update and manage the membership database on SQL Azure.

You'll build a simple contact list web application that is built on ASP.NET MVC 4 and uses the ADO.NET Entity Framework for database access. The following illustration shows the login page for the completed application:
<br/><br/>
![login page][rxb]<br/>

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />

In this tutorial:

- [Set up the development environment][setupdbenv]
- [Set up the Windows Azure environment][setupwindowsazureenv]
- [Create an ASP.NET MVC 4 application][createapplication]
- [Deploy the application to Windows Azure][deployapp1]
- [Add a database to the application][adddb]
- [Add an OAuth Provider][]
- [Add Roles to the Membership Database][]
- [Create a Data Deployment Script][]
- [Deploy the app to Windows Azure][deployapp11]
- [Update the Membership Database][]

<h2><a name="bkmk_setupdevenv"></a>Set up the development environment</h2>

To start, set up your development environment by installing the Windows Azure SDK for the .NET Framework. (If you already have Visual Studio or Visual Web Developer, the SDK isn't required for this tutorial. It will be required later if you follow the suggestions for further learning at the end of the tutorial.)

1. To install the Windows Azure SDK for .NET, click the link below. If you don't have Visual Studio installed yet, use the Visual Studio 2012 button.<br/>
<a href="http://go.microsoft.com/fwlink/?LinkId=254364&clcid=0x409" class="site-arrowboxcta download-cta">Get Tools and SDK for Visual Studio 2012</a><br/>
2. When you are prompted to run or save vwdorvs11azurepack.exe, click **Run**.
	<!--<br/>![run the WindowsAzureSDKForNet.exe file][setup001]-->
3. In the Web Platform Installer window, click **Install** and proceed with the installation.
	<!--[Web Platform Installer - Windows Azure SDK for .NET][setup002]<br/>-->
4. Install  [ASP.NET and Web Tools 2012.2][MVC4Install_20012].

When the installation is complete, you have everything necessary to start developing.

<h2><a name="bkmk_setupwindowsazure"></a>Set up the Windows Azure environment</h2>

Next, set up the Windows Azure environment by creating a Windows Azure Web Site and a SQL database.

### Create a web site and a SQL database in Windows Azure

The next step is to create the Windows Azure web site and the SQL database that your application will use.

Your Windows Azure Web Site will run in a shared hosting environment, which means it runs on virtual machines (VMs) that are shared with other Windows Azure clients. A shared hosting environment is a low-cost way to get started in the cloud. Later, if your web traffic increases, the application can scale to meet the need by running on dedicated VMs. If you need a more complex architecture, you can migrate to a Windows Azure Cloud Service. Cloud services run on dedicated VMs that you can configure according to your needs.

SQL Database is a cloud-based relational database service that is built on SQL Server technologies. The tools and applications that work with SQL Server also work with SQL Database.

1. In the Windows Azure Management Portal, click **Web Sites** in the left tab, and then click  **New**.<br/>
![New button in Management Portal][rxWSnew]
2. Click **CUSTOM CREATE**.<br/>
![Create with Database link in Management Portal][rxCreateWSwithDB]<br/>
The **New Web Site - Custom Create** wizard opens. 
3. In the **New Web Site** step of the wizard, enter a string in the **URL** box to use as the unique URL for your application. The complete URL will consist of what you enter here plus the suffix that you see below the text box. The illustration shows "contactmgr2", but that URL is probably taken so you’ll have to choose a different one.
4. In the **Database** drop-down list, choose **Create a new SQL database**.
5. In the **Region** drop-down list, choose the region that is closest to you.<br/>
This setting specifies which data center your VM will run in. In the **DB CONNECTION STRING NAME**, enter *connectionString1*.
![Create a New Web Site step of New Web Site - Create with Database wizard][rxCreateWSwithDB_2]<br/>
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

1. Start Visual Studio 2012 as an administrator.
1. From the **File** menu click **New Project**.
3. In the **New Project** dialog box, expand **Visual C#** and select **Web** under **Installed Templates** and then select **ASP.NET MVC 4 Web Application**. Keep the default **.NET Framework 4.5**. Name the application **ContactManager** and click **OK**.<br/>
	![New Project dialog box][newapp002]
6. In the **New ASP.NET MVC 4 Project** dialog box, select the **Internet Application** template. Keep the default Razor **View Engine** and then click **OK**.<br/>
	![New ASP.NET MVC 4 Project dialog box][newapp003]

### Set the page header and footer


1. In **Solution Explorer**, expand the Views\Shared folder and open the *_Layout.cshtml* file.<br/>
	![_Layout.cshtml in Solution Explorer][newapp004]
1. Replace each occurance of "My ASP.NET MVC Application" with "Contact Manager".
1. Replace "your logo here" with "CM Demo".
<br/>


### Run the application locally

1. Press CTRL+F5 to run the application.
The application home page appears in the default browser.<br/>
![To Do List home page][rxA]

This is all you need to do for now to create the application that you'll deploy to Windows Azure. Later you'll add database functionality.

<h2><a name="bkmk_deploytowindowsazure1"></a>Deploy the application to Windows Azure</h2>

1. In your browser, open the [Windows Azure Management Portal](http://manage.windowsazure.com "portal").
2. In the **Web Sites** tab, click the name of the site you created earlier.<br/>
![Contact manager application in Management Portal Web Sites tab][setup009]
3. On the right side of the window, click **Download publish profile**.<br/>
![Quickstart tab and Download Publishing Profile button][firsdeploy001]<br/>
This step downloads a file that contains all of the settings that you need in order to deploy an application to your Web Site. You'll import this file into Visual Studio so you don't have to enter this information manually.
4. Save the .*publishsettings* file in a folder that you can access from Visual Studio.<br/>
![saving the .publishsettings file][firsdeploy002]
5. In Visual Studio, right-click the project in **Solution Explorer** and select **Publish** from the context menu.<br/>
![Publish in project context menu][firsdeploy003]<br/>
The **Publish Web** wizard opens.
6. In the **Profile** tab of the **Publish Web** wizard, click **Import**.<br/>
![Import button in Publish Web wizard][firsdeploy004]
7. Select the *publishsettings* file you downloaded earlier, and then click **Open**.
8. In the **Connection** tab, click **Validate Connection** to make sure that the settings are correct.
When the connection has been validated, a green check mark is shown next to the **Validate Connection** button.
9. Click **Next**.
	<br/>![connection successful icon and Next button in Connection tab][firsdeploy007]
10. In the **Settings** tab, click **Next**.<br/>
You can accept all of the default settings on this page.  You are deploying a Release build configuration and you don't need to delete files at the destination server. The **UsersContext (DefaultConnection)** entry under **Databases** is for the *ContactDB* you just created.
	<br/>![connection successful icon and Next button in Connection tab][rxPWS]
12. In the **Preview** tab, click **Start Preview**.<br/>
The tab displays a list of the files that will be copied to the server. Displaying the preview isn't required to publish the application but is a useful function to be aware of. In this case, you don't need to do anything with the list of files that is displayed.<br/>
![StartPreview button in the Preview tab][firsdeploy009]<br/>
12. Click **Publish**.<br/>
Visual Studio begins the process of copying the files to the Windows Azure server. The **Output** window shows what deployment actions were taken and reports successful completion of the deployment.
14. The default browser automatically opens to the URL of the deployed site.<br/>
The application you created is now running in the cloud.
	<br/>![To Do List home page running in Windows Azure][newapp005]


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
4. Right-click the Controllers folder and click **Add**, and then click **Controller...**.<br/>
![Add Controller in Controllers folder context menu][addcode001]<br/>
5. In the **Add Controller** dialog box, enter "HomeController" as your controller name. Set the **Scaffolding options Template** to  **MVC Controller with read/write actions and views, using Entity Framework**.
6. Select **Contact** as your model class and **&lt;New data context...&gt;** as your data context class.<br/>
![Add Controller dialog box][addcode002]<br/>
7. On the **New Data Context** dialog box, accept the default value *ContactManager.Models.ContactManagerContext*.
	<br/>![Add Controller dialog box][rxNewCtx]<br/>
8. Click **OK**, then click **Add** in the **Add Controller** dialog box.<br/>
9. On the **Add Controller** overwrite dialog, make sure all options are checked and click **OK**.
	<br/>![Add Controller message box][rxOverwrite] <br/>
Visual Studio creates a controller methods and views for CRUD database operations for **Contact** objects.

## Enable Migrations, create the database, add sample data and a data initializer ##

The next task is to enable the [Code First Migrations](http://atlas.asp.net/mvc/tutorials/getting-started-with-ef-using-mvc/creating-an-entity-framework-data-model-for-an-asp-net-mvc-application "code first MVC") feature in order to create the database based on the data model you created.

1. In the **Tools** menu, select **Library Package Manager** and then **Package Manager Console**.
	<br/>![Package Manager Console in Tools menu][addcode008]
2. In the **Package Manager Console** window, enter the following command:<br/>

		enable-migrations -ContextTypeName ContactManagerContext
<br/>![enable-migrations][rxE] <br/>
	You must specify the context type name (**ContactManagerContext**) because the project contains two [DbContext](http://msdn.microsoft.com/en-us/library/system.data.entity.dbcontext(v=VS.103).aspx) derrived classes, the **ContactManagerContext** we just added and the **UsersContext**, which is used for the membership database. The **ContactManagerContext** class was added by the Visual Studio scaffolding wizzard.<br/>
  The **enable-migrations** command creates a *Migrations* folder and it puts in that folder a *Configuration.cs* file that you can edit to configure Migrations. <br/>

2. In the **Package Manager Console** window, enter the following command:<br/>

		add-migration Initial


	The **add-migration Initial** command generates a file named **&lt;date_stamp&gt;Initial** in the *Migrations* folder that creates the database. The first parameter ( **Initial** ) is arbitrary and used to create the name of the file. You can see the new class files in **Solution Explorer**.<br/>
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

<br/>![MVC view of data][rx2]

<h2><a name="addOauth"></a><span class="short-header">OAuth</span>Add an OAuth Provider</h2>

[OAuth](http://oauth.net/ "http://oauth.net/") is an open protocol that allows secure authorization in a simple and standard method from web, mobile and desktop applications. The ASP.NET MVC internet template uses OAuth to expose Facebook, Twitter, Google and Microsoft as authentication providers. Although the examples in this tutorial focus on using Facebook as the authentication provider, you can modify the code to use any of the providers. The steps to implement any provider are very similar to the steps you will see in this tutorial. 

In addtion to authentication, the tutorial will also use roles to implement authorization. Only those users you add to the managers role will be able to create, edit or delete contacts.

## Registering with an external provider ##

To authenticate users with credentials from an external provider, you must register your web site with the provider. When you register your site, you will receive the parameters (such as key or id, and secret) to include when registering the client. You must have an account with the providers you wish to use.

This tutorial does not show all of the steps you must perform to register with these providers. The steps are typically not difficult. To successfully register your site, follow the instructions provided on those sites. To get started with registering your site, see the developer site for:

- [Facebook](http://developers.facebook.com/)
- [Google](http://developers.google.com/)
- [Microsoft](http://manage.dev.live.com/)
- [Twitter](http://dev.twitter.com/)

Navigate to  [https://developers.facebook.com/apps](https://developers.facebook.com/apps/)  page and log in if necessary. Click the **Register as a Developer** button and complete the registration process. Once you complete registration, click **Create New App**. Enter a name for the app. You don't need to enter an app namespace.
<br/>![Create New FB app][rxFBapp]
<br/><br/>

Enter localhost for the **App Domain** and http://localhost/ for the **Site URL**. Click **Enabled** for **Sandbox Mode**, then click **Save Changes**.
<br/><br/>

You will need the **App ID** and the **App Secret** to implement OAuth in this application.
<br/>![New FB app][rxFB]
<br/>
## Creating test users ##
In the left pane under **Settings** click **Developer Roles**. Click the **Create** link on the **Test Users** row (not the **Testers** row).
<br/>![FB testers][rxFBt]
<br/><br/>
Click on the **Modify** link to get the test users email (which you will use to log into the application). Click the **See More** link, then click **Edit** to set the test users password.

## Adding application id and secret from the provider ##

Open the *App_Start\AuthConfig.cs* file. Remove the comment characters from the *RegisterFacebookClient* method and add the app id and app secret. Use the values you obtained, the values shown below will not work.


    public static class AuthConfig
    {
        public static void RegisterAuth()
        {
 
            //OAuthWebSecurity.RegisterMicrosoftClient(
            //    clientId: "",
            //    clientSecret: "");

            //OAuthWebSecurity.RegisterTwitterClient(
            //    consumerKey: "",
            //    consumerSecret: "");

            OAuthWebSecurity.RegisterFacebookClient(
                appId: "387804053624929",
                appSecret: "242d880946797e722ce66d8a057d344f");

            //OAuthWebSecurity.RegisterGoogleClient();
        }
    }


1. Run the application and click  the **Log In** link. 
1. Click the **Facebook** button. 
1. Enter your facebook credentials or one of the test users credentials.
1. Click **Okay** to allow the application to access your facebook resources.
1. You are redirected to the Register page. If you logged in using a test account, you can change the **user name** to something shorter, for example "Bill FB test". Click the **Register** button which will save the user name and email alias to the membership database. 
1. Register another user. Currently a bug in the log in system prevents you from logging off and singing in as another user. To work around this, navigate to the site using another browser and register another user. One user will be added to the manager role and have edit access to application, the other user will only have access to non edit methods on the site. Anonymous users will only have access to the home page.

<h2><a name="mbrDB"></a><span class="short-header">Membership DB</span>Add Roles to the Membership Database</h2>


1. From the **View** menu, click **Server Explorer**.
1. In **Server Explorer**, click **DefaultConnection**. 
1. Click **Tables**.
1. Right click **UserProfile** and click **Show Table Data**.
<br/> 
<br/>![Show table data][rxSTD]
<br/> <br/>
1. Record the **UserId** for the user that will have the managers role. In the image below, the user *ricka* with **UserId** 2 will be the manager for the site.
<br/> <br/>![user IDs][rxUid]
<br/> <br/>
1. Right click **webpages_Roles** and click **Show Table Data**.
1. Enter **manager** in the **RoleName** cell. The **RoleId** will be 1 if this is the first time you've added a role. Record the ID.
<br/> <br/>![roleID][rxRoleID]<br/> <br/>
1. Right click **webpages UsersInRoles** and click **Show Table Data**. Enter the **UserId** for the user you want to grant manager access and the **RoleId**.
<br/> <br/>![usr role ID tbl][rxUR]<br/> <br/>
The  **webpages_OAuthMembership** table contains the OAuth provider, the provider UserID and the UserID for each registered OAuth user. <!-- Don't replace "-" with "_" or it won't validate -->The **webpages-Membership** table contains the ASP.NET membership table. You can add users to this table using the register link. You might want to add a user with the managers role that is not associated with facebook. We will disable ASP.NET membership registration.

## Protect the Application with the Authorize Attribute ##

In this section we will apply the [Authorize](http://msdn.microsoft.com/en-us/library/system.web.mvc.authorizeattribute(v=vs.100).aspx) attribute to restrict access to the action methods. Anonymous user will be able to view the home page only. Users who have registered through facebook will be able to see contact details, the about and the contacts pages. Only users in the manager role will be able to access action methods that change data.

1. Add the [Authorize](http://msdn.microsoft.com/en-us/library/system.web.mvc.authorizeattribute(v=vs.100).aspx) attribute to the Home controller. This will require users to be authenticated in each of the methods of the controller. 
1. Add the [AllowAnonymous](http://blogs.msdn.com/b/rickandy/archive/2012/03/23/securing-your-asp-net-mvc-4-app-and-the-new-allowanonymous-attribute.aspx) attribute to the **Index** method. The [AllowAnonymous](http://blogs.msdn.com/b/rickandy/archive/2012/03/23/securing-your-asp-net-mvc-4-app-and-the-new-allowanonymous-attribute.aspx) attribute allows you to whitelist the methods you want to opt out of authorization.
1. Add   [Authorize(Roles = "Manager")] to the Get and Post methods that change data (Create, Edit, Delete). 


<br/>

    [Authorize]
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

        [Authorize(Roles = "Manager")]
        public ActionResult Create()
        {
            return View();
        }

        // Methods moved and omitted for clarity.
    }


A better approach that decorating each edit method with [Authorize(Roles = "Manager")] would be to apply [Authorize(Roles = "Manager")]  to the controller, then create an attribute to white list those methods that only require authorization. See [this blog post for instructions on creating an opt out attribute. Applying the scricted security on the controller and then opting out on methods is considered more secure because as you add new methods to the controller, they are automatically protected. You can also apply   

1. Press CTRL+F5 to run the application. Verify only the user in the Manger role can change data. Verify anonymous users can only view the home page.


## Disable Registration for non-authenticated users  ##
In this section we will require that new users can only be registered after they have been authenticated from another log in service (for this sample, Facebook).
 Open the *Controllers\AccountController.cs* file and remove the [AllowAnonymous](http://blogs.msdn.com/b/rickandy/archive/2012/03/23/securing-your-asp-net-mvc-4-app-and-the-new-allowanonymous-attribute.aspx) attribute from the Get and Post *Register* method.


<h2><a name="ppd"></a><span class="short-header">Prepare DB</span>Create a Data Deployment Script</h2>


The membership database isn't managed by Entity Framework Code First so you can't use Migrations to deploy it.  We'll use the dbDacFx provider to deploy the database schema, and we'll configure the publish profile to run a script that will insert initial membership data into membership tables.

This tutorial will use  SQL Server Management Studio (SSMS) to create data deployment scripts. 

Install SSMS  from [Microsoft SQL Server 2012 Express Download Center](http://www.microsoft.com/en-us/download/details.aspx?id=29062):

- [ENU\x64\SQLManagementStudio_x64_ENU.exe](http://download.microsoft.com/download/8/D/D/8DD7BDBA-CEF7-4D8E-8C16-D9F69527F909/ENU/x64/SQLManagementStudio_x64_ENU.exe) for 64 bit systems.
- [ENU\x86\SQLManagementStudio_x86_ENU.exe](http://download.microsoft.com/download/8/D/D/8DD7BDBA-CEF7-4D8E-8C16-D9F69527F909/ENU/x86/SQLManagementStudio_x86_ENU.exe) for 32 bit systems.

 If you choose the wrong one for your system it will fail to install and you can try the other one.

(Note that this is a 600 megabyte download. It may take a long time to install and will require a reboot of your computer.)

On the first page of the SQL Server Installation Center, click **New SQL Server stand-alone installation or add features to an existing installation**, and follow the instructions, accepting the default choices.

Create the development database script

1. Run SSMS.
1. In the **Connect to Server** dialog box, enter *(localdb)\v11.0* as the Server name, leave **Authentication** set to **Windows Authentication**, and then click **Connect**.
<br/><br/>![con to srvr dlg][rxC2S]<br/> 
1. In the **Object Explorer** window, expand **Databases**, right-click **aspnet-ContactManager**, click **Tasks**, and then click **Generate Scripts**.
<br/><br/>![Gen Scripts][rxGenScripts]<br/><br/> 
1. In the **Generate and Publish Scripts** dialog box, click **Set Scripting Options**.
You can skip the **Choose Objects** step because the default is Script entire database and all database objects and that is what you want.
1. Click **Advanced**.
<br/> <br/>![Set scripting options][rx11]<br/> <br/>
1. In the **Advanced Scripting Options** dialog box, scroll down to **Types of data to script**, and click the **Data only** option in the drop-down list.
<br/> <br/>![Set scripting options][rxAdv]<br/> <br/>
1. Change **Script USE DATABASE** to **False**.  USE statements aren't valid for Windows Azure SQL Database and aren't needed for deployment to SQL Server Express in the test environment.
1. Click **OK**.
1. In the **Generate and Publish Scripts** dialog box, the **File name** box specifies where the script will be created. Change the path to your solution folder (the folder that has your *Contacts.sln* file) and change the file name to *aspnet-data-membership.sql*.
1. Click **Next** to go to the **Summary** tab, and then click **Next** again to create the script.
<br/> <br/>![Save or pub][rx1]<br/> <br/>
1. Click **Finish**.

<h2><a name="bkmk_deploytowindowsazure11"></a>Deploy the app to Windows Azure</h2>

1. Open the *Web.config* file. Copy and paste the *DefaultConnection* XML. Rename the copied element *DefaultConnectionDeploy*.
<br/><br/>![3 cons str][rxD]<br/> 
1.In Visual Studio, right-click the project in **Solution Explorer** and select **Publish** from the context menu.<br/>
![Publish in project context menu][firsdeploy003]<br/>
The **Publish Web** wizard opens.
1. Click the **Settings** tab. Click the **v** icon to select the **Remote connection string** for the **ContactManagerContext** and  **DefaultConnectionDeploy**. The three Databases listed will all use the same connection string.
<br/><br/>![settings][rxD2]<br/> 
1. Under **ContactManagerContext**, check **Execute Code First Migrations**.
<br/><br/>![settings][rxSettings]<br/> 
1. Under **DefaultConnectionDeploy** check **Update database** then click the **Configure database updates** link.
1. Click the **Add SQL Script** link and navigate to the  *aspnet-data-membership.sql* file. You only need to do this once. The next deployment you uncheck **Update database** because you won't need to add the user data to the membership tables.
<br/><br/>![add sql][rxAddSQL2]<br/> 
1. Click **Publish**.
1. Navigate to the Navigate to  [https://developers.facebook.com/apps](https://developers.facebook.com/apps/)  page and change the **App Domains** and **Site URL** settings to the Windows Azure URL.
1. Test the application. Verify only the user in the manager role can change data. Verify anonomous users can only view the home page. Verify authenticated users can navigate to all links that don't change data.

<h2><a name="ppd2"></a><span class="short-header">Update DB</span>Update the Membership Database</h2>

Once the site is deployed to Windows Azure and you have more registered users you might want to make some of them members of the mangager role. In this section we will use Visual Studio to connecto the the SQL Azure database and add users to the managers role.

1. In **Solution Explorer**, right click the project and select **Publish**.
 <br/>![Publish][rxP]<br/><br/>
1. Click the **Settings** tab.
2. Copy the connection string. For example, the connection string used in this sample is:
	Data Source=tcp:d015leqjqx.database.windows.net,1433;
	Initial Catalog=ContactDB2;User Id=ricka0@d015lxyze;Password=*****
1. Close the publishing dialog.
1. From the **View** menu, click **Server Explorer**.
1. Click on the **Connect to Database** icon.
 <br/>![Publish][rxc]<br/><br/>
1. If you are prompted for the Data Source, click **Microsoft SQL Server**.
 <br/>![Publish][rx3]<br/><br/>
1. Copy and paste the **Server Name**, which starts with *tcp*.
1. Click **Use SQL Server Authentication**
1. Enter your **User name** and **Password**, which are in the connection string you coppied.
1. Enter the datbase name (The string after "Initial Catalog=" in the database.) If you get a error dialog, see the next section. 
1. Click **Test Connection**. If you get a error dialog, see the next section. 
 <br/>![add con dlg][rx4]<br/><br/>

## Cannot open server login error ##
If you get an error dialog stating "Cannot open server" you will need to add your IP address to the allowed IPs.
 <br/>![firewall error][rx5]<br/><br/>

1. In the Windows Azure Portal, Slect **SQL Databases** in the left tab.
 <br/><br/>![Select SQL][rx6]<br/><br/>
1. Select the database you wish to open.
1. Click the **Set up Windows Azure firewall rules fo this IP address** link.
 <br/><br/>![firewall rules][rx7]<br/><br/>
1. When you are prompted with "The current IP adress xxx.xxx.xxx.xxx is not included in existing firewall rules. Do you want to update the firewall rules?", click **Yes**.

## Adding a Range of Allowed IP Addresses ##
If your IP address frequently changes, you can add a range of allowed IP addresses.

1. In the Windows Azure Portal, Click **SQL Databases**.
1. Click the **Server** hosting your Database.
 <br/>![db server][rx8]<br/><br/>
1. Click **Configure** on the top of the page.
1. Add a rule name, starting and ending IP addresses.
<br/>![ip range][rx9]<br/><br/>
1. At the bottom of the page, click **Save**.

<h2><a name="nextsteps"></a>Next Steps</h2>

To get the colorful Facebook, Google and Yahoo loging buttons, see the blog post [Customizing External Login Buttons in ASP.NET MVC 4](http://www.beabigrockstar.com/customizing-external-login-buttons-in-asp-net-mvc-4/).
Another way to store data in a Windows Azure application is to use Windows Azure storage, which provide non-relational data storage in the form of blobs and tables. The following links provide more information on Web API, ASP.NET MVC and Window Azure. 

- [.NET Multi-Tier Application Using Storage Tables, Queues, and Blobs](http://www.windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/1-overview/).
- [Getting Started with Entity Framework using MVC][EFCodeFirstMVCTutorial]
- [Intro to ASP.NET MVC 4](http://www.asp.net/mvc/tutorials/mvc-4/getting-started-with-aspnet-mvc4/intro-to-aspnet-mvc-4)
- [OAuth 2.0 and Sign-In](http://blogs.msdn.com/b/vbertocci/archive/2013/01/02/oauth-2-0-and-sign-in.aspx)

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
[rx]: ../Media/rx.png
[rx]: ../Media/rx.png

[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
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




