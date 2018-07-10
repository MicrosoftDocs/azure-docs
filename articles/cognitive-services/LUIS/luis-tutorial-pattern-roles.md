---
title: Tutorial using pattern roles to improve LUIS predictions - Azure | Microsoft Docs 
titleSuffix: Azure
description: In this tutorial, use pattern roles for contextually related entities to improve LUIS predictions.
services: cognitive-services
author: v-geberr
manager: kamran.iqbal


ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 07/10/2018
ms.author: v-geberr;
#Customer intent: As a new user, I want to understand how and why to use pattern roles. 
---

# Tutorial: Improve app with pattern roles

In this tutorial, use patterns to increase intent and entity prediction.  

> [!div class="checklist"]
* Understand pattern roles
* Convert hierarchical entity to simple entity with roles 
* Create pattern for utterances using simple entity with roles
* How to verify pattern prediction improvements

For this article, you need a free [LUIS](luis-reference-regions.md) account in order to author your LUIS application.

## Before you begin
If you don't have the Human Resources app from the [pattern](luis-tutorial-batch-testing.md) tutorial, [import](luis-how-to-start-new-app.md#import-new-app) the JSON into a new app in the [LUIS](luis-reference-regions.md#luis-website) website. The app to import is found in the [LUIS-Samples](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/quickstarts/custom-domain-patterns-HumanResources.json) Github repository.

If you want to keep the original Human Resources app, clone the version on the [Settings](luis-how-to-manage-versions.md#clone-a-version) page, and name it `roles`. Cloning is a great way to play with various LUIS features without affecting the original version. 

## The purpose of roles
The purpose of roles is to extract contextually-related entities in an utterance. In the utterance, `Move Jill Jones from building and office A-1234 to building and office B-4567`, the origin and destination values are related to each other and use common language to denote each location. 

In the **MoveEmployee** intent created in the [hierarchical tutorial](luis-quickstart-intent-and-hier-entity.md), the origin and destination locations are contextually related but do not use roles. Instead, the related values are contained inside children of the hierarchical entity. When not using patterns, more example utterances need to be provided for LUIS to learn the intent and entities. 

With patterns, fewer example utterances are provided to the intent because template utterances are used in the patterns. The template utterance can contain entities and entity roles, along with ignorable text.

## Create new entity with roles
1. Select **Build** in the top menu.

2. Select **Entities** from the left navigation. 

3. Select **Create new entity**.

4. In the pop-up window, enter `Location`.

5. Select **Location** from the entity list.

6. Enter the first role as `Origin` and select enter.

7. Enter the second role as `Destination` and select enter.

## Remove hierarchical entity 
A word or phrase is labeled with only one entity. In order to use the new, simple entity of `Location`, the `Locations` hierarchical entity needs to be removed from the composite entity **MoveEmployeeWorkOrder** and then delete the **Locations** entity. 

1. Select **Entities** from the left navigation. 

2. Select **MoveEmployeeWorkOrder**. This entity was created in the [composite entity tutorrial](luis-tutorial-composite-entity.md). 

3. Select the garbage can to the right of the child entity names `Locations::Origin` and `Locations::Destination`.

4. Select **+ Add child entity**, then add `Location`.

5. Select **Entities** from the left navigation. 

6. On the same row as **Locations**, select the far-right ellipsis {**...**}. Select **Delete**. This entity was created in the [hierarchical entity tutorrial](luis-quickstart-intent-and-hier-entity.md). 




## Train the LUIS app
The new intent and utterances require training. 

1. In the top right side of the LUIS website, select the **Train** button.

    ![Image of training button](./media/luis-tutorial-pattern/hr-train-button.png)

2. Training is complete when you see the green status bar at the top of the website confirming success.

    ![Image of success notification bar](./media/luis-tutorial-pattern/hr-trained.png)

## Publish the app to get the endpoint URL
In order to get a LUIS prediction in a chatbot or other application, you need to publish the app. 

1. In the top right side of the LUIS website, select the **Publish** button. 

    ![Screenshot of FindKnowledgeBase with top navigation Publish button highlighted](./media/luis-tutorial-pattern/hr-publish-button.png)

2. Select the Production slot and the **Publish** button.

    ![Screenshot of Publish page with Publish to production slot button highlighted](./media/luis-tutorial-pattern/hr-publish-to-production.png)

3. Publishing is complete when you see the green status bar at the top of the website confirming success.

## Query the endpoint with a different utterance
1. On the **Publish** page, select the **endpoint** link at the bottom of the page. This action opens another browser window with the endpoint URL in the address bar. 

    ![Screenshot of Publish page with endpoint URL highlighted](./media/luis-quickstart-intents-regex-entity/publish-select-endpoint.png)

2. Go to the end of the URL in the address and enter ``. The last querystring parameter is `q`, the utterance **query**. 

    ```JSON

    ```


## Clean up resources
When no longer needed, delete the LUIS app. To do so, select the ellipsis (***...***) to the right of the app name in the app list, select **Delete**. On the pop-up dialog **Delete app?**, select **Ok**.

## Next steps

> [!div class="nextstepaction"]
> [Learn best practices for LUIS apps](luis-concept-best-practices.md)