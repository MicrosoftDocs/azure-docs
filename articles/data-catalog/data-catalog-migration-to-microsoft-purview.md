---
title: Migrate from Azure Data Catalog to Microsoft Purview
description: Steps to migrate from Azure Data Catalog to Microsoft's unified data governance service--Microsoft Purview.
ms.service: data-catalog
ms.topic: how-to 
ms.date: 04/24/2024
ms.custom: template-how-to
#Customer intent: As an Azure Data Catalog user, I want to know why and how to migrate to Microsoft Purview so that I can use the best tools to manage my data.
---

# Migrate from Azure Data Catalog to Microsoft Purview

Microsoft launched a unified data governance service to help manage and govern your on-premises, multicloud, and software-as-a-service (SaaS) data. Microsoft Purview creates a map of your data landscape with automated data discovery, sensitive data classification, and end-to-end data lineage. Microsoft Purview data governance solutions enable data curators to manage and secure their data estate and empowers data consumers to find valuable, trustworthy data.

The document shows you how to do the migration from Azure Data Catalog to Microsoft Purview.

## Recommended approach

To migrate from Azure Data Catalog to Microsoft Purview, we recommend the following approach:

:heavy_check_mark: Step 1: [Assess readiness.](#assess-readiness)

:heavy_check_mark: Step 2: [Prepare to migrate.](#prepare-to-migrate)

:heavy_check_mark: Step 3: [Migrate to Microsoft Purview.](#migrate-to-microsoft-purview)

:heavy_check_mark: Step 4: [Cutover from Azure Data Catalog to Microsoft Purview.](#cutover-from-azure-data-catalog-to-microsoft-purview)

> [!NOTE]
> Azure Data Catalog and Microsoft Purview are different services, so there is no in-place upgrade experience. Intentional migration effort required.

## Assess readiness

Look at [Microsoft Purview](/purview/purview) and understand key differences of Azure Data Catalog and Microsoft Purview.

[Microsoft Purview's Data Catalog](/purview/what-is-data-catalog) is the next iteration of the current Azure Data Catalog experience.

||Azure Data Catalog  |Microsoft Purview |
|---------|---------|---------|
|**Pricing**    |[User based model](https://azure.microsoft.com/pricing/details/data-catalog/)      |[Pay-as-you-go model](https://azure.microsoft.com/pricing/details/azure-purview/)       |
|**Platform**    |[Data catalog](overview.md)     |[Unified governance platform for data discoverability, classification, lineage, and governance.](/purview/purview)        |
|**Data sources supported** | [Data Catalog supported sources](data-catalog-dsr.md)| [Microsoft Purview supported sources](/purview/microsoft-purview-connector-overview)|
|**Extensibility** |N/A  |[Extensible on Apache Atlas](/purview/tutorial-atlas-2-2-apis)|
|**SDK/PowerShell support** |N/A |[Supports REST APIs](/rest/api/purview/) |

## Prepare to migrate

If your organization has never used Microsoft Purview before, follow the [new Microsoft Purview customer guide.](#new-microsoft-purview-customer-guide)
If your organization already has Microsoft Purview accounts, follow the [existing Microsoft Purview customer guide.](#existing-microsoft-purview-customer-guide)

### New Microsoft Purview customer guide

1. Review the article for the [Free version of Microsoft Purview governance solutions](/purview/free-version-get-started) to get started with the Microsoft Purview trial. You can try some of the new features in the free version with [Azure data sources you already have access to](/purview/live-view).
1. Review the [Microsoft Purview governance solutions](/purview/governance-solutions-overview) for information about all the solutions available when you [upgrade to the enterprise version of Microsoft Purview governance solutions](/purview/upgrade).
1. Determine the impact that a migration will have on your business.
    For example: how will Azure Data catalog be used until the transition is complete?
1. Create a migration plan using the [data governance quick start](/purview/data-catalog-get-started) and the [Microsoft Purview data governance tutorial](/purview/section2-scan-your-assets).

### Existing Microsoft Purview customer guide

1. Identify data sources that you'll migrate.
    Take this opportunity to identify logical and business connections between your data sources and assets. Microsoft Purview will allow you to create a map of your data landscape that reflects how your data is used and discovered in your organization.
1. Review [Microsoft Purview best practices for data catalog](/purview/data-catalog-best-practices) to develop a deployment strategy for your Microsoft Purview Data Catalog.
1. Determine the impact that a migration will have on your business.
    For example: how will Azure Data catalog be used until the transition is complete?

## Migrate to Microsoft Purview

We suggest you review the Microsoft Purview best practices documentation before deploying Microsoft Purview, so you can deploy the best environment for your data landscape.
Here's a selection of articles that might help you get started:

- [Use the Microsoft Purview portal](/purview/purview-portal)
- [Data governance quick start](/purview/data-catalog-get-started)
- [Microsoft Purview data governance tutorial](/purview/section2-scan-your-assets)
- [Data catalog best practices](/purview/data-catalog-best-practices)
- [Manage domains and collections](/purview/how-to-create-and-manage-domains-collections)
- [Live view](/purview/live-view)
- [Supported sources](/purview/microsoft-purview-connector-overview)
- [Import Azure sources to Microsoft Purview at scale](/purview/tutorial-data-sources-readiness)
- [Microsoft Purview data governance permissions](/purview/roles-permissions)

## Cutover from Azure Data Catalog to Microsoft Purview

After the business has begun to use Microsoft Purview, cutover from Azure Data Catalog by deleting the Azure Data Catalog.  

## Next steps

- Learn how [Microsoft Purview's data estate health insights](/purview/data-estate-health) can provide you with up-to-date information on your data landscape.
- Learn how [Microsoft Purview integrations with Azure security products](/purview/how-to-integrate-with-azure-security-products) to bring even more security to your data landscape.
- Discover how [sensitivity labels in Microsoft Purview](/purview/create-sensitivity-label) help detect and protect your sensitive information.
