---
title: Contextual data with roles - Language Understanding
titleSuffix: Azure Cognitive Services
description: Find related pieces of data based on context. For example, an origin and destination locations for a physical move from one building and office to another building and office are related. 
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: tutorial
ms.date: 03/08/2019
ms.author: diberry
#Customer intent: As a new user, I want to understand how and why to use the hierarchical entity. 
---

# Tutorial: Extract contextually related data from an utterance

In this tutorial, find related pieces of data based on context. For example, an origin and destination locations for a transfer from one city to another. Both pieces of data may be required and they are related to each other.  

This tutorial was previously written using hierarchical entities. Entity roles replace the need for the hierarchical entity type. A role can be used with any prebuilt or custom entity type, and used in both example utterances and patterns. 

**In this tutorial, you learn how to:**

> [!div class="checklist"]
> * Create new app
> * Add intent 
> * Get origin and destination information using roles
> * Train
> * Publish
> * Get intents and entity roles from endpoint

[!INCLUDE [LUIS Free account](../../../includes/cognitive-services-luis-free-key-short.md)]

## Related data

This app determines where an employee is to be moved from the origin city to the destination city. It uses a GeographyV2 prebuilt entity to identify the city names and it uses roles to determine the location types (origin and destination) within the utterance.

A role should be used when the entity data to extract:

* Is related to each other in the context of the utterance.
* Uses specific word choice to indicate each role. Examples of these words include: from/to, leaving/headed to, away from/toward.
* Both roles are frequently in the same utterance, allowing LUIS to learn from this frequent contextual usage.
* Need to be grouped and processed by client app as a unit of information.

## Create a new app

[!INCLUDE [Follow these steps to create a new LUIS app](../../../includes/cognitive-services-luis-create-new-app-steps.md)]

## Create an intent to move employees between cities

1. [!INCLUDE [Start in Build section](../../../includes/cognitive-services-luis-tutorial-build-section.md)]

1. Select **Create new intent**. 

1. Enter `MoveEmployeeToCity` in the pop-up dialog box then select **Done**. 

    ![Screenshot of create new intent dialog with](./media/tutorial-entity-roles/create-new-intent-move-employee-to-city.png)

1. Add example utterances to the intent.

    |Example utterances|
    |--|
    |move John W. Smith leaving Seattle headed to Dallas|
    |transfer Jill Jones from Seattle to Cairo|
    |Place John Jackson away from Tampa, coming to Atlanta |
    |move Debra Doughtery to Tulsa from Dallas|
    |mv Jill Jones leaving Cairo headed to Tampa|
    |Shift Alice Anderson to Oakland from Redmond|
    |Carl Chamerlin from San Francisco to Redmond|
    |Transfer Steve Standish from San Diego toward Bellevue |
    |lift Tanner Thompson from Kansas city and shift to Chicago|

    [![Screenshot of LUIS with new utterances in MoveEmployee intent](./media/tutorial-entity-roles/hr-enter-utterances.png)](./media/tutorial-entity-roles/hr-enter-utterances.png#lightbox)

## Add prebuilt entity geographyV2

The prebuilt entity, geographyV2, extracts location information, including city names. Since the utterances have two city names, relating to each other in context, use roles to extract that context.

1. Select **Entities** from the left-side navigation.

1. Select **Add prebuilt entity**, then select `geo` in the search bar to filter the prebuilt entities. 

    ![Add geographyV2 prebuilt entity to app](media/tutorial-entity-roles/add-geographyV2-prebuilt-entity.png)
1. Select the checkbox and select **Done**.
1. In the **Entities** list, select the geographyV2

1. In the utterance, `move John W. Smith leaving Seattle headed to Dallas`, select the word `Seattle`. A drop-down menu appears with a text box at the top. Enter the entity name `Location` in the text box then select **Create new entity** in the drop-down menu. 

    [![Screenshot of creating new entity on intent page](media/tutorial-entity-roles/tutorial-hierarichical-entity-labeling-1.png "Screenshot of creating new entity on intent page")](media/tutorial-entity-roles/tutorial-hierarichical-entity-labeling-1.png#lightbox)

1. In the pop-up window, select the **Hierarchical** entity type with `Origin` and `Destination` as the child entities. Select **Done**.

    ![Screenshot of entity creation pop-up dialog for new Location entity](media/tutorial-entity-roles/hr-create-new-entity-2.png "Screenshot of entity creation pop-up dialog for new Location entity")

1. The label for `Seattle` is marked as `Location` because LUIS doesn't know if the term was the origin or destination, or neither. Select `Seattle`, then select **Location**, then follow the menu to the right and select `Origin`.

    [![Screenshot of entity labeling pop-up dialog to change locations entity child](media/tutorial-entity-roles/tutorial-hierarichical-entity-labeling-2.png "Screenshot of entity labeling pop-up dialog to change locations entity child")](media/tutorial-entity-roles/tutorial-hierarichical-entity-labeling-2.png#lightbox)

1. Label the other locations in all the other utterances. When all locations are marked, the utterances begin to look like a pattern. 

    [![Screenshot of Locations entity labeled in utterances](media/tutorial-entity-roles/all-intents-marked-with-origin-and-destination-location.png "Screenshot of Locations entity labeled in utterances")](media/tutorial-entity-roles/all-intents-marked-with-origin-and-destination-location.png#lightbox)

    The red underline indicates LUIS is not confident about the entity. Training resolves this. 

## Add example utterances to the None intent 

[!INCLUDE [Follow these steps to add the None intent to the app](../../../includes/cognitive-services-luis-create-the-none-intent.md)]

## Train the app so the changes to the intent can be tested 

[!INCLUDE [LUIS How to Train steps](../../../includes/cognitive-services-luis-tutorial-how-to-train.md)]

## Publish the app so the trained model is queryable from the endpoint

[!INCLUDE [LUIS How to Publish steps](../../../includes/cognitive-services-luis-tutorial-how-to-publish.md)]

## Get intent and entity prediction from endpoint

1. [!INCLUDE [LUIS How to get endpoint first step](../../../includes/cognitive-services-luis-tutorial-how-to-get-endpoint.md)]


1. Go to the end of the URL in the address bar and enter `Please move Carl Chamerlin from Tampa to Portland`. The last querystring parameter is `q`, the utterance **query**. This utterance is not the same as any of the labeled utterances so it is a good test and should return the `MoveEmployee` intent with the hierarchical entity extracted.

    ```json
    {
      "query": "Please move Carl Chamerlin from Tampa to Portland",
      "topScoringIntent": {
        "intent": "MoveEmployeeToCity",
        "score": 0.979823351
      },
      "intents": [
        {
          "intent": "MoveEmployeeToCity",
          "score": 0.979823351
        },
        {
          "intent": "None",
          "score": 0.0156363435
        }
      ],
      "entities": [
        {
          "entity": "portland",
          "type": "Location::Destination",
          "startIndex": 41,
          "endIndex": 48,
          "score": 0.6044041
        },
        {
          "entity": "tampa",
          "type": "Location::Origin",
          "startIndex": 32,
          "endIndex": 36,
          "score": 0.739491045
        }
      ]
    }
    ```
    
    The correct intent is predicted and the entities array has both the origin and destination values in the corresponding **entities** property.
    
## Clean up resources

[!INCLUDE [LUIS How to clean up resources](../../../includes/cognitive-services-luis-tutorial-how-to-clean-up-resources.md)]

## Related information

* [Hierarchical entity](luis-concept-entity-types.md) conceptual information
* [How to train](luis-how-to-train.md)
* [How to publish](luis-how-to-publish-app.md)
* [How to test in LUIS portal](luis-interactive-test.md)
* [Roles versus hierarchical entities](luis-concept-roles.md#roles-versus-hierarchical-entities)
* [Improve predictions with Patterns](luis-concept-patterns.md)

## Next steps

This tutorial created a new intent and added example utterances for the contextually learned data of origin and destination locations. Once the app is trained and published, a client-application can use that information to create a move ticket with the relevant information.

> [!div class="nextstepaction"] 
> [Learn how to add a composite entity](luis-tutorial-composite-entity.md) 
