---
title: Microsoft.Skills.Vision.Ocr cognitive search skill (Azure Search) | Microsoft Docs
description: Extract text from image files in an Azure Search augmentation pipeline.
services: search
manager: pablocas
author: luiscabrer
documentationcenter: ''

ms.assetid: 
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 05/01/2018
ms.author: luisca
---
# Cognitive Skills: OcrSkill

## @odata.type  
Microsoft.Skills.Vision.OcrSkill 

This skill is not part of the private preview yet.

The behavior for the preview is as follows:


When you define your indexer, if you set the *ocrEmbeddedImages* to true, images embedded within a file with automatically be run through an OCR process, and the textual representation of those files will be added to the *content* field.

```
{
  ... other parts of indexer definition
  "parameters" : { 
      "configuration" : {
          "dataToExtract" : "contentAndMetadata",
          "ocrEmbeddedImages" : true
      }
  }
}
```

For the private preview, you can disable this behavior by setting "ocrEmbeddedImages" to *false* on the indexer definition. In that case, the *content* field will only include actual text extracted from the files.

In the coming weeks, we will expose the OCR skill so you have more control over how images get converted to text. Stay tuned.