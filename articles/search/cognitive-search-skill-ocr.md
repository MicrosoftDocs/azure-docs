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

This skill is not currently operational in the private preview.


If you want to extract text from images for the private, you can add the following parameters to your indexer definition:

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

When content is extracted, you may in addition tell the system what to do about the images it finds using ```ImageAction```. The ```"ImageAction":"embedTextInContentField"``` tells the indexer to extract text from the images it finds and embed it as part of the content field. Note this behavior will apply to both the images embedded in the documents (think of an image inside a PDF), as well as images found in the data source -- for instance a JPG file.  

In the coming weeks, we plan to expose the OCR skill so you have more control over how images are converted to text. Stay tuned for further developments.

## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)