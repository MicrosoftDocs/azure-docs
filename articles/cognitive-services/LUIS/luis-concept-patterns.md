---
title: Learn how Patterns increase prediction accuracy | Microsoft Docs 
titleSuffix: Azure
description: Learn how to design patterns to increase intent prediction scores and find entities.
services: cognitive-services
author: v-geberr
manager: kaiqb

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 05/07/2018
ms.author: v-geberr
---
# Patterns improve prediction accuracy
Patterns are designed to improve accuracy when an utterance has the same words but in a different order. By providing a pattern for the utterance, LUIS can have a high confidence in the prediction. 

## Patterns solve low intent confidence
Consider a Human Resources app that reports on the organizational chart in relation to an employee. Given an employee's name and relationship, LUIS returns the employees involved. Consider an employee, Tom, with a manager name Alice, and a team of subordinates named: Michael, Rebecca, and Carl.

Tom reports to Alice
Michael, Rebecca, and Carl report to Tom

`Who is Tom's subordinate?" GetOrgChart (.30)
'Who is the subordinate of Tom?' (.30)

`Who manages Tom?` (.30)
`Who does Tom manage?` (.30)

If an app has between 10 and 20 utterances with different lengths of sentence, different word order, and even different words (synonyms of subordinate, manage, report, LUIS may return a low confidence score. In order to help LUIS understand the importance of the word order, create a pattern. 

## Patterns solve missed entity detection
A second issue is that LUIS doesn't find the employee name in the utterance, to return in an entity. 

## Prediction scores with and without patterns
Given enough example utterances, LUIS would be able to increase prediction confidence without patterns. Patterns increase the confidence score and find the entity without having to provide as many utterances as without using patterns.  

## Pattern syntax
A pattern is an utterance on the **Patterns** page or in the patterns array in the app definition file along with the intent: 

```JSON
"patterns": [
    {
      "text": "pack office from {Location:Origin} to {Location:Destination}",
      "intent": "OfficeMove"
    },
    {
      "text": "move {Employee} from {Location:Origin} to {Location:Destination}",
      "intent": "OfficeMove"
    },
    {
      "text": "setup new office for {Employee} at {Location:Destination}",
      "intent": "OfficeMove"
    }
  ],
```

## Entity detection
When LUIS is highly confident with an intent prediction, then it finds the entity too. The entity is entered into the utterance using the "{" and "}" characters. The entity can be any type: custom, prebuilt, or Pattern.any. The entity can include Role notation of {entity:role} such as "{Location:Origin}". 

## Best practices
Do not create a pattern when you first create the app. Give LUIS the opportunity to learn from the provided utterances before adding patterns.
 
## Next steps

Use the v2 API documentation to update existing REST calls to LIUS [endpoint](https://aka.ms/luis-endpoint-apis) and [authoring](https://aka.ms/luis-authoring-apis) APIs. 

[LUIS]: luis-reference-regions.md