---
title: "Document Translation REST API reference guide"
titleSuffix: Azure AI services
description: View a list of with links to the Document Translation REST APIs.
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: reference
ms.date: 02/09/2024
ms.author: lajanuar
---

# Document Translation operations

Reference</br>
Feature: **Azure AI Translator → Document Translation**</br>
API Version: **2024-05-01**</br>

Document Translation is a cloud-based feature of the Azure AI Translator service and is part of the Azure AI service family of REST APIs. The Batch Document Translation API translates documents across all [supported languages and dialects](../../language-support.md) while preserving document structure and data format. The available methods are listed in the following table:

| Request|Method| Description|API path|
|---------|:-------:|-------|-----|
|**Single document translation operation** ||||
|[**Translate document**](translate-document.md)|POST|Synchronously translate a single document.|`{document-translation-endpoint}/translator/document:translate?api-version={date}`|
|**Batch Translation operations**||||
|[**Start translation**](start-translation.md)|POST| Start a batch document translation job.|`{document-translation-endpoint}/translator/document/batches?api-version={date}`|
|[**Get status for all translation jobs**](get-translations-status.md)|GET| Request a list and the status of translation jobs submitted by the user.|`{document-translation-endpoint}/translator/document/batches?api-version={date}`|
|[**Get status for a specific translation job**](get-translation-status.md) |GET| Request a summary of the status for a specific translation job. The response includes the overall job status and the status for documents that are being translated as part of that job.|`{document-translation-endpoint}/translator/document/batches/{id}?api-version={date}`|
|[**Get status for all documents**](get-documents-status.md)|GET|Request the status of all documents in a translation job.|`{document-translation-endpoint}/translator/document/batches/{id}/documents?api-version={date}`|
|[**Get status for a specific document**](get-document-status.md)|GET| Request the status for a specific document in a job. |`{document-translation-endpoint}/translator/document/batches/{id}/documents/{documentId}?api-version={date}`|
|[**Cancel translation**](cancel-translation.md)|DELETE| Cancel a document translation job that is currently processing or queued.|`{document-translation-endpoint}/translator/document/batches/{id}?api-version={date}`|
|[**Get supported document formats**](get-supported-document-formats.md)|GET| Request a list of supported document formats.|`{document-translation-endpoint}/translator/document/formats?api-version={date}&type=document`|
|[**Get supported glossary formats**](get-supported-glossary-formats.md)|GET|Request a list of supported glossary formats.|`{document-translation-endpoint}/translator/document/formats?api-version={date}&type=glossary`|

> [!NOTE]
> The `get supported storage sources` method is no longer supported. The Translator service only supports Azure Blob storage.

> [!div class="nextstepaction"]
> [Explore our client libraries and SDKs for C# and Python programming languages.](../quickstarts/client-library-sdks.md).
