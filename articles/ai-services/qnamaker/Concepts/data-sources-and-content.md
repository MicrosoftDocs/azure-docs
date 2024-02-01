---
title: Data sources and content types - QnA Maker
description: Learn how to import question and answer pairs from data sources and supported content types, which include many standard structured documents such as PDF, DOCX, and TXT - QnA Maker.
ms.service: azure-ai-language
manager: nitinme
ms.author: jboback
author: jboback
ms.subservice: azure-ai-qna-maker
ms.topic: conceptual
ms.date: 12/19/2023
---

# Importing from data sources

A knowledge base consists of question and answer pairs brought in by public URLs and files.

[!INCLUDE [Custom question answering](../includes/new-version.md)]

## Data source locations

Content is brought into a knowledge base from a data source. Data source locations are **public URLs or files**, which do not require authentication.

[SharePoint files](../how-to/add-sharepoint-datasources.md), secured with authentication, are the exception. SharePoint resources must be files, not web pages. 

QnA Maker supports public URLs ending with a .ASPX web extension which are not secured with authentication.

## Chit-chat content

The chit-chat content set is offered as a complete content data source in several languages and conversational styles. This can be a starting point for your bot's personality, and it will save you the time and cost of writing them from scratch. Learn [how to add chit-chat content](../how-to/chit-chat-knowledge-base.md) to your knowledge base.

## Structured data format through import

Importing a knowledge base replaces the content of the existing knowledge base. Import requires a structured `.tsv` file that contains questions and answers. This information helps QnA Maker group the question-answer pairs and attribute them to a particular data source.

| Question  | Answer  | Source| Metadata (1 key: 1 value) |
|-----------|---------|----|---------------------|
| Question1 | Answer1 | Url1 | <code>Key1:Value1 &#124; Key2:Value2</code> |
| Question2 | Answer2 | Editorial|    `Key:Value`       |

## Structured multi-turn format through import

You can create the multi-turn conversations in a `.tsv` file format. The format provides you with the ability to create the multi-turn conversations by analyzing previous chat logs (with other processes, not using QnA Maker), then create the `.tsv` file through automation. Import the file to replace the existing knowledge base.

> [!div class="mx-imgBorder"]
> ![Conceptual model of 3 levels of multi-turn question](../media/qnamaker-concepts-knowledgebase/nested-multi-turn.png)

The column for a multi-turn `.tsv`, specific to multi-turn is **Prompts**. An example `.tsv`, shown in Excel, show the information to include to define the multi-turn children:

```JSON
[
    {"displayOrder":0,"qnaId":2,"displayText":"Level 2 Question A"},
    {"displayOrder":0,"qnaId":3,"displayText":"Level 2 - Question B"}
]
```

The **displayOrder** is numeric and the **displayText** is text that shouldn't include markdown.

> [!div class="mx-imgBorder"]
> ![Multi-turn question example as shown in Excel](../media/qnamaker-concepts-knowledgebase/multi-turn-tsv-columns-excel-example.png)

## Export as example

If you are unsure how to represent your QnA pair in the `.tsv` file:
* Use this [downloadable example from GitHub](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/Structured-multi-turn-format.xlsx?raw=true)
* Or create the pair in the QnA Maker portal, save, then export the knowledge base for an example of how to represent the pair.

## Unstructured data format 

You can also create a knowledge base based on unstructured content imported via a file. Currently this functionality is available only via document upload for documents that are in any of the supported file formats.

> [!IMPORTANT]
> The support for unstructured content via file upload is available only in [question answering](../../language-service/question-answering/overview.md).

## Content types of documents you can add to a knowledge base
Content types include many standard structured documents such as PDF, DOC, and TXT.

### File and URL data types

The table below summarizes the types of content and file formats that are supported by QnA Maker.

|Source Type|Content Type| Examples|
|--|--|--|
|URL|FAQs<br> (Flat, with sections or with a topics homepage)<br>Support pages <br> (Single page how-to articles, troubleshooting articles etc.)|[Plain FAQ](../troubleshooting.md), <br>[FAQ with links](https://www.microsoft.com/microsoft-365/microsoft-365-for-home-and-school-faq),<br> [FAQ with topics homepage](https://www.microsoft.com/Licensing/servicecenter/Help/Faq.aspx)<br>[Support article](./best-practices.md)|
|PDF / DOC|FAQs,<br> Product Manual,<br> Brochures,<br> Paper,<br> Flyer Policy,<br> Support guide,<br> Structured QnA,<br> etc.|**Without Multi-turn**<br>[Structured QnA.docx](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/structured.docx),<br> [Sample Product Manual.pdf](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/product-manual.pdf),<br> [Sample semi-structured.docx](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/semi-structured.docx),<br> [Sample white paper.pdf](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/white-paper.pdf),<br> [Unstructured blog.pdf](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/Introducing-surface-laptop-4-and-new-access.pdf),<br> [Unstructured white paper.pdf](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/sample-unstructured-paper.pdf)<br><br>**Multi-turn**:<br>[Surface Pro (docx)](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/multi-turn.docx)<br>[Contoso Benefits (docx)](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/Multiturn-ContosoBenefits.docx)<br>[Contoso Benefits (pdf)](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/Multiturn-ContosoBenefits.pdf)|
|*Excel|Structured QnA file<br> (including RTF, HTML support)|**Without Multi-turn**:<br>[Sample QnA FAQ.xls](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/QnA%20Maker%20Sample%20FAQ.xlsx)<br><br>**Multi-turn**:<br>[Structured simple FAQ.xls](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/Structured-multi-turn-format.xlsx)<br>[Surface laptop FAQ.xls](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/Multiturn-Surface-Pro.xlsx)|
|*TXT/TSV|Structured QnA file|[Sample chit-chat.tsv](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/Scenario_Responses_Friendly.tsv)|

If you need authentication for your data source, consider the following methods to get that content into QnA Maker:

* Download the file manually and import into QnA Maker
* Add the file from authenticated [SharePoint location](../how-to/add-sharepoint-datasources.md)

### URL content

Two types of documents can be imported via **URL** in QnA Maker:

* FAQ URLs
* Support URLs

Each type indicates an expected format.

### File-based content

You can add files to a knowledge base from a public source, or your local file system, in the [QnA Maker portal](https://www.qnamaker.ai).

### Content format guidelines

Learn more about the [format guidelines](../reference-document-format-guidelines.md) for the different files.

## Next steps

Learn how to [edit QnAs](../how-to/edit-knowledge-base.md).
