---
title: Frequently asked questions for Speech to Text Service on Azure
description: Here are answers to the most popular questions about the Speech to Text.
services: cognitive-services
author: PanosPeriorellis
ms.service: cognitive-services
ms.component: custom-speech
ms.topic: article
ms.date: 06/11/2018
ms.author: panosper
---

# Speech To Text Frequently Asked Questions

If you can't find answers to your questions in this FAQ, check out other support options [here](support.md).

## General

**Question**: What is the difference between baseline and custom Speech to Text Models?

**Answer**: Baseline models have been trained with Microsoft owned data and are already deployed in the cloud. Custom models allow the user to adapt a model to better fit a particular environment with specific ambient noise or language. Factory floors, cars, noisy streets would require adapted acoustic model whereas specific topics such as biology, physics, radiology, product names, and custom acronyms would require an adapted language model.

**Question**: Where do I start if I want to use a baseline model?

**Answer**: First you need to get a [subscription key](get-started.md). If you want to make REST calls to the predeployed baseline models, consult the [details here](rest-apis.md). If you want to use WebSockets download the [SDK](speech-sdk.md)

**Question**: Do I always need to build a custom speech model?

**Answer**: No, if your application is using generic day to day language then you do not need to customize a model. In addition if your application is used in an environment where there is little or no background noise then you do not need to customize either. The portal allows users to deploy baseline and customized models and run accuracy tests against them. Users can use this feature to measure accuracy of a baseline vs a custom model.

**Question**: How will I know when the processing of my data set or model is complete?

**Answer**: Currently, the status of the model or data set in the table is the only way to know.
When the processing is complete, the status will be "Succeeded".

**Question**: Can I create more than one model?

**Answer**: There is no limit to how many models are in your collection.

**Question**: I realized I made a mistake. How do I cancel my data import or model creation that’s in progress? 

**Answer**: Currently you cannot roll back an acoustic or language adaptation process. Imported data and models can be deleted after they are in a terminal state.

**Question**: What is the difference between the Search & Dictation Models and the Conversational Models?

**Answer**: There are more than one baseline models to choose from in the Speech Service. The Conversational model is appropriate for recognizing speech spoken in a conversational style. This model would be ideal for transcribing calls while search and Dictation is ideal for voice triggered Apps. Universal is a new model that aims to address both scenarios.

**Question**: Can I update my existing model (model stacking)?

**Answer**: Existing models cannot be updated. As a work around combine the old dataset with the new and readapt.

The old and new data sets must be combined in a single .zip (if it is acoustic data) or a .txt file if it is language data. Once adaptation is done the new updated model needs to be de-deployed to obtain a new endpoint

**Question**: What if I need higher concurrency for my deployed model than what is offered in the portal. 

**Answer**: You can scale up your model in increments of 20 concurrent requests. 

Contact us if you require higher scale.

**Question**: Can I download my model and run it locally?

**Answer**: Models cannot be downloaded and executed locally.

**Question**: Are my requests logged?

**Answer**: You have a choice during the creation of a deployment to switch off tracing, at which point no audio or transcriptions will be logged. Otherwise requests are typically logged in Azure in secure storage. If you have further privacy concerns that prohibit you from using the Custom Speech Service, contact one of the support channels.

## Importing Data

**Question**: What is the limit on the size of the data set? Why? 

**Answer**: The current limit for a data set is 2 GB, due to the restriction on the size of a file for HTTP upload. 

**Question**: Can I zip my text files in order to upload a larger text file? 

**Answer**: No, currently only uncompressed text files are allowed.

**Question**: The data report says there were failed utterances. What is the issue?

**Answer**: Failing to upload 100% of the utterances in a file is not a problem.
If the vast majority of the utterances in an acoustic or language data set (for example, >95%) are successfully imported, the data set can be usable. However, it is recommended that you try to understand why the utterances failed and fix the problems. Most common problems, such as formatting errors, are easy to fix. 

## Creating AM

**Question**: How much acoustic data do I need?

**Answer**: We recommend starting with 30 minutes to one hour of acoustic data.

**Question**: What data should I collect?

**Answer**: Collect data that's as close to the application scenario and use case as possible.
The data collection should match the target application and users in terms of device or devices,
environments, and types of speakers. In general, you should collect data from as broad a range of speakers as possible. 

**Question**: How should I collect it? 

**Answer**: You can create a standalone data collection application or use some off the shelf audio recording software.
You can also create a version of your application that logs the audio data and uses that. 

**Question**: Do I need to transcribe adaptation data myself? 

**Answer**: Yes! You can transcribe it yourself or use a professional transcription service. Some users prefer professional transcribers while others
use crowdsourcing or do the transcriptions themselves.

## Accuracy Testing

**Question**: Can I perform offline testing of my custom acoustic model using a custom language model?

**Answer**: Yes, just select the custom language model in the drop-down when you set up the offline test

**Question**: Can I perform offline testing of my custom language model using a custom acoustic model?

**Answer**: Yes, just select the custom acoustic model in the drop-down menu when you set up the offline test.

**Question**: What is Word Error Rate (WER) and how is it computed?

**Answer**: Word Error Rate (WER) is the evaluation metric for speech recognition. It is counted as the total number of errors,
which includes insertions, deletions, and substitutions, divided by the total number of words in the reference transcription. More details [here](https://en.wikipedia.org/wiki/Word_error_rate).

**Question**: How do I determine if the results of an accuracy test is good?

**Answer**: The results show a comparison between the baseline model and the one you customized.
You should aim to beat the baseline model to make the customization worthwhile.

**Question**: How do I figure out the Word Error Rate of the base models, so I can see if there was improvement? 

**Answer**: The offline test results show accuracy of baseline accuracy of the custom model and the improvement over baseline.

## Creating LM

**Question**: How much text data do I need to upload?

**Answer**: It depends on how different the vocabulary and phrases used in your application are from the starting language models. For all new words, it is useful to provide as many examples as possible of the usage of those words. For common phrases that are used in your application, including phrases in the language data is also useful as it tells the system to listen for these terms as well. It is common to have at least one hundred and typically several hundred utterances in the language data set or more. Also if certain types of queries are expected to be more common than others, you can insert multiple copies of the common queries in the data set.

**Question**: Can I just upload a list of words?

**Answer**: Uploading a list of words will get the words into to vocabulary but not teach the system how the words are typically used.
By providing full or partial utterances (sentences or phrases of things users are likely to say) the language model can learn the new words and how, they are used. The custom language model is good not just for getting new words in the system
but also for adjusting the likelihood of known words for your application. Providing full utterances helps the system learn better. 

## Next steps

* [Troubleshooting](troubleshooting.md)
* [Release notes](releasenotes.md)
