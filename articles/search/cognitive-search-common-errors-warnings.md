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