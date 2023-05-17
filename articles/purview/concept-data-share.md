---
title: Azure Storage in-place data sharing with Microsoft Purview (preview)
description: This article describes Microsoft Purview Data Sharing and its features.
author: sidontha
ms.author: sidontha
ms.service: purview
ms.subservice: purview-data-share
ms.topic: conceptual
ms.date: 02/16/2023
---

# Azure Storage in-place data sharing with Microsoft Purview (preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

Traditionally, organizations have shared data with internal teams or external partners by generating data feeds, requiring investment in data copy and refresh pipelines. The result is higher cost for data storage and movement, data proliferation (that is, multiple copies of data), and delay in access to time-sensitive data.

With Microsoft Purview Data Sharing, data providers can now share data **in-place** from Azure Data Lake Storage Gen2 and Azure Storage accounts, both within and across organizations. Share data directly with users and partners without data duplication and centrally manage your sharing activities from within Microsoft Purview.

With Microsoft Purview Data Sharing, data consumers can now have near real-time access to shared data. Storage data access and transactions are charged to the data consumers based on what they use, and at no more cost to the data providers.

## How in-place data sharing works

Microsoft Purview enables sharing of files and folders in-place from ADLS Gen2 and Blob storage accounts.

:::image type="content" source="./media/concept-data-share/data-share-flow.png" alt-text="Flow chart showing a data provider with a source store sharing an invitation to a data consumer with a target store. Connecting the source store and target store is an arrow labeled in-place access that points from the target to the source.":::

A data provider creates a share by selecting a data source that is registered in Microsoft Purview, choosing which files and folders to share, and who to share them with. Microsoft Purview then sends an invitation to each data consumer.

When a consumer accepts the invitation, they specify a target storage account in their own Azure subscription that they'll use to access the shared data. This establishes a sharing relationship between the provider and consumer storage accounts. This sharing relationship provides data consumer read-only access to shared data through the consumer’s storage account. Any changes to the data in the provider’s source storage account is reflected in near real-time in the consumer’s storage account.

The data provider pays for data storage and their own data access, while the data consumer pays for their own data access transactions.  

Data providers can revoke access to the shared data at any time, or set a share expiration time for time-bound access to data. Data consumers can also terminate access to the share at any time.

## Where data is stored

Microsoft Purview Data Sharing only stores metadata about your share. It doesn't store a copy of the shared data itself. The data is stored in the underlying source storage account that is being shared. You can have your storage accounts in a different Azure region than your Microsoft Purview account.

## Key capabilities

* Share data within the organization or with partners and customers outside of the organization (within the same Azure tenant or across different Azure tenants).
* Share data from ADLS Gen2 or Blob storage in-place without data duplication.
* Share data with multiple recipients.
* Access shared data in near real time.
* Manage sharing relationships and keep track of who the data is shared with/from, for each ADLSGen2 or Blob Storage account.
* Terminate share access at any time.
* Flexible experience through Microsoft Purview governance portal or via REST APIs.

## Get started

Get started with Microsoft Purview in-place data sharing for Azure Storage by reviewing the [next steps](#next-steps) or following the [Data Sharing Quickstart](quickstart-data-share.md).

## Data sharing scenarios

Microsoft Purview Data Sharing can help with various data sharing scenarios, including:

* Collaborate with external business partners while maintaining data security in your own environment.
* Outsource data transformation and processing to third party ISVs or data aggregators by sharing raw data and receiving normalized data and analytics results back.
* Automate sharing of big data (for example: IoT data, scientific data, satellite and surveillance images or videos, financial market data) in near real time and without data duplication. 
* Share data between different departments within the organization.

## Next Steps

* [Quickstart: share data](quickstart-data-share.md)
* [FAQ for data sharing](how-to-data-share-faq.md)
* [How to share data](how-to-share-data.md)
* [How to receive a data share](how-to-receive-share.md)
