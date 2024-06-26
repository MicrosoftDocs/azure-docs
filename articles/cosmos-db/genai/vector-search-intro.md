# What is Vector Search?

Vector search is transforming the way we retrieve information, especially in the realm of AI and machine learning. This article delves into the core concepts of vector search, exploring vectors and embeddings, different models, distance functions, kNN vs ANN, DiskANN, RAG/GenAI concepts, and multi-agent interactions. Let's dive in!

### Vectors/Embeddings

Vectors, also known as embeddings, are numerical representations of data. They convert various types of information — text, images, audio — into a format that machine learning models can process. These high-dimensional representations capture semantic meaning, making it easier to perform tasks like searching, clustering, and classifying.

### Models

Machine learning models leverage vectors to perform various tasks. Models such as BERT, GPT, and word2vec generate embeddings that serve as inputs for subsequent processes. These models learn from vast datasets, creating vectors that encapsulate complex relationships within the data.

### Distance Functions

Distance functions are mathematical formulas used to measure the similarity or dissimilarity between vectors. Common examples include Euclidean distance, cosine similarity, and Manhattan distance. These measurements are crucial for determining how closely related two pieces of data are.

### kNN vs ANN

In vector search, two popular algorithms are k-Nearest Neighbors (kNN) and Approximate Nearest Neighbors (ANN). kNN is precise but computationally intensive, making it less suitable for large datasets. ANN, on the other hand, offers a balance between accuracy and efficiency, making it better suited for large-scale applications.

### DiskANN

DiskANN (Disk-based Approximate Nearest Neighbor) is a cutting-edge Microsoft Research born algorithm that stores vector data on disk, significantly reducing memory usage. This approach allows for efficient querying of large datasets without sacrificing performance, making it ideal for real-world applications.

### RAG / GenAI Concepts

Reinforcement Learning from Human Feedback (RAG) and Generative AI (GenAI) leverage vector search to enhance their capabilities. RAG uses embeddings to refine model outputs based on user interactions, while GenAI generates new content by understanding semantic relationships within the data.

### Multi-Agent Interactions

In multi-agent systems, vector search facilitates seamless interactions between different AI agents. By understanding and processing vectors, agents can communicate more effectively, collaborate on tasks, and make more informed decisions.

### Azure Cosmos DB: The World's First Serverless Vector Search Database

Azure Cosmos DB stands out as the world's first serverless vector search database, offering unparalleled scalability and performance.

> "OpenAI relies on Cosmos DB to dynamically scale their ChatGPT service – one of the fastest-growing consumer apps ever – enabling high reliability and low maintenance."

By leveraging Azure Cosmos DB, users can enhance their vector search capabilities, ensuring high reliability and low maintenance for their applications. Vector search is a powerful tool that is reshaping the landscape of data retrieval and artificial intelligence. From embeddings to models, distance functions to multi-agent interactions, understanding these concepts is key to unlocking the full potential of vector search. With Azure Cosmos DB, users can take their vector search applications to new heights, achieving exceptional scalability and performance.

### Next steps

[30-day Free Trial without Azure subscription](https://azure.microsoft.com/try/cosmosdb/)

[90-day Free Trial and up to $6,000 in throughput credits with Azure AI Advantage](ai-advantage.md)

> [!div class="nextstepaction"]
> [Use the Azure Cosmos DB lifetime free tier](free-tier.md)

### More vector database solutions
- [Azure PostgreSQL Server pgvector Extension](../postgresql/flexible-server/how-to-use-pgvector.md)

:::image type="content" source="media/vector-search/azure-databases-and-ai-search.png" lightbox="media/vector-search/azure-databases-and-ai-search.png" alt-text="Diagram of Vector indexing services.":::