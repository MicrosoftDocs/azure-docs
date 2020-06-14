---
title: 'Debug errors when authoring a Custom Commands application (Preview)'
titleSuffix: Azure Cognitive Services
description: debug errors when authoring a custom commands apps  
services: cognitive-services
author: xiaojul
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/27/2020
ms.author: xiaojul
---

# Debug errors when authoring a Custom Commands application

This article describes how to debug when you see errors while building Custom Commands application. 

## Errors when creating an application
Custom Commands also creates an application in [Luis](https://www.luis.ai/) when creating a Custom Commands application. 

[Luis limits 500 applications per authoring resource](https://docs.microsoft.com/azure/cognitive-services/luis/luis-limits). Creation of Luis application could fail if you are using an authoring resource that already have 500 applications. 

Make sure the selected Luis authoring resource has less than 500. If not, you can new Luis authoring resource, switch to another one, or try to clean up your Luis applications.  

## Errors when deleting an application
### Can't delete Luis application
When deleting a Custom Commands application, Custom Commands also try to delete the Luis application associated with the Custom Commands application.

If the deletion of Luis application failed, please go to your [Luis](https://www.luis.ai/) account to delete them manually.

### TooManyRequests
When you try to delete large amount of applications all at once, it's likely you would see 'TooManyRequests' errors. This means your deletion requests get throttled by Azure. 

Please refresh your page and try to delete fewer applications.

## Errors when modifying an application

### Can't delete a parameter or a Web Endpoint
You are not allowed to delete a parameter when it is being used. 
Please remove any reference of the parameter in any speech responses, sample sentences, conditions, actions, and try again.

### Can't delete a Web Endpoint
You are not allowed to delete a Web Endpoint when it is being used. 
Please remove any **Call Web Endpoint** action that uses this Web Endpoint before removing a Web Endpoint.

## Errors when training an application
### Build in intents
Luis has build-in Yes/No intents. Having sample sentences with only "yes", "no" would fail the training. 

| Keyword | Variations | 
| ------- | --------- | 
| Yes | Sure, OK |
| No | Nope, Not | 

### Common sample sentences
Custom Commands does not allow common sample sentences shared among different commands. The training of an application could fail if some sample sentences in one command are already defined in another command. 

Please make sure you don't have common sample sentences shared among different commands. 

For best practice of balancing your sample sentences across different commands, please refer [Luis best practice](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-best-practices).

### Empty sample sentences
You need to have at least 1 sample sentence for each Command.

### Undefined parameter in sample sentences
One or more parameters are used in the sample sentences but not defined.

### Training takes too long
LUIS training is meant to learn quickly with fewer examples. Don't add too many example sentences. 

If you have many example sentences are similar, define a parameter, abstract them into a pattern and add it to Example Sentences.

For example, you can define a parameter {vehicle} for the example sentences below, and only add "Book a {vehicle}" to Example Sentences.

| Example sentences | Pattern | 
| ------- | ------- | 
| Book a car | Book a {vehicle} | 
| Book a flight | Book a {vehicle} |
| Book a taxi | Book a {vehicle} |

For best practice of Luis training, please refer [Luis best practice](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-best-practices).

## Can't update Luis key
### Reassign to E0 authoring resource
Luis does not support reassigning Luis application to E0 authoring resource.

If you need to change your authoring resource from F0 to E0, or change to a different E0 resource, please recreate the application.

### Save button is disabled
If you never assign a Luis prediction resource to your application, the Save button would be disabled when you try to change your authoring resource without adding a prediction resource.
