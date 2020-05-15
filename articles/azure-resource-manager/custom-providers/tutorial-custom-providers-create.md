---
title: Create and use a custom provider
description: This tutorial shows how to create and use an Azure Custom Provider. Use custom providers to change workflows on Azure.
author: jjbfour
ms.topic: tutorial
ms.date: 06/19/2019
ms.author: jobreen
---

# Create and use a custom provider

A custom provider is a contract between Azure and an endpoint. With custom providers, you can change workflows on Azure. This tutorial shows the process of creating a custom provider. If you're unfamiliar with Azure Custom Providers, see [the overview of Azure Custom Resource Providers](overview.md).

## Create a custom provider

> [!NOTE]
> This tutorial does not show how to author an endpoint. If you don't have a RESTFUL endpoint, follow the [tutorial on authoring RESTful endpoints](./tutorial-custom-providers-function-authoring.md), which is the foundation for the current tutorial.

After you create an endpoint, you can create a custom provider to generate a contract between the provider and the endpoint. With a custom provider, you can specify a list of endpoint definitions:

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
**routingType** | No | The endpoint contract type. If the value isn't specified, it defaults to "Proxy".
**endpoint** | Yes | The endpoint to route the requests to. This endpoint handles the response and any side effects of the request.

The value of **endpoint** is the trigger URL of the Azure function app. The `<yourapp>`, `<funcname>`, and `<functionkey>` placeholders must be replaced with values for your created function app.

## Define custom actions and resources

The custom provider contains a list of endpoint definitions modeled under the **actions** and **resourceTypes** properties. The **actions** property maps to the custom actions exposed by the custom provider, and the **resourceTypes** property is the custom resources. In this tutorial, the custom provider has an **actions** property named `myCustomAction` and a **resourceTypes** property named `myCustomResources`.

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

## Deploy the custom provider

> [!NOTE]
> You must replace the **endpoint** values with the trigger URL from the function app created in the previous tutorial.

You can deploy the previous custom provider by using an Azure Resource Manager template:

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

After you create a custom provider, you can use the new Azure APIs. The following tabs explain how to call and use a custom provider.

### Custom actions

# [Azure CLI](#tab/azure-cli)

> [!NOTE]
> You must replace the `{subscriptionId}` and `{resourceGroupName}` placeholders with the subscription and resource group of where you deployed the custom provider.

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
*action* | Yes | The name of the action defined in the custom provider
*ids* | Yes | The resource ID of the custom provider
*request-body* | No | The request body that will be sent to the endpoint

# [Template](#tab/template)

None.

---

### Custom resources

# [Azure CLI](#tab/azure-cli)

> [!NOTE]
> You must replace the `{subscriptionId}` and `{resourceGroupName}` placeholders with the subscription and resource group of where you deployed the custom provider.

#### Create a custom resource

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
*is-full-object* | Yes | Indicates whether the properties object includes other options like location, tags, SKU, or plan.
*id* | Yes | The resource ID of the custom resource. This ID is an extension of the custom provider resource ID.
*properties* | Yes | The request body that will be sent to the endpoint.

#### Delete a custom resource

```azurecli-interactive
az resource delete --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/myCustomProvider/myCustomResources/myTestResourceName1
```

Parameter | Required | Description
---|---|---
*id* | Yes | The resource ID of the custom resource. This ID is an extension of the custom provider resource ID.

#### Retrieve a custom resource

```azurecli-interactive
az resource show --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/myCustomProvider/myCustomResources/myTestResourceName1
```

Parameter | Required | Description
---|---|---
*id* | Yes | The resource ID of the custom resource. This ID is an extension of the custom provider resource ID.

# [Template](#tab/template)

A sample Resource Manager template:

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
*resourceTypeName* | Yes | The `name` value of the **resourceTypes** property defined in the custom provider.
*resourceProviderName* | Yes | The custom provider instance name.
*customResourceName* | Yes | The custom resource name.

---

> [!NOTE]
> After you finish deploying and using the custom provider, remember to clean up all created resources including the Azure function app.

## Next steps

In this article, you learned about custom providers. For more information, see:

- [How to: Adding custom actions to Azure REST API](./custom-providers-action-endpoint-how-to.md)
- [How to: Adding custom resources to Azure REST API](./custom-providers-resources-endpoint-how-to.md)
