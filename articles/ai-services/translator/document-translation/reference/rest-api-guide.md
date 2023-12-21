---
title: "Document Translation REST API reference guide"
titleSuffix: Azure AI services
description: View a list of with links to the Document Translation REST APIs.
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: reference
ms.date: 09/07/2023
ms.author: lajanuar
---

# Document Translation REST API reference guide

Reference</br>
Service: **Azure AI Document Translation**</br>
API Version: **v1.1**</br>

Document Translation is a cloud-based feature of the Azure AI Translator service and is part of the Azure AI service family of REST APIs. The Document Translation API translates documents across all [supported languages and dialects](../../language-support.md) while preserving document structure and data format. The available methods are listed in the following table:

| Request| Description|
|---------|--------------|
| [**Get supported document formats**](get-supported-document-formats.md)| This method returns a list of supported document formats.|
|[**Get supported glossary formats**](get-supported-glossary-formats.md)|This method returns a list of supported glossary formats.|
|[**Get supported storage sources**](get-supported-storage-sources.md)| This method returns a list of supported storage sources/options.|
|[**Start translation (POST)**](start-translation.md)|This method starts a document translation job. |
|[**Get documents status**](get-documents-status.md)|This method returns the status of a all documents in a translation job.|
|[**Get document status**](get-document-status.md)| This method returns the status for a specific document in a job. |
|[**Get translations status**](get-translations-status.md)| This method returns a list of translation requests submitted by a user and the status for each request.|
|[**Get translation status**](get-translation-status.md) | This method returns a summary of the status for a specific document translation request. It includes the overall request status and the status for documents that are being translated as part of that request.|
|[**Cancel translation (DELETE)**](cancel-translation.md)| This method cancels a document translation that is currently processing or queued. |

> [!div class="nextstepaction"]
> [Swagger UI](https://mtbatchppefrontendapp.azurewebsites.net/swagger/index.html) [Explore our client libraries and SDKs for C# and Python.](../quickstarts/document-translation-sdk.md) 
