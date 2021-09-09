---
title: "Create and use append-only ledger tables"
description: Learn how to create and use append-only ledger tables in Azure SQL Database.
ms.custom: references_regions
ms.date: "07/23/2021"
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.topic: how-to
author: JasonMAnderson
ms.author: janders
---

# Create and use append-only ledger tables

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Azure SQL Database ledger is currently in public preview and available in West Europe, Brazil South, and West Central US.

This article shows you how to create an [append-only ledger table](ledger-append-only-ledger-tables.md) in Azure SQL Database. Next, you'll insert values in your append-only ledger table and then attempt to make updates to the data. Finally, you'll view the results by using the ledger view. We'll use an example of a card key access system for a facility, which is an append-only system pattern. Our example will give you a practical look at the relationship between the append-only ledger table and its corresponding ledger view.

For more information, see [Append-only ledger tables](ledger-append-only-ledger-tables.md).

## Prerequisites

- Azure SQL Database with ledger enabled. If you haven't already created a database in SQL Database, see [Quickstart: Create a database in Azure SQL Database with ledger enabled](ledger-create-a-single-database-with-ledger-enabled.md).
- [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).

## Create an append-only ledger table

We'll create a `KeyCardEvents` table with the following schema.

| Column name | Data type | Description |
|--|--|--|
| EmployeeID | int | The unique ID of the employee accessing the building |
| AccessOperationDescription | nvarchar (MAX) | The access operation of the employee |
| Timestamp | datetime2 | The date and time the employee accessed the building |

> [!IMPORTANT]
> Creating append-only ledger tables requires the **ENABLE LEDGER** permission. For more information on permissions related to ledger tables, see [Permissions](/sql/relational-databases/security/permissions-database-engine#asdbpermissions). 

1. Use [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio) to create a new schema and table called `[AccessControl].[KeyCardEvents]`.

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

1. Add a new building access event in the `[AccessControl].[KeyCardEvents]` table with the following values.

   ```sql
   INSERT INTO [AccessControl].[KeyCardEvents]
   VALUES ('43869', 'Building42', '2020-05-02T19:58:47.1234567')
   ```

1. View the contents of your KeyCardEvents table, and specify the [GENERATED ALWAYS](/sql/t-sql/statements/create-table-transact-sql#generate-always-columns) columns that are added to your [append-only ledger table](ledger-append-only-ledger-tables.md).

   ```sql
   SELECT *
        ,[ledger_start_transaction_id]
        ,[ledger_start_sequence_number]
   FROM [AccessControl].[KeyCardEvents]
   ```

   :::image type="content" source="media/ledger/append-only-how-to-keycardevent-table.png" alt-text="Screenshot that shows results from querying the KeyCardEvents table.":::

1. Try to update the `KeyCardEvents` table by changing the `EmployeeID` from `43869` to `34184.`

   ```sql
   UPDATE [AccessControl].[KeyCardEvents] SET [EmployeeID] = 34184
   ```

   You'll receive an error message that states the updates aren't allowed for your append-only ledger table.

   :::image type="content" source="media/ledger/append-only-how-to-1.png" alt-text="Screenshot that shows the append-only error message.":::

## Next steps

- [Database ledger](ledger-database-ledger.md) 
- [Digest management and database verification](ledger-digest-management-and-database-verification.md)
- [Append-only ledger tables](ledger-append-only-ledger-tables.md) 
- [Updatable ledger tables](ledger-updatable-ledger-tables.md)
- [Create and use updatable ledger tables](ledger-how-to-updatable-ledger-tables.md)
- [Access the digests stored in Azure Confidential Ledger (ACL)](ledger-how-to-access-acl-digest.md)
- [Verify a ledger table to detect tampering](ledger-verify-database.md)
