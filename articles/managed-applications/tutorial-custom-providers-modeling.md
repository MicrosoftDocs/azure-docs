---
title: Modeling custom provider actions and resources
description: This tutorial will go over how to model custom provider action and resources.
author: jjbfour
ms.service: managed-applications
ms.topic: tutorial
ms.date: 06/19/2019
ms.author: jobreen
---

# Create custom actions and resources in Azure

Custom providers allow you to customize workflows on Azure. A custom provider is a contract between Azure and an `endpoint`. This tutorial will go through the process of modeling a custom provider. If you are unfamiliar with Azure Custom Providers, see [the overview on custom resource providers](./custom-providers-overview.md).

This tutorial is broken into the following steps:

- Modeling custom actions and custom resources

## Modeling custom actions and custom resources

Custom providers act as a proxy between Azure REST clients and an `endpoint`. This means that the `endpoint` will directly handle every request and response. Although the only requirement is that `endpoint` accept and returns content-type `application/json`, in order to ensure that the new API can integrate with existing Azure services, it should follow the standard Azure REST specification.

### Custom actions

For a more detailed guide on building custom actions and their requirements, see [building custom actions on Azure](./custom-providers-action-endpoint-how-to.md)

- The `endpoint` accepts and returns with JSON. It should also set the `Content-Type` header to `application/json` on the response.

### Custom resources

For a more detailed guide on building custom resources and their requirements, see [building custom resources on Azure](./custom-providers-resources-endpoint-how-to.md)

- The `endpoint` accepts and returns with JSON. It should also set the `Content-Type` header to `application/json` on the response.
- The API should follow the Azure RESTful specification: PUT - Create or updates the resource, GET - retrieves an existing resource, and DELETE - removes the resource.
- The `name`, `id`, and `type` properties should be returned at the top-level and all additional properties should be placed under the `properties` property.

``` JSON
{
    "name": "{myResourceName}",
    "type": "Microsoft.CustomProviders/resourceProviders/{myResourceType}",
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/{myResourceType}/{myResourceName}",
    "properties": {
        ...
    }
}
```

Parameter | Description
--- | ---
myResourceName | The name of the resource. This should be the same as what is defined in the request URI.
myResourceType | The name of the custom provider endpoint. This is the resource type, which is also from the request URI.
subscriptionId | The subscription ID of the custom provider.
resourceGroupName | The resourceGroup name of the custom provider.
resourceProviderName | The name of the custom provider.

## Next steps

In this article, we learned about custom providers and how to model custom actions and resources. Go to the next article to learn how to start creating your first custom provider.

- - [Tutorial: Setup Azure Functions for Azure Custom Providers](./tutorial-custom-providers-function-setup.md)
