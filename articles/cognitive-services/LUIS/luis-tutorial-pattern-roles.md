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
The purpose of roles is to extract contextually-related entities in an utterance. In the utterance, `Move new employee Robert Williams from Sacramento and San Francisco`, the origin city and destination city values are related to each other and use common language to denote each location. 

Fewer example utterances are needed for the intent because template utterances are provided as patterns. By selecting the intent for each pattern, as long as the entities are detected and the utterance matches the pattern, the correct intent is returned. The template utterance can contain entities and entity roles, along with ignorable text.

### Compare hierarchical entity to simple entity with roles

In the previous [hierarchical tutorial](luis-quickstart-intent-and-hier-entity.md), the **MoveEmployee** intent detected when to move an existing employee from one building and office to another. The example utterances had origin and destination locations but did not use roles. Instead, the origin and destination were children of the  hierarchical entity. 

In this tutorial, the Human Resources app will detect utterances about moving new employees from one city to another. 

|Tutorial|Example utterance|
|--|--|
|[Hierarchical (no roles)](luis-quickstart-intent-and-hier-entity.md)|mv Jill Jones from a-2349 to b-1298|
|This tutorial (with roles)|Move Billy Patterson from Yuma to Denver.|

### Simple entity for new employee name
The name of the new employee, Billy Patterson, is not part of the list entity **Employee** yet. The new employee name needs to be detected first, in order to send the name to an external system to create the company credentials. After the company credentials are created, the employee credentials are added to the list entity **Employee**.

### Simple entity with roles for relocation cities
The new employee and his family need to be moved from his current city to a city where the fictitious company is located. Because a new employee can come from any city, the locations need to be discovered.

The **NewEmployee** entity is a simple entity with no roles. The role names need to be unique across all entities. An easy way to make sure the roles are unique is to tie them to the containing entity through a naming strategy. The **NewEmployeeRelocation** entity is a simple entity with two roles: **NewEmployeeReloOrigin** and **NewEmployeeReloDestination**.

### Simple entities need enough examples to be detected
Because the example utterance `Move new employee Robert Williams from Sacramento and San Francisco` has only machine-learned entities, it is important to provide enough example utterances to the intent so the entities are detected. While patterns allow you to provide fewer example utterances, if the entities are not detected, the pattern will not match. 

**While patterns allow you to provide fewer example utterances, if the entities are not detected, the pattern will not match.**

If you have difficulty with simple entity detection because it is a name such as a city, consider adding a phrase list of similar values. This helps the detection of the city name by giving LUIS an additional signal about that type of word or phrase. Phrase lists only help the pattern by helping with entity detection, which is necessary for the pattern to match. 

## Create new entities
1. Select **Build** in the top menu.

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
    |Move **Dave Cooper** from **Redmond** to **Seattle**|Dave Cooper|Redmond, Seattle|
    |Move **Jim Smith** from **Toronto** to **Vancouver**|Jim Smith|Toronto, Vancouver|
    |Move **Jill Benson** from **Boston** to **London**|Jill Benson|Boston, London|
    |Move **Travis Hinton** from **Portland** to **Orlando**|Travis Hinton|Portland, Orlando|
    |Move **Trevor Nottington** from **Spokane** to **Boise**|Trevor Nottington|Spokane, Boise|
    |Move **Greg Williams** from **Orlando** to **Austin**|Greg Williams|Orlando, Austin|
    |Move **Robert Gregson** from **Kansas City** to **Yuma**|Robert Gregson|Kansas City, Yuma|
    |Move **Patti Owens** from **Bellevue** to **Rockford**|Patti Owens|Bellevue, Rockford|
    |Move **Janet Bartlet** from **Tuscan** to **Santa Fe**|Janet Bartlet|Tuscan, Santa Fe|

    Train and test the utterances to see how well the intent and entities are predicted without a pattern. 

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

## Query the endpoint without pattern
1. On the **Publish** page, select the **endpoint** link at the bottom of the page. This action opens another browser window with the endpoint URL in the address bar. 

    ![Screenshot of Publish page with endpoint URL highlighted](./media/luis-quickstart-intents-regex-entity/publish-select-endpoint.png)

2. Go to the end of the URL in the address and enter `Move Wayne Berry from Newark to Columbus`. The last querystring parameter is `q`, the utterance **query**. 

    ```JSON
  {
      "query": "Move Wayne Berry from Newark to Columbus",
      "topScoringIntent": {
          "intent": "NewEmployeeRelocationProcess",
          "score": 0.5623783
      },
      "intents": [
          {
              "intent": "NewEmployeeRelocationProcess",
              "score": 0.5623783
          },
          {
              "intent": "Utilities.Confirm",
              "score": 0.0123205138
          },
          {
              "intent": "GetJobInformation",
              "score": 0.0110164294
          },
          {
              "intent": "MoveEmployee",
              "score": 0.0100413691
          },
          {
              "intent": "ApplyForJob",
              "score": 0.009376613
          },
          {
              "intent": "Utilities.StartOver",
              "score": 0.005493146
          },
          {
              "intent": "None",
              "score": 0.004052741
          },
          {
              "intent": "Utilities.Cancel",
              "score": 0.003984084
          },
          {
              "intent": "OrgChart-Reports",
              "score": 0.00239752117
          },
          {
              "intent": "EmployeeFeedback",
              "score": 0.00195183733
          },
          {
              "intent": "Utilities.Help",
              "score": 0.00170500379
          },
          {
              "intent": "OrgChart-Manager",
              "score": 0.00156696246
          },
          {
              "intent": "Utilities.Stop",
              "score": 0.00125860469
          },
          {
              "intent": "FindForm",
              "score": 0.00114929758
          }
      ],
      "entities": [
          {
              "entity": "wayne berry",
              "type": "NewEmployee",
              "startIndex": 5,
              "endIndex": 15,
              "score": 0.7210163
          },
          {
              "entity": "newark",
              "type": "NewEmployeeRelocation",
              "startIndex": 22,
              "endIndex": 27,
              "score": 0.686152756
          },
          {
              "entity": "columbus",
              "type": "NewEmployeeRelocation",
              "startIndex": 32,
              "endIndex": 39,
              "score": 0.564098954
          }
      ]
  }    
  ```

While all the entities were detected, the intent prediction score is only 50%. If your client application requires a higher number, this needs to be fixed.

All of the city names so far have been a single word. Try a city name that is three words: `Move Wayne Berry from New York City to Columbus`. 

```JSON
{
  "query": "Move Wayne Berry from New York City to Columbus",
  "topScoringIntent": {
    "intent": "NewEmployeeRelocationProcess",
    "score": 0.5974632
  },
  "intents": [
    {
      "intent": "NewEmployeeRelocationProcess",
      "score": 0.5974632
    },
    {
      "intent": "GetJobInformation",
      "score": 0.0562561
    },
    {
      "intent": "MoveEmployee",
      "score": 0.0113906525
    },
    {
      "intent": "ApplyForJob",
      "score": 0.009032093
    },
    {
      "intent": "Utilities.Confirm",
      "score": 0.004364716
    },
    {
      "intent": "Utilities.StartOver",
      "score": 0.0038650122
    },
    {
      "intent": "EmployeeFeedback",
      "score": 0.00333929877
    },
    {
      "intent": "None",
      "score": 0.0027446
    },
    {
      "intent": "Utilities.Cancel",
      "score": 0.00227597845
    },
    {
      "intent": "OrgChart-Reports",
      "score": 0.00185811857
    },
    {
      "intent": "OrgChart-Manager",
      "score": 0.00155583175
    },
    {
      "intent": "Utilities.Help",
      "score": 0.0014323442
    },
    {
      "intent": "FindForm",
      "score": 0.00126940908
    },
    {
      "intent": "Utilities.Stop",
      "score": 0.0007841544
    }
  ],
  "entities": [
    {
      "entity": "wayne berry",
      "type": "NewEmployee",
      "startIndex": 5,
      "endIndex": 15,
      "score": 0.7087153
    }
  ]
}
```

The relocation cities are not detected. Add a pattern to increase intent prediction score far above 50%. 

## Add a pattern that uses roles
1. Select **Build** in the top navigation.

2. Select **Patterns** in the left navigation.

3. Select **NewEmployeeRelocationProcess** from the **Select an intent** drop-down list. 

4. Enter the following pattern: `move {NewEmployee} from {NewEmployeeRelocation:NewEmployeeReloOrigin} to {NewEmployeeRelocation:NewEmployeeReloDestination}[.]`

5. Train and publish the app again.

## Query endpoint for pattern
1. On the **Publish** page, select the **endpoint** link at the bottom of the page. This action opens another browser window with the endpoint URL in the address bar. 

    ![Screenshot of Publish page with endpoint URL highlighted](./media/luis-quickstart-intents-regex-entity/publish-select-endpoint.png)

2. Go to the end of the URL in the address and enter `Move Wayne Berry from New York City to Columbus`. The last querystring parameter is `q`, the utterance **query**. 


move wayne berry from redmond to seattle

    ```JSON
    {
      "query": "Move Wayne Berry from Newark to Columbus",
      "topScoringIntent": {
        "intent": "NewEmployeeRelocationProcess",
        "score": 0.999999464
      },
      "intents": [
        {
          "intent": "NewEmployeeRelocationProcess",
          "score": 0.999999464
        },
        {
          "intent": "Utilities.StartOver",
          "score": 1.66666393E-06
        },
        {
          "intent": "Utilities.Confirm",
          "score": 1.50596657E-06
        },
        {
          "intent": "MoveEmployee",
          "score": 8.293454E-07
        },
        {
          "intent": "GetJobInformation",
          "score": 6.060602E-07
        },
        {
          "intent": "ApplyForJob",
          "score": 5.7886524E-07
        },
        {
          "intent": "None",
          "score": 4.275E-09
        },
        {
          "intent": "OrgChart-Manager",
          "score": 2.81666668E-09
        },
        {
          "intent": "OrgChart-Reports",
          "score": 2.81666668E-09
        },
        {
          "intent": "EmployeeFeedback",
          "score": 1.65E-09
        },
        {
          "intent": "Utilities.Help",
          "score": 1.49090906E-09
        },
        {
          "intent": "Utilities.Stop",
          "score": 1.49090906E-09
        },
        {
          "intent": "Utilities.Cancel",
          "score": 1.35833333E-09
        },
        {
          "intent": "FindForm",
          "score": 1.24615385E-09
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
          "entity": "wayne berry",
          "type": "NewEmployee",
          "startIndex": 5,
          "endIndex": 15,
          "score": 0.720984,
          "role": ""
        },
        {
          "entity": "newark",
          "type": "NewEmployeeRelocation",
          "startIndex": 22,
          "endIndex": 27,
          "score": 0.686787248,
          "role": "NewEmployeeReloOrigin"
        },
        {
          "entity": "columbus",
          "type": "NewEmployeeRelocation",
          "startIndex": 32,
          "endIndex": 39,
          "score": 0.5656133,
          "role": "NewEmployeeReloDestination"
        }
      ]
    }
    ```

The intent score is now much higher and the role names are part of the entity response.

## Clean up resources
When no longer needed, delete the LUIS app. To do so, select the ellipsis (***...***) to the right of the app name in the app list, select **Delete**. On the pop-up dialog **Delete app?**, select **Ok**.

## Next steps

> [!div class="nextstepaction"]
> [Learn best practices for LUIS apps](luis-concept-best-practices.md)