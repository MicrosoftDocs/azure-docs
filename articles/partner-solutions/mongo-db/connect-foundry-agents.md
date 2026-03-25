---
title: Connect Microsoft Foundry Agents to MongoDB Atlas
description: Learn how to connect Microsoft Foundry Agents to MongoDB Atlas using the MongoDB MCP Server for data retrieval and vector search.
ms.topic: how-to
ms.date: 03/20/2026
---

# Connect Microsoft Foundry agents to MongoDB Atlas

This article shows you how to connect Microsoft Foundry agents that can query and retrieve data from MongoDB Atlas using the MongoDB MCP Server.

## Architecture overview

At a high level, the integration includes these components:

- **Microsoft Foundry Agent** – Orchestrates reasoning and tool usage.
- **MongoDB MCP Server** – Exposes MongoDB Atlas operations (vector search, aggregation) as agent tools.
- **MongoDB Atlas** – Stores operational and vectorized data.
- **Azure hosting** – Hosts the MCP Server in Azure Container Apps.

The Foundry agent calls the MCP Server over HTTPS at query time, and the MCP Server executes operations against your Atlas cluster. Your data remains in MongoDB Atlas.

## Prerequisites

Before you begin, ensure you have:

- An Azure subscription with access to a Microsoft Foundry project.
- A MongoDB Atlas account with a project and cluster.
- A vector search index created in MongoDB Atlas (for RAG scenarios).
- Permission to deploy services to Azure (for MCP Server hosting).

## Prepare MongoDB Atlas

1. Create or select a MongoDB Atlas cluster.
1. Load your dataset (for example, sample Airbnb or domain-specific data).
1. Create a vector search index on the target collection.

## Deploy the MongoDB MCP Server

The [MongoDB MCP Server](https://github.com/mongodb-js/mongodb-mcp-server) acts as a bridge between Foundry agents and MongoDB Atlas.

1. Deploy the MCP Server to Azure Container Apps or another Azure-hosted environment. For details on hosting, see the [MongoDB MCP Server Azure deployment guide](https://github.com/mongodb-js/mongodb-mcp-server/blob/main/deploy/azure/README.md).
1. Configure the server with:
   - MongoDB Atlas connection details
   - Enabled tools (vector search, aggregation)
1. Expose a remote HTTPS endpoint.

## Create an agent in Microsoft Foundry

1. Open the Microsoft Foundry portal.
1. Create a new agent, provide system instructions, and choose a deployed Foundry model.
1. Go to **Tools** > **MongoDB MCP Server** > **Connect**.
1. Paste the MCP Server remote URL.
1. Save the agent configuration.

After you add the MCP Server, the agent can invoke MongoDB operations through the MCP tool during reasoning.

## Deploy the embedding endpoint

In retrieval-augmented generation (RAG) scenarios, Foundry agents need to generate embeddings for user queries at runtime before invoking MongoDB Atlas Vector Search. You expose an embedding generation function as an OpenAPI-based tool that the agent calls during reasoning.

Define the embedding function with the following OpenAPI specification:

```yaml
openapi: 3.0.1
info:
  title: Embedding Service API
  version: "1.0"
paths:
  /embeddings:
    post:
      summary: Generate embeddings for input text
      operationId: generateEmbeddings
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                input:
                  type: string
                  description: Text to embed
      responses:
        '200':
          description: Embedding vector
          content:
            application/json:
              schema:
                type: object
                properties:
                  embedding:
                    type: array
                    items:
                      type: number
```

The implementation behind this API typically calls a Foundry-hosted embedding model (for example, `text-embedding-3-large`) and returns the vector as JSON.

## Configure the agent for vector search

1. In the agent tools, add a new OpenAPI tool.
1. Paste the OpenAPI specification from the [Deploy the embedding endpoint](#deploy-the-embedding-endpoint) step.
1. In the agent instructions, guide the agent to invoke this function for vector search use cases.
1. Save the agent.

Once registered, the agent can invoke `generateEmbeddings` as part of its reasoning chain.

## Test retrieval and responses

Run prompts that require:

- Semantic search over MongoDB data
- Aggregation queries
- Context-aware responses grounded in Atlas data

Successful responses confirm end-to-end connectivity between Foundry, the MCP Server, and MongoDB Atlas.

## Next steps

- [MongoDB MCP Server](https://github.com/mongodb-js/mongodb-mcp-server)
- [What is MongoDB Atlas?](overview.md)
- [Manage MongoDB Atlas](manage.md)
