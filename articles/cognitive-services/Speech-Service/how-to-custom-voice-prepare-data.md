---
title: "How to prepare data for Custom Voice - Speech service"
titleSuffix: Azure Cognitive Services
description: "Create a custom voice for your brand with the Speech service. You provide studio recordings and the associated scripts, the service generates a unique voice model tuned to the recorded voice. Use this voice to synthesize speech in your products, tools, and applications."
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 08/01/2022
ms.author: eur
---

# Prepare training data

When you're ready to create a custom Text-to-Speech voice for your application, the first step is to gather audio recordings and associated scripts to start training the voice model. The Speech service uses this data to create a unique voice tuned to match the voice in the recordings. After you've trained the voice, you can start synthesizing speech in your applications.

> [!NOTE]
> This article focuses on the creation of a professional Custom Neural Voice using the Pro project. See [Custom Neural Voice project types](custom-neural-voice.md#custom-neural-voice-project-types) for information about capabilities, requirements, and differences between Custom Neural Voice Pro and Custom Neural Voice Lite projects.

## Voice talent verbal statement

Before you can train your own Text-to-Speech voice model, you'll need [audio recordings](record-custom-voice-samples.md) and the [associated text transcriptions](how-to-custom-voice-prepare-data.md#types-of-training-data). On this page, we'll review data types, how they're used, and how to manage each.

> [!IMPORTANT]
> To train a neural voice, you must create a voice talent profile with an audio file recorded by the voice talent consenting to the usage of their speech data to train a custom voice model. When preparing your recording script, make sure you include the statement sentence. You can find the statement in multiple languages [here](https://github.com/Azure-Samples/Cognitive-Speech-TTS/blob/master/CustomVoice/script/verbal-statement-all-locales.txt). The language of the verbal statement must be the same as your recording. You need to upload this audio file to the Speech Studio as shown below to create a voice talent profile, which is used to verify against your training data when you create a voice model. Read more about the [voice talent verification](/legal/cognitive-services/speech-service/custom-neural-voice/data-privacy-security-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) here. 
> 
  :::image type="content" source="media/custom-voice/upload-verbal-statement.png" alt-text="Upload voice talent statement":::
>  
> Custom Neural Voice is available with limited access. Make sure you understand the [responsible AI requirements](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) and [apply the access here](https://aka.ms/customneural).

## Types of training data

A voice training dataset includes audio recordings, and a text file with the associated transcriptions. Each audio file should contain a single utterance (a single sentence or a single turn for a dialog system), and be less than 15 seconds long.

In some cases, you may not have the right dataset ready and will want to test the custom neural voice training with available audio files, short or long, with or without transcripts. We provide options (beta) to help you segment your audio into utterances and prepare transcripts using the [Batch Transcription API](batch-transcription.md).

This table lists data types and how each is used to create a custom Text-to-Speech voice model.

| Data type | Description | When to use | Additional processing required |
| --------- | ----------- | ----------- | ------------------------------ |
| **Individual utterances + matching transcript** | A collection (.zip) of audio files (.wav) as individual utterances. Each audio file should be 15 seconds or less in length, paired with a formatted transcript (.txt). | Professional recordings with matching transcripts | Ready for training. |
| **Long audio + transcript (beta)** | A collection (.zip) of long, unsegmented audio files (.wav or .mp3, longer than 20 seconds, at most 1000 audio files), paired with a collection (.zip) of transcripts that contains all spoken words. | You have audio files and matching transcripts, but they aren't segmented into utterances. | Segmentation (using batch transcription).<br>Audio format transformation where required. |
| **Audio only (beta)** | A collection (.zip) of audio files (.wav or .mp3, at most 1000 audio files) without a transcript. | You only have audio files available, without transcripts. | Segmentation + transcript generation (using batch transcription).<br>Audio format transformation where required.|

Files should be grouped by type into a dataset and uploaded as a zip file. Each dataset can only contain a single data type.

> [!NOTE]
> The maximum number of datasets allowed to be imported per subscription is 500 zip files for standard subscription (S0) users.
>
> For the two beta options, only these languages are supported: Chinese (Mandarin, Simplified), English (India), English (United Kingdom), English (United States), French (France), German (Germany), Italian (Italy), Japanese (Japan), Portuguese (Brazil), and Spanish (Mexico). 

## Individual utterances + matching transcript

You can prepare recordings of individual utterances and the matching transcript in two ways. Either [write a script and have it read by a voice talent](record-custom-voice-samples.md) or use publicly available audio and transcribe it to text. If you do the latter, edit disfluencies from the audio files, such as "um" and other filler sounds, stutters, mumbled words, or mispronunciations.

To produce a good voice model, create the recordings in a quiet room with a high-quality microphone. Consistent volume, speaking rate, speaking pitch, and expressive mannerisms of speech are essential.

> [!TIP]
> To create a voice for production use, we recommend you use a professional recording studio and voice talent. For more information, see [record voice samples to create a custom neural voice](record-custom-voice-samples.md).

### Audio files

Each audio file should contain a single utterance (a single sentence or a single turn of a dialog system), less than 15 seconds long. All files must be in the same spoken language. Multi-language custom Text-to-Speech voices aren't supported, with the exception of the Chinese-English bi-lingual. Each audio file must have a unique filename with the filename extension .wav.

Follow these guidelines when preparing audio.

| Property | Value |
| -------- | ----- |
| File format | RIFF (.wav), grouped into a .zip file |
| File name | File name characters supported by Windows OS, with .wav extension.<br>The characters \ / : * ? " < > \| aren't allowed. <br>It can't start or end with a space, and can't start with a dot. <br>No duplicate file names allowed. |
| Sampling rate	| For creating a custom neural voice, 24,000 Hz is required. |
| Sample format | PCM, at least 16-bit |
| Audio length | Shorter than 15 seconds |
| Archive format | .zip |
| Maximum archive size | 2048 MB |

> [!NOTE]
> The default sampling rate for a custom neural voice is 24,000 Hz. Audio files with a sampling rate lower than 16,000 Hz will be rejected. If a .zip file contains .wav files with different sample rates, only those equal to or higher than 16,000 Hz will be imported. Your audio files with a sampling rate higher than 16,000 Hz and lower than 24,000 Hz will be up-sampled to 24,000 Hz to train a neural voice. It’s recommended that you should use a sample rate of 24,000 Hz for your training data.

### Transcripts

The transcription file is a plain text file. Use these guidelines to prepare your transcriptions.

| Property | Value |
| -------- | ----- |
| File format | Plain text (.txt) |
| Encoding format | ANSI, ASCII, UTF-8, UTF-8-BOM, UTF-16-LE, or UTF-16-BE. For zh-CN, ANSI and ASCII encoding aren't supported. |
| # of utterances per line | **One** - Each line of the transcription file should contain the name of one of the audio files, followed by the corresponding transcription. The file name and transcription should be separated by a tab (\t). |
| Maximum file size | 2048 MB |

Below is an example of how the transcripts are organized utterance by utterance in one .txt file:

```
0000000001[tab]	This is the waistline, and it's falling.
0000000002[tab]	We have trouble scoring.
0000000003[tab]	It was Janet Maslin.
```
It’s important that the transcripts are 100% accurate transcriptions of the corresponding audio. Errors in the transcripts will introduce quality loss during the training.

## Long audio and transcript (beta)

In some cases, you may not have segmented audio available. We provide a service (beta) through the Speech Studio to help you segment long audio files and create transcriptions. Keep in mind, this service will be charged toward your speech-to-text subscription usage.

> [!NOTE]
> The long-audio segmentation service will leverage the batch transcription feature of speech-to-text, which only supports standard subscription (S0) users. During the processing of the segmentation, your audio files and the transcripts will also be sent to the Custom Speech service to refine the recognition model so the accuracy can be improved for your data. No data will be retained during this process. After the segmentation is done, only the utterances segmented and their mapping transcripts will be stored for your downloading and training.

### Audio files

Follow these guidelines when preparing audio for segmentation.

| Property | Value |
| -------- | ----- |
| File format | RIFF (.wav) or .mp3, grouped into a .zip file |
| File name	|  File name characters supported by Windows OS, with .wav extension. <br>The characters \ / : * ? " < > \| aren't allowed. <br>It can't start or end with a space, and can't start with a dot. <br>No duplicate file names allowed. |
| Sampling rate	| For creating a custom neural voice, 24,000 Hz is required. |
| Sample format |RIFF(.wav): PCM, at least 16-bit<br>mp3: at least 256 KBps bit rate|
| Audio length | Longer than 20 seconds |
| Archive format | .zip |
| Maximum archive size | 2048 MB, at most 1000 audio files included |

> [!NOTE]
> The default sampling rate for a custom neural voice is 24,000 Hz. Audio files with a sampling rate lower than 16,000 Hz will be rejected. Your audio files with a sampling rate higher than 16,000 Hz and lower than 24,000 Hz will be up-sampled to 24,000 Hz to train a neural voice. It’s recommended that you should use a sample rate of 24,000 Hz for your training data.

All audio files should be grouped into a zip file. It’s OK to put .wav files and .mp3 files into one audio zip. For example, you can upload a zip file containing an audio file named ‘kingstory.wav’, 45-second-long, and another audio named ‘queenstory.mp3’, 200-second-long. All .mp3 files will be transformed into the .wav format after processing.

### Transcripts

Transcripts must be prepared to the specifications listed in this table. Each audio file must be matched with a transcript.

| Property | Value |
| -------- | ----- |
| File format | Plain text (.txt), grouped into a .zip |
| File name | Use the same name as the matching audio file |
| Encoding format |ANSI, ASCII, UTF-8, UTF-8-BOM, UTF-16-LE, or UTF-16-BE. For zh-CN, ANSI and ASCII encoding aren't supported. |
| # of utterances per line | No limit |
| Maximum file size | 2048 MB |

All transcripts files in this data type should be grouped into a zip file. For example, you've uploaded a zip file containing an audio file named ‘kingstory.wav’, 45 seconds long, and another one named ‘queenstory.mp3’, 200 seconds long. You'll need to upload another zip file containing two transcripts, one named ‘kingstory.txt’, the other one ‘queenstory.txt’. Within each plain text file, you'll provide the full correct transcription for the matching audio.

After your dataset is successfully uploaded, we'll help you segment the audio file into utterances based on the transcript provided. You can check the segmented utterances and the matching transcripts by downloading the dataset. Unique IDs will be assigned to the segmented utterances automatically. It’s important that you make sure the transcripts you provide are 100% accurate. Errors in the transcripts can reduce the accuracy during the audio segmentation and further introduce quality loss in the training phase that comes later.

## Audio only (beta)

If you don't have transcriptions for your audio recordings, use the **Audio only** option to upload your data. Our system can help you segment and transcribe your audio files. Keep in mind, this service will be charged toward your speech-to-text subscription usage.

Follow these guidelines when preparing audio.

> [!NOTE]
> The long-audio segmentation service will leverage the batch transcription feature of speech-to-text, which only supports standard subscription (S0) users.

| Property | Value |
| -------- | ----- |
| File format | RIFF (.wav) or .mp3, grouped into a .zip file |
| File name |  File name characters supported by Windows OS, with .wav extension. <br>The characters \ / : * ? " < > \| aren't allowed. <br>It can't start or end with a space, and can't start with a dot. <br>No duplicate file names allowed. |
| Sampling rate	| For creating a custom neural voice, 24,000 Hz is required. |
| Sample format |RIFF(.wav): PCM, at least 16-bit<br>mp3: at least 256 KBps bit rate|
| Audio length | No limit |
| Archive format | .zip |
| Maximum archive size | 2048 MB, at most 1000 audio files included |

> [!NOTE]
> The default sampling rate for a custom neural voice is 24,000 Hz. Your audio files with a sampling rate higher than 16,000 Hz and lower than 24,000 Hz will be up-sampled to 24,000 Hz to train a neural voice. It’s recommended that you should use a sample rate of 24,000 Hz for your training data.

All audio files should be grouped into a zip file. Once your dataset is successfully uploaded, we'll help you segment the audio file into utterances based on our speech batch transcription service. Unique IDs will be assigned to the segmented utterances automatically. Matching transcripts will be generated through speech recognition. All .mp3 files will be transformed into the .wav format after processing. You can check the segmented utterances and the matching transcripts by downloading the dataset.

## Next steps

- [Train your voice model](how-to-custom-voice-create-voice.md)
- [Deploy and use your voice model](how-to-deploy-and-use-endpoint.md)
- [How to record voice samples](record-custom-voice-samples.md)
