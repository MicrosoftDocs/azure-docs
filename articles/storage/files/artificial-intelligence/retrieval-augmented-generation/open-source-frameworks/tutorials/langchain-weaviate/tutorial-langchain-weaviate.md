---
title: Build a RAG pipeline using Azure Files with LangChain and Weaviate
description: Learn how to build a retrieval-augmented generation (RAG) pipeline that queries documents stored in Azure Files using LangChain for orchestration and Weaviate as the vector database.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 04/09/2026
ms.author: t-flynnr
ms.devlang: python
ms.custom: devx-track-python
---

# Tutorial: Build a RAG pipeline using Azure Files with LangChain and Weaviate

**Applies to:** ✔️ SMB file shares with Microsoft Entra ID authentication

In this tutorial, you build a retrieval-augmented generation (RAG) pipeline over documents stored in Azure Files. The pipeline uses LangChain for orchestration and Weaviate as the vector database.

The sections that follow walk through each component of the pipeline. If you'd rather start from a complete, runnable script and read along, create a file named `langchain-weaviate.py` in your project directory, copy the contents of [`langchain-weaviate.py`](https://github.com/Azure-Samples/azure-files-langchain-weaviate/blob/main/langchain-weaviate.py) from the [azure-files-langchain-weaviate](https://github.com/Azure-Samples/azure-files-langchain-weaviate) GitHub repository into it, and skip to [Step 5: Run the pipeline](#step-5-run-the-pipeline).

## Prerequisites

- Complete the [project setup and Azure Files authentication](../../setup.md). Your project directory should look like this:

  ```text
  <project-directory>/
  ├── .venv/
  ├── .env
  ├── azure_files.py
  └── requirements.txt
  ```

- A [Weaviate Cloud](https://console.weaviate.cloud/) account with a cluster created (the free tier is sufficient). You need the REST endpoint URL and an API key from the [Weaviate Cloud console](https://console.weaviate.cloud/). Weaviate is also available on the [Azure Marketplace](https://marketplace.microsoft.com/en-us/product/weaviatebv1686614539420.weaviate_1?tab=Overview) for enterprise deployments.

> [!IMPORTANT]
> Store your Weaviate API key securely. Do not commit API keys to source control.

## Set environment variables

Add the following variables to the `.env` file in your project directory:

```text
WEAVIATE_URL=<your-weaviate-rest-endpoint>
WEAVIATE_API_KEY=<your-weaviate-api-key>
WEAVIATE_COLLECTION_NAME=AzureFilesRAG

# Tuning parameters (optional — defaults shown)
EMBEDDING_DIMENSIONS=512
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
```

| Variable | Description |
| :--- | :--- |
| `WEAVIATE_URL` | Your Weaviate REST endpoint URL from the [Weaviate Cloud console](https://console.weaviate.cloud/) (not the gRPC endpoint) |
| `WEAVIATE_API_KEY` | Your Weaviate Cloud API key |
| `WEAVIATE_COLLECTION_NAME` | Weaviate collection name (defaults to `AzureFilesRAG`). The name must start with an uppercase letter. |
| `EMBEDDING_DIMENSIONS` | Dimension of the embedding vectors (default: `512`). The `text-embedding-3-small` model supports up to 1536 dimensions, but 512 reduces storage and speeds up similarity search with minimal quality loss for most RAG workloads. For the trade-offs of shortening embeddings, see [Reduce dimensions](/azure/ai-services/openai/how-to/embeddings#reduce-dimensions). To check supported dimensions for your model, see [Azure OpenAI embeddings models](/azure/ai-services/openai/concepts/models#embeddings-models). |
| `CHUNK_SIZE` | Number of characters per chunk (default: `1000`). Larger values capture more context per chunk; smaller values improve retrieval precision. For guidance on picking a size, see [Chunk content size](/azure/search/vector-search-how-to-chunk-documents#content-size-considerations). |
| `CHUNK_OVERLAP` | Number of characters that overlap between adjacent chunks (default: `200`). Overlap preserves context at chunk boundaries. For guidance, see [Overlapping content](/azure/search/vector-search-how-to-chunk-documents#overlapping-content). |

## Install dependencies

Add the LangChain and Weaviate packages for this tutorial to the `requirements.txt` file you created in the [setup article](../../setup.md):

```text
langchain
langchain-openai
langchain-community
langchain-weaviate
weaviate-client
pypdf
docx2txt
```

- `langchain`, `langchain-openai`, `langchain-community`—the LangChain framework and Azure OpenAI integrations, which provide `AzureChatOpenAI`, `AzureOpenAIEmbeddings`, `RecursiveCharacterTextSplitter`, and the document loaders used in this tutorial.
- `langchain-weaviate`—LangChain integration for Weaviate, which provides `WeaviateVectorStore`.
- `weaviate-client`—the Weaviate Python client.
- `pypdf`—backs LangChain's `PyPDFLoader` for parsing PDF files.
- `docx2txt`—backs LangChain's `Docx2txtLoader` for parsing Word files.

With your virtual environment activated, install the updated dependencies:

```bash
pip install -r requirements.txt
```

## Create `langchain-weaviate.py`

Create a file called `langchain-weaviate.py` in your project directory. You'll build up the file across the steps that follow: Step 1 adds the imports and configuration, Steps 2–4 add the parsing, indexing, and retrieval logic, and Step 5 ties everything together in `main()` and runs the script.

## Step 1: Add imports and configuration

Start the file with the imports and a configuration block. The configuration block calls `load_dotenv()` to read the variables you set in the `.env` file into `os.environ`, then exposes them as module-level constants that every function uses.

```python
import os
import tempfile

import weaviate
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from dotenv import load_dotenv
from langchain_community.document_loaders import (
    CSVLoader,
    Docx2txtLoader,
    PyPDFLoader,
    TextLoader,
)
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_weaviate.vectorstores import WeaviateVectorStore
from weaviate.classes.init import Auth

from azure_files import connect_to_share, download_files, list_share_files

load_dotenv()

# Azure Files + Azure OpenAI (from the setup article's .env)
STORAGE_ACCOUNT_NAME = os.environ["AZURE_STORAGE_ACCOUNT_NAME"]
SHARE_NAME = os.environ["AZURE_STORAGE_SHARE_NAME"]
OPENAI_ENDPOINT = os.environ["AZURE_OPENAI_ENDPOINT"]
OPENAI_EMBEDDING_DEPLOYMENT = os.environ["AZURE_OPENAI_EMBEDDING_DEPLOYMENT"]
OPENAI_CHAT_DEPLOYMENT = os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT"]

# Weaviate (from this tutorial's additions to .env)
WEAVIATE_URL = os.environ["WEAVIATE_URL"]
WEAVIATE_API_KEY = os.environ["WEAVIATE_API_KEY"]
WEAVIATE_COLLECTION_NAME = os.getenv("WEAVIATE_COLLECTION_NAME", "AzureFilesRAG")

# Tuning parameters (optional — defaults match .env)
EMBEDDING_DIMENSIONS = int(os.getenv("EMBEDDING_DIMENSIONS", "512"))
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "1000"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "200"))

# Azure authentication for Azure OpenAI and Azure Files (Entra ID, keyless)
CREDENTIAL = DefaultAzureCredential()
TOKEN_PROVIDER = get_bearer_token_provider(CREDENTIAL, "https://cognitiveservices.azure.com/.default")
```

The functions in the next three steps reference these constants (`WEAVIATE_URL`, `OPENAI_ENDPOINT`, `CHUNK_SIZE`, `TOKEN_PROVIDER`, and so on). Append each step's code to the bottom of `langchain-weaviate.py` as you go.

## Step 2: Parse and chunk documents

After downloading files from Azure Files (covered in the [setup article](../../setup.md)), load each file into LangChain `Document` objects, then split those documents into overlapping chunks.

### Parse downloaded files

Map each file extension to the appropriate LangChain loader, then load each downloaded file with the source path preserved as metadata. Append the following to `langchain-weaviate.py`:

```python
LOADER_MAP = {
    ".pdf": PyPDFLoader,
    ".docx": Docx2txtLoader,
    ".csv": CSVLoader,
}
DEFAULT_LOADER = TextLoader


def parse_downloaded_files(downloaded_files):
    documents = []
    for info in downloaded_files:
        file_ext = os.path.splitext(info["file_name"].lower())[1]
        loader_cls = LOADER_MAP.get(file_ext, DEFAULT_LOADER)

        try:
            loaded = loader_cls(info["local_path"]).load()
        except Exception:
            print(f"Failed to parse {info['relative_path']}, skipping...")
            continue

        for doc in loaded:
            doc.metadata["azure_file_path"] = info["relative_path"]
            doc.metadata["file_name"] = info["file_name"]
        documents.extend(loaded)

    return documents
```

Unsupported extensions fall back to `TextLoader`. The `azure_file_path` metadata flows through chunking and retrieval so the model can cite the source file in its answer.

### Chunk documents

Split each document into overlapping chunks. The overlap preserves context at chunk boundaries so the embedding model can capture meaning that spans a split point. Append the following to `langchain-weaviate.py`:

```python
def chunk_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )
    return splitter.split_documents(documents)
```

`RecursiveCharacterTextSplitter` splits each document into chunks of `CHUNK_SIZE` characters with `CHUNK_OVERLAP` characters of overlap between adjacent chunks. All original metadata (such as `azure_file_path`) is automatically copied to each child chunk.

## Step 3: Create embeddings and index into Weaviate

Connect to your Weaviate cluster, create an embedding model using Azure OpenAI, and upsert document chunks into a Weaviate collection. Append the following to `langchain-weaviate.py`:

```python
def embed_and_index(chunks):
    client = weaviate.connect_to_weaviate_cloud(
        cluster_url=WEAVIATE_URL,
        auth_credentials=Auth.api_key(WEAVIATE_API_KEY),
    )

    embeddings = AzureOpenAIEmbeddings(
        azure_endpoint=OPENAI_ENDPOINT,
        azure_deployment=OPENAI_EMBEDDING_DEPLOYMENT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        dimensions=EMBEDDING_DIMENSIONS,
    )

    store = WeaviateVectorStore.from_documents(
        documents=chunks,
        embedding=embeddings,
        client=client,
        index_name=WEAVIATE_COLLECTION_NAME,
    )

    return client, store
```

This function:

- **Connects to Weaviate Cloud**—`weaviate.connect_to_weaviate_cloud()` opens an authenticated connection using your cluster URL and API key.
- **Creates the embedding model**—`AzureOpenAIEmbeddings` authenticates to Azure OpenAI using Entra ID tokens (via `azure_ad_token_provider`), not API keys.
- **Embeds and upserts into a single collection**—`WeaviateVectorStore.from_documents()` batches the embedding API calls and upserts the resulting vectors into one Weaviate collection. If the collection doesn't exist, the integration auto-creates it.

## Step 4: Build the retrieval chain

Build a LangChain Expression Language (LCEL) chain that retrieves relevant chunks from Weaviate and generates an answer using Azure OpenAI. Append the following to `langchain-weaviate.py`:

```python
def build_qa_chain(vector_store):
    llm = AzureChatOpenAI(
        azure_endpoint=OPENAI_ENDPOINT,
        azure_deployment=OPENAI_CHAT_DEPLOYMENT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        api_version="2024-12-01-preview",
    )

    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 5},
    )

    prompt = PromptTemplate.from_template(
        "Answer the question based on the context below. "
        "Be specific and cite the source file name in brackets for each fact.\n\n"
        "Context:\n{context}\n\n"
        "Question: {question}\n\nAnswer:"
    )

    def format_docs(docs):
        return "\n\n".join(
            f"[{d.metadata.get('azure_file_path', '')}]\n{d.page_content}"
            for d in docs
        )

    return (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
```

The LCEL chain has four components:

- **Retrieve**—The user's question is vectorized and the top 5 matching chunks are retrieved from Weaviate using cosine similarity.
- **Format**—Each retrieved chunk is prefixed with its Azure Files source path (from the `azure_file_path` metadata) for citation, then all chunks are joined into a single context string.
- **Prompt**—The context and question are injected into a template that instructs the LLM to be specific and cite sources.
- **Generate**—`AzureChatOpenAI` produces an answer and `StrOutputParser()` extracts the text.

## Step 5: Run the pipeline

Append the `main()` function to the bottom of `langchain-weaviate.py`. It wires together the helpers from `azure_files.py` (from the [setup article](../../setup.md)) and the functions you added in Steps 2–4:

```python
def main():
    share = connect_to_share(STORAGE_ACCOUNT_NAME, SHARE_NAME, CREDENTIAL)

    print("Scanning file share...")
    file_references = list_share_files(share)
    print(f"Found {len(file_references)} files.\n")

    with tempfile.TemporaryDirectory() as temp_directory:
        print("Downloading files...")
        downloaded = download_files(file_references, temp_directory)

        # Parse and chunk (Step 2)
        documents = parse_downloaded_files(downloaded)
        chunks = chunk_documents(documents)
        print(f"{len(documents)} documents -> {len(chunks)} chunks.\n")

    # Embed and index (Step 3)
    print("Indexing into Weaviate...")
    client, vector_store = embed_and_index(chunks)

    # Build retrieval chain (Step 4)
    qa_chain = build_qa_chain(vector_store)
    print("Ready. Type 'quit' to exit.\n")

    try:
        while True:
            question = input("You: ").strip()
            if question.lower() in ("quit", "exit", "q"):
                break
            if not question:
                continue
            print(f"\nAnswer: {qa_chain.invoke(question)}\n")
    finally:
        client.close()


if __name__ == "__main__":
    main()
```

Run the pipeline from your project directory (with the virtual environment activated):

```bash
python langchain-weaviate.py
```

The script scans the Azure file share, downloads and parses documents, chunks them, indexes them into Weaviate, and starts an interactive query session. Ask questions and type `quit` to exit. The Weaviate client connection is closed automatically when the session ends.

The output should look like this:

```output
Scanning file share...
Found <N> files.

Downloading files...
<N> documents -> <M> chunks.

Indexing into Weaviate...
Ready. Type 'quit' to exit.

You: <your question about the indexed documents>
Answer: <grounded answer with citations in brackets, for example [docs/example.pdf]>
```

## Tips and troubleshooting

- **Azure authentication**—`DefaultAzureCredential` tries multiple credential sources in order. If you see authentication errors, run `az login` before the script, or see [`DefaultAzureCredential` troubleshooting](/python/api/overview/azure/identity-readme#defaultazurecredential).
- **Re-running the pipeline**—`WeaviateVectorStore.from_documents()` appends new vectors on every run rather than upserting, so stale chunks accumulate across runs. To rebuild from scratch, delete the collection from the [Weaviate Cloud console](https://console.weaviate.cloud/) before re-running.
- **Azure OpenAI API version**—The tutorial pins `api_version="2024-12-01-preview"` on `AzureChatOpenAI`. To track the latest supported version, see [Azure OpenAI API version lifecycle](/azure/ai-services/openai/api-version-deprecation).
- **Large file shares**—`download_files` copies the entire share into a temp directory before indexing. For shares larger than a few GB, batch downloads or stream files one at a time to reduce memory and disk usage.
- **Weaviate specifics**—The collection name must start with an uppercase letter (for example, `AzureFilesRAG`). `WEAVIATE_URL` must be the REST endpoint from the Weaviate Cloud console, not the gRPC endpoint.

## Clean up resources

This tutorial doesn't create any new Azure resources—it uses the storage account and Azure OpenAI resource you already had. To avoid ongoing charges, clean up the external services you used:

- **Weaviate collection**—Delete it from the [Weaviate Cloud console](https://console.weaviate.cloud/). If you don't plan to use the cluster again, delete it too.
- **Azure OpenAI deployments**—If you created the embedding or chat deployments only for this tutorial, delete them from the Azure portal under your Azure OpenAI resource. The resource itself is free to keep; you're only billed for deployed models and usage.
- **Azure file share**—Your file share might be shared infrastructure. Confirm with your administrator before deleting anything.

## Questions

Have questions about this tutorial? Email us at [files@microsoft.com](mailto:files@microsoft.com).

## Next steps

- [Azure OpenAI documentation](/azure/ai-services/openai/)
- [LangChain documentation](https://python.langchain.com/docs/introduction/)
- [Weaviate documentation](https://weaviate.io/developers/weaviate)
- [LangChain Weaviate integration](https://python.langchain.com/docs/integrations/vectorstores/weaviate/)