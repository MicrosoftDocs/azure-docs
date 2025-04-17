---
title: Azure Functions SignalR Service input binding
description: Learn to return a SignalR service endpoint URL and access token in Azure Functions.
author: Y-Sindo
ms.topic: reference
ms.devlang: csharp
# ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-csharp, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 12/29/2024
ms.author: zityang
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# SignalR Service input binding for Azure Functions

Before a client can connect to Azure SignalR Service, it must retrieve the service endpoint URL and a valid access token. The *SignalRConnectionInfo* input binding produces the SignalR Service endpoint URL and a valid token that are used to connect to the service. The token is time-limited and can be used to authenticate a specific user to a connection. Therefore, you shouldn't cache the token or share it between clients. Usually you use *SignalRConnectionInfo* with HTTP trigger for clients to retrieve the connection information.

For more information on how to use this binding to create a "negotiate" function that is compatible with a SignalR client SDK, see [Azure Functions development and configuration with Azure SignalR Service](../azure-signalr/signalr-concept-serverless-development-config.md).

When not explicitly declared, assume that examples are using the default connection setting value of `AzureSignalRConnectionString`. For information on setup and configuration details, see the [overview](functions-bindings-signalr-service.md).

## Example

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro-with-csx](../../includes/functions-bindings-csharp-intro-with-csx.md)]

[!INCLUDE [functions-in-process-model-retirement-note](../../includes/functions-in-process-model-retirement-note.md)]

# [Isolated worker model](#tab/isolated-process)

The following example shows a [C# function](dotnet-isolated-process-guide.md) that acquires SignalR connection information using the input binding and returns it over HTTP.

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/SignalR/SignalRNegotiationFunctions.cs" id="snippet_negotiate":::

# [In-process model](#tab/in-process)

The following example shows a [C# function](functions-dotnet-class-library.md) that acquires SignalR connection information using the input binding and returns it over HTTP.

```cs
[FunctionName("negotiate")]
public static SignalRConnectionInfo Negotiate(
    [HttpTrigger(AuthorizationLevel.Anonymous)]HttpRequest req,
    [SignalRConnectionInfo(HubName = "hubName1")]SignalRConnectionInfo connectionInfo)
{
    return connectionInfo;
}
```

---
::: zone-end

::: zone pivot="programming-language-python,programming-language-powershell"

[!INCLUDE [functions-bindings-signalr-input-function-json](../../includes/functions-bindings-signalr-input-function-json.md)]

::: zone-end
::: zone pivot="programming-language-javascript"

Here's the JavaScript code:

# [Model v4](#tab/nodejs-v4)

```javascript
const { app, input } = require('@azure/functions');

const inputSignalR = input.generic({
    type: 'signalRConnectionInfo',
    name: 'connectionInfo',
    hubName: 'hubName1',
    connectionStringSetting: 'AzureSignalRConnectionString',
});

app.post('negotiate', {
    authLevel: 'function',
    handler: (request, context) => {
        return { body: JSON.stringify(context.extraInputs.get(inputSignalR)) }
    },
    route: 'negotiate',
    extraInputs: [inputSignalR],
});

```

# [Model v3](#tab/nodejs-v3)

[!INCLUDE [functions-bindings-signalr-input-function-json](../../includes/functions-bindings-signalr-input-function-json.md)]

```javascript
module.exports = async function (context, req, connectionInfo) {
    context.res.body = connectionInfo;
};
```

::: zone-end
::: zone pivot="programming-language-powershell"

Complete PowerShell examples are pending.
::: zone-end
::: zone pivot="programming-language-python"

The following example shows a SignalR connection info input binding in a *function.json* file and a [Python function](functions-reference-python.md) that uses the binding to return the connection information.

Here's the Python code:

```python
def main(req: func.HttpRequest, connectionInfoJson: str) -> func.HttpResponse:
    return func.HttpResponse(
        connectionInfoJson,
        status_code=200,
        headers={
            'Content-type': 'application/json'
        }
    )
```

::: zone-end
::: zone pivot="programming-language-java"

The following example shows a [Java function](functions-reference-java.md) that acquires SignalR connection information using the input binding and returns it over HTTP.

```java
@FunctionName("negotiate")
public SignalRConnectionInfo negotiate(
        @HttpTrigger(
            name = "req",
            methods = { HttpMethod.POST },
            authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Optional<String>> req,
        @SignalRConnectionInfoInput(
            name = "connectionInfo",
            HubName = "hubName1") SignalRConnectionInfo connectionInfo) {
    return connectionInfo;
}
```

:::zone-end
::: zone pivot="programming-language-csharp"

## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use attribute to define the function. C# script instead uses a function.json configuration file.

# [Isolated worker model](#tab/isolated-process)

The following table explains the properties of the `SignalRConnectionInfoInput` attribute:

| Attribute property |Description|
|---------|----------------------|
|**HubName**| Required. The hub name.  |
|**ConnectionStringSetting**| The name of the app setting or settings collection that contains the SignalR Service connection string, which defaults to `AzureSignalRConnectionString`. |
|**UserId**| Optional. The user identifier of a SignalR connection. You can use a [binding expression](#binding-expressions-for-http-trigger) to bind the value to an HTTP request header or query.  |
|**IdToken**| Optional. A JWT token whose claims will be added to the user claims. It should be used together with **ClaimTypeList**. You can use a [binding expression](#binding-expressions-for-http-trigger) to bind the value to an HTTP request header or query. |
|**ClaimTypeList**| Optional. A list of claim types, which filter the claims in **IdToken** . |

# [In-process model](#tab/in-process)

The following table explains the properties of the `SignalRConnectionInfo` attribute:

| Attribute property |Description|
|---------|----------------------|
|**HubName**| Required. The hub name.  |
|**ConnectionStringSetting**| The name of the app setting or settings collection that contains the SignalR Service connection string, which defaults to `AzureSignalRConnectionString`. |
|**UserId**| Optional. The user identifier of a SignalR connection. You can use a [binding expression](#binding-expressions-for-http-trigger) to bind the value to an HTTP request header or query.  |
|**IdToken**| Optional. A JWT token whose claims will be added to the user claims. It should be used together with **ClaimTypeList**. You can use a [binding expression](#binding-expressions-for-http-trigger) to bind the value to an HTTP request header or query. |
|**ClaimTypeList**| Optional. A list of claim types, which filter the claims in **IdToken** . |

---

::: zone-end
::: zone pivot="programming-language-java"

## Annotations

The following table explains the supported settings for the `SignalRConnectionInfoInput` annotation.

|Setting | Description|
|---------|--------|
|**name**|  Variable name used in function code for connection info object. |
|**hubName**| Required. The hub name.  |
|**connectionStringSetting**| The name of the app setting or settings collection that contains the SignalR Service connection string, which defaults to `AzureSignalRConnectionString`. |
|**userId**| Optional. The user identifier of a SignalR connection. You can use a [binding expression](#binding-expressions-for-http-trigger) to bind the value to an HTTP request header or query.  |
|**idToken**| Optional. A JWT token whose claims will be added to the user claims. It should be used together with **claimTypeList**. You can use a [binding expression](#binding-expressions-for-http-trigger) to bind the value to an HTTP request header or query. |
|**claimTypeList**| Optional. A list of claim types, which filter the claims in **idToken** . |

::: zone-end

::: zone pivot="programming-language-javascript"

## Annotations

The following table explains the supported settings for the `SignalRConnectionInfoInput` annotation.

|Setting | Description|
|---------|--------|
|**name**|  Variable name used in function code for connection info object. |
|**hubName**| Required. The hub name.  |
|**connectionStringSetting**| The name of the app setting or settings collection that contains the SignalR Service connection string, which defaults to `AzureSignalRConnectionString`. |
|**userId**| Optional. The user identifier of a SignalR connection. You can use a [binding expression](#binding-expressions-for-http-trigger) to bind the value to an HTTP request header or query.  |
|**idToken**| Optional. A JWT token whose claims will be added to the user claims. It should be used together with **claimTypeList**. You can use a [binding expression](#binding-expressions-for-http-trigger) to bind the value to an HTTP request header or query. |
|**claimTypeList**| Optional. A list of claim types, which filter the claims in **idToken** . |

::: zone-end

::: zone pivot="programming-language-powershell,programming-language-python"
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|--------|
|**type**|  Must be set to `signalRConnectionInfo`.|
|**direction**|  Must be set to `in`.|
|**hubName**| Required. The hub name.  |
|**connectionStringSetting**| The name of the app setting or settings collection that contains the SignalR Service connection string, which defaults to `AzureSignalRConnectionString`. |
|**userId**| Optional. The user identifier of a SignalR connection. You can use a [binding expression](#binding-expressions-for-http-trigger) to bind the value to an HTTP request header or query.  |
|**idToken**| Optional. A JWT token whose claims will be added to the user claims. It should be used together with **claimTypeList**. You can use a [binding expression](#binding-expressions-for-http-trigger) to bind the value to an HTTP request header or query. |
|**claimTypeList**| Optional. A list of claim types, which filter the claims in **idToken** . |

::: zone-end

> [!Warning]
> For the simplicity, we omit the authentication and authorization parts in this sample. As a result, this endpoint is publicly accessible without any restrictions. To ensure the security of your negotiation endpoint, you should implement appropriate authentication and authorization mechanisms based on your specific requirements. For guidance on protecting your HTTP endpoints, see the following articles: 
> * [Secure HTTP endpoints](../azure-functions/security-concepts.md#secure-http-endpoints).
> * [Authentication and authorization in Azure App Service and Azure Functions](../app-service/overview-authentication-authorization.md)


## Usage

### Managed identity-based connections

[!INCLUDE [functions-azure-signalr-authorization-note](../../includes/functions-azure-signalr-authorization-note.md)] 

### Authenticated tokens

When an authenticated client triggers the function, you can add a user ID claim to the generated token. You can easily add authentication to a function app using [App Service Authentication](../app-service/overview-authentication-authorization.md).

App Service authentication sets HTTP headers named `x-ms-client-principal-id` and `x-ms-client-principal-name` that contain the authenticated user's client principal ID and name, respectively.

You can set the `UserId` property of the binding to the value from either header using a [binding expression](#binding-expressions-for-http-trigger): `{headers.x-ms-client-principal-id}` or `{headers.x-ms-client-principal-name}`.

::: zone pivot="programming-language-csharp"

# [Isolated worker model](#tab/isolated-process)

```cs
[Function("Negotiate")]
public static string Negotiate([HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequestData req,
    [SignalRConnectionInfoInput(HubName = "hubName1", UserId = "{headers.x-ms-client-principal-id}")] string connectionInfo)
{
    // The serialization of the connection info object is done by the framework. It should be camel case. The SignalR client respects the camel case response only.
    return connectionInfo;
}
```

# [In-process model](#tab/in-process)


```cs
[FunctionName("negotiate")]
public static SignalRConnectionInfo Negotiate(
    [HttpTrigger(AuthorizationLevel.Anonymous)]HttpRequest req,
    [SignalRConnectionInfo
        (HubName = "hubName1", UserId = "{headers.x-ms-client-principal-id}")]
        SignalRConnectionInfo connectionInfo)
{
    // connectionInfo contains an access key token with a name identifier claim set to the authenticated user
    return connectionInfo;
}
```

---

::: zone-end

::: zone pivot="programming-language-java"
```java
@FunctionName("negotiate")
public SignalRConnectionInfo negotiate(
        @HttpTrigger(
            name = "req",
            methods = { HttpMethod.POST, HttpMethod.GET },
            authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> req,
        @SignalRConnectionInfoInput(name = "connectionInfo", hubName = "hubName1", userId = "{headers.x-ms-signalr-userid}") SignalRConnectionInfo connectionInfo) {
    return connectionInfo;
}
```
::: zone-end

::: zone pivot="programming-language-python,programming-language-powershell"

Here's binding data in the *function.json* file:

```json
{
    "type": "signalRConnectionInfo",
    "name": "connectionInfo",
    "hubName": "hubName1",
    "userId": "{headers.x-ms-client-principal-id}",
    "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
    "direction": "in"
}
```

::: zone-end
::: zone pivot="programming-language-javascript"
Here's the JavaScript code:

# [Model v4](#tab/nodejs-v4)
```javascript
const { app, input } = require('@azure/functions');

const inputSignalR = input.generic({
    type: 'signalRConnectionInfo',
    name: 'connectionInfo',
    hubName: 'hubName1',
    connectionStringSetting: 'AzureSignalRConnectionString',
    userId: '{headers.x-ms-client-principal-id}',
});

app.post('negotiate', {
    authLevel: 'function',
    handler: (request, context) => {
        return { body: JSON.stringify(context.extraInputs.get(inputSignalR)) }
    },
    route: 'negotiate',
    extraInputs: [inputSignalR],
});
```

# [Model v3](#tab/nodejs-v3)

Here's binding data in the *function.json* file:

```json
{
    "type": "signalRConnectionInfo",
    "name": "connectionInfo",
    "hubName": "hubName1",
    "userId": "{headers.x-ms-client-principal-id}",
    "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
    "direction": "in"
}
```

```javascript
module.exports = async function (context, req, connectionInfo) {
    // connectionInfo contains an access key token with a name identifier
    // claim set to the authenticated user
    context.res.body = connectionInfo;
};
```
::: zone-end
::: zone pivot="programming-language-powershell"

Complete PowerShell examples are pending.
::: zone-end
::: zone pivot="programming-language-python"

Here's the Python code:

```python
def main(req: func.HttpRequest, connectionInfo: str) -> func.HttpResponse:
    # connectionInfo contains an access key token with a name identifier
    # claim set to the authenticated user
    return func.HttpResponse(
        connectionInfo,
        status_code=200,
        headers={
            'Content-type': 'application/json'
        }
    )
```

::: zone-end
::: zone pivot="programming-language-java"

```java
@FunctionName("negotiate")
public SignalRConnectionInfo negotiate(
        @HttpTrigger(
            name = "req",
            methods = { HttpMethod.POST },
            authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Optional<String>> req,
        @SignalRConnectionInfoInput(
            name = "connectionInfo",
            HubName = "hubName1",
            userId = "{headers.x-ms-client-principal-id}") SignalRConnectionInfo connectionInfo) {
    return connectionInfo;
}
```
::: zone-end

### Binding expressions for HTTP trigger
<a name="binding-expressions-for-http-trigger"></a>
It's a common scenario that the values of some attributes of SignalR input binding  come from HTTP requests. Therefore, we show how to bind values from HTTP requests to SignalR input binding attributes via [binding expression](./functions-bindings-expressions-patterns.md#trigger-metadata).

| HTTP metadata type | Binding expression format | Description | Example |
|---------|--------|---------|--------|
| HTTP request query | `{query.QUERY_PARAMETER_NAME}` | Binds the value of corresponding query parameter to an attribute | `{query.userName}` |
| HTTP request header | `{headers.HEADER_NAME}` | Binds the value of a header to an attribute | `{headers.token}` |

## Next steps

- [Handle messages from SignalR Service  (Trigger binding)](./functions-bindings-signalr-service-trigger.md)
- [Send SignalR Service messages  (Output binding)](./functions-bindings-signalr-service-output.md)
