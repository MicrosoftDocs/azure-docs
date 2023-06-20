---
title: Retrieval Augmented Generation using Azure Machine Learning prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Explaining retrieval augmented generation and using Prompt Flow models for business use cases
services: machine-learning
ms.author: balapv
author: balapv
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 06/30/2023
ms.topic: how-to
ms.custom: prompt-flow
---

# Retrieval Augmented Generation using Azure Machine Learning prompt flow



## Train Large language Models for Business use cases

Integrating artificial intelligence (AI) into business operations often
involves training or fine-tuning base models with specific business
data. However, the rise of Large Language Models (LLMs) such as ChatGPT
has presented new opportunities. These models offer extensive
capabilities in areas like information retrieval, text generation, data
summarization, and conversational interactions without any extra
training or fine-tuning. The drawback is that these models often lack
the business-specific and up-to-date data required for business use
cases. While historically, smaller base models were preferred due to
ease of training, the adoption of LLMs poses challenges related to the
costs and complexities of fine-tuning. This article explores how
businesses can effectively adopt LLMs and adapt them for their business
use case, particularly by using Retrieval Augmented Generation
(RAG)[^1]. We provide guidance on when and how to use this
technique.

Benefits of adopting LLMs for Business use cases:
fact checking component
Up to date data

Drawbacks of tradition LM:
May return incorrect knowledge


A base model is typically trained with point-in-time data to ensure its
effectiveness in performing specific tasks and adapting to the desired
domain. However, when dealing with newer or more current data, two
approaches can supplement the base model: fine-tuning or RAG.
Fine-tuning is suitable for continuous domain adaptation, enabling
significant improvements in model quality but often incurring higher
costs. Conversely, RAG offers an alternative approach, allowing the use
of the same model as a reasoning engine over new data. This technique
enables in-context learning without the need for expensive fine-tuning,
empowering businesses to use LLMs more efficiently.

RAG allows businesses to achieve customized solutions while maintaining
data relevance and optimizing costs. By adopting RAG, companies can
apply the reasoning capabilities of LLMs, utilizing their existing
models to process and generate responses based on new data. RAG
facilitates periodic data updates without the need for fine-tuning,
thereby streamlining the integration of LLMs into businesses.

## RAG with Azure Machine Learning prompt flow

At Build 2023, we announced the **private preview of Azure Machine
Learning prompt flow**, a feature that enables you to harness the power
of LLMs with your own data. It uses
[Azure Machine Learning](https://azure.microsoft.com/en-us/products/machine-learning/)
with [Azure OpenAI
Service](https://azure.microsoft.com/en-us/products/cognitive-services/openai-service/),
with support for [Azure Cognitive
Search](https://azure.microsoft.com/en-us/products/search/), and OSS
tools and frameworks such as
[LangChain](https://python.langchain.com/en/latest/index.html).

RAG is a technique that enables an LLM to
utilize your own data for generating responses. To successfully
implement RAG, there are a few key requirements must be met. Your data
should be formatted in a manner that allows efficient searchability
before sending it to the LLM, which ultimately reduces token consumption.
To ensure the effectiveness of RAG, it's important to regularly update
your data on a periodic basis. Furthermore, having the capability to
evaluate the output from the LLM using your data enables you to
measure the efficacy of your techniques. Azure Machine Learning allows you to
get started easily on these aspects and enables you to improve and
productionize RAG.

Azure Machine Learning offers:

-   One-click samples for starting RAG-based Q&A scenarios.

-   Studio based experience to create and manage data and incorporate
    it into prompt flows.

-   Ability to measure and enhance RAG workflows, including test data
    generation, automatic prompt creation, and visualized prompt
    evaluation metrics.

-   Advanced scenarios with more customization using the new built-in RAG
    components for creating custom pipelines in notebooks.

-   Code experiences that allow utilization of data created with OSS
    offerings like LangChain.

-   Seamless integration of RAG workflows into MLOps workflows using
    pipelines and jobs.


RAG in Azure Machine Learning is currently available on demand. If you're interested
in trying RAG out, you can sign up at <https://aka.ms/aml-rag-signup>

## RAG detailed overview

To enable an LLM to access custom data, the following steps should be
taken. Firstly, the large data should be chunked into manageable pieces.
Secondly, the chunks need to be converted into a searchable format.
Thirdly, the converted data should be stored in a location that allows
efficient access. Additionally, it's important to store relevant
metadata for citations or references when the LLM provides responses.

![](./media/doc/Overview.png)

Let us look at the overview in more detail.

1.  Source data: this is where your data exists. It could be a
    file/folder on your machine, a location in a cloud storage, an Azure Machine Learning data asset, a Git repository, or an SQL database.

2.  Data chunking: The data in your source needs to be converted to
    plain text. For example, word documents or PDFs, need to be cracked open
    and converted to text. This text is then chunked into smaller
    pieces.

3.  Converting the text to vectors: called embeddings[^2]. Vectors are
    numerical representations of concepts converted to number sequences,
    which make it easy for computers to understand the relationships
    between those concepts.

4.  Links between source data and embeddings: this information is
    stored as metadata on the chunks created which is then used to
    assist the LLMs to generate citations while generating responses.

5.  Vector Data store: The embeddings need to be stored in a location
    for efficient retrieval later. This store is called Vector Index[^3].

## RAG in AzureML: details

Azure Machine Learning provides the following capabilities for RAG.

-   Use the samples gallery to create a RAG prompt flow with one select

-   Create a new Vector Index using a UI Wizard

-   Add a Vector Index to a prompt flow

-   Use Azure Machine Learning pipelines with code (typically notebooks) to construct
    RAG pipelines

### Create a RAG prompt flow using the samples gallery

A prompt is an input, a text command or a question provided to an AI
model, to generate desired output like content or answer. The process of
crafting effective and efficient prompts is called prompt design or
prompt engineering. Prompt flow \<*TBD - link to PF blog*\> is the
interactive editor of Azure Machine Learning for prompt engineering projects. To get started, you can create a prompt flow sample, which uses RAG from the
samples gallery in Azure Machine Learning. You can use this sample to learn how to use
Vector Index in a prompt flow. You can look at the steps on how to do
this [here](./rag-quick-start.md/#create-a-rag-prompt-flow-using-the-samples-gallery).

### Create a new Vector Index using a UI Wizard

Azure Machine Learning enables you to create a vector index from files/folders on your
machine, a location in a cloud storage, an Azure Machine Learning data asset, a Git
repository, or a SQL database. Azure Machine Learning can currently crack and process
text files, md files, pdf, excel files, word documents. You can also
reuse an existing Azure Cognitive Search Index instead of creating a new
Index.

When a Vector Index is created, Azure Machine Learning will chunk the data, create
embeddings, and store the embeddings in a FAISS Index or Azure Cognitive
Search Index. Apart from this, Azure Machine Learning creates:

1. Test data for your data source.
2. A sample prompt flow, which uses the Vector Index you created. The sample
   prompt flow, which gets created has several key features like:
   a. Automatically generated prompt variants.
   b. Evaluation of each of these variations using the test data
      generated\<*TBD - link to eval blog*\>.
   c. Metrics against each of the variants to help you choose the best variant
      to run. You can use this sample to continue developing your prompt.
      You can find the steps on how to create a Vector Index
      [here](./rag-quick-start.md/#create-a-new-vector-index-using-a-ui-wizard).

### Add a Vector Index to a prompt flow

Once you have created a Vector Index, you can add it to a prompt flow
from the prompt flow canvas. The prompt flow designer has a Vector Index
lookup tool. Add this tool to the canvas and enter the path to your
Vector Index and the query you want to perform against the index. You
can find the steps to do this
[here](./rag-quick-start.md/#add-a-vector-index-to-a-prompt-flow).

### Use Azure Machine Learning pipelines with code to construct RAG pipelines

For advanced scenarios, you can build your own custom Azure Machine Learning pipelines
from code (typically notebooks) that allows you granular control of the
RAG workflow. Azure Machine Learning provides several in-built pipeline components for
data chunking, embeddings generation, test data creation, automatic
prompt generation, prompt evaluation. These components can be used as
per your needs using notebooks. You can even use the Vector Index
created in Azure Machine Learning in LangChain. You can try the sample notebooks
[here](./examples/notebooks/README.md).

## Conclusion

Azure Machine Learning allows you to incorporate RAG in your AI using the Azure studio or
using code with Azure Machine Learning pipelines. It offers several value additions
like the ability to measure and enhance RAG workflows, test data
generation, automatic prompt creation, and visualize prompt evaluation
metrics. It enables the integration of RAG workflows into MLOps
workflows using pipelines. You can also use your data with OSS offerings
like LangChain.

RAG in Azure Machine Learning is currently available on demand. If you're interested
in trying RAG out, you can sign up here - https://aka.ms/aml-rag-signup

[^1]: [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401).
[^2]: To convert text to vectors, that is, create embeddings, an embedding
model is used. Azure OpenAI Service models like Ada or open-source
libraries like [Sentence Transformers](https://www.sbert.net/index.html)
can be used to create embeddings.
[^3]: In Azure Machine Learning, the Vector Index could be a [FAISS](https://faiss.ai/)
Index or an [Azure Cognitive Search
index](https://learn.microsoft.com/en-us/azure/search/search-what-is-an-index).