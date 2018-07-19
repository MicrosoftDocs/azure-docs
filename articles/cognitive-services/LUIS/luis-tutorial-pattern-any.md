---
title: Tutorial using pattern.any entity to improve LUIS predictions - Azure | Microsoft Docs 
titleSuffix: Azure
description: In this tutorial, use the pattern.any entity to improve LUIS intent and entity predictions.
services: cognitive-services
author: v-geberr
manager: kamran.iqbal


ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 07/19/2018
ms.author: v-geberr;
#Customer intent: As a new user, I want to understand how and why to use pattern.any entity to improve predictions. 
---

# Tutorial: Improve app with pattern.any entity

In this tutorial, use the pattern.any entity to increase intent and entity prediction.  

> [!div class="checklist"]
* Learn when and how to use pattern.any
* Create pattern that uses pattern.any
* How to verify prediction improvements

For this article, you need a free [LUIS](luis-reference-regions.md) account in order to author your LUIS application.

## Before you begin
If you don't have the Human Resources app from the [batch test](luis-tutorial-batch-testing.md) tutorial, [import](luis-how-to-start-new-app.md#import-new-app) the JSON into a new app in the [LUIS](luis-reference-regions.md#luis-website) website. The app to import is found in the [LUIS-Samples](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/quickstarts/custom-domain-batchtest-HumanResources.json) Github repository.

If you want to keep the original Human Resources app, clone the version on the [Settings](luis-how-to-manage-versions.md#clone-a-version) page, and name it `patterns`. Cloning is a great way to play with various LUIS features without affecting the original version. 

## The purpose of pattern.any

**While patterns allow you to provide fewer example utterances, if the entities are not detected, the pattern will not match.**

Remember that employees were created in the [list entity tutorial](luis-quickstart-intent-and-list-entity.md).

## Create new intent and example utterances

4. Add example utterances to the intent.

    |Example utterances|
    |--|
    |Who is John W. Smith the subordinate of?|
    |Who does John W. Smith report to?|
    |Who is John W. Smith's manager?|
    |Who does Jill Jones directly report to?|
    |Who is Jill Jones supervisor?|

    [![](media/luis-tutorial-pattern/hr-orgchart-manager-intent.png "Screenshot of LUIS adding new utterances to intent")](media/luis-tutorial-pattern/hr-orgchart-manager-intent.png#lightbox)


## Caution about example utterance quantity
The quantity of example utterances in these intents are not enough to train LUIS properly. In a real-world app, each intent should have a minimum of 15 utterances with a variety of word choice and utterance length. These few utterances are selected specifically to highlight patterns. 

## Train the LUIS app
The new intent and utterances require training. 

1. In the top right side of the LUIS website, select the **Train** button.

    ![Image of training button](./media/luis-tutorial-pattern/hr-train-button.png)

2. Training is complete when you see the green status bar at the top of the website confirming success.

    ![Image of success notification bar](./media/luis-tutorial-pattern/hr-trained-inline.png)

## Publish the app to get the endpoint URL
In order to get a LUIS prediction in a chatbot or other application, you need to publish the app. 

1. In the top right side of the LUIS website, select the **Publish** button. 

2. Select the Production slot and the **Publish** button.

    [ ![Screenshot of Publish page with Publish to production slot button highlighted](./media/luis-tutorial-pattern/hr-publish-to-production.png)](./media/luis-tutorial-pattern/hr-publish-to-production.png#lightbox)

3. Publishing is complete when you see the green status bar at the top of the website confirming success.

## Query the endpoint with a different utterance
1. On the **Publish** page, select the **endpoint** link at the bottom of the page. This action opens another browser window with the endpoint URL in the address bar. 

    [ ![Screenshot of Publish page with endpoint URL highlighted](./media/luis-tutorial-pattern/hr-publish-select-endpoint.png)](./media/luis-tutorial-pattern/hr-publish-select-endpoint.png#lightbox)


2. Go to the end of the URL in the address and enter `Who is the boss of Jill Jones?`. The last querystring parameter is `q`, the utterance **query**. 

    ```JSON
    {
        "query": "who is the boss of jill jones?",
        "topScoringIntent": {
            "intent": "OrgChart-Manager",
            "score": 0.353984952
        },
        "intents": [
            {
                "intent": "OrgChart-Manager",
                "score": 0.353984952
            },
            {
                "intent": "OrgChart-Reports",
                "score": 0.214128986
            },
            {
                "intent": "EmployeeFeedback",
                "score": 0.08434003
            },
            {
                "intent": "MoveEmployee",
                "score": 0.019131
            },
            {
                "intent": "GetJobInformation",
                "score": 0.004819009
            },
            {
                "intent": "Utilities.Confirm",
                "score": 0.0043958663
            },
            {
                "intent": "Utilities.StartOver",
                "score": 0.00312064588
            },
            {
                "intent": "Utilities.Cancel",
                "score": 0.002265454
            },
            {
                "intent": "Utilities.Help",
                "score": 0.00133465114
            },
            {
                "intent": "None",
                "score": 0.0011388344
            },
            {
                "intent": "Utilities.Stop",
                "score": 0.00111166481
            },
            {
                "intent": "FindForm",
                "score": 0.0008900076
            },
            {
                "intent": "ApplyForJob",
                "score": 0.0007836131
            }
        ],
        "entities": [
            {
                "entity": "jill jones",
                "type": "Employee",
                "startIndex": 19,
                "endIndex": 28,
                "resolution": {
                    "values": [
                        "Employee-45612"
                    ]
                }
            },
            {
                "entity": "boss of jill jones",
                "type": "builtin.keyPhrase",
                "startIndex": 11,
                "endIndex": 28
            }
        ]
    }
    ```

Did this query succeed? 

Use patterns to make the improve intent's score. 

## Use a Pattern.any entity to find free-form entities in a pattern
This HumanResources app also helps employees find company forms. Many of the forms have titles that are varying in length. The varying length includes phrases that may confuse LUIS about where the form name ends. Using a **Pattern.any** entity in a pattern allows you to specify the beginning and end of the form name so LUIS correctly extracts the form name. 

### Create a new intent for the form
Create a new intent for utterances that are looking for forms.

1. Select **Intents** from left navigation.

2. Select **Create new intent**.

3. Name the new intent `FindForm`.

4. Add an example utterance.

    ```
    `Where is the form What to do when a fire breaks out in the Lab and who needs to sign it after I read it?`
    ```

    ![Screenshot of new entity with roles](./media/luis-tutorial-pattern/intent-findform.png)

    The form title is `What to do when a fire breaks out in the Lab`. The utterance is asking for the location of the form and is also asking who needs to sign it validating the employee read it. Without a Pattern.any entity, it would be difficult to understand where the form title ends and extract the form title as an entity of the utterance.

### Create a Pattern.any entity for the form title
The Pattern.any entity allows for entities of varying length. It only works in a pattern because the pattern marks the beginning and end of the entity. If you find that your pattern, when it includes a Pattern.any, extracts entities incorrectly, use an [explicit list](luis-concept-patterns.md#explicit-lists) to correct this problem. 

1. Select **Entities** in the left navigation.

2. Select **Create new entity**. 

3. Name the entity `FormName` with type **Pattern.any**. For this specific tutorial, you do not need to add any roles to the entity.

    ![Image of dialog box for entity name and entity type](./media/luis-tutorial-pattern/create-entity-pattern-any.png)

### Add a pattern that uses the Pattern.any

1. Select **Patterns** from the left navigation.

2. Select the **FindForm** intent.

3. Enter a template utterance using the new entity `Where is the form {FormName} and who needs to sign it after I read it?`

    ![Screenshot of template utterance using pattern.any entity](./media/luis-tutorial-pattern/pattern.any-template-utterance.png)

4. Train the app for the new intent, entity, and pattern.

### Test the new pattern for free-form data extraction
1. Select **Test** from the top bar to open the test panel. 

2. Enter the utterance `Where is the form Understand your responsibilities as a member of the community and who needs to sign it after I read it?`.

3. Select **Inspect** under the result to see the test results for entity and intent.

    ![Screenshot of template utterance using pattern.any entity](./media/luis-tutorial-pattern/test-pattern.any-results.png)

    The entity is found first, then the pattern is found, indicating the intent. If you have a test result where the entities are not detected, and therefore the pattern is not found, you need to add more example utterances on the intent (not the pattern).

4. Close the test panel by selecting the **Test** button in the top navigation.

## Clean up resources
When no longer needed, delete the LUIS app. To do so, select the ellipsis (***...***) to the right of the app name in the app list, select **Delete**. On the pop-up dialog **Delete app?**, select **Ok**.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to use roles with a pattern](luis-tutorial-pattern-roles.md)