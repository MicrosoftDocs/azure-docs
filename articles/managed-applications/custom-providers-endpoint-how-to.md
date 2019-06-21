---
title: Building Azure Custom Resource Provider Endpoints
description: Learn how to build endpoints for use with Azure Custom Resource Providers. This article will walk through the requirements and best practices for endpoints that want to work within the Azure API ecosystem.
services: managed-applications
ms.service: managed-applications
ms.topic: conceptual
ms.author: jobreen
author: jjbfour
ms.date: 06/20/2019
---
# How to build Azure Custom Resource Provider Endpoints

This article will go through the requirements and best practices for creating Azure Custom Resource Provider Endpoints. It will go through the process of setting up a sample serverless endpoint through Azure Functions and using it with a custom resource provider. If you are unfamiliar with Azure Custom Resource Providers, check out the documentation [here](./custom-providers-overview.md).

## What is a Custom Resource Provider Endpoint

An **endpoint** is a URL that points to a service, which implements the underlying contract between it and Azure. The endpoint is defined in the custom resource provider and can be any publicly accessible URL. The sample below has an **action** called `myCustomAction` implemented by `endpointURL1` and a **resourceType** called `myCustomResources` implemented by `endpointURL2`. **actions** and **resourceTypes** have different requirements for the implementing endpoint.

Sample **ResourceProvider**:

```JSON
{
  "properties": {
    "actions": [
      {
        "name": "myCustomAction",
        "routingType": "Proxy",
        "endpoint": "https://{endpointURL1}/"
      }
    ],
    "resourceTypes": [
      {
        "name": "myCustomResources",
        "routingType": "Proxy, Cache",
        "endpoint": "https://{endpointURL2}/"
      }
    ]
  },
  "location": "eastus"
}
```

## Building an Action Endpoint

An **endpoint** that implements an **action** must handle the request and response for the new API in Azure. When a custom resource provider with an action is created, it will generate a new set of APIs in Azure.

Azure API Incoming Request:

``` HTTP
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomAction?api-version=2018-09-01-preview
Authorization: Bearer eyJ0e...
Content-Type: application/json

{
    "myProperty1": "myPropertyValue1",
    "myProperty2": {
        "myProperty3" : "myPropertyValue3"
    }
}
```

This request will then be forwarded to the **endpoint** in the form:

``` HTTP
POST https://{endpointURL1}/?api-version=2018-09-01-preview
Content-Type: application/json
X-MS-CustomProviders-RequestPath: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomAction

{
    "myProperty1": "myPropertyValue1",
    "myProperty2": {
        "myProperty3" : "myPropertyValue3"
    }
}
```

Similarly the response from the **endpoint** is then forwarded back to the customer. The response from the endpoint should return:

- Valid JSON object document. All arrays and strings should be nested under a top object.
- The `Content-Type` header should be set to "application/json; charset=utf-8".

``` HTTP
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "myProperty1": "myPropertyValue1",
    "myProperty2": {
        "myProperty3" : "myPropertyValue3"
    }
}
```

## Building a ResourceType Endpoint

An **endpoint** that implements a **resourceType**, which must also handle the request and response for each of the CRUD operations. **ResourceTypes** have two different supported routing types: "Proxy" and "Proxy, Cache".

### Proxy Cache Routing Type

The "Proxy, Cache" routing type caches responses from the **endpoint** and ensures that **endpoint** responses fit into the Azure REST API ecosystem and will work with other built-in Azure systems like: Azure Policy and Azure Resource Manager Templates. If you are starting out to create an Azure Custom Resource Provider, it is recommended that you start off using "Proxy, Cache". A "Proxy, Cache" **endpoint** needs to handle two calls: create and delete.

> [!Note]
> The Azure Custom Resource Provider will handle "GET" requests for resources based on what is has in its cache. The **endpoint** should implement "GET" to allow for rehydration, but it is not required.

#### Create Request

Azure API Incoming Request:

``` HTTP
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{myCustomResourceName}?api-version=2018-09-01-preview
Authorization: Bearer eyJ0e...
Content-Type: application/json

{
    "myProperty1": "myPropertyValue1",
    "myProperty2": {
        "myProperty3" : "myPropertyValue3"
    }
}
```

This request will then be forwarded to the **endpoint** in the form:

``` HTTP
PUT https://{endpointURL2}/?api-version=2018-09-01-preview
Content-Type: application/json
X-MS-CustomProviders-RequestPath: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{myCustomResourceName}

{
    "myProperty1": "myPropertyValue1",
    "myProperty2": {
        "myProperty3" : "myPropertyValue3"
    }
}
```

Similarly the response from the **endpoint** is then forwarded back to the customer. The response from the endpoint should return:

- Valid JSON object document. All arrays and strings should be nested under a top object.
- The `Content-Type` header should be set to "application/json; charset=utf-8".
- The Azure Custom Resource Provider will overwrite the `name`, `type`, and `id` fields for the request.

**Endpoint** Response:

``` HTTP
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "myProperty1": "myPropertyValue1",
    "myProperty2": {
        "myProperty3" : "myPropertyValue3"
    }
}
```

Azure Custom Resource Provider Response:

``` HTTP
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "name": {myCustomResourceName},
    "type": "Microsoft.CustomProviders/resourceProviders/myCustomResources",
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{myCustomResourceName}"
    "myProperty1": "myPropertyValue1",
    "myProperty2": {
        "myProperty3" : "myPropertyValue3"
    }
}
```

> [!NOTE]
> The `name`, `type`, and `id` fields are required to ensure that the Azure Custom Resource Provider will work with Azure Policy and Azure Resource Manager Templates.

#### Delete Request

> [!NOTE]
> Request body is not allowed on Delete.

Azure API Incoming Request:

``` HTTP
Delete https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{myCustomResourceName}?api-version=2018-09-01-preview
Authorization: Bearer eyJ0e...
Content-Type: application/json
```

This request will then be forwarded to the **endpoint** in the form:

``` HTTP
Delete https://{endpointURL2}/?api-version=2018-09-01-preview
Content-Type: application/json
X-MS-CustomProviders-RequestPath: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{myCustomResourceName}
```

Similarly the response from the **endpoint** is then forwarded back to the customer. The response from the endpoint should return:

- Valid JSON object document. All arrays and strings should be nested under a top object.
- The `Content-Type` header should be set to "application/json; charset=utf-8".
- The Azure Custom Resource Provider will only remove the item from it's cache if a 200-level response is returned. Even if the resource does not exist, the **endpoint** should return 204.

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

### Proxy Routing Type

The "Proxy" routing type directly proxies requests and responses from the **endpoint**. It does not ensure that the response will be compliant and it is up to the **endpoint** owner to ensure. In addition to create and delete, the **endpoint** needs to implement the "GET" requests. The `name`, `type`, and `id` fields will not be automatically added for requests and will need to be manually returned.

#### GET Single Resource

Azure API Incoming Request:

``` HTTP
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{myCustomResourceName}?api-version=2018-09-01-preview
Authorization: Bearer eyJ0e...
Content-Type: application/json
```

This request will then be forwarded to the **endpoint** in the form:

``` HTTP
GET https://{endpointURL2}/?api-version=2018-09-01-preview
Content-Type: application/json
X-MS-CustomProviders-RequestPath: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{myCustomResourceName}
```

Similarly the response from the **endpoint** is then forwarded back to the customer. The response from the endpoint should return:

- Valid JSON object document. All arrays and strings should be nested under a top object.
- The `Content-Type` header should be set to "application/json; charset=utf-8".

**Endpoint** Response:

``` HTTP
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "myProperty1": "myPropertyValue1",
    "myProperty2": {
        "myProperty3" : "myPropertyValue3"
    }
}
```

Azure Custom Resource Provider Response:

``` HTTP
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "myProperty1": "myPropertyValue1",
    "myProperty2": {
        "myProperty3" : "myPropertyValue3"
    }
}
```

#### GET All Resources

Azure API Incoming Request:

``` HTTP
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources?api-version=2018-09-01-preview
Authorization: Bearer eyJ0e...
Content-Type: application/json
```

This request will then be forwarded to the **endpoint** in the form:

``` HTTP
GET https://{endpointURL2}/?api-version=2018-09-01-preview
Content-Type: application/json
X-MS-CustomProviders-RequestPath: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources
```

Similarly the response from the **endpoint** is then forwarded back to the customer. The response from the endpoint should return:

- Valid JSON object document. All arrays and strings should be nested under a top object.
- The `Content-Type` header should be set to "application/json; charset=utf-8".
- The list of resources should be placed under the `value` top-level property.

**Endpoint** Response:

``` HTTP
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "value" : [
        {
            "myProperty1": "myPropertyValue1",
            "myProperty2": {
                "myProperty3" : "myPropertyValue3"
            }
        }
    ]
}
```

Azure Custom Resource Provider Response:

``` HTTP
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "value" : [
        {
            "myProperty1": "myPropertyValue1",
            "myProperty2": {
                "myProperty3" : "myPropertyValue3"
            }
        }
    ]
}
```

## Next steps

For information about Azure Custom Resource Providers, see [How To Create Custom Resources](custom-providers-customresources-how-to.md)
For information about Azure Custom Resource Providers, see [Azure Custom Resource Provider overview](custom-providers-overview.md)
