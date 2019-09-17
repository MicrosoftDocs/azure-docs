---
title: Create and utilize a Azure Custom Provider
description: This tutorial will go over how to create and utilize a custom provider.
author: jjbfour
ms.service: managed-applications
ms.topic: tutorial
ms.date: 06/19/2019
ms.author: jobreen
---

# Author a RESTful endpoint for custom providers

A custom provider is a contract between Azure and an endpoint. With custom providers, you can change workflows on Azure. This tutorial shows the process of creating a custom provider. If you are unfamiliar with Azure Custom Providers, see [the overview on custom resource providers](./custom-providers-overview.md).

This tutorial contains the following steps:

1. Create a custom provider
1. Define custom actions and resources
1. Deploy the custom provider
1. Use custom actions and resources

This tutorial builds on the tutorial [Authoring a RESTful endpoint for custom providers](./tutorial-custom-providers-function-authoring.md).

## Create a custom provider

> [!NOTE]
> This tutorial does not show how to author an endpoint. Follow the [tutorial on authoring RESTful endpoints](./tutorial-custom-providers-function-authoring.md) if you don't have a RESTful endpoint.

After you create an endpoint, you can create a custom provider to generate a contract between Azure and the endpoint. With a custom provider, you can specify a list of endpoint definitions.

```JSON
{
  "name": "myEndpointDefinition",
  "routingType": "Proxy",
  "endpoint": "https://<yourapp>.azurewebsites.net/api/<funcname>?code=<functionkey>"
}
```

Property | Required | Description
---|---|---
**name** | Yes | The name of the endpoint definition. Azure exposes this name through its API under /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders<br>/resourceProviders/{resourceProviderName}/{endpointDefinitionName}
**routingType** | No | the endpoint contract type. If the value is not specified, it defaults to "Proxy".
**endpoint** | Yes | The endpoint to route the requests to. This endpoint handles the response as well as any side effects of the request.

The value of **endpoint** is the trigger URL of the Azure function app. The `<yourapp>`, `<funcname>`, and `<functionkey>` placeholders should be replaced with values for your created function app.

## Define custom actions and resources

The custom provider contains a list of endpoint definitions modeled within the following **actions** and **resourceTypes** properties. The actions map to the custom actions exposed by the custom provider, and the resource types are the custom resources. In this tutorial, the custom provider has an action named `myCustomAction` and a resource type named `myCustomResources`.

```JSON
{
  "properties": {
    "actions": [
      {
        "name": "myCustomAction",
        "routingType": "Proxy",
        "endpoint": "https://<yourapp>.azurewebsites.net/api/<funcname>?code=<functionkey>"
      }
    ],
    "resourceTypes": [
      {
        "name": "myCustomResources",
        "routingType": "Proxy",
        "endpoint": "https://<yourapp>.azurewebsites.net/api/<funcname>?code=<functionkey>"
      }
    ]
  },
  "location": "eastus"
}
```

Replace the **endpoint** value with the trigger URL from the function created  in the previous tutorial.

## Deploy the custom provider

> [!NOTE]
> The **endpoint** value should be replaced with the function app URL.

The previous custom provider can be deployed by using an Azure Resource Manager template.

```JSON
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.CustomProviders/resourceProviders",
            "name": "myCustomProvider",
            "apiVersion": "2018-09-01-preview",
            "location": "eastus",
            "properties": {
                "actions": [
                    {
                        "name": "myCustomAction",
                        "routingType": "Proxy",
                        "endpoint": "https://<yourapp>.azurewebsites.net/api/<funcname>?code=<functionkey>"
                    }
                ],
                "resourceTypes": [
                    {
                        "name": "myCustomResources",
                        "routingType": "Proxy",
                        "endpoint": "https://<yourapp>.azurewebsites.net/api/<funcname>?code=<functionkey>"
                    }
                ]
            }
        }
    ]
}
```

## Use custom actions and resources

After you create a custom provider, you can use the new Azure APIs. 
The next section explains how to call and use a custom provider.

### Custom actions

# [Azure CLI](#tab/azure-cli)

> [!NOTE]
> The `{subscriptionId}` and `{resourceGroupName}` placeholders should be replaced with the subscription and resource group of where the custom provider was deployed.

```azurecli-interactive
az resource invoke-action --action myCustomAction \
                          --ids /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/myCustomProvider \
                          --request-body
                            '{
                                "hello": "world"
                            }'
```

Parameter | Required | Description
---|---|---
*action* | Yes | The name of the action defined in the custom provider.
*ids* | Yes | The resource ID of the custom provider.
*request-body* | No | The request body that will be sent to the endpoint.

# [Template](#tab/template)

None.

---

### Custom resources

# [Azure CLI](#tab/azure-cli)

> [!NOTE]
> The `{subscriptionId}` and `{resourceGroupName}` placeholders should be replaced with the subscription and resource group of where the custom provider was deployed.

Create a custom resource:

```azurecli-interactive
az resource create --is-full-object \
                   --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/myCustomProvider/myCustomResources/myTestResourceName1 \
                   --properties
                    '{
                        "location": "eastus",
                        "properties": {
                            "hello" : "world"
                        }
                    }'
```

Parameter | Required | Description
---|---|---
*is-full-object* | Yes | Indicates whether the properties object includes other options such as location, tags, sku, and/or plan.
*id* | Yes | The resource ID of the custom resource. This should exist off of the created custom provider.
*properties* | Yes | The request body that will be sent to the endpoint.

Delete an Azure Custom Resource:

```azurecli-interactive
az resource delete --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/myCustomProvider/myCustomResources/myTestResourceName1
```

Parameter | Required | Description
---|---|---
*id* | Yes | The resource ID of the custom resource. This resource should exist off of the created custom provider.

Retrieve an Azure Custom Resource:

```azurecli-interactive
az resource show --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/myCustomProvider/myCustomResources/myTestResourceName1
```

Parameter | Required | Description
---|---|---
*id* | Yes | The resource ID of the custom resource. This resource should exist off of the created custom provider.

# [Template](#tab/template)

Sample Azure Resource Manager Template:

```JSON
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.CustomProviders/resourceProviders/myCustomResources",
            "name": "myCustomProvider/myTestResourceName1",
            "apiVersion": "2018-09-01-preview",
            "location": "eastus",
            "properties": {
                "hello": "world"
            }
        }
    ]
}
```

Parameter | Required | Description
---|---|---
*resourceTypeName* | Yes | The name of the resource type defined in the custom provider.
*resourceProviderName* | Yes | The custom provider instance name.
*customResourceName* | Yes | The custom resource name.

---

> [!NOTE]
> After you finish deploying and using the custom provider, remember to clean up all created resources including the Azure function app.

## Next steps

In this article, you learned about custom providers. Go to the next article to create a custom provider.

- [How to: Adding custom actions to Azure REST API](./custom-providers-action-endpoint-how-to.md)
- [How to: Adding custom resources to Azure REST API](./custom-providers-resources-endpoint-how-to.md)
