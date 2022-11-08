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

The Azure SQL trigger uses [SQL change tracking](/sql/relational-databases/track-changes/about-change-tracking-sql-server) functionality to monitor the user table for changes.  When a change is detected, the trigger fires and the function is executed.

For information on setup and configuration details for change tracking for use with the Azure SQL trigger, see [Setting up change tracking](#setting-up-change-tracking) and the [SQL binding overview](./functions-bindings-azure-sql.md).

## Example
<a id="example"></a>

::: zone pivot="programming-language-csharp"

More samples for the Azure SQL trigger are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-csharp).

# [In-process](#tab/in-process)

The example refers to a `ToDoItem` class and a corresponding database table:

:::code language="csharp" source="~/functions-sql-todo-sample/ToDoModel.cs" range="6-14":::

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::

The following example shows a [C# function](functions-dotnet-class-library.md) that is invoked when there are changes to the `ToDo` table:

```cs
using System.Collections.Generic;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.WebJobs.Extensions.Sql;

namespace Company.Function
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


In [C# class libraries](functions-dotnet-class-library.md), use the [SqlTrigger](https://github.com/Azure/azure-functions-sql-extension/blob/main/src/TriggerBinding/SqlTriggerAttribute.cs) attribute, which has the following properties:

| Attribute property |Description|
|---------|---------|
|---------|---------|
| **TableName** | Required. The name of the table being written to by the binding.  |
| **ConnectionStringSetting** | Required. The name of an app setting that contains the connection string for the database to which data is being written. The connection string setting name corresponds to the application setting (in `local.settings.json` for local development) that contains the [connection string](/dotnet/api/microsoft.data.sqlclient.sqlconnection.connectionstring?view=sqlclient-dotnet-core-5.0&preserve-view=true#Microsoft_Data_SqlClient_SqlConnection_ConnectionString) to the Azure SQL or SQL Server instance.| 


::: zone-end

<!-- ### for another day ###
::: zone pivot="programming-language-java,programming-language-powershell,programming-language-javascript,programming-language-python"  
## Configuration

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|

::: zone-end -->

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Setting up change tracking

Setting up change tracking for use with the Azure SQL trigger requires two steps that are completed by executing queries on the SQL database:

1. Enable change tracking on the SQL database, substituting `your database name` with the name of the database where the table to be monitored is located:

    ```sql
    ALTER DATABASE ['your database name']
    SET CHANGE_TRACKING = ON
    (CHANGE_RETENTION = 2 DAYS, AUTO_CLEANUP = ON);
    ```

    The `CHANGE_RETENTION` option specifies the time period for which change tracking information (change history) is kept.  This may affect the trigger functionality. For example, if the user application is turned off for several days and then resumed, it will only be able to catch the changes that occurred in past two days with the above query.

    The `AUTO_CLEANUP` option is used to enable or disable the clean-up task that removes old change tracking information. In the event of a temporary problem that prevents the trigger from running, this can be useful to pause the removal of information older than the retention period until the problem is resolved.

    More information on change tracking options is available [here](/sql/relational-databases/track-changes/enable-and-disable-change-tracking-sql-server).

2. Enable change tracking on the table, substituting `your table name` with the name to be monitored:

    ```sql
    ALTER TABLE [dbo].[your table name]
    ENABLE CHANGE_TRACKING;
    ```

    The trigger needs to have read access on the table being monitored for changes as well as to the change tracking system tables. Each function trigger will have associated change tracking table and leases table in a schema `az_func`, which are created by the trigger if they do not yet exist.  More information on these data structures are available in the Azure SQL binding library [documentation](https://github.com/Azure/azure-functions-sql-extension/blob/triggerbindings/README.md#internal-state-tables].

