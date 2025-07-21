---
title: Create, change, or delete a virtual network TAP - Azure portal
description: Learn how to create, change, or delete a virtual network TAP using the Azure portal.
services: virtual-network
author: avirupcha
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 04/21/2025
ms.author: avirupcha
# Customer intent: As a network administrator, I want to create and configure a virtual network TAP, so that I can efficiently stream my virtual machine network traffic to a monitoring or analytics tool for enhanced traffic analysis and performance optimization.
---

# Work with a virtual network TAP using the Azure portal

Azure virtual network TAP (Terminal Access Point) allows you to continuously stream your virtual machine network traffic to a network packet collector or analytics tool. The collector or analytics tool is provided by a [network virtual appliance](https://azure.microsoft.com/solutions/network-appliances/) partner. For a list of partner solutions that are validated to work with virtual network TAP, see [partner solutions](virtual-network-tap-overview.md#virtual-network-tap-partner-solutions).

> [!IMPORTANT]
> Virtual network TAP is now in Public Preview. For more information, see the [Overview](virtual-network-tap-overview.md) article.

## Before you begin

Before you create a virtual network TAP resource, review the following items:

* Read the [prerequisites](virtual-network-tap-overview.md#prerequisites) in the Overview article before you create a virtual network TAP resource.
* You must sign in to Azure with an account that has the appropriate [permissions](virtual-network-tap-overview.md#permissions).

## Create a virtual network TAP resource

The following steps show you how to create a virtual network TAP resource using the [Azure portal](https://aka.ms/VTAPPublicPreview).

[In the portal](https://aka.ms/VTAPPublicPreview), select **Create** to open the Virtual network terminal access points page.

:::image type="content" source="./media/virtual-network-tap/portal-tutorial-create.png" alt-text="Screenshot of virtual network tap Azure portal showing how to start creating a virtual network TAP resource." lightbox="./media/virtual-network-tap/portal-tutorial-create.png":::

1. Select your subscription ID.
1. Select the Resource Group for your virtual network TAP resource.
1. Give your virtual network TAP resource a name.
1. Select the Azure region for your virtual network TAP resource. The destination and source resource must be in the same region as your virtual network TAP resource.
1. Next, click **Select destination resource** to open the **Add a destination** page.

### Add a destination resource

A virtual network TAP resource can only have a single destination resource and it must be in the same region as the virtual network TAP resource.

:::image type="content" source="./media/virtual-network-tap/portal-tutorial-add-destination.png" alt-text="Screenshot of virtual network tap Azure portal showing how to add destination resource for mirrored traffic." lightbox="./media/virtual-network-tap/portal-tutorial-add-destination.png":::

Use the following steps to add a destination resource.

1. Select between network interface or a load balancer.
1. Filter for your desired destination resource. You can filter by using the search bar.
1. Select your destination resource.
1. After you specify your destination resource, click **Select** to open the **Add source network interfaces** page.

### Add a source resource

You can have multiple sources per virtual network resource. If you have multiple sources, traffic is mirrored to the same destination resource. Sources must be in the same region as the virtual network TAP resource.

:::image type="content" source="./media/virtual-network-tap/portal-tutorial-add-source.png" alt-text="Screenshot of virtual network tap Azure portal showing how to add mirrored traffic source." lightbox="./media/virtual-network-tap/portal-tutorial-add-source.png":::

Configure the following settings to add a source resource:

1. Filter for your desired source network interface.
1. Select the source network interface.
1. Click **Add**.
1. Click **Review and Create** to deploy your virtual network TAP resource.

## Next steps

Learn how to [Create a virtual network TAP](tutorial-tap-virtual-network-cli.md) using CLI.
