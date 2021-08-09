---
title: Resource onboarding
description: Learn about performing resource onboarding by using Azure Custom Providers to apply management or configuration to other Azure resource types.
author: jjbfour
ms.topic: conceptual
ms.date: 09/06/2019
ms.author: jobreen
---

# Azure Custom Providers resource onboarding overview

Azure Custom Providers resource onboarding is an extensibility model for Azure resource types. It allows you to apply operations or management across existing Azure resources at scale. For more information, see [How Azure Custom Providers can extend Azure](overview.md). This article describes:

- What resource onboarding can do.
- Resource onboarding basics and how to use it.
- Where to find guides and code samples to get started.

> [!IMPORTANT]
> Custom Providers is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might be unsupported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## What can resource onboarding do?

Similar to [Azure Custom Providers custom resources](./custom-providers-resources-endpoint-how-to.md), resource onboarding defines a contract that will proxy "onboarding" requests to an endpoint. Unlike custom resources, resource onboarding doesn't create a new resource type. Instead, it allows the extension of existing resource types. And resource onboarding works with Azure Policy, so management and configuration of resources can be done at scale. Some examples of resource onboarding workflows:

- Install and manage onto virtual machine extensions.
- Upload and configure defaults on Azure storage accounts.
- Enable baseline diagnostic settings at scale.

## Resource onboarding basics

You configure resource onboarding through Azure Custom Providers by using Microsoft.CustomProviders/resourceProviders and Microsoft.CustomProviders/associations resource types. To enable resource onboarding for a custom provider, during the configuration process, create a **resourceType** called "associations" with a **routingType** that includes "Extension". The Microsoft.CustomProviders/associations and Microsoft.CustomProviders/resourceProviders don't need to belong to the same resource group.

Here's a sample Azure custom provider:

```JSON
{
  "properties": {
    "resourceTypes": [
      {
        "name": "associations",
        "routingType": "Proxy,Cache,Extension",
        "endpoint": "https://microsoft.com/"
      }
    ]
  },
  "location": "eastus"
}
```

Property | Required? | Description
---|---|---
name | Yes | The name of the endpoint definition. For resource onboarding, the name must be "associations".
routingType | Yes | Determines the type of contract with the endpoint. For resource onboarding, the valid **routingTypes** are "Proxy,Cache,Extension" and "Webhook,Cache,Extension".
endpoint | Yes | The endpoint to route the requests to. This will handle the response and any side effects of the request.

After you create the custom provider with the associations resource type, you can target using Microsoft.CustomProviders/associations. Microsoft.CustomProviders/associations is an extension resource that can extend any other Azure resource. When an instance of Microsoft.CustomProviders/associations is created, it will take a property **targetResourceId**, which should be a valid Microsoft.CustomProviders/resourceProviders or Microsoft.Solutions/applications resource ID. In these cases, the request will be forwarded to the associations resource type on the Microsoft.CustomProviders/resourceProviders instance you created.

> [!NOTE]
> If a Microsoft.Solutions/applications resource ID is provided as the **targetResourceId**, there must be a Microsoft.CustomProviders/resourceProviders deployed in the managed resource group with the name "public".

Sample Azure Custom Providers association:

```JSON
{
  "properties": {
    "targetResourceId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}",
    ...
  }
}
```

Property | Required? | Description
---|---|---
targetResourceId | Yes | The resource ID of the Microsoft.CustomProviders/resourceProviders or Microsoft.Solutions/applications.

## How to use resource onboarding

Resource onboarding works by extending other resources with the Microsoft.CustomProviders/associations extension resource. In the following sample, the request is made for a virtual machine, but any resource can be extended.

First, you need to create a custom provider resource with an associations resource type. This will declare the callback URL that will be used when a corresponding Microsoft.CustomProviders/associations resource is created, which targets the custom provider.

Sample Microsoft.CustomProviders/resourceProviders create request:

``` HTTP
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}?api-version=2018-09-01-preview
Authorization: Bearer eyJ0e...
Content-Type: application/json

{
  "properties": {
    "resourceTypes": [
      {
        "name": "associations",
        "routingType": "Proxy,Cache,Extension",
        "endpoint": "https://{myCustomEndpoint}/"
      }
    ]
  },
  "location": "{location}"
}
```

After you create the custom provider, you can target other resources and apply the side effects of the custom provider to them.

Sample Microsoft.CustomProviders/associations create request:

``` HTTP
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{virtualMachineName}/providers/Microsoft.CustomProviders/associations/{associationName}?api-version=2018-09-01-preview
Authorization: Bearer eyJ0e...
Content-Type: application/json

{
  "properties": {
    "targetResourceId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}",
    "myProperty1": "myPropertyValue1",
    "myProperty2": {
        "myProperty3" : "myPropertyValue3"
    }
  }
}
```

This request will then be forwarded to the endpoint specified in the custom provider you created, which is referenced by the **targetResourceId** in this form:

``` HTTP
PUT https://{endpointURL}/?api-version=2018-09-01-preview
Content-Type: application/json
X-MS-CustomProviders-RequestPath: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/associations/{associationName}
X-MS-CustomProviders-ExtensionPath: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{virtualMachineName}/providers/Microsoft.CustomProviders/associations/{associationName}
X-MS-CustomProviders-ExtendedResource: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{virtualMachineName}

{
  "properties": {
    "myProperty1": "myPropertyValue1",
    "myProperty2": {
        "myProperty3" : "myPropertyValue3"
    }
  }
}
```

The endpoint should respond with an application/json `Content-Type` and a valid JSON response body. Fields that are returned under the **properties** object of the JSON will be added to the association return response.

## Getting help

If you have questions about Azure Custom Resource Providers development, try asking them on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-custom-providers). A similar question might have already been answered, so check first before posting. Add the tag ```azure-custom-providers``` to get a fast response!

## Next steps

In this article, you learned about custom providers. See these articles to learn more:

- [Tutorial: Resource onboarding with custom providers](./tutorial-resource-onboarding.md)
- [Tutorial: Create custom actions and resources in Azure](./tutorial-get-started-with-custom-providers.md)
- [Quickstart: Create a custom resource provider and deploy custom resources](./create-custom-provider.md)
- [How to: Adding custom actions to an Azure REST API](./custom-providers-action-endpoint-how-to.md)
- [How to: Adding custom resources to an Azure REST API](./custom-providers-resources-endpoint-how-to.md)
