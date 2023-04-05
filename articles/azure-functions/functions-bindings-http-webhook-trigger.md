---
title: Azure Functions HTTP trigger
description: Learn how to call an Azure Function via HTTP.
ms.topic: reference
ms.date: 03/06/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Functions HTTP trigger

The HTTP trigger lets you invoke a function with an HTTP request. You can use an HTTP trigger to build serverless APIs and respond to webhooks.

The default return value for an HTTP-triggered function is:

- `HTTP 204 No Content` with an empty body in Functions 2.x and higher
- `HTTP 200 OK` with an empty body in Functions 1.x

To modify the HTTP response, configure an [output binding](./functions-bindings-http-webhook-output.md).

For more information about HTTP bindings, see the [overview](./functions-bindings-http-webhook.md) and [output binding reference](./functions-bindings-http-webhook-output.md).

[!INCLUDE [HTTP client best practices](../../includes/functions-http-client-best-practices.md)]

::: zone pivot="programming-language-python"
Azure Functions supports two programming models for Python. The way that you define your bindings depends on your chosen programming model.

# [v2](#tab/python-v2)
The Python v2 programming model lets you define bindings using decorators directly in your Python function code. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-decorators#programming-model).

# [v1](#tab/python-v1)
The Python v1 programming model requires you to define bindings in a separate *function.json* file in the function folder. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-configuration#programming-model).

---

This article supports both programming models.

> [!IMPORTANT]
> The Python v2 programming model is currently in preview.
::: zone-end


## Example

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

The code in this article defaults to .NET Core syntax, used in Functions version 2.x and higher. For information on the 1.x syntax, see the [1.x functions templates](https://github.com/Azure/azure-functions-templates/tree/v1.x/Functions.Templates/Templates).

# [In-process](#tab/in-process)    

The following example shows a [C# function](functions-dotnet-class-library.md) that looks for a `name` parameter either in the query string or the body of the HTTP request. Notice that the return value is used for the output binding, but a return value attribute isn't required.

```cs
[FunctionName("HttpTriggerCSharp")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)]
    HttpRequest req, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string name = req.Query["name"];
    
    string requestBody = String.Empty;
    using (StreamReader streamReader =  new  StreamReader(req.Body))
    {
        requestBody = await streamReader.ReadToEndAsync();
    }
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    name = name ?? data?.name;
    
    return name != null
        ? (ActionResult)new OkObjectResult($"Hello, {name}")
        : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
}
```

# [Isolated process](#tab/isolated-process)

The following example shows an HTTP trigger that returns a "hello world" response as an [HttpResponseData](/dotnet/api/microsoft.azure.functions.worker.http.httpresponsedata) object:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Http/HttpFunction.cs" id="docsnippet_http_trigger":::

# [C# Script](#tab/csharp-script)

The following example shows a trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function looks for a `name` parameter either in the query string or the body of the HTTP request.

Here's the *function.json* file:

```json
{
    "disabled": false,
    "bindings": [
        {
            "authLevel": "function",
            "name": "req",
            "type": "httpTrigger",
            "direction": "in",
            "methods": [
                "get",
                "post"
            ]
        },
        {
            "name": "$return",
            "type": "http",
            "direction": "out"
        }
    ]
}
```

The [configuration](#configuration) section explains these properties.

Here's C# script code that binds to `HttpRequest`:

```cs
#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string name = req.Query["name"];
    
    string requestBody = String.Empty;
    using (StreamReader streamReader =  new  StreamReader(req.Body))
    {
        requestBody = await streamReader.ReadToEndAsync();
    }
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    name = name ?? data?.name;
    
    return name != null
        ? (ActionResult)new OkObjectResult($"Hello, {name}")
        : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
}
```

You can bind to a custom object instead of `HttpRequest`. This object is created from the body of the request and parsed as JSON. Similarly, a type can be passed to the HTTP response output binding and returned as the response body, along with a `200` status code.

```csharp
using System.Net;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public static string Run(Person person, ILogger log)
{   
    return person.Name != null
        ? (ActionResult)new OkObjectResult($"Hello, {person.Name}")
        : new BadRequestObjectResult("Please pass an instance of Person.");
}

public class Person {
     public string Name {get; set;}
}
```

---

::: zone-end
::: zone pivot="programming-language-java"

This section contains the following examples:

* [Read parameter from the query string](#read-parameter-from-the-query-string)
* [Read body from a POST request](#read-body-from-a-post-request)
* [Read parameter from a route](#read-parameter-from-a-route)
* [Read POJO body from a POST request](#read-pojo-body-from-a-post-request)

The following examples show the HTTP trigger binding.

#### Read parameter from the query string

This example reads a parameter, named `id`, from the query string, and uses it to build a JSON document returned to the client, with content type `application/json`.

```java
@FunctionName("TriggerStringGet")
public HttpResponseMessage run(
        @HttpTrigger(name = "req", 
            methods = {HttpMethod.GET}, 
            authLevel = AuthorizationLevel.ANONYMOUS)
        HttpRequestMessage<Optional<String>> request,
        final ExecutionContext context) {
    
    // Item list
    context.getLogger().info("GET parameters are: " + request.getQueryParameters());

    // Get named parameter
    String id = request.getQueryParameters().getOrDefault("id", "");

    // Convert and display
    if (id.isEmpty()) {
        return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                        .body("Document not found.")
                        .build();
    } 
    else {
        // return JSON from to the client
        // Generate document
        final String name = "fake_name";
        final String jsonDocument = "{\"id\":\"" + id + "\", " + 
                                        "\"description\": \"" + name + "\"}";
        return request.createResponseBuilder(HttpStatus.OK)
                        .header("Content-Type", "application/json")
                        .body(jsonDocument)
                        .build();
    }
}
```

#### Read body from a POST request

This example reads the body of a POST request, as a `String`, and uses it to build a JSON document returned to the client, with content type `application/json`.

```java
    @FunctionName("TriggerStringPost")
    public HttpResponseMessage run(
            @HttpTrigger(name = "req", 
              methods = {HttpMethod.POST}, 
              authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> request,
            final ExecutionContext context) {
        
        // Item list
        context.getLogger().info("Request body is: " + request.getBody().orElse(""));

        // Check request body
        if (!request.getBody().isPresent()) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                          .body("Document not found.")
                          .build();
        } 
        else {
            // return JSON from to the client
            // Generate document
            final String body = request.getBody().get();
            final String jsonDocument = "{\"id\":\"123456\", " + 
                                         "\"description\": \"" + body + "\"}";
            return request.createResponseBuilder(HttpStatus.OK)
                          .header("Content-Type", "application/json")
                          .body(jsonDocument)
                          .build();
        }
    }
```

#### Read parameter from a route

This example reads a mandatory parameter, named `id`, and an optional parameter `name` from the route path, and uses them to build a JSON document returned to the client, with content type `application/json`. T

```java
@FunctionName("TriggerStringRoute")
public HttpResponseMessage run(
        @HttpTrigger(name = "req", 
            methods = {HttpMethod.GET}, 
            authLevel = AuthorizationLevel.ANONYMOUS,
            route = "trigger/{id}/{name=EMPTY}") // name is optional and defaults to EMPTY
        HttpRequestMessage<Optional<String>> request,
        @BindingName("id") String id,
        @BindingName("name") String name,
        final ExecutionContext context) {
    
    // Item list
    context.getLogger().info("Route parameters are: " + id);

    // Convert and display
    if (id == null) {
        return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                        .body("Document not found.")
                        .build();
    } 
    else {
        // return JSON from to the client
        // Generate document
        final String jsonDocument = "{\"id\":\"" + id + "\", " + 
                                        "\"description\": \"" + name + "\"}";
        return request.createResponseBuilder(HttpStatus.OK)
                        .header("Content-Type", "application/json")
                        .body(jsonDocument)
                        .build();
    }
}
```

#### Read POJO body from a POST request

Here is the code for the `ToDoItem` class, referenced in this example:

```java

public class ToDoItem {

  private String id;
  private String description;  

  public ToDoItem(String id, String description) {
    this.id = id;
    this.description = description;
  }

  public String getId() {
    return id;
  }

  public String getDescription() {
    return description;
  }
  
  @Override
  public String toString() {
    return "ToDoItem={id=" + id + ",description=" + description + "}";
  }
}

```

This example reads the body of a POST request. The request body gets automatically de-serialized into a `ToDoItem` object, and is returned to the client, with content type `application/json`. The `ToDoItem` parameter is serialized by the Functions runtime as it is assigned to the `body` property of the `HttpMessageResponse.Builder` class.

```java
@FunctionName("TriggerPojoPost")
public HttpResponseMessage run(
        @HttpTrigger(name = "req", 
            methods = {HttpMethod.POST}, 
            authLevel = AuthorizationLevel.ANONYMOUS)
        HttpRequestMessage<Optional<ToDoItem>> request,
        final ExecutionContext context) {
    
    // Item list
    context.getLogger().info("Request body is: " + request.getBody().orElse(null));

    // Check request body
    if (!request.getBody().isPresent()) {
        return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                        .body("Document not found.")
                        .build();
    } 
    else {
        // return JSON from to the client
        // Generate document
        final ToDoItem body = request.getBody().get();
        return request.createResponseBuilder(HttpStatus.OK)
                        .header("Content-Type", "application/json")
                        .body(body)
                        .build();
    }
}
```

::: zone-end  
::: zone pivot="programming-language-javascript"  

The following example shows a trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function looks for a `name` parameter either in the query string or the body of the HTTP request.

Here's the *function.json* file:

```json
{
    "disabled": false,    
    "bindings": [
        {
            "authLevel": "function",
            "type": "httpTrigger",
            "direction": "in",
            "name": "req"
        },
        {
            "type": "http",
            "direction": "out",
            "name": "res"
        }
    ]
}
```

The [configuration](#configuration) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = async function(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);

    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            // status defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};
```

::: zone-end  
::: zone pivot="programming-language-powershell"  

The following example shows a trigger binding in a *function.json* file and a [PowerShell function](functions-reference-powershell.md). The function looks for a `name` parameter either in the query string or the body of the HTTP request.

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "Request",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "Response"
    }
  ]
}
```

```powershell
using namespace System.Net

# Input bindings are passed in via param block.
param($Request, $TriggerMetadata)

# Write to the Azure Functions log stream.
Write-Host "PowerShell HTTP trigger function processed a request."

# Interact with query parameters or the body of the request.
$name = $Request.Query.Name
if (-not $name) {
    $name = $Request.Body.Name
}

$body = "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."

if ($name) {
    $body = "Hello, $name. This HTTP triggered function executed successfully."
}

# Associate values to output bindings by calling 'Push-OutputBinding'.
Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = [HttpStatusCode]::OK
    Body       = $body
})
```

::: zone-end  
::: zone pivot="programming-language-python"  
The following example shows a trigger binding and a Python function that uses the binding. The function looks for a `name` parameter either in the query string or the body of the HTTP request. The example depends on whether you use the [v1 or v2 Python programming model](functions-reference-python.md).

# [v2](#tab/python-v2)

```python
import azure.functions as func
import logging

app = func.FunctionApp()

@app.function_name(name="HttpTrigger1")
@app.route(route="hello", auth_level=func.AuthLevel.ANONYMOUS)
def test_function(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    return func.HttpResponse(
        "This HTTP triggered function executed successfully.",
        status_code=200
        )
```

# [v1](#tab/python-v1)

Here's the *function.json* file:

```json
{
    "scriptFile": "__init__.py",
    "disabled": false,    
    "bindings": [
        {
            "authLevel": "function",
            "type": "httpTrigger",
            "direction": "in",
            "name": "req"
        },
        {
            "type": "http",
            "direction": "out",
            "name": "$return"
        }
    ]
}
```

The [configuration](#configuration) section explains these properties.

Here's the Python code:

```python
import logging
import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello {name}!")
    else:
        return func.HttpResponse(
            "Please pass a name on the query string or in the request body",
            status_code=400
        )
```

---

::: zone-end
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use the `HttpTriggerAttribute` to define the trigger binding. C# script instead uses a function.json configuration file.  

# [In-process](#tab/in-process)

In [in-process functions](functions-dotnet-class-library.md), the `HttpTriggerAttribute` supports the following parameters:

| Parameters | Description|
|---------|----------------------|
|  **AuthLevel** | Determines what keys, if any, need to be present on the request in order to invoke the function. For supported values, see [Authorization level](#http-auth).  |
| **Methods** | An array of the HTTP methods to which the function  responds. If not specified, the function responds to all HTTP methods. See [customize the HTTP endpoint](#customize-the-http-endpoint). |
| **Route** | Defines the route template, controlling to which request URLs your function responds. The default value if none is provided is `<functionname>`. For more information, see [customize the HTTP endpoint](#customize-the-http-endpoint). |
| **WebHookType** | _Supported only for the version 1.x runtime._<br/><br/>Configures the HTTP trigger to act as a [webhook](https://en.wikipedia.org/wiki/Webhook) receiver for the specified provider. For supported values, see [WebHook type](#webhook-type).|

# [Isolated process](#tab/isolated-process)

In [isolated worker process](dotnet-isolated-process-guide.md) function apps, the `HttpTriggerAttribute` supports the following parameters:

| Parameters | Description|
|---------|----------------------|
|  **AuthLevel** | Determines what keys, if any, need to be present on the request in order to invoke the function. For supported values, see [Authorization level](#http-auth).  |
| **Methods** | An array of the HTTP methods to which the function  responds. If not specified, the function responds to all HTTP methods. See [customize the HTTP endpoint](#customize-the-http-endpoint). |
| **Route** | Defines the route template, controlling to which request URLs your function responds. The default value if none is provided is `<functionname>`. For more information, see [customize the HTTP endpoint](#customize-the-http-endpoint). |

# [C# Script](#tab/csharp-script)

The following table explains the trigger configuration properties that you set in the *function.json* file:

|function.json property | Description|
|---------|---------------------|
| **type** | Required - must be set to `httpTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code for the request or request body. |
| **authLevel** |  Determines what keys, if any, need to be present on the request in order to invoke the function. For supported values, see [Authorization level](#http-auth).  |
| **methods** | An array of the HTTP methods to which the function  responds. If not specified, the function responds to all HTTP methods. See [customize the HTTP endpoint](#customize-the-http-endpoint). |
| **route** |  Defines the route template, controlling to which request URLs your function responds. The default value if none is provided is `<functionname>`. For more information, see [customize the HTTP endpoint](#customize-the-http-endpoint). |
| **webHookType** | _Supported only for the version 1.x runtime._<br/><br/>Configures the HTTP trigger to act as a [webhook](https://en.wikipedia.org/wiki/Webhook) receiver for the specified provider. For supported values, see [WebHook type](#webhook-type).|

---

::: zone-end  

::: zone pivot="programming-language-python"
## Decorators

_Applies only to the Python v2 programming model._

For Python v2 functions defined using a decorator, the following properties for a trigger are defined in the `route` decorator, which adds HttpTrigger and HttpOutput binding:

| Property    | Description |
|-------------|-----------------------------|
| `route` | Route for the http endpoint, if None, it will be set to function name if present or user defined python function name. |
| `trigger_arg_name` | Argument name for HttpRequest, defaults to 'req'. |
| `binding_arg_name` | Argument name for HttpResponse, defaults to '$return'. |
| `methods` | A tuple of the HTTP methods to which the function responds. |
| `auth_level` | Determines what keys, if any, need to be present on the request in order to invoke the function. |

For Python functions defined by using *function.json*, see the [Configuration](#configuration) section.
::: zone-end

::: zone pivot="programming-language-java"  
## Annotations

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the [HttpTrigger](/java/api/com.microsoft.azure.functions.annotation.httptrigger) annotation, which supports the following settings:

+ [authLevel](/java/api/com.microsoft.azure.functions.annotation.httptrigger.authlevel)
+ [dataType](/java/api/com.microsoft.azure.functions.annotation.httptrigger.datatype)
+ [methods](/java/api/com.microsoft.azure.functions.annotation.httptrigger.methods)
+ [name](/java/api/com.microsoft.azure.functions.annotation.httptrigger.name)
+ [route](/java/api/com.microsoft.azure.functions.annotation.httptrigger.route)

::: zone-end 
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"  

## Configuration
::: zone-end

::: zone pivot="programming-language-python" 
_Applies only to the Python v1 programming model._

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  

The following table explains the trigger configuration properties that you set in the *function.json* file, which differs by runtime version.

# [Functions 2.x+](#tab/functionsv2)

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|---------------------|
| **type** | Required - must be set to `httpTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code for the request or request body. |
| **authLevel** |  Determines what keys, if any, need to be present on the request in order to invoke the function. For supported values, see [Authorization level](#http-auth).  |
| **methods** | An array of the HTTP methods to which the function  responds. If not specified, the function responds to all HTTP methods. See [customize the HTTP endpoint](#customize-the-http-endpoint). |
| **route** |  Defines the route template, controlling to which request URLs your function responds. The default value if none is provided is `<functionname>`. For more information, see [customize the HTTP endpoint](#customize-the-http-endpoint). |

# [Functions 1.x](#tab/functionsv1)

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|---------------------|
| **type** | Required - must be set to `httpTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code for the request or request body. |
| **authLevel** |  Determines what keys, if any, need to be present on the request in order to invoke the function. For supported values, see [Authorization level](#http-auth).  |
| **methods** | An array of the HTTP methods to which the function  responds. If not specified, the function responds to all HTTP methods. See [customize the HTTP endpoint](#customize-the-http-endpoint). |
| **route** |  Defines the route template, controlling to which request URLs your function responds. The default value if none is provided is `<functionname>`. For more information, see [customize the HTTP endpoint](#customize-the-http-endpoint). |
| **webHookType** | Configures the HTTP trigger to act as a [webhook](https://en.wikipedia.org/wiki/Webhook) receiver for the specified provider. For supported values, see [WebHook type](#webhook-type).|

---

::: zone-end 

## Usage

This section details how to configure your HTTP trigger function binding.

::: zone pivot="programming-language-java"  
The [HttpTrigger](/java/api/com.microsoft.azure.functions.annotation.httptrigger) annotation should be applied to a method parameter of one of the following types:

+ [HttpRequestMessage\<T\>](/java/api/com.microsoft.azure.functions.httprequestmessage).
+ Any native Java types such as int, String, byte[].
+ Nullable values using Optional.
+ Any plain-old Java object (POJO) type.
::: zone-end

### Payload

The trigger input type is declared as either `HttpRequest` or a custom type. If you choose `HttpRequest`, you get full access to the request object. For a custom type, the runtime tries to parse the JSON request body to set the object properties.

### Customize the HTTP endpoint

By default when you create a function for an HTTP trigger, the function is addressable with a route of the form:

```http
http://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>
```

You can customize this route using the optional `route` property on the HTTP trigger's input binding. You can use any [Web API Route Constraint](https://www.asp.net/web-api/overview/web-api-routing-and-actions/attribute-routing-in-web-api-2#constraints) with your parameters. 

::: zone pivot="programming-language-csharp"

# [In-process](#tab/in-process)

The following C# function code accepts two parameters `category` and `id` in the route and writes a response using both parameters.

```csharp
[FunctionName("Function1")]
public static IActionResult Run(
[HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "products/{category:alpha}/{id:int?}")] HttpRequest req,
string category, int? id, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    var message = String.Format($"Category: {category}, ID: {id}");
    return (ActionResult)new OkObjectResult(message);
}
```
# [Isolated process](#tab/isolated-process)

The following function code accepts two parameters `category` and `id` in the route and writes a response using both parameters.

```csharp
[Function("HttpTrigger1")]
public static HttpResponseData Run([HttpTrigger(AuthorizationLevel.Function, "get", "post",
Route = "products/{category:alpha}/{id:int?}")] HttpRequestData req, string category, int? id,
FunctionContext executionContext)
{
    var logger = executionContext.GetLogger("HttpTrigger1");
    logger.LogInformation("C# HTTP trigger function processed a request.");

    var message = String.Format($"Category: {category}, ID: {id}");
    var response = req.CreateResponse(HttpStatusCode.OK);
    response.Headers.Add("Content-Type", "text/plain; charset=utf-8");
    response.WriteString(message);

    return response;
}
```

# [C# Script](#tab/csharp-script)

 The following C# function code makes use of both parameters.

```csharp
#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

public static IActionResult Run(HttpRequest req, string category, int? id, ILogger log)
{
    var message = String.Format($"Category: {category}, ID: {id}");
    return (ActionResult)new OkObjectResult(message);
}
```

---

::: zone-end
::: zone pivot="programming-language-java"

Route parameters are defined using the `route` setting of the `HttpTrigger` annotation. The following function code accepts two parameters `category` and `id` in the route and writes a response using both parameters. 

```java
package com.function;

import java.util.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.*;

public class HttpTriggerJava {
    public HttpResponseMessage<String> HttpTrigger(
            @HttpTrigger(name = "req",
                         methods = {"get"},
                         authLevel = AuthorizationLevel.FUNCTION,
                         route = "products/{category:alpha}/{id:int}") HttpRequestMessage<String> request,
            @BindingName("category") String category,
            @BindingName("id") int id,
            final ExecutionContext context) {

        String message = String.format("Category  %s, ID: %d", category, id);
        return request.createResponseBuilder(HttpStatus.OK).body(message).build();
    }
}
```

::: zone-end 
::: zone pivot="programming-language-javascript,programming-language-powershell"  

As an example, the following *function.json* file defines a `route` property for an HTTP trigger with two parameters, `category` and `id`:

```json
{
    "bindings": [
    {
        "type": "httpTrigger",
        "name": "req",
        "direction": "in",
        "methods": [ "get" ],
        "route": "products/{category:alpha}/{id:int?}"
    },
    {
        "type": "http",
        "name": "res",
        "direction": "out"
    }
    ]
}
```

::: zone-end 
::: zone pivot="programming-language-python"

As an example, the following code defines a `route` property for an HTTP trigger with two parameters, `category` and `id`:

# [v2](#tab/python-v2)

```python
@app.function_name(name="httpTrigger")
@app.route(route="products/{category:alpha}/{id:int?}")
```

# [v1](#tab/python-v1)

In the *function.json* file:

```json
{
    "bindings": [
    {
        "type": "httpTrigger",
        "name": "req",
        "direction": "in",
        "methods": [ "get" ],
        "route": "products/{category:alpha}/{id:int?}"
    },
    {
        "type": "http",
        "name": "res",
        "direction": "out"
    }
    ]
}
```

---

::: zone-end 
::: zone pivot="programming-language-javascript"

The Functions runtime provides the request body from the `context` object. The following example shows how to read route parameters from `context.bindingData`.

```javascript
module.exports = async function (context, req) {

    var category = context.bindingData.category;
    var id = context.bindingData.id;
    var message = `Category: ${category}, ID: ${id}`;

    context.res = {
        body: message;
    }
}
```

::: zone-end  
::: zone pivot="programming-language-powershell" 

Route parameters declared in the *function.json* file are accessible as a property of the `$Request.Params` object.

```powershell
$Category = $Request.Params.category
$Id = $Request.Params.id

$Message = "Category:" + $Category + ", ID: " + $Id

Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = [HttpStatusCode]::OK
    Body = $Message
})
```

::: zone-end 
::: zone pivot="programming-language-python"  
The function execution context is exposed via a parameter declared as `func.HttpRequest`. This instance allows a function to access data route parameters, query string values and methods that allow you to return HTTP responses.

Once defined, the route parameters are available to the function by calling the `route_params` method.

```python
import logging

import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:

    category = req.route_params.get('category')
    id = req.route_params.get('id')
    message = f"Category: {category}, ID: {id}"

    return func.HttpResponse(message)
```

::: zone-end
Using this configuration, the function is now addressable with the following route instead of the original route.

```
http://<APP_NAME>.azurewebsites.net/api/products/electronics/357
```

This configuration allows the function code to support two parameters in the address, _category_ and _id_. For more information on how route parameters are tokenized in a URL, see [Routing in ASP.NET Core](/aspnet/core/fundamentals/routing#route-constraint-reference).

By default, all function routes are prefixed with *api*. You can also customize or remove the prefix using the `extensions.http.routePrefix` property in your [host.json](functions-host-json.md) file. The following example removes the *api* route prefix by using an empty string for the prefix in the *host.json* file.

```json
{
    "extensions": {
        "http": {
            "routePrefix": ""
        }
    }
}
```

### Using route parameters

Route parameters that defined a function's `route` pattern are available to each binding. For example, if you have a route defined as `"route": "products/{id}"` then a table storage binding can use the value of the `{id}` parameter in the binding configuration.

The following configuration shows how the `{id}` parameter is passed to the binding's `rowKey`.

# [v2](#tab/python-v2)

```python
@app.table_input(arg_name="product", table_name="products", 
                 row_key="{id}", partition_key="products",
                 connection="AzureWebJobsStorage")
```

# [v1](#tab/python-v1)

```json
{
    "type": "table",
    "direction": "in",
    "name": "product",
    "partitionKey": "products",
    "tableName": "products",
    "rowKey": "{id}"
}
```

---

When you use route parameters, an `invoke_URL_template` is automatically created for your function. Your clients can use the URL template to understand the parameters they need to pass in the URL when calling your function using its URL. Navigate to one of your HTTP-triggered functions in the [Azure portal](https://portal.azure.com) and select **Get function URL**.

You can programmatically access the `invoke_URL_template` by using the Azure Resource Manager APIs for [List Functions](/rest/api/appservice/webapps/listfunctions) or [Get Function](/rest/api/appservice/webapps/getfunction).

### Working with client identities

If your function app is using [App Service Authentication / Authorization](../app-service/overview-authentication-authorization.md), you can view information about authenticated clients from your code. This information is available as [request headers injected by the platform](../app-service/configure-authentication-user-identities.md#access-user-claims-in-app-code).

You can also read this information from binding data. This capability is only available to the Functions runtime in 2.x and higher. It is also currently only available for .NET languages.

::: zone pivot="programming-language-csharp"
Information regarding authenticated clients is available as a [ClaimsPrincipal], which is available as part of the request context as shown in the following example:

# [In-process](#tab/in-process)

```csharp
using System.Net;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

public static IActionResult Run(HttpRequest req, ILogger log)
{
    ClaimsPrincipal identities = req.HttpContext.User;
    // ...
    return new OkObjectResult();
}
```

Alternatively, the ClaimsPrincipal can simply be included as an additional parameter in the function signature:

```csharp
using System.Net;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Newtonsoft.Json.Linq;

public static void Run(JObject input, ClaimsPrincipal principal, ILogger log)
{
    // ...
    return;
}
```
# [Isolated process](#tab/isolated-process)

The authenticated user is available via [HTTP Headers](../app-service/configure-authentication-user-identities.md#access-user-claims-in-app-code).

# [C# Script](#tab/csharp-script)

```csharp
using System.Net;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

public static IActionResult Run(HttpRequest req, ILogger log)
{
    ClaimsPrincipal identities = req.HttpContext.User;
    // ...
    return new OkObjectResult();
}
```

Alternatively, the ClaimsPrincipal can simply be included as an additional parameter in the function signature:

```csharp
#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Newtonsoft.Json.Linq;

public static void Run(JObject input, ClaimsPrincipal principal, ILogger log)
{
    // ...
    return;
}
```

---

::: zone-end 
::: zone pivot="programming-language-javascript,programming-language-java,programming-language-python,programming-language-powershell"  

The authenticated user is available via [HTTP Headers](../app-service/configure-authentication-user-identities.md#access-user-claims-in-app-code).

::: zone-end

### <a name="http-auth"></a>Authorization level

The authorization level is a string value that indicates the kind of [authorization key](#authorization-keys) that's required to access the function endpoint. For an HTTP triggered function, the authorization level can be one of the following values:

| Level value | Description |
| --- | --- |
|**anonymous**| No API key is required.|
|**function**| A function-specific API key is required. This is the default value when a level isn't specifically set.|
|**admin**| The master key is required.|

### <a name="authorization-keys"></a>Function access keys

[!INCLUDE [functions-authorization-keys](../../includes/functions-authorization-keys.md)]

#### Obtaining keys

Keys are stored as part of your function app in Azure and are encrypted at rest. To view your keys, create new ones, or roll keys to new values, navigate to one of your HTTP-triggered functions in the [Azure portal](https://portal.azure.com) and select **Function Keys**.

You can also manage host keys. Navigate to the function app in the [Azure portal](https://portal.azure.com) and select **App keys**.

You can obtain function and host keys programmatically by using the Azure Resource Manager APIs. There are APIs to [List Function Keys](/rest/api/appservice/webapps/listfunctionkeys) and [List Host Keys](/rest/api/appservice/webapps/listhostkeys), and when using deployment slots the equivalent APIs are [List Function Keys Slot](/rest/api/appservice/webapps/listfunctionkeysslot) and [List Host Keys Slot](/rest/api/appservice/webapps/listhostkeysslot).

You can also create new function and host keys programmatically by using the [Create Or Update Function Secret](/rest/api/appservice/webapps/createorupdatefunctionsecret), [Create Or Update Function Secret Slot](/rest/api/appservice/webapps/createorupdatefunctionsecretslot), [Create Or Update Host Secret](/rest/api/appservice/webapps/createorupdatehostsecret) and [Create Or Update Host Secret Slot](/rest/api/appservice/webapps/createorupdatehostsecretslot) APIs.

Function and host keys can be deleted programmatically by using the [Delete Function Secret](/rest/api/appservice/webapps/deletefunctionsecret), [Delete Function Secret Slot](/rest/api/appservice/webapps/deletefunctionsecretslot), [Delete Host Secret](/rest/api/appservice/webapps/deletehostsecret), and [Delete Host Secret Slot](/rest/api/appservice/webapps/deletehostsecretslot) APIs.

You can also use the [legacy key management APIs to obtain function keys](https://github.com/Azure/azure-functions-host/wiki/Key-management-API), but using the Azure Resource Manager APIs is recommended instead.

#### API key authorization

Most HTTP trigger templates require an API key in the request. So your HTTP request normally looks like the following URL:

```http
https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>?code=<API_KEY>
```

The key can be included in a query string variable named `code`, as above. It can also be included in an `x-functions-key` HTTP header. The value of the key can be any function key defined for the function, or any host key.

You can allow anonymous requests, which do not require keys. You can also require that the master key is used. You change the default authorization level by using the `authLevel` property in the binding JSON. For more information, see [Trigger - configuration](#configuration).

> [!NOTE]
> When running functions locally, authorization is disabled regardless of the specified authorization level setting. After publishing to Azure, the `authLevel` setting in your trigger is enforced. Keys are still required when running [locally in a container](functions-create-function-linux-custom-image.md#build-the-container-image-and-test-locally).


#### Secure an HTTP endpoint in production

To fully secure your function endpoints in production, you should consider implementing one of the following function app-level security options. When using one of these function app-level security methods, you should set the HTTP-triggered function authorization level to `anonymous`.

[!INCLUDE [functions-enable-auth](../../includes/functions-enable-auth.md)]

##### Deploy your function app in isolation

[!INCLUDE [functions-deploy-isolation](../../includes/functions-deploy-isolation.md)]

### Webhooks

> [!NOTE]
> Webhook mode is only available for version 1.x of the Functions runtime. This change was made to improve the performance of HTTP triggers in version 2.x and higher.

In version 1.x, webhook templates provide additional validation for webhook payloads. In version 2.x and higher, the base HTTP trigger still works and is the recommended approach for webhooks. 

#### WebHook type

The `webHookType` binding property indicates the type if webhook supported by the function, which also dictates the supported payload.  The webhook type can be one of the following values:

| Type value | Description |
| --- | --- |
| **genericJson**| A general-purpose webhook endpoint without logic for a specific provider. This setting restricts requests to only those using HTTP POST and with the `application/json` content type.|
| **[github](#github-webhooks)** | The function responds to [GitHub webhooks](https://developer.github.com/webhooks/). Don't use the  `authLevel` property with GitHub webhooks. | 
| **[slack](#slack-webhooks)** | The function responds to [Slack webhooks](https://api.slack.com/outgoing-webhooks). Don't use the `authLevel` property with Slack webhooks. |

When setting the `webHookType` property, don't also set the `methods` property on the binding. 

#### GitHub webhooks

To respond to GitHub webhooks, first create your function with an HTTP Trigger, and set the **webHookType** property to `github`. Then copy its URL and API key into the **Add webhook** page of your GitHub repository. 

![Screenshot that shows how to add a webhook for your function.](./media/functions-bindings-http-webhook/github-add-webhook.png)

#### Slack webhooks

The Slack webhook generates a token for you instead of letting you specify it, so you must configure a function-specific key with the token from Slack. See [Authorization keys](#authorization-keys).

### Webhooks and keys

Webhook authorization is handled by the webhook receiver component, part of the HTTP trigger, and the mechanism varies based on the webhook type. Each mechanism does rely on a key. By default, the function key named "default" is used. To use a different key, configure the webhook provider to send the key name with the request in one of the following ways:

* **Query string**: The provider passes the key name in the `clientid` query string parameter, such as `https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>?clientid=<KEY_NAME>`.
* **Request header**: The provider passes the key name in the `x-functions-clientid` header.

## Content types

Passing binary and form data to a non-C# function requires that you use the appropriate content-type header. Supported content types include `octet-stream` for binary data and [multipart types](https://www.iana.org/assignments/media-types/media-types.xhtml#multipart).

#### Known issues

In non-C# functions, requests sent with the content-type `image/jpeg` results in a `string` value passed to the function. In cases like these, you can manually convert the `string` value to a byte array to access the raw binary data.

### Limits

The HTTP request length is limited to 100 MB (104,857,600 bytes), and the URL length is limited to 4 KB (4,096 bytes). These limits are specified by the `httpRuntime` element of the runtime's [Web.config file](https://github.com/Azure/azure-functions-host/blob/v3.x/src/WebJobs.Script.WebHost/web.config).

If a function that uses the HTTP trigger doesn't complete within 230 seconds, the [Azure Load Balancer](../app-service/faq-availability-performance-application-issues.yml#why-does-my-request-time-out-after-230-seconds-) will time out and return an HTTP 502 error. The function will continue running but will be unable to return an HTTP response. For long-running functions, we recommend that you follow async patterns and return a location where you can ping the status of the request. For information about how long a function can run, see [Scale and hosting - Consumption plan](functions-scale.md#timeout).


## Next steps

- [Return an HTTP response from a function](./functions-bindings-http-webhook-output.md)

[ClaimsPrincipal]: /dotnet/api/system.security.claims.claimsprincipal