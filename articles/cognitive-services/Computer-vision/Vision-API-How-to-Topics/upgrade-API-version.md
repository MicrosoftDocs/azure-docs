---
title: Upgrade to v3.0 of the Computer Vision API
titleSuffix: Azure Cognitive Services
description: Learn how to upgrade from v2.0 and v2.1 to v3.0 of the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: sample
ms.date: 08/11/2020
ms.author: pafarley
ms.custom: seodec18
---


# Upgrade to v3.0 of Computer Vision API from v2.0 and v2.1

This guide shows how to modify your existing code to migrate from v2.0 or v2.1 of Computer Vision API to v3.0. 

## Upgrade `Batch Read File`


1. Change the API path for `Batch Read File` 2.0 as follows 


|Read 2.x |Read 3.0  |
|----------|-----------|
|https://{endpoint}/vision/v2.0/read/core/asyncBatchAnalyze     |https://{endpoint}/vision/v3.0/read/analyze[?language]|

Language is a new optional parameter. If you do not know the language of your document, or it may be multilingual, don't include it. 

2. Change the API path for `Get Read Results` in 2.0 as follows:

|Read 2.x |Read 3.0  |
|----------|-----------|
|https://{endpoint}/vision/v2.0/read/operations/{operationId}     |https://{endpoint}/vision/v3.0/read/analyzeResults/{operationId}|

3. Change the code for checking the json results from `Get Read Operation Result`. When the call to `Get Read Operation Result` is successful, it returns a status string field in the json body. The following values from v2.0 have been changed to better align with the other Cognitive Service REST APIs. 
 
|Read 2.x |Read 3.0  |
|----------|-----------|
|“NotStarted” |	“notStarted”|
|“Running” | “running”|
|“Failed” | “failed”|
|“Succeeded” | “succeeded”|

4. Change your code to interpret the final recognition result json from `Get Read Operation Result.`. 

In 2.X, the output format is as follows: 


```json
{
    {
            "status": "Succeeded",
            "recognitionResults": [
                {
                "page": 1,
                "language": "en",
                "clockwiseOrientation": 349.59,
                "width": 2661,
                "height": 1901,
                "unit": "pixel",
                "lines": [
                    {
                    "boundingBox": [
                        67,
                        646,
                        2582,
                        713,
                        2580,
                        876,
                        67,
                        821
                    ],
                    "text": "The quick brown fox jumps",
                    "words": [
                        {
                        "boundingBox": [
                            143,
                            650,
                            435,
                            661,
                            436,
                            823,
                            144,
                            824
                        ],
                        "text": "The",
                        },
        // The rest of result is omitted for brevity 
        
}
```

In 3.0, it has been adjusted:

```json
{
    {
        "status": "succeeded",
        "createdDateTime": "2020-05-28T05:13:21Z",
        "lastUpdatedDateTime": "2020-05-28T05:13:22Z",
        "analyzeResult": {
        "version": "3.0.0",
        "readResults": [
            {
            "page": 1,
            "language": "en",
            "angle": 0.8551,
            "width": 2661,
            "height": 1901,
            "unit": "pixel",
            "lines": [
                {
                "boundingBox": [
                    67,
                    646,
                    2582,
                    713,
                    2580,
                    876,
                    67,
                    821
                ],
                "text": "The quick brown fox jumps",
                "words": [
                    {
                    "boundingBox": [
                        143,
                        650,
                        435,
                        661,
                        436,
                        823,
                        144,
                        824
                    ],
                    "text": "The",
                    "confidence": 0.958
                    },
    // The rest of result is omitted for brevity 
    
}
```

Note the following changes to the json:

- In v2.0, `Get Read Operation Result` will return the OCR recognition json when the status is “Succeeded”. In v3.0, this field is `succeeded`.
- To get the root for page array,  change the json hierarchy from `recognitionResults` to `analyzeResult`/`readResults`. The per-page line and words json hierarchy remains unchanged, so no code changes are required.
-	The page angle `clockwiseOrientation` has been renamed to `angle` and the range has been changed from 0 - 360 degrees to -180 to 180 degrees. Depending on your code, you may or may not have to makes changes as most math functions can handle either range.
-	The v3.0 API also introduces the following improvements you can optionally leverage:
    -`createdDateTime` and `lastUpdatedDateTime` are added so you can track the duration of processing. See documentation for more details. 
    - “version” tells you the version of the API used to generate results
    - A per-word `confidence` has been added. This value is calibrated so that a value 0.95 means that there is a 95%  the recognition is correct. The confidence score can be used to select which text to send to human review. 


## Upgrade from 

## All other operations

There are no breaking changes between v2.X and v3.0 of Computer Vision API. You may simply modify the API path to replace `v2.0` with `v3.0`.