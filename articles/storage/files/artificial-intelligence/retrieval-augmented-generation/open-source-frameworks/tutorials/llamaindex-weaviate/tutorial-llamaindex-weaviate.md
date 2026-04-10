---
title: Build a RAG pipeline using Azure Files with LlamaIndex and Weaviate
description: Learn how to build a retrieval-augmented generation (RAG) pipeline that queries documents stored in Azure Files using LlamaIndex for orchestration and Weaviate as the vector database.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 04/09/2026
ms.author: t-flynnr
ms.custom: devx-track-python
---

# Tutorial: Build a RAG pipeline using Azure Files with LlamaIndex and Weaviate

In this tutorial, you build a retrieval-augmented generation (RAG) pipeline over documents stored in Azure Files. The pipeline uses LlamaIndex for orchestration and Weaviate as the vector database. Weaviate supports *hybrid search* — combining vector similarity with BM25 keyword matching — which helps retrieve both semantic matches and exact terms from file shares that contain a mix of structured and unstructured documents.

## Prerequisites

- Complete the [project setup and Azure Files authentication](../../setup.md).
- An [Azure OpenAI](/azure/ai-services/openai/how-to/create-resource) resource with the following deployments:
  - A text embedding model (for example, `text-embedding-3-small`)
  - A chat completion model (for example, `gpt-4o`)
- A [Weaviate Cloud](https://console.weaviate.cloud/) account with a cluster created (the free tier is sufficient). You need a cluster URL and an API key from the [Weaviate Cloud console](https://console.weaviate.cloud/).

> [!IMPORTANT]
> Store your Weaviate API key securely. Don't commit API keys to source control.

Set the following environment variables in your `.env` file:

```text
WEAVIATE_URL=<your-weaviate-cluster-url>
WEAVIATE_API_KEY=<your-weaviate-api-key>
WEAVIATE_COLLECTION_NAME=AzureFilesRAG
```

| Variable | Description |
| :--- | :--- |
| `WEAVIATE_URL` | Your Weaviate Cloud cluster URL from the [Weaviate Cloud console](https://console.weaviate.cloud/) |
| `WEAVIATE_API_KEY` | Your Weaviate Cloud API key |
| `WEAVIATE_COLLECTION_NAME` | Weaviate collection name (must start with a capital letter) |

## Install dependencies

Install the required packages for this tutorial:

```bash
pip install llama-index llama-index-embeddings-azure-openai llama-index-llms-azure-openai llama-index-vector-stores-weaviate llama-index-readers-file weaviate-client
```

## Step 1: Parse and chunk documents

After downloading files from Azure Files (covered in the [setup article](../../setup.md)), split the documents into overlapping chunks. LlamaIndex's `SentenceSplitter` respects sentence boundaries, splitting between sentences rather than mid-sentence to produce more coherent chunks for embedding.

```python
from llama_index.core.node_parser import SentenceSplitter

def chunk_documents(documents):
    splitter = SentenceSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )
    return splitter.get_nodes_from_documents(documents)
```

`SentenceSplitter` splits each document into overlapping text nodes of `CHUNK_SIZE` tokens with `CHUNK_OVERLAP` tokens of overlap between adjacent nodes. All original metadata (such as file path) is automatically inherited by each child node.

## Step 2: Create embeddings and index into Weaviate

Connect to your Weaviate cluster, create an embedding model using Azure OpenAI, and upsert the vectors into a Weaviate collection.

```python
import weaviate
from llama_index.core import StorageContext, VectorStoreIndex
from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding
from llama_index.vector_stores.weaviate import WeaviateVectorStore
from weaviate.classes.init import Auth

def embed_and_index(chunks):
    client = weaviate.connect_to_weaviate_cloud(
        cluster_url=WEAVIATE_URL,
        auth_credentials=Auth.api_key(WEAVIATE_API_KEY),
    )

    vector_store = WeaviateVectorStore(
        weaviate_client=client,
        index_name=WEAVIATE_COLLECTION_NAME,
    )

    embed_model = AzureOpenAIEmbedding(
        azure_endpoint=OPENAI_ENDPOINT,
        azure_deployment=OPENAI_EMBEDDING_DEPLOYMENT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        use_azure_ad=True,
        model="text-embedding-3-small",
        dimensions=EMBEDDING_DIMENSIONS,
        api_version="2024-06-01",
    )

    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    index = VectorStoreIndex(
        nodes=chunks,
        storage_context=storage_context,
        embed_model=embed_model,
    )

    return index, embed_model, client
```

This function:

1. **Connects to Weaviate Cloud** — `weaviate.connect_to_weaviate_cloud()` establishes an authenticated connection using the cluster URL and API key. The Weaviate client manages a persistent connection that must be explicitly closed when the pipeline finishes.
2. **Creates the vector store** — `WeaviateVectorStore` wraps the Weaviate client for LlamaIndex. If the collection does not exist, the integration creates it automatically with a default schema. The `index_name` must start with a capital letter.
3. **Creates the embedding model** — `AzureOpenAIEmbedding` authenticates to Azure OpenAI using Entra ID tokens (via `azure_ad_token_provider`), not API keys. The `use_azure_ad=True` parameter is required for token-based authentication.
4. **Embeds and indexes** — `VectorStoreIndex` takes the text nodes, embeds them via the Azure OpenAI model, and upserts the resulting vectors into Weaviate. Each node's metadata (such as `azure_file_path`) is stored alongside the vector for source citation at query time.

## Step 3: Build the query engine

Build a LlamaIndex `RetrieverQueryEngine` that retrieves relevant chunks from Weaviate using hybrid search and generates an answer using Azure OpenAI.

```python
from llama_index.core import PromptTemplate
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.response_synthesizers import get_response_synthesizer
from llama_index.core.vector_stores.types import VectorStoreQueryMode
from llama_index.llms.azure_openai import AzureOpenAI

def build_query_engine(index):
    llm = AzureOpenAI(
        engine=OPENAI_CHAT_DEPLOYMENT,
        azure_endpoint=OPENAI_ENDPOINT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        use_azure_ad=True,
        api_version="2024-06-01",
    )

    retriever = index.as_retriever(
        similarity_top_k=5,
        vector_store_query_mode=VectorStoreQueryMode.HYBRID,
        alpha=0.5,
    )

    qa_prompt = PromptTemplate(
        "Use the following context to answer the question. "
        "If the answer is not in the context, say so.\n\n"
        "Context:\n{context_str}\n\nQuestion: {query_str}\n\nAnswer:"
    )

    return RetrieverQueryEngine(
        retriever=retriever,
        response_synthesizer=get_response_synthesizer(
            llm=llm, text_qa_template=qa_prompt,
        ),
    )
```

The query engine has three stages:

1. **Retrieve** — The user's question is vectorized and the top 5 matching nodes are retrieved from Weaviate using hybrid search. The `alpha=0.5` parameter balances vector similarity (semantic meaning) equally with BM25 keyword matching (exact terms). You can tune `alpha` toward `1.0` for more semantic results or toward `0.0` for more keyword-heavy results.
2. **Prompt** — The retrieved chunks and question are injected into a template that instructs the LLM to answer based only on the provided context.
3. **Synthesize** — `get_response_synthesizer` generates an answer using Azure OpenAI and returns it as a response object.

## Step 4: Run the pipeline

Run the pipeline script:

```bash
python llamaindex-weaviate.py
```

The script scans the Azure file share, downloads and parses documents, chunks them, indexes them into Weaviate, and starts an interactive query session. Type a question to query your documents, or `quit` to exit. The Weaviate client connection is automatically closed when the pipeline finishes.

## Clean up resources

To delete the Azure resources created for this tutorial:

```bash
az group delete --name rg-rag-demo --yes --no-wait
```

> [!NOTE]
> Your Azure file share may be shared infrastructure — confirm with your administrator before deleting. To remove your Weaviate collection, delete it from the [Weaviate Cloud console](https://console.weaviate.cloud/) or set the `RESET_INDEX=true` environment variable before the next pipeline run.

## Next steps

- [Azure OpenAI documentation](/azure/ai-services/openai/)
- [LlamaIndex documentation](https://docs.llamaindex.ai/)
- [Weaviate documentation](https://weaviate.io/developers/weaviate)
- [LlamaIndex Weaviate integration](https://developers.llamaindex.ai/python/framework-api-reference/storage/vector_store/weaviate/)
- [Weaviate hybrid search](https://weaviate.io/developers/weaviate/search/hybrid)
