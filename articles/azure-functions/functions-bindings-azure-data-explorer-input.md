---
title: Azure Data Explorer input bindings for Azure Functions (preview)
description: Understand how to use Azure Data Explorer input bindings for Azure Functions and query data from Azure Data Explorer.
author: ramacg
ms.topic: reference
ms.custom: build-2023, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 05/04/2023
ms.author: shsagir
ms.reviewer: ramacg
zone_pivot_groups: programming-languages-set-functions-data-explorer
---

# Azure Data Explorer input bindings for Azure Functions (preview)

The Azure Data Explorer input binding retrieves data from a database.

## Examples

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro-with-csx](../../includes/functions-bindings-csharp-intro-with-csx.md)]

# [In-process](#tab/in-process)

More samples for the Azure Data Explorer input binding are available in the [GitHub repository](https://github.com/Azure/Webjobs.Extensions.Kusto/blob/main/samples/samples-csharp).

This section contains the following examples:

* [HTTP trigger, get rows by ID from query string](#http-trigger-look-up-id-from-query-string-c)
* [HTTP trigger, get multiple rows from route data](#http-trigger-get-multiple-items-from-route-data-c)

The examples refer to `Product` class and a corresponding database table:

```cs
public class Product
{
    [JsonProperty(nameof(ProductID))]
    public long ProductID { get; set; }

    [JsonProperty(nameof(Name))]
    public string Name { get; set; }

    [JsonProperty(nameof(Cost))]
    public double Cost { get; set; }
}
```

```kusto
.create-merge table Products (ProductID:long, Name:string, Cost:double)
```

<a id="http-trigger-look-up-id-from-query-string-c"></a>

### HTTP trigger, get row by ID from query string

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a list of products given a product ID. The function is triggered by an HTTP request that uses a parameter for the ID. That ID is used to retrieve a `Product` list that matches the query.

> [!NOTE]
> The HTTP query string parameter is case sensitive.
>

```cs
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.Kusto.Samples.Common;
using Microsoft.Azure.WebJobs.Kusto;

namespace Microsoft.Azure.WebJobs.Extensions.Kusto.Samples.InputBindingSamples
{
    public static class GetProducts
    {
        [FunctionName("GetProductsList")]
        public static async Task<IActionResult> RunAsync(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "getproducts")]
            HttpRequest req,
            [Kusto(Database:"productsdb" ,
            KqlCommand = "declare query_parameters (productId:long);Products | where ProductID == productId" ,
            KqlParameters = "@productId={Query.productId}", // get the value of the query parameter "productId"
            Connection = "KustoConnectionString")]
            IAsyncEnumerable<Product> products)
        {
            IAsyncEnumerator<Product> enumerator = products.GetAsyncEnumerator();
            var productList = new List<Product>();
            while (await enumerator.MoveNextAsync())
            {
                productList.Add(enumerator.Current);
            }
            await enumerator.DisposeAsync();
            return new OkObjectResult(productList);
        }
    }
}
```

<a id="http-trigger-get-multiple-items-from-route-data-c"></a>

### HTTP trigger, get multiple rows from route parameter

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves documents returned by the query. The function is triggered by an HTTP request that uses route data to specify the value of a KQL function parameter. The simple function `GetProductsByName` retrieves a set of products that match a product name.

```kusto
.create function ifnotexists GetProductsByName(name:string)
{
    Products | where Name == name
}
```

```cs
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;

namespace Microsoft.Azure.WebJobs.Extensions.Kusto.Samples.InputBindingSamples
{
  public static class GetProductsFunction
      {
          [FunctionName("GetProductsFunction")]
          public static IActionResult Run(
              [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "getproductsfn/{name}")]
              HttpRequest req,
              [Kusto(Database:"productsdb" ,
              KqlCommand = "declare query_parameters (name:string);GetProductsByName(name)" ,
              KqlParameters = "@name={name}",
              Connection = "KustoConnectionString")]
              IEnumerable<Product> products)
          {
              return new OkObjectResult(products);
          }
      }
}
```

# [Isolated process](#tab/isolated-process)

More samples for the Azure Data Explorer input binding (out of process) are available in the [GitHub repository](https://github.com/Azure/Webjobs.Extensions.Kusto/tree/main/samples/samples-outofproc).

This section contains the following examples:

* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-c-oop)
* [HTTP trigger, get multiple rows from route data](#http-trigger-get-multiple-items-from-route-data-c-oop)

The examples refer to a `Product` class and the Products table, both of which are defined in the previous sections.

<a id="http-trigger-look-up-id-from-query-string-c-oop"></a>

### HTTP trigger, get row by ID from query string

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a single record. The function is triggered by an HTTP request that uses a query string to specify the ID. That ID is used to retrieve a `Product` record with the specified query.

> [!NOTE]
> The HTTP query string parameter is case sensitive.
>

```cs
using System.Text.Json.Nodes;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Kusto;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.Kusto.SamplesOutOfProc.OutputBindingSamples.Common;

namespace Microsoft.Azure.WebJobs.Extensions.Kusto.SamplesOutOfProc.InputBindingSamples
{
    public static class GetProductsQuery
    {
        [Function("GetProductsQuery")]
        public static JsonArray Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "getproductsquery")] HttpRequestData req,
            [KustoInput(Database: "productsdb",
            KqlCommand = "declare query_parameters (productId:long);Products | where ProductID == productId",
            KqlParameters = "@productId={Query.productId}",Connection = "KustoConnectionString")] JsonArray products)
        {
            return products;
        }
    }
}
```

<a id="http-trigger-get-multiple-items-from-route-data-c-oop"></a>

### HTTP trigger, get multiple rows from route parameter

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves records returned by the query (based on the name of the product, in this case). The function is triggered by an HTTP request that uses route data to specify the value of a query parameter. That parameter is used to filter the `Product` records in the specified query.

```cs
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Kusto;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.Kusto.SamplesOutOfProc.OutputBindingSamples.Common;

namespace Microsoft.Azure.WebJobs.Extensions.Kusto.SamplesOutOfProc.InputBindingSamples
{
    public static class GetProductsFunction
    {
        [Function("GetProductsFunction")]
        public static IEnumerable<Product> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "getproductsfn/{name}")] HttpRequestData req,
            [KustoInput(Database: "productsdb",
            KqlCommand = "declare query_parameters (name:string);GetProductsByName(name)",
            KqlParameters = "@name={name}",Connection = "KustoConnectionString")] IEnumerable<Product> products)
        {
            return products;
        }
    }
}
```

<!-- Uncomment to support C# script examples.
# [C# Script](#tab/csharp-script)

-->
---

::: zone-end

::: zone pivot="programming-language-java"

More samples for the Java Azure Data Explorer input binding are available in the [GitHub repository](https://github.com/Azure/Webjobs.Extensions.Kusto/tree/main/samples/samples-java).

This section contains the following examples:

* [HTTP trigger, get multiple rows](#http-trigger-get-multiple-items-java)
* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-java)

The examples refer to a `Product` class (in a separate file `Product.java`) and a corresponding database table.

```java
package com.microsoft.azure.kusto.common;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Product {
    @JsonProperty("ProductID")
    public long ProductID;
    @JsonProperty("Name")
    public String Name;
    @JsonProperty("Cost")
    public double Cost;

    public Product() {
    }

    public Product(long ProductID, String name, double Cost) {
        this.ProductID = ProductID;
        this.Name = name;
        this.Cost = Cost;
    }
}

```

<a id="http-trigger-get-multiple-items-java"></a>

### HTTP trigger, get multiple rows

The example uses a route parameter to specify the name of the ID of the products. All matching products are retrieved from the products table.

```java
package com.microsoft.azure.kusto.inputbindings;

import com.microsoft.azure.functions.HttpMethod;
import com.microsoft.azure.functions.HttpRequestMessage;
import com.microsoft.azure.functions.HttpResponseMessage;
import com.microsoft.azure.functions.HttpStatus;
import com.microsoft.azure.functions.annotation.AuthorizationLevel;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.azure.functions.annotation.HttpTrigger;
import com.microsoft.azure.functions.kusto.annotation.KustoInput;
import com.microsoft.azure.kusto.common.Product;


import java.util.Optional;

public class GetProducts {
    @FunctionName("GetProducts")
    public HttpResponseMessage run(
        @HttpTrigger(name = "req", methods = {
            HttpMethod.GET}, authLevel = AuthorizationLevel.ANONYMOUS, route = "getproducts/{productId}") HttpRequestMessage<Optional<String>> request,
            @KustoInput(name = "getjproducts", kqlCommand = "declare query_parameters (productId:long);Products | where ProductID == productId",
                    kqlParameters = "@productId={productId}", database = "productsdb", connection = "KustoConnectionString") Product[] products) {
        return request.createResponseBuilder(HttpStatus.OK).header("Content-Type", "application/json").body(products)
                .build();
    }
}
```

<a id="http-trigger-look-up-id-from-query-string-java"></a>

### HTTP trigger, get row by ID from query string

The following example shows a query for the products table by the product name. The function is triggered by an HTTP request that uses a query string to specify the value of a query parameter. That parameter is used to filter the `Product` records in the specified query.

```java
package com.microsoft.azure.kusto.inputbindings;

import com.microsoft.azure.functions.HttpMethod;
import com.microsoft.azure.functions.HttpRequestMessage;
import com.microsoft.azure.functions.HttpResponseMessage;
import com.microsoft.azure.functions.HttpStatus;
import com.microsoft.azure.functions.annotation.AuthorizationLevel;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.azure.functions.annotation.HttpTrigger;
import com.microsoft.azure.functions.kusto.annotation.KustoInput;
import com.microsoft.azure.kusto.common.Product;

import java.util.Optional;

public class GetProductsQueryString {
    @FunctionName("GetProductsQueryString")
    public HttpResponseMessage run(@HttpTrigger(name = "req", methods = {
            HttpMethod.GET}, authLevel = AuthorizationLevel.ANONYMOUS, route = "getproducts") HttpRequestMessage<Optional<String>> request,
            @KustoInput(name = "getjproductsquery", kqlCommand = "declare query_parameters (name:string);GetProductsByName(name)",
                    kqlParameters = "@name={Query.name}", database = "productsdb", connection = "KustoConnectionString") Product[] products) {
        return request.createResponseBuilder(HttpStatus.OK).header("Content-Type", "application/json").body(products)
                .build();
    }
}
```

::: zone-end

::: zone pivot="programming-language-javascript"

More samples for the Azure Data Explorer input binding are available in the [GitHub repository](https://github.com/Azure/Webjobs.Extensions.Kusto/tree/main/samples/samples-node).

This section contains the following examples:

* [HTTP trigger, get multiple rows](#http-trigger-get-multiple-items-javascript)
* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-javascript)

The examples refer to a database table:

<a id="http-trigger-get-multiple-items-javascript"></a>

### HTTP trigger, get multiple rows

The following example shows an Azure Data Explorer input binding in a *function.json* file and a JavaScript function that reads from a query and returns the results in the HTTP response.

The following binding data is in the *function.json* file:

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "name": "req",
      "direction": "in",
      "type": "httpTrigger",
      "methods": [
        "get"
      ],
      "route": "getproducts/{productId}"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "productget",
      "type": "kusto",
      "database": "productsdb",
      "direction": "in",
      "kqlCommand": "declare query_parameters (productId:long);Products | where ProductID == productId",
      "kqlParameters": "@productId={productId}",
      "connection": "KustoConnectionString"
    }
  ],
  "disabled": false
}
```

The [configuration](#configuration) section explains these properties.

The following snippet is sample JavaScript code:

```javascript
module.exports = async function (context, req, productget) {
    return {
        status: 200,
        body: productget
    };
}
```

<a id="http-trigger-look-up-id-from-query-string-javascript"></a>

### HTTP trigger, get row by name from query string

The following example shows a query for the products table by the product name. The function is triggered by an HTTP request that uses a query string to specify the value of a query parameter. That parameter is used to filter the `Product` records in the specified query.

The following binding data is in the *function.json* file:

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "name": "req",
      "direction": "in",
      "type": "httpTrigger",
      "methods": [
        "get"
      ],
      "route": "getproductsfn"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "productfnget",
      "type": "kusto",
      "database": "productsdb",
      "direction": "in",
      "kqlCommand": "declare query_parameters (name:string);GetProductsByName(name)",
      "kqlParameters": "@name={Query.name}",
      "connection": "KustoConnectionString"
    }
  ],
  "disabled": false
}
```

The [configuration](#configuration) section explains these properties.

The following snippet is sample JavaScript code:

```javascript
module.exports = async function (context, req, producproductfngettget) {
    return {
        status: 200,
        body: productfnget
    };
}
```

::: zone-end

::: zone pivot="programming-language-python"  

More samples for the Azure Data Explorer input binding are available in the [GitHub repository](https://github.com/Azure/Webjobs.Extensions.Kusto/tree/main/samples/samples-python).

This section contains the following examples:

* [HTTP trigger, get multiple rows](#http-trigger-get-multiple-items-python)
* [HTTP trigger, get records by using a KQL function](#http-trigger-look-up-id-from-query-string-python)

<a id="http-trigger-get-multiple-items-python"></a>

### HTTP trigger, get multiple rows

The following example shows an Azure Data Explorer input binding in a *function.json* file and a Python function that reads from a query and returns the results in the HTTP response.

The following binding data is in the *function.json* file:

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "Anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get"
      ],
      "route": "getproducts/{productId}"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    },
    {
      "name": "productsdb",
      "type": "kusto",
      "database": "sdktestsdb",
      "direction": "in",
      "kqlCommand": "declare query_parameters (productId:long);Products | where ProductID == productId",
      "kqlParameters": "@productId={Query.productId}",
      "connection": "KustoConnectionString"
    }
  ]
}
```

The [configuration](#configuration) section explains these properties.

The following snippet is sample Python code:

```python
import azure.functions as func
from Common.product import Product


def main(req: func.HttpRequest, products: str) -> func.HttpResponse:
    return func.HttpResponse(
        products,
        status_code=200,
        mimetype="application/json"
    )
```

<a id="http-trigger-look-up-id-from-query-string-python"></a>

### HTTP trigger, get row by ID from query string

The following example shows a query for the products table by the product name. The function is triggered by an HTTP request that uses a query string to specify the value of a query parameter. That parameter is used to filter the `Product` records in the specified query.

The following binding data is in the *function.json* file:

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "name": "req",
      "direction": "in",
      "type": "httpTrigger",
      "methods": [
        "get"
      ],
      "route": "getproductsfn"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "productfnget",
      "type": "kusto",
      "database": "productsdb",
      "direction": "in",
      "kqlCommand": "declare query_parameters (name:string);GetProductsByName(name)",
      "kqlParameters": "@name={Query.name}",
      "connection": "KustoConnectionString"
    }
  ],
  "disabled": false
}
```

The [configuration](#configuration) section explains these properties.

The following snippet is sample Python code:

```python
import azure.functions as func

def main(req: func.HttpRequest, products: str) -> func.HttpResponse:
    return func.HttpResponse(
        products,
        status_code=200,
        mimetype="application/json"
    )
```

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes

The [C# library](functions-dotnet-class-library.md) uses the [KustoAttribute](https://github.com/Azure/Webjobs.Extensions.Kusto/blob/main/src/KustoAttribute.cs) attribute to declare the Azure Data Explorer bindings on the function, which has the following properties.

| Attribute property |Description|
|---------|---------|
| Database | Required. The database against which the query must be executed.  |
| Connection | Required. The name of the variable that holds the connection string, resolved through environment variables or through function app settings. Defaults to look up on the variable `KustoConnectionString`. At runtime, this variable is looked up against the environment. Documentation on the connection string is at [Kusto connection strings](/azure/data-explorer/kusto/api/connection-strings/kusto). For example:`"KustoConnectionString": "Data Source=https://your_cluster.kusto.windows.net;Database=your_Database;Fed=True;AppClientId=your_AppId;AppKey=your_AppKey;Authority Id=your_TenantId`. |
| KqlCommand | Required. The `KqlQuery` parameter that must be executed. Can be a KQL query or a KQL function call.|
| KqlParameters | Optional. Parameters that act as predicate variables for `KqlCommand`. For example, "@name={name},@Id={id}", where *{name}* and *{id}* are substituted at runtime with actual values acting as predicates. The parameter name and the parameter value can't contain a comma (`,`) or an equal sign (`=`). |
| ManagedServiceIdentity | Optional. You can use a managed identity to connect to Azure Data Explorer. To use a system managed identity, use "system." Any other identity names are interpreted as a user managed identity. |

::: zone-end  

::: zone pivot="programming-language-java"  

## Annotations

The [Java functions runtime library](/java/api/overview/azure/functions/runtime) uses the [`@KustoInput`](https://github.com/Azure/Webjobs.Extensions.Kusto/blob/main/java-library/src/main/java/com/microsoft/azure/functions/kusto/annotation/KustoInput.java) annotation (`com.microsoft.azure.functions.kusto.annotation.KustoInput`).

| Element |Description|
|---------|---------|
| name | Required. The name of the variable that represents the query results in function code. |
| database | Required. The database against which the query must be executed. |
| connection | Required. The name of the variable that holds the connection string, resolved through environment variables or through function app settings. Defaults to look up on the variable `KustoConnectionString`. At runtime, this variable is looked up against the environment. Documentation on the connection string is at [Kusto connection strings](/azure/data-explorer/kusto/api/connection-strings/kusto). For example:`"KustoConnectionString": "Data Source=https://your_cluster.kusto.windows.net;Database=your_Database;Fed=True;AppClientId=your_AppId;AppKey=your_AppKey;Authority Id=your_TenantId`. |
| kqlCommand | Required. The `KqlQuery` parameter that must be executed. Can be a KQL query or a KQL function call.|
|kqlParameters |  Optional. Parameters that act as predicate variables for `KqlCommand`. For example, "@name={name},@Id={id}", where *{name}* and *{id}* are substituted at runtime with actual values acting as predicates. The parameter name and the parameter value can't contain a comma (`,`) or an equal sign (`=`). |
| managedServiceIdentity | A managed identity can be used to connect to Azure Data Explorer. To use a system managed identity, use "system." Any other identity names are interpreted as a user managed identity.|

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python"  

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|----------------------|
|type |  Required. Must be set to `kusto`. |
|direction | Required. Must be set to `in`. |
|name |  Required. The name of the variable that represents the query results in function code. |
| database | Required. The database against which the query must be executed. |
| connection | Required. The name of the variable that holds the connection string, resolved through environment variables or through function app settings. Defaults to look up on the variable `KustoConnectionString`. At runtime, this variable is looked up against the environment. Documentation on the connection string is at [Kusto connection strings](/azure/data-explorer/kusto/api/connection-strings/kusto). For example:`"KustoConnectionString": "Data Source=https://your_cluster.kusto.windows.net;Database=your_Database;Fed=True;AppClientId=your_AppId;AppKey=your_AppKey;Authority Id=your_TenantId`. |
| kqlCommand | Required. The `KqlQuery` parameter that must be executed. Can be a KQL query or a KQL function call.|
|kqlParameters |  Optional. Parameters that act as predicate variables for `KqlCommand`. For example, "@name={name},@Id={id}", where *{name}* and *{id}* are substituted at runtime with actual values acting as predicates. The parameter name and the parameter value can't contain a comma (`,`) or an equal sign (`=`). |
| managedServiceIdentity | A managed identity can be used to connect to Azure Data Explorer. To use a system managed identity, use "system." Any other identity names are interpreted as a user managed identity.|
::: zone-end  

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-python,programming-language-java"

The attribute's constructor takes the database and the attributes `KQLCommand` and `KQLParameters` and the connection setting name. The KQL command can be a KQL statement or a KQL function. The connection string setting name corresponds to the application setting (in `local.settings.json` for local development) that contains the [Kusto connection strings](/azure/data-explorer/kusto/api/connection-strings/kusto). For example: `"KustoConnectionString": "Data Source=https://your_cluster.kusto.windows.net;Database=your_Database;Fed=True;AppClientId=your_AppId;AppKey=your_AppKey;Authority Id=your_TenantId`. Queries executed by the input binding are parameterized. The values provided in the KQL parameters are used at runtime.

::: zone-end

## Next steps

[Save data to a table (output binding)](functions-bindings-azure-data-explorer-output.md)
