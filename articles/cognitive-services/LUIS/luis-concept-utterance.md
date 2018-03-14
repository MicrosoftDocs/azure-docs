---
title: Utterances in LUIS apps in Azure | Microsoft Docs
description: Add utterances in Language Understanding Intelligent Service (LUIS) apps.
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 02/13/2018
ms.author: v-geberr
---
# Utterances in LUIS

**Utterances** are input from the user that your app needs to interpret. To train LUIS to extract intents and entities from them, it's important to capture a variety of different inputs for each intent. Active learning, or the process of continuing to train on new utterances, is essential to machine-learned intelligence that LUIS provides.

Collect phrases that you think users will say, and include utterances that mean the same thing but are constructed differently. 

## How to choose varied utterances
When you first get started by [adding example utterances][add-example-utterances] to your LUIS model, here are some principles to keep in mind.

### Utterances aren't always well formed
It may be a sentence, like "Book me a ticket to Paris", or a fragment of a sentence, like "Booking" or "Paris flight."  Users often make spelling mistakes. When planning your app, consider whether or not you spell-check user input before passing it to LUIS. The [Bing Spell Check API][BingSpellCheck] integrates with LUIS. You can associate your LUIS app with an external key for the Bing Spell Check API when you publish it. If you do not spell check user utterances, you should train LUIS on utterances that include typos and misspellings.

### Use the representative language of the user
When choosing utterances, be aware that what you think is a common term or phrase might not be to the typical user of your client application. They may not have domain experience. So be careful when using terms or phrases that a user would only say if they were an expert.

### Choose varied terminology as well as phrasing
You will find that even if you make efforts to create varied sentence patterns, you will still repeat some vocabulary.

Take these example utterances:
```
how do I get a computer?
Where do I get a computer?
I want to get a computer, how do I go about it?
When can I have a computer? 
```
The core term here, "computer", is not varied. They could say desktop computer, laptop, workstation, or even just machine. LUIS intelligently infers synonyms from context, but when you create utterances for training, it's still better to vary them.

## Example utterances in each intent
Each intent needs to have example utterances. If you have an intent but do not have any example utterances in that intent, you will not be able to train LUIS. If you have an intent with one or very few example utterances, LUIS will not be able to give accurate predictions. 

## Training utterances
Training is non-deterministic: the utterance prediction could vary slightly across versions or apps.

## Review utterances
After your model is trained, published, and receiving [endpoint](luis-glossary.md#endpoint) queries, [review the utterances](label-suggested-utterances.md) suggested by LUIS. LUIS selects endpoint utterances that have low scores for either the intent or entity. 

## Best practices
Begin with 10-15 utterances per intent, but not more. Each utterance should be different enough from the other utterances in the intent that each utterance is equally informative. The **None** intent should have between 10 and 20 percent of the total utterances in the application. 

In each iteration of the model, do not add a large quantity of utterances. Add utterances in quantities of tens. Train, publish, and test again. 

## Next steps
See [Add example utterances][add-example-utterances] for information on training a LUIS app to understand user utterances.

[add-example-utterances]: Add-example-utterances.md
[BingSpellCheck]: https://docs.microsoft.com/azure/cognitive-services/bing-spell-check/proof-text