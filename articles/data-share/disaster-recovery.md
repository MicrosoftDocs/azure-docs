---
title: Disaster recovery for Azure Data Share
description: Disaster recovery for Azure Data Share
author: joannapea
ms.author: joanpo
ms.service: data-share
ms.topic: conceptual
ms.date: 12/18/2019
---
# Disaster recovery for Azure Data Share

In this article, we'll walk through how to configure a disaster recovery environment for Azure Data Share. Azure data center outages are rare, but can last anywhere from a few minutes to hours. Data Center outages can cause disruption to environments that are relying on data being shared by the data provider. By following the steps detailed in this article, data providers can continue to share data with their data consumers in the event of a data center outage for the primary region that is hosting your data share. 

## Achieving business continuity for Azure Data Share

To be prepared for a data center outage, the data provider can have a data share environment provisioned in a secondary region. There are measures that can be taken which will ensure a smooth failover in the event that a data center outage does occur. 

Data providers can provision secondary Azure Data Share resources in an additional region. These Data Share resources can be configured to include datasets which exist in the primary data share environment. Data consumers can be added in to the data share when configuring the DR environment, or added in at a later point in time (i.e as part of manual failover steps).

If the data consumers have an active share subscription in a secondary environment provisioned for DR purposes, they can enable the snapshot schedule as part of a failover. If the data consumers do not want to subscribe to a secondary region for DR purposes, they can be invited into the secondary data share at a later point in time. 

Data consumers can either have an active share subscription that's idle for DR purposes, or data providers can add them in at a later point in time as part of manual failover procedures. 

## Related information

- [Business Continuity and Disaster Recovery](https://docs.microsoft.com/azure/best-practices-availability-paired-regions)
- [Build high availability into your BCDR strategy](https://docs.microsoft.com/azure/architecture/solution-ideas/articles/build-high-availability-into-your-bcdr-strategy)

## Next steps

To learn how to start sharing data, continue to the [share your data](share-your-data.md) tutorial.




