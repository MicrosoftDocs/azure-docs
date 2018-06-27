---
title: Availability of Azure infrastructure
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
ms.date: 06/25/2018
ms.author: terrylan

---

# Availability of Azure infrastructure
Azure provides robust availability based on extensive redundancy achieved with virtualization technology. Azure provides numerous levels of redundancy to provide maximum availability of customers’ data.

## Temporary outages and natural disaster
The Microsoft Cloud Infrastructure and Operations team designs, builds, operates, and secures the cloud infrastructure. This team ensures that the Azure infrastructure is delivering high availability and reliability, high efficiency, smart scalability, and a secure, private, & trusted cloud.

Uninterruptible power supplies and vast banks of batteries ensure that electricity remains continuous in the event of a short term power disruption.

Emergency generators provide backup power for extended outages and planned maintenance and can operate the datacenter with onsite fuel reserves in the event of a natural disaster.

High speed and robust fiber optic networks connect datacenters with other major hubs and Internet users. Compute nodes host workloads closer to the end users to reduce latency, provide geo-redundancy and increase overall service resiliency. A team of engineers work around the clock to ensure services are persistently available to customers.

Microsoft ensures high availability through advanced monitoring and incident response, service support, and back up failover capability managed through our geographically distributed Microsoft operations centers, operating 24/7/365. Our network is one of the largest in the world with a fiber optic and content distribution network backbone connecting our datacenters and Edge nodes to ensure high performance and reliability.

## Disaster recovery
Azure keeps customer data durable in two locations  with the customer having the capability to choose the location of the backup site. In both locations, Azure constantly maintains multiple (3) healthy replicas of customer data.

## Database availability
Azure ensures that a database is Internet accessible through an Internet gateway with sustained database availability monitoring which assesses the health and state of the active database(s) at 5-minute time intervals.

## Storage availability
Azure delivers storage through a highly scalable and durable storage service, which provides connectivity endpoints allowing it to be accessible directly by a consuming application. Through the storage service, incoming storage requests will be processed efficiently with transactional integrity.

## Next steps
