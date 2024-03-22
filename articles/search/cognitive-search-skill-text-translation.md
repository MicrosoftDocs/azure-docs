---
title: Text Translation cognitive skill
titleSuffix: Azure AI Search
description: Evaluates text and, for each record, returns text translated to the specified target language in an  AI enrichment pipeline in Azure AI Search.

manager: nitinme
author: careyjmac
ms.author: chalton
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: reference
ms.date: 09/19/2022
---

#	Text Translation cognitive skill

The **Text Translation** skill evaluates text and, for each record, returns the text translated to the specified target language. This skill uses the [Translator Text API v3.0](../ai-services/translator/reference/v3-0-translate.md) available in Azure AI services.

This capability is useful if you expect that your documents may not all be in one language, in which case you can normalize the text to a single language before indexing for search by translating it.  It's also useful for localization use cases, where you may want to have copies of the same text available in multiple languages.

The [Translator Text API v3.0](../ai-services/translator/reference/v3-0-reference.md) is a non-regional Azure AI service, meaning that your data isn't guaranteed to stay in the same region as your Azure AI Search or attached Azure AI services resource.

> [!NOTE]
> This skill is bound to Azure AI services and requires [a billable resource](cognitive-search-attach-cognitive-services.md) for transactions that exceed 20 documents per indexer per day. Execution of built-in skills is charged at the existing [Azure AI services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/).
>
> When using this skill, all documents in the source are processed and billed for translation, even if the source and target languages are the same. This behavior is useful for multi-language support within the same document, but it can result in unnecessary processing. To avoid unexpected billing charges from documents that don't need processing, move them out of the data source container prior to running the skill.
>

## @odata.type

Microsoft.Skills.Text.TranslationSkill

## Data limits

The maximum size of a record should be 50,000 characters as measured by [`String.Length`](/dotnet/api/system.string.length). If you need to break up your data before sending it to the text translation skill, consider using the [Text Split skill](cognitive-search-skill-textsplit.md). If you do use a text split skill, set the page length to 5000 for the best performance.

## Skill parameters

Parameters are case-sensitive.

| Inputs | Description |
|---------------------|-------------|
| defaultToLanguageCode | (Required) The language code to translate documents into for documents that don't specify the "to" language explicitly. <br/> See the [full list of supported languages](../ai-services/translator/language-support.md). |
| defaultFromLanguageCode | (Optional) The language code to translate documents from for documents that don't specify the "from" language explicitly.  If the defaultFromLanguageCode isn't specified, the automatic language detection provided by the Translator Text API will be used to determine the "from" language. <br/> See the [full list of supported languages](../ai-services/translator/language-support.md). |
| suggestedFrom | (Optional) The language code to translate documents from if `fromLanguageCode` or `defaultFromLanguageCode` are unspecified, and the automatic language detection is unsuccessful. If the suggestedFrom language isn't specified,  English (en) will be used as the suggestedFrom language. <br/> See the [full list of supported languages](../ai-services/translator/language-support.md). |

## Skill inputs

| Input name	 | Description |
|--------------------|-------------|
| text | The text to be translated.|
| toLanguageCode	| A string indicating the language the text should be translated to. If this input isn't specified, the defaultToLanguageCode will be used to translate the text. <br/>See the [full list of supported languages](../ai-services/translator/language-support.md). |
| fromLanguageCode	| A string indicating the current language of the text. If this parameter isn't specified, the defaultFromLanguageCode (or automatic language detection if the defaultFromLanguageCode isn't provided) will be used to translate the text. <br/>See the [full list of supported languages](../ai-services/translator/language-support.md). |

## Skill outputs

| Output name	 | Description |
|--------------------|-------------|
| translatedText | The string result of the text translation from the translatedFromLanguageCode to the translatedToLanguageCode.|
| translatedToLanguageCode	| A string indicating the language code the text was translated to. Useful if you're translating to multiple languages and want to be able to keep track of which text is which language.|
| translatedFromLanguageCode	| A string indicating the language code the text was translated from. Useful if you opted for the automatic language detection option as this output will give you the result of that detection.|

## Sample definition

```json
 {
    "@odata.type": "#Microsoft.Skills.Text.TranslationSkill",
    "defaultToLanguageCode": "fr",
    "suggestedFrom": "en",
    "context": "/document",
    "inputs": [
      {
        "name": "text",
        "source": "/document/text"
      }
    ],
    "outputs": [
      {
        "name": "translatedText",
        "targetName": "translatedText"
      },
      {
        "name": "translatedFromLanguageCode",
        "targetName": "translatedFromLanguageCode"
      },
      {
        "name": "translatedToLanguageCode",
        "targetName": "translatedToLanguageCode"
      }
    ]
  }
```

##	Sample input

```json
{
  "values": [
    {
      "recordId": "1",
      "data":
        {
          "text": "We hold these truths to be self-evident, that all men are created equal."
        }
    },
    {
      "recordId": "2",
      "data":
        {
          "text": "Estamos muy felices de estar con ustedes."
        }
    }
  ]
}
```


##	Sample output

```json
{
  "values": [
    {
      "recordId": "1",
      "data":
        {
          "translatedText": "Nous tenons ces vérités pour évidentes, que tous les hommes sont créés égaux.",
          "translatedFromLanguageCode": "en",
          "translatedToLanguageCode": "fr"
        }
    },
    {
      "recordId": "2",
      "data":
        {
          "translatedText": "Nous sommes très heureux d'être avec vous.",
          "translatedFromLanguageCode": "es",
          "translatedToLanguageCode": "fr"
        }
    }
  ]
}
```

## Errors and warnings

If you provide an unsupported language code for either the "to" or "from" language, an error is generated, and text isn't translated.
If your text is empty, a warning will be produced.
If your text is larger than 50,000 characters, only the first 50,000 characters will be translated, and a warning will be issued.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
