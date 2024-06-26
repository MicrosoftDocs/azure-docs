---
title: AI agents
description: AI agent key concepts and implementation of AI agent memory system.
author: wmwxwa
ms.author: wangwilliam
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 06/26/2024
---

# AI agents

## What are AI Agents?

AI agents are designed to perform specific tasks, answer questions, and automate processes for users. These agents vary widely in complexity, ranging from simple chatbots, to copilots, to advanced AI assistants in the form of digital or robotic systems that can execute complex workflows autonomously.

### Common features of AI agents

-	Planning. AI agents can plan and sequence actions to achieve specific goals. The integration of large language models (LLMs) has revolutionized their planning capabilities.
-	Tool usage. Advanced AI agents can utilize various tools, such as code execution, search, and computation capabilities, to perform tasks effectively. Tool usage is often done through function calling.
-	Perception. AI agents can perceive and process information from their environment, including visual, auditory, and other sensory data, making them more interactive and context aware.
-	Memory. AI agents possess the ability to remember past interactions (tool usage and perception) and behaviors (tool usage and planning). They store these experiences and even perform self-reflection to inform future actions. This memory component allows for continuity and improvement in agent performance over time.

> [!NOTE]
> The usage of the term “memory” in the context of AI agents should not be confused with the concept of computer memory (like volatile, non-volatile, and persistent memory).

### Copilots

Copilots are a type of AI agent designed to work alongside users rather than operate independently. Unlike fully automated agents, copilots provide suggestions and recommendations to assist users in completing tasks. For instance, when a user is writing an email, a copilot might suggest phrases, sentences, or paragraphs. The user might also ask the copilot to find relevant information in other emails or files to support the suggestion (see [retrieval-augmented generation](vector-database.md#retrieval-augmented-generation)). The user can accept, reject, or edit the suggested passages.

### Autonomous agents

Autonomous agents can operate more independently. When you set up autonomous agents to assist with email composition, you could enable them to perform the following tasks:

-	Consult existing emails, chats, files, and other information that are related to the subject matter, which may involve searching the appropriate storage or the Internet in accordance with access permissions
-	Perform qualitative or quantitative analysis on the collected information, and draw conclusions that are relevant to the email
- Write the complete email based on the conclusions and incorporate supporting evidence
-	Attach relevant files to the email
-	Review the email to ensure that all the incorporated information is factually accurate, and that the assertions are valid
-	Select the appropriate recipients for "To," "Cc," and/or "Bcc" and look up their email addresses
-	Schedule an appropriate time to send the email
-	Perform follow-ups if responses are expected but not received

You may configure the agents to perform each of the above steps with or without human approval.

### Multi-agent systems

Currently, the prevailing strategy for achieving performant autonomous agents is through multi-agent systems. In multi-agent systems, multiple autonomous agents, whether in digital or robotic form, interact or work together to achieve individual or collective goals. Agents in the system can operate independently and possess their own knowledge or information. Each agent may also have the capability to perceive its environment, make decisions, and execute actions based on its objectives.

Key characteristics of multi-agent systems:

-	Autonomous: Each agent functions independently, making its own decisions without direct human intervention or control by other agents.
-	Interactive: Agents communicate and collaborate with each other to share information, negotiate, and coordinate their actions. This interaction can occur through various protocols and communication channels.
-	Goal-oriented: Agents in a multi-agent system are designed to achieve specific goals, which can be aligned with individual objectives or a common objective shared among the agents.
-	Distributed: Multi-agent systems operate in a distributed manner, with no single point of control. This distribution enhances the system's robustness, scalability, and resource efficiency.

A multi-agent system provides the following advantages over a copilot or a single instance of LLM inference:

-	Dynamic reasoning: Compared to chain-of-thought or tree-of-thought prompting, multi-agent systems allow for dynamic navigation through various reasoning paths.
-	Sophisticated abilities: Multi-agent systems can handle complex or large-scale problems by conducting thorough decision-making processes and distributing tasks among multiple agents.
-	Enhanced memory: Multi-agent systems with memory can overcome large language models’ context windows, enabling better understanding and information retention.

### Reasoning and planning

Complex reasoning and planning are the hallmark of advanced autonomous agents. Popular autonomous agent frameworks incorporate one or more of the following methodologies for reasoning and planning:

[Self-ask](https://arxiv.org/abs/2210.03350)
> Improves on chain of thought by having the model explicitly asking itself (and answering) follow-up questions before answering the initial question.

[Reason and Act (ReAct)](https://arxiv.org/abs/2210.03629)
> Use LLMs to generate both reasoning traces and task-specific actions in an interleaved manner. Reasoning traces help the model induce, track, and update action plans as well as handle exceptions, while actions allow it to interface with external sources, such as knowledge bases or environments, to gather additional information.

[Plan and Solve](https://arxiv.org/abs/2305.04091)
> Devise a plan to divide the entire task into smaller subtasks, and then carry out the subtasks according to the plan. This mitigates the calculation errors, missing-step errors, and semantic misunderstanding errors that are often present in zero-shot chain-of-thought (CoT) prompting.

[Reflection/Self-critique](https://arxiv.org/abs/2303.11366)
> Reflexion agents verbally reflect on task feedback signals, then maintain their own reflective text in an episodic memory buffer to induce better decision-making in subsequent trials.

## Implementing AI agents

### Frameworks

Various frameworks and tools can facilitate the development and deployment of AI agents.

For tool usage and perception that do not require sophisticated planning and memory, some popular frameworks that provide robust task orchestration capabilities are LangChain, LlamaIndex, Prompt Flow, and Semantic Kernel.

For advanced and autonomous planning and execution workflows, AutoGen propelled the multi-agent wave that began in late 2022. OpenAI’s Assistants API allow their users to create agents natively within the GPT ecosystem. Popular LLM orchestrator frameworks like LangChain and LlamaIndex also added multi-agent modules.

> [!TIP]
> See the implementation example section at the end provides an example for building a simple multi-agent system using one of the popular frameworks and a unified agent memory system.

### Memory systems

The prevalent practice for experimenting with AI-enhanced applications in 2022 through 2024 has been using standalone database management systems for various data workflows or types. For example, an in-memory database for caching, a relational database for operational data (including tracing/activity logs and LLM conversation history), and a pure vector database for embedding management. However, this practice of using a complex web of standalone databases can hurt AI agent memory system’s speed and scalability. Each type of database’s individual weaknesses are also exacerbated in multi-agent systems:

In-memory databases are excellent for speed but may struggle with the large-scale data persistence that AI agents require.

Relational databases are not ideal for the varied modalities and fluid schemas of data handled by agents. Moreover, relational databases require manual efforts and even downtime to manage provisioning, partitioning, and sharding.

[Pure vector databases](vector-database.md#integrated-vector-database-vs-pure-vector-database) tend to be less effective for transactional operations, real-time updates, and distributed workloads. The popular pure vector database services nowadays typically offe
- no guarantee on reads & writes
- limited ingestion throughput
- low availability (below 99.9%, which equals annualized outage of almost 9 hours or more)
- one consistency level (eventual)
- resource-intensive in-memory vector index
- limited options for multitenancy

Integrating all these disparate databases into a cohesive, interoperable, and resilient memory system for AI agents is a significant challenge in and of itself.

The next section dives deeper into what makes a robust AI agent memory system.

## Memory can make or break AI agents

Just as efficient database management systems are critical to software applications’ performances, it is critical to provide LLM-powered agents with relevant and useful information to guide their inference. Robust memory systems enable organizing and storing different kinds of information that the agents can retrieve at inference time.

Currently, LLM-powered applications often use [retrieval-augmented generation](vector-database.md#retrieval-augmented-generation) that uses basic semantic search or vector search to retrieve passages or documents. [Vector search](vector-database.md#vector-search) can be useful for finding general information, but it may not capture the specific context, structure, or relationships that are relevant for a particular task or domain.

For example, if the task is to write code, semantic search may not be able to retrieve the syntax tree, the file system layout, the code summaries, or the API signatures that are important for generating coherent and correct code. Similarly, if the task is to work with tabular data, semantic search may not be able to retrieve the schema, the foreign keys, the stored procedures, or the reports that are useful for querying or analyzing the data.

Weaving together [a web of standalone in-memory, relational, and vector databases](#memory-systems) may work for prototypical agent systems; however, this approach adds complexity and performance bottlenecks that can hamper the performance of advanced autonomous agents.

Therefore, a robust memory system should have the following characteristics:

#### Multi-modal (Part One)

AI agent memory systems should provide different collections that store metadata, relationships, entities, summaries, or other types of information that can be useful for different tasks and domains. These collections can be based on the structure and format of the data, such as documents, tables, or code, or they can be based on the content and meaning of the data, such as concepts, associations, or procedural steps.

#### Operational

Memory systems should provide different memory banks that store information that is relevant for the interaction with the user and the environment. Such information may include chat history, user preferences, sensory data, decisions made, facts learned, or other operational data that are updated with high frequency and at high volumes. These memory banks can help the agents remember short-term and long-term information, avoid repeating or contradicting themselves, and maintain task coherence. These requirements must hold true even if the agents perform a multitude of unrelated tasks in succession. Further complicating the requirements are scenarios where the agents go through numerous branch plans for the same goal that diverge or converge at different points.

#### Sharable but also separable

At the macro level, memory systems should enable multiple AI agents to collaborate on a problem or process different aspects of the problem by providing shared memory that is accessible to all the agents. This can facilitate the exchange of information and the coordination of actions among the agents. At the same time, the memory system must allow agents to preserve their own persona and characteristics, such as their unique collections of prompts and memories.

#### Multi-modal (Part Two)

Not only are memory systems critical to AI agents; they are also important for the humans who develop, maintain, and use these agents. For example, humans may need to supervise agents’ planning and execution workflows in near real-time. While supervising, humans may interject with guidance or make in-line edits of agents’ dialogues or monologues. Humans may also need to audit the reasoning and actions of agents to verify the validity of the final output. Human-agent interactions are likely in natural or programming languages, while agents "think," "learn," and "remember" through embeddings. This poses another requirement on memory systems’ consistency across data modalities.

## Implementing AI agent memory systems

The above characteristics require AI agent memory systems to be highly scalable and swift. Painstakingly weaving together [a plethora of disparate in-memory, relational, and vector databases](#memory-systems) may work for early-stage AI-enabled applications; however, this approach adds complexity and performance bottlenecks that can hamper the performance of advanced autonomous agents.

In place of all the standalone databases, AI agent memory systems can rely on Azure Cosmos DB as a unified solution. Its robustness successfully enabled OpenAI’s ChatGPT service to scale dynamically with high reliability and low maintenance. Powered by an atom-record-sequence engine, it is the world’s first globally distributed serverless NoSQL, relational, and vector database service. AI agents built on top of Azure Cosmos DB enjoy speed, scale, and simplicity.

#### Speed

Azure Cosmos DB provides single-digit millisecond latency, making it highly suitable for processes requiring rapid data access and management, including caching (traditional and semantic), transactions, and operational workloads. This low latency is crucial for AI agents that need to perform complex reasoning, make real-time decisions, and provide immediate responses. Moreover, its use of state-of-the-art DiskANN algorithm provides accurate and fast vector search with 95% less memory consumption.

#### Scale

With support for multi-region I/O and multitenancy, Azure Cosmos DB is engineered for global distribution and horizontal scalability, ensuring that memory systems can expand seamlessly and keep up with rapidly growing data and agents. Its SLA-backed 99.999% availability (less than 5 minutes of downtime per year, contrasting 9 hours or more for pure vector database services) provides a solid foundation fro mission-critical workloads. At the same time, its various service models like Reserved Capacity or Serverless drastically lower financial costs.

#### Simplicity

Azure Cosmos DB simplifies data management and architecture by integrating multiple database functionalities into a single, cohesive platform.
Its integrated vector database capabilities can store, index, and query embeddings alongside the corresponding data in natural or programming languages, enabling greater data consistency, scale, and performance.

Its flexibility easily supports the varied modalities and fluid schemas of the metadata, relationships, entities, summaries, chat history, user preferences, sensory data, decisions made, facts learned, or other operational data involved in agent workflows. The database automatically indexes all data without requiring schema or index management, allowing AI agents to perform complex queries quickly and efficiently.

Lastly, its fully managed service eliminates the overhead of database administration, including tasks such as scaling, patching, and backups. Thus, developers can focus on building and optimizing AI agents without worrying about the underlying data infrastructure.

#### Advanced features

Azure Cosmos DB incorporates advanced features such as change feed, which allows tracking and responding to changes in data in real-time. This capability is useful for AI agents that need to react to new information promptly.

Additionally, the built-in support for multi-master writes enables high availability and resilience, ensuring continuous operation of AI agents even in the face of regional failures.

The five available consistency levels (from strong to eventual) can also cater to various distributed workloads depending on the scenario requirements.
Implementation example

## AI agent implementation sample

This section explores the implementation of a LangChain Agent using Azure Cosmos DB as the memory system to autonomously process traveler inquiries and bookings in a CruiseLine travel application.

Chatbots have been a long-standing concept, but AI agents are advancing beyond basic human conversation to carry out tasks based on natural language, traditionally requiring coded logic. This AI travel agent, developed using LangChain's agent framework, will utilize the robust vector database and document store capabilities of Azure Cosmos DB to address traveler inquiries and facilitate trip bookings. It will operate within a Python FastAPI backend and support user interactions through a React JS user interface.

#### Prerequisites

- If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free/) before you begin.
- Setup account for OpenAI API or Azure OpenAI Service.
- Create a vCore cluster in Azure Cosmos DB for MongoDB by following this [QuickStart](mongodb/vcore/quickstart-portal.md).
- An IDE for Development, such as VS Code.
- Python 3.11.4 installed on development environment.

#### Download the Project

All of the code and sample datasets are available on [GitHub](https://github.com/jonathanscholtes/Travel-AI-Agent-React-FastAPI-and-Cosmos-DB-Vector-Store).

- loader: Python code for loading sample documents and vector embeddings in Azure Cosmos DB
- api: Python FastAPI for Hosting Travel AI Agent
- web: Web Interface with React JS

#### Load Travel Documents into Azure Cosmos DB

The GitHub repository contains a Python project located in the **loader** directory intended for loading the sample travel documents into Azure Cosmos DB. This section sets-up the project to load the documents.

For a more comprehensive explanation of the code, refer to this [blog post](https://stochasticcoder.com/2024/02/27/langchain-rag-with-react-fastapi-cosmos-db-vector-part-1/).

#### Setting Up the Environment for Loader

Setup your Python virtual environment in the **loader** directory by running the following:
```python
    python -m venv venv
```

Activate your environment and install dependencies in the **loader** directory:
```python
    venv\Scripts\activate
    python -m pip install -r requirements.txt
```

Create a file, named **.env** in the **loader** directory, to store the following environment variables.
```python
    OPENAI_API_KEY="**Your Open AI Key**"
    MONGO_CONNECTION_STRING="mongodb+srv:**your connection string from Azure Cosmos DB**"
```

#### Loading Documents and Vectors

Below is the Python file **main.py**; it serves as the central entry point for loading data into Azure Cosmos DB. This code processes the sample travel data from the GitHub repository, including information about ships and destinations. Additionally, it generates travel itinerary packages for each ship and destination, allowing travelers to book them using the AI agent. The CosmosDBLoader is responsible for creating collections, vector embeddings, and indexes in the Azure Cosmos DB instance.

**main.py**
```python
from cosmosdbloader import CosmosDBLoader
from itinerarybuilder import ItineraryBuilder
import json


cosmosdb_loader = CosmosDBLoader(DB_Name='travel')

#read in ship data
with open('documents/ships.json') as file:
        ship_json = json.load(file)

#read in destination data
with open('documents/destinations.json') as file:
        destinations_json = json.load(file)

builder = ItineraryBuilder(ship_json['ships'],destinations_json['destinations'])

# Create five itinerary pakages
itinerary = builder.build(5)

# Save itinerary packages to Cosmos DB
cosmosdb_loader.load_data(itinerary,'itinerary')

# Save destinations to Cosmos DB
cosmosdb_loader.load_data(destinations_json['destinations'],'destinations')

# Save ships to Cosmos DB, create vector store
collection = cosmosdb_loader.load_vectors(ship_json['ships'],'ships')

# Add text search index to ship name
collection.create_index([('name', 'text')])
```

Load the documents, vectors and create indexes by simply executing the following command from the loader directory:
```python
    python main.py
```

Output:
--build itinerary--
--load itinerary--
--load destinations--
--load vectors ships--

#### Building Travel AI Agent with Python FastAPI

The AI travel agent will be hosted in a backend API using Python FastAPI, facilitating integration with the frontend user interface. The API project has been configured to process agent requests by grounding the LLM prompts against the data layer, specifically the vectors and documents in Azure Cosmos DB. Furthermore, the agent will make use of various tools, particularly the Python functions provided at the API service layer. This article will focus in on the code necessary for AI agents within the API code.

For a more comprehensive examination of the code related to vector search with Python FastAPI, please refer to this [blog post](https://stochasticcoder.com/2024/02/29/langchain-rag-with-react-fastapi-cosmos-db-vector-part-2/).

The API project in the GitHub repository is structured as follows:

- Model – data modeling components using Pydantic models.
- Web – web layer components responsible for routing requests and managing communication.
- Service – service layer components responsible for primary business logic and interaction with data layer; LangChain Agent and Agent Tools.
- Data – data layer components responsible for interacting with Azure Cosmos DB for Mongo DB documents storage and vector search.

#### Setting Up the Environment for the API

Python version 3.11.4 was utilized for the development and testing of the API.

Setup your python virtual environment in the **api** directory.
```python
    python -m venv venv
```

Activate your environment and install dependencies using the requirements file in the **api** directory:
```python
    venv\Scripts\activate
    python -m pip install -r requirements.txt
```

Create a file, named **.env** in the **api** directory, to store your environment variables.
```python
    OPENAI_API_KEY="**Your Open AI Key**"
    MONGO_CONNECTION_STRING="mongodb+srv:**your connection string from Azure Cosmos DB**"
```

With the environment configured and variables set up, we are ready to initiate the FastAPI server. Run the following command from the api directory to initiate the server.
```python
    python app.py
```

The FastAPI server launches on the localhost loopback 127.0.0.1 port 8000 by default. You can access the Swagger documents using the following localhost address: http://127.0.0.1:8000/docs

#### Using a Session for the AI Agent Memory
It is imperative for the Travel Agent to have the capability to reference previously provided information within the ongoing conversation. This ability is commonly known as "memory" in the context of LLMs, which should not be confused with the concept of computer memory (like volatile, non-volatile, and persistent memory).

To achieve this objective, we will utilize the chat message history, which will be securely stored in our Azure Cosmos DB instance. Each chat session will have its history stored using a session ID to ensure that only messages from the current conversation session are accessible. This necessity is the reason behind the existence of a ‘Get Session’ method in our API. It is a placeholder method for managing web sessions in order to illustrate the use of chat message history.

For the purpose of the AI Agent, we only need to simulate a session, thus the stubbed-out method merely returns a generated session ID for tracking message history. In a practical implementation, this session would be stored in Azure Cosmos DB and potentially in React JS localStorage.

*web/session.py*
```python
    @router.get("/")
    def get_session():
        return {'session_id':str(uuid.uuid4().hex)}
```

#### Start a Conversation with the AI Travel Agent


If you would like to add semantic caching to this travel agent in order to reduce GPT token consumption for repeatedly asked questions, you may use this Azure Cosmos DB semantic caching connector for LangChain (link connector).
(Content from Improve LLM Performance Using Semantic Cache with Cosmos DB)
