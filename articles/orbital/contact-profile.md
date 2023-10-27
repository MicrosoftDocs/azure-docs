---
title: Azure Orbital Ground Station - Configure a contact profile
description: Learn how to configure a contact profile
author: apoorvanori
ms.service: orbital
ms.topic: quickstart
ms.custom: ga
ms.date: 12/06/2022
ms.author: apoorvanori
# Customer intent: As a satellite operator, I want to ingest data from my satellite into Azure.
---

# Configure a contact profile

Learn how to configure a [contact profile](concepts-contact-profile.md) with Azure Orbital Ground Station to save and reuse contact configurations. To schedule a contact, you must have a contact profile resource and satellite resource.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Contributor permissions at the subscription level.
- To collect telemetry during the contact, [create an event hub](receive-real-time-telemetry.md). [Learn more about Azure Event Hubs](../event-hubs/event-hubs-about.md).
- An IP address (private or public) for data retrieval/delivery. Learn how to [create a VM and use its private IP](../virtual-machines/windows/quick-create-portal.md).

## Sign in to Azure

Sign in to the [Azure portal - Orbital](https://aka.ms/orbital/portal).

## Create a contact profile resource

1. In the Azure portal search box, enter **Contact Profiles**. Select **Contact Profiles** in the search results. Alternatively, navigate to the Azure Orbital service and click **Contact profiles** in the left column.
2. In the **Contact Profiles** page, click **Create**.
3. In **Create Contact Profile Resource**, enter or select the following information in the **Basics** tab:

   | **Field** | **Value** |
   | --- | --- |
   | **Subscription** | Select a **subscription**. |
   | **Resource group** | Select a **resource group**. |
   | **Name** | Enter a contact profile **name**. Specify the antenna provider and mission information here, e.g. Microsoft_Aqua_Uplink_Downlink_1. |
   | **Region** | Select a **region**. |
   | **Minimum viable contact duration** | Define the **minimum duration** of the contact as a prerequisite to show available time slots to communicate with your spacecraft. _If an available time window is less than this time, it won't be in the list of available options. Provide minimum contact duration in ISO 8601 format, e.g. PT1M._ |
   | **Minimum elevation** | Define **minimum elevation** of the contact, after acquisition of signal (AOS), as a prerequisite to show available time slots to communicate with your spacecraft. _Using a higher value might reduce the duration of the contact. Provide minimum viable elevation in decimal degrees._ |
   | **Auto track configuration** | Select the frequency band to be used for autotracking during the contact: **X band**, **S band**, or **Disabled**. |
   | **Event Hubs Namespace** | Select an **Event Hubs Namespace** to which you'll send telemetry data of your contacts. Learn how to [configure Event Hubs](receive-real-time-telemetry.md#configure-event-hubs). _You must select a subscription before you can select an Event Hubs Namespace._ |
   | **Event Hubs Instance** | Select an **Event Hubs Instance** that belongs to the previously selected Namespace. _This field only appears if an Event Hubs Namespace is selected first_. |
   | **Virtual Network** | Select a **virtual network**. *This VNET must be in the same region as the contact profile.* |
   | **Subnet** | Select a **subnet**. *The subnet must be within the previously chosen VNET, be delegated to the Microsoft.Orbital service, and have a minimum address prefix of size /24.* |

   :::image type="content" source="media/orbital-eos-contact-profile.png" alt-text="Screenshot of the contact profile basics page." lightbox="media/orbital-eos-contact-profile.png":::

4. Click **Next**. In the **Links** pane, click **Add new Link**.
5. In the **Add Link** page, enter or select the following information per link direction:

   | **Field** | **Value** |
   | --- | --- |
   | **Name** | Provide a **name** for the link. |
   | **Direction** | Select the link **direction**. |
   | **Gain/Temperature** (_downlink only_) | Enter the **gain to noise temperature** in dB/K. |
   | **EIRP in dBW** (_uplink only_) | Enter the **effective isotropic radiated power** in dBW. |
   | **Polarization** | Select **RHCP**, **LHCP**, **Dual**, or **Linear Vertical**. |

   :::image type="content" source="media/orbital-eos-contact-link.png" alt-text="Screenshot of the contact profile links pane." lightbox="media/orbital-eos-contact-link.png":::

6. Click **Add Channel**. In the **Add Channel** pane, enter or select the following information per channel:

   | **Field** | **Value** |
   | --- | --- |
   | **Name** | Enter a **name** for the channel. |
   | **Center Frequency** (MHz) | Enter the **center frequency** in MHz. |
   | **Bandwidth** (MHz) | Enter the **bandwidth** in MHz. |
   | **Endpoint name** | Enter the **name** of the data delivery endpoint, e.g. the name of a virtual machine in your resource group. |
   | **IP Address** | Specify the **IP Address** for data retrieval/delivery in TCP/UDP **server mode**. Leave the IP Address field **blank** for TCP/UDP **client mode**. |
   | **Port** | Specify the **port** for data retrieval/delivery. *The port must be within 49152 and 65535 and must be unique across all links in the contact profile.* |
   | **Protocol** | Select **TCP** or **UDP** protocol for data retrieval/delivery. |
   | **Demodulation Configuration Type** (_downlink only_) | Select **Preset Named Modem Configuration** or **Raw XML**. |
   | **Demodulation Configuration** (_downlink only_) | Refer to [configure the RF chain](modem-chain.md) for options. |
   | **Decoding Configuration** (_downlink only_)| If applicable, paste your decoding configuration. |
   | **Modulation Configuration** (_uplink only_) | Refer to [configure the RF chain](modem-chain.md) for options. |
   | **Encoding Configuration** (_uplink only_)| If applicable, paste your encoding configuration. |

7. Click **Submit** to add the channel. After adding all channels, click **Submit** to add the link.  
8. If a mission requires third-party providers, click the **Third-Party Configuration** tab.
   
   > [!NOTE] 
   > Mission configurations are agreed upon with partner network providers. Contacts can only be successfully scheduled with the partners if the contact profile contains the appropriate mission configuration.

11. In the **Third-Party Configurations** tab, click **Add new Configuration**.
12. In the **Mission Configuration** page, enter the following information:
   
    | **Field** | **Value** |
    | --- | --- |
    | **Provider Name** | Enter the **name** of the provider. |
    | **Mission Configuration** | Enter the **mission configuration** from the provider. |

13. Click **Submit** to add the mission configuration.
14. Click **Review + create**. After the validation is complete, click **Create**.

After a successful deployment, the contact profile is added to your resource group.

## Next steps

- [Receive real-time antenna telemetry](receive-real-time-telemetry.md)
- [Configure the RF chain](modem-chain.md)
- [Schedule a contact](schedule-contact.md)
