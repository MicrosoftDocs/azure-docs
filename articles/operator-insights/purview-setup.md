---
title: Use Microsoft Purview with an Azure Operator Insights Data Product
description: In this article, learn how to set up Microsoft Purview to explore an Azure Operator Insights Data Product.
author: HollyCl
ms.author: HollyCl
ms.service: operator-insights
ms.topic: how-to
ms.date: 11/02/2023
---

# Use Microsoft Purview with an Azure Operator Insights Data Product

This article outlines how to set up Microsoft Purview to explore an Azure Operator Insights Data Product.

Data governance is about managing data as a strategic asset, ensuring that there are controls in place around data, its content, structure, use, and safety. Microsoft Purview (formerly Azure Purview) is responsible for implementing data governance and allows you to monitor, organize, govern, and manage your entire data estate.

When it comes to Azure Operator Insights, Microsoft Purview provides simple overviews and catalogs of all Data Product resources. To integrate Microsoft Purview into your Data Product solution, provide your Microsoft Purview account and chosen collection when creating an Azure Operator Insights Data Product in the Azure portal.

The Microsoft Purview account and collection is populated with catalog details of your Data Product during the resource creation or resource upgrade process.

## Prerequisites

- You are in the process of creating or upgrading an Azure Operator Insights Data Product.

- If you don't have an existing Microsoft Purview account, [create a Purview account](../purview/create-microsoft-purview-portal.md) in the Azure portal.

## Access and set up your Microsoft Purview account

You can access your Purview account through the Azure portal by going to `https://web.purview.azure.com` and selecting your Microsoft Entra ID and account name. Or by going to `https://web.purview.azure.com/resource/<yourpurviewaccountname>`.

To begin to catalog a data product in this account, [create a collection](../purview/how-to-create-and-manage-collections.md) to hold the Data Product.

Provide your User-Assigned-Managed-Identity (UAMI) with necessary roles in the Microsoft Purview compliance portal. The UAMI you enter is the one that was set up when creating an AOI Data Product. For information on how to set up this UAMI, refer to [Set up user-assigned managed identity](data-product-create.md#set-up-user-assigned-managed-identity). At the desired collection, assign this UAMI to the **Collection admin**, **Data source admin**, and **Data curator** roles. Alternately, you can apply the UAMI at the root collection/account level. All collections would inherit these role assignments by default.

:::image type="content" source="media/purview-setup/data-product-role-assignments.png" alt-text="Screenshot of collections with Role assignment tab open and icon to add the UAMI to the collection admins role highlighted.":::

Assign roles to your users using effective role-based access control (RBAC). There are multiple roles that can be assigned, and assignments can be done on an account root and collection level. For more information, see how to [add roles and restrict access through collections](../purview/how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

[Using the Microsoft Purview compliance portal](../purview/use-microsoft-purview-governance-portal.md) explains how to use the user interface and navigate the service. Microsoft Purview includes options to scan in data sources, but this option isn't required for integrating Azure Operator Insights Data Products with Microsoft Purview. When you complete this procedure, all Azure services and assets are automatically populated to your Purview catalog.

## Connect Microsoft Purview to your Data Product

When creating an Azure Operator Insights Data Product, select the **Advanced** tab and enable Purview.

:::image type="content" source="media/purview-setup/data-product-purview.png" alt-text="A screenshot of the Advanced tab on Create a data product page in Azure Operator Insights.":::

Select **Select Purview Account** to provide the required values to populate a Purview collection with data product details.
- **Purview account name** - When you select your subscription, all Purview accounts in that subscription are available. Select the account you created.
- **Purview collection ID** - The five-character ID visible in the URL of the Purview collection. To find the ID, select your collection and the collection ID is the five characters following `?collection=` in the URL. In the following example, the Investment collection has the collection ID *50h55*.

:::image type="content" source="media/purview-setup/purview-collection-id.png" alt-text="A screenshot that emphasizes the collection ID in the Purview collection URL.":::

### Data Product representation in Microsoft Purview

A Data Product is made up of many Azure Services and Data Assets, which are represented as an asset inside the Microsoft Purview compliance portal of the necessary types. The following asset types are represented.

#### Data Product

An overall representation of the AOI Data Product

| **Additional fields** | **Description**                               |
|-----------------------|-----------------------------------------------|
| Description           | Brief description of the Data Product         |
| Owners                | A list of owners of this Data Product         |
| Azure Region          | The region where the Data Product is deployed |
| Docs                  | A link to documents that explain the data     |

#### AOI Data Lake

Also known as Azure Data Lake Storage (ADLS)

| **Additional fields** | **Description**                                    |
|-----------------------|----------------------------------------------------|
| DFS Endpoint Address  | Provides access to Parquet files in AOI Data Lake  |

#### AOI Database

Also known as Azure Data Explorer (ADX)

| **Additional fields** | **Description**                                          |
|-----------------------|----------------------------------------------------------|
| KQL Endpoint Address  | Provides access to AOI tables for exploration using KQL  |

#### AOI Table

ADX Tables and Materialized Views

| **Additional fields** | **Description**                              |
|-----------------------|----------------------------------------------|
| Description           | Brief description of each table and view     |
| Schema                | Contains the table columns and their details |

#### AOI Parquet details

Each ADX Table is an equivalent Parquet file type

| **Additional fields** | **Description**                                                   |
|-----------------------|-------------------------------------------------------------------|
| Path                  | Top-level path for the Parquet file type: container/dataset\_name |
| Description           | Identical to the equivalent AOI Table                             |
| Schema                | Identical to the equivalent AOI Table                             |

#### AOI Column

The columns belong to AOI Tables and the equivalent AOI Parquet details

| **Additional fields** | **Description**                       |
|-----------------------|---------------------------------------|
| Type                  | The data type of this column          |
| Description           | Brief description for this column     |
| Schema                | Identical to the equivalent AOI Table |

There are relationships between assets where necessary. For example, a Data Product can have many AOI Databases and one AOI Data Lake related to it.

## Explore your Data Product with Microsoft Purview

When the Data Product creation process is complete, you can see the catalog details of your Data Product in the collection. Select **Data map > Collections** from the left pane and select your collection.

:::image type="content" source="media/purview-setup/data-map-collections.png" alt-text="A screenshot of Data map collections in Purview.":::

> [!NOTE]
> The Microsoft Purview integration with Azure Operator Insights Data Products only features the Data catalog and Data map of the Purview portal.

Select **Assets** to view the data product catalog and to list all assets of your data product.

:::image type="content" source="media/purview-setup/data-product-assets.png" alt-text="A screenshot of Data Product assets in Purview":::

Select **Assets** to view the asset catalog of your data product. You can filter by the data source type for the asset type. For each asset, you can display properties, a list of owners (if applicable), and the related assets.

:::image type="content" source="media/purview-setup/data-product-assets-collection.png" alt-text="A screenshot of Data Product assets in Purview collection.":::

When viewing all assets, filtering by data source type is helpful.

### Asset properties and endpoints

When looking at individual assets, select the **Properties** tab to display properties and related assets for that asset.

:::image type="content" source="media/purview-setup/data-product-assets-properties.png" alt-text="A screenshot of the Properties tab for the Data Product asset in Purview collection.":::

You can use the Properties tab to find endpoints in AOI Database and AOI Tables.

### Related assets

Select the **Related** tab of an asset to display a visual representation of the existing relationships, summarized and grouped by the asset types.

:::image type="content" source="media/purview-setup/data-product-assets-related.png" alt-text="A screenshot of the Related tab for the Data Product asset in Purview collection.":::

Select an asset type (such as aoi\_database as shown in the example) to view a list of related assets.

### Exploring schemas

The AOI Table and AOI Parquet Details have schemas. Select the **Schema** tab to display the details of each column.

:::image type="content" source="media/purview-setup/data-product-assets-schema.png" alt-text="A screenshot of the Schema tab for the Data Product asset in Purview collection.":::

## Related content

[Use the Microsoft Purview compliance portal](../purview/use-microsoft-purview-governance-portal.md)
