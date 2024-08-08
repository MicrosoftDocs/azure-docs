---
title: Manage IP addresses with Azure Virtual Network Manager
description: Learn how to manage IP addresses with Azure Virtual Network Manager by creating and assigning IP address pools to your virtual networks.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 07/17/2024
#customer intent: As a network administrator, I want to learn how to manage IP addresses with Azure Virtual Network Manager so that I can create and assign IP address pools to my virtual networks.
---

# Manage IP addresses with Azure Virtual Network Manager

Azure Virtual Network Manager allows you to manage IP addresses by creating and assigning IP address pools to your virtual networks. This article shows you how to create and assign IP address pools to your virtual networks with Azure Virtual Network Manager in the Azure portal.

[!INCLUDE [virtual-network-manager-ipam](../../includes/virtual-network-manager-ipam.md)]

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- An existing network manager instance. If you don't have a network manager instance, see [Create a network manager instance](create-virtual-network-manager-portal.md).

## Create an IP address pool

In this step, you'll create an IP address pool for your virtual network.

1. In the Azure portal, search for and select **Network managers**.
2. Select your network manager instance.
3. In the left menu, select **IP address pools** under **IP address management**.
4. Select **+ Create** or **Create** to create a new IP address pool.
5. In the **Create an IP address pool** window, enter the following information:
    | Field | Description |
    | --- | --- |
    | **Name** | Enter a name for the IP address pool. |
    | **Description** | Enter a description for the IP address pool. |
    | **Parent pool** | For creating a **root pool**, leave default of . For creating a **child pool**, select the parent pool. |

6. Select **Next** or the **IP addresses** tab.
