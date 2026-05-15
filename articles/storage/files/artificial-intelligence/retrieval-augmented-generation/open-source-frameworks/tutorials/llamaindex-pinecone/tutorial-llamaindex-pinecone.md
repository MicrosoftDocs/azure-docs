---
title: Build a RAG pipeline using Azure Files with LlamaIndex and Pinecone
description: Learn how to build a retrieval-augmented generation (RAG) pipeline that queries documents stored in Azure Files using LlamaIndex for orchestration and Pinecone as the vector database.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 04/09/2026
ms.author: t-flynnr
ms.devlang: python
ms.custom: devx-track-python
---

# Tutorial: Build a RAG pipeline using Azure Files with LlamaIndex and Pinecone

**Applies to:** ✔️ SMB file shares with Microsoft Entra ID authentication

In this tutorial, you build a retrieval-augmented generation (RAG) pipeline over documents stored in Azure Files. The pipeline uses LlamaIndex for orchestration and Pinecone as the vector database.

The sections that follow walk through each component of the pipeline. To start from a complete, runnable script and read along, create a file named `llamaindex-pinecone.py` in your project directory, copy the contents of [`llamaindex-pinecone.py`](https://github.com/Azure-Samples/azure-files-llamaindex-pinecone/blob/main/llamaindex-pinecone.py) from the [azure-files-llamaindex-pinecone](https://github.com/Azure-Samples/azure-files-llamaindex-pinecone) GitHub repository into it, and skip to [Step 5: Run the pipeline](#step-5-run-the-pipeline).

## Prerequisites

- Complete the [project setup and Azure Files authentication](../../setup.md). Your project directory should look like this:

  ```text
  <project-directory>/
  ├── .venv/
  ├── .env
  ├── azure_files.py
  └── requirements.txt
  ```

- A [Pinecone account](https://www.pinecone.io/) (the free tier is sufficient). You need an API key and an index name from the [Pinecone console](https://app.pinecone.io/). Pinecone is also available on the [Azure Marketplace](https://marketplace.microsoft.com/en-us/product/pineconesystemsinc1688761585469.pineconesaas) for enterprise deployments.

> [!IMPORTANT]
> Store your Pinecone API key securely. Don't commit API keys to source control.

## Set environment variables

Add the following variables to the `.env` file in your project directory:

```text
PINECONE_API_KEY=<your-pinecone-api-key>
PINECONE_INDEX_NAME=<your-pinecone-index-name>

# Tuning parameters (optional — defaults shown)
EMBEDDING_DIMENSIONS=512
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
```

| Variable | Description |
| :--- | :--- |
| `PINECONE_API_KEY` | Your Pinecone API key from the [Pinecone console](https://app.pinecone.io/) |
| `PINECONE_INDEX_NAME` | The name of your Pinecone index |
| `EMBEDDING_DIMENSIONS` | Dimension of the embedding vectors (default: `512`). The `text-embedding-3-small` model supports up to 1,536 dimensions, but 512 reduces storage and speeds up similarity search with minimal quality loss for most RAG workloads. For the trade-offs of shortening embeddings, see [Reduce dimensions](/azure/ai-services/openai/how-to/embeddings#reduce-dimensions). To check supported dimensions for your model, see [Azure OpenAI embeddings models](/azure/ai-services/openai/concepts/models#embeddings-models). |
| `CHUNK_SIZE` | Number of tokens per chunk (default: `1000`). Larger values capture more context per chunk; smaller values improve retrieval precision. For guidance on picking a size, see [Chunk content size](/azure/search/vector-search-how-to-chunk-documents#content-size-considerations). |
| `CHUNK_OVERLAP` | Number of tokens that overlap between adjacent chunks (default: `200`). Overlap preserves context at chunk boundaries. For guidance, see [Overlapping content](/azure/search/vector-search-how-to-chunk-documents#overlapping-content). |

## Install dependencies

Add the LlamaIndex and Pinecone packages for this tutorial to the `requirements.txt` file you created in the [setup article](../../setup.md):

```text
llama-index
llama-index-embeddings-azure-openai
llama-index-llms-azure-openai
llama-index-vector-stores-pinecone
llama-index-readers-file
pinecone
```

- `llama-index`—the LlamaIndex framework, which provides `VectorStoreIndex`, `SentenceSplitter`, `StorageContext`, and the query engine used in this tutorial.
- `llama-index-embeddings-azure-openai`, `llama-index-llms-azure-openai`—Azure OpenAI integrations for embeddings and chat.
- `llama-index-vector-stores-pinecone`—LlamaIndex integration for Pinecone, which provides `PineconeVectorStore`.
- `llama-index-readers-file`—LlamaIndex file readers (`PDFReader`, `DocxReader`, `CSVReader`) used in this tutorial.
- `pinecone`—the Pinecone Python client.

With your virtual environment activated, install the updated dependencies:

```bash
pip install -r requirements.txt
```

## Create `llamaindex-pinecone.py`

Create a file called `llamaindex-pinecone.py` in your project directory. You build up the file across the steps that follow: Step 1 adds the imports and configuration, Steps 2–4 add the parsing, indexing, and retrieval logic, and Step 5 ties everything together in `main()` and runs the script.

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
from llama_index.vector_stores.pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec

from azure_files import connect_to_share, download_files, list_share_files

load_dotenv()

# Azure Files + Azure OpenAI (from the setup article's .env)
STORAGE_ACCOUNT_NAME = os.environ["AZURE_STORAGE_ACCOUNT_NAME"]
SHARE_NAME = os.environ["AZURE_STORAGE_SHARE_NAME"]
OPENAI_ENDPOINT = os.environ["AZURE_OPENAI_ENDPOINT"]
OPENAI_EMBEDDING_DEPLOYMENT = os.environ["AZURE_OPENAI_EMBEDDING_DEPLOYMENT"]
OPENAI_CHAT_DEPLOYMENT = os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT"]

# Pinecone (from this tutorial's additions to .env)
PINECONE_API_KEY = os.environ["PINECONE_API_KEY"]
PINECONE_INDEX_NAME = os.environ["PINECONE_INDEX_NAME"]

# Tuning parameters (optional — defaults match .env)
EMBEDDING_DIMENSIONS = int(os.getenv("EMBEDDING_DIMENSIONS", "512"))
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "1000"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "200"))

# Azure authentication for Azure OpenAI and Azure Files (Entra ID, keyless)
CREDENTIAL = DefaultAzureCredential()
TOKEN_PROVIDER = get_bearer_token_provider(CREDENTIAL, "https://cognitiveservices.azure.com/.default")
```

The functions in the next three steps reference these constants (`PINECONE_INDEX_NAME`, `OPENAI_ENDPOINT`, `CHUNK_SIZE`, `TOKEN_PROVIDER`, and so on). Append each step's code to the bottom of `llamaindex-pinecone.py` as you go.

## Step 2: Parse and chunk documents

After downloading files from Azure Files (covered in the [setup article](../../setup.md)), convert each file into a LlamaIndex `Document`, then split those documents into overlapping nodes. LlamaIndex calls chunks *nodes*. Each node carries metadata and relationship information from its parent document.

### Parse downloaded files

Map each file extension to the appropriate LlamaIndex reader, then load each downloaded file with the source path preserved as metadata. Append the following to `llamaindex-pinecone.py`:

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

LlamaIndex's `SentenceSplitter` respects sentence boundaries where possible, producing more semantically coherent chunks than a character-only splitter. Append the following to `llamaindex-pinecone.py`:

```python
def chunk_documents(documents):
    splitter = SentenceSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )
    return splitter.get_nodes_from_documents(documents)
```

`SentenceSplitter` splits each document into nodes of `CHUNK_SIZE` tokens with `CHUNK_OVERLAP` tokens of overlap between adjacent nodes. All original metadata (such as `azure_file_path`) is automatically copied to each child node.

## Step 3: Create embeddings and index into Pinecone

Connect to Pinecone, embed the nodes with Azure OpenAI, and upsert the vectors into a Pinecone index. Append the following to `llamaindex-pinecone.py`:

```python
def embed_and_index(nodes):
    pc = Pinecone(api_key=PINECONE_API_KEY)

    if not pc.has_index(PINECONE_INDEX_NAME):
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=EMBEDDING_DIMENSIONS,
            metric="cosine",
            spec=ServerlessSpec(cloud="azure", region="eastus2"),
        )

    pinecone_index = pc.Index(PINECONE_INDEX_NAME)

    embed_model = AzureOpenAIEmbedding(
        azure_endpoint=OPENAI_ENDPOINT,
        azure_deployment=OPENAI_EMBEDDING_DEPLOYMENT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        use_azure_ad=True,
        model="text-embedding-3-small",
        dimensions=EMBEDDING_DIMENSIONS,
        api_version="2024-06-01",
    )

    vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    return VectorStoreIndex(
        nodes=nodes,
        storage_context=storage_context,
        embed_model=embed_model,
    )
```

This function:

- **Creates the Pinecone index**—`Pinecone.has_index()` checks whether the index exists, and `create_index()` creates it if needed with the correct dimension and metric.
- **Creates the embedding model**—`AzureOpenAIEmbedding` authenticates to Azure OpenAI by using Microsoft Entra ID tokens through `azure_ad_token_provider` and `use_azure_ad=True`, not API keys.
- **Builds a `VectorStoreIndex`**—`PineconeVectorStore` wraps the Pinecone index, `StorageContext.from_defaults()` connects it to LlamaIndex's storage layer, and `VectorStoreIndex()` embeds all nodes and upserts them into Pinecone in one step.

## Step 4: Build the query engine

Build a LlamaIndex query engine that retrieves relevant nodes from Pinecone and generates an answer using Azure OpenAI. Append the following to `llamaindex-pinecone.py`:

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

The query engine combines retrieval and response synthesis:

- **Creates the LLM**—`AzureOpenAI` uses `engine` as the deployment name and authenticates through Entra ID with `use_azure_ad=True`.
- **Builds the query engine**—`index.as_query_engine()` creates a retrieval and synthesis pipeline that embeds the user's question, retrieves the top 5 nodes from Pinecone by using cosine similarity, and synthesizes a response. A custom `PromptTemplate` instructs the model to cite the source file name for each fact.

## Step 5: Run the pipeline

Append the `main()` function to the bottom of `llamaindex-pinecone.py`. It wires together the helpers from `azure_files.py` (from the [setup article](../../setup.md)) and the functions you added in Steps 2–4:

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
    print("Indexing into Pinecone...")
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
python llamaindex-pinecone.py
```

The script scans the Azure file share, downloads and parses documents, chunks them, indexes them into Pinecone, and starts an interactive query session. Ask questions and type `quit` to exit.

The output should look like this:

```output
Scanning file share...
Found <N> files.

Downloading files...
<N> documents -> <M> nodes.

Indexing into Pinecone...
Ready. Type 'quit' to exit.

You: <your question about the indexed documents>
Answer: <grounded answer with citations in brackets, for example [docs/example.pdf]>
```

## Tips and troubleshooting

- **Azure authentication**—`DefaultAzureCredential` tries multiple credential sources in order. If you see authentication errors, run `az login` before the script, or see [`DefaultAzureCredential` troubleshooting](/python/api/overview/azure/identity-readme#defaultazurecredential).
- **Re-running the pipeline**—Each run inserts new nodes with fresh IDs, so stale chunks accumulate across runs. To rebuild from scratch, delete the index from the [Pinecone console](https://app.pinecone.io/) before rerunning.
- **Azure OpenAI API version**—The tutorial pins `api_version="2024-06-01"` on `AzureOpenAI` and `AzureOpenAIEmbedding`. To track the latest supported version, see [Azure OpenAI API version lifecycle](/azure/ai-services/openai/api-version-deprecation).
- **Large file shares**—`download_files` copies the entire share into a temporary directory before indexing. For shares larger than a few GB, batch downloads or stream files one at a time to reduce memory and disk usage.
- **Pinecone requirements**—Index names must be lowercase. For serverless indexes on Azure, `eastus2` is a supported region.

## Clean up resources

This tutorial doesn't create any new Azure resources. It uses the storage account and Azure OpenAI resource that you already have. To avoid ongoing charges, clean up the external services you used:

- **Pinecone index**—Delete it from the [Pinecone console](https://app.pinecone.io/) or by using the Pinecone API.
- **Azure OpenAI deployments**—If you created the embedding or chat deployments only for this tutorial, delete them from the Azure portal under your Azure OpenAI resource. The resource itself is free to keep; you pay only for deployed models and usage.
- **Azure file share**—Your file share might be shared infrastructure. Confirm with your administrator before deleting anything.

## Questions

Have questions about this tutorial? Email us at [azurefiles@microsoft.com](mailto:azurefiles@microsoft.com).

## Next steps

- [Azure OpenAI documentation](/azure/ai-services/openai/)
- [LlamaIndex documentation](https://docs.llamaindex.ai/)
- [Pinecone documentation](https://docs.pinecone.io/)
- [LlamaIndex Pinecone integration](https://developers.llamaindex.ai/python/examples/vector_stores/pineconeindexdemo)
