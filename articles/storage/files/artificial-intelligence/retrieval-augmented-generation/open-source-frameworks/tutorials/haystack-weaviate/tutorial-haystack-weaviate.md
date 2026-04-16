---
title: Build a RAG pipeline using Azure Files with Haystack and Weaviate
description: Learn how to build a retrieval-augmented generation (RAG) pipeline that queries documents stored in Azure Files using Haystack for orchestration and Weaviate as the vector database.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 04/09/2026
ms.author: t-flynnr
ms.custom: devx-track-python
---

# Tutorial: Build a RAG pipeline using Azure Files with Haystack and Weaviate

In this tutorial, you build a retrieval-augmented generation (RAG) pipeline over documents stored in Azure Files. The pipeline uses Haystack for orchestration and Weaviate as the vector database. Haystack models each pipeline as an explicit directed acyclic graph (DAG) of typed components, and Weaviate provides *hybrid search* that blends vector similarity with BM25 keyword matching in a single query, configurable via an `alpha` parameter.

## Prerequisites

- Complete the [project setup and Azure Files authentication](../../setup.md).
- An [Azure OpenAI](/azure/ai-services/openai/how-to/create-resource) resource with the following deployments:
  - A text embedding model (for example, `text-embedding-3-small`)
  - A chat completion model (for example, `gpt-4o`)
- A [Weaviate Cloud](https://console.weaviate.cloud/) account (the free tier is sufficient). You need a cluster URL and API key from the [Weaviate Cloud console](https://console.weaviate.cloud/).

> [!IMPORTANT]
> Store your Weaviate API key securely. Don't commit API keys to source control.

Set the following environment variables in your `.env` file:

```text
WEAVIATE_URL=<your-weaviate-cluster-url>
WEAVIATE_API_KEY=<your-weaviate-api-key>
WEAVIATE_COLLECTION_NAME=AzureFilesRag
```

| Variable | Description |
| :--- | :--- |
| `WEAVIATE_URL` | Your Weaviate cluster URL from the [Weaviate Cloud console](https://console.weaviate.cloud/) |
| `WEAVIATE_API_KEY` | Your Weaviate API key from the [Weaviate Cloud console](https://console.weaviate.cloud/) |
| `WEAVIATE_COLLECTION_NAME` | Weaviate collection name (defaults to `AzureFilesRag`). Must start with an uppercase letter |

## Install dependencies

Install the required packages for this tutorial:

```bash
pip install haystack-ai weaviate-haystack pypdf python-docx
```

## Step 1: Parse and chunk documents

After downloading files from Azure Files (covered in the [setup article](../../setup.md)), split the documents into overlapping chunks. Haystack's `DocumentSplitter` splits by *words* (whitespace-delimited tokens) rather than characters, which produces more semantically consistent chunk sizes. The overlap preserves context at chunk boundaries.

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

## Step 2: Create embeddings and index into Weaviate

Connect to your Weaviate cluster, create an embedding model using Azure OpenAI, and upsert the vectors through a Haystack indexing pipeline.

```python
from haystack import Pipeline
from haystack.components.embedders import AzureOpenAIDocumentEmbedder
from haystack.components.writers import DocumentWriter
from haystack.document_stores.types import DuplicatePolicy
from haystack_integrations.document_stores.weaviate import AuthApiKey, WeaviateDocumentStore

def embed_and_index(chunks):
    store = WeaviateDocumentStore(
        url=WEAVIATE_URL,
        auth_client_secret=AuthApiKey(),
        collection_settings={
            "class": WEAVIATE_COLLECTION_NAME,
            "invertedIndexConfig": {"indexNullState": True},
            "properties": [
                {"name": "_original_id", "dataType": ["text"]},
                {"name": "content", "dataType": ["text"]},
                {"name": "blob_data", "dataType": ["blob"]},
                {"name": "blob_mime_type", "dataType": ["text"]},
                {"name": "score", "dataType": ["number"]},
                {"name": "azure_file_path", "dataType": ["text"]},
                {"name": "file_name", "dataType": ["text"]},
            ],
        },
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

1. **Creates the document store** — `WeaviateDocumentStore` connects to your Weaviate Cloud cluster using `AuthApiKey()`, which reads the `WEAVIATE_API_KEY` environment variable automatically. The `collection_settings` dict defines the collection schema — the collection name must start with an uppercase letter. The base properties (`_original_id`, `content`, `blob_data`, `blob_mime_type`, `score`) are required by the Haystack integration.
2. **Creates the embedding model** — `AzureOpenAIDocumentEmbedder` authenticates to Azure OpenAI using Entra ID tokens (via `azure_ad_token_provider`), not API keys. Haystack uses separate embedder classes for indexing (`AzureOpenAIDocumentEmbedder`) and querying (`AzureOpenAITextEmbedder`).
3. **Builds the indexing pipeline** — The embedder and writer are wired together as a two-node DAG. `DocumentWriter` upserts the embedded chunks into Weaviate with `DuplicatePolicy.OVERWRITE` to prevent duplicates across pipeline runs.

## Step 3: Build the retrieval pipeline

Build a Haystack query pipeline that retrieves relevant chunks from Weaviate using hybrid search and generates an answer using Azure OpenAI.

```python
from haystack import Pipeline
from haystack.components.builders import PromptBuilder
from haystack.components.embedders import AzureOpenAITextEmbedder
from haystack.components.generators import AzureOpenAIGenerator
from haystack_integrations.components.retrievers.weaviate import WeaviateHybridRetriever

def build_query_pipeline(document_store):
    text_embedder = AzureOpenAITextEmbedder(
        azure_endpoint=OPENAI_ENDPOINT,
        azure_deployment=OPENAI_EMBEDDING_DEPLOYMENT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        api_key=None,
        dimensions=EMBEDDING_DIMENSIONS,
    )

    retriever = WeaviateHybridRetriever(
        document_store=document_store,
        top_k=5,
        alpha=0.5,
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
```

The query pipeline has four stages:

1. **Embed** — `AzureOpenAITextEmbedder` converts the user's question into an embedding vector.
2. **Retrieve** — `WeaviateHybridRetriever` blends vector similarity and BM25 keyword matching in a single query. The `alpha=0.5` parameter gives equal weight to both signals (`alpha=0.0` for pure BM25, `alpha=1.0` for pure vector). The retriever takes two inputs: the embedding vector (wired from `text_embedder.embedding`) and the raw query text (passed at runtime).
3. **Prompt** — `PromptBuilder` uses a Jinja2 template that iterates over the retrieved documents, prepends each document's source path for citation, and injects the user's question.
4. **Generate** — `AzureOpenAIGenerator` sends the rendered prompt to Azure OpenAI and returns the response.

## Step 4: Run the pipeline

Run the pipeline script:

```bash
python haystack-weaviate.py
```

The script scans the Azure file share, downloads and parses documents, chunks them, indexes them into Weaviate, and starts an interactive query session. Type a question to query your documents. Type `quit` to exit.

## Clean up resources

To delete the Azure resources created for this tutorial:

```bash
az group delete --name rg-rag-demo --yes --no-wait
```

> [!NOTE]
> Your Azure file share may be shared infrastructure — confirm with your administrator before deleting. To remove your Weaviate collection, delete it from the [Weaviate Cloud console](https://console.weaviate.cloud/), or leave it on the free tier at no cost.

## Next steps

- [Azure OpenAI documentation](/azure/ai-services/openai/)
- [Haystack documentation](https://docs.haystack.deepset.ai/)
- [Weaviate documentation](https://weaviate.io/developers/weaviate)
- [Haystack Weaviate integration](https://docs.haystack.deepset.ai/docs/weaviatedocumentstore)
