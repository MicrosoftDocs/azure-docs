---
title: PII Detection cognitive skill
titleSuffix: Azure Cognitive Search
description: Extract and mask personal information from text in an enrichment pipeline in Azure Cognitive Search.

manager: nitinme
author: careyjmac
ms.author: chalton
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 08/12/2021
---

# PII Detection cognitive skill

The **PII Detection** skill extracts personal information from an input text and gives you the option of masking it. This skill uses the machine learning models provided by [Text Analytics](../cognitive-services/text-analytics/overview.md) in Cognitive Services.

> [!NOTE]
> This skill is bound to Cognitive Services and requires [a billable resource](cognitive-search-attach-cognitive-services.md) for transactions that exceed 20 documents per indexer per day. Execution of built-in skills is charged at the existing [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/).
>

## @odata.type

Microsoft.Skills.Text.PIIDetectionSkill

## Data limits

The maximum size of a record should be 50,000 characters as measured by [`String.Length`](/dotnet/api/system.string.length). If you need to chunk your data before sending it to the skill, consider using the [Text Split skill](cognitive-search-skill-textsplit.md).

## Skill parameters

Parameters are case-sensitive and all are optional.

| Parameter name     | Description |
|--------------------|-------------|
| `defaultLanguageCode` | (Optional) The language code to apply to documents that don't specify language explicitly.  If the default language code is not specified,  English (en) will be used as the default language code. <br/> See [Full list of supported languages](../cognitive-services/text-analytics/language-support.md?tabs=pii). |
| `minimumPrecision` | A value between 0.0 and 1.0. If the confidence score (in the `piiEntities` output) is lower than the set `minimumPrecision` value, the entity is not returned or masked. The default is 0.0. |
| `maskingMode` | A parameter that provides various ways to mask the personal information detected in the input text. The following options are supported: <ul><li>`none` (default): No masking occurs and the `maskedText` output will not be returned. </li><li> `replace`: Replaces the detected entities with the character given in the `maskingCharacter` parameter. The character will be repeated to the length of the detected entity so that the offsets will correctly correspond to both the input text as well as the output `maskedText`.</li></ul> <br/> During the PIIDetectionSkill preview, the `maskingMode` option `redact` was also supported, which allowed removing the detected entities entirely without replacement. The `redact` option has since been deprecated and will no longer be supported in the skill going forward. |
| `maskingCharacter` | The character used to mask the text if the `maskingMode` parameter is set to `replace`. The following option is supported: `*` (default). This parameter can only be `null` if `maskingMode` is not set to `replace`. <br/><br/> During the PIIDetectionSkill preview, there was support for additional `maskingCharacter` options `X` and `#`. The `X` and `#` options have since been deprecated and will no longer be supported in the skill going forward. |
| `domain`   | (Optional) A string value, if specified, will set the PII domain to include only a subset of the entity categories. Possible values include: `phi` (detect confidential health information only), `none`. |
| `piiCategories`   | (Optional) If you want to specify which entities will be detected and returned, use the optional `piiCategories` parameter (defined as a list of strings) with the appropriate entity categories. This parameter can also let you detect entities that aren't enabled by default for your document language. See [the TextAnalytics documentation](../cognitive-services/text-analytics/named-entity-types.md?tabs=personal) for list of categories that are available.  |
| `modelVersion`   | (Optional) The version of the model to use when calling the Text Analytics service. It will default to the most recent version when not specified. We recommend you do not specify this value unless absolutely necessary. See [Model versioning in the Text Analytics API](../cognitive-services/text-analytics/concepts/model-versioning.md) for more details. |

## Skill inputs

| Input name      | Description                   |
|---------------|-------------------------------|
| `languageCode`    | A string indicating the language of the records. If this parameter is not specified, the default language code will be used to analyze the records. <br/>See [Full list of supported languages](../cognitive-services/text-analytics/language-support.md?tabs=pii)  |
| `text`          | The text to analyze.          |

## Skill outputs

| Output name      | Description                   |
|---------------|-------------------------------|
| `piiEntities` | An array of complex types that contains the following fields: <ul><li>text (The actual PII as extracted)</li> <li>type</li><li>subType</li><li>score (Higher value means it's more likely to be a real entity)</li><li>offset (into the input text)</li><li>length</li></ul> </br> [Possible types and subTypes can be found here.](../cognitive-services/text-analytics/named-entity-types.md?tabs=personal) |
| `maskedText` | If `maskingMode` is set to a value other than `none`, this output will be the string result of the masking performed on the input text as described by the selected `maskingMode`.  If `maskingMode` is set to `none`, this output will not be present. |

## Sample definition

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

## Sample input

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

## Sample output

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

The offsets returned for entities in the output of this skill are directly returned from the [Text Analytics API](../cognitive-services/text-analytics/overview.md), which means if you are using them to index into the original string, you should use the [StringInfo](/dotnet/api/system.globalization.stringinfo) class in .NET in order to extract the correct content.  [More details can be found here.](../cognitive-services/text-analytics/concepts/text-offsets.md)

## Errors and warnings

If the language code for the document is unsupported, a warning is returned and no entities are extracted.
If your text is empty, a warning is returned.
If your text is larger than 50,000 characters, only the first 50,000 characters will be analyzed and a warning will be issued.

If the skill returns a warning, the output `maskedText` may be empty, which can impact any downstream skills that expect the output. For this reason, be sure to investigate all warnings related to missing output when writing your skillset definition.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)