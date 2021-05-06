---
title: Create and manage Integration Runtimes
description: This article explains the steps to create and manage Integration Runtimes in Azure Purview.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 02/03/2021
---

# Create and manage a self-hosted integration runtime

This article describes how to create and manage a self-hosted integration runtime (SHIR) that let's you scan data sources in Azure Purview.

> [!NOTE]
> The Purview Integration Runtime cannot be shared with an Azure Synapse Analytics or Azure Data Factory Integration Runtime on the same machine. It needs to be installed on a separated machine.

## Create a self-hosted integration runtime

1. On the home page of Purview Studio, select **Management Center** from the left navigation pane.

2. Under **Sources and scanning** on the left pane, select **Integration runtimes**, and then select **+ New**.

   :::image type="content" source="media/manage-integration-runtimes/select-integration-runtimes.png" alt-text="Click on IR.":::

3. On the **Integration runtime setup** page, select **Self-Hosted** to create a Self-Hosted IR, and then select **Continue**.

   :::image type="content" source="media/manage-integration-runtimes/select-self-hosted-ir.png" alt-text="Create new SHIR.":::

4. Enter a name for your IR, and select Create.

5. On the **Integration Runtime settings** page, follow the steps under the **Manual setup** section. You will have to download the integration runtime from the download site onto a VM or machine where you intend to run it.

   :::image type="content" source="media/manage-integration-runtimes/integration-runtime-settings.png" alt-text="get key":::

   - Copy and paste the authentication key.

   - Download the self-hosted integration runtime from [Microsoft Integration Runtime](https://www.microsoft.com/download/details.aspx?id=39717) on a local Windows machine. Run the installer.

   - On the **Register Integration Runtime (Self-hosted)** page, paste one of the two keys you saved earlier, and select **Register**.

     :::image type="content" source="media/manage-integration-runtimes/register-integration-runtime.png" alt-text="input key.":::

   - On the **New Integration Runtime (Self-hosted) Node** page, select **Finish**.

6. After the Self-hosted integration runtime is registered successfully, you see the following window:

   :::image type="content" source="media/manage-integration-runtimes/successfully-registered.png" alt-text="successfully registered.":::

## Manage a self-hosted integration runtime

You can edit a self-hosted integration runtime by navigating to **Integration runtimes** in the **Management center**, selecting the IR and then clicking on edit. You can now update the description, copy the key, or regenerate new keys.

:::image type="content" source="media/manage-integration-runtimes/edit-integration-runtime.png" alt-text="edit IR.":::

:::image type="content" source="media/manage-integration-runtimes/edit-integration-runtime-settings.png" alt-text="edit IR details.":::

You can delete a self-hosted integration runtime by navigating to **Integration runtimes** in the Management center, selecting the IR and then clicking on **Delete**. Once an IR is deleted, any ongoing scans relying on it will fail.

## Next steps

[How scans detect deleted assets](concept-detect-deleted-assets.md)
