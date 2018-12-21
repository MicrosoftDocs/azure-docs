---
title: Hierarchical entity
titleSuffix: Azure Cognitive Services
description: Find related pieces of data based on context. For example, an origin and destination locations for a physical move from one building and office to another building and office are related. 
services: cognitive-services
author: diberry
manager: cgronlun
ms.custom: seodec18
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: tutorial
ms.date: 12/21/2018
ms.author: diberry
#Customer intent: As a new user, I want to understand how and why to use the hierarchical entity. 
--- 

# Tutorial: Extract contextually-related data from an utterance

In this tutorial, find related pieces of data based on context. For example, an origin and destination locations for a transfer from one city to another. Both pieces of data may be required and they are related to each other.  

**In this tutorial, you learn how to:**

> [!div class="checklist"]
> * Create new app
> * Add intent 
> * Add location hierarchical entity with origin and destination children
> * Train
> * Publish
> * Get intents and entities from endpoint

[!INCLUDE [LUIS Free account](../../../includes/cognitive-services-luis-free-key-short.md)]

## Hierarchical data

This app determines where an employee is to be moved from the origin city to the destination city. It uses the hierarchical entity to determine the locations within the utterance. 

The hierarchical entity is a good fit for this type of data because the two pieces of data, child locations:

* Are simple entities.
* Are related to each other in the context of the utterance.
* Use specific word choice to indicate each entity. Examples of these words include: from/to, leaving/headed to, away from/toward.
* Both children are frequently in the same utterance. 
* Need to be grouped and processed by client app as a unit of information.

## Create a new app

[!INCLUDE [Follow these steps to create a new LUIS app](../../../includes/cognitive-services-luis-create-new-app-steps.md)]

## Create an intent to move employees between cities

1. Select **Intents** from the left menu.

2. Select **MoveEmployeeToCity** from the list of intents.

3. Add the following example utterances:

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

    [ ![Screenshot of LUIS with new utterances in MoveEmployee intent](./media/luis-quickstart-intent-and-hier-entity/hr-enter-utterances.png)](./media/luis-quickstart-intent-and-hier-entity/hr-enter-utterances.png#lightbox)

## Create a location entity
LUIS needs to understand what a location is by labeling the origin and destination in the utterances. If you need to see the utterance in the token (raw) view, select the toggle in the bar above the utterances labeled **Entities View**. After you toggle the switch, the control is labeled **Tokens View**.

Consider the following utterance:

```json
transfer Jill Jones from Seattle to Cairo
```

The utterance has two locations specified, `Seattle` and `Cairo`. Both are grouped as children of a hierarchical entity, `Locations`, because both pieces of data need to be extracted from the utterance to complete the request in the client application and they are related to each other. 
 
If only one child (origin or destination) of a hierarchical entity is present, it is still extracted. All children do not need to be found for just one, or some, to be extracted. 

1. In the utterance, `transfer Jill Jones from Seattle to Cairo`, select the word `Seattle`. A drop-down menu appears with a text box at the top. Enter the entity name `Locations` in the text box then select **Create new entity** in the drop-down menu. 

    [![Screenshot of creating new entity on intent page](media/luis-quickstart-intent-and-hier-entity/hr-create-new-entity-1.png "Screenshot of creating new entity on intent page")](media/luis-quickstart-intent-and-hier-entity/hr-create-new-entity-1.png#lightbox)

2. In the pop-up window, select the **Hierarchical** entity type with `Origin` and `Destination` as the child entities. Select **Done**.

    ![Screenshot of entity creation pop-up dialog for new Location entity](media/luis-quickstart-intent-and-hier-entity/hr-create-new-entity-2.png "Screenshot of entity creation pop-up dialog for new Location entity")

3. The label for `Seattle` is marked as `Locations` because LUIS doesn't know if the term was the origin or destination, or neither. Select `Seattle`, then select **Locations**, then follow the menu to the right and select `Origin`.

    [![Screenshot of entity labeling pop-up dialog to change locations entity child](media/luis-quickstart-intent-and-hier-entity/hr-label-entity.png "Screenshot of entity labeling pop-up dialog to change locations entity child")](media/luis-quickstart-intent-and-hier-entity/hr-label-entity.png#lightbox)

5. Label the other locations in all the other utterances by selecting the building and office in the utterance, then selecting Locations, then following the menu to the right to select `Origin` or `Destination`. When all locations are labeled, the utterances in **Tokens View** begin to look like a pattern. 

    [![Screenshot of Locations entity labeled in utterances](media/luis-quickstart-intent-and-hier-entity/hr-entities-labeled.png "Screenshot of Locations entity labeled in utterances")](media/luis-quickstart-intent-and-hier-entity/hr-entities-labeled.png#lightbox)

## Train the app so the changes to the intent can be tested 

[!INCLUDE [LUIS How to Train steps](../../../includes/cognitive-services-luis-tutorial-how-to-train.md)]

## Publish the app so the trained model is queryable from the endpoint

[!INCLUDE [LUIS How to Publish steps](../../../includes/cognitive-services-luis-tutorial-how-to-publish.md)]

## Get intent and entity prediction from endpoint

1. [!INCLUDE [LUIS How to get endpoint first step](../../../includes/cognitive-services-luis-tutorial-how-to-get-endpoint.md)]


2. Go to the end of the URL in the address bar and enter `Please relocation jill-jones@mycompany.com from x-2345 to g-23456`. The last querystring parameter is `q`, the utterance **query**. This utterance is not the same as any of the labeled utterances so it is a good test and should return the `MoveEmployee` intent with the hierarchical entity extracted.

    ```json
    {
      "query": "Please relocation jill-jones@mycompany.com from x-2345 to g-23456",
      "topScoringIntent": {
        "intent": "MoveEmployee",
        "score": 0.9966052
      },
      "intents": [
        {
          "intent": "MoveEmployee",
          "score": 0.9966052
        },
        {
          "intent": "Utilities.Stop",
          "score": 0.0325253047
        },
        {
          "intent": "FindForm",
          "score": 0.006137873
        },
        {
          "intent": "GetJobInformation",
          "score": 0.00462633232
        },
        {
          "intent": "Utilities.StartOver",
          "score": 0.00415637763
        },
        {
          "intent": "ApplyForJob",
          "score": 0.00382325822
        },
        {
          "intent": "Utilities.Help",
          "score": 0.00249120337
        },
        {
          "intent": "None",
          "score": 0.00130756292
        },
        {
          "intent": "Utilities.Cancel",
          "score": 0.00119622645
        },
        {
          "intent": "Utilities.Confirm",
          "score": 1.26910036E-05
        }
      ],
      "entities": [
        {
          "entity": "jill - jones @ mycompany . com",
          "type": "Employee",
          "startIndex": 18,
          "endIndex": 41,
          "resolution": {
            "values": [
              "Employee-45612"
            ]
          }
        },
        {
          "entity": "x - 2345",
          "type": "Locations::Origin",
          "startIndex": 48,
          "endIndex": 53,
          "score": 0.8520272
        },
        {
          "entity": "g - 23456",
          "type": "Locations::Destination",
          "startIndex": 58,
          "endIndex": 64,
          "score": 0.974032
        },
        {
          "entity": "-2345",
          "type": "builtin.number",
          "startIndex": 49,
          "endIndex": 53,
          "resolution": {
            "value": "-2345"
          }
        },
        {
          "entity": "-23456",
          "type": "builtin.number",
          "startIndex": 59,
          "endIndex": 64,
          "resolution": {
            "value": "-23456"
          }
        }
      ]
    }
    ```
    
    The correct intent is predicted and the entities array has both the origin and destination values in the corresponding **entity** property.
    
## Clean up resources

[!INCLUDE [LUIS How to clean up resources](../../../includes/cognitive-services-luis-tutorial-how-to-clean-up-resources.md)]

## Related information

* [Hierarchical entity](luis-concept-entity-types.md#hierarchical) conceptual information
* [How to train](luis-how-to-train.md)
* [How to publish](luis-how-to-publish-app.md)
* [How to test in LUIS portal](luis-interactive-test.md)
* [Roles versus hierarchical entities](luis-concept-roles.md#roles-versus-hierarchical-entities)

## Next steps

This tutorial created a new intent and added example utterances for the contextually-learned data of origin and destination locations. Once the app is trained and published, a client-application can use that information to create a move ticket with the relevant information.

> [!div class="nextstepaction"] 
> [Learn how to add a composite entity](luis-tutorial-composite-entity.md) 
