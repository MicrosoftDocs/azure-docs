---
title: Frequently asked questions for the Custom Speech Service on Azure | Microsoft Docs
description: Here are answers to the most popular questions about the Custom Speech Service.
services: cognitive-services
author: PanosPeriorellis
manager: onano
ms.service: cognitive-services
ms.component: custom-speech
ms.topic: article
ms.date: 11/21/2016
ms.author: panosper
---

# Custom Speech Service Frequently Asked Questions

[!INCLUDE [Deprecation note](../../../includes/cognitive-services-custom-speech-deprecation-note.md)] 

If you can't find answers to your questions in this FAQ, try asking the Custom Speech Service community on [StackOverflow](https://stackoverflow.com/questions/tagged/project-oxford+or+microsoft-cognitive) and [UserVoice](https://cognitive.uservoice.com/)

## General

**Question**: How will I know when the processing of my data set or model is complete?

**Answer**: Currently, the status of the model or data set in the table is the only want to know.
When the processing is complete, the status will be "Ready".
We are working on improved methods for communication processing status, such as email notification.

**Question**: Can I create more than one model at a time?

**Answer**: There is no limit to how many models are in your collection but only one can be created at a time on each page.
For example, you cannot start a language model creation process if there is currently a language model in the process stage.
You can, however, have an acoustic model and a language model processing at the same time. 

**Question**: I realized I made a mistake. How do I cancel my data import or model creation that’s in progress? 

**Answer**: Currently you cannot roll back a acoustic or language adaptation process.
Imported data can be deleted after the import has been completed

**Question**: What is the difference between the Search & Dictation Models and the Conversational Models?

**Answer**: There are two Base Acoustic & Language Models to choose from in the Custom Speech Service.
search queries, or dictation. The Microsoft Conversational AM is appropriate for recognizing speech spoken in a conversational style.
This type of speech is typically directed at another person, such as in call centers or meetings.

**Question**: Can I update my existing model (model stacking)?

**Answer**: We do not offer the ability to update an existing model with new data.
If you have a new data set and you want to customize an existing model you must re-adapt it with the new data and the old data set that you used.
The old and new data sets must be combined in a single .zip (if it is acoustic data) or a .txt file if it is language data
Once adaptation is done the new updated model needs to be de-deployed to obtain a new endpoint

**Question**: What if I need higher concurrency than the default value. 

**Answer**: You can scale up your model in increments of 5 concurrent requests which we call Scale Units. Each Scale unit guarantees that your model can process 5 audio stream simultaneously. You can buy up to 100 Scale units (or 500 concurrent requests).

Please contact us if you require higher than that.

**Question**: Can I download my model and run it locally?

**Answer**: We do not enable models to be downloaded and executed locally.

**Question**: Are my requests logged?

**Answer**: You have a choice during the creation of a deployment to switch off tracing, at which point no audio or transcriptions will be logged. Otherwise requests are typically logged in Azure in secure storage. If you have further privacy concerns that prohibit you from using the Custom Speech Service please contact us.

## Importing Data

**Question**: What is the limit on the size of the data set? Why? 

**Answer**: The current limit for a data set is 2 GB, due to the restriction on the size of a file for HTTP upload. 

**Question**: Can I zip my text files in order to upload a larger text file? 

**Answer**: No, currently only uncompressed text files are allowed.

**Question**: The data report says there were failed utterances. Is this a problem?

**Answer**: If only a few utterances failed to be imported successfully, this is not a problem.
If the vast majority of the utterances in an acoustic or language data set (e.g. >95%) are successfully imported,
the data set can be usable. However, it is recommended that you try to understand why the utterances failed and fix the problems.
Most common problems, such as formatting errors, are easy to fix. 

## Creating AM

**Question**: How much acoustic data do I need?

**Answer**: We recommend starting with 30 minutes to one hour of acoustic data

**Question**: What sort of data should I collect?

**Answer**: You should collect data that's as close to the application scenario and use case as possible.
This means the data collection should match the target application and users in terms of device or devices,
environments, and types of speakers. In general, you should collect data from as broad a range of speakers as possible. 

**Question**: How should I collect it? 

**Answer**: You can create a standalone data collection application or use some off the shelf audio recording software.
You can also create a version of your application that logs the audio data and uses that. 

**Question**: Do I need to transcribe adaptation data myself? 

**Answer**: The data must be transcribed. You can transcribe it yourself
or use a professional transcription service. Some of these use professional transcribers and others
use crowdsourcing. We can also recommend a transcription service upon request.

**Question**: How long does it take to create a custom acoustic model?

**Answer**: The processing time for creating a custom acoustic model is about the same as the length of the acoustic data set.
So, a customized acoustic model created from a five hour data set will take about five hours to process. 

## Offline Testing

**Question**: Can I perform offline testing of my custom acoustic model using a custom language model?

**Answer**: Yes, just select the custom language model in the drop down when you set up the offline test

**Question**: Can I perform offline testing of my custom language model using a custom acoustic model?

**Answer**: Yes, just select the custom acoustic model in the drop-down menu when you set up the offline test.

**Question**: What is Word Error Rate and how is it computed?

**Answer**: Word Error Rate is the evaluation metric for speech recognition. It is counted as the total number of errors,
which includes insertions, deletions, and substitutions, divided by the total number of words in the reference transcription.

**Question**: I now know the test results of my custom model, is this a good or bad number?

**Answer**: The results show a comparison between the baseline model and the one you customized.
You should aim to beat the baseline model to make the customization worthwhile

**Question**: How do I figure out the WER of the base models, so I can see if there was improvement? 

**Answer**: The offline test results show accuracy of baseline accuracy of the custom model and the improvement over baseline

## Creating LM

**Question**: How much text data do I need to upload?

**Answer**: This is a difficult question to give a precise answer to, as it depends on how different the vocabulary and phrases
used in your application are from the starting language models. For all new words, it is useful to provide
as many examples as possible of the usage of those words. For common phrases that are used in your application,
including those in the language data is also useful as it tells the system to listen for these terms as well.
It is common to have at least one hundred and typically several hundred utterances in the language data set or more.
Also if certain types * of queries are expected to be more common than others, you can insert multiple copies of the common queries in the data set.

**Question**: Can I just upload a list of words?

**Answer**: Uploading a list of words will get the words into to vocabulary but not teach the system how the words are typically used.
By providing full or partial utterances (sentences or phrases of things users are likely to say) the language model can learn
the new words and how they are used. The custom language model is good not just for getting new words in the system
but also for adjusting the likelihood of known words for your application. Providing full utterances helps the system learn this. 

-----

 * [Overview](cognitive-services-custom-speech-home.md)
 * [Started](cognitive-services-custom-speech-get-started.md)
 * [Glossary](cognitive-services-custom-speech-glossary.md)
