---
title: Azure Functions HTTP trigger
description: Learn how to call an Azure Function via HTTP.
ms.topic: reference
ms.date: 05/02/2025
ms.devlang: csharp
# ms.devlang: csharp, java, javascript, powershell, python
ms.custom:
  - devx-track-csharp
  - devx-track-python
  - devx-track-extended-java
  - devx-track-js
  - devx-track-ts
  - build-2025
zone_pivot_groups: programming-languages-set-functions
---

# Azure Functions HTTP trigger

The HTTP trigger lets you invoke a function with an HTTP request. You can use an HTTP trigger to build serverless APIs and respond to webhooks.

The default return value for an HTTP-triggered function is:

- `HTTP 204 No Content` with an empty body in Functions 2.x and higher
- `HTTP 200 OK` with an empty body in Functions 1.x

To modify the HTTP response, configure an [output binding](./functions-bindings-http-webhook-output.md).

For more information about HTTP bindings, see the [overview](./functions-bindings-http-webhook.md) and [output binding reference](./functions-bindings-http-webhook-output.md).

[!INCLUDE [HTTP client best practices](../../includes/functions-http-client-best-practices.md)]

::: zone pivot="programming-language-javascript,programming-language-typescript"
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
::: zone-end
::: zone pivot="programming-language-python"
[!INCLUDE [functions-bindings-python-models-intro](../../includes/functions-bindings-python-models-intro.md)]

::: zone-end


## Example

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

[!INCLUDE [functions-in-process-model-retirement-note](../../includes/functions-in-process-model-retirement-note.md)]

The code in this article defaults to .NET Core syntax, used in Functions version 2.x and higher. For information on the 1.x syntax, see the [1.x functions templates](https://github.com/Azure/azure-functions-templates/tree/v1.x/Functions.Templates/Templates).

# [Isolated worker model](#tab/isolated-process)

The following example shows an HTTP trigger that returns a "hello, world" response as an [IActionResult], using [ASP.NET Core integration in .NET Isolated]:

```csharp
[Function("HttpFunction")]
public IActionResult Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
{
    return new OkObjectResult($"Welcome to Azure Functions, {req.Query["name"]}!");
}
```

[IActionResult]: /dotnet/api/microsoft.aspnetcore.mvc.iactionresult

The following example shows an HTTP trigger that returns a "hello world" response as an [HttpResponseData](/dotnet/api/microsoft.azure.functions.worker.http.httpresponsedata) object:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Http/HttpFunction.cs" id="docsnippet_http_trigger":::

# [In-process model](#tab/in-process)    

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

This example reads a mandatory parameter, named `id`, and an optional parameter `name` from the route path, and uses them to build a JSON document returned to the client, with content type `application/json`.

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

Here's the code for the `ToDoItem` class, referenced in this example:

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
::: zone pivot="programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

The following example shows an HTTP trigger [TypeScript function](functions-reference-node.md?tabs=typescript). The function looks for a `name` parameter either in the query string or the body of the [HTTP request](functions-reference-node.md?tabs=typescript&pivots=nodejs-model-v4#http-request). 

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/httpTrigger1.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples aren't documented for model v3.

---

::: zone-end  
::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

The following example shows an HTTP trigger [JavaScript function](functions-reference-node.md). The function looks for a `name` parameter either in the query string or the body of the [HTTP request](functions-reference-node.md?tabs=javascript&pivots=nodejs-model-v4#http-request). 

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/httpTrigger1.js" :::

# [Model v3](#tab/nodejs-v3)

The following example shows a trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function looks for a `name` parameter either in the query string or the body of the [HTTP request](functions-reference-node.md?tabs=javascript&pivots=nodejs-model-v3#http-request). 

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

---

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
# [v2](#tab/python-v2)

This example is an HTTP triggered function that uses [HTTP streams](functions-reference-python.md#http-streams) to return chunked response data. You might use these capabilities to support scenarios like sending event data through a pipeline for real time visualization or detecting anomalies in large sets of data and providing instant notifications.

:::code language="python" source="~/functions-python-extensions/azurefunctions-extensions-http-fastapi/samples/fastapi_samples_streaming_download/function_app.py" range="5-26" ::: 

To learn more, including how to enable HTTP streams in your project, see [HTTP streams](functions-bindings-http-webhook-trigger.md?tabs=python-v2&pivots=programming-language-python#http-streams-1).

This example shows a trigger binding and a Python function that uses the binding. The function looks for a `name` parameter either in the query string or the body of the HTTP request.

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

This example shows a trigger binding and a Python function that uses the binding. The function looks for a `name` parameter either in the query string or the body of the HTTP request.

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

Both the [isolated worker model](dotnet-isolated-process-guide.md) and the [in-process model](functions-dotnet-class-library.md) use the `HttpTriggerAttribute` to define the trigger binding. C# script instead uses a function.json configuration file as described in the [C# scripting guide](./functions-reference-csharp.md#http-trigger).

# [Isolated worker model](#tab/isolated-process)

In [isolated worker model](dotnet-isolated-process-guide.md) function apps, the `HttpTriggerAttribute` supports the following parameters:

| Parameters | Description|
|---------|----------------------|
|  **AuthLevel** | Determines what keys, if any, need to be present on the request in order to invoke the function. For supported values, see [Authorization level](#http-auth).  |
| **Methods** | An array of the HTTP methods to which the function  responds. If not specified, the function responds to all HTTP methods. See [customize the HTTP endpoint](#customize-the-http-endpoint). |
| **Route** | Defines the route template, controlling to which request URLs your function responds. The default value if none is provided is `<functionname>`. For more information, see [customize the HTTP endpoint](#customize-the-http-endpoint). |

# [In-process model](#tab/in-process)

In [in-process functions](functions-dotnet-class-library.md), the `HttpTriggerAttribute` supports the following parameters:

| Parameters | Description|
|---------|----------------------|
|  **AuthLevel** | Determines what keys, if any, need to be present on the request in order to invoke the function. For supported values, see [Authorization level](#http-auth).  |
| **Methods** | An array of the HTTP methods to which the function  responds. If not specified, the function responds to all HTTP methods. See [customize the HTTP endpoint](#customize-the-http-endpoint). |
| **Route** | Defines the route template, controlling to which request URLs your function responds. The default value if none is provided is `<functionname>`. For more information, see [customize the HTTP endpoint](#customize-the-http-endpoint). |
| **WebHookType** | _Supported only for the version 1.x runtime._<br/><br/>Configures the HTTP trigger to act as a [webhook](https://en.wikipedia.org/wiki/Webhook) receiver for the specified provider. For supported values, see [WebHook type](#webhook-type).|

---

::: zone-end  

::: zone pivot="programming-language-python"
## Decorators

_Applies only to the Python v2 programming model._

For Python v2 functions defined using a decorator, the following properties for a trigger are defined in the `route` decorator, which adds HttpTrigger and HttpOutput binding:

| Property    | Description |
|-------------|-----------------------------|
| `route` | Route for the http endpoint. If None, it will be set to function name if present or user-defined python function name. |
| `trigger_arg_name` | Argument name for HttpRequest. The default value is 'req'. |
| `binding_arg_name` | Argument name for HttpResponse. The default value is '$return'. |
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
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-powershell"  

## Configuration
::: zone-end

::: zone pivot="programming-language-python" 
_Applies only to the Python v1 programming model._

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

The following table explains the properties that you can set on the `options` object passed to the `app.http()` method.

| Property | Description |
|---------|---------------------|
| **authLevel** |  Determines what keys, if any, need to be present on the request in order to invoke the function. For supported values, see [Authorization level](#http-auth).  |
| **methods** | An array of the HTTP methods to which the function  responds. If not specified, the function responds to all HTTP methods. See [customize the HTTP endpoint](#customize-the-http-endpoint). |
| **route** |  Defines the route template, controlling to which request URLs your function responds. The default value if none is provided is `<functionname>`. For more information, see [customize the HTTP endpoint](#customize-the-http-endpoint). |

# [Model v3](#tab/nodejs-v3)

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|---------------------|
| **type** | Required - must be set to `httpTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code for the request or request body. |
| **authLevel** |  Determines what keys, if any, need to be present on the request in order to invoke the function. For supported values, see [Authorization level](#http-auth).  |
| **methods** | An array of the HTTP methods to which the function  responds. If not specified, the function responds to all HTTP methods. See [customize the HTTP endpoint](#customize-the-http-endpoint). |
| **route** |  Defines the route template, controlling to which request URLs your function responds. The default value if none is provided is `<functionname>`. For more information, see [customize the HTTP endpoint](#customize-the-http-endpoint). |

---

::: zone-end 
::: zone pivot="programming-language-powershell,programming-language-python"  

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

::: zone pivot="programming-language-csharp"

### Payload

#### [Isolated worker model](#tab/isolated-process)

The trigger input type is declared as one of the following types:

| Type              | Description | 
|-|-|
| [HttpRequest]     | _Use of this type requires that the app is configured with [ASP.NET Core integration in .NET Isolated]._<br/>This gives you full access to the request object and overall HttpContext. |
| [HttpRequestData] | A projection of the request object. |
| A custom type     | When the body of the request is JSON, the runtime tries to parse it to set the object properties. |

When the trigger parameter is of type `HttpRequestData` or `HttpRequest`, custom types can also be bound to other parameters using `Microsoft.Azure.Functions.Worker.Http.FromBodyAttribute`. Use of this attribute requires [`Microsoft.Azure.Functions.Worker.Extensions.Http` version 3.1.0 or later](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Http). This is a different type than the similar attribute in `Microsoft.AspNetCore.Mvc`. When using ASP.NET Core integration, you need a fully qualified reference or `using` statement. This example shows how to use the attribute to get just the body contents while still having access to the full `HttpRequest`, using ASP.NET Core integration:

```csharp
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using FromBodyAttribute = Microsoft.Azure.Functions.Worker.Http.FromBodyAttribute;

namespace AspNetIntegration
{
    public class BodyBindingHttpTrigger
    {
        [Function(nameof(BodyBindingHttpTrigger))]
        public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req,
            [FromBody] Person person)
        {
            return new OkObjectResult(person);
        }
    }

    public record Person(string Name, int Age);
}
```

#### [In-process model](#tab/in-process)   

The trigger input type is declared as either `HttpRequest` or a custom type. If you choose `HttpRequest`, you get full access to the request object. For a custom type, the runtime tries to parse the JSON request body to set the object properties.

---

::: zone-end  
### Customize the HTTP endpoint

By default when you create a function for an HTTP trigger, the function is addressable with a route of the form:

```http
https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>
```

You can customize this route using the optional `route` property on the HTTP trigger's input binding. You can use any [Web API Route Constraint](https://www.asp.net/web-api/overview/web-api-routing-and-actions/attribute-routing-in-web-api-2#constraints) with your parameters. 

::: zone pivot="programming-language-csharp"

#### [Isolated worker model](#tab/isolated-process)

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

#### [In-process model](#tab/in-process)

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
::: zone pivot="programming-language-typescript"  

#### [Model v4](#tab/nodejs-v4)

As an example, the following TypeScript code defines a `route` property for an HTTP trigger with two parameters, `category` and `id`. The example reads the parameters from the request and returns their values in the response.

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/httpTrigger2.ts" :::

#### [Model v3](#tab/nodejs-v3)

TypeScript samples aren't documented for model v3.

---

::: zone-end 
::: zone pivot="programming-language-javascript"  

#### [Model v4](#tab/nodejs-v4)

As an example, the following JavaScript code defines a `route` property for an HTTP trigger with two parameters, `category` and `id`. The example reads the parameters from the request and returns their values in the response.

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/httpTrigger2.js" :::

#### [Model v3](#tab/nodejs-v3)

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

---

::: zone-end 
::: zone pivot="programming-language-python"

As an example, the following code defines a `route` property for an HTTP trigger with two parameters, `category` and `id`:

#### [v2](#tab/python-v2)

```python
@app.function_name(name="httpTrigger")
@app.route(route="products/{category:alpha}/{id:int?}")
```

#### [v1](#tab/python-v1)

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
https://<APP_NAME>.azurewebsites.net/api/products/electronics/357
```

This configuration allows the function code to support two parameters in the address, _category_ and _ID_. For more information on how route parameters are tokenized in a URL, see [Routing in ASP.NET Core](/aspnet/core/fundamentals/routing#route-constraint-reference).

By default, all function routes are prefixed with `api`. You can also customize or remove the prefix using the `extensions.http.routePrefix` property in your [host.json](functions-host-json.md) file. The following example removes the `api` route prefix by using an empty string for the prefix in the *host.json* file.

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
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  
The following configuration shows how the `{id}` parameter is passed to the binding's `rowKey`.
::: zone-end
::: zone pivot="programming-language-python"  
#### [v2](#tab/python-v2)

```python
@app.table_input(arg_name="product", table_name="products", 
                 row_key="{id}", partition_key="products",
                 connection="AzureWebJobsStorage")
```

#### [v1](#tab/python-v1)

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
::: zone-end
::: zone pivot="programming-language-typescript"
#### [Model v4](#tab/nodejs-v4)

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/httpTrigger3.ts" :::

#### [Model v3](#tab/nodejs-v3)

TypeScript samples aren't documented for model v3.

---
::: zone-end
::: zone pivot="programming-language-javascript"
#### [Model v4](#tab/nodejs-v4)

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/httpTrigger3.js" :::

#### [Model v3](#tab/nodejs-v3)

```json
{
    "type": "table",
    "direction": "in",
    "name": "product",
    "connection": "MyStorageConnectionAppSetting",
    "partitionKey": "products",
    "tableName": "products",
    "rowKey": "{id}"
}
```

---
::: zone-end
::: zone pivot="programming-language-powershell"  
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
::: zone-end
When you use route parameters, an `invoke_URL_template` is automatically created for your function. Your clients can use the URL template to understand the parameters they need to pass in the URL when calling your function using its URL. Navigate to one of your HTTP-triggered functions in the [Azure portal](https://portal.azure.com) and select **Get function URL**.

You can programmatically access the `invoke_URL_template` by using the Azure Resource Manager APIs for [List Functions](/rest/api/appservice/webapps/listfunctions) or [Get Function](/rest/api/appservice/webapps/getfunction).

::: zone pivot="programming-language-javascript,programming-language-typescript"  
### HTTP streams

You can now stream requests to and responses from your HTTP endpoint in Node.js v4 function apps. For more information, see [HTTP streams](functions-reference-node.md?pivots=nodejs-model-v4#http-streams).   
::: zone-end  
::: zone pivot="programming-language-python"  
### HTTP streams

HTTP streams support in Python lets you accept and return data from your HTTP endpoints using FastAPI request and response APIs enabled in your functions. These APIs enable the host to process data in HTTP messages as chunks instead of having to read an entire message into memory.

### Prerequisites

* [Azure Functions runtime](functions-versions.md?pivots=programming-language-python) version 4.34.1, or a later version.
* [Python](https://www.python.org/downloads/) version 3.8, or a later [supported version](functions-reference-python.md?tabs=get-started&pivots=python-mode-decorators#python-version).

### Enable HTTP streams

HTTP streams are disabled by default. You need to enable this feature in your application settings and also update your code to use the FastAPI package. Note that when enabling HTTP streams, the function app will default to using HTTP streaming, and the original HTTP functionality will not work.

1. Add the `azurefunctions-extensions-http-fastapi` extension package to the `requirements.txt` file in the project, which should include at least these packages:

    :::code language="text" source="~/functions-python-extensions/azurefunctions-extensions-http-fastapi/samples/fastapi_samples_streaming_download/requirements.txt" range="5-6" ::: 

1. Add this code to the `function_app.py` file in the project, which imports the FastAPI extension:

    :::code language="python" source="~/functions-python-extensions/azurefunctions-extensions-http-fastapi/samples/fastapi_samples_streaming_download/function_app.py" range="8" ::: 

1. When you deploy to Azure, add the following [application setting](./functions-how-to-use-azure-function-app-settings.md#settings) in your function app:

    `"PYTHON_ENABLE_INIT_INDEXING": "1"`

    When running locally, you also need to add these same settings to the `local.settings.json` project file.

### HTTP streams examples

After you enable the HTTP streaming feature, you can create functions that stream data over HTTP. 

This example is an HTTP triggered function that receives and processes streaming data from a client in real time. It demonstrates streaming upload capabilities that can be helpful for scenarios like processing continuous data streams and handling event data from IoT devices.

:::code language="python" source="~/functions-python-extensions/azurefunctions-extensions-http-fastapi/samples/fastapi_samples_streaming_upload/function_app.py" range="5-25" ::: 

### Calling HTTP streams

You must use an HTTP client library to make streaming calls to a function's FastAPI endpoints. The client tool or browser you're using might not natively support streaming or could only return the first chunk of data.

You can use a client script like this to send streaming data to an HTTP endpoint:

```python
import httpx # Be sure to add 'httpx' to 'requirements.txt'
import asyncio

async def stream_generator(file_path):
    chunk_size = 2 * 1024  # Define your own chunk size
    with open(file_path, 'rb') as file:
        while chunk := file.read(chunk_size):
            yield chunk
            print(f"Sent chunk: {len(chunk)} bytes")

async def stream_to_server(url, file_path):
    timeout = httpx.Timeout(60.0, connect=60.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.post(url, content=stream_generator(file_path))
        return response

async def stream_response(response):
    if response.status_code == 200:
        async for chunk in response.aiter_raw():
            print(f"Received chunk: {len(chunk)} bytes")
    else:
        print(f"Error: {response}")

async def main():
    print('helloworld')
    # Customize your streaming endpoint served from core tool in variable 'url' if different.
    url = 'http://localhost:7071/api/streaming_upload'
    file_path = r'<file path>'

    response = await stream_to_server(url, file_path)
    print(response)

if __name__ == "__main__":
    asyncio.run(main())
```


>[!IMPORTANT]  
> HTTP streams support for Python is generally available and is only supported for the Python v2 programming model.

::: zone-end  
### Working with client identities

If your function app is using [App Service Authentication / Authorization](../app-service/overview-authentication-authorization.md), you can view information about authenticated clients from your code. This information is available as [request headers injected by the platform](../app-service/configure-authentication-user-identities.md#access-user-claims-in-app-code).

You can also read this information from binding data. 

> [!NOTE] 
> Access to authenticated client information is currently only available for .NET languages. It also isn't supported in version 1.x of the Functions runtime.

::: zone pivot="programming-language-csharp"
Information regarding authenticated clients is available as a [ClaimsPrincipal], which is available as part of the request context as shown in the following example:

#### [Isolated worker model](#tab/isolated-process)

The authenticated user is available via [HTTP Headers](../app-service/configure-authentication-user-identities.md#access-user-claims-in-app-code).

#### [In-process model](#tab/in-process)

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

Alternatively, the ClaimsPrincipal can simply be included as an extra parameter in the function signature:

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
---

::: zone-end 
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-java,programming-language-python,programming-language-powershell"  

The authenticated user is available via [HTTP Headers](../app-service/configure-authentication-user-identities.md#access-user-claims-in-app-code).

::: zone-end

### <a name="http-auth"></a>Authorization level

The authorization level is a string value that indicates the kind of [authorization key](#authorization-keys) that's required to access the function endpoint. For an HTTP triggered function, the authorization level can be one of the following values:

| Level value | Description |
| --- | --- |
|**anonymous**| No access key is required.|
|**function**| A function-specific key is required to access the endpoint. |
|**admin**| The master key is required to access the endpoint.|

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-powershell,programming-language-python"
When a level isn't explicitly set, authorization defaults to the `function` level.
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
When a level isn't explicitly set, the default authorization depends on the version of the Node.js model:

#### [Model v4](#tab/nodejs-v4)

Authorization defaults to the `anonymous` level.

#### [Model v3](#tab/nodejs-v3)

Authorization defaults to the `function` level.

---
::: zone-end
### <a name="authorization-keys"></a>Function access keys

Functions lets you use access keys to make it harder to access your function endpoints. Unless the authorization level on an HTTP triggered function is set to `anonymous`, requests must include an access key in the request. For more information, see [Work with access keys in Azure Functions](function-keys-how-to.md). 

### <a name="api-key-authorization"></a>Access key authorization

Most HTTP trigger templates require an access key in the request. So your HTTP request normally looks like the following URL:

```http
https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>?code=<API_KEY>
```

Function apps that run in containers use the domain of the container host. For an example HTTP endpoint hosted in Azure Container Apps, see the example in [this Container Apps hosting article](functions-deploy-container-apps.md#verify-your-functions-on-azure).

The key can be included in a query string variable named `code`, as mentioned earlier. It can also be included in an `x-functions-key` HTTP header. The value of the key can be any function key defined for the function, or any host key.

You can allow anonymous requests, which don't require keys. You can also require that the master key is used. You change the default authorization level by using the `authLevel` property in the binding JSON. 

> [!NOTE]
> When running functions locally, authorization is disabled regardless of the specified authorization level setting. After publishing to Azure, the `authLevel` setting in your trigger is enforced. Keys are still required when running [locally in a container](functions-create-container-registry.md#build-the-container-image-and-verify-locally).

### Webhooks

> [!NOTE]
> Webhook mode is only available for version 1.x of the Functions runtime. This change was made to improve the performance of HTTP triggers in version 2.x and higher.

In version 1.x, webhook templates provide another validation for webhook payloads. In version 2.x and higher, the base HTTP trigger still works and is the recommended approach for webhooks. 

#### WebHook type

The `webHookType` binding property indicates the type if webhook supported by the function, which also dictates the supported payload.  The webhook type can be one of the following values:

| Type value | Description |
| --- | --- |
| **`genericJson`**| A general-purpose webhook endpoint without logic for a specific provider. This setting restricts requests to only those using HTTP POST and with the `application/json` content type.|
| **[`github`](#github-webhooks)** | The function responds to [GitHub webhooks](https://developer.github.com/webhooks/). Don't use the  `authLevel` property with GitHub webhooks. | 
| **[`slack`](#slack-webhooks)** | The function responds to [Slack webhooks](https://api.slack.com/outgoing-webhooks). Don't use the `authLevel` property with Slack webhooks. |

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

The HTTP request size and URL lengths are both limited based on [settings defined in the host](https://github.com/Azure/azure-functions-host/blob/dev/src/WebJobs.Script.WebHost/web.config#L19). For more information, see [Service limits](functions-scale.md#service-limits).

If a function that uses the HTTP trigger doesn't complete within 230 seconds, the [Azure Load Balancer](../app-service/faq-availability-performance-application-issues.yml#why-does-my-request-time-out-after-230-seconds-) will time out and return an HTTP 502 error. The function will continue running but will be unable to return an HTTP response. For long-running functions, we recommend that you follow async patterns and return a location where you can ping the status of the request. For information about how long a function can run, see [Scale and hosting - Consumption plan](functions-scale.md#timeout).


## Next steps

- [Return an HTTP response from a function](./functions-bindings-http-webhook-output.md)

[ClaimsPrincipal]: /dotnet/api/system.security.claims.claimsprincipal
[ASP.NET Core integration in .NET Isolated]: ./dotnet-isolated-process-guide.md#aspnet-core-integration
[HttpRequestData]: /dotnet/api/microsoft.azure.functions.worker.http.httprequestdata
[HttpResponseData]: /dotnet/api/microsoft.azure.functions.worker.http.httpresponsedata
[HttpRequest]: /dotnet/api/microsoft.aspnetcore.http.httprequest
[HttpResponse]: /dotnet/api/microsoft.aspnetcore.http.httpresponse
[IActionResult]: /dotnet/api/microsoft.aspnetcore.mvc.iactionresult
