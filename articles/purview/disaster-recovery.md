---
title: Disaster recovery for Azure Purview
description: Learn how to configure a disaster recovery environment for Azure Purview.
author: sudheerreddykoppula
ms.author: sukoppul
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 04/23/2021
---
# Disaster recovery for Purview

This article explains how to configure a disaster recovery environment for Azure Purview. Azure data center outages are rare, but can last anywhere from a few minutes to hours. Data Center outages can cause disruption to environments that are being relied on for data governance. By following the steps detailed in this article, you can continue to govern your data in the event of a data center outage for the primary region of your Purview account.

## Achieve business continuity for Azure Purview

Business continuity and disaster recovery (BCDR) in an Azure Purview instance refers to the mechanisms, policies, and procedures that enable your business to protect data loss and continue operating in the face of disruption, particularly to its scanning, catalog, and insights tiers. This page explains how to configure a disaster recovery environment for Azure Purview.

Today, Azure Purview does not support automated BCDR. Until that support is added, you are responsible to take care of backup and restore activities. You can manually create a secondary Purview account as a warm standby instance in another region.

The following steps show how you can achieve disaster recovery manually:

1. Once the primary Purview account is created in a certain region, you must provision one or more secondary Purview accounts in separate regions from Azure portal. 

2. All activities performed on the primary Purview account must be carried out on the secondary Purview accounts as well. This includes: 

    - Maintain Account information
    - Create and maintain custom Scan rule sets, Classifications, and Classification rules
    - Register and scan sources
    - Create and maintain Collections along with the association of sources with the Collections
    - Create and maintain Credentials used while scanning.
    - Curate data assets
    - Create and maintain Glossary terms


As you plan your manual BCDR plan, keep the following points in mind: 

- You will be charged for primary and secondary Purview accounts. 

- The primary and secondary Purview accounts cannot be configured to the same Azure Data Factory, Azure Data Share and Synapse Analytics accounts, if applicable.  As a result, the lineage from Azure Data Factory and Azure Data Share cannot be seen in the secondary Purview accounts. Also, the Synapse Analytics workspace associated with the primary Purview account cannot be associated with secondary Purview accounts. This is a limitation today and will be addressed when automated BCDR is supported. 

- The integration runtimes are specific to a Purview account. Hence, if scans must run in primary and secondary Purview accounts in-parallel, multiple self-hosted integration runtimes must be maintained. This limitation will also be addressed when automated BCDR is supported. 

- Parallel execution of scans from both primary and secondary Purview accounts on the same source can affect the performance of the source. This can result in scan durations to vary across the Purview accounts.   

## Related information

- [Business Continuity and Disaster Recovery](../best-practices-availability-paired-regions.md)
- [Build high availability into your BCDR strategy](/azure/architecture/solution-ideas/articles/build-high-availability-into-your-bcdr-strategy)
- [Azure status](https://status.azure.com/status)

## Next steps

To get started with Azure Purview, see [Create an Azure Purview account](create-catalog-portal.md).
