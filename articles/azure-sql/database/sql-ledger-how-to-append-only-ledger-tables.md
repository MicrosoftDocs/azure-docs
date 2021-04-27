---
title: "Create and use append-only updatable ledger tables"
description: How to create and use SQL append-only updatable ledger tables in Azure SQL Database
ms.custom: ""
ms.date: "05/25/2021"
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.topic: conceptual
author: JasonMAnderson
ms.author: janders
---

# Create and use append-only updatable ledger tables

This article shows you how to create an append-only ledger table in Azure SQL Database, insert values into your append-only ledger table, attempt to make updates to the data, and view the results using the ledger view.  We will use a an example of a card key access system of a facility, which is an append-only system pattern.  This will give you a practical example of the relationship between the append-only ledger table and it's corresponding ledger view.

## Prerequisite

- Have an existing Azure SQL Database. See [Quickstart: Create an Azure SQL Database single database](single-database-create-quickstart.md) if you have not already created an Azure SQL Database.

## Create an updatable ledger table

We will create a simple KeyCardEvents table with the following schema.  

| Column name                | Data type      | Description                                           |
| -------------------------- | -------------- | ----------------------------------------------------- |
| EmployeeID                 | int            | The unique ID of the employee accessing the building. |
| AccessOperationDescription | nvarchar (MAX) | The access operation of the employee.                 |
| Timestamp                  | datetime2      | The date and time the employee accessed the building  |

> [!IMPORTANT]
> **NEED MORE INFO** Creating append-only ledger tables requires the **ENABLE LEDGER** permission.  For details on permissions related to ledger tables, see here. 

1. Using either SQL Server Management Studio or Azure Data Studio, create a new schema and table called [AccessControl].[KeyCardEvents].

   ```sql
   CREATE SCHEMA [AccessControl] 
   CREATE TABLE [AccessControl].[KeyCardEvents]
       (
           [EmployeeID] INT NOT NULL,
           [AccessOperationDescription] NVARCHAR (MAX) NOT NULL,
           [Timestamp] Datetime2 NOT NULL
       )
       WITH (
       	  LEDGER = ON (
       	               APPEND_ONLY = ON
       	               )
       	 );
   ```

2. Add a new building access event into the AccessControl.KeyCardEvents table with the following values.

   ```sql
   INSERT INTO [AccessControl].[KeyCardEvents]
   VALUES ('43869', 'Building42', '2020-05-02T19:58:47.1234567')
   ```

4. View the contents of your KeyCardEvents table, specifying the hidden columns that are added to your append-only ledger table.

  ```sql
  SELECT *
       ,[ledger_start_transaction_id]
       ,[ledger_start_sequence_number]
  FROM [AccessControl].[KeyCardEvents]
  ```

  **NEED IMAGE "architecture graphic"**

5. Try to update the KeyCardEvents table by changing the EmployeeID from '43869' to '34184'

   ```sql
   UPDATE [AccessControl].[KeyCardEvents] SET [EmployeeID] = 34184
   ```

   You will receive and error message stating the updates are not allowed for your append-only ledger table.

   :::image type="content" source="media/sql-ledger/append-only-how-to-1.png" alt-text="append only error message":::

## See Also  
- [Database ledger](sql-ledger-database-ledger.md)   
- [Digest management and database verification](sql-ledger-digest-management-and-database-verification.md)      
- [Updatable ledger tables](sql-ledger-updatable-ledger-tables.md)
- [Create and use updatable ledger tables](sql-ledger-how-to-updatable-ledger-tables.md)
