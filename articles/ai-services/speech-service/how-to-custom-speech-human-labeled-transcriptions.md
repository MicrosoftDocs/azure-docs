---
title: Human-labeled transcriptions guidelines - Speech service
titleSuffix: Azure AI services
description: You use human-labeled transcriptions with your audio data to improve speech recognition accuracy. This is especially helpful when words are deleted or incorrectly replaced. 
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 05/08/2022
ms.author: eur
---

# How to create human-labeled transcriptions

Human-labeled transcriptions are word-by-word transcriptions of an audio file. You use human-labeled transcriptions to improve recognition accuracy, especially when words are deleted or incorrectly replaced. This guide can help you create high-quality transcriptions. 

A large sample of transcription data is required to improve recognition. We suggest providing between 1 and 20 hours of audio data. The Speech service will use up to 20 hours of audio for training. This guide is broken up by locale, with sections for US English, Mandarin Chinese, and German.

The transcriptions for all WAV files are contained in a single plain-text file (.txt or .tsv). Each line of the transcription file contains the name of one of the audio files, followed by the corresponding transcription. The file name and transcription are separated by a tab (`\t`).

For example:

```txt
speech01.wav	speech recognition is awesome
speech02.wav	the quick brown fox jumped all over the place
speech03.wav	the lazy dog was not amused
```

The transcriptions are text-normalized so the system can process them. However, you must do some important normalizations before you upload the dataset. 

Human-labeled transcriptions for languages other than English and Mandarin Chinese, must be UTF-8 encoded with a byte-order marker. For other locales transcription requirements, see the sections below.

## en-US

Human-labeled transcriptions for English audio must be provided as plain text, only using ASCII characters. Avoid the use of Latin-1 or Unicode punctuation characters. These characters are often inadvertently added when copying text from a word-processing application or scraping data from web pages. If these characters are present, make sure to update them with the appropriate ASCII substitution.

Here are a few examples:

| Characters to avoid | Substitution | Notes |
| ------------------- | ------------ | ----- |
| “Hello world” | "Hello world" | The opening and closing quotations marks have been substituted with appropriate ASCII characters. |
| John’s day | John's day | The apostrophe has been substituted with the appropriate ASCII character. |
| It was good—no, it was great! | it was good--no, it was great! | The em dash was substituted with two hyphens. |

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

| Original text               | Text after normalization (human)      |
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
| It costs \$3.14             | It costs three fourteen               |

The following normalization rules are automatically applied to transcriptions:

- Use lowercase letters.
- Remove all punctuation except apostrophes within words.
- Expand numbers into words/spoken form, such as dollar amounts.

Here are a few examples of normalization automatically performed on the transcription:

| Original text                          | Text after normalization (automatic) |
| -------------------------------------- | --------------------------------- |
| "Holy cow!" said Batman.               | holy cow said batman              |
| "What?" said Batman's sidekick, Robin. | what said batman's sidekick robin |
| Go get -em!                            | go get em                         |
| I'm double-jointed                     | I'm double jointed                |
| 104 Elm Street                         | one oh four Elm street            |
| Tune to 102.7                          | tune to one oh two point seven    |
| Pi is about 3.14                       | pi is about three point one four  |

## de-DE

Human-labeled transcriptions for German audio must be UTF-8 encoded with a byte-order marker. 

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
| Wir, haben       | wir haben                |

## ja-JP

In Japanese (ja-JP), there's a maximum length of 90 characters for each sentence. Lines with longer sentences will be discarded. To add longer text, insert a period in between.

## zh-CN

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

Here are some examples of automatic transcription normalization:

| Original text | Text after normalization |
| ------------- | ------------------------ |
| 3.1415 | 三 点 一 四 一 五 |
| ￥ 3.5 | 三 元 五 角 |
| w f y z | W F Y Z |
| 1992 年 8 月 8 日 | 一 九 九 二 年 八 月 八 日 |
| 你吃饭了吗? | 你 吃饭 了 吗 |
| 下午 5:00 的航班 | 下午 五点 的 航班 |
| 我今年 21 岁 | 我 今年 二十 一 岁 |

## Next Steps

- [Test model quantitatively](how-to-custom-speech-evaluate-data.md)
- [Test recognition quality](how-to-custom-speech-inspect-data.md)
- [Train your model](how-to-custom-speech-train-model.md)
