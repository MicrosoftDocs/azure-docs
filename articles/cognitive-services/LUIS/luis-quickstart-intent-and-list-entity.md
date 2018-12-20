---
title: Exact text match
titleSuffix: Azure Cognitive Services
description: Get data that matches a predefined list of items. Each item on the list can have synonyms that also match exactly
services: cognitive-services
author: diberry
manager: cgronlun
ms.custom: seodec18
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: tutorial
ms.date: 12/21/2018
ms.author: diberry
#Customer intent: As a new user, I want to understand how and why to use the list entity. 
--- 

# Tutorial: Get exact text-matched data from the utterance
In this tutorial, understand how to get data that matches a predefined list of items.

**In this tutorial, you learn how to:**

<!-- green checkmark -->
> [!div class="checklist"]
> * Use existing tutorial app
> * Add MoveEmployee intent
> * Add list entity 
> * Train 
> * Publish
> * Get intents and entities from endpoint

[!INCLUDE [LUIS Free account](../../../includes/cognitive-services-luis-free-key-short.md)]

## What is a list entity?

A list entity is an exact text match to the words in the utterance. 

Each item on the list can include a list of synonyms. For the human resources app, a company department can be identified be several key pieces of information such as an official name, common acronyms, and billing department codes. 

The Human Resources app needs to determine the department an employee is transferring to. 

A list entity is a good choice for this type of data when:

* The data values are a known set.
* The set doesn't exceed the maximum LUIS [boundaries](luis-boundaries.md) for this entity type.
* The text in the utterance is an exact match with a synonym or the canonical name. LUIS doesn't use the list beyond exact text matches. Stemming, plurals, and other variations are not resolved with just a list entity. To manage variations, consider using a [pattern](luis-concept-patterns.md#syntax-to-mark-optional-text-in-a-template-utterance) with the optional text syntax. 

## Create an intent to transfer employees to a different department

1. [!INCLUDE [Start in Build section](../../../includes/cognitive-services-luis-tutorial-build-section.md)]

2. Select **Create new intent**. 

3. Enter `MoveEmployee` in the pop-up dialog box then select **Done**. 

    ![Screenshot of create new intent dialog with](./media/luis-quickstart-intent-and-list-entity/hr-create-new-intent-ddl.png)

4. Add example utterances to the intent.

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

    [ ![Screenshot of Intent page with new utterances highlighted](./media/luis-quickstart-intent-and-list-entity/hr-enter-utterances.png) ](./media/luis-quickstart-intent-and-list-entity/hr-enter-utterances.png#lightbox)

    [!INCLUDE [Do not use too few utterances](../../../includes/cognitive-services-luis-too-few-example-utterances.md)]  

## Department list entity

Now that the **MoveEmployee** intent has example utterances, LUIS needs to understand what a department is. 

The primary, _canonical_, name for each item is the department name. Examples of the synonyms of each canonical name are: 

|Canonical name|Synonyms|
|--|--|
|Accounting|acct<br>accting<br>3456|
|Development Operations|Devops<br>4949|
|Engineering|eng<br>enging<br>4567|
|Finance|fin<br>2020|
|Information Technology|IT<br>2323|
|Inside Sales|isale<br>insale<br>1414|
|Research and Development|R&D<br>1234|

1. Select **Entities** in the left panel.

2. Select **Create new entity**.

3. In the entity pop-up dialog, enter `Department` for the entity name, and  **List** for entity type. Select **Done**.  

    [![Screenshot of creating new entity pop-up dialog](media/luis-quickstart-intent-and-list-entity/hr-list-entity-ddl.png "Screenshot of creating new entity pop-up dialog")](media/luis-quickstart-intent-and-list-entity/hr-list-entity-ddl.png#lightbox)

4. On the Department entity page, enter `Accounting` as the new value.

    [![Screenshot of entering value](media/luis-quickstart-intent-and-list-entity/hr-emp1-value.png "Screenshot of entering value")](media/luis-quickstart-intent-and-list-entity/hr-emp1-value.png#lightbox)

5. For Synonyms, add the synonyms from the previous table.

    [![Screenshot of entering synonyms](media/luis-quickstart-intent-and-list-entity/hr-emp1-synonyms.png "Screenshot of entering synonyms")](media/luis-quickstart-intent-and-list-entity/hr-emp1-synonyms.png#lightbox)

6. Continue adding all the canonical names and their synonyms. 

## Train the app so the changes to the intent can be tested 

[!INCLUDE [LUIS How to Train steps](../../../includes/cognitive-services-luis-tutorial-how-to-train.md)]

## Publish the app so the trained model is queryable from the endpoint

[!INCLUDE [LUIS How to Publish steps](../../../includes/cognitive-services-luis-tutorial-how-to-publish.md)]

## Get intent and entity prediction from endpoint

1. [!INCLUDE [LUIS How to get endpoint first step](../../../includes/cognitive-services-luis-tutorial-how-to-get-endpoint.md)] 

2. Go to the end of the URL in the address and enter `shift 123-45-6789 from Z-1242 to T-54672`. The last querystring parameter is `q`, the utterance **q**uery. This utterance is not the same as any of the labeled utterances so it is a good test and should return the `MoveEmployee` intent with `Employee` extracted.

  ```json
  {
    "query": "shift 123-45-6789 from Z-1242 to T-54672",
    "topScoringIntent": {
      "intent": "MoveEmployee",
      "score": 0.9882801
    },
    "intents": [
      {
        "intent": "MoveEmployee",
        "score": 0.9882801
      },
      {
        "intent": "FindForm",
        "score": 0.016044287
      },
      {
        "intent": "GetJobInformation",
        "score": 0.007611245
      },
      {
        "intent": "ApplyForJob",
        "score": 0.007063288
      },
      {
        "intent": "Utilities.StartOver",
        "score": 0.00684710965
      },
      {
        "intent": "None",
        "score": 0.00304174074
      },
      {
        "intent": "Utilities.Help",
        "score": 0.002981
      },
      {
        "intent": "Utilities.Confirm",
        "score": 0.00212222221
      },
      {
        "intent": "Utilities.Cancel",
        "score": 0.00191026414
      },
      {
        "intent": "Utilities.Stop",
        "score": 0.0007461446
      }
    ],
    "entities": [
      {
        "entity": "123 - 45 - 6789",
        "type": "Employee",
        "startIndex": 6,
        "endIndex": 16,
        "resolution": {
          "values": [
            "Employee-24612"
          ]
        }
      },
      {
        "entity": "123",
        "type": "builtin.number",
        "startIndex": 6,
        "endIndex": 8,
        "resolution": {
          "value": "123"
        }
      },
      {
        "entity": "45",
        "type": "builtin.number",
        "startIndex": 10,
        "endIndex": 11,
        "resolution": {
          "value": "45"
        }
      },
      {
        "entity": "6789",
        "type": "builtin.number",
        "startIndex": 13,
        "endIndex": 16,
        "resolution": {
          "value": "6789"
        }
      },
      {
        "entity": "-1242",
        "type": "builtin.number",
        "startIndex": 24,
        "endIndex": 28,
        "resolution": {
          "value": "-1242"
        }
      },
      {
        "entity": "-54672",
        "type": "builtin.number",
        "startIndex": 34,
        "endIndex": 39,
        "resolution": {
          "value": "-54672"
        }
      }
    ]
  }
  ```

  The employee was found and returned as type `Employee` with a resolution value of `Employee-24612`.

## Clean up resources

[!INCLUDE [LUIS How to clean up resources](../../../includes/cognitive-services-luis-tutorial-how-to-clean-up-resources.md)]

## Related information

* [List entity](luis-concept-entity-types.md#exact-match) conceptual information
* [How to train](luis-how-to-train.md)
* [How to publish](luis-how-to-publish-app.md)
* [How to test in LUIS portal](luis-interactive-test.md)


## Next steps
This tutorial created a new intent, added example utterances, then created a list entity to extract exact text matches from utterances. After training, and publishing the app, a query to the endpoint identified the intention and returned the extracted data.

> [!div class="nextstepaction"]
> [Add a hierarchical entity to the app](luis-quickstart-intent-and-hier-entity.md)

