---
title: Install Visual Studio and SSDT for SQL Data Warehouse | Microsoft Docs
description: Install Visual Studio and SQL Server Development Tools (SSDT) for Azure SQL Data Warehouse
services: sql-data-warehouse
documentationcenter: NA
author: antvgski
manager: jhubbard
editor: ''

ms.assetid: 0ed9b406-9b42-4fe6-b963-fe0a5b48aac1
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: connect
ms.date: 03/30/2017
ms.author: anvang;barbkess

---
# Install Visual Studio and SSDT for SQL Data Warehouse
To develop applications for SQL Data Warehouse, we recommend using the most recent version of Visual Studio with the most recent version of SQL Server Data Tools (SSDT).  Visual Studio 2013 Update 5 with SSDT is also supported for backward compatibility.  

Using Visual Studio with SSDT will allow you to use the SQL Server Object Explorer to visually explore tables, views, stored procedures and many more objects in your SQL Data Warehouse as well as run queries.

> [!NOTE]
> SQL Data Warehouse does not yet support Visual Studio Database Projects.  This feature will be added in a future version.
> 
> 

## Step 1: Install Visual Studio
Follow these links to download and install Visual Studio. If you already have Visual Studio 2013 or later installed, you can skip to Step 2, install SSDT.

1. [Download Visual Studio][].
2. Follow the [Installing Visual Studio][Installing Visual Studio] guide on MSDN and choose the default configurations.

## Step 2: Install SSDT
To install SSDT for Visual Studio simply check for an SSDT update from within Visual Studio by following these steps.

1. In Visual Studio click on **Tools** / **Extensions and Updates…** / **Updates**
2. Select **Product Updates** and then look for **Microsoft SQL Server Update for database tooling**

If an update is not found, then you should have the latest version installed.  To confirm SSDT is installed, click on **Help** / **About Microsoft Visual Studio** and look for SQL Server Data Tools in the list.  The latest version of SSDT is 14.0.60525.0.  If the option to install is not available from Visual Studio, alternatively you can visit the [SSDT Download][SSDT Download] page to download and install SSDT manually.

## Next steps
Now that you have the latest version of SSDT, you are ready to [connect][connect] to your SQL Data Warehouse.

<!--Anchors-->

<!--Image references-->

<!--Articles-->
[connect]: ./sql-data-warehouse-query-visual-studio.md

<!--Other-->
[Download Visual Studio]: https://www.visualstudio.com/downloads/
[Installing Visual Studio]: https://msdn.microsoft.com/library/e2h7fzkw.aspx
[SSDT Download]: https://msdn.microsoft.com/library/mt204009.aspx
