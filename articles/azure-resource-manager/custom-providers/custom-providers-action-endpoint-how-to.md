---
title: Adding custom actions to Azure REST API
description: Learn how to add custom actions to the Azure REST API. This article will walk through the requirements and best practices for endpoints that wish to implement custom actions.
ms.topic: conceptual
ms.custom: ignite-2022
ms.author: jobreen
author: jjbfour
ms.date: 06/20/2019
---

# Adding Custom Actions to Azure REST API

This article will go through the requirements and best practices for creating Azure Custom Resource Provider endpoints that implement custom actions. If you are unfamiliar with Azure Custom Resource Providers, see [the overview on custom resource providers](overview.md).

## How to define an Action Endpoint

An **endpoint** is a URL that points to a service, which implements the underlying contract between it and Azure. The endpoint is defined in the custom resource provider and can be any publicly accessible URL. The sample below has an **action** called `myCustomAction` implemented by `endpointURL`.

Sample **ResourceProvider**:

```JSON
{
  "properties": {
    "actions": [
      {
        "name": "myCustomAction",
        "routingType": "Proxy",
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

## Building an action endpoint

An **endpoint** that implements an **action** must handle the request and response for the new API in Azure. When a custom resource provider with an **action** is created, it will generate a new set of APIs in Azure. In this case, the action will generate a new Azure action API for `POST` calls:

```http
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomAction
```

Azure API Incoming Request:

```http
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

```http
POST https://{endpointURL}/?api-version=2018-09-01-preview
Content-Type: application/json
X-MS-CustomProviders-RequestPath: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomAction

{
    "myProperty1": "myPropertyValue1",
    "myProperty2": {
        "myProperty3" : "myPropertyValue3"
    }
}
```

Similarly, the response from the **endpoint** is then forwarded back to the customer. The response from the endpoint should return:

- A valid JSON object document. All arrays and strings should be nested under a top object.
- The `Content-Type` header should be set to "application/json; charset=utf-8".

```http
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

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "myProperty1": "myPropertyValue1",
    "myProperty2": {
        "myProperty3" : "myPropertyValue3"
    }
}
```

## Calling a Custom Action

There are two main ways of calling a custom action off of a custom resource provider:

- Azure CLI
- Azure Resource Manager Templates

### Azure CLI

```azurecli-interactive
az resource invoke-action --action {actionName} \
                          --ids /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName} \
                          --request-body \
                            '{
                                "myProperty1": "myPropertyValue1",
                                "myProperty2": {
                                    "myProperty3": "myPropertyValue3"
                                }
                            }'
```

Parameter | Required | Description
---|---|---
action | *yes* | The name of the action defined in the **ResourceProvider**.
ids | *yes* | The resource ID of the **ResourceProvider**.
request-body | *no* | The request body that will be sent to the **endpoint**.

### Azure Resource Manager Template

> [!NOTE]
> Actions have limited support in Azure Resource Manager Templates. In order for the action to be called inside a template, it must contain the [`list`](../templates/template-functions-resource.md#list) prefix in its name.

Sample **ResourceProvider** with List Action:

```JSON
{
  "properties": {
    "actions": [
      {
        "name": "listMyCustomAction",
        "routingType": "Proxy",
        "endpoint": "https://{endpointURL}/"
      }
    ]
  },
  "location": "eastus"
}
```

Sample Azure Resource Manager Template:

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "variables": {
        "resourceIdentifier": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}",
        "apiVersion": "2018-09-01-preview",
        "functionValues": {
            "myProperty1": "myPropertyValue1",
            "myProperty2": {
                "myProperty3": "myPropertyValue3"
            }
        }
    },
    "resources": [],
    "outputs": {
        "myCustomActionOutput": {
            "type": "object",
            "value": "[listMyCustomAction(variables('resourceIdentifier'), variables('apiVersion'), variables('functionValues'))]"
        }
    }
}
```

Parameter | Required | Description
---|---|---
resourceIdentifier | *yes* | The resource ID of the **ResourceProvider**.
apiVersion | *yes* | The API version of the resource runtime. This should always be "2018-09-01-preview".
functionValues | *no* | The request body that will be sent to the **endpoint**.

## Next steps

- [Overview on Azure Custom Resource Providers](overview.md)
- [Quickstart: Create Azure Custom Resource Provider and deploy custom resources](./create-custom-provider.md)
- [Tutorial: Create custom actions and resources in Azure](./tutorial-get-started-with-custom-providers.md)
- [How To: Adding Custom Resources to Azure REST API](./custom-providers-resources-endpoint-how-to.md)
