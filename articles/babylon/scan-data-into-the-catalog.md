---
title: "Quickstart: Scan data into the catalog"
description: This quickstart describes how to scan data into your Azure Babylon catalog instance. 
author: viseshag
ms.author: viseshag
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: tutorial
ms.date: 09/10/2020
# Customer intent: As a data steward or catalog administrator, I need to understand how to scan data into the catalog.
---

# Quickstart: Scan data into the catalog

In this quickstart, you set up a scan of content you've generated. The catalog can reflect the state of all the data that a company owns (the data estate) through mechanisms like scanning, lineage, portal, and  calling the API. Scanning is a process by which the catalog connects directly to a data source on a schedule specified by the user. Goals include examining what's inside, extracting schema, and attempting to understand semantics.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* [Create a Babylon account](create-catalog-portal.md).

* Run the [starter kit](starter-kit-1.md).

## Scan data into the catalog

The setup script created two data sources that we can scan into the catalog, Azure Blob storage and Azure Data Lake Storage Gen2. Let's first scan Blob storage.

1. Select **Management Center** on your catalog's webpage, and then select **Data sources**.

   :::image type="content" source="./media/starter-kit-tutorial-1/select-management-center-data-sources.png" alt-text="Screenshot showing how to select Management Center and Data sources from your catalog.":::

1. From the **Data sources** page, select **New** to add a new data source.

   :::image type="content" source="./media/starter-kit-tutorial-1/image23.png" alt-text="Screenshot showing how to select the New button on the Data sources page.":::
1. Select **Azure Blob Storage** > **Continue**.

   :::image type="content" source="./media/starter-kit-tutorial-1/image24.png" alt-text="Screenshot showing Blob Storage selection for a new data source.":::
1. Enter the name of the Azure Blob storage account that you specified, and then select **Finish**. The name will look like &lt;*YourResourceGroupName*&gt;**adcblob**.

   :::image type="content" source="./media/starter-kit-tutorial-1/new-azure-blob-storage.png" alt-text="Screenshot showing how to add an Azure Blob storage data source.":::
1. Now that you've added information about the blob account to the catalog, you need to set up a scan. To do so, select **setup scan** in the created entry.

   ![Scan page or data sources](./media/starter-kit-tutorial-1/image26.png)
1. Enter a scan name, and then select **Account Key** from the **Authentication method** drop-down list.

   ![Entries for connecting to a data source](./media/starter-kit-tutorial-1/image27.png)
1. To give the scanners permissions to scan, you need the storage account key:
   1. Go to the [Azure portal](https://portal.azure.com) and search for the name of the Azure Blob storage account that you created as part of running the script.
   1. Select **Access keys** (![Access Key Button](./media/starter-kit-tutorial-1/image28.png)) under **Settings**, and copy the value of key1 from this page.

   ![An example of what key 1 looks like](./media/starter-kit-tutorial-1/image29.png)
1. Select **Continue**.
1. We now need to decide how frequently the scan should run. For now, we'll start with once. For **Scan schedule**, select **Once**. Then select **Continue**.

   ![Selections for setting the scan trigger](./media/starter-kit-tutorial-1/image30.png)
1. Select **Finish** to complete setting up the scan.

The **Finish** button should have returned us to the
**Data sources** screen. We're already in the right place, so let's set up the second scan for
the Azure Data Lake Storage Gen2 account. 

1. Select **+ New**.

   ![New button for data sources](./media/starter-kit-tutorial-1/image31.png)
1. Select **Azure Data Lake Storage Gen2** > **Continue**.

   ![New data source with Azure Data Lake Storage Gen2 selected](./media/starter-kit-tutorial-1/image32.png)
1. Select a data source name and enter the name of the
previously selected Azure Data Lake Storage Gen2 account. Your Azure Data Lake Storage Gen2 account should be named {YourResourceGroupName}**adcadls**.

   ![Selections for an Azure Data Lake Storage Gen2 data source](./media/starter-kit-tutorial-1/image33.png)
1. Select **setup scan** for the newly created registered data source.
1. Under **Connect to data source**, pick a name and select the
authentication method for **Account key**. Obtain the key in the same way
as in the earlier blob case. Then select **Continue**. Again, let's select
**Once** for **Scan schedule** and then select **Continue**. And in the
review dialog box, select **Finish**.

To verify that your scans have succeeded, go to **Management Center** > **Data Sources**, and then select the data source. You should see a
screen similar to the following one. (The scan can be in **queued** status for a
few seconds to a minute, and **in-progress** status for a few minutes
until it finishes.)

![Scan status screen for the sample data source](./media/starter-kit-tutorial-1/image34.png)

When you select the scan (**keyscan** in this case), after it's
complete, you'll get a screen like the following one with
details about the scan run:

![Sample successful scan run screen](./media/starter-kit-tutorial-1/image35.png)

## Summary

In this tutorial, you created a new catalog. Then you used a client-side tool to 
create a sample environment with Azure Blob storage, Azure Data Lake Storage Gen2, 
and Azure Data Factory instances. The tool then used Azure Data Factory to move data between Blob storage and Data Lake Storage Gen2. This generated lineage will be used in later parts of the starter kit. Finally, you set up two scans.

## Next steps

Advance to the tutorial to learn how to navigate the home page and search for an asset.
> [!div class="nextstepaction"]
> [Tutorial: Starter Kit #2 - Home page and search](starter-kit-tutorial-2.md)
