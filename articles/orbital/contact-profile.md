---
title: Configure a contact profile on Azure Orbital Ground Station service 
description: Learn how to configure a contact profile
author: apoorvanori
ms.service: orbital
ms.topic: quickstart
ms.custom: ga
ms.date: 12/06/2022
ms.author: apoorvanori
# Customer intent: As a satellite operator, I want to ingest data from my satellite into Azure.
---

# Quickstart: Configure a contact profile

Configure a contact profile with Azure Orbital Ground Station to save and reuse contact configurations. This is required before scheduling a contact to ingest data from a satellite into Azure.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Contributor permissions at the subscription level.
- To collect telemetry during the contact, create an event hub. [Learn more about Azure Event Hubs](../event-hubs/event-hubs-about.md)
- An IP address (private or public) for data retrieval/delivery. [Create a VM and use its private IP](../virtual-machines/windows/quick-create-portal.md)

## Sign in to Azure

Sign in to the [Azure portal - Orbital](https://aka.ms/orbital/portal).

## Create a contact profile resource

1. In the Azure portal search box, enter **Contact Profiles**. Select **Contact Profiles** in the search results. Alternatively, navigate to the Azure Orbital service and select **Contact profiles** in the left column.
2. In the **Contact Profiles** page, select **Create**.
3. In **Create Contact Profile Resource**, enter or select this information in the **Basics** tab:

   | **Field** | **Value** |
   | --- | --- |
   | Subscription | Select a subscription |
   | Resource group | Select a resource group |
   | Name | Enter the contact profile name. Specify the antenna provider and mission information here. Like *Microsoft_Aqua_Uplink_Downlink_1* |
   | Region | Select a region |
   | Minimum viable contact duration | Define the minimum duration of the contact as a prerequisite to show you available time slots to communicate with your spacecraft. If an available time window is less than this time, it won't show in the list of available options. Provide minimum contact duration in ISO 8601 format. Like *PT1M* |
   | Minimum elevation | Define minimum elevation of the contact, after acquisition of signal (AOS), as a prerequisite to show you available time slots to communicate with your spacecraft. Using higher value can reduce the duration of the contact. Provide minimum viable elevation in decimal degrees. |
   | Auto track configuration | Select the frequency band to be used for autotracking during the contact. X band, S band, or Disabled. |
   | Event Hubs Namespace | Select an Event Hubs Namespace to which you'll send telemetry data of your contacts. Select a Subscription before you can select an Event Hubs Namespace. |
   | Event Hubs Instance | Select an Event Hubs Instance that belongs to the previously selected Namespace. *This field will only appear if an Event Hubs Namespace is selected first*. |
   | Virtual Network | Select a Virtual Network according to the instructions on the page. |

   :::image type="content" source="media/orbital-eos-contact-profile.png" alt-text="Contact Profile Resource Page" lightbox="media/orbital-eos-contact-profile.png":::

4. Select the **Links** tab, or select the **Next: Links** button at the bottom of the page.
5. In the **Links** page, select **Add new Link**.
6. In the **Add Link** page, enter or select this information per link direction:

   | **Field** | **Value** |
   | --- | --- |
   | Name | Provide a name for the link |
   | Direction | Select the link direction |
   | Gain/Temperature (Downlink only) | Enter the gain to noise temperature in db/K |
   | EIRP in dBW (Uplink only) | Enter the effective isotropic radiated power in dBW |
   | Polarization | Select RHCP, LHCP, Dual, or Linear Vertical |

7. Select the **Add Channel** button.  
8. In the **Add Channel** page, enter or select this information per channel:

   | **Field** | **Value** |
   | --- | --- |
   | Name | Enter the name for the channel |
   | Center Frequency | Enter the center frequency in MHz |
   | Bandwidth MHz | Enter the bandwidth in MHz |
   | Endpoint name | Enter the name of the data delivery endpoint |
   | IP Address | Specify the IP Address for data retrieval/delivery |
   | Port | Specify the Port for data retrieval/delivery |
   | Protocol | Select TCP or UDP protocol for data retrieval/delivery |
   | Demodulation Configuration Type (Downlink only) | Select type |
   | Demodulation Configuration (Downlink only) | Refer to [configure the modem chain](modem-chain.md) for options. |
   | Decoding Configuration (Downlink only)| If applicable, paste your decoding configuration |
   | Modulation Configuration (Uplink only) | Refer to [configure the modem chain](modem-chain.md) for options. |
   | Encoding Configuration (Uplink only)| If applicable, paste your encoding configuration |

   :::image type="content" source="media/orbital-eos-contact-link.png" alt-text="Contact Profile Links Page" lightbox="media/orbital-eos-contact-link.png":::

7. Select the **Submit** button to add the channel.
8. After adding all channels, select the **Submit** button to add the link.  

9. If a mission requires third-party providers, select the **Third-Party Configuration** tab, or select the **Next: Third-Party Configurations** button at the bottom of the page.

   > [!NOTE] 
   > Mission configurations are agreed upon with third-party providers. Contacts can only be successfully scheduled with the partners if the contact profile contains the discussed mission configuration.

10. In the **Third-Party Configurations** page, select **Add new Configuration**.
11. In the **Mission Configuration** page, enter this information:
   
    | **Field** | **Value** |
    | --- | --- |
    | Provider Name | Enter the name of the provider |
    | Mission Configuration | Enter the mission configuration from the provider |

13. Select the **Submit** button to add the mission configuration.
14. Select the **Review + create** tab or select the **Review + create** button at the bottom of the page.
15. Select the **Create** button.

## Next steps

- [How-to Receive real-time telemetry](receive-real-time-telemetry.md)
- [Configure the RF chain](modem-chain.md)
- [Schedule a contact](schedule-contact.md)
- [Cancel a contact](delete-contact.md)
