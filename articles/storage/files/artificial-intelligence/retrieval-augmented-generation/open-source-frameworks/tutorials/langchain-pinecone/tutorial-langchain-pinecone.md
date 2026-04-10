---
title: Build a RAG pipeline using Azure Files with LangChain and Pinecone
description: Learn how to build a retrieval-augmented generation (RAG) pipeline that queries documents stored in Azure Files using LangChain for orchestration and Pinecone as the vector database.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 04/09/2026
ms.author: t-flynnr
ms.custom: devx-track-python
---

# Tutorial: Build a RAG pipeline using Azure Files with LangChain and Pinecone

In this tutorial, you build a retrieval-augmented generation (RAG) pipeline over documents stored in Azure Files. The pipeline uses LangChain for orchestration and Pinecone as the vector database. Pinecone namespaces map to Azure Files directory structure, providing scoped retrieval per department without additional configuration.

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
pip install langchain langchain-openai langchain-pinecone pinecone
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

## Step 2: Create embeddings and index into Pinecone

Connect to your Pinecone index, create an embedding model using Azure OpenAI, and upsert the vectors into department-scoped namespaces.

```python
from langchain_openai import AzureOpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone

def embed_and_index(chunks_by_dept):
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index(PINECONE_INDEX_NAME)

    embeddings = AzureOpenAIEmbeddings(
        azure_endpoint=OPENAI_ENDPOINT,
        azure_deployment=OPENAI_EMBEDDING_DEPLOYMENT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        dimensions=EMBEDDING_DIMENSIONS,
    )

    stores = {}
    for dept, chunks in chunks_by_dept.items():
        index.delete(delete_all=True, namespace=dept)
        stores[dept] = PineconeVectorStore.from_documents(
            documents=chunks,
            embedding=embeddings,
            index_name=PINECONE_INDEX_NAME,
            namespace=dept,
        )

    return stores, embeddings
```

This function:

1. **Clears each namespace** — Deletes existing vectors per department to prevent duplicates across pipeline runs.
2. **Creates the embedding model** — `AzureOpenAIEmbeddings` authenticates to Azure OpenAI using Entra ID tokens (via `azure_ad_token_provider`), not API keys.
3. **Embeds and upserts per department** — `PineconeVectorStore.from_documents()` batches the embedding API calls and upserts the resulting vectors into a department-scoped Pinecone namespace. Namespaces map to Azure Files' top-level directory structure, providing scoped retrieval per department.

## Step 3: Build the retrieval chain

Build a LangChain Expression Language (LCEL) chain that retrieves relevant chunks from Pinecone and generates an answer using Azure OpenAI.

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

1. **Retrieve** — The user's question is vectorized and the top *k* matching chunks are retrieved from Pinecone using cosine similarity.
2. **Format** — The retrieved chunks are joined into a single context string.
3. **Prompt** — The context and question are injected into a template that instructs the LLM to answer based only on the provided context.
4. **Generate** — `AzureChatOpenAI` produces an answer and `StrOutputParser()` extracts the text.

## Step 4: Run the pipeline

Run the pipeline script:

```bash
python langchain-pinecone.py
```

The script scans the Azure file share, downloads and parses documents, chunks them, indexes them into Pinecone, and starts an interactive query session. Choose a department (or `all`) and ask questions. Type `back` to switch departments, or `quit` to exit.

## Clean up resources

To delete the Azure resources created for this tutorial:

```bash
az group delete --name rg-rag-demo --yes --no-wait
```

> [!NOTE]
> Your Azure file share may be shared infrastructure — confirm with your administrator before deleting. To remove your Pinecone index, delete it from the [Pinecone console](https://app.pinecone.io/).

## Next steps

- [LangChain documentation](https://python.langchain.com/docs/introduction/)
- [Pinecone documentation](https://docs.pinecone.io/)
- [LangChain Pinecone integration](https://python.langchain.com/docs/integrations/vectorstores/pinecone/)
- [Azure OpenAI documentation](/azure/ai-services/openai/)
