---
title: PII Detection cognitive skill
titleSuffix: Azure AI Search
description: Extract and mask personal information from text in an enrichment pipeline in Azure AI Search.

manager: nitinme
author: careyjmac
ms.author: chalton
ms.service: cognitive-search
ms.topic: reference
ms.date: 12/09/2021
---

# Personally Identifiable Information (PII) Detection cognitive skill

The **PII Detection** skill extracts personal information from an input text and gives you the option of masking it. This skill uses the [detection models](../ai-services/language-service/personally-identifiable-information/overview.md) provided in [Azure AI Language](../ai-services/language-service/overview.md).

> [!NOTE]
> This skill is bound to Azure AI services and requires [a billable resource](cognitive-search-attach-cognitive-services.md) for transactions that exceed 20 documents per indexer per day. Execution of built-in skills is charged at the existing [Azure AI services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/).
>

## @odata.type

Microsoft.Skills.Text.PIIDetectionSkill

## Data limits

The maximum size of a record should be 50,000 characters as measured by [`String.Length`](/dotnet/api/system.string.length). If you need to chunk your data before sending it to the skill, consider using the [Text Split skill](cognitive-search-skill-textsplit.md). If you do use a text split skill, set the page length to 5000 for the best performance.

## Skill parameters

Parameters are case-sensitive and all are optional.

| Parameter name     | Description |
|--------------------|-------------|
| `defaultLanguageCode` | (Optional) The language code to apply to documents that don't specify language explicitly.  If the default language code is not specified,  English (en) will be used as the default language code. <br/> See the [full list of supported languages](../ai-services/language-service/personally-identifiable-information/language-support.md). |
| `minimumPrecision` | A value between 0.0 and 1.0. If the confidence score (in the `piiEntities` output) is lower than the set `minimumPrecision` value, the entity is not returned or masked. The default is 0.0. |
| `maskingMode` | A parameter that provides various ways to mask the personal information detected in the input text. The following options are supported: <ul><li>`"none"` (default): No masking occurs and the `maskedText` output will not be returned. </li><li> `"replace"`: Replaces the detected entities with the character given in the `maskingCharacter` parameter. The character will be repeated to the length of the detected entity so that the offsets will correctly correspond to both the input text and the output `maskedText`.</li></ul> <br/> When this skill was in public preview, the `maskingMode` option `redact` was also supported, which allowed removing the detected entities entirely without replacement. The `redact` option has since been deprecated and are longer be supported. |
| `maskingCharacter` | The character used to mask the text if the `maskingMode` parameter is set to `replace`. The following option is supported: `*` (default). This parameter can only be `null` if `maskingMode` is not set to `replace`. <br/><br/> When this skill was in public preview, there was support for the `maskingCharacter` options, `X` and `#`. Both `X` and `#` options have since been deprecated and are longer be supported. |
| `domain`   | (Optional) A string value, if specified, will set the domain to include only a subset of the entity categories. Possible values include: `"phi"` (detect confidential health information only), `"none"`. |
| `piiCategories`   | (Optional) If you want to specify which entities will be detected and returned, use this optional parameter (defined as a list of strings) with the appropriate entity categories. This parameter can also let you detect entities that aren't enabled by default for your document language. See [Supported Personally Identifiable Information entity categories](../ai-services/language-service/personally-identifiable-information/concepts/entity-categories.md) for the full list.  |
| `modelVersion`   | (Optional) Specifies the [version of the model](../ai-services/language-service/concepts/model-lifecycle.md) to use when calling personally identifiable information detection. It will default to the most recent version when not specified. We recommend you do not specify this value unless it's necessary. |

## Skill inputs

| Input name      | Description                   |
|---------------|-------------------------------|
| `languageCode`    | A string indicating the language of the records. If this parameter is not specified, the default language code will be used to analyze the records. <br/>See the [full list of supported languages](../ai-services/language-service/personally-identifiable-information/language-support.md).  |
| `text`          | The text to analyze.          |

## Skill outputs

| Output name      | Description                   |
|---------------|-------------------------------|
| `piiEntities` | An array of complex types that contains the following fields: <ul><li>`"text"` (The actual personally identifiable information as extracted)</li> <li>`"type"`</li><li>`"subType"`</li><li>`"score"` (Higher value means it's more likely to be a real entity)</li><li>`"offset"` (into the input text)</li><li>`"length"`</li></ul> </br> See [Supported Personally Identifiable Information entity categories](../ai-services/language-service/personally-identifiable-information/concepts/entity-categories.md) for the full list.  |
| `maskedText` | If `maskingMode` is set to a value other than `none`, this output will be the string result of the masking performed on the input text as described by the selected `maskingMode`. If `maskingMode` is set to `none`, this output will not be present. |

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

The offsets returned for entities in the output of this skill are directly returned from the [Language Service APIs](../ai-services/language-service/overview.md), which means if you are using them to index into the original string, you should use the [StringInfo](/dotnet/api/system.globalization.stringinfo) class in .NET in order to extract the correct content. For more information, see [Multilingual and emoji support in Language service features](../ai-services/language-service/concepts/multilingual-emoji-support.md).

## Errors and warnings

If the language code for the document is unsupported, a warning is returned and no entities are extracted.
If your text is empty, a warning is returned.
If your text is larger than 50,000 characters, only the first 50,000 characters will be analyzed and a warning will be issued.

If the skill returns a warning, the output `maskedText` may be empty, which can impact any downstream skills that expect the output. For this reason, be sure to investigate all warnings related to missing output when writing your skillset definition.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
