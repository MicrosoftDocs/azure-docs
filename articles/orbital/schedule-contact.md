---
title: Azure Orbital Ground Station - schedule a contact
description: Learn how to schedule a contact.
author: hrshelar
ms.service: orbital
ms.topic: quickstart
ms.custom: ga
ms.date: 12/06/2022
ms.author: hrshelar
# Customer intent: As a satellite operator, I want to schedule a contact to ingest data from my satellite into Azure.
---

# Schedule a contact

Schedule a contact with your satellite for data retrieval and delivery on Azure Orbital Ground Station. At the scheduled time, the selected ground station will contact the spacecraft and start data retrieval/delivery using the designated contact profile. Learn more about [contact resources](concepts-contact.md).

Contacts are created on a per-pass and per-site basis. If you already know the pass timings for your spacecraft and desired ground station, you can directly proceed to schedule the pass with these times. The service will succeed in creating the contact resource if the window is available and fail if the window is unavailable.

If you don't know your spacecraft's pass timings or which ground station sites are available, you can use the [Azure portal](https://aka.ms/orbital/portal) or [Azure Orbital Ground Station API](/rest/api/orbital/) to query for available contact opportunities and use the results to schedule your passes accordingly.

| Method | List available contacts | Schedule contacts | Notes |
|-|-|-|-|
|Portal| Yes | Yes | Custom pass timings aren't supported. You must use the results from the query. |
|API | Yes | Yes | Custom pass timings are supported. |

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Contributor permissions at the subscription level.
- A registered and authorized spacecraft resource. Learn more on how to [register a spacecraft](register-spacecraft.md).
- A contact profile with links in accordance with the spacecraft resource above. Learn more on how to [configure a contact profile](contact-profile.md).

## Azure portal method

1. Sign in to the [Azure portal - Orbital](https://aka.ms/orbital/portal).
2. In the Azure portal search box, enter **Spacecraft**. Select **Spacecraft** in the search results.
3. In the **Spacecraft** page, select the spacecraft for the contact.
4. Select **Schedule contact** on the top bar of the spacecraft’s overview.
 
   :::image type="content" source="media/orbital-eos-schedule.png" alt-text="Schedule a contact at spacecraft resource page" lightbox="media/orbital-eos-schedule.png":::

5. In the **Schedule contact** page, specify this information from the top of the page:

   | **Field** | **Value** |
   | --- | --- |
   | Contact profile | Specify the contact profile to be used for the contact |
   | Ground station | Specify the ground station(s) to be used for the contact |
   | Start time | Identify a start time for the contact availability window |
   | End time | Identify an end time for the contact availability window |

    :::image type="content" source="media/orbital-eos-schedule-search.png" alt-text="Search for available contact schedules page" lightbox="media/orbital-eos-schedule-search.png":::

6. Select **Search** to view available contact times.
7. Select one or more contact windows and select **Schedule**.

   :::image type="content" source="media/orbital-eos-select-schedule.png" alt-text="Select an available contact schedule page" lightbox="media/orbital-eos-select-schedule.png":::

8. View scheduled contacts by selecting the spacecraft page, and navigating to **Contacts**.

   :::image type="content" source="media/orbital-eos-view-scheduled-contacts.png" alt-text="View scheduled contacts page" lightbox="media/orbital-eos-view-scheduled-contacts.png":::

> [!NOTE]
> The new contact resource includes two properties: Provisioning State and Contact Status.
>
> [Provisioning state](/rest/api/orbital/azureorbitalgroundstation/contacts/create#provisioningstate) is the current state of the resource's creation, deletion, or modification in Azure.
>
> [Contact Status](/rest/api/orbital/azureorbitalgroundstation/contacts/create#contactsstatus) is the execution status of the contact resource. Values include scheduled, cancelled, providerCancelled, succeeded, and failed.
>
> The value of these properties can be found under the **Essentials** section of the contact overview page.

## API method

Use the Contacts REST Operation Group to [create a contact](/rest/api/orbital/azureorbitalgroundstation/contacts/create/) with the Azure Orbital Ground Station API.

## Next steps

- [Register Spacecraft](register-spacecraft.md)
- [Configure a contact profile](contact-profile.md)
