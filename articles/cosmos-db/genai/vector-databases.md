## How to implement integrated vector database functionalities

You can implement integrated vector database functionalities for the following [Azure Cosmos DB APIs](choose-api.md):

### NoSQL API

Azure Cosmos DB for NoSQL is the world's first serverless NoSQL vector database.  Store your vectors and data together in [Azure Cosmos DB for NoSQL with integrated vector database capabilities](nosql/vector-search.md) where you can create a vector index based on [DiskANN](https://www.microsoft.com/research/publication/diskann-fast-accurate-billion-point-nearest-neighbor-search-on-a-single-node/), a suite of high performance vector indexing algorithms developed by Microsoft Research. 

DiskANN enables you to perform highly accurate, low latency queriers at any scale while leveraging all the benefits of Azure Cosmos DB for NoSQL such as 99.999% SLA (with HA-enabled), geo-replication, seamless transition from serverless to provisioned throughput (RU) all in one data store.

#### Links and samples

- [What is the database behind ChatGPT? - Microsoft Mechanics](https://www.youtube.com/watch?v=6IIUtEFKJec)
- [Vector indexing in Azure Cosmos DB for NoSQL](index-policy.md#vector-indexes)
- [VectorDistance system function NoSQL queries](nosql/query/vectordistance.md)
- [How to setup vector database capabilities in Azure Cosmos DB NoSQL](nosql/vector-search.md)
- [Python notebook tutorial](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples)
- [C# Solution accelerator for building AI apps](https://aka.ms/BuildModernAiAppsSolution)
- [C# Azure Cosmos DB Chatbot with Azure OpenAI](https://aka.ms/cosmos-chatgpt-sample)

### API for MongoDB

Use the natively [integrated vector database in Azure Cosmos DB for MongoDB](mongodb/vcore/vector-search.md) (vCore architecture), which offers an efficient way to store, index, and search high-dimensional vector data directly alongside other application data. This approach removes the necessity of migrating your data to costlier alternative vector databases and provides a seamless integration of your AI-driven applications.

#### Code samples

- [.NET RAG Pattern retail reference solution](https://github.com/Azure/Vector-Search-AI-Assistant-MongoDBvCore)
- [.NET tutorial - recipe chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/C%23/CosmosDB-MongoDBvCore)
- [C# RAG pattern - Integrate OpenAI Services with Cosmos](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/C%23/CosmosDB-MongoDBvCore)
- [Python RAG pattern - Azure product chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-MongoDB-vCore)
- [Python notebook tutorial - Vector database integration through LangChain](https://python.langchain.com/docs/integrations/vectorstores/azure_cosmos_db)
- [Python notebook tutorial - LLM Caching integration through LangChain](https://python.langchain.com/docs/integrations/llms/llm_caching#azure-cosmos-db-semantic-cache)
- [Python - LlamaIndex integration](https://docs.llamaindex.ai/en/stable/examples/vector_stores/AzureCosmosDBMongoDBvCoreDemo.html)
- [Python - Semantic Kernel memory integration](https://github.com/microsoft/semantic-kernel/tree/main/python/semantic_kernel/connectors/memory/azure_cosmosdb)

> [!div class="nextstepaction"]
> [Use Azure Cosmos DB for MongoDB lifetime free tier](mongodb/vcore/free-tier.md)
  
### API for PostgreSQL

Use the natively integrated vector database in [Azure Cosmos DB for PostgreSQL](postgresql/howto-use-pgvector.md), which offers an efficient way to store, index, and search high-dimensional vector data directly alongside other application data. This approach removes the necessity of migrating your data to costlier alternative vector databases and provides a seamless integration of your AI-driven applications.

#### Code sample
- Python: [Python notebook tutorial - food review chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-PostgreSQL_CognitiveSearch)

### Next steps 

[30-day Free Trial without Azure subscription](https://azure.microsoft.com/try/cosmosdb/)

[90-day Free Trial and up to $6,000 in throughput credits with Azure AI Advantage](ai-advantage.md)

> [!div class="nextstepaction"]
> [Use the Azure Cosmos DB lifetime free tier](free-tier.md)

## More vector database solutions
- [Azure PostgreSQL Server pgvector Extension](../postgresql/flexible-server/how-to-use-pgvector.md)

:::image type="content" source="media/vector-search/azure-databases-and-ai-search.png" lightbox="media/vector-search/azure-databases-and-ai-search.png" alt-text="Diagram of Vector indexing services.":::