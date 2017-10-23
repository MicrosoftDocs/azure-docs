---
title: Changing resource classes - Azure SQL Data Warehouse tutorial | Microsoft Docs
description: Tutorial for changing resource classes in Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: jrowlandjones
manager: jhubbard
editor: ''

ms.assetid: ef170f39-ae24-4b04-af76-53bb4c4d16d3
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: performance
ms.date: 10/23/2017
ms.author: jrj;barbkess
---

# Tutorial for changing resource classes
Tutorial for changing [resource classes](resource-classes-for-workload-management.md) in Azure SQL Data Warehouse. 

##  <a name="changing-user-resource-class-example"></a> Change a user resource class example
1. **Create login:** Open a connection to your **master** database on the SQL server hosting your SQL Data Warehouse database and execute the following commands.
   
    ```sql
    CREATE LOGIN newperson WITH PASSWORD = 'mypassword';
    CREATE USER newperson for LOGIN newperson;
    ```
   
   > [!NOTE]
   > It is a good idea to create a user in the master database for Azure SQL Data Warehouse users. Creating a user in master allows a user to log in using tools like SSMS without specifying a database name.  It also allows them to use the object explorer to view all databases on the server.  For more information about creating and managing users, see [Secure a database in SQL Data Warehouse][Secure a database in SQL Data Warehouse].
   > 

2. **Create SQL Data Warehouse user:** Open a connection to the **SQL Data Warehouse** database and execute the following command:
   
    ```sql
    CREATE USER newperson FOR LOGIN newperson;
    ```

3. **Grant permissions:** The following example grants `CONTROL` on the **SQL Data Warehouse** database. `CONTROL` at the database level is the equivalent of db_owner in SQL Server.
   
    ```sql
    GRANT CONTROL ON DATABASE::MySQLDW to newperson;
    ```

4. **Increase resource class:** Use the following query to add a user to a higher workload management role.
   
    ```sql
    EXEC sp_addrolemember 'largerc', 'newperson'
    ```

5. **Decrease resource class:** Use the following query to remove a user from a workload management role.
   
    ```sql
    EXEC sp_droprolemember 'largerc', 'newperson';
    ```
   
   > [!NOTE]
   > It is not possible to remove a user from smallrc.
   > 
   > 