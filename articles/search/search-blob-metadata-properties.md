---
title: Content metadata properties
titleSuffix: Azure Cognitive Search
description: Metadata properties can provide content to fields in a search index. This article lists metadata properties supported in Azure Cognitive Search.
author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/08/2023
---

# Content metadata properties used in Azure Cognitive Search

Several of the indexer-supported data sources, including Azure Blob Storage, Azure Data Lake Storage Gen2, and SharePoint, contain standalone files or embedded objects of various content types. Many of those content types have metadata properties that can be useful to index. Just as you can create search fields for standard blob properties like **`metadata_storage_name`**, you can create fields in a search index for metadata properties that are specific to a document format.

## Supported document formats

Cognitive Search supports blob indexing and SharePoint document indexing for the following document formats:

[!INCLUDE [search-blob-data-sources](../../includes/search-blob-data-sources.md)]

## Properties by document format

The following table summarizes processing done for each document format, and describes the metadata properties extracted by a blob indexer and the SharePoint indexer.

| Document format / content type | Extracted metadata | Processing details |
| --- | --- | --- |
| CSV (text/csv) |`metadata_content_type`<br/>`metadata_content_encoding`<br/> | Extract text<br/>NOTE: If you need to extract multiple document fields from a CSV blob, see [Indexing CSV blobs](search-howto-index-csv-blobs.md) for details |
| DOC (application/msword) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Extract text, including embedded documents |
| DOCM (application/vnd.ms-word.document.macroenabled.12) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Extract text, including embedded documents |
| DOCX (application/vnd.openxmlformats-officedocument.wordprocessingml.document) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Extract text, including embedded documents |
| EML (message/rfc822) |`metadata_content_type`<br/>`metadata_message_from`<br/>`metadata_message_to`<br/>`metadata_message_cc`<br/>`metadata_creation_date`<br/>`metadata_subject` |Extract text, including attachments |
| EPUB (application/epub+zip) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_title`<br/>`metadata_description`<br/>`metadata_language`<br/>`metadata_keywords`<br/>`metadata_identifier`<br/>`metadata_publisher` |Extract text from all documents in the archive |
| GZ (application/gzip) |`metadata_content_type` |Extract text from all documents in the archive |
| HTML (text/html or application/xhtml+xml) |`metadata_content_encoding`<br/>`metadata_content_type`<br/>`metadata_language`<br/>`metadata_description`<br/>`metadata_keywords`<br/>`metadata_title` |Strip HTML markup and extract text |
| JSON (application/json) |`metadata_content_type`<br/>`metadata_content_encoding` |Extract text<br/>NOTE: If you need to extract multiple document fields from a JSON blob, see [Indexing JSON blobs](search-howto-index-json-blobs.md) for details |
| KML (application/vnd.google-earth.kml+xml) |`metadata_content_type`<br/>`metadata_content_encoding`<br/>`metadata_language`<br/> |Strip XML markup and extract text |
| MSG (application/vnd.ms-outlook) |`metadata_content_type`<br/>`metadata_message_from`<br/>`metadata_message_from_email`<br/>`metadata_message_to`<br/>`metadata_message_to_email`<br/>`metadata_message_cc`<br/>`metadata_message_cc_email`<br/>`metadata_message_bcc`<br/>`metadata_message_bcc_email`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_subject` |Extract text, including text extracted from attachments. `metadata_message_to_email`, `metadata_message_cc_email` and `metadata_message_bcc_email` are string collections, the rest of the fields are strings.|
| ODP (application/vnd.oasis.opendocument.presentation) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_title` |Extract text, including embedded documents |
| ODS (application/vnd.oasis.opendocument.spreadsheet) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` |Extract text, including embedded documents |
| ODT (application/vnd.oasis.opendocument.text) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Extract text, including embedded documents |
| PDF (application/pdf) |`metadata_content_type`<br/>`metadata_language`<br/>`metadata_author`<br/>`metadata_title`<br/>`metadata_creation_date` |Extract text, including embedded documents (excluding images) |
| Plain text (text/plain) |`metadata_content_type`<br/>`metadata_content_encoding`<br/>`metadata_language`<br/> | Extract text|
| PPT (application/vnd.ms-powerpoint) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_slide_count`<br/>`metadata_title` |Extract text, including embedded documents |
| PPTM (application/vnd.ms-powerpoint.presentation.macroenabled.12) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_slide_count`<br/>`metadata_title` |Extract text, including embedded documents |
| PPTX (application/vnd.openxmlformats-officedocument.presentationml.presentation) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_slide_count`<br/>`metadata_title` |Extract text, including embedded documents |
| RTF (application/rtf) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count`<br/> | Extract text|
| WORD 2003 XML (application/vnd.ms-wordml) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date` |Strip XML markup and extract text |
| WORD XML (application/vnd.ms-word2006ml) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Strip XML markup and extract text |
| XLS (application/vnd.ms-excel) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` |Extract text, including embedded documents |
| XLSM (application/vnd.ms-excel.sheet.macroenabled.12) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` |Extract text, including embedded documents |
| XLSX (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` |Extract text, including embedded documents |
| XML (application/xml) |`metadata_content_type`<br/>`metadata_content_encoding`<br/>`metadata_language`<br/> |Strip XML markup and extract text |
| ZIP (application/zip) |`metadata_content_type` |Extract text from all documents in the archive |

## See also

* [Indexers in Azure Cognitive Search](search-indexer-overview.md)
* [AI enrichment overview](cognitive-search-concept-intro.md)
* [Blob indexing overview](search-blob-storage-integration.md)
* [SharePoint indexing](search-howto-index-sharepoint-online.md)
