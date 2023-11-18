---
title: 'How to generate embeddings with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Learn how to generate embeddings with Azure OpenAI
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 11/06/2023
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
keywords: 

---
# Learn how to generate embeddings with Azure OpenAI

An embedding is a special format of data representation that can be easily utilized by machine learning models and algorithms. The embedding is an information dense representation of the semantic meaning of a piece of text. Each embedding is a vector of floating point numbers, such that the distance between two embeddings in the vector space is correlated with semantic similarity between two inputs in the original format. For example, if two texts are similar, then their vector representations should also be similar. Embeddings power vector similarity search in Azure Databases such as [Azure Cosmos DB for MongoDB vCore](../../../cosmos-db/mongodb/vcore/vector-search.md). 


## How to get embeddings

To obtain an embedding vector for a piece of text, we make a request to the embeddings endpoint as shown in the following code snippets:

# [console](#tab/console)
```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/embeddings?api-version=2023-05-15\
  -H 'Content-Type: application/json' \
  -H 'api-key: YOUR_API_KEY' \
  -d '{"input": "Sample Document goes here"}'
```

# [OpenAI Python 0.28.1](#tab/python)

```python
import openai

openai.api_type = "azure"
openai.api_key = YOUR_API_KEY
openai.api_base = "https://YOUR_RESOURCE_NAME.openai.azure.com"
openai.api_version = "2023-05-15"

response = openai.Embedding.create(
    input="Your text string goes here",
    engine="YOUR_DEPLOYMENT_NAME"
)
embeddings = response['data'][0]['embedding']
print(embeddings)
```

# [OpenAI Python 1.x](#tab/python-new)

```python
import os
from openai import AzureOpenAI

client = AzureOpenAI(
  api_key = os.getenv("AZURE_OPENAI_KEY"),  
  api_version = "2023-05-15",
  azure_endpoint =os.getenv("AZURE_OPENAI_ENDPOINT") 
)

response = client.embeddings.create(
    input = "Your text string goes here",
    model= "text-embedding-ada-002"
)

print(response.model_dump_json(indent=2))
```

# [C#](#tab/csharp)
```csharp
using Azure;
using Azure.AI.OpenAI;

Uri oaiEndpoint = new ("https://YOUR_RESOURCE_NAME.openai.azure.com");
string oaiKey = "YOUR_API_KEY";

AzureKeyCredential credentials = new (oaiKey);

OpenAIClient openAIClient = new (oaiEndpoint, credentials);

EmbeddingsOptions embeddingOptions = new ("Your text string goes here");

var returnValue = openAIClient.GetEmbeddings("YOUR_DEPLOYMENT_NAME", embeddingOptions);

foreach (float item in returnValue.Value.Data[0].Embedding)
{
    Console.WriteLine(item);
}
```

---

## Best practices

### Verify inputs don't exceed the maximum length

The maximum length of input text for our latest embedding models is 8192 tokens. You should verify that your inputs don't exceed this limit before making a request.

## Limitations & risks

Our embedding models may be unreliable or pose social risks in certain cases, and may cause harm in the absence of mitigations. Review our Responsible AI content for more information on how to approach their use responsibly.

## Next steps

* Learn more about using Azure OpenAI and embeddings to perform document search with our [embeddings tutorial](../tutorials/embeddings.md).
* Learn more about the [underlying models that power Azure OpenAI](../concepts/models.md).
* Store your embeddings and perform vector (similarity) search using your choice of Azure service:
  * [Azure Cognitive Search](../../../search/vector-search-overview.md)
  * [Azure Cosmos DB for MongoDB vCore](../../../cosmos-db/mongodb/vcore/vector-search.md)
  * [Azure Cosmos DB for NoSQL](../../../cosmos-db/vector-search.md)
  * [Azure Cosmos DB for PostgreSQL](../../../cosmos-db/postgresql/howto-use-pgvector.md)
  * [Azure Cache for Redis](../../../azure-cache-for-redis/cache-tutorial-vector-similarity.md)

