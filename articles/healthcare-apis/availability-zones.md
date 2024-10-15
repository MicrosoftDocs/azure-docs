---
title: Azure Health Data Services Availability Zones
description: Overview of Availability Zones for Azure Health Data Services
services: healthcare-apis
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.custom: devx-track-python
ms.topic: conceptual
ms.date: 10/15/2024
ms.author: jasteppe
---

# Availability Zones for Azure Health Data Services

The goal of the high availability in Azure Health Data Services is to minimize impact on customer workloads from service maintenance operations and outages. Azure Health Data Services provides Availability zones (Zone Redundant Availability) for high availability and business continuity. To understand more about Availability zones, visit [What are Azure availability zones?](/azure/reliability/availability-zones-overview?tabs=azure-cli).

Zone redundant availability provides resiliency by protecting against outages within a region. This is achieved using zone-redundant storage (ZRS), which replicates your data across three availability zones in the primary region.  Each availability zone is a separate physical location with independent power, cooling, and networking.  Zone-redundant availability minimizes the risk of data loss, in case of zone failures within the primary region. For more information on the Azure Health Data Services SLAs, visit [Service Level Agreements](https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fwwlpdocumentsearch.blob.core.windows.net%2Fprodv2%2FOnlineSvcsConsolidatedSLA(WW)(English)(February2024)(CR).docx&wdOrigin=BROWSELINK).

## Region Availability

The following is a list of availability regions for Azure Health Data Services.

