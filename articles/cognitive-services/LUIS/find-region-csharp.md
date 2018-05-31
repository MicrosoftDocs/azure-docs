---
title: Find LUIS region with C# in Language Understanding (LUIS) boundaries | Microsoft Docs
description: Programmatically find publish region when subscription key and application ID for LUIS.
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
If you have the LUIS app ID and the LUIS subscription ID, you can use LUIS to find which region to use for endpoint queries.

> [!NOTE] 
> The complete C# solution is available from the [**LUIS-Samples** Github repository](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/find-region/csharp/).

## LUIS endpoint query strategy
The LUIS endpoint query requires:

* A correct endpoint subscription key with existing quota.
* A LUIS app ID.
* A correct host region where app is published.

If the LUIS endpoint query uses the correct subscription key and app ID but the wrong region, the response code is 401. The 401 request is not counted toward the subscription quota. Turn this request into a strategy to poll all regions to find the correct region. The correct region is the only request of all the regions queried that returns a 2xx status code. 

|Response code|Parameters|
|--|--|
|2xx LUIS query response|correct subscription key<br>correct app ID<br>correct host region|
|4xx LUIS query response|correct subscription key<br>correct app ID<br>_incorrect_ host region|

Knowing how LUIS responds for correct and incorrect regions provides a way to poll all the regions, looking for 2xx as the response. When a 2xx region is found, capture that region and use it for all endpoint queries.

## When to use this strategy
If your LUIS apps are not created dynamically, use this strategy when the client application starts because every 2xx successful call counts against your subscription quote. 

## C# class code to find region
The console application takes the LUIS app ID and the subscription key and returns all regions associated with it. Currently, a subscription key is created by region so only one region should return.

Include the .Net library dependencies:

[!code-csharp[Add the dependencies](~/samples-luis/documentation-samples/find-region/csharp/ConsoleAppLUISRegion/Program.cs?range=1-6 "Add the dependencies")]

Add the LUIS class. Replace the variable values for `luisAppId` and `luisSubscriptionKey` with your own values. 

[!code-csharp[Add the LUIS class](~/samples-luis/documentation-samples/find-region/csharp/ConsoleAppLUISRegion/Program.cs?range=10-83 "Add the LUIS class")]

This is an example of calling the class:

[!code-csharp[Call the LUIS class](~/samples-luis/documentation-samples/find-region/csharp/ConsoleAppLUISRegion/Program.cs?range=85-101 "Call the LUIS class")]



