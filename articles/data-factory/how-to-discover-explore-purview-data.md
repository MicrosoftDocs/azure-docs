---
title: Discover and explore data in ADF using Purview
description: Learn how to discover, explore data in Azure Data Factory using Purview
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
author: linda33wj
ms.author: jingwang
ms.custom: seo-lt-2019
ms.date: 01/15/2021
---

# Discover and explore data in ADF using Purview

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this article, you will register an Azure Purview Account to a Data Factory. That connection allows you to discover Azure Purview assets and interact with them through ADF capabilities. 

You can perform the following tasks in ADF: 
- Use the search box at the top to find Purview assets based on keywords 
- Understand the data based on metadata, lineage, annotations 
- Connect those data to your data factory with linked services or datasets 

## Prerequisites 
- [Azure Purview account](../purview/create-catalog-portal.md) 
- [Data Factory](./quickstart-create-data-factory-portal.md) 
- [Connect an Azure Purview Account into Data Factory](./connect-data-factory-to-azure-purview.md) 

## Using Azure Purview in Data Factory 

The use Azure Purview in Data Factory requires you to have access to that Purview account. Data Factory passes-through your Purview permission. As an example, if you have a curator permission role, you will be able to edit metadata scanned by Azure Purview. 

### Data discovery: search datasets 

To discover data registered and scanned by Azure Purview, you can use the Search bar at the top center of Data Factory portal. Make sure that you select Azure Purview to search for all of your organization data. 

:::image type="content" source="./media/data-factory-purview/search-dataset.png" alt-text="Screenshot for performing over datasets.":::

### Actions that you can perform over datasets with Data Factory resources 
You can directly create Linked Service, Dataset, or dataflow over the data you search by Azure Purview.

:::image type="content" source="./media/data-factory-purview/actions-over-purview-data.png" alt-text="Screenshot that shows how you can directly create Linked Service, Dataset, or dataflow over the data you search by Azure Purview.":::

##  Next steps 

- [Register and scan Azure Data Factory assets in Azure Purview](../purview/register-scan-azure-synapse-analytics.md)
- [How to Search Data in Azure Purview Data Catalog](../purview/how-to-search-catalog.md)