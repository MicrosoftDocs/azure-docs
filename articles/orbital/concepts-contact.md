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

To establish connectivity with your spacecraft, schedule and execute a contact on a ground station. A contact, sometimes called a ground station 'pass,' can only occur when the spacecraft passes over a specified ground station while orbiting. You can find available contact opportunities and schedule contacts for your spacecraft through the Azure Orbital Ground Station [API](/rest/api/orbital/) or [Azure portal](https://aka.ms/orbital/portal).

Contacts are scheduled for a particular combination of a [spacecraft](spacecraft-object.md) and [contact profile](concepts-contact-profile.md). When you schedule a contact for a spacecraft, a contact resource is created under your spacecraft resource in your Azure resource group. The contact is only associated with that particular spacecraft and can't be transferred to another spacecraft, resource group, or region.

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

## Schedule a contact

Use the [Azure portal](https://aka.ms/orbital/portal) or [Azure Orbital Ground Station API](/rest/api/orbital/) to [create a contact resource](schedule-contact.md) for your spacecraft resource.

## Cancel a scheduled contact

In order to cancel a scheduled contact, you must delete the contact resource. 

To delete a contact resource via the [Azure portal](https://aka.ms/orbital/portal):  
1. In the Azure portal search box, enter **Spacecraft**. Select **Spacecraft** in the search results.
2. In the **Spacecraft** page, click the spacecraft associated with the scheduled contact.
3. Click **Contacts** from the left menu bar in the spacecraft’s overview page.

   :::image type="content" source="media/orbital-eos-delete-contact.png" alt-text="Select a scheduled contact" lightbox="media/orbital-eos-delete-contact.png":::

4. Click the contact to be deleted.
5. Click **Delete** from the top bar of the contact's configuration view.

   :::image type="content" source="media/orbital-eos-contact-config-view.png" alt-text="Delete a scheduled contact" lightbox="media/orbital-eos-contact-config-view.png":::

6. The scheduled contact will be canceled once the contact entry is deleted.

Alternatively, use the Contacts REST Operation Group to [delete a contact](/rest/api/orbital/azureorbitalgroundstation/contacts/delete/) with the Azure Orbital Ground Station API.

## Next steps

- [Schedule a contact](schedule-contact.md)
- [Update the spacecraft TLE](update-tle.md)
