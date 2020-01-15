---
title: Data sources supported - QnA Maker
titleSuffix: Azure Cognitive Services
description: QnA Maker automatically extracts question-answer pairs stored as web pages, PDF files, or MS Word doc files or structured QnA content files.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: conceptual
ms.date: 01/09/2020
ms.author: diberry
---

# Data sources for QnA Maker content

QnA Maker automatically extracts question-answer pairs from  semi-structured content such as FAQs, product manuals, guidelines, support documents, and policies stored as web pages, PDF files, or MS Word doc files    . Content can also be added to the knowledge base from structured QnA content files.

<a name="data-types"></a>

## File and URL data types

The table below summarizes the types of content and file formats that are supported by QnA Maker.

|Source Type|Content Type| Examples|
|--|--|--|
|URL|FAQs<br> (Flat, with sections or with a topics homepage)<br>Support pages <br> (Single page how-to articles, troubleshooting articles etc.)|[Plain FAQ](https://docs.microsoft.com/azure/cognitive-services/qnamaker/faqs), <br>[FAQ with links](https://www.microsoft.com/en-us/software-download/faq),<br> [FAQ with topics homepage](https://www.microsoft.com/Licensing/servicecenter/Help/Faq.aspx)<br>[Support article](https://docs.microsoft.com/azure/cognitive-services/qnamaker/concepts/best-practices)|
|PDF / DOC|FAQs,<br> Product Manual,<br> Brochures,<br> Paper,<br> Flyer Policy,<br> Support guide,<br> Structured QnA,<br> etc.|[Structured QnA.doc](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/structured.docx),<br> [Sample Product Manual.pdf](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/product-manual.pdf),<br> [Sample semi-structured.doc](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/semi-structured.docx),<br> [Sample white paper.pdf](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/white-paper.pdf),<br>[Sample multi-turn.docx](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/multi-turn.docx)|
|*Excel|Structured QnA file<br> (including RTF, HTML support)|[Sample QnA FAQ.xls](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/QnA%20Maker%20Sample%20FAQ.xlsx)|
|*TXT/TSV|Structured QnA file|[Sample chit-chat.tsv](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/Scenario_Responses_Friendly.tsv)|

### Import and export knowledge base

**TSV and XLS files**, from exported knowledge bases, can only be used by importing the files from the **Settings** page in the QnA Maker portal. They can't be used as data sources during knowledge base creation or from the **+ Add file** or **+ Add URL** feature on the **Settings** page.

## Data source locations

Data source locations are **public URLs or files**, which do not require authentication.

If you need authentication for your data source, consider the following methods to get that data into QnA Maker:

* [Download file manually](#download-file-from-authenticated-data-source-location) and import into QnA Maker
* Import file for authenticated [Sharepoint location](#import-file-from-authenticated-sharepoint)

### Download file from authenticated data source location

If you have an authenticated file (not on an authenticated Sharepoint location) or URL, an alternative option is to download the file from the authenticated site to your local computer, then add the file from your local computer to the knowledge base.

### Import file from authenticated Sharepoint

[Sharepoint data source locations](../How-to/add-sharepoint-datasources.md) are allowed to provide authenticated **files**. Sharepoint resources must be files, not web pages. If the URL ends with a web extension, such as **.ASPX**, it will not import into QnA Maker from Sharepoint.


## FAQ URLs

QnA Maker can support FAQ web pages in 3 different forms: Plain FAQ pages, FAQ pages with links, FAQ pages with a Topics Homepage.

### Plain FAQ pages

This is the most common type of FAQ page, in which the answers immediately follow the questions in the same page.

Below is an example of a plain FAQ page:

![Plain FAQ page example for a knowledge base](../media/qnamaker-concepts-datasources/plain-faq.png)


### FAQ pages with links

In this type of FAQ page, questions are aggregated together and are linked to answers that are either in different sections of the same page, or in different pages.

Below is an example of an FAQ page with links in sections that are on the same page:

 ![Section Link FAQ page example for a knowledge base](../media/qnamaker-concepts-datasources/sectionlink-faq.png)


### FAQ pages with a Topics homepage

This type of FAQ has a home page with the Topics where each Topic is a link to its relevant QnAs in a different page. Here, QnA Maker crawls all the linked pages to extract the corresponding questions & answers.

Below is an example of an FAQ page where a topics homepage has links to FAQ sections in different pages.

 ![Deep link FAQ page example for a knowledge base](../media/qnamaker-concepts-datasources/topics-faq.png)


### Support Urls

QnA Maker can process semi-structured support web pages, such as web articles that would describe how to perform a given task, how to diagnose and resolve a given problem, and what are the best practices for a given process. Extraction works best on content that has a clear structure with hierarchical headings.

> [!NOTE]
> Extraction for support articles is a new feature and is in early stages. It works best for simple pages, that are well structured, and do not contain complex headers/footers.

![QnA Maker supports extraction from semi-structured web pages where a clear structure is presented with hierarchical headings](../media/qnamaker-concepts-datasources/support-web-pages-with-heirarchical-structure.png)


## PDF/ DOC files

QnA Maker can process semi-structured content in a PDF or DOC file, and convert it into QnAs. A good file that can be extracted well is one where content is organized in some structured form, and is represented in well-defined sections. The sections can further be broken inTO subsections, or subtopics. Extraction works best on documents that have a clear structure with hierarchical headings.

QnA Maker identifies sections and subsections and relationships in the file based on visual clues like font size, font style, numbering, colors, etc. Semi-structured PDF or DOC files could be Manuals, FAQs, Guidelines, Policies, Brochures, Flyers, and many other types of files. Below are some example types of these files.

### Product manuals

A manual is typically guidance material that accompanies a product. It helps the user to set up, use, maintain, and troubleshoot the product. When QnA Maker processes a manual, it extracts the headings and subheadings as questions and the subsequent content as answers. See an example [here](https://download.microsoft.com/download/2/9/B/29B20383-302C-4517-A006-B0186F04BE28/surface-pro-4-user-guide-EN.pdf).

Below is an example of a manual with an index page, and hierarchical content

 ![Product Manual example for a knowledge base](../media/qnamaker-concepts-datasources/product-manual.png)

> [!NOTE]
> Extraction works best on manuals that have a table of contents and/or an index page, and a clear structure with hierarchical headings.

### Brochures, guidelines, papers, and other files

Many other types of documents can also be processed to generate QA pairs, provided they have a clear structure and layout. These include: Brochures, guidelines, reports, white papers, scientific papers, policies, books, etc. See an example [here](https://qnamakerstore.blob.core.windows.net/qnamakerdata/docs/Manage%20Azure%20Blob%20Storage.docx).

Below is an example of a semi-structured doc, without an index:

 ![Azure Blob storage semi-structured Doc](../media/qnamaker-concepts-datasources/semi-structured-doc.png)

### Structured QnA Document

The format for structured Question-Answers in DOC files, is in the form of alternating Questions and Answers per line, one question per line followed by its answer in the following line, as shown below:

```text
Question1

Answer1

Question2

Answer2
```

Below is an example of a structured QnA word document:

 ![Structured QnA document example for a knowledge base](../media/qnamaker-concepts-datasources/structured-qna-doc.png)

## Structured *TXT*, *TSV* and *XLS* Files

QnAs in the form of structured *.txt*, *.tsv* or *.xls* files can also be uploaded to QnA Maker to create or augment a knowledge base.  These can either be plain text, or can have content in RTF or HTML.

| Question  | Answer  | Metadata (1 key: 1 value) |
|-----------|---------|-------------------------|
| Question1 | Answer1 | <code>Key1:Value1 &#124; Key2:Value2</code> |
| Question2 | Answer2 |      `Key:Value`           |

Any additional columns in the source file are ignored.

### Example of structured Excel file

Below is an example of a structured QnA *.xls* file, with HTML content:

 ![Structured QnA excel example for a knowledge base](../media/qnamaker-concepts-datasources/structured-qna-xls.png)

### Example of alternate questions for single answer in Excel file

Below is an example of a structured QnA *.xls* file, with several alternate questions for a single answer:

 ![Example of alternate questions for single answer in Excel file](../media/qnamaker-concepts-datasources/xls-alternate-question-example.png)

After the file is imported, the question-and-answer pair is in the knowledge base as shown below:

 ![Screenshot of alternate questions for single answer imported into knowledge base](../media/qnamaker-concepts-datasources/xls-alternate-question-example-after-import.png)

## Structured data format through import

Importing a knowledge base replaces the content of the existing knowledge base. Import requires a structured .tsv file that contains data source information. This information helps QnA Maker group the question-answer pairs and attribute them to a particular data source.

| Question  | Answer  | Source| Metadata (1 key: 1 value) |
|-----------|---------|----|---------------------|
| Question1 | Answer1 | Url1 | <code>Key1:Value1 &#124; Key2:Value2</code> |
| Question2 | Answer2 | Editorial|    `Key:Value`       |

## Editorially add to knowledge base

If you do not have pre-existing content to populate the knowledge base, you can add QnAs editorially in QnA Maker Knowledge base. Learn how to update your knowledge base [here](../How-To/edit-knowledge-base.md).

<a href="#formatting-considerations"></a>

## Formatting considerations

After importing a file or URL, QnA Maker converts and stores your content in the [markdown format](https://en.wikipedia.org/wiki/Markdown). The conversion process adds new lines in the text, such as `\n\n`. A knowledge of the markdown format helps you to understand the converted content and manage your knowledge base content.

If you add or edit your content directly in your knowledge base, use **markdown formatting** to create rich text content or change the markdown format content that is already in the answer. QnA Maker supports much of the markdown format to bring rich text capabilities to your content. However, the client application, such as a chat bot may not support the same set of markdown formats. It is important to test the client application's display of answers.

Refer to the markdown examples provided in the [QnA Maker markdown reference](../reference-markdown-format.md) for more information.

## Editing your knowledge base locally

Once a knowledge base is created, it is recommended that you make edits to the knowledge base text in the [QnA Maker portal](https://qnamaker.ai), rather than exporting and reimporting through local files. However, there may be times that you need to edit a knowledge base locally.

Export the knowledge base from the **Settings** page, then edit the knowledge base with Microsoft Excel. If you choose to use another application to edit your exported TSV file, the application may introduce syntax errors because it is not fully TSV compliant. Microsoft Excel's TSV files generally don't introduce any formatting errors.

Once you are done with your edits, reimport the TSV file from the **Settings** page. This will completely replace the current knowledge base with the imported knowledge base.

## Testing your Markdown

Use the **[CommonMark](https://commonmark.org/help/tutorial/index.html)** tutorial to validate your Markdown. The tutorial has a **Try it** feature for quick copy/paste validation.

## Version control for data in your knowledge base

Version control for data is provided through the [import/export feature](development-lifecycle-knowledge-base.md#version-control-of-a-knowledge-base) on the **Settings** page.

## Next steps

> [!div class="nextstepaction"]
> [Set up a QnA Maker service](../How-To/set-up-qnamaker-service-azure.md)

## See also

[QnA Maker overview](../Overview/overview.md)
