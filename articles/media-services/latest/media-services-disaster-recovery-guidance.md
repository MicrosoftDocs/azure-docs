---
title: Azure Media Services business continuity and disaster recovery 
description: Learn how to failover to a secondary Media Services account if a regional datacenter outage or failure occurs.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.service: media-services
ms.subservice:  
ms.workload: 
ms.topic: article
ms.custom: 
ms.date: 02/242020
ms.author: juliako
---
# Handle Media Services business continuity and disaster recovery

Azure Media Services does not provide instant failover of the service if there is a regional datacenter outage or failure. This article explains how to configure your environment for a failover to ensure optimal availability for applications and minimized recovery time if a disaster occurs.

We recommend that you configure business continuity disaster recovery (BCDR) across regional pairs to benefit from Azure’s isolation and availability policies. For more information, see [Azure paired regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions).

## Prerequisites

Review:

* [Azure Business Continuity Technical Guidance](https://docs.microsoft.com/azure/architecture/resiliency/) - describes a general framework to help you think about business continuity and disaster recovery
* [Disaster recovery and high availability for Azure applications](https://docs.microsoft.com/azure/architecture/reliability/disaster-recovery) - provides architecture guidance on strategies for Azure applications to achieve High Availability (HA) and Disaster Recovery (DR).

## Business continuity and disaster recovery (failover to a secondary account)

In order to implement BCDR, you need to have two Media Services accounts to handle redundancy.

1. [Create](create-account-cli-how-to.md) two Media Services accounts, one for your primary region and the other to the paired azure region. 
1. If there is a failure in your primary region, switch to encoding, streaming (live and on-demand) using the secondary account.

> [!TIP]
> You can automate BCDR by setting up activity log alerts for service health notifications as per [Create activity log alerts on service notifications](../../service-health/alerts-activity-log-service-notifications.md).

## Next steps

[Create an account](create-account-cli-how-to.md)
