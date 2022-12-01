---
title: Adding custom resources to Azure REST API
description: Learn how to add custom resources to the Azure REST API. This article will walk through the requirements and best practices for endpoints that wish to implement custom resources.
ms.topic: conceptual
ms.custom: ignite-2022
ms.author: jobreen
author: jjbfour
ms.date: 06/20/2019
---

# Adding Custom Resources to Azure REST API

This article will go through the requirements and best practices for creating Azure Custom Resource Provider endpoints that implements custom resources. If you are unfamiliar with Azure Custom Resource Providers, see [the overview on custom resource providers](overview.md).

## How to define a resource endpoint

An **endpoint** is a URL that points to a service, which implements the underlying contract between it and Azure. The endpoint is defined in the custom resource provider and can be any publicly accessible URL. The sample below has an **resourceType** called `myCustomResource` implemented by `endpointURL`.

Sample **ResourceProvider**:

```JSON
{
  "properties": {
    "resourceTypes": [
      {
        "name": "myCustomResource",
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

## Building a resource endpoint

An **endpoint** that implements an **resourceType** must handle the request and response for the new API in Azure. When a custom resource provider with an **resourceType** is created, it will generate a new set of APIs in Azure. In this case, the **resourceType** will generate a new Azure resource API for `PUT`, `GET`, and `DELETE` to perform CRUD on a single resource as well as `GET` to retrieve all existing resources:

Manipulate Single Resource (`PUT`, `GET`, and `DELETE`):

```http
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResource/{myCustomResourceName}
```

Retrieve All Resources (`GET`):

```http
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResource
```

For custom resources, custom resource providers offer two types of **routingTypes**: "`Proxy`" and "`Proxy, Cache`".

### proxy routing type

The "`Proxy`" **routingType** proxies all request methods to the **endpoint** specified in the custom resource provider. When to use "`Proxy`":

- Full control over the response is needed.
- Integrating systems with existing resources.

To learn more about "`Proxy`" resources, see [the custom resource proxy reference](proxy-resource-endpoint-reference.md)

### proxy cache routing type

The "`Proxy, Cache`" **routingType** proxies only `PUT` and `DELETE` request methods to the **endpoint** specified in the custom resource provider. The custom resource provider will automatically return `GET` requests based on what it has stored in its cache. If a custom resource is marked with cache, the custom resource provider will also add / overwrite fields in the response to make the APIs Azure compliant. When to use "`Proxy, Cache`":

- Creating a new system that has no existing resources.
- Work with existing Azure ecosystem.

To learn more about "`Proxy, Cache`" resources, see [the custom resource cache reference](proxy-cache-resource-endpoint-reference.md)

## Creating a custom resource

There are two main ways of creating a custom resource off of a custom resource provider:

- Azure CLI
- Azure Resource Manager Templates

### Azure CLI

Create a custom resource:

```azurecli-interactive
az resource create --is-full-object \
                   --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/{resourceTypeName}/{customResourceName} \
                   --properties \
                    '{
                        "location": "eastus",
                        "properties": {
                            "myProperty1": "myPropertyValue1",
                            "myProperty2": {
                                "myProperty3": "myPropertyValue3"
                            }
                        }
                    }'
```

Parameter | Required | Description
---|---|---
is-full-object | *yes* | Indicates that the properties object includes other options such as location, tags, sku, and/or plan.
id | *yes* | The resource ID of the custom resource. This should exist off of the **ResourceProvider**
properties | *yes* | The request body that will be sent to the **endpoint**.

Delete an Azure Custom Resource:

```azurecli-interactive
az resource delete --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/{resourceTypeName}/{customResourceName}
```

Parameter | Required | Description
---|---|---
id | *yes* | The resource ID of the custom resource. This should exist off of the **ResourceProvider**.

Retrieve an Azure Custom Resource:

```azurecli-interactive
az resource show --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/{resourceTypeName}/{customResourceName}
```

Parameter | Required | Description
---|---|---
id | *yes* | The resource ID of the custom resource. This should exist off of the **ResourceProvider**

### Azure Resource Manager Template

> [!NOTE]
> Resources require that the response contain an appropriate `id`, `name`, and `type` from the **endpoint**.

Azure Resource Manager Templates require that `id`, `name`, and `type` are returned correctly from the downstream endpoint. A returned resource response should be in the form:

Sample **endpoint** response:

```json
{
  "properties": {
    "myProperty1": "myPropertyValue1",
    "myProperty2": {
        "myProperty3": "myPropertyValue3"
    }
  },
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{customResourceName}",
  "name": "{customResourceName}",
  "type": "Microsoft.CustomProviders/resourceProviders/{resourceTypeName}"
}
```

Sample Azure Resource Manager Template:

```JSON
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.CustomProviders/resourceProviders/{resourceTypeName}",
            "name": "{resourceProviderName}/{customResourceName}",
            "apiVersion": "2018-09-01-preview",
            "location": "eastus",
            "properties": {
                "myProperty1": "myPropertyValue1",
                "myProperty2": {
                    "myProperty3": "myPropertyValue3"
                }
            }
        }
    ]
}
```

Parameter | Required | Description
---|---|---
resourceTypeName | *yes* | The **name** of the **resourceType** defined in the custom resource provider.
resourceProviderName | *yes* | The custom resource provider instance name.
customResourceName | *yes* | The custom resource name.

## Next steps

- [Overview on Azure Custom Resource Providers](overview.md)
- [Quickstart: Create Azure Custom Resource Provider and deploy custom resources](./create-custom-provider.md)
- [Tutorial: Create custom actions and resources in Azure](./tutorial-get-started-with-custom-providers.md)
- [How To: Adding Custom Actions to Azure REST API](./custom-providers-action-endpoint-how-to.md)
- [Reference: Custom Resource Proxy Reference](proxy-resource-endpoint-reference.md)
- [Reference: Custom Resource Cache Reference](proxy-cache-resource-endpoint-reference.md)
