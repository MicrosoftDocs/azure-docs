---
author: grrlgeek
ms.service: azure-arc
ms.topic: include
ms.date: 05/27/2022
ms.author: jeschult
---

### General Purpose

During a SQL Managed Instance General Purpose upgrade, the pod will be terminated and reprovisioned at the new version. This will cause a short amount of downtime as the new pod is created. You will need to build resiliency into your application, such as connection retry logic, to ensure minimal disruption. Read [Overview of the reliability pillar](/azure/architecture/framework/resiliency/overview) for more information on architecting resiliency and [retry guidance for Azure Services](/azure/architecture/best-practices/retry-service-specific#sql-database-using-adonet).

### Business Critical

During a SQL Managed Instance Business Critical upgrade with more than one replica:

- The secondary replica pods are terminated and reprovisioned at the new version
- After the replicas are upgraded, the primary will fail over to an upgraded replica
- The previous primary pod is terminated and reprovisioned at the new version, and becomes a secondary

There is a brief moment of downtime when the failover occurs.
