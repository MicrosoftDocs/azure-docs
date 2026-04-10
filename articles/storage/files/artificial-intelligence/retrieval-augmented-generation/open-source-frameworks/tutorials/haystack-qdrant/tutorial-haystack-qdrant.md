---
title: Build a RAG pipeline using Azure Files with Haystack and Qdrant
description: Learn how to build a retrieval-augmented generation (RAG) pipeline that queries documents stored in Azure Files using Haystack for orchestration and Qdrant as the vector database.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 04/09/2026
ms.author: t-flynnr
ms.custom: devx-track-python
---

# Tutorial: Build a RAG pipeline using Azure Files with Haystack and Qdrant

In this tutorial, you build a retrieval-augmented generation (RAG) pipeline over documents stored in Azure Files. The pipeline uses Haystack for orchestration and Qdrant as the vector database. Haystack models every pipeline as an explicit directed acyclic graph (DAG) of typed components, so you can inspect and modify each stage independently. Qdrant stores all documents in a single collection and uses indexed payload filtering to scope queries at retrieval time, giving you query-time flexibility without upfront schema decisions.

## Prerequisites

- Complete the [project setup and Azure Files authentication](../../setup.md).
- An [Azure OpenAI](/azure/ai-services/openai/how-to/create-resource) resource with the following deployments:
  - A text embedding model (for example, `text-embedding-3-small`)
  - A chat completion model (for example, `gpt-4o`)
- A [Qdrant Cloud](https://cloud.qdrant.io/) account (the free tier is sufficient), or a self-hosted Qdrant instance. You need a cluster URL and API key from the [Qdrant Cloud console](https://cloud.qdrant.io/).

> [!IMPORTANT]
> Store your Qdrant API key securely. Don't commit API keys to source control.

Set the following environment variables in your `.env` file:

```text
QDRANT_URL=<your-qdrant-url>
QDRANT_API_KEY=<your-qdrant-api-key>
QDRANT_COLLECTION_NAME=azure-files-rag
```

| Variable | Description |
| :--- | :--- |
| `QDRANT_URL` | Your Qdrant cluster URL from the [Qdrant Cloud console](https://cloud.qdrant.io/) |
| `QDRANT_API_KEY` | Your Qdrant API key |
| `QDRANT_COLLECTION_NAME` | Qdrant collection name (defaults to `azure-files-rag`) |

## Install dependencies

Install the required packages for this tutorial:

```bash
pip install haystack-ai qdrant-haystack pypdf python-docx
```

## Step 1: Parse and chunk documents

After downloading files from Azure Files (covered in the [setup article](../../setup.md)), split the documents into overlapping chunks. Haystack uses `DocumentSplitter`, which counts by words rather than characters, producing more semantically consistent chunk sizes.

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

## Step 2: Create embeddings and index into Qdrant

Connect to your Qdrant collection, create an embedding model using Azure OpenAI, and upsert the vectors through a Haystack indexing pipeline.

```python
from haystack import Pipeline
from haystack.components.embedders import AzureOpenAIDocumentEmbedder
from haystack.components.writers import DocumentWriter
from haystack.document_stores.types import DuplicatePolicy
from haystack.utils import Secret
from haystack_integrations.document_stores.qdrant import QdrantDocumentStore

def embed_and_index(chunks):
    store = QdrantDocumentStore(
        url=QDRANT_URL,
        api_key=Secret.from_env_var("QDRANT_API_KEY"),
        index=QDRANT_COLLECTION_NAME,
        embedding_dim=EMBEDDING_DIMENSIONS,
        similarity="cosine",
        wait_result_from_api=True,
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

1. **Creates the document store** — `QdrantDocumentStore` connects to your Qdrant cluster using `Secret.from_env_var("QDRANT_API_KEY")`, which reads the key from the environment without exposing it in code or pipeline serialization. If the collection doesn't exist, Qdrant creates it automatically with the specified dimension and cosine distance metric.
2. **Creates the embedding model** — `AzureOpenAIDocumentEmbedder` authenticates to Azure OpenAI using Entra ID tokens (via `azure_ad_token_provider`), not API keys.
3. **Embeds and writes** — The indexing pipeline connects the embedder to the writer. `DocumentWriter` upserts the embedded chunks into Qdrant with an `OVERWRITE` policy to prevent duplicates across pipeline runs.

## Step 3: Build the retrieval pipeline

Build a Haystack query pipeline that embeds the user's question, retrieves relevant chunks from Qdrant, and generates an answer using Azure OpenAI.

```python
from haystack.components.builders import PromptBuilder
from haystack.components.embedders import AzureOpenAITextEmbedder
from haystack.components.generators import AzureOpenAIGenerator
from haystack_integrations.components.retrievers.qdrant import QdrantEmbeddingRetriever

def build_query_pipeline(document_store):
    text_embedder = AzureOpenAITextEmbedder(
        azure_endpoint=OPENAI_ENDPOINT,
        azure_deployment=OPENAI_EMBEDDING_DEPLOYMENT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        api_key=None,
        dimensions=EMBEDDING_DIMENSIONS,
    )

    retriever = QdrantEmbeddingRetriever(
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

    def run_query(question):
        result = query_pipeline.run({
            "text_embedder": {"text": question},
            "prompt_builder": {"query": question},
        })
        replies = result["generator"]["replies"]
        return replies[0] if replies else "No answer generated."

    return run_query
```

The pipeline has four stages:

1. **Embed** — `AzureOpenAITextEmbedder` converts the user's question into an embedding vector.
2. **Retrieve** — `QdrantEmbeddingRetriever` queries Qdrant with the embedding vector using cosine similarity. Qdrant applies payload filters at the HNSW index level, so filtering does not degrade search performance.
3. **Prompt** — `PromptBuilder` uses a Jinja2 template that injects the retrieved documents and the user's question. The template instructs the LLM to answer based only on the provided context.
4. **Generate** — `AzureOpenAIGenerator` sends the rendered prompt to Azure OpenAI and returns the response.

## Step 4: Run the pipeline

Run the pipeline script:

```bash
python haystack-qdrant.py
```

The script scans the Azure file share, downloads and parses documents, chunks them, indexes them into Qdrant, and starts an interactive query session. Type a question to query your documents, or `quit` to exit.

## Clean up resources

To delete the Azure resources created for this tutorial:

```bash
az group delete --name rg-rag-demo --yes --no-wait
```

> [!NOTE]
> Your Azure file share may be shared infrastructure — confirm with your administrator before deleting. To remove your Qdrant collection, delete it from the [Qdrant Cloud console](https://cloud.qdrant.io/) or via the Qdrant REST API.

## Next steps

- [Azure OpenAI documentation](/azure/ai-services/openai/)
- [Haystack documentation](https://docs.haystack.deepset.ai/)
- [Qdrant documentation](https://qdrant.tech/documentation/)
- [Haystack Qdrant integration](https://docs.haystack.deepset.ai/docs/qdrant-document-store)
