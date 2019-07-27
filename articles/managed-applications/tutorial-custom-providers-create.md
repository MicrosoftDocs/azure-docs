---
title: Create and utilize a Azure Custom Provider
description: This tutorial will go over how to create and utilize a custom provider.
author: jjbfour
ms.service: managed-applications
ms.topic: tutorial
ms.date: 06/19/2019
ms.author: jobreen
---

# Authoring a RESTful endpoint for custom providers

Custom providers allow you to customize workflows on Azure. A custom provider is a contract between Azure and an `endpoint`. This tutorial will go through the process of creating a custom provider. If you are unfamiliar with Azure Custom Providers, see [the overview on custom resource providers](./custom-providers-overview.md).

This tutorial is broken into the following steps:

- What is a custom provider
- Defining custom actions and resources
- Deploying the custom provider

This tutorial will build on the following tutorials:

- [Authoring a RESTful endpoint for custom providers](./tutorial-custom-providers-function-authoring.md)

## Creating a custom provider

> [!NOTE]
> This tutorial will not go over authoring an endpoint. Please follow the [tutorial on authoring RESTful endpoints](./tutorial-custom-providers-function-authoring.md) if you don't have a RESTful endpoint.

Once the `endpoint` is created, you can generate the create a custom provider to generate a contract between it and the `endpoint`. A custom provider allows you to specify a list of endpoint definitions.

```JSON
{
  "name": "myEndpointDefinition",
  "routingType": "Proxy",
  "endpoint": "https://<yourapp>.azurewebsites.net/api/<funcname>?code=<functionkey>"
}
```

Property | Required | Description
---|---|---
name | *yes* | The name of the endpoint definition. Azure will expose this name through its API under '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/<br>resourceProviders/{resourceProviderName}/{endpointDefinitionName}'
routingType | *no* | Determines the contract type with the `endpoint`. If not specified, it will default to "Proxy".
endpoint | *yes* | The endpoint to route the requests to. This will handle the response as well as any side effects of the request.

In this case, The `endpoint` is the trigger URL of the Azure Function. The `<yourapp>`, `<funcname>`, and `<functionkey>` should be replaced with values for your created function.

## Defining custom actions and resources

The custom provider contains a list of endpoint definitions modeled under `actions` and `resourceTypes`. `actions` map to the custom actions exposed by the custom provider, while `resourceTypes` are the custom resources. For this tutorial, we will define a custom provider with an `action` called `myCustomAction` and a `resourceType` called `myCustomResources`.

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

Replace `endpoint` with the trigger URL from the function created earlier in the previous tutorial.

## Deploying the custom provider

> [!NOTE]
> The `endpoint` should be replaced with the function URL.

The above custom provider can be deployed using an Azure Resource Manager Template.

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

## Using custom actions and resources

After we have created a custom provider, we can utilize the new Azure APIs. The next section will explain how to call and utilize a custom provider.

### Custom actions

# [Azure CLI](#tab/azure-cli)

> [!NOTE]
> The `{subscriptionId}` and `{resourceGroupName}` should be replaced with the subscription and resourceGroup where the custom provider was deployed.

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
action | *yes* | The name of the action defined in the created custom provider.
ids | *yes* | The resource ID of the created custom provider.
request-body | *no* | The request body that will be sent to the `endpoint`.

# [Template](#tab/template)

None.

---

### Custom resources

# [Azure CLI](#tab/azure-cli)

> [!NOTE]
> The `{subscriptionId}` and `{resourceGroupName}` should be replaced with the subscription and resourceGroup where the custom provider was deployed.

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
is-full-object | *yes* | Indicates that the properties object includes other options such as location, tags, sku, and/or plan.
id | *yes* | The resource ID of the custom resource. This should exist off of the created custom provider.
properties | *yes* | The request body that will be sent to the `endpoint`.

Delete an Azure Custom Resource:

```azurecli-interactive
az resource delete --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/myCustomProvider/myCustomResources/myTestResourceName1
```

Parameter | Required | Description
---|---|---
id | *yes* | The resource ID of the custom resource. This should exist off of the created custom provider.

Retrieve an Azure Custom Resource:

```azurecli-interactive
az resource show --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/myCustomProvider/myCustomResources/myTestResourceName1
```

Parameter | Required | Description
---|---|---
id | *yes* | The resource ID of the custom resource. This should exist off of the created custom provider.

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
resourceTypeName | *yes* | The `name` of the *resourceType* defined in the custom provider.
resourceProviderName | *yes* | The custom provider instance name.
customResourceName | *yes* | The custom resource name.

---

> [!NOTE]
> After you have finished deploying and using the custom provider, remember to clean up any created resources including the Azure Function.

## Next steps

In this article, you learned about custom providers. Go to the next article to create a custom provider.

- [How To: Adding Custom Actions to Azure REST API](./custom-providers-action-endpoint-how-to.md)
- [How To: Adding Custom Resources to Azure REST API](./custom-providers-resources-endpoint-how-to.md)
