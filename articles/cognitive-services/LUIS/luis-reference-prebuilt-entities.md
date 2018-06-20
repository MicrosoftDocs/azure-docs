---
title: LUIS Prebuilt entities reference | Microsoft Docs
description: This article contains lists of the prebuilt entities that are included in Language Understanding (LUIS).
services: cognitive-services
author: v-geberr
manager: kaiqb
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 06/20/2017
ms.author: v-geberr
---

# Prebuilt entities reference

Language Understanding (LUIS) provides prebuilt entities. When a prebuilt entity is included in your application, LUIS includes the corresponding entity prediction in the endpoint response. All example utterances are also labeled with the entity. The behavior of prebuilt entities **can't** be modified. Unless otherwise noted, prebuilt entities are available in all LUIS application locales (cultures). The following table shows the prebuilt entities that are supported for each culture.

> [!NOTE]
> **builtin.datetime** is deprecated. It is replaced by [**built-in.datetimeV2**](#builtindatetimeV2), which provides recognition of date and time ranges, as well as improved recognition of ambiguous dates and times.

Prebuilt entity   |   ```En-us```   |   ```fr-FR```   |   ```it-IT```   |   ```es-ES```   |   ```zh-CN```   |   ```de-DE```   |   ```pt-BR```   |   ```ja-JP```   |   ```ko-kr```   | ```fr-CA```   |   ```es-MX```   |   ```nl-NL```   |
------|:------:|------|------|------|------|------|------|------|------|------|------|------|
DatetimeV2   |    ✔   |   ✔   |   -   |   ✔   |    ✔   |   `*`   |   ✔   |   -   |   -   |   -   |   -   |   -   |
Number   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |   -   |   -   |   -   |   -   |
Ordinal   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |   -   |   -   |   -   |   -   |
Percentage   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |   -   |   -   |   -   |   -   |
Temperature   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |   -   |   -   |   -   |   -   |
Dimension   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |   -   |   -   |   -   |   -   |
Money   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |   -   |   -   |   -   |   -   |
Age   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |   -   |   -   |   -   |   -   |
URL   |    ✔   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |
Email   |    ✔   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |
Phone number   |    ✔   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |

`*` = coming soon

See notes on [Deprecated prebuilt entities](luis-reference-prebuilt-deprecated.md)

## Examples of prebuilt entities
The following table lists prebuilt entities with example utterances and their return values.

Prebuilt entity   |   Example utterance   |   JSON
------|------|------|
 ```builtin.number```     |  ```ten```   |``` { "type": "builtin.number", "entity": "ten" } ```|
 ```builtin.number```     |   ```3.1415```   |```  { "type": "builtin.number", "entity": "3 . 1415" }``` |
 ```builtin.ordinal```     |   ```first```   |```{ "type": "builtin.ordinal", "entity": "first" }``` |
 ```builtin.ordinal```     |   ```10th```   | ```{ "type": "builtin.ordinal", "entity": "10th" }``` |  
 ```builtin.temperature```     |   ```10 degrees celsius```   | ```{ "type": "builtin.temperature", "entity": "10 degrees celcius" }```|   
 ```builtin.temperature```     |   ```78 F```   |```{ "type": "builtin.temperature", "entity": "78 f" }```|
 ```builtin.dimension```     |   ```2 miles```   |```{ "type": "builtin.dimension", "entity": "2 miles" }```|
 ```builtin.dimension```     |  ```650 square kilometers```   |```{ "type": "builtin.dimension", "entity": "650 square kilometers" }```|
 ```builtin.money```     |   ```1000.00 US dollars```   |```{ "type": "builtin.money", "entity": "1000.00 us dollars" }```
 ```builtin.money```     |   ```$ 67.5 B```   |```{ "type": "builtin.money", "entity": "$ 67.5" }```|
 ```builtin.age```   |   ```100 year old```   |```{ "type": "builtin.age", "entity": "100 year old" }```|  
 ```builtin.age```   |   ```19 years old```   |```{ "type": "builtin.age", "entity": "19 years old" }```|
 ```builtin.percentage```   |   ```The stock price increase by 7 $ this year```   |```{ "type": "builtin.percentage", "entity": "7 %" }```|
 ```builtin.datetimeV2``` | See [builtin.datetimeV2](#builtindatetimev2) | See [builtin.datetimeV2](#builtindatetimev2) |
 ```*builtin.datetime``` | See [builtin.datetime](#builtindatetime) | See [builtin.datetime](#builtindatetime) |
 ```*builtin.geography``` | See separate table | See separate table following this table |
 ```*builtin.encyclopedia``` | See separate table | See separate table following this table |
 
*These entity types listed encompass multiple subtypes. These entities are covered later in this article.
