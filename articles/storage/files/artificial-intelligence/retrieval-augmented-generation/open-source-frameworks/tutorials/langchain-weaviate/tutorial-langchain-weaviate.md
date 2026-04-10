---
title: Build a RAG pipeline using Azure Files with LangChain and Weaviate
description: Learn how to build a retrieval-augmented generation (RAG) pipeline that queries documents stored in Azure Files using LangChain for orchestration and Weaviate as the vector database.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 04/09/2026
ms.author: t-flynnr
ms.custom: devx-track-python
---

# Tutorial: Build a RAG pipeline using Azure Files with LangChain and Weaviate

In this tutorial, you build a retrieval-augmented generation (RAG) pipeline over documents stored in Azure Files. The pipeline uses LangChain for orchestration and Weaviate as the vector database. Weaviate multi-tenancy maps to Azure Files directory structure, providing isolated retrieval per department with automatic tenant creation on first write.

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
| `WEAVIATE_COLLECTION_NAME` | The name of your Weaviate collection |

## Install dependencies

Install the required packages for this tutorial:

```bash
pip install langchain langchain-openai langchain-weaviate weaviate-client
```

## Step 1: Parse and chunk documents

After downloading files from Azure Files (covered in the [setup article](../../setup.md)), split the documents into overlapping chunks. The overlap preserves context at chunk boundaries so the embedding model can capture meaning that spans a split point.

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

def chunk_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )
    return splitter.split_documents(documents)
```

`RecursiveCharacterTextSplitter` splits each document into chunks of `CHUNK_SIZE` characters with `CHUNK_OVERLAP` characters of overlap between adjacent chunks. All original metadata (such as file path) is automatically copied to each child chunk.

## Step 2: Create embeddings and index into Weaviate

Connect to your Weaviate cluster, create a collection with multi-tenancy enabled, create an embedding model using Azure OpenAI, and upsert the vectors into department-scoped tenants.

```python
import weaviate
from langchain_openai import AzureOpenAIEmbeddings
from langchain_weaviate.vectorstores import WeaviateVectorStore
from weaviate.classes.config import Configure
from weaviate.classes.init import Auth

def embed_and_index(chunks_by_dept):
    client = weaviate.connect_to_weaviate_cloud(
        cluster_url=WEAVIATE_URL,
        auth_credentials=Auth.api_key(WEAVIATE_API_KEY),
    )

    if client.collections.exists(WEAVIATE_COLLECTION_NAME):
        client.collections.delete(WEAVIATE_COLLECTION_NAME)
    client.collections.create(
        name=WEAVIATE_COLLECTION_NAME,
        multi_tenancy_config=Configure.multi_tenancy(
            enabled=True, auto_tenant_creation=True,
        ),
    )

    embeddings = AzureOpenAIEmbeddings(
        azure_endpoint=OPENAI_ENDPOINT,
        azure_deployment=OPENAI_EMBEDDING_DEPLOYMENT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        dimensions=EMBEDDING_DIMENSIONS,
    )

    stores = {}
    for dept, chunks in chunks_by_dept.items():
        stores[dept] = WeaviateVectorStore.from_documents(
            documents=chunks,
            embedding=embeddings,
            client=client,
            index_name=WEAVIATE_COLLECTION_NAME,
            tenant=dept,
        )

    return client, stores, embeddings
```

This function:

1. **Connects to Weaviate Cloud** — `weaviate.connect_to_weaviate_cloud()` opens an authenticated gRPC+REST connection using your cluster URL and API key.
2. **Recreates the collection** — Deletes the existing collection (if any) and creates a fresh one with `auto_tenant_creation=True`. Tenants are created on the fly when documents are inserted, so you don't need to register department names in advance.
3. **Creates the embedding model** — `AzureOpenAIEmbeddings` authenticates to Azure OpenAI using Entra ID tokens (via `azure_ad_token_provider`), not API keys.
4. **Embeds and upserts per tenant** — `WeaviateVectorStore.from_documents()` batches the embedding API calls and upserts the resulting vectors into a department-scoped Weaviate tenant. Multi-tenancy isolates data at the storage layer, mapping to Azure Files' top-level directory structure.

## Step 3: Build the retrieval chain

Build a LangChain Expression Language (LCEL) chain that retrieves relevant chunks from Weaviate and generates an answer using Azure OpenAI.

```python
from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

def build_qa_chain(vector_store):
    llm = AzureChatOpenAI(
        azure_endpoint=OPENAI_ENDPOINT,
        azure_deployment=OPENAI_CHAT_DEPLOYMENT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        api_version="2024-12-01-preview",
    )
    retriever = vector_store.as_retriever(search_kwargs={"k": RETRIEVAL_COUNT})

    prompt = PromptTemplate.from_template(
        "Use the following context to answer the question. "
        "If the answer is not in the context, say so.\n\n"
        "Context:\n{context}\n\nQuestion: {question}\n\nAnswer:"
    )

    def format_docs(docs):
        return "\n\n".join(d.page_content for d in docs)

    return (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt | llm | StrOutputParser()
    )
```

The LCEL chain has four stages:

1. **Retrieve** — The user's question is vectorized and the top *k* matching chunks are retrieved from Weaviate. When querying a specific department, the retriever is scoped to that tenant. When querying `all`, a tenant-less `WeaviateVectorStore` queries across all tenants.
2. **Format** — The retrieved chunks are joined into a single context string.
3. **Prompt** — The context and question are injected into a template that instructs the LLM to answer based only on the provided context.
4. **Generate** — `AzureChatOpenAI` produces an answer and `StrOutputParser()` extracts the text.

## Step 4: Run the pipeline

Run the pipeline script:

```bash
python langchain-weaviate.py
```

The script scans the Azure file share, downloads and parses documents, chunks them, indexes them into Weaviate, and starts an interactive query session. Choose a department (or `all`) and ask questions. Type `back` to switch departments, or `quit` to exit. The Weaviate client connection is closed automatically when the session ends.

## Clean up resources

To delete the Azure resources created for this tutorial:

```bash
az group delete --name rg-rag-demo --yes --no-wait
```

> [!NOTE]
> Your Azure file share may be shared infrastructure — confirm with your administrator before deleting. To remove your Weaviate collection, delete it from the [Weaviate Cloud console](https://console.weaviate.cloud/).

## Next steps

- [Azure OpenAI documentation](/azure/ai-services/openai/)
- [LangChain documentation](https://python.langchain.com/docs/introduction/)
- [Weaviate documentation](https://weaviate.io/developers/weaviate)
- [LangChain Weaviate integration](https://python.langchain.com/docs/integrations/vectorstores/weaviate/)
