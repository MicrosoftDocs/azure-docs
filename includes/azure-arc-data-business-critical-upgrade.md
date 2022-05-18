---
author: MikeRayMSFT
ms.service: azure-arc
ms.topic: include
ms.date: 01/20/2022
ms.author: mikeray
---

> [!NOTE]
> The Business Critical tier is in public preview. 

During a SQL Managed Instance Business Critical upgrade, the containers in the replica pod(s) will be upgraded and reprovisioned. When this is complete, the primary will fail over to a replica, then be upgraded. This will cause a short amount of downtime during the failover between replicas. You will need to build resiliency into your application, such as connection retry logic, to ensure minimal disruption. Read [Overview of the reliability pillar](/azure/architecture/framework/resiliency/overview) for more information on architecting resiliency.