---
title: include file
description: include file
services: virtual-network
author: asudbring
ms.service: azure-virtual-network
ms.topic: include
ms.date: 08/05/2026
ms.author: allensu
ms.custom: include file
---

## Deploy Azure Bastion

Azure Bastion uses your browser to connect to virtual machines (VMs) in your virtual network over Secure Shell (SSH) or Remote Desktop Protocol (RDP) by using their private IP addresses. The virtual machines don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [What is Azure Bastion?](/azure/bastion/bastion-overview).

>[!NOTE]
>[!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

This procedure deploys the **Developer** tier, which uses shared infrastructure and doesn't require an **AzureBastionSubnet** or a public IP address. The Azure CLI and Azure PowerShell versions of this procedure deploy the **Basic** SKU, which requires both. For a comparison of features and deployment requirements, see [Choose the right Azure Bastion SKU](/azure/bastion/bastion-sku-comparison).

1. In the search box at the top of the portal, enter **Bastion**. Select **Bastions** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create a Bastion**, enter, or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **\<resource-group\>**. |
    | **Instance details** |  |
    | Name | Enter **\<bastion\>**. |
    | Region | Select **\<region\>**. |
    | Tier | Select **Developer**. |
    | **Configure virtual networks** |  |
    | Virtual network | Select **\<virtual-network\>**. |

1. Select **Review + create**.

1. Select **Create**.
