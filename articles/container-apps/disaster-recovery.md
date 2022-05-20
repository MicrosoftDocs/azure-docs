---
title: Disaster recovery guidance for Azure Container Apps
description: Learn how to plan for and recover from disaster recovery scenarios in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.author: cshoe
ms.service: container-apps
ms.topic: tutorial
ms.date: 5/10/2022
---

# Disaster recovery guidance for Azure Container Apps

Azure Container Apps uses [availability zones](../availability-zones/az-overview.md#availability-zones) where offered to provide high-availability protection for your applications and data from data center failures.

Availability zones are unique physical locations within an Azure region. Each zone is made up of one or more data centers equipped with independent power, cooling, and networking. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. You can build high availability into your application architecture by co-locating your compute, storage, networking, and data resources within a zone and replicating in other zones.

In the unlikely event of a full region outage, you have the option of using one of two strategies:

- **Manual recovery**: Manually deploy to a new region, or wait for the region to recover, and then manually redeploy all environments and apps.

- **Resilient recovery**: First, deploy your container apps in advance to multiple regions. Next, use Azure Front Door or Azure Traffic Manager to handle incoming requests, pointing traffic to your primary region. Then, should an outage occur, you can redirect traffic away from the affected region. See [Cross-region replication in Azure](/azure/availability-zones/cross-region-replication-azure) for more information.

> [!NOTE]
> Regardless of which strategy you choose, make sure your deployment configuration files are in source control so you can easily redeploy if necessary.

Additionally, the following resources can help you create your own disaster recovery plan:

- [Failure and disaster recovery for Azure applications](/azure/architecture/reliability/disaster-recovery)
- [Azure resiliency technical guidance](/azure/architecture/checklist/resiliency-per-service)
