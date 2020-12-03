---
title: Batch testing - LUIS
titleSuffix: Azure Cognitive Services
description: Use batch testing to continuously work on your application to refine it and improve its language understanding.
services: cognitive-services

manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 12/02/2020

---

# Batch testing in LUIS

Batch testing validates your active trained version to measure its prediction accuracy. A batch test helps you view the accuracy of each intent and entity in your active version, displaying results with a chart. Review the batch test results to take appropriate action to improve accuracy, such as adding more example utterances to an intent if your app frequently fails to identify the correct intent or labeling entities within the utterance.

## Group data for batch test

It is important that utterances used for batch testing are new to LUIS. If you have a data set of utterances, divide the utterances into three sets: example utterances added to an intent, utterances received from the published endpoint, and utterances used to batch test LUIS after it is trained.

## Batch testing using the REST API 

LUIS lets you batch test using the LUIS portal and REST API. The endpoints for the REST API are listed below. For information on batch testing using the LUIS portal, see [Tutorial: batch test data sets](luis-tutorial-batch-testing.md). Use the complete URLs below, replacing the placeholder values with your own LUIS Prediction key and endpoint. 

Remember to add your LUIS key to `Apim-Subscription-Id` in the header, and set `Content-Type` to `application/json`.

### Start a batch test

Start a batch test using either an app version ID or a publishing slot. Send a **POST** request to one of the following endpoint formats. Include your batch file in the body of the request.

Publishing slot
* `<YOUR-PREDICTION-ENDPOINT>/luis/prediction/v3.0/apps/<YOUR-APP-ID>/slots/<YOUR-SLOT-NAME>/evaluations`

App version ID
* `<YOUR-PREDICTION-ENDPOINT>/luis/prediction/v3.0/apps/<YOUR-APP-ID>/versions/<YOUR-APP-VERSION-ID>/evaluations`

These endpoints will return an operation ID that you will use to check the status, and get results. 


### Get the status of an ongoing batch test

Use the operation ID from the batch test you started to get its status from the following endpoint formats: 

Publishing slot
* `<YOUR-PREDICTION-ENDPOINT>/luis/prediction/v3.0/apps/<YOUR-APP-ID>/slots/<YOUR-SLOT-ID>/evaluations/<YOUR-OPERATION-ID>/status`

App version ID
* `<YOUR-PREDICTION-ENDPOINT>/luis/prediction/v3.0/apps/<YOUR-APP-ID>/versions/<YOUR-APP-VERSION-ID>/evaluations/<YOUR-OPERATION-ID>/status`

### Get the results from a batch test

Use the operation ID from the batch test you started to get its results from the following endpoint formats: 

Publishing slot
* `<YOUR-PREDICTION-ENDPOINT>/luis/prediction/v3.0/apps/<YOUR-APP-ID>/slots/<YOUR-SLOT-ID>/evaluations/<YOUR-OPERATION-ID>/result`

App version ID
* `<YOUR-PREDICTION-ENDPOINT>/luis/prediction/v3.0/apps/<YOUR-APP-ID>/versions/<YOUR-APP-VERSION-ID>/evaluations/<YOUR-OPERATION-ID>/result`


## A data set of utterances

Submit a batch file of utterances, known as a *data set*, for batch testing. The data set is a JSON-formatted file containing a maximum of 1,000 labeled utterances. You can test up to 10 data sets in an app. If you need to test more, delete a data set and then add a new one.

## Entities allowed in batch tests

All custom entities in the model appear in the batch test entities filter even if there are no corresponding entities in the batch file data.

<a name="json-file-with-no-duplicates"></a>
<a name="example-batch-file"></a>

## Batch file format

The batch file consists of utterances. Each utterance must have an expected intent prediction along with any [machine-learning entities](luis-concept-entity-types.md#types-of-entities) you expect to be detected.

## Batch syntax template for intents with entities

Use the following template to start your batch file:

```JSON
{
    "LabeledTestSetUtterances": [
        {
            "text": "play a song",
            "intent": "play_music",
            "entities": [
                {
                    "entity": "song_parent",
                    "startPos": 0,
                    "endPos": 15,
                    "children": [
                        {
                            "entity": "pre_song",
                            "startPos": 0,
                            "endPos": 3
                        },
                        {
                            "entity": "song_info",
                            "startPos": 5,
                            "endPos": 15
                        }
                    ]
                }
            ]
        }
    ]
}

```

The batch file uses the **startPos** and **endPos** properties to note the beginning and end of an entity. The values are zero-based and should not begin or end on a space. This is different from the query logs, which use startIndex and endIndex properties.

If you do not want to test entities, include the `entities` property and set the value as an empty array, `[]`.


## Common errors importing a batch

Common errors include:

> * More than 1,000 utterances
> * An utterance JSON object that doesn't have an entities property. The property can be an empty array.
> * Word(s) labeled in multiple entities
> * Entity label starting or ending on a space.

## Batch test state

LUIS tracks the state of each data set's last test. This includes the size (number of utterances in the batch), last run date, and last result (number of successfully predicted utterances).

<a name="sections-of-the-results-chart"></a>

## REST API batch test results

There are several objects returned by the API:

* Information about the intents and entities models, such as precision, recall and F-score.
* Information about the entities models, such as precision, recall and F-score) for each entity 
  * Using the `verbose` flag, you can get more information about the entity, such as `entityTextFScore` and `entityTypeFScore`.
* Provided utterances with the predicted and labeled intent names
* A list of false positive entities, and a list of false negative entities..

## Errors in the results

Errors in the batch test indicate intents that are not predicted as noted in the batch file. Errors are indicated in the two red sections of the chart.

The false positive section indicates that an utterance matched an intent or entity when it shouldn't have. The false negative indicates an utterance did not match an intent or entity when it should have.

## Fixing batch errors

If there are errors in the batch testing, you can either add more utterances to an intent, and/or label more utterances with the entity to help LUIS make the discrimination between intents. If you have added utterances, and labeled them, and still get prediction errors in batch testing, consider adding a [phrase list](luis-concept-feature.md) feature with domain-specific vocabulary to help LUIS learn faster.

## Next steps

* Learn how to [test a batch](luis-how-to-batch-test.md)
