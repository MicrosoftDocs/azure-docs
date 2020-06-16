---
title: Connect to SQL Database using C and C++ 
description: Use the sample code in this quick start to build a modern application with C++ and backed by a powerful relational database in the cloud with Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: sqldbrb=1
ms.devlang: cpp
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 12/12/2018
---
# Connect to SQL Database using C and C++
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This post is aimed at C and C++ developers trying to connect to Azure SQL Database. It is broken down into sections so you can jump to the section that best captures your interest.

## Prerequisites for the C/C++ tutorial

Make sure you have the following items:

* An active Azure account. If you don't have one, you can sign up for a [Free Azure Trial](https://azure.microsoft.com/pricing/free-trial/).
* [Visual Studio](https://www.visualstudio.com/downloads/). You must install the C++ language components to build and run this sample.
* [Visual Studio Linux Development](https://docs.microsoft.com/cpp/linux/?view=vs-2019). If you are developing on Linux, you must also install the Visual Studio Linux extension.

## <a id="AzureSQL"></a>Azure SQL Database and SQL Server on virtual machines

Azure SQL Database is built on Microsoft SQL Server and is designed to provide a high-availability, performant, and scalable service. There are many benefits to using Azure SQL over your proprietary database running on premises. With Azure SQL you don't have to install, set up, maintain, or manage your database but only the content and the structure of your database. Typical things that we worry about with databases like fault tolerance and redundancy are all built in.

Azure currently has two options for hosting SQL server workloads: Azure SQL Database, database as a service and SQL server on Virtual Machines (VM). We will not get into detail about the differences between these two except that Azure SQL Database is your best bet for new cloud-based applications to take advantage of the cost savings and performance optimization that cloud services provide. If you are considering migrating or extending your on-premises applications to the cloud, SQL server on Azure virtual machine might work out better for you. To keep things simple for this article, let's create an Azure SQL Database.

## <a id="ODBC"></a>Data access technologies: ODBC and OLE DB

Connecting to Azure SQL Database is no different and currently there are two ways to connect to databases: ODBC (Open Database connectivity) and OLE DB (Object Linking and Embedding database). In recent years, Microsoft has aligned with [ODBC for native relational data access](https://blogs.msdn.microsoft.com/sqlnativeclient/20../../microsoft-is-aligning-with-odbc-for-native-relational-data-access/). ODBC is relatively simple, and also much faster than OLE DB. The only caveat here is that ODBC does use an old C-style API.

## <a id="Create"></a>Step 1:  Creating your Azure SQL Database

See the [getting started page](single-database-create-quickstart.md) to learn how to create a sample database.  Alternatively, you can follow this [short two-minute video](https://azure.microsoft.com/documentation/videos/azure-sql-database-create-dbs-in-seconds/) to create an Azure SQL Database using the Azure portal.

## <a id="ConnectionString"></a>Step 2:  Get connection string

After your Azure SQL Database has been provisioned, you need to carry out the following steps to determine connection information and add your client IP for firewall access.

In [Azure portal](https://portal.azure.com/), go to your Azure SQL Database ODBC connection string by using the **Show database connection strings** listed as a part of the overview section for your database:

![ODBCConnectionString](./media/develop-cplusplus-simple/azureportal.png)

![ODBCConnectionStringProps](./media/develop-cplusplus-simple/dbconnection.png)

Copy the contents of the **ODBC (Includes Node.js) [SQL authentication]** string. We use this string later to connect from our C++ ODBC command-line interpreter. This string provides details such as the driver, server, and other database connection parameters.

## <a id="Firewall"></a>Step 3:  Add your IP to the firewall

Go to the firewall section for your server and add your [client IP to the firewall using these steps](firewall-configure.md) to make sure we can establish a successful connection:

![AddyourIPWindow](./media/develop-cplusplus-simple/ip.png)

At this point, you have configured your Azure SQL Database and are ready to connect from your C++ code.

## <a id="Windows"></a>Step 4: Connecting from a Windows C/C++ application

You can easily connect to your [Azure SQL Database using ODBC on Windows using this sample](https://github.com/Microsoft/VCSamples/tree/master/VC2015Samples/ODBC%20database%20sample%20%28windows%29) that builds with Visual Studio. The sample implements an ODBC command-line interpreter that can be used to connect to our Azure SQL Database. This sample takes either a Database source name file (DSN) file as a command-line argument or the verbose connection string that we copied earlier from the Azure portal. Bring up the property page for this project and paste the connection string as a command argument as shown here:

![DSN Propsfile](./media/develop-cplusplus-simple/props.png)

Make sure you provide the right authentication details for your database as a part of that database connection string.

Launch the application to build it. You should see the following window validating a successful connection. You can even run some basic SQL commands like **create table** to validate your database connectivity:

![SQL Commands](./media/develop-cplusplus-simple/sqlcommands.png)

Alternatively, you could create a DSN file using the wizard that is launched when no command arguments are provided. We recommend that you try this option as well. You can use this DSN file for automation and protecting your authentication settings:

![Create DSN File](./media/develop-cplusplus-simple/datasource.png)

Congratulations! You have now successfully connected to Azure SQL using C++ and ODBC on Windows. You can continue reading to do the same for Linux platform as well.

## <a id="Linux"></a>Step 5: Connecting from a Linux C/C++ application

In case you haven't heard the news yet, Visual Studio now allows you to develop C++ Linux application as well. You can read about this new scenario in the [Visual C++ for Linux Development](https://blogs.msdn.microsoft.com/vcblog/20../../visual-c-for-linux-development/) blog. To build for Linux, you need a remote machine where your Linux distro is running. If you don't have one available, you can set one up quickly using [Linux Azure Virtual machines](../../virtual-machines/linux/quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

For this tutorial, let us assume that you have an Ubuntu 16.04 Linux distribution set up. The steps here should also apply to Ubuntu 15.10, Red Hat 6, and Red Hat 7.

The following steps install the libraries needed for SQL and ODBC for your distro:

    sudo su
    sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/mssql-ubuntu-test/ xenial main" > /etc/apt/sources.list.d/mssqlpreview.list'
    sudo apt-key adv --keyserver apt-mo.trafficmanager.net --recv-keys 417A0893
    apt-get update
    apt-get install msodbcsql
    apt-get install unixodbc-dev-utf16 #this step is optional but recommended*

Launch Visual Studio. Under Tools -> Options -> Cross Platform -> Connection Manager, add a connection to your Linux box:

![Tools Options](./media/develop-cplusplus-simple/tools.png)

After connection over SSH is established, create an Empty project (Linux) template:

![New project template](./media/develop-cplusplus-simple/template.png)

You can then add a [new C source file and replace it with this content](https://github.com/Microsoft/VCSamples/blob/master/VC2015Samples/ODBC%20database%20sample%20%28linux%29/odbcconnector/odbcconnector.c). Using the ODBC APIs SQLAllocHandle, SQLSetConnectAttr, and SQLDriverConnect, you should be able to initialize and establish a connection to your database.
Like with the Windows ODBC sample, you need to replace the SQLDriverConnect call with the details from your database connection string parameters copied from the Azure portal previously.

     retcode = SQLDriverConnect(
        hdbc, NULL, "Driver=ODBC Driver 13 for SQL"
                    "Server;Server=<yourserver>;Uid=<yourusername>;Pwd=<"
                    "yourpassword>;database=<yourdatabase>",
        SQL_NTS, outstr, sizeof(outstr), &outstrlen, SQL_DRIVER_NOPROMPT);

The last thing to do before compiling is to add **odbc** as a library dependency:

![Adding ODBC as an input library](./media/develop-cplusplus-simple/lib.png)

To launch your application, bring up the Linux Console from the **Debug** menu:

![Linux Console](./media/develop-cplusplus-simple/linuxconsole.png)

If your connection was successful, you should now see the current database name printed in the Linux Console:

![Linux Console Window Output](./media/develop-cplusplus-simple/linuxconsolewindow.png)

Congratulations! You have successfully completed the tutorial and can now connect to your Azure SQL Database from C++ on Windows and Linux platforms.

## <a id="GetSolution"></a>Get the complete C/C++ tutorial solution

You can find the GetStarted solution that contains all the samples in this article at GitHub:

* [ODBC C++ Windows sample](https://github.com/Microsoft/VCSamples/tree/master/VC2015Samples/ODBC%20database%20sample%20%28windows%29), Download the Windows C++ ODBC Sample to connect to Azure SQL
* [ODBC C++ Linux sample](https://github.com/Microsoft/VCSamples/tree/master/VC2015Samples/ODBC%20database%20sample%20%28linux%29), Download the Linux C++ ODBC Sample to connect to Azure SQL

## Next steps

* Review the [SQL Database Development Overview](develop-overview.md)
* More information on the [ODBC API Reference](https://docs.microsoft.com/sql/odbc/reference/syntax/odbc-api-reference/)

## Additional resources

* [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](saas-tenancy-app-design-patterns.md)
* Explore all the [capabilities of SQL Database](https://azure.microsoft.com/services/sql-database/)
