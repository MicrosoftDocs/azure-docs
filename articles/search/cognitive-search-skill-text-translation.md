---
title: Text Translation cognitive skill
titleSuffix: Azure Cognitive Search
description: Evaluates text and, for each record, returns text translated to the specified target language in an  AI enrichment pipeline in Azure Cognitive Search. 

manager: nitinme
author: careyjmac
ms.author: chalton
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---

#	Text Translation cognitive skill

The **Text Translation** skill evaluates text and, for each record, returns the text translated to the specified target language. This skill uses the [Translator Text API v3.0](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-translate) available in Cognitive Services.

This capability is useful if you expect that your documents may not all be in one language, in which case you can normalize the text to a single language before indexing for search by translating it.  It is also useful for localization use cases, where you may want to have copies of the same text available in multiple languages.

The [Translator Text API v3.0](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference) is a non-regional Cognitive Service, meaning that your data is not guaranteed to stay in the same region as your Azure Cognitive Search or attached Cognitive Services resource.

> [!NOTE]
> As you expand scope by increasing the frequency of processing, adding more documents, or adding more AI algorithms, you will need to [attach a billable Cognitive Services resource](cognitive-search-attach-cognitive-services.md). Charges accrue when calling APIs in Cognitive Services, and for image extraction as part of the document-cracking stage in Azure Cognitive Search. There are no charges for text extraction from documents.
>
> Execution of built-in skills is charged at the existing [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/). Image extraction pricing is described on the [Azure Cognitive Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400).

## @odata.type  
Microsoft.Skills.Text.TranslationSkill

## Data limits
The maximum size of a record should be 50,000 characters as measured by [`String.Length`](https://docs.microsoft.com/dotnet/api/system.string.length). If you need to break up your data before sending it to the text translation skill, consider using the [Text Split skill](cognitive-search-skill-textsplit.md).

## Skill parameters

Parameters are case-sensitive.

| Inputs	            | Description |
|---------------------|-------------|
| defaultToLanguageCode | (Required) The language code to translate documents into for documents that don't specify the to language explicitly. <br/> See [Full list of supported languages](https://docs.microsoft.com/azure/cognitive-services/translator/language-support). |
| defaultFromLanguageCode | (Optional) The language code to translate documents from for documents that don't specify the from language explicitly.  If the defaultFromLanguageCode is not specified, the automatic language detection provided by the Translator Text API will be used to determine the from language. <br/> See [Full list of supported languages](https://docs.microsoft.com/azure/cognitive-services/translator/language-support). |
| suggestedFrom | (Optional) The language code to translate documents from when neither the fromLanguageCode input nor the defaultFromLanguageCode parameter are provided, and the automatic language detection is unsuccessful.  If the suggestedFrom language is not specified,  English (en) will be used as the suggestedFrom language. <br/> See [Full list of supported languages](https://docs.microsoft.com/azure/cognitive-services/translator/language-support). |

## Skill inputs

| Input name	 | Description |
|--------------------|-------------|
| text | The text to be translated.|
| toLanguageCode	| A string indicating the language the text should be translated to. If this input is not specified, the defaultToLanguageCode will be used to translate the text. <br/>See [Full list of supported languages](https://docs.microsoft.com/azure/cognitive-services/translator/language-support)|
| fromLanguageCode	| A string indicating the current language of the text. If this parameter is not specified, the defaultFromLanguageCode (or automatic language detection if the defaultFromLanguageCode is not provided) will be used to translate the text. <br/>See [Full list of supported languages](https://docs.microsoft.com/azure/cognitive-services/translator/language-support)|

## Skill outputs

| Output name	 | Description |
|--------------------|-------------|
| translatedText | The string result of the text translation from the translatedFromLanguageCode to the translatedToLanguageCode.|
| translatedToLanguageCode	| A string indicating the language code the text was translated to. Useful if you are translating to multiple languages and want to be able to keep track of which text is which language.|
| translatedFromLanguageCode	| A string indicating the language code the text was translated from. Useful if you opted for the automatic language detection option as this output will give you the result of that detection.|

##	Sample definition

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
If you provide an unsupported language code for either the from or the to language, an error is generated and text is not translated.
If your text is empty, a warning will be produced.
If your text is larger than 50,000 characters, only the first 50,000 characters will be translated and a warning will be issued.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
