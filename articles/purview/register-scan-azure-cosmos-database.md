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

:::image type="content" source="media/register-scan-azure-blob-storage-source/register-new-data-source.png" alt-text="register new data source" border="true":::

On the **Register sources (Azure Cosmos DB (SQL API))** screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog.
1. Choose how you want to point to your desired storage account:
   1. Select **From Azure subscription**, select the appropriate subscription from the **Azure subscription** drop down box and the appropriate storage account from the **Cosmos DB account name** drop down box.
   1. Or, you can select **Enter manually** and enter a service endpoint (URL).
1. **Finish** to register the data source.

:::image type="content" source="media/register-scan-azure-blob-storage-source/register-sources.png" alt-text="register sources options" border="true":::

## Set up authentication for a scan

The supported Authentication mechanism for Azure Cosmos Database (SQL API) is **Account Key**

### Account key
Enter the storage account key manually as shown in screenshot below. The account key can be found at Settings--> Keys on Cosmos DB account on Azure portal. Click on "Test connection" to verify if the connection is successful.


:::image type="content" source="./media/register-scan-azure-cosmos-database/service-principal-auth.png" alt-text="Screenshot showing service principal authorization":::

## Create and run a scan
After you have entered storage account key , select Continue. 

**Scope your scan**
The next screen here is to scope the scan. Please select the folders you want to scan and select continue (by default all the folders will be selected)

:::image type="content" source="./media/register-scan-azure-cosmos-database/scope-scan.png" alt-text="Screenshot scope scans":::

The next screen is where you set your scan trigger, telling the system how often you would like to scan.

> [!NOTE] 
> Once means no schedule, which is an indication to the system that the scan should only run once.

Here are some examples of triggers that are set up on a monthly cadence below. You can select the time it starts at and define the recurrence for a particular day of the month, and a time on that day of your choosing. You can also choose to specify an end date or not (meaning the recurrence of the scan will happen indefinitely).

You can also set up a trigger on a weekly cadence with an option to choose the day of the week.

**Set scan rule set**
Select a scan rule set to be used by your scan from the list of available

:::image type="content" source="./media/register-scan-azure-cosmos-database/select-scan-rule-set.png" alt-text="Screenshot showing scan rule set":::

**Review your scan**
When you click Continue, you will be presented with scan summary page, where you can view all the settings for your scan.

:::image type="content" source="./media/register-scan-azure-cosmos-database/review-save-run.png" alt-text="Screenshot showing review your scan":::

**Edit a scan**
Select a scan and click Edit to edit the selected scan. You can only edit one scan at a time.

**Remove a scan**
To remove a scan, select one or more scans from the list, then select **Remove**.

**Scan history**
Select any scan in the list to get to the scan history page. This page will show you whether your scan was schedule or manual, how many assets had classifications applied, how many total assets were discovered, the start and end time of the scan and the total duration.

**Run a scan manually**
From the **Scan History page**, you can choose **Run Scan now** to launch a new scan immediately. This action will run a full scan, not an incremental scan.

**Cancel scans in progress**
Select one or more scans that are in progress by selecting the checkbox for each.

Then select **Cancel Scan** to stop all the selected scans from running.

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
