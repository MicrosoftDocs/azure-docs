---
title: 'How to scan Azure files'
description: This how to guide describes details of how to scan Azure files. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 10/01/2020
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
1. Choose how you want to point to your desired storage account:
   1. Select **From Azure subscription**, select the appropriate subscription from the **Azure subscription** drop down box and the appropriate storage account from the **Storage account name** drop down box.
   1. Or, you can select **Enter manually** and enter a service endpoint (URL).
1. **Finish** to register the data source.

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