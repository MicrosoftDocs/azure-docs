---
title: Microsoft Discovery Agent concepts
description: Learn about Discovery Agents, AI assistants that execute scientific research tasks with tool-augmented reasoning and multi-agent orchestration across Microsoft Discovery and Discovery app.
author: leijgao
ms.author: leijiagao
ms.service: azure
ms.topic: concept-article
ms.date: 05/29/2026

#CustomerIntent: As a researcher or scientist, I want to understand what Discovery Agents are so that I can build AI-powered scientific agents and workflows.
---

# Microsoft Discovery agents

Microsoft Discovery Agents are AI assistants that execute scientific research tasks on your behalf within the Microsoft Discovery platform. Discovery agents build on [Microsoft Foundry Agent Service](/azure/foundry/agents/concepts/runtime-components). They add scientific research features to conversational AI. These features include reasoning loops, agent teams, research tools, and knowledge bases.

Agents serve as the fundamental building blocks for automating complex scientific workflows. You define their behavior through natural language instructions, enabling sophisticated reasoning and decision-making without writing code. You create and manage agents through **Discovery Studio**, the primary authoring interface.

## Agent evolution from V1 to V2

Discovery Agent V2 represents a fundamental redesign of agent architecture. The evolution addresses key limitations while aligning with Microsoft Foundry Agent Service.

### Key architectural changes

| Aspect | Agent V1 | Agent V2 |
| --- | --- | --- |
| **Agent management** | ARM resources on control plane | Data-plane resources via Discovery APIs |
| **Workflow model** | State machine with events and transitions | Action flow with explicit control structures |
| **Agent selection** | Fixed entry point per project | Per-message `@AgentName` routing |
| **Workflow as resource** | Separate resource type | Workflows are agents with `kind: workflow` |
| **Model deployment** | Platform-created with no configuration | Workspace-level shared deployments |
| **Authoring** | YAML files and ARM templates | Discovery Studio UI with YAML export |
| **Agent invocation** | By reference in state machine | By name in workflow actions |

### Benefits of V2

Agent V2 addresses several limitations of the previous architecture:

- **Flexible workflows**—V1 required defining all states upfront with rigid event-based transitions. V2's action flow model supports conditional logic, goto statements, and nested branching for more natural workflow expression.

- **Data-plane management**—Moving from ARM resources to data-plane APIs enables faster iteration and simpler agent lifecycle management.

- **Dynamic routing**—Unlike V1's fixed entry points, V2 lets you address any agent directly via `@AgentName` tags in conversations.

## Agent architecture

Discovery agents build on Microsoft Foundry Agent Service with scientific discovery extensions:

:::image type="content" source="media/agent-architecture.jpg" alt-text="Diagram showing the Discovery Agent architecture." lightbox="media/agent-architecture.jpg":::

### Key architectural principles

- **Immutable versioning**—Every agent update creates a new version. Previous versions are preserved for audit only the latest version is used in your project.

- **Project binding**—Agents reference a `projectResourceId` at creation. Projects don't maintain agent lists; agents declare their project affiliation.

- **Workspace-level models**—All agents in project share model deployments defined at the workspace level.

## Authoring in Discovery Studio

Discovery Studio provides the primary interface for creating and managing agents through visual configuration.

**Agent creation workflow:**

1. **Create a Discovery project**—All agents are scoped to a project
2. **Deploy chat models**—Deploy custom models as ARM resources at the workspace level using Azure CLI, Bicep, or ARM templates
3. **Create prompt agents**—Configure name, instructions, model (by deployment name), tools, and knowledge bases through forms
4. **Test interactively**—Use the Foundry playground or test through Discovery Studio chat using `@AgentName` tags
5. **Iterate**—Each save creates a new immutable version with full history

## Multi-agent orchestration

For scenarios that require multiple agents working together, Microsoft Discovery uses the [Discovery Engine](concept-discovery-engine.md) for dynamic, autonomous orchestration. The Discovery Engine plans work, delegates to specialized agents, monitors progress, and adapts when results differ from expectations. This approach replaces static workflow definitions with intelligent, adaptive coordination.

> [!NOTE]
> Workflow agents (static action-flow orchestration) are deprecated. Use the Discovery Engine for multi-agent orchestration. The Discovery Engine provides dynamic agent selection, automatic error recovery, and adaptive planning that static workflows cannot offer. For details on the Discovery Engine, see [Discovery Engine overview](concept-discovery-engine.md).

## Agent types

Microsoft Discovery supports prompt agents as the primary agent type. Prompt agents are best for focused tasks such as planning, summarization, and tool use. For multi-step orchestration involving multiple agents, use the Discovery Engine.

For details about agent types and component models, see [Agent types in Microsoft Discovery](concept-discovery-agent-types.md).

## Discovery app and Microsoft Discovery

Microsoft Discovery is available in two offerings that serve different stages of the agent development lifecycle.

### Microsoft Discovery (cloud service)

Microsoft Discovery is the managed cloud platform for team collaboration and production workloads. It provides:

- Shared workspaces and projects for team-based research
- Managed model deployments at the workspace level
- Discovery Engine for autonomous multi-agent orchestration
- Enterprise-grade security, compliance, and governance
- Shared bookshelves and knowledge bases across teams

### Discovery app

Discovery app is a local experience built on top of GitHub Copilot that enables individual users to create, test, and iterate on custom agents. It provides:

- **Custom agent authoring**—Create agents using skills following [GitHub Copilot documentation](https://docs.github.com/copilot)
- **Local knowledge base**—A local version of bookshelf that allows agents to retrieve private knowledge for grounded responses
- **Multi-agent orchestration**—Discovery app supports the Discovery Engine for autonomous multi-agent orchestration, as well as skill-based orchestration where skills coordinate multiple agents
- **Individual experimentation**—A personal environment for rapid prototyping and validation

### Comparison

| Area | Discovery app | Microsoft Discovery |
| --- | --- | --- |
| **Audience** | Individual users | Teams and organizations |
| **Runtime** | Local, built on GitHub Copilot | Managed cloud service |
| **Agent authoring** | Custom agents via Copilot skills | Prompt agents via Discovery Studio |
| **Knowledge** | Local bookshelf for private knowledge | Shared bookshelves across teams |
| **Models** | Flexible, supports third-party model endpoints (BYOM) | Workspace-level managed deployments |
| **Collaboration** | Individual use | Team collaboration and sharing |
| **Orchestration** | Discovery Engine + skill-based orchestration | Discovery Engine for multi-agent orchestration |

### Graduation path

Discovery app serves as the starting point where individual users experiment with and validate agents, tools, and knowledge configurations. Once validated locally, agent designs, prompts, and tool configurations can be adapted and promoted to Microsoft Discovery for team collaboration and production use.

## Related content

- [Agent types in Microsoft Discovery](concept-discovery-agent-types.md)
- [Discovery Engine overview](concept-discovery-engine.md)
- [Microsoft Foundry Agent Service](/azure/foundry/agents/concepts/runtime-components)
- [Foundry model catalog](https://ai.azure.com/catalog/models)
