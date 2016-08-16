<properties
	pageTitle="Enable Stretch Database for a table | Microsoft Azure"
	description="Learn how to configure a table for Stretch Database."
	services="sql-server-stretch-database"
	documentationCenter=""
	authors="douglaslMS"
	manager=""
	editor=""/>

<tags
	ms.service="sql-server-stretch-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/05/2016"
	ms.author="douglasl"/>

# Enable Stretch Database for a table

To configure a table for Stretch Database, select **Stretch | Enable** for a table in SQL Server Management Studio to open the **Enable Table for Stretch** wizard. You can also use Transact\-SQL to enable Stretch Database on an existing table, or to create a new table with Stretch Database enabled.

-   If you store cold data in a separate table, you can migrate the entire table.

-   If your table contains both hot and cold data, you can specify a filter function to select the rows to migrate.

**Prerequisites**. If you select **Stretch | Enable** for a table, and you have not yet enabled Stretch Database for the database, the wizard first configures the database for Stretch Database. Follow the steps in [Get started by running the Enable Database for Stretch Wizard](sql-server-stretch-database-wizard.md) instead of the steps in this topic.

**Permissions**. Enabling Stretch Database on a database or a table requires db\_owner permissions. Enabling Stretch Database on  a table also requires ALTER permissions on the table.

 >   [AZURE.NOTE] Later, if you disable Stretch Database, remember that disabling Stretch Database for a table or for a database does not delete the remote object. If you want to delete the remote table or the remote database, you have to drop it by using the Azure management portal. The remote objects continue to incur Azure costs until you delete them manually.
 
## <a name="EnableWizardTable"></a>Use the wizard to enable Stretch Database on a table
**Launch the wizard**

1.  In SQL Server Management Studio, in Object Explorer, select the table on which you want to enable Stretch.

2.  Right\-click and select **Stretch**, and then select **Enable** to launch the wizard.

**Introduction**

Review the purpose of the wizard and the prerequisites.

**Select database tables**

Confirm that the table you want to enable is displayed and selected.

You can migrate an entire table or you can specify a simple filter function in the wizard. If you want to use a different type of filter function to select rows to migrate, do one of the following things.

-   Exit the wizard and run the ALTER TABLE statement to enable Stretch for the table and to specify a filter function.

-   Run the ALTER TABLE statement to specify a filter function after you exit the wizard. For the required steps, see [Add a filter function after running the Wizard](sql-server-stretch-database-predicate-function.md#addafterwiz).

The ALTER TABLE syntax is described later in this topic.

**Summary**

Review the values that you entered and the options that you selected in the wizard. Then select **Finish** to enable Stretch.

**Results**

Review the results.

## <a name="EnableTSQLTable"></a>Use Transact\-SQL to enable Stretch Database on a table
You can enable Stretch Database for an existing table or create a new table with Stretch Database enabled by using Transact-SQL.

### Options
Use the following options when you run CREATE TABLE or ALTER TABLE to enable Stretch Database on a table.

-   Optionally, use the `FILTER_PREDICATE = <function>` clause to specify a function to select rows to migrate if the table contains both hot and cold data. The predicate must call an inline table\-valued function. For more info, see [Select rows to migrate by using a filter function](sql-server-stretch-database-predicate-function.md). If you don't specify a filter function, the entire table is migrated.

    >   [AZURE.NOTE] If you provide a filter function that performs poorly, data migration also performs poorly. Stretch Database applies the filter function to the table by using the CROSS APPLY operator.

-   Specify `MIGRATION_STATE = OUTBOUND` to start data migration immediately or  `MIGRATION_STATE = PAUSED` to postpone the start of data migration.

### Enable Stretch Database for an existing table
To configure an existing table for Stretch Database, run the ALTER TABLE command.

Here's an example that migrates the entire table and begins data migration immediately.

```tsql
USE <Stretch-enabled database name>;
GO
ALTER TABLE <table name>  
    SET ( REMOTE_DATA_ARCHIVE = ON ( MIGRATION_STATE = OUTBOUND ) ) ;  
GO
```
Here's an example that migrates only the rows identified by the `dbo.fn_stretchpredicate` inline table\-valued function and postpones data migration. For more info about the filter function, see [Select rows to migrate by using a filter function](sql-server-stretch-database-predicate-function.md).

```tsql
USE <Stretch-enabled database name>;
GO
ALTER TABLE <table name>  
    SET ( REMOTE_DATA_ARCHIVE = ON (  
        FILTER_PREDICATE = dbo.fn_stretchpredicate(),  
        MIGRATION_STATE = PAUSED ) ) ;  
 GO
```

For more info, see [ALTER TABLE (Transact-SQL)](https://msdn.microsoft.com/library/ms190273.aspx).

### Create a new table with Stretch Database enabled
To create a new table with Stretch Database enabled, run the CREATE TABLE command.

Here's an example that migrates the entire table and begins data migration immediately.

```tsql
USE <Stretch-enabled database name>;
GO
CREATE TABLE <table name>
    ( ... )  
    WITH ( REMOTE_DATA_ARCHIVE = ON ( MIGRATION_STATE = OUTBOUND ) ) ;  
GO
```

Here's an example that migrates only the rows identified by the `dbo.fn_stretchpredicate` inline table\-valued function and postpones data migration. For more info about the filter function, see [Select rows to migrate by using a filter function](sql-server-stretch-database-predicate-function.md).

```tsql
USE <Stretch-enabled database name>;
GO
CREATE TABLE <table name>
    ( ... )  
    WITH ( REMOTE_DATA_ARCHIVE = ON (  
        FILTER_PREDICATE = dbo.fn_stretchpredicate(),  
        MIGRATION_STATE = PAUSED ) ) ;  
GO  
```

For more info, see [CREATE TABLE (Transact-SQL)](https://msdn.microsoft.com/library/ms174979.aspx).


## See also

[ALTER TABLE (Transact-SQL)](https://msdn.microsoft.com/library/ms190273.aspx)

[CREATE TABLE (Transact-SQL)](https://msdn.microsoft.com/library/ms174979.aspx)
