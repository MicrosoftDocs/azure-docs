---
title: How to use the online transcription editor for Custom Speech - Speech service
titleSuffix: Azure Cognitive Services
description: The online transcription editor allows you to easily work with audio transcriptions in Custom Speech.
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

The online transcription editor allows you to easily work with audio transcriptions in Custom Speech. The main use cases of the editor are as follows: 

* You only have audio data, but want to build accurate audio + human-labeled datasets from scratch to use in model training.
* You already have audio + human-labeled datasets, but there are errors or defects in the transcription. The editor allows you to quickly modify the transcriptions to get best training accuracy.

The only requirement to use the transcription editor is to have audio data uploaded (either audio-only, or audio + transcription).

### Import datasets to Editor

To import data into the Editor in Speech Studio, follow these steps:

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

### Edit transcription by listening to audio

After the data upload has succeeded, select each item name to see details of the data. You can also use **Previous** and **Next** to move between each file.

The detail page lists all the segments in each audio file, and you can select the desired utterance. For each utterance, you can play back the audio and examine the transcripts, and edit the transcriptions if you find any insertion, deletion, or substitution errors. See the [data evaluation how-to](how-to-custom-speech-evaluate-data.md) for more detail on error types.

:::image type="content" source="media/custom-speech/custom-speech-editor-detail.png" alt-text="Custom speech editor details":::

After you've made edits, select **Save**.

### Export datasets from the Editor

To export datasets back to the **Data** tab, navigate to the data detail page and select  **Export** to export all the files as a new dataset. You can also filter the files by last edited time, audio durations, etc. to partially select the desired files. 

The files exported to Data will be used as a brand-new dataset and will not affect any of the existing data/training/testing entities.

## Next steps

- [Test recognition quality](how-to-custom-speech-inspect-data.md)
- [Train your model](how-to-custom-speech-train-model.md)
- [Deploy your model](./how-to-custom-speech-train-model.md)

