---
title: Content types - QnA Maker
description: Content types include many standard structured documents such as PDF, DOC, and TXT.
services: cognitive-services
ms.topic: conceptual
ms.date: 01/27/2020
---

# Content types of documents you can add to a knowledge base
Content types include many standard structured documents such as PDF, DOC, and TXT.

## File and URL data types

The table below summarizes the types of content and file formats that are supported by QnA Maker.

|Source Type|Content Type| Examples|
|--|--|--|
|URL|FAQs<br> (Flat, with sections or with a topics homepage)<br>Support pages <br> (Single page how-to articles, troubleshooting articles etc.)|[Plain FAQ](https://docs.microsoft.com/azure/cognitive-services/qnamaker/faqs), <br>[FAQ with links](https://www.microsoft.com/en-us/software-download/faq),<br> [FAQ with topics homepage](https://www.microsoft.com/Licensing/servicecenter/Help/Faq.aspx)<br>[Support article](https://docs.microsoft.com/azure/cognitive-services/qnamaker/concepts/best-practices)|
|PDF / DOC|FAQs,<br> Product Manual,<br> Brochures,<br> Paper,<br> Flyer Policy,<br> Support guide,<br> Structured QnA,<br> etc.|**Without Multi-turn**<br>[Structured QnA.doc](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/structured.docx),<br> [Sample Product Manual.pdf](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/product-manual.pdf),<br> [Sample semi-structured.doc](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/semi-structured.docx),<br> [Sample white paper.pdf](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/white-paper.pdf),<br><br>**Multi-turn**:<br>[Surface Pro (docx)](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/multi-turn.docx)<br>[Contoso Benefits (docx)](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/Multiturn-ContosoBenefits.docx)<br>[Contoso Benefits (pdf)](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/Multiturn-ContosoBenefits.pdf)|
|*Excel|Structured QnA file<br> (including RTF, HTML support)|[Sample QnA FAQ.xls](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/QnA%20Maker%20Sample%20FAQ.xlsx)|
|*TXT/TSV|Structured QnA file|[Sample chit-chat.tsv](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/Scenario_Responses_Friendly.tsv)|

If you need authentication for your data source, consider the following methods to get that content into QnA Maker:

* Download file manually and import into QnA Maker
* Add file from authenticated [Sharepoint location](../how-to/add-sharepoint-datasources.md)

## URL content

Two types of documents can be imported via **URL** in QnA Maker:

* FAQ URLs
* Support URLs

Each type indicates an expected format.

## File-based content

You can add files to a knowledge base from a public source, or your local file system, in the [QnA Maker portal](https://www.qnamaker.ai).

## Content format guidelines

QnA Maker adds file and URL content, converting the content into QnA sets, stored as markdown (`.md`). Content is fit for a knowledge base where the content is organized in some structured form, and is represented in well-defined sections. The sections can further be broken into subsections, or subtopics. Extraction works best on content that has a clear structure with hierarchical headings.

QnA Maker identifies sections and subsections and relationships in the content based on visual clues like font size, font style, numbering, colors, etc. Semi-structured content includes manuals, FAQs, guidelines, policies, brochures, flyers, and many other types of files.

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

### Structured QnA document

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

## Formatting considerations

After importing a file or URL, QnA Maker converts and stores your content in the [markdown format](https://en.wikipedia.org/wiki/Markdown). The conversion process adds new lines in the text, such as `\n\n`. A knowledge of the markdown format helps you to understand the converted content and manage your knowledge base content.

If you add or edit your content directly in your knowledge base, use **markdown formatting** to create rich text content or change the markdown format content that is already in the answer. QnA Maker supports much of the markdown format to bring rich text capabilities to your content. However, the client application, such as a chat bot may not support the same set of markdown formats. It is important to test the client application's display of answers.

Learn more from the [QnA Maker markdown reference documentation](../reference-markdown-format.md).

## Testing your Markdown

Use the **[CommonMark](https://commonmark.org/help/tutorial/index.html)** tutorial to validate your Markdown. The tutorial has a **Try it** feature for quick copy/paste validation.

## Next steps

* Understand how to design and manage [question and answer (QnA) sets](question-answer-set.md)