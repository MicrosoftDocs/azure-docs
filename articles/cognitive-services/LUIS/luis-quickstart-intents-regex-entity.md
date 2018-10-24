---
title: "Tutorial 3: Regular-expression matched data - extract well-formated data"
titleSuffix: Azure Cognitive Services
description: Extract consistently-formatted data from an utterance using the Regular Expression entity. 
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: language-understanding
ms.topic: tutorial
ms.date: 09/09/2018
ms.author: diberry
#Customer intent: As a new user, I want to understand how and why to use the regular expression entity. 
--- 

# Tutorial 3: Extract well-formatted data
In this tutorial, modify the Human Resources app to extract consistently-formatted data from an utterance using the **Regular Expression** entity.

The purpose of an entity is to extract important data contained within the utterance. This app's use of the regular expression entity is to pull out formatted Human Resources (HR) form numbers from an utterance. While the utterance's intent is always determined with machine-learning, this specific entity type is not machine-learned. 

**Example utterances include:**

```
Where is HRF-123456?
Who authored HRF-123234?
HRF-456098 is published in French?
HRF-456098
HRF-456098 date?
HRF-456098 title?
```
 
A regular expression is a good choice for this type of data when:

* the data is well-formatted.

**In this tutorial, you learn how to:**

<!-- green checkmark -->
> [!div class="checklist"]
> * Use existing tutorial app
> * Add FindForm intent
> * Add regular expression entity 
> * Train
> * Publish
> * Get intents and entities from endpoint

[!include[LUIS Free account](../../../includes/cognitive-services-luis-free-key-short.md)]

## Use existing app
Continue with the app created in the last tutorial, named **HumanResources**. 

If you do not have the HumanResources app from the previous tutorial, use the following steps:

1. Download and save [app JSON file](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/tutorials/custom-domain-prebuilts-HumanResources.json).

2. Import the JSON into a new app.

3. From the **Manage** section, on the **Versions** tab, clone the version, and name it `regex`. Cloning is a great way to play with various LUIS features without affecting the original version. Because the version name is used as part of the URL route, the name can't contain any characters that are not valid in a URL. 

## FindForm intent

1. [!include[Start in Build section](../../../includes/cognitive-services-luis-tutorial-build-section.md)]

2. Select **Create new intent**. 

3. Enter `FindForm` in the pop-up dialog box then select **Done**. 

    ![Screenshot of create new intent dialog with Utilities in the search box](./media/luis-quickstart-intents-regex-entity/create-new-intent-ddl.png)

4. Add example utterances to the intent.

    |Example utterances|
    |--|
    |What is the URL for hrf-123456?|
    |Where is hrf-345678?|
    |When was hrf-456098 updated?|
    |Did John Smith update hrf-234639 last week?|
    |How many version of hrf-345123 are there?|
    |Who needs to authorize form hrf-123456?|
    |How many people need to sign off on hrf-345678?|
    |hrf-234123 date?|
    |author of hrf-546234?|
    |title of hrf-456234?|

    [ ![Screenshot of Intent page with new utterances highlighted](./media/luis-quickstart-intents-regex-entity/findform-intent.png) ](./media/luis-quickstart-intents-regex-entity/findform-intent.png#lightbox)

    The application has prebuilt number entity added from the previous tutorial, so each form number is tagged. This may be enough for your client application but the number won't be labeled with the type of number. Creating a new entity with an appropriate name allows the client application to process the entity appropriately when it is returned from LUIS.

    [!include[Do not use too few utterances](../../../includes/cognitive-services-luis-too-few-example-utterances.md)]  

## Regular expression entity 
The regular expression entity to match the form number is `hrf-[0-9]{6}`. This regular expression matches the literal characters `hrf-` but ignores case and culture variants. It matches digits 0-9, for 6 digits exactly.

HRF stands for `human resources form`.

LUIS tokenizes the utterance when it is added to an intent. The tokenization for these utterances adds spaces before and after the hyphen, `Where is HRF - 123456?`  The regular expression is applied to the utterance in its raw form, before it is tokenized. Because it is applied to the _raw_ form, the regular expression doesn't have to deal with word boundaries. 

Create a regular expression entity to tell LUIS what an HRF-number format is in the following steps:

1. Select **Entities** in the left panel.

2. Select **Create new entity** button on the Entities Page. 

3. In the pop-up dialog, enter the new entity name `HRF-number`, select **RegEx** as the entity type, enter `hrf-[0-9]{6}` as the **Regex** value, and then select **Done**.

    ![Screenshot of pop-up dialog setting new entity properties](./media/luis-quickstart-intents-regex-entity/create-regex-entity.png)

4. Select **Intents** from the left menu, then **FindForm** intent to see the regular expression labeled in the utterances. 

    [![Screenshot of Label utterance with existing entity and regex pattern](./media/luis-quickstart-intents-regex-entity/labeled-utterances-for-entity.png)](./media/luis-quickstart-intents-regex-entity/labeled-utterances-for-entity.png#lightbox)

    Because the entity is not a machine-learned entity, the label is applied to the utterances and displayed in the LUIS website as soon as it is created.

## Train

[!INCLUDE [LUIS How to Train steps](../../../includes/cognitive-services-luis-tutorial-how-to-train.md)]

## Publish

[!INCLUDE [LUIS How to Publish steps](../../../includes/cognitive-services-luis-tutorial-how-to-publish.md)]

## Get intent and entities from endpoint

1. [!INCLUDE [LUIS How to get endpoint first step](../../../includes/cognitive-services-luis-tutorial-how-to-get-endpoint.md)]

2. Go to the end of the URL in the address and enter `When were HRF-123456 and hrf-234567 published in the last year?`. The last querystring parameter is `q`, the utterance **query**. This utterance is not the same as any of the labeled utterances so it is a good test and should return the `FindForm` intent with the two form numbers of `HRF-123456` and `hrf-234567`.

    ```JSON
    {
      "query": "When were HRF-123456 and hrf-234567 published in the last year?",
      "topScoringIntent": {
        "intent": "FindForm",
        "score": 0.9993477
      },
      "intents": [
        {
          "intent": "FindForm",
          "score": 0.9993477
        },
        {
          "intent": "ApplyForJob",
          "score": 0.0206110049
        },
        {
          "intent": "GetJobInformation",
          "score": 0.00533067342
        },
        {
          "intent": "Utilities.StartOver",
          "score": 0.004215215
        },
        {
          "intent": "Utilities.Help",
          "score": 0.00209096959
        },
        {
          "intent": "None",
          "score": 0.0017655947
        },
        {
          "intent": "Utilities.Stop",
          "score": 0.00109490135
        },
        {
          "intent": "Utilities.Confirm",
          "score": 0.0005704638
        },
        {
          "intent": "Utilities.Cancel",
          "score": 0.000525338168
        }
      ],
      "entities": [
        {
          "entity": "last year",
          "type": "builtin.datetimeV2.daterange",
          "startIndex": 53,
          "endIndex": 61,
          "resolution": {
            "values": [
              {
                "timex": "2017",
                "type": "daterange",
                "start": "2017-01-01",
                "end": "2018-01-01"
              }
            ]
          }
        },
        {
          "entity": "hrf-123456",
          "type": "HRF-number",
          "startIndex": 10,
          "endIndex": 19
        },
        {
          "entity": "hrf-234567",
          "type": "HRF-number",
          "startIndex": 25,
          "endIndex": 34
        },
        {
          "entity": "-123456",
          "type": "builtin.number",
          "startIndex": 13,
          "endIndex": 19,
          "resolution": {
            "value": "-123456"
          }
        },
        {
          "entity": "-234567",
          "type": "builtin.number",
          "startIndex": 28,
          "endIndex": 34,
          "resolution": {
            "value": "-234567"
          }
        }
      ]
    }
    ```

    The numbers in the utterance are returned twice, once as the new entity `hrf-number`, and once as a prebuilt entity, `number`. An utterance can have more than one entity, and more than one of the same type of entity, as this example shows. By using a regular expression entity, LUIS extracts named data, which is more programmatically helpful to the client application receiving the JSON response.


## Clean up resources

[!INCLUDE [LUIS How to clean up resources](../../../includes/cognitive-services-luis-tutorial-how-to-clean-up-resources.md)]

## Next steps
This tutorial created a new intent, added example utterances, then created a regular expression entity to extract well-formatted data from the utterances. After training, and publishing the app, a query to the endpoint identified the intention and returned the extracted data.

> [!div class="nextstepaction"]
> [Learn about the list entity](luis-quickstart-intent-and-list-entity.md)

