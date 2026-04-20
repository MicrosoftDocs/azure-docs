---
title: Build a RAG pipeline using Azure Files with Haystack and Pinecone
description: Learn how to build a retrieval-augmented generation (RAG) pipeline that queries documents stored in Azure Files using Haystack for orchestration and Pinecone as the vector database.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 04/09/2026
ms.author: t-flynnr
ms.custom: devx-track-python
---

# Tutorial: Build a RAG pipeline using Azure Files with Haystack and Pinecone

In this tutorial, you build a retrieval-augmented generation (RAG) pipeline over documents stored in Azure Files. The pipeline uses Haystack for orchestration and Pinecone as the vector database. Haystack models the pipeline as an explicit directed acyclic graph (DAG) of typed components — embedder, retriever, prompt builder, generator — so you can inspect and extend each stage independently.

## Prerequisites

- Complete the [project setup and Azure Files authentication](../../setup.md).
- An [Azure OpenAI](/azure/ai-services/openai/how-to/create-resource) resource with the following deployments:
  - A text embedding model (for example, `text-embedding-3-small`)
  - A chat completion model (for example, `gpt-4o`)
- A [Pinecone account](https://www.pinecone.io/) (the free tier is sufficient). You need an API key and an index name from the [Pinecone console](https://app.pinecone.io/).

> [!IMPORTANT]
> Store your Pinecone API key securely. Don't commit API keys to source control.

Set the following environment variables in your `.env` file:

```text
PINECONE_API_KEY=<your-pinecone-api-key>
PINECONE_INDEX_NAME=<your-pinecone-index-name>
```

| Variable | Description |
| :--- | :--- |
| `PINECONE_API_KEY` | Your Pinecone API key from the [Pinecone console](https://app.pinecone.io/) |
| `PINECONE_INDEX_NAME` | The name of your Pinecone index |

## Install dependencies

Install the required packages for this tutorial:

```bash
pip install haystack-ai pinecone-haystack pypdf python-docx pinecone
```

## Step 1: Parse and chunk documents

After downloading files from Azure Files (covered in the [setup article](../../setup.md)), split the documents into overlapping chunks. Haystack's `DocumentSplitter` splits by word count rather than character count, which produces more semantically consistent chunk sizes.

```python
from haystack.components.preprocessors import DocumentSplitter

def chunk_documents(documents):
    splitter = DocumentSplitter(
        split_by="word",
        split_length=CHUNK_SIZE,
        split_overlap=CHUNK_OVERLAP,
    )
    result = splitter.run(documents=documents)
    return result["documents"]
```

`DocumentSplitter` splits each document into chunks of `CHUNK_SIZE` words with `CHUNK_OVERLAP` words of overlap between adjacent chunks. All original metadata (such as file path) is automatically copied to each child chunk.

## Step 2: Create embeddings and index into Pinecone

Build a Haystack indexing pipeline that embeds document chunks with Azure OpenAI and writes the vectors into a Pinecone index.

```python
from haystack import Pipeline
from haystack.components.embedders import AzureOpenAIDocumentEmbedder
from haystack.components.writers import DocumentWriter
from haystack.document_stores.types import DuplicatePolicy
from haystack_integrations.document_stores.pinecone import PineconeDocumentStore

def embed_and_index(chunks):
    store = PineconeDocumentStore(
        index=PINECONE_INDEX_NAME,
        namespace="default",
        dimension=EMBEDDING_DIMENSIONS,
        metric="cosine",
        spec={"serverless": {"region": "eastus2", "cloud": "azure"}},
    )

    embedder = AzureOpenAIDocumentEmbedder(
        azure_endpoint=OPENAI_ENDPOINT,
        azure_deployment=OPENAI_EMBEDDING_DEPLOYMENT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        api_key=None,
        dimensions=EMBEDDING_DIMENSIONS,
    )

    writer = DocumentWriter(
        document_store=store,
        policy=DuplicatePolicy.OVERWRITE,
    )

    indexing_pipeline = Pipeline()
    indexing_pipeline.add_component("embedder", embedder)
    indexing_pipeline.add_component("writer", writer)
    indexing_pipeline.connect("embedder.documents", "writer.documents")

    indexing_pipeline.run({"embedder": {"documents": chunks}})

    return store
```

This function:

1. **Creates the document store** — `PineconeDocumentStore` creates the Pinecone index automatically if it doesn't exist, using the `dimension`, `metric`, and `spec` parameters. If the index already exists, it reuses it.
2. **Creates the embedding model** — `AzureOpenAIDocumentEmbedder` authenticates to Azure OpenAI using Entra ID tokens (via `azure_ad_token_provider`), not API keys. The explicit `api_key=None` prevents Haystack from reading a default key from the environment.
3. **Writes to Pinecone** — `DocumentWriter` upserts the embedded documents into the store. `DuplicatePolicy.OVERWRITE` replaces existing documents with the same ID, making the pipeline idempotent across repeated runs.
4. **Connects the DAG** — `connect("embedder.documents", "writer.documents")` wires the embedder's output to the writer's input. Each component declares typed sockets; `connect()` binds them, and `run()` pushes data through the graph.

## Step 3: Build the retrieval pipeline

Build a Haystack query pipeline that embeds the user's question, retrieves matching chunks from Pinecone, and generates an answer using Azure OpenAI.

```python
from haystack.components.builders import PromptBuilder
from haystack.components.embedders import AzureOpenAITextEmbedder
from haystack.components.generators import AzureOpenAIGenerator
from haystack_integrations.components.retrievers.pinecone import PineconeEmbeddingRetriever

def build_query_pipeline(document_store):
    text_embedder = AzureOpenAITextEmbedder(
        azure_endpoint=OPENAI_ENDPOINT,
        azure_deployment=OPENAI_EMBEDDING_DEPLOYMENT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        api_key=None,
        dimensions=EMBEDDING_DIMENSIONS,
    )

    retriever = PineconeEmbeddingRetriever(
        document_store=document_store,
        top_k=5,
    )

    prompt_builder = PromptBuilder(template=_PROMPT_TEMPLATE)

    generator = AzureOpenAIGenerator(
        azure_endpoint=OPENAI_ENDPOINT,
        azure_deployment=OPENAI_CHAT_DEPLOYMENT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        api_key=None,
    )

    query_pipeline = Pipeline()
    query_pipeline.add_component("text_embedder", text_embedder)
    query_pipeline.add_component("retriever", retriever)
    query_pipeline.add_component("prompt_builder", prompt_builder)
    query_pipeline.add_component("generator", generator)

    query_pipeline.connect("text_embedder.embedding", "retriever.query_embedding")
    query_pipeline.connect("retriever.documents", "prompt_builder.documents")
    query_pipeline.connect("prompt_builder.prompt", "generator.prompt")

    return query_pipeline
```

The query pipeline has four stages:

1. **Embed** — `AzureOpenAITextEmbedder` converts the user's question into an embedding vector. This is a different class from the document embedder used during indexing — Haystack uses separate components because they accept different input types (a single string versus a list of documents).
2. **Retrieve** — `PineconeEmbeddingRetriever` queries Pinecone with the embedding vector and returns the top *k* matching chunks using cosine similarity.
3. **Prompt** — `PromptBuilder` uses a Jinja2 template that iterates over the retrieved documents, injects the user's question, and instructs the LLM to answer based only on the provided context.
4. **Generate** — `AzureOpenAIGenerator` sends the rendered prompt to Azure OpenAI and returns the response.

## Step 4: Run the pipeline

Run the pipeline script:

```bash
python haystack-pinecone.py
```

The script scans the Azure file share, downloads and parses documents, chunks them, indexes them into Pinecone, and starts an interactive query session. Type a question to query your documents. Type `quit` to exit.

## Clean up resources

To delete the Azure resources created for this tutorial:

```bash
az group delete --name rg-rag-demo --yes --no-wait
```

> [!NOTE]
> Your Azure file share may be shared infrastructure — confirm with your administrator before deleting. To remove your Pinecone index, delete it from the [Pinecone console](https://app.pinecone.io/).

## Next steps

- [Azure OpenAI documentation](/azure/ai-services/openai/)
- [Haystack documentation](https://docs.haystack.deepset.ai/)
- [Pinecone documentation](https://docs.pinecone.io/)
- [Haystack Pinecone integration](https://docs.haystack.deepset.ai/docs/pinecone-document-store)
