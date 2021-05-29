---
title: 'How to scan Azure files'
description: This how to guide describes details of how to scan Azure files. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 05/08/2021
---
# Register and scan Azure Files

## Supported capabilities

Azure Files supports full and incremental scans to capture the metadata and apply classifications on the metadata, based on system and customer classifications.

## Prerequisites

- Before registering data sources, create an Azure Purview account. For more information on creating a Purview account, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).
- You need to be a Data Source Administrator to setup and schedule scans, please see [Catalog Permissions](catalog-permissions.md) for details.

## Register an Azure Files storage account

To register a new Azure Files account in your data catalog, do the following:

1. Navigate to your Purview Data Catalog.
1. Select **Management center** on the left navigation.
1. Select **Data sources** under **Sources and scanning**.
1. Select **+ New**.
1. On **Register sources**, select **Azure Files**. Select **Continue**.

:::image type="content" source="media/register-scan-azure-files/register-new-data-source.png" alt-text="register new data source" border="true":::

On the **Register sources (Azure Files)** screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog.
2. Choose your Azure subscription to filter down Azure Storage Accounts.
3. Select an Azure Storage Account.
4. Select a collection or create a new one (Optional).
5. Select **Register** to register the data source.

:::image type="content" source="media/register-scan-azure-files/register-sources.png" alt-text="register sources options" border="true":::

## Set up authentication for a scan

To set up authentication for Azure Files Storage using an account key, do the following:

1. Select authentication method as **Account Key**.
2. Select **From Azure subscription** option.
3. Pick your Azure subscription where the Azure Files account exists.
4. Pick your storage account name from the list.
5. Click **Finish**.

[!INCLUDE [create and manage scans](includes/manage-scans.md)]

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)