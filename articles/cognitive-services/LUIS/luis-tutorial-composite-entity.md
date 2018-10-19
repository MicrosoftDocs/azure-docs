---
title: "Tutorial 6: Extract composite data with LUIS composite entity"
titleSuffix: Azure Cognitive Services
description: Add a composite entity to bundle extracted data of various types into a single containing entity. By bundling the data, the client application can easily extract related data in different data types.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/09/2018
ms.author: diberry
--- 

# Tutorial 6: Group and extract related data
In this tutorial, add a composite entity to bundle extracted data of various types into a single containing entity. By bundling the data, the client application can easily extract related data in different data types.

The purpose of the composite entity is to group related entities into a parent category entity. The information exists as separate entities before a composite is created. It is similar to hierarchical entity but can contain different types of entities. 

The composite entity is a good fit for this type of data because the data:

* Are related to each other. 
* Use a variety of entity types.
* Need to be grouped and processed by client app as a unit of information.

**In this tutorial, you learn how to:**

<!-- green checkmark -->
> [!div class="checklist"]
> * Use existing tutorial app
> * Add composite entity 
> * Train
> * Publish
> * Get intents and entities from endpoint

[!INCLUDE [LUIS Free account](../../../includes/cognitive-services-luis-free-key-short.md)]

## Use existing app
Continue with the app created in the last tutorial, named **HumanResources**. 

If you do not have the HumanResources app from the previous tutorial, use the following steps:

1.  Download and save [app JSON file](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/tutorials/custom-domain-hier-HumanResources.json).

2. Import the JSON into a new app.

3. From the **Manage** section, on the **Versions** tab, clone the version, and name it `composite`. Cloning is a great way to play with various LUIS features without affecting the original version. Because the version name is used as part of the URL route, the name can't contain any characters that are not valid in a URL.


## Composite entity
Create a composite entity when the separate entities can be logically grouped and this logical grouping is helpful to the client application. 

In this app, the employee name is defined in the **Employee** list entity and includes synonyms of name, email address, company phone extension, mobile phone number, and U.S. Federal tax ID. 

The **MoveEmployee** intent has example utterances to request an employee be moved from one building and office to another. Building names are alphabetic: "A", "B", etc. while offices are numeric: "1234", "13245". 

Example utterances in the **MoveEmployee** intent include:

|Example utterances|
|--|
|Move John W . Smith to a-2345|
|shift x12345 to h-1234 tomorrow|
 
The move request should include the employee (using any synonym), and the final building and office location. The request can also include the originating office as well as a date the move should happen. 

The extracted data from the endpoint should contain this information and return it in the `RequestEmployeeMove` composite entity:

```JSON
"compositeEntities": [
  {
    "parentType": "RequestEmployeeMove",
    "value": "jill jones from a - 1234 to z - 2345 on march 3 2 p . m",
    "children": [
      {
        "type": "builtin.datetimeV2.datetime",
        "value": "march 3 2 p.m"
      },
      {
        "type": "Locations::Destination",
        "value": "z - 2345"
      },
      {
        "type": "Employee",
        "value": "jill jones"
      },
      {
        "type": "Locations::Origin",
        "value": "a - 1234"
      }
    ]
  }
]
```

1. [!include[Start in Build section](../../../includes/cognitive-services-luis-tutorial-build-section.md)]

2. On the **Intents** page, select **MoveEmployee** intent. 

3. Select the magnifying glass icon on the tool bar to filter the utterances list. 

    [![](media/luis-tutorial-composite-entity/hr-moveemployee-magglass.png "Screenshot of LUIS on 'MoveEmployee' intent with magnifying glass button highlighted")](media/luis-tutorial-composite-entity/hr-moveemployee-magglass.png#lightbox)

4. Enter `tomorrow` in the filter textbox to find the utterance `shift x12345 to h-1234 tomorrow`.

    [![](media/luis-tutorial-composite-entity/hr-filter-by-tomorrow.png "Screenshot of LUIS on 'MoveEmployee' intent with filter of 'tomorrow' highlighted")](media/luis-tutorial-composite-entity/hr-filter-by-tomorrow.png#lightbox)

    Another method is to filter the entity by datetimeV2, by selecting **Entity filters** then select **datetimeV2** from the list. 

5. Select the first entity, `Employee`, then select **Wrap in composite entity** in the pop-up menu list. 

    [![](media/luis-tutorial-composite-entity/hr-create-entity-1.png "Screenshot of LUIS on 'MoveEmployee' intent selecting first entity in composite highlighted")](media/luis-tutorial-composite-entity/hr-create-entity-1.png#lightbox)


6. Then immediately select the last entity, `datetimeV2` in the utterance. A green bar is drawn under the selected words indicating a composite entity. In the pop-up menu, enter the composite name `RequestEmployeeMove` then select enter. 

    [![](media/luis-tutorial-composite-entity/hr-create-entity-2.png "Screenshot of LUIS on 'MoveEmployee' intent selecting last entity in composite and creating entity highlighted")](media/luis-tutorial-composite-entity/hr-create-entity-2.png#lightbox)

7. In **What type of entity do you want to create?**, almost all the fields required are in the list. Only the originating location is missing. Select **Add a child entity**, select **Locations::Origin** from the list of existing entities, then select **Done**. 

    Notice that the prebuilt entity, number, was added to the composite entity. If you could have a prebuilt entity appear between the beginning and ending tokens of a composite entity, the composite entity must contain those prebuilt entities. If the prebuilt entities are not included, the composite entity is not correctly predicted but each individual element is.

    ![Screenshot of LUIS on 'MoveEmployee' intent adding another entity in pop-up window](media/luis-tutorial-composite-entity/hr-create-entity-ddl.png)

8. Select the magnifying glass on the toolbar to remove the filter. 

9. Remove the word `tomorrow` from the filter so you can see all the example utterances again. 

## Label example utterances with composite entity


1. In each example utterance, select the left-most entity that should be in the composite. Then select **Wrap in composite entity**.

    [![](media/luis-tutorial-composite-entity/hr-label-entity-1.png "Screenshot of LUIS on 'MoveEmployee' intent selecting first entity in composite highlighted")](media/luis-tutorial-composite-entity/hr-label-entity-1.png#lightbox)

2. Select the last word in the composite entity then select **RequestEmployeeMove** from the pop-up menu. 

    [![](media/luis-tutorial-composite-entity/hr-label-entity-2.png "Screenshot of LUIS on 'MoveEmployee' intent selecting last entity in composite highlighted")](media/luis-tutorial-composite-entity/hr-label-entity-2.png#lightbox)

3. Verify all utterances in the intent are labeled with the composite entity. 

    [![](media/luis-tutorial-composite-entity/hr-all-utterances-labeled.png "Screenshot of LUIS on 'MoveEmployee' with all utterances labeled")](media/luis-tutorial-composite-entity/hr-all-utterances-labeled.png#lightbox)

## Train

[!INCLUDE [LUIS How to Train steps](../../../includes/cognitive-services-luis-tutorial-how-to-train.md)]

## Publish

[!INCLUDE [LUIS How to Publish steps](../../../includes/cognitive-services-luis-tutorial-how-to-publish.md)]

## Get intent and entities from endpoint 

1. [!INCLUDE [LUIS How to get endpoint first step](../../../includes/cognitive-services-luis-tutorial-how-to-get-endpoint.md)]

2. Go to the end of the URL in the address and enter `Move Jill Jones from a-1234 to z-2345 on March 3 2 p.m.`. The last querystring parameter is `q`, the utterance query. 

    Since this test is to verify the composite is extracted correctly, a test can either include an existing sample utterance or a new utterance. A good test is to include all the child entities in the composite entity.

    ```JSON
    {
      "query": "Move Jill Jones from a-1234 to z-2345 on March 3  2 p.m",
      "topScoringIntent": {
        "intent": "MoveEmployee",
        "score": 0.9959525
      },
      "intents": [
        {
          "intent": "MoveEmployee",
          "score": 0.9959525
        },
        {
          "intent": "GetJobInformation",
          "score": 0.009858314
        },
        {
          "intent": "ApplyForJob",
          "score": 0.00728598563
        },
        {
          "intent": "FindForm",
          "score": 0.0058053555
        },
        {
          "intent": "Utilities.StartOver",
          "score": 0.005371796
        },
        {
          "intent": "Utilities.Help",
          "score": 0.00266987388
        },
        {
          "intent": "None",
          "score": 0.00123299169
        },
        {
          "intent": "Utilities.Cancel",
          "score": 0.00116407464
        },
        {
          "intent": "Utilities.Confirm",
          "score": 0.00102653319
        },
        {
          "intent": "Utilities.Stop",
          "score": 0.0006628214
        }
      ],
      "entities": [
        {
          "entity": "march 3 2 p.m",
          "type": "builtin.datetimeV2.datetime",
          "startIndex": 41,
          "endIndex": 54,
          "resolution": {
            "values": [
              {
                "timex": "XXXX-03-03T14",
                "type": "datetime",
                "value": "2018-03-03 14:00:00"
              },
              {
                "timex": "XXXX-03-03T14",
                "type": "datetime",
                "value": "2019-03-03 14:00:00"
              }
            ]
          }
        },
        {
          "entity": "jill jones",
          "type": "Employee",
          "startIndex": 5,
          "endIndex": 14,
          "resolution": {
            "values": [
              "Employee-45612"
            ]
          }
        },
        {
          "entity": "z - 2345",
          "type": "Locations::Destination",
          "startIndex": 31,
          "endIndex": 36,
          "score": 0.9690751
        },
        {
          "entity": "a - 1234",
          "type": "Locations::Origin",
          "startIndex": 21,
          "endIndex": 26,
          "score": 0.9713137
        },
        {
          "entity": "-1234",
          "type": "builtin.number",
          "startIndex": 22,
          "endIndex": 26,
          "resolution": {
            "value": "-1234"
          }
        },
        {
          "entity": "-2345",
          "type": "builtin.number",
          "startIndex": 32,
          "endIndex": 36,
          "resolution": {
            "value": "-2345"
          }
        },
        {
          "entity": "3",
          "type": "builtin.number",
          "startIndex": 47,
          "endIndex": 47,
          "resolution": {
            "value": "3"
          }
        },
        {
          "entity": "2",
          "type": "builtin.number",
          "startIndex": 50,
          "endIndex": 50,
          "resolution": {
            "value": "2"
          }
        },
        {
          "entity": "jill jones from a - 1234 to z - 2345 on march 3 2 p . m",
          "type": "RequestEmployeeMove",
          "startIndex": 5,
          "endIndex": 54,
          "score": 0.4027723
        }
      ],
      "compositeEntities": [
        {
          "parentType": "RequestEmployeeMove",
          "value": "jill jones from a - 1234 to z - 2345 on march 3 2 p . m",
          "children": [
            {
              "type": "builtin.datetimeV2.datetime",
              "value": "march 3 2 p.m"
            },
            {
              "type": "Locations::Destination",
              "value": "z - 2345"
            },
            {
              "type": "Employee",
              "value": "jill jones"
            },
            {
              "type": "Locations::Origin",
              "value": "a - 1234"
            }
          ]
        }
      ]
    }
    ```

  This utterance returns a composite entities array. Each entity is given a type and value. To find more precision for each child entity, use the combination of type and value from the composite array item to find the corresponding item in the entities array.  

## Clean up resources

[!INCLUDE [LUIS How to clean up resources](../../../includes/cognitive-services-luis-tutorial-how-to-clean-up-resources.md)]

## Next steps

This tutorial created a composite entity to encapsulate existing entities. This allows the client application to find a group of related data in different datatypes to continue the conversation. A client application for this Human Resources app could ask what day and time the move needs to begin and end. It could also ask about other logistics of the movesuch as a physical phone. 

> [!div class="nextstepaction"] 
> [Learn how to add a simple entity with a phrase list](luis-quickstart-primary-and-secondary-data.md)  