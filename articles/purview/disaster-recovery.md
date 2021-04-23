---
title: Disaster recovery for Azure Purview
description: Disaster recovery for Azure Purview
author: sudheerreddykoppula
ms.author: sukoppul
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 04/23/2021
---
# Disaster recovery for Purview

This article explains how to configure a disaster recovery environment for Azure Purview. Azure data center outages are rare, but can last anywhere from a few minutes to hours. Data Center outages can cause disruption to environments that are relying on data being scanned. By following the steps detailed in this article, users can continue to scan data with their data sources in the event of a data center outage for the primary region of your purview account. 

## Achieving business continuity for Azure Purview

Business continuity and disaster recovery in Azure Purview instance refers to the mechanisms, policies, and procedures that enable your business to protect data loss and continue operating in the face of disruption, particularly to its scanning, catalog, and insights tiers. This document explains how to configure a disaster recovery environment for Azure Purview. 

Today, Azure Purview does not support automated BCDR. Until Purview supports automated BCDR, it relies completely on customer-managed BCDR processes. This would mean that backup and restore activities will be Purview’s customers’ responsibility to take care until automated BCDR is in place. For backup and disaster recovery purposes, customers can create their secondary Purview accounts at the time of creation of their master Purview account or later.

Below are the steps expected to be performed by Purview customers to achieve disaster recovery until automated BCDR is supported: 

1. Once the master Purview account is created in a certain region, customers must provision one or more secondary Purview accounts in separate regions from Azure portal. 

2. All activities performed on the master Purview account must be carried out on the secondary Purview accounts as well. This includes: 

    - Maintenance of Account information
    - Creation and maintenance of custom Scan rule sets, Classifications, and Classification rules
    - Registering and scanning sources
    - Creation and maintenance of Collections along with association of sources with the Collections
    - Creation and maintenance of Credentials used while scanning.
    - Curation of data assets
    - Creation and maintenance of Glossary terms. 


While customers take care of BCDR manually, below are a few points to keep in mind: 

1. Customers will be charged for master and secondary Purview accounts. 

2. The master and secondary Purview accounts cannot be configured to the same Azure Data Factory, Azure Data Share and Synapse Analytics accounts, if applicable.  As a result, the lineage from Azure Data Factory and Azure Data Share cannot be seen in the secondary Purview accounts. Also, the Synapse Analytics workspace associated with the master Purview account cannot be associated with secondary Purview accounts. This is a limitation today and will be addressed when automated BCDR is supported. 

3. The integration runtimes are specific to a Purview account. Hence, if scans must run in master and secondary Purview accounts in-parallel, multiple self-hosted integration runtimes must be maintained. This limitation will also be addressed when automated BCDR is supported. 

4. Parallel execution of scans from both master and secondary Purview accounts on the same source can affect the performance of the source. This can result in scan durations to vary across the Purview accounts.   

## Related information

- [Business Continuity and Disaster Recovery](../best-practices-availability-paired-regions.md)
- [Build high availability into your BCDR strategy](/azure/architecture/solution-ideas/articles/build-high-availability-into-your-bcdr-strategy)

## Next steps

To get started with Azure Purview, see [Create an Azure Purview account](create-catalog-portal.md).
