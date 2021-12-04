---
title: 'Create a Layer 2 connection on Azure Orbital Global Communications service' 
description: 'Quickstart: Create a Layer 2 connection'
author: wamota
ms.service: orbital
ms.topic: quickstart
ms.custom: public-preview
ms.date: 11/16/2021
ms.author: wamota
# Customer intent: As a satellite operator, I want to connect to Azure through my satellite.
---

# Quickstart: Create a Layer 2 connection

Create a Layer 2 connection with a unique VLAN ID to allow traffic to flow between a ground station resource and an edge site resource.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Ground station resource. Learn more about how to [onboard a ground station](onboard-groundstation.md).
- Edge site resource. Learn more about how to [onboard an edge site](onboard-edgesite.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a Layer 2 connection

1.	Select **Create a resource** in the upper left-hand corner of the portal
2.	In the search box, enter **L2 connection**. Select **L2 connection** in the search results
3.	In the **L2 connection** page, select **Create**
4.	In **Create L2 connection resource**, enter or select this information in the **Basics** tab:

| **Field** | **Value** |
|---------|---------|
| Subscription | Select your subscription |
| Resource group | Select your resource group |
| Name | Enter a name for this L2 connection |
| Ground station | Select from a drop-down of ground stations that you've added in your subscription |
| Ground station router | Select from a drop-down of routers associated with the ground station selected above |
| Region | Select from a drop-down of regions for the ground station. *The list of regions will be pre-populated based upon ground station selection* |
| Edge site | Select from a drop-down of edge sites that you've added in your subscription |
| Edge site router | Select from a drop-down of routers associated with the edge site selected above |
| VLAN ID | Specify a VLAN ID with which to tag this L2 connection |

:::image type="content" source="./media/orbital-comms-createl2conn.png" alt-text="Create a L2 connection":::

5.	Select the **Review + create** tab or select the **Review + create** button
6.	Select **Create**.

## Next steps

- [Quickstart: Onboard a Ground Station](onboard-groundstation.md)
- [Quickstart: Onboard an Edge Site](onboard-edgesite.md)