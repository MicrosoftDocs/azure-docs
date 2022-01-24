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
- Complete the onboarding process for the preview. [Onboard to the Azure Orbital Preview](orbital-preview.md)

## Sign in to Azure

Sign in to the [Azure portal - Orbital Preview](https://aka.ms/orbital/portal).

## Create spacecraft resource

> [!NOTE]
> These steps must be followed as is or you won't be able to find the resources. Please use the specific link above to sign in directly to the Azure Orbital Preview page.

1. In the Azure portal search box, enter **Spacecrafts*. Select **Spacecrafts** in the search results.
2. In the **Spacecrafts** page, select Create.
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

## Authorize the new spacecraft resource

1. Access the [Azure Orbital Spacecraft Authorization Form](https://forms.office.com/r/QbUef0Cmjr)
2. Provide the following information:

   - Spacecraft name
   - Region where spacecraft resource was created
   - Company name and email
   - Azure Subscription ID

3. Submit the form
4. Await a 'Spacecraft resource authorized' email from Azure Orbital
 
## Confirm spacecraft is authorized

1. In the Azure portal search box, enter **Spacecrafts**. Select **Spacecrafts** in the search results
2. In the **Spacecrafts** page, select the newly registered spacecraft
3. In the new spacecraft's overview page, check the **Authorization status** shows **Allowed**

## Next steps

- [Quickstart: Configure a contact profile](contact-profile.md)
- [How-to: Schedule a contact](schedule-contact.md)
