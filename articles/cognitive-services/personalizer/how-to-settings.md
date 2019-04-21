---
title: Configure settings
titleSuffix: Personalizer - Azure Cognitive Services
description: Service configuration includes how the service treats rewards, how often the service explores, how often the model is retrained, and how much data is stored.
services: cognitive-services
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: overview
ms.date: 05/07/2019
ms.author: edjez
#Customer intent: 

---
# Personalizer settings

Service configuration includes how the service treats rewards, how often the service explores, how often the model is retrained, and how much data is stored.

## Rewards

The following settings allow you to control the rewards:

**Reward wait time**: Sets the length of time during which Personalizer will collect reward values for a Rank call, starting from the moment the Rank call happens. This value is set by asking: "How long should Personalizer wait for rewards calls?" Any reward arriving after this window will be logged but not used for learning.

**Default reward**: If no reward call is received by Personalizer during the Reward Wait Time window associated to a Rank call, Personalizer will assign the Default Reward. By default, and in most scenarios, the Default Reward is zero.

**Reward aggregation**: If within the Reward Wait Time multiple calls are made to the Reward API using the same eventId, Personalizer needs to aggregate each call's score into one single Reward to be used for learning. Aggregations options are:
* *Sum*: Adds all the scores received.
* *Earliest*: Picks the earliest score received and discards the rest (very useful if you want to unique possible duplicate calls).

## Exploration

**Percentage of calls to use for exploration**: Sets the percentage of Rank calls that will be used for exploration. <!--[Read more about exploration](concepts-exploration.md) for guidance on how to choose a value.-->


## Model export

**Model export frequency**: Sets how often a new Personalizer model is exported so it can be used to predict user behavior. 


## Data retention

**Data retention period**: Sets for how many days Personalizer will keep data logs. Past data logs are required to perform offline evaluations<!--[offline evaluations](concepts-offline-evaluation.md)--> that are used to measure the effectiveness of Personalizer and optimize Learning Policy.

## Next steps

[How to use the Personalizer container](https://go.microsoft.com/fwlink/?linkid=2083923&clcid=0x409)
