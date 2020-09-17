---
title: "Quickstart: Scan data into the catalog"
description: This quickstart describes how to scan data into an Azure Babylon catalog instance. 
author: viseshag
ms.author: viseshag
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: tutorial
ms.date: 09/17/2020
# Customer intent: As a data steward or catalog administrator, I need to understand how to scan data into the catalog.
---

# Quickstart: Scan data into the catalog

In this quickstart, you set up a scan to scan data into the catalog of content you've generated. Scanning is a process by which the catalog connects directly to a data source on a user-specified schedule. The state of all the data that a company owns is called the data estate. The catalog reflects the data estate through scanning, lineage, the portal, and the API. Goals include examining what's inside, extracting schema, and attempting to understand semantics.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* [Create a Babylon account](create-catalog-portal.md).

* Run the [starter kit](starter-kit-1.md).

## Scan data into the catalog

When you ran the prerequisite setup script, you created two data sources that you can scan into the catalog: Azure Blob storage and Azure Data Lake Storage Gen2.

To scan the Azure Blob storage data source:

1. Select **Management Center** on your catalog's webpage, and then select **Data sources**.

   :::image type="content" source="./media/starter-kit-tutorial-1/select-management-center-data-sources.png" alt-text="Screenshot showing how to select Management Center and Data sources from your catalog.":::

1. From the **Data sources** page, select **New** to add a new data source.

   :::image type="content" source="./media/scan-data-into-the-catalog/select-new-data-source.png" alt-text="Screenshot showing how to select a new data source on the Data sources page.":::
1. Select **Azure Blob Storage** > **Continue**.

   :::image type="content" source="./media/scan-data-into-the-catalog/select-azure-blob-storage.png" alt-text="Screenshot showing Azure Blob Storage selected for a new data source.":::
1. On the **Register sources** page, enter a **Name**. Choose the **Storage account name** of the Azure Blob Storage account that you previously created with the starter kit: &lt;*YourResourceGroupName*&gt;**adcblob**. Select **Finish**.

   :::image type="content" source="./media/scan-data-into-the-catalog/register-azure-blob-storage.png" alt-text="Screenshot showing the settings for the new Azure Blob Storage data source.":::
1. Now that you've added information about the blob account to the catalog, you can set up a scan. On the **Data sources** page, select **Set up scan** in the entry for the new data source you registered.

   :::image type="content" source="./media/scan-data-into-the-catalog/select-setup-scan.png" alt-text="Screenshot showing how to select a scan setup from a data source.":::
1. On the **Set up a scan** page, enter a scan name, and then select **Account Key** from the **Authentication method** drop-down list.

   :::image type="content" source="./media/scan-data-into-the-catalog/set-up-a-scan.png" alt-text="Screenshot showing the page to set up a scan for a data source":::
1. To give the scanners permissions to scan, you need the storage account key:
   1. In the [Azure portal](https://portal.azure.com), search for and select the name of the Azure Blob storage account that you created as part of running the script.
   1. Select **Access keys** under **Settings**, and then copy the value of key1 from this page.

      :::image type="content" source="./media/scan-data-into-the-catalog/key-settings.png" alt-text="Screenshot showing the settings for key 1 on the storage account page.":::
   1. On the **Set up a scan** page, paste the key1 value to **Storage account key**, and then select **Continue**.
1. Set the scan to run once. On the **Set a scan trigger** page, select **Once**, and then select **Continue**.

   :::image type="content" source="./media/scan-data-into-the-catalog/set-a-scan-trigger.png" alt-text="Screenshot show how to set a scan trigger.to scan once.":::
1. On the **Review your scan** page, select **Save and Run** to complete setting up the scan.

To scan the Azure Data Lake Storage Gen2 data source:

1. From the **Data sources** page, select **New**.

1. From the **New data source** page, select **Azure Data Lake Storage Gen2** > **Continue**.

   :::image type="content" source="./media/scan-data-into-the-catalog/select-data-lake-storage-gen2.png" alt-text="Screenshot showing the Azure Data Lake Storage Gen2 data source selected.":::

1. On the **Register sources** page, enter a **Name**. Choose the **Storage account name** of the Azure Data Lake Storage Gen2 storage account that you previously created with the starter kit: &lt;*YourResourceGroupName*&gt;**adcadls**. Select **Finish**.

   :::image type="content" source="./media/scan-data-into-the-catalog/register-azure-data-lake-storage.png" alt-text="Screenshot showing the selections for a new Azure Data Lake Storage Gen2 data source.":::
1. On the **Data sources** page, select **Set up scan** in the entry for the new data source you registered.
1. On the **Set up a scan** page, enter a scan name, and then select **Account Key** from the **Authentication method** drop-down list.

1. Obtain the key in the same way as in the earlier blob case, and then select **Continue**.
1. Set the scan to run once. On the **Set a scan trigger** page, select **Once**, and then select **Continue**.
1. On the **Review your scan** page, select **Save and Run** to complete setting up the scan.

To verify that your scans have succeeded:

1. Select **Management Center** > **Data sources**, and then select the data source.

   The following screenshot shows the data source scan that you selected. The scan can be in the **queued** status for a few seconds to a minute, and the  **in-progress** status for a few minutes, until it finishes.

   :::image type="content" source="./media/scan-data-into-the-catalog/data-source-scans.png" alt-text="Screenshot showing the scan status screen for the sample data source.":::

1. When you select the completed scan, the following window appears:

   :::image type="content" source="./media/scan-data-into-the-catalog/scan-run-history.png" alt-text="Screenshot showing a successful scan run screen.":::

## Clean up resources

If you no longer need the data sources you've registered and set up scans for in the Babylon portal, remove them with the following steps:

1. In the [**Babylon portal**](https://aka.ms/babylonportal), select **Management Center** in the left pane, and then select **Data sources**.

1. Select the data sources that you want to remove, and 
then select **Delete** from the top menu.

## Next steps

In this quickstart, you learned how to register data sources and scan data into the catalog.

Advance to the next article to learn how to navigate the home page and search for an asset.

> [!div class="nextstepaction"]
> [Tutorial: Starter Kit #1 - Home page and search](starter-kit-tutorial-2.md)
