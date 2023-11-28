---
title: Azure Orbital Ground Station - register spacecraft
description: Learn how to register a spacecraft.
author: apoorvanori
ms.service: orbital
ms.topic: quickstart
ms.custom: ga
ms.date: 07/13/2022
ms.author: apoorvanori
# Customer intent: As a satellite operator, I want to ingest data from my satellite into Azure.
---

# Register and authorize spacecraft

To contact a satellite, it must be registered and authorized as a spacecraft resource with Azure Orbital Ground Station.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Contributor permissions at the subscription level.
- [Basic Support Plan](https://azure.microsoft.com/support/plans/) or higher to submit a spacecraft authorization request.
- Private spacecraft: an active spacecraft license and [relevant ground station licenses](initiate-licensing.md).
- An active contract with the partner network(s) you wish to integrate with Azure Orbital Ground Station.
     - [KSAT Lite](https://azuremarketplace.microsoft.com/marketplace/apps/kongsbergsatelliteservicesas1657024593438.ksatlite?exp=ubp8&tab=Overview)
     - [Viasat RTE](https://azuremarketplace.microsoft.com/marketplace/apps/viasatinc1628707641775.viasat-real-time-earth?tab=overview)

## Sign in to Azure

Sign in to the [Azure portal](https://aka.ms/orbital/portal).

## Create a spacecraft resource

Create a [spacecraft resource](spacecraft-object.md) as a representation of your satellite in Azure.

1. In the Azure portal search box, enter **Spacecraft**. Select **Spacecraft** in the search results.
2. In the **Spacecraft** page, select Create.
3. In **Create spacecraft resource**, enter or select this information in the Basics tab:

   | **Field** | **Value** |
   | --- | --- |
   | Subscription | Select your subscription |
   | Resource Group | Select your resource group |
   | Name | Enter spacecraft name |
   | Region | Enter region, e.g. West US 2 |
   | NORAD ID | Enter NORAD ID |
   | TLE title line | Enter TLE title line |
   | TLE line 1 | Enter TLE line 1 |
   | TLE line 2 | Enter TLE line 2 |
   
   > [!NOTE]
   > TLE stands for Two-Line Element. 
   > Be sure to update this TLE value before you schedule a contact. A TLE that is more than two weeks old might result in an unsuccessful downlink.

   > [!NOTE]
   > Spacecraft resources can be created in any Azure region with a Microsoft ground station and can schedule contacts on any ground station. Current eligible Azure regions are West US 2, Sweden Central, Southeast Asia, Brazil South, and South Africa North.

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

Submit a spacecraft authorization request in order to schedule [contacts](concepts-contact.md) with your new spacecraft resource at applicable ground station sites. 

   > [!NOTE]
   > A [Basic Support Plan](https://azure.microsoft.com/support/plans/) or higher is required to submit a spacecraft authorization request.

   > [!NOTE]
   > **Private spacecraft**: prior to submitting an authorization request, you must have an active spacecraft license for your satellite and work with Mircosot to add your satellite to our ground station licenses. Microsoft can provide technical information required to complete the federal regulator and ITU processes as needed. Learn more about [initiating ground station licensing](initiate-licensing.md).
   > 
   > **Public spacecraft**: licensing is not required for authorization. The Azure Orbital Ground Station service supports several public satellites including Aqua, Suomi NPP, JPSS-1/NOAA-20, and Terra.

1. Navigate to the newly created spacecraft resource's overview page.
2. Select **New support request** in the Support + troubleshooting section of the left-hand blade.
3. In the **New support request** page, enter or select this information in the Basics tab:

| **Field** | **Value** |
| --- | --- |
| Summary | Request Authorization for [Spacecraft Name] |
| Issue type |	Select **Technical** |
| Subscription |	Select the subscription in which the spacecraft resource was created |
| Service |	Select **My services** |
| Service type |	Search for and select **Azure Orbital** |
| Problem type |	Select **Spacecraft Management and Setup** |
| Problem subtype |	Select **Spacecraft Registration** |

4. Select the Details tab at the top of the page
5. In the Details tab, enter this information in the Problem details section:

| **Field** | **Value** |
| --- | --- |
| When did the problem start? | Select the **current date & time**. |
| Select Ground Stations | Select all desired **Microsoft or partner ground stations** that you are licensed for. If you do not see appropriate partner ground station(s), your subscription must be approved to access those sites by the Azure Orbital Ground Station team. |
| Do you Accept and Acknowledge the Azure Orbital Supplemental Terms? | Review the terms in the link by hovering over the information icon then select **Yes**. |
| Description | List your spacecraft's **frequency band(s)**. |
| File upload | Upload any **pertinent licensing material**, if applicable. |

6. Complete the **Advanced diagnostic information** and **Support method** sections of the **Details** tab.
7. Select the **Review + create** tab, or select the **Review + create** button.
8. Select **Create**.

After the spacecraft authorization request is submitted, the Azure Orbital Ground Station team will review the request and authorize the spacecraft resource at relevant ground stations according to the licenses. Authorization requests for public satellites will be quickly approved.

## Confirm spacecraft is authorized

1. In the Azure portal search box, enter **Spacecraft**. Select **Spacecraft** in the search results.
2. In the **Spacecraft** page, select the newly registered spacecraft.
3. In the new spacecraft's overview page, check that the **Authorization status** shows **Allowed**.

## Next steps

- [Configure a contact profile](contact-profile.md)
- [Schedule a contact](schedule-contact.md)
