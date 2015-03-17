<properties 
	pageTitle="How to use SQL Database (.NET) - Azure feature guide" 
	description="Get started with SQL Database. Learn how to create a SQL Database instance and connect to it using ADO.NET, ODBC, and EntityClient Provider." 
	services="sql-database" 
	documentationCenter=".net" 
	authors="jeffreyg" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/16/2015" 
	ms.author="jeffreyg"/>







# How to use Azure SQL Database in .NET applications

This guide shows you how to create a logical server and database instance on Azure SQL Database and connect to
the database using the following .NET Framework data provider technologies:
ADO.NET, ODBC, and EntityClient Provider.


## What is SQL Database

SQL Database provides a relational database management system for Azure and is based on SQL Server technology. With a SQL Database instance, you can easily provision and deploy relational database solutions to the cloud, and take advantage of a distributed data center that provides enterprise-class availability, scalability, and security with the benefits of built-in data protection and self-healing.



## Sign in to Azure

SQL Database provides relational data storage, access, and management services on Azure. To use it, you'll need an Azure subscription.

1. Open a web browser, and browse to [http://azure.microsoft.com/](http://azure.microsoft.com). To get started with a free account, click free trial in the upper right corner and follow the steps.

2. Your account is now created. You are ready to get started.


## Create and configure SQL Database

Next, create and configure a database and server. In the Azure Management Portal, revised workflows let you create the database first, and follow up with server provisioning. 

<h3 name="createsrvr">Create a database instance and logical server</h3>

1. Sign in to the [Azure Management Portal][].

2. Click **+NEW** at the bottom of the page.

3. Click **Data Services**.

4. Click **SQL Database**.

5. Click **Custom Create**. 

6. In Name, enter a database name.

7. Choose an edition, maximum size, and collation. For the purposes of this guide, you can use the default values. 

	SQL Database provides three database editions, Basic, Standard and Premium.

	The MAXSIZE is specified when the database is first created and can
later be changed using ALTER DATABASE. MAXSIZE provides the ability to
limit the size of the database.

	For each SQL database created on Azure, there are actually three
replicas of that database. This is done to ensure high availability.
Failover is transparent and part of the service. The [Service Level
Agreement][] provides 99.9% uptime for SQL Database.

8. In Server, select **New SQL Database Server**. 

9. Click the arrow to go on to the next page.

10. In Server Settings, enter a SQL Server authentication login name.

	SQL Database uses SQL Authentication over an encrypted connection. A new SQL Server authentication login assigned to the sysadmin fixed server role will be created using the name you provide. 

	The login cannot be an email address, Windows user account, or a Windows Live ID. Neither Claims nor Windows authentication is supported on SQL Database.

11. Provide a strong password that is over eight characters, using a combination of upper and lower case values, and a number or symbol.

12. Choose a region. Region determines the geographical location of the server. Regions cannot be easily switched, so choose one that makes sense for this server. Choose a location that is closest to you. Keeping your Azure application and database in the same region saves you on egress bandwidth cost and data latency.

13. Be sure to keep the **Allow Azure Services to access the server** option selected so that you can connect to this database using the Management Portal for SQL Database, storage services, and other services on Azure. 

14. Click the checkmark at the bottom of the page when you are finished.

Notice that you did not specify a server name. SQL Database auto-generates the server name to ensure there are no duplicate DNS entries. The server name is a ten-character alphanumeric string. You cannot change the name of your SQL Database server.

After the database is created, click on it to open its dashboard. The dashboard provides connection strings that you can copy and use in application code. It also shows the management URL that you'll need to specify if you are connecting to the database from Management Studio or other administrative tool.


![image](./media/sql-database-dotnet-how-to-use/SQLDbDashboard.PNG)


In the next step, you will configure the firewall so that connections from applications running on your network are allowed access.

<h3 name="configFWLogical">Configure the firewall for the logical server</h3>

1. Click **SQL Databases**, click **Servers** at the top of the page, and then click on the server you just created.

	![Image2](./media/sql-database-dotnet-how-to-use/SQLDBFirewall.PNG)

2. Click **Configure**. 

3. Copy the current client IP address. If you are connecting from a network, this is the IP address that your  router or proxy server is listening on. SQL Database detects the IP address used by the current connection so that you can create a firewall rule to accept connection requests from this device. 

4. Paste the IP address into both the START IP ADDRESS and END IP ADDRESS to establish the range addresses that are allowed to access the server. Later, if you encounter connection errors indicating that the range is too narrow, you can edit this rule to widen the range.

	If client computers use dynamically assigned IP addresses, you must specify a range that is broad enough to include IP addresses assigned to computers in your network. Start with a narrow range, and then expand it only if you need to.

5. Enter a name for the firewall rule, such as the name of your computer or company.

6. Click the checkmark next to the rule to save it.

	![Image3](./media/sql-database-dotnet-how-to-use/SQLDBIPRange.PNG)

7. Click **Save** at the bottom of the page to complete the step. If you do not see **Save**, refresh the browser page.

You now have a database instance, logical server, a firewall rule that allows inbound connections from your IP address, and an administrator login. You are now ready to connect to the database programmatically.


## Connect to SQL Database

This section shows how to connect to SQL Database instance using different
.NET Framework data providers. For central recommendations about connecting to an SQL Database server and database, see:


- [Connections to SQL Database: Central recommendations](../sql-database-connect-central-recommendations/).


If you choose to use Visual Studio and your configuration doesn't
include an Azure web application as a front-end, there are no
additional tools or SDKs needed to be installed on the development
computer. You can just start developing your application.

You can use all of the same designer tools in Visual Studio to work with
SQL Database as you can to work with SQL Server. The Server Explorer allows
you to view (but not edit) database objects. The Visual Studio Entity
Data Model Designer is fully functional and you can use it to create
models against SQL Database for working with Entity Framework.

## Using .NET Framework Data Provider for SQL Server

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
    After you have built your connection string, you can use the SQLConnection class to connect the SQL Database server:
    SqlConnection conn = new SqlConnection(csBuilder.ToString());
    conn.Open();

## Using .NET Framework Data Provider for ODBC

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

## Using EntityClient Provider

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

## Next Steps

Now that you have learned the basics of connecting to SQL Database, see the
following resources to learn more about SQL Database.

-   [Development: How-to Topics (SQL Database)][]
-   [SQL Database][]


  [What is SQL Database]: #WhatIs
  [Sign in to Azure]: #PreReq1
  [Create and Configure SQL Database]: #PreReq2
  [Connect to SQL Database]: #connect-db
  [Connect Using ADO.NET]: #using-sql-server
  [Connect Using ODBC]: #using-ODBC
  [Connect Using EntityClient Provider]: #using-entity
  [Next Steps]: #next-steps
  [Azure Free Trial]: {localLink:2187} "Free Trial"
  [Azure Management Portal]: http://manage.windowsazure.com
  [How to Create a SQL Database Server]: http://social.technet.microsoft.com/wiki/contents/articles/how-to-create-a-sql-azure-server.aspx
  [Management Portal for SQL Database]: http://msdn.microsoft.com/library/windowsazure/gg442309.aspx
  [SQL Database Firewall]: http://social.technet.microsoft.com/wiki/contents/articles/sql-azure-firewall.aspx
  [Tools and Utilities Support (SQL Database)]: http://msdn.microsoft.com/library/windowsazure/ee621784.aspx
  [How to Create a SQL Database on Azure]: http://social.technet.microsoft.com/wiki/contents/articles/how-to-create-a-sql-azure-database.aspx
  [Service Level Agreement]: {localLink:1132} "SLA"
  [EntityClient Provider for the Entity Framework]: http://msdn.microsoft.com/library/bb738561.aspx
  [Development: How-to Topics (SQL Database)]: http://msdn.microsoft.com/library/windowsazure/ee621787.aspx
  [SQL Database]: http://msdn.microsoft.com/library/windowsazure/ee336279.aspx
