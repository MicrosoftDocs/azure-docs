<properties
	pageTitle="Connect to SQL Database using C and C++ | Microsoft Azure"
	description="Use the sample code in this quick start to build a modern application with C++ and backed by a powerful relational database in the cloud with Azure SQL Database."
	services="sql-database"
	documentationCenter=""
	authors="asthana86"
	manager="danmoth"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.workload="drivers"
	ms.tgt_pltfrm="na"
	ms.devlang="cpp"
	ms.topic="article"
	ms.date="06/16/2016"
	ms.author="tobiast"/>


# Connect to SQL Database using C and C++

This post is aimed at C and C++ developers trying to connect to Azure SQL DB. It is broken down into the following sections so you can jump to the section that best captures your interest. 

- [Azure SQL database and SQL Server on Virtual Machines](#AzureSQL)
- [Data access technologies: ODBC and OLE DB](#ODBC)
- [Creating your Azure SQL Database](#Create)
- [Getting your connection string](#ConnectionString)
- [Adding your IP to the firewall](#Firewall)
- [Connecting from a Windows C/C++ application](#Windows) 	
- [Connecting from a Linux C/C++ application](#Linux) 
- [Get the complete C/C++ tutorial solution](#GetSolution)

## Prerequisites for the C/C++ tutorial

Please make sure you have the following:
- An active Azure account. If you don't have one, you can sign up for a [Free Azure Trial](https://azure.microsoft.com/pricing/free-trial/).
- [Visual Studio](https://www.visualstudio.com/downloads/), you will require the C++ language components installed to build and run this sample.
- [Visual Studio Linux Development](https://visualstudiogallery.msdn.microsoft.com/725025cf-7067-45c2-8d01-1e0fd359ae6e), if you are developing on Linux you will also need the Visual Studio Linux extension installed. 


## <a id="AzureSQL"></a>Azure SQL database and SQL Server on Virtual Machines
Azure SQL is built on Microsoft SQL Server and is designed to provide a high-availability, performant and scalable service. There are many benefits for using SQL Azure over your proprietary database running on premises. With SQL Azure you don’t have to install, setup, maintain or manage your database but only the content and the structure of your database. Typical things which we worry about with databases like fault tolerance and redundancy are all built in. 

Azure currently has two options for hosting SQL server workloads: Azure SQL database, database as a service and SQL server on Virtual Machines (VM) respectively. We will not get into too much detail about the differences in these two except that Azure SQL database is your best bet for new cloud-based applications to take advantage of the cost savings and performance optimization that cloud services provide.  SQL server on Azure virtual machine might work out better for you if you are considering migrating or extending your on-premises applications to the cloud. For this post to keep things simple let us go ahead and just create an Azure SQL database. 

## <a id="ODBC"></a>Data access technologies: ODBC and OLE DB

Connecting to Azure SQL DB is no different and currently there are two ways to connect to databases ODBC also known as Open Database connectivity and OLE DB which stands for Object Linking and Embedding database. In recent years, Microsoft has aligned with [ODBC for native relational data access](https://blogs.msdn.microsoft.com/sqlnativeclient/2011/08/29/microsoft-is-aligning-with-odbc-for-native-relational-data-access/). ODBC is relatively simple, and it is in fact also much faster than OLE DB. The only caveat here is that ODBC does use an old C-style API. 

## <a id="Create"></a>Step 1:  Creating your Azure SQL Database 

See the [getting started page](sql-database-get-started.md) to learn how to create a sample database.  Alternatively you can also follow this [short two minute video](https://azure.microsoft.com/en-us/documentation/videos/azure-sql-database-create-dbs-in-seconds/) which will allow you to create an Azure SQL database using the Azure portal.

## <a id="ConnectionString"></a>Step 2:  Get Connection String

Once your Azure SQL database has been provisioned you need to carry out the following steps to determine connection information and add your client IP for firewall access. 

In [Azure portal](https://portal.azure.com/) migrate to your Azure SQL database ODBC connection string by using the ‘Show database connection strings’ listed as a part of the overview section for your database. 

![ODBCConnectionString](https://msdnshared.blob.core.windows.net/media/2016/10/azureportal.png)

![ODBCConnectionStringProps](https://msdnshared.blob.core.windows.net/media/2016/10/dbconnection.png)

Copy contents of the ‘ODBC (Includes Node.js) [SQL authentication]’ string, we will use these later to connect from our C++ ODBC command line interpreter. This string provides details such as the driver, server and other database connection parameters. 

## <a id="Firewall"></a>Step 3:  Add your IP to the firewall 

Traverse to the firewall section for your Database server and add your [client IP to the firewall using these steps](https://azure.microsoft.com/en-us/documentation/articles/sql-database-configure-firewall-settings/) to make sure we can establish a successful connection. 

![AddyourIPWindow](https://msdnshared.blob.core.windows.net/media/2016/10/ip.png)

At this point you have configured your Azure SQL DB and are ready to connect from your C++ code. 

## <a id="Windows"></a>Step 4: Connecting from a Windows C/C++ application

You can easily connect to your [Azure SQL DB using ODBC on Windows using this sample](https://github.com/Microsoft/VCSamples/tree/master/VC2015Samples/ODBC%20database%20sample) which builds with Visual Studio.  The sample implements an ODBC command line interpreter which can be used to connect to our Azure SQL DB. This sample as a command line argument takes in a Database source name file (DSN) file which we haven’t talked about yet or the verbose connection string which we copied earlier from Azure portal. Bring up the property page for this project and paste the connection string as a command argument shown below. 

![DSN Propsfile](https://msdnshared.blob.core.windows.net/media/2016/10/prop.png)

Make sure you provide the right authentication details for your database as a part of that database connection string. 

Launch the application this should successfully build your application and you should see the following window validating a successful connection. You can even run some basic SQL commands like create table to validate your database connectivity.

![SQL Commands](https://msdnshared.blob.core.windows.net/media/2016/10/sqlcommands.png)

Alternatively, you could also create a DSN file using the wizard that is launched when no command arguments are provided. I would recommend you playing with this as well to give you an idea, you can use this DSN file for automation and protecting your authentication settings. 

![Create DSN File](https://msdnshared.blob.core.windows.net/media/2016/10/datasource.png)

Congratulations! you have now sucessfully connected to Azure SQL using C++ and ODBC on Windows. You can continue reading to do the same for Linux platform as well. 


## <a id="Linux"></a>Step 5: Connecting from a Linux C/C++ application
Well in case you haven’t heard the news yet. Visual Studio also allows you to now develop C++ Linux application as well. You can read all about this new scenario in our [Visual C++ for Linux Development](https://blogs.msdn.microsoft.com/vcblog/2016/03/30/visual-c-for-linux-development/) blog. In order to build for Linux, you will need a remote machine where your Linux distro is running, if you don’t have one available you can set one up quickly using [Linux Azure Virtual machines](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-quick-create-cli/). 

For this tutorial let us assume you have an Ubuntu 16.04 Linux distribution setup but the steps here should also be transferrable for Ubuntu 15.10, Red Hat 6 and Red Hat 7. 

Run through these steps below, these will install libraries needed for SQL and ODBC for your distro.

    	sudo su
    	sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/mssql-ubuntu-test/ xenial main" > /etc/apt/sources.list.d/mssqlpreview.list'
    	sudo apt-key adv --keyserver apt-mo.trafficmanager.net --recv-keys 417A0893
    	apt-get update
    	apt-get install msodbcsql
    	apt-get install unixodbc-dev-utf16 #this step is optional but recommended*

Launch Visual Studio 2015, under Tool -> options -> cross platform -> C++ ->connection manager add a new connection to your Linux box. 

![Tools Options](https://msdnshared.blob.core.windows.net/media/2016/10/tools.png)

Once connection over SSH is established create an Empty project (Linux) template. 

![New project template](https://msdnshared.blob.core.windows.net/media/2016/10/template.png)

You can then add a [new C source file and replace it with these contents](https://github.com/Microsoft/VCSamples/blob/master/VC2015Samples/ODBC%20database%20sample%20(linux)/odbcconnector/odbcconnector.c). The code is simple and using ODBC API(s) SQLAllocHandle, SQLSetConnectAttr and SQLDriverConnect you should be able to initialize and establish connection to your database. 
Like the Windows ODBC sample you will need to replace SQLDriverConnect call with details w.r.t. your database connection string parameters copied from the Azure Portal in pervious steps. 

     retcode = SQLDriverConnect(
        hdbc, NULL, "Driver=ODBC Driver 13 for SQL"
                    "Server;Server=<yourserver>;Uid=<yourusername>;Pwd=<"
                    "yourpassword>;database=<yourdatabase>",
        SQL_NTS, outstr, sizeof(outstr), &outstrlen, SQL_DRIVER_NOPROMPT);

One last thing to do before compiling is to add ‘odbc’ as a library dependency. 

![Adding ODBC as a input library](https://msdnshared.blob.core.windows.net/media/2016/10/lib.png)

Bring up the Linux Console from the ‘Debug’ menu and you can then launch your application. 

![Linux Console](https://msdnshared.blob.core.windows.net/media/2016/10/linuxconsole.png)

If your connection was successful. You should now see the current database name printed in the Linux Console. 

![Linux Console Window Output](https://msdnshared.blob.core.windows.net/media/2016/10/linuxconsolewindow.png)

Congratulations! you have sucessfully completed the tutorial and can now connect to your Azure SQL DB from C++ on Windows and Linux platforms.

## <a id="GetSolution"></a>Get the complete C/C++ tutorial solution
You can find the GetStarted solution that contains all the samples in this article at github
- [ODBC C++ Windows sample](https://github.com/Microsoft/VCSamples/tree/master/VC2015Samples/ODBC%20database%20sample%20(windows)), Download the Windows C++ ODBC Sample to connect to Azure SQL
- [ODBC C++ Linux sample](https://github.com/Microsoft/VCSamples/tree/master/VC2015Samples/ODBC%20database%20sample%20(linux)), Download the Linux C++ ODBC Sample to connect to Azure SQL

## Next steps

* Review the [SQL Database Development Overview](sql-database-develop-overview.md)
* More information on the [ODBC API Reference](https://msdn.microsoft.com/en-us/library/ms714562(v=vs.85).aspx)

## Additional resources 

* [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md)
* Explore all the [capabilities of SQL Database](https://azure.microsoft.com/services/sql-database/)






