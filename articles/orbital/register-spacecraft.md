---
title: 'Register Spacecraft on Azure Orbital Earth Observation service' 
description: 'Quickstart: Register Spacecraft'
author: wamota
ms.service: orbital
ms.topic: quickstart
ms.custom: public-preview
ms.date: 11/16/2021
ms.author: wamota
# Customer intent: As a satellite operator, I want to ingest data from my satellite into Azure.
---

# Quickstart: Register Spacecraft

To contact a satellite, it must be registered as a spacecraft resource with the required information that identifies it.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create spacecraft resource

1. Select **Create a resource** in the upper left-hand corner of the portal.
2. In the search box, enter **Spacecraft**. Select **Spacecraft** in the search results. 
3. In the **Spacecraft** page, select Create.
4. In **Create spacecraft resource**, enter or select this information in the Basics tab:

| **Field** | **Value** |
| --- | --- |
| Subscription | Select your subscription |
| Resource Group | Select your resource group |
| Name | Enter spacecraft name |
| Region | Select **West US 2** |
| NORAD ID | Enter NORAD ID |
| TLE title line | Enter TLE title line |
| TLE line 1 | Enter TLE line 1 |
| TLE line 2 | Enter TLE line 2 |

:::image type="content" source="./media/orbital-eos-registerbird.png" alt-text="Register Spacecraft Resource Page":::

5. Select the **Links** tab, or select the **Next: Links** button at the bottom of the page.
6. In the **Links** page, enter or select this information:

| **Field** | **Value** |
| --- | --- |
| Direction | Select Uplink or Downlink |
| Center Frequency | Enter the center frequency in Mhz |
| Bandwidth | Enter the bandwidth in Mhz |
| Polarization | Select RHCP, LHCP, Dual, or Linear Vertical |

:::image type="content" source="./media/orbital-eos-registerlinks.png" alt-text="Spacecraft Links Resource Page":::

7. Select the **Review + create** tab, or select the **Review + create** button.
8. Select **Create**

## Next steps

- [Quickstart: Configure a contact profile](contact-profile.md)
- [How-to: Schedule a contact](schedule-contact.md)