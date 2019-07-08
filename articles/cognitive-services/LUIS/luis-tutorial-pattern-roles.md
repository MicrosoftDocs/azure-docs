---
title: Pattern roles
titleSuffix: Azure Cognitive Services
description: Patterns extract data from well-formatted template utterances. The template utterance uses a simple entity and roles to extract related data such as origin location and destination location.  
ms.custom: seodec18
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: tutorial
ms.date: 04/01/2019
ms.author: diberry
#Customer intent: As a new user, I want to understand how and why to use pattern roles. 
---

# Tutorial: Extract contextually related patterns using roles

In this tutorial, use a pattern to extract data from a well-formatted template utterance. The template utterance uses a [simple entity](luis-concept-entity-types.md#simple-entity) and [roles](luis-concept-roles.md) to extract related data such as origin location and destination location.  When using patterns, fewer example utterances are needed for the intent.


**In this tutorial, you learn how to:**

> [!div class="checklist"]
> * Import example app
> * Create new entities
> * Create new intent
> * Train
> * Publish
> * Get intents and entities from endpoint
> * Create pattern with roles
> * Create phrase list of Cities
> * Get intents and entities from endpoint

[!INCLUDE [LUIS Free account](../../../includes/cognitive-services-luis-free-key-short.md)]

## Using roles in patterns

The purpose of roles is to extract contextually related entities in an utterance. In the utterance, `Move new employee Robert Williams from Sacramento and San Francisco`, the origin city, and destination city values are related to each other and use common language to denote each location. 


The name of the new employee, Billy Patterson, is not part of the list entity **Employee** yet. The new employee name is extracted first, in order to send the name to an external system to create the company credentials. After the company credentials are created, the employee credentials are added to the list entity **Employee**.

The new employee and family need to be moved from the current city to a city where the fictitious company is located. Because a new employee can come from any city, the locations need to be discovered. A set list such as a list entity would not work because only the cities in the list would be extracted.

The role names associated with the origin and destination cities need to be unique across all entities. An easy way to make sure the roles are unique is to tie them to the containing entity through a naming strategy. The **NewEmployeeRelocation** entity is a simple entity with two roles: **NewEmployeeReloOrigin** and **NewEmployeeReloDestination**. Relo is short for relocation.

Because the example utterance `Move new employee Robert Williams from Sacramento and San Francisco` has only machine-learned entities, it is important to provide enough example utterances to the intent so the entities are detected.  

**While patterns allow you to provide fewer example utterances, if the entities are not detected, the pattern does not match.**

If you have difficulty with simple entity detection because it is a name such as a city, consider adding a phrase list of similar values. This helps the detection of the city name by giving LUIS an additional signal about that type of word or phrase. Phrase lists only help the pattern by helping with entity detection, which is necessary for the pattern to match. 

## Import example app
Continue with the app created in the last tutorial, named **HumanResources**. 

Use the following steps:

1.  Download and save [app JSON file](https://github.com/Azure-Samples/cognitive-services-language-understanding/blob/master/documentation-samples/tutorials/custom-domain-patterns-HumanResources-v2.json).

2. Import the JSON into a new app.

3. From the **Manage** section, on the **Versions** tab, clone the version, and name it `roles`. Cloning is a great way to play with various LUIS features without affecting the original version. Because the version name is used as part of the URL route, the name can't contain any characters that are not valid in a URL.

## Create new entities

1. [!INCLUDE [Start in Build section](../../../includes/cognitive-services-luis-tutorial-build-section.md)]

2. Select **Entities** from the left navigation. 

3. Select **Create new entity**.

4. In the pop-up window, enter `NewEmployee` as a **Simple** entity.

5. Select **Create new entity**.

6. In the pop-up window, enter `NewEmployeeRelocation` as a **Simple** entity.

7. Select **NewEmployeeRelocation** from the list of entities. 

8. Enter the first role as `NewEmployeeReloOrigin` and select enter.

9. Enter the second role as `NewEmployeeReloDestination` and select enter.

## Create new intent
Labeling the entities in these steps may be easier if the prebuilt keyPhrase entity is removed before beginning then added back after you are done with the steps in this section. 

1. Select **Intents** from the left navigation.

2. Select **Create new intent**. 

3. Enter `NewEmployeeRelocationProcess` as the intent name in the pop-up dialog box.

4. Enter the following example utterances, labeling the new entities. The entity and role values are in bold. Remember to switch to the **Tokens View** if you find it easier to label the text. 

    You don't specify the role of the entity when labeling in the intent. You do that later when creating the pattern. 

    |Utterance|NewEmployee|NewEmployeeRelocation|
    |--|--|--|
    |Move **Bob Jones** from **Seattle** to **Los Colinas**|Bob Jones|Seattle, Los Colinas|
    |Move **Dave C. Cooper** from **Redmond** to **New York City**|Dave C. Cooper|Redmond, New York City|
    |Move **Jim Paul Smith** from **Toronto** to **West Vancouver**|Jim Paul Smith|Toronto, West Vancouver|
    |Move **J. Benson** from **Boston** to **Staines-upon-Thames**|J. Benson|Boston, Staines-upon-Thames|
    |Move **Travis "Trav" Hinton** from **Castelo Branco** to **Orlando**|Travis "Trav" Hinton|Castelo Branco, Orlando|
    |Move **Trevor Nottington III** from **Aranda de Duero** to **Boise**|Trevor Nottington III|Aranda de Duero, Boise|
    |Move **Dr. Greg Williams** from **Orlando** to **Ellicott City**|Dr. Greg Williams|Orlando, Ellicott City|
    |Move **Robert "Bobby" Gregson** from **Kansas City** to **San Juan Capistrano**|Robert "Bobby" Gregson|Kansas City, San Juan Capistrano|
    |Move **Patti Owens** from **Bellevue** to **Rockford**|Patti Owens|Bellevue, Rockford|
    |Move **Janet Bartlet** from **Tuscan** to **Santa Fe**|Janet Bartlet|Tuscan, Santa Fe|

    The employee name has a variety of prefix, word count, syntax, and suffix. This is important for LUIS to understand the variations of a new employee name. The city names also have a variety of word count and syntax. This variety is important to teach LUIS how these entities may appear in a user's utterance. 
    
    If either entity had been of the same word count and no other variations, you would teach LUIS that this entity only has that word count and no other variations. LUIS would not be able to correctly predict a broader set of variations because it was not shown any. 

    If you removed the keyPhrase entity, add it back to the app now.

## Train

[!INCLUDE [LUIS How to Train steps](../../../includes/cognitive-services-luis-tutorial-how-to-train.md)]

## Publish

[!INCLUDE [LUIS How to Publish steps](../../../includes/cognitive-services-luis-tutorial-how-to-publish.md)]

## Get intent and entities from endpoint

1. [!INCLUDE [LUIS How to get endpoint first step](../../../includes/cognitive-services-luis-tutorial-how-to-get-endpoint.md)] 

2. Go to the end of the URL in the address and enter `Move Wayne Berry from Miami to Mount Vernon`. The last querystring parameter is `q`, the utterance **query**. 

    ```json
    {
      "query": "Move Wayne Berry from Newark to Columbus",
      "topScoringIntent": {
        "intent": "NewEmployeeRelocationProcess",
        "score": 0.514479756
      },
      "intents": [
        {
          "intent": "NewEmployeeRelocationProcess",
          "score": 0.514479756
        },
        {
          "intent": "Utilities.Confirm",
          "score": 0.017118983
        },
        {
          "intent": "MoveEmployee",
          "score": 0.009982505
        },
        {
          "intent": "GetJobInformation",
          "score": 0.008637771
        },
        {
          "intent": "ApplyForJob",
          "score": 0.007115978
        },
        {
          "intent": "Utilities.StartOver",
          "score": 0.006120186
        },
        {
          "intent": "Utilities.Cancel",
          "score": 0.00452428637
        },
        {
          "intent": "None",
          "score": 0.00400899537
        },
        {
          "intent": "OrgChart-Reports",
          "score": 0.00240071164
        },
        {
          "intent": "Utilities.Help",
          "score": 0.001770991
        },
        {
          "intent": "EmployeeFeedback",
          "score": 0.001697356
        },
        {
          "intent": "OrgChart-Manager",
          "score": 0.00168116146
        },
        {
          "intent": "Utilities.Stop",
          "score": 0.00163952739
        },
        {
          "intent": "FindForm",
          "score": 0.00112958835
        }
      ],
      "entities": [
        {
          "entity": "wayne berry",
          "type": "NewEmployee",
          "startIndex": 5,
          "endIndex": 15,
          "score": 0.629158735
        },
        {
          "entity": "newark",
          "type": "NewEmployeeRelocation",
          "startIndex": 22,
          "endIndex": 27,
          "score": 0.638941
        }
      ]
    }  
    ```

The intent prediction score is only about 50%. If your client application requires a higher number, this needs to be fixed. The entities were not predicted either.

One of the locations was extracted but the other location was not. 

Patterns will help the prediction score, however, the entities must be correctly predicted before the pattern matches the utterance. 

## Pattern with roles

1. Select **Build** in the top navigation.

2. Select **Patterns** in the left navigation.

3. Select **NewEmployeeRelocationProcess** from the **Select an intent** drop-down list. 

4. Enter the following pattern: `move {NewEmployee} from {NewEmployeeRelocation:NewEmployeeReloOrigin} to {NewEmployeeRelocation:NewEmployeeReloDestination}[.]`

    If you train, publish, and query the endpoint, you may be disappointed to see that the entities are not found, so the pattern didn't match, therefore the prediction didn't improve. This is a consequence of not enough example utterances with labeled entities. Instead of adding more examples, add a phrase list to fix this problem.

## Cities phrase list
Cities, like people's names are tricky in that they can be any mix of words and punctuation. The cities of the region and world are known, so LUIS needs a phrase list of cities to begin learning. 

1. Select **Phrase list** from the **Improve app performance** section of the left menu. 

2. Name the list `Cities` and add the following `values` for the list:

    |Values of phrase list|
    |--|
    |Seattle|
    |San Diego|
    |New York City|
    |Los Angeles|
    |Portland|
    |Philadephia|
    |Miami|
    |Dallas|

    Do not add every city in the world or even every city in the region. LUIS needs to be able to generalize what a city is from the list. Make sure to keep **These values are interchangeable** selected. This setting means the words on the list on treated as synonyms. 

3. Train and publish the app.

## Get intent and entities from endpoint

1. [!INCLUDE [Start in Build section](../../../includes/cognitive-services-luis-tutorial-build-section.md)]

2. Go to the end of the URL in the address and enter `Move wayne berry from miami to mount vernon`. The last querystring parameter is `q`, the utterance **query**. 

    ```json
    {
      "query": "Move Wayne Berry from Miami to Mount Vernon",
      "topScoringIntent": {
        "intent": "NewEmployeeRelocationProcess",
        "score": 0.9999999
      },
      "intents": [
        {
          "intent": "NewEmployeeRelocationProcess",
          "score": 0.9999999
        },
        {
          "intent": "Utilities.Confirm",
          "score": 1.49678385E-06
        },
        {
          "intent": "MoveEmployee",
          "score": 8.240291E-07
        },
        {
          "intent": "GetJobInformation",
          "score": 6.3131273E-07
        },
        {
          "intent": "None",
          "score": 4.25E-09
        },
        {
          "intent": "OrgChart-Manager",
          "score": 2.8E-09
        },
        {
          "intent": "OrgChart-Reports",
          "score": 2.8E-09
        },
        {
          "intent": "EmployeeFeedback",
          "score": 1.64E-09
        },
        {
          "intent": "Utilities.StartOver",
          "score": 1.64E-09
        },
        {
          "intent": "Utilities.Help",
          "score": 1.48181822E-09
        },
        {
          "intent": "Utilities.Stop",
          "score": 1.48181822E-09
        },
        {
          "intent": "Utilities.Cancel",
          "score": 1.35E-09
        },
        {
          "intent": "FindForm",
          "score": 1.23846156E-09
        },
        {
          "intent": "ApplyForJob",
          "score": 5.692308E-10
        }
      ],
      "entities": [
        {
          "entity": "wayne berry",
          "type": "builtin.keyPhrase",
          "startIndex": 5,
          "endIndex": 15
        },
        {
          "entity": "miami",
          "type": "builtin.keyPhrase",
          "startIndex": 22,
          "endIndex": 26
        },
        {
          "entity": "wayne berry",
          "type": "NewEmployee",
          "startIndex": 5,
          "endIndex": 15,
          "score": 0.9410646,
          "role": ""
        },
        {
          "entity": "miami",
          "type": "NewEmployeeRelocation",
          "startIndex": 22,
          "endIndex": 26,
          "score": 0.9853915,
          "role": "NewEmployeeReloOrigin"
        },
        {
          "entity": "mount vernon",
          "type": "NewEmployeeRelocation",
          "startIndex": 31,
          "endIndex": 42,
          "score": 0.986044347,
          "role": "NewEmployeeReloDestination"
        }
      ],
      "sentimentAnalysis": {
        "label": "neutral",
        "score": 0.5
      }
   }
    ```

The intent score is now much higher and the role names are part of the entity response.

## Clean up resources

[!INCLUDE [LUIS How to clean up resources](../../../includes/cognitive-services-luis-tutorial-how-to-clean-up-resources.md)]

## Next steps

This tutorial added an entity with roles and an intent with example utterances. The first endpoint prediction using the entity correctly predicted the intent but with a low confidence score. Only one of the two entities was detected. Next, the tutorial added a pattern that used the entity roles, and a phrase list to boost the value of the city names in the utterances. The second endpoint prediction returned a high-confidence score and found both entity roles. 

> [!div class="nextstepaction"]
> [Learn best practices for LUIS apps](luis-concept-best-practices.md)
