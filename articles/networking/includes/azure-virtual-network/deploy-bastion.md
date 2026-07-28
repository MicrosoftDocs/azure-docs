---
title: include file
description: include file
services: virtual-network
author: asudbring
ms.service: azure-virtual-network
ms.topic: include
ms.date: 03/26/2026
ms.author: allensu
ms.custom: include file
---

## Deploy Azure Bastion

Azure Bastion uses your browser to connect to virtual machines (VMs) in your virtual network over secure shell (SSH) or remote desktop protocol (RDP) by using their private IP addresses. The virtual machines don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [Azure Bastion](/azure/bastion/bastion-overview).

>[!NOTE]
>[!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

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
