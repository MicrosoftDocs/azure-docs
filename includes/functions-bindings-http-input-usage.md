---
title: include file
description: include file
services: functions
author: craigshoemaker
manager: gwallace
ms.service: azure-functions
ms.topic: include
ms.date: 10/09/2019
ms.author: cshoe
ms.custom: include file
---

The trigger input type is declared as either `HttpRequest` or a custom type. If you choose `HttpRequest`, you get full access to the request object. For a custom type, the runtime tries to parse the JSON request body to set the object properties.

### Customize the HTTP endpoint

By default when you create a function for an HTTP trigger, the function is addressable with a route of the form:

    http://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>

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
http://<APP_NAME>.azurewebsites.net/api/products/electronics/357
```

This allows the function code to support two parameters in the address, _category_ and _id_. You can use any [Web API Route Constraint](https://www.asp.net/web-api/overview/web-api-routing-and-actions/attribute-routing-in-web-api-2#constraints) with your parameters.