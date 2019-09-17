---
title: Azure Custom Providers resource onboarding
description: Learn about resource onboarding using Azure Custom Providers to apply management or configuration to other Azure resource types.
author: jjbfour
ms.service: managed-applications
ms.topic: conceptual
ms.date: 09/06/2019
ms.author: jobreen
---

# Azure Custom Providers resource onboarding overview

Azure Custom Providers resource onboarding is an extensibility model for Azure resource types. It allows you to apply operations or management across existing Azure resources at scale. For more information, see [How Azure Custom Providers can extend Azure](./custom-providers-overview.md). This documentation describes:

- What can resource onboarding do.
- Resource onboarding basics and how to use it.
- Where to find guides and code samples to get started.

> [!IMPORTANT]
> Custom Providers is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## What can resource onboarding do

Similar to [Azure Custom Provider custom resources](./custom-providers-resources-endpoint-how-to.md), resource onboarding defines a contract, which is will proxy "onboarding" requests to an endpoint. Unlike custom resources, resource onboarding does not create a new resource type, but rather allows the extension of existing resource types. In addition, resource onboarding works with Azure Policy, so management and configuration of resources can be done at scale. Some examples of resource onboarding workflows:

- Install and manage onto Virtual Machines extensions.
- Upload and configure defaults on Azure Storage Accounts.
- Enable baseline diagnostic settings at scale.

## Resource onboarding basics

Resource onboarding is configured through Azure Custom Providers using "Microsoft.CustomProviders/resourceProviders" and "Microsoft.CustomProviders/associations". To enable resource onboarding for a custom provider, during the configuration process create a **resourceType** called "associations" with a **routingType** that includes "Extension". 

Sample Azure Custom Provider:

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

Property | Required | Description
---|---|---
name | *yes* | The name of the endpoint definition. For resource onboarding the name must be "associations".
routingType | *yes* | Determines the contract type with the **endpoint**. For resource onboarding, the valid **routingTypes** are "Proxy,Cache,Extension" and "Webhook,Cache,Extension".
endpoint | *yes* | The endpoint to route the requests to. This will handle the response as well as any side effects of the request.

Once the custom provider with the "associations" resource type is created, you can target using "Microsoft.CustomProviders/associations". "Microsoft.CustomProviders/associations" is an extension resource that can extend any other Azure resource. When an instance of "Microsoft.CustomProviders/associations" is created, it will take a property **targetResourceId**, which should be a valid "Microsoft.CustomProviders/resourceProviders" or "Microsoft.Solutions/applications" resource id. In these cases, the request will be forwarded to the "associations" resource type on the "Microsoft.CustomProviders/resourceProviders" instance we created.

> [!Note]
> If a "Microsoft.Solutions/applications" resource id is provided as the **targetResourceId**, then there must be a "Microsoft.CustomProviders/resourceProviders" deployed in the managed resource group with the name "public".

Sample Azure Custom Provider Association:

```JSON
{
  "properties": {
    "targetResourceId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}",
    ...
  }
}
```

Property | Required | Description
---|---|---
targetResourceId | *yes* | The resource id of the "Microsoft.CustomProviders/resourceProviders" or "Microsoft.Solutions/applications".

## How to use resource onboarding

Resource onboarding works by extending other resources with the "Microsoft.CustomProviders/associations" extension resource. In the following sample, the request will be made for a virtual machine, but any resource can be extended.

First a custom provider resource with an "associations" resource type must be created. This will declare the callback URL that will be used when a corresponding "Microsoft.CustomProviders/associations" resource is created targeting the custom provider.

Sample "Microsoft.CustomProviders/resourceProviders" create request:

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

After the custom provider is created, we can now target other resources and apply the side effects of the custom provider to them.

Sample "Microsoft.CustomProviders/associations" create request:

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

This request will then be forwarded to the endpoint specified in the initial created custom provider, which is referenced by the "targetResourceId" in the form:

``` HTTP
POST https://{endpointURL}/?api-version=2018-09-01-preview
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

## Looking for help

If you have questions for Azure Custom Resource Provider development, try asking on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-custom-providers). A similar question may have already been asked and answered, so check first before posting. Add the tag ```azure-custom-providers``` to get a fast response!

## Next steps

In this article, you learned about custom providers. Go to the next article to create a custom provider.

- [Quickstart: Create Azure Custom Resource Provider and deploy custom resources](./create-custom-provider.md)
- [Tutorial: Create custom actions and resources in Azure](./tutorial-custom-providers-101.md)
- [How To: Adding Custom Actions to Azure REST API](./custom-providers-action-endpoint-how-to.md)
- [How To: Adding Custom Resources to Azure REST API](./custom-providers-resources-endpoint-how-to.md)
