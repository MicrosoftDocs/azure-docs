# .NET Web Application with SQL Azure

<span>Developing for Windows Azure is easy using Visual Studio 2010 and
the free Windows Azure SDK for .NET. If you do not already have Visual
Studio 2010, the SDK will automatically install Visual Web Developer
2010 Express, so you can start developing for Windows Azure entirely for
free. This guide assumes you have no prior experience using Windows
Azure. On completing this guide, you will have an application that uses
multiple Windows Azure resources up and running in the cloud.</span>

You will build a to-do list web application that runs in Windows Azure
and stores its data in SQL Azure. The application is hosted in an
instance of a Web role that, when running in the cloud, is itself hosted
in a dedicated virtual machine (VM). A screenshot of the completed
application is below:

![][0]

## OBJECTIVES

In this tutorial you will learn how to:

-   Enable your machine for Windows Azure development with a single
    download and install
-   Create and modify a Visual Studio ASP.NET MVC 3 project so it can
    run on Windows Azure
-   Use a SQL Azure database to store data in the cloud
-   Deploy and update your application to Windows Azure

## TUTORIAL SEGMENTS

1.  [Setting Up the Development Environment][]
2.  [Creating an ASP.NET MVC 3 Application][]
3.  [Making your Application Ready to Deploy to Windows Azure][]
4.  [Deploying your Application to Windows Azure][]
5.  [Adding SQL Database Support][]
6.  [Running your Application in the Cloud][]
7.  [Stopping and Deleting your Application][]
8.  [Summary and Next Steps][]

## <a name="setup"></a>SETTING UP THE DEVELOPMENT ENVIRONMENT

Before you can begin developing your Windows Azure application, you need
to get the tools and set-up your development environment.

1.  To install the Windows Azure SDK for .NET, click the button below:

    [Get Tools and SDK][]

    When prompted to run or save WindowsAzureSDKForNet.exe, click Run:

    ![][1]

2.  Click on Install in the installer window and proceed with the
    installation:

    ![][2]

3.  Once the installation is complete, you will have everything
    necessary to start developing. The SDK includes tools that let you
    easily develop Windows Azure applications in Visual Studio. If you
    do not have Visual Studio installed, it also installs the free
    Visual Web Developer Express.

## <a name="creating"></a>CREATING AN ASP.NET MVC 3 APPLICATION

### CREATING THE PROJECT

1.  Use administrator privileges launch either Microsoft Visual Studio
    2010 or Microsoft Visual Web Developer Express 2010. To launch
    Visual Studio with administrator privileges, right-click Microsoft
    Visual Studio 2010 (or Microsoft Visual Web Developer Express 2010)
    and then click Run as administrator. The Windows Azure compute
    emulator, discussed later in this guide, requires that Visual Studio
    be launched with administrator privileges.

    In Visual Studio, on the File menu, click New, and then click
    Project.

    ![][3]

2.  From Installed Templates, under Visual C#, click Web and then click
    ASP.NET MVC 3 Web Application.
3.  Name the application **ToDoListApp** and click OK:

    ![][4]

4.  In the New ASP.NET MVC 3 Project dialog, select the Internet
    Application template and the Razor view engine. Click OK.

### MODIFY UI TEXT WITHIN YOUR APPLICATION

1.  In Solution Explorer, under Views\Shared open the _Layout.cshtml
    file.

    ![][5]

2.  Within the body tag, find the title of the page enclosed in h1 tags.
    Change the title text from **My MVC Application** to **To Do List**.
    Here is where you type this in:

    ![][6]

### RUN YOUR APPLICATION LOCALLY

Run the application to verify that it works.

1.  Within Visual Studio, press F5.

2.  Your application should appear running in a browser:

    ![][7]

## <a name="making"></a>MAKING YOUR APPLICATION READY TO DEPLOY TO WINDOWS AZURE

Now, you will prepare your application to run in a Windows Azure hosted
service. Your application needs to include a Windows Azure deployment
project before it can be deployed to the cloud. The deployment project
contains configuration information that is needed to properly run your
application in the cloud.

1.  To make your app deployable to the cloud, right click on the
    ToDoListApp project in Solution Explorer and click Add Windows Azure
    Deployment Project:

    ![][8]

2.  <span>To enable the built-in membership provider you must use the
    ASP.NET Universal Providers. This provider enables the account
    management capabilities in your application. In Solution Explorer,
    right click on ToDoListApp and then click **Manage NuGet
    Packages...** (or **Add Library Package Reference...** in older
    versions of NuGet):</span>

    ![][9]

3.  <span>In the **ToDoListApp – Manage NuGet Packages** dialog, in the
    top right corner within the **Search Online** field, write
    **"universal providers"**:</span>

    ![][10]

4.  <span>Select the **"ASP.NET Universal Providers"** and click
    **Install**. Close the **ToDoListApp – Manage NuGet Packages**
    dialog after installation is complete.</span>

5.  In Solution Explorer, open the Web.config file in the root directory
    of the ToDoListApp project.

6.  Under the &lt;configuration> / &lt;connectionStrings> section replace
    the DefaultConnection connection stringas shown below.

        <add name="DefaultConnection" connectionString="Data Source=.\SQLEXPRESS;Initial Catalog=aspnet_ToDoListApp;Integrated Security=True;MultipleActiveResultSets=True"
        providerName="System.Data.SqlClient" />

7.  To test your application, press F5.

8.  This will start the Windows Azure compute emulator. The compute
    emulator uses the local computer to emulate your application running
    in Windows Azure. You can confirm the emulator has started by
    looking at the system tray:

    ![][11]

9.  A browser will still display your application running locally, and
    it will look and function the same way it did when you ran it
    earlier as a regular ASP.NET MVC 3 application.

    ![][12]

## <a name="deploying"></a>DEPLOYING YOUR APPLICATION TO WINDOWS AZURE

You can deploy your application to Windows Azure either through the
portal or directly from within Visual Studio. This guide shows you how
to deploy your application from within Visual Studio.

In order to deploy your application to Windows Azure, you need an
account. If you do not have one you can create a free trial account.
Once you are logged in with your account, you can download a Windows
Azure publishing profile. The publishing profile will authorize your
machine to publish packages to Windows Azure using Visual Studio.

### CREATING A WINDOWS AZURE ACCOUNT

1.  Open a web browser, and browse to [http://www.windowsazure.com][].

    To get started with a free account, click **free trial**in the upper
    right corner and follow the steps.

    ![][13]

2.  Your account is now created. You are ready to deploy your
    application to Windows Azure!

### PUBLISHING THE APPLICATION

1.  Right click on the ToDoListApp project in Solution Explorer and
    click Publish to Windows Azure.

    ![][14]

2.  The first time you publish, you will first have to download
    credentials via the provided link.

    1.  Click **Sign in to download credentials**:

        ![][15]

    2.  Sign-in using your Live ID:

        ![][16]

    3.  Save the publish profile file to a location on your hard drive
        where you can retrieve it:

        ![][17]

    4.  Within the publish dialog, click on Import Profile:

        ![][18]

    5.  Browse for and select the file that you just downloaded, then
        click Next.

    6.  Pick the Windows Azure subscription you would like to publish
        to:

        ![][19]

    7.  If your subscription doesn’t already contain any hosted
        services, you will be asked to create one. The hosted service
        acts as a container for your application within your Windows
        Azure subscription. Enter a name that identifies your
        application and choose the region for which the application
        should be optimized. (You can expect faster loading times for
        users accessing it from this region.)

        ![][20]

    8.  Select the hosted service you would like to publish your
        application to. Keep the defaults as shown below for the
        remaining settings. Click Next:

        ![][21]

    9.  On the last page, click Publish to start the deployment process:

        ![][22]

        This will take approximately 5-7 minutes. Since this is the
        first time you are publishing, Windows Azure provisions a
        virtual machine (VM), performs security hardening, creates a Web
        role on the VM to host your application, deploys your code to
        that Web role, and finally configures the load balancer and
        networking so you application is available to the public.

    10. While publishing is in progress you will be able to monitor the
        activity in the Windows Azure Activity Log window, which is
        typically docked to the bottom of Visual Studio or Visual Web
        Developer:

        ![][23]

    11. When deployment is complete, you can view your website by
        clicking the Website URL link in the monitoring window:

        ![][24] ![][25]

## <a name="adding"></a>ADDING SQL DATABASE SUPPORT

The Windows Azure platform offers two primary storage options:

-   Windows Azure Storage Services provide non-relational data storage
    in the form of blobs and tables. It is fault-tolerant, highly
    available, and will scale automatically to provide practically
    unlimited storage.

-   SQL Azure provides a cloud-based relational database service that is
    built on SQL Server technologies. It is also fault-tolerant and
    highly available. It is designed so the tools and applications that
    work with SQL Server also work with SQL Azure. A SQL Azure database
    can be up to 100GB in size, and you can create any number of
    databases.

This guide uses a SQL Azure database to store data, however the
application could also be constructed using Windows Azure Storage. For
more information about SQL Azure and Windows Azure Storage, see [Data
Storage Offerings on the Windows Azure Platform.][]

### CREATING CLASSES FOR THE DATA MODEL

You will use the Entity Framework Code First feature to create and
set-up a database schema for your application. Code First lets you write
standard classes that the Entity Framework will use to create your
database and tables automatically.

1.  In Solution Explorer, right click on Models and click Add and then
    Class.

2.  In the Add New Item dialog, in the Name field type ToDoModels.cs,
    and then click Add.

3.  Replace the contents of the ToDoModels.cs file with the code below.
    This code defines the structure of your ToDoItem class, which will
    be mapped to a database table. It also creates a database context
    class that will allow you to perform operations on the ToDoItem
    class.

        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Web;
        using System.Data.Entity;
        namespace ToDoListApp.Models
        {
            public class ToDoItem
            {
                public int ToDoItemId { get; set; }
                public string Name { get; set; }
                public bool IsComplete { get; set; }
            }

            public class ToDoDb : DbContext
            {
                public DbSet<ToDoItem> ToDoItemEntries { get; set; }
            }
        }

    That’s all the Entity Framework needs to create your database and a
    table called ToDoItem.

4.  In Solution Explorer, right click on ToDoListApp and select Build to
    build your project.

### CREATING SCAFFOLDING TO CREATE/READ/UDPDATE/DELETE TO DO ITEMS

ASP.NET MVC makes it easy to build an application that performs the main
database access operations. The scaffolding feature will generate code
that uses the model and data context you created earlier to perform CRUD
(create, read, update, delete) actions.

1.  In Solution Explorer, right-click on Controllers and click Add and
    then click Controller.

    ![][26]

2.  In the Add Controller window, enter HomeController as your
    Controller name, and select the Controller with read/write actions
    and views, using Entity Framework template. Scaffolding will also
    write code that uses a model and a data context. Select ToDoItem as
    your model class and ToDoDb as your data context class, as shown in
    the screenshot below:

    ![][27]

3.  Click Add.

4.  You will see a message indicating that HomeController.cs already
    exists. Select both the Overwrite HomeController.cs and Overwrite
    associated views checkboxes and click OK.

5.  This will create a controller and views for each of the four main
    database operations (create, read, update, delete) for ToDoItem
    objects.

6.  In Solution Explorer, open the Web.config file in the root directory
    of the ToDoListApp project.

7.  Under the &lt;configuration> / &lt;connectionStrings> section add the
    **ToDoDb connection** string as shown below.

        <add name="ToDoDb" connectionString="data source=.\SQLEXPRESS;Integrated Security=SSPI;Initial Catalog=ToDoDb;User Instance=true;MultipleActiveResultSets=True" providerName="System.Data.SqlClient" />

8.  To test your application at this stage, press F5 in Visual Studio to
    run the application in the compute emulator. When your application
    first runs, a database will be created in your local SQL Server
    Express instance, which was installed as part of the Windows Azure
    SDK.

    ![][28]

9.  Clicking the Create New link on the web page that is displayed in
    the browser will create new entries in the database.

### SET-UP SQL AZURE

1.  The next step is to configure your application to store data in the
    cloud. First, you must create a SQL Azure server. Login to the
    Windows Azure Platform Management Portal, http://windows.azure.com,
    and click on Database:

    ![][29]

2.  On the top of the left pane, click the subscription associated with
    your SQL Azure account:

    ![][30]

3.  From the top menu, click Create.

4.  In Create Server, select the region for which you want database
    access to be optimized, and then click Next:

    ![][31]

    IMPORTANT: Pick the same region that you choose earlier when
    deploying your application. This will give you the best performance.

5.  Choose an administrator username and password.

    **Note:** These are the credentials for your administrative account
    and give you full access to all databases on the server.

6.  Click Next.

7.  The next dialog will prompt you to create firewall rules for the
    server. Firewall rules identify specific IP addresses or ranges of
    IP addresses that are able to communicate directly with your SQL
    Azure server. Add a new rule by clicking Add. In the Add Firewall
    Rule dialog, enter the values shown in the table below. This will
    enable your local application to communicate with SQL Azure, but
    will block other IP addresses from communicating directly with your
    server.

    <table border="2" cellspacing="0" cellpadding="5" style="border: #000000 2px solid;">
    <tbody>
    <tr>
    <th>
    Name

    </th>
    <th>
    Value

    </th>
    </tr>
    <tr>
    <td>
    Rule name

    </td>
    <td>
    local development environment

    </td>
    </tr>
    <tr>
    <td>
    IP range start

    </td>
    <td>
    (Type the IP address of the computer you are using. The IP address
    is listed at the bottom of the dialog.)

    </td>
    </tr>
    <tr>
    <td>
    IP range end

    </td>
    <td>
    (Type the IP address of the computer you are using.)

    </td>
    </tr>
    </tbody>
    </table>
8.  Click OK.

9.  Select the Allow other Windows Azure services to access this server
    check box, Note: SQL Azure has two types of access control: firewall
    and SQL authentication. You must configure the SQL Azure firewall
    settings to allow connections from your computer(s).

10. **Important:** In addition to configuring the SQL Azure server-side
    firewall, you must also configure your client-side environment to
    allow outbound TCP connections over TCP port 1433. For more
    information, see [Security Guidelines for SQL Azure][].

    ![][32]

11. Click Finish.

12. You will now see an entry for your new server in the left menu. The
    fully qualified domain name of the server uses the following format:

    &lt;ServerName>.database.windows.net

    Where &lt;ServerName> identifies the server. Write down the server
    name; you will need it later in the tutorial.

You can use either SQL Server Management Studio or Windows Azure
Platform Management Portal to manage your SQL Azure database. To connect
to SQL Azure from SQL Server Management Studio, you must provide the
fully qualified domain name of the server:
&lt;ServerName>.database.windows.net.

### SET-UP YOUR APPLICATION TO USE THE DATABASE

Often times, you want to use a different database locally that you use
in production. Visual Studio makes this easy. You can have your
Web.config vary between your development machine and cloud deployment by
creating a transform in Web.Release.config. In this guide, you will edit
the Web.Release.config to use SQL Azure instead of your local SQL Server
when deployed to the cloud:

1.  Back in Visual Studio or Visual Web Developer, in Solution Explorer,
    open the Web.Release.config file located under Web.config in the
    root directory of the ToDoListApp project.

    ![][33]

2.  Under the &lt;configuration> / &lt;connectionStrings> section replace
    all items as shown below. Substitute the &lt;serverName> placeholder
    with the name of the server you created. For &lt;user> and
    &lt;password>, enter the administrative user and password you created
    earlier.

        <connectionStrings>
          <add name="ToDoDb" connectionString="data source=<serverName>.database.windows.net;Initial Catalog=ToDoDb;User ID=<user>@<serverName>;Password=<password>;Encrypt=true;Trusted_Connection=false;MultipleActiveResultSets=True" providerName="System.Data.SqlClient" xdt:Transform="SetAttributes" xdt:Locator="Match(name)" />
          <add name="DefaultConnection" connectionString="data source=<serverName>.database.windows.net;Initial Catalog=ToDoDb;User ID=<user>@<serverName>;Password=<password>;Encrypt=true;Trusted_Connection=false;MultipleActiveResultSets=True" providerName="System.Data.SqlClient" xdt:Transform="SetAttributes" xdt:Locator="Match(name)" />
        </connectionStrings>

    **Note:** The administrative user has access to all the databases on
    the server. To create a SQL Azure user with more restricted
    pemissions, follow the steps in [Adding Users to Your SQL Azure
    Database][]. Then, modify the above connection string to use the
    newly created user and password instead of the administrative user
    and password.

## <a name="running"></a>RUNNING YOUR APPLICATION IN THE CLOUD

Now, for the final step, you will test your app both living in the
Windows Azure cloud and accessing the SQL Azure cloud database. You will
redeploy your application to Windows Azure:

1.  Confirm that the correct publishing profile is still selected and
    click Publish. In particular, ensure that the Build Configuration is
    set to Release, so you pick up the SQL Azure connection string from
    the Web.Release.Config that you edited earlier.

    ![][34]

    Clicking Publish will perform an in-place update, so this will
    complete faster than your initial deployment.

2.  When deployment completes, open the URL of your app from the
    deployment monitor

    ![][35]

3.  Check that your application functions as expected:

    ![][36] ![][37]

4.  The application is now fully running in the cloud. It uses SQL Azure
    to store its data, and it is running on one small web role instance.
    One of the benefits the cloud provides over running this application
    under standard web hosting is the ability to dynamically scale the
    number of instances as demand changes. This scaling will require no
    changes to the application itself. Moreover, updates can be deployed
    without service interruptions as Azure ensures there is always a
    role instance handling user requests while another one is being
    updated.

## <a name="stopingp"></a>STOPPING AND DELETING YOUR APPLICATION

After deploying your application, you may want to disable it so you can
build and deploy other applications within the free 750 hours/month (31
days/month) of server time.

Windows Azure bills web role instances per hour of server time consumed.
Server time is consumed once your application is deployed, even if the
instances are not running and are in the stopped state. A free account
includes 750 hours/month (31 days/month) of dedicated virtual machine
server time for hosting these web role instances.

The following steps show you how to stop and delete your application.

1.  Login to the Windows Azure Platform Management Portal,
    http://windows.azure.com, and click on Hosted Sevices, Storage
    Accounts & CDN, then Hosted Services:

    ![][38]

2.  Click on Stop to temporarily suspend your application. You will be
    able to start it again just by clicking on Start. Click on Delete to
    completely remove your application from Windows Azure with no
    ability to restore it.

    ![][39]

## <a name="summary"></a>SUMMARY AND NEXT STEPS

In this tutorial you learned how to create and deploy a web application
that is hosted on Windows Azure and stores data in SQL Azure.

### NEXT STEPS

-   Review the [SQL Azure How-to Guide][] to learn more about using SQL
    Azure.
-   Complete the [Multi-tier Application Tutorial][] to further your
    knowledge about Windows Azure by creating a website that leverages a
    background worker role to process data.

  [0]: /media/net/dev-net-getting-started-1.png
  [Setting Up the Development Environment]: #setup
  [Creating an ASP.NET MVC 3 Application]: #creating
  [Making your Application Ready to Deploy to Windows Azure]: #making
  [Deploying your Application to Windows Azure]: #deploying
  [Adding SQL Database Support]: #adding
  [Running your Application in the Cloud]: #running
  [Stopping and Deleting your Application]: #stopping
  [Summary and Next Steps]: #summary
  [Get Tools and SDK]: http://go.microsoft.com/fwlink/?LinkID=234939
  [1]: /media/net/dev-net-getting-started-3.png
  [2]: /media/net/dev-net-getting-started-4.png
  [3]: /media/net/dev-net-getting-started-5.png
  [4]: /media/net/dev-net-getting-started-6.png
  [5]: /media/net/dev-net-getting-started-7.png
  [6]: /media/net/dev-net-getting-started-8.png
  [7]: /media/net/dev-net-getting-started-9.png
  [8]: /media/net/dev-net-getting-started-10.png
  [9]: /media/net/dev-net-getting-started-27-1.png
  [10]: /media/net/dev-net-getting-started-27-2.png
  [11]: /media/net/dev-net-getting-started-10a.png
  [12]: /media/net/dev-net-getting-started-11.png
  [http://www.windowsazure.com]: http://www.windowsazure.com
  [13]: /media/net/dev-net-getting-started-12.png
  [14]: /media/net/dev-net-getting-started-13.png
  [15]: /media/net/dev-net-getting-started-14.png
  [16]: /media/net/dev-net-getting-started-15.png
  [17]: /media/net/dev-net-getting-started-16.png
  [18]: /media/net/dev-net-getting-started-17.png
  [19]: /media/net/dev-net-getting-started-18.png
  [20]: /media/net/dev-net-getting-started-19.png
  [21]: /media/net/dev-net-getting-started-20.png
  [22]: /media/net/dev-net-getting-started-21.png
  [23]: /media/net/dev-net-getting-started-23.png
  [24]: /media/net/dev-net-getting-started-24.png
  [25]: /media/net/dev-net-getting-started-25.png
  [Data Storage Offerings on the Windows Azure Platform.]: http://social.technet.microsoft.com/wiki/contents/articles/data-storage-offerings-on-the-windows-azure-platform.aspx
  [26]: /media/net/dev-net-getting-started-26.png
  [27]: /media/net/dev-net-getting-started-27.png
  [28]: /media/net/dev-net-getting-started-28.png
  [29]: /media/net/dev-net-getting-started-29.png
  [30]: /media/net/dev-net-getting-started-30.png
  [31]: /media/net/dev-net-getting-started-31.png
  [Security Guidelines for SQL Azure]: http://social.technet.microsoft.com/wiki/contents/articles/security-guidelines-for-sql-azure.aspx
  [32]: /media/net/dev-net-getting-started-32.png
  [33]: /media/net/dev-net-getting-started-33.png
  [Adding Users to Your SQL Azure Database]: http://blogs.msdn.com/b/sqlazure/archive/2010/06/21/10028038.aspx
  [34]: /media/net/dev-net-getting-started-35.png
  [35]: /media/net/dev-net-getting-started-36.png
  [36]: /media/net/dev-net-getting-started-37.png
  [37]: /media/net/dev-net-getting-started-38.png
  [38]: /media/net/dev-net-getting-started-39.png
  [39]: /media/net/dev-net-getting-started-40.png
  [SQL Azure How-to Guide]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/sql-azure/
  [Multi-tier Application Tutorial]: http://www.windowsazure.com/en-us/develop/net/tutorials/multi-tier-application/
