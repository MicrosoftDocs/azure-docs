---
title: "Create and use updatable ledger tables"
description: How to create and use updatable ledger tables in Azure SQL Database
ms.custom: ""
ms.date: "05/25/2021"
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.topic: conceptual
author: JasonMAnderson
ms.author: janders
---

# Create and use updatable ledger tables

This article shows you how to create an [updatable ledger table](ledger-updatable-ledger-tables.md) in Azure SQL Database, insert values into your updatable ledger table, make updates to the data, and view the results using the ledger view. We'll use an example of a banking application tracking a banking customers balance in their account. Our example will give you a practical look at the relationship between the updatable ledger table and its corresponding history table and ledger view.

## Prerequisite

- Have an existing Azure SQL Database. See [Quickstart: Create an Azure SQL Database single database](single-database-create-quickstart.md) if you haven't already created an Azure SQL Database.
- [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio)

## Creating an updatable ledger table

We'll create an account balance table with the following schema.  

| Column name | Data type      | Description                         |
| ----------- | -------------- | ----------------------------------- |
| CustomerID  | int            | Customer ID - Primary key clustered |
| LastName    | varchar (50)   | Customer last name                  |
| FirstName   | varchar (50)   | Customer first name                 |
| Balance     | decimal (10,2) | Account balance                     |

> [!IMPORTANT]
> **NEED MORE INFO** Creating updatable ledger tables requires the **ENABLE LEDGER** permission. For details on permissions related to ledger tables, see here. 

1. Using either [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio), create a new schema and table called `[Account].[Balance]`.

   ```sql
   CREATE SCHEMA [Account]
   GO
   
   CREATE TABLE [Account].[Balance]
   (
       [CustomerID] INT NOT NULL PRIMARY KEY CLUSTERED,
       [LastName] VARCHAR (50) NOT NULL,
       [FirstName] VARCHAR (50) NOT NULL,
       [Balance] DECIMAL (10,2) NOT NULL
   )
   WITH 
   (
   	SYSTEM_VERSIONING = ON,
   	LEDGER = ON
   );
   GO
   ```

    > [!NOTE]
    > Specifying the `LEDGER = ON` argument is optional if you enabled ledger when you created your Azure SQL Database.       

1. When your [updatable ledger table](ledger-updatable-ledger-tables.md) is created, the corresponding history table and ledger view are also created. Execute the following T-SQL to see these new tables.

   ```sql
   SELECT 
   ts.[name] + '.' + t.[name] AS [ledger_table_name]
   , hs.[name] + '.' + h.[name] AS [history_table_name]
   , vs.[name] + '.' + v.[name] AS [ledger_view_name]
   FROM sys.tables AS t
   JOIN sys.tables AS h ON (h.[object_id] = t.[history_table_id])
   JOIN sys.views v ON (v.[object_id] = t.[ledger_view_id])
   JOIN sys.schemas ts ON (ts.[schema_id] = t.[schema_id])
   JOIN sys.schemas hs ON (hs.[schema_id] = h.[schema_id])
   JOIN sys.schemas vs ON (vs.[schema_id] = v.[schema_id])
   ```

   **NEED IMAGE HERE**

1. Insert a customer, `Nick Jones` as a new customer with an opening balance of $50.

   ```sql
   INSERT INTO [Account].[Balance]
   VALUES (1, 'Jones', 'Nick', 50)
   ```

1. Insert three new customers, `John Smith`, `Joe Smith`, and `Mary Michaels` as new customers with opening balances of $500, $30 and $200, respectively.

   ```sql
   INSERT INTO [Account].[Balance]
   VALUES (2, 'Smith', 'John', 500),
   (3, 'Smith', 'Joe', 30),
   (4, 'Michaels', 'Mary', 200)
   ```

1. View the `[Account].[Balance]` updatable ledger table, specifying the system-generated hidden columns added to the table.

   ```sql
   SELECT * 
         ,[ledger_start_transaction_id]
         ,[ledger_end_transaction_id]
         ,[ledger_start_sequence_number]
         ,[ledger_end_sequence_number]
   FROM [Account].[Balance] 
   ```

   In the results window, you'll first see the values inserted by your   T-SQL commands, along with the system metadata that is used for data lineage purposes.

   - `ledger_start_transaction_id` notes the unique transaction ID associated with the transaction that inserted the data. Since `John`, `Joe`, and `Mary` were inserted using the same transaction, they share the same transaction ID.
   - `ledger_start_sequence_number` notes the order by which values were inserted by the transaction.

   :::image type="content" source="media/ledger/sql-updatable-how-to-1.png" alt-text="ledger table example 1":::

1. Update `Nick`'s balance from `50` to `100`.

   ```sql
   UPDATE [Account].[Balance] SET [Balance] = 100
   WHERE [CustomerID] = 1
   ```

1. Get the unique name of your history table. You'll need this for the next step.

   ```sql
   SELECT 
   ts.[name] + '.' + t.[name] AS [ledger_table_name]
   , hs.[name] + '.' + h.[name] AS [history_table_name]
   , vs.[name] + '.' + v.[name] AS [ledger_view_name]
   FROM sys.tables AS t
   JOIN sys.tables AS h ON (h.[object_id] = t.[history_table_id])
   JOIN sys.views v ON (v.[object_id] = t.[ledger_view_id])
   JOIN sys.schemas ts ON (ts.[schema_id] = t.[schema_id])
   JOIN sys.schemas hs ON (hs.[schema_id] = h.[schema_id])
   JOIN sys.schemas vs ON (vs.[schema_id] = v.[schema_id])
   ```

   :::image type="content" source="media/ledger/sql-updatable-how-to-2.png" alt-text="ledger table example 2":::

1. View the `[Account].[Balance]` updatable ledger table, along with its corresponding history table and ledger view.

   > [!IMPORTANT]
   > Replace the `<history_table_name>` with the name you copied in the previous step.

   ```sql
   SELECT * 
         ,[ledger_start_transaction_id]
         ,[ledger_end_transaction_id]
         ,[ledger_start_sequence_number]
         ,[ledger_end_sequence_number]
   FROM [Account].[Balance] 
   GO
   
   SELECT * FROM <Your unique history table name>
   GO 
   
   SELECT * FROM Account.Balance_Ledger
   ORDER BY ledger_transaction_id
   GO
   ```

1. `Nick`'s account balance has been successfully updated in the updatable ledger table to `100`.
1. The history table now shows the previous balance of `50` for `Nick`.
1. The ledger view shows that updating the ledger table is a `DELETE` of the original row with `50` as the balance with a corresponding `INSERT` of a new row with `100` with the new balance for `Nick`.

   :::image type="content" source="media/ledger/sql-updatable-how-to-3.png" alt-text="ledger table example 3":::


## Next steps

- [Database ledger](ledger-database-ledger.md)  
- [Digest management and database verification](ledger-digest-management-and-database-verification.md)   
- [Updatable ledger tables](ledger-updatable-ledger-tables.md)
- [Append-only ledger tables](ledger-append-only-ledger-tables.md) 
- [Create and use append-only ledger tables](ledger-how-to-append-only-ledger-tables.md) 

