<properties umbraconavihide="0" pagetitle="SQL Azure - How To - .NET - Develop" metakeywords="Get started SQL Azure, Getting started SQL Azure, SQL Azure database connection, SQL Azure ADO.NET, SQL Azure ODBC, SQL Azure EntityClient" metadescription="Get started with SQL Azure. Learn how to create a SQL Azure database and connect to it using ADO.NET, ODBC, and EntityClient Provider." linkid="dev-net-how-to-sql-azure" urldisplayname="SQL Azure" headerexpose="" footerexpose="" disquscomments="1"></properties>

# How to Use SQL Azure

This guide shows you how to create a SQL Azure database and connect to
it using the following .NET Framework data provider technologies:
ADO.NET, ODBC, and EntityClient Provider.

## Table of Contents

-   [What is SQL Azure?][]
-   [Create a SQL Azure Server][]
-   [Configure Access to the SQL Azure Server][]
-   [Create a SQL Azure Database][]
-   [Connect to the SQL Azure Database][]
    -   [Using ADO.NET][]
    -   [Using ODBC][]
    -   [Using EntityClient Provider][]

-   [Next Steps][]

## <a name="what-is"> </a>What is SQL Azure?

SQL Azure provides a relational database management system for the
Windows Azure platform, and is based on SQL Server technology. With a
SQL Azure database, you can easily provision and deploy relational
database solutions to the cloud, and take advantage of a distributed
data center that provides enterprise-class availability, scalability,
and security with the benefits of built-in data protection and
self-healing.

## <a name="create-sql"> </a>Create a SQL Azure Server

Before you can use SQL Azure, you must first create a Windows Azure
account, which allows you to access all the Windows Azure services,
including SQL Azure. For information, see [Windows Azure Free Trial][].

After you have signed up, you can use Windows Azure Management Portal to
create and manage your SQL Azure server.

1.  Log into the [Windows Azure Management Portal][].
2.  In the navigation pane on the left, click **Database**.   
    At the top of the navigation pane, expand **Subscriptions**, click
    the subscription in which you want to create the database server,
    and then click **Create**. This opens the Create Server wizard.

    ![][]

3.  Select a region in which you want to host your SQL Azure server, and
    then click **Next**. Typically, you want to choose a region that is
    closer to your location to reduce network latency.
4.  Type the Administrator login name and the password, and then click
    **Next**.  
    **Note:** SQL Azure only supports SQL Authentication; Windows
    authentication is not supported.
5.  Click **Finish**. You will configure the firewall rules in the
    [Configure Access to the SQL Azure Server][] section.
6.  In the navigation pane, expand the subscription in which you created
    the database server, and then click the newly created SQL Azure
    server.

    ![][1]

    In the Properties pane on the right, it lists the Fully Qualified
    DNS Name (FQDN) and other properties of the SQL Azure server. You
    will need the FQDN to build your connection string. In the middle
    pane, it lists the master database that is created when the SQL
    Azure server is created.

    **Note:** Because the SQL Azure server must be accessible worldwide,
    SQL Azure configures the appropriate DNS entries when the server is
    created. The generated name ensures that there are no name
    collisions with other DNS entries. You cannot change the name of
    your SQL Azure server.

For more information, see [How to Create a SQL Azure Server][]. Next,
configure access to the SQL Azure server by creating firewall rules.

## <a name="config-access"> </a>Configure Access to the SQL Azure Server

SQL Azure firewall prevents all access to your SQL Azure server until
you specify which computers and services have permission to access it.
The firewall grants access based on the originating IP address of each
request. You must create firewall rules to allow access from the client
computers, including your development computer so you can test your
application.

1.  At the top of the navigation pane, expand **Subscriptions**, expand
    the subscription, and then click the SQL Azure server you created in
    the previous procedure.
2.  In the middle pane, click **Firewall Rules**.
3.  Select **Allow other Windows Azure services to access this server**.
    A firewall rule called MicrosoftServices is added to the firewall
    rule list by default. This setting enables other Windows Azure
    services including [Management Portal for SQL Azure][] to access the
    SQL Azure server. You will use the Management Portal for SQL Azure
    in the [Create a SQL Azure Database][] section.
4.  Click **Add** to create another firewall rule.
5.  Enter a rule name, and an IP range, and then click **OK**. The rule
    name must be unique. The IP address of your computer is listed on
    the bottom of the dialog. If this is your development computer, you
    can enter the IP address in both the IP range start box and the IP
    range end box.  
    Note: There can be up as much as a five-minute delay for changes to
    the firewall settings to take effect.

The SQL Azure Database service is only available with TCP port 1433 used
by the TDS protocol, so make sure that the firewall on your network and
local computer allows outgoing TCP communication on port 1433. For more
information, see [SQL Azure Firewall][].

## <a name="create-db"> </a>Create a SQL Azure Database

To create a new database, you must connect to the master database. The
following steps show you how to create a database using the Management
Portal for SQL Azure.

1.  At the top of the navigation pane, expand **Subscriptions**, expand
    the subscription, expand the SQL Azure server you created, click
    **master**, and then click **Manage**.

    ![][2]

    This opens the Management Portal for SQL Azure logon screen.

    ![][3]

2.  Enter the user name and the password that you specified when you
    created the SQL Azure server, and then click **Log on**. This opens
    the Management Portal for SQL Azure in a different browser tab or a
    new browser window.  
    **Note:** If an error occurs, it displays a message saying "There
    was an error connecting to the server" beneath the Password textbox.
    You can click on the message to see the error details. A common
    error is the firewall rule not created for the client computer.
3.  In the Management Portal for SQL Azure, click **New Query**. ![][4]
4.  In the query window, copy and paste the following Transact-SQL
    script using your own name for the database in place of
    database\_name:

        CREATE DATABASE database_name;

5.  Click **Execute**. Make sure the result pane showing **Command(s)
    completed successfully.**
6.  Click **Log off** on the upper right corner, and then click Log off
    again to confirm logging off without saving the query.
7.  Switch back to the Windows Azure Management Portal.
8.  From the View ribbon, click **Refresh**. The new database is listed
    in the navigation pane.

SQL Azure Database provides two database editions:

-   Web Edition - Grows up to a size of 5 GB
-   Business Edition - Grows up to a size of 50 GB.

The MAXSIZE is specified when the database is first created and can
later be changed using ALTER DATABASE. MAXSIZE provides the ability to
limit the size of the database.

You can also use SQL Server Management Studio 2008 R2 (SSMS) to create a
SQL Azure database. For a list of supported tools and utilities, see
[Tools and Utilities Support (SQL Azure Database)][]. For more
information on creating SQL Azure database, see [How to Create a SQL
Azure database][].

For each database created on SQL Azure, there are actually three
replicas of that database. This is done to ensure high availability.
Failover is transparent and part of the service. The [Service Level
Agreement][] provides 99.9% uptime for SQL Azure.

## <a name="connect-db"> </a>Connect to the SQL Azure Database

This section shows how to connect to SQL Azure database using different
.NET Framework data providers.

If you choose to use Visual Studio 2010 and your configuration doesn't
include a Windows Azure web application as a front-end, there are no
additional tools or SDKs needed to be installed on the development
computer. You can just start developing your application.

You can use all of the same designer tools in Visual Studio to work with
SQL Azure as you can to work with SQL Server. The Server Explorer allows
you to view (but not edit) database objects. The Visual Studio Entity
Data Model Designer is fully functional and you can use it to create
models against SQL Azure for working with Entity Framework.

### <a name="using-sql-server"> </a>Using .NET Framework Data Provider for SQL Server

The **System.Data.SqlClient** namespace is the.NET Framework Data
Provider for SQL Server.

The standard connection string looks like this:

    Server=tcp:.database.windows.net;
    Database=;
    User ID=@;
    Password=;
    Trusted_Connection=False;
    Encrypt=True;

You can use the **SQLConnectionStringBuilder** class to build a
connection string as shown in the following code sample:

    SqlConnectionStringBuilder csBuilder;
    csBuilder = new SqlConnectionStringBuilder();
    csBuilder.DataSource = xxxxxxxxxx.database.windows.net;
    csBuilder.InitialCatalog = testDB;
    csBuilder.Encrypt = true;
    csBuilder.TrustServerCertificate = false;
    csBuilder.UserID = MyAdmin;
    csBuilder.Password = pass@word1;

If the elements of a connection string are known ahead of time, they can
be stored in a configuration file and retrieved at run time to construct
a connection string. Here is a sample connection string in configuration
file:

    <connectionStrings>
      <add name="ConnectionString" 
           connectionString ="Server=tcp:xxxxxxxxxx.database.windows.net;Database=testDB;User ID=MyAdmin@xxxxxxxxxx;Password=pass@word1;Trusted_Connection=False;Encrypt=True;" />
    </connectionStrings>

To retrieve the connection string in a configuration file, you use the
**ConfigurationManager** class:

    SqlConnectionStringBuilder csBuilder;
    csBuilder = new SqlConnectionStringBuilder(ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString);
    After you have built your connection string, you can use the SQLConnection class to connect the SQL Azure server:
    SqlConnection conn = new SqlConnection(csBuilder.ToString());
    conn.Open();

### <a name="using-ODBC"> </a>Using .NET Framework Data Provider for ODBC

The **System.Data.Odbc** namespace is the.NET Framework Data Provider
for ODBC. The following is a sample ODBC connection string:

    Driver={SQL Server Native Client 10.0};
    Server=tcp:.database.windows.net;
    Database=;
    Uid=@;
    Pwd=;
    Encrypt=yes;

The **OdbcConnection** class represents an open connection to a data
source. Here is a code sample on how to open a connection:

    string cs = "Driver={SQL Server Native Client 10.0};" +
                "Server=tcp:xxxxxxxxxx.database.windows.net;" +
                "Database=testDB;"+
                "Uid=MyAdmin@xxxxxxxxxx;" +
                "Pwd=pass@word1;"+
                "Encrypt=yes;";

    OdbcConnection conn = new OdbcConnection(cs);
    conn.Open();

If you want to build the connection string on the runtime, you can use
the **OdbcConnectionStringBuilder** class.

### <a name="using-entity"> </a>Using EntityClient Provider

The **System.Data.EntityClient** namespace is the .NET Framework Data
Provider for the Entity Framework.

The Entity Framework enables developers to create data access
applications by programming against a conceptual application model
instead of programming directly against a relational storage schema. The
Entity Framework builds on top of storage-specific ADO.NET data
providers by providing an **EntityConnection** to an underlying data
provider and relational database.

To construct an **EntityConnection** object, you have to reference a set
of metadata that contains the necessary models and mapping, and also a
storage-specific data provider name and connection string. After the
**EntityConnection** is in place, entities can be accessed through the
classes generated from the conceptual model.

Here is a connection string sample:

    metadata=res://*/SchoolModel.csdl|res://*/SchoolModel.ssdl|res://*/SchoolModel.msl;provider=System.Data.SqlClient;provider connection string="Data Source=xxxxxxxxxx.database.windows.net;Initial Catalog=School;Persist Security Info=True;User ID=MyAdmin;Password=***********"

For more information, see [EntityClient Provider for the Entity
Framework][].

## <a name="next-steps"> </a>Next Steps

Now that you have learned the basics of connecting to SQL Azure, see the
following resources to learn more about SQL Azure.

-   [Development: How-to Topics (SQL Azure Database)][]
-   [SQL Azure Database][]

  [What is SQL Azure?]: #what-is
  [Create a SQL Azure Server]: #create-sql
  [Configure Access to the SQL Azure Server]: #config-access
  [Create a SQL Azure Database]: #create-db
  [Connect to the SQL Azure Database]: #connect-db
  [Using ADO.NET]: #using-sql-server
  [Using ODBC]: #using-ODBC
  [Using EntityClient Provider]: #using-entity
  [Next Steps]: #next-steps
  [Windows Azure Free Trial]: {localLink:2187} "Free Trial"
  [Windows Azure Management Portal]: http://windows.azure.com
  []: ../../../DevCenter/dotNet/Media/sql-01.png
  [1]: ../../../DevCenter/dotNet/Media/sql-02.png
  [How to Create a SQL Azure Server]: http://social.technet.microsoft.com/wiki/contents/articles/how-to-create-a-sql-azure-server.aspx
  [Management Portal for SQL Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg442309.aspx
  [SQL Azure Firewall]: http://social.technet.microsoft.com/wiki/contents/articles/sql-azure-firewall.aspx
  [2]: ../../../DevCenter/dotNet/Media/sql-03.png
  [3]: ../../../DevCenter/dotNet/Media/sql-04.png
  [4]: ../../../DevCenter/dotNet/Media/sql-05.png
  [Tools and Utilities Support (SQL Azure Database)]: http://msdn.microsoft.com/en-us/library/windowsazure/ee621784.aspx
  [How to Create a SQL Azure database]: http://social.technet.microsoft.com/wiki/contents/articles/how-to-create-a-sql-azure-database.aspx
  [Service Level Agreement]: {localLink:1132} "SLA"
  [EntityClient Provider for the Entity Framework]: http://msdn.microsoft.com/en-us/library/bb738561.aspx
  [Development: How-to Topics (SQL Azure Database)]: http://msdn.microsoft.com/en-us/library/windowsazure/ee621787.aspx
  [SQL Azure Database]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336279.aspx
