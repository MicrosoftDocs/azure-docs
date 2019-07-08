---
title: Frequently asked questions about the Text to Speech service in Azure
titleSuffix: Azure Cognitive Services
description: Get answers to the most popular questions about the Text to Speech service.
services: cognitive-services
author: PanosPeriorellis
manager: nitinme

ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: panosper
---

# Text to Speech frequently asked questions

If you can't find answers to your questions in this FAQ, check out [other support options](support.md).

## General

**Q: What is the difference between a standard voice model and a custom voice model?**

**A**: The standard voice model (also called a *voice font*) has been trained by using Microsoft-owned data and is already deployed in the cloud. You can use a custom voice model either to adapt an average model and transfer the timbre and expression of the speaker’s voice style or train a full, new model based on the training data prepared by the user. Today, more and more customers want a one-of-a-kind, branded voice for their bots. The custom voice-building platform is the right choice for that option.

**Q: Where do I start if I want to use a standard voice model?**

**A**: More than 80 standard voice models in over 45 languages are available through HTTP requests. First, get a [subscription key](https://docs.microsoft.com/azure/cognitive-services/speech-service/get-started). To make REST calls to the predeployed voice models, see the [REST API](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis).

**Q: If I want to use a customized voice model, is the API the same as the one that's used for standard voices?**

**A**: When a custom voice model is created and deployed, you get a unique endpoint for your model. To use the voice to speak in your apps, you must specify the endpoint in your HTTP requests. The same functionality that's available in the REST API for the Text to Speech service is available for your custom endpoint. Learn how to [create and use your custom endpoint](https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-customize-voice-font#create-and-use-a-custom-voice-endpoint).

**Q: Do I need to prepare the training data to create custom voice models on my own?**

**A**: Yes, you must prepare the training data yourself for a custom voice model.

A collection of speech data is required to create a customized voice model. This collection consists of a set of audio files of speech recordings and a text file of the transcription of each audio file. The result of your digital voice relies heavily on the quality of your training data. To produce a good text-to-speech voice, it's important that the recordings are made in a quiet room with a high-quality, standing microphone. A consistent volume, speaking rate, and speaking pitch, and even consistency in expressive mannerisms of speech are essential for building a great digital voice. We highly recommend recording the voices in a recording studio.

Currently, we don't provide online recording support or have any recording studio recommendations. For the format requirement, see [how to prepare recordings and transcripts](https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-custom-voice-create-voice).

**Q: What scripts should I use to record the speech data for custom voice training?**

**A**: We don't limit the scripts for voice recording. You can use your own scripts to record the speech. Just ensure that you have sufficient phonetic coverage in your speech data. To train a custom voice, you can start with a small volume of speech data, which might be 50 different sentences (about 3-5 minutes of speech). The more data you provide, the more natural your voice will be. You can start to train a full voice font when you provide recordings of more than 2,000 sentences (about 3-4 hours of speech). To get a high-quality, full voice, you need to prepare recordings of more than 6,000 sentences (about 8-10 hours of speech).

We provide additional services to help you prepare scripts for recording. Contact [Custom Voice customer support](mailto:customvoice@microsoft.com?subject=Inquiries%20about%20scripts%20generation%20for%20Custom%20Voice%20creation) for inquiries.

**Q: What if I need higher concurrency than the default value or what is offered in the portal?**

**A**: You can scale up your model in increments of 20 concurrent requests. Contact [Custom Voice customer support](mailto:customvoice@microsoft.com?subject=Inquiries%20about%20scripts%20generation%20for%20Custom%20Voice%20creation) for inquiries about higher scaling.

**Q: Can I download my model and run it locally?**

**A**: Models can't be downloaded and executed locally.

**Q: Are my requests throttled?**

**A**: The REST API limits requests to 25 per 5 seconds. Details can be found in our pages for [Text to Speech](text-to-speech.md).

## Next steps

* [Troubleshooting](troubleshooting.md)
* [Release notes](releasenotes.md)
