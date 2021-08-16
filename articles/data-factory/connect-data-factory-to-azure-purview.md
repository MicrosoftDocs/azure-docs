---
title: Connect a Data Factory to Azure Purview
description: Learn about how to connect a Data Factory to Azure Purview
ms.author: jingwang
author: linda33wj
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: seo-lt-2019, references_regions
ms.date: 08/10/2021
---

# Connect Data Factory to Azure Purview (Preview)

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

[Azure Purview](../purview/overview.md) is a unified data governance service that helps you manage and govern your on-premises, multi-cloud, and software-as-a-service (SaaS) data. You can connect your data factory to Azure Purview. That connection allows you to use Azure Purview for capturing lineage data, as well as to discover and explore Azure Purview assets.

## Connect Data Factory to Azure Purview

You have two options to connect data factory to Azure Purview:

- [Connect to Azure Purview account in Data Factory](#connect-to-azure-purview-account-in-data-factory)
- [Register Data Factory in Azure Purview](#register-data-factory-in-azure-purview)

### Connect to Azure Purview account in Data Factory

To establish the connection, you need to have **Owner** or **Contributor** role on your data factory.

1. In the ADF authoring UI, go to **Manage** -> **Azure Purview**, and select **Connect to a Purview account**. 

    :::image type="content" source="./media/data-factory-purview/register-purview-account.png" alt-text="Screenshot for registering a Purview account.":::

2. Choose **From Azure subscription** or **Enter manually**. **From Azure subscription**, you can select the account that you have access to.

3. Once connected, you can see the name of the Purview account in the tab **Purview account**.

When connecting data factory to Purview, ADF UI also tries to grant the data factory's managed identity **Purview Data Curator** role on your Purview account. Managed identity is used to authenticate lineage push operations from data factory to Purview. If you have **Owner** or **User Access Administrator** role on the Purview account, this operation will be done automatically. If not, you would see warning like below:

:::image type="content" source="./media/data-factory-purview/register-purview-account-warning.png" alt-text="Screenshot for warning of registering a Purview account.":::

To fix the issue, go to Azure portal -> your Purview account -> Access control (IAM), check if **Purview Data Curator** role is granted to the data factory's managed identity. If not, manually add the role assignment.

### Register Data Factory in Azure Purview

For how to register Data Factory in Azure Purview, see [How to connect Azure Data Factory and Azure Purview](../purview/how-to-link-azure-data-factory.md). 

## Report lineage data to Azure Purview

After you connect the data factory to a Purview account, when you run Copy, Data flow or Execute SSIS package activity, you can get the lineage between datasets created by data processes and have a high-level overview of whole workflow process among data sources and destination. For detailed supported capabilities, see [Supported Azure Data Factory activities](../purview/how-to-link-azure-data-factory.md#supported-azure-data-factory-activities). For an end to end walkthrough, refer to [Tutorial: Push Data Factory lineage data to Azure Purview](tutorial-push-lineage-to-purview.md).

## Discover and explore data using Purview

After you connect the data factory to a Purview account, you can use the search bar at the top center of Azure Data Factory autoring UI to search for data and perform actions. Learn more from [Discover and explore data in ADF using Purview](how-to-discover-explore-purview-data.md).

## Next steps

[Tutorial: Push Data Factory lineage data to Azure Purview](tutorial-push-lineage-to-purview.md)

[Discover and explore data in ADF using Purview](how-to-discover-explore-purview-data.md)

[Azure Purview Data Catalog lineage user guide](../purview/catalog-lineage-user-guide.md)