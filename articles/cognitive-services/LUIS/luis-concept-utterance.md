---
title: Utterances in LUIS apps in Azure | Microsoft Docs
description: Add utterances in Language Understanding Intelligent Service (LUIS) apps.
services: cognitive-services
author: DeniseMak
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/01/2017
ms.author: cahann
---
# Utterances in LUIS

**Utterances** are input from the user that your app needs to interpret. To train LUIS to extract intents and entities from them, it's important to capture a variety of different inputs for each intent. Active learning, or the process of continuing to train on new utterances, is essential to machine-learned intelligence that LUIS provides.

Collect phrases that you think users will say, and include utterances that mean the same thing but are constructed differently. 


## How to choose varied utterances
When you first get started by [adding example utterances][add-example-utterances] to your LUIS model, here are some principles to keep in mind.


### Utterances aren't always well formed
It may be a sentence, like "Book me a ticket to Paris", or a fragment of a sentence, like "Booking" or "Paris flight."  Users often make spelling mistakes. When planning your app, consider whether or not you will spell check user input before passing it to LUIS. The [Bing Spell Check API][BingSpellCheck] integrates with LUIS. You can associate your LUIS app with an external key for the Bing Spell Check API when you publish it. If you do not spell check user utterances, you should train LUIS on utterances that include typos and misspellings.

### Use the representative language of the user
When choosing utterances, be aware that what you think is a common term or phrase might not be to the typical user of your client application. They may not have domain experience. So be careful when using terms or phrases that a user would only say if they were an expert.

### Choose varied terminology as well as phrasing
You will find that even if you make efforts to varied create sentence patterns, you will still repeat some vocabulary.

Take these example utterances:
```
how do I get a computer?
Where do I get a computer?
I want to get a computer, how do I go about it?
When can I have a computer? 
```
The core term here, "computer", is not varied. They could say desktop computer, laptop, workstation, or even just machine. LUIS can be quite intelligent at inferring synonyms from context, but when you create utterances for training, it's still better to vary them.

## Next steps
See [Add example utterances][add-example-utterances] for information on training a LUIS app to understand user utterances.

[add-example-utterances]: Add-example-utterances.md
[BingSpellCheck]: https://docs.microsoft.com/en-us/azure/cognitive-services/bing-spell-check/proof-text