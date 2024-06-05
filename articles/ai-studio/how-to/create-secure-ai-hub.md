---
title: Create a secure hub
titleSuffix: Azure AI Studio
description: Create an Azure AI Studio hub inside a managed virtual network. The managed virtual network secures access to managed resources such as computes.
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: jhirono
ms.author: larryfr
author: Blackmist
# Customer intent: As an administrator, I want to create a secure hub and project with a managed virtual network so that I can secure access to the Azure AI Studio hub and project resources.
---

# How to create a secure Azure AI Studio hub and project with a managed virtual network

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

You can secure your Azure AI Studio hub, projects, and managed resources in a managed virtual network. With a managed virtual network, inbound access is only allowed through a private endpoint for your hub. Outbound access can be configured to allow either all outbound access, or only allowed outbound that you specify. For more information, see [Managed virtual network](configure-managed-network.md).

> [!IMPORTANT]
> The managed virtual network doesn't provide inbound connectivity for your clients. For more information, see the [Connect to the hub](#connect-to-the-hub) section. 

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free) before you begin.
- An Azure Virtual Network that you use to securely connect to Azure services. For example, you might use [Azure Bastion](/azure/bastion/bastion-overview), [VPN Gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways) or [ExpressRoute](/azure/expressroute/expressroute-introduction) to connect to the Azure Virtual Network from your on-premises network. If you don't have an Azure Virtual Network, you can create one by following the instructions in [Create a virtual network](/azure/virtual-network/quick-create-portal).

## Create a hub

1. From the Azure portal, search for `Azure AI Studio` and create a new resource by selecting **+ New Azure AI**.
1. Enter your hub name, subscription, resource group, and location details. You can also select an existing Azure AI services resource or create a new one.

    :::image type="content" source="../media/how-to/network/ai-hub-basics.png" alt-text="Screenshot of the option to set hub basic information." lightbox="../media/how-to/network/ai-hub-basics.png":::

1. Select **Next: Storage**. Select an existing **Storage account** and **Key vault** resource or create new ones. Optionally, choose an existing **Application insights**, and **Container Registry** for logs and docker images.

    :::image type="content" source="../media/how-to/network/ai-hub-resources.png" alt-text="Screenshot of the Create a hub with the option to set resource information." lightbox="../media/how-to/network/ai-hub-resources.png"::: 

1. Select **Next: Networking** to configure the managed virtual network that AI Studio uses to secure its hub and projects.
    
    1. Select **Private with Internet Outbound**, which allows compute resources to access the public internet for resources such as Python packages.

        :::image type="content" source="../media/how-to/network/ai-hub-networking.png" alt-text="Screenshot of the Create a hub with the option to set network isolation information." lightbox="../media/how-to/network/ai-hub-networking.png":::

    1. To allow your clients to connect through your Azure Virtual Network to the hub, use the following steps to add a private endpoint.
    
        1. Select **+ Add** from the **Workspace inbound access** section of the **Networking** tab. The **Create private endpoint** form is displayed.
        
            :::image type="content" source="../media/how-to/network/workspace-inbound-access.png" alt-text="Screenshot of the workspace inbound access section." lightbox="../media/how-to/network/workspace-inbound-access.png":::

        1. Enter a unique value in the **Name** field. Select the **Virtual network** (Azure Virtual Network) that your clients connect to. Select the **Subnet** that the private endpoint connects to.
        
            :::image type="content" source="../media/how-to/network/ai-hub-create-private-endpoint.png" alt-text="Screenshot of the create private endpoint form." lightbox="../media/how-to/network/ai-hub-create-private-endpoint.png":::

        1. Select **Ok** to save the endpoint configuration.

1. Select **Review + create**, then **Create** to create the hub. Once the hub has been created, any projects or compute instances created from the hub inherit the network configuration.

## Connect to the hub

The managed virtual network doesn't directly provide access to your clients. Instead, your clients connect to an Azure Virtual Network that *you* manage. There are multiple methods that you might use to connect clients to the Azure Virtual Network. The following table lists the common ways that clients connect to an Azure Virtual Network:

| Method | Description |
| ----- | ----- |
| [Azure VPN gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways) | Connects on-premises networks to an Azure Virtual Network over a private connection. Connection is made over the public internet. |
| [ExpressRoute](https://azure.microsoft.com/services/expressroute/) | Connects on-premises networks into the cloud over a private connection. Connection is made using a connectivity provider. |
| [Azure Bastion](/azure/bastion/bastion-overview) | Connects to a virtual machine inside the Azure Virtual Network using your web browser. |

## Next steps

- [Create a project](create-projects.md)
- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
- [Learn more about Azure AI Studio hubs](../concepts/ai-resources.md)
