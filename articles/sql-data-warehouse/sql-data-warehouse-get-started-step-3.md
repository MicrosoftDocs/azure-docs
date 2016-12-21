---
title: Step 1: Prerequisites | Microsoft Docs
description: Get Started Tutorial with Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: johnmac
editor: ''

ms.assetid: A00D6CE1-71EB-49B6-91A6-675112C060C9
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: hero-article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.date: 10/31/2016
ms.author: elbutter

---
# Step 3: Connect to Azure SQL Data Warehouse through SQL Server (logical server)

This tutorial uses SQL Server Management Studio to connect to our SQL Data Warehouse. Other tools can be used to connect 
to SQL Data Warehouse through our supported connectors: ADO.NET, JDBC, ODBC, and PHP. Bear in mind, functionality may be limited for 
tools not supported by Microsoft.


## Get Connection Information

To connect to your SQL Data Warehouse, you must connect through the SQL Server (logical server) you created 
in [Step 1].

1. Select your SQL Data Warehouse from the dashboard or search for it in your resources.

    ![SQL Data Warehouse Dashboard](./media/sql-data-warehouse-get-started-tutorial/sql-dw-dashboard.png)

2. Find the full name for the logical server.

    ![Select Server Name](./media/sql-data-warehouse-get-started-tutorial/select-server.png)

3. Open SSMS and use object explorer to connect to this server using the credentials you created in [Step 1]

    ![Connect with SSMS](./media/sql-data-warehouse-get-started-tutorial/ssms-connect.png)

If all goes correctly, you should now be connected to your SQL Server (logical server) instance. You can use server 
credentials to authenticate to any database on the server as the database owner. However, as best practice, you should 
create separate logins and users for each database. We shall explore user creation in [Step 4](./sql-data-warehouse-get-started-step-4.md). 





[Step 1]: sql-data-warehouse-get-started-step-1.md
