---
title: Troubleshooting Azure Spring Cloud in virtual network
description: Troubleshooting guide for Azure Spring Cloud virtual network.
author: mikedodaro
ms.service: spring-cloud
ms.topic: how-to
ms.date: 09/19/2020
ms.author: brendm
ms.custom: devx-track-java
---

# Troubleshooting Azure Spring Cloud in virtual networks

This document will help you solve various problems that can arise when using Azure Spring Cloud in virtual networks.

## I encountered a problem with creating an Azure Spring Cloud service instance

To create an instance of Azure Spring Cloud, you must have sufficient permission to deploy the instance to the virtual network.  The Spring Cloud service instance must itself [Grant Azure Spring Cloud service permission to the virtual network](spring-cloud-tutorial-deploy-in-azure-virtual-network.md#grant-service-permission-to-the-virtual-network).

If you use the Azure portal to set up the Azure Spring Cloud service instance, the Azure portal will validate the permissions.

To set up the Azure Spring Cloud service instance by using the [Azure CLI](/cli/azure/get-started-with-azure-cli), verify that:

- The subscription is active.
- The location is supported by Azure Spring Cloud.
- The resource group for the instance is already created.
- The resource name conforms to the naming rule. It must contain only lowercase letters, numbers, and hyphens. The first character must be a letter. The last character must be a letter or number. The value must contain from 2 to 32 characters.

To set up the Azure Spring Cloud service instance by using the Resource Manager template, refer to [Understand the structure and syntax of Azure Resource Manager templates](../azure-resource-manager/templates/template-syntax.md).

### Common creation issues

| Error Message | How to fix |
|------|------|
| Resources created by Azure Spring Cloud were disallowed by policy. | Network resources will be created when deploy Azure Spring Cloud in your own virtual network. Please check whether you have [Azure Policy](../governance/policy/overview.md) defined to block those creation. Resources failed to be created can be found in error message. |
| Required traffic is not allowlisted. | Please refer to [Customer Responsibilities for Running Azure Spring Cloud in VNET](spring-cloud-vnet-customer-responsibilities.md) to ensure required traffic is allowlisted. |

## My application can't be registered

This problem occurs if your virtual network is configured with custom DNS settings. In this case, the private DNS zone used by Azure Spring Cloud is ineffective. Add the Azure DNS IP 168.63.129.16 as the upstream DNS server in the custom DNS server.

## Other issues

[Troubleshoot common Azure Spring Cloud issues](./spring-cloud-troubleshoot.md).