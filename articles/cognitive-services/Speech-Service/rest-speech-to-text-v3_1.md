---
title: Speech-to-text REST API v3.1 Public Preview - Speech service
titleSuffix: Azure Cognitive Services
description: Get reference documentation for Speech-to-text REST API v3.1 (Public Preview).
services: cognitive-services
author: heiko-rahmel
manager: dongli
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: reference
ms.date: 07/11/2022
ms.author: heikora
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Speech-to-text REST API v3.1 (preview)

The Speech-to-text REST API v3.1 is used for [Batch transcription](batch-transcription.md) and [Custom Speech](custom-speech-overview.md). It is currently in Public Preview. 

> See the [Speech to Text API v3.1 preview1](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1-preview1/) reference documentation for details. This is an updated version of the [Speech to Text API v3.0](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/rest-speech-to-text)

Use the REST API v3.1 to:
- Copy models to other subscriptions if you want colleagues to have access to a model that you built, or if you want to deploy a model to more than one region.
- Transcribe data from a container (bulk transcription) and provide multiple URLs for audio files.
- Upload data from Azure storage accounts by using a shared access signature (SAS) URI.
- Get logs for each endpoint if logs have been requested for that endpoint.
- Request the manifest of the models that you create, to set up on-premises containers.

## Changes to the v3.0 API

### Batch transcription changes:
- In **Create Transcription** the following three new fields were added to properties:
    - **displayFormWordLevelTimestampsEnabled** can be used to enable the reporting of word-level timestamps on the display form of the transcription results.
    - **diarization** allows to specify hints for the minimum and maximum number of speaker labels to generate when performing optional diarization (speaker separation). With this feature, the service is now able to generate speaker labels for more than two speakers.
    - **languageIdentification** allows to specify settings for optional language identification on the input prior to transcription. Up to 10 candidate locales are supported for language identification. For the preview API, transcription can only be performed with base models for the respective locales. The ability to use custom models for transcription will be added for the GA version.
- **Get Transcriptions**, **Get Transcription Files**, **Get Transcriptions For Project** now include 2 new optional parameters to simplify finding the right resource:

### Custom Speech changes
-	**Create Dataset** now supports a new data type of **LanguageMarkdown** to support upload of the new structured text data.
    It also now supports uploading data in multiple blocks for which the following new operations were added:
    - **Create Upload Session** - Creates an upload session for chunked upload of data.
    - **Upload Data Block** - Upload a block of data for the dataset. The maximum size of the block is 8MiB.
    - **Upload Data Chunk** - Uploads a chunk of data.
    - **Commit Block List** - Commit block list to complete the upload of the dataset.
    - **Get Upload Session** - Gets the upload session identified by the given ID.
    - **Get Uploaded Blocks** - Get the list of uploaded blocks for this dataset.
- **Get Base Models** and **Get Base Model** now provide information on the type of adaptation supported by a base model:
 ```json 
 "features": {
         …
          "supportsAdaptationsWith": [
           “Acoustic”,
           "Language",
           “LanguageMarkdown”,
            "Pronunciation"
          ]
   }
```

|Adaptation Type |DescriptionText |
|---------|---------|
|Acoustic |Supports adapting the model with the audio provided to adapt to the audio condition or specific speaker characteristics. |
|Language |Supports adapting with Plain Text. |
|LanguageMarkdown |Supports adapting with Structured Text. |
|Pronunciation |Supports adapting with a Pronunciation File. |
- **Create Model** has a new optional parameter under **properties** called **customModelWeightPercentage** that lets you specify the weight used when the Custom Language Model (trained from plain or structured text data) is combined with the Base Language Model. Valid values are between 0.1 and 0.9. The default value is currently 0.3.
- **Get Base Models**, **Get Datasets**, **Get Datasets For Project**, **Get Data Set Files**, **Get Endpoints**, **Get Endpoints For Project**, **Get Evaluations**, **Get Evaluations For Project**, **Get Evaluation Files**, **Get Models**, **Get Models For Project**, **Get Projects** now include 2 new optional parameters to simplify finding the right resource:
    - **orderBy** can be used to provide a sorting expression for determining the order in which the resources will be returned.
    - **filter** can be used to provide a filtering expression for selecting a subset of the available resources.

- Added a new **Get Model Files** operation to get the files of the model identified by the given ID as well as a new **Get Model File** operation to get one specific file (identified with fileId) from a model (identified with id). This lets you retrieve a **ModelReport** file that provides information on the data processed during training. 

## Next steps

- [Customize acoustic models](./how-to-custom-speech-train-model.md)
- [Customize language models](./how-to-custom-speech-train-model.md)
- [Get familiar with batch transcription](batch-transcription.md)

