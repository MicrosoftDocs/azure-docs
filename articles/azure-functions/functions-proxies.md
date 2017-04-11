---
title: Working with proxies in Azure Functions | Microsoft Docs
description: Overview of how to use Azure Functions Proxies
services: functions
documentationcenter: ''
author: mattchenderson
manager: erikre
editor: ''

ms.assetid: 
ms.service: functions
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 04/11/2017
ms.author: mahender

---
# Working with Azure Functions Proxies (preview)

> [!Note] 
> Azure Functions Proxies is currently in preview. It is free while in preview, but standard Functions billing applies to proxy executions. See [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/) for more information.

This article explains how to configure and work with Azure Functions Proxies. This feature allows you to specify endpoints on your function app that are implemented by another resource. You can use these proxies to break a large API into multiple function apps (as in a microservice architecture), while still presenting a single API surface for clients.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]


## Enabling Azure Functions Proxies

Proxies are not enabled by default. You can create proxies while the feature is disabled, but they will not execute. The following steps will show you how to enable proxies:

1. Open the [Azure portal] and navigate to your function app.
2. Select **Function app settings**.
3. Toggle **Enable Azure Functions Proxies (preview)** to On.

You can also return here to update the proxy runtime as new features become available.


## Creating a proxy

This section will show you how to create a proxy in the Functions portal.

1. Open the [Azure portal] and navigate to your function app.
2. In the left-hand navigation, select **New proxy**.
3. Provide a name for your proxy.
4. Configure the endpoint exposed on this function app by specifying the **route template** and **HTTP methods**. These parameters behave according to the rules for [HTTP triggers]
5. Set the **backend URL** to another endpoint. This could be a function in another function app, or it could be any other API.
6. Click Create.

Your proxy now exists as a new endpoint on your function app. From a client perspective, it is equivalent to an HttpTrigger in Azure Functions. You can try out your new proxy by copying the Proxy URL and testing it with your favorite HTTP client.


## Using variables

The configuration for a proxy does not need to be static. You can condition it to use variables from the original request, the backend response, or application settings.

<a name="request-parameters"></a>

### Referencing request parameters

Request parameters may be used as inputs to the backend URL property or as part of [modifying requests and responses]().

#### Route template parameters
Parameters used in the route template are available to be referenced by name, enclosed in curly braces "{}".

For example, if a proxy has a route template like `/pets/{petId}`, the backend URL can include the value of `{petId}`, as in `https://<AnotherApp>.azurewebsites.net/api/pets/{petId}`. If the route template terminates in a wildcard, such as `/api/{*restOfPath}`, the value `{restOfPath}` will be a string representation of the remaining path segments from the incoming request.

 #### Additonal request parameters
In addition to the route template parameters, the following values may be used in config values:

* **{request.method}** : The HTTP method used on the original request.
* **{request.headers.\<HeaderName>}** : Patterned value - a header which can be read from the original request. Replace "\<HeaderName>" with the name of the header you wish to read. If the header is not included on the request, the value will be the empty string.
* **{request.querystring.\<ParameterName>}** : Patterned value - a query string parameter which can be read from the original request. Replace "\<ParameterName>" with the name of the parameter you wish to read. If the parameter is not included on the request, the value will be the empty string.

### Referencing backend response parameters

Response parameters may be used as part of [modifying the response to the client](). The following values may be used in config values:

* **{backend.response.statusCode}** : The HTTP status code returned on the backend response.
* **{backend.response.statusReason}** : The HTTP reason phrase returned on the backend response.
* **{backend.response.headers.\<HeaderName>}** : Patterned value - a header which can be read from the backend response. Replace "\<HeaderName>" with the name of the header you wish to read. If the header is not included on the request, the value will be the empty string.

### Referencing application settings

You can also reference [application settings](https://docs.microsoft.com/azure/azure-functions/functions-how-to-use-azure-function-app-settings#develop) by surrounding the setting name with percent signs '%'.

For example, a backend URL of `https://%ORDER_PROCESSING_HOST%/api/orders` will have "%ORDER_PROCESSING_HOST%" replaced with the value of the ORDER_PROCESSING_HOST setting.

> [!TIP] 
> Use application settings for backend hosts when you have multiple deployments or test environments. That way, you can make sure that you are always talking to the right backend for that environment.


## Modifying requests and responses

Proxies gives you full control over the requests to and response from the backend. 

You can also modify request and response properties such as headers, query string parameters, HTTP methods, and status codes.

### Modifying the backend request

Beyond the backendURL, 

There is not presently a portal experience for modifying backend requests. Please see [REPLACE]() below to learn how to leverage this capability from proxies.json.

### Modifying the response

You can 

There is not presently a portal experience for modifying responses. Please see [REPLACE]() below to learn how to leverage this capability from proxies.json.


## Manual Configuration

The proxies that you configure are stored in a proxies.json file, located in the root of a function app directory. You can manually edit this file and deploy it as part of your app when using any of the [deployment methods](https://docs.microsoft.com/azure/azure-functions/functions-continuous-deployment) that Functions supports.

> [!TIP] 
> If you have not set up one of the deployment methods, you can also work with the proxies.json file in the portal. Navigate to your function app and select "Platform features," and then "App Service Editor". This will allow you to see the entire file structure of your function app and make changes.

The feature must be enabled in order for the file to be processed. You can do this by following the instructions in [Enabling Azure Functions Proxies](#enable).

Proxies.json is defined by a proxies object, composed of named proxies and their definitions. An example file might look like the following:

```json
{
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

Each proxy has a friendly name, such as "proxy1" in the example above. The corresponding proxy definition object is defined by the following properties:

* **matchCondition** : Required - an object defining the requests that will trigger the execution of this proxy. It contains two properties shared with [HTTP triggers]:
    * _methods_ : This is an array of the HTTP methods to which the proxy will respond. If not specified, the proxy will respond to all HTTP methods on the route.
    * _route_ : Required - This defines the route template, controlling to which request URLs your proxy will respond. Unlike in HTTP triggers, there is no default value.
* **backendUri** : The URL of the backend resource to which the request should be proxied. This value may be templated, as described in [Modifying backend requests](). If this property is not included, Azure Functions will respond with an HTTP 200 OK.
* **requestOverrides** : An object defining transformations to the backend request. See [REPLACE]() below.
* **responseOverrides** : An object defining transformations to the client response. See [REPLACE]() below.

> [!Note] 
> The route property Azure Functions Proxies do not honor the routePrefix property of the Functions host configuration. If you wish to include a prefix such as /api, it must be included in the route property.

### Defining a requestOverrides 

The requestOverrides object captures changes made to the request when the backend resource is called, as discussed in [REPLACE](). 

The corresponding proxy definition object is defined by the following properties:

* **backend.request.method** : This is the HTTP method which will be used to call the backend.
* **backend.request.querystring.\<ParameterName>** : Patterned value - a query string parameter which can be set for the call to the backend. Replace "\<ParameterName>" with the name of the parameter you wish to set. If the empty string is provided, the parameter will not be included on the backend request.
* **backend.request.headers.\<HeaderName>** : Patterned value - a header which can be set for the call to the backend. Replace "\<HeaderName>" with the name of the header you wish to set. If the empty string is provided, the header will not be included on the backend request.

Values can reference [application settings]() and [parameters from the original client request]().

An example configuration might look like the following:

```json
{
    "proxies": {
        "proxy1": {
            "matchCondition": {
                "methods": [ "GET" ],
                "route": "/api/{test}"
            },
            "backendUri": "https://<AnotherApp>.azurewebsites.net/api/<FunctionName>",
            "requestOverrides": {
                "backend.request.headers.Accept" : "application/xml",
                "backend.request.headers.x-functions-key" : "%ANOTHERAPP_API_KEY%"
            }
        }
    }
}
```

### Defining a responseOverrides object


The requestOverrides object captures , as discussed in [REPLACE](). Parameters can be referenced from the [original client request]() or the [backend response]().



* **response.statusCode** : The HTTP status code to be returned to the client.
* **response.statusReason** : The HTTP reason phrase to be returned to the client.
* **response.body** : The string representation of the body to be returned to the client.
* **response.headers.\<HeaderName>** : Patterned value - a header which can be set for the response to the client. Replace "\<HeaderName>" with the name of the header you wish to set. If the empty string is provided, the header will not be included on the response.

Values can reference [application settings](), [parameters from the original client request](), and [parameters from the backend response]().

An example configuration might look like the following:

```json
{
    "proxies": {
        "proxy1": {
            "matchCondition": {
                "methods": [ "GET" ],
                "route": "/api/{test}"
            },
            "responseOverrides": {
                "response.body": "Hello, {test}",
                "response.headers.Content-Type" : "text/plain"
            }
        }
    }
}
```
> [!Note] 
> In this example, the body is being set directly, so no `backendUri` property is needed. This is an example of how one could use Azure Functions Proxies for mocking APIs.

[Azure portal]: https://portal.azure.com
[HTTP triggers]: https://docs.microsoft.com/azure/azure-functions/functions-bindings-http-webhook#http-trigger