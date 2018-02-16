---
title: Understand data extraction concepts in LUIS - Azure | Microsoft Docs
description: Learn what kind of data can be extracted from Language Understanding (LUIS)
services: cognitive-services
author: v-geberr
manager: kamran.iqbal

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 02/16/2018
ms.author: v-geberr;
---

## Data extraction
LUIS gives you the ability to get information from a user's natural language utterances. The information is extracted in a way that it can be used by a program, application, or chat bot to take some action.

## Data location
LUIS provides the data from the published endpoint.

The HTTPS request (POST or GET) contains the utterance as well as some optional configurations such as staging or production environments.

The response contains all the information LUIS can determine based on the current published model at either the staging or production endpoint. 

## Data from intents
The primary, required data is the top scoring **intent name**. If you have the request parameter of verbose set to false using the `MyStore` [quickstart](luis-quickstart-intents-only.md), the response is:

```JSON
{
  "query": "when do you open next?",
  "topScoringIntent": {
    "intent": "GetStoreInfo",
    "score": 0.984749258
  },
  "entities": []
}
```

|Data Object|Data Type|Data Location|Value|
|--|--|--|--|
|Intent|String|topScoringIntent.intent|"GetStoreInfo"|

If your chat bot or LUIS-calling app makes a decision based on more than one intent score, return all the intents' scores. Use the request parameter of verbose set to true, the result follows:

```JSON
{
  "query": "when do you open next?",
  "topScoringIntent": {
    "intent": "GetStoreInfo",
    "score": 0.984749258
  },
  "intents": [
    {
      "intent": "GetStoreInfo",
      "score": 0.984749258
    },
    {
      "intent": "None",
      "score": 0.2040639
    }
  ],
  "entities": []
}
```

The intents are ordered from highest to lowest score.

|Data Object|Data Type|Data Location|Value|
|--|--|--|--|
|Intent|String|intents[0].intent|"GetStoreInfo"|
|Intent|String|intents[1].intent|"None"|

If you add prebuilt domains, the intent name indicates the domain, such as `Utilties` or `Communication` as well as the intent:

```JSON
{
  "query": "Turn on the lights next monday at 9am",
  "topScoringIntent": {
    "intent": "Utilities.ShowNext",
    "score": 0.07842206
  },
  "intents": [
    {
      "intent": "Utilities.ShowNext",
      "score": 0.07842206
    },
    {
      "intent": "Communication.StartOver",
      "score": 0.0239675418
    },
    {
      "intent": "None",
      "score": 0.0168218873
    }],
  "entities": []
}
```
    
|Domain|Data Object|Data Type|Data Location|Value|
|--|--|--|--|--|
|Utilities|Intent|String|intents[0].intent|"Utilities.ShowNext"|
|Communication|Intent|String|intents[1].intent|"Communication.StartOver"|
||Intent|String|intents[2].intent|"None"|


## Data from entities
Most chat bots and applications need more than the intent name. This additional, optional data comes from entities discovered in the utterance. 

Each type of entity returns different information about the match. 

A single word or phrase in an utterance can match more than one entity. In that case, each matching entity is returned with its score. 

All entities are returned in the **entities** array of the response from the endpoint:

```JSON
"entities": [
    {
      "entity": "bob jones",
      "type": "Name",
      "startIndex": 0,
      "endIndex": 8,
      "score": 0.473899543
    },
    {
      "entity": "3",
      "type": "builtin.number",
      "startIndex": 16,
      "endIndex": 16,
      "resolution": {
        "value": "3"
      }
    }
  ]
```

## Simple entity data

A simple entity is a machine-learned value. It can be a word or phrase. 

`Bob Jones wants 3 meatball pho`

In the previous utterance, `Bob Jones` is labeled as a `Name` entity.

The data returned from the endpoint includes the entity name, the discovered text from the utterance, the location of the discovered text, and the score:

```JSON
{
    "entity": "bob jones",
    "type": "Name",
    "startIndex": 0,
    "endIndex": 8,
    "score": 0.473899543
}
```

|Data object|Entity name|Value|
|--|--|--|
|Simple Entity|"Name"|"bob jones"|

## Hierarchical entity data

Hierarchical entities are machine-learned and can include a word or phrase. 

`get me a hamburger with no onion`

In the previous utterance, `hamburger` is labeled a child of the `burger` hierarchical entity. 

The data returned from the endpoint includes the entity name and child name, the discovered text from the utterance, the location of the discovered text, and the score: 

```JSON
{
    "entity": "hamburger",
    "type": "Burger::Hamburger",
    "startIndex": 9,
    "endIndex": 17,
    "score": 0.9373795
}
```

|Data object|Entity name|Value|
|--|--|--|
|Hierarchical Entity|"Burger::Hamburger"|"hamburger"|

## Composite entity data
<!-- this example isn't quite right - I need to talk to Carol -->
<!-- used Denise Mak's Foodtruck example in github.com/Microsoft/LUIS-Sample/examples -->
Composite entities are machine-learned and can include a word or phrase.

`get me 5 hamburgers`

In the previous utterance, `5` is a prebuilt number and `hamburgers` is a hierarchical entity named Burger with three children: Cheeseburger, Hamburger, and VeggieBurger. A composite entity named `BurgerOrder` contains two children of number and Burger.

```
BurgerOrder:
    number
    Burger:
        Cheeseburger
        Hamburger
        VeggieBurger
```    

The data returned from the endpoint includes the entity name and child entities, the discovered text from the utterance, the location of the discovered text, and the score: 
<!-- why doesn't the child entity Burger::Hamburger get returned, instead of the parent Burger -->
```JSON
"compositeEntities": [{
    "parentType": "BurgerOrder",
    "value": "5 hamburgers",
    "children": [
    {
        "type": "builtin.number",
        "value": "5"
    },
    {
        "type": "Burger",
        "value": "hamburgers"
    }
    ]
}]
```

|Data object|Entity name|Value|
|--|--|--|
|Prebuilt Entity - number|"builtin.number"|"5"|
|Hierarchical Entity - Burger|"Burger"|"hamburgers"|

## List entity data

A list entity is not machine-learned but is a text match. A list represents items in the list along with synonyms for those items. LUIS marks any match to an item in any list as an entity in the response. A synonym can be in more than list. 

Suppose the app has a list, named **Colors**, matching variations of a color to a main color name. 

|List item|Item synonyms|
|---|---|
|Blue|blu, bl, azure, cobalt, robin's egg|
|Yellow|gold, lemon, mustard|

`5 mustard rainboots please`

In the previous utterance, the word `mustard` is mapped to the color yellow as part of the color entity.

```JSON
    {
      "entity": "mustard",
      "type": "Colors",
      "startIndex": 2,
      "endIndex": 8,
      "resolution": {
        "values": [
          "Yellow"
        ]
      }
    }
```

|Data object|Entity name|Item name|Value|
|--|--|--|--|
|List Entity|Color|"Yellow"|"mustard"|

Because this entity is not machine-learned, there is no score. 

## Next steps

See [Add entities](Add-entities.md) to learn more about how to add entities to your LUIS app.
