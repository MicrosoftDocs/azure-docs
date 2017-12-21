---
title: Enhance LUIS understanding of synonyms with a phrase list  | Microsoft Docs 
description: Learn how to add a phrase list to a LUIS app and see the improvement of the score.
services: cognitive-services
author: v-geberr
manager: kamran.iqbal

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 12/21/2017
ms.author: v-geberr
---

# Enhance LUIS understanding of synonyms with a phrase list 
Improve accuracy of intent score and identify entities for words that have the same meaning by adding an interchangeable **[phrase list feature](./luis-concept-feature.md)**.

## Import new app
1. Download [example LUIS app model file][LuisSampleApp] designed for this tutorial. Remember where the file is. You will need it in the next step. 

2. [Import](Create-new-app.md#import-new-app) the file you just downloaded into [www.LUIS.ai][www.luis.ai] as a new app. The app name is "My Phrase List tutorial". This app has intents, entities, and utterances.

3. [Train]() your app. You cannot [interactively test](Train-Test.md#interactive-testing) your app in [www.LUIS.ai][www.luis.ai] until the app is trained. 

4. [Publish](PublishApp.md) the app. Publishing the app allows you to test using the HTTPS endpoint. 

> [!TIP]
> * [Interactive testing](Train-Test.md#interactive-testing) allows you to compare the published model to any trained changes made after you published. 
> * [Endpoint testing](PublishApp.md#test-your-published-endpoint-in-a-browser) allows you to see exactly what your user or bot sees. 

## Test a trained utterance
Use the published endpoint to query an utterance the app already knows. Because LUIS already knows about the utterance, the score is high and the entity is detected.

1. In [www.LUIS.ai][www.luis.ai], on the **Publish** page for the new app, click on the endpoint URL in the **Resources and Keys** section. 

    ![Publish endpoint url](./media/luis-tutorial-interchangeable-phrase-list/luis-publish-url.png)

2. In the browser, add the following query after the `q=` at the end of the URL.

    `I want a computer replacement`

    The endpoint responds with the following JSON:
    
    ```JSON
    {
      "query": "I want a computer replacement",
      "topScoringIntent": {
        "intent": "GetHardware",
        "score": 0.9735458
      },
      "intents": [
        {
          "intent": "GetHardware",
          "score": 0.9735458
        },
        {
          "intent": "None",
          "score": 0.07053033
        },
        {
          "intent": "Whois",
          "score": 0.03760778
        },
        {
          "intent": "CheckCalendar",
          "score": 0.02285902
        },
        {
          "intent": "CheckInventory",
          "score": 0.0110072717
        }
      ],
      "entities": [
        {
          "entity": "computer",
          "type": "Hardware",
          "startIndex": 9,
          "endIndex": 16,
          "score": 0.8465915
        }
      ]
    }
    ```

    The intent score of 0.973 and the entity detection of 0.846 is high because the app was trained with this utterance. This utterance is in the LUIS app on the intent page for **GetHardware**. The utterance's text of `computer` is labeled as the **Hardware** entity. 
    
    |status|word| intent score | entity score |
    |--|--|--|--|
    |trained| want | 0.973 | 0.846 |
    
    
## Test an untrained utterance
In the browser, use the same published endpoint to query with an utterance the app doesn't know about:

`I require a computer replacement`

This utterance uses a synonym of the previous utterance:

| trained word | untrained synonym |
|--|--|
| want | require |

The endpoint response is:

```JSON
{
  "query": "I require a computer replacement",
  "topScoringIntent": {
    "intent": "GetHardware",
    "score": 0.840912163
  },
  "intents": [
    {
      "intent": "GetHardware",
      "score": 0.840912163
    },
    {
      "intent": "None",
      "score": 0.0972757638
    },
    {
      "intent": "Whois",
      "score": 0.0448251367
    },
    {
      "intent": "CheckCalendar",
      "score": 0.0291390456
    },
    {
      "intent": "CheckInventory",
      "score": 0.0137837809
    }
  ],
  "entities": []
}
```

| status | word | intent score | entity score |
|--|--|--|--|
| trained| want | 0.973 | 0.846 |
| untrained| require | 0.840 | - |

The untrained utterance intent score is lower than the labeled utterance because LUIS knows the sentence is grammatically the same but LUIS doesn't know the utterances have the same meaning. Also, without the phrase list, the entity of **hardware** is not found.

Since a word can have more than one meaning, you need to tell LUIS that want and require mean the same thing in this app domain. 

## Improve score of untrained utterance with phrase list 
1. Add a [phrase list](Add-Features.md) feature named **want** with the value of `want`. 

2. Click on **Recommend** to see what words LUIS recommends. 

3. Add all the words. If `require` is not in the recommended list, add it as a required value. 

4. Keep the setting of interchangeable because these words are synonyms. Click **save**.

    ![Phrase list values](./media/luis-tutorial-interchangeable-phrase-list/phrase-list-values.png)

5. Train the app but don't publish it. 

## Compare phrase list model to published model
In this app, the published model is not trained with the synonyms. Only the currently edited model includes the phrase list of synonyms. Use [interactive testing](Train-Test.md#interactive-testing) to compare the differences. 

1. Open the test pane and enter the utterance:

    `I require a computer replacement`

2. Click on **Inspect** to open the inspection panel. 

    ![Click on inspect](./media/luis-tutorial-interchangeable-phrase-list/inspect-button.png)

3. Click on **Compare with published** to compare the published model to the new phrase list model.

    ![Inspect Published versus current](./media/luis-tutorial-interchangeable-phrase-list/inspect.png)

After adding the phrase list, the accuracy increased for the utterance and the entity of hardware is found. 

|status | phrase list| intent score | entity score |
|--|--|--|--|
| published | - | 0.84 | - |
| currently editing |✔| 0.92 | Hardware entity identified |

## Get entity score with endpoint test
To see the entity score, [publish](PublishApp.md) the model and query the endpoint. 

`I require a computer replacement`

```JSON
{
  "query": "I require a computer replacement",
  "topScoringIntent": {
    "intent": "GetHardware",
    "score": 0.916503668
  },
  "intents": [
    {
      "intent": "GetHardware",
      "score": 0.916503668
    },
    {
      "intent": "None",
      "score": 0.136505231
    },
    {
      "intent": "Whois",
      "score": 0.02778677
    },
    {
      "intent": "CheckInventory",
      "score": 0.0144592477
    },
    {
      "intent": "CheckCalendar",
      "score": 0.01401332
    }
  ],
  "entities": [
    {
      "entity": "computer",
      "type": "Hardware",
      "startIndex": 12,
      "endIndex": 19,
      "score": 0.5959917
    }
  ]
}
```

The entity **Hardware** shows a score of 0.595 with the phrase list. Before the phrase list, the entity was not detected. 

|status | phrase list| intent score | entity score |
|--|--|--|--|
| published | - | 0.84 | - |
| currently editing |✔| 0.92 | 0.595 |

  [www.luis.ai]:https://www.luis.ai
  [LuisFeatures]: luis-concept-feature.md
  [LuisSampleApp]:https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/phrase_list/interchangeable/luis-app-before-phrase-list.json