---
title: Utterances in LUIS apps in Azure | Microsoft Docs
description: Add utterances in Language Understanding Intelligent Services (LUIS) apps.
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
<!-- 
* **What is an utterance?** An utterance is the textual input from the user, that your app needs to interpret. It may be a sentence, like "Book me a ticket to Paris", or a fragment of a sentence, like "Booking" or "Paris flight." Utterances aren't always well-formed, and there can be many utterance variations for a particular intent. See [Add example utterances][add-example-utterances] for information on training a LUIS app to understand user utterances.
* **What are intents?** Intents are like verbs. An intent represents actions the user wants to perform. It is a purpose or goal expressed in a user's input, such as booking a flight, paying a bill, or finding a news article. You define a set of named intents that correspond to actions users want to take in your application. A travel app may define an intent named "BookFlight", that LUIS extracts from the utterance "Book me a ticket to Paris".
* **What are entities?** If intents are verbs, then entities are nouns. An entity represents an instance of a class of object that is relevant to a user’s purpose. In the utterance "Book me a ticket to Paris", "Paris" is an entity of type location. By recognizing the entities that are mentioned in the user’s input, LUIS helps you choose the specific actions to take to fulfill an intent. LUIS also provides [pre-built entities][pre-built-entities] that you can use in your app.
-->

**Utterances** are input from the user that your app needs to interpret. To train LUIS to extract intents and entities from them, it's important to capture a variety of different inputs for each intent.
Collect phrases that you think users will say, and include utterances that mean the same thing but are constructed differently.

## How to choose varied utterances
When you first get started by [adding example utterances][add-example-utterances] to your LUIS model, here are some principles to keep in mind.
<!-- A manufactured question isn't always a bad thing. They can be handy to bootstrap your system to capture more questions. But you have to be mindful when creating them. -->

### Utterances aren't always well formed
It may be a sentence, like "Book me a ticket to Paris", or a fragment of a sentence, like "Booking" or "Paris flight."  Users often make spelling mistakes. When planning your app, consider whether or not you will spell check user input before passing it to LUIS.

### Use the representative language of the user
When choosing utterances, be aware that what you think is a common term or phrase might not be to the typical user of your client application. They do not have domain experience. So be careful when using terms or phrases that a user would only say if they were an expert.

### Choose varied terminology as well as phrasing
You will find that even if you make efforts to varied create sentence patterns, you will still repeat some vocabulary.

Take these example utterances:
```
how do I get a credit card?
Where do I get a credit card?
I want to get a credit card, how do I go about it?
When can I have a credit card? 
```
The core term here, "credit card", is not varied. They could say visa, master card, gold card, plastic or even just card. LUIS can be quite intelligent at inferring synonyms from context, but when you create utterances for training, it's stil better to vary them.

## Next steps
See [Add example utterances][add-example-utterances] for information on training a LUIS app to understand user utterances.

[add-example-utterances]: Add-example-utterances.md