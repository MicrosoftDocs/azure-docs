---
title: Quickstart RAG
titleSuffix: Azure AI Search
description: In this quickstart, learn how to use grounding data from Azure AI Search with a chat model on Azure OpenAI.
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 08/16/2024
---

# Quickstart: Generative search (RAG) with grounding data from Azure AI Search

This quickstart shows you how to send queries to a Large Language Model (LLM) for a conversational search experience over your indexed content on Azure AI Search. You use the Azure portal to set up the resources, and then run Python code to call the APIs. 

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/).

- [Azure AI Search](search-create-service-portal.md), Basic tier or higher so that you can [enable semantic ranking](semantic-how-to-enable-disable.md). Region must be the same one used for Azure OpenAI.

- [Azure OpenAI](https://aka.ms/oai/access) resource with a deployment of `gpt-35-turbo`, `gpt-4`, or equivalent model, in the same region as Azure AI Search.

- [Visual Studio Code](https://code.visualstudio.com/download) with the [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) and the [Jupyter package](https://pypi.org/project/jupyter/). For more information, see [Python in Visual Studio Code](https://code.visualstudio.com/docs/languages/python).

## Download file

[Download a Jupyter notebook](https://github.com/Azure-Samples/azure-search-python-samples/tree/main/Quickstart-RAG) from GitHub to send the requests in this quickstart. For more information, see [Downloading files from GitHub](https://docs.github.com/get-started/start-your-journey/downloading-files-from-github).

You can also start a new file on your local system and create requests manually by using the instructions in this article. 

## Configure access

Requests to the search endpoint must be authenticated and authorized. You can use API keys or roles for this task. Keys are easier to start with, but roles are more secure. This quickstart assumes roles.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Configure Azure AI Search to use a system-assigned managed identity:

    1. In the Azure portal, [find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices).
 
    1. On the left menu, select **Settings** > **Identity**.

    1. On the System assigned tab, set status to **On**.

1. Configure Azure AI Search for role-based access:

    1. In the Azure portal, find your Azure AI Search service.

    1. On the left menu, select **Settings** > **Keys**, and then select either **Role-based access control** or **Both**.

1. Assign roles:

    1. On the left menu, select **Access control (IAM)**.

    1. On Azure AI Search, make sure you have permissions to create, load, and query a search index:

       - **Search Index Data Reader**
       - **Search Index Data Contributor**
       - **Search Service Contributor**

    1. On Azure OpenAI, select **Access control (IAM)** to assign yourself and the search service identity permissions on Azure OpenAI. The code for this quickstart runs locally. Requests to Azure OpenAI originate from your system. Also, search results from the search engine are passed to Azure OpenAI. For these reasons, both you and the search service need permissions on Azure OpenAI.

       - **Cognitive Services OpenAI User**

It can take several minutes for permissions to take effect.

## Create an index

We recommend the hotels-sample-index, which can be created in minutes and runs on any search service tier. This index is created using built-in sample data.

1. In the Azure portal, find your search service.

1. On the **Overview** home page, select [**Import data**](search-get-started-portal.md) to start the wizard.

1. On the **Connect to your data** page, select **Samples** from the dropdown list.

1. Choose the **hotels-sample**.

1. Select **Next** through the remaining pages, accepting the default values.

1. Once the index is created, select **Search management** > **Indexes** from the left menu to open the index.

1. Select **Edit JSON**. 

1. Search for "semantic" to find the section in the index for a semantic configuration. Replace the "semantic" line with the following semantic configuration. This example specifies a `"defaultConfiguration"`, which is important to the running of this quickstart.

    ```json
    "semantic": {
    "defaultConfiguration": "semantic-config",
    "configurations": [
        {
        "name": "semantic-config",
        "prioritizedFields": {
            "titleField": {
            "fieldName": "HotelName"
            },
            "prioritizedContentFields": [
            {
                "fieldName": "Description"
            }
            ],
            "prioritizedKeywordsFields": [
            {
                "fieldName": "Category"
            },
            {
                "fieldName": "Tags"
            }
            ]
        }
      }
    ]
    },
    ```

1. **Save** your changes.

1. Run the following query to test your index: `hotels near the ocean with beach access and good views`.

   Output should look similar to the following example. Results that are returned directly from the search engine consist of fields and their verbatim values, along with metadata like a search score and a semantic ranking score and caption if you use semantic ranking.

   ```
      "@search.score": 5.600783,
      "@search.rerankerScore": 2.4191176891326904,
      "@search.captions": [
        {
          "text": "Contoso Ocean Motel. Budget. pool\r\nair conditioning\r\nbar. Oceanfront hotel overlooking the beach features rooms with a private balcony and 2 indoor and outdoor pools. Various shops and art entertainment are on the boardwalk, just steps away..",
          "highlights": "Contoso Ocean Motel. Budget.<em> pool\r\nair conditioning\r\nbar. O</em>ceanfront hotel overlooking the beach features rooms with a private balcony and 2 indoor and outdoor pools. Various shops and art entertainment are on the boardwalk, just steps away."
        }
      ],
      "HotelId": "41",
      "HotelName": "Contoso Ocean Motel",
      "Description": "Oceanfront hotel overlooking the beach features rooms with a private balcony and 2 indoor and outdoor pools. Various shops and art entertainment are on the boardwalk, just steps away.",
      "Category": "Budget",
      "Tags": [
        "pool",
        "air conditioning",
        "bar"
      ],
   ```

## Get service endpoints

In the remaining sections, you set up API calls to Azure OpenAI and Azure AI Search. Get the service endpoints so that you can provide them as variables in your code.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. [Find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices).

1. On the **Overview** home page, copy the URL. An example endpoint might look like `https://example.search.windows.net`. 

1. [Find your Azure OpenAI service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.CognitiveServices%2Faccounts).

1. On the **Overview** home page, select the link to view the endpoints. Copy the URL. An example endpoint might look like `https://example.openai.azure.com/`.

## Set up the query and chat thread

This section uses Visual Studio Code and Python to call the chat completion APIs on Azure OpenAI.

1. Start Visual Studio Code and [open the .ipynb file](https://github.com/Azure-Samples/azure-search-python-samples/tree/main/Quickstart-RAG) or create a new Python file.

1. Install the following Python packages.

   ```python
   ! pip install azure-search-documents==11.6.0b4 --quiet
   ! pip install azure-identity==1.16.0 --quiet
   ! pip install openai --quiet
   ! pip intall aiohttp --quiet
   ```

1. Set the following variables, substituting placeholders with the endpoints you collected in the previous step. 

   ```python
    AZURE_SEARCH_SERVICE: str = "PUT YOUR SEARCH SERVICE ENDPOINT HERE"
    AZURE_OPENAI_ACCOUNT: str = "PUT YOUR AZURE OPENAI ENDPOINT HERE"
    AZURE_DEPLOYMENT_MODEL: str = "gpt-35-turbo"
   ```

1. Run the following code to set query parameters. The query is a keyword search using semantic ranking. In a keyword search, the search engine returns up to 50 matches, but only the top 5 are provided to the model. If you can't [enable semantic ranking](semantic-how-to-enable-disable.md) on your search service, set the value to false.

   ```python
   # Set query parameters for grounding the conversation on your search index
    search_type="text"
    use_semantic_reranker=True
    sources_to_include=5
    ```

1. Set up clients, a search functions prompts, and a chat. The function retrieves selected fields from the search index. 

    ```python
    # Set up the query for generating responses
    from azure.core.credentials_async import AsyncTokenCredential
    from azure.identity.aio import get_bearer_token_provider
    from azure.search.documents.aio import SearchClient
    from openai import AsyncAzureOpenAI
    from enum import Enum
    from typing import List, Optional
    
    def create_openai_client(credential: AsyncTokenCredential) -> AsyncAzureOpenAI:
        token_provider = get_bearer_token_provider(credential, "https://cognitiveservices.azure.com/.default")
        return AsyncAzureOpenAI(
            api_version="2024-04-01-preview",
            azure_endpoint=AZURE_OPENAI_ACCOUNT,
            azure_ad_token_provider=token_provider
        )
    
    def create_search_client(credential: AsyncTokenCredential) -> SearchClient:
        return SearchClient(
            endpoint=AZURE_SEARCH_SERVICE,
            index_name="hotels-sample-index",
            credential=credential
        )
    
    # This quickstart is only using text at the moment
    class SearchType(Enum):
        TEXT = "text"
        VECTOR = "vector"
        HYBRID = "hybrid"
    
    # This function retrieves the selected fields from the search index
    async def get_sources(search_client: SearchClient, query: str, search_type: SearchType, use_semantic_reranker: bool = True, sources_to_include: int = 5) -> List[str]:
        search_type == SearchType.TEXT,
        response = await search_client.search(
            search_text=query,
            query_type="semantic" if use_semantic_reranker else "simple",
            top=sources_to_include,
            select="Description,HotelName,Tags"
        )
    
        return [ document async for document in response ]
    
    # This prompt provides instructions to the model
    GROUNDED_PROMPT="""
    You are a friendly assistant that recommends hotels based on activities and amenities.
    Answer the query using only the sources provided below in a friendly and concise bulleted manner.
    Answer ONLY with the facts listed in the list of sources below.
    If there isn't enough information below, say you don't know.
    Do not generate answers that don't use the sources below.
    Query: {query}
    Sources:\n{sources}
    """

    # This class instantiates the chat
    class ChatThread:
        def __init__(self):
            self.messages = []
            self.search_results = []
        
        def append_message(self, role: str, message: str):
            self.messages.append({
                "role": role,
                "content": message
            })
    
        async def append_grounded_message(self, search_client: SearchClient, query: str, search_type: SearchType, use_semantic_reranker: bool = True, sources_to_include: int = 5):
            sources = await get_sources(search_client, query, search_type, use_semantic_reranker, sources_to_include)
            sources_formatted = "\n".join([f'{document["HotelName"]}:{document["Description"]}:{document["Tags"]}' for document in sources])
            self.append_message(role="user", message=GROUNDED_PROMPT.format(query=query, sources=sources_formatted))
            self.search_results.append(
                {
                    "message_index": len(self.messages) - 1,
                    "query": query,
                    "sources": sources
                }
            )
    
        async def get_openai_response(self, openai_client: AsyncAzureOpenAI, model: str):
            response = await openai_client.chat.completions.create(
                messages=self.messages,
                model=model
            )
            self.append_message(role="assistant", message=response.choices[0].message.content)
    
        def get_last_message(self) -> Optional[object]:
            return self.messages[-1] if len(self.messages) > 0 else None
    
        def get_last_message_sources(self) -> Optional[List[object]]:
            return self.search_results[-1]["sources"] if len(self.search_results) > 0 else None
    ```

1. Invoke the chat and call the search function, passing in a query string to search for.

    ```python
    import azure.identity.aio
    
    chat_thread = ChatThread()
    chat_deployment = AZURE_DEPLOYMENT_MODEL
    
    async with azure.identity.aio.DefaultAzureCredential() as credential, create_search_client(credential) as search_client, create_openai_client(credential) as openai_client:
        await chat_thread.append_grounded_message(
            search_client=search_client,
            query="Can you recommend a few hotels near the ocean with beach access and good views",
            search_type=SearchType(search_type),
            use_semantic_reranker=use_semantic_reranker,
            sources_to_include=sources_to_include)
        await chat_thread.get_openai_response(openai_client=openai_client, model=chat_deployment)
    
    print(chat_thread.get_last_message()["content"])
    ```

    Output is from Azure OpenAI, and it consists of recommendations for several hotels. Here's an example of what the output might look like:

    ```
    Based on your criteria, we recommend the following hotels:
    
    - Contoso Ocean Motel: located right on the beach and has private balconies with ocean views. They also have indoor and outdoor pools. It's located on the boardwalk near shops and art entertainment.
    - Northwind Plaza & Suites: offers ocean views, free Wi-Fi, full kitchen, and a free breakfast buffet. Although not directly on the beach, this hotel has great views and is near the aquarium. They also have a pool.
    
    Several other hotels have views and water features, but do not offer beach access or views of the ocean.
    ```

    If you get an authorization error message, wait a few minutes and try again. It can take several minutes for role assignments to become operational.

    To experiment further, change the query and rerun the last step to better understand how the model works with your data.

    You can also modify the prompt to change the tone or structure of the output.

## Clean up

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal by using the **All resources** or **Resource groups** link in the leftmost pane.

## Next steps

As a next step, we recommend that you review the demo code for [Python](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-python), [C#](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-dotnet), or [JavaScript](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-javascript).
