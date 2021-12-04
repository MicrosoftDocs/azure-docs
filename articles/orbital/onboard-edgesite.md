---
title: 'Onboard an edge site on Azure Orbital Global Communications service' 
description: 'Quickstart: Onboard an edge site'
author: wamota
ms.service: orbital
ms.topic: quickstart
ms.custom: public-preview
ms.date: 11/16/2021
ms.author: wamota
# Customer intent: As a satellite operator, I want to connect to Azure through my satellite.
---

# Quickstart: Onboard an edge site

Create an edge site resource to connect to a ground station connected to Azure.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Edge site enabled for Azure Orbital. Learn more about [Azure Orbital Global Communications](overview.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create an edge site resource

1.	Select **Create a resource** in the upper left-hand corner of the portal.
2.	In the search box, enter **Edge site**. Select **Edge site** in the search results. 
3.	In the **Edge site** page, select **Create**.
4.	In **Create edge site**, enter or select this information in the **Basics** tab:

| **Field** | **Value** |
| --- | --- |
| Subscription | Select your subscription |
| Resource Group | Select your resource group |
| Name | Enter an edge site name |
| Site Code | Select from a drop-down of site codes associated with your subscription |
| Region | Select from a drop-down of regions for the edge site. *The list of regions will be pre-populated based upon site code selection.* |

:::image type="content" source="./media/orbital-comms-onboardedge.png" alt-text="Edge site create Page":::

5.	Select the **Review + create** tab or select the **Review + create** button.
6.	Select **Create**.

## Next steps

- [Quickstart: Onboard a ground station](onboard-groundstation.md)
- [Quickstart: Create an L2 connection](create-l2connection.md)