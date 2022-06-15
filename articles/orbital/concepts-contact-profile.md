---
title: Contact profile - Azure Orbital
description: Learn more about the contact profile object, including how to create, modify, and delete the profile.
author: hrshelar
ms.service: orbital
ms.topic: conceptual
ms.custom: ga
ms.date: 06/07/2022
ms.author: hrshelar

---

# Contact profile

The contact profile is the object that holds the requirements of the pass, links and modems required in the pass, and endpoint details for each link. This is used with the spacecraft object at time of scheduling to view available passes and schedule passes.

This object is essentially a store of pass configurations and you can create many contact profiles to represent different types of passes as per your satellite operations. For example you can create a contact profile for a command and control  satellite pass or contact profile for a downlink only pass. 

These objects are mutable and do not undergo an authorization process like the spacecraft object. One contact profile can be used with many spacecraft objects if the links requested in the contact profile object are in accordance with the authorizations held in the spacecraft object.

## Contact profile object

The contact profile object should be part of the same subscription where the spacecraft objects are housed.

Please refer to [Quickstart: Configure a contact profile](contact-profile.md) for the full list of parameters.


## Prerequisites 

1. Subnet that is created in the VNET and resource group you desire. This is required for data delivery via VNET injection.
1. Eventhubs to receive real-time telemetry in the resource group you desire. This is optional and depends on if you wish to consume real-time telemetry during a pass.
1. List of endpoints that you've allocated for each link. Please see (link to concept data delivery)

## Creating a contact profile 

Please refer to [Quickstart: Configure a contact profile](contact-profile.md) for steps to create a contact profile. 

The same can be done through the API. Please refer to link to API here-

## Modifying a contact profile

You can modify the contact profile via the Portal or through the API.

## Deleting a contact profile

You can delete the contact profile via the Portal or through the API.

