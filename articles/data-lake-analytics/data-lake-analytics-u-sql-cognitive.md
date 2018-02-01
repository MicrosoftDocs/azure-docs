---
title: Using U-SQL Cognitive capabilities in Azure Data Lake Analytics | Microsoft Docs
description: 'Learn how to use the intelligence of Cognitive capabilities in U-SQL'
services: data-lake-analytics
documentationcenter: ''
author: saveenr
manager: jhubbard
editor: cgronlun

ms.assetid: 019c1d53-4e61-4cad-9b2c-7a60307cbe19
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 12/05/2016
ms.author: saveenr

---

# Tutorial: Get started with the Cognitive capabilities of U-SQL

## Overview
Cognitive capabilities for U-SQL enable developers to use put intelligence in their big data programs. 

The following cognitive capabilities are available:
* Imaging: Detect faces
* Imaging: Detect emotion
* Imaging: Detect objects (tagging)
* Imaging: OCR (optical character recognition)
* Text: Key Phrase Extraction
* Text: Sentiment Analysis

## How to use Cognitive in your U-SQL script

The overall process is simple:

* Use the REFERENCE ASSEMBLY statement to enable the cognitive features for the U-SQL Script
* Use the PROCESS on an input Rowset using a Cognitive UDO, to generate an output RowSet

### Detecting objects in images

The following example shows how to use the cognitive capabilities to detect objects in images.

```
REFERENCE ASSEMBLY ImageCommon;
REFERENCE ASSEMBLY FaceSdk;
REFERENCE ASSEMBLY ImageEmotion;
REFERENCE ASSEMBLY ImageTagging;
REFERENCE ASSEMBLY ImageOcr;

// Get the image data

@imgs =
    EXTRACT 
        FileName string, 
        ImgData byte[]
    FROM @"/usqlext/samples/cognition/{FileName}.jpg"
    USING new Cognition.Vision.ImageExtractor();

//  Extract the number of objects on each image and tag them 

@tags =
    PROCESS @imgs 
    PRODUCE FileName,
            NumObjects int,
            Tags SQL.MAP<string, float?>
    READONLY FileName
    USING new Cognition.Vision.ImageTagger();

@tags_serialized =
    SELECT FileName,
           NumObjects,
           String.Join(";", Tags.Select(x => String.Format("{0}:{1}", x.Key, x.Value))) AS TagsString
    FROM @tags;

OUTPUT @tags_serialized
    TO "/tags.csv"
    USING Outputters.Csv();
```
For more examples, look at the **U-SQL/Cognitive Samples** in the **Next steps** section.

## Next steps
* [U-SQL/Cognitive Samples](https://github.com/Azure-Samples?utf8=✓&q=usql%20cognitive)
* [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md)
* [Using U-SQL window functions for Azure Data Lake Analytics jobs](data-lake-analytics-use-window-functions.md)
