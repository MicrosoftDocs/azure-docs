---
title: Microsoft Azure Peering Service | Microsoft Docs'
description: Learn about Microsoft Azure Peering Service
services: networking
documentationcenter: na
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2019
ms.author: v-meravi
---

# Onboarding Peering Service model

Onboarding process comprises of two models as listed below:

 - Onboarding Peering Service connection

 - Onboarding Peering Service connection telemetry

Action plans for the above listed models are described as below:

| **Step** | **Action**| **What you get**| **Costs**|
|-----------|---------|---------|---------|
|1|Customer to provision the connectivity from a certified partner (no interaction with Microsoft) ​ |An Internet provider who is well connected to Microsoft and meets the technical requirements for performant and reliable connectivity to Microsoft. ​ |Connectivity costs from the Service Provider offering​. No additional data transfer costs from Microsoft​ |
|2 (Optional)|Customer registers locations into the Azure portal​ A location is defined by: ISP/IXP Name​, Physical location of the customer site (state level), IP Prefix given to the location by the Service Provider or the enterprise​  ​|Telemetry​: Internet Routes monitoring​, traffic prioritization from Microsoft to the user’s closest edge location​. |15 per /24 prefix per month​ ​ 

# Onboarding Peering Service connection

To onboard the Peering Service connection, do the following:

- Work with Internet Service provider or Internet Exchange Partner to obtain Peering Service to connect your network with Microsoft network.

- Ensure the connectivity providers are partnered with Microsoft.

# Onboarding Peering Service connection telemetry

In addition to the Peering Service enabled service, customers can opt for its telemetry such as route analytics to monitor networking latency and performance when accessing Microsoft network. This can be achieved by registering the connection into the Azure portal.

To onboard the Peering Service connection telemetry, customer must register the service connection into the Azure portal. Refer [Azure portal](peering-service-azure-portal.md) to learn the procedure.

Following that, you can measure the telemetry by referring [here](peering-service-measure-connection-telemetry.md).

## Next steps

To learn step by step process on how to register the Peering Service, see [Register the Peering Service](peering-service-azure-portal.md).

To learn on how to measure connection telemetry, see [Measure connection telemetry](peering-service-measure-connection-telemetry.md).
