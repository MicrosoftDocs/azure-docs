---
title: Contact resource - Azure Orbital Ground Station
description: Learn more about a contact resource and how to schedule a contact.
author: hrshelar
ms.service: orbital
ms.topic: conceptual
ms.custom: ga
ms.date: 07/13/2022
ms.author: hrshelar
#Customer intent: As a satellite operator or user, I want to understand how to what the contact resource is so I can manage my mission operations.
---

# Ground station contact resource

A contact occurs when the spacecraft passes over a specified ground station. You can find available passes and schedule contacts for your spacecraft through the Azure Orbital Ground Station platform. A contact and ground station pass mean the same thing.

When you schedule a contact for a spacecraft, a contact resource is created under your spacecraft resource in your resource group. The contact is only associated with that particular spacecraft and can't be transferred to another spacecraft, resource group, or region.

## Contact parameters

The contact resource contains the start time and end time of the pass and other parameters related to pass operations. The full list is below.

| Parameter                 | Description                                                                                                                    |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| Reservation Start Time    | Start time of pass in UTC.                                                                                                     |
| Reservation End Time      | End time of pass in UTC.                                                                                                       |
| Maximum Elevation Degrees | The maximum elevation the spacecraft will be in the sky relative to the horizon in degrees. This is used to gauge the quality of the pass. |
| TX Start Time             | Start time of permissible transmission window in UTC. This start time will be equal to or come after Reservation Start Time.   |
| TX End Time               | End time of permissible transmission window in UTC. This end time will be equal to or come before Reservation End Time.        |
| RX Start Time             | Start time of permissible reception window in UTC. This start time will be equal to or come after Reservation Start Time.      |
| RX End Time               | End time of permissible reception window in UTC. This end time will be equal to or come before Reservation End Time.           |
| Start Azimuth             | Starting azimuth position of the spacecraft measured clockwise from North in degrees.                                          |
| End Azimuth               | End azimuth position of the spacecraft measured clockwise from North in degrees.                                               |
| Start Elevation           | Starting elevation position of the spacecraft measured from the horizon up in degrees.                                         |
| End Elevation             | Starting elevation position of the spacecraft measured from the horizon up in degrees.                                         |

The RX and TX start/end times might differ depending on the individual station masks. Billing meters are engaged between the Reservation Start Time and Reservation End Time.

## Create a contact

In order to create a contact, you must have the following prerequisites:
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An [authorized](register-spacecraft.md) spacecraft resource.
- A [contact profile](contact-profile.md) with links in accordance with the spacecraft resource above.

Contacts are created on a per-pass and per-site basis. If you already know the pass timings for your spacecraft and desired ground station, you can directly proceed to schedule the pass with these times. The service will succeed in creating the contact resource if the window is available and fail if the window is unavailable.

If you don't know your spacecraft's pass timings or which ground station sites are available, you can use the [Azure portal](https://aka.ms/orbital/portal) or [Azure Orbital Ground Station API](/rest/api/orbital/) to determine those details. Query the available passes and use the results to schedule your passes accordingly.

| Method | List available contacts | Schedule contacts | Notes |
|-|-|-|-|
|Portal| Yes | Yes | Custom pass timings aren't supported. You must use the results from the query. |
|API | Yes | Yes | Custom pass timings are supported. |

See [how-to schedule a contact](schedule-contact.md) for instructions to use the Azure portal. See [API documentation](/rest/api/orbital/) for instructions to use the Azure Orbital Ground Station API.

## Cancel a scheduled contact

In order to cancel a scheduled contact, you must delete the contact resource. You must have the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An [authorized](register-spacecraft.md) spacecraft resource.
- A [contact profile](contact-profile.md) with links in accordance with the spacecraft resource above.
- A [scheduled contact](schedule-contact.md).

1. In the Azure portal search box, enter **Spacecraft**. Select **Spacecraft** in the search results.
2. In the **Spacecraft** page, select the name of the spacecraft for the scheduled contact.
3. Select **Contacts** from the left menu bar in the spacecraft’s overview page.

   :::image type="content" source="media/orbital-eos-delete-contact.png" alt-text="Select a scheduled contact" lightbox="media/orbital-eos-delete-contact.png":::

4. Select the name of the contact to be deleted
5. Select **Delete** from the top bar of the contact's configuration view

   :::image type="content" source="media/orbital-eos-contact-config-view.png" alt-text="Delete a scheduled contact" lightbox="media/orbital-eos-contact-config-view.png":::

6. The scheduled contact will be canceled once the contact entry is deleted.

## Next steps

- [Schedule a contact](schedule-contact.md)
- [Update the Spacecraft TLE](update-tle.md)
