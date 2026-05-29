---
title: Microsoft Discovery Agent concepts
description: Learn about Discovery Agents, AI assistants that execute scientific research tasks with tool-augmented reasoning and multi-agent orchestration.
author: leijgao
ms.author: leijiagao
ms.service: azure
ms.topic: concept-article
ms.date: 03/10/2026

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
4. **Create workflow agents**—Use the visual workflow builder or YAML editor to define action flows
5. **Test interactively**—Use the Foundry playground or test through Discovery Studio chat using `@AgentName` tags
6. **Iterate**—Each save creates a new immutable version with full history

## Agent types

Microsoft Discovery supports prompt agents and workflow agents. Prompt agents are best for focused tasks such as planning, summarization, and tool use. Workflow agents orchestrate prompt agents through action flows for multi-step or human-in-the-loop execution.

For details about agent types, component models, and orchestration patterns, see [Agent types in Microsoft Discovery](concept-discovery-agent-types.md).

## Related content

- [Agent types in Microsoft Discovery](concept-discovery-agent-types.md)
- [Microsoft Foundry Agent Service](/azure/foundry/agents/concepts/runtime-components)
- [Microsoft Foundry workflows](/azure/foundry/agents/concepts/workflow)
- [Foundry model catalog](https://ai.azure.com/catalog/models)
