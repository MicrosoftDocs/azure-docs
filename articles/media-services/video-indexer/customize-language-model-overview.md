---
title: Customize a Language model in Video Indexer - Azure  
titleSuffix: Azure Media Services
description: This article gives an overview of what is a Language model in Video Indexer and how to customize it.
services: media-services
author: anikaz
manager: johndeu

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 05/15/2019
ms.author: anzaman
---

# Customize a Language model with Video Indexer

Video Indexer supports automatic speech recognition through integration with the Microsoft [Custom Speech Service](https://azure.microsoft.com/services/cognitive-services/custom-speech-service/). You can customize the Language model by uploading adaptation text, namely text from the domain whose vocabulary you'd like the engine to adapt to. Once you train your model, new words appearing in the adaptation text will be recognized, assuming default pronunciation, and the Language model will learn new probable sequences of words. Custom Language models are supported for English, Spanish, French, German, Italian, Chinese (Simplified), Japanese, Russian, Portuguese, Hindi, and Korean. 

Let's take a word that is highly specific, like "Kubernetes" (in the context of Azure Kubernetes service), as an example. Since the word is new to Video Indexer, it is recognized as "communities". You need to train the model to recognize it as "Kubernetes". In other cases, the words exist, but the Language model is not expecting them to appear in a certain context. For example, "container service" is not a 2-word sequence that a non-specialized Language model would recognize as a specific set of words.

You have the option to upload words without context in a list in a text file. This is considered partial adaptation. Alternatively, you can upload text file(s) of documentation or sentences related to your content for better adaptation.

You can use the Video Indexer APIs or the website to create and edit custom Language models, as described in topics in the [Next steps](#next-steps) section of this topic.

## Best practices for custom Language models

Video Indexer learns based on probabilities of word combinations, so to learn best:

* Give enough real examples of sentences as they would be spoken.
* Put only one sentence per line, not more. Otherwise the system will learn probabilities across sentences.
* It is okay to put one word as a sentence to boost the word against others, but the system learns best from full sentences.
* When introducing new words or acronyms, if possible, give as many examples of usage in a full sentence to give as much context as possible to the system.
* Try to put several adaptation options, and see how they work for you.
* Avoid repetition of the exact same sentence multiple times. It may create bias against the rest of the input.
* Avoid including uncommon symbols (~, # @ % &) as they will get discarded. The sentences in which they appear will also get discarded.
* Avoid putting too large inputs, such as hundreds of thousands of sentences, because doing so will dilute the effect of boosting.

## Next steps

[Customize Language model using APIs](customize-language-model-with-api.md)

[Customize Language model using the website](customize-language-model-with-website.md)
