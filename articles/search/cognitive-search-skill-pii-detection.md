---
title: PII Detection cognitive skill (preview)
titleSuffix: Azure Cognitive Search
description: Extract and mask personally identifiable information from text in an enrichment pipeline in Azure Cognitive Search. This skill is currently in public preview.

manager: nitinme
author: careyjmac
ms.author: chalton
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 1/27/2020
---

#    PII Detection cognitive skill

> [!IMPORTANT] 
> This skill is currently in public preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). There is currently no portal or .NET SDK support.

The **PII Detection** skill extracts personally identifiable information from an input text and gives you the option to mask it from that text in various ways. This skill uses the machine learning models provided by [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/overview) in Cognitive Services.

> [!NOTE]
> As you expand scope by increasing the frequency of processing, adding more documents, or adding more AI algorithms, you will need to [attach a billable Cognitive Services resource](cognitive-search-attach-cognitive-services.md). Charges accrue when calling APIs in Cognitive Services, and for image extraction as part of the document-cracking stage in Azure Cognitive Search. There are no charges for text extraction from documents.
>
> Execution of built-in skills is charged at the existing [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/). Image extraction pricing is described on the [Azure Cognitive Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400).


## @odata.type  
Microsoft.Skills.Text.PIIDetectionSkill

## Data limits
The maximum size of a record should be 50,000 characters as measured by [`String.Length`](https://docs.microsoft.com/dotnet/api/system.string.length). If you need to break up your data before sending it to the skill, consider using the [Text Split skill](cognitive-search-skill-textsplit.md).

## Skill parameters

Parameters are case-sensitive and all are optional.

| Parameter name     | Description |
|--------------------|-------------|
| defaultLanguageCode |    Language code of the input text. For now, only `en` is supported. |
| minimumPrecision | A value between 0.0 and 1.0. If the confidence score (in the `piiEntities` output) is lower than the set `minimumPrecision` value, the entity is not returned or masked. The default is 0.0. |
| maskingMode | A parameter that provides various ways to mask the detected PII in the input text. The following options are supported: <ul><li>`none` (default): This means that no masking will be performed and the `maskedText` output will not be returned. </li><li> `redact`: This option will remove the detected entities from the input text and not replace them with anything. Note that in this case, the offset in the `piiEntities` output will be in relation to the original text, and not the masked text. </li><li> `replace`: This option will replace the detected entities with the character given in the `maskingCharacter` parameter.  The character will be repeated to the length of the detected entity so that the offsets will correctly correspond to both the input text as well as the output `maskedText`.</li></ul> |
| maskingCharacter | The character that will be used to masked the text if the `maskingMode` parameter is set to `replace`. The following options are supported: `*` (default), `#`, `X`. This parameter can only be `null` if `maskingMode` is not set to `replace`. |


## Skill inputs

| Input name      | Description                   |
|---------------|-------------------------------|
| languageCode    | Optional. Default is `en`.  |
| text          | The text to analyze.          |

## Skill outputs

| Output name      | Description                   |
|---------------|-------------------------------|
| piiEntities | An array of complex types that contains the following fields: <ul><li>text (The actual PII as extracted)</li> <li>type</li><li>subType</li><li>score (Higher value means it's more likely to be a real entity)</li><li>offset (into the input text)</li><li>length</li></ul> </br> [Possible types and subTypes can be found here.](https://docs.microsoft.com/azure/cognitive-services/text-analytics/named-entity-types?tabs=personal) |
| maskedText | If `maskingMode` is set to a value other than `none`, this output will be the string result of the masking performed on the input text as described by the selected `maskingMode`.  If `maskingMode` is set to `none`, this output will not be present. |

##    Sample definition

```json
  {
    "@odata.type": "#Microsoft.Skills.Text.PIIDetectionSkill",
    "defaultLanguageCode": "en",
    "minimumPrecision": 0.5,
    "maskingMode": "replace",
    "maskingCharacter": "*",
    "inputs": [
      {
        "name": "text",
        "source": "/document/content"
      }
    ],
    "outputs": [
      {
        "name": "piiEntities"
      },
      {
        "name": "maskedText"
      }
    ]
  }
```
##    Sample input

```json
{
    "values": [
      {
        "recordId": "1",
        "data":
           {
             "text": "Microsoft employee with ssn 859-98-0987 is using our awesome API's."
           }
      }
    ]
}
```

##    Sample output

```json
{
  "values": [
    {
      "recordId": "1",
      "data" : 
      {
        "piiEntities":[ 
           { 
              "text":"859-98-0987",
              "type":"U.S. Social Security Number (SSN)",
              "subtype":"",
              "offset":28,
              "length":11,
              "score":0.65
           }
        ],
        "maskedText": "Microsoft employee with ssn *********** is using our awesome API's."
      }
    }
  ]
}
```

Note that the offsets returned for entities in the output of this skill are directly returned from the [Text Analytics API](https://docs.microsoft.com/azure/cognitive-services/text-analytics/overview), which means if you are using them to index into the original string, you should use the [StringInfo](https://docs.microsoft.com/dotnet/api/system.globalization.stringinfo?view=netframework-4.8) class in .NET in order to extract the correct content.  [More details can be found here.](https://docs.microsoft.com/azure/cognitive-services/text-analytics/concepts/text-offsets)

## Error and warning cases
If the language code for the document is unsupported, a warning is returned and no entities are extracted.
If your text is empty, a warning will be produced.
If your text is larger than 50,000 characters, only the first 50,000 characters will be analyzed and a warning will be issued.

If the skill returns a warning, the output `maskedText` may be empty.  This means that if you expect that output to exist for input into later skills, it will not work as intended. Keep this in mind when writing your skillset definition.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
