---
title: Correct misspelled words - LUIS
titleSuffix: Azure Cognitive Services
description: Correct misspelled words in utterances by adding Bing Spell Check API V7 to LUIS endpoint queries.
services: cognitive-services

manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: how-to
ms.date: 01/12/2021

---

# Correct misspelled words with Bing Search Resource

You can integrate your LUIS app with [Bing Search](https://ms.portal.azure.com/#create/Microsoft.BingSearch) to correct misspelled words in utterances before LUIS predicts the score and entities of the utterance.

## Create Endpoint key

To create a Bing Search resource in the Azure portal, follow these instructions:

1. Log in to the [Azure portal](https://portal.azure.com).

2. Select **Create a resource** in the top left corner.

3. In the search box, enter `Bing Search V7` and select the service.

4. An information panel appears to the right containing information including the Legal Notice. Select **Create** to begin the subscription creation process.

    :::image type="content" source="./media/luis-tutorial-bing-spellcheck/bing-search-resource-portal.png" alt-text="Bing Spell Check API V7 resource":::

5. In the next panel, enter your service settings. Wait for service creation process to finish.

6. After the resource is created, go to the **Keys and Endpoint** blade on the left. 

7. Copy one of the keys to be added to the header of your prediction request. You will only need one of the two keys.

8. Add the key to `mkt-bing-spell-check-key` in the prediction request header.

<!--
## Using the key in LUIS test panel
There are two places in LUIS to use the key. The first is in the [test panel](luis-interactive-test.md#view-bing-spell-check-corrections-in-test-panel). The key isn't saved into LUIS but instead is a session variable. You need to set the key every time you want the test panel to apply the Bing Spell Check API v7 service to the utterance. See [instructions](luis-interactive-test.md#view-bing-spell-check-corrections-in-test-panel) in the test panel for setting the key.
-->
## Adding the key to the endpoint URL
For each query you want to apply spelling correction on, the endpoint query needs the Bing Spellcheck resource key passed in the query header parameter. You may have a chatbot that calls LUIS or you may call the LUIS endpoint API directly. Regardless of how the endpoint is called, each and every call must include the required information in the header's request for spelling corrections to work properly. You must set the value with **mkt-bing-spell-check-key** to the key value.


## Send misspelled utterance to LUIS
1. Add a misspelled utterance in the prediction query you will be sending such as "How far is the mountainn?". In English, `mountain`, with one `n`, is the correct spelling.

2. LUIS responds with a JSON result for `How far is the mountain?`. If Bing Spell Check API v7 detects a misspelling, the `query` field in the LUIS app's JSON response contains the original query, and the `alteredQuery` field contains the corrected query sent to LUIS.

```json
{
  "query": "How far is the mountainn?",
  "alteredQuery": "How far is the mountain?",
  "topScoringIntent": {
    "intent": "Concierge",
    "score": 0.183866
  },
  "entities": []
}
```

## Ignore spelling mistakes

If you don't want to use the Bing Search API v7 service, you need to add the correct and incorrect spelling.

Two solutions are:

* Label example utterances that have the all the different spellings so that LUIS can learn proper spelling as well as typos. This option requires more labeling effort than using a spell checker.
* Create a phrase list with all variations of the word. With this solution, you do not need to label the word variations in the example utterances.


> [!div class="nextstepaction"]
> [Learn more about example utterances](./luis-how-to-add-entities.md)
