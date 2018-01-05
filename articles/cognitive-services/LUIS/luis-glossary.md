---
title: Glossary for the Language Understanding (LUIS) API Service | Microsoft Docs
description: The glossary explains terms that you might encounter as you work with the LUIS API Service.
services: cognitive-services
author: v-geberr
manager: kamran.iqbal

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 01/05/2017
ms.author: v-geberr
---

# Glossary

## A

#### <a name="active-version"></a>Active version

The active LUIS version is the version that receives any changes to the model. In [LUIS.ai](https://www.luis.ai), if you want to make changes to a version that is not the active version, you need to first set that version as active. 

#### <a name="authoring"></a>Authoring

Authoring is the ability to create, manage and deploy a [LUIS app](#luis-app), either using the [LUIS website](https://www.luis.ai) or the [authoring APIs](https://aka.ms/luis-authoring-api). 

## B

## C

#### <a name="currently-editing"></a>Currently editing

Same as [active version](#active-version)

## D

## E

#### <a name="endpoint"></a>Endpoint

The [LUIS endpoint](https://aka.ms/luis-endpoint-apis) is where you submit LUIS queries after the [LUIS app](#luis-app) is authored and deployed. 

#### <a name="entity"></a>Entity

[Entities](luis-concept-entity-types.md) are important words in [utterances](luis-concept-utterance.md) that describe information relevant to the [intent](luis-concept-intent.md), and sometimes they are essential to it. An entity is essentially a datatype in LUIS. 

## F

#### <a name="features"></a>Features

In machine learning, a [feature](luis-concept-feature.md) is a distinguishing trait or attribute of data that your system observes.

## G

## H

## I

#### <a name="intent"></a>Intent

An [intent](luis-concept-intent.md) represents a task or action the user wants to perform. It is a purpose or goal expressed in a user's input, such as booking a flight, paying a bill, or finding a news article.  

## J

## K

## L

#### <a name="labeling"></a>Labeling

Labeling is the process of associating a word or phrase in an intent's [utterance](#utterance) with an [entity](#entity) (datatype). 

#### <a name="luis-app"></a>LUIS app

A LUIS app is a data model for natural language processing. 

## M

## N

## O

## P

#### <a name="phrase-list"></a>Phrase list

A [phrase list](luis-concept-feature.md#what-is-a-phrase-list-feature) includes a group of values (words or phrases) that belong to the same class and must be treated similarly (for example, names of cities or products). An interchangeable list is treated as synonyms. 

#### <a name="prebuilt-domains"></a>Prebuilt domain

A [prebuilt domain](luis-how-to-use-prebuilt-domains.md) is a LUIS app configured for a specific domain such as home automation (HomeAutomation) or restaurant reservations (RestaurantReservation). The intents, utterances, and entities are configured for this domain. 

#### <a name="prebuilt-entity"></a>Prebuilt entity

A [prebuilt entity](pre-builtentities.md) is an entity LUIS provides for common types of information. You can choose to add a prebuilt entity to your application. 

#### <a name="programmatic-key"></a>Programmatic key

The programmatic key is a [free tier (F0) key](https://aka.ms/luis-price-tier). 

#### <a name="publish"></a>Publish

Publishing means making a LUIS [active version](#active-version) available on either the staging or production [endpoint](#endpoint).  

## Q

#### <a name="quota"></a>Quota

LUIS quota is the limitation of the [Azure subscription tier](https://aka.ms/luis-price-tier). The LUIS quota is limited by both requests per second (HTTP Status 429) and total requests in a month (HTTP Status 403). 

## R

## S

#### <a name="starter-key"></a>Starter key

Same as [programmatic key](#programmatic-key).

#### <a name="subscription-key"></a>Subscription key

The subscription key is the key associated with the LUIS service [you created in Azure](azureibizasubscription.md). This key is not the free tier (programmatic key)[#programmatic-key]. If you have a subscription key, it should be used for any endpoint requests instead of the programmatic key. You can see your current subscription key inside the endpoint URL at the bottom of [**Publish App** page](publishapp.md) in [LUIS.ai](https://www.luis.ai). It is the value of **subscription-key** name/value pair. 

## T

#### <a name="test"></a>Test

[Testing](train-test.md#test-your-app) a LUIS app means passing an utterance to LUIS and viewing the JSON results.

#### <a name="train"></a>Train

Training is the process of teaching LUIS about any changes to the [active version](#active-version) since the last training.

## U

#### <a name="utterance"></a>Utterance

An utterance is a natural language phrase such as "book 2 tickets to Seattle next Tuesday".

## V

#### <a name="version"></a>Version

A LUIS [version](luis-how-to-manage-versions.md) is a specific data model associated with a LUIS app ID. Every LUIS app has at least one version.

## W

## X

## Y

## Z