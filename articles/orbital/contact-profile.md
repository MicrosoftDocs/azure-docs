---
title: 'Configure a contact profile on Azure Orbital Earth Observation service' 
description: 'Quickstart: Configure a contact profile'
author: wamota
ms.service: orbital
ms.topic: quickstart
ms.custom: public-preview
ms.date: 11/16/2021
ms.author: wamota
# Customer intent: As a satellite operator, I want to ingest data from my satellite into Azure.
---

# Quickstart: Configure a contact profile

Configure a contact profile with Azure Orbital to save and reuse contact configurations. It's required before scheduling a contact to ingest data from a satellite into Azure.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- To complete the onboarding process for the preview. [Onboard to the Azure Orbital Preview](orbital-preview.md)
- To collect telemetry during the contact create an event hub. [Learn more about Azure Event Hubs](../event-hubs/event-hubs-about.md)
- An IP address (private or public) for data retrieval/delivery. [Create a VM and use its private IP](../virtual-machines/windows/quick-create-portal.md)

## Sign in to Azure

Sign in to the [Azure portal - Orbital Preview](https://aka.ms/orbital/portal).

## Create a contact profile resource

1. In the Azure portal search box, enter **Contact profile**. Select **Contact profile** in the search results. 
2. In the **Contact profile** page, select **Create**.
3. In **Create contact profile resource**, enter or select this information in the **Basics** tab:

   | **Field** | **Value** |
   | --- | --- |
   | Subscription | Select your subscription |
   | Resource group | Select your resource group |
   | Name | Enter contact profile name. Specify the antenna provider and mission information here. Like *Microsoft_Aqua_Uplink+Downlink_1* |
   | Region | Select **West US 2** |
   | Minimum viable contact duration | Define the minimum duration of the contact as a prerequisite to show you available time slots to communicate with your spacecraft. If an available time window is less than this time, it won't show in the list of available options. Provide minimum contact duration in ISO 8601 format. Like *PT1M* |
   | Minimum elevation | Define minimum elevation of the contact, after acquisition of signal (AOS), as a prerequisite to show you available time slots to communicate with your spacecraft. Using higher value can reduce the duration of the contact. Provide minimum viable elevation in decimal degrees. |
   | Auto track configuration | Select the frequency band to be used for autotracking during the contact. X band, S band, or Disabled. |
   | Event Hubs Namespace | Select an Event Hubs Namespace to which you'll send telemetry data of your contacts. Select a Subscription before you can select an Event Hubs Namespace. |
   | Event Hubs Instance | Select an Event Hubs Instance that belongs to the previously selected Namespace. *This field will only appear if an Event Hubs Namespace is selected first*. |

   :::image type="content" source="media/orbital-eos-contact-profile.png" alt-text="Contact Profile Resource Page" lightbox="media/orbital-eos-contact-profile.png":::

4. Select the **Links** tab, or select the **Next: Links** button at the bottom of the page.
5. In the **Links** page, select **Add new Link**
6. In the **Add Link** page, enter, or select this information per link direction:

   | **Field** | **Value** |
   | --- | --- |
   | Gain/Temperature (Downlink only) | Enter the gain to noise temperature in db/K |
   | EIRP in dBW (Uplink only) | Enter the effective isotropic radiated power in dBW |
   | Center Frequency | Enter the center frequency in MHz |
   | Bandwidth MHz | Enter the bandwidth in MHz |
   | Polarization | Select RHCP, LHCP, Dual, or Linear Vertical |
   | Endpoint name | Enter the name of the data delivery endpoint |
   | IP Address | Specify the IP Address for data retrieval/delivery |
   | Port | Specify the Port for data retrieval/delivery |
   | Protocol | Select TCP or UDP protocol for data retrieval/delivery |

   :::image type="content" source="media/orbital-eos-contact-link.png" alt-text="Contact Profile Links Page" lightbox="media/orbital-eos-contact-link.png":::

7. Select the **Submit** button
8. Select the **Review + create** tab or select the **Review + create** button
9. Select the **Create** button

## Next steps

- [Quickstart: Schedule a contact](schedule-contact.md)
- [Tutorial: Cancel a contact](delete-contact.md)