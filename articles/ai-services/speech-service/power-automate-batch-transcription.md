---
title: Power automate batch transcription - Speech service
titleSuffix: Azure AI services
description: Transcribe audio files from an Azure Storage container using the Power Automate batch transcription connector.
services: cognitive-services
manager: nitinme
author: eric-urban
ms.author: eur
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 03/09/2023
---

# Power automate batch transcription

This article describes how to use [Power Automate](/power-automate/getting-started) and the [Azure AI services for Batch Speech to text connector](/connectors/cognitiveservicesspe/) to transcribe audio files from an Azure Storage container. The connector uses the [Batch Transcription REST API](batch-transcription.md), but you don't need to write any code to use it. If the connector doesn't meet your requirements, you can still use the [REST API](rest-speech-to-text.md#transcriptions) directly.

In addition to [Power Automate](/power-automate/getting-started), you can use the [Azure AI services for Batch Speech to text connector](/connectors/cognitiveservicesspe/) with [Power Apps](/power-apps) and [Logic Apps](../../logic-apps/index.yml).

> [!TIP]
> Try more Speech features in [Speech Studio](https://aka.ms/speechstudio/speechtotexttool) without signing up or writing any code.

## Prerequisites

[!INCLUDE [Prerequisites](./includes/common/azure-prerequisites.md)]

## Create the Azure Blob Storage container

In this example, you'll transcribe audio files that are located in an [Azure Blob Storage](../../storage/blobs/storage-blobs-overview.md) account.

Follow these steps to create a new storage account and container. 

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. <a href="https://portal.azure.com/#create/Microsoft.StorageAccount-ARM"  title="Create a Storage account resource"  target="_blank">Create a Storage account resource</a> in the Azure portal. Use the same subscription and resource group as your Speech resource.
1. Select the Storage account. 
1. In the **Data storage** group in the left pane, select **Containers**.
1. Select **+ Container**.
1. Enter a name for the new container such as "batchtranscription" and select **Create**.
1. Get the **Access key** for the storage account. Select **Access keys** in the **Security + networking** group in the left pane. View and take note of the **key1** (or **key2**) value. You'll need the access key later when you [configure the connector](#create-a-power-automate-flow). 

Later you'll [upload files to the container](#upload-files-to-the-container) after the connector is configured, since the events of adding and modifying files kick off the transcription process.

## Create a Power Automate flow

### Create a new flow

1. [Sign in to power automate](https://make.powerautomate.com/)
1. From the collapsible menu on the left, select **Create**. 
1. Select **Automated cloud flow** to start from a blank flow that can be triggered by a designated event.

    :::image type="content" source="./media/power-platform/create-automated-cloud-flow.png" alt-text="A screenshot of the menu for creating an automated cloud flow." lightbox="./media/power-platform/create-automated-cloud-flow.png":::

1. In the **Build an automated cloud flow** dialog, enter a name for your flow such as "BatchSTT".
1. Select **Skip** to exit the dialog and continue without choosing a trigger.

### Configure the flow trigger

1. Choose a trigger from the [Azure Blob Storage connector](/connectors/azureblob/). For this example, enter "blob" in the search connectors and triggers box to narrow the results. 
1. Under the **Azure Blob Storage** connector, select the **When a blob is added or modified** trigger.

    :::image type="content" source="./media/power-platform/flow-search-blob.png" alt-text="A screenshot of the search connectors and triggers dialog." lightbox="./media/power-platform/flow-search-blob.png":::
    
1. Configure the Azure Blob Storage connection. 
    1. From the **Authentication type** drop-down list, select **Access Key**.
    1. Enter the account name and access key of the Azure Storage account that you [created previously](#create-the-azure-blob-storage-container).
    1. Select **Create** to continue.
1. Configure the **When a blob is added or modified** trigger. 

    :::image type="content" source="./media/power-platform/flow-connection-settings-blob.png" alt-text="A screenshot of the configure blob trigger dialog." lightbox="./media/power-platform/flow-connection-settings-blob.png":::

    1. From the **Storage account name or blob endpoint** drop-down list, select **Use connection settings**. You should see the storage account name as a component of the connection string.
    1. Under **Container** select the folder icon. Choose the container that you [created previously](#create-the-azure-blob-storage-container).

### Create SAS URI by path

To transcribe an audio file that's in your [Azure Blob Storage container](#create-the-azure-blob-storage-container) you need a [Shared Access Signature (SAS) URI](../../storage/common/storage-sas-overview.md) for the file.

The [Azure Blob Storage connector](/connectors/azureblob/) supports SAS URIs for individual blobs, but not for entire containers.

1. Select **+ New step** to begin adding a new operation for the Azure Blob Storage connector.
1. Enter "blob" in the search connectors and actions box to narrow the results. 
1. Under the **Azure Blob Storage** connector, select the **Create SAS URI by path** trigger.
1. Under the **Storage account name or blob endpoint** drop-down, choose the same connection that you used for the **When a blob is added or modified** trigger.
1. Select `Path` as dynamic content for the **Blob path** field.

By now, you should have a flow that looks like this:

:::image type="content" source="./media/power-platform/flow-progression-sas-uri.png" alt-text="A screenshot of the flow status after create SAS URI." lightbox="./media/power-platform/flow-progression-sas-uri.png":::

### Create transcription

1. Select **+ New step** to begin adding a new operation for the [Azure AI services for Batch Speech to text connector](/connectors/cognitiveservicesspe/). 
1. Enter "batch speech to text" in the search connectors and actions box to narrow the results. 
1. Select the **Azure AI services for Batch Speech to text** connector.
1. Select the **Create transcription** action.
1. Create a new connection to the Speech resource that you [created previously](#prerequisites). The connection will be available throughout the Power Automate environment. For more information, see [Manage connections in Power Automate](/power-automate/add-manage-connections). 
    1. Enter a name for the connection such as "speech-resource-key". You can choose any name that you like. 
    1. In the **API Key** field, enter the Speech resource key.
    
    Optionally you can select the connector ellipses (...) to view available connections. If you weren't prompted to create a connection, then you already have a connection that's selected by default.

    :::image type="content" source="./media/power-platform/flow-progression-speech-resource-connection.png" alt-text="A screenshot of the view connections dialog." lightbox="./media/power-platform/flow-progression-speech-resource-connection.png":::

1. Configure the **Create transcription** action. 
    1. In the **locale** field enter the expected locale of the audio data to transcribe. 
    1. Select `DisplayName` as dynamic content for the **displayName** field. You can choose any name that you would like to refer to later.
    1. Select `Web Url` as dynamic content for the **contentUrls Item - 1** field. This is the SAS URI output from the [Create SAS URI by path](#create-sas-uri-by-path) action. 
    
    > [!TIP]
    > For more information about create transcription parameters, see the [Azure AI services for Batch Speech to text](/connectors/cognitiveservicesspe/#create-transcription) documentation.

1. From the top navigation menu, select **Save**.

### Test the flow

1. From the top navigation menu, select **Flow checker**. In the side panel that appears, you shouldn't see any errors or warnings. If you do, then you should fix them before continuing.
1. From the top navigation menu, save the flow and select **Test the flow**. In the window that appears, select **Test**.
1. In the side panel that appears, select **Manually** and then select **Test**.

After a few seconds, you should see an indication that the flow is in progress. 

:::image type="content" source="./media/power-platform/flow-progression-test-started.png" alt-text="A screenshot of the flow in progress icon." lightbox="./media/power-platform/flow-progression-test-started.png":::

The flow is waiting for a file to be added or modified in the Azure Blob Storage container. That's the [trigger that you configured](#configure-the-flow-trigger) earlier.

To trigger the test flow, upload an audio file to the Azure Blob Storage container as described next.

## Upload files to the container

Follow these steps to upload [wav, mp3, or ogg](batch-transcription-audio-data.md#supported-audio-formats) files from your local directory to the Azure Storage container that you [created previously](#create-the-azure-blob-storage-container). 

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. <a href="https://portal.azure.com/#create/Microsoft.StorageAccount-ARM"  title="Create a Storage account resource"  target="_blank">Create a Storage account resource</a> in the Azure portal. Use the same subscription and resource group as your Speech resource.
1. Select the Storage account.
1. Select the new container.
1. Select **Upload**.
1. Choose the files to upload and select **Upload**.

## View the transcription flow results

After you upload the audio file to the Azure Blob Storage container, the flow should run and complete. Return to your test flow in the Power Automate portal to view the results.

:::image type="content" source="./media/power-platform/flow-progression-test-succeeded.png" alt-text="A screenshot of all steps of the flow succeeded." lightbox="./media/power-platform/flow-progression-test-succeeded.png":::

You can select and expand the **Create transcription** to see detailed input and output results.

## Next steps

- [Azure AI services for Batch Speech to text connector](/connectors/cognitiveservicesspe/)
- [Azure Blob Storage connector](/connectors/azureblob/)
- [Power Platform](/power-platform/)
