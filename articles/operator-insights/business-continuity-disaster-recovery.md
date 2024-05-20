---
title: Business Continuity and Disaster recovery (BCDR) for Azure Operator Insights
description: This article helps you understand BCDR concepts Azure Operator Insights.
author: rcdun
ms.author: rdunstan
ms.reviewer: duncanarcher
ms.service: operator-insights
ms.topic: concept-article
ms.date: 11/27/2023
---

# Business continuity and disaster recovery

Disasters can be hardware failures, natural disasters, or software failures. The process of preparing for and recovering from a disaster is called disaster recovery (DR). This article discusses recommended practices to achieve business continuity and disaster recovery (BCDR) for Azure Operator Insights.

BCDR strategies include availability zone redundancy and user-managed recovery.

## Control plane

The Azure Operator Insights control plane is resilient both to software errors and failure of an Availability Zone. The ability to create and manage Data Products isn't affected by these failure modes. 

The control plane isn't regionally redundant. During an outage in an Azure region, you can't create new Data Products in that region or access/manage existing ones. Once the region recovers from the outage, you can access and manage existing Data Products again.

## Data plane

Data Products are resilient to software or hardware failures. For example, if a software bug causes the service to crash, or a hardware failure causes the compute resources for enrichment queries to be lost, service automatically recovers. The only impact is a slight delay in newly ingested data becoming available in the Data Product's storage endpoint and in the KQL consumption URL.

### Zone redundancy

Data Products don't support zone redundancy. When an availability zone fails, the Data Product's ingestion, blob/DFS and KQL/SQL APIs are all unavailable, and dashboards don't work. Transformation of already-ingested data is paused. No previously ingested data is lost. Processing resumes when the availability zone recovers. 

What happens to data that was generated during the availability zone outage depends on the behavior of the ingestion agent:

* If the ingestion agent buffers data and resends it when the availability zone recovers, data isn't lost. Azure Operator Insights might take some time to work through its transformation backlog.
* Otherwise, data is lost.

### Disaster recovery

Azure Operator Insights has no innate region redundancy. Regional outages affect Data Products in the same way as [availability zone failures](#zone-redundancy). We have recommendations and features to support customers that want to be able to handle failure of an entire Azure region. 

#### User-managed redundancy

For maximal redundancy, you can deploy Data Products in an active-active mode. Deploy a second Data Product in a backup Azure region of your choice, and configure your ingestion agents to fork data to both Data Products simultaneously. The backup Data Product is unaffected by the failure of the primary region. During a regional outage, look at dashboards that use the backup Data Product as the data source. This architecture doubles the cost of the solution.

Alternatively, you could use an active-passive mode. Deploy a second Data Product in a backup Azure region, and configure your ingestion agents to send to the primary Data Product. During a regional outage, reconfigure your ingestion agents to send data to the backup Data Product during a region outage. This architecture gives full access to data created during the outage (starting from the time where you reconfigure the ingestion agents), but during the outage you don't have access to data ingested before that time. This architecture requires a small infrastructure charge for the second Data Product, but no additional data processing charges.