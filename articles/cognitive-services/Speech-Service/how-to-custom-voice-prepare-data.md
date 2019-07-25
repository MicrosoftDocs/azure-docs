---
title: "How to prepare data for Custom Voice - Speech Services"
titlesuffix: Azure Cognitive Services
description: "Create a custom voice for your brand with Azure Speech Services. You provide studio recordings and the associated scripts, the service generates a unique voice model tuned to the recorded voice. Use this voice to synthesize speech in your products, tools, and applications."
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: erhopf
---

# Prepare data to create a custom voice

When you're ready to create a custom text-to-speech voice for your application, the first step is to gather audio recordings and associated scripts to start training the voice model. The service uses this data to create a unique voice tuned to match the voice in the recordings. After you've trained the voice, you can start synthesizing speech in your applications.

You can start with a small amount of data to create a proof of concept. However, the more data that you provide, the more natural your custom voice will sound. Before you can train your own text-to-speech voice model, you'll need audio recordings and the associated text transcriptions. On this page, we'll review data types, how they are used, and how to manage each.

## Data types

A voice training dataset includes audio recordings, and a text file with the associated transcriptions. Each audio file should contain a single utterance (a single sentence or a single turn for a dialog system), and be less than 15 seconds long.

In some cases, you may not have the right dataset ready and will want to test the custom voice training with available audio files, short or long, with or without transcripts. We provide tools (beta) to help you segment your audio into utterances and prepare transcripts using the [Batch Transcription API](batch-transcription.md).

This table lists data types and how each is used to create a custom text-to-speech voice model.

| Data type | Description | When to use | Additional service required | Quantity for training a model | Locale(s) |
| --------- | ----------- | ----------- | --------------------------- | ----------------------------- | --------- |
| **Individual utterances + matching transcript** | A collection (.zip) of audio files (.wav) as individual utterances. Each audio file should be 15 seconds or less in length, paired with a formatted transcript (.txt). | Professional recordings with matching transcripts | Ready for training. | No hard requirement for en-US and zh-CN. More than 2,000+ distinct utterances for other locales. | All Custom Voice locales |
| **Long audio + transcript (beta)** | A collection (.zip) of long, unsegmented audio files (longer than 20 seconds), paired with a transcript (.txt) that contains all spoken words. | You have audio files and matching transcripts, but they are not segmented into utterances. | Segmentation (using batch transcription).<br>Audio format transformation where required. | No hard requirement for en-US and zh-CN. | `en-US` and `zh-CN` |
| **Audio only (beta)** | A collection (.zip) of audio files without a transcript. | You only have audio files available, without transcripts. | Segmentation + transcript generation (using batch transcription).<br>Audio format transformation where required.| No hard requirement for `en-US` and `zh-CN`. | `en-US` and `zh-CN` |

Files should be grouped by type into a dataset and uploaded as a zip file. Each dataset can only contain a single data type.

> [!NOTE]
> The maximum number of datasets allowed to be imported per subscription is 10 .zip files for free subscription (F0) users and 500 for standard subscription (S0) users.

## Individual utterances + matching transcript

You can prepare recordings of individual utterances and the matching transcript in two ways. Either write a script and have it read by a voice talent or use publicly available audio and transcribe it to text. If you do the latter, edit disfluencies from the audio files, such as "um" and other filler sounds, stutters, mumbled words, or mispronunciations.

To produce a good voice font, create the recordings in a quiet room with a high-quality microphone. Consistent volume, speaking rate, speaking pitch, and expressive mannerisms of speech are essential.

> [!TIP]
> To create a voice for production use, we recommend you use a professional recording studio and voice talent. For more information, see [How to record voice samples for a custom voice](record-custom-voice-samples.md).

### Audio files

Each audio file should contain a single utterance (a single sentence or a single turn of a dialog system), less than 15 seconds long. All files must be in the same spoken language. Multi-language custom text-to-speech voices are not supported, with the exception of the Chinese-English bi-lingual. Each audio file must have a unique numeric filename with the filename extension .wav.

Follow these guidelines when preparing audio.

| Property | Value |
| -------- | ----- |
| File format | RIFF (.wav), grouped into a .zip file |
| Sampling rate	| At least 16,000 Hz |
| Sample format | PCM, 16-bit |
| File name | Numeric, with .wav extension. No duplicate file names allowed. |
| Audio length | Shorter than 15 seconds |
| Archive format | .zip |
| Maximum archive size | 200 MB |

> [!NOTE]
> .wav files with a sampling rate lower than 16,000 Hz will be rejected. If a .zip file contains .wav files with different sample rates, only those equal to or higher than 16,000 Hz will be imported. The portal currently imports .zip archives up to 200 MB. However, multiple archives can be uploaded.

### Transcripts

The transcription file is a plain text file. Use these guidelines to prepare your transcriptions.

| Property | Value |
| -------- | ----- |
| File format | Plain text (.txt) |
| Encoding format | ANSI/ASCII, UTF-8, UTF-8-BOM, UTF-16-LE, or UTF-16-BE. For zh-CN, ANSI/ASCII and UTF-8 encodings are not supported. |
| # of utterances per line | **One** - Each line of the transcription file should contain the name of one of the audio files, followed by the corresponding transcription. The file name and transcription should be separated by a tab (\t). |
| Maximum file size | 50 MB |

Below is an example of how the transcripts are organized utterance by utterance in one .txt file:

```
0000000001[tab]	This is the waistline, and it's falling.
0000000002[tab]	We have trouble scoring.
0000000003[tab]	It was Janet Maslin.
```
It’s important that the transcripts are 100% accurate transcriptions of the corresponding audio. Errors in the transcripts will introduce quality loss during the training.

> [!TIP]
> When building production text-to-speech voices, select utterances (or write scripts) that take into account both phonetic coverage and efficiency. Having trouble getting the results you want? [Contact the Custom Voice](mailto:speechsupport@microsoft.com) team to find out more about having us consult.

## Long audio + transcript (beta)

In some cases, you may not have segmented audio available. We provide a service (beta) through the custom voice portal to help you segment long audio files and create transcriptions. Keep in mind, this service will be charged toward your speech-to-text subscription usage.

> [!NOTE]
> The long-audio segmentation service will leverage the batch transcription feature of speech-to-text, which only supports standard subscription (S0) users. During the processing of the segmentation, your audio files and the transcripts will also be sent to the Custom Speech service to refine the recognition model so the accuracy can be improved for your data. No data will be retained during this process. After the segmentation is done, only the utterances segmented and their mapping transcripts will be stored for your downloading and training.

### Audio files

Follow these guidelines when preparing audio for segmentation.

| Property | Value |
| -------- | ----- |
| File format | RIFF (.wav) with a sampling rate of at least 16 khz-16-bit in PCM or .mp3 with a bit rate of at least 256 KBps, grouped into a .zip file |
| File name	| ASCII characters only. Unicode characters in the name will fail (for example, the Chinese characters, or symbols like "—"). No duplicate names allowed. |
| Audio length | Longer than 20 seconds |
| Archive format | .zip |
| Maximum archive size | 200 MB |

All audio files should be grouped into a zip file. It’s OK to put .wav files and .mp3 files into one audio zip, but no subfolder is allowed in the zip file. For example, you can upload a zip file containing an audio file named ‘kingstory.wav’, 45-second-long, and another one named ‘queenstory.mp3’, 200-second-long, without any subfolders. All .mp3 files will be transformed into the .wav format after processing.

### Transcripts

Transcripts must be prepared to the specifications listed in this table. Each audio file must be matched with a transcript.

| Property | Value |
| -------- | ----- |
| File format | Plain text (.txt), grouped into a .zip |
| File name | Use the same name as the matching audio file |
| Encoding format | UTF-8-BOM only |
| # of utterances per line | No limit |
| Maximum file size | 50M |

All transcripts files in this data type should be grouped into a zip file. No subfolder is allowed in the zip file. For example, you have uploaded a zip file containing an audio file named ‘kingstory.wav’, 45 seconds long, and another one named ‘queenstory.mp3’, 200 seconds long. You will need to upload another zip file containing two transcripts, one named ‘kingstory.txt’, the other one ‘queenstory.txt’. Within each plain text file, you will provide the full correct transcription for the matching audio.

After your dataset is successfully uploaded, we will help you segment the audio file into utterances based on the transcript provided. You can check the segmented utterances and the matching transcripts by downloading the dataset. Unique IDs will be assigned to the segmented utterances automatically. It’s important that you make sure the transcripts you provide are 100% accurate. Errors in the transcripts can reduce the accuracy during the audio segmentation and further introduce quality loss in the training phase that comes later.

## Audio only (beta)

If you don't have transcriptions for your audio recordings, use the **Audio only** option to upload your data. Our system can help you segment and transcribe your audio files. Keep in mind, this service will count toward your speech-to-text subscription usage.

Follow these guidelines when preparing audio.

> [!NOTE]
> The long-audio segmentation service will leverage the batch transcription feature of speech-to-text, which only supports standard subscription (S0) users.

| Property | Value |
| -------- | ----- |
| File format | RIFF (.wav) with a sampling rate of at least 16 khz-16-bit in PCM or .mp3 with a bit rate of at least 256 KBps, grouped into a .zip file |
| File name | ASCII characters only. Unicode characters in the name will fail (for example, the Chinese characters, or symbols like "—"). No duplicate name allowed. |
| Audio length | Longer than 20 seconds |
| Archive format | .zip |
| Maximum archive size | 200 MB |

All audio files should be grouped into a zip file. No subfolder is allowed in the zip file. Once your dataset is successfully uploaded, we will help you segment the audio file into utterances based on our speech batch transcription service. Unique IDs will be assigned to the segmented utterances automatically. Matching transcripts will be generated through speech recognition. All .mp3 files will be transformed into the .wav format after processing. You can check the segmented utterances and the matching transcripts by downloading the dataset.

## Next steps

- [Create a Custom Voice](how-to-custom-voice-create-voice.md)
- [Guide: Record your voice samples](record-custom-voice-samples.md)
