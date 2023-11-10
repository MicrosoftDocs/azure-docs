---
title: How to add and manage data in your Azure AI project
titleSuffix: Azure AI Studio
description: Learn how to add and manage data in your Azure AI project
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# How to add and manage data in your Azure AI project

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

This article shows how to create and manage data in Azure AI Studio. Data can be used as a source for indexing in Azure AI Studio.

And data can help when you need these capabilities:

> [!div class="checklist"]
> - **Versioning:** Data versioning is supported.
> - **Reproducibility:** Once you create a data version, it is *immutable*. It cannot be modified or deleted. Therefore, jobs or prompt flow pipelines that consume the data can be reproduced.
> - **Auditability:** Because the data version is immutable, you can track the asset versions, who updated a version, and when the version updates occurred.
> - **Lineage:** For any given data, you can view which jobs or prompt flow pipelines consume the data.
> - **Ease-of-use:** An Azure AI Studio data resembles web browser bookmarks (favorites). Instead of remembering long storage paths that *reference* your frequently-used data on Azure Storage, you can create a data *version* and then access that version of the asset with a friendly name.


## Prerequisites

To create and work with data, you need:

* An Azure subscription. If you don't have one, create a free account before you begin.

* An Azure AI Studio project.

## Create data

When you create your data, you need to set the data type. AI Studio supports three data types:

|Type  |**Canonical Scenarios**|
|---------|---------|
|**`file`**<br>Reference a single file | Read a single file on Azure Storage (the file can have any format). |
|**`folder`**<br> Reference a folder |      Read a folder of parquet/CSV files into Pandas/Spark.<br><br>Read unstructured data (images, text, audio, etc.) located in a folder. |

The supported source paths are shown in Azure AI Studio. You can create a data from a folder or file:

- If you select folder type, you can choose the folder URL format. The supported folder URL formats are shown in Azure AI Studio. You can create a data using:
    :::image type="content" source="../media/data-add/studio-url-folder.png" alt-text="Screenshot of folder URL format.":::

- If you select file type, you can choose the file URL format. The supported file URL formats are shown in Azure AI Studio. You can create a data using:
    :::image type="content" source="../media/data-add/studio-url-file.png" alt-text="Screenshot of file URL format.":::


### Create data: File type

A data that is a File (`uri_file`) type points to a *single file* on storage (for example, a CSV file). You can create a file typed data using:

These steps explain how to create a File typed data in the Azure AI studio:

1. Navigate to [Azure AI studio](https://ai.azure.com/)

1. From the collapsible menu on the left, select **Data** under **Components**. Select **Add Data**.
:::image type="content" source="../media/data-add/add-data.png" alt-text="Screenshot highlights Add Data in the Data tab.":::

1. Choose your **Data source**. You have three options of choosing data source. (a) You can select data from **Existing Connections**. (b) You can **Get data with Storage URL** if you have a direct URL to a storage account or a public accessible HTTPS server. (c) You can choose **Upload files/folders** to upload a folder from your local drive.
    
    :::image type="content" source="../media/data-add/select-connection.png" alt-text="This screenshot shows the existing connections.":::
    
    1. **Existing Connections**: You can select an existing connection and browse into this connection and choose a file you need. If the existing connections don't work for you, you can select the right button to **Add connection**. 
    :::image type="content" source="../media/data-add/choose-file.png" alt-text="This screenshot shows the step to choose a file from existing connection.":::

    1. **Get data with Storage URL**: You can choose the **Type** as "File", and provide a URL based on the supported URL formats listed in the page.
    :::image type="content" source="../media/data-add/file-url.png" alt-text="This screenshot shows the step to provide a URL pointing to a file.":::

    1. **Upload files/folders**: You can select **Upload files or folder**, and select **Upload files**, and choose the local file to upload. The file is uploaded into the default "workspaceblobstore" connection.
    :::image type="content" source="../media/data-add/upload.png" alt-text="This screenshot shows the step to upload files/folders.":::

1. Select **Next** after choosing the data source.

1. Enter a custom name for your data, and then select **Create**.

    :::image type="content" source="../media/data-connections/data-add-finish.png" alt-text="Screenshot of naming the data." lightbox="../media/data-connections/data-add-finish.png":::



### Create data: Folder type

A data that is a Folder (`uri_folder`) type is one that points to a *folder* on storage (for example, a folder containing several subfolders of images). You can create a folder typed data using:

Use these steps to create a Folder typed data in the Azure AI studio:

1. Navigate to [Azure AI studio](https://ai.azure.com/)

1. From the collapsible menu on the left, select **Data** under **Components**. Select **Add Data**.
:::image type="content" source="../media/data-add/add-data.png" alt-text="Screenshot highlights Add Data in the Data tab.":::

1. Choose your **Data source**. You have three options of choosing data source. (a) You can select data from **Existing Connections**. (b) You can **Get data with Storage URL** if you have a direct URL to a storage account or a public accessible HTTPS server. (c) You can choose **Upload files/folders** to upload a folder from your local drive.
:::image type="content" source="../media/data-add/select-connection.png" alt-text="This screenshot shows the existing connections.":::

    1. **Existing Connections**: You can select an existing connection and browse into this connection and choose a file you need. If the existing connections don't work for you, you can select the right button to **Add connection**. 
:::image type="content" source="../media/data-add/choose-folder.png" alt-text="This screenshot shows the step to choose a folder from existing connection.":::

    1. **Get data with Storage URL**: You can choose the **Type** as "Folder", and provide a URL based on the supported URL formats listed in the page.
:::image type="content" source="../media/data-add/folder-url.png" alt-text="This screenshot shows the step to provide a URL pointing to a folder.":::

    1. **Upload files/folders**: You can select **Upload files or folder**, and select **Upload files**, and choose the local file to upload. The file is uploaded into the default "workspaceblobstore" connection.
:::image type="content" source="../media/data-add/upload.png" alt-text="This screenshot shows the step to upload files/folders.":::

1. Select **Next** after choosing the data source.

1. Enter a custom name for your data, and then select **Create**.

    :::image type="content" source="../media/data-connections/data-add-finish.png" alt-text="Screenshot of naming the data." lightbox="../media/data-connections/data-add-finish.png":::


## Manage data

### Delete data

> [!IMPORTANT]
> ***By design*, data deletion is not supported.**
>
> If Azure AI allowed data deletion, it would have the following adverse effects:
>
> - **Production jobs** that consume data that were later deleted would fail.
> - It would become more difficult to **reproduce** an ML experiment.
> - Job **lineage** would break, because it would become impossible to view the deleted data version.
> - You would not be able to **track and audit** correctly, since versions could be missing.
>
> Therefore, the *immutability* of data provides a level of protection when working in a team creating production workloads.

### Data tagging

Data support tagging, which is extra metadata applied to the data in the form of a key-value pair. Data tagging provides many benefits:

- Data quality description. For example, if your organization uses a *medallion lakehouse architecture* you can tag assets with `medallion:bronze` (raw), `medallion:silver` (validated) and `medallion:gold` (enriched).
- Provides efficient searching and filtering of data, to help data discovery.
- Helps identify sensitive personal data, to properly manage and govern data access. For example, `sensitivity:PII`/`sensitivity:nonPII`.
- Identify whether data is approved from a responsible AI (RAI) audit. For example, `RAI_audit:approved`/`RAI_audit:todo`.

You can add tags to existing data.

## Next steps

- Learn how to [create a project in Azure AI Studio](./create-projects.md).