---
title: Human-labeled transcriptions guidelines - Speech service
titleSuffix: Azure Cognitive Services
description: To improve speech recognition accuracy, such as when words are deleted or incorrectly substituted, you can use human-labeled transcriptions along with your audio data. Human-labeled transcriptions are word-by-word, verbatim transcriptions of an audio file.
services: cognitive-services
author: erhopf
manager: nitinme

ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 02/12/2021
ms.author: erhopf
---

# How to create human-labeled transcriptions

If you're looking to improve recognition accuracy, especially issues that are caused when words are deleted or incorrectly substituted, you'll want to use human-labeled transcriptions along with your audio data. What are human-labeled transcriptions? That's easy, they're word-by-word, verbatim transcriptions of an audio file.

A large sample of transcription data is required to improve recognition, we suggest providing between 1 and 20 hours of transcription data. The Speech service will use up to 20 hours of audio for training. On this page, we'll review guidelines designed to help you create high-quality transcriptions. This guide is broken up by locale, with sections for US English, Mandarin Chinese, and German.

> [!NOTE]
> Not all base models support customization with audio files. If a base model does not support it, training will just use the text of the transcriptions in the same way as related text is used. See [Language support](language-support.md#speech-to-text) for a list of base models that support training with audio data.

> [!NOTE]
> In cases when you change the base model used for training, and you have audio in the training dataset, *always* check whether the new selected base model [supports training with audio data](language-support.md#speech-to-text). If the previously used base model did not support training with audio data, and the training dataset contains audio, training time with the new base model will **drastically** increase, and may easily go from several hours to several days and more. This is especially true if your Speech service subscription is **not** in a [region with the dedicated hardware](custom-speech-overview.md#set-up-your-azure-account) for training.
>
> If you face the issue described in the paragraph above, you can quickly decrease the training time by reducing the amount of audio in the dataset or removing it completely and leaving only the text. The latter option is highly recommended if your Speech service subscription is **not** in a [region with the dedicated hardware](custom-speech-overview.md#set-up-your-azure-account) for training.

## US English (en-US)

Human-labeled transcriptions for English audio must be provided as plain text, only using ASCII characters. Avoid the use of Latin-1 or Unicode punctuation characters. These characters are often inadvertently added when copying text from a word-processing application or scraping data from web pages. If these characters are present, make sure to update them with the appropriate ASCII substitution.

Here are a few examples:

| Characters to avoid | Substitution | Notes |
| ------------------- | ------------ | ----- |
| “Hello world” | "Hello world" | The opening and closing quotations marks have been substituted with appropriate ASCII characters. |
| John’s day | John's day | The apostrophe has been substituted with the appropriate ASCII character. |
| it was good—no, it was great! | it was good--no, it was great! | The em dash was substituted with two hyphens. |

### Text normalization for US English

Text normalization is the transformation of words into a consistent format used when training a model. Some normalization rules are applied to text automatically, however, we recommend using these guidelines as you prepare your human-labeled transcription data:

- Write out abbreviations in words.
- Write out non-standard numeric strings in words (such as accounting terms).
- Non-alphabetic characters or mixed alphanumeric characters should be transcribed as pronounced.
- Abbreviations that are pronounced as words shouldn't be edited (such as "radar", "laser", "RAM", or "NATO").
- Write out abbreviations that are pronounced as separate letters with each letter separated by a space.
- If you use audio, transcribe numbers as words that match the audio (for example, "101" could be pronounced as "one oh one" or "one hundred and one").
- Avoid repeating characters, words, or groups of words more than three times, such as "yeah yeah yeah yeah". Lines with such repetitions might be dropped by the Speech service.

Here are a few examples of normalization that you should perform on the transcription:

| Original text               | Text after normalization              |
| --------------------------- | ------------------------------------- |
| Dr. Bruce Banner            | Doctor Bruce Banner                   |
| James Bond, 007             | James Bond, double oh seven           |
| Ke$ha                       | Kesha                                 |
| How long is the 2x4         | How long is the two by four           |
| The meeting goes from 1-3pm | The meeting goes from one to three pm |
| My blood type is O+         | My blood type is O positive           |
| Water is H20                | Water is H 2 O                        |
| Play OU812 by Van Halen     | Play O U 8 1 2 by Van Halen           |
| UTF-8 with BOM              | U T F 8 with BOM                      |

The following normalization rules are automatically applied to transcriptions:

- Use lowercase letters.
- Remove all punctuation except apostrophes within words.
- Expand numbers into words/spoken form, such as dollar amounts.

Here are a few examples of normalization automatically performed on the transcription:

| Original text                          | Text after normalization          |
| -------------------------------------- | --------------------------------- |
| "Holy cow!" said Batman.               | holy cow said batman              |
| "What?" said Batman's sidekick, Robin. | what said batman's sidekick robin |
| Go get -em!                            | go get em                         |
| I'm double-jointed                     | I'm double jointed                |
| 104 Elm Street                         | one oh four Elm street            |
| Tune to 102.7                          | tune to one oh two point seven    |
| Pi is about 3.14                       | pi is about three point one four  |
| It costs \$3.14                        | it costs three fourteen           |

## Mandarin Chinese (zh-CN)

Human-labeled transcriptions for Mandarin Chinese audio must be UTF-8 encoded with a byte-order marker. Avoid the use of half-width punctuation characters. These characters can be included inadvertently when you prepare the data in a word-processing program or scrape data from web pages. If these characters are present, make sure to update them with the appropriate full-width substitution.

Here are a few examples:

| Characters to avoid | Substitution   | Notes |
| ------------------- | -------------- | ----- |
| "你好" | "你好" | The opening and closing quotations marks have been substituted with appropriate characters. |
| 需要什么帮助? | 需要什么帮助？| The question mark has been substituted with appropriate character. |

### Text normalization for Mandarin Chinese

Text normalization is the transformation of words into a consistent format used when training a model. Some normalization rules are applied to text automatically, however, we recommend using these guidelines as you prepare your human-labeled transcription data:

- Write out abbreviations in words.
- Write out numeric strings in spoken form.

Here are a few examples of normalization that you should perform on the transcription:

| Original text | Text after normalization |
| ------------- | ------------------------ |
| 我今年 21 | 我今年二十一 |
| 3 号楼 504 | 三号 楼 五 零 四 |

The following normalization rules are automatically applied to transcriptions:

- Remove all punctuation
- Expand numbers to spoken form
- Convert full-width letters to half-width letters
- Using uppercase letters for all English words

Here are a few examples of normalization automatically performed on the transcription:

| Original text | Text after normalization |
| ------------- | ------------------------ |
| 3.1415 | 三 点 一 四 一 五 |
| ￥ 3.5 | 三 元 五 角 |
| w f y z | W F Y Z |
| 1992 年 8 月 8 日 | 一 九 九 二 年 八 月 八 日 |
| 你吃饭了吗? | 你 吃饭 了 吗 |
| 下午 5:00 的航班 | 下午 五点 的 航班 |
| 我今年 21 岁 | 我 今年 二十 一 岁 |

## German (de-DE) and other languages

Human-labeled transcriptions for German audio (and other non-English or Mandarin Chinese languages) must be UTF-8 encoded with a byte-order marker. One human-labeled transcript should be provided for each audio file.

### Text normalization for German

Text normalization is the transformation of words into a consistent format used when training a model. Some normalization rules are applied to text automatically, however, we recommend using these guidelines as you prepare your human-labeled transcription data:

- Write decimal points as "," and not ".".
- Write time separators as ":" and not "." (for example: 12:00 Uhr).
- Abbreviations such as "ca." aren't replaced. We recommend that you use the full spoken form.
- The four main mathematical operators (+, -, \*, and /) are removed. We recommend replacing them with the written form: "plus," "minus," "mal," and "geteilt."
- Comparison operators are removed (=, <, and >). We recommend replacing them with "gleich," "kleiner als," and "grösser als."
- Write fractions, such as 3/4, in written form (for example: "drei viertel" instead of 3/4).
- Replace the "€" symbol with its written form "Euro."

Here are a few examples of normalization that you should perform on the transcription:

| Original text    | Text after user normalization | Text after system normalization       |
| ---------------- | ----------------------------- | ------------------------------------- |
| Es ist 12.23 Uhr | Es ist 12:23 Uhr              | es ist zwölf uhr drei und zwanzig uhr |
| {12.45}          | {12,45}                       | zwölf komma vier fünf                 |
| 2 + 3 - 4        | 2 plus 3 minus 4              | zwei plus drei minus vier             |

The following normalization rules are automatically applied to transcriptions:

- Use lowercase letters for all text.
- Remove all punctuation, including various types of quotation marks ("test", 'test', "test„, and «test» are OK).
- Discard rows with any special characters from this set: ¢ ¤ ¥ ¦ § © ª ¬ ® ° ± ² µ × ÿ Ø¬¬.
- Expand numbers to spoken form, including dollar or Euro amounts.
- Accept umlauts only for a, o, and u. Others will be replaced by "th" or be discarded.

Here are a few examples of normalization automatically performed on the transcription:

| Original text    | Text after normalization |
| ---------------- | ------------------------ |
| Frankfurter Ring | frankfurter ring         |
| ¡Eine Frage!     | eine frage               |
| wir, haben       | wir haben                |

### Text normalization for Japanese

In Japanese (ja-JP), there's a maximum length of 90 characters for each sentence. Lines with longer sentences will be discarded. To add longer text, insert a period in between.

## Next Steps

- [Prepare and test your data](./how-to-custom-speech-test-and-train.md)
- [Inspect your data](how-to-custom-speech-inspect-data.md)
- [Evaluate your data](how-to-custom-speech-evaluate-data.md)
- [Train your model](how-to-custom-speech-train-model.md)
- [Deploy your model](./how-to-custom-speech-train-model.md)