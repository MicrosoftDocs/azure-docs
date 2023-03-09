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

Batch transcription is used to transcribe a large amount of audio in storage. Batch transcription can access audio files from inside or outside of Azure. This article describes how to use the [Power Automate batch transcription connector](https://learn.microsoft.com/connectors/cognitiveservicesspe/) to transcribe audio files from an Azure Storage container.

You can also use Batch Transcription in Power Platform applications (Power Automate, Power Apps, Logic Apps) via the [Batch Speech-to-text Connector](https://learn.microsoft.com/connectors/cognitiveservicesspe/) with your own Speech resource. Learn more about [Power Platform](https://learn.microsoft.com/power-platform/) and the [connectors](https://learn.microsoft.com/connectors/).

When source audio files are stored outside of Azure, they can be accessed via a public URI (such as "https://crbn.us/hello.wav"). Files should be directly accessible; URIs that require authentication or that invoke interactive scripts before the file can be accessed aren't supported. 

You can specify one or multiple audio files when creating a transcription. We recommend that you provide multiple files per request or point to an Azure Blob storage container with the audio files to transcribe. The batch transcription service can handle a large number of submitted transcriptions. The service transcribes the files concurrently, which reduces the turnaround time. 



## Create the Azure Blob Storage container

When audio files are located in an [Azure Blob Storage](../../storage/blobs/storage-blobs-overview.md) account, you can request transcription of individual audio files or an entire Azure Blob Storage container. 



Follow these steps to create a new storage account and container. 

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. <a href="https://portal.azure.com/#create/Microsoft.StorageAccount-ARM"  title="Create a Storage account resource"  target="_blank">Create a Storage account resource</a> in the Azure portal. Use the same subscription and resource group as your Speech resource.
1. Select the Storage account.
1. In the **Data storage** group in the left pane, select **Containers**.
1. Select **+ Container**.
1. Enter a name for the new container and select **Create**.





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

- [Batch transcription overview](batch-transcription.md)
- [Create a batch transcription](batch-transcription-create.md)
- [Get batch transcription results](batch-transcription-get.md)
