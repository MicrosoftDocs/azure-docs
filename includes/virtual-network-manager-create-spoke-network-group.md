---
title: include file
description: include file
services: virtual-network-manager
author: mbender
ms.service: azure-virtual-network-manager
ms.topic: include
ms.date: 06/04/2024
ms.author: mbender-ms
ms.custom: include-file
---

## Create a network group with manual membership

In this task, you create a network group with manual membership that includes your spoke virtual networks. Network groups are used to manage multiple virtual networks in a single configuration.

1. In the Azure portal, select your network manager instance.
2. Under **Settings** on the left side, select **Network groups** and select **+ Create**.
3. In the **Create a network group** pane, enter the following settings then select **Create**:
    
    | **Setting** | **Value** |
    |---|---|
    | **Name** | Enter a name for your network group. |
    | **Description** | (Optional) Enter a description for your network group. |
    | **Member Type** | Select **Virtual network**. |

4. On the **Networks groups** page, select the network group you created then select **Add virtual networks** under **Manually add members**.
5. In the **Manually add members** window, select spoke virtual networks then select **Add**.
    > [!IMPORTANT]
    > Don't add hub virtual network to this network group. If it's added as a member, you can't create a hub and spoke topology connectivity configuration with the group. The hub is selected during the creation of the connectivity configuration.