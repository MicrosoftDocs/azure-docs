---
title: Create a secure AI hub and project with a managed virtual network
titleSuffix: titleSuffix: Azure AI Studio
description: Create an Azure AI hub and required Azure services inside a managed virtual network.
ms.service: azure-ai-studio
ms.reviewer: jhirono
ms.author: larryfr
author: Blackmist
ms.date: 08/11/2023
ms.topic: how-to
---

# How to create a secure AI hub and project with a managed virtual network

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

    1. 

1. Select **Review + create**

