---
title: Azure Database for MySQL input binding for Functions
description: Learn to use the Azure Database for MySQL input binding in Azure Functions.
author: JetterMcTedder
ms.topic: reference
ms.custom: build-2023, devx-track-extended-java, devx-track-js, devx-track-python, devx-track-ts
ms.date: 9/26/2024
ms.author: bspendolini
ms.reviewer: glenga
zone_pivot_groups: programming-languages-set-functions
---

# Azure Database for MySQL input binding for Azure Functions (Preview)

When a function runs, the Azure Database for MySQL input binding retrieves data from a database and passes it to the input parameter of the function. 

For information on setup and configuration details, see the [overview](./functions-bindings-azure-mysql.md).

::: zone pivot="programming-language-javascript,programming-language-typescript"
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
::: zone-end

## Examples
<a id="example"></a>

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro-with-csx](../../includes/functions-bindings-csharp-intro-with-csx.md)]


# [Isolated worker model](#tab/isolated-process)

More samples for the Azure Database for MySQL input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples).

This section contains the following examples:

* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-c-oop)
* [HTTP trigger, get multiple rows from route data](#http-trigger-get-multiple-items-from-route-data-c-oop)
* [HTTP trigger, delete rows](#http-trigger-delete-one-or-multiple-rows-c-oop)

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


<a id="http-trigger-look-up-id-from-query-string-c-oop"></a>
### HTTP trigger, get row by ID from query string

The following example shows a C# function that retrieves a single record. The function is [triggered by an HTTP request](./functions-bindings-http-webhook-trigger.md) that uses a query string to specify the ID. That ID is used to retrieve a `Product` record with the specified query.

> [!NOTE]
> The HTTP query string parameter is case-sensitive.
>

```cs
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.MySql;
using Microsoft.Azure.Functions.Worker.Http;
using AzureMySqlSamples.Common;

namespace AzureMySqlSamples.InputBindingIsolatedSamples
{
    public static class GetProductById
    {
        [Function(nameof(GetProductById))]
        public static IEnumerable<Product> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "getproducts/{productId}")]
            HttpRequestData req,
            [MySqlInput("select * from Products where ProductId = @productId",
                "MySqlConnectionString",
                parameters: "@ProductId={productId}")]
            IEnumerable<Product> products)
        {
            return products;
        }
    }
}
```

<a id="http-trigger-get-multiple-items-from-route-data-c-oop"></a>
### HTTP trigger, get multiple rows from route parameter

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves rows returned by the query. The function is [triggered by an HTTP request](./functions-bindings-http-webhook-trigger.md) that uses route data to specify the value of a query parameter. That parameter is used to filter the `Product` records in the specified query.

```cs
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.MySql;
using Microsoft.Azure.Functions.Worker.Http;
using AzureMySqlSamples.Common;
 
namespace AzureMySqlSamples.InputBindingIsolatedSamples
{
    public static class GetProducts
    {
        [Function(nameof(GetProducts))]
        public static IEnumerable<Product> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "getproducts")]
            HttpRequestData req,
            [MySqlInput("select * from Products",
                "MySqlConnectionString")]
            IEnumerable<Product> products)
        {
            return products;
        }
    }
}
```

<a id="http-trigger-delete-one-or-multiple-rows-c-oop"></a>
### HTTP trigger, delete rows

The following example shows a [C# function](functions-dotnet-class-library.md) that executes a stored procedure with input from the HTTP request query parameter.

The stored procedure `DeleteProductsCost` must be created on the MySQL database. In this example, the stored procedure deletes a single record or all records depending on the value of the parameter.

```sql
DROP PROCEDURE IF EXISTS DeleteProductsCost;

Create Procedure DeleteProductsCost(cost INT)
BEGIN
	DELETE from Products where Products.cost = cost;
END
```

```cs
namespace AzureMySqlSamples.InputBindingSamples
{
    public static class GetProductsStoredProcedure
    {
        [FunctionName(nameof(GetProductsStoredProcedure))]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "getproducts-storedprocedure/{cost}")]
            HttpRequest req,
            [MySql("DeleteProductsCost",
                "MySqlConnectionString",
                commandType: System.Data.CommandType.StoredProcedure,
                parameters: "@Cost={cost}")]
            IEnumerable<Product> products)
        {
            return new OkObjectResult(products);
        }
    }
}
```

# [In-process model](#tab/in-process)

More samples for the Azure Database for MySQL input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples/samples-csharp).

This section contains the following examples:

* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-c)
* [HTTP trigger, get multiple rows from route data](#http-trigger-get-multiple-items-from-route-data-c)
* [HTTP trigger, delete rows](#http-trigger-delete-one-or-multiple-rows-c)

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

<a id="http-trigger-look-up-id-from-query-string-c"></a>
### HTTP trigger, get row by ID from query string

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a single record. The function is [triggered by an HTTP](./functions-bindings-http-webhook-trigger.md) request that uses a query string to specify the ID. That ID is used to retrieve a `Product` record with the specified query.

> [!NOTE]
> The HTTP query string parameter is case-sensitive.
>

```cs
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.MySql;
using AzureMySqlSamples.Common;
 
namespace AzureMySqlSamples.InputBindingSamples
{
    public static class GetProductById
    {
        [FunctionName("GetProductById")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "getproducts/{productId}")] HttpRequest req,
            [MySql("select * from Products where ProductId = @productId",
                "MySqlConnectionString",
                parameters: "@ProductId={productId}")]
            IEnumerable<Product> products)
        {
            return new OkObjectResult(products);
        }
    }
}
```

<a id="http-trigger-get-multiple-items-from-route-data-c"></a>
### HTTP trigger, get multiple rows from route parameter

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves documents returned by the query. The function is [triggered by an HTTP](./functions-bindings-http-webhook-trigger.md) request that uses route data to specify the value of a query parameter. That parameter is used to filter the `Product` records in the specified query.

```cs
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.MySql;
using AzureMySqlSamples.Common;
 
namespace AzureMySqlSamples.InputBindingSamples
{
    public static class GetProducts
    {
        [FunctionName("GetProducts")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "getproducts")] HttpRequest req,
            [MySql("select * from Products",
                "MySqlConnectionString")]
            IEnumerable<Product> products)
        {
            return new OkObjectResult(products);
        }
    }
}
```

<a id="http-trigger-delete-one-or-multiple-rows-c"></a>
### HTTP trigger, delete rows

The following example shows a [C# function](functions-dotnet-class-library.md) that executes a stored procedure with input from the HTTP request query parameter.

The stored procedure `DeleteProductsCost` must be created on the MySQL database. In this example, the stored procedure deletes a single record or all records depending on the value of the parameter.

```sql
DROP PROCEDURE IF EXISTS DeleteProductsCost;

Create Procedure DeleteProductsCost(cost INT)
BEGIN
	DELETE from Products where Products.cost = cost;
END
```

```cs
namespace AzureMySqlSamples.InputBindingSamples
{
    public static class GetProductsStoredProcedure
    {
        [FunctionName(nameof(GetProductsStoredProcedure))]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "getproducts-storedprocedure/{cost}")]
            HttpRequest req,
            [MySql("DeleteProductsCost",
                "MySqlConnectionString",
                commandType: System.Data.CommandType.StoredProcedure,
                parameters: "@Cost={cost}")]
            IEnumerable<Product> products)
        {
            return new OkObjectResult(products);
        }
    }
}
```

---

::: zone-end

::: zone pivot="programming-language-java"


More samples for the Azure Database for MySQL input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples/samples-java).

This section contains the following examples:

* [HTTP trigger, get multiple rows](#http-trigger-get-multiple-items-java)
* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-java)
* [HTTP trigger, delete rows](#http-trigger-delete-one-or-multiple-rows-java)

The examples refer to a `Product` class and a corresponding database table:

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
```

```sql
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
	ProductId int PRIMARY KEY,
	Name varchar(100) NULL,
	Cost int NULL
);
```

<a id="http-trigger-get-multiple-items-java"></a>
### HTTP trigger, get multiple rows

The following example shows a MySQL input binding in a Java function that is [triggered by an HTTP](./functions-bindings-http-webhook-trigger.md) request and reads from a query and returns the results in the HTTP response.

```java
package com.function;

import com.function.Common.Product;
import com.microsoft.azure.functions.HttpMethod;
import com.microsoft.azure.functions.HttpRequestMessage;
import com.microsoft.azure.functions.HttpResponseMessage;
import com.microsoft.azure.functions.HttpStatus;
import com.microsoft.azure.functions.annotation.AuthorizationLevel;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.azure.functions.annotation.HttpTrigger;
import com.microsoft.azure.functions.mysql.annotation.CommandType;
import com.microsoft.azure.functions.mysql.annotation.MySqlInput;

import java.util.Optional;

public class GetProducts {
    @FunctionName("GetProducts")
    public HttpResponseMessage run(
            @HttpTrigger(
                name = "req",
                methods = {HttpMethod.GET},
                authLevel = AuthorizationLevel.ANONYMOUS,
                route = "getproducts}")
                HttpRequestMessage<Optional<String>> request,
            @MySqlInput(
                name = "products",
                commandText = "SELECT * FROM Products",
                commandType = CommandType.Text,
                connectionStringSetting = "MySqlConnectionString")
                Product[] products) {

        return request.createResponseBuilder(HttpStatus.OK).header("Content-Type", "application/json").body(products).build();
    }
}
```

<a id="http-trigger-look-up-id-from-query-string-java"></a>
### HTTP trigger, get row by ID from query string

The following example shows a MySQL input binding in a Java function that is [triggered by an HTTP](./functions-bindings-http-webhook-trigger.md) request and reads from a query filtered by a parameter from the query string and returns the row in the HTTP response.

```java
public class GetProductById {
    @FunctionName("GetProductById")
    public HttpResponseMessage run(
            @HttpTrigger(
                name = "req",
                methods = {HttpMethod.GET},
                authLevel = AuthorizationLevel.ANONYMOUS,
                route = "getproducts/{productid}")
                HttpRequestMessage<Optional<String>> request,
            @MySqlInput(
                name = "products",
                commandText = "SELECT * FROM Products WHERE ProductId= @productId",
                commandType = CommandType.Text,
                parameters = "@productId={productid}",
                connectionStringSetting = "MySqlConnectionString")
                Product[] products) {
 
        return request.createResponseBuilder(HttpStatus.OK).header("Content-Type", "application/json").body(products).build();
    }
}
```

<a id="http-trigger-delete-one-or-multiple-rows-java"></a>
### HTTP trigger, delete rows

The following example shows a MySQL input binding in a Java function that is [triggered by an HTTP](./functions-bindings-http-webhook-trigger.md) request and executes a stored procedure with input from the HTTP request query parameter.

The stored procedure `DeleteProductsCost` must be created on the database. In this example, the stored procedure deletes a single record or all records depending on the value of the parameter.

```sql
DROP PROCEDURE IF EXISTS DeleteProductsCost;

Create Procedure DeleteProductsCost(cost INT)
BEGIN
	DELETE from Products where Products.cost = cost;
END
```

```java
public class DeleteProductsStoredProcedure {
    @FunctionName("DeleteProductsStoredProcedure")
    public HttpResponseMessage run(
            @HttpTrigger(
                name = "req",
                methods = {HttpMethod.GET},
                authLevel = AuthorizationLevel.ANONYMOUS,
                route = "Deleteproducts-storedprocedure/{cost}")
                HttpRequestMessage<Optional<String>> request,
            @MySqlInput(
                name = "products",
                commandText = "DeleteProductsCost",
                commandType = CommandType.StoredProcedure,
                parameters = "@Cost={cost}",
                connectionStringSetting = "MySqlConnectionString")
                Product[] products) {

        return request.createResponseBuilder(HttpStatus.OK).header("Content-Type", "application/json").body(products).build();
    }
}
```

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

More samples for the Azure Database for MySQL input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples/samples-js).

This section contains the following examples:

* [HTTP trigger, get multiple rows](#http-trigger-get-multiple-items-javascript)
* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-javascript)
* [HTTP trigger, delete rows](#http-trigger-delete-one-or-multiple-rows-javascript)

The examples refer to a database table:

```sql
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
	ProductId int PRIMARY KEY,
	Name varchar(100) NULL,
	Cost int NULL
);
```

<a id="http-trigger-get-multiple-items-javascript"></a>
### HTTP trigger, get multiple rows

The following example shows a MYSQL input binding that is [triggered by an HTTP](./functions-bindings-http-webhook-trigger.md) request and reads from a query and returns the results in the HTTP response.

::: zone-end

::: zone pivot="programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

```typescript
import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';

const mysqlInput = input.generic({
    commandText: 'select * from Products',
    commandType: 'Text',
    connectionStringSetting: 'MySqlConnectionString',
});

export async function httpTrigger1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger and MySQL input binding function processed a request.');
    const products = context.extraInputs.get(mysqlInput);
    return {
        jsonBody: products,
    };
}

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [mysqlInput],
    handler: httpTrigger1,
});
```


# [Model v3](#tab/nodejs-v3)

TypeScript samples aren't documented for model v3.

---

::: zone-end

::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

```javascript
const { app, input } = require('@azure/functions');

const mysqlInput = input.generic({
    type: 'mysql',
    commandText: 'select * from Products where Cost = @Cost',
    parameters: '@Cost={Cost}',
    commandType: 'Text',
    connectionStringSetting: 'MySqlConnectionString'
})

app.http('GetProducts', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: 'getproducts/{cost}',
    extraInputs: [mysqlInput],
    handler: async (request, context) => {
        const products = JSON.stringify(context.extraInputs.get(mysqlInput));

        return {
            status: 200,
            body: products
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
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get"
      ],
      "route": "getproducts"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "products",
      "type": "mysql",
      "direction": "in",
      "commandText": "select * from Products",
      "commandType": "Text",
      "connectionStringSetting": "MySqlConnectionString"
    }
  ],
  "disabled": false
}
```

The [configuration](#configuration) section explains these properties.

The following example is sample JavaScript code:

```javascript
module.exports = async function (context, req, products) {
    context.log('JavaScript HTTP trigger and MySQL input binding function processed a request.');
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        mimetype: "application/json",
        body: products
    };
}
```

---

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

<a id="http-trigger-look-up-id-from-query-string-javascript"></a>
### HTTP trigger, get row by ID from query string

The following example shows a MySQL input binding that is [triggered by an HTTP](./functions-bindings-http-webhook-trigger.md) request and reads from a query filtered by a parameter from the query string and returns the row in the HTTP response.

::: zone-end
::: zone pivot="programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

```typescript
import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';

const mysqlInput = input.generic({
    commandText: 'select * from Products where ProductId= @productId',
    commandType: 'Text',
    parameters: '@productId={productid}',
    connectionStringSetting: 'MySqlConnectionString',
});

export async function httpTrigger1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger and MySQL input binding function processed a request.');
    const products = context.extraInputs.get(mysqlInput);
    return {
        jsonBody: products,
    };
}

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [mysqlInput],
    handler: httpTrigger1,
});
```

# [Model v3](#tab/nodejs-v3)

TypeScript samples aren't documented for model v3.

---

::: zone-end

::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

```javascript
const { app, input } = require('@azure/functions');

const mysqlInput = input.generic({
    type: 'mysql',
    commandText: 'select * from Products where ProductId= @productId',
    commandType: 'Text',
    parameters: '@productId={productid}',
    connectionStringSetting: 'MySqlConnectionString'
})

app.http('GetProducts', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: 'getproducts/{productid}',
    extraInputs: [mysqlInput],
    handler: async (request, context) => {
        const products = JSON.stringify(context.extraInputs.get(mysqlInput));

        return {
            status: 200,
            body: products
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
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get"
      ],
      "route": "getproducts/{productid}"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "products",
      "type": "mysql",
      "direction": "in",
      "commandText": "select * from Products where ProductId= @productId",
      "commandType": "Text",
      "parameters": "@productId={productid}",
      "connectionStringSetting": "MySqlConnectionString"
    }
  ],
  "disabled": false
}
```

The [configuration](#configuration) section explains these properties.

The following example is sample JavaScript code:

```javascript
module.exports = async function (context, req, products) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(JSON.stringify(products));
    return {
        status: 200,
        body: products
    };
}
```

---

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

<a id="http-trigger-delete-one-or-multiple-rows-javascript"></a>
### HTTP trigger, delete rows

The following example shows a MySQL input binding that is [triggered by an HTTP](./functions-bindings-http-webhook-trigger.md) request and executes a stored procedure with input from the HTTP request query parameter.

The stored procedure `DeleteProductsCost` must be created on the database. In this example, the stored procedure deletes a single record or all records depending on the value of the parameter.

```sql
DROP PROCEDURE IF EXISTS DeleteProductsCost;

Create Procedure DeleteProductsCost(cost INT)
BEGIN
	DELETE from Products where Products.cost = cost;
END
```

::: zone-end

::: zone pivot="programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

```typescript
import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';

const mysqlInput = input.generic({
    commandText: 'DeleteProductsCost',
    commandType: 'StoredProcedure',
    parameters: '@Cost={cost}',
    connectionStringSetting: 'MySqlConnectionString',
});

export async function httpTrigger1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger and MySQL input binding function processed a request.');
    const products = context.extraInputs.get(mysqlInput);
    return {
        jsonBody: products,
    };
}

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [mysqlInput],
    handler: httpTrigger1,
});
```

# [Model v3](#tab/nodejs-v3)

TypeScript samples aren't documented for model v3.

---

::: zone-end

::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

```javascript
const { app, input } = require('@azure/functions');

const mysqlInput = input.generic({
    type: 'mysql',
    commandText: 'DeleteProductsCost',
    commandType: 'StoredProcedure',
    parameters: '@Cost={cost}',
    connectionStringSetting: 'MySqlConnectionString'
})

app.http('httpTrigger1', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'DeleteProductsByCost',
    extraInputs: [mysqlInput],
    handler: async (request, context) => {
        const products = JSON.stringify(context.extraInputs.get(mysqlInput));

        return {
            status: 200,
            body: products
        };
    }
});
```

# [Model v3](#tab/nodejs-v3)

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get"
      ],
      "route": "DeleteProductsByCost"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "products",
      "type": "mysql",
      "direction": "in",
      "commandText": "DeleteProductsCost",
      "commandType": "StoredProcedure",
      "parameters": "@Cost={cost}",
      "connectionStringSetting": "MySqlConnectionString"
    }
  ],
  "disabled": false
}
```

The [configuration](#configuration) section explains these properties.

The following example is sample JavaScript code:


```javascript
module.exports = async function (context, req, products) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(JSON.stringify(products));
    return {
        status: 200,
        body: products
    };
}
```

---

::: zone-end

::: zone pivot="programming-language-powershell"

More samples for the Azure Database for MySQL input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples/samples-powershell).

This section contains the following examples:

* [HTTP trigger, get multiple rows](#http-trigger-get-multiple-items-powershell)
* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-powershell)
* [HTTP trigger, delete rows](#http-trigger-delete-one-or-multiple-rows-powershell)

The examples refer to a database table:

```sql
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
	ProductId int PRIMARY KEY,
	Name varchar(100) NULL,
	Cost int NULL
);
```

<a id="http-trigger-get-multiple-items-powershell"></a>
### HTTP trigger, get multiple rows

The following example shows a MySQL input binding in a function.json file and a PowerShell function that is [triggered by an HTTP](./functions-bindings-http-webhook-trigger.md) request and reads from a query and returns the results in the HTTP response.

The following example is binding data in the function.json file:

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "name": "Request",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get"
      ],
      "route": "getproducts/{cost}"
    },
    {
      "name": "response",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "products",
      "type": "mysql",
      "direction": "in",
      "commandText": "select * from Products",
      "commandType": "Text",
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

param($Request, $TriggerMetadata, $products)

Write-Host "PowerShell function with MySql Input Binding processed a request."

Push-OutputBinding -Name response -Value ([HttpResponseContext]@{
    StatusCode = [System.Net.HttpStatusCode]::OK
    Body = $products
})
```

<a id="http-trigger-look-up-id-from-query-string-powershell"></a>
### HTTP trigger, get row by ID from query string

The following example shows a MySQL input binding in a PowerShell function that is [triggered by an HTTP](./functions-bindings-http-webhook-trigger.md) request and reads from a query filtered by a parameter from the query string and returns the row in the HTTP response.

The following example is binding data in the function.json file:

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "name": "Request",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get"
      ],
      "route": "getproducts/{productid}"
    },
    {
      "name": "response",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "products",
      "type": "mysql",
      "direction": "in",
      "commandText": "select * from Products where ProductId= @productId",
      "commandType": "Text",
      "parameters": "MySqlConnectionString",
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

param($Request, $TriggerMetadata, $products)

Write-Host "PowerShell function with MySql Input Binding processed a request."

Push-OutputBinding -Name response -Value ([HttpResponseContext]@{
    StatusCode = [System.Net.HttpStatusCode]::OK
    Body = $products
})
```

<a id="http-trigger-delete-one-or-multiple-rows-powershell"></a>
### HTTP trigger, delete rows

The following example shows a MySQL input binding in a function.json file and a PowerShell function that is [triggered by an HTTP](./functions-bindings-http-webhook-trigger.md) request and executes a stored procedure with input from the HTTP request query parameter.

The stored procedure `DeleteProductsCost` must be created on the database. In this example, the stored procedure deletes a single record or all records depending on the value of the parameter.

```sql
DROP PROCEDURE IF EXISTS DeleteProductsCost;

Create Procedure DeleteProductsCost(cost INT)
BEGIN
	DELETE from Products where Products.cost = 'cost';
END
```

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "name": "Request",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get"
      ],
      "route": "deleteproducts-storedprocedure/{cost}"
    },
    {
      "name": "response",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "products",
      "type": "mysql",
      "direction": "in",
      "commandText": "DeleteProductsCost",
      "commandType": "StoredProcedure",
      "parameters": "@Cost={cost}",
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

param($Request, $TriggerMetadata, $products)

Write-Host "PowerShell function with MySql Input Binding processed a request."

Push-OutputBinding -Name response -Value ([HttpResponseContext]@{
    StatusCode = [System.Net.HttpStatusCode]::OK
    Body = $products
}
```

::: zone-end

::: zone pivot="programming-language-python"  

More samples for the Azure Database for MySQL input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples/samples-python).

This section contains the following examples:

* [HTTP trigger, get multiple rows](#http-trigger-get-multiple-items-python)
* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-python)
* [HTTP trigger, delete rows](#http-trigger-delete-one-or-multiple-rows-python)

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

<a id="http-trigger-get-multiple-items-python"></a>
### HTTP trigger, get multiple rows

The following example shows a MySQL input binding in a function.json file and a Python function that is [triggered by an HTTP](./functions-bindings-http-webhook-trigger.md) request and reads from a query and returns the results in the HTTP response.

# [v2](#tab/python-v2)

The following example is sample python code for the function_app.py file:

```python
import azure.functions as func
import datetime
import json
import logging
 
app = func.FunctionApp()
 
 
@app.generic_trigger(arg_name="req", type="httpTrigger", route="getproducts/{cost}")
@app.generic_output_binding(arg_name="$return", type="http")
@app.generic_input_binding(arg_name="products", type="mysql",
                           commandText= "select * from Products",
                           command_type="Text",
                           connection_string_setting="MySqlConnectionString")
def mysql_test(req: func.HttpRequest, products: func.MySqlRowList) -> func.HttpResponse:
    rows = list(map(lambda r: json.loads(r.to_json()), products))
 
    return func.HttpResponse(
        json.dumps(rows),
        status_code=200,
        mimetype="application/json"
    )
```

# [v1](#tab/python-v1)

The following example is binding data in the function.json file:

```json
{
    "bindings": [
      {
        "authLevel": "function",
        "name": "req",
        "type": "httpTrigger",
        "direction": "in",
        "methods": [
          "get"
        ],
        "route": "getproducts/{cost}"
      },
      {
        "name": "$return",
        "type": "http",
        "direction": "out"
      },
      {
        "name": "products",
        "type": "mysql",
        "direction": "in",
        "commandText": "select * from Products",
        "commandType": "Text",
        "connectionStringSetting": "MySqlConnectionString"
      }
    ],
    "disabled": false
  }
```

The [configuration](#configuration) section explains these properties.

The following is sample Python code:


```python
import azure.functions as func
import json

def main(req: func.HttpRequest, products: func.MySqlRowList) -> func.HttpResponse:
    rows = list(map(lambda r: json.loads(r.to_json()), products))

    return func.HttpResponse(
        json.dumps(rows),
        status_code=200,
        mimetype="application/json"
    ) 
```

---

<a id="http-trigger-look-up-id-from-query-string-python"></a>
### HTTP trigger, get row by ID from query string

The following example shows a MySQL input binding in a Python function that is [triggered by an HTTP](./functions-bindings-http-webhook-trigger.md) request and reads from a query filtered by a parameter from the query string and returns the row in the HTTP response.

# [v2](#tab/python-v2)

The following example is sample python code for the function_app.py file:

```python
import azure.functions as func
import datetime
import json
import logging
 
app = func.FunctionApp()
 
 
@app.generic_trigger(arg_name="req", type="httpTrigger", route="getproducts/{cost}")
@app.generic_output_binding(arg_name="$return", type="http")
@app.generic_input_binding(arg_name="products", type="mysql",
                           commandText= "select * from Products where ProductId= @productId",
                           command_type="Text",
                           parameters= "@productId={productid}",
                           connection_string_setting="MySqlConnectionString")
def mysql_test(req: func.HttpRequest, products: func.MySqlRowList) -> func.HttpResponse:
    rows = list(map(lambda r: json.loads(r.to_json()), products))
 
    return func.HttpResponse(
        json.dumps(rows),
        status_code=200,
        mimetype="application/json"
    )
```

# [v1](#tab/python-v1)

The following is binding data in the function.json file:

```json
{
    "bindings": [
      {
        "authLevel": "function",
        "name": "req",
        "type": "httpTrigger",
        "direction": "in",
        "methods": [
          "get"
        ],
        "route": "getproducts/{productid}"
      },
      {
        "name": "$return",
        "type": "http",
        "direction": "out"
      },
      {
        "name": "products",
        "type": "mysql",
        "direction": "in",
        "commandText": "select * from Products where ProductId= @productId",
        "commandType": "Text",
        "parameters": "@productId={productid}",
        "connectionStringSetting": "MySqlConnectionString"
      }
    ],
    "disabled": false
  }
```

The [configuration](#configuration) section explains these properties.

The following example is sample Python code:


```python
import azure.functions as func
import json

def main(req: func.HttpRequest, products: func.MySqlRowList) -> func.HttpResponse:
    rows = list(map(lambda r: json.loads(r.to_json()), products))

    return func.HttpResponse(
        json.dumps(rows),
        status_code=200,
        mimetype="application/json"
    ) 
```

---

<a id="http-trigger-delete-one-or-multiple-rows-python"></a>
### HTTP trigger, delete rows

The following example shows a MySQL input binding in a function.json file and a Python function that is [triggered by an HTTP](./functions-bindings-http-webhook-trigger.md) request and executes a stored procedure with input from the HTTP request query parameter.

The stored procedure `DeleteProductsCost` must be created on the database. In this example, the stored procedure deletes a single record or all records depending on the value of the parameter.

```sql
DROP PROCEDURE IF EXISTS DeleteProductsCost;

Create Procedure DeleteProductsCost(cost INT)
BEGIN
	DELETE from Products where Products.cost = cost;
END
```

# [v2](#tab/python-v2)

The following example is sample python code for the function_app.py file:

```python
import azure.functions as func
import datetime
import json
import logging
 
app = func.FunctionApp()
 
 
@app.generic_trigger(arg_name="req", type="httpTrigger", route="getproducts/{cost}")
@app.generic_output_binding(arg_name="$return", type="http")
@app.generic_input_binding(arg_name="products", type="mysql",
                           commandText= "DeleteProductsCost",
                           command_type="StoredProcedure",
                           parameters= "@Cost={cost}",
                           connection_string_setting="MySqlConnectionString")
def mysql_test(req: func.HttpRequest, products: func.MySqlRowList) -> func.HttpResponse:
    rows = list(map(lambda r: json.loads(r.to_json()), products))
 
    return func.HttpResponse(
        json.dumps(rows),
        status_code=200,
        mimetype="application/json"
    )
```

# [v1](#tab/python-v1)

```json

    "bindings": [
      {
        "authLevel": "function",
        "name": "req",
        "type": "httpTrigger",
        "direction": "in",
        "methods": [
          "get"
        ],
        "route": "getproducts-storedprocedure/{cost}"
      },
      {
        "name": "$return",
        "type": "http",
        "direction": "out"
      },
      {
        "name": "products",
        "type": "mysql",
        "direction": "in",
        "commandText": "DeleteProductsCost",
        "commandType": "StoredProcedure",
        "parameters": "@Cost={cost}",
        "connectionStringSetting": "MySqlConnectionString"
      }
    ],
    "disabled": false
  }
```

The [configuration](#configuration) section explains these properties.

The following is sample Python code:


```python
import json
import azure.functions as func

# The input binding executes the `SELECT * FROM Products WHERE Cost = @Cost` query.
# The Parameters argument passes the `{cost}` specified in the URL that triggers the function,
# `getproducts/{cost}`, as the value of the `@Cost` parameter in the query.
# CommandType is set to `Text`, since the constructor argument of the binding is a raw query.
def main(req: func.HttpRequest, products: func.MySqlRowList) -> func.HttpResponse:
    rows = list(map(lambda r: json.loads(r.to_json()), products))

    return func.HttpResponse(
        json.dumps(rows),
        status_code=200,
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
| **CommandText** | Required. The MySQL query command or name of the stored procedure executed by the binding.  |
| **ConnectionStringSetting** | Required. The name of an app setting that contains the connection string for the database against which the query or stored procedure is being executed. This value isn't the actual connection string and must instead resolve to an environment variable name. | 
| **CommandType** | Required. A [CommandType](/dotnet/api/system.data.commandtype) value, which is [Text](/dotnet/api/system.data.commandtype#fields) for a query and [StoredProcedure](/dotnet/api/system.data.commandtype#fields) for a stored procedure. |
| **Parameters** | Optional. Zero or more parameter values passed to the command during execution as a single string. Must follow the format `@param1=param1,@param2=param2`. Neither the parameter name nor the parameter value can contain a comma (`,`) or an equals sign (`=`). |

::: zone-end  

::: zone pivot="programming-language-java"  
## Annotations

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@MySQLInput` annotation on parameters whose value would come from Azure Database for MySQL. This annotation supports the following elements:

| Element |Description|
|---------|---------|
| **commandText** | Required. The MySQL query command or name of the stored procedure executed by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database against which the query or stored procedure is being executed. This value isn't the actual connection string and must instead resolve to an environment variable name. | 
| **commandType** | Required. A [CommandType](/dotnet/api/system.data.commandtype) value, which is ["Text"](/dotnet/api/system.data.commandtype#fields) for a query and ["StoredProcedure"](/dotnet/api/system.data.commandtype#fields) for a stored procedure. |
|**name** |  Required. The unique name of the function binding. | 
| **parameters** | Optional. Zero or more parameter values passed to the command during execution as a single string. Must follow the format `@param1=param1,@param2=param2`. Neither the parameter name nor the parameter value can contain a comma (`,`) or an equals sign (`=`). |

::: zone-end 

::: zone pivot="programming-language-javascript,programming-language-typescript"  

## Configuration

# [Model v4](#tab/nodejs-v4)

The following table explains the properties that you can set on the `options` object passed to the `input.generic()` method.

| Property | Description |
|---------|----------------------|
| **commandText** | Required. The MySQL query command or name of the stored procedure executed by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database against which the query or stored procedure is being executed. This value isn't the actual connection string and must instead resolve to an environment variable name.  Optional keywords in the connection string value are [available to refine MySQL bindings connectivity](./functions-bindings-azure-mysql.md#mysql-connection-string). |
| **commandType** | Required. A [CommandType](/dotnet/api/system.data.commandtype) value, which is [Text](/dotnet/api/system.data.commandtype#fields) for a query and [StoredProcedure](/dotnet/api/system.data.commandtype#fields) for a stored procedure. |
| **parameters** | Optional. Zero or more parameter values passed to the command during execution as a single string. Must follow the format `@param1=param1,@param2=param2`. Neither the parameter name nor the parameter value can contain a comma (`,`) or an equals sign (`=`). |

# [Model v3](#tab/nodejs-v3)

The following table explains the binding configuration properties that you set in the function.json file.

| Property | Description |
|---------|----------------------|
|**type** |  Required. Must be set to `Mysql`. |
|**direction** | Required. Must be set to `in`. |
|**name** |  Required. The name of the variable that represents the query results in function code. | 
| **commandText** | Required. The MySQL query command or name of the stored procedure executed by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database against which the query or stored procedure is being executed. This value isn't the actual connection string and must instead resolve to an environment variable name. Optional keywords in the connection string value are [available to refine MySQL bindings connectivity](./functions-bindings-azure-mysql.md#mysql-connection-string). |
| **commandType** | Required. A [CommandType](/dotnet/api/system.data.commandtype) value, which is [Text](/dotnet/api/system.data.commandtype#fields) for a query and [StoredProcedure](/dotnet/api/system.data.commandtype#fields) for a stored procedure. |
| **parameters** | Optional. Zero or more parameter values passed to the command during execution as a single string. Must follow the format `@param1=param1,@param2=param2`. Neither the parameter name nor the parameter value can contain a comma (`,`) or an equals sign (`=`). |

---

::: zone-end

::: zone pivot="programming-language-powershell,programming-language-python"  
## Configuration

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
|**type** |  Required. Must be set to `mysql`. |
|**direction** | Required. Must be set to `in`. |
|**name** |  Required. The name of the variable that represents the query results in function code. | 
| **commandText** | Required. The MySQL query command or name of the stored procedure executed by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database against which the query or stored procedure is being executed. This value isn't the actual connection string and must instead resolve to an environment variable name. Optional keywords in the connection string value are [available to refine MySQL bindings connectivity](./functions-bindings-azure-mysql.md#mysql-connection-string). |
| **commandType** | Required. A [CommandType](/dotnet/api/system.data.commandtype) value, which is [Text](/dotnet/api/system.data.commandtype#fields) for a query and [StoredProcedure](/dotnet/api/system.data.commandtype#fields) for a stored procedure. |
| **parameters** | Optional. Zero or more parameter values passed to the command during execution as a single string. Must follow the format `@param1=param1,@param2=param2`. Neither the parameter name nor the parameter value can contain a comma (`,`) or an equals sign (`=`). |

::: zone-end  


[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

The attribute's constructor takes the MySQL command text, the command type, parameters, and the connection string setting name. The command can be a MYSQL query with the command type `System.Data.CommandType.Text` or stored procedure name with the command type `System.Data.CommandType.StoredProcedure`. The connection string setting name corresponds to the application setting (in `local.settings.json` for local development) that contains the [connection string](https://dev.mysql.com/doc/connector-net/en/connector-net-connections-string.html) to the Azure Database for MySQL.


If an exception occurs when a MySQL input binding is executed then the function code won't execute. This might result in an error code being returned, such as an HTTP trigger returning a 500 error code.

## Next steps

- [Save data to a database (Output binding)](./functions-bindings-azure-mysql-output.md)
- [Run a function from a HTTP request (trigger)](./functions-bindings-http-webhook-trigger.md)
 
