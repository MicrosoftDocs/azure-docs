---
title: Manage resources and quotas 
titleSuffix: Azure Purview
description: Learn about the quotas and limits on resources for Azure Purview and how to request quota increases.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 11/12/2020
---

# Manage and increase quotas for resources with Azure Purview

Azure Purview is a cloud service for use by data users. You use Azure Purview to centrally manage data governance across your data estate, spanning both cloud and on-prem environments. The service enables business analysts to search for relevant data by using meaningful business terms. To raise the limits up to the maximum for your subscription, contact support.

## Azure Purview limits

|**Resource**|  **Default Limit**  |**Maximum Limit**|
|---|---|---|
|Purview accounts per tenant (all subscriptions combined)|3|Contact Support|
|vCores available for scanning, per account*|800|NA|
|Concurrent scans, per account*|25 - 50 concurrent scans at a given point. The limit is based on the type of data sources scanned|NA|
|Maximum time that a scan can run for|7 days|7 days|
|API Calls, per account|10M APIs/month for 4 Capacity Units platform size. <br>40M APIs/month for 16 Capacity Units platform size |10M APIs/ month for 4 Capacity Units platform size. <br>40M APIs/month for 16 Capacity Units platform size|
|Storage, per account|10 GB for 4 Capacity Units platform size. <br>40 GB for 16 Capacity Units platform size |10 GB for 4 Capacity Units platform size. <br> 40 GB for 16 Capacity Units platform size |
|Size of assets per account|100M physical assets |Contact Support|
|Maximum size of an unstructured asset|2 MB|2 MB|
|Maximum length of an asset name and classification name|4 KB|4 KB|
|Maximum length of asset property name and value|32 KB|32 KB|
|Maximum length of classification attribute name and value|32 KB|32 KB|

*Self-hosted integration runtime scenarios are outside the  scope for the limits defined in the above table.

## Next steps

- [Tutorial: Scan data with Azure Purview](starter-kit-tutorial-1.md)
- [Tutorial: Navigate the home page and search for an asset](starter-kit-tutorial-2.md)
- [Tutorial: Browse assets and view their lineage](starter-kit-tutorial-3.md)
