---
title: Microsoft Discovery Agent Concepts
description: Learn about Microsoft Discovery agents, the AI assistants that execute scientific research tasks with tool-augmented reasoning and multi-agent orchestration across Microsoft Discovery and Discovery app.
author: leijgao
ms.author: leijiagao
ms.service: azure
ms.topic: concept-article
ms.date: 05/29/2026

#CustomerIntent: As a researcher or scientist, I want to understand what Microsoft Discovery agents are so that I can build AI-powered scientific agents and workflows.
---

# Discovery agents

Microsoft Discovery agents are AI assistants that execute scientific research tasks on your behalf within the Discovery platform. Discovery agents build on [Foundry Agent Service](/azure/foundry/agents/concepts/runtime-components). They add scientific research features to conversational AI. These features include reasoning loops, agent teams, research tools, and knowledge bases.

Agents serve as the fundamental building blocks for automating complex scientific workflows. You define their behavior through natural language instructions, which enables sophisticated reasoning and decision-making without writing code. You create and manage agents through Discovery Studio, the primary authoring interface.

## Agent evolution from V1 to V2

Discovery Agent V2 represents a fundamental redesign of agent architecture. The evolution addresses key limitations while aligning with Foundry Agent Service.

### Key architectural changes

| Aspect | Agent V1 | Agent V2 |
| --- | --- | --- |
| Agent management | Azure Resource Manager resources on control plane | Data-plane resources via Discovery APIs |
| Workflow model | State machine with events and transitions | Action flow with explicit control structures |
| Agent selection | Fixed entry point per project | Per-message `@AgentName` routing |
| Model deployment | Platform-created with no configuration | Workspace-level shared deployments |
| Authoring | YAML files and Resource Manager templates | Discovery Studio UI with YAML export |
| Agent invocation | By reference in state machine | By name in workflow actions |

### Benefits of V2

Agent V2 addresses several limitations of the previous architecture:

- **Flexible workflows**: V1 required defining all states upfront with rigid event-based transitions. V2's action flow model supports conditional logic, goto statements, and nested branching for more natural workflow expression.
- **Data-plane management**: Moving from Resource Manager resources to data-plane APIs enables faster iteration and simpler agent lifecycle management.
- **Dynamic routing**: Unlike V1's fixed entry points, V2 lets you address any agent directly via `@AgentName` tags in conversations.

## Agent architecture

Discovery agents build on Foundry Agent Service with scientific discovery extensions.

:::image type="content" source="media/agent-architecture.jpg" alt-text="Diagram that shows the Discovery Agent architecture." lightbox="media/agent-architecture.jpg":::

### Key architectural principles

- **Immutable versioning**: Every agent update creates a new version. Previous versions are preserved for audit only the latest version is used in your project.
- **Project binding**: Agents reference a `projectResourceId` at creation. Projects don't maintain agent lists. Agents declare their project affiliation.
- **Workspace-level models**: All agents in project share model deployments defined at the workspace level.

## Authoring in Discovery Studio

Discovery Studio provides the primary interface for creating and managing agents through visual configuration.

#### Agent creation workflow

- **Create a Discovery project**: Create a project that scopes all agents.
- **Deploy chat models**: Deploy custom models as Resource Manager resources at the workspace level by using the Azure CLI, Bicep, or Resource Manager templates.
- **Create prompt agents**: Configure name, instructions, model (by deployment name), tools, and knowledge bases through forms.
- **Test interactively**: Use the Foundry playground or test through Discovery Studio chat by using `@AgentName` tags.
- **Iterate**: Create a new immutable version with full history every time that you save.

## Multi-agent orchestration

For scenarios that require multiple agents working together, Discovery uses the [Discovery Engine](concept-discovery-engine.md) for dynamic, autonomous orchestration. The Discovery Engine plans work, delegates to specialized agents, monitors progress, and adapts when results differ from expectations. This approach replaces static workflow definitions with intelligent, adaptive coordination.

> [!NOTE]
> Workflow agents (static action-flow orchestration) are deprecated. Use the Discovery Engine for multi-agent orchestration. The Discovery Engine provides dynamic agent selection, automatic error recovery, and adaptive planning that static workflows can't offer. For more information on the Discovery Engine, see the [Discovery Engine overview](concept-discovery-engine.md).

## Agent types

Discovery supports prompt agents as the primary agent type. Prompt agents are best for focused tasks such as planning, summarization, and tool use. For multi-step orchestration involving multiple agents, use the Discovery Engine.

For more information about agent types and component models, see [Agent types in Discovery](concept-discovery-agent-types.md).

## Discovery app and Discovery

Discovery is available in two offerings that serve different stages of the agent development lifecycle.

### Discovery (cloud service)

Discovery is the managed cloud platform for team collaboration and production workloads. It provides:

- Shared workspaces and projects for team-based research.
- Managed model deployments at the workspace level.
- Discovery Engine for autonomous multi-agent orchestration.
- Enterprise-grade security, compliance, and governance.
- Shared bookshelves and knowledge bases across teams.

### Discovery app

Discovery app is a local experience built on top of GitHub Copilot that enables individual users to create, test, and iterate on custom agents. It provides:

- **Custom agent authoring**: [GitHub Copilot documentation](https://docs.github.com/copilot) shows you how to create agents.
- **Local knowledge base**: Local version of bookshelf allows agents to retrieve private knowledge for grounded responses.
- **Multi-agent orchestration**: Discovery app supports the Discovery Engine for autonomous multi-agent orchestration and skill-based orchestration where skills coordinate multiple agents.
- **Individual experimentation**: Personal environment is available for rapid prototyping and validation.

### Comparison

| Area | Discovery app | Microsoft Discovery |
| --- | --- | --- |
| Audience | Individual users. | Teams and organizations |
| Runtime | Local and built on GitHub Copilot. | Managed cloud service |
| Agent authoring | Custom agents via Copilot skills. | Prompt agents via Discovery Studio |
| Knowledge | Local bookshelf for private knowledge. | Shared bookshelves across teams |
| Models | Flexible and supports non-Microsoft model endpoints. | Workspace-level managed deployments |
| Collaboration | Individual use. | Team collaboration and sharing |
| Orchestration | Discovery Engine and skill-based orchestration. | Discovery Engine for multi-agent orchestration |

### Graduation path

Discovery app serves as the starting point where individual users experiment with and validate agents, tools, and knowledge configurations. After local validation, you can adapt and promote agent designs, prompts, and tool configurations to Discovery for team collaboration and production use.

## Related content

- [Agent types in Discovery](concept-discovery-agent-types.md)
- [Discovery Engine overview](concept-discovery-engine.md)
- [Foundry Agent Service](/azure/foundry/agents/concepts/runtime-components)
- [Foundry model catalog](https://ai.azure.com/catalog/models)
