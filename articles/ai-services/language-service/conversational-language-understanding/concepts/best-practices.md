---
title: Conversational language understanding best practices
titleSuffix: Azure AI services
description: Apply best practices when using conversational language understanding
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: best-practice
ms.date: 10/11/2022
ms.author: aahi
ms.custom: language-service-clu
---

# Best practices for conversational language understanding

Use the following guidelines to create the best possible projects in conversational language understanding.     

## Choose a consistent schema

Schema is the definition of your intents and entities. There are different approaches you could take when defining what you should create as an intent versus an entity. There are some questions you need to ask yourself:

- What actions or queries am I trying to capture from my user?
- What pieces of information are relevant in each action?

You can typically think of actions and queries as _intents_, while the information required to fulfill those queries as _entities_. 

For example, assume you want your customers to cancel subscriptions for various products that you offer through your chatbot. You can create a _Cancel_ intent with various examples like _"Cancel the Contoso service"_, or _"stop charging me for the Fabrikam subscription"_. The user's intent here is to _cancel_, the _Contoso service_ or _Fabrikam subscription_ are the subscriptions they would like to cancel. Therefore, you can create an entity for _subscriptions_. You can then model your entire project to capture actions as intents and use entities to fill in those actions. This allows you to cancel anything you define as an entity, such as other products. You can then have intents for signing up, renewing, upgrading, etc. that all make use of the _subscriptions_ and other entities. 

The above schema design makes it easy for you to extend existing capabilities (canceling, upgrading, signing up) to new targets by creating a new entity. 

Another approach is to model the _information_ as intents and _actions_ as entities. Let's take the same example, allowing your customers to cancel subscriptions through your chatbot. You can create an intent for each subscription available, such as _Contoso_ with utterances like _"cancel Contoso"_, _"stop charging me for contoso services"_, _"Cancel the Contoso subscription"_. You would then create an entity to capture the action, _cancel_. You can define different entities for each action or consolidate actions as one entity with a list component to differentiate between actions with different keys.

This schema design makes it easy for you to extend new actions to existing targets by adding new action entities or entity components.

Make sure to avoid trying to funnel all the concepts into just intents, for example don't try to create a _Cancel Contoso_ intent that only has the purpose of that one specific action. Intents and entities should work together to capture all the required information from the customer. 

You also want to avoid mixing different schema designs. Do not build half of your application with actions as intents and the other half with information as intents. Ensure it is consistent to get the possible results.








