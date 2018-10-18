---
title: Frequently asked questions about the Speech to Text service in Azure
description: Get answers to the most popular questions about the Speech to Text service.
titleSuffix: "Azure Cognitive Services"
services: cognitive-services
author: PanosPeriorellis
ms.service: cognitive-services
ms.component: custom-speech
ms.topic: article
ms.date: 06/11/2018
ms.author: panosper
---

# Speech to Text frequently asked questions

If you can't find answers to your questions in this FAQ, check out [other support options](support.md).

## General

**Q: What is the difference between a baseline model and a custom Speech to Text model?**

**A**: A baseline model has been trained by using Microsoft-owned data and is already deployed in the cloud.  You can use a custom model to adapt a model to better fit a specific environment that has specific ambient noise or language. Factory floors, cars, or noisy streets would require an adapted acoustic model. Topics like biology, physics, radiology, product names, and custom acronyms would require an adapted language model.

**Q: Where do I start if I want to use a baseline model?**

**A**: First, get a [subscription key](get-started.md). If you want to make REST calls to the predeployed baseline models, see the [REST APIs](rest-apis.md). If you want to use WebSockets, [download the SDK](speech-sdk.md).

**Q: Do I always need to build a custom speech model?**

**A**: No. If your application uses generic, day-to-day language, you don't need to customize a model. If your application is used in an environment where there's little or no background noise, you don't need to customize a model. 

You can deploy baseline and customized models in the portal and then run accuracy tests against them. You can use this feature to measure the accuracy of a baseline model versus a custom model.

**Q: How will I know when processing for my dataset or model is complete?**

**A**: Currently, the status of the model or dataset in the table is the only way to know. When the processing is complete, the status is **Succeeded**.

**Q: Can I create more than one model?**

**A**: There's no limit on the number of models you can have in your collection.

**Q: I realized I made a mistake. How do I cancel my data import or model creation that’s in progress?**

**A**: Currently, you can't roll back an acoustic or language adaptation process. You can delete imported data and models when they're in a terminal state.

**Q: What's the difference between the Search and Dictation model and the Conversational model?**

**A**: You can choose from more than one baseline model in the Speech service. The Conversational model is useful for recognizing speech that is spoken in a conversational style. This model is ideal for transcribing phone calls. The Search and Dictation model is ideal for voice-triggered apps. The Universal model is a new model that aims to address both scenarios.

**Q: Can I update my existing model (model stacking)?**

**A**: You can't update an existing model. As a solution, combine the old dataset with the new dataset and readapt.

The old dataset and the new dataset must be combined in a single .zip file (for acoustic data) or in a .txt file (for language data). When adaptation is finished, the new, updated model needs to be redeployed to obtain a new endpoint

**Q: When a new version of a baseline is available is my deployment automatically updated?**

**A**: Deployments will NOT be automatically updated. 

If you have adapted and deployed a model with baseline V1.0, that deployment will remain as is. Customers can decommision the deployed model, re-adapt using the newer version of the baseline and re-deploy.

**Q: What if I need higher concurrency for my deployed model than what is offered in the portal?** 

**A**: You can scale up your model in increments of 20 concurrent requests. 

Contact us if you require a higher scale.

**Q: Can I download my model and run it locally?**

**A**: Models can't be downloaded and executed locally.

**Q: Are my requests logged?**

**A**: You have a choice when you create a deployment to switch off tracing. At that point, no audio or transcriptions will be logged. Otherwise, requests are typically logged in Azure in secure storage. 

**Q: Are my requests throttled?**

**A**: The REST API limits requests to 25 per 5 seconds. Details can be found in our pages for [Speech to text](speech-to-text.md). 

If you have further privacy concerns that prohibit you from using the custom Speech service, contact one of the support channels.

## Importing data

**Q: What is the limit on the size of a dataset, and why is it the limit?**

**A**: The current limit for a dataset is 2 GB. The limit is due to the restriction on the size of a file for HTTP upload. 

**Q: Can I zip my text files so I can upload a larger text file?** 

**A**: No. Currently, only uncompressed text files are allowed.

**Q: The data report says there were failed utterances. What is the issue?**

**A**: Failing to upload 100 percent of the utterances in a file is not a problem. If the vast majority of the utterances in an acoustic or language dataset (for example, more than 95 percent) are successfully imported, the dataset can be usable. However, we recommend that you try to understand why the utterances failed and fix the problems. Most common problems, such as formatting errors, are easy to fix. 

## Creating an acoustic model

**Q: How much acoustic data do I need?**

**A**: We recommend starting with between 30 minutes and one hour of acoustic data.

**Q: What data should I collect?**

**A**: Collect data that's as close to the application scenario and use case as possible. The data collection should match the target application and users in terms of device or devices, environments, and types of speakers. In general, you should collect data from as broad a range of speakers as possible. 

**Q: How should I collect acoustic data?**

**A**: You can create a standalone data collection application or use off-the-shelf audio recording software. You can also create a version of your application that logs the audio data and then uses the data. 

**Q: Do I need to transcribe adaptation data myself?**

**A**: Yes! You can transcribe it yourself or use a professional transcription service. Some users prefer professional transcribers and others use crowdsourcing or do the transcriptions themselves.

## Accuracy testing

**Q: Can I perform offline testing of my custom acoustic model by using a custom language model?**

**A**: Yes, just select the custom language model in the drop-down menu when you set up the offline test.

**Q: Can I perform offline testing of my custom language model by using a custom acoustic model?**

**A**: Yes, just select the custom acoustic model in the drop-down menu when you set up the offline test.

**Q: What is word error rate (WER) and how is it computed?**

**A**: WER is the evaluation metric for speech recognition. WER is counted as the total number of errors,
which includes insertions, deletions, and substitutions, divided by the total number of words in the reference transcription. For more information, see [word error rate](https://en.wikipedia.org/wiki/Word_error_rate).

**Q: How do I determine whether the results of an accuracy test are good?**

**A**: The results show a comparison between the baseline model and the model you customized. You should aim to beat the baseline model to make customization worthwhile.

**Q: How do I determine the WER of a base model so I can see if there was an improvement?** 

**A**: The offline test results show the baseline accuracy of the custom model and the improvement over baseline.

## Creating a language model

**Q: How much text data do I need to upload?**

**A**: It depends on how different the vocabulary and phrases used in your application are from the starting language models. For all new words, it's useful to provide as many examples as possible of the usage of those words. For common phrases that are used in your application, including phrases in the language data is also useful because it tells the system to also listen for these terms. It's common to have at least 100, and typically several hundred or more utterances in the language dataset. Also, if some types of queries are expected to be more common than others, you can insert multiple copies of the common queries in the dataset.

**Q: Can I just upload a list of words?**

**A**: Uploading a list of words will add the words to the vocabulary, but it won't teach the system how the words are typically used. By providing full or partial utterances (sentences or phrases of things that users are likely to say), the language model can learn the new words and how they are used. The custom language model is good not only for adding new words to the system, but also for adjusting the likelihood of known words for your application. Providing full utterances helps the system learn better. 

## Next steps

* [Troubleshooting](troubleshooting.md)
* [Release notes](releasenotes.md)
