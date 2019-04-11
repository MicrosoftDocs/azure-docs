---
title: Prebuilt entities 
titleSuffix: Azure Cognitive Services
description: LUIS includes a set of prebuilt entities for recognizing common types of information, like dates, times, numbers, measurements and currency. Prebuilt entity support varies by the culture of your LUIS app. 
services: cognitive-services
author: diberry
ms.custom: seodec18
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 03/11/2019
ms.author: diberry
---

# Prebuilt entities to recognize common data types

LUIS includes a set of prebuilt entities for recognizing common types of information, like dates, times, numbers, measurements, and currency. 

## Add a prebuilt entity

1. Open your app by clicking its name on **My Apps** page, and then click **Entities** in the left side. 

1. On the **Entities** page, click **Add prebuilt entity**.

1. In **Add prebuilt entities** dialog box, select the datetimeV2 prebuilt entity. 

    ![Add prebuilt entity dialog box](./media/luis-use-prebuilt-entity/add-prebuilt-entity-dialog.png)

1. Select **Done**.

## Publish the app

The easiest way to view the value of a prebuilt entity is to query from the published endpoint. 

1. In the top toolbar, select **Publish**. Publish to **Production**. 

1. When the green success notification appears, select the **Refer to the list of endpoints** link to see the endpoints.

1. Select an endpoint. A new browser tab opens to that endpoint. Keep the browser tab open and continue to the **Test** section.

## Test
After the entity is added, you do not need to train the app. 

Test the new intent at the endpoint by added a value for the **q** parameter. Use the following table for suggested utterances for **q**:

|Test utterance|Entity value|
|--|:--|
|Book a flight tomorrow|2018-10-19|
|cancel the appointment on March 3|LUIS returned the most recent March 3 in the past (2018-03-03) and March 3 in the future (2019-03-03) because the utterance didn't specify a year.|
|Schedule a meeting at 10am|10:00:00|

## Marking entities containing a prebuilt entity token
 If you have text, such as `HH-1234`, that you want to mark as a custom entity _and_ you have [Prebuilt Number](luis-reference-prebuilt-number.md) added to the model, you won't be able to mark the custom entity in the LUIS portal. You can mark it with the API. 

 In order to mark this type of token, where part of it is already marked with a prebuilt entity, remove the prebuilt entity from the LUIS app. You don't need to train the app. Then mark the token with your own custom entity. Then add the prebuilt entity back to the LUIS app.

 For another example, consider the utterance as a list of class preferences: `I want first year spanish, second year calculus, and fourth year english lit.` If the LUIS app has the Prebuild Ordinal added, `first`, `second`, and `fourth` will already be marked with ordinals. If you want to capture the ordinal and the class, you can create a composite entity and wrap it around the Prebuilt Ordinal and the custom entity for class name.

## Next steps
> [!div class="nextstepaction"]
> [Prebuilt entity reference](./luis-reference-prebuilt-entities.md)
