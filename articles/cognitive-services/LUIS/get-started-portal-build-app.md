---
title: "Quickstart: Create new app with LUIS Portal" 
titleSuffix: Language Understanding - Azure Cognitive Services
description:  
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: quickstart
ms.date: 02/27/2019
ms.author: diberry
#Customer intent: As a new user, I want to quickly get a LUIS app created in the LUIS portal so I can understand the different models of intent, entity and example utterances. 
---

# Quickstart: Create new app in LUIS portal

The first step to using LUIS is to build a LUIS app. The LUIS portal is the most common method, but you can also use programmatic methods. Creating the app in the portal begins with setting the name and language, then adding intents with example utterances. If there is data in the utterances that need to be extracted, this needs to be tagged with entities. 

In this quickstart, you create an app, create an intent, add an example utterance and create an entity to extract that entity. The [LUIS portal](https://www.luis.ai) is free to use and doesn't require a Cognitive Service or Language Understanding key. 

If you don’t have a free LUIS portal account, you can create the free account the first time you visit the LUIS portal.  

## Create app 

1. Open the LUIS portal in a browser and sign in. 

1. Select **Create new app** in the contextual toolbar.

    ![Create new app in LUIS portal](./media/get-started-portal-build-app/create-app-in-portal.png)

1. In the pop-up window, configure the app with the settings:

    ![Enter new app settings](./media/get-started-portal-build-app/create-new-app-settings.png)

    |Setting name| Value | Purpose|
    |--|--|--|
    |Name|`myEnglishApp`|Unique LUIS app name, required|
    |Culture|**English**|Language of utterances from users, **en-us**, required|
    |Description|`App made with LUIS Portal`|Description of app, optional|




## Create intent 
FindForm

## Add example utterance 

## Create regular expression entity 

Tag entity in example utterance
`HRF-number regular express

// add example utterance with 1 entity to intent

## Next Steps

> [!div class="nextstepaction"]
> [Deploy model](./get-started-portal-deploy-model.md)