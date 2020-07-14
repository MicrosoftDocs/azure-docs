---
title: Key Phrase Extraction cognitive skill
titleSuffix: Azure Cognitive Search
description: Evaluates unstructured text, and for each record, returns a list of key phrases in an AI enrichment pipeline in Azure Cognitive Search.

manager: nitinme
author: luiscabrer
ms.author: luisca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---
#	Key Phrase Extraction cognitive skill

The **Key Phrase Extraction** skill evaluates unstructured text, and for each record, returns a list of key phrases. This skill uses the machine learning models provided by [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/overview) in Cognitive Services.

This capability is useful if you need to quickly identify the main talking points in the record. For example, given input text "The food was delicious and there were wonderful staff", the service returns "food" and "wonderful staff".

> [!NOTE]
> As you expand scope by increasing the frequency of processing, adding more documents, or adding more AI algorithms, you will need to [attach a billable Cognitive Services resource](cognitive-search-attach-cognitive-services.md). Charges accrue when calling APIs in Cognitive Services, and for image extraction as part of the document-cracking stage in Azure Cognitive Search. There are no charges for text extraction from documents.
>
> Execution of built-in skills is charged at the existing [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/). Image extraction pricing is described on the [Azure Cognitive Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400).


## @odata.type  
Microsoft.Skills.Text.KeyPhraseExtractionSkill 

## Data limits
The maximum size of a record should be 50,000 characters as measured by [`String.Length`](https://docs.microsoft.com/dotnet/api/system.string.length). If you need to break up your data before sending it to the key phrase extractor, consider using the [Text Split skill](cognitive-search-skill-textsplit.md).

## Skill parameters

Parameters are case-sensitive.

| Inputs	            | Description |
|---------------------|-------------|
| `defaultLanguageCode` | (Optional) The language code to apply to documents that don't specify language explicitly.  If the default language code is not specified,  English (en) will be used as the default language code. <br/> See [Full list of supported languages](https://docs.microsoft.com/azure/cognitive-services/text-analytics/text-analytics-supported-languages). |
| `maxKeyPhraseCount`   | (Optional) The maximum number of key phrases to produce. |

## Skill inputs

| Input	 | Description |
|--------------------|-------------|
| `text` | The text to be analyzed.|
| `languageCode`	|  A string indicating the language of the records. If this parameter is not specified, the default language code will be used to analyze the records. <br/>See [Full list of supported languages](https://docs.microsoft.com/azure/cognitive-services/text-analytics/text-analytics-supported-languages)|

## Skill outputs

| Output	 | Description |
|--------------------|-------------|
| `keyPhrases` | A list of key phrases extracted from the input text. The key phrases are returned in order of importance. |


##	Sample definition

Consider a SQL record that has the following fields:

```json
{
    "content": "Glaciers are huge rivers of ice that ooze their way over land, powered by gravity and their own sheer weight. They accumulate ice from snowfall and lose it through melting. As global temperatures have risen, many of the world’s glaciers have already started to shrink and retreat. Continued warming could see many iconic landscapes – from the Canadian Rockies to the Mount Everest region of the Himalayas – lose almost all their glaciers by the end of the century.",
    "language": "en"
}
```

Then your skill definition may look like this:

```json
 {
    "@odata.type": "#Microsoft.Skills.Text.KeyPhraseExtractionSkill",
    "inputs": [
      {
        "name": "text",
        "source": "/document/content"
      },
      {
        "name": "languageCode",
        "source": "/document/language" 
      }
    ],
    "outputs": [
      {
        "name": "keyPhrases",
        "targetName": "myKeyPhrases"
      }
    ]
  }
```

##	Sample output

For the example above, the output of your skill will be written to a new node in the enriched tree called "document/myKeyPhrases" since that is the `targetName` that we specified. If you don’t specify a `targetName`, then it would be "document/keyPhrases".

#### document/myKeyPhrases 
```json
            [
              "world’s glaciers", 
              "huge rivers of ice", 
              "Canadian Rockies", 
              "iconic landscapes",
              "Mount Everest region",
              "Continued warming"
            ]
```

You may use "document/myKeyPhrases" as input into other skills, or as a source of an [output field mapping](cognitive-search-output-field-mapping.md).

## Errors and warnings
If you provide an unsupported language code, an error is generated and key phrases are not extracted.
If your text is empty, a warning will be produced.
If your text is larger than 50,000 characters, only the first 50,000 characters will be analyzed and a warning will be issued.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [How to define output fields mappings](cognitive-search-output-field-mapping.md)
