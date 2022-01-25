---
title: "Prepare data for Custom Speech - Speech service"
titleSuffix: Azure Cognitive Services
description: Learn about types of data for a Custom Speech model, along with how to use and manage that data.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: eur
ms.custom: ignite-fall-2021
---

# Prepare data for Custom Speech

When you're testing the accuracy of Microsoft speech recognition or training your custom models, you need audio and text data. This article covers the types of data that a Custom Speech model needs.

## Data diversity

Text and audio that you use to test and train a custom model need to include samples from a diverse set of speakers and scenarios that you want your model to recognize. Consider these factors when you're gathering data for custom model testing and training:

* Your text and speech audio data needs to cover the kinds of verbal statements that your users will make when they're interacting with your model. For example, a model that raises and lowers the temperature needs training on statements that people might make to request such changes.
* Your data needs to include all speech variances that you want your model to recognize. Many factors can vary speech, including accents, dialects, language-mixing, age, gender, voice pitch, stress level, and time of day.
* You must include samples from different environments (indoor, outdoor, road noise) where your model will be used.
* You must gather audio by using hardware devices that the production system will use. If your model needs to identify speech recorded on recording devices of varying quality, the audio data that you provide to train your model must also represent these diverse scenarios.
* You can add more data to your model later, but take care to keep the dataset diverse and representative of your project needs.
* Including data that's *not* within your custom model's recognition needs can harm recognition quality overall. Include only data that your model needs to transcribe.

A model that's trained on a subset of scenarios can perform well in only those scenarios. Carefully choose data that represents the full scope of scenarios that you need your custom model to recognize.

> [!TIP]
> Start with small sets of sample data that match the language and acoustics that your model will encounter. For example, record a small but representative sample of audio on the same hardware and in the same acoustic environment that your model will find in production scenarios. Small datasets of representative data can expose problems before you invest in gathering larger datasets for training.
>
> To quickly get started, consider using sample data. For sample Custom Speech data, see <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/sampledata/customspeech" target="_target">this GitHub repository</a>.

## Data types

The following table lists accepted data types, when each data type should be used, and the recommended quantity. Not every data type is required to create a model. Data requirements will vary depending on whether you're creating a test or training a model.

| Data type | Used for testing | Recommended quantity | Used for training | Recommended quantity |
|-----------|-----------------|----------|-------------------|----------|
| [Audio only](#audio-data-for-testing) | Yes (visual inspection) | 5+ audio files | No | Not applicable |
| [Audio + human-labeled transcripts](#audio--human-labeled-transcript-data-for-training-or-testing) | Yes (evaluation of accuracy) | 0.5-5 hours of audio | Yes | 1-20 hours of audio |
| [Plain text](#plain-text-data-for-training) | No | Not applicable | Yes | 1-200 MB of related text |
| [Structured text](#structured-text-data-for-training-public-preview) (public preview) | No | Not applicable | Yes | Up to 10 classes with up to 4,000 items and up to 50,000 training sentences |
| [Pronunciation](#pronunciation-data-for-training) | No | Not applicable | Yes | 1 KB to 1 MB of pronunciation text |

Files should be grouped by type into a dataset and uploaded as a .zip file. Each dataset can contain only a single data type.

> [!TIP]
> When you train a new model, start with plain-text data or structured-text data. This data will improve the recognition of special terms and phrases. Training with text is much faster than training with audio (minutes versus days).

### Training with audio data

Not all base models support [training with audio data](language-support.md#speech-to-text). If a base model doesn't support it, the Speech service will use only the text from the transcripts and ignore the audio. For a list of base models that support training with audio data, see [Language support](language-support.md#speech-to-text). 

Even if a base model supports training with audio data, the service might use only part of the audio. But it will use all the transcripts.

If you change the base model that's used for training, and you have audio in the training dataset, *always* check whether the new selected base model supports training with audio data. If the previously used base model did not support training with audio data, and the training dataset contains audio, training time with the new base model will drastically increase. It could easily go from several hours to several days and more. This is especially true if your Speech service subscription is *not* in a [region with the dedicated hardware](custom-speech-overview.md#set-up-your-azure-account) for training.

If you face the problem described in the previous paragraph, you can quickly decrease the training time by reducing the amount of audio in the dataset or removing it completely and leaving only the text. 

In regions with dedicated hardware for training, the Speech service will use up to 20 hours of audio for training. In other regions, it will only use up to 8 hours of audio.

### Supported locales

Training with structured text is supported only for these locales: 

* en-US
* en-UK
* en-IN
* de-DE
* fr-FR
* fr-CA
* es-ES
* es-MX

You must use the latest base model for these locales. 

For locales that don't support training with structured text, the service will take any training sentences that don't reference any classes as part of training with plain-text data.

## Upload data

To upload your data:

1. Go to [Speech Studio](https://aka.ms/speechstudio/customspeech). 
1. After you create a project, go to the **Speech datasets** tab. Select **Upload data** to start the wizard and create your first dataset. 
1. Select a speech data type for your dataset, and upload your data.

1. Specify whether the dataset will be used for **Training** or **Testing**. 

   There are many types of data that can be uploaded and used for **Training** or **Testing**. Each dataset that you upload must be correctly formatted before uploading, and it must meet the requirements for the data type that you choose. Requirements are listed in the following sections.

1. After your dataset is uploaded, you can either:

   * Go to the **Train custom models** tab to train a custom model.
   * Go to the **Test models** tab to visually inspect quality with audio-only data or evaluate accuracy with audio + human-labeled transcription data.

### Upload data by using Speech-to-text REST API v3.0

You can use [Speech-to-text REST API v3.0](rest-speech-to-text.md#speech-to-text-rest-api-v30) to automate any operations related to your custom models. In particular, you can use the REST API to upload a dataset.

To create and upload a dataset, use a [Create Dataset](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateDataset) request.

A dataset that you create by using the Speech-to-text REST API v3.0 will *not* be connected to any of the Speech Studio projects, unless you specify a special parameter in the request body (see the code block later in this section). Connection with a Speech Studio project is *not* required for any model customization operations, if you perform them by using the REST API.

When you log on to Speech Studio, its user interface will notify you when any unconnected object is found (like datasets uploaded through the REST API without any project reference). The interface will also offer to connect such objects to an existing project. 

To connect the new dataset to an existing project in Speech Studio during its upload, use [Create Dataset](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateDataset) and fill out the request body according to the following format:

```json
{
  "kind": "Acoustic",
  "contentUrl": "https://contoso.com/mydatasetlocation",
  "locale": "en-US",
  "displayName": "My speech dataset name",
  "description": "My speech dataset description",
  "project": {
    "self": "https://westeurope.api.cognitive.microsoft.com/speechtotext/v3.0/projects/c1c643ae-7da5-4e38-9853-e56e840efcb2"
  }
}
```

You can obtain the project URL that's required for the `project` element by using the [Get Projects](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetProjects) request.

## Audio + human-labeled transcript data for training or testing

You can use audio + human-labeled transcript data for both training and testing purposes. You must provide human-labeled transcriptions (word by word) for comparison:

- To improve the acoustic aspects like slight accents, speaking styles, and background noises.
- To measure the accuracy of Microsoft's speech-to-text accuracy when it's processing your audio files. 

Although human-labeled transcription is often time consuming, it's necessary to evaluate accuracy and to train the model for your use cases. Keep in mind that the improvements in recognition will only be as good as the data that you provide. For that reason, it's important to upload only high-quality transcripts.

Audio files can have silence at the beginning and end of the recording. If possible, include at least a half-second of silence before and after speech in each sample file. Although audio with low recording volume or disruptive background noise is not helpful, it shouldn't hurt your custom model. Always consider upgrading your microphones and signal processing hardware before gathering audio samples.

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
> When you're uploading training and testing data, the .zip file size can't exceed 2 GB. You can test from only a *single* dataset, so be sure to keep it within the appropriate file size. Additionally, each training file can't exceed 60 seconds, or it will error out.

To address problems like word deletion or substitution, a significant amount of data is required to improve recognition. Generally, we recommend that you provide word-by-word transcriptions for 1 to 20 hours of audio. However, even as little as 30 minutes can help improve recognition results. 

The transcriptions for all WAV files are contained in a single plain-text file. Each line of the transcription file contains the name of one of the audio files, followed by the corresponding transcription. The file name and transcription are separated by a tab (`\t`).

For example:

```tsv
speech01.wav	speech recognition is awesome
speech02.wav	the quick brown fox jumped all over the place
speech03.wav	the lazy dog was not amused
```

> [!IMPORTANT]
> Transcription should be encoded as UTF-8 byte order mark (BOM).

The transcriptions are text-normalized so the system can process them. However, you must do some important normalizations before you upload the data to <a href="https://speech.microsoft.com/customspeech" target="_blank">Speech Studio</a>. For the appropriate language to use when you prepare your transcriptions, see [How to create human-labeled transcriptions](how-to-custom-speech-human-labeled-transcriptions.md).

After you've gathered your audio files and corresponding transcriptions, package them as a single .zip file before uploading to Speech Studio. The following example dataset has three audio files and a human-labeled transcription file:

> [!div class="mx-imgBorder"]
> ![Screenshot that shows audio files and a transcription file in Speech Studio.](./media/custom-speech/custom-speech-audio-transcript-pairs.png)

For a list of recommended regions for your Speech service subscriptions, see [Set up your Azure account](custom-speech-overview.md#set-up-your-azure-account). Setting up the Speech subscriptions in one of these regions will reduce the time it takes to train the model. In these regions, training can process about 10 hours of audio per day, compared to just 1 hour per day in other regions. If model training can't be completed within a week, the model will be marked as failed.

Not all base models support training with audio data. If the base model doesn't support it, the service will ignore the audio and just train with the text of the transcriptions. In this case, training will be the same as training with related text. For a list of base models that support training with audio data, see [Language support](language-support.md#speech-to-text).

## Plain-text data for training

You can use domain-related sentences to improve accuracy in recognizing product names or industry-specific jargon. Provide sentences in a single text file. To improve accuracy, use text data that's closer to the expected spoken utterances. Training with plain text usually finishes within a few minutes.

To create a custom model by using sentences, you'll need to provide a list of sample utterances. Utterances _do not_ need to be complete or grammatically correct, but they must accurately reflect the spoken input that you expect in production. If you want certain terms to have increased weight, add several sentences that include these specific terms.

As general guidance, model adaptation is most effective when the training text is as close as possible to the real text expected in production. Domain-specific jargon and phrases that you're targeting to enhance should be included in training text. When possible, try to have one sentence or keyword controlled on a separate line. For keywords and phrases that are important to you (for example, product names), you can copy them a few times. But don't copy too much - it could affect the overall recognition rate.

Use this table to ensure that your related data file for utterances is formatted correctly:

| Property | Value |
|----------|-------|
| Text encoding | UTF-8 BOM |
| Number of utterances per line | 1 |
| Maximum file size | 200 MB |

You'll also want to account for the following restrictions:

* Avoid repeating characters, words, or groups of words more than three times, as in "aaaa," "yeah yeah yeah yeah," or "that's it that's it that's it that's it." The Speech service might drop lines with too many repetitions.
* Don't use special characters or UTF-8 characters above `U+00A1`.
* URIs will be rejected.
* For some languages (for example, Japanese or Korean), importing large amounts of text data can take a long time or can time out. Consider dividing the uploaded data into text files of up to 20,000 lines each.

## Structured-text data for training (public preview)

Expected utterances often follow a certain pattern. One common pattern is that utterances differ only by words or phrases from a list. Examples of this pattern could be:

* "I have a question about `product`," where `product` is a list of possible products. 
* "Make that `object` `color`," where `object` is a list of geometric shapes and `color` is a list of colors. 

To simplify the creation of training data and to enable better modeling inside the Custom Language model, you can use a structured text in Markdown format to define lists of items. You can then reference these lists inside your training utterances. The Markdown format also supports specifying the phonetic pronunciation of words. 

The Markdown file should have an .md extension. The syntax of the Markdown is the same as that from the Language Understanding models, in particular list entities and example utterances. For more information about the complete Markdown syntax, see the <a href="/azure/bot-service/file-format/bot-builder-lu-file-format" target="_blank"> Language Understanding Markdown</a>.

Here's an example of the Markdown format:

```markdown
// This is a comment

// Here are three separate lists of items that can be referenced in an example sentence. You can have up to 10 of these.
@ list food =
- pizza
- burger
- ice cream
- soda

@ list pet =
- cat
- dog

@ list sports =
- soccer
- tennis
- cricket
- basketball
- baseball
- football

// This is a list of phonetic pronunciations. 
// This adjusts the pronunciation of every instance of these words in a list or example training sentences. 
@ speech:phoneticlexicon
- cat/k ae t
- cat/f i l ai n

// Here are example training sentences. They are grouped into two sections to help organize them.
// You can refer to one of the lists we declared earlier by using {@listname}. You can refer to multiple lists in the same training sentence.
// A training sentence does not have to refer to a list.
# SomeTrainingSentence
- you can include sentences without a class reference
- what {@pet} do you have
- I like eating {@food} and playing {@sports}
- my {@pet} likes {@food}

# SomeMoreSentence
- you can include more sentences without a class reference
- or more sentences that have a class reference like {@pet} 
```

Like plain text, training with structured text typically takes a few minutes. Also, your example sentences and lists should reflect the type of spoken input that you expect in production. For pronunciation entries, see the description of the [Universal Phone Set](phone-sets.md).

The following table specifies the limits and other properties for the Markdown format:

| Property | Value |
|----------|-------|
| Text encoding | UTF-8 BOM |
| Maximum file size | 200 MB |
| Maximum number of example sentences | 50,000 |
| Maximum number of list classes | 10 |
| Maximum number of items in a list class | 4,000 |
| Maximum number of `speech:phoneticlexicon` entries | 15,000 |
| Maximum number of pronunciations per word | 2 |


## Pronunciation data for training

If there are uncommon terms without standard pronunciations that your users will encounter or use, you can provide a custom pronunciation file to improve recognition. For a list of languages that support custom pronunciation, see **Pronunciation** in the **Customizations** column in [the Speech-to-text table](language-support.md#speech-to-text).

> [!IMPORTANT]
> We don't recommend that you use custom pronunciation files to alter the pronunciation of common words.

> [!NOTE]
> You can't combine this type of pronunciation file with structured-text training data. For structured-text data, use the phonetic pronunciation capability that's included in the structured-text Markdown format.

Provide pronunciations in a single text file. This file includes examples of a spoken utterance and a custom pronunciation for each:

| Recognized/displayed form | Spoken form |
|--------------|--------------------------|
| 3CPO | three c p o |
| CNTK | c n t k |
| IEEE | i triple e |

The spoken form is the phonetic sequence spelled out. It can be composed of letters, words, syllables, or a combination of all three.

Use the following table to ensure that your related data file for pronunciations is correctly formatted. Pronunciation files are small and should be only a few kilobytes in size.

| Property | Value |
|----------|-------|
| Text encoding | UTF-8 BOM (ANSI is also supported for English) |
| Number of pronunciations per line | 1 |
| Maximum file size | 1 MB (1 KB for free tier) |

## Audio data for testing

Audio data is optimal for testing the accuracy of Microsoft's baseline speech-to-text model or a custom model. Keep in mind that audio data is used to inspect the accuracy of speech with regard to a specific model's performance. If you want to quantify the accuracy of a model, use [audio + human-labeled transcripts](#audio--human-labeled-transcript-data-for-training-or-testing).

Custom Speech requires audio files with these properties:

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

> [!NOTE]
> When you're uploading training and testing data, the .zip file size can't exceed 2 GB. If you require more data for training, divide it into several .zip files and upload them separately. Later, you can choose to train from *multiple* datasets. However, you can test from only a *single* dataset.

Use <a href="http://sox.sourceforge.net" target="_blank" rel="noopener">SoX</a> to verify audio properties or convert existing audio to the appropriate formats. Here are some example SoX commands:

| Activity | SoX command |
|---------|-------------|
| Check the audio file format. | `sox --i <filename>` |
| Convert the audio file to single channel, 16-bit, 16 KHz. | `sox <input> -b 16 -e signed-integer -c 1 -r 16k -t wav <output>.wav` |

## Next steps

* [Inspect your data](how-to-custom-speech-inspect-data.md)
* [Evaluate your data](how-to-custom-speech-evaluate-data.md)
* [Train a custom model](how-to-custom-speech-train-model.md)
* [Deploy a model](./how-to-custom-speech-train-model.md)
