---
title: Agent Types in Microsoft Discovery
description: Learn about prompt agents in Microsoft Discovery and custom agents in Discovery app, including when to use each type and how they're composed.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: concept-article
ms.date: 05/29/2026

#CustomerIntent: As a researcher or scientist, I want to understand the different Microsoft Discovery agent types so that I can choose the right agent pattern for my scenario.
---

# Agent types in Discovery

Microsoft Discovery supports agents across two offerings. Discovery is a managed cloud platform. Discovery app is a local experience built on GitHub Copilot. This article describes the agent types that are available in each offering and helps you choose the right approach for your scenario.

## Discovery (cloud service) agents

### Prompt agent

A prompt agent wraps a single large language model invocation with system instructions, structured inputs, tools, and knowledge bases. Prompt agents handle specialized tasks and can operate independently or the [Discovery Engine](concept-discovery-engine.md) can orchestrate the agents.

Use prompt agents for:

- **Specialized research**: Operate specific scientific tools or domain models, such as molecular dynamics simulations.
- **Planning and coordination**: Generate research plans, make routing decisions, or summarize results.
- **Data operations**: Interact with storage assets, run computations, and produce scientific outputs.

### Prompt agent components

Every prompt agent consists of core components that you configure through Discovery Studio.

#### Name and description

The agent name serves as a unique identifier within your project scope. You use this name to:

- **Invoke agents directly**: Enter `@AgentName` in chat to route messages to specific agents.
- **Reference in orchestration**: The Discovery Engine reference prompts agents by name.
- **Discover capabilities**: Names appear in Discovery Studio and help routing agents make delegation decisions.

The description provides a short summary of the agent's purpose, which is visible in the UI and used by other agents to understand capabilities.

#### Instructions

Instructions are natural language prompts that define your agent's behavior, persona, and reasoning approach. This component determines how the agent interprets inputs, uses tools, and generates outputs.

Effective instructions should:

- Specify the agent's role and boundaries clearly.
- Describe the expected output format.
- Include relevant domain context and constraints.
- Reference workflow context when operating as part of a team.
- Stay under 32,000 characters.

#### Model selection

The AI model powers your agent's reasoning. Discovery supports workspace-level model deployments shared across all project agents. GPT-5.4 is the recommended model for all Discovery agents and is available in all production regions.

GPT-5.2 provides robust capabilities for both tool-heavy operations and advanced reasoning tasks, including:

- Reliable tool execution for agents that frequently invoke tools, run computations, or call APIs.
- Enhanced reasoning for planning, summarization, literature review, and analysis tasks.
- Consistent performance across scientific workflows.

You can also deploy models from the [Microsoft Foundry model catalog](https://ai.azure.com/catalog/models) at the workspace level and reference them by deployment name. You can deploy models as Azure Resource Manager resources.

When you create agents, reference your chat model deployment by specifying the deployment name (for example, `my-gpt-4o-deployment`) rather than a resource ID. Discovery resolves deployment names at the workspace level, which makes them available to all agents within the project.

#### Response controls

Two parameters control model response characteristics for nonreasoning models:

- **Temperature (0–2)**: Uses lower values to produce deterministic outputs. Higher values increase creativity. Use `0` for routing and planning agents that require consistent behavior.
- **Top-P (0–1)**: Controls nucleus sampling diversity. Use lower values for precision tasks. Use higher values for exploratory or creative tasks.

#### Structured inputs

Structured inputs define typed parameters that your agent accepts from callers or workflows. Each input specifies:

- **Name**: Variable name referenced in instructions by using `{{variableName}}` syntax.
- **Description**: What the input provides is explained.
- **Required**: Whether the input must be supplied at invocation.
- **Default value**: Optional fallback when not provided.

When the Discovery Engine or other agents invoke prompt agents, they map variables to structured inputs through argument bindings.

#### Structured output

Configure agents to return structured JSON instead of freeform text. This capability is essential when outputs need programmatic parsing, such as:

- Router agents that return next agent selections.
- Critic agents that return evaluation scores.
- Data processing agents that return structured results.

Define the expected output schema by using the JSON Schema format.

#### Tools

Tools extend agent capabilities beyond language generation. Discovery supports several tool types.

| Tool type | Description | Configuration |
| --- | --- | --- |
| Discovery tools | Includes domain-specific scientific and data operation tools. | Discovery UI |
| Code Interpreter | Executes Python code with scientific libraries like RDKit. | Foundry UI |
| Model Context Protocol tools | Connects to Model Context Protocol servers for dynamic tool discovery. | Foundry UI |
| Built-in Foundry tools | Includes standard tools like file search and web search. | Foundry UI |
| Custom functions | Includes user-defined Azure Functions or API endpoints. | Foundry UI |

#### Knowledge bases

Knowledge bases provide retrieval-augmented grounding, which allows agents to access domain-specific information beyond the model's training data. Create knowledge bases at the subscription level and attach them to agents by reference. This capability helps agents answer questions with factual, current information grounded in your specific documents and datasets.

### Multi-agent orchestration with the Discovery Engine

For scenarios that require multiple agents to collaborate, use the [Discovery Engine](concept-discovery-engine.md). The Discovery Engine dynamically selects agents, plans execution, monitors progress, and adapts when results differ from expectations. This approach provides:

- Dynamic agent selection based on task requirements.
- Automatic error recovery and replanning.
- Continuous reasoning across long-running investigations.
- Adaptive coordination without predefined static sequences.

> [!NOTE]
> Workflow agents (static action-flow orchestration by using `kind: workflow`) are deprecated. The Discovery Engine provides superior multi-agent orchestration through dynamic, autonomous coordination. For migration guidance, see the Discovery Engine documentation.

## Discovery app agents

Discovery app is a local experience for the Discovery platform. It's built on GitHub Copilot, which allows individual users to create custom agents for experimentation and validation.

### Custom agents via Copilot skills

In Discovery app, you create agents by using skills you learn by following the [GitHub Copilot extensibility model](https://docs.github.com/copilot). This approach provides:

- **Skill-based authoring**: Define agent capabilities as skills by using GitHub Copilot documentation and patterns.
- **Local knowledge retrieval**: Attach a local bookshelf (knowledge base) so that agents can retrieve private knowledge for grounded responses.
- **Rapid iteration**: Test and refine agents locally before promoting to Discovery.

### Multi-agent orchestration in Discovery app

Discovery app supports two approaches for orchestrating multiple agents:

- **Discovery Engine**: Use the same autonomous orchestration engine that's available in Discovery. The Discovery Engine dynamically selects agents, plans execution, and adapts to results.
- **Skill-based orchestration**: Use skills to coordinate and orchestrate multiple agents. Skills can define orchestration logic that routes work between agents to enable flexible multi-agent patterns within the GitHub Copilot framework.

### When to use Discovery app agents

Discovery app agents are ideal for:

- Individual experimentation and prototyping.
- Validating agent designs before team deployment.
- Multi-agent orchestration by using Discovery Engine or skill-based coordination.
- Scenarios that require flexible model selection, including non-Microsoft endpoints.
- Private knowledge retrieval from local sources.

## Related content

- [Discovery agents](concept-discovery-agent.md)
- [Discovery Engine overview](concept-discovery-engine.md)
- [Foundry Agent Service](/azure/foundry/agents/concepts/runtime-components)
- [Foundry model catalog](https://ai.azure.com/catalog/models)
