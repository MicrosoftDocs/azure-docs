---
title: Tutorial creating a LUIS app to get regular-expression matched data - Azure | Microsoft Docs 
description: In this tutorial, learn how to create a simple LUIS app using intents and a regular expression entity to extract data. 
services: cognitive-services
author: diberry
manager: cjgronlund

ms.service: cognitive-services
ms.component: luis
ms.topic: tutorial
ms.date: 08/02/2018
ms.author: diberry
#Customer intent: As a new user, I want to understand how and why to use the regular expression entity. 
--- 

# Tutorial: 3. Add regular expression entity
In this tutorial, create an app that demonstrates how to extract consistently formatted data from an utterance using the **Regular Expression** entity.


<!-- green checkmark -->
> [!div class="checklist"]
> * Understand regular expression entities 
> * Use a LUIS app for a Human Resources (HR) domain with FindForm intent
> * Add regular expression entity to extract Form number from utterance
> * Train, and publish app
> * Query endpoint of app to see LUIS JSON response

[!INCLUDE [LUIS Free account](../../../includes/cognitive-services-luis-free-key-short.md)]

## Before you begin
If you do not have the Human Resources app from the [prebuilt entities](luis-tutorial-prebuilt-intents-entities.md) tutorial, [import](luis-how-to-start-new-app.md#import-new-app) the JSON into a new app in the [LUIS](luis-reference-regions.md#luis-website) website, from the [LUIS-Samples](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/quickstarts/custom-domain-prebuilts-HumanResources.json) Github repository.

If you want to keep the original Human Resources app, clone the version on the [Settings](luis-how-to-manage-versions.md#clone-a-version) page, and name it `regex`. Cloning is a great way to play with various LUIS features without affecting the original version. 


## Purpose of the regular expression entity
The purpose of an entity is to get important data contained in the utterance. The app's use of the regular expression entity is to pull out formatted Human Resources (HR) Form numbers from an utterance. It is not machine-learned. 

Simple example utterances include:

```
Where is HRF-123456?
Who authored HRF-123234?
HRF-456098 is published in French?
```

Abbreviated or slang versions of utterances include:

```
HRF-456098
HRF-456098 date?
HRF-456098 title?
```
 
The regular expression entity to match the form number is `hrf-[0-9]{6}`. This regular expression matches the literal characters `hrf -` but ignores case and culture variants. It matches digits 0-9, for 6 digits exactly.

HRF stands for human resources form.

### Tokenization with hyphens
LUIS tokenizes the utterance when the utterance is added to an intent. The tokenization for these utterances adds spaces before and after the hyphen, `Where is HRF - 123456?`  The regular expression is applied to the utterance in its raw form, before it is tokenized. Because it is applied to the _raw_ form, the regular expression doesn't have to deal with word boundaries. 


## Add FindForm intent

1. Make sure your Human Resources app is in the **Build** section of LUIS. You can change to this section by selecting **Build** on the top, right menu bar. 

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

## Create an HRF-number regular expression entity 
Create a regular expression entity to tell LUIS what an HRF-number format is in the following steps:

1. Select **Entities** in the left panel.

2. Select **Create new entity** button on the Entities Page. 

3. In the pop-up dialog, enter the new entity name `HRF-number`, select **RegEx** as the entity type, enter `hrf-[0-9]{6}` as the Regex, and then select **Done**.

    ![Screenshot of pop-up dialog setting new entity properties](./media/luis-quickstart-intents-regex-entity/create-regex-entity.png)

4. Select **Intents**, then **FindForm** intent to see the regular expression labeled in the utterances. 

    [![Screenshot of Label utterance with existing entity and regex pattern](./media/luis-quickstart-intents-regex-entity/labeled-utterances-for-entity.png)](./media/luis-quickstart-intents-regex-entity/labeled-utterances-for-entity.png#lightbox)

    Because the entity is not a machine-learned entity, the label is applied to the utterances and displayed in the LUIS website as soon as it is created.

## Train the LUIS app

[!INCLUDE [LUIS How to Train steps](../../../includes/cognitive-services-luis-tutorial-how-to-train.md)]

## Publish the app to get the endpoint URL

[!INCLUDE [LUIS How to Publish steps](../../../includes/cognitive-services-luis-tutorial-how-to-publish.md)]

## Query the endpoint with a different utterance

1. [!INCLUDE [LUIS How to get endpoint first step](../../../includes/cognitive-services-luis-tutorial-how-to-get-endpoint.md)]

2. Go to the end of the URL in the address and enter `When were HRF-123456 and hrf-234567 published in the last year?`. The last querystring parameter is `q`, the utterance **query**. This utterance is not the same as any of the labeled utterances so it is a good test and should return the `FindForm` intent with the two form numbers of `HRF-123456` and `hrf-234567`.

    ```
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

## What has this LUIS app accomplished?
This app identified the intention and returned the extracted data. 

Your chatbot now has enough information to determine the primary action, `FindForm`, and which form numbers were in the search. 

## Where is this LUIS data used? 
LUIS is done with this request. The calling application, such as a chatbot, can take the topScoringIntent result and the form numbers and search a third-party API. LUIS doesn't do that work. LUIS only determines what the user's intention is and extracts data about that intention. 

## Clean up resources

[!INCLUDE [LUIS How to clean up resources](../../../includes/cognitive-services-luis-tutorial-how-to-clean-up-resources.md)]

## Next steps

> [!div class="nextstepaction"]
> [Learn about the list entity](luis-quickstart-intent-and-list-entity.md)

