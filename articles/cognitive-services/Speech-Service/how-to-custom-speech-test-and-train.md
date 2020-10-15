---
title: "Prepare data for Custom Speech - Speech service"
titleSuffix: Azure Cognitive Services
description: "When testing the accuracy of Microsoft speech recognition or training your custom models, you'll need audio and text data. On this page, we cover the types of data, how to use, and manage them."
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/27/2020
ms.author: trbye
---

# Prepare data for Custom Speech

When testing the accuracy of Microsoft speech recognition or training your custom models, you'll need audio and text data. On this page, we cover the types of data a custom speech model needs.

## Data diversity

Text and audio used to test and train a custom model need to include samples from a diverse set of speakers and scenarios you need your model to recognize.
Consider these factors when gathering data for custom model testing and training:

* Your text and speech audio data need to cover the kinds of verbal statements your users will make when interacting with your model. For example, a model that raises and lowers the temperature needs training on statements people might make to request such changes.
* Your data need to include all speech variances your model will need to recognize. Many factors can vary speech, including accents, dialects, language-mixing, age, gender, voice pitch, stress level, and time of day.
* You must include samples from different environments (indoor, outdoor, road noise) where your model will be used.
* Audio must be gathered using hardware devices the production system will use. If your model needs to identify speech recorded on recording devices of varying quality, the audio data you provide to train your model must also represent these diverse scenarios.
* You can add more data to your model later, but take care to keep the dataset diverse and representative of your project needs.
* Including data that is *not* within your custom model recognition needs can harm recognition quality overall, so do not include data that your model does not need to transcribe.

A model trained on a subset of scenarios can only perform well in those scenarios. Carefully choose data that represents the full scope of scenarios you need your custom model to recognize.

> [!TIP]
> Start with small sets of sample data that match the language and acoustics your model will encounter.
> For example, record a small but representative sample of audio on the same hardware and in the same acoustic environment your model will find in production scenarios.
> Small datasets of representative data can expose problems before you have invested in gathering a much larger datasets for training.

## Data types

This table lists accepted data types, when each data type should be used, and the recommended quantity. Not every data type is required to create a model. Data requirements will vary depending on whether you're creating a test or training a model.

| Data type | Used for testing | Recommended quantity | Used for training | Recommended quantity |
|-----------|-----------------|----------|-------------------|----------|
| [Audio](#audio-data-for-testing) | Yes<br>Used for visual inspection | 5+ audio files | No | N/A |
| [Audio + Human-labeled transcripts](#audio--human-labeled-transcript-data-for-testingtraining) | Yes<br>Used to evaluate accuracy | 0.5-5 hours of audio | Yes | 1-1,000 hours of audio |
| [Related text](#related-text-data-for-training) | No | N/a | Yes | 1-200 MB of related text |

Files should be grouped by type into a dataset and uploaded as a .zip file. Each dataset can only contain a single data type.

> [!TIP]
> To quickly get started, consider using sample data. See this GitHub repository for <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/sampledata/customspeech" target="_target">sample Custom Speech data <span class="docon docon-navigate-external x-hidden-focus"></span></a>

## Upload data

To upload your data, navigate to the <a href="https://speech.microsoft.com/customspeech" target="_blank">Custom Speech portal <span class="docon docon-navigate-external x-hidden-focus"></span></a>. From the portal, click **Upload data** to launch the wizard and create your first dataset. You'll be asked to select a speech data type for your dataset, before allowing you to upload your data.

![Select audio from the Speech Portal](./media/custom-speech/custom-speech-select-audio.png)

Each dataset you upload must meet the requirements for the data type that you choose. Your data must be correctly formatted before it's uploaded. Correctly formatted data ensures it will be accurately processed by the Custom Speech service. Requirements are listed in the following sections.

After your dataset is uploaded, you have a few options:

* You can navigate to the **Testing** tab and visually inspect audio only or audio + human-labeled transcription data.
* You can navigate to the **Training** tab and use audio + human transcription data or related text data to train a custom model.

## Audio data for testing

Audio data is optimal for testing the accuracy of Microsoft's baseline speech-to-text model or a custom model. Keep in mind, audio data is used to inspect the accuracy of speech with regards to a specific model's performance. If you're looking to quantify the accuracy of a model, use [audio + human-labeled transcription data](#audio--human-labeled-transcript-data-for-testingtraining).

Use this table to ensure that your audio files are formatted correctly for use with Custom Speech:

| Property                 | Value                 |
|--------------------------|-----------------------|
| File format              | RIFF (WAV)            |
| Sample rate              | 8,000 Hz or 16,000 Hz |
| Channels                 | 1 (mono)              |
| Maximum length per audio | 2 hours               |
| Sample format            | PCM, 16-bit           |
| Archive format           | .zip                  |
| Maximum archive size     | 2 GB                  |

[!INCLUDE [supported-audio-formats](includes/supported-audio-formats.md)]

> [!TIP]
> When uploading training and testing data, the .zip file size cannot exceed 2 GB. If you require more data for training, divide it into several .zip files and upload them separately. Later, you can choose to train from *multiple* datasets. However, you can only test from a *single* dataset.

Use <a href="http://sox.sourceforge.net" target="_blank" rel="noopener">SoX <span class="docon docon-navigate-external x-hidden-focus"></span></a> to verify audio properties or convert existing audio to the appropriate formats. Below are some examples of how each of these activities can be done through the SoX command line:

| Activity | Description | SoX command |
|----------|-------------|-------------|
| Check audio format | Use this command to check<br>the audio file format. | `sox --i <filename>` |
| Convert audio format | Use this command to convert<br>the audio file to single channel, 16-bit, 16 KHz. | `sox <input> -b 16 -e signed-integer -c 1 -r 16k -t wav <output>.wav` |

## Audio + human-labeled transcript data for testing/training

To measure the accuracy of Microsoft's speech-to-text accuracy when processing your audio files, you must provide human-labeled transcriptions (word-by-word) for comparison. While human-labeled transcription is often time consuming, it's necessary to evaluate accuracy and to train the model for your use cases. Keep in mind, the improvements in recognition will only be as good as the data provided. For that reason, it's important that only high-quality transcripts are uploaded.

Audio files can have silence at the beginning and end of the recording. If possible, include at least a half-second of silence before and after speech in each sample file. While audio with low recording volume or disruptive background noise is not helpful, it should not hurt your custom model. Always consider upgrading your microphones and signal processing hardware before gathering audio samples.

| Property                 | Value                               |
|--------------------------|-------------------------------------|
| File format              | RIFF (WAV)                          |
| Sample rate              | 8,000 Hz or 16,000 Hz               |
| Channels                 | 1 (mono)                            |
| Maximum length per audio | 2 hours (testing) / 60 s (training) |
| Sample format            | PCM, 16-bit                         |
| Archive format           | .zip                                |
| Maximum zip size         | 2 GB                                |

[!INCLUDE [supported-audio-formats](includes/supported-audio-formats.md)]

> [!NOTE]
> When uploading training and testing data, the .zip file size cannot exceed 2 GB. You can only test from a *single* dataset, be sure to keep it within the appropriate file size. Additionally, each training file cannot exceed 60 seconds otherwise it will error out.

To address issues like word deletion or substitution, a significant amount of data is required to improve recognition. Generally, it's recommended to provide word-by-word transcriptions for roughly 10 to 1,000 hours of audio. The transcriptions for all WAV files should be contained in a single plain-text file. Each line of the transcription file should contain the name of one of the audio files, followed by the corresponding transcription. The file name and transcription should be separated by a tab (\t).

  For example:
```
  speech01.wav  speech recognition is awesome
  speech02.wav  the quick brown fox jumped all over the place
  speech03.wav  the lazy dog was not amused
```

> [!IMPORTANT]
> Transcription should be encoded as UTF-8 byte order mark (BOM).

The transcriptions are text-normalized so they can be processed by the system. However, there are some important normalizations that must be done before uploading the data to the Speech Studio. For the appropriate language to use when you prepare your transcriptions, see [How to create a human-labeled transcription](how-to-custom-speech-human-labeled-transcriptions.md)

After you've gathered your audio files and corresponding transcriptions, package them as a single .zip file before uploading to the <a href="https://speech.microsoft.com/customspeech" target="_blank">Custom Speech portal <span class="docon docon-navigate-external x-hidden-focus"></span></a>. Below is an example dataset with three audio files and a human-labeled transcription file:

> [!div class="mx-imgBorder"]
> ![Select audio from the Speech Portal](./media/custom-speech/custom-speech-audio-transcript-pairs.png)

## Related text data for training

Product names or features that are unique, should include related text data for training. Related text helps ensure correct recognition. Two types of related text data can be provided to improve recognition:

| Data type | How this data improves recognition |
|-----------|------------------------------------|
| Sentences (utterances) | Improve accuracy when recognizing product names, or industry-specific vocabulary within the context of a sentence. |
| Pronunciations | Improve pronunciation of uncommon terms, acronyms, or other words with undefined pronunciations. |

Sentences can be provided as a single text file or multiple text files. To improve accuracy, use text data that is closer to the expected spoken utterances. Pronunciations should be provided as a single text file. Everything can be packaged as a single zip file and uploaded to the <a href="https://speech.microsoft.com/customspeech" target="_blank">Custom Speech portal <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

### Guidelines to create a sentences file

To create a custom model using sentences, you'll need to provide a list of sample utterances. Utterances _do not_ need to be complete or grammatically correct, but they must accurately reflect the spoken input you expect in production. If you want certain terms to have increased weight, add several sentences that include these specific terms.

As general guidance, model adaptation is most effective when the training text is as close as possible to the real text expected in production. Domain-specific jargon and phrases that you're targeting to enhance, should be included in training text. When possible, try to have one sentence or keyword controlled on a separate line. For keywords and phrases that are important to you (for example, product names), you can copy them a few times. But keep in mind, don't copy too much - it could affect the overall recognition rate.

Use this table to ensure that your related data file for utterances is formatted correctly:

| Property | Value |
|----------|-------|
| Text encoding | UTF-8 BOM |
| # of utterances per line | 1 |
| Maximum file size | 200 MB |

Additionally, you'll want to account for the following restrictions:

* Avoid repeating characters more than four times. For example: "aaaa" or "uuuu".
* Don't use special characters or UTF-8 characters above `U+00A1`.
* URIs will be rejected.

### Guidelines to create a pronunciation file

If there are uncommon terms without standard pronunciations that your users will encounter or use, you can provide a custom pronunciation file to improve recognition.

> [!IMPORTANT]
> It is not recommended to use custom pronunciation files to alter the pronunciation of common words.

This includes examples of a spoken utterance, and a custom pronunciation for each:

| Recognized/displayed form | Spoken form |
|--------------|--------------------------|
| 3CPO | three c p o |
| CNTK | c n t k |
| IEEE | i triple e |

The spoken form is the phonetic sequence spelled out. It can be composed of letter, words, syllables, or a combination of all three.

Customized pronunciation is available in English (`en-US`) and German (`de-DE`). This table shows supported characters by language:

| Language | Locale | Characters |
|----------|--------|------------|
| English | `en-US` | `a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z` |
| German | `de-DE` | `ä, ö, ü, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z` |

Use the following table to ensure that your related data file for pronunciations is correctly formatted. Pronunciation files are small, and should only be a few kilobytes in size.

| Property | Value |
|----------|-------|
| Text encoding | UTF-8 BOM (ANSI is also supported for English) |
| # of pronunciations per line | 1 |
| Maximum file size | 1 MB (1 KB for free tier) |

## Next steps

* [Inspect your data](how-to-custom-speech-inspect-data.md)
* [Evaluate your data](how-to-custom-speech-evaluate-data.md)
* [Train your model](how-to-custom-speech-train-model.md)
* [Deploy your model](how-to-custom-speech-deploy-model.md)
