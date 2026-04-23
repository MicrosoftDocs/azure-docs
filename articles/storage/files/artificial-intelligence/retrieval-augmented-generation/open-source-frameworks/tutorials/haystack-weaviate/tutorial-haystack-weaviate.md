---
title: Build a RAG pipeline using Azure Files with Haystack and Weaviate
description: Learn how to build a retrieval-augmented generation (RAG) pipeline that queries documents stored in Azure Files using Haystack for orchestration and Weaviate as the vector database.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 04/09/2026
ms.author: t-flynnr
ms.devlang: python
ms.custom: devx-track-python
---

# Tutorial: Build a RAG pipeline using Azure Files with Haystack and Weaviate

**Applies to:** ✔️ SMB file shares with Microsoft Entra ID authentication

In this tutorial, you build a retrieval-augmented generation (RAG) pipeline over documents stored in Azure Files. The pipeline uses Haystack for orchestration and Weaviate as the vector database.

The sections that follow walk through each component of the pipeline. If you'd rather start from a complete, runnable script and read along, create a file named `haystack-weaviate.py` in your project directory, copy the contents of [`haystack-weaviate.py`](https://github.com/Azure-Samples/azure-files-haystack-weaviate/blob/main/haystack-weaviate.py) from the [azure-files-haystack-weaviate](https://github.com/Azure-Samples/azure-files-haystack-weaviate) GitHub repository into it, and skip to [Step 5: Run the pipeline](#step-5-run-the-pipeline).

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
| `WEAVIATE_API_KEY` | Your Weaviate API key from the [Weaviate Cloud console](https://console.weaviate.cloud/) |
| `WEAVIATE_COLLECTION_NAME` | Weaviate collection name (defaults to `AzureFilesRAG`). The name must start with an uppercase letter. |
| `EMBEDDING_DIMENSIONS` | Dimension of the embedding vectors (default: `512`). The `text-embedding-3-small` model supports up to 1536 dimensions, but 512 reduces storage and speeds up similarity search with minimal quality loss for most RAG workloads. For the trade-offs of shortening embeddings, see [Reduce dimensions](/azure/ai-services/openai/how-to/embeddings#reduce-dimensions). To check supported dimensions for your model, see [Azure OpenAI embeddings models](/azure/ai-services/openai/concepts/models#embeddings-models). |
| `CHUNK_SIZE` | Number of words per chunk for Haystack (default: `1000`). Larger values capture more context per chunk; smaller values improve retrieval precision. For guidance on picking a size, see [Chunk content size](/azure/search/vector-search-how-to-chunk-documents#content-size-considerations). |
| `CHUNK_OVERLAP` | Number of words that overlap between adjacent chunks (default: `200`). Overlap preserves context at chunk boundaries. For guidance, see [Overlapping content](/azure/search/vector-search-how-to-chunk-documents#overlapping-content). |

## Install dependencies

Add the Haystack and Weaviate packages for this tutorial to the `requirements.txt` file you created in the [setup article](../../setup.md):

```text
haystack-ai
weaviate-haystack
pypdf
python-docx
```

- `haystack-ai`—the Haystack framework, which provides the `Pipeline`, `DocumentSplitter`, Azure OpenAI embedders/generator, and other components used in this tutorial.
- `weaviate-haystack`—Haystack integration for Weaviate, which provides `WeaviateDocumentStore` and `WeaviateHybridRetriever`.
- `pypdf`—backs Haystack's `PyPDFToDocument` converter for parsing PDF files.
- `python-docx`—backs Haystack's `DOCXToDocument` converter for parsing Word files.

With your virtual environment activated, install the updated dependencies:

```bash
pip install -r requirements.txt
```

## Create `haystack-weaviate.py`

Create a file called `haystack-weaviate.py` in your project directory. You'll build up the file across the steps that follow: Step 1 adds the imports and configuration, Steps 2–4 add the parsing, indexing, and retrieval logic, and Step 5 ties everything together in `main()` and runs the script.

## Step 1: Add imports and configuration

Start the file with the imports and a configuration block. The configuration block calls `load_dotenv()` to read the variables you set in the `.env` file into `os.environ`, then exposes them as module-level constants that every function uses.

```python
import os
import tempfile
from pathlib import Path

from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from dotenv import load_dotenv
from haystack import Pipeline
from haystack.components.builders import PromptBuilder
from haystack.components.converters import (
    CSVToDocument,
    DOCXToDocument,
    PyPDFToDocument,
    TextFileToDocument,
)
from haystack.components.embedders import AzureOpenAIDocumentEmbedder, AzureOpenAITextEmbedder
from haystack.components.generators import AzureOpenAIGenerator
from haystack.components.preprocessors import DocumentSplitter
from haystack.components.writers import DocumentWriter
from haystack.document_stores.types import DuplicatePolicy
from haystack_integrations.components.retrievers.weaviate import WeaviateHybridRetriever
from haystack_integrations.document_stores.weaviate import AuthApiKey, WeaviateDocumentStore

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
WEAVIATE_COLLECTION_NAME = os.getenv("WEAVIATE_COLLECTION_NAME", "AzureFilesRAG")

# Tuning parameters (optional — defaults match .env)
EMBEDDING_DIMENSIONS = int(os.getenv("EMBEDDING_DIMENSIONS", "512"))
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "1000"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "200"))

# Azure authentication for Azure OpenAI and Azure Files (Entra ID, keyless)
CREDENTIAL = DefaultAzureCredential()
TOKEN_PROVIDER = get_bearer_token_provider(CREDENTIAL, "https://cognitiveservices.azure.com/.default")
```

The functions in the next three steps reference these constants (`WEAVIATE_URL`, `OPENAI_ENDPOINT`, `CHUNK_SIZE`, `TOKEN_PROVIDER`, and so on). Append each step's code to the bottom of `haystack-weaviate.py` as you go.

> [!NOTE]
> `WEAVIATE_API_KEY` doesn't appear in the constants above. `AuthApiKey()` reads it directly from the environment in Step 3, so the key is never held in a Python variable.

## Step 2: Parse and chunk documents

After downloading files from Azure Files (covered in the [setup article](../../setup.md)), convert each file into a Haystack `Document`, then split those documents into overlapping chunks.

### Parse downloaded files

Map each file extension to the appropriate Haystack converter, then convert each downloaded file into one or more `Document` objects with the source path preserved as metadata. Append the following to `haystack-weaviate.py`:

```python
CONVERTER_MAP = {
    ".pdf": PyPDFToDocument(),
    ".docx": DOCXToDocument(),
    ".csv": CSVToDocument(),
}
DEFAULT_CONVERTER = TextFileToDocument()


def parse_downloaded_files(downloaded_files):
    documents = []
    for info in downloaded_files:
        file_ext = os.path.splitext(info["file_name"].lower())[1]
        converter = CONVERTER_MAP.get(file_ext, DEFAULT_CONVERTER)

        metadata = {
            "azure_file_path": info["relative_path"],
            "file_name": info["file_name"],
        }

        try:
            result = converter.run(sources=[Path(info["local_path"])], meta=metadata)
            documents.extend(result["documents"])
        except Exception:
            print(f"Failed to parse {info['relative_path']}, skipping...")
            continue

    return documents
```

Unsupported extensions fall back to `TextFileToDocument`. The `azure_file_path` metadata flows through chunking and retrieval so the model can cite the source file in its answer.

### Chunk documents

Haystack's `DocumentSplitter` counts by words rather than characters, producing more semantically consistent chunk sizes. Append the following to `haystack-weaviate.py`:

```python
def chunk_documents(documents):
    splitter = DocumentSplitter(
        split_by="word",
        split_length=CHUNK_SIZE,
        split_overlap=CHUNK_OVERLAP,
    )
    result = splitter.run(documents=documents)
    return result["documents"]
```

`DocumentSplitter` splits each document into chunks of `CHUNK_SIZE` words with `CHUNK_OVERLAP` words of overlap between adjacent chunks. All original metadata (such as `azure_file_path`) is automatically copied to each child chunk.

## Step 3: Create embeddings and index into Weaviate

Connect to your Weaviate cluster, create an embedding model using Azure OpenAI, and upsert the vectors through a Haystack indexing pipeline. Append the following to `haystack-weaviate.py`:

```python
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

- **Creates the document store**—`WeaviateDocumentStore` connects to your Weaviate Cloud cluster using `AuthApiKey()`, which reads the `WEAVIATE_API_KEY` environment variable automatically. The `collection_settings` dict defines the collection schema—the collection name must start with an uppercase letter. The base properties (`_original_id`, `content`, `blob_data`, `blob_mime_type`, `score`) are required by the Haystack integration.
- **Creates the embedding model**—`AzureOpenAIDocumentEmbedder` authenticates to Azure OpenAI using Entra ID tokens (via `azure_ad_token_provider`), not API keys.
- **Embeds and writes**—The indexing pipeline connects the embedder to the writer. `DocumentWriter` upserts the embedded chunks into Weaviate with an `OVERWRITE` policy to prevent duplicates across pipeline runs.

## Step 4: Build the retrieval pipeline

Build a Haystack query pipeline that retrieves relevant chunks from Weaviate using hybrid search and generates an answer using Azure OpenAI. Append the following to `haystack-weaviate.py`:

```python
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

    _PROMPT_TEMPLATE = (
        "Answer the question based on the context below. "
        "Be specific and cite the source file name in brackets for each fact.\n\n"
        "{% for doc in documents %}"
        "[{{ doc.meta.get('azure_file_path', '') }}]\n"
        "{{ doc.content }}\n\n"
        "{% endfor %}\n"
        "Question: {{ query }}\n\nAnswer:"
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
            "retriever": {"query": question},
            "prompt_builder": {"query": question},
        })
        replies = result["generator"]["replies"]
        return replies[0] if replies else "No answer generated."

    return run_query
```

The pipeline has four components:

- **Embed**—`AzureOpenAITextEmbedder` converts the user's question into an embedding vector.
- **Retrieve**—`WeaviateHybridRetriever` blends vector similarity and BM25 keyword matching in a single query. The `alpha=0.5` parameter gives equal weight to both signals (`alpha=0.0` for pure BM25, `alpha=1.0` for pure vector). The retriever takes two inputs: the embedding vector (wired from `text_embedder.embedding`) and the raw query text (passed at runtime).
- **Prompt**—`PromptBuilder` uses a Jinja2 template that iterates over the retrieved documents, prepends each document's source path for citation, and injects the user's question.
- **Generate**—`AzureOpenAIGenerator` sends the rendered prompt to Azure OpenAI and returns the response.

## Step 5: Run the pipeline

Append the `main()` function to the bottom of `haystack-weaviate.py`. It wires together the helpers from `azure_files.py` (from the [setup article](../../setup.md)) and the functions you added in Steps 2–4:

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
    store = embed_and_index(chunks)

    # Build query pipeline (Step 4)
    run_query = build_query_pipeline(store)
    print("Ready. Type 'quit' to exit.\n")

    while True:
        question = input("You: ").strip()
        if question.lower() in ("quit", "exit", "q"):
            break
        if not question:
            continue
        print(f"\nAnswer: {run_query(question)}\n")


if __name__ == "__main__":
    main()
```

Run the pipeline from your project directory (with the virtual environment activated):

```bash
python haystack-weaviate.py
```

The script scans the Azure file share, downloads and parses documents, chunks them, indexes them into Weaviate, and starts an interactive query session. Ask questions and type `quit` to exit.

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
- **Re-running the pipeline**—`DocumentWriter` uses `DuplicatePolicy.OVERWRITE`, which replaces documents with matching IDs. Because the splitter generates new IDs on every run, duplicates can still accumulate. To rebuild from scratch, delete the collection from the [Weaviate Cloud console](https://console.weaviate.cloud/) before re-running.
- **Azure OpenAI API version**—The Haystack Azure OpenAI components use a default API version. To pin a specific version, pass `api_version="..."` to the embedder and generator. To track the latest supported version, see [Azure OpenAI API version lifecycle](/azure/ai-services/openai/api-version-deprecation).
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
- [Haystack documentation](https://docs.haystack.deepset.ai/)
- [Weaviate documentation](https://weaviate.io/developers/weaviate)
- [Haystack Weaviate integration](https://docs.haystack.deepset.ai/docs/weaviatedocumentstore)
