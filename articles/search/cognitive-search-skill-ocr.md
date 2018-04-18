---
title: Microsoft.Skills.Vision.Ocr cognitive search skill (Azure Search) | Microsoft Docs
description: Extract text from image files in an Azure Search augmentation pipeline.
manager: pablocas
author: luiscabrer
ms.service: search
ms.devlang: NA
ms.topic: reference
ms.date: 05/01/2018
ms.author: luisca
---
# Microsoft.Skills.Vision.Ocr cognitive skill

> [!Important]
> This skill is not currently operational in the public preview. This article serves as a placeholder until the skill becomes available.

Extracting text from images (such as characters, numbers, and symbols) occurs when you add the following parameters to an indexer definition:

```json
{
  ... other parts of indexer definition
  "parameters":
  {
  	"configuration": 
    {
    	"dataToExtract": "contentAndMetadata",
     	"imageAction": "embedTextInContentField"
	}
  }
}
```

The ```"dataToExtract":"contentAndMetadata"``` statement in the configuration parameters tells the indexer to automatically extract the content from different file formats as well as metadata related to each file. 

When content is extracted, you may in addition tell the system what to do about the images it finds using ```ImageAction```. The ```"ImageAction":"embedTextInContentField"``` tells the indexer to extract text from the images it finds and embed it as part of the content field. Note this behavior applies to both the images embedded in the documents (think of an image inside a PDF), as well as images found in the data source -- for instance a JPG file.  

## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)