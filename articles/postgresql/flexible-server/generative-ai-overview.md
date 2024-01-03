---
title: Generative AI with Azure Database for PostgreSQL Flexible Server
description: Generative AI with Azure Database for PostgreSQL Flexible Server
author: mulander
ms.author: adamwolk
ms.date: 11/07/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - ignite-2023
ms.topic: conceptual
---

# Generative AI with Azure Database for PostgreSQL Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Generative AI (GenAI) refers a class of Artificial Intelligence algorithms that can learn from existing multimedia content and produce new content. The produced content can be customized using techniques such as prompts and fine-tuning. GenAI algorithms apply specific Machine Learning models:

* Transformers and Recurrent Neural Nets (RNNs) for text generation
* Generative Adversarial Networks (GANs) for image generation
* Variational Autoencoders (VAEs) for image generation etc.

GenAI is used in image and music synthesis, healthcare, common tasks such as text autocompletion, text summarization and translation. GenAI techniques enable features on data such as clustering and segmentation, semantic search and recommendations, topic modeling, question answering and anomaly detection. 

## OpenAI

OpenAI is an artificial intelligence (AI) research organization and technology company known for its pioneering work in the field of artificial intelligence and machine learning. Their mission is to ensure that artificial general intelligence (AGI), which refers to highly autonomous AI systems that can outperform humans in most economically valuable work, benefits all of humanity. OpenAI brought to market state-of-the-art generative models such as GPT-3, GPT-3.5 and GPT-4 (Generative Pretrained Transformer).

Azure OpenAI is Azure’s LLM service offering to help build GenAI applications using Azure. Azure OpenAI Service gives customers advanced language AI with OpenAI GPT-4, GPT-3, Codex, DALL-E, and Whisper models with the security and enterprise promise of Azure. Azure OpenAI codevelops the APIs with OpenAI, ensuring compatibility and a smooth transition from one to the other. 

With Azure OpenAI, customers get the security capabilities of Microsoft Azure while running the same models as OpenAI. Azure OpenAI offers private networking, regional availability, and responsible AI content filtering.

Learn more about [Azure OpenAI](../../ai-services/openai/overview.md).

## Large Language Model (LLM)

A Large Language Model (LLM) is a type of AI model trained on massive amounts of text data to understand and generate human-like language. LLMs are typically based on deep learning architectures, such as Transformers, and they're known for their ability to perform a wide range of natural language understanding and generation tasks. OpenAI’s GPT, which powers ChatGPT, is an LLM. 

Key characteristics and capabilities of Large Language Models include: 
- Scale: immense scale in terms of the number of parameters used in LLM architecture are characteristic for them. Models like GPT-3 (Generative Pretrained Transformer 3) contain hundreds of millions to trillions of parameters, which allow them to capture complex patterns in language. 
- Pretraining: LLMs undergo pretraining on a large corpus of text data from the internet, which enables them to learn grammar, syntax, semantics, and a broad range of knowledge about language and the world. 
- Fine-tuning: After pretraining, LLMs can be fine-tuned on specific tasks or domains with smaller, task-specific datasets. This fine-tuning process allows them to adapt to more specialized tasks, such as text classification, translation, summarization, and question-answering. 

## GPT

GPT stands for Generative Pretrained Transformer, and it refers to a series of large language models developed by OpenAI. The GPT models are neural networks pretrained on vast amounts of data from the internet, making them capable of understanding and generating human-like text. 

Here's an overview of the major GPT models and their key characteristics: 

GPT-3: GPT-3, released in June 2020, is a well-known model in the GPT series. It has 175 billion parameters, making it one of the largest and most powerful language models in existence. GPT-3 achieved remarkable performance on a wide range of natural language understanding and generation tasks. It can perform tasks like text completion, translation, question-answering, and more with human-level fluency. 
GPT-3 is divided into various model sizes, ranging from the smallest (125M parameters) to the largest (175B parameters). 

GPT-4: GPT-4, the latest GPT model from OpenAI, has 1.76 trillion parameters. 


## Vectors

A vector is a mathematical concept used in linear algebra and geometry to represent quantities that have both magnitude and direction. In the context of machine learning, vectors are often used to represent data points or features. Some key vector attributes and operations: 

- Magnitude: The length or size of a vector, often denoted as its norm, represents the magnitude of the data it represents. It's a non-negative real number. 
- Direction: The direction of a vector indicates the orientation or angle of the quantity it represents in relation to a reference point or coordinate system. 
- Components: A vector can be decomposed into its components along different axes or dimensions. In a 2D Cartesian coordinate system, a vector can be represented as (x, y), where x and y are its components along the x-axis and y-axis, respectively. A vector in n dimensions is an n-tuple {x1, x2… xn}. 
- Addition and Scalar Multiplication: Vectors can be added together to form new vectors, and they can be multiplied by scalars (real numbers). 
- Dot Product and Cross Product: Vectors can be combined using dot products (scalar product) and cross products (vector product). 

## Vector databases

A vector database, also known as a vector database management system (DBMS), is a type of database system designed to store, manage, and query vector data efficiently. Traditional relational databases primarily handle structured data in tables, while vector databases are optimized for the storage and retrieval of multidimensional data points represented as vectors. These databases are useful for applications where operations such as similarity searches, geospatial data, recommendation systems, and clustering are involved. 

Some key characteristics of vector databases: 

- Vector Storage: Vector databases store data points as vectors with multiple dimensions. Each dimension represents a feature or attribute of the data point. These vectors could represent a wide range of data types, including numerical, categorical, and textual data. 
- Efficient Vector Operations: Vector databases are optimized for performing vector operations, such as vector addition, subtraction, dot products, and similarity calculations (for example, cosine similarity or Euclidean distance). 
- Efficient Search: Efficient indexing mechanisms are crucial for quick retrieval of similar vectors. Vector databases use various indexing mechanisms to enable fast retrieval. 
- Query Languages: They provide query languages and APIs tailored for vector operations and similarity search. These query languages allow users to express their search criteria efficiently. 
- Similarity Search: They excel at similarity searches, allowing users to find data points that are similar to a given query point. This characteristic is valuable in search and recommendation systems. 
- Geospatial Data Handling: Some vector databases are designed for geospatial data, making them well-suited for applications like location-based services, GIS (Geographic Information Systems), and map-related tasks. 
- Support for Diverse Data Types: Vector databases can store and manage various types of data, including vectors, images, text and more. 

PostgreSQL can gain the capabilities of a vector database with the help of the [`pgvector` extension](./how-to-use-pgvector.md).

## Embeddings

Embeddings are a concept in machine learning and natural language processing (NLP) that involve representing objects, such as words, documents, or entities, as vectors in a multi-dimensional space. These vectors are often dense, meaning that they have a high number of dimensions, and they're learned through various techniques, including neural networks. Embeddings aim to capture semantic relationships and similarities between objects in a continuous vector space. 

Common types of embeddings include: 
* word: In NLP, word embeddings represent words as vectors. Each word is mapped to a vector in a high-dimensional space, where words with similar meanings or contexts are located closer to each other. `Word2Vec` and `GloVe` are popular word embedding techniques. 
* document: These represent documents as vectors. `Doc2Vec` is popularly used to create document embeddings. 
* image: Images can be represented as embeddings to capture visual features, allowing for tasks like object recognition.

Embeddings are central to representing complex, high-dimensional data in a form easily processable by machine learning models. They can be trained on large datasets and then used as features for various tasks, and are used by LLMs. 

PostgreSQL can gain the capabilities of [generating vector embeddings with Azure AI extension OpenAI integration](./generative-ai-azure-openai.md).


## Scenarios

Generative AI has a wide range of applications across various domains and industries including tech, healthcare, entertainment, finance, manufacturing and more. Here are some common tasks that can be accomplished with generative AI: 

- [Semantic Search](./generative-ai-semantic-search.md):
    - GenAI enables semantic search on data rather than lexicographical search. The latter looks for exact matches to queries whereas semantic search finds content that satisfies the search query intent. 
- Chatbots and Virtual Assistants: 
    - Develop chatbots that can engage in natural context-aware conversations, for example, to implement self-help for customers.
- Recommendation Systems: 
    - Improve recommendation algorithms by generating embeddings or representations of items or users.
- Clustering and segmentation: 
    - GenAI-generated embeddings allow clustering algorithms to cluster data so that similar data is grouped together. This enables scenarios such as customer segmentation, which allows advertisers to target their customers differently based on their attributes.
- Content Generation: 
    - Text Generation: Generate human-like text for applications like chatbots, novel/ poetry creation, and natural language understanding. 
    - Image Generation: Create realistic images, artwork, or designs for graphics, entertainment, and advertising. 
    - Video Generation: Generate videos, animations, or video effects for film, gaming, and marketing. 
    - Music Generation
- Translation: 
    - Translate text from one language to another.
- Summarization: 
    - Summarize long articles or documents to extract key information.
- Data Augmentation:
    - Generate extra data samples to expand and improve training datasets for machine learning (ML) models. 
    - Create synthetic data for scenarios that are difficult or expensive to collect in the real world, such as medical imaging.
- Drug Discovery: 
    - Generate molecular structures and predict potential drug candidates for pharmaceutical research.
- Game Development: 
    - Create game content, including levels, characters, and textures. 
    - Generate realistic in-game environments and landscapes.
- Data Denoising and Completion: 
    - Clean noisy data by generating clean data samples. 
    - Fill in missing or incomplete data in datasets.

## Next steps

You learned how to perform semantic search with Azure Database for PostgreSQL Flexible Server and Azure OpenAI.

> [!div class="nextstepaction"]
> [Generate vector embeddings with Azure OpenAI](./generative-ai-azure-openai.md)

> [!div class="nextstepaction"]
> [Integrate Azure Database for PostgreSQL Flexible Server with Azure Cognitive Services](./generative-ai-azure-cognitive.md)

> [!div class="nextstepaction"]
> [Implement Semantic Search with Azure Database for PostgreSQL Flexible Server and Azure OpenAI](./generative-ai-semantic-search.md)

> [!div class="nextstepaction"]
> [Learn more about vector similarity search using `pgvector`](./how-to-use-pgvector.md)
