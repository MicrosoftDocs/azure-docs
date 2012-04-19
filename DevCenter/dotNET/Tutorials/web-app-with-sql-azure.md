<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-net-tutorials-web-app-with-sql-azure" urlDisplayName="Web App with SQL Azure" headerExpose="" pageTitle=".NET Web App with SQL Azure" metaKeywords="Azure hello world tutorial, Azure getting started tutorial, SQL Azure tutorial, Azure .NET hello world tutorial, Azure .NET getting started tutorial, SQL Azure .NET tutorial, Azure C# hello world tutorial, Azure C# getting started tutorial, SQL Azure C# tutorial" footerExpose="" metaDescription="An end-to-end tutorial that helps you develop an ASP.NET MVC 3 application with a SQL Azure back-end and deploy it to Windows Azure." umbracoNaviHide="0" disqusComments="1" />
  <h1>.NET Web Application with SQL Azure</h1>
  <p>
    <span>Developing for Windows Azure is easy using Visual Studio 2010 and the free Windows Azure SDK for .NET. If you do not already have Visual Studio 2010, the SDK will automatically install Visual Web Developer 2010 Express, so you can start developing for Windows Azure entirely for free. This guide assumes you have no prior experience using Windows Azure. On completing this guide, you will have an application that uses multiple Windows Azure resources up and running in the cloud.</span>
  </p>
  <p>You will build a to-do list web application that runs in Windows Azure and stores its data in SQL Azure. The application is hosted in an instance of a Web role that, when running in the cloud, is itself hosted in a dedicated virtual machine (VM). A screenshot of the completed application is below:</p>
  <p>
    <img src="../../../DevCenter/dotNet/Media/getting-started-1.png" />
  </p>
  <h2>OBJECTIVES</h2>
  <p>In this tutorial you will learn how to:</p>
  <ul>
    <li>Enable your machine for Windows Azure development with a single download and install</li>
    <li>Create and modify a Visual Studio ASP.NET MVC 3 project so it can run on Windows Azure</li>
    <li>Use a SQL Azure database to store data in the cloud</li>
    <li>Deploy and update your application to Windows Azure</li>
  </ul>
  <h2>TUTORIAL SEGMENTS</h2>
  <ol>
    <li>
      <a href="#setup">Setting Up the Development Environment</a>
    </li>
    <li>
      <a href="#creating">Creating an ASP.NET MVC 3 Application</a>
    </li>
    <li>
      <a href="#making">Making your Application Ready to Deploy to Windows Azure</a>
    </li>
    <li>
      <a href="#deploying">Deploying your Application to Windows Azure</a>
    </li>
    <li>
      <a href="#adding">Adding SQL Database Support</a>
    </li>
    <li>
      <a href="#running">Running your Application in the Cloud</a>
    </li>
    <li>
      <a href="#stopping">Stopping and Deleting your Application</a>
    </li>
    <li>
      <a href="#summary">Summary and Next Steps</a>
    </li>
  </ol>
  <h2>
    <a name="setup">
    </a>SETTING UP THE DEVELOPMENT ENVIRONMENT</h2>
  <p>Before you can begin developing your Windows Azure application, you need to get the tools and set-up your development environment.</p>
  <ol>
    <li>
      <p>To install the Windows Azure SDK for .NET, click the button below:</p>
      <a href="http://go.microsoft.com/fwlink/?LinkID=234939" class="site-arrowboxcta download-cta">Get Tools and SDK</a>
      <p>When prompted to run or save WindowsAzureSDKForNet.exe, click Run:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-3.png" />
    </li>
    <li>
      <p>Click on Install in the installer window and proceed with the installation:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-4.png" />
    </li>
    <li>
      <p>Once the installation is complete, you will have everything necessary to start developing. The SDK includes tools that let you easily develop Windows Azure applications in Visual Studio. If you do not have Visual Studio installed, it also installs the free Visual Web Developer Express.</p>
    </li>
  </ol>
  <h2>
    <a name="creating">
    </a>CREATING AN ASP.NET MVC 3 APPLICATION</h2>
  <h3>CREATING THE PROJECT</h3>
  <ol>
    <li>
      <p>Use administrator privileges launch either Microsoft Visual Studio 2010 or Microsoft Visual Web Developer Express 2010. To launch Visual Studio with administrator privileges, right-click Microsoft Visual Studio 2010 (or Microsoft Visual Web Developer Express 2010) and then click Run as administrator. The Windows Azure compute emulator, discussed later in this guide, requires that Visual Studio be launched with administrator privileges.</p>
      <p>In Visual Studio, on the File menu, click New, and then click Project.</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-5.png" />
    </li>
    <li>From Installed Templates, under Visual C#, click Web and then click ASP.NET MVC 3 Web Application.</li>
    <li>
      <p>Name the application ToDoListApp and click OK:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-6.png" />
    </li>
    <li>In the New ASP.NET MVC 3 Project dialog, select the Internet Application template and the Razor view engine. Click OK.</li>
  </ol>
  <h3>MODIFY UI TEXT WITHIN YOUR APPLICATION</h3>
  <ol>
    <li>
      <p>In Solution Explorer, under Views\Shared open the _Layout.cshtml file.</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-7.png" />
    </li>
    <li>
      <p>Within the body tag, find the title of the page enclosed in h1 tags. Change the title text from My MVC Application to To Do List. Here is where you type this in:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-8.png" />
    </li>
  </ol>
  <h3>RUN YOUR APPLICATION LOCALLY</h3>
  <p>Run the application to verify that it works.</p>
  <ol>
    <li>
      <p>Within Visual Studio, press F5.</p>
    </li>
    <li>
      <p>Your application should appear running in a browser:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-9.png" />
    </li>
  </ol>
  <h2>
    <a name="making">
    </a>MAKING YOUR APPLICATION READY TO DEPLOY TO WINDOWS AZURE</h2>
  <p>Now, you will prepare your application to run in a Windows Azure hosted service. Your application needs to include a Windows Azure deployment project before it can be deployed to the cloud. The deployment project contains configuration information that is needed to properly run your application in the cloud.</p>
  <ol>
    <li>
      <p>To make your app deployable to the cloud, right click on the ToDoListApp project in Solution Explorer and click Add Windows Azure Deployment Project:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-10.png" />
    </li>
    <li>
      <p>
        <span>To enable the built-in membership provider you must use the ASP.NET Universal Providers. This provider enables the account management capabilities in your application. In Solution Explorer, right click on ToDoListApp and then click <strong>Manage NuGet Packages...</strong> (or <strong>Add Library Package Reference...</strong> in older versions of NuGet):</span>
      </p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-27-1.png" />
    </li>
    <li>
      <p>
        <span>In the <strong>ToDoListApp – Manage NuGet Packages</strong> dialog, in the top right corner within the <strong>Search Online</strong> field, write <strong>"universal providers"</strong>:</span>
      </p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-27-2.png" />
    </li>
    <li>
      <p>
        <span>Select the <strong>"ASP.NET Universal Providers"</strong> and click <strong>Install</strong>. Close the <strong>ToDoListApp – Manage NuGet Packages</strong> dialog after installation is complete.</span>
      </p>
    </li>
    <li>
      <p>In Solution Explorer, open the Web.config file in the root directory of the ToDoListApp project.</p>
    </li>
    <li>
      <p>Under the &lt;configuration&gt; / &lt;connectionStrings&gt; section replace the DefaultConnection connection stringas shown below.</p>
      <pre class="prettyprint">    &lt;add name="DefaultConnection" connectionString="Data Source=.\SQLEXPRESS;Initial Catalog=aspnet_ToDoListApp;Integrated Security=True;MultipleActiveResultSets=True"
      providerName="System.Data.SqlClient" /&gt;
</pre>
    </li>
    <li>
      <p>To test your application, press F5.</p>
    </li>
    <li>
      <p>This will start the Windows Azure compute emulator. The compute emulator uses the local computer to emulate your application running in Windows Azure. You can confirm the emulator has started by looking at the system tray:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-10a.png" />
    </li>
    <li>
      <p>A browser will still display your application running locally, and it will look and function the same way it did when you ran it earlier as a regular ASP.NET MVC 3 application.</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-11.png" />
    </li>
  </ol>
  <h2>
    <a name="deploying">
    </a>DEPLOYING YOUR APPLICATION TO WINDOWS AZURE</h2>
  <p>You can deploy your application to Windows Azure either through the portal or directly from within Visual Studio. This guide shows you how to deploy your application from within Visual Studio.</p>
  <p>In order to deploy your application to Windows Azure, you need an account. If you do not have one you can create a free trial account. Once you are logged in with your account, you can download a Windows Azure publishing profile. The publishing profile will authorize your machine to publish packages to Windows Azure using Visual Studio.</p>
  <h3>CREATING A WINDOWS AZURE ACCOUNT</h3>
  <ol>
    <li>
      <p>Open a web browser, and browse to <a href="http://www.windowsazure.com">http://www.windowsazure.com</a>.</p>
      <p>To get started with a free account, click <strong>free trial </strong>in the upper right corner and follow the steps.</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-12.png" />
    </li>
    <li>
      <p>Your account is now created. You are ready to deploy your application to Windows Azure!</p>
    </li>
  </ol>
  <h3>PUBLISHING THE APPLICATION</h3>
  <ol>
    <li>
      <p>Right click on the ToDoListApp project in Solution Explorer and click Publish to Windows Azure.</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-13.png" />
    </li>
    <li>
      <p>The first time you publish, you will first have to download credentials via the provided link.</p>
      <ol>
        <li>
          <p>Click <strong>Sign in to download credentials</strong>:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-14.png" />
        </li>
        <li>
          <p>Sign-in using your Live ID:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-15.png" />
        </li>
        <li>
          <p>Save the publish profile file to a location on your hard drive where you can retrieve it:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-16.png" />
        </li>
        <li>
          <p>Within the publish dialog, click on Import Profile:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-17.png" />
        </li>
        <li>
          <p>Browse for and select the file that you just downloaded, then click Next.</p>
        </li>
        <li>
          <p>Pick the Windows Azure subscription you would like to publish to:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-18.png" />
        </li>
        <li>
          <p>If your subscription doesn’t already contain any hosted services, you will be asked to create one. The hosted service acts as a container for your application within your Windows Azure subscription. Enter a name that identifies your application and choose the region for which the application should be optimized. (You can expect faster loading times for users accessing it from this region.)</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-19.png" />
        </li>
        <li>
          <p>Select the hosted service you would like to publish your application to. Keep the defaults as shown below for the remaining settings. Click Next:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-20.png" />
        </li>
        <li>
          <p>On the last page, click Publish to start the deployment process:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-21.png" />
          <p>This will take approximately 5-7 minutes. Since this is the first time you are publishing, Windows Azure provisions a virtual machine (VM), performs security hardening, creates a Web role on the VM to host your application, deploys your code to that Web role, and finally configures the load balancer and networking so you application is available to the public.</p>
        </li>
        <li>
          <p>While publishing is in progress you will be able to monitor the activity in the Windows Azure Activity Log window, which is typically docked to the bottom of Visual Studio or Visual Web Developer:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-23.png" />
        </li>
        <li>
          <p>When deployment is complete, you can view your website by clicking the Website URL link in the monitoring window:</p>
          <img src="../../../DevCenter/dotNet/Media/getting-started-24.png" />
          <img src="../../../DevCenter/dotNet/Media/getting-started-25.png" />
        </li>
      </ol>
    </li>
  </ol>
  <h2>
    <a name="adding">
    </a>ADDING SQL DATABASE SUPPORT</h2>
  <p>The Windows Azure platform offers two primary storage options:</p>
  <ul>
    <li>
      <p>Windows Azure Storage Services provide non-relational data storage in the form of blobs and tables. It is fault-tolerant, highly available, and will scale automatically to provide practically unlimited storage.</p>
    </li>
    <li>
      <p>SQL Azure provides a cloud-based relational database service that is built on SQL Server technologies. It is also fault-tolerant and highly available. It is designed so the tools and applications that work with SQL Server also work with SQL Azure. A SQL Azure database can be up to 100GB in size, and you can create any number of databases.</p>
    </li>
  </ul>
  <p>This guide uses a SQL Azure database to store data, however the application could also be constructed using Windows Azure Storage. For more information about SQL Azure and Windows Azure Storage, see <a href="http://social.technet.microsoft.com/wiki/contents/articles/data-storage-offerings-on-the-windows-azure-platform.aspx">Data Storage Offerings on the Windows Azure Platform.</a></p>
  <h3>CREATING CLASSES FOR THE DATA MODEL</h3>
  <p>You will use the Entity Framework Code First feature to create and set-up a database schema for your application. Code First lets you write standard classes that the Entity Framework will use to create your database and tables automatically.</p>
  <ol>
    <li>
      <p>In Solution Explorer, right click on Models and click Add and then Class.</p>
    </li>
    <li>
      <p>In the Add New Item dialog, in the Name field type ToDoModels.cs, and then click Add.</p>
    </li>
    <li>
      <p>Replace the contents of the ToDoModels.cs file with the code below. This code defines the structure of your ToDoItem class, which will be mapped to a database table. It also creates a database context class that will allow you to perform operations on the ToDoItem class.</p>
      <pre class="prettyprint">using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
namespace ToDoListLib.Models
{
    public class ToDoItem
    {
        public int ToDoItemId { get; set; }
        public string Name { get; set; }
        public bool IsComplete { get; set; }
    }

    public class ToDoDb : DbContext
    {
        public DbSet&lt;ToDoItem&gt; ToDoItemEntries { get; set; }
    }
}
</pre>
      <p>That’s all the Entity Framework needs to create your database and a table called ToDoItem.</p>
    </li>
    <li>
      <p>In Solution Explorer, right click on ToDoListApp and select Build to build your project.</p>
    </li>
  </ol>
  <h3>CREATING SCAFFOLDING TO CREATE/READ/UDPDATE/DELETE TO DO ITEMS</h3>
  <p>ASP.NET MVC makes it easy to build an application that performs the main database access operations. The scaffolding feature will generate code that uses the model and data context you created earlier to perform CRUD (create, read, update, delete) actions.</p>
  <ol>
    <li>
      <p>In Solution Explorer, right-click on Controllers and click Add and then click Controller.</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-26.png" />
    </li>
    <li>
      <p>In the Add Controller window, enter HomeController as your Controller name, and select the Controller with read/write actions and views, using Entity Framework template. Scaffolding will also write code that uses a model and a data context. Select ToDoItem as your model class and ToDoDb as your data context class, as shown in the screenshot below:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-27.png" />
    </li>
    <li>
      <p>Click Add.</p>
    </li>
    <li>
      <p>You will see a message indicating that HomeController.cs already exists. Select both the Overwrite HomeController.cs and Overwrite associated views checkboxes and click OK.</p>
    </li>
    <li>
      <p>This will create a controller and views for each of the four main database operations (create, read, update, delete) for ToDoItem objects.</p>
    </li>
    <li>
      <p>In Solution Explorer, open the Web.config file in the root directory of the ToDoListApp project.</p>
    </li>
    <li>
      <p>Under the &lt;configuration&gt; / &lt;connectionStrings&gt; section add the <strong>ToDoDb connection</strong> string as shown below.</p>
      <pre class="prettyprint">    &lt;add name="ToDoDb" connectionString="data source=.\SQLEXPRESS;Integrated Security=SSPI;Initial Catalog=ToDoDb;User Instance=true;MultipleActiveResultSets=True" providerName="System.Data.SqlClient" /&gt;
</pre>
    </li>
    <li>
      <p>To test your application at this stage, press F5 in Visual Studio to run the application in the compute emulator. When your application first runs, a database will be created in your local SQL Server Express instance, which was installed as part of the Windows Azure SDK.</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-28.png" />
    </li>
    <li>
      <p>Clicking the Create New link on the web page that is displayed in the browser will create new entries in the database.</p>
    </li>
  </ol>
  <h3>SET-UP SQL AZURE</h3>
  <ol>
    <li>
      <p>The next step is to configure your application to store data in the cloud. First, you must create a SQL Azure server. Login to the Windows Azure Platform Management Portal, http://windows.azure.com, and click on Database:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-29.png" />
    </li>
    <li>
      <p>On the top of the left pane, click the subscription associated with your SQL Azure account:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-30.png" />
    </li>
    <li>
      <p>From the top menu, click Create.</p>
    </li>
    <li>
      <p>In Create Server, select the region for which you want database access to be optimized, and then click Next:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-31.png" />
      <p>IMPORTANT: Pick the same region that you choose earlier when deploying your application. This will give you the best performance.</p>
    </li>
    <li>
      <p>Choose an administrator username and password.</p>
      <p>
        <strong>Note:</strong> These are the credentials for your administrative account and give you full access to all databases on the server.</p>
    </li>
    <li>
      <p>Click Next.</p>
    </li>
    <li>
      <p>The next dialog will prompt you to create firewall rules for the server. Firewall rules identify specific IP addresses or ranges of IP addresses that are able to communicate directly with your SQL Azure server. Add a new rule by clicking Add. In the Add Firewall Rule dialog, enter the values shown in the table below. This will enable your local application to communicate with SQL Azure, but will block other IP addresses from communicating directly with your server.</p>
      <table border="2" cellspacing="0" cellpadding="5" style="border: #000000 2px solid;">
        <tbody>
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Rule name</td>
            <td>local development environment</td>
          </tr>
          <tr>
            <td>IP range start</td>
            <td>(Type the IP address of the computer you are using. The IP address is listed at the bottom of the dialog.)</td>
          </tr>
          <tr>
            <td>IP range end</td>
            <td>(Type the IP address of the computer you are using.)</td>
          </tr>
        </tbody>
      </table>
    </li>
    <li>
      <p>Click OK.</p>
    </li>
    <li>
      <p>Select the Allow other Windows Azure services to access this server check box, Note: SQL Azure has two types of access control: firewall and SQL authentication. You must configure the SQL Azure firewall settings to allow connections from your computer(s).</p>
    </li>
    <li>
      <p>
        <strong>Important:</strong> In addition to configuring the SQL Azure server-side firewall, you must also configure your client-side environment to allow outbound TCP connections over TCP port 1433. For more information, see <a href="http://social.technet.microsoft.com/wiki/contents/articles/security-guidelines-for-sql-azure.aspx">Security Guidelines for SQL Azure</a>.</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-32.png" />
    </li>
    <li>
      <p>Click Finish.</p>
    </li>
    <li>
      <p>You will now see an entry for your new server in the left menu. The fully qualified domain name of the server uses the following format:</p>
      <p>&lt;ServerName&gt;.database.windows.net</p>
      <p>Where &lt;ServerName&gt; identifies the server. Write down the server name; you will need it later in the tutorial.</p>
    </li>
  </ol>
  <p>You can use either SQL Server Management Studio or Windows Azure Platform Management Portal to manage your SQL Azure database. To connect to SQL Azure from SQL Server Management Studio, you must provide the fully qualified domain name of the server: &lt;ServerName&gt;.database.windows.net.</p>
  <h3>SET-UP YOUR APPLICATION TO USE THE DATABASE</h3>
  <p>Often times, you want to use a different database locally that you use in production. Visual Studio makes this easy. You can have your Web.config vary between your development machine and cloud deployment by creating a transform in Web.Release.config. In this guide, you will edit the Web.Release.config to use SQL Azure instead of your local SQL Server when deployed to the cloud:</p>
  <ol>
    <li>
      <p>Back in Visual Studio or Visual Web Developer, in Solution Explorer, open the Web.Release.config file located under Web.config in the root directory of the ToDoListApp project.</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-33.png" />
    </li>
    <li>
      <p>Under the &lt;configuration&gt; / &lt;connectionStrings&gt; section replace all items as shown below. Substitute the &lt;serverName&gt; placeholder with the name of the server you created. For &lt;user&gt; and &lt;password&gt;, enter the administrative user and password you created earlier.</p>
      <pre class="prettyprint">&lt;connectionStrings&gt;
  &lt;add name="ToDoDb" connectionString="data source=&lt;serverName&gt;.database.windows.net;Initial Catalog=ToDoDb;User ID=&lt;user&gt;@&lt;serverName&gt;;Password=&lt;password&gt;;Encrypt=true;Trusted_Connection=false;MultipleActiveResultSets=True" providerName="System.Data.SqlClient" xdt:Transform="SetAttributes" xdt:Locator="Match(name)" /&gt;
  &lt;add name="DefaultConnection" connectionString="data source=&lt;serverName&gt;.database.windows.net;Initial Catalog=ToDoDb;User ID=&lt;user&gt;@&lt;serverName&gt;;Password=&lt;password&gt;;Encrypt=true;Trusted_Connection=false;MultipleActiveResultSets=True" providerName="System.Data.SqlClient" xdt:Transform="SetAttributes" xdt:Locator="Match(name)" /&gt;
&lt;/connectionStrings&gt;
</pre>
      <p>
        <strong>Note:</strong> The administrative user has access to all the databases on the server. To create a SQL Azure user with more restricted pemissions, follow the steps in <a href="http://blogs.msdn.com/b/sqlazure/archive/2010/06/21/10028038.aspx">Adding Users to Your SQL Azure Database</a>. Then, modify the above connection string to use the newly created user and password instead of the administrative user and password.</p>
    </li>
  </ol>
  <h2>
    <a name="running">
    </a>RUNNING YOUR APPLICATION IN THE CLOUD</h2>
  <p>Now, for the final step, you will test your app both living in the Windows Azure cloud and accessing the SQL Azure cloud database. You will redeploy your application to Windows Azure:</p>
  <ol>
    <li>
      <p>Confirm that the correct publishing profile is still selected and click Publish. In particular, ensure that the Build Configuration is set to Release, so you pick up the SQL Azure connection string from the Web.Release.Config that you edited earlier.</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-35.png" />
      <p>Clicking Publish will perform an in-place update, so this will complete faster than your initial deployment.</p>
    </li>
    <li>
      <p>When deployment completes, open the URL of your app from the deployment monitor</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-36.png" />
    </li>
    <li>
      <p>Check that your application functions as expected:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-37.png" />
      <img src="../../../DevCenter/dotNet/Media/getting-started-38.png" />
    </li>
    <li>
      <p>The application is now fully running in the cloud. It uses SQL Azure to store its data, and it is running on one small web role instance. One of the benefits the cloud provides over running this application under standard web hosting is the ability to dynamically scale the number of instances as demand changes. This scaling will require no changes to the application itself. Moreover, updates can be deployed without service interruptions as Azure ensures there is always a role instance handling user requests while another one is being updated.</p>
    </li>
  </ol>
  <h2>
    <a name="stopingp">
    </a>STOPPING AND DELETING YOUR APPLICATION</h2>
  <p>After deploying your application, you may want to disable it so you can build and deploy other applications within the free 750 hours/month (31 days/month) of server time.</p>
  <p>Windows Azure bills web role instances per hour of server time consumed. Server time is consumed once your application is deployed, even if the instances are not running and are in the stopped state. A free account includes 750 hours/month (31 days/month) of dedicated virtual machine server time for hosting these web role instances.</p>
  <p>The following steps show you how to stop and delete your application.</p>
  <ol>
    <li>
      <p>Login to the Windows Azure Platform Management Portal, http://windows.azure.com, and click on Hosted Sevices, Storage Accounts &amp; CDN, then Hosted Services:</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-39.png" />
    </li>
    <li>
      <p>Click on Stop to temporarily suspend your application. You will be able to start it again just by clicking on Start. Click on Delete to completely remove your application from Windows Azure with no ability to restore it.</p>
      <img src="../../../DevCenter/dotNet/Media/getting-started-40.png" />
    </li>
  </ol>
  <h2>
    <a name="summary">
    </a>SUMMARY AND NEXT STEPS</h2>
  <p>In this tutorial you learned how to create and deploy a web application that is hosted on Windows Azure and stores data in SQL Azure.</p>
  <h3>NEXT STEPS</h3>
  <ul>
    <li>Review the <a>SQL Azure How-to Guide</a> to learn more about using SQL Azure.</li>
    <li>Complete the <a>Multi-tier Application Tutorial</a> to further your knowledge about Windows Azure by creating a website that leverages a background worker role to process data.</li>
  </ul>
</body>