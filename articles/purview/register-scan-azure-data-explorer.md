---
title: 'How to scan Azure Data Explorer'
description: This how to guide describes details of how to scan Azure Data Explorer. 
author: nayenama
ms.author: nayenama
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 10/9/2020
---
# Register and scan Azure Data Explorer

This article outlines how to register an Azure Data Explorer account in Azure Purview and set up a scan.

## Supported capabilities

The Azure Data Explorer data source supports full and incremental scans to capture the metadata and apply classifications on the metadata, based on system and customer classifications.

## Prerequisites

- Before registering data sources, create an Azure Purview account. For more information on creating a Purview account, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).
- You need to be a Data Source Administrator to setup and schedule scans, please see [Catalog Permissions](catalog-permissions.md) for details.

## Register an Azure Data Explorer account

To register a new Azure Data Explorer (Kusto) account in your data catalog, do the following:

1. Navigate to your Purview Data Catalog.
1. Select **Management center** on the left navigation.
1. Select **Data sources** under **Sources and scanning**.
1. Select **+ New**.
1. On **Register sources**, select **Azure Data Explorer (Kusto)**. Select **Continue**.

:::image type="content" source="media/register-scan-azure-data-explorer/register-new-data-source.png" alt-text="register new data source" border="true":::

On the **Register sources (Azure Data Explorer (Kusto))** screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog.
1. Choose how you want to point to your desired storage account:
   1. Select **From Azure subscription**, select the appropriate subscription from the **Azure subscription** drop down box and the appropriate cluster from the **Cluster** drop down box.
   1. Or, you can select **Enter manually** and enter a service endpoint (URL).
1. **Finish** to register the data source.

:::image type="content" source="media/register-scan-azure-data-explorer/register-sources.png" alt-text="register sources options" border="true":::

## Set up authentication for a scan

The supported authentication mechanism for Azure Data Explorer is **Service Principal**.

### Service principal

To use a service principal, you must first create one. To do this in the Azure portal: 

1. Browse to the [Azure portal](https://portal.azure.com).

2. Search for **"Azure Active Directory"** in the top search bar.

3. Select **App registrations**

4. Select **+ New application registration**

5. Enter a name for the **application** (the service principal name)

6. Select **"Accounts in this organizational directory only (Microsoft only -- Single Tenant)"**

7. For Redirect URI select **Web** and enter any URL you want; it doesn't have to be real or work

8. Then select **Register**.

9. Copy both the values for **display name** and the **application ID**, since you will need those values later.

10. Add your service principal to a role on the Azure Data Explorer account that you would like to scan. You do this in the Azure portal. For more information about service principals, see [Acquire a token from Azure AD for authorizing requests from a client application](../storage/common/storage-auth-aad-app.md?tabs=dotnet)

11. Once the service principal is created, add the same to the **AllDatabasesViewer** role in the **Permissions** tab on the Azure portal, as shown in the following screenshot.

    :::image type="content" source="./media/register-scan-azure-data-explorer/permissions-auth.png" alt-text="Screenshot to add service principal in permissions" border="true":::

12. Once your Service Principal is set, connect your Purview to your Azure Blob store using client ID and secret key and check your connect as shown in the following screenshot.

:::image type="content" source="./media/register-scan-azure-data-explorer/service-principal-auth.png" alt-text="Screenshot showing service principal authorization" border="true":::

## Create and run a scan

### Scope your scan

The next screen here is to scope the scan. Please select the folders you want to scan and select continue (by default all the folders will be selected)

:::image type="content" source="./media/register-scan-azure-cosmos-database/scope-scan.png" alt-text="Screenshot scope scans":::

The next screen is where you set your scan trigger, telling the system how often you would like to scan.

> [!NOTE]
> Once means no schedule, which is an indication to the system that the scan should only run once.

Here are some examples of triggers that are set up on a monthly cadence below. You can select the time it starts at and define the recurrence for a particular day of the month, and a time on that day of your choosing. You can also choose to specify an end date or not (meaning the recurrence of the scan will happen indefinitely).

You can also set up a trigger on a weekly cadence with an option to choose the day of the week.

### Set scan rule set

Select a scan rule set to be used by your scan from the list of available

:::image type="content" source="./media/register-scan-azure-cosmos-database/select-scan-rule-set.png" alt-text="Screenshot showing scan rule set":::

### Review your scan

When you click Continue, you will be presented with scan summary page, where you can view all the settings for your scan.

:::image type="content" source="./media/register-scan-azure-cosmos-database/review-save-run.png" alt-text="Screenshot showing review your scan":::

### Edit a scan

Select a scan and click **Edit** to edit the selected scan. You can only edit one scan at a time.

### Remove a scan

To remove a scan, select one or more scans from the list, then select **Remove**.

### Scan history

Select any scan in the list to get to the scan history page. This page will show you whether your scan was scheduled or manual, how many assets had classifications applied, how many total assets were discovered, the start and end time of the scan and the total duration.

### Run a scan manually

From the **Scan History page**, you can choose **Run Scan now** to launch a new scan immediately. This action will run a full scan, not an incremental scan.

### Cancel scans in progress

Select one or more scans that are in progress by selecting the checkbox for each.

Then select **Cancel Scan** to stop all the selected scans from running.

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
