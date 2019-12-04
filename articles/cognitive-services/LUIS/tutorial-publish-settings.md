---
title: "Tutorial: Publish settings - LUIS"
titleSuffix: Azure Cognitive Services
description: In this tutorial, change the publish settings to gain improve predictions.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: tutorial
ms.date: 12/03/2019
ms.author: diberry
#Customer intent: As a new user, I want to understand hwo publishing settings impact the LUIS app.

---

# Tutorial:  Add sentiment analysis as a publishing setting

In this tutorial, modify the publishing settings to extract sentiment analysis then query the LUIS endpoint to understand publishing settings.

**In this tutorial, you learn how to:**

<!-- green checkmark -->
> [!div class="checklist"]
> * Add sentiment analysis as publish setting
> * Get sentiment of utterance from endpoint

[!INCLUDE [LUIS Free account](../../../includes/cognitive-services-luis-free-key-short.md)]

## Sentiment analysis is a publish setting

The following utterances show examples of sentiment:

|Sentiment|Score|Utterance|
|:--|:--|:--|
|positive|0.91 |John W. Smith did a great job on the presentation in Paris.|
|positive|0.84 |The Seattle engineers did fabulous work on the Parker sales pitch.|

Sentiment analysis is a publish setting that applies to every utterance. Once set, your app returns the sentiment of an utterance without you having to labeling data\.

Because it is a publish setting, you do not see it on the intents or entities pages. You can see it in the [interactive test](luis-interactive-test.md#view-sentiment-results) pane or when testing at the endpoint URL.

## Import example .json to begin app

1.  Download and save the [app JSON file](https://github.com/Azure-Samples/cognitive-services-language-understanding/blob/master/documentation-samples/tutorials/machine-learned-entity/pizza-tutorial-with-entities.json).

[!INCLUDE [Import app steps](includes/import-app-steps.md)]

## Train the app

[!INCLUDE [LUIS How to Train steps](includes/howto-train.md)]

## Configure app to include sentiment analysis

1. Select **Publish** from the top menu. Sentiment analysis is a publishing setting.

1. Select **Production slot** then select **Change settings**.
1. Set the Sentiment Analysis setting to **On**.

    ![Turn on Sentiment Analysis as publishing setting](./media/luis-quickstart-intent-and-sentiment-analysis/select-sentiment-publishing-setting.png)

## Get the sentiment of an utterance from the endpoint

1. [!INCLUDE [LUIS How to get endpoint first step](../../../includes/cognitive-services-luis-tutorial-how-to-get-endpoint.md)]

1. Go to the end of the URL in the address and enter the following utterance:

    `Deliver 2 of the best cheese pizzas ever!!!`

    The last querystring parameter is `query`, the utterance **query**. This utterance is not the same as any of the labeled utterances so it is a good test and should return the `EmployeeFeedback` intent with the sentiment analysis extracted.

    ```json
    {
      "query": "Jill Jones work with the media team on the public portal was amazing",
      "topScoringIntent": {
        "intent": "EmployeeFeedback",
        "score": 0.9616192
      },
      "intents": [
        {
          "intent": "EmployeeFeedback",
          "score": 0.9616192
        },
        {
          "intent": "None",
          "score": 0.09347677
        }
      ],
      "entities": [
        {
          "entity": "jill jones",
          "type": "builtin.personName",
          "startIndex": 0,
          "endIndex": 9
        }
      ],
      "sentimentAnalysis": {
        "label": "positive",
        "score": 0.8694164
      }
    }
    ```

    The sentimentAnalysis is positive with a score of 86%.

    Try another utterance by removing the value for `q` in the address bar of the browser: `William Jones did a terrible job presenting his ideas.` The sentiment score indicates a negative sentiment by returning a low score `0.18597582`.

## Clean up resources

[!INCLUDE [LUIS How to clean up resources](../../../includes/cognitive-services-luis-tutorial-how-to-clean-up-resources.md)]

## Related information

* Sentiment analysis is provided by Cognitive Service [Text Analytics](../Text-Analytics/index.yml). The feature is restricted to Text Analytics [supported languages](luis-language-support.md##languages-supported).
* [How to train](luis-how-to-train.md)
* [How to publish](luis-how-to-publish-app.md)
* [How to test in LUIS portal](luis-interactive-test.md)


## Next steps
This tutorial adds sentiment analysis as a publish setting to extract sentiment values from the utterance as a whole.

> [!div class="nextstepaction"]
> [Review endpoint utterances in the HR app](luis-tutorial-review-endpoint-utterances.md)

