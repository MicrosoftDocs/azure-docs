---
title: Document formats and naming conventions - Custom Translator
titleSuffix: Azure Cognitive Services
description: This is a guide on document formats and naming convention in Custom Translator. This concept helps to manage documents names better abd avoid naming conflicts.
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 05/26/2020
ms.author: swmachan
ms.topic: conceptual
#Customer intent: As a Custom Translator user, I want to understand how to format and name my documents.
---

# Document formats and naming convention guidance

Any file used for custom translation must be at least **four** characters in length.

This table includes all supported file formats that you can use to build your translation system:

| Format            | Extensions   | Description                                                                                                                                                                                                                                                                    |
|-------------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| XLIFF             | .XLF, .XLIFF | A parallel document format, export of Translation Memory systems. The languages used are defined inside the file.                                                                                                                                                              |
| TMX               | .TMX         | A parallel document format, export of Translation Memory systems. The languages used are defined inside the file.                                                                                                                                                              |
| ZIP               | .ZIP         | ZIP is an archive file format.                                                                                                                                                                                                        |
| Locstudio         | .LCL         | A Microsoft format for parallel documents                                                                                                                                                                                                                                      |
| Microsoft Word    | .DOCX        | Microsoft Word document                                                                                                                                                                                                                                                        |
| Adobe Acrobat     | .PDF         | Adobe Acrobat portable document                                                                                                                                                                                                                                                |
| HTML              | .HTML, .HTM  | HTML document                                                                                                                                                                                                                                                                  |
| Text file         | .TXT         | UTF-16 or UTF-8 encoded text files. The file name must not contain Japanese characters.                                                                                                                                                                                        |
| Aligned text file | .ALIGN       | The extension `.ALIGN` is a special extension that you can use if you know that the sentences in the document pair are perfectly aligned. If you provide a `.ALIGN` file, Custom Translator will not align the sentences for you. |
| Excel file        | .XLSX        | Excel file (2013 or later). First line/ row of the spreadsheet should be language code.                                                                                                                                                                                                                                                      |

## Dictionary formats

For dictionaries, Custom Translator supports all file formats that are supported for training sets. If you are using an Excel dictionary, the first line/ row of the spreadsheet should be language codes.

## Zip file formats

Documents can be grouped into a single zip file and uploaded. The Custom Translator supports zip file formats (ZIP, GZ, and TGZ).

Each document in the zip file with the extension TXT, HTML, HTM, PDF, DOCX, ALIGN must follow this naming convention:

{document name}\_{language code}
where {document name} is the name of your document, {language code} is the ISO LanguageID (two characters), indicating that the document contains sentences in that language. There must be an underscore (_) before the language code.

For example, to upload two parallel documents within a zip for an English to
Spanish system, the files should be named "data_en" and "data_es".

Translation Memory files (TMX, XLF, XLIFF, LCL, XLSX) are not required to follow the specific language naming convention.  

## Next steps

- Read about the [project](workspace-and-project.md#what-is-a-custom-translator-project) to create and manage them.
