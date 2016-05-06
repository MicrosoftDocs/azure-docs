<properties
   pageTitle="Install Visual Studio and/or SSDT for SQL Data Warehouse | Microsoft Azure"
   description="Install Visual Studio and/or SSDT development tools for Azure SQL Data Warehouse"
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="sonyam"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="04/20/2016"
   ms.author="sonyama;barbkess"/>

# Install Visual Studio 2015 and/or SSDT for SQL Data Warehouse

To develop applications for SQL Data Warehouse, we recommend using Visual Studio 2015 with the most recent version of SQL Server Data Tools (SSDT).  Visual Studio 2013 with SSDT is also supported.

To run queries from the Visual Studio Integrated Development Environment (IDE), you only need to install SSDT. This will install the Visual Studio IDE along with SSDT so that you can use the SQL Server Object Explorer to connect to your Azure SQL server. You will then be able to view and run queries against your SQL Data Warehouse databases.


## Step 1: Download and install Visual Studio

If you choose to install Visual Studio, you can use either Visual Studio 2013 or Visual Studio 2015 with SQL Data Warehouse. If you already have Visual Studio 2013 or 2015 installed, skip to Step 2 to install SSDT.

To install Visual Studio 2015:

1. [Download Visual Studio 2015][] from Visual Studio Team Services.
2. Install by following the [Installing Visual Studio][] guide on MSDN and choose the default configurations.

## Step 2: Download and install the most recent SQL Server Data Tools (SSDT)

Whether or not you have Visual Studio installed, you still need the most recent version of SQL Server Data Tools (SSDT) that supports SQL Data Warehouse.

To install the latest version of SSDT:

1. [Download SQL Server Data Tools Preview][] for either Visual Studio 2013 or 2015.
2. Install by following the installation instructions on the download site.

## Next steps

Now that you have the lastest version of SSDT, you are ready to [connect][] to your database.

<!--Anchors-->

<!--Image references-->

<!--Arcticles-->
[connect]: ./sql-data-warehouse-get-started-connect.md

<!--Other-->
[Download Visual Studio 2015]: https://www.visualstudio.com/downloads/
[Installing Visual Studio]: https://msdn.microsoft.com/library/e2h7fzkw.aspx
[Download SQL Server Data Tools Preview]: https://msdn.microsoft.com/library/mt204009.aspx
