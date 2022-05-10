---
title: How to use the online transcription editor for Custom Speech - Speech service
titleSuffix: Azure Cognitive Services
description: The online transcription editor allows you to create or edit audio + human-labeled transcriptions for Custom Speech.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 05/08/2022
ms.author: eur
---

# How to use the online transcription editor

The online transcription editor allows you to create or edit audio + human-labeled transcriptions for Custom Speech. The main use cases of the editor are as follows: 

* You only have audio data, but want to build accurate audio + human-labeled datasets from scratch to use in model training.
* You already have audio + human-labeled datasets, but there are errors or defects in the transcription. The editor allows you to quickly modify the transcriptions to get best training accuracy.

The only requirement to use the transcription editor is to have audio data uploaded, with or without corresponding transcriptions.

## Import datasets to Editor

To import data to the Editor, follow these steps:

1. Sign in to the [Speech Studio](https://speech.microsoft.com/customspeech). 
1. Select **Custom Speech** > Your project name > **Speech datasets** > **Editor**.
    :::image type="content" source="media/custom-speech/custom-speech-editor.png" alt-text="Custom speech editor":::
1. Select **Import data**
1. Select datasets. You can select audio data only, audio + human-labeled data, or both. For audio-only data, you can use the default models to automatically generate machine transcription after importing to the editor.
1. Enter a name and description for the new dataset, and then select **Next**.
1. Review your settings, and then select **Import and close** to kick off the import process.

After data has been successfully imported, you can select datasets and start editing.

> [!NOTE]
> You can also select a dataset from the main **Speech datasets** page and import them to the Editor. Select a dataset and than select **Export to Editor**.

## Edit transcription by listening to audio

After the data upload has succeeded, select each item name to see details of the data. You can also use **Previous** and **Next** to move between each file.

To edit transcriptions, follow these steps:

1. Sign in to the [Speech Studio](https://speech.microsoft.com/customspeech). 
1. Select **Custom Speech** > Your project name > **Speech datasets** > **Editor**.
1. Select the link to a dataset by name.
1. From the **Audio + text files** table, select the link to an audio file by name. 
1. After you've made edits, select **Save**.

The detail page lists all the segments in each audio file, and you can select the desired utterance. If there are multiple files, you can select **Previous** and **Next** to move from file to file. For each utterance, you can play back the audio and examine the transcripts, and edit the transcriptions if you find any insertion, deletion, or substitution errors. For more information about word error types, see [test model accuracy](how-to-custom-speech-evaluate-data.md).

## Export datasets from the Editor

To export datasets from the Editor, follow these steps:

1. Sign in to the [Speech Studio](https://speech.microsoft.com/customspeech). 
1. Select **Custom Speech** > Your project name > **Speech datasets** > **Editor**.
1. Select the link to a dataset by name.
1. Select one or more rows from the **Audio + text files** table.
1. Select **Export** to export all of the selected files as one new dataset. 

The files are exported as a new dataset, and will not impact or replace other testing or training datasets.

## Next steps

- [Test recognition quality](how-to-custom-speech-inspect-data.md)
- [Train your model](how-to-custom-speech-train-model.md)
- [Deploy your model](./how-to-custom-speech-train-model.md)

