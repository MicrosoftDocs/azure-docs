---
title: Agent creation tool collection in Microsoft Sentinel MCP server
titleSuffix: Microsoft Security  
description: Learn about the different tools available in the Agent creation collection in Microsoft Sentinel 
author: poliveria
ms.topic: how-to
ms.date: 09/30/2025
ms.author: pauloliveria
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to know the different tools available to create AI agents
---

# Create AI agents with agent creation collection (preview)

> [!IMPORTANT]
> Microsoft Sentinel MCP server is currently in preview.
> This information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

The agent creation tool collection in the Microsoft Sentinel Model Context Protocol (MCP) server lets you create effective Microsoft Security Copilot agents. 

## Prerequisites

To access the agent creation tool collection, you must have the following prerequisites:
- [Microsoft Sentinel data lake](sentinel-lake-onboarding.md)
- [Security Copilot](/copilot/security/microsoft-security-copilot)
- Visual Studio Code (latest version)
- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) Visual Studio Code extension

## Add the agent creation collection

To add the agent creation collection, you must first set up add Microsoft Sentinel's unified MCP server interface. Follow the step-by-step instructions for the following [AI-powered code editors and agent-building platforms](sentinel-mcp-get-started.md#add-microsoft-sentinels-collection-of-mcp-tools):
- Visual Studio Code

The agent creation collection is hosted in the following URL:
- `https://sentinel.microsoft.com/mcp/security-copilot-agent-creation`

After adding the agent creation tool, you can use the following sample prompt to create complex, agentic workflows in Security Copilot:

- Create an agent that generates a comprehensive post-incident report from Microsoft Defender, Microsoft Purview, and Microsoft Sentinel incidents; aggregates incident summaries, detailed insights, entities, and alerts; and provides actionable remediation steps.

## Tools in the agent creation collection

### Search for tools (`search_for_tools`)
This tool finds relevant tools, including skills, agents and MCP tools, in Security Copilot that can be used to fulfill the intent.

| Parameters | Required? | Description | 
|----------|----------|----------|
| userQuery| Yes |The query or problem statement to find relevant tools for (for example, "Defender incident details"). |

### Start agent creation (`start_agent_creation`)
This tool creates a new Security Copilot session to start building a new agent.

| Parameters | Required? | Description | 
|----------|----------|----------|
| userQuery| Yes |The problem statement for the agent. |

 
### Compose agent (`compose_agent`)
This tool iterates on composing the Security Copilot agent YAML.

| Parameters | Required? | Description | 
|----------|----------|----------|
| sessionID| Yes |Security Copilot session identifier created by the `start_agent_creation` tool. This shouldn't be the session identifier created by `search_for_tools`. |
| userQuery| Yes |User input for the agent builder to process. This could be confirmations, clarifications, or additional information. |
| existingDefinition| No |Optional existing agent definition YAML for the tool to edit. This could be generated from this tool's previous runs or provided by adding a YAML file to the context. |

### Get evaluation (`get_evaluation`)
This tool is called after running the `search_for_tools`, `start_agent_creation`, and `compose_agent` tools to retrieve the result.

| Parameters | Required? | Description | 
|----------|----------|----------|
| sessionID| Yes |Session identifier of the evaluation |
| promptID| Yes |Prompt identifier of the evaluation |
| evaluationID| Yes |The identifier of the evaluation |

### Deploy agent (`deploy_agent`)
This tool uploads the agent to the Security Copilot user or workspace scope.

| Parameters | Required? | Description | 
|----------|----------|----------|
| agentDefinition| Yes |Agent definition in YAML format. This could be generated from the `compose_agent` tool or provided by adding a YAML file to the context. |
| scope| Yes |Scope to upload the agent to. This can be `User` or `Workspace` only. |
| agentSkillsetName| Yes |Agent skill set name. This must exactly match the `Name` value under **Descriptor** in the agent definition YAML. |

## Related content
- [What is Microsoft Sentinel’s support for Model Context Protocol (MCP)?](sentinel-mcp-overview.md) 
- [Get started with Microsoft Sentinel MCP server](sentinel-mcp-get-started.md)