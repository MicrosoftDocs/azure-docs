---
title: Customizing Speech to Text models | Microsoft Docs
description: Improve speech recognition by customizing Speech to Text models.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin
manager: noellelacharite

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 05/07/2018
ms.author: v-jerkin
---
# Customize "Speech to Text" models using Speech service

To help you achieve better speech recognition results, the Speech service allows you to customize three models used by the **Speech to Text** API. The models are trained automatically from sample data you provide.

| Model | Sample data | Purpose |
|-------|---------------|---------|
| Acoustic model      | Speech, text | Customize the sounds (phonemes) associated with particular words. Train a new accent or dialect, speaking environment, etc. |
| Language model      | Text | Customize the words that are known to the service and how they are used in utterances. Add technical terms, local place names, etc. |
| Pronunciation | Text | Improve recognition of troublesome words, compounds, and abbreviations. For example, map "see threepio" to be recognized as "C3PO" |

After creating new models, you create a custom endpoint that uses your model for one or more of the above purposes. You may also choose a base model provided by the Speech service if you wish to use, for example, a custom acoustic model and not a standard language model. You then use the custom endpoint in place of the standard endpoint for REST requests. Each endpoint has an associated *Deployment ID* so that it can be used with the Speech SDK.

Customization of all models is done through the [Custom Speech portal](https://www.cris.ai/).

## Language support

The following languages are supported for custom **Speech to Text** language models.

| Code | Language |
|-|-|
| en-US | English (United States) 
| zh-CN | Chinese 
| sp-SP | Spanish (Spain) 
| fr-FR | French (France) 
| it-IT | Italian 
| de-DE | German
| pt-BR | Portuguese (Brazil)
| ru-RU | Russian
| jp-JP | Japanese
| ar-EG | Arabic (Egypt)

Custom acoustic models support only US English (en-US). However, Chinese acoustic data sets can be imported for testing Chinese language models.

Custom pronunciation supports only US English (en-US) and German (de-DE) at this time.

## Prepare data sets

Each type of model requires slightly different data and formatting, as described here.

| Model | What you provide      |
|-------|-----------------------|
| Acoustic | A ZIP file containing audio files of complete utterances, and a text file containing transcriptions of these files. Each line of the file must consist of the name of the file, a tab (ASCII 9), and the text.|
| Language | A text file containing one utterance per line. |
| Pronunciation | A text file containing a pronunciation hint on each line. Each hint is a display form (a word or abbreviation), followed by a tab (ASCII 9) and the spoken form (the desired pronunciation).  |

Text files should follow the [text transcription guidelines](prepare-transcription.md) for the model's language.

## Prepare audio files

Audio files for acoustic models should be recorded in a representative location, by a variety of representative users (unless your goal is to optimize recognition for one speaker), using a microphone similar to what your users have. The required format of all audio samples is described in this table.

| Property | Required value |
|----------|------|
File format | RIFF (WAV)
Sample rate | 8000 Hz or 16,000 Hz
Channels | 1 (mono)
Sample format | PCM, 16-bit integer
File duration | Between 0.1 and 60 seconds
Silence collar | 0.1 second
Archive format | zip
Maximum archive size | 2 GB

If you are training a model to work in noisy backgrounds, such as a factory or a car, include a few seconds of typical background noise at the beginning or end of some samples. Do not include noise-only samples.

## Upload data sets

To create a custom model, first upload your data, then begin the training process.

1.  Log in to the [Custom Speech portal](https://www.cris.ai/).

1.  Choose the type of data set you want to create from the **Custom Speech** menu - Adaptation Data for acoustic models, Language Data for language models, or Pronunciation. A list of existing data sets of that type (if any) appears.

1. Choose the language by clicking **Change Locale**.

1.  Click **Import New** and specify a name and description for the new data set.

1. Choose the data files you have prepared.

1. Click **Import** to upload the data and begin validation. Validation ensures that all files are in the correct format. Validation may take a few moments.

## Create a model

 After your data set has been validated, you can train the model as follows.

> [!NOTE]
> Pronunciation data does not need to be trained.

1. Choose the type of model you are creating from the **Custom Speech** menu, then click **Create New.**

1. Choose the locale for the model.

1. Choose a base model for your new model. Your choice of base model determines the recognition modes for which your model can be used, as well as serving as a fallback for any data not in your data set.

1.  Choose the data set from which the model is to be created. A data set may be used by any number of models.

1. Click **Create** to begin training the new model.

## Test a model

As part of the model creation process, you can test your model against an acoustic data set. The new model is used to recognize the speech in the data set's audio files and the results tested against the corresponding text. For best results, use a different acoustic data set than the one you used to create the model.

## Custom endpoint

After you have created custom acoustic models or language models, you can deploy them to a custom **Speech to Text** endpoint. Only the account that created an endpoint is permitted to make calls to it.

To create an endpoint, choose **Endpoints** from the **Custom Speech** menu at the top of the page. The **Endpoints** page contains a table of current custom endpoints, if you have created any. Click **Create New** to create a new endpoint.

Choose the models you want to use in the **Acoustic Model** and **Language Model** lists. The available choices always include the base Microsoft models. You may not mix conversational  models with search and dictate models, so choosing an acoustic model limits the available language models, and vice versa. You may use the same models in any number of endpoints.

Click **Create** after choosing the models. Your new endpoint may take up to 30 minutes to provision.

When your endpoint is ready, select it in the **Endpoints** table to see the URI and deployment ID. You can use custom endpoints with the [Rest API](rest-apis.md#speech-to-text) and the [Speech SDK](speech-sdk.md). The [code samples](samples.md) include an example of using a custom Speech to Text endpoint.

## Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
- [How to recognize speech in C#](quickstart-csharp-windows.md)
