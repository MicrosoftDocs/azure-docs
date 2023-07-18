---
title: Create watchlists - Microsoft Sentinel
description: Create watchlist in  Microsoft Sentinel for allowlists or blocklists,  to enrich event data, and help investigate threats.
author: cwatson-cat
ms.author: cwatson
ms.topic: how-to
ms.date: 02/22/2022
---

# Create watchlists in Microsoft Sentinel

Watchlists in Microsoft Sentinel allow you to correlate data from a data source you provide with the events in your Microsoft Sentinel environment. For example, you might create a watchlist with a list of high value assets, terminated employees, or service accounts in your environment.

Upload a watchlist file from a local folder or from your Azure Storage account. To create a watchlist file, you have the option to download one of the watchlist templates from Microsoft Sentinel to populate with your data. Then upload that file when you create the watchlist in Microsoft Sentinel.

Local file uploads are currently limited to files of up to 3.8 MB in size. If you have large watchlist file that's up to 500 MB in size, upload the file to your Azure Storage account. Before you create a watchlist, review the [limitations of watchlists](watchlists.md).

When you create a watchlist, the watchlist name and alias must each be between 3 and 64 characters. The first and last characters must be alphanumeric. But you can include whitespaces, hyphens, and underscores in between the first and last characters.

> [!IMPORTANT]
> The features for watchlist templates and the ability to create a watchlist from a file in Azure Storage are currently in **PREVIEW**. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> >
## Upload a watchlist from a local folder

You have two ways to upload a CSV file from your local machine to create a watchlist.

- For a watchlist file you created without a watchlist template: Select **Add new** and enter the required information.
- For a watchlist file created from a template downloaded from Microsoft Sentinel: Go to the watchlist **Templates (Preview)** tab. Select the option **Create from template**. Azure pre-populates the name, description, and watchlist alias for you.

### Upload watchlist from a file you created

If you didn't use a watchlist template to create your file,

1. In the Azure portal, go to **Microsoft Sentinel** and select the appropriate workspace.

1. Under **Configuration**, select **Watchlist**.

1. Select **+ Add new**.

   :::image type="content" source="./media/watchlists-create/sentinel-watchlist-new.png" alt-text="Screenshot of add watchlist option on watchlist page." lightbox="./media/watchlists-create/sentinel-watchlist-new.png":::

1. On the **General** page, provide the name, description, and alias for the watchlist.

   :::image type="content" source="./media/watchlists-create/sentinel-watchlist-general-country.png" alt-text="Screenshot of watchlist general tab in the watchlists wizard.":::

1. Select **Next: Source**.

1. Use the information in the following table to upload your watchlist data.

   |Field  |Description |
   |---------|---------|
   |Select a type for the dataset     |   CSV file with a header (.csv)     |
   |Number of lines before row with headings     |  Enter the number of lines before the header row that's in your data file.       |
   |Upload file   |  Either drag and drop your data file, or select **Browse for files** and select the file to upload.      |
   |SearchKey  |  Enter the name of a column in your watchlist that you expect to use as a join with other data or a frequent object of searches. For example, if your server watchlist contains country names and their respective two-letter country codes, and you expect to use the country codes often for search or joins, use the **Code** column as the SearchKey.    |
   

1. Select **Next: Review and Create**.

   :::image type="content" source="./media/watchlists-create/sentinel-watchlist-source.png" alt-text="Screenshot of the watchlist source tab." lightbox="./media/watchlists-create/sentinel-watchlist-source.png":::

1. Review the information, verify that it's correct, wait for the **Validation passed** message, and then select **Create**.

   :::image type="content" source="./media/watchlists-create/sentinel-watchlist-review.png" alt-text="Screenshot of the watchlist review page.":::

   A notification appears once the watchlist is created.

It might take several minutes for the watchlist to be created and the new data to be available in queries.

### Upload watchlist created from a template (Preview)

To create the watchlist from a template you populated,

1. From appropriate workspace in Microsoft Sentinel, select **Watchlist**.

1. Select the tab **Templates (Preview)**.

1. Select the appropriate template from the list to view details of the template in the right pane.

1. Select **Create from template**.

   :::image type="content" source="./media/watchlists-create/create-watchlist-from-template.png" alt-text="Screenshot of the option to create a watchlist from a built-in template." lightbox="./media/watchlists-create/create-watchlist-from-template.png":::

1. On the **General** tab, notice that the **Name**, **Description**, and **Watchlist Alias** fields are all read-only.

1. On the **Source** tab, select **Browse for files** and select the file you created from the template.

1. Select **Next: Review and Create** > **Create**.

1. Watch for an Azure notification to appear when the watchlist is created.

It might take several minutes for the watchlist to be created and the new data to be available in queries.

## Create a large watchlist from file in Azure Storage (preview)

If you have a large watchlist up to 500 MB in size, upload your watchlist file to your Azure Storage account. Then create a shared access signature URL for Microsoft Sentinel to retrieve the watchlist data. A shared access signature URL is an URI that contains both the resource URI and shared access signature token of a resource like a csv file in your storage account. Finally, add the watchlist to your workspace in Microsoft Sentinel.

For more information about shared access signatures, see [Azure Storage shared access signature token](../storage/common/storage-sas-overview.md#sas-token).

### Step 1: Upload a watchlist file to Azure Storage

To upload a large watchlist file to your Azure Storage account, use AzCopy or the Azure portal.

1. If you don't already have an Azure Storage account, [create a storage account](../storage/common/storage-account-create.md). The storage account can be in a different resource group or region from your workspace in Microsoft Sentinel.
1. Use either AzCopy or the Azure portal to upload your csv file with your watchlist data into the storage account.

#### Upload your file with AzCopy

Upload files and directories to Blob storage by using the AzCopy v10 command-line utility. To learn more, see [Upload files to Azure Blob storage by using AzCopy](../storage/common/storage-use-azcopy-blobs-upload.md).

1. If you don't already have a storage container, create one by running the following command.

   ```azcopy
   azcopy make 
   https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>
   ```

1. Next, run the following command to upload the file.

   ```azcopy
   azcopy copy '<local-file-path>' 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<blob-name>'
   ```

#### Upload your file in Azure portal

If you don't use AzCopy, upload your file by using the Azure portal. Go to your storage account in Azure portal to upload the csv file with your watchlist data.

1. If you don't already have an existing storage container, [create a container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container). For the level of public access to the container, we recommend the default which is that the level is set to Private (no anonymous access).
1. Upload your csv file to the storage account by [uploading a block blob](../storage/blobs/storage-quickstart-blobs-portal.md#upload-a-block-blob).

### Step 2: Create shared access signature URL

Create a shared access signature URL for Microsoft Sentinel to retrieve the watchlist data.

1. Follow the steps in [Create SAS tokens for blobs in the Azure portal](../ai-services/translator/document-translation/how-to-guides/create-sas-tokens.md?tabs=blobs#create-sas-tokens-in-the-azure-portal).
1. Set the shared access signature token expiry time to be at minimum 6 hours.
1. Copy the value for **Blob SAS URL**.

### Step 3: Add the watchlist to a workspace

1. In the Azure portal, go to **Microsoft Sentinel** and select the appropriate workspace.

1. Under **Configuration**, select **Watchlist**.

1. Select **+ Add new**.

   :::image type="content" source="./media/watchlists-create/sentinel-watchlist-new.png" alt-text="Screenshot of the add watchlist on the watchlist page." lightbox="./media/watchlists-create/sentinel-watchlist-new.png":::

1. On the **General** page, provide the name, description, and alias for the watchlist.

   :::image type="content" source="./media/watchlists-create/sentinel-watchlist-general.png" alt-text="Screenshot of the watchlist general tab with name, description, and watchlist alias fields.":::

1. Select **Next: Source**.

1. Use the information in the following table to upload your watchlist data.

   |Field  |Description |
   |---------|---------|
   |Source type     |  Azure Storage (preview)     |
   |Select a type for the dataset     |   CSV file with a header (.csv)     |
   |Number of lines before row with headings     |  Enter the number of lines before the header row that's in your data file.       |
   |Blob SAS URL (Preview)    |  Paste in the shared access URL you created.       |
   |SearchKey  |  Enter the name of a column in your watchlist that you expect to use as a join with other data or a frequent object of searches. For example, if your server watchlist contains country names and their respective two-letter country codes, and you expect to use the country codes often for search or joins, use the **Code** column as the SearchKey.    |
   
   After you enter all the information, your page will look similar to following image.

   :::image type="content" source="./media/watchlists-create/watchlist-source-azure-storage.png" alt-text="Screenshot of the watchlist source page with sample values entered." lightbox="./media/watchlists-create/watchlist-source-azure-storage.png":::

1. Select **Next: Review and Create**.

1. Review the information, verify that it's correct, wait for the **Validation passed** message.

1. Select **Create**.

It might take a while for a large watchlist to be created and the new data to be available in queries.

## View watchlist status

View the status by selecting the watchlist in your workspace.

1. In the Azure portal, go to **Microsoft Sentinel** and select the appropriate workspace.

1. Under **Configuration**, select **Watchlist**.

1. On the **My Watchlists** tab, select the watchlist.

1. On the details page, review the **Status (Preview)**.

   :::image type="content" source="./media/watchlists-create/view-status-uploading.png" alt-text="Screenshot that shows the upload status on the watchlist." lightbox="./media/watchlists-create/view-status-uploading.png":::

1. When the status is **Succeeded**, select **View in Log Analytics** to use the watchlist in a query. It might take several minutes for the watchlist to show in Log Analytics.

   :::image type="content" source="media/watchlists-create/large-watchlist-status-view-in-log.png" alt-text="Screenshot of ":::

## Download watchlist template (preview)

Download one of the watchlist templates from Microsoft Sentinel to populate with your data. Then upload that file when you create the watchlist in Microsoft Sentinel.

Each built-in watchlist template has its own set of data listed in the CSV file attached to the template. For more information, see [Built-in watchlist schemas](watchlist-schemas.md).

To download one of the watchlist templates,

1. In the Azure portal, go to **Microsoft Sentinel** and select the appropriate workspace.

1. Under **Configuration**, select **Watchlist**.

1. Select the tab **Templates (Preview)**.

1. Select a template from the list to view details of the template in the right pane.

1. Select the ellipses **...** at the end of the row.

1. Select **Download Schema**.

   :::image type="content" source="./media/watchlists-create/create-watchlist-download-schema.png" alt-text="Screenshot of templates tab with download schema selected.":::

1. Populate your local version of the file and save it locally as a CSV file.

1. Follow the steps to [upload watchlist created from a template (Preview)](#upload-watchlist-created-from-a-template-preview).

## Deleted and recreated watchlists in Log Analytics view

If you delete and recreate a watchlist, you might see both the deleted and recreated entries in Log Analytics within the five-minute SLA for data ingestion. If you see these entries together in Log Analytics for a longer period of time, submit a support ticket.

## Next steps

To learn more about Microsoft Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md)
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md)
- [Use workbooks](monitor-your-data.md) to monitor your data.
- [Manage watchlists](watchlists-manage.md)
- [Build queries and detection rules with watchlists](watchlists-queries.md)
