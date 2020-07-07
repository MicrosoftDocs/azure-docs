---
title: Azure Peering Service onboarding model
description: Learn about on how to onboard Azure Peering Service
services: peering-service
documentationcenter: na
author: derekolo
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: Infrastructure-services
ms.date: 05/18/2020
ms.author: derekol
---

# Onboarding Peering Service model

Onboarding process of Peering Service is comprised of two models as listed below:

 - Onboarding Peering Service connection

 - Onboarding Peering Service connection telemetry

Action plans for the above listed models are described as below:

| **Step** | **Action**| **What you get**|
|-----------|---------|---------|---------|
|1|Customer to provision the connectivity from a connectivity partner (no interaction with Microsoft).​ |An Internet provider who is well connected to Microsoft and meets the technical requirements for performant and reliable connectivity to Microsoft. ​ |
|2 (Optional)|Customer registers locations into the Azure portal.​ A location is defined by: ISP/IXP Name​, Physical location of the customer site (state level), IP Prefix given to the location by the Service Provider or the enterprise​.  ​|Telemetry​: Internet Route monitoring​, traffic prioritization from Microsoft to the user’s closest edge POP location​. |



## Onboarding Peering Service connection

To onboard Peering Service connection, do the following:

Work with Internet Service provider (ISP) or Internet Exchange (IX) Partner to obtain Peering Service to connect your network with the Microsoft network.

Ensure the [connectivity providers](location-partners.md) are partnered with Microsoft for Peering Service. 

## Onboarding Peering Service connection telemetry

Customers can opt for its telemetry such as BGP route analytics to monitor networking latency and performance when accessing the Microsoft network. This can be achieved by registering the connection into the Azure portal.

To onboard Peering Service connection telemetry, customer must register the Peering Service connection into the Azure portal. Refer to the [Register Peering Service - Azure portal](azure-portal.md) to learn the procedure.

Following that, you can measure telemetry by referring [here](measure-connection-telemetry.md).

## Next steps

To learn step by step process on how to register Peering Service connection, see [Register Peering Service - Azure portal](azure-portal.md).

To learn about measure connection telemetry, see [Measure connection telemetry](measure-connection-telemetry.md).
