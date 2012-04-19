<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties umbracoNaviHide="0" pageTitle="SQL Azure - How To - .NET - Develop" metaKeywords="Get started SQL Azure, Getting started SQL Azure, SQL Azure database connection, SQL Azure ADO.NET, SQL Azure ODBC, SQL Azure EntityClient" metaDescription="Get started with SQL Azure. Learn how to create a SQL Azure database and connect to it using ADO.NET, ODBC, and EntityClient Provider." linkid="dev-net-how-to-sql-azure" urlDisplayName="SQL Azure" headerExpose="" footerExpose="" disqusComments="1" />
  <h1>How to Use SQL Azure</h1>
  <p>This guide shows you how to create a SQL Azure database and connect to it using the following .NET Framework data provider technologies: ADO.NET, ODBC, and EntityClient Provider.</p>
  <h2>Table of Contents</h2>
  <ul>
    <li>
      <a href="#what-is">What is SQL Azure?</a>
    </li>
    <li>
      <a href="#create-sql">Create a SQL Azure Server</a>
    </li>
    <li>
      <a href="#config-access">Configure Access to the SQL Azure Server</a>
    </li>
    <li>
      <a href="#create-db">Create a SQL Azure Database</a>
    </li>
    <li>
      <a href="#connect-db">Connect to the SQL Azure Database</a>
      <ul style="margin-bottom: 0px;">
        <li>
          <a href="#using-sql-server">Using ADO.NET</a>
        </li>
        <li>
          <a href="#using-ODBC">Using ODBC</a>
        </li>
        <li>
          <a href="#using-entity">Using EntityClient Provider</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#next-steps">Next Steps</a>
    </li>
  </ul>
  <h2>
    <a name="what-is">
    </a>What is SQL Azure?</h2>
  <p>SQL Azure provides a relational database management system for the Windows Azure platform, and is based on SQL Server technology. With a SQL Azure database, you can easily provision and deploy relational database solutions to the cloud, and take advantage of a distributed data center that provides enterprise-class availability, scalability, and security with the benefits of built-in data protection and self-healing.</p>
  <h2>
    <a name="create-sql">
    </a>Create a SQL Azure Server</h2>
  <p>Before you can use SQL Azure, you must first create a Windows Azure account, which allows you to access all the Windows Azure services, including SQL Azure. For information, see <a href="{localLink:2187}" title="Free Trial">Windows Azure Free Trial</a>.</p>
  <p>After you have signed up, you can use Windows Azure Management Portal to create and manage your SQL Azure server.</p>
  <ol>
    <li>Log into the <a href="http://windows.azure.com" target="_blank">Windows Azure Management Portal</a>.</li>
    <li>In the navigation pane on the left, click <strong>Database</strong>. <br />At the top of the navigation pane, expand <strong>Subscriptions</strong>, click the subscription in which you want to create the database server, and then click <strong>Create</strong>. This opens the Create Server wizard.
<p><img src="../../../DevCenter/dotNet/media/sql-01.png" /></p></li>
    <li>Select a region in which you want to host your SQL Azure server, and then click <strong>Next</strong>. Typically, you want to choose a region that is closer to your location to reduce network latency.</li>
    <li>Type the Administrator login name and the password, and then click <strong>Next</strong>.<br /><strong>Note:</strong> SQL Azure only supports SQL Authentication; Windows authentication is not supported.</li>
    <li>Click <strong>Finish</strong>. You will configure the firewall rules in the <a href="#config-access">Configure Access to the SQL Azure Server</a> section.</li>
    <li>In the navigation pane, expand the subscription in which you created the database server, and then click the newly created SQL Azure server.
<p><img src="../../../DevCenter/dotNet/media/sql-02.png" /></p><p>In the Properties pane on the right, it lists the Fully Qualified DNS Name (FQDN) and other properties of the SQL Azure server. You will need the FQDN to build your connection string. In the middle pane, it lists the master database that is created when the SQL Azure server is created.</p><p><strong>Note:</strong> Because the SQL Azure server must be accessible worldwide, SQL Azure configures the appropriate DNS entries when the server is created. The generated name ensures that there are no name collisions with other DNS entries. You cannot change the name of your SQL Azure server.</p></li>
  </ol>
  <p>For more information, see <a href="http://social.technet.microsoft.com/wiki/contents/articles/how-to-create-a-sql-azure-server.aspx" target="_blank">How to Create a SQL Azure Server</a>. Next, configure access to the SQL Azure server by creating firewall rules.</p>
  <h2>
    <a name="config-access">
    </a>Configure Access to the SQL Azure Server</h2>
  <p>SQL Azure firewall prevents all access to your SQL Azure server until you specify which computers and services have permission to access it. The firewall grants access based on the originating IP address of each request. You must create firewall rules to allow access from the client computers, including your development computer so you can test your application.</p>
  <ol>
    <li>At the top of the navigation pane, expand <strong>Subscriptions</strong>, expand the subscription, and then click the SQL Azure server you created in the previous procedure.</li>
    <li>In the middle pane, click <strong>Firewall Rules</strong>.</li>
    <li>Select <strong>Allow other Windows Azure services to access this server</strong>. A firewall rule called MicrosoftServices is added to the firewall rule list by default. This setting enables other Windows Azure services including <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg442309.aspx">Management Portal for SQL Azure</a> to access the SQL Azure server. You will use the Management Portal for SQL Azure in the <a href="#create-db">Create a SQL Azure Database</a> section.</li>
    <li>Click <strong>Add</strong> to create another firewall rule.</li>
    <li>Enter a rule name, and an IP range, and then click <strong>OK</strong>. The rule name must be unique. The IP address of your computer is listed on the bottom of the dialog. If this is your development computer, you can enter the IP address in both the IP range start box and the IP range end box.<br />Note: There can be up as much as a five-minute delay for changes to the firewall settings to take effect.</li>
  </ol>
  <p>The SQL Azure Database service is only available with TCP port 1433 used by the TDS protocol, so make sure that the firewall on your network and local computer allows outgoing TCP communication on port 1433. For more information, see <a href="http://social.technet.microsoft.com/wiki/contents/articles/sql-azure-firewall.aspx" target="_blank">SQL Azure Firewall</a>.</p>
  <h2>
    <a name="create-db">
    </a>Create a SQL Azure Database</h2>
  <p>To create a new database, you must connect to the master database. The following steps show you how to create a database using the Management Portal for SQL Azure.</p>
  <ol>
    <li>At the top of the navigation pane, expand <strong>Subscriptions</strong>, expand the subscription, expand the SQL Azure server you created, click <strong>master</strong>, and then click <strong>Manage</strong>.
<p><img src="../../../DevCenter/dotNet/media/sql-03.png" /></p><p>This opens the Management Portal for SQL Azure logon screen.</p><p><img src="../../../DevCenter/dotNet/media/sql-04.png" /></p></li>
    <li>Enter the user name and the password that you specified when you created the SQL Azure server, and then click <strong>Log on</strong>. This opens the Management Portal for SQL Azure in a different browser tab or a new browser window.<br /><strong>Note:</strong> If an error occurs, it displays a message saying "There was an error connecting to the server" beneath the Password textbox. You can click on the message to see the error details. A common error is the firewall rule not created for the client computer.</li>
    <li>In the Management Portal for SQL Azure, click <strong>New Query</strong>. <img src="../../../DevCenter/dotNet/media/sql-05.png" /></li>
    <li>In the query window, copy and paste the following Transact-SQL script using your own name for the database in place of database_name:
<pre class="prettyprint">CREATE DATABASE database_name;</pre></li>
    <li>Click <strong>Execute</strong>. Make sure the result pane showing <strong>Command(s) completed successfully.</strong></li>
    <li>Click <strong>Log off</strong> on the upper right corner, and then click Log off again to confirm logging off without saving the query.</li>
    <li>Switch back to the Windows Azure Management Portal.</li>
    <li>From the View ribbon, click <strong>Refresh</strong>. The new database is listed in the navigation pane.</li>
  </ol>
  <p>SQL Azure Database provides two database editions:</p>
  <ul>
    <li>Web Edition - Grows up to a size of 5 GB</li>
    <li>Business Edition - Grows up to a size of 50 GB.</li>
  </ul>
  <p>The MAXSIZE is specified when the database is first created and can later be changed using ALTER DATABASE. MAXSIZE provides the ability to limit the size of the database.</p>
  <p>You can also use SQL Server Management Studio 2008 R2 (SSMS) to create a SQL Azure database. For a list of supported tools and utilities, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee621784.aspx">Tools and Utilities Support (SQL Azure Database)</a>. For more information on creating SQL Azure database, see <a href="http://social.technet.microsoft.com/wiki/contents/articles/how-to-create-a-sql-azure-database.aspx" target="_blank">How to Create a SQL Azure database</a>.</p>
  <p>For each database created on SQL Azure, there are actually three replicas of that database. This is done to ensure high availability. Failover is transparent and part of the service. The <a href="{localLink:1132}" title="SLA">Service Level Agreement</a> provides 99.9% uptime for SQL Azure.</p>
  <h2>
    <a name="connect-db">
    </a>Connect to the SQL Azure Database</h2>
  <p>This section shows how to connect to SQL Azure database using different .NET Framework data providers.</p>
  <p>If you choose to use Visual Studio 2010 and your configuration doesn't include a Windows Azure web application as a front-end, there are no additional tools or SDKs needed to be installed on the development computer. You can just start developing your application.</p>
  <p>You can use all of the same designer tools in Visual Studio to work with SQL Azure as you can to work with SQL Server. The Server Explorer allows you to view (but not edit) database objects. The Visual Studio Entity Data Model Designer is fully functional and you can use it to create models against SQL Azure for working with Entity Framework.</p>
  <h3>
    <a name="using-sql-server">
    </a>Using .NET Framework Data Provider for SQL Server</h3>
  <p>The <strong>System.Data.SqlClient</strong> namespace is the.NET Framework Data Provider for SQL Server.</p>
  <p>The standard connection string looks like this:</p>
  <pre class="prettyprint">Server=tcp:.database.windows.net;
Database=;
User ID=@;
Password=;
Trusted_Connection=False;
Encrypt=True;
</pre>
  <p>You can use the <strong>SQLConnectionStringBuilder</strong> class to build a connection string as shown in the following code sample:</p>
  <pre class="prettyprint">SqlConnectionStringBuilder csBuilder;
csBuilder = new SqlConnectionStringBuilder();
csBuilder.DataSource = xxxxxxxxxx.database.windows.net;
csBuilder.InitialCatalog = testDB;
csBuilder.Encrypt = true;
csBuilder.TrustServerCertificate = false;
csBuilder.UserID = MyAdmin;
csBuilder.Password = pass@word1;</pre>
  <p>If the elements of a connection string are known ahead of time, they can be stored in a configuration file and retrieved at run time to construct a connection string. Here is a sample connection string in configuration file:</p>
  <pre class="prettyprint">&lt;connectionStrings&gt;
  &lt;add name="ConnectionString" 
       connectionString ="Server=tcp:xxxxxxxxxx.database.windows.net;Database=testDB;User ID=MyAdmin@xxxxxxxxxx;Password=pass@word1;Trusted_Connection=False;Encrypt=True;" /&gt;
&lt;/connectionStrings&gt;</pre>
  <p>To retrieve the connection string in a configuration file, you use the <strong>ConfigurationManager</strong> class:</p>
  <pre class="prettyprint">SqlConnectionStringBuilder csBuilder;
csBuilder = new SqlConnectionStringBuilder(ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString);
After you have built your connection string, you can use the SQLConnection class to connect the SQL Azure server:
SqlConnection conn = new SqlConnection(csBuilder.ToString());
conn.Open();</pre>
  <h3>
    <a name="using-ODBC">
    </a>Using .NET Framework Data Provider for ODBC</h3>
  <p>The <strong>System.Data.Odbc</strong> namespace is the.NET Framework Data Provider for ODBC. The following is a sample ODBC connection string:</p>
  <pre class="prettyprint">Driver={SQL Server Native Client 10.0};
Server=tcp:.database.windows.net;
Database=;
Uid=@;
Pwd=;
Encrypt=yes;</pre>
  <p>The <strong>OdbcConnection</strong> class represents an open connection to a data source. Here is a code sample on how to open a connection:</p>
  <pre class="prettyprint">string cs = "Driver={SQL Server Native Client 10.0};" +
            "Server=tcp:xxxxxxxxxx.database.windows.net;" +
            "Database=testDB;"+
            "Uid=MyAdmin@xxxxxxxxxx;" +
            "Pwd=pass@word1;"+
            "Encrypt=yes;";

OdbcConnection conn = new OdbcConnection(cs);
conn.Open();</pre>
  <p>If you want to build the connection string on the runtime, you can use the <strong>OdbcConnectionStringBuilder</strong> class.</p>
  <h3>
    <a name="using-entity">
    </a>Using EntityClient Provider</h3>
  <p>The <strong>System.Data.EntityClient</strong> namespace is the .NET Framework Data Provider for the Entity Framework.</p>
  <p>The Entity Framework enables developers to create data access applications by programming against a conceptual application model instead of programming directly against a relational storage schema. The Entity Framework builds on top of storage-specific ADO.NET data providers by providing an <strong>EntityConnection</strong> to an underlying data provider and relational database.</p>
  <p>To construct an <strong>EntityConnection</strong> object, you have to reference a set of metadata that contains the necessary models and mapping, and also a storage-specific data provider name and connection string. After the <strong>EntityConnection</strong> is in place, entities can be accessed through the classes generated from the conceptual model.</p>
  <p>Here is a connection string sample:</p>
  <pre class="prettyprint">metadata=res://*/SchoolModel.csdl|res://*/SchoolModel.ssdl|res://*/SchoolModel.msl;provider=System.Data.SqlClient;provider connection string="Data Source=xxxxxxxxxx.database.windows.net;Initial Catalog=School;Persist Security Info=True;User ID=MyAdmin;Password=***********"</pre>
  <p>For more information, see <a href="http://msdn.microsoft.com/en-us/library/bb738561.aspx">EntityClient Provider for the Entity Framework</a>.</p>
  <h2>
    <a name="next-steps">
    </a>Next Steps</h2>
  <p>Now that you have learned the basics of connecting to SQL Azure, see the following resources to learn more about SQL Azure.</p>
  <ul>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee621787.aspx">Development: How-to Topics (SQL Azure Database)</a>
    </li>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee336279.aspx">SQL Azure Database</a>
    </li>
  </ul>
</body>