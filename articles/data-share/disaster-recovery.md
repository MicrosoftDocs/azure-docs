---
title: Disaster recovery for Azure Data Share
description: Disaster recovery for Azure Data Share
author: sidontha
ms.author: sidontha
ms.service: azure-data-share
ms.topic: how-to
ms.date: 02/12/2025
---
# Disaster recovery for Azure Data Share

This article explains how to configure a disaster recovery environment for Azure Data Share. Azure data center outages are rare, but can last anywhere from a few minutes to hours. Data Center outages can cause disruption to environments that are relying on data being shared by the data provider. By following the steps detailed in this article, data providers can continue to share data with their data consumers if there's a data center outage for the primary region hosting your data share.

## Achieving business continuity for Azure Data Share

To be prepared for a data center outage, the data provider can have a data share environment provisioned in a secondary region. Measures can be taken to ensure a smooth failover if a data center outage does occur.

Data providers can create secondary Azure Data Share resources in another region. These Data Share resources can be configured to include shares and datasets that exist in the primary Azure Data Share resource. They can invite data consumers to the secondary shares when configuring the DR environment or at a later time (for example, as part of manual failover steps).

If the data consumers have active share subscriptions in a secondary environment provisioned for DR purposes, they can enable snapshot schedule as part of failover. If the data consumers don't want to subscribe to a secondary region for DR purposes, they can be invited into the secondary share at a later time.

Data consumers can either have an active share subscription that is idle for DR purposes, or data providers can invite them at a later time as part of manual failover procedures.

## Related content

- [Business Continuity and Disaster Recovery](../reliability/cross-region-replication-azure.md)
- [Build high availability into your BCDR strategy](/azure/architecture/solution-ideas/articles/build-high-availability-into-your-bcdr-strategy)

To learn how to start sharing data, continue to the [share your data](share-your-data.md) tutorial.
