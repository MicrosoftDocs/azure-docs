---
title: Migrate from Azure Data Catalog to Microsoft Purview
description: Steps to migrate from Azure Data Catalog to Microsoft's unified data governance service--Microsoft Purview.
ms.service: data-catalog
ms.topic: how-to 
ms.date: 03/15/2023
ms.custom: template-how-to
#Customer intent: As an Azure Data Catalog user, I want to know why and how to migrate to Microsoft Purview so that I can use the best tools to manage my data.
---

# Migrate from Azure Data Catalog to Microsoft Purview

Microsoft launched a unified data governance service to help manage and govern your on-premises, multicloud, and software-as-a-service (SaaS) data. Microsoft Purview creates a map of your data landscape with automated data discovery, sensitive data classification, and end-to-end data lineage. Microsoft Purview enables data curators to manage and secure their data estate and empowers data consumers to find valuable, trustworthy data. 

The document shows you how to do the migration from Azure Data Catalog to Microsoft Purview. 

## Recommended approach

To migrate from Azure Data Catalog to Microsoft Purview, we recommend the following approach:

:heavy_check_mark: Step 1: [Assess readiness](#assess-readiness)

:heavy_check_mark: Step 2: [Prepare to migrate](#prepare-to-migrate)

:heavy_check_mark: Step 3: [Migrate to Microsoft Purview](#migrate-to-microsoft-purview)

:heavy_check_mark: Step 4: [Cutover from Azure Data Catalog to Microsoft Purview](#cutover-from-azure-data-catalog-to-microsoft-purview)

> [!NOTE]
> Azure Data Catalog and Microsoft Purview are different services, so there is no in-place upgrade experience. Intentional migration effort required.

## Assess readiness

Look at [Microsoft Purview](https://azure.microsoft.com/services/purview/) and understand key differences of Azure Data Catalog and Microsoft Purview.

||Azure Data Catalog  |Microsoft Purview |
|---------|---------|---------|
|**Pricing**    |[User based model](https://azure.microsoft.com/pricing/details/data-catalog/)      |[Pay-As-You-Go model](https://azure.microsoft.com/pricing/details/azure-purview/)       |
|**Platform**    |[Data catalog](overview.md)     |[Unified governance platform for data discoverability, classification, lineage, and governance.](../purview/overview.md)        |
|**Data sources supported** | [Data Catalog supported sources](data-catalog-dsr.md)| [Microsoft Purview supported sources](../purview/microsoft-purview-connector-overview.md))
|**Extensibility** |N/A  |[Extensible on Apache Atlas](../purview/tutorial-purview-tools.md)|
|**SDK/PowerShell support** |N/A |[Supports REST APIs](/rest/api/purview/) |

## Prepare to migrate

1. Identify data sources that you'll migrate.
    Take this opportunity to identify logical and business connections between your data sources and assets. Microsoft Purview will allow you to create a map of your data landscape that reflects how your data is used and discovered in your organization.
1. Review [Microsoft Purview best practices for deployment and architecture](../purview/deployment-best-practices.md) to develop a deployment strategy for Microsoft Purview.
1. Determine the impact that a migration will have on your business. 
    For example: how will Azure Data catalog be used until the transition is complete?
1. Create a migration plan using the [Microsoft Purview deployment checklist.](../purview/tutorial-azure-purview-checklist.md)

## Migrate to Microsoft Purview

[Create a Microsoft Purview account](../purview/create-catalog-portal.md), [create collections](../purview/create-catalog-portal.md) in your data map, set up [permissions for your users](../purview/catalog-permissions.md), and onboard your data sources.
    
We suggest you review the Microsoft Purview best practices documentation before deploying your Microsoft Purview account, so you can deploy the best environment for your data landscape.
Here's a selection of articles that may help you get started:
- [Microsoft Purview deployment checklist](../purview/tutorial-azure-purview-checklist.md)
- [Microsoft Purview security best practices](../purview/concept-best-practices-security.md)
- [Accounts architecture best practices](../purview/concept-best-practices-accounts.md)
- [Collections architectures best practices](../purview/concept-best-practices-collections.md)
- [Create a collection](../purview/quickstart-create-collection.md)
- [Import Azure sources to Microsoft Purview at scale](../purview/tutorial-data-sources-readiness.md)
- [Tutorial: Onboard an on-premises SQL Server instance](../purview/tutorial-register-scan-on-premises-sql-server.md)

## Cutover from Azure Data Catalog to Microsoft Purview

After the business has begun to use Microsoft Purview, cutover from Azure Data Catalog by deleting the Azure Data Catalog.  

## Next steps
- Learn how [Microsoft Purview's data insights](../purview/concept-insights.md) can provide you up-to-date information on your data landscape.
- Learn how [Microsoft Purview integrations with Azure security products](../purview/how-to-integrate-with-azure-security-products.md) to bring even more security to your data landscape.
- Discover how [sensitivity labels in Microsoft Purview](../purview/create-sensitivity-label.md) help detect and protect your sensitive information.
