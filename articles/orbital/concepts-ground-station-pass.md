---
title: Ground Station Pass 
description: 'Ground Station Pass'
author: hrshelar
ms.service: orbital
ms.topic: tutorial
ms.custom: public-preview
ms.date: 22/05/2022
ms.author: hrshelar

---

# Ground Station Pass

A ground station pass occurs when the spacecraft is over a specified ground station. Azure Orbital lets the user find available passes on the system and schedule them for use. Ground station pass and contact are used interchangably.

When you schedule a ground station pass a contact object is created under your spacecraft object in your resource group.

# Contact Object

The contact object is a child resource of the spacecraft object that was used at time of pass scheduling. The contact that is booked on the service is only associated with this spacecraft and cannot be transferred to another spacecraft, resource group, or region.

This object contains the start time and end time of the pass as well as other parameters of interest related to pass operations. The full list is below.

| Parameter                 | Description                                                                                                                             |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| Reservation Start Time    | Start time of pass in UTC.                                                                                                              |
| Reservation End Time      | End time of pass in UTC.                                                                                                                |
| Maximum Elevation Degrees | The maximum elevation the spacecraft will be in the sky relative to horizon in degrees, usually used to gauage the quality of the pass. |
| TX Start Time             | Start time of permissible transmission window in UTC. This will be equal to or come after Reservation Start Time.                       |
| TX End Time               | End time of permissible transmission window in UTC. This will be equal to or come before Reservation End Time.                          |
| RX Start Time             | Start time of permissible reception window in UTC. This will be equal to or come after Reservation Start Time.                          |
| RX End Time               | End time of permissible reception window in UTC. This will be equal to or come before Reservation End Time.                             |
| Start Azimuth             | Starting azimuth position of the spacecraft measured clockwise from North in degrees.                                                   |
| End Azimuth               | End azimuth position of the spacecraft measured clockwise from North in degrees.                                                        |
| Start Elevation           | Starting elevation position of the spacecraft measured from the horizon up in degrees.                                                  |
| End Elevation             | Starting elevation position of the spacecraft measured from the horizon up in degrees.                                                  |

The RX and TX start/end times may differ depending on the individual station masks. Billing meters are engaged between the Reservation Start Time and Reservation End Time.

# Creating a Contact

In order to create a contact you must have the following pre-requisites:

* Authorized spacecraft object
* Contact profile with links in accordance with the spacecraft object above

Contacts are created on a per pass and per ground station basis. If you already know the pass timings for your spacecraft and selected ground station then you can directly proceed to schedule the pass with these times. The service will succeed in creating the contact object if the window is available and fail if it is not. 

If do not know the pass timings or you want to verify the availability of the sites, then you can use the portal or API below to query available passes and use the results to schedule your passes accordingly.

Please note the following:

| Method | List available contacts | Schedule contacts | Notes |
|-|-|-|-|
|Portal| Yes | Yes | Custom pass timings not possible. You have to use the results of the query|
|API | Yes | Yes| Custom pass timings possible. |

Please refer to (How to Schedule a contact)[schedule-contact.md] for the Portal method.

The API can be used as well to create a contact. Please refer to (link to API docs) for this method.

# Status fields

Scheduled, Expired, Succeeded
