---
title: Speech to Text frequently asked questions
titleSuffix: Azure Cognitive Services
description: Get answers to frequently asked questions about the Speech to Text service.
services: cognitive-services
author: PanosPeriorellis
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 02/01/2021
ms.author: panosper
---

# Speech to Text frequently asked questions

If you can't find answers to your questions in this FAQ, check out [other support options](../cognitive-services-support-options.md?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext%253fcontext%253d%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext).

## General

**Q: What is the difference between a baseline model and a custom Speech to Text model?**

**A**: A baseline model has been trained by using Microsoft-owned data and is already deployed in the cloud. You can use a custom model to adapt a model to better fit a specific environment that has specific ambient noise or language. Factory floors, cars, or noisy streets would require an adapted acoustic model. Topics like biology, physics, radiology, product names, and custom acronyms would require an adapted language model. If you train a custom model, you should start with related text to improve the recognition of special terms and phrases.

**Q: Where do I start if I want to use a baseline model?**

**A**: First, get a [subscription key](overview.md#try-the-speech-service-for-free). If you want to make REST calls to the predeployed baseline models, see the [REST APIs](./overview.md#reference-docs). If you want to use WebSockets, [download the SDK](speech-sdk.md).

**Q: Do I always need to build a custom speech model?**

**A**: No. If your application uses generic, day-to-day language, you don't need to customize a model. If your application is used in an environment where there's little or no background noise, you don't need to customize a model.

You can deploy baseline and customized models in the portal and then run accuracy tests against them. You can use this feature to measure the accuracy of a baseline model versus a custom model.

**Q: How will I know when processing for my dataset or model is complete?**

**A**: Currently, the status of the model or dataset in the table is the only way to know. When the processing is complete, the status is **Succeeded**.

**Q: Can I create more than one model?**

**A**: There's no limit on the number of models you can have in your collection.

**Q: I realized I made a mistake. How do I cancel my data import or model creation that’s in progress?**

**A**: Currently, you can't roll back an acoustic or language adaptation process. You can delete imported data and models when they're in a terminal state.

**Q: I get several results for each phrase with the detailed output format. Which one should I use?**

**A**: Always take the first result, even if another result ("N-Best") might have a higher confidence value. The Speech service considers the first result to be the best. It can also be an empty string if no speech was recognized.

The other results are likely worse and might not have full capitalization and punctuation applied. These results are most useful in special scenarios such as giving users the option to pick corrections from a list or handling incorrectly recognized commands.

**Q: Why are there different base models?**

**A**: You can choose from more than one base model in the Speech service. Each model name contains the date when it was added. When you start training a custom model, use the latest model to get the best accuracy. Older base models are still available for some time when a new model is made available. You can continue using the model that you have worked with until it is retired (see [Model and Endpoint lifecycle](./how-to-custom-speech-model-and-endpoint-lifecycle.md)). It is still recommended to switch to the latest base model for better accuracy.

**Q: Can I update my existing model (model stacking)?**

**A**: You can't update an existing model. As a solution, combine the old dataset with the new dataset and readapt.

The old dataset and the new dataset must be combined in a single .zip file (for acoustic data) or in a .txt file (for language data). When adaptation is finished, the new, updated model needs to be redeployed to obtain a new endpoint

**Q: When a new version of a base model is available, is my deployment automatically updated?**

**A**: Deployments will NOT be automatically updated.

If you have adapted and deployed a model, that deployment will remain as is. You can decommission the deployed model, readapt using the newer version of the base model and redeploy for better accuracy.

Both base models and custom models will be retired after some time (see [Model and Endpoint lifecycle](./how-to-custom-speech-model-and-endpoint-lifecycle.md)).

**Q: Can I download my model and run it locally?**

**A**: You can run a custom model locally in a [Docker container](speech-container-howto.md?tabs=cstt).

**Q: Can I copy or move my datasets, models, and deployments to another region or subscription?**

**A**: You can use the [REST API](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CopyModelToSubscription) to copy a custom model to another region or subscription. Datasets or deployments cannot be copied. You can import a dataset again in another subscription and create endpoints there using the model copies.

**Q: Are my requests logged?**

**A**: By default requests are not logged (neither audio, nor transcription). If necessary, you may select *Log content from this endpoint* option when you [create a custom endpoint](how-to-custom-speech-train-model.md#deploy-a-custom-model). You can also enable audio logging in the [Speech SDK](how-to-use-logging.md) on a per-request basis without creating a custom endpoint. In both cases, audio and recognition results of requests will be stored in secure storage. For subscriptions that use Microsoft-owned storage, they will be available for 30 days.

You can export the logged files on the deployment page in Speech Studio if you use a custom endpoint with *Log content from this endpoint* enabled. If audio logging is enabled via the SDK, call the [API](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModelLogs) to access the files.

**Q: Are my requests throttled?**

**A**: See [Speech Services Quotas and Limits](speech-services-quotas-and-limits.md).

**Q: How am I charged for dual channel audio?**

**A**: If you submit each channel separately (each channel in its own file), you will be charged for the duration of each file. If you submit a single file with each channel multiplexed together, then you will be charged for the duration of the single file. For details on pricing please refer to the [Azure Cognitive Services pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

> [!IMPORTANT]
> If you have further privacy concerns that prohibit you from using the custom Speech service, contact one of the support channels.

## Increasing concurrency
See [Speech Services Quotas and Limits](speech-services-quotas-and-limits.md).


## Importing data

**Q: What is the limit on the size of a dataset, and why is it the limit?**

**A**: The limit is due to the restriction on the size of a file for HTTP upload. See [Speech Services Quotas and Limits](speech-services-quotas-and-limits.md) for the actual limit. You can split your data into multiple datasets and select all of them to train the model.

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

**A**: Yes. You can transcribe it yourself or use a professional transcription service. Some users prefer professional transcribers and others use crowdsourcing or do the transcriptions themselves.

**Q: How long will it take to train a custom model with audio data?**

**A**: Training a model with audio data can be a lengthy process. Depending on the amount of data, it can take several days to create a custom model. If it cannot be finished within one week, the service might abort the training operation and report the model as failed.

Use one of the [regions](custom-speech-overview.md#set-up-your-azure-account) where dedicated hardware is available for training. The Speech service will use up to 20 hours of audio for training in these regions. In other regions, it will only use up to 8 hours.

In general, the service processes approximately 10 hours of audio data per day in regions with dedicated hardware. It can only process about 1 hour of audio data per day in other regions. You can copy the fully trained model to another region using the [REST API](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CopyModelToSubscription). Training with just text is much faster and typically finishes within minutes.

Some base models cannot be customized with audio data. For them the service will just use the text of the transcription for training and ignore the audio data. Training will then be finished much faster and results will be the same as training with just text. See [Language support](language-support.md#speech-to-text) for a list of base models that support training with audio data.

## Accuracy testing

**Q: What is word error rate (WER) and how is it computed?**

**A**: WER is the evaluation metric for speech recognition. WER is counted as the total number of errors,
which includes insertions, deletions, and substitutions, divided by the total number of words in the reference transcription. For more information, see [Evaluate Custom Speech accuracy](how-to-custom-speech-evaluate-data.md#evaluate-custom-speech-accuracy).

**Q: How do I determine whether the results of an accuracy test are good?**

**A**: The results show a comparison between the baseline model and the model you customized. You should aim to beat the baseline model to make customization worthwhile.

**Q: How do I determine the WER of a base model so I can see if there was an improvement?**

**A**: The offline test results show the baseline accuracy of the custom model and the improvement over baseline.

## Creating a language model

**Q: How much text data do I need to upload?**

**A**: It depends on how different the vocabulary and phrases used in your application are from the starting language models. For all new words, it's useful to provide as many examples as possible of the usage of those words. For common phrases that are used in your application, including phrases in the language data is also useful because it tells the system to also listen for these terms. It's common to have at least 100, and typically several hundred or more utterances in the language dataset. Also, if some types of queries are expected to be more common than others, you can insert multiple copies of the common queries in the dataset.

**Q: Can I just upload a list of words?**

**A**: Uploading a list of words will add the words to the vocabulary, but it won't teach the system how the words are typically used. By providing full or partial utterances (sentences or phrases of things that users are likely to say), the language model can learn the new words and how they are used. The custom language model is good not only for adding new words to the system, but also for adjusting the likelihood of known words for your application. Providing full utterances helps the system learn better.

## Tenant Model (Custom Speech with Microsoft 365 data)

**Q: What information is included in the Tenant Model, and how is it created?**

**A:** A Tenant Model is built using [public group](https://support.microsoft.com/office/learn-about-microsoft-365-groups-b565caa1-5c40-40ef-9915-60fdb2d97fa2) emails and documents that can be seen by anyone in your organization.

**Q: What speech experiences are improved by the Tenant Model?**

**A:** When the Tenant Model is enabled, created and published, it is used to improve recognition for any enterprise applications built using the Speech service; that also pass a user Azure AD token indicating membership to the enterprise.

The speech experiences built into Microsoft 365, such as Dictation and PowerPoint Captioning, aren't changed when you create a Tenant Model for your Speech service applications.

## Next steps

- [Troubleshooting](troubleshooting.md)
- [Release notes](releasenotes.md)