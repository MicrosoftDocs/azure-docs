---
title: "Tutorial 5: Pattern.any entity for free-form text"
titleSuffix: Azure Cognitive Services
description: Use the pattern.any entity to extract data from utterances where the utterances is well-formatted and where the end of the data may be easily confused with the remaining words of the utterance.  
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: tutorial
ms.date: 09/09/2018
ms.author: diberry
#Customer intent: As a new user, I want to understand how and why to use pattern.any entity to improve predictions. 
---

# Tutorial 5: Extract free-form data

In this tutorial, use the pattern.any entity to extract data from utterances where the utterances are well-formatted and where the end of the data may be easily confused with the remaining words of the utterance. 

The pattern.any entity allows you to find free-form data where the wording of the entity makes it difficult to determine the end of the entity from the rest of the utterance. 

This Human Resources app helps employees find company forms. 

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

The varying length includes words that may confuse LUIS about where the entity ends. Using a Pattern.any entity in a pattern allows you to specify the beginning and end of the form name so LUIS correctly extracts the form name.

|Template utterance example|
|--|
|Where is {FormName}[?]|
|Who authored {FormName}[?]|
|{FormName} is published in French[?]|

**In this tutorial, you learn how to:**

> [!div class="checklist"]
> * Use existing tutorial app
> * Add example utterances to existing entity
> * Create Pattern.any entity
> * Create pattern
> * Train
> * Test new pattern

[!include[LUIS Free account](../../../includes/cognitive-services-luis-free-key-short.md)]

## Use existing app
Continue with the app created in the last tutorial, named **HumanResources**. 

If you do not have the HumanResources app from the previous tutorial, use the following steps:

1.  Download and save [app JSON file](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/tutorials/custom-domain-roles-HumanResources.json).

2. Import the JSON into a new app.

3. From the **Manage** section, on the **Versions** tab, clone the version, and name it `patt-any`. Cloning is a great way to play with various LUIS features without affecting the original version. Because the version name is used as part of the URL route, the name can't contain any characters that are not valid in a URL.

## Add example utterances 
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

This tutorial added example utterances to an existing intent then created a new Pattern.any for the form name. Then the tutorial created a pattern for the existing intent with the new example utterances and entity. Interactive testing showed that the pattern and its intent were predicted because the entity was found. 

> [!div class="nextstepaction"]
> [Learn how to use roles with a pattern](luis-tutorial-pattern-roles.md)