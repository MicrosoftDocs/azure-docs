---
title: Find endpoint region with C# in LUIS
titleSuffix: Azure Cognitive Services
description: Programmatically find publish region with endpoint key and application ID for LUIS.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/06/2018
ms.author: diberry
---
# Find endpoint region with C# 
If you have the LUIS app ID and the LUIS subscription ID, you can find which region to use for endpoint queries.

> [!NOTE] 
> The complete C# solution is available from the [**LUIS-Samples** Github repository](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/find-region/csharp/).

## LUIS endpoint query strategy
Each LUIS endpoint query requires:

* An endpoint key
* An app ID
* A region

If the LUIS endpoint query uses the correct endpoint key and app ID but the wrong region, the response code is 401. The 401 request is not counted toward the subscription quota. Turn this request into a strategy to poll all regions to find the correct region. The correct region is the only request that returns a 2xx status code. 

|Response code|Parameters|
|--|--|
|2xx|correct endpoint key<br>correct app ID<br>correct host region|
|401|correct endpoint key<br>correct app ID<br>_incorrect_ host region|

## C# class code to find region
The console application takes the LUIS app ID and the endpoint key and returns all regions associated with it. Currently, an endpoint key is created by region so only one region should return.

Include the .Net library dependencies:

[!code-csharp[Add the dependencies](~/samples-luis/documentation-samples/find-region/csharp/ConsoleAppLUISRegion/Program.cs?range=1-6 "Add the dependencies")]

Add this custom LUIS class built to find the region. Replace the variable values for `luisAppId` and `luisSubscriptionKey` with your own values. All regions that return 401 will be written to the debug console. 

[!code-csharp[Add the LUIS class](~/samples-luis/documentation-samples/find-region/csharp/ConsoleAppLUISRegion/Program.cs?range=10-83 "Add the LUIS class")]

This is an example of calling the custom LUIS class in the console application's Main method:

[!code-csharp[Call the LUIS class](~/samples-luis/documentation-samples/find-region/csharp/ConsoleAppLUISRegion/Program.cs?range=85-101 "Call the LUIS class")]

When the application is run, the console shows the region for the app ID.

![Screenshot of console app showing LUIS region](./media/find-region-csharp/console.png)

## Next steps

Learn more about LUIS [regions](luis-reference-regions.md).
