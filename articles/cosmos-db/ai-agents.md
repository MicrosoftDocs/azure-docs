---
title: AI agent
description: Learn about key concepts for agents and step through the implementation of an AI agent memory system.
author: wmwxwa
ms.author: wangwilliam
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 06/26/2024
---

# AI agent

AI agents are designed to perform specific tasks, answer questions, and automate processes for users. These agents vary widely in complexity. They range from simple chatbots, to copilots, to advanced AI assistants in the form of digital or robotic systems that can run complex workflows autonomously.

This article provides conceptual overviews and detailed implementation samples for AI agents.

## What are AI agents?

Unlike standalone large language models (LLMs) or rule-based software/hardware systems, AI agents have these common features:

- **Planning**: AI agents can plan and sequence actions to achieve specific goals. The integration of LLMs has revolutionized their planning capabilities.
- **Tool usage**: Advanced AI agents can use various tools, such as code execution, search, and computation capabilities, to perform tasks effectively. AI agents often use tools through function calling.
- **Perception**: AI agents can perceive and process information from their environment, to make them more interactive and context aware. This information includes visual, auditory, and other sensory data.
- **Memory**: AI agents have the ability to remember past interactions (tool usage and perception) and behaviors (tool usage and planning). They store these experiences and even perform self-reflection to inform future actions. This memory component allows for continuity and improvement in agent performance over time.

> [!NOTE]
> The usage of the term *memory* in the context of AI agents is different from the concept of computer memory (like volatile, nonvolatile, and persistent memory).

### Copilots

Copilots are a type of AI agent. They work alongside users rather than operating independently. Unlike fully automated agents, copilots provide suggestions and recommendations to assist users in completing tasks.

For instance, when a user is writing an email, a copilot might suggest phrases, sentences, or paragraphs. The user might also ask the copilot to find relevant information in other emails or files to support the suggestion (see [retrieval-augmented generation](vector-database.md#retrieval-augmented-generation)). The user can accept, reject, or edit the suggested passages.

### Autonomous agents

Autonomous agents can operate more independently. When you set up autonomous agents to assist with email composition, you could enable them to perform the following tasks:

- Consult existing emails, chats, files, and other internal and public information that's related to the subject matter.
- Perform qualitative or quantitative analysis on the collected information, and draw conclusions that are relevant to the email.
- Write the complete email based on the conclusions and incorporate supporting evidence.
- Attach relevant files to the email.
- Review the email to ensure that all the incorporated information is factually accurate and that the assertions are valid.
- Select the appropriate recipients for **To**, **Cc**, and **Bcc**, and look up their email addresses.
- Schedule an appropriate time to send the email.
- Perform follow-ups if responses are expected but not received.

You can configure the agents to perform each of the preceding tasks with or without human approval.

### Multi-agent systems

A popular strategy for achieving performant autonomous agents is the use of multi-agent systems. In multi-agent systems, multiple autonomous agents, whether in digital or robotic form, interact or work together to achieve individual or collective goals. Agents in the system can operate independently and possess their own knowledge or information. Each agent might also have the capability to perceive its environment, make decisions, and execute actions based on its objectives.

Multi-agent systems have these key characteristics:

- **Autonomous**: Each agent functions independently. It makes its own decisions without direct human intervention or control by other agents.
- **Interactive**: Agents communicate and collaborate with each other to share information, negotiate, and coordinate their actions. This interaction can occur through various protocols and communication channels.
- **Goal-oriented**: Agents in a multi-agent system are designed to achieve specific goals, which can be aligned with individual objectives or a shared objective among the agents.
- **Distributed**: Multi-agent systems operate in a distributed manner, with no single point of control. This distribution enhances the system's robustness, scalability, and resource efficiency.

A multi-agent system provides the following advantages over a copilot or a single instance of LLM inference:

- **Dynamic reasoning**: Compared to chain-of-thought or tree-of-thought prompting, multi-agent systems allow for dynamic navigation through various reasoning paths.
- **Sophisticated abilities**: Multi-agent systems can handle complex or large-scale problems by conducting thorough decision-making processes and distributing tasks among multiple agents.
- **Enhanced memory**: Multi-agent systems with memory can overcome the context windows of LLMs to enable better understanding and information retention.

## Implementation of AI agents

### Reasoning and planning

Complex reasoning and planning are the hallmark of advanced autonomous agents. Popular frameworks for autonomous agents incorporate one or more of the following methodologies (with links to arXiv archive pages) for reasoning and planning:

- [Self-Ask](https://arxiv.org/abs/2210.03350)

  Improve on chain of thought by having the model explicitly ask itself (and answer) follow-up questions before answering the initial question.

- [Reason and Act (ReAct)](https://arxiv.org/abs/2210.03629)

  Use LLMs to generate both reasoning traces and task-specific actions in an interleaved manner. Reasoning traces help the model induce, track, and update action plans, along with handling exceptions. Actions allow the model to connect with external sources, such as knowledge bases or environments, to gather additional information.

- [Plan and Solve](https://arxiv.org/abs/2305.04091)

  Devise a plan to divide the entire task into smaller subtasks, and then carry out the subtasks according to the plan. This approach mitigates the calculation errors, missing-step errors, and semantic misunderstanding errors that are often present in zero-shot chain-of-thought prompting.

- [Reflect/Self-critique](https://arxiv.org/abs/2303.11366)

  Use *reflexion* agents that verbally reflect on task feedback signals. These agents maintain their own reflective text in an episodic memory buffer to induce better decision-making in subsequent trials.

### Frameworks

Various frameworks and tools can facilitate the development and deployment of AI agents.

For tool usage and perception that don't require sophisticated planning and memory, some popular LLM orchestrator frameworks are LangChain, LlamaIndex, Prompt Flow, and Semantic Kernel.

For advanced and autonomous planning and execution workflows, [AutoGen](https://microsoft.github.io/autogen/) propelled the multi-agent wave that began in late 2022. OpenAI's [Assistants API](https://platform.openai.com/docs/assistants/overview) allows its users to create agents natively within the GPT ecosystem. [LangChain Agents](https://python.langchain.com/v0.1/docs/modules/agents/) and [LlamaIndex Agents](https://docs.llamaindex.ai/en/stable/use_cases/agents/) also emerged around the same time.

> [!TIP]
> The [implementation sample](#implementation-sample) later in this article shows how to build a simple multi-agent system by using one of the popular frameworks and a unified agent memory system.

### AI agent memory system

The prevalent practice for experimenting with AI-enhanced applications from 2022 through 2024 has been using standalone database management systems for various data workflows or types. For example, you can use an in-memory database for caching, a relational database for operational data (including tracing/activity logs and LLM conversation history), and a [pure vector database](vector-database.md#integrated-vector-database-vs-pure-vector-database) for embedding management.

However, this practice of using a complex web of standalone databases can hurt an AI agent's performance. Integrating all these disparate databases into a cohesive, interoperable, and resilient memory system for AI agents is its own challenge.

Also, many of the frequently used database services are not optimal for the speed and scalability that AI agent systems need. These databases' individual weaknesses are exacerbated in multi-agent systems.

#### In-memory databases

In-memory databases are excellent for speed but might struggle with the large-scale data persistence that AI agents need.

#### Relational databases

Relational databases are not ideal for the varied modalities and fluid schemas of data that agents handle. Relational databases require manual efforts and even downtime to manage provisioning, partitioning, and sharding.

#### Pure vector databases

Pure vector databases tend to be less effective for transactional operations, real-time updates, and distributed workloads. The popular pure vector databases nowadays typically offer:

- No guarantee on reads and writes.
- Limited ingestion throughput.
- Low availability (below 99.9%, or an annualized outage of 9 hours or more).
- One consistency level (eventual).
- A resource-intensive in-memory vector index.
- Limited options for multitenancy.
- Limited security.

## Characteristics of a robust AI agent memory system

Just as efficient database management systems are critical to the performance of software applications, it's critical to provide LLM-powered agents with relevant and useful information to guide their inference. Robust memory systems enable organizing and storing various kinds of information that the agents can retrieve at inference time.

Currently, LLM-powered applications often use [retrieval-augmented generation](vector-database.md#retrieval-augmented-generation) that uses basic semantic search or vector search to retrieve passages or documents. [Vector search](vector-database.md#vector-search) can be useful for finding general information. But vector search might not capture the specific context, structure, or relationships that are relevant for a particular task or domain.

For example, if the task is to write code, vector search might not be able to retrieve the syntax tree, file system layout, code summaries, or API signatures that are important for generating coherent and correct code. Similarly, if the task is to work with tabular data, vector search might not be able to retrieve the schema, the foreign keys, the stored procedures, or the reports that are useful for querying or analyzing the data.

Weaving together a web of standalone in-memory, relational, and vector databases (as described [earlier](#ai-agent-memory-system)) is not an optimal solution for the varied data types. This approach might work for prototypical agent systems. However, it adds complexity and performance bottlenecks that can hamper the performance of advanced autonomous agents.

A robust memory system should have the following characteristics.

### Multimodal

AI agent memory systems should provide collections that store metadata, relationships, entities, summaries, or other types of information that can be useful for various tasks and domains. These collections can be based on the structure and format of the data, such as documents, tables, or code. Or they can be based on the content and meaning of the data, such as concepts, associations, or procedural steps.

Memory systems aren't just critical to AI agents. They're also important for the humans who develop, maintain, and use these agents.

For example, humans might need to supervise agents' planning and execution workflows in near real time. While supervising, humans might interject with guidance or make in-line edits of agents' dialogues or monologues. Humans might also need to audit the reasoning and actions of agents to verify the validity of the final output.

Human/agent interactions are likely in natural or programming languages, whereas agents "think," "learn," and "remember" through embeddings. This difference poses another requirement on memory systems' consistency across data modalities.

### Operational

Memory systems should provide memory banks that store information that's relevant for the interaction with the user and the environment. Such information might include chat history, user preferences, sensory data, decisions made, facts learned, or other operational data that's updated with high frequency and at high volumes.

These memory banks can help the agents remember short-term and long-term information, avoid repeating or contradicting themselves, and maintain task coherence. These requirements must hold true even if the agents perform a multitude of unrelated tasks in succession. In advanced cases, agents might also test numerous branch plans that diverge or converge at different points.

### Sharable but also separable

At the macro level, memory systems should enable multiple AI agents to collaborate on a problem or process different aspects of the problem by providing shared memory that's accessible to all the agents. Shared memory can facilitate the exchange of information and the coordination of actions among the agents.

At the same time, the memory system must allow agents to preserve their own persona and characteristics, such as their unique collections of prompts and memories.

## Building a robust AI agent memory system

The preceding characteristics require AI agent memory systems to be highly scalable and swift. Painstakingly weaving together disparate in-memory, relational, and vector databases (as described [earlier](#ai-agent-memory-system)) might work for early-stage AI-enabled applications. However, this approach adds complexity and performance bottlenecks that can hamper the performance of advanced autonomous agents.

In place of all the standalone databases, Azure Cosmos DB can serve as a unified solution for AI agent memory systems. Its robustness successfully [enabled OpenAI's ChatGPT service](https://www.youtube.com/watch?v=6IIUtEFKJec&t) to scale dynamically with high reliability and low maintenance. Powered by an atom-record-sequence engine, it's the world's first globally distributed [NoSQL](distributed-nosql.md), [relational](distributed-relational.md), and [vector database](vector-database.md) service that offers a serverless mode. AI agents built on top of Azure Cosmos DB offer speed, scale, and simplicity.

### Speed

Azure Cosmos DB provides single-digit millisecond latency. This capability makes it suitable for processes that require rapid data access and management. These processes include caching (both traditional and [semantic caching](https://techcommunity.microsoft.com/t5/azure-architecture-blog/optimize-azure-openai-applications-with-semantic-caching/ba-p/4106867)), transactions, and operational workloads.

Low latency is crucial for AI agents that need to perform complex reasoning, make real-time decisions, and provide immediate responses. In addition, the service's [use of the DiskANN algorithm](nosql/vector-search.md#enroll-in-the-vector-search-preview-feature) provides accurate and fast vector search with minimal memory consumption.

### Scale

Azure Cosmos DB is engineered for global distribution and horizontal scalability. It offers support for multiple-region I/O and multitenancy.

The service helps ensure that memory systems can expand seamlessly and keep up with rapidly growing agents and associated data. The [availability guarantee in its service-level agreement (SLA)](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services) translates to less than 5 minutes of downtime per year. Pure vector database services, by contrast, come with 9 hours or more of downtime. This availability provides a solid foundation for mission-critical workloads. At the same time, the various service models in Azure Cosmos DB, like [Reserved Capacity](reserved-capacity.md) or Serverless, can help reduce financial costs.

### Simplicity

Azure Cosmos DB can simplify data management and architecture by integrating multiple database functionalities into a single, cohesive platform.

Its integrated vector database capabilities can store, index, and query embeddings alongside the corresponding data in natural or programming languages. This capability enables greater data consistency, scale, and performance.

Its flexibility supports the varied modalities and fluid schemas of the metadata, relationships, entities, summaries, chat history, user preferences, sensory data, decisions, facts learned, or other operational data involved in agent workflows. The database automatically indexes all data without requiring schema or index management, which helps AI agents perform complex queries quickly and efficiently.

Azure Cosmos DB is fully managed, which eliminates the overhead of database administration tasks like scaling, patching, and backups. Without this overhead, developers can focus on building and optimizing AI agents without worrying about the underlying data infrastructure.

### Advanced features

Azure Cosmos DB incorporates advanced features such as change feed, which allows tracking and responding to changes in data in real time. This capability is useful for AI agents that need to react to new information promptly.

Additionally, the built-in support for multi-master writes enables high availability and resilience to help ensure continuous operation of AI agents, even after regional failures.

The five available [consistency levels](consistency-levels.md) (from strong to eventual) can also cater to various distributed workloads, depending on the scenario requirements.

> [!TIP]
> You can choose from two Azure Cosmos DB APIs to build your AI agent memory system:
>
> - Azure Cosmos DB for NoSQL, which offers 99.999% availability guarantee and provides [three vector search algorithms](nosql/vector-search.md): IVF, HNSW, and DiskANN
> - vCore-based Azure Cosmos DB for MongoDB, which offers 99.995% availability guarantee and provides [two vector search algorithms](mongodb/vcore/vector-search.md): IVF and HNSW (DiskANN is upcoming)
>
> For information about the availability guarantees for these APIs, see the [service SLAs](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Implementation sample

This section explores the implementation of an autonomous agent to process traveler inquiries and bookings in a travel application for a cruise line.

Chatbots are a long-standing concept, but AI agents are advancing beyond basic human conversation to carry out tasks based on natural language. These tasks traditionally required coded logic. The AI travel agent in this implementation sample uses the LangChain Agent framework for agent planning, tool usage, and perception.

The AI travel agent's [unified memory system](#characteristics-of-a-robust-ai-agent-memory-system) uses the [vector database](vector-database.md) and document store capabilities of Azure Cosmos DB to address traveler inquiries and facilitate trip bookings. Using Azure Cosmos DB for this purpose helps ensure speed, scale, and simplicity, as described [earlier](#building-a-robust-ai-agent-memory-system).

The sample agent operates within a Python FastAPI back end. It supports user interactions through a React JavaScript user interface.

### Prerequisites

- An Azure subscription. If you don't have one, you can [try Azure Cosmos DB for free](try-free.md) for 30 days without creating an Azure account. The free trial doesn't require a credit card, and no commitment follows the trial period.
- An account for the OpenAI API or Azure OpenAI Service.
- A vCore cluster in Azure Cosmos DB for MongoDB. You can create one by following [this quickstart](mongodb/vcore/quickstart-portal.md).
- An integrated development environment, such as Visual Studio Code.
- Python 3.11.4 installed in the development environment.

### Download the project

All of the code and sample datasets are available in [this GitHub repository](https://github.com/jonathanscholtes/Travel-AI-Agent-React-FastAPI-and-Cosmos-DB-Vector-Store). The repository includes these folders:

- *loader*: This folder contains Python code for loading sample documents and vector embeddings in Azure Cosmos DB.
- *api*: This folder contains the Python FastAPI project for hosting the AI travel agent.
- *web*: This folder contains code for the React web interface.

### Load travel documents into Azure Cosmos DB

The GitHub repository contains a Python project in the *loader* directory. It's intended for loading the sample travel documents into Azure Cosmos DB.

#### Set up the environment

Set up your Python virtual environment in the *loader* directory by running the following command:

```python
    python -m venv venv
```

Activate your environment and install dependencies in the *loader* directory:

```python
    venv\Scripts\activate
    python -m pip install -r requirements.txt
```

Create a file named *.env* in the *loader* directory, to store the following environment variables:

```python
    OPENAI_API_KEY="<your OpenAI key>"
    MONGO_CONNECTION_STRING="mongodb+srv:<your connection string from Azure Cosmos DB>"
```

#### Load documents and vectors

The Python file *main.py* serves as the central entry point for loading data into Azure Cosmos DB. This code processes the sample travel data from the GitHub repository, including information about ships and destinations. The code also generates travel itinerary packages for each ship and destination, so that travelers can book them by using the AI agent. The CosmosDBLoader tool is responsible for creating collections, vector embeddings, and indexes in the Azure Cosmos DB instance.

Here are the contents of *main.py*:

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

# Create five itinerary packages
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

Load the documents, load the vectors, and create indexes by running the following command from the *loader* directory:

```python
    python main.py
```

Here's the output of *main.py*:

```markdown
--build itinerary--
--load itinerary--
--load destinations--
--load vectors ships--
```

### Build the AI travel agent by using Python FastAPI

The AI travel agent is hosted in a back end API through Python FastAPI, which facilitates integration with the front-end user interface. The API project processes agent requests by [grounding](https://techcommunity.microsoft.com/t5/fasttrack-for-azure/grounding-llms/ba-p/3843857) the LLM prompts against the data layer, specifically the vectors and documents in Azure Cosmos DB.

The agent makes use of various tools, particularly the Python functions provided at the API service layer. This article focuses on the code necessary for AI agents within the API code.

The API project in the GitHub repository is structured as follows:

- *Data modeling components* use Pydantic models.
- *Web layer components* are responsible for routing requests and managing communication.
- *Service layer components* are responsible for primary business logic and interaction with the data layer, the LangChain Agent, and agent tools.
- *Data layer components* are responsible for interacting with Azure Cosmos DB for MongoDB document storage and vector search.

### Set up the environment for the API

We used Python version 3.11.4 for the development and testing of the API.

Set up your Python virtual environment in the *api* directory:

```python
    python -m venv venv
```

Activate your environment and install dependencies by using the *requirements* file in the *api* directory:

```python
    venv\Scripts\activate
    python -m pip install -r requirements.txt
```

Create a file named *.env* in the *api* directory, to store your environment variables:

```python
    OPENAI_API_KEY="<your Open AI key>"
    MONGO_CONNECTION_STRING="mongodb+srv:<your connection string from Azure Cosmos DB>"
```

Now that you've configured the environment and set up variables, run the following command from the *api* directory to initiate the server:

```python
    python app.py
```

The FastAPI server starts on the localhost loopback 127.0.0.1 port 8000 by default. You can access the Swagger documents by using the following localhost address: `http://127.0.0.1:8000/docs`.

### Use a session for the AI agent memory

It's imperative for the travel agent to be able to reference previously provided information within the ongoing conversation. This ability is commonly known as *memory* in the context of LLMs.

To achieve this objective, use the chat message history that's stored in the Azure Cosmos DB instance. The history for each chat session is stored through a session ID to ensure that only messages from the current conversation session are accessible. This necessity is the reason behind the existence of a `Get Session` method in the API. It's a placeholder method for managing web sessions to illustrate the use of chat message history.

Select **Try it out** for `/session/`.

:::image type="content" source="media/gen-ai/ai-agent/fastapi-get-session.png" lightbox="media/gen-ai/ai-agent/fastapi-get-session.png" alt-text="Screenshot of the use of the Get Session method in Python FastAPI, with the button for trying it out.":::

```python
{
  "session_id": "0505a645526f4d68a3603ef01efaab19"
}
```

For the AI agent, you only need to simulate a session. The stubbed-out method merely returns a generated session ID for tracking message history. In a practical implementation, this session would be stored in Azure Cosmos DB and potentially in React `localStorage`.

Here are the contents of *web/session.py*:

```python
    @router.get("/")
    def get_session():
        return {'session_id':str(uuid.uuid4().hex)}
```

### Start a conversation with the AI travel agent

Use the session ID that you obtained from the previous step to start a new dialogue with the AI agent, so you can validate its functionality. Conduct the test by submitting the following phrase: "I want to take a relaxing vacation."

Select **Try it out** for `/agent/agent_chat`.

:::image type="content" source="media/gen-ai/ai-agent/fastapi-agent-chat.png" lightbox="media/gen-ai/ai-agent/fastapi-agent-chat.png" alt-text="Screenshot of the use of the Agent Chat method in Python FastAPI, with the button for trying it out.":::

Use this example parameter:

```python
{
  "input": "I want to take a relaxing vacation.",
  "session_id": "0505a645526f4d68a3603ef01efaab19"
}
```

The initial execution results in a recommendation for the Tranquil Breeze Cruise and the Fantasy Seas Adventure Cruise, because the agent anticipates that they're the most relaxing cruises available through the vector search. These documents have the highest score for `similarity_search_with_score` called in the data layer of the API, `data.mongodb.travel.similarity_search()`.

The similarity search scores appear as output from the API for debugging purposes. Here's the output after a call to `data.mongodb.travel.similarity_search()`:

```markdown
0.8394561085977978
0.8086545112328692
2
```

> [!TIP]
> If documents are not being returned for vector search, modify the `similarity_search_with_score` limit or the score filter value as needed (`[doc for doc, score  in docs if score >=.78]`) in `data.mongodb.travel.similarity_search()`.

Calling `agent_chat` for the first time creates a new collection named `history` in Azure Cosmos DB to store the conversation by session. This call enables the agent to access the stored chat message history as needed. Subsequent executions of `agent_chat` with the same parameters produce varying results, because it draws from memory.

### Walk through the AI agent

When you're integrating the AI agent into the API, the web search components are responsible for initiating all requests. The web search components are followed by the search service, and finally the data components.

In this specific case, you use a MongoDB data search that connects to Azure Cosmos DB. The layers facilitate the exchange of model components, with the AI agent and the AI agent tool code residing in the service layer. This approach enables the seamless interchangeability of data sources. It also extends the capabilities of the AI agent with additional, more intricate functionalities or tools.

:::image type="content" source="media/gen-ai/ai-agent/travel-ai-agent-fastapi-layers.png" lightbox="media/gen-ai/ai-agent/travel-ai-agent-fastapi-layers.png" alt-text="Diagram of the FastAPI layers of the AI travel agent.":::

#### Service layer

The service layer forms the cornerstone of core business logic. In this particular scenario, the service layer plays a crucial role as the repository for the LangChain Agent code. It facilitates the seamless integration of user prompts with Azure Cosmos DB data, conversation memory, and agent functions for the AI agent.

The service layer employs a singleton pattern module for handling agent-related initializations in the *init.py* file. Here are the contents of *service/init.py*:

```python
from dotenv import load_dotenv
from os import environ
from langchain.globals import set_llm_cache
from langchain_openai import ChatOpenAI
from langchain_mongodb.chat_message_histories import MongoDBChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.agents import AgentExecutor, create_openai_tools_agent
from service import TravelAgentTools as agent_tools

load_dotenv(override=False)


chat : ChatOpenAI | None=None
agent_with_chat_history : RunnableWithMessageHistory | None=None

def LLM_init():
    global chat,agent_with_chat_history
    chat = ChatOpenAI(model_name="gpt-3.5-turbo-16k",temperature=0)
    tools = [agent_tools.vacation_lookup, agent_tools.itinerary_lookup, agent_tools.book_cruise ]

    prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful and friendly travel assistant for a cruise company. Answer travel questions to the best of your ability providing only relevant information. In order to book a cruise you will need to capture the person's name.",
        ),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "Answer should be embedded in html tags. {input}"),
         MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
    )

    #Answer should be embedded in HTML tags. Only answer questions related to cruise travel, If you can not answer respond with \"I am here to assist with your travel questions.\". 


    agent = create_openai_tools_agent(chat, tools, prompt)
    agent_executor  = AgentExecutor(agent=agent, tools=tools, verbose=True)

    agent_with_chat_history = RunnableWithMessageHistory(
        agent_executor,
        lambda session_id: MongoDBChatMessageHistory( database_name="travel",
                                                 collection_name="history",
                                                   connection_string=environ.get("MONGO_CONNECTION_STRING"),
                                                   session_id=session_id),
        input_messages_key="input",
        history_messages_key="chat_history",
)

LLM_init()
```

The *init.py* file initiates the loading of environment variables from an *.env* file by using the `load_dotenv(override=False)` method. Then, a global variable named `agent_with_chat_history` is instantiated for the agent. This agent is intended for use by *TravelAgent.py*.

The `LLM_init()` method is invoked during module initialization to configure the AI agent for conversation via the API web layer. The OpenAI `chat` object is instantiated through the GPT-3.5 model and incorporates specific parameters such as model name and temperature. The `chat` object, tools list, and prompt template are combined to generate `AgentExecutor`, which operates as the AI travel agent.

The agent with history, `agent_with_chat_history`, is established through `RunnableWithMessageHistory` with chat history (`MongoDBChatMessageHistory`). This action enables it to maintain a complete conversation history via Azure Cosmos DB.

#### Prompt

The LLM prompt initially began with the simple statement "You are a helpful and friendly travel assistant for a cruise company." However, testing showed that you could obtain more consistent results by including the instruction "Answer travel questions to the best of your ability, providing only relevant information. To book a cruise, capturing the person's name is essential." The results appear in HTML format to enhance the visual appeal of the web interface.

#### Agent tools

[Tools](#what-are-ai-agents) are interfaces that an agent can use to interact with the world, often through function calling.

When you're creating an agent, you must furnish it with a set of tools that it can use. The `@tool` decorator offers the most straightforward approach to defining a custom tool.

By default, the decorator uses the function name as the tool name, although you can replace it by providing a string as the first argument. The decorator uses the function's docstring as the tool's description, so it requires the provisioning of a docstring.

Here are the contents of *service/TravelAgentTools.py*:

```python
from langchain_core.tools import tool
from langchain.docstore.document import Document
from data.mongodb import travel
from model.travel import Ship


@tool
def vacation_lookup(input:str) -> list[Document]:
    """find information on vacations and trips"""
    ships: list[Ship] = travel.similarity_search(input)
    content = ""

    for ship in ships:
        content += f" Cruise ship {ship.name}  description: {ship.description} with amenities {'/n-'.join(ship.amenities)} "

    return content

@tool
def itinerary_lookup(ship_name:str) -> str:
    """find ship itinerary, cruise packages and destinations by ship name"""
    it = travel.itnerary_search(ship_name)
    results = ""

    for i in it:
        results += f" Cruise Package {i.Name} room prices: {'/n-'.join(i.Rooms)} schedule: {'/n-'.join(i.Schedule)}"

    return results


@tool
def book_cruise(package_name:str, passenger_name:str, room: str )-> str:
    """book cruise using package name and passenger name and room """
    print(f"Package: {package_name} passenger: {passenger_name} room: {room}")

    # LLM defaults empty name to John Doe 
    if passenger_name == "John Doe":
        return "In order to book a cruise I need to know your name."
    else:
        if room == '':
            return "which room would you like to book"            
        return "Cruise has been booked, ref number is 343242"
```

The *TravelAgentTools.py* file defines three tools:

- `vacation_lookup` conducts a vector search against Azure Cosmos DB. It uses `similarity_search` to retrieve relevant travel-related material.
- `itinerary_lookup` retrieves cruise package details and schedules for a specified cruise ship.
- `book_cruise` books a cruise package for a passenger.

Specific instructions ("In order to book a cruise I need to know your name") might be necessary to ensure the capture of the passenger's name and room number for booking the cruise package, even though you included such instructions in the LLM prompt.

#### AI agent

The fundamental concept that underlies agents is to use a language model for selecting a sequence of actions to execute.

Here are the contents of *service/TravelAgent.py*:

```python
from .init import agent_with_chat_history
from model.prompt import PromptResponse
import time
from dotenv import load_dotenv

load_dotenv(override=False)


def agent_chat(input:str, session_id:str)->str:

    start_time = time.time()

    results=agent_with_chat_history.invoke(
    {"input": input},
    config={"configurable": {"session_id": session_id}},
    )

    return  PromptResponse(text=results["output"],ResponseSeconds=(time.time() - start_time))
```

The *TravelAgent.py* file is straightforward, because `agent_with_chat_history` and its dependencies (tools, prompt, and LLM) are initialized and configured in the *init.py* file. This file calls the agent by using the input received from the user, along with the session ID for conversation memory. Afterward, `PromptResponse` (model/prompt) is returned with the agent's output and response time.

## AI agent integration with the React user interface

With the successful loading of the data and accessibility of the AI agent through the API, you can now complete the solution by establishing a web user interface (by using React) for your travel website. Using the capabilities of React helps illustrate the seamless integration of the AI agent into a travel site. This integration enhances the user experience with a conversational travel assistant for inquiries and bookings.

### Set up the environment for React

Install Node.js and the dependencies before testing the React interface.

Run the following command from the *web* directory to perform a clean installation of project dependencies. The installation might take some time.

```javascript
    npm ci
```

Next, create a file named *.env* within the *web* directory to facilitate the storage of environment variables. Include the following details in the newly created *.env* file:

`REACT_APP_API_HOST=http://127.0.0.1:8000`

Now, run the following command from the *web* directory to initiate the React web user interface:

```javascript
    npm start
```

Running the previous command opens the React web application.

### Walk through the React web interface

The web project of the GitHub repository is a straightforward application to facilitate user interaction with the AI agent. The primary components required to converse with the agent are *TravelAgent.js* and *ChatLayout.js*. The *Main.js* file serves as the central module or user landing page.

:::image type="content" source="media/gen-ai/ai-agent/main.png" lightbox="media/gen-ai/ai-agent/main.png" alt-text="Screenshot of the React JavaScript web interface.":::

#### Main

The main component serves as the central manager of the application. It acts as the designated entry point for routing. Within the render function, it produces JSX code to delineate the main page layout. This layout encompasses placeholder elements for the application, such as logos and links, a section that houses the travel agent component, and a footer that contains a sample disclaimer about the application's nature.

Here are the contents of *main.js*:

```javascript
    import React, {  Component } from 'react'
import { Stack, Link, Paper } from '@mui/material'
import TravelAgent from './TripPlanning/TravelAgent'

import './Main.css'

class Main extends Component {
  constructor() {
    super()

  }

  render() {
    return (
      <div className="Main">
        <div className="Main-Header">
          <Stack direction="row" spacing={5}>
            <img src="/mainlogo.png" alt="Logo" height={'120px'} />
            <Link
              href="#"
              sx={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}
              underline="hover"
            >
              Ships
            </Link>
            <Link
              href="#"
              sx={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}
              underline="hover"
            >
              Destinations
            </Link>
          </Stack>
        </div>
        <div className="Main-Body">
          <div className="Main-Content">
            <Paper elevation={3} sx={{p:1}} >
            <Stack
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
              spacing={2}
            >
              
                <Link href="#">
                  <img
                    src={require('./images/destinations.png')} width={'400px'} />
                </Link>
                <TravelAgent ></TravelAgent>
                <Link href="#">
                  <img
                    src={require('./images/ships.png')} width={'400px'} />
                </Link>
              
              </Stack>
              </Paper>
          </div>
        </div>
        <div className="Main-Footer">
          <b>Disclaimer: Sample Application</b>
          <br />
          Please note that this sample application is provided for demonstration
          purposes only and should not be used in production environments
          without proper validation and testing.
        </div>
      </div>
    )
  }
}

export default Main
```

#### Travel agent

The travel agent component has a straightforward purpose: capturing user inputs and displaying responses. It plays a key role in managing the integration with the back-end AI agent, primarily by capturing sessions and forwarding user prompts to the FastAPI service. The resulting responses are stored in an array for display, facilitated by the chat layout component.

Here are the contents of *TripPlanning/TravelAgent.js*:

```javascript
import React, { useState, useEffect } from 'react'
import { Button, Box, Link, Stack, TextField } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { Dialog, DialogContent } from '@mui/material'
import ChatLayout from './ChatLayout'
import './TravelAgent.css'

export default function TravelAgent() {
  const [open, setOpen] = React.useState(false)
  const [session, setSession] = useState('')
  const [chatPrompt, setChatPrompt] = useState(
    'I want to take a relaxing vacation.',
  )
  const [message, setMessage] = useState([
    {
      message: 'Hello, how can I assist you today?',
      direction: 'left',
      bg: '#E7FAEC',
    },
  ])

  const handlePrompt = (prompt) => {
    setChatPrompt('')
    setMessage((message) => [
      ...message,
      { message: prompt, direction: 'right', bg: '#E7F4FA' },
    ])
    console.log(session)
    fetch(process.env.REACT_APP_API_HOST + '/agent/agent_chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: prompt, session_id: session }),
    })
      .then((response) => response.json())
      .then((res) => {
        setMessage((message) => [
          ...message,
          { message: res.text, direction: 'left', bg: '#E7FAEC' },
        ])
      })
  }

  const handleSession = () => {
    fetch(process.env.REACT_APP_API_HOST + '/session/')
      .then((response) => response.json())
      .then((res) => {
        setSession(res.session_id)
      })
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = (value) => {
    setOpen(false)
  }

  useEffect(() => {
    if (session === '') handleSession()
  }, [])

  return (
    <Box>
      <Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth="true">
        <DialogContent>
          <Stack>
            <Box sx={{ height: '500px' }}>
              <div className="AgentArea">
                <ChatLayout messages={message} />
              </div>
            </Box>
            <Stack direction="row" spacing={0}>
              <TextField
                sx={{ width: '80%' }}
                variant="outlined"
                label="Message"
                helperText="Chat with AI Travel Agent"
                defaultValue="I want to take a relaxing vacation."
                value={chatPrompt}
                onChange={(event) => setChatPrompt(event.target.value)}
              ></TextField>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                sx={{ mb: 3, ml: 3, mt: 1 }}
                onClick={(event) => handlePrompt(chatPrompt)}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
      <Link href="#" onClick={() => handleClickOpen()}>
        <img src={require('.././images/planvoyage.png')} width={'400px'} />
      </Link>
    </Box>
  )
}
```

Select **Effortlessly plan your voyage** to open the travel assistant.

#### Chat layout

The chat layout component oversees the arrangement of the chat. It systematically processes the chat messages and implements the formatting specified in the `message` JSON object.

Here are the contents of *TripPlanning/ChatLayout.py*:

```javascript
import React from 'react'
import {  Box, Stack } from '@mui/material'
import parse from 'html-react-parser'
import './ChatLayout.css'

export default function ChatLayout(messages) {
  return (
    <Stack direction="column" spacing="1">
      {messages.messages.map((obj, i = 0) => (
        <div className="bubbleContainer" key={i}>
          <Box
            key={i++}
            className="bubble"
            sx={{ float: obj.direction, fontSize: '10pt', background: obj.bg }}
          >
            <div>{parse(obj.message)}</div>
          </Box>
        </div>
      ))}
    </Stack>
  )
}
```

User prompts are on the right side and colored blue. Responses from the AI travel agent are on the left side and colored green. As the following image shows, the HTML-formatted responses are accounted for in the conversation.

:::image type="content" source="media/gen-ai/ai-agent/chat-screenshot.png" lightbox="media/gen-ai/ai-agent/chat-screenshot.png" alt-text="Screenshot of a chat.":::

When your AI agent is ready to go into production, you can use semantic caching to improve query performance by 80% and to reduce LLM inference and API call costs. To implement semantic caching, see [this post on the Stochastic Coder blog](https://stochasticcoder.com/2024/03/22/improve-llm-performance-using-semantic-cache-with-cosmos-db/).

:::image type="content" source="media/gen-ai/ai-agent/semantic-caching.png" lightbox="media/gen-ai/ai-agent/semantic-caching.png" alt-text="Diagram of semantic caching.":::

## Related content

- [30-day free trial without an Azure subscription](https://azure.microsoft.com/try/cosmosdb/)
- [90-day free trial and up to $6,000 in throughput credits with Azure AI Advantage](ai-advantage.md)
- [Azure Cosmos DB lifetime free tier](free-tier.md)
