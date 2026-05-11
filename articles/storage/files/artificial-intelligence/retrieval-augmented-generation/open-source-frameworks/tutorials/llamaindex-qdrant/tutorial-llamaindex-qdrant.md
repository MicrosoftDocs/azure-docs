---
title: Build a RAG pipeline using Azure Files with LlamaIndex and Qdrant
description: Learn how to build a retrieval-augmented generation (RAG) pipeline that queries documents stored in Azure Files using LlamaIndex for orchestration and Qdrant as the vector database.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 04/09/2026
ms.author: t-flynnr
ms.devlang: python
ms.custom: devx-track-python
---

# Tutorial: Build a RAG pipeline using Azure Files with LlamaIndex and Qdrant

**Applies to:** ✔️ SMB file shares with Microsoft Entra ID authentication

In this tutorial, you build a retrieval-augmented generation (RAG) pipeline over documents stored in Azure Files. The pipeline uses LlamaIndex for orchestration and Qdrant as the vector database.

The sections that follow walk through each component of the pipeline. If you'd rather start from a complete, runnable script and read along, create a file named `llamaindex-qdrant.py` in your project directory, copy the contents of [`llamaindex-qdrant.py`](https://github.com/Azure-Samples/azure-files-llamaindex-qdrant/blob/main/llamaindex-qdrant.py) from the [azure-files-llamaindex-qdrant](https://github.com/Azure-Samples/azure-files-llamaindex-qdrant) GitHub repository into it, and skip to [Step 5: Run the pipeline](#step-5-run-the-pipeline).

## Prerequisites

- Complete the [project setup and Azure Files authentication](../../setup.md). Your project directory should look like this:

  ```text
  <project-directory>/
  ├── .venv/
  ├── .env
  ├── azure_files.py
  └── requirements.txt
  ```

- A [Qdrant Cloud](https://cloud.qdrant.io/) account (the free tier is sufficient), or a self-hosted Qdrant instance. You need a cluster URL and API key from the [Qdrant Cloud console](https://cloud.qdrant.io/). Qdrant is also available on the [Azure Marketplace](https://marketplace.microsoft.com/en-us/product/saas/qdrantsolutionsgmbh1698769709989.qdrant-db) for enterprise deployments.

> [!IMPORTANT]
> Store your Qdrant API key securely. Do not commit API keys to source control.

## Set environment variables

Add the following variables to the `.env` file in your project directory:

```text
QDRANT_URL=<your-qdrant-url>
QDRANT_API_KEY=<your-qdrant-api-key>
QDRANT_COLLECTION_NAME=azure-files-rag

# Tuning parameters (optional — defaults shown)
EMBEDDING_DIMENSIONS=512
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
```

| Variable | Description |
| :--- | :--- |
| `QDRANT_URL` | Your Qdrant cluster URL from the [Qdrant Cloud console](https://cloud.qdrant.io/) |
| `QDRANT_API_KEY` | Your Qdrant API key from the [Qdrant Cloud console](https://cloud.qdrant.io/) |
| `QDRANT_COLLECTION_NAME` | Qdrant collection name (defaults to `azure-files-rag`) |
| `EMBEDDING_DIMENSIONS` | Dimension of the embedding vectors (default: `512`). The `text-embedding-3-small` model supports up to 1536 dimensions, but 512 reduces storage and speeds up similarity search with minimal quality loss for most RAG workloads. For the trade-offs of shortening embeddings, see [Reduce dimensions](/azure/ai-services/openai/how-to/embeddings#reduce-dimensions). To check supported dimensions for your model, see [Azure OpenAI embeddings models](/azure/ai-services/openai/concepts/models#embeddings-models). |
| `CHUNK_SIZE` | Number of tokens per chunk (default: `1000`). Larger values capture more context per chunk; smaller values improve retrieval precision. For guidance on picking a size, see [Chunk content size](/azure/search/vector-search-how-to-chunk-documents#content-size-considerations). |
| `CHUNK_OVERLAP` | Number of tokens that overlap between adjacent chunks (default: `200`). Overlap preserves context at chunk boundaries. For guidance, see [Overlapping content](/azure/search/vector-search-how-to-chunk-documents#overlapping-content). |

## Install dependencies

Add the LlamaIndex and Qdrant packages for this tutorial to the `requirements.txt` file you created in the [setup article](../../setup.md):

```text
llama-index-core
llama-index-embeddings-azure-openai
llama-index-llms-azure-openai
llama-index-vector-stores-qdrant
llama-index-readers-file
qdrant-client
```

- `llama-index-core`—the LlamaIndex framework, which provides `VectorStoreIndex`, `SentenceSplitter`, `StorageContext`, and the query engine used in this tutorial.
- `llama-index-embeddings-azure-openai`, `llama-index-llms-azure-openai`—Azure OpenAI integrations for embeddings and chat.
- `llama-index-vector-stores-qdrant`—LlamaIndex integration for Qdrant, which provides `QdrantVectorStore`.
- `llama-index-readers-file`—LlamaIndex file readers (`PDFReader`, `DocxReader`, `CSVReader`) used in this tutorial.
- `qdrant-client`—the Qdrant Python client.

With your virtual environment activated, install the updated dependencies:

```bash
pip install -r requirements.txt
```

## Create `llamaindex-qdrant.py`

Create a file called `llamaindex-qdrant.py` in your project directory. You'll build up the file across the steps that follow: Step 1 adds the imports and configuration, Steps 2–4 add the parsing, indexing, and retrieval logic, and Step 5 ties everything together in `main()` and runs the script.

## Step 1: Add imports and configuration

Start the file with the imports and a configuration block. The configuration block calls `load_dotenv()` to read the variables you set in the `.env` file into `os.environ`, then exposes them as module-level constants that every function uses.

```python
import os
import tempfile
from pathlib import Path

from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from dotenv import load_dotenv
from llama_index.core import Document, PromptTemplate, StorageContext, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding
from llama_index.llms.azure_openai import AzureOpenAI
from llama_index.readers.file import CSVReader, DocxReader, PDFReader
from llama_index.vector_stores.qdrant import QdrantVectorStore

from azure_files import connect_to_share, download_files, list_share_files

load_dotenv()

# Azure Files + Azure OpenAI (from the setup article's .env)
STORAGE_ACCOUNT_NAME = os.environ["AZURE_STORAGE_ACCOUNT_NAME"]
SHARE_NAME = os.environ["AZURE_STORAGE_SHARE_NAME"]
OPENAI_ENDPOINT = os.environ["AZURE_OPENAI_ENDPOINT"]
OPENAI_EMBEDDING_DEPLOYMENT = os.environ["AZURE_OPENAI_EMBEDDING_DEPLOYMENT"]
OPENAI_CHAT_DEPLOYMENT = os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT"]

# Qdrant (from this tutorial's additions to .env)
QDRANT_URL = os.environ["QDRANT_URL"]
QDRANT_API_KEY = os.environ["QDRANT_API_KEY"]
QDRANT_COLLECTION_NAME = os.getenv("QDRANT_COLLECTION_NAME", "azure-files-rag")

# Tuning parameters (optional — defaults match .env)
EMBEDDING_DIMENSIONS = int(os.getenv("EMBEDDING_DIMENSIONS", "512"))
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "1000"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "200"))

# Azure authentication for Azure OpenAI and Azure Files (Entra ID, keyless)
CREDENTIAL = DefaultAzureCredential()
TOKEN_PROVIDER = get_bearer_token_provider(CREDENTIAL, "https://cognitiveservices.azure.com/.default")
```

The functions in the next three steps reference these constants (`QDRANT_URL`, `OPENAI_ENDPOINT`, `CHUNK_SIZE`, `TOKEN_PROVIDER`, and so on). Append each step's code to the bottom of `llamaindex-qdrant.py` as you go.

## Step 2: Parse and chunk documents

After downloading files from Azure Files (covered in the [setup article](../../setup.md)), convert each file into a LlamaIndex `Document`, then split those documents into overlapping text nodes.

### Parse downloaded files

Map each file extension to the appropriate LlamaIndex reader, then load each downloaded file with the source path preserved as metadata. Append the following to `llamaindex-qdrant.py`:

```python
READER_MAP = {
    ".pdf": PDFReader(),
    ".docx": DocxReader(),
    ".csv": CSVReader(),
}


def parse_downloaded_files(downloaded_files):
    documents = []
    for info in downloaded_files:
        file_ext = os.path.splitext(info["file_name"].lower())[1]
        reader = READER_MAP.get(file_ext)

        try:
            if reader is not None:
                loaded = reader.load_data(file=Path(info["local_path"]))
            else:
                with open(info["local_path"], "r", encoding="utf-8", errors="ignore") as f:
                    loaded = [Document(text=f.read())]
        except Exception:
            print(f"Failed to parse {info['relative_path']}, skipping...")
            continue

        for doc in loaded:
            doc.metadata["azure_file_path"] = info["relative_path"]
            doc.metadata["file_name"] = info["file_name"]
        documents.extend(loaded)

    return documents
```

Unsupported extensions fall back to a plain-text `Document`. The `azure_file_path` metadata flows through chunking and retrieval so the model can cite the source file in its answer.

### Chunk documents

`SentenceSplitter` respects sentence boundaries — it prefers to split between sentences rather than mid-sentence. Append the following to `llamaindex-qdrant.py`:

```python
def chunk_documents(documents):
    splitter = SentenceSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )
    return splitter.get_nodes_from_documents(documents)
```

`SentenceSplitter` splits each document into nodes of `CHUNK_SIZE` tokens with `CHUNK_OVERLAP` tokens of overlap between adjacent nodes. All original metadata (such as `azure_file_path`) is automatically inherited by each child node.

## Step 3: Create embeddings and index into Qdrant

Connect to your Qdrant collection, create an embedding model using Azure OpenAI, and upsert the vectors. Append the following to `llamaindex-qdrant.py`:

```python
def embed_and_index(nodes):
    vector_store = QdrantVectorStore(
        collection_name=QDRANT_COLLECTION_NAME,
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
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

    return VectorStoreIndex(
        nodes=nodes,
        storage_context=storage_context,
        embed_model=embed_model,
    )
```

This function:

- **Creates the vector store**—`QdrantVectorStore` accepts `url` and `api_key` directly and creates the Qdrant client internally. The integration auto-creates the collection on first insert, using the embedding dimension from the first node and cosine distance by default.
- **Creates the embedding model**—`AzureOpenAIEmbedding` authenticates to Azure OpenAI using Entra ID tokens (via `azure_ad_token_provider`), not API keys. The `use_azure_ad=True` parameter is required for token-based authentication.
- **Embeds and indexes**—`VectorStoreIndex` takes the text nodes, embeds them via the Azure OpenAI model, and upserts the resulting vectors into Qdrant. Each node's metadata (such as `azure_file_path`) is stored in the Qdrant payload.

## Step 4: Build the query engine

Build a LlamaIndex query engine that retrieves relevant nodes from Qdrant and generates an answer using Azure OpenAI. Append the following to `llamaindex-qdrant.py`:

```python
def build_query_engine(index):
    llm = AzureOpenAI(
        engine=OPENAI_CHAT_DEPLOYMENT,
        model="gpt-4o-mini",
        azure_endpoint=OPENAI_ENDPOINT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        use_azure_ad=True,
        api_version="2024-06-01",
    )

    return index.as_query_engine(
        llm=llm,
        similarity_top_k=5,
        text_qa_template=PromptTemplate(
            "Answer the question based on the context below. "
            "Be specific and cite the source file name in brackets for each fact.\n\n"
            "Context:\n{context_str}\n\n"
            "Question: {query_str}\n\nAnswer:"
        ),
    )
```

The query engine has three stages:

- **Retrieve**—The user's question is vectorized and the top 5 matching nodes are retrieved from Qdrant using cosine similarity.
- **Prompt**—The retrieved nodes are injected into a template that instructs the LLM to be specific and cite sources.
- **Synthesize**—`index.as_query_engine()` generates an answer using Azure OpenAI with the custom prompt template.

## Step 5: Run the pipeline

Append the `main()` function to the bottom of `llamaindex-qdrant.py`. It wires together the helpers from `azure_files.py` (from the [setup article](../../setup.md)) and the functions you added in Steps 2–4:

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
        nodes = chunk_documents(documents)
        print(f"{len(documents)} documents -> {len(nodes)} nodes.\n")

    # Embed and index (Step 3)
    print("Indexing into Qdrant...")
    index = embed_and_index(nodes)

    # Build query engine (Step 4)
    query_engine = build_query_engine(index)
    print("Ready. Type 'quit' to exit.\n")

    while True:
        question = input("You: ").strip()
        if question.lower() in ("quit", "exit", "q"):
            break
        if not question:
            continue
        response = query_engine.query(question)
        print(f"\nAnswer: {response}\n")


if __name__ == "__main__":
    main()
```

Run the pipeline from your project directory (with the virtual environment activated):

```bash
python llamaindex-qdrant.py
```

The script scans the Azure file share, downloads and parses documents, chunks them, indexes them into Qdrant, and starts an interactive query session. Ask questions and type `quit` to exit.

The output should look like this:

```output
Scanning file share...
Found <N> files.

Downloading files...
<N> documents -> <M> nodes.

Indexing into Qdrant...
Ready. Type 'quit' to exit.

You: <your question about the indexed documents>
Answer: <grounded answer with citations in brackets, for example [docs/example.pdf]>
```

## Tips and troubleshooting

- **Azure authentication**—`DefaultAzureCredential` tries multiple credential sources in order. If you see authentication errors, run `az login` before the script, or see [`DefaultAzureCredential` troubleshooting](/python/api/overview/azure/identity-readme#defaultazurecredential).
- **Re-running the pipeline**—Each run inserts new nodes with fresh IDs, so stale chunks accumulate across runs. To rebuild from scratch, delete the collection from the [Qdrant Cloud console](https://cloud.qdrant.io/) before re-running.
- **Azure OpenAI API version**—The tutorial pins `api_version="2024-06-01"` on `AzureOpenAI` and `AzureOpenAIEmbedding`. To track the latest supported version, see [Azure OpenAI API version lifecycle](/azure/ai-services/openai/api-version-deprecation).
- **Large file shares**—`download_files` copies the entire share into a temp directory before indexing. For shares larger than a few GB, batch downloads or stream files one at a time to reduce memory and disk usage.
- **Qdrant specifics**—If you see TLS errors, make sure `QDRANT_URL` includes the `https://` scheme and port (for example, `https://xxxx.cloud.qdrant.io:6333`).

## Clean up resources

This tutorial doesn't create any new Azure resources—it uses the storage account and Azure OpenAI resource you already had. To avoid ongoing charges, clean up the external services you used:

- **Qdrant collection**—Delete it from the [Qdrant Cloud console](https://cloud.qdrant.io/) or via the Qdrant REST API. If you don't plan to use the cluster again, delete it too.
- **Azure OpenAI deployments**—If you created the embedding or chat deployments only for this tutorial, delete them from the Azure portal under your Azure OpenAI resource. The resource itself is free to keep; you're only billed for deployed models and usage.
- **Azure file share**—Your file share might be shared infrastructure. Confirm with your administrator before deleting anything.

## Questions

Have questions about this tutorial? Email us at [azurefiles@microsoft.com](mailto:azurefiles@microsoft.com).

## Next steps

- [Azure OpenAI documentation](/azure/ai-services/openai/)
- [LlamaIndex documentation](https://docs.llamaindex.ai/)
- [Qdrant documentation](https://qdrant.tech/documentation/)
- [LlamaIndex Qdrant integration](https://developers.llamaindex.ai/python/examples/vector_stores/qdrantindexdemo)
