---
title: How to build and consume an index using code
titleSuffix: Azure AI Studio
description: This article provides instructions on how to build and consume an index using code.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: dantaylo
ms.author: eur
author: eric-urban
---

# How to build and consume an index using code

[!INCLUDE [Feature preview](../../includes/feature-preview.md)]

In this article, you learn how to create an index and consume it from code. To create an index locally, we use the `promptflow-rag` package. To create a remote index on the cloud, we use the `azure-ai-ml` package. We consume the indexes using `langchain`.

## Prerequisites

You must have:

- An [AI Studio hub](../../how-to/create-azure-ai-resource.md) and [project](../../how-to/create-projects.md).

- An [Azure AI Search service connection](../../how-to/connections-add.md#create-a-new-connection) to index the sample product and customer data. If you don't have an Azure AI Search service, you can create one from the [Azure portal](https://portal.azure.com/) or see the instructions [here](../../../search/search-create-service-portal.md).
- Models for embedding:
    - You can use an ada-002 embedding model from Azure OpenAI. The instructions to deploy can be found [here](../deploy-models-openai.md).
    - OR you can use any another embedding model deployed in your AI studio project. In this example we use Cohere multi-lingual embedding. The instructions to deploy this model can be found [here](../deploy-models-cohere-embed.md).

## Build and consume an index locally

We can build and consume an index locally. 

### Required packages for local index operations

Install the following packages required for local index creation.

```bash
pip install promptflow-rag langchain langchain-openai
```
### Configure AI Search for local use

We use Azure AI Search as the index store. To get started, we can set up the Azure AI Search service using the following code:

```python
import os
# set credentials to your Azure AI Search instance
os.environ["AZURE_AI_SEARCH_KEY"] = "<your-ai-search-key>"
os.environ["AZURE_AI_SEARCH_ENDPOINT"] = "https://<your-ai-search-service>.search.windows.net"
```

### Build an index locally using Azure OpenAI embeddings

To create an index that uses Azure OpenAI embeddings, we configure environment variables to connect to the model.

```python
import os
# set credentials to your Azure OpenAI instance
os.environ["OPENAI_API_VERSION"] = "2023-07-01-preview"
os.environ["AZURE_OPENAI_API_KEY"] = "<your-azure-openai-api-key>"
os.environ["AZURE_OPENAI_ENDPOINT"] = "https://<your-azure-openai-service>.openai.azure.com/"
```

Now let us build the index using the `build_index` function.

```python
from promptflow.rag.config import LocalSource, AzureAISearchConfig, EmbeddingsModelConfig
from promptflow.rag import build_index

local_index_aoai=build_index(
    name="<your-index-name>" + "aoai",  # name of your index
    vector_store="azure_ai_search",  # the type of vector store
    embeddings_model_config=EmbeddingsModelConfig(
        model_name="text-embedding-ada-002",
        deployment_name="text-embedding-ada-002", # verify if your deployment name is same as model name
    ),
    input_source=LocalSource(input_data="<path-to-your-local-files>"),  # the location of your file/folders
    index_config=AzureAISearchConfig(
        ai_search_index_name="<your-index-name>" + "-aoai-store", # the name of the index store inside the azure ai search service
    ),
    tokens_per_chunk = 800, # Optional field - Maximum number of tokens per chunk
    token_overlap_across_chunks = 0, # Optional field - Number of tokens to overlap between chunks
)
```

The above code builds an index locally. It uses environment variables to get the AI Search service and also to connect to the Azure OpenAI embedding model. 

### Build an index locally using other embedding models deployed in your AI studio project

To create an index that uses an embedding model deployed in your AI studio project, we configure the connection to the model using a `ConnectionConfig` as shown below. The `subscription`, `resource_group` and `workspace` refers to the project where the embedding model is installed. The `connection_name` refers to the connection name for the model, which can be found in the AI Studio project settings page.

```python
from promptflow.rag.config import ConnectionConfig

my_connection_config=ConnectionConfig(
    subscription_id="<subscription_id>",
    resource_group_name="<resource_group_name>",
    workspace_name="<ai_studio_project_name>",
    connection_name="<serverless_connection_name>"
    )
```

Now let us build the index using the `build_index` function.

```python
from promptflow.rag.config import LocalSource, AzureAISearchConfig, EmbeddingsModelConfig
from promptflow.rag import build_index

local_index_cohere=build_index(
    name="<your-index-name>" + "cohere",  # name of your index
    vector_store="azure_ai_search",  # the type of vector store
    embeddings_model_config=EmbeddingsModelConfig(
        model_name="cohere-embed-v3-multilingual", # in this example we use cohere multi lingual embedding
        connection_config=my_connection_config # created in previous step
    ),
    input_source=LocalSource(input_data="<path-to-your-local-files>"),  # the location of your file/folders
    index_config=AzureAISearchConfig(
        ai_search_index_name="<your-index-name>" + "cohere-store", # the name of the index store inside the azure ai search service
    ),
    tokens_per_chunk = 800, # Optional field - Maximum number of tokens per chunk
    token_overlap_across_chunks = 0, # Optional field - Number of tokens to overlap between chunks
)
```

The above code builds an index locally. It uses environment variables to get the AI Search service and the connection config to connect to the embedding model. 

### Consuming a local index

The local index created can be used as a langchain retriever to consume it for search queries.

```python
from promptflow.rag import get_langchain_retriever_from_index

# Get the OpenAI embedded Index
retriever=get_langchain_retriever_from_index(local_index_aoai)
retriever.get_relevant_documents("<your search query>")

# Get the Cohere embedded Index
retriever=get_langchain_retriever_from_index(local_index_cohere)
retriever.get_relevant_documents("<your search query>")
```
### Registering the index in your AI Studio project (Optional)

Optionally, you can register the index in your AI Studio project so that you or others who have access to your project can use it from the cloud. Before proceeding [install the required packages](#required-packages-for-remote-index-operations) for remote operations.

#### Connect to the project

```python
# connect to the AI Studio project
from azure.identity import DefaultAzureCredential
from azure.ai.ml import MLClient

client=MLClient(
    DefaultAzureCredential(), 
    subscription_id="<subscription_id>",
    resource_group_name="<resource_group_name>",
    workspace_name="<ai_studio_project_name>"
    )
```
The `subscription`, `resource_group` and `workspace` in the above code refers to the project you want to connect to.

#### Register the index

```python
from azure.ai.ml.entities import Index

# register the index with Azure OpenAI embeddings
client.indexes.create_or_update(
    Index(name="<your-index-name>" + "aoai", 
          path=local_index_aoai, 
          version="1")
          )

# register the index with cohere embeddings
client.indexes.create_or_update(
    Index(name="<your-index-name>" + "cohere", 
          path=local_index_cohere, 
          version="1")
          )
```

> [!NOTE]
> Environment variables are intended for convenience in a local environment. However, if you register a local index created using environment variables, the index may not function as expected because secrets from environment variables won’t be transferred to the cloud index. To address this issue, you can use a `ConnectionConfig` or `connection_id` to create a local index before registering.

## Build an index (remotely) in your AI Studio project

We build an index in the cloud in your AI Studio project. 

### Required packages for remote index operations

Install the following packages required for remote index creation.

```bash
pip install azure-ai-ml promptflow-rag langchain langchain-openai
```

### Connect to the AI Studio project

To get started, we connect to the project. The `subscription`, `resource_group` and `workspace` in the code below refers to the project you want to connect to.

```python
# connect to the AI Studio project
from azure.identity import DefaultAzureCredential
from azure.ai.ml import MLClient

client=MLClient(
    DefaultAzureCredential(), 
    subscription_id="<subscription_id>",
    resource_group_name="<resource_group_name>",
    workspace_name="<ai_studio_project_name>"
    )
```

### Get the AI Search service connection

This project should have a connection to the AI Search service. We retrieve the details from the project.

```python
ai_search_connection = client.connections.get("<ai_search_connection>")
``` 

### Connect to the embedding models

You can connect to Azure OpenAI using Microsoft Entra ID connections or API key based connections.

```python
from azure.ai.ml.entities import IndexModelConfiguration
## aoai connections - entra id
aoai_connection = client.connections.get("<your_aoai_entra_id_connection>")
embeddings_model_config = IndexModelConfiguration.from_connection(
    aoai_connection, 
    model_name="text-embedding-ada-002",
    deployment_name="text-embedding-ada-002") # verify if your deployment name is same as model name

## OR you can connect using API Key based connections 
from azure.ai.ml.entities import IndexModelConfiguration
## aoai connections - API Key
aoai_connection = client.connections.get("<your_aoai_connection>", populate_secrets=True)
embeddings_model_config = IndexModelConfiguration.from_connection(
    aoai_connection, 
    model_name="text-embedding-ada-002",
    deployment_name="text-embedding-ada-002")
```

You can connect to embedding model deployed in your AI studio project (non Azure OpenAI models) using the serverless connection. 

```python
from azure.ai.ml.entities import IndexModelConfiguration
serverless_connection = client.connections.get("<my_embedding_model_severless_connection_name>")
embeddings_model_config = IndexModelConfiguration.from_connection(cohere_serverless_connection)
```

### Select input data to build the index

You can build the index from the following types of inputs:
- Local files and folders
- GitHub repositories
- Azure Storage

We can use the following code sample to use any of these sources and configure our `input_source`:

```python
# Local source
from azure.ai.ml.entities import LocalSource

input_source=LocalSource(input_data="<path-to-your-local-files>")

# Github repository
from azure.ai.ml.entities import GitSource

input_source=GitSource(
    git_url="https://github.com/rust-lang/book.git", # connecting to the RUST repo as an example
    git_branch_name="main", 
    git_connection_id="")

# Azure Storage
input_source_subscription = "<subscription>"
input_source_resource_group = "<resource_group>"
input_source_workspace = "<workspace>"
input_source_datastore = "<datastore_name>"
input_source_path = "path"

input_source = f"azureml://subscriptions/{input_source_subscription}/resourcegroups/{input_source_resource_group}/workspaces/{input_source_workspace}/datastores/{input_source_datastore}/paths/{input_source_path}"
```
### Build the index on cloud

Now we can build the index using the `ai_search_connection`, `embeddings_model_config` and `input_source`. We use the `build_index` function. If you're using an Azure Storage URL as your input source, you also need to provide a `UserIdentityConfiguration`.

```python
# from azure.ai.ml.entities.credentials import UserIdentityConfiguration # user specified identity used to access the data. Required when using an azure storage URL
from azure.ai.ml.entities import AzureAISearchConfig

client.indexes.build_index(
    name="<index_name>", # name of your index
    embeddings_model_config=embeddings_model_config, 
    input_source=input_source, 
    # input_source_credential=UserIdentityConfiguration(), # user specified identity used to access the data. Required when using an azure storage URL
    index_config=AzureAISearchConfig(
        ai_search_index_name="<index_name>",  # the name of the index store in AI search service
        ai_search_connection_id=ai_search_connection.id, 
    ),
    tokens_per_chunk = 800, # Optional field - Maximum number of tokens per chunk
    token_overlap_across_chunks = 0, # Optional field - Number of tokens to overlap between chunks
)
```

Depending on the size of your input source data, the above steps might take some time to complete. Once the job completes, you can retrieve the index object.

```python
my_index=client.indexes.get(name="<index_name>", label="latest")
```

### Consuming a registered index from your project

To consume a registered index from your project, you need to connect to the project and retrieve the index. The retrieved index can be used as a langhcain retriever to consume it. You can connect to the project with a `client` as shown here.

```python
from promptflow.rag import get_langchain_retriever_from_index

my_index=client.indexes.get(
    name="<registered_index_name>", 
    label="latest")

index_langchain_retriever=get_langchain_retriever_from_index(my_index.path)
index_langchain_retriever.get_relevant_documents("<your search query>")
```

## A question and answer function to use the index

We have seen how to build an index locally or in the cloud. Using this index, we build a QnA function that accepts a user question and provides an answer from the index data. First let us get the index as a langchain_retriever as shown [here](#consuming-a-registered-index-from-your-project). We now use this `retriever` in our function. This function uses the LLM as defined in the `AzureChatOpenAI` constructor. It uses the index as a langchain_retriever to query the data. We build a prompt template that accepts a context and a question. We use langchain's `RetrievalQA.from_chain_type` to put all these together and get us the answers.

```python
def qna(question: str, temperature: float = 0.0, prompt_template: object = None) -> str:
    from langchain import PromptTemplate
    from langchain.chains import RetrievalQA
    from langchain_openai import AzureChatOpenAI

    llm = AzureChatOpenAI(
        openai_api_version="2023-06-01-preview",
        api_key="<your-azure-openai-api-key>",
        azure_endpoint="https://<your-azure-openai-service>.openai.azure.com/",
        azure_deployment="<your-chat-model-deployment>", # verify the model name and deployment name
        temperature=temperature,
    )

    template = """
    System:
    You are an AI assistant helping users answer questions given a specific context.
    Use the following pieces of context to answer the questions as completely, 
    correctly, and concisely as possible.
    Your answer should only come from the context. Don't try to make up an answer.
    Do not add documentation reference in the response.

    {context}

    ---

    Question: {question}

    Answer:"
    """
    prompt_template = PromptTemplate(template=template, input_variables=["context", "question"])

    qa = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=index_langchain_retriever,
        return_source_documents=True,
        chain_type_kwargs={
            "prompt": prompt_template,
        },
    )

    response = qa(question)

    return {
        "question": response["query"],
        "answer": response["result"],
        "context": "\n\n".join([doc.page_content for doc in response["source_documents"]]),
    }
```

Let us ask a question to make sure we get an answer.

```python
result = qna("<your question>")
print(result["answer"])
```

## Related content

- [Create and consume an index from the AI Studio UI](../index-add.md)
- [Get started building a chat app using the prompt flow SDK](../../quickstarts/get-started-code.md)
- [Work with projects in VS Code](vscode.md)