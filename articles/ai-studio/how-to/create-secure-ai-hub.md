---
title: Create a secure AI hub and project
titleSuffix: Azure AI Studio
description: Create an Azure AI hub inside a managed virtual network. The managed virtual network secures access to managed resources such as computes.
ms.service: azure-ai-studio
ms.reviewer: jhirono
ms.author: larryfr
author: Blackmist
ms.date: 08/11/2023
ms.topic: how-to
# Customer intent: As an administrator, I want to create a secure AI hub and project with a managed virtual network so that I can secure access to the AI hub and project resources.
---

# How to create a secure AI hub and project with a managed virtual network

You can secure your AI hub, AI projects, and managed resources in a managed virtual network. Using a private endpoint, resources in the managed virtual network can securely access other Azure resources such as your Azure Storage Account.

With a managed virtual network, inbound access is only allowed through an private endpoint for your AI hub resource. Outbound access can be configured to allow either all outbound access, or only allowed outbound that you specify. For more information, see [Managed virtual network](configure-managed-network.md).

> [!IMPORTANT]
> The managed virtual network doesn't provide inbound connectivity for your clients. For more information, see the [Connect to the AI hub](#connect-to-the-ai-hub) section. 

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free) before you begin.
- An Azure Virtual Network (VNet) that you use to securely connect to Azure services. For example, you may use [Azure Bastion](/azure/bastion/bastion-overview), [VPN Gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways) or [ExpressRoute](/azure/expressroute/expressroute-introduction) to connect to the VNet from your on-premises network. If you don't have a VNet, you can create one by following the instructions in [Create a virtual network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal).

## Create an AI hub

1. From the Azure portal, search for `Azure AI Studio` and create a new resource by selecting **+ New Azure AI**
1. Enter your AI hub name, subscription, resource group, and location details.

    :::image type="content" source="../media/how-to/network/ai-hub-basics.png" alt-text="Screenshot of the option to set Azure AI hub resource basic information." lightbox="../media/how-to/network/ai-hub-basics.png":::

1. Select **Next: Resources** to specify resources. Select an existing **Azure AI services** resource or create a new one. New Azure AI services include multiple API endpoints for Speech, Content Safety and Azure OpenAI. You can also bring an existing Azure OpenAI resource. Optionally, choose an existing **Storage account**, **Key vault**, **Container Registry**, and **Application insights** to host artifacts generated when you use AI Studio.

    :::image type="content" source="../media/how-to/network/ai-hub-resources.png" alt-text="Screenshot of the Create an Azure AI hub resource with the option to set resource information." lightbox="../media/how-to/network/ai-hub-resources.png"::: 

1. Select **Next: Networking** to configure the managed virtual network that AI Studio uses to secure its AI hub and AI project resources.
    
    1. Select **Private with Internet Outbound**, which allows compute resources to access the public internet for resources such as Python packages.

        :::image type="content" source="../media/how-to/network/ai-hub-networking.png" alt-text="Screenshot of the Create an Azure AI hub resource with the option to set network isolation information." lightbox="../media/how-to/network/ai-hub-networking.png":::

    1. To allow your clients to connect through your Azure Virtual Network to the AI hub, use the following steps to add a private endpoint.
    
        1. Select **+ Add** from the **Workspace inbound access** section of the **Networking** tab. This opens the **Create private endpoint** form.
        
            :::image type="content" source="../media/how-to/network/workspace-inbound-access.png" alt-text="Screenshot of the workspace inbound access section." lightbox="../media/how-to/network/workspace-inbound-access.png":::

        1. Enter a unique value in the **Name** field. Select the **Virtual network** (Azure Virtual Network) that your clients connect to. Select the **Subnet** that the private endpoint connects to.
        
            :::image type="content" source="../media/how-to/network/ai-hub-create-private-endpoint.png" alt-text="Screenshot of the create private endpoint form." lightbox="../media/how-to/network/ai-hub-create-private-endpoint.png":::

        1. Select **Ok** to save the endpoint configuration.

1. Select **Review + create**, then **Create** to create the AI hub.

## Create an AI project

When you create an AI project from the AI hub, the project inherits the network configuration from the AI hub. For more information on creating an AI project, see [Create an Azure AI project](create-projects.md).

> [!TIP]
> After the AI project is created, AI Studio may display an error message if your client can't resolve the DNS name of the AI project. For more information, see the [DNS resolution](#dns-resolution) section.

## Create a compute instance

When you create a compute instance from the AI hub, the compute instance inherits the network configuration from the AI hub. For more information on creating a compute instance, see [Create a compute instance](create-manage-compute.md).

## Connect to the secured resources

The managed virtual network doesn't directly provide access to your clients. Instead, your clients will connect to an Azure Virtual Network that *you* manage. There are multiple methods that you might use to connect clients to the Azure Virtual Network. The following table lists the common ways that clients connect to an Azure Virtual Network:

| Method | Description |
| ----- | ----- |
| [Azure VPN gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways.md) | Connects on-premises networks to an Azure Virtual Network over a private connection. Connection is made over the public internet. |
| [ExpressRoute](https://azure.microsoft.com/services/expressroute/) | Connects on-premises networks into the cloud over a private connection. Connection is made using a connectivity provider. |
| [Azure Bastion](/azure/bastion/bastion-overview) | Connects to a virtual machine inside the Azure Virtual Network using your web browser. |

> [!TIP]
> When connecting using Azure VPN gateway or ExpressRoute, you may need to use a to enable name resolution for your clients. For more information, see the [DNS resolution](#dns-resolution) section.

### DNS resolution

Depending on your network configuration, you may need to configure DNS resolution before your clients can connect to the AI hub, AI project, or compute instances.

> [!TIP]
> Your clients do not directly connect to the managed virtual network. Instead, they connect to an Azure Virtual Network that you manage. The private endpoint for your AI hub surfaces IP addresses and FQDNs for the AI hub, AI project, and managed compute resources in your Azure Virtual Network.

For more information, see the [custom DNS] article.

