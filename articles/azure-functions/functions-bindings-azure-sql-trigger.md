---
title: Azure SQL trigger for Functions
description: Learn to use the Azure SQL trigger in Azure Functions.
author: dzsquared
ms.topic: reference
ms.date: 11/10/2022
ms.author: drskwier
ms.reviewer: glenga
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure SQL trigger for Functions (preview)

> [!NOTE]
> The Azure SQL trigger is only supported on **Premium and Dedicated** plans. Consumption is not supported.

The Azure SQL trigger uses [SQL change tracking](/sql/relational-databases/track-changes/about-change-tracking-sql-server) functionality to monitor a SQL table for changes and trigger a function when a row is created, updated, or deleted.

For configuration details for change tracking for use with the Azure SQL trigger, see [Set up change tracking](#set-up-change-tracking-required). For information on setup details of the Azure SQL extension for Azure Functions, see the [SQL binding overview](./functions-bindings-azure-sql.md).

## Example usage
<a id="example"></a>

::: zone pivot="programming-language-csharp"

More samples for the Azure SQL trigger are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-csharp).


The example refers to a `ToDoItem` class and a corresponding database table:

:::code language="csharp" source="~/functions-sql-todo-sample/ToDoModel.cs" range="6-16":::

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::

[Change tracking](#set-up-change-tracking-required) is enabled on the database and on the table:

```sql
ALTER DATABASE [SampleDatabase]
SET CHANGE_TRACKING = ON
(CHANGE_RETENTION = 2 DAYS, AUTO_CLEANUP = ON);

ALTER TABLE [dbo].[ToDo]
ENABLE CHANGE_TRACKING;
```

The SQL trigger binds to a `IReadOnlyList<SqlChange<T>>`, a list of `SqlChange` objects each with 2 properties:
- **Item:** the item that was changed. The type of the item should follow the table schema as seen in the `ToDoItem` class.
- **Operation:** a value from `SqlChangeOperation` enum. The possible values are `Insert`, `Update`, and `Delete`.

# [In-process](#tab/in-process)

The following example shows a [C# function](functions-dotnet-class-library.md) that is invoked when there are changes to the `ToDo` table:

```cs
using System.Collections.Generic;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.WebJobs.Extensions.Sql;

namespace AzureSQL.ToDo
{
    public static class ToDoTrigger
    {
        [FunctionName("ToDoTrigger")]
        public static void Run(
            [SqlTrigger("[dbo].[ToDo]", ConnectionStringSetting = "SqlConnectionString")]
            IReadOnlyList<SqlChange<ToDoItem>> changes,
            ILogger logger)
        {
            foreach (SqlChange<ToDoItem> change in changes)
            {
                ToDoItem toDoItem = change.Item;
                logger.LogInformation($"Change operation: {change.Operation}");
                logger.LogInformation($"Id: {toDoItem.Id}, Title: {toDoItem.title}, Url: {toDoItem.url}, Completed: {toDoItem.completed}");
            }
        }
    }
}
```

# [Isolated process](#tab/isolated-process)

Isolated worker process isn't currently supported.

<!-- Uncomment to support C# script examples.
# [C# Script](#tab/csharp-script)

-->
---


::: zone-end

::: zone pivot="programming-language-java,programming-language-powershell,programming-language-javascript,programming-language-python"

> [!NOTE]
> In the current preview, Azure SQL triggers are only supported by [C# class library functions](functions-dotnet-class-library.md)

::: zone-end


::: zone pivot="programming-language-csharp"
## Attributes 

The [C# library](functions-dotnet-class-library.md) uses the [SqlTrigger](https://github.com/Azure/azure-functions-sql-extension/blob/main/src/TriggerBinding/SqlTriggerAttribute.cs) attribute to declare the SQL trigger on the function, which has the following properties:

| Attribute property |Description|
|---------|---------|
| **TableName** | Required. The name of the table being monitored by the trigger.  |
| **ConnectionStringSetting** | Required. The name of an app setting that contains the connection string for the database which contains the table being monitored for changes. The connection string setting name corresponds to the application setting (in `local.settings.json` for local development) that contains the [connection string](/dotnet/api/microsoft.data.sqlclient.sqlconnection.connectionstring?view=sqlclient-dotnet-core-5.&preserve-view=true#Microsoft_Data_SqlClient_SqlConnection_ConnectionString) to the Azure SQL or SQL Server instance.| 


::: zone-end

## Configuration

<!-- ### for another day ###
::: zone pivot="programming-language-java,programming-language-powershell,programming-language-javascript,programming-language-python"  


The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|

::: zone-end -->


In addition to the required ConnectionStringSetting [application setting](./functions-how-to-use-azure-function-app-settings.md#settings), the following optional settings can be configured for the SQL trigger:

| App Setting | Description|
|---------|---------|
|**Sql_Trigger_BatchSize** |This controls the number of changes processed at once before being sent to the triggered function. The default value is 100.|
|**Sql_Trigger_PollingIntervalMs**|This controls the delay in milliseconds between processing each batch of changes. The default value is 1000 (1 second).|
|**Sql_Trigger_MaxChangesPerWorker**|This controls the upper limit on the number of pending changes in the user table that are allowed per application-worker. If the count of changes exceeds this limit, it may result in a scale out. The setting only applies for Azure Function Apps with [runtime driven scaling enabled](#enable-runtime-driven-scaling). The default value is 1000.|


[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Set up change tracking (required)

Setting up change tracking for use with the Azure SQL trigger requires two steps.  These steps can be completed from any SQL tool that supports running queries, including [VS Code](/sql/tools/visual-studio-code/mssql-extensions), [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio) or [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms).

1. Enable change tracking on the SQL database, substituting `your database name` with the name of the database where the table to be monitored is located:

    ```sql
    ALTER DATABASE [your database name]
    SET CHANGE_TRACKING = ON
    (CHANGE_RETENTION = 2 DAYS, AUTO_CLEANUP = ON);
    ```

    The `CHANGE_RETENTION` option specifies the time period for which change tracking information (change history) is kept.  The retention of change history by the SQL database may affect the trigger functionality. For example, if the Azure Function is turned off for several days and then resumed, it will only be able to catch the changes that occurred in past two days with the above query.

    The `AUTO_CLEANUP` option is used to enable or disable the clean-up task that removes old change tracking information. If a temporary problem that prevents the trigger from running, turning off auto cleanup can be useful to pause the removal of information older than the retention period until the problem is resolved.

    More information on change tracking options is available in the [SQL documentation](/sql/relational-databases/track-changes/enable-and-disable-change-tracking-sql-server).

2. Enable change tracking on the table, substituting `your table name` with the name of the table to be monitored (changing the schema if appropriate):

    ```sql
    ALTER TABLE [dbo].[your table name]
    ENABLE CHANGE_TRACKING;
    ```

    The trigger needs to have read access on the table being monitored for changes and to the change tracking system tables. Each function trigger will have associated change tracking table and leases table in a schema `az_func`, which are created by the trigger if they don't yet exist.  More information on these data structures is available in the Azure SQL binding library [documentation](https://github.com/Azure/azure-functions-sql-extension/blob/triggerbindings/README.md#internal-state-tables).


## Enable runtime-driven scaling

Optionally, your functions can scale automatically based on the amount of changes that are pending to be processed in the user table. To allow your functions to scale properly on the Premium plan when using SQL triggers, you need to enable runtime scale monitoring.

[!INCLUDE [functions-runtime-scaling](../../includes/functions-runtime-scaling.md)]


## Next steps

- [Read data from a database (Input binding)](./functions-bindings-azure-sql-input.md)
- [Save data to a database (Output binding)](./functions-bindings-azure-sql-output.md)