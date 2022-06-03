---
title: 'Ground Station Pass ' 
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

# Status fields

Scheduled, Expired, Succeeded
