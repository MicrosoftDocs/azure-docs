---
title: Build a RAG pipeline using Azure Files with LangChain and Qdrant
description: Learn how to build a retrieval-augmented generation (RAG) pipeline that queries documents stored in Azure Files using LangChain for orchestration and Qdrant as the vector database.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 04/09/2026
ms.author: t-flynnr
ms.custom: devx-track-python
---

# Tutorial: Build a RAG pipeline using Azure Files with LangChain and Qdrant

In this tutorial, you build a retrieval-augmented generation (RAG) pipeline over documents stored in Azure Files. The pipeline uses LangChain for orchestration and Qdrant as the vector database. Qdrant stores all documents in a single collection and uses indexed *payload filtering* to scope queries by department at retrieval time, rather than partitioning data into separate namespaces or indexes.

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
| `QDRANT_URL` | Your Qdrant cluster URL (for example, `https://xyz.us-east4-0.gcp.cloud.qdrant.io:6333`) |
| `QDRANT_API_KEY` | Your Qdrant API key from the [Qdrant Cloud console](https://cloud.qdrant.io/) |
| `QDRANT_COLLECTION_NAME` | Collection name (defaults to `azure-files-rag` if omitted) |

## Install dependencies

Install the required packages for this tutorial:

```bash
pip install langchain langchain-openai langchain-qdrant qdrant-client
```

## Step 1: Parse and chunk documents

After downloading files from Azure Files (covered in the [setup article](../../setup.md)), split the documents into overlapping chunks. The overlap preserves context at chunk boundaries so the embedding model can capture meaning that spans a split point.

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

def chunk_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )
    return splitter.split_documents(documents)
```

`RecursiveCharacterTextSplitter` splits each document into chunks of `CHUNK_SIZE` characters with `CHUNK_OVERLAP` characters of overlap between adjacent chunks. All original metadata (such as file path) is automatically copied to each child chunk.

## Step 2: Create embeddings and index into Qdrant

Create an embedding model using Azure OpenAI, tag each chunk with its department, and upsert all vectors into a single Qdrant collection.

```python
from langchain_openai import AzureOpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore

def embed_and_index(chunks_by_dept):
    embeddings = AzureOpenAIEmbeddings(
        azure_endpoint=OPENAI_ENDPOINT,
        azure_deployment=OPENAI_EMBEDDING_DEPLOYMENT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        dimensions=EMBEDDING_DIMENSIONS,
    )

    all_chunks = []
    for dept, chunks in chunks_by_dept.items():
        for chunk in chunks:
            chunk.metadata["department"] = dept
        all_chunks.extend(chunks)

    vector_store = QdrantVectorStore.from_documents(
        documents=all_chunks,
        embedding=embeddings,
        collection_name=QDRANT_COLLECTION_NAME,
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
        force_recreate=True,
    )

    return vector_store, embeddings
```

This function:

1. **Creates the embedding model** — `AzureOpenAIEmbeddings` authenticates to Azure OpenAI using Entra ID tokens (via `azure_ad_token_provider`), not API keys.
2. **Tags each chunk with its department** — A `"department"` key is written into each chunk's metadata. Qdrant stores this metadata as an indexed *payload*, so department filtering at query time is an index lookup rather than a brute-force scan.
3. **Upserts all chunks into a single collection** — `QdrantVectorStore.from_documents()` batches the embedding API calls and upserts the resulting vectors into one Qdrant collection. The `force_recreate=True` parameter drops and recreates the collection on each run, preventing duplicates across pipeline executions.

## Step 3: Build the retrieval chain

Build a LangChain Expression Language (LCEL) chain that retrieves relevant chunks from Qdrant and generates an answer using Azure OpenAI.

```python
from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from qdrant_client.http import models

def build_qa_chain(vector_store, department=None):
    llm = AzureChatOpenAI(
        azure_endpoint=OPENAI_ENDPOINT,
        azure_deployment=OPENAI_CHAT_DEPLOYMENT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        api_version="2024-12-01-preview",
    )

    search_kwargs = {"k": RETRIEVAL_COUNT}
    if department:
        search_kwargs["filter"] = models.Filter(
            must=[
                models.FieldCondition(
                    key="metadata.department",
                    match=models.MatchValue(value=department),
                )
            ]
        )
    retriever = vector_store.as_retriever(search_kwargs=search_kwargs)

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

1. **Retrieve** — The user's question is vectorized and the top *k* matching chunks are retrieved from Qdrant. When a `department` is specified, a `models.Filter` expression scopes results to chunks whose `metadata.department` payload matches. The filter key is `"metadata.department"` because LangChain's Qdrant integration nests document metadata under a `metadata` payload key. When no department is specified, the retriever queries the entire collection.
2. **Format** — The retrieved chunks are joined into a single context string.
3. **Prompt** — The context and question are injected into a template that instructs the LLM to answer based only on the provided context.
4. **Generate** — `AzureChatOpenAI` produces an answer and `StrOutputParser()` extracts the text.

## Step 4: Run the pipeline

Run the pipeline script:

```bash
python langchain-qdrant.py
```

The script scans the Azure file share, downloads and parses documents, chunks them, indexes them into a single Qdrant collection, and starts an interactive query session. Choose a department (or `all`) and ask questions. Type `back` to switch departments, or `quit` to exit.

## Clean up resources

To delete the Azure resources created for this tutorial:

```bash
az group delete --name rg-rag-demo --yes --no-wait
```

> [!NOTE]
> Your Azure file share may be shared infrastructure — confirm with your administrator before deleting. To remove your Qdrant collection, delete it from the [Qdrant Cloud console](https://cloud.qdrant.io/) or via the REST API. For a self-hosted instance, delete the collection with `curl -X DELETE "https://<your-qdrant-url>/collections/azure-files-rag"`.

## Next steps

- [Azure OpenAI documentation](/azure/ai-services/openai/)
- [LangChain documentation](https://python.langchain.com/docs/introduction/)
- [Qdrant documentation](https://qdrant.tech/documentation/)
- [LangChain Qdrant integration](https://python.langchain.com/docs/integrations/vectorstores/qdrant/)
