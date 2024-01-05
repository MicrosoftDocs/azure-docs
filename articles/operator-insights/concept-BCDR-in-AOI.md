---
title: Business Continuity and Disaster recovery (BCDR) for Azure Operator Insights
description: This article helps you understand BCDR concepts Azure Operator Insights.
author: rathishr
ms.author: rdunstan
ms.reviewer: duncanarcher
ms.service: operator-insights
ms.topic: concept-article
ms.date: 11/27/2023
---

Disasters can be hardware failures, natural disasters, or software failures. The process of preparing for and recovering from a disaster is called disaster recovery (DR). This article discusses recommended practices to achieve business continuity and disaster recovery (BCDR) for Azure Operator Insights.

BCDR strategies include availability zone redundancy and user-managed recovery 

## Control Plane

Azure Operator Insights is powered by resource provider (RP) Microsoft.NetworkAnalytics which is resilient both to software errors and failure of an Availability Zone. The ability to create and manage Data Products is not affected by such failure modes. 

The Resource Provider is not region redundant. During a given Azure region outage, you can neither create new Data Products in that region nor access/manage existing ones. Once the Azure region recovers from the outage, you will be able to access and manage existing Data Products again.

## Data Plane

Data Products are resilient to software or hardware failures.For example, if a software bug causes the service to crash, or a hardware failure causes the loss of a VM driving enrichment queries, service will automatically recover and you will notice no impact beyond a slight delay in newly ingested data becoming available in storage endpoint and in KQL consumption URL.

### Zone redundancy

Today we do not support AOI Data Products to be deployed with zone redundancy. During failure of an AZ, the data product’s ingestion, blob/DFS and KQL/SQL APIs are all unavailable, and dashboards will not work. Transformation of already-ingested data is paused. No previously-ingested data is lost, and processing will resume when the AZ recovers. 

What happens to data that was generated during the AZ outage depends on the behavior of the ingestion layer; it may be lost, or some or all of it may have been buffered and is sent once the AZ recovers. It may take some time to work through the transformation backlog if that happens. 

### Disaster recovery

AOI has no innate region redundancy. The impact of region outage is the same as the impact of AZ failure on a data product. We have recommendations and features to support customers that want to be able to handle failure of an entire Azure region. 

#### User-managed redundancy

Firstly, for maximal redundancy, you may opt to deploy a second Data Product in a backup Azure region of their choice, and run the two Data Products in “active-active” mode by configuring the ingestion layer to fork data to both Data Products simultaneously. The backup data product is completely unaffected by the failure of the primary region, though during a region outage you will need to switch to looking at dashboards that have the backup data product as the data source. Please note this architecture will double the cost of the solution.

If you don’t want use the above method, you could do exactly the same thing as above, but in an active-passive mode by configuring the ingestion layer only to send to the primary data product, and reconfiguring it to send to the backup data product during a region outage. This will give full access to data created during the outage (starting from the point where you reconfigure the ingestion layer), but during the outage you would have no access to data ingested before that. 