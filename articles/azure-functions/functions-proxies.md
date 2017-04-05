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
ms.date: 02/19/2017
ms.author: mahender

---
# Working with Azure Functions Proxies (preview)

> [!Note] 
> Azure Functions Proxies is currently in preview. It is free while in preview, but standard Functions billing applies to proxy executions. See [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/) for more information.

This article explains how to configure and work with Azure Functions Proxies. This feature allows you to specify endpoints on your function app that are implemented by another resource. You can use these proxies to break a large API into multiple function apps (as in a microservice architecture), while still presenting a single API surface for clients.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]


## <a name="enable"></a>Enabling Azure Functions Proxies

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


## <a name="modify-requests"></a>Modifying backend requests

The backend URL parameter does not need to be static. You can condition it on input from the request or application settings.


### Using request parameters

Parameters used in the route template may be used as inputs to the backend URL property. Values are referenced by name, enclosed in curly braces "{}".

For example, if a proxy has a route template like `/pets/{petId}`, the backend URL can include the value of `{petId}`, as in `https://<AnotherApp>.azurewebsites.net/api/pets/{petId}`. If the route template terminates in a wildcard, such as `/api/{*restOfPath}`, the value `{restOfPath}` will be a string representation of the remaining path segments from the incoming request.


### Using application settings

You can also reference [application settings](https://docs.microsoft.com/azure/azure-functions/functions-how-to-use-azure-function-app-settings#develop) by surrounding the setting name with percent signs '%'.

For example, a backend URL of `https://%ORDER_PROCESSING_HOST%/api/orders` will have "%ORDER_PROCESSING_HOST%" replaced with the value of the ORDER_PROCESSING_HOST setting.

> [!TIP] 
> Use application settings for backend hosts when you have multiple deployments or test environments. That way, you can make sure that you are always talking to the right backend for that environment.



## Deployment methods

The proxies that you configure are stored in a proxies.json file, located in the root of a function app directory. You can manually edit this file and deploy it as part of your app when using any of the [deployment methods](https://docs.microsoft.com/azure/azure-functions/functions-continuous-deployment) that Functions supports.

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
* **backendUri** : The URL of the backend resource to which the request should be proxied. This value may be templated, as described in [Modifying backend requests](#modify-requests). If this property is not included, Azure Functions will respond with an HTTP 200 OK.

> [!Note] 
> The route property Azure Functions Proxies do not honor the routePrefix property of the Functions host configuration. If you wish to include a prefix such as /api, it must be included in the route property.



[Azure portal]: https://portal.azure.com
[HTTP triggers]: https://docs.microsoft.com/azure/azure-functions/functions-bindings-http-webhook#http-trigger