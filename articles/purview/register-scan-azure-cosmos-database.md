---
title: 'How to scan Azure Cosmos Database (SQL API)'
description: This how to guide describes details of how to scan Azure Cosmos Database (SQL API). 
author: djpmsft
ms.author: daperlov
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 05/08/2021
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
1. Copy a PRIMARY or SECONDARY key from the *Read-write Keys* or *Read-only Keys* and save it somewhere for the next steps.
1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *key* from your Azure Cosmos DB Account.
1. Select **Create** to complete
1. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the key to setup your scan

## Register an Azure Cosmos Database (SQL API) account

To register a new Azure Cosmos Database (SQL API) account in your data catalog, do the following:

1. Navigate to your Purview account
1. Select **Data Map** on the left navigation.
1. Select **Register**
1. On **Register sources**, select **Azure Cosmos DB (SQL API)**
1. Select **Continue**

:::image type="content" source="media/register-scan-azure-cosmos-database/register-new-data-source.png" alt-text="register new data source" border="true":::

On the **Register sources (Azure Cosmos DB (SQL API))** screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog.
2. Choose your Azure subscription to filter down Azure Cosmos DBs.
3. Select an appropriate Cosmos DB Account name.
4. Select a collection or create a new one (Optional).
5. Select **Register** to register the data source.

:::image type="content" source="media/register-scan-azure-cosmos-database/register-sources.png" alt-text="register sources options" border="true":::


## Creating and running a scan

To create and run a new scan, do the following:

1. Select the **Data Map** tab on the left pane in the Purview Studio.

1. Select the Azure Cosmos DB data source that you registered.

1. Select **New scan**

1. Select the credential to connect to your data source. 

   :::image type="content" source="media/register-scan-azure-cosmos-database/set-up-scan-cosmos.png" alt-text="Set up scan":::

1. You can scope your scan to specific databases by choosing the appropriate items in the list.

   :::image type="content" source="media/register-scan-azure-cosmos-database/cosmos-database-scope-your-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

   :::image type="content" source="media/register-scan-azure-cosmos-database/select-scan-rule-set.png" alt-text="Scan rule set":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/register-scan-azure-cosmos-database/trigger-scan.png" alt-text="trigger":::

1. Review your scan and select **Save and run**.

[!INCLUDE [view and manage scans](includes/view-and-manage-scans.md)]

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
