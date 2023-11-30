---
title: "Training data for custom neural voice - Speech service"
titleSuffix: Azure AI services
description: "Learn about the data types that you can use to train a custom neural voice."
#services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 10/27/2022
ms.author: eur
---

# Training data for custom neural voice

When you're ready to create a custom Text to speech voice for your application, the first step is to gather audio recordings and associated scripts to start training the voice model. The Speech service uses this data to create a unique voice tuned to match the voice in the recordings. After you've trained the voice, you can start synthesizing speech in your applications.

> [!TIP]
> To create a voice for production use, we recommend you use a professional recording studio and voice talent. For more information, see [record voice samples to create a custom neural voice](record-custom-voice-samples.md).

## Types of training data

A voice training dataset includes audio recordings, and a text file with the associated transcriptions. Each audio file should contain a single utterance (a single sentence or a single turn for a dialog system), and be less than 15 seconds long.

In some cases, you may not have the right dataset ready and will want to test the custom neural voice training with available audio files, short or long, with or without transcripts. 

This table lists data types and how each is used to create a custom Text to speech voice model.

| Data type | Description | When to use | Extra processing required |
| --------- | ----------- | ----------- | ------------------------------ |
| [Individual utterances + matching transcript](#individual-utterances--matching-transcript) | A collection (.zip) of audio files (.wav) as individual utterances. Each audio file should be 15 seconds or less in length, paired with a formatted transcript (.txt). | Professional recordings with matching transcripts | Ready for training. |
| [Long audio + transcript](#long-audio--transcript-preview) | A collection (.zip) of long, unsegmented audio files (.wav or .mp3, longer than 20 seconds, at most 1000 audio files), paired with a collection (.zip) of transcripts that contains all spoken words. | You have audio files and matching transcripts, but they aren't segmented into utterances. | Segmentation (using batch transcription).<br>Audio format transformation wherever required. |
| [Audio only (Preview)](#audio-only-preview) | A collection (.zip) of audio files (.wav or .mp3, at most 1000 audio files) without a transcript. | You only have audio files available, without transcripts. | Segmentation + transcript generation (using batch transcription).<br>Audio format transformation wherever required.|

Files should be grouped by type into a dataset and uploaded as a zip file. Each dataset can only contain a single data type.

> [!NOTE]
> The maximum number of datasets allowed to be imported per subscription is 500 zip files for standard subscription (S0) users.

## Individual utterances + matching transcript

You can prepare recordings of individual utterances and the matching transcript in two ways. Either [write a script and have it read by a voice talent](record-custom-voice-samples.md) or use publicly available audio and transcribe it to text. If you do the latter, edit disfluencies from the audio files, such as "um" and other filler sounds, stutters, mumbled words, or mispronunciations.

To produce a good voice model, create the recordings in a quiet room with a high-quality microphone. Consistent volume, speaking rate, speaking pitch, and expressive mannerisms of speech are essential.

For data format examples, refer to the sample training set on [GitHub](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/CustomVoice/Sample%20Data). The sample training set includes the sample script and the associated audio.

### Audio data for Individual utterances + matching transcript

Each audio file should contain a single utterance (a single sentence or a single turn of a dialog system), less than 15 seconds long. All files must be in the same spoken language. Multi-language custom Text to speech voices aren't supported, except for the Chinese-English bi-lingual. Each audio file must have a unique filename with the filename extension .wav.

Follow these guidelines when preparing audio.

| Property | Value |
| -------- | ----- |
| File format | RIFF (.wav), grouped into a .zip file |
| File name | File name characters supported by Windows OS, with .wav extension.<br>The characters \ / : * ? " < > \| aren't allowed. <br>It can't start or end with a space, and can't start with a dot. <br>No duplicate file names allowed. |
| Sampling rate	| When creating a custom neural voice, 24,000 Hz is required. |
| Sample format | PCM, at least 16-bit |
| Audio length | Shorter than 15 seconds |
| Archive format | .zip |
| Maximum archive size | 2048 MB |

> [!NOTE]
> The default sampling rate for a custom neural voice is 24,000 Hz. Audio files with a sampling rate lower than 16,000 Hz will be rejected. If a .zip file contains .wav files with different sample rates, only those equal to or higher than 16,000 Hz will be imported. Your audio files with a sampling rate higher than 16,000 Hz and lower than 24,000 Hz will be up-sampled to 24,000 Hz to train a neural voice. It’s recommended that you should use a sample rate of 24,000 Hz for your training data.

### Transcription data for Individual utterances + matching transcript

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

## Long audio + transcript (Preview)

> [!NOTE]
> For **Long audio + transcript (Preview)**, only these languages are supported: Chinese (Mandarin, Simplified), English (India), English (United Kingdom), English (United States), French (France), German (Germany), Italian (Italy), Japanese (Japan), Portuguese (Brazil), and Spanish (Mexico). 

In some cases, you may not have segmented audio available. The Speech Studio can help you segment long audio files and create transcriptions. The long-audio segmentation service will use the [Batch Transcription API](batch-transcription.md) feature of speech to text.

During the processing of the segmentation, your audio files and the transcripts will also be sent to the Custom Speech service to refine the recognition model so the accuracy can be improved for your data. No data will be retained during this process. After the segmentation is done, only the utterances segmented and their mapping transcripts will be stored for your downloading and training.

> [!NOTE]
> This service will be charged toward your speech to text subscription usage. The long-audio segmentation service is only supported with standard (S0) Speech resources. 

### Audio data for Long audio + transcript

Follow these guidelines when preparing audio for segmentation.

| Property | Value |
| -------- | ----- |
| File format | RIFF (.wav) or .mp3, grouped into a .zip file |
| File name	|  File name characters supported by Windows OS, with .wav extension. <br>The characters \ / : * ? " < > \| aren't allowed. <br>It can't start or end with a space, and can't start with a dot. <br>No duplicate file names allowed. |
| Sampling rate	| When creating a custom neural voice, 24,000 Hz is required. |
| Sample format |RIFF(.wav): PCM, at least 16-bit<br>mp3: at least 256 KBps bit rate|
| Audio length | Longer than 20 seconds |
| Archive format | .zip |
| Maximum archive size | 2048 MB, at most 1000 audio files included |

> [!NOTE]
> The default sampling rate for a custom neural voice is 24,000 Hz. Audio files with a sampling rate lower than 16,000 Hz will be rejected. Your audio files with a sampling rate higher than 16,000 Hz and lower than 24,000 Hz will be up-sampled to 24,000 Hz to train a neural voice. It’s recommended that you should use a sample rate of 24,000 Hz for your training data.

All audio files should be grouped into a zip file. It’s OK to put .wav files and .mp3 files into one audio zip. For example, you can upload a zip file containing an audio file named ‘kingstory.wav’, 45 second long, and another audio named ‘queenstory.mp3’, 200 second long. All .mp3 files will be transformed into the .wav format after processing.

### Transcription data for Long audio + transcript

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

## Audio only (Preview)

> [!NOTE]
> For **Audio only (Preview)**, only these languages are supported: Chinese (Mandarin, Simplified), English (India), English (United Kingdom), English (United States), French (France), German (Germany), Italian (Italy), Japanese (Japan), Portuguese (Brazil), and Spanish (Mexico). 

If you don't have transcriptions for your audio recordings, use the **Audio only** option to upload your data. Our system can help you segment and transcribe your audio files. Keep in mind, this service will be charged toward your speech to text subscription usage.

Follow these guidelines when preparing audio.

> [!NOTE]
> The long-audio segmentation service will leverage the batch transcription feature of speech to text, which only supports standard subscription (S0) users.

| Property | Value |
| -------- | ----- |
| File format | RIFF (.wav) or .mp3, grouped into a .zip file |
| File name |  File name characters supported by Windows OS, with .wav extension. <br>The characters \ / : * ? " < > \| aren't allowed. <br>It can't start or end with a space, and can't start with a dot. <br>No duplicate file names allowed. |
| Sampling rate	| When creating a custom neural voice, 24,000 Hz is required. |
| Sample format |RIFF(.wav): PCM, at least 16-bit<br>mp3: at least 256 KBps bit rate|
| Audio length | No limit |
| Archive format | .zip |
| Maximum archive size | 2048 MB, at most 1000 audio files included |

> [!NOTE]
> The default sampling rate for a custom neural voice is 24,000 Hz. Your audio files with a sampling rate higher than 16,000 Hz and lower than 24,000 Hz will be up-sampled to 24,000 Hz to train a neural voice. It’s recommended that you should use a sample rate of 24,000 Hz for your training data.

All audio files should be grouped into a zip file. Once your dataset is successfully uploaded, we'll help you segment the audio file into utterances based on our speech batch transcription service. Unique IDs will be assigned to the segmented utterances automatically. Matching transcripts will be generated through speech recognition. All .mp3 files will be transformed into the .wav format after processing. You can check the segmented utterances and the matching transcripts by downloading the dataset.

## Next steps

- [Train your voice model](professional-voice-train-voice.md)
- [Deploy and use your voice model](professional-voice-deploy-endpoint.md)
- [How to record voice samples](record-custom-voice-samples.md)
