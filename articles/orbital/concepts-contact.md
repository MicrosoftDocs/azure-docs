---
title: Ground station contact - Azure Orbital
description: Learn more about the contact object and how to schedule a contact.
author: hrshelar
ms.service: orbital
ms.topic: conceptual
ms.custom: ga
ms.date: 07/13/2022
ms.author: hrshelar
#Customer intent: As a satellite operator or user, I want to understand how to what the contact object is so I can manage my mission operations.
---

# Ground station contact

A contact occurs when the spacecraft is over a specified ground station. You can find available passes on the system and schedule them for use through Azure Orbital Ground Station (AOGS). A contact and ground station pass mean the same thing.

When you schedule a contact, a contact object is created under your spacecraft object in your resource group. The contact only associated with this spacecraft and can't be transferred to another spacecraft, resource group, or region.

## Contact object

The contact object contains the start time and end time of the pass and other parameters of interest related to pass operations. The full list is below.

| Parameter                 | Description                                                                                                                    |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| Reservation Start Time    | Start time of pass in UTC.                                                                                                     |
| Reservation End Time      | End time of pass in UTC.                                                                                                       |
| Maximum Elevation Degrees | The maximum elevation the spacecraft will be in the sky relative to horizon in degrees, used to gauge the quality of the pass. |
| TX Start Time             | Start time of permissible transmission window in UTC. This start time will be equal to or come after Reservation Start Time.   |
| TX End Time               | End time of permissible transmission window in UTC. This end time will be equal to or come before Reservation End Time.        |
| RX Start Time             | Start time of permissible reception window in UTC. This start time will be equal to or come after Reservation Start Time.      |
| RX End Time               | End time of permissible reception window in UTC. This end time will be equal to or come before Reservation End Time.           |
| Start Azimuth             | Starting azimuth position of the spacecraft measured clockwise from North in degrees.                                          |
| End Azimuth               | End azimuth position of the spacecraft measured clockwise from North in degrees.                                               |
| Start Elevation           | Starting elevation position of the spacecraft measured from the horizon up in degrees.                                         |
| End Elevation             | Starting elevation position of the spacecraft measured from the horizon up in degrees.                                         |

The RX and TX start/end times may differ depending on the individual station masks. Billing meters are engaged between the Reservation Start Time and Reservation End Time.

## Creating a contact

In order to create a contact, you must have the following pre-requisites:

* Authorized spacecraft object
* Contact profile with links in accordance with the spacecraft object above

Contacts are created on a per pass and per ground station basis. If you already know the pass timings for your spacecraft and selected ground station, then you can directly proceed to schedule the pass with these times. The service will succeed in creating the contact object if the window is available and fail if it isn't. 

If you don't know the pass timings, or which sites are available, then you can use the portal or API to get those details. Query the available passes and use the results to schedule your passes accordingly.

| Method | List available contacts | Schedule contacts | Notes |
|-|-|-|-|
|Portal| Yes | Yes | Custom pass timings not possible. You have to use the results of the query|
|API | Yes | Yes| Custom pass timings possible. |

See [how-to schedule a contact](schedule-contact.md) for the Portal method. The API can also be used to create a contact. See the API docs (link to API docs) for this method.

## Next steps

- [Schedule a contact](schedule-contact.md)
- [Update the Spacecraft TLE](update-tle.md)