---
title: Connect API Management instance to a private network | Microsoft Docs
description: Learn how to integrate an Azure API Management instance in the Standard v2 tier with a virtual network to access backend APIs hosted within the network.
author: dlepow
ms.author: danlep
ms.service: api-management
ms.topic: how-to 
ms.date: 08/23/2023
---

# Integrate an Azure API Management instance with a private VNet (preview)

This article guides you through the process of configuring *VNet integration* for your Azure API Management instance so that your API Management instance can make outbound requests to API backends that are isolated in the network.

When an API Management instance is integrated with a virtual network, the API Management itself is not deployed in a network, and the gateway other endpoints remain publicly accessible. In addition to having connectivity to the internet, the API Management instance has outbound connectivity to the network, enabling it to reach both public and network-isolated backend services.

:::image type="content" source="./media/integrate-vnet-outbound/vnet-integration.svg" alt-text="Diagram of integrating API Management instance with a delegated subnet."  :::

> [!NOTE]
> VNet integration is currently in preview. This networking option is available in the **Standard v2** pricing tier. For an overview of networking scenarios, see [Use a virtual network with Azure API Management](virtual-network-concepts.md). 

## Prerequisites

- An Azure API Management instance in the [Standard v2](v2-service-tiers-overview.md) pricing tier
- A virtual network with a subnet where your API Management backend APIs are hosted
    - The network must be deployed in the same region as your API Management instance
    - The subnet must be delegated to the **Microsoft.Web/serverFarms** service. [Learn how](../virtual-network/manage-subnet-delegation.md) to add a subnet delegation.
- (Optional) For testing, a sample Azure Functions backend API hosted within a different subnet in the virtual network. For example, see [Tutorial: Establish Azure Functions private site access](../azure-functions/functions-create-private-site-access.md).

## Enable VNet integration

This section will guide you through the process of enabling VNet integration for your Azure API Management instance.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Deployment + Infrastructure**, select **Network**.
1. On the **Outbound traffic** card, select **VNET integration**.
1. In the **Virtual network** blade, enable the **Virtual network** checkbox.
1. Select the location of your API Management instance.
1. In **Virtual network**, select the virtual network and the delegated subnet that you want to integrate. Leave the **Public IP Address** field empty.
1. Select **Apply**, and then select **Save**. The Vnet is integrated

:::image type="content" source="media/integrate-vnet-outbound/integrate-vnet.png" lightbox="media/integrate-vnet-outbound/integrate-vnet.png" alt-text="Screenshot of VNet integration in the portal.":::

## (Optional) Test VNet integration

If you have an API hosted in the virtual network, you can import it into your API Management instance and test the VNet integration. For basic steps, see [Import and publish an API](import-and-publish.md).


## Related content

* [Use a virtual network with Azure API Management](virtual-network-concepts.md)



