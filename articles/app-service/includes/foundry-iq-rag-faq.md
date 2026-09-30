---
author: cephalin
ms.author: cephalin
ms.date: 08/11/2026
ms.service: azure-app-service
ms.topic: include
---

## Frequently asked questions

- [How do I add retrieval augmented generation (RAG) to the Foundry agent?](#how-do-i-add-retrieval-augmented-generation-rag-to-the-foundry-agent)

### How do I add retrieval augmented generation (RAG) to the Foundry agent?

This guidance applies to the **Foundry Agent Service** path in this tutorial. It doesn't change the LangGraph, Semantic Kernel, or Microsoft Agent Framework implementations shown in the other tab.

Create or select a Foundry IQ knowledge base, and then [connect the knowledge base to the Foundry Agent Service agent](/azure/foundry/agents/how-to/foundry-iq-connect). The connection is exposed to the agent as a managed MCP knowledge tool.

The App Service code continues to invoke the same agent by name through its existing Foundry client and `agent_reference`. The web app doesn't need a direct Azure AI Search integration or its own MCP client. If the UI displays sources, process the citation annotations returned by the agent.