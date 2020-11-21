---
title: 'How to scan Azure Cosmos Database (SQL API)'
description: This how to guide describes details of how to scan Azure Cosmos Database (SQL API). 
author: nayenama
ms.author: nayenama
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 10/9/2020
---

# Register and scan Azure Cosmos Database (SQL API)

This article outlines how to register an Azure Cosmos Database (SQL API) account in Azure Purview and set up a scan.

## Supported capabilities

Azure Cosmos Database (SQL API) supports full and incremental scans to capture the metadata and apply classifications on the metadata, based on system and customer classifications.

## Prerequisites

- Before registering data sources, create an Azure Purview account. For more information on creating a Purview account, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).
- You need to be a Data Source Administrator to setup and schedule scans, please see [Catalog Permissions](catalog-permissions.md) for details.

## Register an Azure Cosmos Database (SQL API) account

To register a new Azure Cosmos Database (SQL API) account in your data catalog, do the following:

1. Navigate to your Purview Data Catalog.
1. Select **Management center** on the left navigation.
1. Select **Data sources** under **Sources and scanning**.
1. Select **+ New**.
1. On **Register sources**, select **Azure Cosmos Database (SQL API)**. Select **Continue**.

:::image type="content" source="media/register-scan-azure-cosmos-database/register-new-data-source.png" alt-text="register new data source" border="true":::

On the **Register sources (Azure Cosmos DB (SQL API))** screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog.
1. Choose how you want to point to your desired storage account:
   1. Select **From Azure subscription**, select the appropriate subscription from the **Azure subscription** drop down box and the appropriate storage account from the **Cosmos DB account name** drop down box.
   1. Or, you can select **Enter manually** and enter a service endpoint (URL).
1. **Finish** to register the data source.

:::image type="content" source="media/register-scan-azure-cosmos-database/register-sources.png" alt-text="register sources options" border="true":::

## Set up authentication for a scan

The supported Authentication mechanism for Azure Cosmos Database (SQL API) is **Account Key**

### Account key

Enter the storage account key manually as shown in screenshot below. The account key can found by locating your Cosmos DB account in the Azure portal, and selecting **Settings** > **Keys**. 

Click on **Test connection** to verify if the connection is successful. After you have entered storage account key and tested the connection, select **Continue**. 

:::image type="content" source="./media/register-scan-azure-cosmos-database/service-principal-auth.png" alt-text="Screenshot showing service principal authorization":::

[!INCLUDE [create and manage scans](includes/manage-scans.md)]

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
