---
title: Create an Azure Multicloud Interconnect Preview resource
description: Learn how to create an Azure Multicloud Interconnect Preview resource in the Azure portal and generate an activation key for your cloud provider.
author: duongau
ms.author: duau
ms.service: azure
ms.custom: references_regions
ms.topic: how-to
ms.date: 08/25/2026
---

# Create an Azure Multicloud Interconnect Preview resource

This article shows you how to create an Azure Multicloud Interconnect Preview resource in the Azure portal and generate an activation key. You redeem that key with your cloud service provider to complete the connection.

Azure Multicloud Interconnect supports two onboarding paths. Use this article when you start the request in Azure. If your provider generated the activation key instead, see [Redeem an Azure Multicloud Interconnect Preview activation key](redeem-activation-key.md).

> [!IMPORTANT]
> Azure Multicloud Interconnect is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure account with an active subscription
- An account with a supported cloud service provider. For the providers and regions supported during preview, see [Availability and limits](availability-limits.md).

## Open Azure Multicloud Interconnect setup

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Hybrid connectivity**.
1. In the left menu, expand **Azure Multicloud Interconnect**, and then select **Set up Azure Multicloud Interconnect**.

## Create the interconnect circuit

Azure Multicloud Interconnect uses Azure ExpressRoute as its underlying connectivity technology. You start by creating an ExpressRoute circuit that uses Azure Multicloud Interconnect as its port type.

1. On the setup page, select **Create Multicloud Interconnect Circuit**.
1. On the **Configuration** tab, under **Project details**, select your subscription and resource group. To create a new resource group, select **Create new**.
1. Under **Port details**, for **Port type**, select **Azure Multicloud Interconnect**.
1. Enter a name for the circuit.
1. Select the **Multicloud provider**, **Region**, and **Bandwidth** for the connection. These values determine the cloud provider, connection location, and available bandwidth for the circuit. To view the provider-to-region mappings, select **View region mapping**.
1. Under **Activation key**, select **Generate**.
1. Enter the **Account ID** associated with your cloud provider account. The cloud provider uses this value to verify ownership of both ends of the connection.
1. Select **Review + create**, review the configuration, and then select **Create**.

## Redeem the activation key with your cloud provider

Azure generates the activation key after you create the circuit. The key authorizes the connection by confirming that the cloud service provider, Azure region, bandwidth, and provider account match the request you submitted.

1. Open the circuit overview page and copy the activation key.
1. In your cloud service provider's portal, enter or redeem the activation key for the account you want to connect.
1. Complete the provider's setup steps to finish provisioning.

The provider validates that the key details match the account and the requested connection. If validation succeeds, Azure and the provider configure the underlying connectivity and the resource moves toward a provisioned state.

If validation fails, provisioning doesn't start. Confirm that the cloud service provider, Azure region, bandwidth, and provider account details match the original request. Correct any mismatch, and then restart activation.

## Connect the circuit to a virtual network

To reach your Azure workloads over the interconnect, connect the circuit to a virtual network.

1. Create an ExpressRoute virtual network gateway.
1. Create an ExpressRoute connection that links the gateway to the interconnect circuit.
1. Validate reachability between your Azure workloads and your workloads in the provider's cloud.

## Related content

- [What is Azure Multicloud Interconnect Preview?](overview.md)
- [Availability and limits](availability-limits.md)
- [Redeem an Azure Multicloud Interconnect Preview activation key](redeem-activation-key.md)
- [Azure Multicloud Interconnect Preview FAQ](faq.yml)
