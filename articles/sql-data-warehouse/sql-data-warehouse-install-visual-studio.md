<properties
   pageTitle="Install Visual Studio and SSDT for SQL Data Warehouse | Microsoft Azure"
   description="Install Visual Studio and SQL Server Development Tools (SSDT) for Azure SQL Data Warehouse"
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
   ms.date="05/13/2016"
   ms.author="sonyama;barbkess"/>

# Install Visual Studio 2015 and SSDT for SQL Data Warehouse

To develop applications for SQL Data Warehouse, we recommend using Visual Studio 2015 with the most recent version of SQL Server Data Tools (SSDT).  Visual Studio 2013 with SSDT is also supported.  

Additionally, **Microsoft SQL Server Update for database tooling** is needed to run queries from the Visual Studio Integrated Development Environment (IDE). Once this extention is installed, you will then be able to view database objects in the object explorer tree and run queries against your SQL Data Warehouse.

> [AZURE.NOTE] SQL Data Warehouse does not support all features of Visual Studio and SSDT.  Features such as Database Projects will be added in a future version of SSDT.

## Step 1: Install Visual Studio 2015

Follow these links to download and install Visual Studio 2015. If you already have Visual Studion 2013 or 2015 installed, you can skip to installing SSDT.

1. [Download Visual Studio 2015][] from Visual Studio Team Services.
2. Install by following the [Installing Visual Studio][] guide on MSDN and choose the default configurations.

## Step 2: Install SSDT

To install SSDT for Visual Studio simply check for an update from within Visual Studio by following these steps.

1. Click on *Tools* / *Extensions and Updates…* / *Updates* 
2. Select *Product Updates* and then look for *Microsoft SQL Server Update for database tooling*

If an update is not found, then you have the latest version installed already to confirm SSDT is installed, click on *Help* / *About Microsoft Visual Studio* and look for SQL Server Data Tools in the list.

## Next steps

Now that you have the lastest version of SSDT, you are ready to [connect][] to your database.

<!--Anchors-->

<!--Image references-->

<!--Arcticles-->
[connect]: ./sql-data-warehouse-get-started-connect.md

<!--Other-->
[Download Visual Studio 2015]: https://www.visualstudio.com/downloads/
[Installing Visual Studio]: https://msdn.microsoft.com/library/e2h7fzkw.aspx
