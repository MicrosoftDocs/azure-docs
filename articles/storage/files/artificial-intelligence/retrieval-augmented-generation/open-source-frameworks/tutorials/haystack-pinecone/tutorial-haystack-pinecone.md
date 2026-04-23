---
title: Build a RAG pipeline using Azure Files with Haystack and Pinecone
description: Learn how to build a retrieval-augmented generation (RAG) pipeline that queries documents stored in Azure Files using Haystack for orchestration and Pinecone as the vector database.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 04/09/2026
ms.author: t-flynnr
ms.devlang: python
ms.custom: devx-track-python
---

# Tutorial: Build a RAG pipeline using Azure Files with Haystack and Pinecone

**Applies to:** ✔️ SMB file shares with Microsoft Entra ID authentication

In this tutorial, you build a retrieval-augmented generation (RAG) pipeline over documents stored in Azure Files. The pipeline uses Haystack for orchestration and Pinecone as the vector database.

The sections that follow walk through each component of the pipeline. If you'd rather start from a complete, runnable script and read along, create a file named `haystack-pinecone.py` in your project directory, copy the contents of [`haystack-pinecone.py`](https://github.com/Azure-Samples/azure-files-haystack-pinecone/blob/main/haystack-pinecone.py) from the [azure-files-haystack-pinecone](https://github.com/Azure-Samples/azure-files-haystack-pinecone) GitHub repository into it, and skip to [Step 5: Run the pipeline](#step-5-run-the-pipeline).

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
> Store your Pinecone API key securely. Do not commit API keys to source control.

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
| `EMBEDDING_DIMENSIONS` | Dimension of the embedding vectors (default: `512`). The `text-embedding-3-small` model supports up to 1536 dimensions, but 512 reduces storage and speeds up similarity search with minimal quality loss for most RAG workloads. For the trade-offs of shortening embeddings, see [Reduce dimensions](/azure/ai-services/openai/how-to/embeddings#reduce-dimensions). To check supported dimensions for your model, see [Azure OpenAI embeddings models](/azure/ai-services/openai/concepts/models#embeddings-models). |
| `CHUNK_SIZE` | Number of words per chunk for Haystack (default: `1000`). Larger values capture more context per chunk; smaller values improve retrieval precision. For guidance on picking a size, see [Chunk content size](/azure/search/vector-search-how-to-chunk-documents#content-size-considerations). |
| `CHUNK_OVERLAP` | Number of words that overlap between adjacent chunks (default: `200`). Overlap preserves context at chunk boundaries. For guidance, see [Overlapping content](/azure/search/vector-search-how-to-chunk-documents#overlapping-content). |

## Install dependencies

Add the Haystack and Pinecone packages for this tutorial to the `requirements.txt` file you created in the [setup article](../../setup.md):

```text
haystack-ai
pinecone-haystack
pinecone
pypdf
python-docx
```

- `haystack-ai`—the Haystack framework, which provides the `Pipeline`, `DocumentSplitter`, Azure OpenAI embedders/generator, and other components used in this tutorial.
- `pinecone-haystack`—Haystack integration for Pinecone, which provides `PineconeDocumentStore` and `PineconeEmbeddingRetriever`.
- `pinecone`—the Pinecone Python client.
- `pypdf`—backs Haystack's `PyPDFToDocument` converter for parsing PDF files.
- `python-docx`—backs Haystack's `DOCXToDocument` converter for parsing Word files.

With your virtual environment activated, install the updated dependencies:

```bash
pip install -r requirements.txt
```

## Create `haystack-pinecone.py`

Create a file called `haystack-pinecone.py` in your project directory. You'll build up the file across the steps that follow: Step 1 adds the imports and configuration, Steps 2–4 add the parsing, indexing, and retrieval logic, and Step 5 ties everything together in `main()` and runs the script.

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
from haystack_integrations.components.retrievers.pinecone import PineconeEmbeddingRetriever
from haystack_integrations.document_stores.pinecone import PineconeDocumentStore

from azure_files import connect_to_share, download_files, list_share_files

load_dotenv()

# Azure Files + Azure OpenAI (from the setup article's .env)
STORAGE_ACCOUNT_NAME = os.environ["AZURE_STORAGE_ACCOUNT_NAME"]
SHARE_NAME = os.environ["AZURE_STORAGE_SHARE_NAME"]
OPENAI_ENDPOINT = os.environ["AZURE_OPENAI_ENDPOINT"]
OPENAI_EMBEDDING_DEPLOYMENT = os.environ["AZURE_OPENAI_EMBEDDING_DEPLOYMENT"]
OPENAI_CHAT_DEPLOYMENT = os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT"]

# Pinecone (from this tutorial's additions to .env)
PINECONE_INDEX_NAME = os.environ["PINECONE_INDEX_NAME"]

# Tuning parameters (optional — defaults match .env)
EMBEDDING_DIMENSIONS = int(os.getenv("EMBEDDING_DIMENSIONS", "512"))
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "1000"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "200"))

# Azure authentication for Azure OpenAI and Azure Files (Entra ID, keyless)
CREDENTIAL = DefaultAzureCredential()
TOKEN_PROVIDER = get_bearer_token_provider(CREDENTIAL, "https://cognitiveservices.azure.com/.default")
```

The functions in the next three steps reference these constants (`PINECONE_INDEX_NAME`, `OPENAI_ENDPOINT`, `CHUNK_SIZE`, `TOKEN_PROVIDER`, and so on). Append each step's code to the bottom of `haystack-pinecone.py` as you go.

> [!NOTE]
> `PINECONE_API_KEY` doesn't appear in the constants above. `PineconeDocumentStore` reads it directly from the `PINECONE_API_KEY` environment variable in Step 3, so the key is never held in a Python variable.

## Step 2: Parse and chunk documents

After downloading files from Azure Files (covered in the [setup article](../../setup.md)), convert each file into a Haystack `Document`, then split those documents into overlapping chunks.

### Parse downloaded files

Map each file extension to the appropriate Haystack converter, then convert each downloaded file into one or more `Document` objects with the source path preserved as metadata. Append the following to `haystack-pinecone.py`:

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

Haystack's `DocumentSplitter` counts by words rather than characters, producing more semantically consistent chunk sizes. Append the following to `haystack-pinecone.py`:

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

## Step 3: Create embeddings and index into Pinecone

Build a Haystack indexing pipeline that embeds document chunks with Azure OpenAI and writes the vectors into a Pinecone index. Append the following to `haystack-pinecone.py`:

```python
def embed_and_index(chunks):
    store = PineconeDocumentStore(
        index=PINECONE_INDEX_NAME,
        namespace="default",
        dimension=EMBEDDING_DIMENSIONS,
        metric="cosine",
        spec={"serverless": {"region": "eastus2", "cloud": "azure"}},
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

- **Creates the document store**—`PineconeDocumentStore` reads `PINECONE_API_KEY` from the environment and auto-creates the Pinecone index if it doesn't exist, using the `dimension`, `metric`, and `spec` parameters. If the index already exists, it reuses it.
- **Creates the embedding model**—`AzureOpenAIDocumentEmbedder` authenticates to Azure OpenAI using Entra ID tokens (via `azure_ad_token_provider`), not API keys.
- **Embeds and writes**—The indexing pipeline connects the embedder to the writer. `DocumentWriter` upserts the embedded chunks into Pinecone with an `OVERWRITE` policy to prevent duplicates across pipeline runs.

## Step 4: Build the retrieval pipeline

Build a Haystack query pipeline that embeds the user's question, retrieves relevant chunks from Pinecone, and generates an answer using Azure OpenAI. Append the following to `haystack-pinecone.py`:

```python
def build_query_pipeline(document_store):
    text_embedder = AzureOpenAITextEmbedder(
        azure_endpoint=OPENAI_ENDPOINT,
        azure_deployment=OPENAI_EMBEDDING_DEPLOYMENT,
        azure_ad_token_provider=TOKEN_PROVIDER,
        api_key=None,
        dimensions=EMBEDDING_DIMENSIONS,
    )

    retriever = PineconeEmbeddingRetriever(
        document_store=document_store,
        top_k=5,
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
            "prompt_builder": {"query": question},
        })
        replies = result["generator"]["replies"]
        return replies[0] if replies else "No answer generated."

    return run_query
```

The pipeline has four components:

- **Embed**—`AzureOpenAITextEmbedder` converts the user's question into an embedding vector.
- **Retrieve**—`PineconeEmbeddingRetriever` queries Pinecone with the embedding vector and returns the top 5 matching documents using cosine similarity.
- **Prompt**—`PromptBuilder` uses a Jinja2 template that iterates over the retrieved documents, prepends each document's source path for citation, and injects the user's question.
- **Generate**—`AzureOpenAIGenerator` sends the rendered prompt to Azure OpenAI and returns the response.

## Step 5: Run the pipeline

Append the `main()` function to the bottom of `haystack-pinecone.py`. It wires together the helpers from `azure_files.py` (from the [setup article](../../setup.md)) and the functions you added in Steps 2–4:

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
    print("Indexing into Pinecone...")
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
python haystack-pinecone.py
```

The script scans the Azure file share, downloads and parses documents, chunks them, indexes them into Pinecone, and starts an interactive query session. Ask questions and type `quit` to exit.

The output should look like this:

```output
Scanning file share...
Found <N> files.

Downloading files...
<N> documents -> <M> chunks.

Indexing into Pinecone...
Ready. Type 'quit' to exit.

You: <your question about the indexed documents>
Answer: <grounded answer with citations in brackets, for example [docs/example.pdf]>
```

## Tips and troubleshooting

- **Azure authentication**—`DefaultAzureCredential` tries multiple credential sources in order. If you see authentication errors, run `az login` before the script, or see [`DefaultAzureCredential` troubleshooting](/python/api/overview/azure/identity-readme#defaultazurecredential).
- **Re-running the pipeline**—`DocumentWriter` uses `DuplicatePolicy.OVERWRITE`, which replaces documents with matching IDs. Because the splitter generates new IDs on every run, duplicates can still accumulate. To rebuild from scratch, delete the index from the [Pinecone console](https://app.pinecone.io/) before re-running.
- **Azure OpenAI API version**—The Haystack Azure OpenAI components use a default API version. To pin a specific version, pass `api_version="..."` to the embedder and generator. To track the latest supported version, see [Azure OpenAI API version lifecycle](/azure/ai-services/openai/api-version-deprecation).
- **Large file shares**—`download_files` copies the entire share into a temp directory before indexing. For shares larger than a few GB, batch downloads or stream files one at a time to reduce memory and disk usage.
- **Pinecone specifics**—Index names must be lowercase. For serverless indexes on Azure, `eastus2` is a supported region.

## Clean up resources

This tutorial doesn't create any new Azure resources—it uses the storage account and Azure OpenAI resource you already had. To avoid ongoing charges, clean up the external services you used:

- **Pinecone index**—Delete it from the [Pinecone console](https://app.pinecone.io/) or via the Pinecone API.
- **Azure OpenAI deployments**—If you created the embedding or chat deployments only for this tutorial, delete them from the Azure portal under your Azure OpenAI resource. The resource itself is free to keep; you're only billed for deployed models and usage.
- **Azure file share**—Your file share might be shared infrastructure. Confirm with your administrator before deleting anything.

## Questions

Have questions about this tutorial? Email us at [files@microsoft.com](mailto:files@microsoft.com).

## Next steps

- [Azure OpenAI documentation](/azure/ai-services/openai/)
- [Haystack documentation](https://docs.haystack.deepset.ai/)
- [Pinecone documentation](https://docs.pinecone.io/)
- [Haystack Pinecone integration](https://docs.haystack.deepset.ai/docs/pinecone-document-store)
