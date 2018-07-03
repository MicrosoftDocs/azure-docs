---
title: Tutorial to review endpoint utterances in Language Understanding (LUIS) - Azure | Microsoft Docs 
description: In this tutorial, learn how to review endpoint utterances in the Human Resources (HR) domain in LUIS. 
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.component: luis
ms.topic: tutorial
ms.date: 07/03/2018
ms.author: v-geberr
#Customer intent: As a new user, I want to understand why and when to review endpoint utterances. 

--- 

# Tutorial: Review endpoint utterances
In this tutorial, improve app predictions by verifying or correcting utterances received via the LUIS HTTP endpoint. 

<!-- green checkmark -->
> [!div class="checklist"]
> * Understand reviewing endpoint utterances 
> * Backup endpoint utterances with authoring API
> * Use LUIS app for the Human Resources (HR) domain 
> * Review endpoint utterances
> * Train, and publish app
> * Query endpoint of app to see LUIS JSON response

For this article, you need a free [LUIS](luis-reference-regions.md#luis-website) account to author your LUIS application.

## Before you begin
If you don't have the Human Resources app from the [keyPhrase entity](luis-quickstart-intent-and-key-phrase.md) tutorial, [import](create-new-app.md#import-new-app) the JSON into a new app in the [LUIS](luis-reference-regions.md#luis-website) website. Import the app from [LUIS-Samples](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/quickstarts/custom-domain-regex-HumanResources.json) Github repository. If you use this tutorial from an imported app, you will also need to train, publish, then add the [utterances](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/quickstarts/endpoint-utterances-Human-Resources.json) to the endpoint with a [script](https://github.com/Microsoft/LUIS-Samples/blob/master/examples/demo-upload-endpoint-utterances/endpoint.js). 

If you want to keep the original Human Resources app, clone the version on the [Settings](luis-how-to-manage-versions.md#clone-a-version) page, and name it `review`. Cloning is a great way to play with various LUIS features without affecting the original version. 

## Purpose of reviewing endpoint utterances
LUIS chose the utterances in the review list. This list is specific to the app and is meant to improve the app's prediction accuracy. This list should be reviewed on a periodic basis to improve predictions. 

The utterances submitted to the app over time, as you progressed through the tutorials, would have utterances that may have incorrect predictions based on the most recent tutorial intents and entities. If you imported the app and used the script to add the utterances, the review utterances would be different because the app didn't go through the various stages of tutorials. 

If you have all the versions of the app, through the tutorials, you may be surprised to see that the **Review endpoint utterances** list doesn't change, based on the version. There is a single pool of utterances to review, regardless of which version the utterance you are actively editing or which version of the app was published at the endpoint. 

## Review endpoint utterances
1. Make sure your Human Resources app is in the **Build** section of LUIS. You can change to this section by selecting **Build** on the top, right menu bar. 

    [ ![Screenshot of LUIS app with Build hightlighted in top, right navigation bar](./media/luis-quickstart-intent-and-list-entity/hr-first-image.png)](./media/luis-quickstart-intent-and-list-entity/hr-first-image.png#lightbox)

2. Select **Review endpoint utterances** from the left navigation. 

3. Review the utterances in the list. 

4. Filter the app by the **ApplyForJob** intent, above the list. 

5. 

## Train the LUIS app

## Publish the app