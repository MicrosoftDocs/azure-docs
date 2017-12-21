---
title: Improve accuracy with an interchangeable phrase list| Microsoft Docs 
description: Learn how to add a phrase list to a LUIS app and see the improvement of the score.
services: cognitive-services
author: v-geberr
manager: kamran.iqbal

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 12/20/2017
ms.author: v-geberr
---

# Add an interchangeable phrase list 
Add a phrase list to improve accuracy of intent and entity prediction of synonymous words.

The **[Phrase list feature](./luis-concept-feature.md)** helps your app by providing semantically related words. Marking the values of a phrase list as interchangeable tells LUIS the extra information to treat the words as synonyms.

Without phrase lists, LUIS provides syntactic analysis, which analyzes utterances based on its __*grammatical structure*__.
With phrase lists, LUIS adds semantic analysis, which refers to the word's  __*meaning*__.

## Prerequisite

> [!div class="checklist"]
> * [Hardware requisition app](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/phrase_list/interchangeable/luis-app-before-phrase-list.json). Import this app. Its name in the app list is **Phrase Lists**. Train and publish the app.  

## Score trained utterance
Use the published endpoint to query with an utterance the app knows about:

`I want a computer replacement`

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

|| intent score | entity score |
|--|--|--|
|trained | 0.973 | 0.846 |

You expect the intent score of 0.973 and the entity detection of 0.846 to be high because the app was trained with this utterance. You can see this utterance in the LUIS app on the intent page for **GetHardware**. The utterance's text of `computer` is labeled as the **Hardware** entity. 

## Score an untrained utterance
Use the published endpoint to query with an utterance that the app doesn't know about:

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

|| intent score | entity score |
|--|--|--|
| trained | 0.973 | 0.846 |
| untrained | 0.840 | - |

The untrained utterance score is lower than the labeled utterance because LUIS provides syntactic analysis, which analyzes utterances based on its __*grammatical structure*__ but doesn't know about the semantic meaning of the word yet. Since words can have more than one meaning, you need to tell LUIS what meaning your app gives to a word. 

## Add phrase list 
Add a [phrase list](Add-Features.md) feature named **want** with the value of `want`. Click on **Recommend** to see what words LUIS recommends. Add all the words. If `require` is not in the recommended list, add it as a required value. Keep the setting of interchangeable because these words are synonyms. Click **save**.

![Phrase list values](./media/luis-tutorial-interchangeable-phrase-list/phrase-list-values.png)

Train the app but don't publish it. 

In this app, the published model is not trained with the synonyms. Only the currently edited model includes the phrase list of synonyms. Use [interactive testing](Train-Test.md#interactive-testing) to compare the differences. 

![Inspect Published versus current](./media/luis-tutorial-interchangeable-phrase-list/inspect.png)

After adding the phrase list, the accuracy increased for the utterance.

|| intent score | entity score |
|--|--|--|
| published - no phrase list| 0.84 | - |
| currently editing - includes phrase list | 0.92 | Hardware entity identified |

To see the entity score, [publish](PublishApp.md) the model and query the endpoint. 

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


  [LuisFeatures]: luis-concept-feature.md