---
title: Migrate from Data Catalog to Azure Purview
description: Steps to migrate from Data Catalog to Microsoft's unified data governance service-- Azure Purview.
author: ChandraKavya
ms.author: kchandra
ms.service: data-catalog
ms.topic: how-to 
ms.date: 01/24/2022
ms.custom: template-how-to
#Customer intent: As a Data Catalog user, I want to know why and how to migrate to Azure Purview so that I can use the best tools to manage my data.
---

# Migrate from Data Catalog to Azure Purview

Microsoft launched an unified data governance service that helps you to manage and govern your on-premises, multi-cloud, and software-as-a-service (SaaS) data. Azure Purview creates a holistic, up-to-date map of your data landscape with automated data discovery, sensitive data classification, and end-to-end data lineage. Azure Purview enables data curators to manage and secure their data estate and empowers data consumers to find valuable, trustworthy data. 

The document shows you how to do the migration from Azure Data Catalog to Azure Purview. 

## Recommended approach

To migrate from Azure Data Catalog to Azure Purview, we recommend the following approach:

:heavy_check_mark: Step 1: [Assess readiness](#assess-readiness)

:heavy_check_mark: Step 2: [Prepare to migrate](#prepare-to-migrate)

:heavy_check_mark: Step 3: [Migrate to Azure Purview](#migrate-to-azure-purview)

:heavy_check_mark: Step 4: [Cutover from Azure Data Catalog to Azure Purview](#cutover-from-azure-data-catalog-to-azure-purview)

> [!NOTE]
> Azure Data Catalog and Azure Purview are different services, so there is no in-place upgrade experience. Intentional migration effort required.

## Assess readiness

Look at [Azure Purview](../purview/overview.md) and understand key differences of Azure Data Catalog and Azure Purview.

|**Item** |Azure Data Catalog  |Azure Purview |
|**Pricing**    |User based model      |Pay-As-You-Go model       |
|**Platform**    |Data catalog     |Unified governance platform for data discoverability, classification, lineage, and governance.        |
|**Extensibility** |N/A  |Extensible of Apache Atlas|
|**SDK/PowerShell support** |N/A |Supports REST APIs |

## Prepare to migrate

1. Identify data sources that you'll migrate. 
1. Determine the impact that a migration will have on your business. For example, how will Azure Data catalog be used until the transition is complete. 
1. Create a migration plan.

## Migrate to Azure Purview

Manually migrate your data from Azure Data Catalog to Azure Purview. Follow the steps from Azure Purview documentation.

## Cutover from Azure Data Catalog to Azure Purview

After the business has begun to use Azure Purview, cutover from Azure Data Catalog by deleting the Azure Data Catalog.  

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->