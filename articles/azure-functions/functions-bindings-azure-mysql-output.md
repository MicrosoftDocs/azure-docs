---
title: Azure Database for MySQL output binding for Functions
description: Learn to use the Azure Database for MySQL output binding in Azure Functions.
author: JetterMcTedder
ms.topic: reference
ms.custom: build-2023, devx-track-extended-java, devx-track-js, devx-track-python, devx-track-ts
ms.date: 6/26/2024
ms.author: bspendolini
ms.reviewer: glenga
zone_pivot_groups: programming-languages-set-functions
---

# Azure Database for MySQL output binding for Azure Functions (Preview)

The Azure Database for MySQL output binding lets you write to a database.

For information on setup and configuration details, see the [overview](./functions-bindings-azure-mysql.md).

::: zone pivot="programming-language-javascript,programming-language-typescript"
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
::: zone-end

## Examples
<a id="example"></a>

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro-with-csx](../../includes/functions-bindings-csharp-intro-with-csx.md)]

[!INCLUDE [functions-in-process-model-retirement-note](../../includes/functions-in-process-model-retirement-note.md)]

# [Isolated worker model](#tab/isolated-process)

More samples for the Azure Database for MySQL output binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples).

This section contains the following example:

* [HTTP trigger, write one record](#http-trigger-write-one-record-c-oop)

The examples refer to a `Product` class and a corresponding database table:

```csharp
namespace AzureMySqlSamples.Common
{
    public class Product
    {
        public int? ProductId { get; set; }

        public string Name { get; set; }

        public int Cost { get; set; }

        public override bool Equals(object obj)
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

<a id="http-trigger-write-one-record-c-oop"></a>

### HTTP trigger, write one record

The following example shows a [C# function](functions-dotnet-class-library.md) that adds a record to a database, using data provided in an HTTP POST request as a JSON body.

```cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.MySql;
using Microsoft.Azure.Functions.Worker.Http;
using AzureMySqlSamples.Common;

namespace AzureMySqlSamples.OutputBindingSamples
{
    public static class AddProduct
    {
        [FunctionName(nameof(AddProduct))]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "addproduct")]
            [FromBody] Product prod,
            [MySql("Products", "MySqlConnectionString")] out Product product)
        {
            product = prod;
            return new CreatedResult($"/api/addproduct", product);
        }
    }
}
```

# [In-process model](#tab/in-process)

More samples for the Azure Database for MySQL output binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples/samples-csharp).

This section contains the following example:

* [HTTP trigger, write one record](#http-trigger-write-one-record-c)

The examples refer to a `Product` class and a corresponding database table:

```csharp
namespace AzureMySqlSamples.Common
{
    public class Product
    {
        public int? ProductId { get; set; }

        public string Name { get; set; }

        public int Cost { get; set; }

        public override bool Equals(object obj)
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

<a id="http-trigger-write-one-record-c"></a>

### HTTP trigger, write one record

The following example shows a [C# function](functions-dotnet-class-library.md) that adds a record to a database, using data provided in an HTTP POST request as a JSON body.

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.MySql;
using AzureMySqlSamples.Common;

namespace AzureMySqlSamples.OutputBindingSamples
{
    public static class AddProduct
    {
        [FunctionName(nameof(AddProduct))]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "addproduct")]
            [FromBody] Product prod,
            [MySql("Products", "MySqlConnectionString")] out Product product)
        {
            product = prod;
            return new CreatedResult($"/api/addproduct", product);
        }
    }
}
```


---

::: zone-end

::: zone pivot="programming-language-java"

More samples for the Azure Database for MySQL output binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples/samples-java).

This section contains the following example:

* [HTTP trigger, write a record to a table](#http-trigger-write-record-to-table-java)

The examples refer to a `Product` class  and a corresponding database table:

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

```sql
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
	ProductId int PRIMARY KEY,
	Name varchar(100) NULL,
	Cost int NULL
);
```

<a id="http-trigger-write-record-to-table-java"></a>
### HTTP trigger, write a record to a table

The following example shows a MySQL output binding in a Java function that adds a record to a table, using data provided in an HTTP POST request as a JSON body. The function takes an additional dependency on the [com.google.code.gson](https://github.com/google/gson) library to parse the JSON body.

```xml
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.10.1</version>
</dependency>
```

```java
package com.function;

import com.microsoft.azure.functions.HttpMethod;
import com.microsoft.azure.functions.HttpRequestMessage;
import com.microsoft.azure.functions.HttpResponseMessage;
import com.microsoft.azure.functions.HttpStatus;
import com.microsoft.azure.functions.OutputBinding;
import com.microsoft.azure.functions.annotation.AuthorizationLevel;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.azure.functions.annotation.HttpTrigger;
import com.microsoft.azure.functions.mysql.annotation.MySqlOutput;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.function.Common.Product;

import java.io.IOException;
import java.util.Optional;

public class AddProduct {
    @FunctionName("AddProduct")
    public HttpResponseMessage run(
            @HttpTrigger(
                name = "req",
                methods = {HttpMethod.POST},
                authLevel = AuthorizationLevel.ANONYMOUS,
                route = "addproduct")
                HttpRequestMessage<Optional<String>> request,
            @MySqlOutput(
                name = "product",
                commandText = "Products",
                connectionStringSetting = "MySqlConnectionString")
                OutputBinding<Product> product) throws JsonParseException, JsonMappingException, IOException {

        String json = request.getBody().get();
        ObjectMapper mapper = new ObjectMapper();
        Product p = mapper.readValue(json, Product.class);
        product.setValue(p);

        return request.createResponseBuilder(HttpStatus.OK).header("Content-Type", "application/json").body(product).build();
    }
}
```

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-typescript"

More samples for the Azure Database for MySQL output binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples).

This section contains the following example:

* [HTTP trigger, write records to a table](#http-trigger-write-records-to-table-javascript)

The examples refer to a database table:

```sql
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
	ProductId int PRIMARY KEY,
	Name varchar(100) NULL,
	Cost int NULL
);
```

<a id="http-trigger-write-records-to-table-javascript"></a>
### HTTP trigger, write records to a table

The following example shows a MySQL output binding that adds records to a table, using data provided in an HTTP POST request as a JSON body.

::: zone-end

::: zone pivot="programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

```typescript
const { app, output } = require('@azure/functions');

const mysqlOutput = output.generic({
    type: 'mysql',
    commandText: 'Products',
    connectionStringSetting: 'MySqlConnectionString'
})

// Upsert the product, which will insert it into the Products table if the primary key (ProductId) for that item doesn't exist.
// If it does then update it to have the new name and cost.
app.http('AddProduct', {
    methods: ['POST'],
    authLevel: 'anonymous',
    extraOutputs: [mysqlOutput],
    handler: async (request, context) => {
        // Note that this expects the body to be a JSON object or array of objects which have a property
        // matching each of the columns in the table to upsert to.
        const product = await request.json();
        context.extraOutputs.set(mysqlOutput, product);

        return {
            status: 201,
            body: JSON.stringify(product)
        };
    }
});
```

# [Model v3](#tab/nodejs-v3)

TypeScript samples aren't documented for model v3.

---

::: zone-end

::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

```javascript
const { app, output } = require('@azure/functions');

const mysqlOutput = output.generic({
    type: 'mysql',
    commandText: 'Products',
    connectionStringSetting: 'MySqlConnectionString'
})

// Upsert the product, which will insert it into the Products table if the primary key (ProductId) for that item doesn't exist.
// If it does then update it to have the new name and cost.
app.http('AddProduct', {
    methods: ['POST'],
    authLevel: 'anonymous',
    extraOutputs: [mysqlOutput],
    handler: async (request, context) => {
        // Note that this expects the body to be a JSON object or array of objects which have a property
        // matching each of the columns in the table to upsert to.
        const product = await request.json();
        context.extraOutputs.set(mysqlOutput, product);

        return {
            status: 201,
            body: JSON.stringify(product)
        };
    }
});
```


# [Model v3](#tab/nodejs-v3)

The following example is binding data in the function.json file:

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "name": "req",
      "direction": "in",
      "type": "httpTrigger",
      "methods": [
        "post"
      ],
      "route": "addproduct"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "product",
      "type": "mysql",
      "direction": "out",
      "commandText": "Products",
      "connectionStringSetting": "MySqlConnectionString"
    }
  ],
  "disabled": false
}
```

The [configuration](#configuration) section explains these properties.

The following example is sample JavaScript code:

```javascript
module.exports = async function (context, req, product) {
    context.log('JavaScript HTTP trigger and MySQL output binding function processed a request.');
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        mimetype: "application/json",
        body: product
    };
}
```
---

::: zone-end

::: zone pivot="programming-language-powershell"

More samples for the Azure Database for MySQL output binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples/samples-powershell).

This section contains the following example:

* [HTTP trigger, write records to a table](#http-trigger-write-records-to-table-powershell)

The examples refer to a database table:

```sql
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
	ProductId int PRIMARY KEY,
	Name varchar(100) NULL,
	Cost int NULL
);
```

<a id="http-trigger-write-records-to-table-powershell"></a>
### HTTP trigger, write records to a table

The following example shows a MySQL output binding in a function.json file and a PowerShell function that adds records to a table, using data provided in an HTTP POST request as a JSON body.

The following example is binding data in the function.json file:

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "name": "Request",
      "direction": "in",
      "type": "httpTrigger",
      "methods": [
        "post"
      ],
      "route": "addproduct"
    },
    {
      "name": "response",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "product",
      "type": "mysql",
      "direction": "out",
      "commandText": "Products",
      "connectionStringSetting": "MySqlConnectionString"
    }
  ],
  "disabled": false
}
```

The [configuration](#configuration) section explains these properties.

The following example is sample PowerShell code for the function in the `run.ps1` file:

```powershell
using namespace System.Net

# Trigger binding data passed in via param block
param($Request, $TriggerMetadata)

# Write to the Azure Functions log stream.
Write-Host "PowerShell function with MySql Output Binding processed a request."

# Note that this expects the body to be a JSON object or array of objects 
# which have a property matching each of the columns in the table to upsert to.
$req_body = $Request.Body

# Assign the value we want to pass to the MySql Output binding. 
# The -Name value corresponds to the name property in the function.json for the binding
Push-OutputBinding -Name product -Value $req_body

# Assign the value to return as the HTTP response. 
# The -Name value matches the name property in the function.json for the binding
Push-OutputBinding -Name response -Value ([HttpResponseContext]@{
    StatusCode = [HttpStatusCode]::OK
    Body = $req_body
})
```

::: zone-end  


::: zone pivot="programming-language-python"  

More samples for the Azure Database for MySQL output binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples/samples-python).

This section contains the following example:

* [HTTP trigger, write records to a table](#http-trigger-write-records-to-table-python)

The examples refer to a database table:

```sql
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
	ProductId int PRIMARY KEY,
	Name varchar(100) NULL,
	Cost int NULL
);
```

> [!NOTE]
> Please note that Azure Functions version 1.22.0b4 must be used for Python .
>


<a id="http-trigger-write-records-to-table-python"></a>
### HTTP trigger, write records to a table

The following example shows a MySQL output binding in a function.json file and a Python function that adds records to a table, using data provided in an HTTP POST request as a JSON body.

# [v2](#tab/python-v2)

The following example is sample python code for the function_app.py file:

```python
import json 
 
import azure.functions as func
 
app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)
@app.generic_trigger(arg_name="req", type="httpTrigger", route="addproduct")
@app.generic_output_binding(arg_name="$return", type="http")
@app.generic_output_binding(arg_name="r", type="mysql",
                            command_text="Products",
                            connection_string_setting="MySqlConnectionString")
def mysql_output(req: func.HttpRequest, r: func.Out[func.MySqlRow]) \
        -> func.HttpResponse:
    body = json.loads(req.get_body())
    row = func.MySqlRow.from_dict(body)
    r.set(row)
 
    return func.HttpResponse(
        body=req.get_body(),
        status_code=201,
        mimetype="application/json"
    )
```

# [v1](#tab/python-v1)

The following example is binding data in the function.json file:

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "function",
      "name": "req",
      "direction": "in",
      "type": "httpTrigger",
      "methods": [
        "post"
      ],
      "route": "addproduct"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "product",
      "type": "mysql",
      "direction": "out",
      "commandText": "Products",
      "connectionStringSetting": "MySqlConnectionString"
    }
  ],
  "disabled": false
}
```

The [configuration](#configuration) section explains these properties.

The following example is sample Python code:

```python
import json
import azure.functions as func

def main(req: func.HttpRequest, product: func.Out[func.MySqlRow]) -> func.HttpResponse:
    """Upsert the product, which will insert it into the Products table if the primary key
    (ProductId) for that item doesn't exist. If it does then update it to have the new name
    and cost.
    """

    # Note that this expects the body to be a JSON object which
    # have a property matching each of the columns in the table to upsert to.
    body = json.loads(req.get_body())
    row = func.MySqlRow.from_dict(body)
    product.set(row)

    return func.HttpResponse(
        body=req.get_body(),
        status_code=201,
        mimetype="application/json"
    )
```

---

::: zone-end


::: zone pivot="programming-language-csharp"
## Attributes 

The [C# library](functions-dotnet-class-library.md) uses the MySqlAttribute attribute to declare the MySQL bindings on the function, which has the following properties:

| Attribute property |Description|
|---------|---------|
| **CommandText** | Required. The name of the table being written to by the binding.  |
| **ConnectionStringSetting** | Required. The name of an app setting that contains the connection string for the database to which data is being written. This isn't the actual connection string and must instead resolve to an environment variable. | 


::: zone-end  

::: zone pivot="programming-language-java"  
## Annotations

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@MySQLOutput` annotation on parameters whose value would come from Azure Database for MySQL. This annotation supports the following elements:

| Element |Description|
|---------|---------|
| **commandText** | Required. The name of the table being written to by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database to which data is being written. This isn't the actual connection string and must instead resolve to an environment variable.| 
|**name** |  Required. The unique name of the function binding. | 

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-typescript"

## Configuration

# [Model v4](#tab/nodejs-v4)

The following table explains the properties that you can set on the `options` object passed to the `output.generic()` method.

| Property | Description |
|---------|----------------------|
| **commandText** | Required. The name of the table being written to by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database to which data is being written. This isn't the actual connection string and must instead resolve to an environment variable. |

# [Model v3](#tab/nodejs-v3)

The following table explains the binding configuration properties that you set in the *function.json* file.

| Property | Description |
|---------|----------------------|
|**type** | Required. Must be set to `Mysql`.|
|**direction** | Required. Must be set to `out`. |
|**name** | Required. The name of the variable that represents the entity in function code. | 
| **commandText** | Required. The name of the table being written to by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database to which data is being written. This isn't the actual connection string and must instead resolve to an environment variable. |

---

::: zone-end

::: zone pivot="programming-language-powershell,programming-language-python"
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|----------------------|
|**type** | Required. Must be set to `Mysql`.|
|**direction** | Required. Must be set to `out`. |
|**name** | Required. The name of the variable that represents the entity in function code. | 
| **commandText** | Required. The name of the table being written to by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database to which data is being written. This isn't the actual connection string and must instead resolve to an environment variable. |

::: zone-end  

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

> [!NOTE]
>The output binding supports all special characters including ($, `, -, _) . It is same as mentioned in mysql community [documentation](https://dev.mysql.com/doc/refman/8.0/en/identifiers.html)
>
>It is on different programming language if special character is supported to define members attributes containing special characters. For example, C# have few limitations to define [variables](/dotnet/csharp/fundamentals/coding-style/identifier-names)
>
>Apart from that, the output binding covering all special characters can be done using 'JObject'. The detailed example can be followed in this [GitHub link](https://github.com/Azure/azure-functions-mysql-extension/blob/main/samples/samples-csharp/OutputBindingSamples/AddProductJObject.cs)
>

## Usage

The `CommandText` property is the name of the table where the data is to be stored. The connection string setting name corresponds to the application setting that contains the connection string to Azure Database for MySQL.

If an exception occurs when a MySQL output binding is executed then the function code stop executing. This may result in an error code being returned, such as an HTTP trigger returning a 500 error code.  

## Next steps

- [Read data from a database (Input binding)](./functions-bindings-azure-mysql-input.md)

