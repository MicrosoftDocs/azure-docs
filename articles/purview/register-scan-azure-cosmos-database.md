---
title: 'How to scan Azure Cosmos Database (SQL API)'
description: This how to guide describes details of how to scan Azure Cosmos Database (SQL API). 
author: djpmsft
ms.author: daperlov
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 10/9/2020
---

# Register and scan Azure Cosmos Database (SQL API)

This article outlines how to register an Azure Cosmos Database (SQL API) account in Azure Purview and set up a scan.

## Supported capabilities

Azure Cosmos Database (SQL API) supports full and incremental scans to capture the metadata and schema. Scans also classify the data automatically based on system and custom classification rules.

## Prerequisites

- Before registering data sources, create an Azure Purview account. For more information on creating a Purview account, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).
- You need to be an Azure Purview Data Source Admin

## Setting up authentication for a scan

There is only one way to set up authentication for Azure Cosmos Database (SQL API):

- Account key
 
### Account key

When authentication method selected is **Account Key**, you need to get your access key and store in the key vault:

1. Navigate to your Cosmos DB account in the Azure portal 
1. Select **Settings** > **Keys** 
1. Copy your *key* and save it somewhere for the next steps
1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *key* from your storage account
1. Select **Create** to complete
1. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the key to setup your scan

## Register an Azure Cosmos Database (SQL API) account

To register a new Azure Cosmos Database (SQL API) account in your data catalog, do the following:

1. Navigate to your Purview account
1. Select **Sources** on the left navigation
1. Select **Register**
1. On **Register sources**, select **Azure Cosmos DB (SQL API)**
1. Select **Continue**

:::image type="content" source="media/register-scan-azure-cosmos-database/register-new-data-source.png" alt-text="register new data source" border="true":::

On the **Register sources (Azure Cosmos DB (SQL API))** screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog.
1. Choose how you want to point to your desired storage account:
   1. Select **From Azure subscription**, select the appropriate subscription from the **Azure subscription** drop down box and the appropriate cosmosDB account from the **Cosmos DB account name** drop down box.
   1. Or, you can select **Enter manually** and enter a service endpoint (URL).
1. **Finish** to register the data source.

:::image type="content" source="media/register-scan-azure-cosmos-database/register-sources.png" alt-text="register sources options" border="true":::


[!INCLUDE [create and manage scans](includes/manage-scans.md)]

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
