---
title: Overview of custom resource providers
description: Learn about Azure Custom Resource Providers and how to extend the Azure API plane to fit your workflows.
author: jjbfour
ms.topic: conceptual
ms.date: 06/19/2019
ms.author: jobreen
---

# Azure Custom Resource Providers Overview

Azure Custom Resource Providers is an extensibility platform to Azure. It allows you to define custom APIs that can be used to enrich the default Azure experience. This documentation describes:

- How to build and deploy an Azure Custom Resource Provider.
- How to utilize Azure Custom Resource Providers to extend existing workflows.
- Where to find guides and code samples to get started.

:::image type="content" source="./media/overview/overview.png" alt-text="Diagram of Azure Custom Resource Providers, displaying the relationship between Azure Resource Manager, custom resource providers, and resources.":::

> [!IMPORTANT]
> Custom Resource Providers is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## What can custom resource providers do

Here are some examples of what you can achieve with Azure Custom Resource Providers:

- Extend Azure Resource Manager REST API to include internal and external services.
- Enable custom scenarios on top of existing Azure workflows.
- Customize Azure Resource Manager Templates control and effect.

## What is a custom resource provider

Azure Custom Resource Providers are made by creating a contract between Azure and an endpoint. This contract defines a list of new resources and actions through a new resource, **Microsoft.CustomProviders/resourceProviders**. The custom resource provider will then expose these new APIs in Azure. Azure Custom Resource Providers are composed of three parts: custom resource provider, **endpoints**, and custom resources.

## How to build custom resource providers

Custom resource providers are a list of contracts between Azure and endpoints. These contracts describe how Azure should interact with their endpoints. The resource providers act like a proxy and will forward requests and responses to and from their specified **endpoint**. A resource provider can specify two types of contracts: [**resourceTypes**](./custom-providers-resources-endpoint-how-to.md) and [**actions**](./custom-providers-action-endpoint-how-to.md). These are enabled through endpoint definitions. An endpoint definition is comprised of three fields: **name**, **routingType**, and **endpoint**.

Sample Endpoint:

```JSON
{
  "name": "{endpointDefinitionName}",
  "routingType": "Proxy",
  "endpoint": "https://{endpointURL}/"
}
```

Property | Required | Description
---|---|---
name | *yes* | The name of the endpoint definition. Azure will expose this name through its API under '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/<br>resourceProviders/{resourceProviderName}/{endpointDefinitionName}'
routingType | *no* | Determines the contract type with the **endpoint**. If not specified, it will default to "Proxy".
endpoint | *yes* | The endpoint to route the requests to. This will handle the response as well as any side effects of the request.

### Building custom resources

**ResourceTypes** describe new custom resources that are added to Azure. These expose basic RESTful CRUD methods. See [more about creating custom resources](./custom-providers-resources-endpoint-how-to.md)

Sample Custom Resource Provider with **resourceTypes**:

```JSON
{
  "properties": {
    "resourceTypes": [
      {
        "name": "myCustomResources",
        "routingType": "Proxy",
        "endpoint": "https://{endpointURL}/"
      }
    ]
  },
  "location": "eastus"
}
```

APIs added to Azure for the above sample:

HttpMethod | Sample URI | Description
---|---|---
PUT | /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/<br>providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/<br>myCustomResources/{customResourceName}?api-version=2018-09-01-preview | The Azure REST API call to create a new resource.
DELETE | /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/<br>providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/<br>myCustomResources/{customResourceName}?api-version=2018-09-01-preview | The Azure REST API call to delete an existing resource.
GET | /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/<br>providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/<br>myCustomResources/{customResourceName}?api-version=2018-09-01-preview | The Azure REST API call to retrieve an existing resource.
GET | /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/<br>providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/<br>myCustomResources?api-version=2018-09-01-preview | The Azure REST API call to retrieve the list of existing resources.

### Building custom actions

**Actions** describe new actions that are added to Azure. These can be exposed on top of the resource provider or nested under a **resourceType**. See [more about creating custom actions](./custom-providers-action-endpoint-how-to.md)

Sample Custom Resource Provider with **actions**:

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
  "location": "eastus"
}
```

APIs added to Azure for the above sample:

HttpMethod | Sample URI | Description
---|---|---
POST | /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/<br>providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/<br>myCustomAction?api-version=2018-09-01-preview | The Azure REST API call to activate the action.

## Looking for help

If you have questions for Azure Custom Resource Provider development, try asking on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-custom-providers). A similar question may have already been asked and answered, so check first before posting. Add the tag ```azure-custom-providers``` to get a fast response!

## Next steps

In this article, you learned about custom resource providers. Go to the next article to create a custom resource provider.

- [Quickstart: Create Azure Custom Resource Provider and deploy custom resources](./create-custom-provider.md)
- [Tutorial: Create custom actions and resources in Azure](./tutorial-get-started-with-custom-providers.md)
- [How To: Adding Custom Actions to Azure REST API](./custom-providers-action-endpoint-how-to.md)
- [How To: Adding Custom Resources to Azure REST API](./custom-providers-resources-endpoint-how-to.md)
