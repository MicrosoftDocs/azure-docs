---
title: Upgrade to v3.0 of the Computer Vision API
titleSuffix: Azure Cognitive Services
description: Learn how to upgrade to Computer Vision v3.0 Read API from v2.0/v2.1.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: sample
ms.date: 08/11/2020
ms.author: pafarley
ROBOTS: NOINDEX
---


# Upgrade to Computer Vision v3.0 Read API from v2.0/v2.1

This guide shows how to upgrade your existing Computer Vision v2.0 or v2.1 REST API code to v3.0 Read operations. 

## Upgrade `Batch Read File` to `Read`


1. Change the API path for `Batch Read File` 2.x as follows:


    |Read 2.x |Read 3.0  |
    |----------|-----------|
    |https://{endpoint}/vision/**v2.0/read/core/asyncBatchAnalyze**     |https://{endpoint}/vision/**v3.0/read/analyze**[?language]|
    
    A new optional _language_ parameter is available. If you do not know the language of your document, or it may be multilingual, don't include it. 

2. Change the API path for `Get Read Results` in 2.x as follows:

    |Read 2.x |Read 3.0  |
    |----------|-----------|
    |https://{endpoint}/vision/**v2.0**/read/**operations**/{operationId}     |https://{endpoint}/vision/**v3.0**/read/**analyzeResults**/{operationId}|

3. Change the code for checking the json results from `Get Read Operation Result`. When the call to `Get Read Operation Result` is successful, it returns a status string field in the JSON body. The following values from v2.0 have been changed to better align with the other Cognitive Service REST APIs. 
 
    |Read 2.x |Read 3.0  |
    |----------|-----------|
    |`"NotStarted"` |	`"notStarted"`|
    |`"Running"` | `"running"`|
    |`"Failed"` | `"failed"`|
    |`"Succeeded"` | `"succeeded"`|
    
4. Change your code to interpret the final recognition result JSON from `Get Read Operation Result`. 

    Note the following changes to the json:
    
    - In v2.x, `"Get Read Operation Result"` will return the OCR recognition json when the status is `"Succeeded"`. In v3.0, this field is `"succeeded"`.
    - To get the root for page array,  change the json hierarchy from `"recognitionResults"` to `"analyzeResult"`/`"readResults"`. The per-page line and words json hierarchy remains unchanged, so no code changes are required.
    -	The page angle `"clockwiseOrientation"` has been renamed to `"angle"` and the range has been changed from 0 - 360 degrees to -180 to 180 degrees. Depending on your code, you may or may not have to makes changes as most math functions can handle either range.
    -	The v3.0 API also introduces the following improvements you can optionally leverage:
        -`"createdDateTime"` and `"lastUpdatedDateTime"` are added so you can track the duration of processing. See documentation for more details. 
        - `"version"` tells you the version of the API used to generate results
        - A per-word `"confidence"` has been added. This value is calibrated so that a value 0.95 means that there is a 95% chance the recognition is correct. The confidence score can be used to select which text to send to human review. 
    
    
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
    
    In v3.0, it has been adjusted:
    
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

## Upgrade from `Recognize Text` to `Read`
`Recognize Text` is a *preview* operation which is being *deprecated in all versions of Computer Vision API*. You must migrate from `Recognize Text` to `Read` (v3.0) or `Batch Read File` (v2.0, v2.1). v3.0 of `Read` includes newer, better models for text recognition and additional features, so it is recommended. To upgrade from `Recognize Text` to `Read`:

1. Change the API path for `Recognize Text` v2.x as follows:


    |Recognize Text 2.x |Read 3.0  |
    |----------|-----------|
    |https://{endpoint}/vision/**v2.0/recognizeText[?mode]**|https://{endpoint}/vision/**v3.0/read/analyze**[?language]|
    
    The _mode_ parameter is not supported in `Read`. Both handwritten and printed text will automatically be supported.
    
    A new optional _language_ parameter is available in v3.0. If you do not know the language of your document, or it may be multilingual, don't include it. 

2. Change the API path for `Get Recognize Text Operation Result` v2.x as follows:

    |Recognize Text 2.x |Read 3.0  |
    |----------|-----------|
    |https://{endpoint}/vision/**v2.0/textOperations/**{operationId}|https://{endpoint}/vision/**v3.0/read/analyzeResults**/{operationId}|

3. Change the code for checking the json results from `Get Recognize Text Operation Result`. When the call to `Get Read Operation Result` is successful, it returns a status string field in the JSON body. 
 
    |Recognize Text 2.x |Read 3.0  |
    |----------|-----------|
    |`"NotStarted"` |	`"notStarted"`|
    |`"Running"` | `"running"`|
    |`"Failed"` | `"failed"`|
    |`"Succeeded"` | `"succeeded"`|


4. Change your code to interpret the final recognition result JSON from `Get Recognize Text Operation Result`to support `Get Read Operation Result`.

    Note the following changes to the json:    

    - In v2.x, `"Get Read Operation Result"` will return the OCR recognition json when the status is `"Succeeded"`. In v3.0, this field is `"succeeded"`.
    - To get the root for page array,  change the json hierarchy from `"recognitionResult"` to `"analyzeResult"`/`"readResults"`. The per-page line and words json hierarchy remains unchanged, so no code changes are required.
    -	The v3.0 API also introduces the following improvements you can optionally leverage. See the API reference for more details:
        -`"createdDateTime"` and `"lastUpdatedDateTime"` are added so you can track the duration of processing. See documentation for more details. 
        - `"version"` tells you the version of the API used to generate results
        - A per-word `"confidence"` has been added. This value is calibrated so that a value 0.95 means that there is a 95% chance the recognition is correct. The confidence score can be used to select which text to send to human review. 
        - `"angle"` general orientation of the text in clockwise direction, measured in degrees between (-180, 180].
        -  `"width"` and `"height"` give you the dimensions of your document, and `"unit"` provides the unit of those dimensions (pixels or inches, depending on document type.)
        - `"page"` multipage documents are supported
        - `"language"` the input language of the document (from the optional _language_ parameter.)


    In 2.X, the output format is as follows: 
    
    ```json
    {
        {
                "status": "Succeeded",
                "recognitionResult": [
                    {
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
    
    In v3.0, it has been adjusted:
    
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
    
## All other operations

There are no other breaking changes between v2.X and v3.0 of Computer Vision API. You may simply modify the API path to replace `v2.0` with `v3.0`.
