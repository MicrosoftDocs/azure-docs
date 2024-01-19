---
title: "Training and testing datasets - Speech service"
titleSuffix: Azure AI services
description: Learn about types of training and testing data for a Custom Speech project, along with how to use and manage that data.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 10/24/2022
ms.author: eur
ms.custom: ignite-fall-2021
---

# Training and testing datasets

In a Custom Speech project, you can upload datasets for training, qualitative inspection, and quantitative measurement. This article covers the types of training and testing data that you can use for Custom Speech.

Text and audio that you use to test and train a custom model should include samples from a diverse set of speakers and scenarios that you want your model to recognize. Consider these factors when you're gathering data for custom model testing and training:

* Include text and audio data to cover the kinds of verbal statements that your users will make when they're interacting with your model. For example, a model that raises and lowers the temperature needs training on statements that people might make to request such changes.
* Include all speech variances that you want your model to recognize. Many factors can vary speech, including accents, dialects, language-mixing, age, gender, voice pitch, stress level, and time of day.
* Include samples from different environments, for example, indoor, outdoor, and road noise, where your model will be used.
* Record audio with hardware devices that the production system will use. If your model must identify speech recorded on devices of varying quality, the audio data that you provide to train your model must also represent these diverse scenarios.
* Keep the dataset diverse and representative of your project requirements. You can add more data to your model later. 
* Only include data that your model needs to transcribe. Including data that isn't within your custom model's recognition requirements can harm recognition quality overall. 

## Data types

The following table lists accepted data types, when each data type should be used, and the recommended quantity. Not every data type is required to create a model. Data requirements will vary depending on whether you're creating a test or training a model.

| Data type | Used for testing | Recommended for testing | Used for training | Recommended for training |
|-----------|-----------------|----------|-------------------|----------|
| [Audio only](#audio-data-for-training-or-testing) | Yes (visual inspection) | 5+ audio files | Yes (Preview for `en-US`) | 1-20 hours of audio |
| [Audio + human-labeled transcripts](#audio--human-labeled-transcript-data-for-training-or-testing) | Yes (evaluation of accuracy) | 0.5-5 hours of audio | Yes | 1-20 hours of audio |
| [Plain text](#plain-text-data-for-training) | No | Not applicable | Yes | 1-200 MB of related text |
| [Structured text](#structured-text-data-for-training) | No | Not applicable | Yes | Up to 10 classes with up to 4,000 items and up to 50,000 training sentences |
| [Pronunciation](#pronunciation-data-for-training) | No | Not applicable | Yes | 1 KB to 1 MB of pronunciation text |
| [Display format](#custom-display-text-formatting-data-for-training) | No | Not applicable | Yes | Up to 200 lines for ITN, 1,000 lines for rewrite, 1,000 lines for profanity filter |

Training with plain text or structured text usually finishes within a few minutes. 

> [!TIP]
> Start with plain-text data or structured-text data. This data will improve the recognition of special terms and phrases. Training with text is much faster than training with audio (minutes versus days).
> 
> Start with small sets of sample data that match the language, acoustics, and hardware where your model will be used. Small datasets of representative data can expose problems before you invest in gathering larger datasets for training. For sample Custom Speech data, see <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/sampledata/customspeech" target="_target">this GitHub repository</a>.

If you will train a custom model with audio data, choose a Speech resource region with dedicated hardware for training audio data. See footnotes in the [regions](regions.md#speech-service) table for more information. In regions with dedicated hardware for Custom Speech training, the Speech service will use up to 20 hours of your audio training data, and can process about 10 hours of data per day. In other regions, the Speech service uses up to 8 hours of your audio data, and can process about 1 hour of data per day. After the model is trained, you can copy the model to another region as needed with the [Models_CopyTo](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_CopyTo) REST API.

## Consider datasets by scenario

A model that's trained on a subset of scenarios can perform well in only those scenarios. Carefully choose data that represents the full scope of scenarios that you need your custom model to recognize. The following table shows datasets to consider for some speech recognition scenarios:

| Scenario | Plain text data and structured text data | Audio + human-labeled transcripts | New words with pronunciation |
|--- |--- |--- |--- |
| Call center | Marketing documents, website, product reviews related to call center activity | Call center calls transcribed by humans | Terms that have ambiguous pronunciations (see the *Xbox* example in the preceding section) |
| Voice assistant | Lists of sentences that use various combinations of commands and entities | Recorded voices speaking commands into device, transcribed into text | Names (movies, songs, products) that have unique pronunciations |
| Dictation  | Written input, such as instant messages or emails | Similar to preceding examples | Similar to preceding examples |
| Video closed captioning | TV show scripts, movies, marketing content, video summaries | Exact transcripts of videos | Similar to preceding examples |

To help determine which dataset to use to address your problems, refer to the following table:

| Use case | Data type |
| -------- | --------- |
| Improve recognition accuracy on industry-specific vocabulary and grammar, such as medical terminology or IT jargon. | Plain text or structured text data |
| Define the phonetic and displayed form of a word or term that has nonstandard pronunciation, such as product names or acronyms. | Pronunciation data or phonetic pronunciation in structured text |
| Improve recognition accuracy on speaking styles, accents, or specific background noises. | Audio + human-labeled transcripts |

## Audio + human-labeled transcript data for training or testing

You can use audio + human-labeled transcript data for both [training](how-to-custom-speech-train-model.md) and [testing](how-to-custom-speech-evaluate-data.md) purposes. You must provide human-labeled transcriptions (word by word) for comparison:

- To improve the acoustic aspects like slight accents, speaking styles, and background noises.
- To measure the accuracy of Microsoft's speech to text accuracy when it's processing your audio files. 

For a list of base models that support training with audio data, see [Language support](language-support.md?tabs=stt). Even if a base model does support training with audio data, the service might use only part of the audio. And it will still use all the transcripts.

> [!IMPORTANT]
> If a base model doesn't support customization with audio data, only the transcription text will be used for training. If you switch to a base model that supports customization with audio data, the training time may increase from several hours to several days. The change in training time would be most noticeable when you switch to a base model in a [region](regions.md#speech-service) without dedicated hardware for training. If the audio data is not required, you should remove it to decrease the training time. 

Audio with human-labeled transcripts offers the greatest accuracy improvements if the audio comes from the target use case. Samples must cover the full scope of speech. For example, a call center for a retail store would get the most calls about swimwear and sunglasses during summer months. Ensure that your sample includes the full scope of speech that you want to detect.

Consider these details:

* Training with audio will bring the most benefits if the audio is also hard to understand for humans. In most cases, you should start training by using only related text.
* If you use one of the most heavily used languages, such as US English, it's unlikely that you would need to train with audio data. For such languages, the base models already offer very good recognition results in most scenarios, so it's probably enough to train with related text.
* Custom Speech can capture word context only to reduce substitution errors, not insertion or deletion errors.
* Avoid samples that include transcription errors, but do include a diversity of audio quality.
* Avoid sentences that are unrelated to your problem domain. Unrelated sentences can harm your model.
* When the transcript quality varies, you can duplicate exceptionally good sentences, such as excellent transcriptions that include key phrases, to increase their weight.
* The Speech service automatically uses the transcripts to improve the recognition of domain-specific words and phrases, as though they were added as related text.
* It can take several days for a training operation to finish. To improve the speed of training, be sure to create your Speech service subscription in a region that has dedicated hardware for training.

A large training dataset is required to improve recognition. Generally, we recommend that you provide word-by-word transcriptions for 1 to 20 hours of audio. However, even as little as 30 minutes can help improve recognition results. Although creating human-labeled transcription can take time, improvements in recognition will only be as good as the data that you provide. You should upload only high-quality transcripts.

Audio files can have silence at the beginning and end of the recording. If possible, include at least a half-second of silence before and after speech in each sample file. Although audio with low recording volume or disruptive background noise is not helpful, it shouldn't limit or degrade your custom model. Always consider upgrading your microphones and signal processing hardware before gathering audio samples.

> [!IMPORTANT]
> For more information about the best practices of preparing human-labeled transcripts, see [Human-labeled transcripts with audio](how-to-custom-speech-human-labeled-transcriptions.md). 

Custom Speech projects require audio files with these properties:

> [!IMPORTANT]
> These are requirements for Audio + human-labeled transcript training and testing. They differ from the ones for Audio only training and testing. If you want to use Audio only training and testing, [see this section](#audio-data-for-training-or-testing).

| Property                 | Value                               |
|--------------------------|-------------------------------------|
| File format              | RIFF (WAV)                          |
| Sample rate              | 8,000 Hz or 16,000 Hz               |
| Channels                 | 1 (mono)                            |
| Maximum length per audio | 2 hours (testing) / 60 s (training)<br/><br/>Training with audio has a maximum audio length of 60 seconds per file. For audio files longer than 60 seconds, only the corresponding transcription files will be used for training. If all audio files are longer than 60 seconds, the training will fail.|
| Sample format            | PCM, 16-bit                         |
| Archive format           | .zip                                |
| Maximum zip size         | 2 GB or 10,000 files                |

## Plain-text data for training

You can add plain text sentences of related text to improve the recognition of domain-specific words and phrases. Related text sentences can reduce substitution errors related to misrecognition of common words and domain-specific words by showing them in context. Domain-specific words can be uncommon or made-up words, but their pronunciation must be straightforward to be recognized.

Provide domain-related sentences in a single text file. Use text data that's close to the expected spoken utterances. Utterances don't need to be complete or grammatically correct, but they must accurately reflect the spoken input that you expect the model to recognize. When possible, try to have one sentence or keyword controlled on a separate line. To increase the weight of a term such as product names, add several sentences that include the term. But don't copy too much - it could affect the overall recognition rate.

> [!NOTE]
> Avoid related text sentences that include noise such as unrecognizable characters or words.

Use this table to ensure that your plain text dataset file is formatted correctly:

| Property | Value |
|----------|-------|
| Text encoding | UTF-8 BOM |
| Number of utterances per line | 1 |
| Maximum file size | 200 MB |

You must also adhere to the following restrictions:

* Avoid repeating characters, words, or groups of words more than three times, as in "aaaa," "yeah yeah yeah yeah," or "that's it that's it that's it that's it." The Speech service might drop lines with too many repetitions.
* Don't use special characters or UTF-8 characters above `U+00A1`.
* URIs will be rejected.
* For some languages such as Japanese or Korean, importing large amounts of text data can take a long time or can time out. Consider dividing the dataset into multiple text files with up to 20,000 lines in each.

## Structured-text data for training

> [!NOTE]
> Structured-text data for training is in public preview.

Use structured text data when your data follows a particular pattern in particular utterances that differ only by words or phrases from a list. To simplify the creation of training data and to enable better modeling inside the Custom Language model, you can use a structured text in Markdown format to define lists of items and phonetic pronunciation of words. You can then reference these lists inside your training utterances. 

Expected utterances often follow a certain pattern. One common pattern is that utterances differ only by words or phrases from a list. Examples of this pattern could be:

* "I have a question about `product`," where `product` is a list of possible products. 
* "Make that `object` `color`," where `object` is a list of geometric shapes and `color` is a list of colors. 

For a list of supported base models and locales for training with structured text, see [Language support](language-support.md?tabs=stt). You must use the latest base model for these locales. For locales that don't support training with structured text, the service will take any training sentences that don't reference any classes as part of training with plain-text data. 

The structured-text file should have an .md extension. The maximum file size is 200 MB, and the text encoding must be UTF-8 BOM. The syntax of the Markdown is the same as that from the Language Understanding models, in particular list entities and example utterances. For more information about the complete Markdown syntax, see the <a href="/azure/bot-service/file-format/bot-builder-lu-file-format" target="_blank"> Language Understanding Markdown</a>. 

Here are key details about the supported Markdown format:

| Property | Description | Limits |
|----------|-------|--------|
|`@list`|A list of items that can be referenced in an example sentence.|Maximum of 20 lists. Maximum of 35,000 items per list.|
|`speech:phoneticlexicon`|A list of phonetic pronunciations according to the [Universal Phone Set](customize-pronunciation.md). Pronunciation is adjusted for each instance where the word appears in a list or training sentence. For example, if you have a word that sounds like "cat" and you want to adjust the pronunciation to "k ae t", you would add `- cat/k ae t` to the `speech:phoneticlexicon` list.|Maximum of 15,000 entries. Maximum of 2 pronunciations per word.|
|`#ExampleSentences`|A pound symbol (`#`) delimits a section of example sentences. The section heading can only contain letters, digits, and underscores. Example sentences should reflect the range of speech that your model should expect. A training sentence can refer to items under a `@list` by using surrounding left and right curly braces (`{@list name}`). You can refer to multiple lists in the same training sentence, or none at all.|Maximum file size of 200MB.|
|`//`|Comments follow a double slash (`//`).|Not applicable|

Here's an example structured text file:

```markdown
// This is a comment because it follows a double slash (`//`).

// Here are three separate lists of items that can be referenced in an example sentence. You can have up to 10 of these.
@ list food =
- pizza
- burger
- ice cream
- soda

@ list pet =
- cat
- dog
- fish

@ list sports =
- soccer
- tennis
- cricket
- basketball
- baseball
- football

// List of phonetic pronunciations
@ speech:phoneticlexicon
- cat/k ae t
- fish/f ih sh

// Here are two sections of training sentences. 
#TrainingSentences_Section1
- you can include sentences without a class reference
- what {@pet} do you have
- I like eating {@food} and playing {@sports}
- my {@pet} likes {@food}

#TrainingSentences_Section2
- you can include more sentences without a class reference
- or more sentences that have a class reference like {@pet} 
``` 

## Pronunciation data for training

Specialized or made up words might have unique pronunciations. These words can be recognized if they can be broken down into smaller words to pronounce them. For example, to recognize "Xbox", pronounce it as "X box". This approach won't increase overall accuracy, but can improve recognition of this and other keywords.

You can provide a custom pronunciation file to improve recognition. Don't use custom pronunciation files to alter the pronunciation of common words. For a list of languages that support custom pronunciation, see [language support](language-support.md?tabs=stt).

> [!NOTE]
> You can use a pronunciation file alongside any other training dataset except structured text training data. To use pronunciation data with structured text, it must be within a structured text file.

The spoken form is the phonetic sequence spelled out. It can be composed of letters, words, syllables, or a combination of all three. This table includes some examples:

| Recognized displayed form | Spoken form |
|--------------|--------------------------|
| 3CPO | three c p o |
| CNTK | c n t k |
| IEEE | i triple e |

You provide pronunciations in a single text file. Include the spoken utterance and a custom pronunciation for each. Each row in the file should begin with the recognized form, then a tab character, and then the space-delimited phonetic sequence. 

```tsv
3CPO    three c p o
CNTK    c n t k
IEEE    i triple e
```

Refer to the following table to ensure that your pronunciation dataset files are valid and correctly formatted. 

| Property | Value |
|----------|-------|
| Text encoding | UTF-8 BOM (ANSI is also supported for English) |
| Number of pronunciations per line | 1 |
| Maximum file size | 1 MB (1 KB for free tier) |

### Audio data for training or testing

Audio data is optimal for testing the accuracy of Microsoft's baseline speech to text model or a custom model. Keep in mind that audio data is used to inspect the accuracy of speech with regard to a specific model's performance. If you want to quantify the accuracy of a model, use [audio + human-labeled transcripts](#audio--human-labeled-transcript-data-for-training-or-testing).

> [!NOTE]
> Audio only data for training is available in preview for the `en-US` locale. For other locales, to train with audio data you must also provide [human-labeled transcripts](#audio--human-labeled-transcript-data-for-training-or-testing).

Custom Speech projects require audio files with these properties:

> [!IMPORTANT]
> These are requirements for Audio only training and testing. They differ from the ones for Audio + human-labeled transcript training and testing. If you want to use Audio + human-labeled transcript training and testing, [see this section](#audio--human-labeled-transcript-data-for-training-or-testing).

| Property                 | Value                 |
|--------------------------|-----------------------|
| File format              | RIFF (WAV)            |
| Sample rate              | 8,000 Hz or 16,000 Hz |
| Channels                 | 1 (mono)              |
| Maximum length per audio | 2 hours               |
| Sample format            | PCM, 16-bit           |
| Archive format           | .zip                  |
| Maximum archive size     | 2 GB or 10,000 files  |

> [!NOTE]
> When you're uploading training and testing data, the .zip file size can't exceed 2 GB. If you require more data for training, divide it into several .zip files and upload them separately. Later, you can choose to train from *multiple* datasets. However, you can test from only a *single* dataset.

Use <a href="http://sox.sourceforge.net" target="_blank" rel="noopener">SoX</a> to verify audio properties or convert existing audio to the appropriate formats. Here are some example SoX commands:

| Activity | SoX command |
|---------|-------------|
| Check the audio file format. | `sox --i <filename>` |
| Convert the audio file to single channel, 16-bit, 16 KHz. | `sox <input> -b 16 -e signed-integer -c 1 -r 16k -t wav <output>.wav` |

### Custom display text formatting data for training

Learn more about [preparing display text formatting data](./how-to-custom-speech-display-text-format.md) and [display text formatting with speech to text](./display-text-format.md).

Automatic Speech Recognition output display format is critical to downstream tasks and one-size doesn’t fit all. Adding Custom Display Format rules allows users to define their own lexical-to-display format rules to improve the speech recognition service quality on top of Microsoft Azure Custom Speech Service.

It allows you to fully customize the display outputs such as add rewrite rules to capitalize and reformulate certain words, add profanity words and mask from output, define advanced ITN rules for certain patterns such as numbers, dates, email addresses; or preserve some phrases and kept them from any Display processes. 

For example: 

| Custom formatting | Display text |
|-------------------|--------------|
|None|My financial number from contoso is 8BEV3|
|Capitalize "Contoso" (via `#rewrite` rule)<br/>Format financial number (via `#itn` rule)|My financial number from Contoso is 8B-EV-3|

For a list of supported base models and locales for training with structured text, see Language support. 
The Display Format file should have an .md extension. The maximum file size is 10 MB, and the text encoding must be UTF-8 BOM. For more information about customizing Display Format rules, see Display Formatting Rules Best Practice.

|Property|Description|Limits|
|--------|-----------|------|
|#ITN|A list of invert-text-normalization rules to define certain display patterns such as numbers, addresses, and dates.|Maximum of 200 lines|
|#rewrite|A list of rewrite pairs to replace certain words for reasons such as capitalization and spelling correction.|Maximum of 1,000 lines|
|#profanity|A list of unwanted words that will be masked as `******` from Display and Masked output, on top of Microsoft built-in profanity lists.|Maximum of 1,000 lines|
|#test|A list of unit test cases to validate if the display rules work as expected, including the lexical format input and the expected display format output.|Maximum file size of 10MB|

Here's an example display format file:

```text in .md file
// this is a comment line
// each section must start with a '#' character
#itn
// list of ITN pattern rules, one rule for each line
\d-\d-\d
\d-\l-\l-\d
#rewrite
// list of rewrite rules, each rule has two phrases, separated by a tab character
old phrase	new phrase
# profanity
// list of profanity phrases to be tagged/removed/masked, one line one phrase
fakeprofanity
#test
// list of test cases, each test case has two sentences, input lexical and expected display output
// the two sentences are separated by a tab character
// the expected sentence is the display output of DPP+CDPP models
Mask the fakeprofanity word	Mask the ************* word
```

## Next steps

- [Upload your data](how-to-custom-speech-upload-data.md)
- [Test model quantitatively](how-to-custom-speech-evaluate-data.md)
- [Train a custom model](how-to-custom-speech-train-model.md)
