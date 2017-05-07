---
title: Use prebuilt domains in LUIS apps in Azure | Microsoft Docs
description: Learn how to use prebuilt domains in Language Understanding Intelligent Service (LUIS) applications.
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/01/2017
ms.author: cahann
---

# Use prebuilt domains in Language Understanding Intelligent Service (LUIS) apps  

LUIS provides *prebuilt domains*, which are prebuilt sets of intents and entities that work together for domains relating to common user scenarios. 
These apps have been trained for common domains and are ready for use in your app. You can use the entire prebuilt domain, or just use a few intents or entities for your application. The intents and entities in a prebuit domain are fully customizable once you've added them to your app - you can train them with utterances from your system so they work for your users. 

The prebuilt domains that LUIS offers include but are not limited to:

* Camera -- Taking pictures and recording videos.
* Communication -- Sending messages and making phone calls.
* Entertainment -- Handling queries related to music, movies, and TV.
* Places - Handling queries related to places like businesses, institutions, restaurants, public spaces and addresses.
* Utilities - Handling requests that are common in many domains, like "help", "repeat", "start over".

Browse the **Prebuilt domains** tab to see other prebuilt domains you can use in your app. 
![Add prebuilt intent](./media/luis-how-to-use-prebuilt-domains/add-prebuilt-domain-intent.png)

> [!TIP]
> Look for individual intents and entities you can customize. 
> For example, a prebuilt intent that you can customize for use in any domain is the Repeat intent in the Utilities domain. Add it to your app and train it recognize whatever actions user might want to repeat in your application.

![Add prebuilt intent](./media/luis-how-to-use-prebuilt-domains/select-prebuilt-domain-entities.png)

> [!TIP]
> The intents and entities in a prebuilt app work best together. It's better to combine intents and entities from the same domain instead of using similar intents from different domains that may conflict.