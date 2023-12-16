---
title: Retrieval Augmented Generation (RAG) with Azure AI Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Introduction to how semantic chunking can help with Retrieval Augmented Generation (RAG) implementation using Azure AI Document Intelligence Layout model.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 12/15/2023
ms.author: lajanuar
monikerRange: '>=doc-intel-3.0.0'
---

# Retrieval Augmented Generation with Azure AI Document Intelligence

<!-- markdownlint-disable MD036 -->

**This content applies to:** ![checkmark](media/yes-icon.png) **v4.0 (preview)**

Retrieval Augmented Generation (RAG) is a document generative AI solution that combines a pretrained Large Language Model (LLM) like ChatGPT with an external data retrieval system to generate an enhanced response incorporating new data outside of the original training data. Adding an information retrieval system to your applications enables you to chat with your documents, generate captivating content, and access the power of Azure OpenAI models for your data. You also have more control over the data used by the LLM as it formulates a response.

## Azure AI Document Intelligence Layout model

The Document Intelligence [Layout model](concept-layout.md) is an advanced machine-learning based document analysis API. With semantic chunking, the layout model offers a comprehensive solution for advanced content extraction and document structure analysis capabilities. With the layout model, you can easily extract text and structural to divide large bodies of text into smaller, meaningful chunks based on semantic content rather than arbitrary splits. The extracted information can be conveniently outputted to Markdown format, enabling you to define your semantic chunking strategy based on the provided building blocks.

:::image type="content" source="media/rag/azure-rag-processing.png" alt-text="Screenshot depicting semantic chunking with RAG using Azure AI Document Intelligence":::

## Layout model and semantic chunking

Long sentences are challenging for natural language processing (NLP) applications. Especially when they're composed of multiple clauses, complex noun or verb phrases, relative clauses, and parenthetical groupings. Just like the human beholder, an NLP system also needs to successfully keep track of all the presented dependencies. The goal of semantic chunking is to find semantically coherent fragments of a sentence representation. These fragments can then be processed independently and recombined as semantic representations without loss of information, interpretation, or semantic relevance. The inherent meaning of the text is used as a guide for the chunking process.

Text data chunking strategies play a key role in optimizing the RAG response and performance. Fixed-sized and semantic are two distinct chunking methods:

* **Fixed-sized chunking**. Most chunking strategies used in RAG today are based on fix-sized text segments known as chunks. Fixed-sized chunking is quick, easy, and effective with text that doesn't have a strong semantic structure such as logs and data. However it isn't recommended for text that requires semantic understanding and precise context. The fixed-size nature of the window can result in severing words, sentences, or paragraphs impeding comprehension and disrupt the flow of information and understanding.

* **Semantic chunking**. This method divides the text into chunks based on semantic understanding. Division boundaries are focused on sentence subject and use significant computational algorithmically complex resources. However, it has the distinct advantage of maintaining semantic consistency within each chunk.  It's useful for text summarization, sentiment analysis, and document classification tasks. 

## Semantic chunking with Document Intelligence layout model

Markdown is a structured and formatted markup language and a popular input for enabling semantic chunking in RAG (Retrieval augmented generation). You can use the Markdown content from the [Layout model](concept-layout.md) to split documents based on paragraph boundaries, create specific chunks for tables, and fine-tune your chunking strategy to improve the quality of the generated responses.

### Benefits of using the layout model

* **Simplified processing**. You can parse different document types, such as digital and scanned PDFs, images, office files (docx, xlsx, pptx), and HTML, with just a single API call.

* **Scalability and AI quality**. The layout model is highly scalable in Optical Character Recognition (OCR), table extraction, and [document structure analysis](concept-layout.md#document-layout-analysis). It supports [309 printed and 12 handwritten languages](language-support-ocr.md#model-id-prebuilt-layout) further ensuring high-quality results driven by AI capabilities.

* **Large learning model (LLM) compatibility**. The layout model Markdown formatted output is LLM friendly and facilitates seamless integration into your workflows. You can turn any table in a document into Markdown format and avoid extensive effort parsing the documents for greater LLM understanding.

**Text image processed with Document Intelligence studio using layout model**

:::image type="content" source="media/rag/markdown-text-output.png" alt-text="Screenshot of newspaper article processed by layout model and outputted to Markdown.":::

**Table image processed with Document Intelligence studio using layout model**

:::image type="content" source="media/rag/markdown-table-output.png" alt-text="Screenshot of table processed by layout model and outputted to Markdown.":::

## Get started with semantic chunking

**Ready to begin?**

### Document Intelligence studio

You can follow the [Document Intelligence studio quickstart](quickstarts/try-document-intelligence-studio.md) to get started. Next, you can integrate Document Intelligence features with your own application using the sample code provided.

* Start with the [Layout model](https://documentintelligence.ai.azure.com/studio/layout). You need to select the following **Analyze options** to use RAG in the studio:

  **Required**

  * Run analysis range → **Current document**
  * Page range → **All pages**
  * Output format style → **Markdown**

  **Optional**

  * You can also select relevant optional detection parameters.

* Select **Save**.

:::image type="content" source="media/rag/rag-analyze-options.png" alt-text="Screenshot of Analyze options dialog window with RAG required options in the Document Intelligence studio.":::

* Next, select the **Run analysis** button to view the output.

:::image type="content" source="media/rag/run-analysis.png" alt-text="Screenshot of the Run Analysis button in the Document Intelligence Studio.":::

* The Markdown content is presented in the right-pane window:

:::image type="content" source="media/rag/markdown-content.png" alt-text="Screenshot of the layout model markdown output in the Document Intelligence Studio.":::

### SDK or REST API

* Follow the [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md) for your preferred programming language SDK or REST API. Use the layout model to extract content and structure from your documents.

* You can also check out GitHub repos for code samples and tips for analyzing a document in markdown output format.

  * [Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/documentintelligence/azure-ai-documentintelligence/samples/sample_analyze_documents_output_in_markdown.py)

  * [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/bb8a2bd8c6dc1883ee7308903b8220eab4b37596/sdk/documentintelligence/ai-document-intelligence-rest/README.md?plain=1#L154)

  * [Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/documentintelligence/azure-ai-documentintelligence/src/samples/java/com/azure/ai/documentintelligence/AnalyzeLayoutMarkdownOutput.java)

## Build document chat with semantic chunking

* [Azure OpenAI on your data](../openai/concepts/use-your-data.md) enables you to run supported chat on your documents.  Azure OpenAI on your data applies the Document Intelligence layout model to extract and parse document data by chunking long text based on tables and paragraphs. You can also customize your chunking strategy using [Azure OpenAI sample scripts](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main/scripts) located in our GitHub repo.

* Azure AI Document Intelligence is now integrated with [LangChain](https://python.langchain.com/docs/integrations/document_loaders/azure_document_intelligence) as one of its document loaders. You can use it to easily load the data and output to Markdown format. This [notebook](https://microsoft.github.io/SynapseML/docs/Explore%20Algorithms/AI%20Services/Quickstart%20-%20Document%20Question%20and%20Answering%20with%20PDFs/) shows a simple demo for RAG pattern with Azure AI Document Intelligence as document loader and Azure Search as retriever in LangChain.

* The chat with your data solution accelerator[code sample](https://github.com/Azure-Samples/chat-with-your-data-solution-accelerator) demonstrates an end-to-end baseline RAG pattern sample. It uses Azure AI Search as a retriever and Azure AI Document Intelligence for document loading and semantic chunking.

## Use case

If you're looking for a specific section in a document, you can use semantic chunking to divide the document into smaller chunks based on the section headers helping you to find the section you're looking for quickly and easily:

```python

# Using SDK targeting 2023-10-31-preview
# pip install azure-ai-documentintelligence==1.0.0b1

 from azure.ai.documentintelligence import DocumentIntelligenceClient
 from azure.core.credentials import AzureKeyCredential
 
 endpoint = "https://<my-custom-subdomain>.cognitiveservices.azure.com/"
 credential = AzureKeyCredential("<api_key>")
 
 document_intelligence_client = DocumentIntelligenceClient(
     endpoint, credential)
 
   from langchain.document_loaders.doc_intelligence import DocumentIntelligenceLoader
   from langchain.text_splitter import MarkdownHeaderTextSplitter
   # Initiate Azure AI Document Intelligence to load the document and split it into chunks
   loader = DocumentIntelligenceLoader(file_path=<your file path>, credential, endpoint)
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

## Next steps

* Learn more about [Azure AI Document Intelligence](overview.md).

* [Learn how to process your own forms and documents](quickstarts/try-document-intelligence-studio.md) with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio).

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.
