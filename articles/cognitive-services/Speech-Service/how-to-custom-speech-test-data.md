---
title: "Prepare test data for Custom Speech - Speech Services"
titlesuffix: Azure Cognitive Services
description: TBD
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: erhopf
---

# How to prepare test data

Whether you are testing to see how accurate Microsoft speech recognition is or training your own models, you'll need data (in the form of audio and/or text).  In this page we cover the types of data, how they are used, and how to manage them.

## Data types

This table lists accepted data types, when each data type should be used, and the recommended quantity. Not every data type is required to create a model.

| Data type | Used of testing | Quantity | Used for training | Quantity |
|-----------|-----------------|----------|-------------------|----------|
| Audio | Yes<br>Used for visual inspection | 5+ audio files | No | N/a |
| Audio + Human-labeled transcripts | Yes<br>Used to evaluate accuracy | 0.5 - 5 hours of audio | Yes | 10 - 1,000 hours of audio |
| Related text | No | N/a | Yes | 10-500 MB of related text |

Files should be grouped by type into a dataset and uploaded as a zip file. Each dataset can only contain a single data type.

## Audio data for testing

Assuming this is your first time, you likely will want to first test out our existing (baseline) speech recognition model on your own data.  Navigate to Speech-to-text/Custom Speech/Data.  Select Upload Data to upload your own test Audio only dataset yourself as a zip or download our samples.  We provide en-US, zh-CN, and de-DE for reference.

![](placeholder.png)

Use this table to ensure that your audio files are formatted correctly for use with Custom Speech:

| Property | Value |
|----------|-------|
| File format | RIFF (WAV) |
| Sample rate | 8,000 Hz or 16,000 Hz |
| Channels | 1 (mono) |
| Sample format | PCM, 16-bit |
| Archive format | .zip |
| Maximum zip size | 2 GB |

If your audio doesn’t satisfy these properties or you aren’t sure if it does, we suggest downloading sox to do the check or audio conversion.  Below are some examples of how this can be achieved on the command line in Windows, Mac, or Linux.

### How to check the audio format of a file

| Platform | Command |
|----------|---------|
| Windows | TBD |
| Linux | TBD |
| macOS | TBD |

### How to convert an audio file

| Platform | Command |
|----------|---------|
| Windows | TBD |
| Linux | TBD |
| macOS | TBD |

## Audio + human-labeled transcript data for testing/training

If you want to measure the accuracy of Microsoft’s speech recognition on your audio files, you must have them transcribed by a human (word by word) so a comparison can be made.  Similarly if you want to improve the accuracy of the speech recognition system you must feed in audio with it’s corresponding human to teach the machine.

Human transcription is time consuming and costly, but necessary to evaluate accuracy or train a very accurate speech recognition model.  While we accept transcripts of all quality, it’s always best to make sure every word is transcribed.  The term garbage in equals garbage out applies to transcription as well.  We have set up a Transcription Guideline for developers serious about achieving the highest recognition quality.  

| Data | File format | Naming convention | Sample |
|------|-------------|-------------------|--------|
| Audio | TBD | TBD | TBD |
| Human-labeled transcripts | TBD | TBD | TBD |

**<< Archer/Mark - Please update this table to reflect how it should be rendered in the doc >>**

This is a sample data set that illustrates three audio + human-labeled transcript pairs:

![](placeholder.png

Navigate to Speech-to-text/Custom Speech/Data.  Select Upload Data to upload your own test Audio + human-labeled transcript dataset yourself as a zip or upload our samples.   

## Related text data for training

If you have product names or features that are unique, and you want to make sure they are recognized correctly, it is important to include them for training (if I were Microsoft I would want to make sure Azure, Office 365, and Cortana are recognized properly).  Related Text datasets helps solve this problem by introducing two types of text datasets you can upload described in the table below.

<< Erik - TODO - Add Table >>

Store the utterances into a single text file in sentence form or in multiple text files.  The more aligned the text data is to what is spoken the more effective in improving accuracy.

To upload related text, navigate to Speech-to-text/Custom Speech/Data.  Upload your own Related Text dataset yourself as a zip or upload our example. Click on Upload data to begin the upload process.  Once uploaded, go to the Training tab to begin using the dataset to train a model to improve accuracy. 


## Next steps

* [Prepare and test your data](placeholder)
* [Inspect and evaluate your data quality](placeholder)
* [Train your model](placeholder)
* [Deploy your model](placeholder)
