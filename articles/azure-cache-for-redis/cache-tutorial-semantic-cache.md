---
title: 'Tutorial: Use Azure Cache for Redis as a Semantic Cache'
description: In this tutorial, you learn how to use Azure Cache for Redis to store and search for vector embeddings.
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.topic: tutorial
ms.date: 12/21/2023

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

# Tutorial: Use Azure Cache for Redis as a Semantic Cache

In this tutorial, you'll use Azure Cache for Redis as a semantic cache with an AI-based large language model (LLM). You'll use Azure Open AI Service to generate LLM responses to queries and cache those responses using Azure Cache for Redis, delievering faster responses and lowering costs.
Because Azure Cache for Redis offers built-in vector search capability, _semantic caching_ can be achieved. This means that you can both return cached responses for identical queries and also for queries that are similar in meaning, even if the text isn't the same.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Cache for Redis instance configured for semantic caching
> * Use LangChain other popular Python libraries.
> * Use Azure OpenAI service to generate text from AI models and cache results.
> * See the performance gains from using caching with LLMs.

>[!IMPORTANT]
>This tutorial will walk you through building a Jupyter Notebook. You can follow this tutorial with a Python code file (.py) and get *similar* results, but you will need to add all of the code blocks in this tutorial into the `.py` file and execute once to see results. In other words, Jupyter Notebooks provides intermediate results as you execute cells, but this is not behavior you should expect when working in a Python code file.

>[!IMPORTANT]
>If you would like to follow along in a completed Jupyter notebook instead, [download the Jupyter notebook file named *semanticcache.ipynb*](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/tutorial/semantic-cache) and save it into the new *semanticcache* folder.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
* Access granted to Azure OpenAI in the desired Azure subscription
    Currently, you must apply for access to Azure OpenAI. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>.
* <a href="https://www.python.org/" target="_blank">Python 3.11.6 or later version</a>
* [Jupyter Notebooks](https://jupyter.org/) (optional)
* An Azure OpenAI resource with the **text-embedding-ada-002 (Version 2)** and **gpt-35-turbo-instruct** models deployed. These models are currently only available in [certain regions](../ai-services/openai/concepts/models.md#model-summary-table-and-region-availability). See the [resource deployment guide](../ai-services/openai/how-to/create-resource.md) for instructions on how to deploy the models.

## Create an Azure Cache for Redis Instance

1. Follow the [Quickstart: Create a Redis Enterprise cache](quickstart-create-redis-enterprise.md) guide. On the **Advanced** page, make sure that you've added the **RediSearch** module and have chosen the **Enterprise** Cluster Policy. All other settings can match the default described in the quickstart.

   It takes a few minutes for the cache to create. You can move on to the next step in the meantime.

:::image type="content" source="media/cache-create/enterprise-tier-basics.png" alt-text="Screenshot showing the Enterprise tier Basics tab filled out.":::

## Set up your development environment

1. Create a folder on your local computer named *semanticcache* in the location where you typically save your projects.

1. Create a new python file (*tutorial.py*) or Jupyter notebook (*tutorial.ipynb*) in the folder.

1. Install the required Python packages:

   ```python
   pip install openai langchain redis tiktoken
   ```

## Create Azure OpenAI Models
Make sure you have two models deployed to your Azure OpenAI resource:
- A LLM that will provide text responses. We will use the **GPT-3.5-turbo-instruct** model for this.
- An embeddings model that will convert queries into vectors to allow them to be compared to past queries. We will use the **text-embedding-ada-002 (Version 2)** model for this.

See [Deploy a model](../ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model) for more detailed instructions. Record the name you have chosen for each model deployment. 

## Import libraries and set up connection information

To successfully make a call against Azure OpenAI, you need an **endpoint** and a **key**. You also need an **endpoint** and a **key** to connect to Azure Cache for Redis.

1. Go to your Azure Open AI resource in the Azure portal.
   
1. Locate **Endpoint and Keys** in the **Resource Management** section of your Azure OpenAI resource. Copy your endpoint and access key as you'll need both for authenticating your API calls. An example endpoint is: `https://docs-test-001.openai.azure.com`. You can use either `KEY1` or `KEY2`.

1. Go to the **Overview** page of your Azure Cache for Redis resource in the Azure portal. Copy your endpoint.

1. Locate **Access keys** in the **Settings** section. Copy your access key. You can use either `Primary` or `Secondary`.

1. Add the following code to a new code cell:

```python
   # Code cell 2

import openai
import redis
import os
import langchain
from langchain.llms import AzureOpenAI
from langchain.embeddings import AzureOpenAIEmbeddings
from langchain.globals import set_llm_cache
from langchain.cache import RedisSemanticCache
import time


AZURE_ENDPOINT=<your-openai-endpoint>
API_KEY=<your-openai-key>
API_VERSION="2023-05-15"
LLM_DEPLOYMENT_NAME=<your-llm-model-name>
LLM_MODEL_NAME="gpt-35-turbo-instruct"
EMBEDDINGS_DEPLOYMENT_NAME=<your-embeddings-model-name>
EMBEDDINGS_MODEL_NAME="text-embedding-ada-002"

REDIS_ENDPOINT = <your-redis-endpoint>
REDIS_PASSWORD = <your-redis-password>

```

1. Update the value of `API_KEY` and `RESOURCE_ENDPOINT` with the key and endpoint values from your Azure OpenAI deployment.

1. Set `LLM_DEPLOYMENT_NAME` and `EMBEDDINGS_DEPLOYMENT_NAME` to the name of your two models deployed in Azure OpenAI Service.

1. Update `REDIS_ENDPOINT` and `REDIS_PASSWORD` with the endpoint and key value from your Azure Cache for Redis instance.

> [!IMPORTANT]
> We strongly recommend using environmental variables or a secret manager like [Azure Key Vault](../key-vault/general/overview.md) to pass in the API key, endpoint, and deployment name information. These variables are set in plaintext here for the sake of simplicity.

1. Execute code cell 2.

## Intialize AI models

Next, you'll initalize the LLM and embeddings models

1. Add the following code to a new code cell:

```python
   # Code cell 3

llm = AzureOpenAI(
    deployment_name=LLM_DEPLOYMENT_NAME,
    model_name="gpt-35-turbo-instruct",
    openai_api_key=API_KEY,
    azure_endpoint=AZURE_ENDPOINT,
    openai_api_version=API_VERSION,
)
embeddings = AzureOpenAIEmbeddings(
    azure_deployment=EMBEDDINGS_DEPLOYMENT_NAME,
    model="text-embedding-ada-002",
    openai_api_key=API_KEY,
    azure_endpoint=AZURE_ENDPOINT,
    openai_api_version=API_VERSION
)
```

1. Execute code cell 3.

## Set up Redis as a semantic cache

Next, specificy Redis as a semantic cache for your LLM. Add the following code to a new code cell:

```python
   # Code cell 4

redis_url = "rediss://:" + REDIS_PASSWORD + "@"+ REDIS_ENDPOINT
set_llm_cache(RedisSemanticCache(redis_url = redis_url, embedding=embeddings, score_threshold=0.05))
```
> [!IMPORTANT]
> The value of the `score_threshold` parameter determines how similar two queries need to be in order to return a cached result. The lower the number, the more similar the queries need to be.
> You can play around with this value to fine-tune it to your application.

1. Execute code cell 4.

## Query and get responses from the LLM

Finally, query the LLM to get an AI generated response. If you're using a jupyter notebook, you can add `%%time` at the top of the cell to output the amount of time taken to execute the code.

1. Add the following code to a new code cell and execute it:

```python
# Code cell 5
%%time
response = llm("Please write a poem about cute kittens.")
print(response)
```
You should see an output and output similar to this:
```output
Fluffy balls of fur,
With eyes so bright and pure,
Kittens are a true delight,
Bringing joy into our sight.

With tiny paws and playful hearts,
They chase and pounce, a work of art,
Their innocence and curiosity,
Fills our hearts with such serenity.

Their soft meows and gentle purrs,
Are like music to our ears,
They curl up in our laps,
And take the stress away in a snap.

Their whiskers twitch, they're always ready,
To explore and be adventurous and steady,
With their tails held high,
They're a sight to make us sigh.

Their tiny faces, oh so sweet,
With button noses and paw-sized feet,
They're the epitome of cuteness,
...
Cute kittens, a true blessing,
In our hearts, they'll always be reigning.
CPU times: total: 0 ns
Wall time: 2.67 s
```

Note that the `Wall time` shows a value of 2.67 seconds. That's how much real-world time it took to query the LLM and for the LLM to generate a response. 

1. Execute cell 5 again. You should see the exact same output, but with a significantly smaller wall time:

```output
Fluffy balls of fur,
With eyes so bright and pure,
Kittens are a true delight,
Bringing joy into our sight.

With tiny paws and playful hearts,
They chase and pounce, a work of art,
Their innocence and curiosity,
Fills our hearts with such serenity.

Their soft meows and gentle purrs,
Are like music to our ears,
They curl up in our laps,
And take the stress away in a snap.

Their whiskers twitch, they're always ready,
To explore and be adventurous and steady,
With their tails held high,
They're a sight to make us sigh.

Their tiny faces, oh so sweet,
With button noses and paw-sized feet,
They're the epitome of cuteness,
...
Cute kittens, a true blessing,
In our hearts, they'll always be reigning.
CPU times: total: 0 ns
Wall time: 575 ms
```

The wall time has dropped by a factor of five--all the way down to 575 milliseconds. 

1. Change the query from `Please write a poem about cute kittens` to `Write a poem about cute kittens` and run cell 5 again. You should see the exact same output and a lower wall time than the original query. Even though the query has changed, the _semantic meaning_ of the query remained the same so the same cached output was returned.


## Related Content

* [Learn more about Azure Cache for Redis](cache-overview.md)
* Learn more about Azure Cache for Redis [vector search capabilities](./cache-overview-vector-similarity.md)
* Learn more about [embeddings generated by Azure OpenAI Service](../ai-services/openai/concepts/understand-embeddings.md)
* Learn more about [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity)
* [Read how to build an AI-powered app with OpenAI and Redis](https://techcommunity.microsoft.com/t5/azure-developer-community-blog/vector-similarity-search-with-azure-cache-for-redis-enterprise/ba-p/3822059)
* [Build a Q&A app with semantic answers](https://github.com/ruoccofabrizio/azure-open-ai-embeddings-qna)
