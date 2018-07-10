---
title: Azure infrastructure availability
description: The article describes levels of redundancy to provide maximum availability of customers’ data.
services: security
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: TomSh

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/06/2018
ms.author: terrylan

---

# Azure infrastructure availability
Azure provides robust availability based on extensive redundancy achieved with virtualization technology. Azure provides numerous levels of redundancy to provide maximum availability of customers’ data.

## Temporary outages and natural disaster
The Microsoft Cloud Infrastructure and Operations team designs, builds, operates, and secures the cloud infrastructure. This team ensures that the Azure infrastructure is delivering high availability and reliability, high efficiency, smart scalability, and a secure, private, & trusted cloud.

Uninterruptible power supplies and vast banks of batteries ensure that electricity remains continuous if a short-term power disruption occurs.

Emergency generators provide backup power for extended outages and planned maintenance. The datacenter is operated with onsite fuel reserves if a natural disaster occurs.

High speed and robust fiber optic networks connect datacenters with other major hubs and Internet users. Compute nodes host workloads closer to the end users to reduce latency, provide geo-redundancy, and increase overall service resiliency. A team of engineers works around the clock to ensure services are persistently available to customers.

Microsoft ensures high availability through advanced monitoring and incident response, service support, and back up failover capability. Geographically distributed Microsoft operations centers operate 24/7/365. The Azure network is one of the largest in the world. The fiber optic and content distribution network connects datacenters and Edge nodes to ensure high performance and reliability.

## Disaster recovery
Azure keeps customer data durable in two locations  with the customer having the capability to choose the location of the backup site. In both locations, Azure constantly maintains multiple (3) healthy replicas of customer data.

## Database availability
Azure ensures that a database is Internet accessible through an Internet gateway with sustained database availability. Monitoring assesses the health and state of the active databases at 5-minute time intervals.

## Storage availability
Azure delivers storage through a highly scalable and durable storage service, which provides connectivity endpoints allowing it to be accessible directly by a consuming application. Through the storage service, incoming storage requests will be processed efficiently with transactional integrity.

## Next steps
To learn more about what Microsoft does to secure the Azure infrastructure, see:

- [Azure facilities, premises, and physical security](azure-physical-security.md)
- [Azure information system components and boundaries](azure-infrastructure-components.md)
- [Azure network architecture](azure-infrastructure-network.md)
- [Azure production network](azure-production-network.md)
- [Microsoft Azure SQL Database security features](azure-infrastructure-sql.md)
- [Azure production operations and management](azure-infrastructure-operations.md)
- [Monitoring of Azure infrastructure](azure-infrastructure-monitoring.md)
- [Azure infrastructure integrity](azure-infrastructure-integrity.md)
- [Protection of customer data in Azure](azure-protection-of-customer-data.md)
