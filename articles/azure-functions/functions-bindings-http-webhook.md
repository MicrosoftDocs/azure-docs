---
title: Azure Functions HTTP triggers and bindings
description: Understand how to use HTTP triggers and bindings in Azure Functions.
services: functions
documentationcenter: na
author: craigshoemaker
manager: gwallace
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture, HTTP, API, REST

ms.service: azure-functions
ms.devlang: multiple
ms.topic: reference
ms.date: 11/21/2017
ms.author: cshoe
---

# Azure Functions HTTP triggers and bindings

This article explains how to work with HTTP triggers and output bindings in Azure Functions.

An HTTP trigger can be customized to respond to [webhooks](https://en.wikipedia.org/wiki/Webhook).

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

[!INCLUDE [HTTP client best practices](../../includes/functions-http-client-best-practices.md)]

The code in this article defaults to Functions 2.x syntax which uses .NET Core. For information on the 1.x syntax, see the [1.x functions templates](https://github.com/Azure/azure-functions-templates/tree/v1.x/Functions.Templates/Templates).

## Packages - Functions 1.x

The HTTP bindings are provided in the [Microsoft.Azure.WebJobs.Extensions.Http](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Http) NuGet package, version 1.x. Source code for the package is in the [azure-webjobs-sdk-extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/tree/v2.x/src/WebJobs.Extensions.Http) GitHub repository.

[!INCLUDE [functions-package-auto](../../includes/functions-package-auto.md)]

## Packages - Functions 2.x

The HTTP bindings are provided in the [Microsoft.Azure.WebJobs.Extensions.Http](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Http) NuGet package, version 3.x. Source code for the package is in the [azure-webjobs-sdk-extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.Http/) GitHub repository.

[!INCLUDE [functions-package](../../includes/functions-package-auto.md)]

## Trigger

The HTTP trigger lets you invoke a function with an HTTP request. You can use an HTTP trigger to build serverless APIs and respond to webhooks.

By default, an HTTP trigger returns HTTP 200 OK with an empty body in Functions 1.x, or HTTP 204 No Content with an empty body in Functions 2.x. To modify the response, configure an [HTTP output binding](#output).

## Trigger - example

See the language-specific example:

* [C#](#trigger---c-example)
* [C# script (.csx)](#trigger---c-script-example)
* [F#](#trigger---f-example)
* [Java](#trigger---java-examples)
* [JavaScript](#trigger---javascript-example)
* [Python](#trigger---python-example)

### Trigger - C# example

The following example shows a [C# function](functions-dotnet-class-library.md) that looks for a `name` parameter either in the query string or the body of the HTTP request. Notice that the return value is used for the output binding, but a return value attribute isn't required.

```cs
[FunctionName("HttpTriggerCSharp")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] 
    HttpRequest req, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string name = req.Query["name"];

    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    name = name ?? data?.name;

    return name != null
        ? (ActionResult)new OkObjectResult($"Hello, {name}")
        : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
}
```

### Trigger - C# script example

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

The [configuration](#trigger---configuration) section explains these properties.

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

    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    name = name ?? data?.name;

    return name != null
        ? (ActionResult)new OkObjectResult($"Hello, {name}")
        : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
}
```

You can bind to a custom object instead of `HttpRequest`. This object is created from the body of the request and parsed as JSON. Similarly, a type can be passed to the HTTP response output binding and returned as the response body, along with a 200 status code.

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

### Trigger - F# example

The following example shows a trigger binding in a *function.json* file and an [F# function](functions-reference-fsharp.md) that uses the binding. The function looks for a `name` parameter either in the query string or the body of the HTTP request.

Here's the *function.json* file:

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "name": "res",
      "type": "http",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The [configuration](#trigger---configuration) section explains these properties.

Here's the F# code:

```fsharp
open System.Net
open System.Net.Http
open FSharp.Interop.Dynamic

let Run(req: HttpRequestMessage) =
    async {
        let q =
            req.GetQueryNameValuePairs()
                |> Seq.tryFind (fun kv -> kv.Key = "name")
        match q with
        | Some kv ->
            return req.CreateResponse(HttpStatusCode.OK, "Hello " + kv.Value)
        | None ->
            let! data = Async.AwaitTask(req.Content.ReadAsAsync<obj>())
            try
                return req.CreateResponse(HttpStatusCode.OK, "Hello " + data?name)
            with e ->
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Please pass a name on the query string or in the request body")
    } |> Async.StartAsTask
```

You need a `project.json` file that uses NuGet to reference the `FSharp.Interop.Dynamic` and `Dynamitey` assemblies, as shown in the following example:

```json
{
  "frameworks": {
    "net46": {
      "dependencies": {
        "Dynamitey": "1.0.2",
        "FSharp.Interop.Dynamic": "3.0.0"
      }
    }
  }
}
```

### Trigger - JavaScript example

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

The [configuration](#trigger---configuration) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = function(context, req) {
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
    context.done();
};
```

### Trigger - Python example

The following example shows a trigger binding in a *function.json* file and a [Python function](functions-reference-python.md) that uses the binding. The function looks for a `name` parameter either in the query string or the body of the HTTP request.

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
            "name": "res"
        }
    ]
}
```

The [configuration](#trigger---configuration) section explains these properties.

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

### Trigger - Java examples

* [Read parameter from the query string](#read-parameter-from-the-query-string-java)
* [Read body from a POST request](#read-body-from-a-post-request-java)
* [Read parameter from a route](#read-parameter-from-a-route-java)
* [Read POJO body from a POST request](#read-pojo-body-from-a-post-request-java)

The following examples show the HTTP trigger binding in a *function.json* file and the respective [Java functions](functions-reference-java.md) that use the binding. 

Here's the *function.json* file:

```json
{
    "disabled": false,    
    "bindings": [
        {
            "authLevel": "anonymous",
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

#### Read parameter from the query string (Java)  

This example reads a parameter, named ```id```, from the query string, and uses it to build a JSON document returned to the client, with content type ```application/json```. 

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

#### Read body from a POST request (Java)  

This example reads the body of a POST request, as a ```String```, and uses it to build a JSON document returned to the client, with content type ```application/json```.

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

#### Read parameter from a route (Java)  

This example reads a mandatory parameter, named ```id```, and an optional parameter ```name``` from the route path, and uses them to build a JSON document returned to the client, with content type ```application/json```. T

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

#### Read POJO body from a POST request (Java)  

Here is the code for the ```ToDoItem``` class, referenced in this example:

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

This example reads the body of a POST request. The request body gets automatically de-serialized into a ```ToDoItem``` object, and is returned to the client, with content type ```application/json```. The ```ToDoItem``` parameter is serialized by the Functions runtime as it is assigned to the ```body``` property of the ```HttpMessageResponse.Builder``` class.

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

## Trigger - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [HttpTrigger](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/dev/src/WebJobs.Extensions.Http/HttpTriggerAttribute.cs) attribute.

You can set the authorization level and allowable HTTP methods in attribute constructor parameters, and there are properties for webhook type and route template. For more information about these settings, see [Trigger - configuration](#trigger---configuration). Here's an `HttpTrigger` attribute in a method signature:

```csharp
[FunctionName("HttpTriggerCSharp")]
public static Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequest req)
{
    ...
}
```

For a complete example, see [Trigger - C# example](#trigger---c-example).

## Trigger - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `HttpTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
| **type** | n/a| Required - must be set to `httpTrigger`. |
| **direction** | n/a| Required - must be set to `in`. |
| **name** | n/a| Required - the variable name used in function code for the request or request body. |
| <a name="http-auth"></a>**authLevel** |  **AuthLevel** |Determines what keys, if any, need to be present on the request in order to invoke the function. The authorization level can be one of the following values: <ul><li><code>anonymous</code>&mdash;No API key is required.</li><li><code>function</code>&mdash;A function-specific API key is required. This is the default value if none is provided.</li><li><code>admin</code>&mdash;The master key is required.</li></ul> For more information, see the section about [authorization keys](#authorization-keys). |
| **methods** |**Methods** | An array of the HTTP methods to which the function  responds. If not specified, the function responds to all HTTP methods. See [customize the http endpoint](#customize-the-http-endpoint). |
| **route** | **Route** | Defines the route template, controlling to which request URLs your function responds. The default value if none is provided is `<functionname>`. For more information, see [customize the http endpoint](#customize-the-http-endpoint). |
| **webHookType** | **WebHookType** | _Supported only for the version 1.x runtime._<br/><br/>Configures the HTTP trigger to act as a [webhook](https://en.wikipedia.org/wiki/Webhook) receiver for the specified provider. Don't set the `methods` property if you set this property. The webhook type can be one of the following values:<ul><li><code>genericJson</code>&mdash;A general-purpose webhook endpoint without logic for a specific provider. This setting restricts requests to only those using HTTP POST and with the `application/json` content type.</li><li><code>github</code>&mdash;The function responds to [GitHub webhooks](https://developer.github.com/webhooks/). Do not use the  _authLevel_ property with GitHub webhooks. For more information, see the GitHub webhooks section later in this article.</li><li><code>slack</code>&mdash;The function responds to [Slack webhooks](https://api.slack.com/outgoing-webhooks). Do not use the _authLevel_ property with Slack webhooks. For more information, see the Slack webhooks section later in this article.</li></ul>|

## Trigger - usage

For C# and F# functions, you can declare the type of your trigger input to be either `HttpRequest` or a custom type. If you choose `HttpRequest`, you get full access to the request object. For a custom type, the runtime tries to parse the JSON request body to set the object properties.

For JavaScript functions, the Functions runtime provides the request body instead of the request object. For more information, see the [JavaScript trigger example](#trigger---javascript-example).

### Customize the HTTP endpoint

By default when you create a function for an HTTP trigger, the function is addressable with a route of the form:

    http://<yourapp>.azurewebsites.net/api/<funcname>

You can customize this route using the optional `route` property on the HTTP trigger's input binding. As an example, the following *function.json* file defines a `route` property for an HTTP trigger:

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

Using this configuration, the function is now addressable with the following route instead of the original route.

```
http://<yourapp>.azurewebsites.net/api/products/electronics/357
```

This allows the function code to support two parameters in the address, _category_ and _id_. You can use any [Web API Route Constraint](https://www.asp.net/web-api/overview/web-api-routing-and-actions/attribute-routing-in-web-api-2#constraints) with your parameters. The following C# function code makes use of both parameters.

```csharp
public static Task<IActionResult> Run(HttpRequest req, string category, int? id, ILogger log)
{
    if (id == null)
    {
        return (ActionResult)new OkObjectResult($"All {category} items were requested.");
    }
    else
    {
        return (ActionResult)new OkObjectResult($"{category} item with id = {id} has been requested.");
    }
    
    // -----
    log.LogInformation($"C# HTTP trigger function processed a request. RequestUri={req.RequestUri}");
}
```

Here is Node.js function code that uses the same route parameters.

```javascript
module.exports = function (context, req) {

    var category = context.bindingData.category;
    var id = context.bindingData.id;

    if (!id) {
        context.res = {
            // status defaults to 200 */
            body: "All " + category + " items were requested."
        };
    }
    else {
        context.res = {
            // status defaults to 200 */
            body: category + " item with id = " + id + " was requested."
        };
    }

    context.done();
}
```

By default, all function routes are prefixed with *api*. You can also customize or remove the prefix using the `http.routePrefix` property in your [host.json](functions-host-json.md) file. The following example removes the *api* route prefix by using an empty string for the prefix in the *host.json* file.

```json
{
    "http": {
    "routePrefix": ""
    }
}
```

### Working with client identities

If your function app is using [App Service Authentication / Authorization](../app-service/overview-authentication-authorization.md), you can view information about authenticated clients from your code. This information is available as [request headers injected by the platform](../app-service/app-service-authentication-how-to.md#access-user-claims). 

You can also read this information from binding data. This capability is only available to the Functions 2.x runtime. It is also currently only available for .NET languages.

In .NET languages, this information is available as a [ClaimsPrincipal](https://docs.microsoft.com/dotnet/api/system.security.claims.claimsprincipal). The ClaimsPrincipal is available as part of the request context as shown in the following example:

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

### Authorization keys

Functions lets you use keys to make it harder to access your HTTP function endpoints during development.  A standard HTTP trigger may require such an API key be present in the request. 

> [!IMPORTANT]
> While keys may help obfuscate your HTTP endpoints during development, they are not intended as a way to secure an HTTP trigger in production. To learn more, see [Secure an HTTP endpoint in production](#secure-an-http-endpoint-in-production).

> [!NOTE]
> In the Functions 1.x runtime, webhook providers may use keys to authorize requests in a variety of ways, depending on what the provider supports. This is covered in [Webhooks and keys](#webhooks-and-keys). The version 2.x runtime does not include built-in support for webhook providers.

There are two types of keys:

* **Host keys**: These keys are shared by all functions within the function app. When used as an API key, these allow access to any function within the function app.
* **Function keys**: These keys apply only to the specific functions under which they are defined. When used as an API key, these only allow access to that function.

Each key is named for reference, and there is a default key (named "default") at the function and host level. Function keys take precedence over host keys. When two keys are defined with the same name, the function key is always used.

Each function app also has a special **master key**. This key is a host key named `_master`, which provides administrative access to the runtime APIs. This key cannot be revoked. When you set an authorization level of `admin`, requests must use the master key; any other key results in authorization failure.

> [!CAUTION]  
> Due to the elevated permissions in your function app granted by the master key, you should not share this key with third parties or distribute it in native client applications. Use caution when choosing the admin authorization level.

### Obtaining keys

Keys are stored as part of your function app in Azure and are encrypted at rest. To view your keys, create new ones, or roll keys to new values, navigate to one of your HTTP-triggered functions in the [Azure portal](https://portal.azure.com) and select **Manage**.

![Manage function keys in the portal.](./media/functions-bindings-http-webhook/manage-function-keys.png)

There is no supported API for programmatically obtaining function keys.

### API key authorization

Most HTTP trigger templates require an API key in the request. So your HTTP request normally looks like the following URL:

    https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>?code=<API_KEY>

The key can be included in a query string variable named `code`, as above. It can also be included in an `x-functions-key` HTTP header. The value of the key can be any function key defined for the function, or any host key.

You can allow anonymous requests, which do not require keys. You can also require that the master key be used. You change the default authorization level by using the `authLevel` property in the binding JSON. For more information, see [Trigger - configuration](#trigger---configuration).

> [!NOTE]
> When running functions locally, authorization is disabled regardless of the specified authentication level setting. After publishing to Azure, the `authLevel` setting in your trigger is enforced.



### Secure an HTTP endpoint in production

To fully secure your function endpoints in production, you should consider implementing one of the following function app-level security options:

* Turn on App Service Authentication / Authorization for your function app. The App Service platform lets use Azure Active Directory (AAD) and several third-party identity providers to authenticate clients. You can use this to implement custom authorization rules for your functions, and you can work with user information from your function code. To learn more, see [Authentication and authorization in Azure App Service](../app-service/overview-authentication-authorization.md) and [Working with client identities](#working-with-client-identities).

* Use Azure API Management (APIM) to authenticate requests. APIM provides a variety of API security options for incoming requests. To learn more, see [API Management authentication policies](../api-management/api-management-authentication-policies.md). With APIM in place, you can configure your function app to accept requests only from the IP address of your APIM instance. To learn more, see [IP address restrictions](ip-addresses.md#ip-address-restrictions).

* Deploy your function app to an Azure App Service Environment (ASE). ASE provides a dedicated hosting environment in which to run your functions. ASE lets you configure a single front-end gateway that you can use to authenticate all incoming requests. For more information, see [Configuring a Web Application Firewall (WAF) for App Service Environment](../app-service/environment/app-service-app-service-environment-web-application-firewall.md).

When using one of these function app-level security methods, you should set the HTTP-triggered function authentication level to `anonymous`.

### Webhooks

> [!NOTE]
> Webhook mode is only available for version 1.x of the Functions runtime. This change was made to improve the performance of HTTP triggers in version 2.x.

In version 1.x, webhook templates provide additional validation for webhook payloads. In version 2.x, the base HTTP trigger still works and is the recommended approach for webhooks. 

#### GitHub webhooks

To respond to GitHub webhooks, first create your function with an HTTP Trigger, and set the **webHookType** property to `github`. Then copy its URL and API key into the **Add webhook** page of your GitHub repository. 

![](./media/functions-bindings-http-webhook/github-add-webhook.png)

#### Slack webhooks

The Slack webhook generates a token for you instead of letting you specify it, so you must configure a function-specific key with the token from Slack. See [Authorization keys](#authorization-keys).

### Webhooks and keys

Webhook authorization is handled by the webhook receiver component, part of the HTTP trigger, and the mechanism varies based on the webhook type. Each mechanism does rely on a key. By default, the function key named "default" is used. To use a different key, configure the webhook provider to send the key name with the request in one of the following ways:

* **Query string**: The provider passes the key name in the `clientid` query string parameter, such as `https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>?clientid=<KEY_NAME>`.
* **Request header**: The provider passes the key name in the `x-functions-clientid` header.

## Trigger - limits

The HTTP request length is limited to 100 MB (104,857,600 bytes), and the URL length is limited to 4 KB (4,096 bytes). These limits are specified by the `httpRuntime` element of the runtime's [Web.config file](https://github.com/Azure/azure-webjobs-sdk-script/blob/v1.x/src/WebJobs.Script.WebHost/Web.config).

If a function that uses the HTTP trigger doesn't complete within about 2.5 minutes, the gateway will time out and return an HTTP 502 error. The function will continue running but will be unable to return an HTTP response. For long-running functions, we recommend that you follow async patterns and return a location where you can ping the status of the request. For information about how long a function can run, see [Scale and hosting - Consumption plan](functions-scale.md#consumption-plan).

## Trigger - host.json properties

The [host.json](functions-host-json.md) file contains settings that control HTTP trigger behavior.

[!INCLUDE [functions-host-json-http](../../includes/functions-host-json-http.md)]

## Output

Use the HTTP output binding to respond to the HTTP request sender. This binding requires an HTTP trigger and allows you to customize the response associated with the trigger's request. If an HTTP output binding is not provided, an HTTP trigger returns HTTP 200 OK with an empty body in Functions 1.x, or HTTP 204 No Content with an empty body in Functions 2.x.

## Output - configuration

The following table explains the binding configuration properties that you set in the *function.json* file. For C# class libraries, there are no attribute properties that correspond to these *function.json* properties.

|Property  |Description  |
|---------|---------|
| **type** |Must be set to `http`. |
| **direction** | Must be set to `out`. |
|**name** | The variable name used in function code for the response, or `$return` to use the return value. |

## Output - usage

To send an HTTP response, use the language-standard response patterns. In C# or C# script, make the function return type `IActionResult` or `Task<IActionResult>`. In C#, a return value attribute isn't required.

For example responses, see the [trigger example](#trigger---example).

## Next steps

[Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
