---
title: Register Spacecraft on Azure Orbital Earth Observation service
description: Learn how to register a spacecraft.
author: wamota
ms.service: orbital
ms.topic: quickstart
ms.custom: ga
ms.date: 07/13/2022
ms.author: wamota
# Customer intent: As a satellite operator, I want to ingest data from my satellite into Azure.
---

# Quickstart: Register Spacecraft

To contact a satellite, it must be registered as a spacecraft resource with the required information that identifies it.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://aka.ms/orbital/portal).

## Create spacecraft resource

1. In the Azure portal search box, enter **Spacecraft**. Select **Spacecraft** in the search results.
2. In the **Spacecraft** page, select Create.
3. In **Create spacecraft resource**, enter or select this information in the Basics tab:

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
   
   > [!NOTE]
   > TLE stands for Two-Line Element.

   :::image type="content" source="media/orbital-eos-register-bird.png" alt-text="Register Spacecraft Resource Page" lightbox="media/orbital-eos-register-bird.png":::

4. Select the **Links** tab, or select the **Next: Links** button at the bottom of the page.
5. In the **Links** page, enter or select this information:

   | **Field** | **Value** |
   | --- | --- |
   | Direction | Select Uplink or Downlink |
   | Center Frequency | Enter the center frequency in Mhz |
   | Bandwidth | Enter the bandwidth in Mhz |
   | Polarization | Select RHCP, LHCP, or Linear Vertical |

   :::image type="content" source="media/orbital-eos-register-links.png" alt-text="Spacecraft Links Resource Page" lightbox="media/orbital-eos-register-links.png":::

6. Select the **Review + create** tab, or select the **Review + create** button.
7. Select **Create**

## Request authorization of the new spacecraft resource

1. Navigate to the newly created spacecraft resource's overview page.
1. Select **New support request** in the Support + troubleshooting section of the left-hand blade.
1. In the **New support request** page, enter or select this information in the Basics tab:

| **Field** | **Value** |
| --- | --- |
| Summary | Request Authorization for [Spacecraft Name] |
| Issue type |	Select **Technical** |
| Subscription |	Select the subscription in which the spacecraft resource was created |
| Service |	Select **My services** |
| Service type |	Search for and select **Azure Orbital** |
| Problem type |	Select **Spacecraft Management and Setup** |
| Problem subtype |	Select **Spacecraft Registration** |

1. Select the Details tab at the top of the page
1. In the Details tab, enter this information in the Problem details section:

| **Field** | **Value** |
| --- | --- |
| When did the problem start? |	Select the current date & time |
| Description |	List your spacecraft's frequency bands and desired ground stations |
| File upload |	Upload any pertinent licensing material, if applicable |

1. Complete the **Advanced diagnostic information** and **Support method** sections of the **Details** tab.
1. Select the **Review + create** tab, or select the **Review + create** button.
1. Select **Create**.
 
## Confirm spacecraft is authorized

1. In the Azure portal search box, enter **Spacecraft**. Select **Spacecraft** in the search results.
1. In the **Spacecraft** page, select the newly registered spacecraft.
1. In the new spacecraft's overview page, check the **Authorization status** shows **Allowed**.

## Next steps

- [Configure a contact profile](contact-profile.md)
- [Schedule a contact](schedule-contact.md)
