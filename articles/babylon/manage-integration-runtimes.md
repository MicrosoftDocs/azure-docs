---
title: Create and manage integration runtimes in Babylon
titleSuffix: Azure Purview
description: This article explains the steps to create and manage integration runtimes in Babylon.
author: viseshag
ms.author: viseshag
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 09/11/2020
---

# Create and manage a self-hosted integration runtime

This article describes how to create and manage a self-hosted integration runtime (SHIR) to assist in scanning data sources.

## Prerequisites

> [!Note]
> The features in this article require a Babylon account created after 9/15/2020.

### Feature Flag

To create and manage an SHIR, please append the following to your URL: `?feature.ext.datasource={%22sqlServer%22:%22true%22}`. The full URL may look something like this:

`https://web.babylon.azure.com/?feature.ext.datasource={%22sqlServer%22:%22true%22}`

## Create a self-hosted integration runtime

1. On the home page of Babylon Studio, select Management Center from the leftmost navigation pane.

    :::image type="content" source="media/manage-integration-runtimes/image1.png" alt-text="Navigate to management center.":::

2. Select Integration runtimes on the left pane, and then select +New.

    :::image type="content" source="media/manage-integration-runtimes/image2.png" alt-text="click on IR.":::

3. On the Integration runtime setup page, select Self-Hosted to create a Self-Hosted IR, and then select Continue.

    :::image type="content" source="media/manage-integration-runtimes/image3.png" alt-text="create new SHIR.":::

4. Enter a name for your IR, and select Create.

5. On the Integration Runtime settings page, follow the steps under Manual setup section. You will have to download the integration runtime from the download site onto a VM or machine where you intend to run it.

    :::image type="content" source="media/manage-integration-runtimes/image4.png" alt-text="get key":::

    a. Copy and paste the authentication key.
        
    b. Download the self-hosted integration runtime from [here](https://www.microsoft.com/download/details.aspx?id=39717) on a local Windows machine. Run the installer.
        
    c. On the Register Integration Runtime (Self-hosted) page, paste one of the 2 keys you saved earlier, and select Register.

    :::image type="content" source="media/manage-integration-runtimes/image5.png" alt-text="input key.":::

    d. On the New Integration Runtime (Self-hosted) Node page, select Finish.

6. After the self-hosted integration runtime is registered successfully, you see the following window:

    :::image type="content" source="media/manage-integration-runtimes/image6.png" alt-text="successfully registered.":::

## Manage a self-hosted integration runtime

You can edit a self-hosted integration runtime by navigating to 'integration runtimes' in the management center, selecting the IR and then clicking on edit. You can now update the description, copy the key or regenerate new keys.

:::image type="content" source="media/manage-integration-runtimes/image7.png" alt-text="edit IR.":::

:::image type="content" source="media/manage-integration-runtimes/image8.png" alt-text="edit IR details.":::

You can delete a self-hosted integration runtime by navigating to 'integration runtimes' in the management center, selecting the IR and then clicking on **Delete**. Once an IR is deleted, any ongoing scans relying on it will fail.

## Next steps

* [How scans detect deleted assets](concept-detect-deleted-assets.md)
