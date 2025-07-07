---
title: Azure Database for MySQL Trigger Binding for Functions
description: Learn how to use the Azure Database for MySQL trigger binding in Azure Functions.
author: JetterMcTedder
ms.topic: reference
ms.custom:
  - build-2023
  - devx-track-extended-java
  - devx-track-js
  - devx-track-python
  - ignite-2023
ms.date: 6/26/2024
ms.author: bspendolini
ms.reviewer: glenga
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Database for MySQL trigger binding for Azure Functions (preview)

> [!NOTE]
> Although input and output bindings are supported on all plans, Azure Database for MySQL trigger binding is available only on [Dedicated and Premium plans](functions-scale.md) during the preview.

Azure Database for MySQL trigger bindings monitor the user table for changes (inserts and updates) and invoke the function with updated row data.

Azure Database for MySQL trigger bindings use `az_func_updated_at` and column data to monitor the user table for changes. As such, you need to alter the table structure to allow change tracking on the MySQL table before you use the trigger support. You can enable the change tracking on a table through the following query. For example, enable it on the `Products` table:

```sql
ALTER TABLE Products
ADD az_func_updated_at TIMESTAMP DEFAULT 
CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

The table for leases contains all columns that correspond to the primary key from the user table and three more columns: `az_func_AttemptCount`, `az_func_LeaseExpirationTime`, and `az_func_SyncCompletedTime`. If any of the primary key columns have the same name, the result is an error message that lists conflicts. In this case, the listed primary key columns must be renamed for the trigger to work.

## Functionality overview

When the trigger function starts, it initiates two separate loops: the change polling loop and the lease renewal loop. These loops run continuously until the function is stopped.

The Azure Database for MySQL trigger binding uses the polling loop to check for changes. The polling loop triggers the user function when it detects changes. At a high level, the loop looks like this example:

```
while (true) {
    1. Get list of changes on table - up to a maximum number controlled by the MySql_Trigger_MaxBatchSize setting
    2. Trigger function with list of changes
    3. Wait for delay controlled by MySql_Trigger_PollingIntervalMs setting
}
```

Changes are processed in the order that they're made. The oldest changes are processed first. Consider these points about change processing:

- If changes occur in multiple rows at once, the exact order in which they're sent to the function is based on the ascending order of the `az_func_updated_at` column and primary key columns.
- Changes are batched for a row. If multiple changes occur in a row between each iteration of the loop, only the latest change entry that exists for that row is considered.

> [!NOTE]
> Currently, managed identities aren't supported for connections between Azure Functions and Azure Database for MySQL.

::: zone pivot="programming-language-csharp"

## Example usage
<a id="example"></a>

# [Isolated worker model](#tab/isolated-process)

More samples for the Azure Database for MySQL trigger are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples).

The example refers to a `Product` class and a corresponding database table:

```csharp
namespace AzureMySqlSamples.Common
{
    public class Product
    {
        public int? ProductId { get; set; }

        public string Name { get; set; }

        public int Cost { get; set; }

        public override bool Equals(object obj)
        {
            if (obj is Product)
            {
                var that = obj as Product;
                return this.ProductId == that.ProductId && this.Name == that.Name && this.Cost == that.Cost;
            }
            return false;
        }
    }
```

```sql
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
  ProductId int PRIMARY KEY,
  Name varchar(100) NULL,
  Cost int NULL
);
```

You enable change tracking on the database by adding one column to the table:

```sql
ALTER TABLE <table name>  
ADD COLUMN az_func_updated_at TIMESTAMP 
DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP;
```

The Azure Database for MySQL trigger binds to `IReadOnlyList<MySqlChange<T>>`, which lists `MySqlChange` objects. Each object has two properties:

- `Item`: The item that was changed. The type of the item should follow the table schema, as seen in the `ToDoItem` class.
- `Operation`: A value from the `MySqlChangeOperation` enumeration. The possible value is `Update` for both inserts and updates.

The following example shows a [C# function](functions-dotnet-class-library.md) that's invoked when changes occur in the `Product` table:

```cs
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.MySql;
using Microsoft.Extensions.Logging;
using AzureMySqlSamples.Common;

namespace AzureMySqlSamples.TriggerBindingSamples
{
        private static readonly Action<ILogger, string, Exception> _loggerMessage = LoggerMessage.Define<string>(LogLevel.Information, eventId: new EventId(0, "INFO"), formatString: "{Message}");

        [Function(nameof(ProductsTrigger))]
        public static void Run(
            [MySqlTrigger("Products", "MySqlConnectionString")]
            IReadOnlyList<MySqlChange<Product>> changes, FunctionContext context)
        {
            ILogger logger = context.GetLogger("ProductsTrigger");
            // The output is used to inspect the trigger binding parameter in test methods.
            foreach (MySqlChange<Product> change in changes)
            {
                Product product = change.Item;
                _loggerMessage(logger, $"Change operation: {change.Operation}", null);
                _loggerMessage(logger, $"Product Id: {product.ProductId}, Name: {product.Name}, Cost: {product.Cost}", null);
            }
        }
}
```

# [In-process model](#tab/in-process)

More samples for the Azure Database for MySQL trigger are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples/samples-csharp).

The example refers to a `Product` class and a corresponding database table:

```csharp
namespace AzureMySqlSamples.Common
{
    public class Product
    {
        public int? ProductId { get; set; }

        public string Name { get; set; }

        public int Cost { get; set; }

        public override bool Equals(object obj)
        {
            if (obj is Product)
            {
                var that = obj as Product;
                return this.ProductId == that.ProductId && this.Name == that.Name && this.Cost == that.Cost;
            }
            return false;
        }
    }
```

```sql
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
  ProductId int PRIMARY KEY,
  Name varchar(100) NULL,
  Cost int NULL
);
```

You enable change tracking on the database by adding one column to the table:

```sql
ALTER TABLE <table name>  
ADD COLUMN az_func_updated_at TIMESTAMP 
DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP;
```

The Azure Database for MySQL trigger binds to `IReadOnlyList<MySqlChange<T>>`, which lists `MySqlChange` objects. Each object has two properties:

- `Item`: The item that was changed. The type of the item should follow the table schema, as seen in the `Product` class.
- `Operation`: A value from the `MySqlChangeOperation` enumeration. The possible value is `Update` for both inserts and updates.

The following example shows a [C# function](functions-dotnet-class-library.md) that's invoked when changes occur in the `Products` table:

```cs
using System.Collections.Generic;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.MySql;
using Microsoft.Extensions.Logging; 
using AzureMySqlSamples.Common; 

namespace AzureMySqlSamples.TriggerBindingSamples
{
    public static class ProductsTrigger
    {
        [FunctionName(nameof(ProductsTrigger))]
        public static void Run(
            [MySqlTrigger("Products", "MySqlConnectionString")]
            IReadOnlyList<MySqlChange<Product>> changes,
            ILogger logger)
        {
            // The output is used to inspect the trigger binding parameter in test methods.
            foreach (MySqlChange<Product> change in changes)
            {
                Product product = change.Item;
                logger.LogInformation($"Change operation: {change.Operation}");
                logger.LogInformation($"Product Id: {product.ProductId}, Name: {product.Name}, Cost: {product.Cost}");
            }
        }
    }
}
```

---

::: zone-end

::: zone pivot="programming-language-java"

## Example usage
<a id="example"></a>

More samples for the Azure Database for MySQL trigger are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples/samples-java).

The example refers to a `Product` class, a `MySqlChangeProduct` class, a `MySqlChangeOperation` enumeration, and a corresponding database table.

In a separate file named Product.java:

```java
package com.function.Common;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Product {
    @JsonProperty("ProductId")
    private int ProductId;
    @JsonProperty("Name")
    private String Name;
    @JsonProperty("Cost")
    private int Cost;

    public Product() {
    }

    public Product(int productId, String name, int cost) {
        ProductId = productId;
        Name = name;
        Cost = cost;
    }
}
```

In a separate file named MySqlChangeProduct.java:

```java
package com.function.Common;

public class MySqlChangeProduct {
    private MySqlChangeOperation Operation;
    private Product Item;

    public MySqlChangeProduct() {
    }

    public MySqlChangeProduct(MySqlChangeOperation operation, Product item) {
        this.Operation = operation;
        this.Item = item;
    }
}
```

In a separate file named MySqlChangeOperation.java:

```java
package com.function.Common;

import com.google.gson.annotations.SerializedName;

public enum MySqlChangeOperation {
    @SerializedName("0")
    Update
}
```

```sql
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
  ProductId int PRIMARY KEY,
  Name varchar(100) NULL,
  Cost int NULL
);
```

You enable change tracking on the database by adding the following column to the table:

```sql
ALTER TABLE <table name>  
ADD COLUMN az_func_updated_at TIMESTAMP 
DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP;
```

The Azure Database for MySQL trigger binds to `MySqlChangeProduct[]`, which is an array of `MySqlChangeProduct` objects. Each object has two properties:

- `item`: The item that was changed. The type of the item should follow the table schema, as seen in the `Product` class.
- `operation`: A value from the `MySqlChangeOperation` enumeration. The possible value is `Update` for both inserts and updates.

The following example shows a Java function that's invoked when changes occur in the `Product` table:

```java
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

package com.function;

import com.microsoft.azure.functions.ExecutionContext;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.azure.functions.mysql.annotation.MySqlTrigger;
import com.function.Common.MySqlChangeProduct;
import com.google.gson.Gson;

import java.util.logging.Level;

public class ProductsTrigger {
    @FunctionName("ProductsTrigger")
    public void run(
            @MySqlTrigger(
                name = "changes",
                tableName = "Products",
                connectionStringSetting = "MySqlConnectionString")
                MySqlChangeProduct[] changes,
            ExecutionContext context) {

        context.getLogger().log(Level.INFO, "MySql Changes: " + new Gson().toJson(changes));
    }
}
```

::: zone-end

::: zone pivot="programming-language-powershell"

## Example usage
<a id="example"></a>

More samples for the Azure Database for MySQL trigger are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples/samples-powershell).

The example refers to a `Product` database table:

```sql
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
  ProductId int PRIMARY KEY,
  Name varchar(100) NULL,
  Cost int NULL
);
```

You enable change tracking on the database by adding one column to the table:

```sql
ALTER TABLE <table name>  
ADD COLUMN az_func_updated_at TIMESTAMP 
DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP;
```

The Azure Database for MySQL trigger binds to `Product`, which lists objects. Each object has two properties:

- `item`: The item that was changed. The structure of the item follows the table schema.
- `operation`: The possible value is `Update` for both inserts and updates.

The following example shows a PowerShell function that's invoked when changes occur in the `Product` table.

The following example is binding data in the function.json file:

```json
{
    "bindings": [
      {
        "name": "changes",
        "type": "mysqlTrigger",
        "direction": "in",
        "tableName": "Products",
        "connectionStringSetting": "MySqlConnectionString"
      }
    ],
    "disabled": false
  }
```

The [Configuration](#configuration) section explains these properties.

The following example is sample PowerShell code for the function in the run.ps1 file:

```powershell
using namespace System.Net

param($changes)
# The output is used to inspect the trigger binding parameter in test methods.
# Use -Compress to remove new lines and spaces for testing purposes.
$changesJson = $changes | ConvertTo-Json -Compress
Write-Host "MySql Changes: $changesJson"
```

::: zone-end

::: zone pivot="programming-language-javascript"

## Example usage
<a id="example"></a>

More samples for the Azure Database for MySQL trigger are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples/samples-js).

The example refers to a `Product` database table:

```sql
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
  ProductId int PRIMARY KEY,
  Name varchar(100) NULL,
  Cost int NULL
);
```

You enable change tracking on the database by adding one column to the table:

```sql
ALTER TABLE <table name>  
ADD COLUMN az_func_updated_at TIMESTAMP 
DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP;
```

The Azure Database for MySQL trigger binds to `Changes`, which is an array of objects. Each object has two properties:

- `item`: The item that was changed. The structure of the item follows the table schema.
- `operation`: The possible value is `Update` for both inserts and updates.

The following example shows a JavaScript function that's invoked when changes occur in the `Product` table.

The following example is binding data in the function.json file:

```json
{
    "bindings": [
      {
        "name": "changes",
        "type": "mysqlTrigger",
        "direction": "in",
        "tableName": "Products",
        "connectionStringSetting": "MySqlConnectionString",
      }
    ],
    "disabled": false
  }
```

The [Configuration](#configuration) section explains these properties.

The following example is sample JavaScript code for the function in the `index.js` file:

```javascript
module.exports = async function (context, changes) {
    context.log(`MySql Changes: ${JSON.stringify(changes)}`)
}
```

::: zone-end

::: zone pivot="programming-language-python"

## Example usage
<a id="example"></a>

More samples for the Azure Database for MySQL trigger are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples/samples-python).

The example refers to a `Product` database table:

```sql
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
  ProductId int PRIMARY KEY,
  Name varchar(100) NULL,
  Cost int NULL
);
```

You enable change tracking on the database by adding one column to the table:

```sql
ALTER TABLE <table name>  
ADD COLUMN az_func_updated_at TIMESTAMP 
DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP;
```

> [!NOTE]
> You must use Azure Functions version 1.22.0b4 for Python.

The Azure Database for MySQL trigger binds to a variable named `Product`, which lists objects. Each object has two properties:

- `item`: The item that was changed. The structure of the item follows the table schema.
- `operation`: The possible value is `Update` for both inserts and updates.

The following example shows a Python function that's invoked when changes occur in the `Product` table.

# [v2](#tab/python-v2)

The following example is sample Python code for the function_app.py file:

```python
import json
import logging
import azure.functions as func

app = func.FunctionApp()

# The function is triggered when a change (insert, update)
# is made to the Products table.
@app.function_name(name="ProductsTrigger")
@app.mysql_trigger(arg_name="products",
table_name="Products",
connection_string_setting="MySqlConnectionString")

def products_trigger(products: str) -> None:
logging.info("MySQL Changes: %s", json.loads(products))
```

# [v1](#tab/python-v1)

The following example is binding data in the function.json file:

```json
{
    "bindings": [
      {
        "name": "changes",
        "type": "mysqlTrigger",
        "direction": "in",
        "tableName": "Products",
        "connectionStringSetting": "MySqlConnectionString"
      }
    ],
    "disabled": false
  }
```

The [Configuration](#configuration) section explains these properties.

The following example is sample Python code for the function in the init.py file:

```python
import json
import logging

def main(changes):
    logging.info("MySql Changes: %s", json.loads(changes))
```

---

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes

| Attribute property |Description|
|---------|---------|
| `TableName` | Required. The name of the table that the trigger monitors.  |
| `ConnectionStringSetting` | Required. The name of an app setting that contains the connection string for the database that contains the table monitored for changes. The name of the connection string setting corresponds to the application setting (in local.settings.json for local development) that contains the [connection string](https://dev.mysql.com/doc/connector-net/en/connector-net-connections-string.html) to Azure Database for MySQL.|
| `LeasesTableName` | Optional. The name of the table for storing leases. If it's not specified, the name is `Leases_{FunctionId}_{TableId}`.|

::: zone-end

::: zone pivot="programming-language-java"  

## Annotations

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@MySQLTrigger` annotation on parameters whose values would come from Azure Database for MySQL. This annotation supports the following elements:

| Element |Description|
|---------|---------|
| `name` | Required. The name of the parameter that the trigger binds to. |
| `tableName` | Required. The name of the table that the trigger monitors.  |
| `connectionStringSetting` | Required. The name of an app setting that contains the connection string for the database that contains the table monitored for changes. The name of the connection string setting corresponds to the application setting (in local.settings.json for local development) that contains the [connection string](https://dev.mysql.com/doc/connector-net/en/connector-net-connections-string.html) to Azure Database for MySQL.|
| `LeasesTableName` | Optional. The name of the table for storing leases. If it's not specified, the name is `Leases_{FunctionId}_{TableId}`.|

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  

## Configuration

The following table explains the binding configuration properties that you set in the function.json file:

|Property | Description|
|---------|----------------------|
| `name` | Required. The name of the parameter that the trigger binds to. |
| `type` | Required. Must be set to `MysqlTrigger`. |
| `direction` | Required. Must be set to `in`. |
| `tableName` | Required. The name of the table that the trigger monitors.  |
| `connectionStringSetting` | Required. The name of an app setting that contains the connection string for the database that contains the table monitored for changes. The name of the connection string setting corresponds to the application setting (in local.settings.json for local development) that contains the [connection string](https://dev.mysql.com/doc/connector-net/en/connector-net-connections-string.html) to Azure Database for MySQL.|
| `LeasesTableName` | Optional. The name of the table for storing leases. If it's not specified, the name is `Leases_{FunctionId}_{TableId}`.|

::: zone-end

## Optional configuration

You can configure the following optional settings for the Azure Database for MySQL trigger for local development or for cloud deployments.

### host.json

[!INCLUDE [app settings to local.settings.json](../../includes/functions-host-json-section-intro.md)]

| Setting | Default| Description|
|---------|---------|---------|
|`MaxBatchSize` | `100` |The maximum number of changes processed with each iteration of the trigger loop before they're sent to the triggered function.|
|`PollingIntervalMs` | `1000` | The delay in milliseconds between processing each batch of changes. (1,000 ms is 1 second.)|
|`MaxChangesPerWorker`| `1000` | The upper limit on the number of pending changes in the user table that are allowed per application worker. If the count of changes exceeds this limit, it might result in a scale-out. The setting applies only for Azure function apps with [runtime-driven scaling enabled](#enable-runtime-driven-scaling).|

#### Example host.json file

Here's an example host.json file with the optional settings:

```JSON
{
  "version": "2.0",
  "extensions": {
      "MySql": {
        "MaxBatchSize": 300,
        "PollingIntervalMs": 1000,
        "MaxChangesPerWorker": 100
      }
  },
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true,
        "excludedTypes": "Request"
      }
    },
    "logLevel": {
      "default": "Trace"
    }
  }
}
```

### local.setting.json

The local.settings.json file stores app settings and settings that local development tools use. Settings in the local.settings.json file are used only when you're running your project locally. When you publish your project to Azure, be sure to also add any required settings to the app settings for the function app.

> [!IMPORTANT]  
> Because the local.settings.json file might contain secrets, such as connection strings, you should never store it in a remote repository. Tools that support Azure Functions provide ways to synchronize settings in the local.settings.json file with the [app settings](functions-how-to-use-azure-function-app-settings.md#settings) in the function app to which your project is deployed.

| Setting | Default| Description|
|---------|---------|---------|
|`MySql_Trigger_BatchSize` | `100` |The maximum number of changes processed with each iteration of the trigger loop before they're sent to the triggered function.|
|`MySql_Trigger_PollingIntervalMs` | `1000` | The delay in milliseconds between processing each batch of changes. (1,000 ms is 1 second.)|
|`MySql_Trigger_MaxChangesPerWorker`| `1000` | The upper limit on the number of pending changes in the user table that are allowed per application worker. If the count of changes exceeds this limit, it might result in a scale-out. The setting applies only for Azure function apps with [runtime-driven scaling enabled](#enable-runtime-driven-scaling).|

#### Example local.settings.json file

Here's an example local.settings.json file with the optional settings:

```JSON
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet",
    "MySqlConnectionString": "",
    "MySql_Trigger_MaxBatchSize": 300,
    "MySql_Trigger_PollingIntervalMs": 1000,
    "MySql_Trigger_MaxChangesPerWorker": 100
  }
}
```

## Set up change tracking (required)

Setting up change tracking for use with the Azure Database for MySQL trigger requires you to add a column in a table by using a function. You can complete these steps from any MySQL tool that supports running queries, including [Visual Studio Code](/sql/tools/visual-studio-code/mssql-extensions) or [Azure Data Studio](/azure-data-studio/download-azure-data-studio).

Azure Database for MySQL trigger bindings use `az_func_updated_at` and column data to monitor the user table for changes. As such, you need to alter the table structure to allow change tracking on the MySQL table before you use the trigger support. You can enable the change tracking on a table through the following query. For example, enable it on the `Products` table:

```sql
ALTER TABLE Products;
ADD az_func_updated_at 
TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP;
```

The table for leases contains all columns that correspond to the primary key from the user table and two more columns: `az_func_AttemptCount` and `az_func_LeaseExpirationTime`. If any of the primary key columns have the same name, the result is an error message that lists conflicts. In this case, the listed primary key columns must be renamed for the trigger to work.

## Enable runtime-driven scaling

Optionally, your functions can scale automatically based on the number of changes that are pending to be processed in the user table. To allow your functions to scale properly on the Premium plan when you're using Azure Database for MySQL triggers, you need to enable runtime scale monitoring.

[!INCLUDE [functions-runtime-scaling](../../includes/functions-runtime-scaling.md)]

## Retry support

### Startup retries

If an exception occurs during startup, the host runtime automatically attempts to restart the trigger listener with an exponential backoff strategy. These retries continue until either the listener is successfully started or the startup is canceled.

### Function exception retries

If an exception occurs in the user function during change processing, the batch of rows currently being processed is retried again in 60 seconds. Other changes are processed as normal during this time, but the rows in the batch that caused the exception are ignored until the time-out period elapses.

If the function execution fails five consecutive times for a particular row, that row is ignored for all future changes. Because the rows in a batch aren't deterministic, rows in a failed batch might end up in different batches in subsequent invocations. This behavior means that not all rows in the failed batch are necessarily ignored. If other rows in the batch caused the exception, the "good" rows might end up in a different batch that doesn't fail in future invocations.

## Related content

- [Read data from a database (input binding)](./functions-bindings-azure-mysql-input.md)
- [Save data to a database (output binding)](./functions-bindings-azure-mysql-output.md)
