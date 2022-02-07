---
title: "Evaluate and improve Custom Speech accuracy - Speech service"
titleSuffix: Azure Cognitive Services
description: "In this article, you learn how to quantitatively measure and improve the quality of our speech-to-text model or your custom model."
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/23/2022
ms.author: eur
ms.custom: ignite-fall-2021
---

# Evaluate and improve Custom Speech accuracy

In this article, you learn how to quantitatively measure and improve the accuracy of the Microsoft speech-to-text model or your own custom models. Audio + human-labeled transcription data is required to test accuracy, and 30 minutes to 5 hours of representative audio should be provided.

## Evaluate Custom Speech accuracy

The industry standard for measuring model accuracy is [word error rate (WER)](https://en.wikipedia.org/wiki/Word_error_rate). WER counts the number of incorrect words identified during recognition, divides the sum by the total number of words provided in the human-labeled transcript (shown in the following formula as N), and then multiplies that quotient by 100 to calculate the error rate as a percentage.

![Screenshot showing the WER formula.](./media/custom-speech/custom-speech-wer-formula.png)

Incorrectly identified words fall into three categories:

* Insertion (I): Words that are incorrectly added in the hypothesis transcript
* Deletion (D): Words that are undetected in the hypothesis transcript
* Substitution (S): Words that were substituted between reference and hypothesis

Here's an example:

![Screenshot showing an example of incorrectly identified words.](./media/custom-speech/custom-speech-dis-words.png)

If you want to replicate WER measurements locally, you can use the sclite tool from the [NIST Scoring Toolkit (SCTK)](https://github.com/usnistgov/SCTK).

## Resolve errors and improve WER

You can use the WER calculation from the machine recognition results to evaluate the quality of the model you're using with your app, tool, or product. A WER of 5-10% is considered to be good quality and is ready to use. A WER of 20% is acceptable, but you might want to consider additional training. A WER of 30% or more signals poor quality and requires customization and training.

How the errors are distributed is important. When many deletion errors are encountered, it's usually because of weak audio signal strength. To resolve this issue, you need to collect audio data closer to the source. Insertion errors mean that the audio was recorded in a noisy environment and crosstalk might be present, causing recognition issues. Substitution errors are often encountered when an insufficient sample of domain-specific terms has been provided as either human-labeled transcriptions or related text.

By analyzing individual files, you can determine what type of errors exist, and which errors are unique to a specific file. Understanding issues at the file level will help you target improvements.

## Create a test

If you want to test the quality of the Microsoft speech-to-text baseline model or a custom model that you've trained, you can compare two models side by side. The comparison includes WER and recognition results. A custom model is ordinarily compared with the Microsoft baseline model.

To evaluate models side by side, do the following:

1. Sign in to the [Custom Speech portal](https://speech.microsoft.com/customspeech).

1. Select **Speech-to-text** > **Custom Speech** > **\<name of project>** > **Testing**.
1. Select **Add Test**.
1. Select **Evaluate accuracy**. Give the test a name and description, and then select your audio + human-labeled transcription dataset.
1. Select up to two models that you want to test.
1. Select **Create**.

After your test has been successfully created, you can compare the results side by side.

### Side-by-side comparison

After the test is complete, as indicated by the status change to *Succeeded*, you'll find a WER number for both models included in your test. Select the test name to view the test details page. This page lists all the utterances in your dataset and the recognition results of the two models, alongside the transcription from the submitted dataset. 

To inspect the side-by-side comparison, you can toggle various error types, including insertion, deletion, and substitution. By listening to the audio and comparing recognition results in each column, which display the human-labeled transcription and the results for two speech-to-text models, you can decide which model meets your needs and determine where additional training and improvements are required.

## Improve Custom Speech accuracy

Speech recognition scenarios vary by audio quality and language (vocabulary and speaking style). The following table examines four common scenarios:

| Scenario | Audio quality | Vocabulary | Speaking style |
|----------|---------------|------------|----------------|
| Call center | Low, 8&nbsp;kHz, could be two people on one audio channel, could be compressed | Narrow, unique to domain and products | Conversational, loosely structured |
| Voice assistant, such as Cortana, or a drive-through window | High, 16&nbsp;kHz | Entity-heavy (song titles, products, locations) | Clearly stated words and phrases |
| Dictation (instant message, notes, search) | High, 16&nbsp;kHz | Varied | Note-taking |
| Video closed captioning | Varied, including varied microphone use, added music | Varied, from meetings, recited speech, musical lyrics | Read, prepared, or loosely structured |
| | |

Different scenarios produce different quality outcomes. The following table examines how content from these four scenarios rates in the [WER](how-to-custom-speech-evaluate-data.md). The table shows which error types are most common in each scenario.

| Scenario | Speech recognition quality | Insertion errors | Deletion errors | Substitution errors |
|--- |--- |--- |--- |--- |
| Call center | Medium<br>(<&nbsp;30%&nbsp;WER) | Low, except when other people talk in the background | Can be high. Call centers can be noisy, and overlapping speakers can confuse the model | Medium. Products and people's names can cause these errors |
| Voice assistant | High<br>(can be <&nbsp;10%&nbsp;WER) | Low | Low | Medium, due to song titles, product names, or locations |
| Dictation | High<br>(can be <&nbsp;10%&nbsp;WER) | Low | Low | High |
| Video closed captioning | Depends on video type (can be <&nbsp;50%&nbsp;WER) | Low | Can be high because of music, noises, microphone quality | Jargon might cause these errors |
| | |

Determining the components of the WER (number of insertion, deletion, and substitution errors) helps determine what kind of data to add to improve the model. Use the [Custom Speech portal](https://speech.microsoft.com/customspeech) to view the quality of a baseline model. The portal reports insertion, substitution, and deletion error rates that are combined in the WER quality rate.

## Improve model recognition

You can reduce recognition errors by adding training data in the [Custom Speech portal](https://speech.microsoft.com/customspeech). 

Plan to maintain your custom model by adding source materials periodically. Your custom model needs additional training to stay aware of changes to your entities. For example, you might need updates to product names, song names, or new service locations.

The following sections describe how each kind of additional training data can reduce errors.

### Add plain text data

When you train a new custom model, start by adding plain text sentences of related text to improve the recognition of domain-specific words and phrases. Related text sentences can primarily reduce substitution errors related to misrecognition of common words and domain-specific words by showing them in context. Domain-specific words can be uncommon or made-up words, but their pronunciation must be straightforward to be recognized.

> [!NOTE]
> Avoid related text sentences that include noise such as unrecognizable characters or words.

### Add structured text data

You can use structured text data in markdown format as you would with plain text sentences, but you would use structured text data when your data follows a particular pattern in particular utterances that differ only by words or phrases from a list. For more information, see [Structured text data for training](how-to-custom-speech-test-and-train.md#structured-text-data-for-training-public-preview). 

> [!NOTE]
> Training with structured text is supported only for these locales: en-US, de-DE, en-UK, en-IN, fr-FR, fr-CA, es-ES, and es-MX. You must use the latest base model for these locales. See [Language support](language-support.md) for a list of base models that support training with structured text data.
> 
> For locales that don’t support training with structured text, the service will take any training sentences that don’t reference classes as part of training with plain text data.

### Add audio with human-labeled transcripts

Audio with human-labeled transcripts offers the greatest accuracy improvements if the audio comes from the target use case. Samples must cover the full scope of speech. For example, a call center for a retail store would get the most calls about swimwear and sunglasses during summer months. Ensure that your sample includes the full scope of speech that you want to detect.

Consider these details:

* Training with audio will bring the most benefits if the audio is also hard to understand for humans. In most cases, you should start training by using only related text.
* If you use one of the most heavily used languages, such as US English, it's unlikely that you would need to train with audio data. For such languages, the base models already offer very good recognition results in most scenarios, so it's probably enough to train with related text.
* Custom Speech can capture word context only to reduce substitution errors, not insertion or deletion errors.
* Avoid samples that include transcription errors, but do include a diversity of audio quality.
* Avoid sentences that are unrelated to your problem domain. Unrelated sentences can harm your model.
* When the transcript quality varies, you can duplicate exceptionally good sentences (like excellent transcriptions that include key phrases) to increase their weight.
* The Speech service automatically uses the transcripts to improve the recognition of domain-specific words and phrases, as though they were added as related text.
* It can take several days for a training operation to finish. To improve the speed of training, be sure to create your Speech service subscription in a [region that has dedicated hardware](custom-speech-overview.md#set-up-your-azure-account) for training.


> [!NOTE]
> Not all base models support training with audio. If a base model doesn't support audio, the Speech service will use only the text from the transcripts and ignore the audio. For a list of base models that support training with audio data, see [Language support](language-support.md#speech-to-text). Even if a base model does support training with audio data, the service might use only part of the audio. And it will still use all the transcripts.

> [!NOTE]
> When you change the base model that's used for training, and you have audio in the training dataset, *always* check to see whether the new selected base model [supports training with audio data](language-support.md#speech-to-text). If the previously used base model didn't support training with audio data, and the training dataset contains audio, training time with the new base model will *drastically* increase. The duration might easily go from several hours to several days or longer. This is especially true if your Speech service subscription is *not* in a [region that has the dedicated hardware](custom-speech-overview.md#set-up-your-azure-account) for training.
>
> If you face this issue, you can decrease the training time by reducing the amount of audio in the dataset or removing it completely and leaving only the text. We recommend the latter option if your Speech service subscription is *not* in a region that has such dedicated hardware.

### Add new words with pronunciation

Words that are made up or highly specialized might have unique pronunciations. These words can be recognized if they can be broken down into smaller words to pronounce them. For example, to recognize *Xbox*, pronounce it as *X box*. This approach won't increase overall accuracy, but can improve recognition of this and other keywords.

> [!NOTE]
> This technique is available for only certain languages at this time. To see which languages support customization of pronunciation, search for "Pronunciation" in the **Customizations** column in the [speech-to-text table](language-support.md#speech-to-text).

## Sources by scenario

The following table shows voice recognition scenarios and lists source materials to consider within the three previously mentioned training content categories.

| Scenario | Plain text data and <br> structured text data | Audio + human-labeled transcripts | New words with pronunciation |
|--- |--- |--- |--- |
| Call center | Marketing documents, website, product reviews related to call center activity | Call center calls transcribed by humans | Terms that have ambiguous pronunciations (see the *Xbox* example in the preceding section) |
| Voice assistant | Lists of sentences that use various combinations of commands and entities | Recorded voices speaking commands into device, transcribed into text | Names (movies, songs, products) that have unique pronunciations |
| Dictation  | Written input, such as instant messages or emails | Similar to preceding examples | Similar to preceding examples |
| Video closed captioning | TV show scripts, movies, marketing content, video summaries | Exact transcripts of videos | Similar to preceding examples |
| | |

## Next steps

* [Train and deploy a model](how-to-custom-speech-train-model.md)

## Additional resources

* [Prepare and test your data](./how-to-custom-speech-test-and-train.md)
* [Inspect your data](how-to-custom-speech-inspect-data.md)
