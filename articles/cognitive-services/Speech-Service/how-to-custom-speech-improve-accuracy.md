---
title: Improve a model for Custom Speech - Speech service
titleSuffix: Azure Cognitive Services
description: Particular kinds of human-labeled transcriptions and related text can improve recognition accuracy for a speech-to-text model based on the speaking scenario.
services: cognitive-services
author: v-demjoh
manager: nitinme

ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/20/2020
ms.author: v-demjoh
---

# Improve Custom Speech accuracy

In this article, you'll learn how to improve the quality of your custom model by adding audio, human-labeled transcripts, and related text.

## Accuracy in different scenarios

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

Additional related text sentences can primarily reduce substitution errors related to misrecognition of common words and domain-specific words by showing them in context. Domain-specific words can be uncommon or made-up words, but their pronunciation must be straightforward to be recognized.

> [!NOTE]
> Avoid related text sentences that include noise such as unrecognizable characters or words.

### Add audio with human-labeled transcripts

Audio with human-labeled transcripts offers the greatest accuracy improvements if the audio comes from the target use case. Samples must cover the full scope of speech. For example, a call center for a retail store would get most calls about swimwear and sunglasses during summer months. Assure that your sample includes the full scope of speech you want to detect.

Consider these details:

* Custom Speech can only capture word context to reduce substitution errors, not insertion or deletion errors.
* Avoid samples that include transcription errors, but do include a diversity of audio quality.
* Avoid sentences that are not related to your problem domain. Unrelated sentences can harm your model.
* When the quality of transcripts vary, you can duplicate exceptionally good sentences (like excellent transcriptions that include key phrases) to increase their weight.

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

- [Train your model](how-to-custom-speech-train-model.md)

## Additional resources

- [Prepare and test your data](how-to-custom-speech-test-data.md)
- [Inspect your data](how-to-custom-speech-inspect-data.md)