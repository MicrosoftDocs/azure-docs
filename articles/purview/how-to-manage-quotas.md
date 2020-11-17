---
title: Manage resources and quotas 
titleSuffix: Azure Purview
description: Learn about the quotas and limits on resources for Azure Purview and how to request quota increases.
author: chandrakavya
ms.author: kchandra
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: overview
ms.date: 11/12/2020
---

# Manage and increase quotas for resources with Azure Purview

Azure Purview is a  cloud service for use by data users. You use Azure Purview to centrally manage data governance across your data estate, spanning both cloud and on-prem environments. This service enables business analysts to search for relevant data by using meaningful business terms. To raise the limits up to the maximum for your subscription, contact support.

## Azure Purview limits

|**Resource**|  **Default Limit**  |**Maximum Limit**|
|---|---|---|
|Purview accounts in a region, per subscription|5|Contact Support|
|Maximum vCores available for scanning, per account*|800|Contact Support|
|Concurrent scans, per account*|25 - 50 concurrent scans at a point in time. This is based on the type of data sources scanned|Contact Support|
|Maximum time that a scan can run for|7 days|7 days|
|API Calls, per account|10M APIs/ month for 4 CUs platform size. 40M APIs/month for 16 CUs platform size|10M APIs/ month for 4 CUs platform size.40M APIs/month for 16 CUs platform size|
|Storage, per account|10 GB for 4 CUs platform size. 40 GB for 16 CUs platform size |10 GB for 4 CUs platform size. 40 GB for 16 CUs platform size |
|Size of assets per account|100M physical assets |Contact Support|
|Maximum size of an asset|2 MB|2 MB|
|Maximum length of an asset name and classification name|4 KB|4 KB|
|Maximum length of asset property name and value|32 KB|32 KB|
|Maximum length of classification attribute name and value|32 KB|32 KB|

*Self-hosted integration runtime scenario is not in scope for the limits defined.

## Next steps

- [Azure Purview catalog client overview](catalog-client-overview.md)
