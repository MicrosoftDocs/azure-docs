---
title: Find region with C# in Language Understanding (LUIS) boundaries | Microsoft Docs
titleSuffix: Programmatically find region when subscription key and application ID for LUIS.
description: This article contains known limits of LUIS.
services: cognitive-services
author: v-geberr
manager: kamran.iqbal
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 05/31/2018
ms.author: v-geberr
---
# Region can be determined from API call 
The three main pieces of data for a LUIS endpoint request are the endpoint subscription key, the LUIS app ID, and the host region the app is published. The host region can be determined from the subscription key and the LUIS app ID. 

## LUIS endpoint query strategy
The LUIS HTTPS endpoint query requires:

* A correct endpoint subscription key with existing quota.
* A LUIS app ID.
* A correct host region where app is published.

 If the LUIS HTTPS endpoint query uses the the correct subscription key, and app ID but uses the _wrong_ host region, LUIS responds with a 4xx and is not counted toward the subscription quota.

|Response code|Parameters|
|--|--|
|2xx LUIS query response|correct subscription key<br>correct app ID<br>correct host region|
|4xx LUIS query response|correct subscription key<br>correct app ID<br>_incorrect_ host region|

Knowing how LUIS will respond for correct and incorrect regions allows us to poll all the regions, looking for 2xx as the response. When a 2xx region is found, capture that region and use it for all endpoint queries moving forward.

## When to use this strategy
If your LUIS apps are not created dynamically, use this strategy when the client application starts because every 2xx successful call will count against your subscription quote. 

If your LUIS app is created dynamically so that your LUIS app Id and subscription key change often, use this on startup and polled periodically. 

## C# class code to find region
The console application takes the LUIS app id and the subscription key and returns all regions associated with it. Currently, a subscription key is associated with a region so only one region should return.

Include the .Net library dependencies:

/// top using

Replace the variable values for `luisAppId` and `luisSubscriptionKey` with your own values. 

/// insert code snippet here

This is an example of calling the class:

/// insert code snippet here



