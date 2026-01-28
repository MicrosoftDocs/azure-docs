---
title: Agent registry in Azure API Center
description: "Overview of the agent registry for discovering, registering, and managing A2A agents in API Center."


ms.service: azure-api-center
ms.topic: overview
ms.date: 11/03/2025
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot

#customer intent: As an API platform owner, I want to understand how to use the agent registry to discover, register, and manage AI agents.

---

# Agent registry in Azure API Center

Azure API Center provides a centralized platform for discovering, registering, and managing AI agents. It supports first-party and third-party agents, integrates with API Management for private endpoints, and stores customizable metadata to improve discoverability and governance.

## Key features

**Centralized Discovery and Management**: A single location to register and manage both first-party and third-party AI agents, including those exposed in API Management or hosted externally.

**Enhanced Discoverability**: Enables developers and other stakeholders to easily find and access approved AI agents through a curated catalog, either via the built-in API Center portal or a custom UI.

**Governance and Security**: Addresses shadow IT and uncontrolled AI tool adoption by providing a governed channel for accessing AI agents, improving security and compliance.

**Integration with API Management**: AI agents can be placed behind an API Management gateway for private endpoints, enhanced security, and controlled access.

**Customizable Metadata**: Organizations can define and store relevant metadata for each registered AI agent, facilitating filtering and searching.

## Register an AI agent

You can register AI agents in API Center similar to how you register other APIs. During registration, specify the API type as **A2A** and fill in details for **Agent Card**, **Agent Skills**, and **Agent Capabilities**.  

For detailed steps, see [Register agent](register-manage-agents.md#register-agent).

## Manage your AI agent

After registering an A2A agent, you can update its metadata, add skills, configure capabilities, and manage provider information. Skills define the specific actions your agent can perform, making it discoverable and invokable by other agents.

For step-by-step instructions, see [Manage agents in Azure API Center](register-manage-agents.md).

## View dependency maps for A2A agents (preview)

API platform administrators can now create relationships feature using the dependency tracker feature. This capability allows API Center to identify the right agent to call and enable communication across agents in an enterprise. 

For detailed steps, see [Track API resource dependencies in your API center](track-resource-dependencies.md).
