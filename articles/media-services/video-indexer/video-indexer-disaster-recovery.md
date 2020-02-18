---
title: Video Indexer business continuity and disaster recovery - Azure
description: Learn how to failover to a secondary Video Indexer account if a regional datacenter outage or failure occurs.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.service: media-services
ms.subservice: video-indexer
ms.workload: 
ms.topic: article
ms.custom: 
ms.date: 07/29/2019
ms.author: juliako
---
# Handle Video Indexer business continuity and disaster recovery

Azure Media Services Video Indexer does not provide instant failover of the service if there is a regional datacenter outage or failure. This article explains how to configure your environment for a failover to ensure optimal availability for applications and minimized recovery time if a disaster occurs.

We recommend that you configure business continuity disaster recovery (BCDR) across regional pairs to benefit from Azure’s isolation and availability policies. For more information, see [Azure paired regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions).

## Prerequisites 

An Azure subscription. If you don't have an Azure subscription yet, sign up for [Azure free trial](https://azure.microsoft.com/free/).

## Failover to a secondary account

In order to implement BCDR, you need to have two Video Indexer accounts to handle redundancy.

1. Create two Video Indexer accounts connected to Azure (see [create accounts](connect-to-azure.md)). One for your primary region and the other to the paired azure region. 
1. If there is a failure in your primary region, switch to indexing using the secondary account.

> [!TIP]
> You can automate BCDR by setting up activity log alerts for service health notifications as per [Create activity log alerts on service notifications](../../service-health/alerts-activity-log-service-notifications.md).

For information about using multiple tenants, see [Manage multiple tenants](manage-multiple-tenants.md). To implement BCDR, choose one of these two options: [Video Indexer account per tenant](manage-multiple-tenants.md#video-indexer-account-per-tenant) or [Azure subscription per tenant](manage-multiple-tenants.md#azure-subscription-per-tenant).

## Next steps

[Manage a Video Indexer account connected to Azure](manage-account-connected-to-azure.md).
