---
title: Creating Custom Azure Resources
description: Learn how to create custom Azure resources with Azure Custom Resource Providers. This article will walk through the ways to create custom Azure resources.
services: managed-applications
ms.service: managed-applications
ms.topic: conceptual
ms.author: jobreen
author: jjbfour
ms.date: 06/20/2019
---
## How to Create Custom Azure Resources

Once the [Azure Custom Resource Provider](./custom-providers-overview.md) is created, it can be consumed through the Azure REST API. The properties and response of these new APIs are dictated by the endpoint specified in the resource provider contract. There are three main ways to consume the Azure REST API extension:

- Azure CLI
- Azure Resource Manager Templates

The following will show samples for creating and manipulating Azure Custom Resources based on this sample Azure Custom Resource Provider:

``` JSON
{
  "properties": {
    "resourceTypes": [
      {
        "name": "{resourceTypeName}",
        "routingType": "Proxy",
        "endpoint": "https://<MyCustomEndpoint>/"
      }
    ],
    "provisioningState": "Succeeded"
  },
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}",
  "name": "{resourceProviderName}",
  "type": "Microsoft.CustomProviders/resourceProviders",
  "location": "eastus"
}
```

### Azure CLI

Azure Custom Resources can be provisioned through the Azure CLI. For the following sample resource provider, the commands to create, retrieve, and delete custom resources would be:

Create an Azure Custom Resource:

Save the following properties request body JSON to a file called jsonConfigFile.json

``` JSON
{
  "properties": { },
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{customResourceName}",
  "name": "{customResourceName}",
  "type": "Microsoft.CustomProviders/resourceProviders/{resourceTypeName}"
}
```

```azurecli-interactive
az resource create --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/{resourceTypeName}/{customResourceName} --is-full-object --properties @jsonConfigFile.json
```

Delete an Azure Custom Resource:

```azurecli-interactive
az resource delete --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/{resourceTypeName}/{customResourceName}
```

Retrieve an Azure Custom Resource:

```azurecli-interactive
az resource show --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/{resourceTypeName}/{customResourceName}
```

### Azure Resource Manager Templates

Azure Custom Resources can be provisioned through an Azure Resource Manager Template. However, there is a special contract that must be followed by the endpoint to ensure that the resource can be created successfully.

1. The resource must follow the standard Azure resource model. For example the request and response must accept and return the following properties, which are used by Azure Resource Manager Templates: **id**, **name**, and **type**.

    The request and the response should mimic the following with custom properties placed under the properties section:

    ```JSON
    {
      "properties": {
        ...
      },
      "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{customResourceName}",
      "name": "{customResourceName}",
      "type": "Microsoft.CustomProviders/resourceProviders/{resourceTypeName}"
    }
    ```

2. The endpoint must implement PUT and GET for the resource in a RESTful manner.
    In this case, a resource that was created through the following PUT:

    ```HTTP
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{customResourceName}?api-version=2018-09-01-preview
    Content-Type: application/json

    {
      "properties": {
        ...
      },
      "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{customResourceName}",
      "name": "{customResourceName}",
      "type": "Microsoft.CustomProviders/resourceProviders/{resourceTypeName}"
    }
    ```

    Should also return the same resource when a GET request with the same resource id is made:

    ```HTTP
    GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{customResourceName}?api-version=2018-09-01-preview
    Content-Type: application/json
    ```

Sample template to create a custom resource:

Update the fields below in brackets and save to file customResourceTemplate.json

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
            "properties": { }
        }
    ]
}
```

```azurecli-interactive
az group deployment create --resource-group {resourceGroupName} --subscription {subscriptionId} --template-file @customResourceTemplate.json
```

## Next steps

For information about Azure Custom Resource Providers, see [How To Create Custom Provider endpoints](custom-providers-endpoint-how-to.md)
For information about Azure Custom Resource Providers, see [Azure Custom Resource Provider overview](custom-providers-overview.md)
