---
title: Azure Peering Service (Preview) connection 
description: Learn about Microsoft Azure Peering Service connection
services: peering-service
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: Infrastructure-services
ms.date: 11/04/2019
ms.author: v-meravi
---

# Peering Service (Preview) connection

Connection is typically referred to a logical information set, identifying a *Peering Service*. It is defined by specifying the following attributes:

- Logical Name
- Connectivity partner
- Customer’s physical location
- IP prefixes

Customer can establish a single connection or multiple connections as per the requirement. A connection is also used as a unit of telemetry collection. For instance, to opt for telemetry alerts customer must define the connection that will be monitored.

> [!Note]
> When you sign up for *Peering Service*, we analyze your Windows and Office 365 telemetry in order to provide you with latency measurements for your selected prefixes. This telemetry data is always aggregated and anonymized.
>For more information about connection telemetry, refer [Peering Service connection telemetry](connection-telemetry.md).
>

> [!IMPORTANT]
> "Peering Service” is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How to register the connection?

<figure>
<img src="./media/peering-service-about/peering-service-geo-shortest.png" alt="Geo Redundancy"text-align: center>
<figcaption><i>Figure 1 - Geo Redundant connections</i></figcaption>
</figure>

**Scenario** - Let’s say the enterprise X is spread across different geographic locations as shown in the screen above. Here, customer is required to provide a logical name, Service Provider(SP) name, customer’s physical location, and IP prefixes that are (owned by the customer or allocated by the Service Provider) associated with a single connection. This process must be repeated to register *Peering Service* for separate geo-redundant connections.

> [!Note]
>For preview, State level-filtration is considered for the customer’s physical location when the connection is geo-located in the United States.
>

## Next steps

To learn step by step process on how to register the Peering Service, see [Register the Peering Service](azure-portal.md).