---
title: Ground station contact profile - Azure Orbital GSaaS
description: Learn more about the contact profile object, including how to create, modify, and delete the profile.
author: hrshelar
ms.service: orbital
ms.topic: conceptual
ms.custom: ga
ms.date: 06/07/2022
ms.author: hrshelar

---

# Ground station contact profile

The contact profile is the object that holds the requirements of the pass, links and modems required in the pass, and endpoint details for each link. This is used with the spacecraft object at time of scheduling to view available passes and schedule passes.

This object is essentially a store of pass configurations and you can create as many contact profiles to represent different types of passes as per your satellite operations. For example, you can create a contact profile for a command and control  satellite pass or a contact profile for a downlink only pass. 

These objects are mutable and don't undergo an authorization process like the spacecraft objects do. One contact profile can be used with many spacecraft objects. The contact profile object should be part of the same subscription where the spacecraft objects are housed.

Refer to [Quickstart: Configure a contact profile](contact-profile.md) for the full list of parameters.

## Prerequisites 

- Subnet that is created in the VNET and resource group you desire. This is required for data delivery via VNET injection. 
- Event hubs to receive real-time telemetry in the resource group you desire. This is optional and depends on if you wish to consume real-time telemetry during a pass.

## Creating a contact profile 

Refer to [Quickstart: Configure a contact profile](contact-profile.md) for steps to create a contact profile. 

The same can be done through the API. 

## Modifying a contact profile

You can modify the contact profile via the Portal or through the API.

## Deleting a contact profile

You can delete the contact profile via the Portal or through the API.

## Next steps

- [Quickstart: Schedule a contact](schedule-contact.md)
- [How to: Update the Spacecraft TLE](update-tle.md)

