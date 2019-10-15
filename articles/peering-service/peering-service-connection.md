---
title: Microsoft Azure Peering Service | Microsoft Docs
description: Learn about Microsoft Azure Peering Service
services: peering-service
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2019
ms.author: v-meravi
---

# Peering Service connection

Connection is typically referred to a logical means to which data links are established. It is defined by specifying the following attributes:

- Logical Name
- MAPS Partner
- Customer’s physical location
- IP prefixes

Customer can establish a single connection or multiple connections as per the requirement. Connection is also referred as a unit of telemetry collection. For instance, to opt for telemetry alerts customer must define the connection that will be monitored. 

> [!Note]
>For preview, telemetry is collected from Office 365 and Windows usage.
>To know more information about connection telemetry please refer [Peering Service connection telemetry](peering-service-connection-telemetry.md).
>
  
## How to register a connection?

![first mile ](./media/peering-service-about/peering-service-geo-shortest.png)

**Scenario** - Let’s say the enterprise X is spread across different geographic locations as shown in the screen above. Here, customer is required to provide a logical name, the MAPS-certified Service Provider (SP) customer’s physical location, and IP prefixes that are allocated by the SP’s in order to establish a connection. Likewise, for different geographic locations, connection must be established by specifying the variables.

> [!Note]
>For preview, State level filtration is considered for the customer’s physical location when the connection is geo-located in the United States.
>

## Next steps

To learn step by step process on how to register the Peering Service see [Register the Peering Service](peering-service-azure-portal.md).