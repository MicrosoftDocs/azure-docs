---
title: Content metadata properties
titleSuffix: Azure Cognitive Search
description: Metadata properties of documents can provide content to fields in a search index, or information that informs indexing behavior at run time. This article lists metadata properties supported in Azure Cognitive Search.

manager: nitinme
author: MarkHeff
ms.author: maheff
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/22/2021
---

# Content metadata properties used in Azure Cognitive Search

SharePoint Online and Azure blob storage can contain various content, and many of those content types have metadata properties that can be useful to index. Just as you can create search fields for standard blob properties like **`metadata_storage_name`**, you can create fields for metadata properties that are specific to a document format.

## Supported document formats

Cognitive Search supports blob indexing and SharePoint Online document indexing for the following document formats:

[!INCLUDE [search-blob-data-sources](../../includes/search-blob-data-sources.md)]

## Properties by document format

The following table summarizes processing done for each document format, and describes the metadata properties extracted by a blob indexer and the SharePoint Online indexer.

| Document format / content type | Extracted metadata | Processing details |
| --- | --- | --- |
| HTML (text/html) |`metadata_content_encoding`<br/>`metadata_content_type`<br/>`metadata_language`<br/>`metadata_description`<br/>`metadata_keywords`<br/>`metadata_title` |Strip HTML markup and extract text |
| PDF (application/pdf) |`metadata_content_type`<br/>`metadata_language`<br/>`metadata_author`<br/>`metadata_title` |Extract text, including embedded documents (excluding images) |
| DOCX (application/vnd.openxmlformats-officedocument.wordprocessingml.document) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Extract text, including embedded documents |
| DOC (application/msword) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Extract text, including embedded documents |
| DOCM (application/vnd.ms-word.document.macroenabled.12) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Extract text, including embedded documents |
| WORD XML (application/vnd.ms-word2006ml) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Strip XML markup and extract text |
| WORD 2003 XML (application/vnd.ms-wordml) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date` |Strip XML markup and extract text |
| XLSX (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` |Extract text, including embedded documents |
| XLS (application/vnd.ms-excel) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` |Extract text, including embedded documents |
| XLSM (application/vnd.ms-excel.sheet.macroenabled.12) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` |Extract text, including embedded documents |
| PPTX (application/vnd.openxmlformats-officedocument.presentationml.presentation) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_slide_count`<br/>`metadata_title` |Extract text, including embedded documents |
| PPT (application/vnd.ms-powerpoint) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_slide_count`<br/>`metadata_title` |Extract text, including embedded documents |
| PPTM (application/vnd.ms-powerpoint.presentation.macroenabled.12) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_slide_count`<br/>`metadata_title` |Extract text, including embedded documents |
| MSG (application/vnd.ms-outlook) |`metadata_content_type`<br/>`metadata_message_from`<br/>`metadata_message_from_email`<br/>`metadata_message_to`<br/>`metadata_message_to_email`<br/>`metadata_message_cc`<br/>`metadata_message_cc_email`<br/>`metadata_message_bcc`<br/>`metadata_message_bcc_email`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_subject` |Extract text, including text extracted from attachments. `metadata_message_to_email`, `metadata_message_cc_email` and `metadata_message_bcc_email` are string collections, the rest of the fields are strings.|
| ODT (application/vnd.oasis.opendocument.text) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Extract text, including embedded documents |
| ODS (application/vnd.oasis.opendocument.spreadsheet) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` |Extract text, including embedded documents |
| ODP (application/vnd.oasis.opendocument.presentation) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`title` |Extract text, including embedded documents |
| ZIP (application/zip) |`metadata_content_type` |Extract text from all documents in the archive |
| GZ (application/gzip) |`metadata_content_type` |Extract text from all documents in the archive |
| EPUB (application/epub+zip) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_title`<br/>`metadata_description`<br/>`metadata_language`<br/>`metadata_keywords`<br/>`metadata_identifier`<br/>`metadata_publisher` |Extract text from all documents in the archive |
| XML (application/xml) |`metadata_content_type`<br/>`metadata_content_encoding`<br/> |Strip XML markup and extract text |
| JSON (application/json) |`metadata_content_type`<br/>`metadata_content_encoding` |Extract text<br/>NOTE: If you need to extract multiple document fields from a JSON blob, see [Indexing JSON blobs](search-howto-index-json-blobs.md) for details |
| EML (message/rfc822) |`metadata_content_type`<br/>`metadata_message_from`<br/>`metadata_message_to`<br/>`metadata_message_cc`<br/>`metadata_creation_date`<br/>`metadata_subject` |Extract text, including attachments |
| RTF (application/rtf) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_page_count`<br/>`metadata_word_count`<br/> | Extract text|
| Plain text (text/plain) |`metadata_content_type`<br/>`metadata_content_encoding`<br/> | Extract text|

## See also

* [Indexers in Azure Cognitive Search](search-indexer-overview.md)
* [Understand blobs using AI](search-blob-ai-integration.md)
* [Blob indexing overview](search-blob-storage-integration.md)
* [SharePoint Online indexing](search-howto-index-sharepoint-online.md)