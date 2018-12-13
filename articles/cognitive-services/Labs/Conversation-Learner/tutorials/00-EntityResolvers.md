---
title: Entity Resolvers in a Conversation Learner model - Microsoft Cognitive Services| Microsoft Docs
titleSuffix: Azure
description: Learn how to use Entity Respovers in Conversation Learner.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.component: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
---

# Entity Resolvers

This tutorial shows how to use Entity Resolvers in Conversation Learner

## Video

[![Tutorial 2 Preview](https://aka.ms/cl-tutorial-02-preview)](https://aka.ms/blis-tutorial-02)

## Requirements
This tutorial requires that the general tutorial bot is running

	npm run tutorial-general

## Details

- *** TODO ***
- More: TODO
- More: TODO

## Steps

### Create a new Model

1. In the Web UI, click the "New Model" button.
2. In the "Name" field, type "Entity Resolvers", hit enter or click the "Create" button.

### Create a pair of Entities

1. On the left panel, click "Entities", then the "New Entity" button.
2. In the "Entity Name" field, type "departure".
3. In the "Resolver Type" drop down, select "datetimeV2".
4. Click the "Create" button.
5. Click the "OK" button after you read the popup warning.
6. Following the same steps, create another Entity named "return" that also has a "datetimeV2" resolver type.

### Create an Action
