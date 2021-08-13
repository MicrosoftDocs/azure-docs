---
title: 'How to scan Azure files'
description: This how to guide describes details of how to scan Azure files. 
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 06/22/2021
---
# Register and scan Azure Files

## Supported capabilities

Azure Files supports full and incremental scans to capture the metadata and classifications, based on system default and custom classification rules.

For file types such as csv, tsv, psv, ssv, the schema is extracted when the following logics are in place:

1. First row values are non-empty
2. First row values are unique
3. First row values are neither a date and nor a number

## Prerequisites

- Before registering data sources, create an Azure Purview account. For more information on creating a Purview account, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).
- You need to be a Data Source Administrator to set up and schedule scans, see [Catalog Permissions](catalog-permissions.md) for details.

## Setting up authentication for a scan

Currently there's only one way to set up authentication for Azure file storage:

- Account Key

### Account Key

When authentication method selected is **Account Key**, you need to get your access key and store in the key vault:

1. Navigate to your storage account
1. Select **Settings > Access keys**
1. Copy your *key* and save it somewhere for the next steps
1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *key* from your storage account
1. Select **Create** to complete
1. If your key vault isn't connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the key to set up your scan

## Register an Azure Files storage account

To register a new Azure Files account in your data catalog, follow these steps:

1. Navigate to your Purview Data Studio.
1. Select **Data Map** on the left navigation.
1. Select **Register**
1. On **Register sources**, select **Azure Files**
1. Select **Continue**

:::image type="content" source="media/register-scan-azure-files/register-sources.png" alt-text="register new data source" border="true":::

On the **Register sources (Azure Files)** screen, follow these steps:

1. Enter a **Name** that the data source will be listed with in the Catalog.
2. Choose your Azure subscription to filter down Azure Storage Accounts.
3. Select an Azure Storage Account.
4. Select a collection or create a new one (Optional).
5. Select **Register** to register the data source.

:::image type="content" source="media/register-scan-azure-files/azure-file-register-source.png" alt-text="register sources options" border="true":::

## Creating and running a scan

To create and run a new scan, follow these steps:

1. Select the **Data Map** tab on the left pane in the Purview Studio.

1. Select the Azure Files source that you registered.

1. Select **New scan**

1. Select the account key credential to connect to your data source. 

   :::image type="content" source="media/register-scan-azure-files/set-up-scan-azure-file.png" alt-text="Set up scan":::

1. You can scope your scan to specific databases by choosing the appropriate items in the list.

   :::image type="content" source="media/register-scan-azure-files/azure-file-scope-your-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

   :::image type="content" source="media/register-scan-azure-files/azure-file-scan-rule-set.png" alt-text="Scan rule set":::

1. Choose your scan trigger. You can set up a schedule to reoccur, or run the scan once.

   :::image type="content" source="media/register-scan-azure-files/trigger-scan.png" alt-text="trigger":::

1. Review your scan and select **Save and run**.


[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
