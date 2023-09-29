---
title: Azure AI Video Indexer failover and disaster recovery
description: Learn how to fail over to a secondary Azure AI Video Indexer account if a regional datacenter failure or disaster occurs.
ms.topic: article
ms.date: 07/29/2019
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Azure AI Video Indexer failover and disaster recovery

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

Azure AI Video Indexer doesn't provide instant failover of the service if there's a regional datacenter outage or failure. This article explains how to configure your environment for a failover to ensure optimal availability for apps and minimized recovery time if a disaster occurs.

We recommend that you configure business continuity disaster recovery (BCDR) across regional pairs to benefit from Azure's isolation and availability policies. For more information, see [Azure paired regions](../availability-zones/cross-region-replication-azure.md).

## Prerequisites

An Azure subscription. If you don't have an Azure subscription yet, sign up for [Azure free trial](https://azure.microsoft.com/free/).

## Fail over to a secondary account

To implement BCDR, you need to have two Azure AI Video Indexer accounts to handle redundancy.

1. Create two Azure AI Video Indexer accounts connected to Azure (see [Create an Azure AI Video Indexer account](connect-to-azure.md)). Create one account for your primary region and the other to the paired Azure region.
1. If there's a failure in your primary region, switch to indexing using the secondary account.

> [!TIP]
> You can automate BCDR by setting up activity log alerts for service health notifications as per [Create activity log alerts on service notifications](../service-health/alerts-activity-log-service-notifications-portal.md).

For information about using multiple tenants, see [Manage multiple tenants](manage-multiple-tenants.md). To implement BCDR, choose one of these two options: [Azure AI Video Indexer account per tenant](./manage-multiple-tenants.md#azure-ai-video-indexer-account-per-tenant) or [Azure subscription per tenant](./manage-multiple-tenants.md#azure-subscription-per-tenant).

## Next steps

[Manage an Azure AI Video Indexer account connected to Azure](manage-account-connected-to-azure.md).
