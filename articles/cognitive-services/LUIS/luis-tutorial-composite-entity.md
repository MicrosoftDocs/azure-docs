---
title: Composite entity"
titleSuffix: Azure Cognitive Services
description: Add a composite entity to bundle extracted data of various types into a single containing entity. By bundling the data, the client application can easily extract related data in different data types.
services: cognitive-services
author: diberry
manager: cgronlun
ms.custom: seodec18
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 12/21/2018
ms.author: diberry
--- 

# Tutorial: Group and extract related data
In this tutorial, add a composite entity to bundle extracted data of various types into a single containing entity. By bundling the data, the client application can easily extract related data in different data types.

The purpose of the composite entity is to group related entities into a parent category entity. The information exists as separate entities before a composite is created. It is similar to hierarchical entity but can contain different types of entities. 

The composite entity is a good fit for this type of data because the data:

* Are related to each other. 
* Use a variety of entity types.
* Need to be grouped and processed by client app as a unit of information.

**In this tutorial, you learn how to:**

<!-- green checkmark -->
> [!div class="checklist"]
> * Create app
> * Add composite entity 
> * Train
> * Publish
> * Get intents and entities from endpoint

[!INCLUDE [LUIS Free account](../../../includes/cognitive-services-luis-free-key-short.md)]

## Use existing app

1.  Download and save the [app JSON file](https://github.com/Azure-Samples/cognitive-services-language-understanding/blob/master/documentation-samples/tutorials/custom-domain-regex-HumanResources.json) from the Regular Expression entity tutorial.

2. Import the JSON into a new app.

3. From the **Manage** section, on the **Versions** tab, clone the version, and name it `composite`. Cloning is a great way to play with various LUIS features without affecting the original version. Because the version name is used as part of the URL route, the name can't contain any characters that are not valid in a URL.

## Composite entity

In this app, the department name is defined in the **Department** list entity and includes synonyms. 

The **TransferEmployeeToDepartment** intent has example utterances to request an employee be moved from one department to another. 

Example utterances for this intent include:

|Example utterances|
|--|
|move John W. Smith to the accounting department|
|transfer Jill Jones from to R&D|
|Dept 1234 has a new member named Bill Bradstreet|
|Place John Jackson in Engineering |
|move Debra Doughtery to Inside Sales|
|mv Jill Jones to IT|
|Shift Alice Anderson to DevOps|
|Carl Chamerlin to Finance|
|Steve Standish to 1234|
|Tanner Thompson to 3456|

 
The move request should include the department name, and the employee name. 

The extracted data from the endpoint should contain this information and return it in the `TransferEmployeeInfo` composite entity:

```json

```

## Add the PersonName prebuilt entity to help with common data type extraction

LUIS provides several prebuilt entities for common data extraction. 

1. Select **Build** from the top navigation, then select **Entities** from the left navigation menu.

2. Select **Manage prebuilt entity** button.

3. Select **[PersonName](luis-reference-prebuilt-person.md)** from the list of prebuilt entities then select **Done**.

    ![Screenshot of number select in prebuilt entities dialog](./media/luis-tutorial-prebuilt-intents-and-entities/select-prebuilt-entities.png)

    This entity helps you add name recognition to your client application.

[!INCLUDE [Follow these steps to add the None intent to the app](../../../includes/cognitive-services-luis-create-the-none-intent.md)]

## Create composite entity from example utterances

1. In the first utterance, select the first entity, `john smith`, then select **Wrap in composite entity** in the pop-up menu list. 

    [![Screenshot of wrapping entity in composite entity highlighted](media/luis-tutorial-composite-entity/hr-create-entity-1.png "Screenshot of wrapping entity in composite entity highlighted")](media/luis-tutorial-composite-entity/hr-create-entity-1.png#lightbox)


1. Then immediately select the last entity, `accting` in the utterance. A green bar is drawn under the selected words indicating a composite entity. In the pop-up menu, enter the composite name `TransferEmployeeInfo` then select enter. 

    [![Screenshot of LUIS on 'MoveEmployee' intent selecting last entity in composite and creating entity highlighted](media/luis-tutorial-composite-entity/hr-create-entity-2.png "Screenshot of LUIS on 'MoveEmployee' intent selecting last entity in composite and creating entity highlighted")](media/luis-tutorial-composite-entity/hr-create-entity-2.png#lightbox)

1. In **What type of entity do you want to create?**, all the fields required are in the list. Select **Done**. 

    Notice that the prebuilt entity, personName, was added to the composite entity. If you could have a prebuilt entity appear between the beginning and ending tokens of a composite entity, the composite entity must contain those prebuilt entities. If the prebuilt entities are not included, the composite entity is not correctly predicted but each individual element is.

    ![Screenshot of LUIS on 'MoveEmployee' intent adding another entity in pop-up window](media/luis-tutorial-composite-entity/hr-create-entity-ddl.png)

## Label example utterances with composite entity


1. In each example utterance, select the left-most entity that should be in the composite. Then select **Wrap in composite entity**.

    [![Screenshot of LUIS on 'MoveEmployee' intent selecting first entity in composite highlighted](media/luis-tutorial-composite-entity/hr-label-entity-1.png "Screenshot of LUIS on 'MoveEmployee' intent selecting first entity in composite highlighted")](media/luis-tutorial-composite-entity/hr-label-entity-1.png#lightbox)

1. Select the last word in the composite entity then select **TransferEmployeeInfo** from the pop-up menu. 

    [![Screenshot of LUIS on 'MoveEmployee' intent selecting last entity in composite highlighted](media/luis-tutorial-composite-entity/hr-label-entity-2.png "Screenshot of LUIS on 'MoveEmployee' intent selecting last entity in composite highlighted")](media/luis-tutorial-composite-entity/hr-label-entity-2.png#lightbox)

1. Verify all utterances in the intent are labeled with the composite entity. 

    [![Screenshot of LUIS on 'MoveEmployee' with all utterances labeled](media/luis-tutorial-composite-entity/hr-all-utterances-labeled.png "Screenshot of LUIS on 'MoveEmployee' with all utterances labeled")](media/luis-tutorial-composite-entity/hr-all-utterances-labeled.png#lightbox)

## Add example utterances to the None intent 

[!INCLUDE [Follow these steps to add the None intent to the app](../../../includes/cognitive-services-luis-create-the-none-intent.md)]


## Train the app so the changes to the intent can be tested 

[!INCLUDE [LUIS How to Train steps](../../../includes/cognitive-services-luis-tutorial-how-to-train.md)]

## Publish the app so the trained model is queryable from the endpoint

[!INCLUDE [LUIS How to Publish steps](../../../includes/cognitive-services-luis-tutorial-how-to-publish.md)]

## Get intent and entity prediction from endpoint 

1. [!INCLUDE [LUIS How to get endpoint first step](../../../includes/cognitive-services-luis-tutorial-how-to-get-endpoint.md)]

2. Go to the end of the URL in the address and enter `Move Jill Jones from a-1234 to z-2345 on March 3 2 p.m.`. The last querystring parameter is `q`, the utterance query. 

    Since this test is to verify the composite is extracted correctly, a test can either include an existing sample utterance or a new utterance. A good test is to include all the child entities in the composite entity.

    ```json
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

## Related information

* [Composite entity](luis-concept-entity-types.md#composite) conceptual information
* [How to train](luis-how-to-train.md)
* [How to publish](luis-how-to-publish-app.md)
* [How to test in LUIS portal](luis-interactive-test.md)


## Next steps

This tutorial created a composite entity to encapsulate existing entities. This allows the client application to find a group of related data in different datatypes to continue the conversation. A client application for this Human Resources app could ask what day and time the move needs to begin and end. It could also ask about other logistics of the movesuch as a physical phone. 

> [!div class="nextstepaction"] 
> [Learn how to add a simple entity with a phrase list](luis-quickstart-primary-and-secondary-data.md)  
