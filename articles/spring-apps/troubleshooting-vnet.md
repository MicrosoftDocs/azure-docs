---
title: Troubleshooting Azure Spring Apps in virtual network
description: Troubleshooting guide for Azure Spring Apps virtual network.
author: KarlErickson
ms.service: spring-apps
ms.topic: how-to
ms.date: 09/19/2020
ms.author: karler
ms.custom: devx-track-java, event-tier1-build-2022
---

# Troubleshooting Azure Spring Apps in virtual networks

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article helps you solve various problems that can arise when using Azure Spring Apps in virtual networks.

## I encountered a problem with creating an Azure Spring Apps service instance

To create an instance of Azure Spring Apps, you must have sufficient permission to deploy the instance to the virtual network. The Azure Spring Apps service instance must itself grant Azure Spring Apps service permission to the virtual network. For more information, see the [Grant service permission to the virtual network](./how-to-deploy-in-azure-virtual-network.md#grant-service-permission-to-the-virtual-network) section of [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).

If you use the Azure portal to set up the Azure Spring Apps service instance, the Azure portal validates the permissions.

To set up the Azure Spring Apps service instance by using the [Azure CLI](/cli/azure/get-started-with-azure-cli), verify the following requirements:

- The subscription is active.
- The location supports Azure Spring Apps.
- The resource group for the instance is already created.
- The resource name conforms to the naming rule. It must contain only lowercase letters, numbers, and hyphens. The first character must be a letter. The last character must be a letter or number. The value must contain from 2 to 32 characters.

To set up the Azure Spring Apps service instance by using the Resource Manager template, refer to [Understand the structure and syntax of Azure Resource Manager templates](../azure-resource-manager/templates/syntax.md).

### Common creation issues

| Error message                                                       | How to fix                                                                                                                                                                                                                                                                 |
|---------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Resources created by Azure Spring Apps were disallowed by policy.` | Network resources are created when deploying Azure Spring Apps in your own virtual network. Be sure to check whether you have [Azure Policy](../governance/policy/overview.md) defined to block that creation. The error message lists the resources that weren't created. |
| `Required traffic is not allowlisted.`                              | Be sure to check [Customer responsibilities for running Azure Spring Apps in a virtual network](./vnet-customer-responsibilities.md) to ensure that the required traffic is allowlisted.                                                                                   |

## My application can't be registered

This problem occurs if your virtual network is configured with custom DNS settings. In this case, the private DNS zone used by Azure Spring Apps is ineffective. Add the Azure DNS IP 168.63.129.16 as the upstream DNS server in the custom DNS server.

## I can't access my application's endpoint or test endpoint in a virtual network

If your virtual network is configured with custom DNS settings, be sure to add Azure DNS IP `168.63.129.16` as the upstream DNS server in the custom DNS server, if you haven't already. Then, proceed with the following instructions.

If your virtual network is not configured with custom DNS settings, or if your virtual network is configured with custom DNS settings and you've already added Azure DNS IP `168.63.129.16` as the upstream DNS server in the custom DNS server, then complete the following steps:

1. Create a new private DNS zone `private.azuremicroservices.io`.
1. Link the private DNS zone to the virtual network.
1. Add the following two DNS records:

   - `*.private.azuremicroservices.io` -> the IP of your application.
   - `*.test.private.azuremicroservices.io` -> the IP of your application.

For more information, see [Access your application in a private network](./access-app-virtual-network.md)

## Other issues

- [Access your application in a private network](access-app-virtual-network.md)
- [Troubleshoot common Azure Spring Apps issues](./troubleshoot.md)
