---
title: Open-source vector databases
titleSuffix: 
description: Open-source vector database functionalities, examples, challenges, and solutions.
author: gahl-levy
ms.author: gahllevy
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 04/02/2024
---

# Open-source vector databases

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

When developers select vector databases, the open-source options provide numerous benefits. "Open source" means that the software's source code is available freely, enabling users to customize the database according to their specific needs. This flexibility is beneficial for organizations that are subject to unique regulatory requirements on data, such as companies in the financial services industry.

Another advantage of open-source vector databases is the strong community support they enjoy. Active user communities often contribute to the development of these databases, provide support, and share best practices, promoting innovation.

Some individuals opt for open-source vector databases because they are "free," meaning there's no cost to acquire or use the software. An alternative is using the free tiers offered by managed vector database services. These managed services provide not only cost-free access up to a certain usage limit but also simplify the operational burden by handling maintenance, updates, and scalability. Therefore, by using the free tier of managed vector database services, users can achieve cost savings while reducing management overhead. This approach allows users to focus more on their core activities rather than on database administration.

## Working mechanism of vector databases

Vector databases are designed to store and manage vector embeddings, which are mathematical representations of data in a high-dimensional space. In this space, each dimension corresponds to a feature of the data, and tens of thousands of dimensions might be used to represent sophisticated data. A vector's position in this space represents its characteristics. Words, phrases, or entire documents, and images, audio, and other types of data can all be vectorized. These vector embeddings are used in similarity search, multi-modal search, recommendations engines, large languages models (LLMs), etc.

These databases' architecture typically includes a storage engine and an indexing mechanism. The storage engine optimizes the storage of vector data for efficient retrieval and manipulation, while the indexing mechanism organizes the data for fast searching and retrieval operations.

In a vector database, embeddings are indexed and queried through vector search algorithms based on their vector distance or similarity. A robust mechanism is necessary to identify the most relevant data. Some well-known vector search algorithms include Hierarchical Navigable Small World (HNSW), Inverted File (IVF), etc.

Vector databases are used in numerous domains and situations across analytical and generative AI, including natural language processing, video and image recognition, recommendation system, search, etc. For example, you can use a vector database to:

- Identify similar images, documents, and songs based on their contents, themes, sentiments, and styles
- Identify similar products based on their characteristics, features, and user groups
- Recommend contents, products, or services based on individuals' preferences
- Recommend contents, products, or services based on user groups' similarities
- Identify the best-fit potential options from a large pool of choices to meet complex requirements
- Identify data anomalies or fraudulent activities that are dissimilar from predominant or normal patterns
- Implement persistent memory for AI agents
- Enable retrieval-augmented generation (RAG)

### Integrated vector database vs pure vector database

There are two common types of vector database implementations - pure vector database and integrated vector database in a NoSQL or relational database.

A pure vector database is designed to efficiently store and manage vector embeddings, along with a small amount of metadata; it is separate from the data source from which the embeddings are derived.

A vector database that is integrated in a highly performant NoSQL or relational database provides additional capabilities. The integrated vector database in a NoSQL or relational database can store, index, and query embeddings alongside the corresponding original data. This approach eliminates the extra cost of replicating data in a separate pure vector database. Moreover, keeping the vector embeddings and original data together better facilitates multi-modal data operations, and enables greater data consistency, scale, and performance.

## Selecting the best open-source vector database

Choosing the best open-source vector database requires considering several factors. Performance and scalability of the database are crucial, as they impact whether the database can handle your specific workload requirements. Databases with efficient indexing and querying capabilities usually offer optimal performance. Another factor is the community support and documentation available for the database. A robust community and ample documentation can provide valuable assistance. Here are some popular open-source vector databases:

- Chroma
- Milvus
- Qdrant
- Weaviate

However, the most popular option may not be the best option for you. Thus, you should compare different options based on features, supported data types, compatibility with existing tools and frameworks you use. You should also keep in mind the challenges of open-source vector databases (below).

## Challenges of open-source vector databases

Most open-source vector databases, including the ones listed above, are pure vector databases. In other words, they are designed to store and manage vector embeddings only, along with a small amount of metadata. Since they are independent of the data source from which the embeddings are derived, using them requires sending your data between service integrations, which adds extra cost, complexity, and bottlenecks for your production workloads.

They also pose the challenges that are typical of open-source databases:

- Setup: Users need in-depth knowledge to install, configure, and operate, especially for complex deployments. Optimizing resources and configuration while scaling up operation requires close monitoring and adjustments.
- Maintenance: Users must manage their own updates, patches, and maintenance. Thus, ML expertise wouldn't suffice; users must also have extensive experience in database administration.
- Support: Official support can be limited compared to managed services, relying more on community assistance.

Therefore, while free initially, open-source vector databases incur significant costs when scaling up. Expanding operations necessitates more hardware, skilled IT staff, and advanced infrastructure management, leading to higher expenses in hardware, personnel, and operational costs. Scaling open-source vector databases can be financially demanding despite the lack of licensing fees.

## Addressing the challenges of open-source vector databases

A fully managed vector database that is integrated in a highly performant NoSQL or relational database avoids the extra cost and complexity of open-source vector databases. Such a database stores, indexes, and queries embeddings alongside the corresponding original data. This approach eliminates the extra cost of replicating data in a separate pure vector database. Moreover, keeping the vector embeddings and original data together better facilitates multi-modal data operations, and enables greater data consistency, scale, and performance. Meanwhile, the fully managed service helps developers avoid the hassles from setting up, maintaining, and relying on community assistance for an open-source vector database. Moreover, some managed vector database services offer a life-time free tier.

An example is the Integrated Vector Database in Azure Cosmos DB for MongoDB. It allows developers to enjoy the same financial benefit associated with open-source vector databases, while the service provider handles maintenance, updates, and scalability. When it’s time to scale up operations, upgrading is quick and easy while keeping a low [total cost of ownership (TCO)](introduction.md#low-total-cost-of-ownership-tco). This service can also be used to conveniently [scale MongoDB](../reimagined.md) applications that are already in production.

## Next steps
> [!div class="nextstepaction"]
> [Use lifetime free tier of Integrated Vector Database in Azure Cosmos DB for MongoDB](free-tier.md)
