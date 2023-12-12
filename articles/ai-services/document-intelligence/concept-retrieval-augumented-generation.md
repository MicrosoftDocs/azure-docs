---
title: Retrieval Augmented Generation (RAG) with Azure AI Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Introduction to how semantic chunking can help with Retrieval Augmented Generation (RAG) implementation using Azure AI Document Intelligence Layout model.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 12/11/2023
ms.author: lajanuar
monikerRange: '>=doc-intel-3.0.0'
---

# Retrieval Augmented Generation with Azure AI Document Intelligence

[!INCLUDE [applies to v4.0, v3.1 and v3.0](includes/applies-to-v-4-0-v3-1-v3-0.md)]

Retrieval Augmented Generation (RAG) is an AI solution that combines a pretrained Large Language Model (LLM) like ChatGPT with an external data retrieval system to generate an enhanced response incorporating new data outside of the original training data. Adding an information retrieval system enable you to chat with your documents, generate captivating content, and access the power of Azure OpenAI models for your data and gives you control over the data used by an LLM as it formulates a response.

## What is semantic chunking?

Long sentences pose a challenge for natural language processing (NLP) applications. The goal of semantic chunking is to find semantically contained fragments of a sentence representation that can be processed independently and recombined without loss of information.Enterprise documents are usually long and complex, though LLM can take in more context recently, a good chunking strategy is still required to divide them into smaller pieces that can be more efficient in storage and retrieval, as well as enhancing the relevance and interpretability of the results. However, most chunking strategy in RAG today is still based on text length without much consideration on document structure. There's a high demand for semantic chunking – so how do you divide a large body of texts or documents into smaller, meaningful chunks based on semantic content rather than arbitrary splits?

Semantic chunking is a technique ext chunking is a technique in natural language processing that divides text into smaller segments, usually based on the parts of speech and grammatical meanings of the words. Text chunking can help extract important information from a text, such as noun phrases, verb phrases, or other semantic units.that divides a document into smaller chunks based on the semantic content of the document. It is a key component in RAG implementation as it can help to improve the relevance and interpretability of the results. For example, if you are looking for a specific section in a document, you can use semantic chunking to divide the document into smaller chunks based on the section headers. This can help you to find the section you are looking for more quickly and easily.

Markdown is a popular input used to enable semantic chunking in RAG (Retrieval augmented generation). You can use the markdown content from Layout to split documents based on paragraph boundaries, create specific chunks for tables and fine-tune your chunking strategy to improve the quality of the generated responses.

### Benefits of using semantic chunking
- **Efficient storage and retrieval** – Relevant "semantic units" of information can be stored & fetched as opposed to arbitrary snippets.
- **Improved relevance** – Retrieve passages that are contextually and semantically relevant to the query.
- **Enhanced interpretability** – Interpretable as standalone pieces of information aids in transparency and traceability of the generated responses

## Semantic chunking with Azure AI Document Intelligence Layout model

The Azure AI Document Intelligence [Layout model](concept-layout.md) offers a comprehensive solution for semantic chunking by providing advanced content extraction and document structure analysis capabilities. With this model, you can easily extract paragraphs, tables, titles, section headings, selection marks, font/style, key-value pairs, math formulas, QR code/barcode and more from various document types. The extracted information can be conveniently outputted to markdown format, enabling you to define your semantic chunking strategy based on the provided building blocks.

:::image type="content" source="media/rag.png" alt-text="Semantic chunking in RAG with Azure AI Document Intelligence":::

### Benefits of using the Layout model
- **Simplified process** – You can parse different document types, such as digital and scanned PDFs, images, office files (docx, xlsx, pptx), and html, with just a single API call.
- **Scalability and AI quality** – The model is highly scalable in Optical Character Recognition (OCR), table extraction, document structure analysis (e.g., paragraphs, titles, section headings), and reading order detection, ensuring high-quality results driven by AI capabilities. It supports [309 printed and 12 handwritten languages](language-support-ocr.md#model-id-prebuilt-layout).
- **LLM compatibility** – The output format is LLM friendly, specifically markdown, which facilitates seamless integration into your workflows. You can turn any table in a document into markdown format, which will save lots of effort parsing the documents to make LLM better understand them.

:::image type="content" source="media/layout-markdown.png" alt-text="Layout model can detect document structures and output to markdown.":::

:::image type="content" source="media/layout-table.png" alt-text="Layout model can extract tables from your document.":::

## Get started with Azure AI Document Intelligence

### Studio
Follow the [Studio quickstart](quickstarts/try-document-intelligence-studio.md) to use our UI to explore and understand the capabilities. You can then integrate with your own application using the sample code provided. For RAG, start with the [Layout model](https://documentintelligence.ai.azure.com/studio/layout).

- Choose **Analyze options** required:

:::image type="content" source="media/analyze-option-studio.png" alt-text="Select analyze options required for RAG on Studio.":::

- Click on **Run analysis** and view the output, sample code on the right pane:

:::image type="content" source="media/layout-analyze-markdown.png" alt-text="View the markdown output from Layout model on Studio.":::

### SDK and REST API
Follow the [quickstart](quickstarts/get-started-sdks-rest-api.md) to use your preferred SDK or REST API to textract content and structure from documents.

You can also check out our [sample repo](https://github.com/microsoft/Form-Recognizer-Toolkit/tree/main/SampleCode) on how to turn on the markdown output for the Layout model, extract tables, and more.

## Build document chat with semantic chunking
- [Azure OpenAI service on your data](../openai/concepts/use-your-data) uses the Azure AI Document Intelligence layout model to ingest the data. It chunks long document based on table tables and paragraphs. You can also customize your chunking strategy based with these [scripts](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main/scripts).
 
- Azure AI Document Intelligence is now integrated with Langchain as one of its document loaders. You can use it to easily load the data, output to markdown format, and then use This [cookbook]() shows a simple demo for RAG pattern with Azure AI Document Intelligence as document loader and Azure Search as retriever in Langchain.

```
from langchain.document_loaders.doc_intelligence import DocumentIntelligenceLoader

from langchain.text_splitter import MarkdownHeaderTextSplitter

# Initiate Azure AI Document Intelligence to load the document and split it into chunks

loader = DocumentIntelligenceLoader(file_path=<your file path>, api_key = doc_intelligence_key, api_endpoint = doc_intelligence_endpoint)
docs = loader.load()

# text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
headers_to_split_on = [
    ("#", "Header 1"),
    ("##", "Header 2"),
    ("###", "Header 3"),
]
text_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)

splits = text_splitter.split_text(docs_string)
splits
```

- This [solution accelerator](https://github.com/Azure-Samples/chat-with-your-data-solution-accelerator) demonstrates an end-to-end baseline RAG pattern sample that uses Azure AI Search as a retriever and Azure AI Document Intelligence for document loading and semantic chunking.

# Next steps
- Learn more about [Azure AI Document Intelligence](overview.md).

- [Learn how to process your own forms and documents](quickstarts/try-document-intelligence-studio.md) with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio).

- Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.
