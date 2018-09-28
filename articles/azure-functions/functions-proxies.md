---
title: Work with proxies in Azure Functions | Microsoft Docs
description: Overview of how to use Azure Functions Proxies
services: functions
author: alexkarcher-msft
manager: jeconnoc

ms.assetid: 
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 01/22/2018
ms.author: alkarche

---
# Work with Azure Functions Proxies

This article explains how to configure and work with Azure Functions Proxies. With this feature, you can specify endpoints on your function app that are implemented by another resource. You can use these proxies to break a large API into multiple function apps (as in a microservice architecture), while still presenting a single API surface for clients.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

> [!NOTE] 
> Standard Functions billing applies to proxy executions. For more information, see [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/).

## <a name="create"></a>Create a proxy

This section shows you how to create a proxy in the Functions portal.

1. Open the [Azure portal], and then go to your function app.
2. In the left pane, select **New proxy**.
3. Provide a name for your proxy.
4. Configure the endpoint that's exposed on this function app by specifying the **route template** and **HTTP methods**. These parameters behave according to the rules for [HTTP triggers].
5. Set the **backend URL** to another endpoint. This endpoint could be a function in another function app, or it could be any other API. The value does not need to be static, and it can reference [application settings] and [parameters from the original client request].
6. Click **Create**.

Your proxy now exists as a new endpoint on your function app. From a client perspective, it is equivalent to an HttpTrigger in Azure Functions. You can try out your new proxy by copying the Proxy URL and testing it with your favorite HTTP client.

## <a name="modify-requests-responses"></a>Modify requests and responses

With Azure Functions Proxies, you can modify requests to and responses from the back-end. These transformations can use variables as defined in [Use variables].

### <a name="modify-backend-request"></a>Modify the back-end request

By default, the back-end request is initialized as a copy of the original request. In addition to setting the back-end URL, you can make changes to the HTTP method, headers, and query string parameters. The modified values can reference [application settings] and [parameters from the original client request].

Back-end requests can be modified in the portal by expading the *request override* section of the proxy detail page. 

### <a name="modify-response"></a>Modify the response

By default, the client response is initialized as a copy of the back-end response. You can make changes to the response's status code, reason phrase, headers, and body. The modified values can reference [application settings], [parameters from the original client request], and [parameters from the back-end response].

Back-end requests can be modified in the portal by expading the *response override* section of the proxy detail page. 

## <a name="using-variables"></a>Use variables

The configuration for a proxy does not need to be static. You can condition it to use variables from the original client request, the back-end response, or application settings.

### <a name="reference-localhost"></a>Reference local functions
You can use `localhost` to reference a function inside the same function app directly, without a roundtrip proxy request.

`"backendurl": "https://localhost/api/httptriggerC#1"` will reference a local HTTP triggered function at the route `/api/httptriggerC#1`

 
>[!Note]  
>If your function uses *function, admin or sys* authorization levels, you will need to provide the code and clientId, as per the original function URL. In this case the reference would look like: `"backendurl": "https://localhost/api/httptriggerC#1?code=<keyvalue>&clientId=<keyname>"`

### <a name="request-parameters"></a>Reference request parameters

You can use request parameters as inputs to the back-end URL property or as part of modifying requests and responses. Some parameters can be bound from the route template that's specified in the base proxy configuration, and others can come from properties of the incoming request.

#### Route template parameters
Parameters that are used in the route template are available to be referenced by name. The parameter names are enclosed in braces ({}).

For example, if a proxy has a route template, such as `/pets/{petId}`, the back-end URL can include the value of `{petId}`, as in `https://<AnotherApp>.azurewebsites.net/api/pets/{petId}`. If the route template terminates in a wildcard, such as `/api/{*restOfPath}`, the value `{restOfPath}` is a string representation of the remaining path segments from the incoming request.

#### Additional request parameters
In addition to the route template parameters, the following values can be used in config values:

* **{request.method}**: The HTTP method that's used on the original request.
* **{request.headers.\<HeaderName\>}**: A header that can be read from the original request. Replace *\<HeaderName\>* with the name of the header that you want to read. If the header is not included on the request, the value will be the empty string.
* **{request.querystring.\<ParameterName\>}**: A query string parameter that can be read from the original request. Replace *\<ParameterName\>* with the name of the parameter that you want to read. If the parameter is not included on the request, the value will be the empty string.

### <a name="response-parameters"></a>Reference back-end response parameters

Response parameters can be used as part of modifying the response to the client. The following values can be used in config values:

* **{backend.response.statusCode}**: The HTTP status code that's returned on the back-end response.
* **{backend.response.statusReason}**: The HTTP reason phrase that's returned on the back-end response.
* **{backend.response.headers.\<HeaderName\>}**: A header that can be read from the back-end response. Replace *\<HeaderName\>* with the name of the header you want to read. If the header is not included on the response, the value will be the empty string.

### <a name="use-appsettings"></a>Reference application settings

You can also reference [application settings defined for the function app](https://docs.microsoft.com/azure/azure-functions/functions-how-to-use-azure-function-app-settings#develop) by surrounding the setting name with percent signs (%).

For example, a back-end URL of *https://%ORDER_PROCESSING_HOST%/api/orders* would have "%ORDER_PROCESSING_HOST%" replaced with the value of the ORDER_PROCESSING_HOST setting.

> [!TIP] 
> Use application settings for back-end hosts when you have multiple deployments or test environments. That way, you can make sure that you are always talking to the right back-end for that environment.

## <a name="debugProxies"></a>Troubleshoot Proxies

By adding the flag `"debug":true` to any proxy in your `proxies.json` you will enable debug logging. Logs are stored in `D:\home\LogFiles\Application\Proxies\DetailedTrace` and accessible through the advanced tools (kudu). Any HTTP responses will also contain a `Proxy-Trace-Location` header with a URL to access the log file.

You can debug a proxy from the client side by adding a `Proxy-Trace-Enabled` header set to `true`. This will also log a trace to the file system, and return the trace URL as a header in the response.

### Block proxy traces

For security reasons you may not want to allow anyone calling your service to generate a trace. They will not be able to access the trace contents without your login credentials, but generating the trace consumes resources and exposes that you are using Function Proxies.

Disable traces altogether by adding `"debug":false` to any particular proxy in your `proxies.json`.

## Advanced configuration

The proxies that you configure are stored in a *proxies.json* file, which is located in the root of a function app directory. You can manually edit this file and deploy it as part of your app when you use any of the [deployment methods](https://docs.microsoft.com/azure/azure-functions/functions-continuous-deployment) that Functions supports. 

> [!TIP] 
> If you have not set up one of the deployment methods, you can also work with the *proxies.json* file in the portal. Go to your function app, select **Platform features**, and then select **App Service Editor**. By doing so, you can view the entire file structure of your function app and then make changes.

*Proxies.json* is defined by a proxies object, which is composed of named proxies and their definitions. Optionally, if your editor supports it, you can reference a [JSON schema](http://json.schemastore.org/proxies) for code completion. An example file might look like the following:

```json
{
    "$schema": "http://json.schemastore.org/proxies",
    "proxies": {
        "proxy1": {
            "matchCondition": {
                "methods": [ "GET" ],
                "route": "/api/{test}"
            },
            "backendUri": "https://<AnotherApp>.azurewebsites.net/api/<FunctionName>"
        }
    }
}
```

Each proxy has a friendly name, such as *proxy1* in the preceding example. The corresponding proxy definition object is defined by the following properties:

* **matchCondition**: Required--an object defining the requests that trigger the execution of this proxy. It contains two properties that are shared with [HTTP triggers]:
    * _methods_: An array of the HTTP methods that the proxy responds to. If it is not specified, the proxy responds to all HTTP methods on the route.
    * _route_: Required--defines the route template, controlling which request URLs your proxy responds to. Unlike in HTTP triggers, there is no default value.
* **backendUri**: The URL of the back-end resource to which the request should be proxied. This value can reference application settings and parameters from the original client request. If this property is not included, Azure Functions responds with an HTTP 200 OK.
* **requestOverrides**: An object that defines transformations to the back-end request. See [Define a requestOverrides object].
* **responseOverrides**: An object that defines transformations to the client response. See [Define a responseOverrides object].

> [!NOTE] 
> The *route* property in Azure Functions Proxies does not honor the *routePrefix* property of the Function App host configuration. If you want to include a prefix such as `/api`, it must be included in the *route* property.

### <a name="disableProxies"></a>Disable individual proxies

You can disable individual proxies by adding `"disabled": true` to the proxy in the `proxies.json` file. This will cause any requests meeting the matchCondidtion to return 404.
```json
{
    "$schema": "http://json.schemastore.org/proxies",
    "proxies": {
        "Root": {
            "disabled":true,
            "matchCondition": {
                "route": "/example"
            },
            "backendUri": "www.example.com"
        }
    }
}
```

### <a name="requestOverrides"></a>Define a requestOverrides object

The requestOverrides object defines changes made to the request when the back-end resource is called. The object is defined by the following properties:

* **backend.request.method**: The HTTP method that's used to call the back-end.
* **backend.request.querystring.\<ParameterName\>**: A query string parameter that can be set for the call to the back-end. Replace *\<ParameterName\>* with the name of the parameter that you want to set. If the empty string is provided, the parameter is not included on the back-end request.
* **backend.request.headers.\<HeaderName\>**: A header that can be set for the call to the back-end. Replace *\<HeaderName\>* with the name of the header that you want to set. If you provide the empty string, the header is not included on the back-end request.

Values can reference application settings and parameters from the original client request.

An example configuration might look like the following:

```json
{
    "$schema": "http://json.schemastore.org/proxies",
    "proxies": {
        "proxy1": {
            "matchCondition": {
                "methods": [ "GET" ],
                "route": "/api/{test}"
            },
            "backendUri": "https://<AnotherApp>.azurewebsites.net/api/<FunctionName>",
            "requestOverrides": {
                "backend.request.headers.Accept": "application/xml",
                "backend.request.headers.x-functions-key": "%ANOTHERAPP_API_KEY%"
            }
        }
    }
}
```

### <a name="responseOverrides"></a>Define a responseOverrides object

The requestOverrides object defines changes that are made to the response that's passed back to the client. The object is defined by the following properties:

* **response.statusCode**: The HTTP status code to be returned to the client.
* **response.statusReason**: The HTTP reason phrase to be returned to the client.
* **response.body**: The string representation of the body to be returned to the client.
* **response.headers.\<HeaderName\>**: A header that can be set for the response to the client. Replace *\<HeaderName\>* with the name of the header that you want to set. If you provide the empty string, the header is not included on the response.

Values can reference application settings, parameters from the original client request, and parameters from the back-end response.

An example configuration might look like the following:

```json
{
    "$schema": "http://json.schemastore.org/proxies",
    "proxies": {
        "proxy1": {
            "matchCondition": {
                "methods": [ "GET" ],
                "route": "/api/{test}"
            },
            "responseOverrides": {
                "response.body": "Hello, {test}",
                "response.headers.Content-Type": "text/plain"
            }
        }
    }
}
```
> [!NOTE] 
> In this example, the response body is set directly, so no `backendUri` property is needed. The example shows how you might use Azure Functions Proxies for mocking APIs.

[Azure portal]: https://portal.azure.com
[HTTP triggers]: https://docs.microsoft.com/azure/azure-functions/functions-bindings-http-webhook#http-trigger
[Modify the back-end request]: #modify-backend-request
[Modify the response]: #modify-response
[Define a requestOverrides object]: #requestOverrides
[Define a responseOverrides object]: #responseOverrides
[application settings]: #use-appsettings
[Use variables]: #using-variables
[parameters from the original client request]: #request-parameters
[parameters from the back-end response]: #response-parameters
