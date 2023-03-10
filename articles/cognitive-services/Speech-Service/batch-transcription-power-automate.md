---
title: Power automate batch transcription - Speech service
titleSuffix: Azure Cognitive Services
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

This article describes how to use [Power Automate](/power-automate/getting-started) and the [Azure Cognitive Services for Batch Speech-to-text](/connectors/cognitiveservicesspe/) to transcribe audio files from an Azure Storage container. The logs and results of the transcription are stored in the same container.

In addition to [Power Automate](/power-automate/getting-started) to automate repetitive tasks, you can use the Batch Transcription connector in other [Power Platform](/power-platform/) applications including Power Apps and Logic Apps.

The connector uses the [Batch Transcription REST API](batch-transcription.md), but you don't need to write any code to use the connector. If the connector doesn't meet your requirements, you can use the [REST API](rest-speech-to-text.md#transcriptions) directly.

> [!TIP]
> Try more Speech features in [Speech Studio](https://aka.ms/speechstudio/speechtotexttool) without signing up or writing any code.

## Prerequisites

[!INCLUDE [Prerequisites](./includes/common/azure-prerequisites.md)]

## Create the Azure Blob Storage container

Batch transcription can access audio files from inside or outside of Azure. When audio files are located in an [Azure Blob Storage](../../storage/blobs/storage-blobs-overview.md) account, you can request transcription of individual audio files or an entire Azure Blob Storage container. 

Follow these steps to create a new storage account and container. 

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. <a href="https://portal.azure.com/#create/Microsoft.StorageAccount-ARM"  title="Create a Storage account resource"  target="_blank">Create a Storage account resource</a> in the Azure portal. Use the same subscription and resource group as your Speech resource.
1. Select the Storage account.
1. In the **Data storage** group in the left pane, select **Containers**.
1. Select **+ Container**.
1. Enter a name for the new container and select **Create**.

You'll [upload files to the container](#upload-files-to-the-container) after the connector is configured, since the events of adding and modifying files kick off the transcription process.

## Create a Power Automate flow


1. [Sign in to power automate](https://make.powerautomate.com/)
1. From the collapsible menu on the left, select **Create**. 
1. Select **Automated cloud flow** to start from a blank flow that can be triggered by a designated event.
1. In the **Build an automated cloud flow** dialog, enter a name for your flow such as `BatchSTT`.
1. Select **Skip** to exit the dialog and continue without choosing a trigger.
1. Enter "blob" in the search connectors and triggers box to narrow results. Under the **Azure Blob Storage** connector, select the **When a blob is added or modified** trigger.


    
1. From the top navigation menu, save the flow and select **Test the flow**. In the window that appears, select **Test**.



## Upload files to the container

When audio files are located in an [Azure Blob Storage](../../storage/blobs/storage-blobs-overview.md) account, you can request transcription of individual audio files or an entire Azure Blob Storage container. You can also [write transcription results](batch-transcription-create.md#destination-container-url) to a Blob container.

Follow these steps to upload [wav, mp3, or ogg](batch-transcription-audio-data.md#supported-audio-formats) files from your local directory to the Azure Storage container that you created previously. 

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. <a href="https://portal.azure.com/#create/Microsoft.StorageAccount-ARM"  title="Create a Storage account resource"  target="_blank">Create a Storage account resource</a> in the Azure portal. Use the same subscription and resource group as your Speech resource.
1. Select the Storage account.
1. Select the new container.
1. Select **Upload**.
1. Choose the files to upload and select **Upload**.


## Next steps

- [Azure Cognitive Services for Batch Speech-to-text connector](/connectors/cognitiveservicesspe/)
- [Azure Blob Storage connector](/connectors/azureblob/)
- [Power Platform](/power-platform/)
