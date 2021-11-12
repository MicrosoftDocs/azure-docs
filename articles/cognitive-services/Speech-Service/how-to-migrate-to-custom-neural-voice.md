---
title: Migrate from custom voice to custom neural voice - Speech service
titleSuffix: Azure Cognitive Services
description: This document helps users migrate from custom voice to custom neural voice.
services: cognitive-services
author: sally-baolian
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/12/2021
ms.author: v-baolianzou
---

# Migrate from custom voice to custom neural voice

The standard/non-neural training tier (statistical parametric, concacenative) of custom voice is being deprecated. The announcement has been sent out to all existing Speech subscriptions before 2/28/2021. During the deprecation period (3/1/2021 - 2/29/2024), existing standard tier users can continue to use their non-neural models created. All new users/new speech resources should move to the neural tier/custom neural voice. After 2/29/2024, all standard/non-neural custom voices will no longer be supported. 

If you are using non-neural/standard custom voice,  migrate to custom neural voice immediately following the steps below. Moving to custom neural voice will help you develop more realistic voices for even more natural conversational interfaces and enable your customers and end users to benefit from the latest Text-to-Speech technology, in a responsible way. 

1. Learn more about our [policy on the limit access](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) and [apply here](https://aka.ms/customneural). Note that the access to the custom neural voice service is subject to Microsoft’s sole discretion based on our eligibility criteria. Customers may gain access to the technology only after their application is reviewed and they have committed to using it in alignment with our [Responsible AI principles](https://microsoft.com/ai/responsible-ai) and the [code of conduct](/legal/cognitive-services/speech-service/tts-code-of-conduct?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext). 
2. Once your application is approved, you will be provided with the access to the "neural" training feature. Make sure you log in to [Speech Studio](https://speech.microsoft.com) using the same Azure subscription that you provide in your application. 
    > [!IMPORTANT]
    > To protect voice talent and prevent training of voice models with unauthorized recording or without the acknowledgement from the voice talent, we require the customer to upload a recorded statement of the voice talent giving their consent. When preparing your recording script, make sure you include this sentence. 
    > “I [state your first and last name] am aware that recordings of my voice will be used by [state the name of the company] to create and use a synthetic version of my voice.”
    > This sentence must be uploaded to the **Set up voice talent** tab as a verbal consent file. It will be used to verify if the recordings in your training datasets are done by the same person that makes the consent.
3. After the custom neural voice model is created, deploy the voice model to a new endpoint. To create a new custom voice endpoint with your neural voice model, go to **Text-to-Speech > Custom Voice > Deploy model**. Select **Deploy models** and enter a **Name** and **Description** for your custom endpoint. Then select the custom neural voice model you would like to associate with this endpoint and confirm the deployment.  
4. Update your code in your apps if you have created a new endpoint with a new model. 

## Regional support for custom voices

If you've created a custom voice font, use the endpoint that you've created. You can also use the endpoints listed below, replacing the `{deploymentId}` with the deployment ID for your voice model.

| Region | Endpoint |
|--------|----------|
| Australia East | `https://australiaeast.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Brazil South | `https://brazilsouth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Canada Central | `https://canadacentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Central US | `https://centralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| East Asia | `https://eastasia.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| East US | `https://eastus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| East US 2 | `https://eastus2.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| France Central | `https://francecentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| India Central | `https://centralindia.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Japan East | `https://japaneast.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Japan West | `https://japanwest.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Korea Central | `https://koreacentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| North Central US | `https://northcentralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| North Europe | `https://northeurope.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| South Central US | `https://southcentralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Southeast Asia | `https://southeastasia.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| UK South | `https://uksouth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West Europe | `https://westeurope.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West Central US | `https://westcentralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West US | `https://westus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West US 2 | `https://westus2.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |

## Custom voice and custom neural voice quotas and limits per speech resource

| Quota | Free (F0)<sup>1</sup> | Standard (S0) |
|--|--|--|
| Max number of Transactions per Second (TPS) per Speech resource</br>Real-time API. prebuilt standard voice, prebuilt neural voice, custom voice, and custom neural voice | 200<sup>2</sup>| 200<sup>2</sup>|
| Max number of data sets per Speech resource | 10 | 500 |
| Max number of simultaneous dataset upload per Speech resource | 2 | 5 |
| Max data file size for data import per dataset | 2 GB | 2 GB |
| Upload of long audios or audios without script | No | Yes |
| Max number of simultaneous model trainings per Speech resource | 1 (custom voice only) | 3 |
| Max number of custom endpoints per Speech resource | 1 (custom voice only) | 50 |
| **Concurrent Request limit for custom neural voice** |  |  |
| Default value | N/A | 10 |
| Adjustable | N/A | Yes<sup>3</sup> |
| **Concurrent Request limit for custom voice** |  |  |
| Default value | 10 | 10 |
| Adjustable | No<sup>3</sup> | Yes<sup>3</sup> |

<sup>1</sup> For **Free (F0)** pricing tier see also monthly allowances at the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).<br/>
<sup>2</sup> See [additional explanations](speech-services-quotas-and-limits.md#detailed-description-quota-adjustment-and-best-practices) and [best practices](speech-services-quotas-and-limits.md#general-best-practices-to-mitigate-throttling-during-autoscaling).<br/>
<sup>3</sup> See [additional explanations](speech-services-quotas-and-limits.md#detailed-description-quota-adjustment-and-best-practices), [best practices](speech-services-quotas-and-limits.md#general-best-practices-to-mitigate-throttling-during-autoscaling),  and [adjustment instructions](#increasing-concurrent-request-limit-for-custom-neural-voice-and-custom-voice).<br/>

## Increasing concurrent request limit for custom neural voice and custom voice

By default the number of concurrent requests for custom neural voice and custom voice endpoints is limited to 10. For the Standard pricing tier, this amount can be increased. For more details, read the [speech service quotas and limits](speech-services-quotas-and-limits.md)

## Next steps

- [Try out custom neural voice](custom-neural-voice.md)
