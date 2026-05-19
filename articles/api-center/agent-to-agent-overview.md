---
title: Agent registry in Azure API Center
description: Overview of the agent registry for discovering, registering, and managing A2A agents.
ms.service: azure-api-center
ms.topic: overview
ms.date: 02/24/2026
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot

# Customer intent: As an API platform owner, I want to understand how to use the agent registry to discover, register, and manage AI agents.
---

# Agent registry in Azure API Center

Azure API Center provides a centralized platform for discovering, registering, and managing AI agents across an organization. It supports both first-party and third-party agents, integrates with Azure API Management for secure access, and enables organizations to improve governance, discoverability, and operational control of AI-driven systems.

---

## Key features

### Centralized discovery and management

API Center provides a single location to register and manage AI agents, including:

- First-party enterprise agents
- Third-party AI agents
- Agents exposed through Azure API Management
- Externally hosted agents

This centralized registry improves visibility and simplifies operational management.

---

### Enhanced discoverability

Developers and platform teams can easily discover approved AI agents through:

- The built-in Azure API Center portal
- Custom developer portals or internal UIs
- Metadata-based filtering and search

This helps teams quickly identify and use the right agents for specific business scenarios.

---

### Governance and security

The agent registry helps organizations reduce shadow IT and unmanaged AI adoption by providing:

- A governed catalog of approved AI agents
- Centralized visibility into agent usage
- Improved compliance and security oversight
- Controlled enterprise-wide access patterns

This creates a more secure and manageable AI ecosystem.

---

### Integration with API Management

AI agents can be integrated with Azure API Management to enable:

- Private endpoints
- Secure gateway access
- Authentication and authorization policies
- Traffic control and observability

A2A agent APIs published in a connected API Management instance automatically synchronize with API Center.

---

### Customizable metadata

Organizations can define and store custom metadata for AI agents, including:

- Provider details
- Capabilities
- Skills
- Ownership information
- Environment classification

This metadata improves discoverability, governance, and lifecycle management.

---

## Register an AI agent

You can register AI agents in API Center similarly to other assets such as APIs and MCP servers.

During registration, provide details for:

- **Agent Card**
- **Agent Skills**
- **Agent Capabilities**

These details help make the agent discoverable and usable across the organization.

For detailed instructions, see [Register agent](register-manage-agents.md#register-agent).

---

## Manage your AI agent

After registering an A2A agent, you can:

- Update metadata
- Add or modify skills
- Configure capabilities
- Manage provider information
- Maintain governance details

Skills define the actions an agent can perform, enabling other agents and applications to discover and invoke them effectively.

For more information, see [Manage agents in Azure API Center](register-manage-agents.md).

---

## View dependency maps for A2A agents (Preview)

API platform administrators can use the dependency tracking feature to create and visualize relationships between agents and APIs.

This capability helps API Center:

- Identify the correct agent for a request
- Enable communication across enterprise agents
- Visualize dependencies between resources
- Improve operational understanding of agent ecosystems

For detailed steps, see [Track API resource dependencies in your API center](track-resource-dependencies.md).
