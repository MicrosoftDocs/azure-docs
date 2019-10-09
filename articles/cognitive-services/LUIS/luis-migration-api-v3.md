---
title: V2 to V3 API migration  
titleSuffix: Azure Cognitive Services
description: The version 3 endpoint APIs have changed. Use this guide to understand how to migrate to version 3 endpoint APIs. 
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 10/08/2019
ms.author: diberry
---


# Migrate to version 3.x API for LUIS apps

The V3 APIs are significantly different from V2. Use this guide to understand how to migrate to version 3 APIs. 

Both [authoring](#authoring-apis) and [prediction](#prediction-apis) APIs change in V3.

## Authoring APIs

These authoring changes are available in both V2 and V3 authoring APIs, to support model decomposition:

* [Machine-learned entities](luis-migration-api-authoring.md#machine-learned-entities)
* [Descriptors](luis-migration-api-authoring.md#descriptors)
* [Constraints](luis-migration-api-authoring.md#constraints) 

## Prediction APIs


This V3 API provides the following new features, which include significant JSON request and/or response changes: 

* [External entities](luis-migration-api-v3-prediction.md#external-entities-passed-in-at-prediction-time)
* [Dynamic lists](luis-migration-api-v3-prediction.md#dynamic-lists-passed-in-at-prediction-time)
* [Prebuilt entity JSON changes](luis-migration-api-v3-prediction.md##prebuilt-entity-changes)
* [Prediction response object changes](luis-migration-api-v3-prediction.md#top-level-json-changes)
* [Entity role name references instead of entity name](luis-migration-api-v3-prediction.md#entity-role-name-instead-of-entity-name)
* [Properties to mark entities in utterances](luis-migration-api-v3-prediction.md#marking-placement-of-entities-in-utterances)

[Reference documentation](https://aka.ms/luis-api-v3) is available for V3.

## Features not supported

The following LUIS features are **not supported** in the V3 API:

* Bing Spell Check V7

## V2 API Deprecation 

The V2 prediction API will not be deprecated for at least 9 months after the V3 preview. 

## Next steps

Use the V3 API documentation to update existing REST calls to LUIS [endpoint](https://aka.ms/luis-api-v3) APIs. 
