---
title: Azure Database for MySQL trigger for Functions
description: Learn to use the Azure Database for MySQL trigger in Azure Functions.
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

# Azure Database for MySQL trigger for Functions

> [!NOTE]
> While input and output bindings will be supported on all plans, the MySQL Trigger binding will be available only on [dedicated and premium plans](functions-scale.md) during the public preview. Support for Consumption plans in the MySQL Trigger binding will be introduced at general availability.
> 

The Azure Database for MySQL trigger creates a new column to monitor when a row is created, or deleted. The Trigger bindings monitor the user table for changes (inserts, updates) and invokes the function with updated row data.

Azure MySQL Trigger bindings use "az_func_updated_at" and column's data, to monitor the user table for changes. As such, it is necessary to alter the table structure to allow change tracking on the MySQL table before using the trigger support. The change tracking can be enabled on a table through following query. For example, enable on ‘Products’ table:

```sql
ALTER TABLE Products
ADD az_func_updated_at TIMESTAMP DEFAULT 
CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

The leases table contains all columns corresponding to the primary key from the user table and two additional columns _az_func_AttemptCount and _az_func_LeaseExpirationTime. So, if any of the primary key columns happen to have the same name, that will result in an error message listing any conflicts. In this case, the listed primary key columns must be renamed for the trigger to work.


## Functionality Overview

When the trigger function starts, it will initiate two separate loops (Change Polling Loop and Lease Renewal Loop) that will run continuously until the function is stopped.

The Azure Database for MySQL trigger binding uses a polling loop to check for changes, triggering the user function when changes are detected. At a high level, the loop looks like this:

```
while (true) {
    1. Get list of changes on table - up to a maximum number controlled by the MySql_Trigger_MaxBatchSize setting
    2. Trigger function with list of changes
    3. Wait for delay controlled by MySql_Trigger_PollingIntervalMs setting
}
```

Changes are processed in the order that they were made, with the oldest changes being processed first. A couple notes about change processing:
1. If changes to multiple rows are made at once the exact order that they are sent to the function is based on order by the “az_func_updated_at” column’s data in increasing order.
2. Changes are "batched" together for a row. If multiple changes are made to a row between each iteration of the loop, then only the latest change entry exists for that row will be considered.

> [!NOTE]
>Trigger Binding with table name containing alphanuemric & _(underscore) are supported. Apart from that Trigger Binding doesn't support any other special characters like (-, * $).
>


::: zone pivot="programming-language-csharp"

## Example usage
<a id="example"></a>


# [Isolated worker model](#tab/isolated-process)

More samples for the Azure Database for MySQL trigger are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples).


The example refers to a `Product` class and a corresponding database table:

```csharp
namespace Microsoft.Azure.WebJobs.Extensions.MySql.Samples.Common
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


Change tracking is enabled on the database by adding one column to the table:

```sql
ALTER TABLE <table name>  
ADD COLUMN az_func_updated_at TIMESTAMP 
DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP;
```

The MySQL trigger binds to a `IReadOnlyList<MySqlChange<T>>`, a list of `MySqlChange` objects each with two properties:
- **Item:** the item that was changed. The type of the item should follow the table schema as seen in the `ToDoItem` class.
- **Operation:** a value from `MySqlChangeOperation` enum. The possible values is `Update` for both insert and update.

The following example shows a [C# function](functions-dotnet-class-library.md) that is invoked when there are changes to the `Product` table:

```cs
using System.Collections.Generic;
using Microsoft.Azure.WebJobs.Extensions.MySql.Samples.Common;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Microsoft.Azure.WebJobs.Extensions.MySql.Samples.TriggerBindingSamples
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
            logger.LogInformation("MySQL Changes: " + JsonConvert.SerializeObject(changes));
        }
    }
}
```


# [In-process model](#tab/in-process)


More samples for the Azure Database for MySQL trigger are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples/samples-csharp).


The example refers to a `Product` class and a corresponding database table:

```csharp
namespace Microsoft.Azure.WebJobs.Extensions.MySql.Samples.Common
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

Change tracking is enabled on the database by adding one column to the table:

```sql
ALTER TABLE <table name>  
ADD COLUMN az_func_updated_at TIMESTAMP 
DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP;
```

The MySQL trigger binds to a `IReadOnlyList<MySqlChange<T>>`, a list of `MySqlChange` objects each with two properties:
- **Item:** the item that was changed. The type of the item should follow the table schema as seen in the `Product` class.
- **Operation:** a value from `MySqlChangeOperation` enum. The possible values is `Update` for both insert and update.

The following example shows a [C# function](functions-dotnet-class-library.md) that is invoked when there are changes to the `Products` table:

```cs
using System.Collections.Generic;
using Microsoft.Azure.WebJobs.Extensions.MySql.Samples.Common;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Microsoft.Azure.WebJobs.Extensions.MySql.Samples.TriggerBindingSamples
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
            logger.LogInformation("MySQL Changes: " + JsonConvert.SerializeObject(changes));
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


The example refers to a `Product` class, a `MySqlChangeProduct` class, a `MySqlChangeOperation` enum, and a corresponding database table:

In a separate file `Product.java`:

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

In a separate file `MySqlChangeProduct.java`:
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

In a separate file `MySqlChangeOperation.java`:
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


Change tracking is enabled on the database by adding the below column to the table:

```sql
ALTER TABLE <table name>  
ADD COLUMN az_func_updated_at TIMESTAMP 
DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP;
```

The MySQL trigger binds to a `MySqlChangeProduct[]`, an array of `MySqlChangeProduct` objects each with two properties:
- **item:** the item that was changed. The type of the item should follow the table schema as seen in the `Product` class.
- **operation:** a value from `MySqlChangeOperation` enum. The possible values is `Update` for both insert and update.


The following example shows a Java function that is invoked when there are changes to the `Product` table:

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

Change tracking is enabled on the database by adding one column to the table:

```sql
ALTER TABLE <table name>  
ADD COLUMN az_func_updated_at TIMESTAMP 
DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP;
```

The MySQL trigger binds to `Product`, a list of objects each with two properties:
- **item:** the item that was changed. The structure of the item will follow the table schema.
- **operation:** The possible values is `Update` for both insert and update.


The following example shows a PowerShell function that is invoked when there are changes to the `Product` table.

The following is binding data in the function.json file:

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


The [configuration](#configuration) section explains these properties.

The following is sample PowerShell code for the function in the `run.ps1` file:

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

Change tracking is enabled on the database by adding one column to the table:

```sql
ALTER TABLE <table name>  
ADD COLUMN az_func_updated_at TIMESTAMP 
DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP;
```

The MySQL trigger binds `Changes`, an array of objects each with two properties:
- **item:** the item that was changed. The structure of the item will follow the table schema.
- **operation:** The possible values is `Update` for both insert and update.


The following example shows a JavaScript function that is invoked when there are changes to the `Product` table.

The following is binding data in the function.json file:

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


The [configuration](#configuration) section explains these properties.

The following is sample JavaScript code for the function in the `index.js` file:

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

Change tracking is enabled on the database by adding one column to the table:

```sql
ALTER TABLE <table name>  
ADD COLUMN az_func_updated_at TIMESTAMP 
DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP;
```

The MySQL trigger binds to a variable `Product`, a list of objects each with two properties:
- **item:** the item that was changed. The structure of the item will follow the table schema.
- **operation:** The possible values is `Update` for both insert and update.


The following example shows a Python function that is invoked when there are changes to the `Product` table.

# [v2](#tab/python-v2)

The following is sample python code for the function_app.py file:

```python
import json
 
import azure.functions as func
 
app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)
 
@app.generic_trigger(arg_name="changes", type="mysqlTrigger",
                     table_name="Products",
                     connection_string_setting="AzureWebJobsMySqlConnectionString")
@app.generic_output_binding(arg_name="r", type="mysql",
                            command_text="Products1",
                            connection_string_setting="AzureWebJobsMySqlConnectionString")
def mysql_trigger(changes, r: func.Out[func.MySqlRow]) -> str:
    row = func.MySqlRow.from_dict(json.loads(changes)[0]["Item"])
    r.set(row)
    return "OK"
```

# [v1](#tab/python-v1)


The following is binding data in the function.json file:

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


The [configuration](#configuration) section explains these properties.

The following is sample Python code for the function in the `__init__.py` file:

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
| **TableName** | Required. The name of the table monitored by the trigger.  |
| **ConnectionStringSetting** | Required. The name of an app setting that contains the connection string for the database containing the table monitored for changes. The connection string setting name corresponds to the application setting (in `local.settings.json` for local development) that contains the [connection string](https://dev.mysql.com/doc/refman/8.4/en/connecting-using-uri-or-key-value-pairs.html) to the Azure Database for MySQL.|
| **LeasesTableName** | Optional. Name of the table used to store leases. If not specified, the leases table name will be Leases_{FunctionId}_{TableId}. 


::: zone-end



::: zone pivot="programming-language-java"  
## Annotations

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@MySQLTrigger` annotation (`com.microsoft.azure.functions.sql.annotation.SQLTrigger`) on parameters whose value would come from Azure Database for MySQL. This annotation supports the following elements:

| Element |Description|
|---------|---------|
| **name** | Required. The name of the parameter that the trigger binds to. |
| **tableName** | Required. The name of the table monitored by the trigger.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database containing the table monitored for changes. The connection string setting name corresponds to the application setting (in `local.settings.json` for local development) that contains the [connection string](https://dev.mysql.com/doc/refman/8.4/en/connecting-using-uri-or-key-value-pairs.html) to the Azure Database for MySQL.|
| **LeasesTableName** | Optional. Name of the table used to store leases. If not specified, the leases table name will be Leases_{FunctionId}_{TableId}. 

::: zone-end


::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  
## Configuration

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
| **name** | Required. The name of the parameter that the trigger binds to. |
| **type** | Required. Must be set to `MysqlTrigger`. |
| **direction** | Required. Must be set to `in`. |
| **tableName** | Required. The name of the table monitored by the trigger.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database containing the table monitored for changes. The connection string setting name corresponds to the application setting (in `local.settings.json` for local development) that contains the [connection string](https://dev.mysql.com/doc/refman/8.4/en/connecting-using-uri-or-key-value-pairs.html) to the Azure Database for MySQL.|
| **LeasesTableName** | Optional. Name of the table used to store leases. If not specified, the leases table name will be Leases_{FunctionId}_{TableId}. 
::: zone-end

## Optional Configuration

The following optional settings can be configured for the MySQL trigger for local development or for cloud deployments.

### host.json

[!INCLUDE [app settings to local.settings.json](../../includes/functions-host-json-section-intro.md)]

| Setting | Default| Description|
|---------|---------|---------|
|**MaxBatchSize** | 100 |The maximum number of changes processed with each iteration of the trigger loop before being sent to the triggered function.|
|**PollingIntervalMs** | 1000 | The delay in milliseconds between processing each batch of changes. (1000 ms is 1 second)|
|**MaxChangesPerWorker**| 1000 | The upper limit on the number of pending changes in the user table that are allowed per application-worker. If the count of changes exceeds this limit, it might result in a scale-out. The setting only applies for Azure Function Apps with [runtime driven scaling enabled](#enable-runtime-driven-scaling).|

#### Example host.json file

Here is an example host.json file with the optional settings:

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

The local.settings.json file stores app settings and settings used by local development tools. Settings in the local.settings.json file are used only when you're running your project locally. When you publish your project to Azure, be sure to also add any required settings to the app settings for the function app.

> [!IMPORTANT]  
> Because the local.settings.json may contain secrets, such as connection strings, you should never store it in a remote repository. Tools that support Functions provide ways to synchronize settings in the local.settings.json file with the [app settings](functions-how-to-use-azure-function-app-settings.md#settings) in the function app to which your project is deployed.

| Setting | Default| Description|
|---------|---------|---------|
|**MySql_Trigger_BatchSize** | 100 |The maximum number of changes processed with each iteration of the trigger loop before being sent to the triggered function.|
|**MySql_Trigger_PollingIntervalMs** | 1000 | The delay in milliseconds between processing each batch of changes. (1000 ms is 1 second)|
|**MySql_Trigger_MaxChangesPerWorker**| 1000 | The upper limit on the number of pending changes in the user table that are allowed per application-worker. If the count of changes exceeds this limit, it might result in a scale-out. The setting only applies for Azure Function Apps with [runtime driven scaling enabled](#enable-runtime-driven-scaling).|

#### Example local.settings.json file

Here is an example local.settings.json file with the optional settings:

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

Setting up change tracking for use with the Azure Database for MySQL trigger requires to add a column in table using a function.  These steps can be completed from any MySQL tool that supports running queries, including [Visual Studio Code](/sql/tools/visual-studio-code/mssql-extensions) or [Azure Data Studio](/azure-data-studio/download-azure-data-studio).

Azure Database for MySQL Trigger ndings use "az_func_updated_at" and column's data, to monitor the user table for changes. As such, it is necessary to alter the table structure to allow change tracking on the MySQL table before using the trigger support.

The change tracking can be enabled on a table through following query. For example, enable on ‘Products’ table:

    ```sql
    ALTER TABLE Products;
    ADD az_func_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
    ```
The leases table contains all columns corresponding to the primary key from the user table and two additional columns _az_func_AttemptCount and _az_func_LeaseExpirationTime. So, if any of the primary key columns happen to have the same name, that will result in an error message listing any conflicts. In this case, the listed primary key columns must be renamed for the trigger to work.


## Enable runtime-driven scaling

Optionally, your functions can scale automatically based on the number of changes that are pending to be processed in the user table. To allow your functions to scale properly on the Premium plan when using MySQL triggers, you need to enable runtime scale monitoring.

[!INCLUDE [functions-runtime-scaling](../../includes/functions-runtime-scaling.md)]

## Retry support

### Startup retries
If an exception occurs during startup then the host runtime automatically attempts to restart the trigger listener with an exponential backoff strategy. These retries continue until either the listener is successfully started or the startup is canceled.

### Function exception retries
If an exception occurs in the user function when processing changes then the batch of rows currently being processed are retried again in 60 seconds. Other changes are processed as normal during this time, but the rows in the batch that caused the exception are ignored until the timeout period has elapsed.

If the function execution fails five times in a row for a given row then that row is completely ignored for all future changes. Because the rows in a batch are not deterministic, rows in a failed batch might end up in different batches in subsequent invocations. This means that not all rows in the failed batch will necessarily be ignored. If other rows in the batch were the ones causing the exception, the "good" rows might end up in a different batch that doesn't fail in future invocations.

## Next steps

- [Read data from a database (Input binding)](./functions-bindings-azure-mysql-input.md)
- [Save data to a database (Output binding)](./functions-bindings-azure-mysql-output.md)
