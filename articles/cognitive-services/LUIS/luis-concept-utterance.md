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

<!-- 
* **What is an utterance?** An utterance is the textual input from the user, that your app needs to interpret. It may be a sentence, like "Book me a ticket to Paris", or a fragment of a sentence, like "Booking" or "Paris flight." Utterances aren't always well-formed, and there can be many utterance variations for a particular intent. See [Add example utterances][add-example-utterances] for information on training a LUIS app to understand user utterances.
* **What are intents?** Intents are like verbs. An intent represents actions the user wants to perform. It is a purpose or goal expressed in a user's input, such as booking a flight, paying a bill, or finding a news article. You define a set of named intents that correspond to actions users want to take in your application. A travel app may define an intent named "BookFlight", that LUIS extracts from the utterance "Book me a ticket to Paris".
* **What are entities?** If intents are verbs, then entities are nouns. An entity represents an instance of a class of object that is relevant to a user’s purpose. In the utterance "Book me a ticket to Paris", "Paris" is an entity of type location. By recognizing the entities that are mentioned in the user’s input, LUIS helps you choose the specific actions to take to fulfill an intent. LUIS also provides [pre-built entities][pre-built-entities] that you can use in your app.
-->

**Utterances** are your user's inputs. To train LUIS, it's important to capture a variety of different inputs for each intent.
Collect phrases that you think users will say, and include utterances that mean the same thing but are constructed differently.


*

## Manufactured Questions
A manufactured question isn't always a bad thing. They can be handy to bootstrap your system to capture more questions. But you have to be mindful when creating them.
First, what you may believe is a common term or phrase might not be to the general public. They do not have domain experience. So avoid domain terms or phrases that would only be said if they have read the material.
Second, you will find that even if you go out of your way to try and vary things, you will still duplicate patterns.
Take this example:

```
how do I get a credit card?
Where do I get a credit card?
I want to get a credit card, how do I go about it?
When can I have a credit card? 
```
The core term here credit card is not varied. They could say visa, master card, gold card, plastic or even just card. Having said that, intents can be quite intelligent with this. But when dealing with a large number of questions, it's better to vary.