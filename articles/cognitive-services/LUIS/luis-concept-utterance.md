---
title: Good example utterances 
titleSuffix: Language Understanding - Azure Cognitive Services
description: Utterances are input from the user that your app needs to interpret. Collect phrases that you think users will enter. Include utterances that mean the same thing but are constructed differently in word length and word placement.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 05/07/2019
ms.author: diberry
---
# Understand what good utterances are for your LUIS app

**Utterances** are input from the user that your app needs to interpret. To train LUIS to extract intents and entities from them, it's important to capture a variety of different example utterances for each intent. Active learning, or the process of continuing to train on new utterances, is essential to machine-learned intelligence that LUIS provides.

Collect utterances that you think users will enter. Include utterances, which mean the same thing but are constructed in a variety of different ways:

* Utterance length - short, medium, and long for your client-application
* Word and phrase length 
* Word placement - entity at beginning, middle, and end of utterance
* Grammar 
* Pluralization
* Stemming
* Noun and verb choice
* Punctuation - a good variety using correct, incorrect, and no grammar

## How to choose varied utterances

When you first get started by [adding example utterances](luis-how-to-add-example-utterances.md) to your LUIS model, here are some principles to keep in mind.

### Utterances aren't always well formed

It may be a sentence, like "Book a ticket to Paris for me", or a fragment of a sentence, like "Booking" or "Paris flight."  Users often make spelling mistakes. When planning your app, consider whether or not you use [Bing Spell Check](luis-tutorial-bing-spellcheck.md) to correct user input before passing it to LUIS. 

If you do not spell check user utterances, you should train LUIS on utterances that include typos and misspellings.

### Use the representative language of the user

When choosing utterances, be aware that what you think is a common term or phrase might not be correct for the typical user of your client application. They may not have domain experience. Be careful when using terms or phrases that a user would only say if they were an expert.

### Choose varied terminology as well as phrasing

You will find that even if you make efforts to create varied sentence patterns, you will still repeat some vocabulary.

Take these example utterances:

|Example utterances|
|--|
|how do I get a computer?|
|Where do I get a computer?|
|I want to get a computer, how do I go about it?|
|When can I have a computer?| 

The core term here, "computer", isn't varied. Use alternatives such as desktop computer, laptop, workstation, or even just machine. LUIS intelligently infers synonyms from context, but when you create utterances for training, it's still better to vary them.

## Example utterances in each intent

Each intent needs to have example utterances, at least 15. If you have an intent that does not have any example utterances, you will not be able to train LUIS. If you have an intent with one or very few example utterances, LUIS will not accurately predict the intent. 

## Add small groups of 15 utterances for each authoring iteration

In each iteration of the model, do not add a large quantity of utterances. Add utterances in quantities of 15. [Train](luis-how-to-train.md), [publish](luis-how-to-publish-app.md), and [test](luis-interactive-test.md) again.  

LUIS builds effective models with utterances that are carefully selected by the LUIS model author. Adding too many utterances isn't valuable because it introduces confusion.  

It is better to start with a few utterances, then [review endpoint utterances](luis-how-to-review-endpoint-utterances.md) for correct intent prediction and entity extraction.

## Utterance normalization

Utterance normalization is the process of ignoring the effects of punctuation and diacritics during training and prediction.

## Utterance normalization for diacritics and punctuation

Utterance normalization is defined when you create or import the app because it is a setting in the app JSON file. The utterance normalization settings are turned off by default. 

Diacritics are marks or signs within the text, such as: 

```
İ ı Ş Ğ ş ğ ö ü
```

If your app turns normalization on, scores in the **Test** pane, batch tests, and endpoint queries will change for all utterances using diacritics or punctuation.

Turn on utterance normalization for diacritics or punctuation to your LUIS JSON app file in the `settings` parameter.

```JSON
"settings": [
    {"name": "NormalizePunctuation", "value": "true"},
    {"name": "NormalizeDiacritics", "value": "true"}
] 
```

Normalizing **punctuation** means that before your models get trained and before your endpoint queries get predicted, punctuation will be removed from the utterances. 

Normalizing **diacritics** replaces the characters with diacritics in utterances with regular characters. For example: `Je parle français` becomes `Je parle francais`. 

Normalization doesn’t mean you will not see punctuation and diacritics in your example utterances or prediction responses, merely that they will be ignored during training and prediction.


### Punctuation marks

If punctuation is not normalized, LUIS doesn't ignore punctuation marks, by default, because some client applications may place significance on these marks. Make sure your example utterances use both punctuation and no punctuation in order for both styles to return the same relative scores. 

If punctuation has no specific meaning in your client application, consider [ignoring punctuation](#utterance-normalization) by normalizing punctuation. 

### Ignoring words and punctuation

If you want to ignore specific words or punctuation in patterns, use a [pattern](luis-concept-patterns.md#pattern-syntax) with the _ignore_ syntax of square brackets, `[]`. 

## Training utterances

Training is generally non-deterministic: the utterance prediction could vary slightly across versions or apps. 
You can remove non-deterministic training by updating the [version settings](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/versions-update-application-version-settings) API with the `UseAllTrainingData` name/value pair to use all training data.

## Testing utterances 

Developers should start testing their LUIS application with real traffic by sending utterances to the [prediction endpoint](luis-how-to-azure-subscription.md) URL. These utterances are used to improve the performance of the intents and entities with [Review utterances](luis-how-to-review-endpoint-utterances.md). Tests submitted with the LUIS website testing pane are not sent through the endpoint, and so do not contribute to active learning. 

## Review utterances

After your model is trained, published, and receiving [endpoint](luis-glossary.md#endpoint) queries, [review the utterances](luis-how-to-review-endpoint-utterances.md) suggested by LUIS. LUIS selects endpoint utterances that have low scores for either the intent or entity. 

## Best practices

Review [best practices](luis-concept-best-practices.md) and apply them as part of your regular authoring cycle.

## Next steps
See [Add example utterances](luis-how-to-add-example-utterances.md) for information on training a LUIS app to understand user utterances.

