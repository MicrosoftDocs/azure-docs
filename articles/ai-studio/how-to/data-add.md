---
title: How to add and manage data in your Azure AI Studio project
titleSuffix: Azure AI Studio
description: Learn how to add and manage data in your Azure AI Studio project.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: franksolomon
ms.author: ssalgado
author: ssalgadodev
---

# How to add and manage data in your Azure AI Studio project

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

This article describes how to create and manage data in Azure AI Studio. Data can be used as a source for indexing in Azure AI Studio.

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

* An [AI Studio project](../how-to/create-projects.md).

## Create data

When you create your data, you need to set the data type. AI Studio supports three data types:

|Type  |**Canonical Scenarios**|
|---------|---------|
|**`file`**<br>Reference a single file | Read a single file on Azure Storage (the file can have any format). |
|**`folder`**<br> Reference a folder |      Read a folder of parquet/CSV files into Pandas/Spark.<br><br>Read unstructured data (such as images, text, and audio) located in a folder. |

Azure AI Studio shows the supported source paths. You can create a data from a folder or file:

- If you select **folder type**, you can choose the folder URL format. Azure AI Studio shows the supported folder URL formats. You can create a data resource as shown:
    :::image type="content" source="../media/data-add/studio-url-folder.png" alt-text="Screenshot of folder URL format.":::

- If you select **file type**, you can choose the file URL format. The supported file URL formats are shown in Azure AI Studio. You can create a data resource as shown:
    :::image type="content" source="../media/data-add/studio-url-file.png" alt-text="Screenshot of file URL format.":::

### Create data: File type

A file (`uri_file`) data resource type points to a *single file* on storage (for example, a CSV file).

These steps explain how to create a File typed data in Azure AI Studio:

1. Navigate to [Azure AI Studio](https://ai.azure.com/)

1. From the collapsible menu on the left, select **Data** under **Components**. Select **New Data**.
:::image type="content" source="../media/data-add/add-data.png" alt-text="Screenshot highlights Add Data in the Data tab.":::

1. Choose your **Data source**. You have three options to choose a data source.
   - You can select data from **Existing Connections**.
   - You can select **Get data with Storage URL** if you have a direct URL to a storage account or a public accessible HTTPS server.
   - You can select **Upload files/folders** to upload a folder from your local drive.
    
    :::image type="content" source="../media/data-add/select-connection.png" alt-text="This screenshot shows the existing connections.":::
    
    - **Existing Connections**: You can select an existing connection, browse into this connection, and choose a file you need. If the existing connections don't work for you, select the **New connection** button at the upper right.
    :::image type="content" source="../media/data-add/new-connection.png" alt-text="This screenshot shows the creation of a new connection to an external asset.":::

    - **Get data with Storage URL**: You can choose the **Type** as "File", and then provide a URL based on the supported URL formats listed on that page.
    :::image type="content" source="../media/data-add/file-url.png" alt-text="This screenshot shows provision of a URL that points to a file.":::

    - **Upload files/folders**: You can select **Upload files or folder**, select **Upload files**, and choose the local file to upload. The file uploads into the default "workspaceblobstore" connection.
    :::image type="content" source="../media/data-add/upload.png" alt-text="This screenshot shows the step to upload files/folders.":::

    1. Select **Next** after you choose the data source.

    1. Enter a custom name for your data, and then select **Create**.

    :::image type="content" source="../media/data-add/data-add-finish.png" alt-text="This screenshot shows the naming step for the data source." lightbox="../media/data-connections/data-add-finish.png":::

### Create data: Folder type

A Folder (`uri_folder`) data source type points to a *folder* on a storage resource (for example, a folder containing several subfolders of images). Use these steps to create a Folder type data resource in Azure AI Studio:

1. Navigate to [Azure AI Studio](https://ai.azure.com/)

1. From the collapsible menu on the left, select **Data** under **Components**. Select **New Data**.

    :::image type="content" source="../media/data-add/add-data.png" alt-text="Screenshot highlights Add Data in the Data tab.":::

1.  Choose your **Data source**. You have three data source options:
    1. Select data from **Existing Connections**
    1. Select **Get data with Storage URL** if you have a direct URL to a storage account or a public accessible HTTPS server
    1. Select **Upload files/folders** to upload a folder from your local drive

       :::image type="content" source="../media/data-add/select-connection.png" alt-text="This screenshot shows the existing connections.":::

    - **Existing Connections**: You can select an existing connection and browse into this connection and choose a file you need. If the existing connections don't work for you, you can select the **New connection** button at the right.
    
       :::image type="content" source="../media/data-add/choose-folder.png" alt-text="This screenshot shows the step to choose a folder from an existing connection.":::

    - **Get data with Storage URL**: You can choose the **Type** as "Folder", and provide a URL based on the supported URL formats listed on that page.

       :::image type="content" source="../media/data-add/folder-url.png" alt-text="This screenshot shows the step to provide a URL that points to a folder.":::

    - **Upload files/folders**: You can select **Upload files or folder**, and select **Upload files**, and choose the local file to upload. The file resources upload into the default "workspaceblobstore" connection.

       :::image type="content" source="../media/data-add/upload.png" alt-text="This screenshot shows the step to upload files/folders.":::

1. Select **Next** after you choose the data source.

1. Enter a custom name for your data, and then select **Create**.

    :::image type="content" source="../media/data-connections/data-add-finish.png" alt-text="Screenshot of naming the data." lightbox="../media/data-connections/data-add-finish.png":::

## Manage data

### Delete data

> [!IMPORTANT]
> Data deletion is not supported. Data is immutable in AI Studio. Once you create a data version, it can't be modified or deleted. This immutability provides a level of protection when working in a team that creates production workloads.

If AI Studio allowed data deletion, it would have the following adverse effects:
- Production jobs that consume data that is later deleted would fail.
- Machine learning experiment reproduction would become more difficult.
- Job lineage would break, because it would become impossible to view the deleted data version.
- You could no longer track and audit correctly, since versions could be missing.

When a data resource is erroneously created - for example, with an incorrect name, type or path - Azure AI offers solutions to handle the situation without the negative consequences of deletion:

|Reason that you might want to delete data | Solution  |
|---------|---------|
|The **name** is incorrect     |  [Archive the data](#archive-data)       |
|The team **no longer uses** the data | [Archive the data](#archive-data) |
|It **clutters the data listing** | [Archive the data](#archive-data) |
|The **path** is incorrect     |  Create a *new version* of the data (same name) with the correct path. For more information, read [Create data](#create-data).       |
|It has an incorrect **type**  |  Currently, Azure AI doesn't allow the creation of a new version with a *different* type compared to the initial version.<br>(1) [Archive the data](#archive-data)<br>(2) [Create a new data](#create-data) under a different name with the correct type.    |

### Archive data

By default, archiving a data resource hides it from both list queries (for example, in the CLI `az ml data list`) and the data listing in Azure AI Studio. You can still continue to reference and use an archived data resource in your workflows. You can archive either:

- *all versions* of the data under a given name
- a specific data version

#### Archive all versions of a data

At this time, Azure AI Studio doesn't support archiving *all versions* of the data resource under a given name.

#### Archive a specific data version

At this time, Azure AI Studio doesn't support archiving a specific version of the data resource.

### Restore an archived data
You can restore an archived data resource. If all of versions of the data are archived, you can't restore individual versions of the data - you must restore all versions.

#### Restore all versions of a data

At this time, Azure AI Studio doesn't support restoration of *all versions* of the data under a given name.

#### Restore a specific data version

> [!IMPORTANT]
> If all data versions were archived, you cannot restore individual versions of the data - you must restore all versions.

Currently, Azure AI Studio doesn't support restoration of a specific data version.

### Data tagging

Data tagging is extra metadata applied to the data in the form of a key-value pair. Data tagging provides many benefits:

- Data quality description. For example, if your organization uses a *medallion lakehouse architecture*, you can tag assets with `medallion:bronze` (raw), `medallion:silver` (validated) and `medallion:gold` (enriched).
- Provides efficient data searching and filtering, to help data discovery.
- Helps identify sensitive personal data, to properly manage and govern data access. For example, `sensitivity:PII`/`sensitivity:nonPII`.
- Identify whether data is approved, from a responsible AI (RAI) audit. For example, `RAI_audit:approved`/`RAI_audit:todo`.

You can add tags to existing data.

### Data preview

You can browse the folder structure and preview the file in the Data details page.
We support data preview for the following types:
- Data file types will be supported via preview API: ".tsv", ".csv", ".parquet", ".jsonl".
- Other file types, Studio UI will attempt to preview the file in the browser natively. So the supported file types may depend on the browser itself.
Normally for images, these are supported: ".png", ".jpg", ".gif". And normally, these are support ".ipynb", ".py", ".yml", ".html".

## Next steps

- Learn how to [create a project in Azure AI Studio](./create-projects.md).
