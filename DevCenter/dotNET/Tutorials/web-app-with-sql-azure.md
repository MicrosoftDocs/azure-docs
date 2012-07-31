#  Deploying an ASP.NET Web Application to a Windows Azure Web Site and SQL Database

This tutorial shows how to deploy an ASP.NET web application to a Windows Azure Web Site by using the Publish Web wizard in Visual Studio 2012 RC or Visual Studio 2012 for Web Express RC. If you prefer, you can follow the tutorial steps by using Visual Studio 2010 or Visual Web Developer Express 2010.

You can open a Windows Azure account for free, and if you don't already have Visual Studio 2012, the SDK automatically installs Visual Studio 2012 for Web Express. So you can start developing for Windows Azure entirely for free.

This tutorial assumes that you have no prior experience using Windows Azure. On completing this tutorial, you'll have a data-driven web application up and running in the cloud and using a cloud database.
 
You'll learn:

* How to enable your machine for Windows Azure development by installing the Windows Azure SDK.
* How to create a Visual Studio ASP.NET MVC 4 project and publish it to a Windows Azure Web Site.
* How to use a SQL Database instance to store data in Windows Azure.
* How to publish application updates to Windows Azure.

You'll build a simple to-do list web application that is built on ASP.NET MVC 4 and uses the ADO.NET Entity Framework for database access. The following illustration shows the completed application:

![screenshot of website][Image059]

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />
 
## Tutorial segments

1. [Set up the development environment][]
2. [Create a web site and a SQL database in Windows Azure][]
3. [Create an ASP.NET MVC 4 application][]
4. [Deploy the application to Windows Azure][]
5. [Add a database to the application][]
6. [Deploy the application update to Windows Azure and SQL Database][]
7. [Important information about ASP.NET in Windows Azure Web Sites][]
8. [Next steps][]

<h2><a name="setupdevenv"></a>Set up the development environment</h2>

To start, set up your development environment by installing the Windows Azure SDK for the .NET Framework. (If you already have Visual Studio or Visual Web Developer, the SDK isn't required for this tutorial. It will be required later if you follow the suggestions for further learning at the end of the tutorial.) 

1. To install the Windows Azure SDK for .NET, click the link that corresponds to the version of Visual Studio you are using. If you don't have Visual Studio installed yet, use the Visual Studio 2012 link.<br/>
[Windows Azure SDK for Visual Studio 2010][]<br/>
[Windows Azure SDK for Visual Studio 2012 RC][]
2. When you are prompted to run or save VWDOrVs11AzurePack_RC.3f.3f.3fnew.exe, click **Run**.<br/>
3. In the Web Platform Installer window, click **Install** and proceed with the installation.<br/>
![Web Platform Installer - Windows Azure SDK for .NET][Image003]<br/>
4. If you are using Visual Studio 2010 or Visual Web Developer 2010 Express, install [MVC 4][MVC4Install].

When the installation is complete, you have everything necessary to start developing.

<h2><a name="setupwindowsazure"></a>Create a web site and a SQL database in Windows Azure</h2>

The next step is to create the Windows Azure web site and the SQL database that your application will use.

SQL Database is a cloud-based relational database service that is built on SQL Server technologies. The tools and applications that work with SQL Server also work with SQL Database.

1. In the [Windows Azure Management Portal][NewPortal], click **New**.<br/>
![New button in Management Portal][Image011]
2. Click **Web Site**, and then click **Create with Database**.<br/>
![Create with Database link in Management Portal][Image013]<br/>
The **New Web Site - Create with Database** wizard opens. The Create with Database wizard enables you to create a web site and a database at the same time.
4. In the **New Web Site** step of the wizard, enter a string in the **URL** box to use as the unique URL for your application.<br/>The complete URL will consist of what you enter here plus the suffix that you see below the text box. The illustration shows "todolistapp", but if someone has already taken that URL you have to choose a different one.
5. In the **Database** drop-down list, choose **Create a new SQL database**.
6. In the **Region** drop-down list, choose the region that is closest to you.<br/>
This setting specifies which data center your VM will run in. 
7. Click the arrow that points to the right at the bottom of the box.<br/>
![Create a New Web Site step of New Web Site - Create with Database wizard][Image014]<br/>
The wizard advances to the **Database Settings** step.
8. In the **Name** box, enter a name for your database.
9. In the **Server** box, select **New SQL Database server**.
9. Click the arrow that points to the right at the bottom of the box.<br/>
![Database Settings step of New Web Site - Create with Database wizard][Image015]<br/>
The wizard advances to the **Create a Server** step.
9. Enter an administrator name and password.<br/>
You aren't entering an existing name and password here. You're entering a new name and password that you're defining now to use later when you access the database.
9. In the **Region** box, choose the same region that you chose for the web site.<br/>
Keeping the web server and the database server in the same region gives you the best performance. 
9. Make sure that **Allow Windows Azure Services to access the server** is selected.<br/>
This option is selected by default. It creates a firewall rule that allows your Windows Azure Web Site to access this database.
9. Click the check mark at the bottom of the box to indicate you're finished.<br/>
![Create a Server step of New Web Site - Create with Database wizard][Image016]<br/>
The Management Portal returns to the Web Sites page, and the **Status** column shows that the site is being created. After a while (typically less than a minute), the **Status** column shows that the site was successfully created. In the navigation bar at the left, the number of sites you have in your account appears next to the **Web Sites** icon, and the number of databases appears next to the **SQL Databases** icon.<br/>
![Web Sites page of Management Portal, website created][Image018]<br/>

<h2><a name="createmvc4app"></a>Create an ASP.NET MVC 4 application</h2>

You have created a Windows Azure Web Site, but there is no content in it yet. Your next step is to create the Visual Studio web application project that you'll publish to Windows Azure.

### Create the project

1. Start Visual Studio 2012 or Visual Studio 2012 for Web Express.
2. From the **File** menu select **New Project**.<br/>
![New Project in File menu][Image020]
3. In the **New Project** dialog box, expand **C#** and select **Web** under **Installed Templates** and then select **ASP.NET MVC 4 Web Application**. 
3. Change the **.NET Framework** drop-down list from **.NET Framework 4.5** to **.NET Framework 4**. (As this tutorial is being written, Windows Azure Web Sites do not support ASP.NET 4.5.)
4. Name the application **ToDoListApp** and click **OK**.<br/>
![New Project dialog box][Image021]
5. In the **New ASP.NET MVC 4 Project** dialog box, select the **Internet Application** template.
6. In the **View Engine** drop-down list make sure that **Razor** is selected, and then click **OK**.<br/>
![New ASP.NET MVC 4 Project dialog box][Image022]

### Set the page header and footer

1. In **Solution Explorer**, expand the Views\Shared folder and open the &#95;Layout.cshtml file.<br/>
![_Layout.cshtml in Solution Explorer][Image023]
2. In the **&lt;title&gt;** element, change "My ASP.NET MVC Application" to "To Do List".
3. In the **&lt;header&gt;** element, change "your logo here." to "To Do List".<br/>
![title and header in _Layout.cshtml][Image024]
4. In the **&lt;footer&gt;** element, change "My ASP.NET MVC Application" to "To Do List".<br/>
![footer in _Layout.cshtml][Image025]

### Run the application locally

1. Press CTRL+F5 to run the application.
The application home page appears in the default browser.<br/>
![To Do List home page][Image026]

This is all you need to do for now to create the application that you'll deploy to Windows Azure. Later you'll add database functionality.

<h2><a name="deploytowindowsazure"></a>Deploy the application to Windows Azure</h2>

1. In your browser, open the [Windows Azure Management Portal][NewPortal].
2. In the **Web Sites** tab, click the name of the site you created earlier.<br/>
![todolistapp in Management Portal Web Sites tab][Image030]
1. Under **Quick glance** in the **Dashboard** tab, click **Download publishing profile**.<br/>
![Download Publishing Profile link][Image031]<br/>
This step downloads a file that contains all of the settings that you need in order to deploy an application to your web site. You'll import this file into Visual Studio so you don't have to enter this information manually.
1. Save the .publishsettings file in a folder that you can access from Visual Studio.<br/>
![saving the .publishsettings file][Image032]
1. In Visual Studio, right-click the project in **Solution Explorer** and select **Publish** from the context menu.<br/>
![Publish in project context menu][Image033]<br/>
The **Publish Web** wizard opens.
1. In the **Profile** tab of the **Publish Web** wizard, click **Import**.<br/>
![Import button in Publish Web wizard][Image034]
1. Select the .publishsettings file you downloaded earlier, and then click **Open**.<br/>
![Import Publish Settings dialog box][Image035]
1. In the **Connection** tab, click **Validate Connection** to make sure that the settings are correct.<br/>
![Connection tab of Publish Web wizard][Image036]<br/>
When the connection has been validated, a green check mark is shown next to the **Validate Connection** button.
1. Click **Next**.<br/>
![connection successful icon and Next button in Connection tab][Image038]
1. In the **Settings** tab, click **Next**.<br/>
You can accept all of the default settings on this page.  You are deploying a Release build configuration and you don't need to delete files at the destination server. The **DefaultConnection** entry under **Databases** is for the ASP.NET membership (log on) functionality built into the default MVC 4 project template. You aren't using that membership functionality for this tutorial, so you don't need to enter any settings for **DefaultConnection**.<br/>  
![Settings tab of the Publish Web wizard][Image039]
1. In the **Preview** tab, click **Start Preview**.<br/>
The tab displays a list of the files that will be copied to the server. Displaying the preview isn't required to publish the application but is a useful function to be aware of. In this case, you don't need to do anything with the list of files that is displayed.<br/> 
![StartPreview button in the Preview tab][Image040]<br/>
1. Click **Publish**.<br/>
Visual Studio begins the process of copying the files to the Windows Azure server.<br/>
![Publish button in the Preview tab][Image041]
1. The **Output** window shows what deployment actions were taken and reports successful completion of the deployment.<br/>
![Output window reporting successful deployment][Image043]
1. The default browser automatically opens to the URL of the deployed site.<br/>
The application you created is now running in the cloud.<br/>
![To Do List home page running in Windows Azure][Image042]<br/>

<h2><a name="addadatabase"></a>Add a database to the application</h2>

Next, you'll update the MVC application to add the ability to display and update to-do-list items and store the data in a database. The application will use the Entity Framework to create the database and to read and update data in the database.

### Add data model classes for the to-do list

You begin by creating a simple data model in code.

1. In **Solution Explorer**, right-click the Models folder, click **Add**, and then **Class**.<br/>
![Add Class in Models folder context menu][Image052]	
2. In the **Add New Item** dialog box, name the new class file ToDoItem.cs, and then click **Add**.<br/>
![Add New Item dialog box][Image053]
3. Replace the contents of the ToDoItem.cs file with the following code.

		using System;
		using System.Collections.Generic;
		using System.Linq;
		namespace ToDoListApp.Models
		{
    		public class ToDoItem
    		{
        		public int ToDoItemId { get; set; }
        		public string Name { get; set; }
        		public bool IsComplete { get; set; }
    		}
		}
The **ToDoItem** class defines the data that you want to store for each to-do list item, plus a primary key that is needed by the database.
2. Add another class file named ToDoDb.cs and replace the contents of the file with the following code.

		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Data.Entity;
		namespace ToDoListApp.Models
		{
    		public class ToDoDb : DbContext
    		{
        		public DbSet<ToDoItem> ToDoItems { get; set; }
    		}
		}
The **ToDoDb** class lets the Entity Framework know that you want to use **ToDoItem** objects as entities in an entity set.  An entity set in the Entity Framework corresponds to a table in a database. This is all the information the Entity Framework needs in order to create the database for you.
1. Build the project. For example, you can press CTRL+SHIFT+B.<br/>
Visual Studio compiles the data model classes that you created and makes them available for the following procedures that enable Code First Migrations and use MVC scaffolding.

### Enable Migrations and create the database

The next task is to enable the Code First Migrations feature in order to create the database based on the data model you created.

5. In the **Tools** menu, select **Library Package Manager** and then **Package Manager Console**.<br/>
![Package Manager Console in Tools menu][Image047]
6. In the **Package Manager Console** window, enter the following commands:<br/>
enable-migrations<br/>
add-migration Initial<br/>
update-database<br/>
![Package Manager Console commands][Image051]

The **enable-migrations** command creates a Migrations folder and a **Configuration** class that the Entity Framework uses to control database updates.<br/>
The **add-migration Initial** command generates a class named **Initial** that creates the database. You can see the new class files in **Solution Explorer**.<br/>
![Migrations folder in Solution Explorer][Image051a]<br/>
In the **Initial** class, the **Up** method creates the ToDoItems table, and the **Down** method (used when you want to return to the previous state) drops it:<br/>
![Initial Migration class][Image051b]<br/>
Finally, **update-database** runs this first migration which creates the database. By default, the database is created as a SQL Server Express LocalDB database. (Unless you have SQL Server Express installed, in which case the database is created using the SQL Server Express instance.)

### Create web pages that enable app users to work with to-do list items

In ASP.NET MVC the scaffolding feature can automatically generate code that performs create, read, update, and delete actions.

2. In **Solution Explorer**, right-click Controllers and click **Add**, and then click **Controller**.<br/>
![Add Controller in Controllers folder context menu][Image054]
3. In the **Add Controller** dialog box, enter "HomeController" as your controller name, and select the **Controller with read/write actions and views, using Entity Framework** template.
4. Select **ToDoItem** as your model class and **ToDoDb** as your data context class, and then click **Add**.<br/>
![Add Controller dialog box][Image055]
4. In the dialog box that indicates HomeController.cs already exists, select both **Overwrite HomeController.cs** and **Overwrite associated views** and click **OK**.<br/>
The MVC template created a default home page for your application, and you are replacing the default functionality with the to-do list read and update functionality.<br/>
![Add Controller message box][Image056] <br/>
When you click **OK**, Visual Studio creates a controller and views for each of the four main database operations (create, read, update, delete) for **ToDoItem** objects.
1. In **Solution Explorer**, open Views\Home\Index.cshtml.
2. In the line of code that reads <code>ViewBag.Title = "Index"</code>, and in the <code>h2</code> heading, change "Index" to "To Do Items".

### Run the application locally

1. Press CTRL+F5 to run the application.<br/>
![Index page][Image057] 
2. Click **Create New** and enter a to-do list item.<br/>
![Create page][Image058]
3. Click **Create**. The app returns to the home page and displays the item you entered.<br/>
![Index page with to-do list items][Image059] 

<h2><a name="deploydatabaseupdate"></a>Deploy the application update to Windows Azure and SQL Database</h2>

To publish the application, you repeat the procedure you followed earlier, adding a step to configure database deployment.

1. In **Solution Explorer**, right click the project and select **Publish**.
2. In the **Publish Web** wizard, select the **Profile** tab.
3. Click **Import**.
4. Select the same .publishsettings file that you selected earlier.
You're importing the .publishsettings file again because it has the SQL Database connection string you need for configuring database publishing.
5. Click the **Settings** tab.
6. In the connection string box for the **ToDoDb** database, select the SQL Database connection string that was provided in the .publishsettings file.<br/>
7. Select **Execute Code First Migrations (runs on application start)**. (Or select **Apply Code First Migrations** if you see that check box label instead of **Execute Code First Migrations**.)<br/>
![Settings tab of Publish Web wizard][Image060]<br/>
(As was noted earlier, the **DefaultConnection** database is for the ASP.NET membership system. You are not using membership functionality in this tutorial, so you aren't configuring this database for deployment.)
8. Click **Publish**.<br/>
After the deployment completes, the browser opens to the home page of the application.<br/>
![Index page with no to-do list items][Image061]<br/>
The Visual Studio publish process automatically configured the connection string in the deployed Web.config file to point to the SQL database. It also configured Code First Migrations to automatically upgrade the database to the latest version the first time the application accesses the database after deployment. The following XML in the deployed Web.config file configures Code First Migrations to use the MigrateDatabaseToLatestVersion initializer:<br/>
![MigrateDatabaseToLatestVersion initializer][Image062]<br/>
As a result of this setting, Code First created the database by running the code in the **Initial** class that you created earlier. It did this the first time the application tried to access the database after deployment. 
9. Enter a to-do list item as you did when you ran the app locally, to verify that database deployment succeeded.
When you see that the item you enter is saved and appears on the Index page, you know that it has been stored in the database.<br/>
![Index page with to-do list items][Image063]
 
The application is now running in the cloud, using SQL Database to store its data.

<h2><a name="aspnetwindowsazureinfo"></a>Important information about ASP.NET in Windows Azure Web Sites</h2>

Here are some things to be aware of when you plan and develop an ASP.NET application for Windows Azure Web Sites:

* The application must target ASP.NET 4.0 or earlier (not ASP.NET 4.5).
* The application runs in Integrated mode (not Classic mode).
* The application should not use Windows Authentication. Windows Authentication is usually not used as an authentication mechanism for Internet-based applications.
* In order to use provider-based features such as membership, profile, role manager, and session state, the application must use the ASP.NET Universal Providers (the [System.Web.Providers][UniversalProviders] NuGet package).
* If the applications writes to files, the files should be located in the application's content folder or one of its subfolders.

<h2><a name="nextsteps"></a>Next Steps</h2>

You've seen how to deploy a web application to a Windows Azure Web Site. To learn more about how to configure, manage, and scale Windows Azure Web Sites, see the how-to topics on the [Common Tasks][CommonTasks] page.

To learn how to deploy an application to a Windows Azure Cloud Service, see [The Cloud Service version of this tutorial][NetAppWithSqlAzure] and [Developing Web Applications with Windows Azure][DevelopingWebAppsWithWindowsAzure]. Some reasons for choosing to run an ASP.NET web application in a Windows Azure Cloud Service rather than a Windows Azure Web Site include the following:

* You want administrator permissions on the web server that the application runs on.
* You want to use Remote Desktop Connection to access the web server that the application runs on. 
* Your application is multi-tier and you want to distribute work across multiple virtual servers (web and workers).

Another way to store data in a Windows Azure application is to use Windows Azure Storage Services, which provides non-relational data storage in the form of blobs and tables. The to-do list application could have been designed to use Windows Azure Storage instead of SQL Database. For more information about both SQL Database and Windows Azure Storage, see [Data Storage Offerings on Windows Azure][WindowsAzureDataStorageOfferings].

To learn more about how to use SQL Database, see the following resources:

* [Data Migration to SQL Database: Tools and Techniques][SQLAzureDataMigration]
* [Migrating a Database to SQL Database using SSDT][SQLAzureDataMigrationBlog]
* [Migrating Data-Centric Applications to Windows Azure][MigratingDataCentricApps]
* [General Guidelines and Limitations (SQL Database)][SQLAzureGuidelines]
* [How to Use SQL Database][SQLAzureHowTo]
* [Transact-SQL Reference (SQL Database)][TSQLReference]
* [Minimizing Connection Pool errors in SQL Database][SQLAzureConnPoolErrors]

You might want to use the ASP.NET membership system in Windows Azure. For information about how to use either Windows Azure Storage or SQL Database for the membership database, see [Real World: ASP.NET Forms-Based Authentication Models for Windows Azure][ASP.NETFormsAuth].

To learn more about the Entity Framework and Code First Migrations, see the following resources:

* [Getting Started with Entity Framework using MVC][EFCodeFirstMVCTutorial]
* [Code First Migrations][EFCFMigrations]

[Set Up the development environment]: #setupdevenv
[Create a web site and a SQL database in Windows Azure]: #setupwindowsazure
[Create an ASP.NET MVC 4 application]: #createmvc4app
[Deploy the application to Windows Azure]: #deploytowindowsazure
[Add a database to the application]: #addadatabase
[Deploy the application update to Windows Azure and SQL Database]: #deploydatabaseupdate
[Important information about ASP.NET in Windows Azure Web Sites]: #aspnetwindowsazureinfo
[Next steps]: #nextsteps
[Windows Azure SDK for Visual Studio 2010]: http://go.microsoft.com/fwlink/?LinkID=254364
[Windows Azure SDK for Visual Studio 2012 RC]:  http://go.microsoft.com/fwlink/?LinkId=254269
[NewPortal]: http://manage.windowsazure.com
[MVC4Install]: http://www.asp.net/mvc/mvc4
[VS2012ExpressForWebInstall]: http://www.microsoft.com/web/gallery/install.aspx?appid=VWD11_BETA&prerelease=true
[windowsazure.com]: http://www.windowsazure.com
[WindowsAzureDataStorageOfferings]: http://social.technet.microsoft.com/wiki/contents/articles/data-storage-offerings-on-the-windows-azure-platform.aspx
[GoodFitForAzure]: http://msdn.microsoft.com/en-us/library/windowsazure/hh694036(v=vs.103).aspx
[NetAppWithSQLAzure]: http://www.windowsazure.com/en-us/develop/net/tutorials/cloud-service-with-sql-database/
[MultiTierApp]: http://www.windowsazure.com/en-us/develop/net/tutorials/multi-tier-application/
[HybridApp]: http://www.windowsazure.com/en-us/develop/net/tutorials/hybrid-solution/
[SQLAzureHowTo]: https://www.windowsazure.com/en-us/develop/net/how-to-guides/sql-azure/
[SQLAzureDataMigration]: http://msdn.microsoft.com/en-us/library/windowsazure/hh694043(v=vs.103).aspx
[ASP.NETFormsAuth]: http://msdn.microsoft.com/en-us/library/windowsazure/hh508993.aspx
[CommonTasks]: http://www.windowsazure.com/en-us/develop/net/common-tasks/
[TSQLReference]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336281.aspx
[SQLAzureGuidelines]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336245.aspx
[MigratingDataCentricApps]: http://msdn.microsoft.com/en-us/library/jj156154.aspx
[SQLAzureDataMigrationBlog]: http://blogs.msdn.com/b/ssdt/archive/2012/04/19/migrating-a-database-to-sql-azure-using-ssdt.aspx
[SQLAzureConnPoolErrors]: http://blogs.msdn.com/b/adonet/archive/2011/11/05/minimizing-connection-pool-errors-in-sql-azure.aspx
[UniversalProviders]: http://nuget.org/packages/System.Web.Providers
[EFCodeFirstMVCTutorial]: http://www.asp.net/mvc/tutorials/getting-started-with-ef-using-mvc/creating-an-entity-framework-data-model-for-an-asp-net-mvc-application
[EFCFMigrations]: http://msdn.microsoft.com/en-us/library/hh770484
[DevelopingWebAppsWithWindowsAzure]: http://msdn.microsoft.com/en-us/library/Hh674484

[0]: ../../Shared/media/antares-iaas-preview-01.png
[1]: ../../Shared/media/antares-iaas-preview-05.png
[2]: ../../Shared/media/antares-iaas-preview-06.png
[Image001]: ../Media/Dev-net-getting-started-001.png
[Image002]: ../Media/Dev-net-getting-started-002.png
[Image003]: ../Media/Dev-net-getting-started-003.png
[Image004]: ../Media/Dev-net-getting-started-004.png
[Image010]: ../../Shared/Media/FreeTrialOnWindowsAzureHomePage.png
[Image011]: ../Media/Dev-net-getting-started-011.png
[Image012]: ../Media/Dev-net-getting-started-012.png
[Image013]: ../Media/Dev-net-getting-started-013.png
[Image014]: ../Media/Dev-net-getting-started-014.png
[Image015]: ../Media/Dev-net-getting-started-015.png
[Image016]: ../Media/Dev-net-getting-started-016.png
[Image017]: ../Media/Dev-net-getting-started-017.png
[Image018]: ../Media/Dev-net-getting-started-018.png
[Image020]: ../Media/Dev-net-getting-started-020.png
[Image021]: ../Media/Dev-net-getting-started-021.png
[Image022]: ../Media/Dev-net-getting-started-022.png
[Image023]: ../Media/Dev-net-getting-started-023.png
[Image024]: ../Media/Dev-net-getting-started-024.png
[Image025]: ../Media/Dev-net-getting-started-025.png
[Image026]: ../Media/Dev-net-getting-started-026.png
[Image030]: ../Media/Dev-net-getting-started-030.png
[Image031]: ../Media/Dev-net-getting-started-031.png
[Image032]: ../Media/Dev-net-getting-started-032.png
[Image033]: ../Media/Dev-net-getting-started-033.png
[Image034]: ../Media/Dev-net-getting-started-034.png
[Image035]: ../Media/Dev-net-getting-started-035.png
[Image036]: ../Media/Dev-net-getting-started-036.png
[Image037]: ../Media/Dev-net-getting-started-037.png
[Image038]: ../Media/Dev-net-getting-started-038.png
[Image039]: ../Media/Dev-net-getting-started-039.png
[Image040]: ../Media/Dev-net-getting-started-040.png
[Image041]: ../Media/Dev-net-getting-started-041.png
[Image042]: ../Media/Dev-net-getting-started-042.png
[Image043]: ../Media/Dev-net-getting-started-043.png
[Image045]: ../Media/Dev-net-getting-started-045.png
[Image046]: ../Media/Dev-net-getting-started-046.png
[Image047]: ../Media/Dev-net-getting-started-047.png
[Image048]: ../Media/Dev-net-getting-started-048.png
[Image049]: ../Media/Dev-net-getting-started-049.png
[Image050]: ../Media/Dev-net-getting-started-050.png
[Image051]: ../Media/Dev-net-getting-started-051.png
[Image051a]: ../Media/Dev-net-getting-started-051a.png
[Image051b]: ../Media/Dev-net-getting-started-051b.png
[Image052]: ../Media/Dev-net-getting-started-052.png
[Image053]: ../Media/Dev-net-getting-started-053.png
[Image054]: ../Media/Dev-net-getting-started-054.png
[Image055]: ../Media/Dev-net-getting-started-055.png
[Image056]: ../Media/Dev-net-getting-started-056.png
[Image057]: ../Media/Dev-net-getting-started-057.png
[Image058]: ../Media/Dev-net-getting-started-058.png
[Image059]: ../Media/Dev-net-getting-started-059.png
[Image060]: ../Media/Dev-net-getting-started-060.png
[Image061]: ../Media/Dev-net-getting-started-061.png
[Image062]: ../Media/Dev-net-getting-started-062.png
[Image063]: ../Media/Dev-net-getting-started-063.png
