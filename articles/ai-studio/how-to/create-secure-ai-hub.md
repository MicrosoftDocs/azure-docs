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

    :::image type="content" source="../media/how-to/resource-create-basics.png" alt-text="Screenshot of the option to set Azure AI hub resource basic information." lightbox="../media/how-to/resource-create-basics.png":::

1. Select **Next: Resources** to specify resources. Select an existing **Azure AI services** resource or create a new one. New Azure AI services include multiple API endpoints for Speech, Content Safety and Azure OpenAI. You can also bring an existing Azure OpenAI resource. Optionally, choose an existing **Storage account**, **Key vault**, **Container Registry**, and **Application insights** to host artifacts generated when you use AI Studio.

    :::image type="content" source="../media/how-to/resource-create-resources.png" alt-text="Screenshot of the Create an Azure AI hub resource with the option to set resource information." lightbox="../media/how-to/resource-create-resources.png"::: 

1. Select **Next: Networking** to configure the managed virtual network that AI Studio uses to secure its AI hub and AI project resources.
    
    1. Select **Private with Internet Outbound**, which allows compute resources to access the public internet for resources such as Python packages.

        :::image type="content" source="../media/how-to/resource-create-networking.png" alt-text="Screenshot of the Create an Azure AI hub resource with the option to set network isolation information." lightbox="../media/how-to/resource-create-networking.png":::

    1. To allow your clients to connect through your Azure Virtual Network to the AI hub, use the following steps to add a private endpoint.
    
        1. Select **+ Add** from the **Workspace inbound access** section of the **Networking** tab. This opens the **Create private endpoint** form. 
        1. Enter a unique value in the **Name** field. Select the **Virtual network** that your clients connect to. Select the **Subnet** that the private endpoint connects to.
        1. Select **Ok** to save the endpoint configuration.

1. Select **Review + create**

## Create an AI project

When you create an AI project from the AI hub, the project is automatically secured by the managed virtual network. No special configuration is required. For more information on creating an AI project, see [Create an Azure AI project](create-projects.md).

> [!TIP]
> After the AI project is created, AI Studio display an error message if your client can't resolve the DNS name of the AI project. For more information, see the [DNS resolution](#dns-resolution) section.

## Create a compute instance

To create a new compute instance, use the following steps:

1. From Azure AI Studio, select **Manage**, the **AI hub** created in the previous section, and then select **Compute instances**.
1. Select **+ New** to create a new compute instance. Provide a **Compute name**, then continue through the creation process accepting the default values. 
1. From the **Review** page, select **Create**. The managed virtual network is created when the compute instance is created.

## Connect to the secured resources

The managed virtual network doesn't directly provide access to your clients. Instead, your clients will connect to an Azure Virtual Network that *you* manage. There are multiple methods that you might use to connect clients to the Azure Virtual Network. The following table lists the common ways that clients connect to an Azure Virtual Network:

| Method | Description |
| ----- | ----- |
| [Azure VPN gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways.md) | Connects on-premises networks to an Azure Virtual Network over a private connection. Connection is made over the public internet. |
| [ExpressRoute](https://azure.microsoft.com/services/expressroute/) | Connects on-premises networks into the cloud over a private connection. Connection is made using a connectivity provider. |
| [Azure Bastion](/azure/bastion/bastion-overview) | Connects to a virtual machine inside the Azure Virtual Network using your web browser. |

> [!TIP]
> When connecting using Azure VPN gateway or ExpressRoute, you may need to use a to enable name resolution for your clients. For more information, see the [DNS resolution](#dns-resolution) section.

### Creating a private endpoint

To connect your Azure Virtual Network to the AI hub, add a private endpoint to the AI hub. You can do this when creating the AI hub (as described in [Create an AI hub](#create-an-ai-hub) section,) or afterwards by following these steps:

1. From the [Azure portal](https://portal.azure.com), navigate to the AI hub that you want to create a private endpoint for.
1. Select **Networking**, **Private endpoint connections**, and then select **+ Private endpoint**.
1. From the **Basics** page, provide a **Name** and **Network interface name** for the new endpoint. Select the appropriate **Subscription**, **Resource group**, and **Region**.
1. From the **Virtual Network** tab, select the **Virtual network** and **Subnet** that the private endpoint connects to. You can also select whether the IP is dynamically or statically allocated.
1. Continue through the steps and select **Create** to create the private endpoint.

### DNS resolution

Depending on your network configuration, you may need to configure DNS resolution before your clients can connect to the AI hub, AI project, or compute instances.

> [!TIP]
> Your clients do not directly connect to the managed virtual network. Instead, they connect to an Azure Virtual Network that you manage. The private endpoint for your AI hub surfaces IP addresses and FQDNs for the AI hub, AI project, and managed compute resources in your Azure Virtual Network.

For more information, see the [custom DNS] article.

