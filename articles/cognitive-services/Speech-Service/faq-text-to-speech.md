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

# Text To Speech Frequently Asked Questions

If you can't find answers to your questions in this FAQ, check out other support options [here](support.md).

## General

**Question**: What is the difference between the standard and custom voice models?

**Answer**: The standard voice models (a.k.a. voice fonts) have been trained with Microsoft owned data and are already deployed in the cloud. Custom voice models allow the user either to adapt an average model and transfer the timbre and the expression fashion according to the speaker’s voice style, or to train a full new model based on the training data prepared by the user. Today more and more customers want to have a one-of-a-kind, branded voice for their bots. The custom voice building platform is the right choice for that.

**Question**: Where do I start if I want to use a standard voice model?

**Answer**: More than 80 standard voice models in over 45 languages are available through HTTP requests. First you need to get a [subscription key](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started). To make REST calls to the pre-deployed voice models, consult the [details here](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/rest-apis#text-to-speech).

**Question**: If I want to use a customized voice model, is the API the same as the standard voices?

**Answer**: When you have the custom voice model created and deployed, you will get a unique endpoint for your model. You need to specify the endpoint in your HTTP requests, to use the voice to speak in your apps. The same functionality available via the REST API for the Text-to-Speech service is also available for your custom endpoint. See how to [create and use your custom endpoint](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-customize-voice-font#create-and-use-a-custom-endpoint).

**Question**: Do I need to prepare the training data for creating custom voice models on my own?

**Answer**: You will need to prepare the training data for yourself. 
A collection of speech data is required to create a customized voice model. This collection consists of a set of audio files of speech recordings, and a text file of the transcription of each audio file. The result of your digital voice heavily relies on the quality of your training data. To produce a good TTS voice, it is important that the recordings are done in a quiet room with a high-quality standing microphone. Consistent volume, speaking rate, speaking pitch, and even consistency in expressive mannerisms of speech are essential for building a great digital voice. We highly recommend that you should have the voices recorded in a recording studio.
At the moment we do not provide online recording support or have any recording studio recommendations. For the format requirement, see [how to prepare recordings and transcripts](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-customize-voice-font#prepare-recordings-and-transcripts)
 
**Question**: What scripts should I use for recording the speech data for custom voice training? 

**Answer**: We do not limit the scripts for voice recording. You can use your own scripts to record the speech. Just ensure you have enough phonetic coverage in your speech data. To train a custom voice, you can start with a small volume of speech data, which could be 50 different sentences (about 3-5 mins of speech). The more data you provide, the more natural your voice will be. You can start to train a full voice font when you provide recordings of more than 2000 sentences (about 3-4 hours of speech). To get a high quality full voice, you will need to prepare recordings of more than 6000 sentences (about 8-10 hours of speech).  
We provide additional services to help you prepare scripts for recording. Contact [Custom Voice customer support](mailto:customvoice@microsoft.com?subject=Inquiries%20about%20scripts%20generation%20for%20Custom%20Voice%20creation) for inquiries.

**Question**: What if I need higher concurrency than the default value or what is offered in the portal?

**Answer**: You can scale up your model in increments of 20 concurrent requests. Contact [Custom Voice customer support](mailto:customvoice@microsoft.com?subject=Inquiries%20about%20scripts%20generation%20for%20Custom%20Voice%20creation) for inquiries on higher scaling.

**Question**: Can I download my model and run it locally?

**Answer**: Models cannot be downloaded and executed locally.

## Next steps

* [Troubleshooting](troubleshooting.md)
* [Release notes](releasenotes.md)
