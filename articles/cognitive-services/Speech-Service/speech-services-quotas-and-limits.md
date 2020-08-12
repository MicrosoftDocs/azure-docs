---
title: Speech Services Quotas and Limits
titleSuffix: Azure Cognitive Services
description: Quick reference, detailed description and best practices on Azure Cognitive Speech Services Quotas and Limits
services: cognitive-services
author: alexeyo26
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 08/11/2020
ms.author: alexeyo
---

# Speech Services Quotas and Limits

This article contains a quick reference as well as the detailed description of Azure Cognitive Speech Services Quotas and Limits for all [pricing tiers](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/). It also contains some best practices helping to avoid request throttling. 

## Quotas and Limits quick reference
Jump to [Text to Speech Quotas and limits](#text-to-speech-quotas-and-limits-per-speech-resourcesup3sup)
### Speech to Text Quotas and Limits per Speech resource<sup>1</sup>

| Quota | Free (F0) | Standard (S0) |
|--|--|--|
| **Online Transcription Concurrent Request limit (Base and Custom models)** |  |  |
| Default value | 20 | 20 |
| Adjustable | No | Yes |
| **REST API Request limit ([API Management](../../api-management/api-management-key-concepts.md) endpoints)** |  |  |
| Default value | 100 requests per 10 seconds | 100 requests per 10 seconds |
| Adjustable | No | No |
| **Max dataset file for Data Import** |  |  |
| Default value | 2 GB | 2 GB |
| Adjustable | No | No |
| **Max input blob size for Batch Transcription** |  |  |
| Default value | N/A | 2.5 GB |
| Adjustable | N/A | No |
| **Max blob container size for Batch Transcription** |  |  |
| Default value | N/A | 5 GB |
| Adjustable | N/A | No |
| **Max number of blobs per container for Batch Transcription** |  |  |
| Default value | N/A | 10000 |
| Adjustable | N/A | No |
<sup>1</sup> For **Free (F0)** pricing tier see also monthly allowances at the [pricing page.](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/)<br/>
<sup>2</sup> See `!!!Best Practices<br/>

### Text to Speech Quotas and limits per Speech resource<sup>3</sup>
| Quota | Free (F0) | Standard (S0) |
|--|--|--|
| **Max number of Transactions per Second (TPS)** |  |  |
| Default value | 200 | 200 |
| Adjustable | No<sup>4</sup> | No<sup>4</sup> |
| **Max number of Transactions per Second (TPS)** |  |  |
| Default value | 200 | 200 |
| Adjustable | No<sup>4</sup> | No<sup>4</sup> |
<sup>3</sup> For **Free (F0)** pricing tier see also monthly allowances at the [pricing page.](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/)<br/>
<sup>4</sup> See `!!!Best Practices<br/>

## Detailed description, Quota adjustment and best practices
Before requesting a quota increase (where applicable) make sure, that it is really needed. Speech Services is using technologies like [Azure Autoscale](../../azure-monitor/platform/autoscale-overview.md) and [AKS Autoscaler](../../aks/cluster-autoscaler.md) to bring the required computational resources in "on-demand" mode and at the same time to keep the customer costs low by not maintaining an excessive amount of hardware capacity. Every time your application receives a Response Code 429 ("Too many requests") while your payload is within the defined limits (see [Quotas and Limits quick reference](#quotas-and-limits-quick-reference)) the most likely explanation is that the Service is scaling up to your demand and did not reach the required scale yet, thus does not immediately have enough resources to serve the request. This state should be transient and should not last long.

### General best practices to mitigate throttling during autoscaling
To minimize the issues related to throttling (Response Code 429) we recommend using the following techniques:
- Implement re-try logic in your application
- Avoid sharp changes in the payload. Increase the payload gradually <br/>
*Example.* Your application is using Text to Speech and your current workload is 5 TPS (transactions per second). The next second you increase the load to 20 TPS (i.e. four times more). The Service immediately starts scaling up to fulfil the new load, but likely it will not be able to do it within a second, so some of the requests will get Response Code 429.   
- Test the different load increase patterns
  - See specific `!!! example

The next sections describe specific cases of adjusting Quotas.<br/>
Jump to `!!!Text to speech

### Speech to Text. Increasing Online Transcription Concurrent Request limit
By default the number of concurrent requests is limited to 20 per Speech resource (Base model) or per Custom endpoint (Custom model). For Standard pricing tier this amount can be increased. Before submitting the request ensure you are familiar with the material in [this section](#detailed-description-quota-adjustment-and-best-practices) and aware of these [best practices](#general-best-practices-to-mitigate-throttling-during-autoscaling).

Increasing the Concurrent Request limit does **not** directly affect your costs. Speech Services uses "Pay only for what you use" model. The limit defines how high the Service may scale before it starts throttle your requests.

Concurrent Request limits for **Base** and **Custom** models need to be adjusted **separately**.

Existing value of Concurrent Request limit parameter is **not** visible via Azure Portal, Command Line tools or API requests. You need to create an Azure Support Request if you need to verify the existing value.

>[!NOTE]
>[Speech containers](speech-container-howto.md) do not require increases to concurrent request limit, as containers are constrained only by the CPUs of the hardware they are hosted on.

#### Have the required information ready:
- For **Base model**:
  - Speech Resource ID
  - Region
- For **Custom model**: 
  - Region
  - Custom Endpoint ID

- **How to get information (Base model)**:  
  - Go to [Azure Portal](https://portal.azure.com/)
  - Select the Speech Resource for which you would like to increase the Concurrency Request limit
  - Click *Properties* (*Resource Management* group) 
  - Copy ans save the values of the following fields:
    - **Resource ID**
    - **Location** (your endpoint Region)

- **How to get information (Custom Model)**:
  - Go to [Speech Studio](https://speech.microsoft.com/) portal
  - Sign in if necessary
  - Go to Custom Speech
  - Select your project
  - Go to *Deployment*
  - Click the required Endpoint
  - Copy ans save the values of the following fields:
    - **Service Region** (your endpoint Region)
    - **Endpoint ID**
  
#### Create and submit support request
Initiate the increase of Concurrent Request limit for your resource or if necessary check the today's limit by submitting the Support Request:

- Ensure you have the [required information](#have-the-required-information-ready)
- Go to [Azure Portal](https://portal.azure.com/)
- Select the Speech Resource for which you would like to increase (or to check) the Concurrency Request limit
- Click *New support request* (*Support + troubleshooting* group) 
- A new blade will appear with auto-populated information about your Azure Subscription and Azure Resource
- Enter *Summary* (like "Increase STT Concurrency Request limit")
- In *Problem type* select "Quota or Subscription issues"
- In appeared *Problem subtype* select:
  - "Quota or concurrent requests increase" - for an increase request
  - "Quota or usage validation" to check existing limit
- Click *Next: Solutions*
- Proceed further with the request creation
- When in *Details* field enter in the *Description* field:
  - a note, that request is about **Speech to Text** quota
  - **Base** or **Custom** model
  - [Azure resource information you collected before](#have-the-required-information-ready) 
  - Complete entering the required information and click *Create* button in *Review + create* tab
  - Note support request number in Azure Portal notifications. You will be contacted shortly for further processing


# Speech to Text frequently asked questions

If you can't find answers to your questions in this FAQ, check out [other support options](support.md).

## General

**Q: What is the difference between a baseline model and a custom Speech to Text model?**

**A**: A baseline model has been trained by using Microsoft-owned data and is already deployed in the cloud. You can use a custom model to adapt a model to better fit a specific environment that has specific ambient noise or language. Factory floors, cars, or noisy streets would require an adapted acoustic model. Topics like biology, physics, radiology, product names, and custom acronyms would require an adapted language model.

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

**A**: You can choose from more than one baseline model in the Speech service. The Conversational model is useful for recognizing speech that is spoken in a conversational style. This model is ideal for transcribing phone calls. The Search and Dictation model is ideal for voice-triggered apps. The Universal model is a new model that aims to address both scenarios. The Universal model is currently at or above the quality level of the Conversational model in most locales.

**Q: Can I update my existing model (model stacking)?**

**A**: You can't update an existing model. As a solution, combine the old dataset with the new dataset and readapt.

The old dataset and the new dataset must be combined in a single .zip file (for acoustic data) or in a .txt file (for language data). When adaptation is finished, the new, updated model needs to be redeployed to obtain a new endpoint

**Q: When a new version of a baseline is available, is my deployment automatically updated?**

**A**: Deployments will NOT be automatically updated.

If you have adapted and deployed a model with baseline V1.0, that deployment will remain as is. Customers can decommission the deployed model, readapt using the newer version of the baseline and redeploy.

**Q: Can I download my model and run it locally?**

**A**: Models can't be downloaded and executed locally.

**Q: Are my requests logged?**

**A**: By default requests are not logged (neither audio, nor transcription). If required you may select *Log content from this endpoint* option when you [create a custom endpoint](how-to-custom-speech-deploy-model.md) to enable tracing. Then requests will be logged in Azure in secure storage.

**Q: Are my requests throttled?**

**A**: The REST API limits requests to 25 per 5 seconds. Details can be found in our pages for [Speech to text](speech-to-text.md).

**Q: How am I charged for dual channel audio?**

**A**: If you submit each channel separately (each channel in its own file), you will be charged for the duration of each file. If you submit a single file with each channel multiplexed together, then you will be charged for the duration of the single file. For details on pricing please refer to the [Azure Cognitive Services pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

> [!IMPORTANT]
> If you have further privacy concerns that prohibit you from using the custom Speech service, contact one of the support channels.

## Increasing concurrency

**Q: What if I need higher concurrency for my deployed model than what is offered in the portal?**

**A**: You can scale up your model in increments of 20 concurrent requests.

With the required information, create a support request in the [Azure support portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview). Do not post the information on any of the public channels  (GitHub, Stackoverflow, ...) mentioned on the [support page](support.md).

To increase concurrency for a ***custom model***, we need the following information:

- The region where the model is deployed,
- the endpoint ID of the deployed model:
  - Got to the [Custom Speech Portal](https://aka.ms/customspeech),
  - sign in (if necessary),
  - select your project and deployment,
  - select the endpoint you need the concurrency increase for,
  - copy the `Endpoint ID`.

To increase concurrency for a ***base model***, we need the following information:

- The region of your service,

and either

- an access token for your subscription (see [here](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-speech-to-text#how-to-get-an-access-token)),

or

- the Resource ID for your subscription:
  - Go to the [Azure portal](https://portal.azure.com),
  - select `Cognitive Services` in the search box,
  - from the displayed services pick the Speech service you want the concurrency increased for,
  - display the `Properties` for this service,
  - copy the complete `Resource ID`.
  
**Q: Does increasing my concurrency limit increase my cost?**

**A**: No, cost is based on usage. Increasing concurrency does not lead to higher costs. See our [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) for details on cost. 
  
>[!NOTE]
>[Containers](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-container-howto) do not require increases to concurrency limits, as containers are constrained only by the CPUs of the hardware they are hosted on.

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

## Tenant Model (Custom Speech with Office 365 data)

**Q: What information is included in the Tenant Model, and how is it created?**

**A:** A Tenant Model is built using [public group](https://support.office.com/article/learn-about-office-365-groups-b565caa1-5c40-40ef-9915-60fdb2d97fa2) emails and documents that can be seen by anyone in your organization.

**Q: What speech experiences are improved by the Tenant Model?**

**A:** When the Tenant Model is enabled, created and published, it is used to improve recognition for any enterprise applications built using the Speech service; that also pass a user AAD token indicating membership to the enterprise.

The speech experiences built into Office 365, such as Dictation and PowerPoint Captioning, aren't changed when you create a Tenant Model for your Speech service applications.

## Next steps

- [Troubleshooting](troubleshooting.md)
- [Release notes](releasenotes.md)
