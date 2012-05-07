#  Deploying an ASP.NET Web Application to a Windows Azure Web Site and SQL Database

This tutorial shows how to deploy an ASP.NET web application to a Windows Azure Web Site by using the Publish Web wizard in Visual Studio 2012 RC or Visual Studio 2012 for Web Express RC. If you prefer, you can follow the tutorial steps by using Visual Studio 2010 or Visual Web Developer Express 2010.

You can open a Windows Azure account for free, and if you don't already have Visual Studio 2012, the SDK will automatically install Visual Studio 2012 for Web Express. So you can start developing for Windows Azure entirely for free.

This tutorial assumes that you have no prior experience using Windows Azure. On completing this tutorial, you'll have a data-driven web application up and running in the cloud and using a cloud database.
 
You'll learn:

* How to enable your machine for Windows Azure development by installing the Windows Azure SDK.
* How to create a Visual Studio ASP.NET MVC 4 project and publish it to a Windows Azure Web Site.
* How to use a SQL database to store data in Windows Azure.
* How to publish application updates to Windows Azure.

You'll build a simple to-do list web application that is built on ASP.NET MVC 4 and uses the ADO.NET Entity Framework for database access. The following illustration shows the completed application:

![screenshot of web site][Image059]
 
## Set up the development environment

To start, set up your development environment by installing the Windows Azure SDK for the .NET Framework. (If you already have Visual Studio or Visual Web Developer, the SDK isn't actually required for this tutorial. It will be required later if you follow the suggestions for further learning at the end of the tutorial.) 

1. To install the Windows Azure SDK for .NET, click the button that corresponds to the version of Visual Studio you are using. If you don't have Visual Studio installed yet, use the Visual Studio 2012 button.<br>
<a href="http://go.microsoft.com/fwlink/?LinkID=234939&clcid=0x409" class="site-arrowboxcta download-cta">Get Tools and SDK for Visual Studio 2012</a><br>
<a href="http://go.microsoft.com/fwlink/?LinkID=234939&clcid=0x409" class="site-arrowboxcta download-cta">Get Tools and SDK for Visual Studio 2010</a>
2. When you are prompted to run or save WindowsAzureSDKForNet.exe, click Run.<br>
![run the WindowsAzureSDKForNet.exe file][Image002]
3. In the Web Platform Installer window, click **Install** and proceed with the installation.<br>
![Web Platform Installer - Windows Azure SDK for .NET][Image003]<br>
4. If you are using Visual Studio 2010 or Visual Web Developer 2010 Express, install [Visual Studio 2010 Web Publish Update][WTEInstall] and [MVC 4][MVC4Install].

When the installation is complete, you have everything necessary to start developing.

## Set up the Windows Azure environment
 
Next, you set up the Windows Azure environment by creating a Windows Azure account, a Windows Azure Web Site, and a SQL database.

### Create a Windows Azure account

1. Open a web browser, and browse to [http://www.windowsazure.com][windowsazure.com].
2. To get started with a free account, click **Free Trial** in the upper-right corner and follow the steps.<br/>
![Free trial screenshot][Image010]

### Create a website and a SQL database in Windows Azure

The next step is to create the Windows Azure website and the SQL database that your application will use.

Your Windows Azure Web Site will run in a shared hosting environment, which means it runs on virtual machines (VMs) that are shared with other Windows Azure clients. A shared hosting environment is a low-cost way to get started in the cloud. Later, if your web traffic increases, the application can scale to meet the need by running on dedicated VMs. If you need a more complex architecture, you can migrate to a Windows Azure Cloud App. Cloud Apps run on dedicated VMs that you can configure according to your needs.

SQL Database is a cloud-based relational database service that is built on SQL Server technologies. The tools and applications that work with SQL Server also work with SQL Database.

1. In the Windows Azure Management Portal, click **New**.<br>
![New button in Management Portal][Image011]
2. Click **Web Site**, then click **Custom Create**.<br>
![Custom Create button in Management Portal][Image013]<br>
The **New Web Site - Custom Create** wizard opens. The Custom Create wizard enables you to create a Web Site and a database at the same time.
4. In the **New Web Site** step of the wizard, enter a string in the **URL** box to use as the unique URL for your application.<br>The complete URL will consist of what you enter here plus the suffix that you see below the text box. The illustration shows "todolistapp", but if someone has already taken that URL you will have to choose a different one.
5. In the **Database** drop-down list, choose **Create a new SQL Azure database**.
6. In the **Region** drop-down list, choose the region that is closest to you.<br>
This setting specifies which data center your VM will run in. 
7. Click the arrow that points to the right at the bottom of the box.<br>
![Create a New Web Site step of New Web Site - Custom Create wizard][Image014]<br>
The wizard advances to the **Database Settings** step.
8. In the **Name** box, enter a name for your database.
9. In the **Server** box, select **New SQL Database server**.
9. Click the arrow that points to the right at the bottom of the box.<br>
![Database Settings step of New Web Site - Custom Create wizard][Image015]<br>
The wizard advances to the **Create a Server** step.
9. Enter an administrator name and password.<br>
You aren't entering an existing name and password here. You're entering s a new name and password that you're defining now to use later when you access the database.
9. In the **Region** box, choose the same region that you chose for the web site (unless the same region is not offered). Keeping the web server and the database server in the same region gives you the best performance. 
9. Select **Allow Windows Azure Services to access the server**.<br>
This creates a firewall rule that allows your Windows Azure Web Site to access this database.
9. Click the check mark at the bottom of the box to indicate you're finished.<br>
![Create a Server step of New Web Site - Custom Create wizard][Image016]<br>
The Management Portal returns to the Web Sites page and the **Status** column shows that the site is being created. After a while (typically less than a minute) the **Status** column shows that the site was successfully created. In the navigation bar at the left, the number of sites you have in your account appears in the **Web Sites** icon, and the number of databases appears in the **SQL Databases** icon.<br>
![Web Sites page of Management Portal, web site created][Image018]<br>

## Create an ASP.NET MVC 4 application

You have created a Windows Azure Web Site, but there is no content in it yet. Your next step is to create the Visual Studio web application project that you'll publish to Windows Azure.

### Create the project

1. Start Visual Studio 2012 or Visual Studio 2012 for Web Express.
2. From the **File** menu select **New Project**.<br>
![New Project in File menu][Image020]
3. In the **New Project** dialog box, expand **C#** and select **Web** under **Installed Templates** and then select **ASP.NET MVC 4 Web Application**. 
3. Change the **.NET Framework** drop-down list from **.NET Framework 4.5** to **.NET Framework 4**. (As this tutorial is being written, Windows Azure Web Sites do not support ASP.NET 4.5.)
4. Name the application **ToDoListApp** and click **OK**.<br>
![New Project dialog box][Image021]
5. In the **New ASP.NET MVC 4 Project** dialog box, select the **Internet Application** template.
6. From the **View Engine** drop-down list select **Razor**, and then click **OK**.<br>
![New ASP.NET MVC 4 Project dialog box][Image022]

### Set the page header and footer

1. In **Solution Explorer**, expand the Views&nbsp;>&nbsp;Shared folder and open the &#95;Layout.cshtml file.<br>
![_Layout.cshtml in Solution Explorer][Image023]
2. In the **&lt;title&gt;** element, change "My ASP.NET MVC Application" to "To Do List".
3. In the **&lt;header&gt;** element, change "your logo here." to "To Do List".<br>
![title and header in _Layout.cshtml][Image024]
4. In the **&lt;footer&gt;** element, change "My ASP.NET MVC Application" to "To Do List".<br>
![footer in _Layout.cshtml][Image025]

### Run the application locally

1. Press CTRL+F5 to run the application.
The application home page appears in the default browser.<br>
![To Do List home page][Image026]

This is all you need to do for now to create the application that you'll deploy to Windows Azure. Later you'll add database functionality.

## Deploy the application to Windows Azure

1. In your browser, open the Windows Azure Management Portal.
2. In the **Web Sites** tab, click the name of the site you created earlier.<br>
![todolistapp in Management Portal Web Sites tab][Image030]
1. Select the **Quickstart** tab and then click **Download publishing profile**.<br>
![Quickstart tab and Download Publishing Profile button][Image031]<br>
This step downloads a file that contains all of the settings that you need to deploy an application to your Web Site. You'll import this file into Visual Studio so you don't have to enter this information manually.
1. Save the .publishsettings file in a folder that you can access from Visual Studio.<br>
![saving the .publishsettings file][Image032]
1. In Visual Studio, right-click the project in **Solution Explorer** and select **Publish** from the context menu.<br>
![Publish in project context menu][Image033]<br>
The **Publish Web** wizard opens.
1. In the **Profile** tab of the **Publish Web** wizard, click **Import**.<br>
![Import button in Publish Web wizard][Image034]
1. Select the .publishsettings file you downloaded earlier, and then click **Open**.<br>
![Import Publish Settings dialog box][Image035]
1. In the **Connection** tab, click **Validate Connection** to make sure that the settings are correct.<br>
![Connection tab of Publish Web wizard][Image036]
1. When the Certificate Error dialog box appears, make sure that the server name is correct and then select **Save this certificate for future sessions of Visual Studio** and click **Accept**.<br>
![Certificate Error dialog box][Image037]<br>
When the connection has been validated, a green check mark is shown next to the **Validate Connection** button.
1. Click **Next**.<br>
![connection successful icon and Next button in Connection tab][Image038]
1. In the **Settings** tab, click **Next**.<br>
You can accept all of the default settings on this page.  You are deploying a Release build configuration and you don't need to delete files at the destination server. The **DefaultConnection** entry under **Databases** is for the ASP.NET membership (log on) functionality built into the default MVC 4 project template. You aren't using that membership functionality for this tutorial, so you don't need to enter any settings for **DefaultConnection**.<br>  
![Settings tab of the Publish Web wizard][Image039]
1. In the **Preview** tab, click **Start Preview**.<br>
The tab displays a list of the files that will be copied to the server. Displaying the preview isn't required to publish the application but is a useful function to be aware of. In this case, you don't need to do anything with the list of files that is displayed.<br> 
![StartPreview button in the Preview tab][Image040]<br>
1. Click **Publish**.<br>
Visual Studio begins the process of copying the files to the Windows Azure server.<br>
![Publish button in the Preview tab][Image041]
1. The **Output** window shows what deployment actions were taken and reports successful completion of the deployment.<br>
![Output window reporting successful deployment][Image043]
1. The default browser automatically opens to the URL of the deployed site.<br>
The application you created is now running in the cloud.<br>
![To Do List home page running in Windows Azure][Image042]<br>

## Add a database to the application

Next, you'll update the MVC application to add the ability to display and update to-do-list items and store the data in a database. The application will use the Entity Framework to create the database and to read and update data in the database.

### Add data model classes for the to-do list

You'll begin by creating a simple data model in code.

1. In **Solution Explorer**, right-click the Models folder, click **Add**, and then **Class**.<br>
![Add Class in Models folder context menu][Image052]
2. In the **Add New Item** dialog box, name the new class file ToDoItem.cs, and then click **Add**.<br>
![Add New Item dialog box][Image053]
3. Replace the contents of the ToDoItem.cs file with the following code.<pre class="prettyprint">
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
}</pre>
The **ToDoItem** class defines the data that you want to store for each to-do list item, plus a primary key that is needed by the database.
2. Add another class file named ToDoDb.cs and replace the contents of the file with the following code.<pre class="prettyprint">
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
namespace ToDoListApp.Models
{
    public class ToDoDb : DbContext
    {
        public DbSet&lt;ToDoItem&gt; ToDoItems { get; set; }
    }
}</pre>
The **ToDoDb** class lets the Entity Framework know that you want to use **ToDoItem** objects as entities in an entity set.  An entity set in the Entity Framework corresponds to a table in a database. This is all the information the Entity Framework needs to create the database for you.

### Enable Migrations and create the database

The next task is to enable the Code First Migrations feature in order to create the database based on the data model you created.

5. In the **Tools** menu, select **Library Package Manager** and then **Package Manager Console**.<br>
![Package Manager Console in Tools menu][Image047]
6. In the **Package Manager Console** window, enter the following commands:<br>
enable-migrations<br>
add-migration Initial<br>
update-database<br>
![Package Manager Console commands][Image051]

The **enable-migrations** command creates a Migrations folder and a **Configuration** class that the Entity Framework uses to control database updates.<br>
The **add-migration Initial** command generates a class named **Initial** that creates the database. You can see the new class files in **Solution Explorer**.<br>
![Migrations folder in Solution Explorer][Image051a]<br>
In the **Initial** class, the **Up** method creates the ToDoItems table, and the **Down** method (used when you want to return to the previous state) drops it:<br>
<pre class="prettyprint">public partial class Initial : DbMigration
{
    public override void Up()
    {
        CreateTable(
            "ToDoItems",
            c => new
                {
                    ToDoItemId = c.Int(nullable: false, identity: true),
                    Name = c.String(),
                    IsComplete = c.Boolean(nullable: false),
                })
            .PrimaryKey(t => t.ToDoItemId);
    }
    public override void Down()
    {
        DropTable("ToDoItems");
    }
}</pre>
Finally, **update-database** runs this first migration which creates the database. By default, the database is created as a SQL Server Express LocalDB database. (Unless you have SQL Server Express installed, in which case the database is created using the SQL Server Express instance.)

### Create web pages that enable app users to work with to-do list items

In ASP.NET MVC the scaffolding feature can automatically generate code that performs CRUD (create, read, update, delete) actions.

1. In Visual Studio, build the project. For example, you can press CTRL+Shift+B.<br>
Visual Studio compiles the data model classes that you created and makes them available for MVC scaffolding.
2. In **Solution Explorer**, right-click Controllers and click **Add**, and then click **Controller**.<br>
![Add Controller in Controllers folder context menu][Image054]
3. In the **Add Controller** dialog box, enter "HomeController" as your controller name, and select the **Controller with read/write actions and views, using Entity Framework** template.
4. Select **ToDoItem** as your model class and **ToDoDb** as your data context class, and then click **Add**.<br>
![Add Controller dialog box][Image055]
4. In the dialog box that indicates HomeController.cs already exists, select both **Overwrite HomeController.cs** and **Overwrite associated views** and click **OK**.<br>
The MVC template created a default home page for your application, and you are replacing the default functionality with the to-do list CRUD functionality.
![Add Controller message box][Image056] <br>
Visual Studio creates a controller and views for each of the four main database operations (create, read, update, delete) for **ToDoItem** objects.

### Run the application locally

1. Press CTRL+F5 to run the application.<br>
![Index page][Image057] 
2. Click **Create New** and enter a to-do list item.<br>
![Create page][Image058]
3. Click **Create**. The app returns to the home page and displays the item you entered.<br>
![Index page with to-do list items][Image059] 

## Publish the application update to Windows Azure and SQL Database

To publish the application, you repeat the procedure you followed earlier, adding a step to configure database deployment.

1. In **Solution Explorer**, right click the project and select **Publish**.
2. In the **Publish Web** wizard, select the **Profile** tab.
3. Click **Import**.
4. Select the same .publishsettings file that you selected earlier.
You're importing the .publishsettings file again because it has the SQL Database connection string you need for configuring database publishing.
5. Click the **Settings** tab.
6. In the connection string box for the **ToDoDb** database, select the SQL Database connection string that was provided in the .publishsettings file.<br>
7. Select **Apply Code First migrations (runs on application start)**.<br>
![Settings tab of Publish Web wizard][Image060]<br>
(As was noted earlier, the **DefaultConnection** database is for the ASP.NET membership system. You are not using membership functionality in this tutorial, so you aren't configuring this database for deployment.)
8. Click **Publish**.<br>
After the deployment completes, the browser opens to the home page of the application.<br>
![Index page with no to-do list items][Image061]<br>
The Visual Studio publish process automatically configured the connection string in the deployed Web.config file to point to the SQL database. It also configured Code First Migrations to automatically upgrade the database to the latest version the first time the application accesses the database after deployment. The following XML in the Web.config file configures Code First Migrations to use the MigrateDatabaseToLatestVersion initializer:<br><pre class="prettyprint">&lt;entityFramework&gt;
  &lt;defaultConnectionFactory type="System.Data.Entity.Infrastructure.SqlConnectionFactory, EntityFramework" /&gt;
  &lt;contexts&gt;
    &lt;context type="ToDoListApp.Models.ToDoDb, ToDoListApp"&gt;
      &lt;databaseInitializer type="System.Data.Entity.MigrateDatabaseToLatestVersion`2[[ToDoListApp.Models.ToDoDb, ToDoListApp], [ToDoListApp.Migrations.Configuration, ToDoListApp]], EntityFramework, PublicKeyToken=b77a5c561934e089"&gt;
        &lt;parameters&gt;
          &lt;parameter value="ToDoDb_DatabasePublish"/&gt;
        &lt;/parameters&gt;
      &lt;/databaseInitializer&gt;
    &lt;/context&gt;
  &lt;/contexts&gt;
&lt;/entityFramework&gt;</pre>
As a result of this setting, Code First created the database by running the code in the **Initial** class that you created earlier. It did this the first time the application tried to access the database after deployment. 
9. Enter a to-do list item as you did when you ran the app locally, to verify that database deployment succeeded.
When you see that the item you enter is saved and appears on the Index page, you know that it has been stored in the database.<br>
![Index page with to-do list items][Image063]
 
The application is now running in the cloud, using SQL Database to store its data.

## Important Information about ASP.NET in Windows Azure Web Sites

Here are some things to be aware of when you plan and develop an ASP.NET application for Windows Azure Web Sites:

* The application must target ASP.NET 4.0 or earlier (not ASP.NET 4.5).
* The application will run in Integrated mode (not Classic mode).
* The application should not use Windows Authentication, because the Windows identity that the application runs under might change across process recycles.
* The application will run in Full Trust (not Medium Trust).
* The application must use the ASP.NET Universal Providers (the [System.Web.Providers][UniversalProviders] NuGet package) for provider-based features such as membership, profile, role manager, and session state.
* If the applications writes to files, the files should be located in the application's content folder or one of its subfolders.

## Next Steps

You've seen how to deploy a web application to a Windows Azure Web Site. To learn more about how to configure, manage, and scale Windows Azure Web Sites, see the how-to topics on the [Common Tasks][CommonTasks] page.

To learn how to deploy an application to a Windows Azure Cloud App, see the following tutorials:

* [The Cloud App version of this tutorial][NetAppWithSqlAzure]
* [.NET Multi-Tier Application Using Service Bus Queues][MultiTierApp]
* [.NET On-Premises/Cloud Hybrid Application Using Service Bus Relay][HybridApp]

Another way to store data in a Windows Azure application is to use Windows Azure Storage Services, which provides non-relational data storage in the form of blobs and tables. The to-do list application could have been designed to use Windows Azure Storage instead of SQL Database. For more information about both SQL Azure and Windows Azure Storage, see [Data Storage Offerings on the Windows Azure Platform][WindowsAzureDataStorageOfferings].

To learn more about how to use SQL Azure, see the following resources:

* [Data Migration to SQL Azure: Tools and Techniques][SQLAzureDataMigration]
* [Migrating a Database to SQL Azure using SSDT][SQLAzureDataMigrationBlog]
* [General Guidelines and Limitations (SQL Database)][SQLAzureGuidelines]
* [SQL Database How-to Guide][SQLAzureHowTo]
* [Transact-SQL Reference (SQL Database)][TSQLReference]
* [Minimizing Connection Pool errors in SQL Database][SQLAzureConnPoolErrors]

You might want to use the ASP.NET membership system in Windows Azure. For information about how to use either Windows Azure Storage or SQL Database for the membership database, see [Real World: ASP.NET Forms-Based Authentication Models for Windows Azure][ASP.NETFormsAuth].

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
[CommonTasks]: http://windowsazure.com/
[TSQLReference]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336281.aspx
[SQLAzureGuidelines]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336245.aspx
[SQLAzureDataMigrationBlog]: http://blogs.msdn.com/b/ssdt/archive/2012/04/19/migrating-a-database-to-sql-azure-using-ssdt.aspx
[SQLAzureConnPoolErrors]: http://blogs.msdn.com/b/adonet/archive/2011/11/05/minimizing-connection-pool-errors-in-sql-azure.aspx
[UniversalProviders]: http://nuget.org/packages/System.Web.Providers


[Image001]: ../Media/Dev-net-getting-started-001.png
[Image002]: ../Media/Dev-net-getting-started-002.png
[Image003]: ../Media/Dev-net-getting-started-003.png
[Image004]: ../Media/Dev-net-getting-started-004.png
[Image010]: ../Media/Dev-net-getting-started-010.png
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
[Image070]: ../Media/Dev-net-getting-started-070.png
[Image071]: ../Media/Dev-net-getting-started-071.png
[Image072]: ../Media/Dev-net-getting-started-072.png
[Image073]: ../Media/Dev-net-getting-started-073.png
