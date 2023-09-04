---
title: Discover and explore data in ADF using Microsoft Purview
description: Learn how to discover, explore data in Azure Data Factory using Microsoft Purview
ms.service: data-factory
ms.topic: conceptual
author: jianleishen
ms.author: jianleishen
ms.custom: seo-lt-2019
ms.date: 07/17/2023
---

# Discover and explore data in ADF using Microsoft Purview

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this article, you will register a Microsoft Purview Account to a Data Factory. That connection allows you to discover Microsoft Purview assets and interact with them through ADF capabilities. 

You can perform the following tasks in ADF: 
- Use the search box at the top to find Microsoft Purview assets based on keywords 
- Understand the data based on metadata, lineage, annotations 
- Connect those data to your data factory with linked services or datasets 

## Prerequisites 

- [Microsoft Purview account](../purview/create-catalog-portal.md) 
- [Data Factory](./quickstart-create-data-factory-portal.md) 
- [Connect a Microsoft Purview Account into Data Factory](./connect-data-factory-to-azure-purview.md) 

## Using Microsoft Purview in Data Factory 

The use Microsoft Purview in Data Factory requires you to have access to that Microsoft Purview account. Data Factory passes-through your Microsoft Purview permission. As an example, if you have a curator permission role, you will be able to edit metadata scanned by Microsoft Purview. 

### Data discovery: search datasets 

To discover data registered and scanned by Microsoft Purview, you can use the Search bar at the top center of Data Factory portal. Make sure that you select Microsoft Purview to search for all of your organization data. 

:::image type="content" source="./media/data-factory-purview/search-dataset.png" alt-text="Screenshot for performing over datasets.":::

### Actions that you can perform over datasets with Data Factory resources 
You can directly create Linked Service, Dataset, or dataflow over the data you search by Microsoft Purview.

:::image type="content" source="./media/data-factory-purview/actions-over-purview-data.png" alt-text="Screenshot that shows how you can directly create Linked Service, Dataset, or dataflow over the data you search by Microsoft Purview.":::

##  Next steps 

[Tutorial: Push Data Factory lineage data to Microsoft Purview](turorial-push-lineage-to-purview.md)

[Connect a Microsoft Purview Account into Data Factory](connect-data-factory-to-azure-purview.md) 

[How to Search Data in Microsoft Purview Data Catalog](../purview/how-to-search-catalog.md)