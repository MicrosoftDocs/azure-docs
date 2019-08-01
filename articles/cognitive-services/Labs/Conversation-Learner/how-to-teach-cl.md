---
title: How to teach with Conversation Learner - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to teach with Conversation Learner.
services: cognitive-services
author: nitinme
manager: nolachar
ms.service: cognitive-services
ms.subservice: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: nitinme
---

# How to teach with Conversation Learner 

This document explains what signals Conversation Learner is aware of, and describes how it learns.  

Teaching can be decomposed into two distinct steps: entity extraction, and action selection.

## Entity extraction

Under the covers, Conversation Learner uses [LUIS](https://www.luis.ai) for entity extraction.  If you are familiar with LUIS, that experience applies to entity extraction in Conversation Learner.

The entity extraction models are aware of the *content* and *context* within a user utterance.  For example, if the word "Seattle" has been labeled as a city in one utterance such as "What's the weather in Seattle", entity extraction is capable of recognizing that same content ("Seattle") as a city in another utterance such as "Population of Seattle", even if the utterances are very different.  Conversely, if "Francis" has been recognized as a name in "Schedule a meeting with Francis", then a new previously unseen name can be recognized in a similar context, like "Set up a meeting with Robin".  Machine learning infers when to attend to content, context, or both, based on training examples.

At present, entity extraction is only aware of the content of the current utterance.  Unlike action selection (below), it is not aware of dialog history such as previous system turns, previous user turns, or previously recognized entities.  As a result, the behavior of entity extraction is "shared" across all utterances.  For example, if the user utterance "I want Apple" has "Apple" labeled as entity type "Fruit" in one user utterance, the entity extraction model will expect that this utterance ("I want Apple") should always have "Apple" labeled as "Fruit".

If entity extraction is not behaving as expected, here are possible remedies:

- The first thing to try is to add more training examples -- particularly examples that reveal typical entity context (surrounding words), or exceptions
- Consider adding an "Expected Entity" property to an action, if appropriate.  See tutorial on Expected Entities for further details.
- While it is possible to add manual processing to `EntityExtractionCallback` to extract entities using code, this is the least recommended approach because it will not benefit from improvements in machine learning as your system matures.

## Action selection

Action selection uses a recurrent neural network, which takes as input all of the conversation history.  Thus, action selection is a stateful process that is aware of previous user utterances, entity values, and system utterances.  

Some signals are naturally preferred by the learning process.  In other words, if Conversation Learner can explain an action selection decision using "more preferred" signals, it will; if it cannot, then it will use "less preferred" signals.

Here is a table showing all signals in Conversation Learner, and which ones are used by action selection.  Note that word order in user utterances is ignored.

Signal | Preference (1=most preferred) | Notes
--- | --- | --- 
System action in previous turn | 1 | 
Entities present in current turn | 1 | 
Whether this is the first turn | 1 |
Exact match of words in current user utterance | 2 | 
Similar-meaning words in current user utterance | 3 | 
System actions prior to previous turn | 4 |
Entities present in turns prior to current turn | 4 | 
User utterances prior to current turn | 5 | 

> [!NOTE]
> Action selection does not take the content of system actions -- the text, card content, or API name or behavior -- only the identity of the system action.  As a result, changing the content of an action will not alter the behavior of the action selection model.
>
> Further, that the contents/values of entities are not used -- only their presence/absence.

If action selection is not behaving as expected, here are possible remedies:

- Add more train dialogs, particularly dialogs that illustrate which signals action selection should be paying attention to.  For example, if action selection should prefer one signal over another, give examples that show the preferred signal being in the same state, and the other signals varying.  Some sequences may take a handful of training dialogs to learn.
- Add "Required" and "Disqualifying" entities to action definitions.  This limits when actions are available, and can be useful to express business rules and some common sense patterns. 

## Updates to models

Any time you add or edit an entity, action, or train dialog in the UI, this generates a request to re-train both the entity extraction model and the action selection model.  This request is placed on a queue, and re-training is done asynchronously.  When a new model is available, it is used from that point onwards for entity extraction and action selection.  This re-training process often takes around 5 seconds, but can be longer if the model is complex, or if load on the training service is high.

Because training is done asynchronously, it is possible that edits you've made aren't immediately reflected.  If entity extraction or action selection is not behaving as expected based on changes you've made in the last 5-10 seconds, this may be the cause.

## Next steps

> [!div class="nextstepaction"]
> [Default values and boundaries](./cl-values-and-boundaries.md)
