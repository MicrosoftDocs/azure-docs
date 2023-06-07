---
title: Optimizing prefixes with Peering Service
description: Learn about the prerequisites and how to optimize prefixes with Peering Service.
services: internet-peering
author: jsaraco
ms.service: internet-peering
ms.topic: conceptual
ms.date: 06/07/2023
ms.author: jsaraco
ms.custom: template-concept, engagement-fy23
---

# Optimizing prefixes with Peering Service

## Register your prefixes for Optimized Routing

For optimized routing for your Peering or Communication services infrastructure prefixes, you should register all your prefixes with your peering interconnects.

Please ensure that the prefixes registered are being announced over the direct interconnects established in that location.
If the same prefix is announced in multiple peering locations, it is sufficient to register them with just one of the peerings in order to retrieve the unique prefix keys after validation.

> [!NOTE] 
> The Connection State of your peering connections must be Active before registering any prefixes.

## Prefix Registration

For a registered prefix to be validated after creation, the following checks must pass:

* All connections in the parent peering must have an Active connection state
* All sessions in the parent peering must advertise routes for the registered prefix
* Routes must be advertised with the MAPS community string 8075:8007
* AS paths in the advertised routes cannot exceed a path length of 3, and cannot contain private ASNs

Ensure these requirements for registered prefixes are being followed before registering a prefix.

Below are the steps to register the prefix.

1. If you are an Operator Connect Partner, you would be able to see the “Register Prefix” tab on the left panel of your peering resource page. 

   :::image type="content" source="media/registered-prefixes-under-direct-peering.png" alt-text="Screenshot of registered prefixes tab under a peering enabled for Peering Service." :::

2. Register prefixes to access the activation keys.

   :::image type="content" source="media/registered-prefixes-blade.png" alt-text="Screenshot of registered prefixes blade with a list of prefixes and keys." :::

   :::image type="content" source="media/registered-prefix-example.png" alt-text="Screenshot showing a sample prefix being registered." :::

   :::image type="content" source="media/prefix-after-registration.png" alt-text="Screenshot of registered prefixes blade showing a new prefix added." :::

## Prefix Activation

In the previous steps, you registered the prefix and generated the prefix key. The prefix registration DOES NOT activate the prefix for optimized routing (and will not even accept <\/24 prefixes) and it requires prefix activation and alignment to the right partner (In this case the OC partner) and the appropriate interconnect location (to ensure cold potato routing).

For a prefix to be validated after activation, the following checks must pass:

* The prefix must be registered
* The prefix cannot be in a private range
* If you are an OC partner, the primary and backup sessions must advertise routes for the prefix
* If you are an OC partner, your routes must be advertised with the MAPS community string 8075:8007
* If you are an OC partner, AS paths in your routes cannot exceed a path length of 3, and cannot contain private ASNs

Ensure these requirements for activated prefixes are being followed before activating a prefix.

Below are the steps to activate the prefix.

1. Look for “Peering Services” resource 

  :::image type="content" source="media/peering-service-search.png" alt-text="Screenshot on searching for Peering Service on Azure portal." :::
  
  :::image type="content" source="media/peering-service-list.png" alt-text="Screenshot of a list of existing peering services." :::

2. Create a new Peering Service resource

  :::image type="content" source="media/create-peering-service.png" alt-text="Screenshot showing how to create a new peering service." :::

3. Provide details on the location, provider and primary and backup interconnect location. If backup location is set to “none”, the traffic will fail over the internet. 

    If you are an Operator Connect partner, you would be able to see yourself as the provider. 
    The prefix key should be the same as the one obtained in the "Prefix Registration" step. 

  :::image type="content" source="media/peering-service-properties.png" alt-text="Screenshot of the fields to be filled to create a peering service." :::

  :::image type="content" source="media/peering-service-deployment.png" alt-text="Screenshot showing the validation of peering service resource before deployment." :::