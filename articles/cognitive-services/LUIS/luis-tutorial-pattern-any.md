---
title: Tutorial using pattern.any entity to improve LUIS predictions - Azure | Microsoft Docs 
titleSuffix: Cognitive Services
description: In this tutorial, use the pattern.any entity to improve LUIS intent and entity predictions.
services: cognitive-services
author: diberry
manager: cjgronlund


ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 08/02/2018
ms.author: diberry
#Customer intent: As a new user, I want to understand how and why to use pattern.any entity to improve predictions. 
---

# Tutorial: Improve app with pattern.any entity

In this tutorial, use the pattern.any entity to increase intent and entity prediction.  

> [!div class="checklist"]
* Learn when and how to use pattern.any
* Create pattern that uses pattern.any
* How to verify prediction improvements

[!INCLUDE [LUIS Free account](../../../includes/cognitive-services-luis-free-key-short.md)]

## Before you begin
If you don't have the Human Resources app from the [pattern roles](luis-tutorial-pattern-roles.md) tutorial, [import](luis-how-to-start-new-app.md#import-new-app) the JSON into a new app in the [LUIS](luis-reference-regions.md#luis-website) website. The app to import is found in the [LUIS-Samples](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/quickstarts/custom-domain-roles-HumanResources.json) GitHub repository.

If you want to keep the original Human Resources app, clone the version on the [Settings](luis-how-to-manage-versions.md#clone-a-version) page, and name it `patt-any`. Cloning is a great way to play with various LUIS features without affecting the original version. 

## The purpose of pattern.any
The pattern.any entity allows you to find free form data where the wording of the entity makes it difficult to determine the end of the entity from the rest of the utterance. 

This Human Resources app helps employees find company forms. Forms were added in the [regular expression tutorial](luis-quickstart-intents-regex-entity.md). The form names from that tutorial used a regular expression to extract a form name that was well-formatted such as the form names in bold in the following utterance table:

|Utterance|
|--|
|Where is **HRF-123456**?|
|Who authored **HRF-123234**?|
|**HRF-456098** is published in French?|

However, each form has both a formatted name, used in the preceding table, as well as a friendly name, such as `Request relocation from employee new to the company 2018 version 5`. 

Utterances with the friendly form name look like:

|Utterance|
|--|
|Where is **Request relocation from employee new to the company 2018 version 5**?|
|Who authored **"Request relocation from employee new to the company 2018 version 5"**?|
|**Request relocation from employee new to the company 2018 version 5** is published in French?|

The varying length includes phrases that may confuse LUIS about where the entity ends. Using a Pattern.any entity in a pattern allows you to specify the beginning and end of the form name so LUIS correctly extracts the form name.

**While patterns allow you to provide fewer example utterances, if the entities are not detected, the pattern does not match.**

## Add example utterances to the existing intent FindForm 
Remove the prebuilt keyPhrase entity if it is difficult to create and label the FormName entity. 

1. Select **Build** from the top navigation, then select **Intents** from left navigation.

2. Select **FindForm** from the intents list.

3. Add some example utterances:

    |Example utterance|
    |--|
    |Where is the form **What to do when a fire breaks out in the Lab** and who needs to sign it after I read it?|
    |Where is **Request relocation from employee new to the company** on the server?|
    |Who authored "**Health and wellness requests on the main campus**" and what is the most current version?|
    |I'm looking for the form named "**Office move request including physical assets**". |

    Without a Pattern.any entity, it would be difficult for LUIS to understand where the form title ends because of the many variations of form names.

## Create a Pattern.any entity
The Pattern.any entity extracts entities of varying length. It only works in a pattern because the pattern marks the beginning and end of the entity. If you find that your pattern, when it includes a Pattern.any, extracts entities incorrectly, use an [explicit list](luis-concept-patterns.md#explicit-lists) to correct this problem. 

1. Select **Entities** in the left navigation.

2. Select **Create new entity**, enter the name `FormName`, and select **Pattern.any** as the type. Select **Done**. 

    You can't label the entity in the intent because a Pattern.any is only valid in a pattern. 

    If you want the extracted data to include other entities such as number or datetimeV2, you need to create a composite entity that includes the Pattern.any, as well as number and datetimeV2.

## Add a pattern that uses the Pattern.any

1. Select **Patterns** from the left navigation.

2. Select the **FindForm** intent.

3. Enter the following template utterances, which use the new entity:

    |Template utterances|
    |--|
    |Where is the form ["]{FormName}["] and who needs to sign it after I read it[?]|
    |Where is ["]{FormName}["] on the server[?]|
    |Who authored ["]{FormName}["] and what is the most current version[?]|
    |I'm looking for the form named ["]{FormName}["][.]|

    If you want to account for variations of the form such as single quotes instead of double quotes or a period instead of a question mark, create a new pattern for each variation.

4. If you removed the keyPhrase entity, add it back to the app. 

## Train the LUIS app

[!INCLUDE [LUIS How to Train steps](../../../includes/cognitive-services-luis-tutorial-how-to-train.md)]

## Test the new pattern for free-form data extraction
1. Select **Test** from the top bar to open the test panel. 

2. Enter the following utterance: 

    `Where is the form Understand your responsibilities as a member of the community and who needs to sign it after I read it?`

3. Select **Inspect** under the result to see the test results for entity and intent.

    The entity `FormName` is found first, then the pattern is found, determining the intent. If you have a test result where the entities are not detected, and therefore the pattern is not found, you need to add more example utterances on the intent (not the pattern).

4. Close the test panel by selecting the **Test** button in the top navigation.

## Clean up resources

[!INCLUDE [LUIS How to clean up resources](../../../includes/cognitive-services-luis-tutorial-how-to-clean-up-resources.md)]

## Next steps

> [!div class="nextstepaction"]
> [Learn how to use roles with a pattern](luis-tutorial-pattern-roles.md)