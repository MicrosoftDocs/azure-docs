---
title: "Evaluate and improve Custom Speech accuracy - Speech service"
titleSuffix: Azure Cognitive Services
description: "In this document you learn how to quantitatively measure and improve the quality of our speech-to-text model or your custom model. Audio + human-labeled transcription data is required to test accuracy, and 30 minutes to 5 hours of representative audio should be provided."
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 02/12/2021
ms.author: trbye
---

# Evaluate and improve Custom Speech accuracy

In this article, you learn how to quantitatively measure and improve the accuracy of Microsoft's speech-to-text models or your own custom models. Audio + human-labeled transcription data is required to test accuracy, and 30 minutes to 5 hours of representative audio should be provided.

## Evaluate Custom Speech accuracy

The industry standard to measure model accuracy is [Word Error Rate](https://en.wikipedia.org/wiki/Word_error_rate) (WER). WER counts the number of incorrect words identified during recognition, 
then divides by the total number of words provided in the human-labeled transcript (shown below as N). Finally, that number is multiplied by 100% to calculate the WER.

![WER formula](./media/custom-speech/custom-speech-wer-formula.png)

Incorrectly identified words fall into three categories:

* Insertion (I): Words that are incorrectly added in the hypothesis transcript
* Deletion (D): Words that are undetected in the hypothesis transcript
* Substitution (S): Words that were substituted between reference and hypothesis

Here's an example:

![Example of incorrectly identified words](./media/custom-speech/custom-speech-dis-words.png)

If you want to replicate WER measurements locally, you can use sclite from [SCTK](https://github.com/usnistgov/SCTK).

## Resolve errors and improve WER

You can use the WER from the machine recognition results to evaluate the quality of the model you are using with your app, tool, or product. A WER of 5%-10% is considered to be good quality and is ready to use. A WER of 20% is acceptable, however you may want to consider additional training. A WER of 30% or more signals poor quality and requires customization and training.

How the errors are distributed is important. When many deletion errors are encountered, it's usually because of weak audio signal strength. To resolve this issue, you'll need to collect audio data closer to the source. Insertion errors mean that the audio was recorded in a noisy environment and crosstalk may be present, causing recognition issues. Substitution errors are often encountered when an insufficient sample of domain-specific terms has been provided as either human-labeled transcriptions or related text.

By analyzing individual files, you can determine what type of errors exist, and which errors are unique to a specific file. Understanding issues at the file level will help you target improvements.

## Create a test

If you'd like to test the quality of Microsoft's speech-to-text baseline model or a custom model that you've trained, you can compare two models side by side to evaluate accuracy. The comparison includes WER and recognition results. Typically, a custom model is compared with Microsoft's baseline model.

To evaluate models side by side:

1. Sign in to the [Custom Speech portal](https://speech.microsoft.com/customspeech).
2. Navigate to **Speech-to-text > Custom Speech > [name of project] > Testing**.
3. Click **Add Test**.
4. Select **Evaluate accuracy**. Give the test a name, description, and select your audio + human-labeled transcription dataset.
5. Select up to two models that you'd like to test.
6. Click **Create**.

After your test has been successfully created, you can compare the results side by side.

### Side-by-side comparison

Once the test is complete, indicated by the status change to *Succeeded*, you'll find a WER number for both models included in your test. Click on the test name to view the testing detail page. This detail page lists all the utterances in your dataset, indicating the recognition results of the two models alongside the transcription from the submitted dataset. To help inspect the side-by-side comparison, you can toggle various error types including insertion, deletion, and substitution. By listening to the audio and comparing recognition results in each column, which shows the human-labeled transcription and the results for two speech-to-text models, you can decide which model meets your needs and where additional training and improvements are required.

## Improve Custom Speech accuracy

Speech recognition scenarios vary by audio quality and language (vocabulary and speaking style). The following table examines four common scenarios:

| Scenario | Audio Quality | Vocabulary | Speaking Style |
|----------|---------------|------------|----------------|
| Call center | Low, 8 kHz, could be 2 humans on 1 audio channel, could be compressed | Narrow, unique to domain and products | Conversational, loosely structured |
| Voice assistant (such as Cortana, or a drive-through window) | High, 16 kHz | Entity heavy (song titles, products, locations) | Clearly stated words and phrases |
| Dictation (instant message, notes, search) | High, 16 kHz | Varied | Note-taking |
| Video closed captioning | Varied, including varied microphone use, added music | Varied, from meetings, recited speech, musical lyrics | Read, prepared, or loosely structured |

Different scenarios produce different quality outcomes. The following table examines how content from these four scenarios rates in the [word error rate (WER)](how-to-custom-speech-evaluate-data.md). The table shows which error types are most common in each scenario.

| Scenario | Speech Recognition Quality | Insertion Errors | Deletion Errors | Substitution Errors |
|----------|----------------------------|------------------|-----------------|---------------------|
| Call center | Medium (< 30% WER) | Low, except when other people talk in the background | Can be high. Call centers can be noisy, and overlapping speakers can confuse the model | Medium. Products and people's names can cause these errors |
| Voice assistant | High (can be < 10% WER) | Low | Low | Medium, due to song titles, product names, or locations |
| Dictation | High (can be < 10% WER) | Low | Low | High |
| Video closed captioning | Depends on video type (can be < 50% WER) | Low | Can be high due to music, noises, microphone quality | Jargon may cause these errors |

Determining the components of the WER (number of insertion, deletion, and substitution errors) helps determine what kind of data to add to improve the model. Use the [Custom Speech portal](https://speech.microsoft.com/customspeech) to view the quality of a baseline model. The portal reports insertion, substitution, and deletion error rates that are combined in the WER quality rate.

## Improve model recognition

You can reduce recognition errors by adding training data in the [Custom Speech portal](https://speech.microsoft.com/customspeech). 

Plan to maintain your custom model by adding source materials periodically. Your custom model needs additional training to stay aware of changes to your entities. For example, you may need updates to product names, song names, or new service locations.

The following sections describe how each kind of additional training data can reduce errors.

### Add related text sentences

When you train a new custom model, start by adding related text to improve the recognition of domain-specific words and phrases. Related text sentences can primarily reduce substitution errors related to misrecognition of common words and domain-specific words by showing them in context. Domain-specific words can be uncommon or made-up words, but their pronunciation must be straightforward to be recognized.

> [!NOTE]
> Avoid related text sentences that include noise such as unrecognizable characters or words.

### Add audio with human-labeled transcripts

Audio with human-labeled transcripts offers the greatest accuracy improvements if the audio comes from the target use case. Samples must cover the full scope of speech. For example, a call center for a retail store would get most calls about swimwear and sunglasses during summer months. Assure that your sample includes the full scope of speech you want to detect.

Consider these details:

* Training with audio will bring the most benefits if the audio is also hard to understand for humans. In most cases, you should start training by just using related text.
* If you use one of the most heavily used languages such as US-English, there's a good chance that there's no need to train with audio data. For such languages, the base models offer already very good recognition results in most scenarios; it's probably enough to train with related text.
* Custom Speech can only capture word context to reduce substitution errors, not insertion, or deletion errors.
* Avoid samples that include transcription errors, but do include a diversity of audio quality.
* Avoid sentences that are not related to your problem domain. Unrelated sentences can harm your model.
* When the quality of transcripts vary, you can duplicate exceptionally good sentences (like excellent transcriptions that include key phrases) to increase their weight.
* The Speech service will automatically use the transcripts to improve the recognition of domain-specific words and phrases, as if they were added as related text.
* It can take several days for a training operation to complete. To improve the speed of training, make sure to create your Speech service subscription in a [region with the dedicated hardware](custom-speech-overview.md#set-up-your-azure-account) for training.

> [!NOTE]
> Not all base models support training with audio. If a base model does not support it, the Speech service will only use the text from the transcripts and ignore the audio. See [Language support](language-support.md#speech-to-text) for a list of base models that support training with audio data. Even if a base model supports training with audio data, the service might use only part of the audio. Still it will use all the transcripts.

> [!NOTE]
> In cases when you change the base model used for training, and you have audio in the training dataset, *always* check whether the new selected base model [supports training with audio data](language-support.md#speech-to-text). If the previously used base model did not support training with audio data, and the training dataset contains audio, training time with the new base model will **drastically** increase, and may easily go from several hours to several days and more. This is especially true if your Speech service subscription is **not** in a [region with the dedicated hardware](custom-speech-overview.md#set-up-your-azure-account) for training.
>
> If you face the issue described in the paragraph above, you can quickly decrease the training time by reducing the amount of audio in the dataset or removing it completely and leaving only the text. The latter option is highly recommended if your Speech service subscription is **not** in a [region with the dedicated hardware](custom-speech-overview.md#set-up-your-azure-account) for training.

### Add new words with pronunciation

Words that are made-up or highly specialized may have unique pronunciations. These words can be recognized if the word can be broken down into smaller words to pronounce it. For example, to recognize **Xbox**, pronounce as **X box**. This approach will not increase overall accuracy, but can increase recognition of these keywords.

> [!NOTE]
> This technique is only available for some languages at this time. See customization for pronunciation in [the Speech-to-text table](language-support.md) for details.

## Sources by scenario

The following table shows voice recognition scenarios and lists source materials to consider within the three training content categories listed above.

| Scenario | Related text sentences | Audio + human-labeled transcripts | New words with pronunciation |
|----------|------------------------|------------------------------|------------------------------|
| Call center             | marketing documents, website, product reviews related to call center activity | call center calls transcribed by humans | terms that have ambiguous pronunciations (see Xbox above) |
| Voice assistant         | list sentences using all combinations of commands and entities | record voices speaking commands into device, and transcribe into text | names (movies, songs, products) that have unique pronunciations |
| Dictation               | written input, like instant messages or emails | similar to above | similar to above |
| Video closed captioning | TV show scripts, movies, marketing content, video summaries | exact transcripts of videos | similar to above |

## Next steps

* [Train and deploy a model](how-to-custom-speech-train-model.md)

## Additional resources

* [Prepare and test your data](./how-to-custom-speech-test-and-train.md)
* [Inspect your data](how-to-custom-speech-inspect-data.md)