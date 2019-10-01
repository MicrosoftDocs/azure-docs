---
title: Common Errors and Warnings - Azure Search
description: This article provides information and solutions to common errors and warnings you might encounter during AI enrichment in Azure Search.
services: search
manager: heidist
author: amotley

ms.service: search
ms.workload: search
ms.topic: conceptual
ms.date: 09/18/2019
ms.author: abmotley
ms.subservice: cognitive-search
---

# Common errors and warnings of the AI enrichment pipeline in Azure Search

This article provides information and solutions to common errors and warnings you might encounter during AI enrichment in Azure Search.

## Errors
Indexing stops when the error count exceeds ['maxfaileditems'](cognitive-search-concept-troubleshooting.md#tip-3-see-what-works-even-if-there-are-some-failures). The following sections can help you resolve errors, allowing indexing to continue.

### Could not read document
Indexer was unable to read the document from the data source. This can happen due to:

| Reason | Example | Action |
| --- | --- | --- |
| inconsistent field types across different documents | Type of value has a mismatch with column type. Couldn't store `'{47.6,-122.1}'` in authors column.  Expected type is JArray. | Ensure that the type of each field is the same across different documents. For example, if the first document `'startTime'` field is a DateTime, and in the second document it's a string, this error will be hit. |
| errors from the data source's underlying service | (from Cosmos DB) `{"Errors":["Request rate is large"]}` | Check your storage instance to ensure it's healthy. You may need to adjust your scaling/partitioning. |
| transient issues | A transport-level error has occurred when receiving results from the server. (provider: TCP Provider, error: 0 - An existing connection was forcibly closed by the remote host | Occasionally there are unexpected connectivity issues. Try running the document through your indexer again later. |

### Could not extract document content
Indexer with a Blob data source was unable to extract the content from the document (for example, a PDF file). This can happen due to:

| Reason | Example | Action |
| --- | --- | --- |
| blob is over the size limit | Document is `'150441598'` bytes, which exceeds the maximum size `'134217728'` bytes for document extraction for your current service tier. | [blob indexing errors](search-howto-indexing-azure-blob-storage.md#dealing-with-errors) |
| blob has unsupported content type | Document has unsupported content type `'image/png'` | [blob indexing errors](search-howto-indexing-azure-blob-storage.md#dealing-with-errors) |
| blob is encrypted | Document could not be processed - it may be encrypted or password protected. | [blob settings](search-howto-indexing-azure-blob-storage.md#controlling-which-parts-of-the-blob-are-indexed) |
| transient issues | Error processing blob: The request was aborted: The request was canceled. | Occasionally there are unexpected connectivity issues. Try running the document through your indexer again later. |

### Could not parse document
Indexer read the document from the data source, but there was an issue converting the document content into the specified field mapping schema. This can happen due to:

| Reason | Example | Action |
| --- | --- | --- |
| The document key is missing | Document key cannot be missing or empty | Ensure all documents have valid document keys |
| The document key is invalid | Document key cannot be longer than 1024 characters | Modify the document key to meet the validation requirements. |
| Could not apply field mapping to a field | Could not apply mapping function `'functionName'` to field `'fieldName'`. Array cannot be null. Parameter name: bytes | Double check the [field mappings](search-indexer-field-mappings.md) defined on the indexer, and compare with the data of the specified field of the failed document. It may be necessary to modify the field mappings or the document data. |
| Could not read field value | Could not read the value of column `'fieldName'` at index `'fieldIndex'`. A transport-level error has occurred when receiving results from the server. (provider: TCP Provider, error: 0 - An existing connection was forcibly closed by the remote host.) | These errors are typically due to unexpected connectivity issues with the data source's underlying service. Try running the document through your indexer again later. |

### Skill input 'languageCode' has the following language codes 'X,Y,Z', at least one of which is invalid.

This error means that one of the values passed into the optional `languageCode` input of the skill is invalid for that skill. If you are opting to pass the output of the [LanguageDetectionSkill](cognitive-search-skill-language-detection.md) into each of your subsequent skills, this may be causing issues as the output of the [LanguageDetectionSkill](cognitive-search-skill-language-detection.md) is a larger set of languages than is supported for the other text based skills. If you know that your data set is all in one language, you can remove the [LanguageDetectionSkill](cognitive-search-skill-language-detection.md) and the `languageCode` skill input and use the `defaultLanguageCode` skill parameter for that skill instead. Please note that that language must still be supported for that skill type for this to work as expected.

If you know that your data set contains multiple languages and thus you need the [LanguageDetectionSkill](cognitive-search-skill-language-detection.md) and `languageCode` input, consider adding a [ConditionalSkill](cognitive-search-skill-conditional.md) to filter out the text with languages that are not supported before passing in the text to the skill in question.  Here is an example of what this might look like for the EntityRecognitionSkill:

```json
{
    "@odata.type": "#Microsoft.Skills.Util.ConditionalSkill",
    "context": "/document",
    "inputs": [
        { "name": "condition", "source": "= $(/document/language) == 'de' || $(/document/language) == 'en' || $(/document/language) == 'es' || $(/document/language) == 'fr' || $(/document/language) == 'it'" },
        { "name": "whenTrue", "source": "/document/content" },
        { "name": "whenFalse", "source": "= null" }
    ],
    "outputs": [ { "name": "output", "targetName": "supportedByEntityRecognitionSkill" } ]
}
```

Here are some references for the currently supported languages for each of the skills that may produce this error message:
* [Text Analytics Supported Languages](https://docs.microsoft.com/azure/cognitive-services/text-analytics/text-analytics-supported-languages) (for the [KeyPhraseExtractionSkill](cognitive-search-skill-keyphrases.md), [EntityRecognitionSkill](cognitive-search-skill-entity-recognition.md), and [SentimentSkill](cognitive-search-skill-sentiment.md))
* [Translator Supported Languages](https://docs.microsoft.com/azure/cognitive-services/translator/language-support) (for the [Text TranslationSkill](cognitive-search-skill-text-translation.md))
* [Text SplitSkill](cognitive-search-skill-textsplit.md) Supported Languages: `da, de, en, es, fi, fr, it, ko, pt`

### Skill did not execute within the time limit
There are two cases under which you may encounter this error message, each of which should be treated differently. Please follow the instructions below depending on what skill returned this error for you.

#### Built-in Cognitive Service skills
Many of the built-in cognitive skills, such as language detection, entity recognition, or OCR, are backed by a Cognitive Service web api endpoint.  Sometimes, there are transient issues with these endpoints that may cause requests to not return in a reasonable amount of time. There is no action for you as the user to take except to wait for a period of time in order to allow for the transient issue to be resolved. Consider [setting your indexer to run on a schedule](search-howto-schedule-indexers.md) if you haven't already, and likely the next time the indexer is scheduled to execute the transient issue will be resolved and the indexer will be able to continue making progress.

#### Custom skills
If you encounter a timeout error with a custom skill you have created, there are a couple of things you can try. First, review your custom skill and ensure that it is not getting stuck in an infinite loop and that it is returning a result consistently. Once you have confirmed that is the case, determine what the execution time of your skill is. If you didn't explicitly set a `timeout` value on your custom skill definition, then the default `timeout` is 30 seconds. If 30 seconds is not long enough for your skill to execute, you may specify a higher `timeout` value on your custom skill definition. Here is an example of a custom skill definition where the timeout is set to 90 seconds:

```json
  {
        "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
        "uri": "<your custom skill uri>",
        "batchSize": 1,
        "timeout": "PT90S",
        "context": "/document",
        "inputs": [
          {
            "name": "input",
            "source": "/document/content"
          }
        ],
        "outputs": [
          {
            "name": "output",
            "targetName": "output"
          }
        ]
      }
```

The maximum value that you can set for the `timeout` parameter is 230 seconds.  If your custom skill is unable to execute consistently within 230 seconds, you may consider reducing the `batchSize` of your custom skill so that it will have fewer documents to process within a single execution.  If you have already set your `batchSize` to 1, you will need to rewrite the skill to be able to execute in under 230 seconds or otherwise split it into multiple custom skills so that the execution time for any single custom skill is a maximum of 230 seconds. Review the [custom skill documentation](cognitive-search-custom-skill-web-api.md) for more information.

##  Warnings
Warnings do not stop indexing, but they do indicate conditions that could result in unexpected outcomes. Whether you take action or not depends on the data and your scenario.

### Skill input was truncated
Cognitive Skills have limits to the length of text that can be analyzed at once. If the text input of these skills are over that limit, we will truncate the text to meet the limit, and then perform the enrichment on that truncated text. This means that the skill is executed, but not over all of your data.

In the example LanguageDetectionSkill below, the `'text'` input field may trigger this warning if it is over the character limit. You can find the skill input limits in the [skills documentation](cognitive-search-predefined-skills.md).

```json
 {
    "@odata.type": "#Microsoft.Skills.Text.LanguageDetectionSkill",
    "inputs": [
      {
        "name": "text",
        "source": "/document/text"
      }
    ],
    "outputs": [...]
  }
```

If you want to ensure that all text is analyzed, consider using the [Split skill](cognitive-search-skill-textsplit.md).