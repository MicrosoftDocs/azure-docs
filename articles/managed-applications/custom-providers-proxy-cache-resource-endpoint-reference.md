---
title: Custom resource cache reference
description: Custom resource cache reference for Azure Custom Resource Providers. This article will go through the requirements for endpoints implementing cache custom resources.
services: managed-applications
ms.service: managed-applications
ms.topic: conceptual
ms.author: jobreen
author: jjbfour
ms.date: 06/20/2019
---

# Custom Resource Cache Reference

This article will go through the requirements for endpoints implementing cache custom resources. If you are unfamiliar with Azure Custom Resource Providers, see [the overview on custom resource providers](./custom-providers-overview.md).

## How to define a cache resource endpoint

A proxy resource can be created by specifying the **routingType** to "Proxy, Cache".

Sample custom resource provider:

```JSON
{
  "properties": {
    "resourceTypes": [
      {
        "name": "myCustomResources",
        "routingType": "Proxy, Cache",
        "endpoint": "https://{endpointURL}/"
      }
    ]
  },
  "location": "eastus",
  "type": "Microsoft.CustomProviders/resourceProviders",
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}",
  "name": "{resourceProviderName}"
}
```

## Building proxy resource endpoint

An **endpoint** that implements a "Proxy, Cache" resource **endpoint** must handle the request and response for the new API in Azure. In this case, the **resourceType** will generate a new Azure resource API for `PUT`, `GET`, and `DELETE` to perform CRUD on a single resource, as well as `GET` to retrieve all existing resources:

> [!NOTE]
> The Azure API will generate the request methods `PUT`, `GET`, and `DELETE`, but the cache **endpoint** only needs to handle `PUT` and `DELETE`.
> We recommended that the **endpoint** also implements `GET`.

### Create a custom resource

Azure API Incoming Request:

``` HTTP
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{myCustomResourceName}?api-version=2018-09-01-preview
Authorization: Bearer eyJ0e...
Content-Type: application/json

{
    "properties": {
        "myProperty1": "myPropertyValue1",
        "myProperty2": {
            "myProperty3" : "myPropertyValue3"
        }
    }
}
```

This request will then be forwarded to the **endpoint** in the form:

``` HTTP
PUT https://{endpointURL}/?api-version=2018-09-01-preview
Content-Type: application/json
X-MS-CustomProviders-RequestPath: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{myCustomResourceName}

{
    "properties": {
        "myProperty1": "myPropertyValue1",
        "myProperty2": {
            "myProperty3" : "myPropertyValue3"
        }
    }
}
```

Similarly, the response from the **endpoint** is then forwarded back to the customer. The response from the endpoint should return:

- A valid JSON object document. All arrays and strings should be nested under a top object.
- The `Content-Type` header should be set to "application/json; charset=utf-8".
- The custom resource provider will overwrite the `name`, `type`, and `id` fields for the request.
- The custom resource provider will only return fields under the `properties` object for a cache endpoint.

**Endpoint** Response:

``` HTTP
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "properties": {
        "myProperty1": "myPropertyValue1",
        "myProperty2": {
            "myProperty3" : "myPropertyValue3"
        }
    }
}
```

The `name`, `id`, and `type` fields will automatically be generated for the custom resource by the custom resource provider.

Azure Custom Resource Provider Response:

``` HTTP
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "name": "{myCustomResourceName}",
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{myCustomResourceName}",
    "type": "Microsoft.CustomProviders/resourceProviders/myCustomResources",
    "properties": {
        "myProperty1": "myPropertyValue1",
        "myProperty2": {
            "myProperty3" : "myPropertyValue3"
        }
    }
}
```

### Remove a custom resource

Azure API Incoming Request:

``` HTTP
Delete https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{myCustomResourceName}?api-version=2018-09-01-preview
Authorization: Bearer eyJ0e...
Content-Type: application/json
```

This request will then be forwarded to the **endpoint** in the form:

``` HTTP
Delete https://{endpointURL}/?api-version=2018-09-01-preview
Content-Type: application/json
X-MS-CustomProviders-RequestPath: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{myCustomResourceName}
```

Similarly ,the response from the **endpoint** is then forwarded back to the customer. The response from the endpoint should return:

- A valid JSON object document. All arrays and strings should be nested under a top object.
- The `Content-Type` header should be set to "application/json; charset=utf-8".
- The Azure Custom Resource Provider will only remove the item from its cache if a 200-level response is returned. Even if the resource does not exist, the **endpoint** should return 204.

**Endpoint** Response:

``` HTTP
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

Azure Custom Resource Provider Response:

``` HTTP
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

### Retrieve a custom resource

Azure API Incoming Request:

``` HTTP
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{myCustomResourceName}?api-version=2018-09-01-preview
Authorization: Bearer eyJ0e...
Content-Type: application/json
```

The request will **not** be forwarded to the **endpoint**.

Azure Custom Resource Provider Response:

``` HTTP
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "name": "{myCustomResourceName}",
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{myCustomResourceName}",
    "type": "Microsoft.CustomProviders/resourceProviders/myCustomResources",
    "properties": {
        "myProperty1": "myPropertyValue1",
        "myProperty2": {
            "myProperty3" : "myPropertyValue3"
        }
    }
}
```

### Enumerate all custom resources

Azure API Incoming Request:

``` HTTP
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources?api-version=2018-09-01-preview
Authorization: Bearer eyJ0e...
Content-Type: application/json
```

This request will **not** be forwarded to the **endpoint**.

Azure Custom Resource Provider Response:

``` HTTP
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "value" : [
        {
            "name": "{myCustomResourceName}",
            "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{myCustomResourceName}",
            "type": "Microsoft.CustomProviders/resourceProviders/myCustomResources",
            "properties": {
                "myProperty1": "myPropertyValue1",
                "myProperty2": {
                    "myProperty3" : "myPropertyValue3"
                }
            }
        }
    ]
}
```

## Next steps

- [Overview on Azure Custom Resource Providers](./custom-providers-overview.md)
- [Quickstart: Create Azure Custom Resource Provider and deploy custom resources](./create-custom-provider.md)
- [Tutorial: Create custom actions and resources in Azure](./tutorial-custom-providers-101.md)
- [How To: Adding Custom Actions to Azure REST API](./custom-providers-action-endpoint-how-to.md)
- [Reference: Custom Resource Proxy Reference](./custom-providers-proxy-resource-endpoint-reference.md)
