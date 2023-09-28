---
title: 'Debug errors when authoring a Custom Commands application (Preview)'
titleSuffix: Azure AI services
description: In this article, you learn how to debug errors when authoring Custom Commands application.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 06/18/2020
ms.author: eur
ms.custom: cogserv-non-critical-speech
---

# Debug errors when authoring a Custom Commands application

[!INCLUDE [deprecation notice](./includes/custom-commands-retire.md)]

This article describes how to debug when you see errors while building Custom Commands application. 

## Errors when creating an application
Custom Commands also creates an application in [LUIS](https://www.luis.ai/) when creating a Custom Commands application. 

[LUIS limits 500 applications per authoring resource](../luis/luis-limits.md). Creation of LUIS application could fail if you are using an authoring resource that already has 500 applications. 

Make sure the selected LUIS authoring resource has less than 500 applications. If not, you can create new LUIS authoring resource, switch to another one, or try to clean up your LUIS applications.  

## Errors when deleting an application
### Can't delete LUIS application
When deleting a Custom Commands application, Custom Commands may also try to delete the LUIS application associated with the Custom Commands application.

If the deletion of LUIS application failed, go to your [LUIS](https://www.luis.ai/) account to delete them manually.

### TooManyRequests
When you try to delete large number of applications all at once, it's likely you would see 'TooManyRequests' errors. These errors mean your deletion requests get throttled by Azure. 

Refresh your page and try to delete fewer applications.

## Errors when modifying an application

### Can't delete a parameter or a Web Endpoint
You are not allowed to delete a parameter when it is being used. 
Remove any reference of the parameter in any speech responses, sample sentences, conditions, actions, and try again.

### Can't delete a Web Endpoint
You are not allowed to delete a Web Endpoint when it is being used. 
Remove any **Call Web Endpoint** action that uses this Web Endpoint before removing a Web Endpoint.

## Errors when training an application
### Built-In intents
LUIS has built-in Yes/No intents. Having sample sentences with only "yes", "no" would fail the training. 

| Keyword | Variations | 
| ------- | --------- | 
| Yes | Sure, OK |
| No | Nope, Not | 

### Common sample sentences
Custom Commands does not allow common sample sentences shared among different commands. The training of an application could fail if some sample sentences in one command are already defined in another command. 

Make sure you don't have common sample sentences shared among different commands. 

For best practice of balancing your sample sentences across different commands, refer [LUIS best practice](../luis/faq.md).

### Empty sample sentences
You need to have at least one sample sentence for each Command.

### Undefined parameter in sample sentences
One or more parameters are used in the sample sentences but not defined.

### Training takes too long
LUIS training is meant to learn quickly with fewer examples. Don't add too many example sentences. 

If you have many example sentences that are similar, define a parameter, abstract them into a pattern and add it to Example Sentences.

For example, you can define a parameter {vehicle} for the example sentences below, and only add "Book a {vehicle}" to Example Sentences.

| Example sentences | Pattern | 
| ------- | ------- | 
| Book a car | Book a {vehicle} | 
| Book a flight | Book a {vehicle} |
| Book a taxi | Book a {vehicle} |

For best practice of LUIS training, refer [LUIS best practice](../luis/faq.md).

## Can't update LUIS key
### Reassign to E0 authoring resource
LUIS does not support reassigning LUIS application to E0 authoring resource.

If you need to change your authoring resource from F0 to E0, or change to a different E0 resource, recreate the application. 

For quickly export an existing application and import it into a new application, refer to [Continuous Deployment with Azure DevOps](./how-to-custom-commands-deploy-cicd.md).

### Save button is disabled
If you never assign a LUIS prediction resource to your application, the Save button would be disabled when you try to change your authoring resource without adding a prediction resource.

## Next steps

> [!div class="nextstepaction"]
> [See samples on GitHub](https://aka.ms/speech/cc-samples)
