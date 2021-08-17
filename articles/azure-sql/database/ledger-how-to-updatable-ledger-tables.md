---
title: "Create and use updatable ledger tables"
description: Learn how to create and use updatable ledger tables in Azure SQL Database.
ms.custom: references_regions
ms.date: "07/23/2021"
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.topic: how-to
author: JasonMAnderson
ms.author: janders
---

# Create and use updatable ledger tables

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Azure SQL Database ledger is currently in public preview and available in West Europe, Brazil South, and West Central US.

This article shows you how to create an [updatable ledger table](ledger-updatable-ledger-tables.md) in Azure SQL Database. Next, you'll insert values in your updatable ledger table and then make updates to the data. Finally, you'll view the results by using the ledger view. We'll use an example of a banking application that tracks banking customers' balances in their accounts. Our example will give you a practical look at the relationship between the updatable ledger table and its corresponding history table and ledger view.

## Prerequisites

- Azure SQL Database with ledger enabled. If you haven't already created a database in SQL Database, see [Quickstart: Create a database in Azure SQL Database with ledger enabled](ledger-create-a-single-database-with-ledger-enabled.md).
- [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).

## Create an updatable ledger table

We'll create an account balance table with the following schema.

| Column name | Data type      | Description                         |
| ----------- | -------------- | ----------------------------------- |
| CustomerID  | int            | Customer ID - Primary key clustered |
| LastName    | varchar (50)   | Customer last name                  |
| FirstName   | varchar (50)   | Customer first name                 |
| Balance     | decimal (10,2) | Account balance                     |

> [!IMPORTANT]
> Creating updatable ledger tables requires the **ENABLE LEDGER** permission. For more information on permissions related to ledger tables, see [Permissions](/sql/relational-databases/security/permissions-database-engine#asdbpermissions). 

1. Use [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio) to create a new schema and table called `[Account].[Balance]`.

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
    > Specifying the `LEDGER = ON` argument is optional if you enabled a ledger database when you created your database in SQL Database.
    >
    > In the preceding example, the system generates the names of the [GENERATED ALWAYS](/sql/t-sql/statements/create-table-transact-sql#generate-always-columns) columns in the table, the name of the [ledger view](ledger-updatable-ledger-tables.md#ledger-view), and the names of the [ledger view columns](ledger-updatable-ledger-tables.md#ledger-view-schema).
    >
    > The ledger view column names can be customized when you create the table by using the `<ledger_view_option>` parameter with the [CREATE TABLE (Transact-SQL)](/sql/t-sql/statements/create-table-transact-sql?view=azuresqldb-current&preserve-view=true) statement. The `GENERATED ALWAYS` columns and the [history table](ledger-updatable-ledger-tables.md#history-table) name can be customized. For more information, see [ledger view options](/sql/t-sql/statements/create-table-transact-sql?view=azuresqldb-current&preserve-view=true#ledger-view-options) and the corresponding examples in [CREATE TABLE (Transact-SQL)](/sql/t-sql/statements/create-table-transact-sql?view=azuresqldb-current&preserve-view=true##x-creating-a-updatable-ledger-table).

1. When your [updatable ledger table](ledger-updatable-ledger-tables.md) is created, the corresponding history table and ledger view are also created. Run the following T-SQL commands to see the new table and the new view.

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

   :::image type="content" source="media/ledger/ledger-updatable-how-to-new-tables.png" alt-text="Screenshot that shows querying new ledger tables.":::

1. Insert the name `Nick Jones` as a new customer with an opening balance of $50.

   ```sql
   INSERT INTO [Account].[Balance]
   VALUES (1, 'Jones', 'Nick', 50)
   ```

1. Insert the names `John Smith`, `Joe Smith`, and `Mary Michaels` as new customers with opening balances of $500, $30, and $200, respectively.

   ```sql
   INSERT INTO [Account].[Balance]
   VALUES (2, 'Smith', 'John', 500),
   (3, 'Smith', 'Joe', 30),
   (4, 'Michaels', 'Mary', 200)
   ```

1. View the `[Account].[Balance]` updatable ledger table, and specify the [GENERATED ALWAYS](/sql/t-sql/statements/create-table-transact-sql#generate-always-columns) columns added to the table.

   ```sql
   SELECT * 
         ,[ledger_start_transaction_id]
         ,[ledger_end_transaction_id]
         ,[ledger_start_sequence_number]
         ,[ledger_end_sequence_number]
   FROM [Account].[Balance] 
   ```

   In the results window, you'll first see the values inserted by your T-SQL commands, along with the system metadata that's used for data lineage purposes.

   - The `ledger_start_transaction_id` column notes the unique transaction ID associated with the transaction that inserted the data. Because `John`, `Joe`, and `Mary` were inserted by using the same transaction, they share the same transaction ID.
   - The `ledger_start_sequence_number` column notes the order by which values were inserted by the transaction.

      :::image type="content" source="media/ledger/sql-updatable-how-to-1.png" alt-text="Screenshot that shows ledger table example 1.":::

1. Update `Nick`'s balance from `50` to `100`.

   ```sql
   UPDATE [Account].[Balance] SET [Balance] = 100
   WHERE [CustomerID] = 1
   ```

1. Copy the unique name of your history table. You'll need this information for the next step.

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

   :::image type="content" source="media/ledger/sql-updatable-how-to-2.png" alt-text="Screenshot that shows ledger table example 2.":::

1. View the `[Account].[Balance]` updatable ledger table, along with its corresponding history table and ledger view.

   > [!IMPORTANT]
   > Replace `<history_table_name>` with the name you copied in the previous step.

   ```sql
   SELECT * 
         ,[ledger_start_transaction_id]
         ,[ledger_end_transaction_id]
         ,[ledger_start_sequence_number]
         ,[ledger_end_sequence_number]
   FROM [Account].[Balance] 
   GO
   
   SELECT * FROM [<Your unique history table name>]
   GO 
   
   SELECT * FROM Account.Balance_Ledger
   ORDER BY ledger_transaction_id
   GO
   ```

   > [!TIP]
   > We recommend that you query the history of changes through the [ledger view](ledger-updatable-ledger-tables.md#ledger-view) and not the [history table](ledger-updatable-ledger-tables.md#history-table).

1. `Nick`'s account balance was successfully updated in the updatable ledger table to `100`.
1. The history table now shows the previous balance of `50` for `Nick`.
1. The ledger view shows that updating the ledger table is a `DELETE` of the original row with `50`. The balance with a corresponding `INSERT` of a new row with `100` shows the new balance for `Nick`.

   :::image type="content" source="media/ledger/sql-updatable-how-to-3.png" alt-text="Screenshot that shows ledger table example 3.":::


## Next steps

- [Database ledger](ledger-database-ledger.md)
- [Digest management and database verification](ledger-digest-management-and-database-verification.md) 
- [Updatable ledger tables](ledger-updatable-ledger-tables.md)
- [Append-only ledger tables](ledger-append-only-ledger-tables.md) 
- [Create and use append-only ledger tables](ledger-how-to-append-only-ledger-tables.md) 
- [Access the digests stored in Azure Confidential Ledger (ACL)](ledger-how-to-access-acl-digest.md)
- [Verify a ledger table to detect tampering](ledger-verify-database.md)
