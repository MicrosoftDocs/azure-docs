---
title: Tools in Azure SRE Agent
description: Learn how your agent's tools are organized, including built-in Azure tools, MCP extensibility, code execution, knowledge, and communication.
ms.topic: reference
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: tools, built-in tools, mcp, code execution, knowledge, communication, incident management, devops, custom tools, parallel execution, task delegation
#customer intent: As an SRE, I want to understand the different tool categories so that I can extend my agent with the right capabilities for my environment.
---

# Tools in Azure SRE Agent
Tools are the atomic capabilities your agent uses to take action. They enable querying logs, running commands, executing code, searching documents, and sending notifications. Your agent automatically selects the right tools based on the task.

| Category | What it covers | Setup |
|---|---|---|
| [**Built-in**](#built-in-tools) | Azure operations, diagnostics, monitoring, log queries, and visualization | None (available through managed identity) |
| [**MCP**](#mcp-tools) | Any external service via Model Context Protocol | Add an MCP connector |
| [**Code execution**](#code-execution) | Python and shell execution in sandboxed environments | None (built-in) |
| [**Knowledge**](#knowledge) | Document search, agent memory, application topology | None (built-in; some features require connectors) |
| [**Communication**](#communication) | Email and Teams notifications | Add Outlook or Teams connector |
| [**Incident management and DevOps**](#incident-management-and-devops) | Incident platforms and source code repositories | Add platform connector |
| [**Custom tools**](#custom-tools) | Your own Kusto, Python, Link, and HTTP tools | Create in Builder UI |

By combining tools with [skills](skills.md) and [custom agents](sub-agents.md), you can create powerful automation. Skills attach tools to procedural instructions. Custom agents get dedicated tool sets for their domain.

## Built-in tools

Your agent includes tools for Azure operations, diagnostics, monitoring, and log queries. These tools work immediately through the agent's managed identity, so you don't need to set up a connector. Ensure your agent has appropriate [RBAC permissions](permissions.md) on target resources.

Built-in tools cover the full operational spectrum: run Azure CLI commands, query Application Insights and Log Analytics, analyze Azure Monitor metrics, manage AKS clusters with kubectl, diagnose Container Apps, Function Apps, App Service, and more. Specialized diagnostic tools perform deeper analysis, including CPU profiling, API Management diagnostics, deployment verification, reliability assessment, and remediation actions. Visualization tools generate charts and integrate with Grafana dashboards.

Your agent selects the right tool based on the resource type and the nature of your question. For a deeper look at Azure diagnostic capabilities, see [Azure observability](diagnose-azure-observability.md) and [Root cause analysis](root-cause-analysis.md).

## MCP tools

The [Model Context Protocol](connectors.md) (MCP) extends your agent with tools from any MCP-compatible server. You can connect your own servers or non-Microsoft MCP servers for observability platforms like Datadog, Elasticsearch, Dynatrace, New Relic, Splunk, and Hawkeye.

When you connect an MCP server, your agent automatically discovers its tools. Each tool uses a namespace with its connection ID (for example, `my-server_list_incidents`). You can assign MCP tools to custom agents by using wildcard patterns like `my-server/*` to include all tools from a connection. When an MCP tool runs, the tool card in chat shows a single status line with the tool name and result.

For connector setup, see [Connectors](connectors.md).

## Code execution

Your agent can write and execute code in sandboxed environments for data analysis, custom calculations, and report generation. The built-in code interpreter runs Python and shell commands in an isolated container. This feature is useful for processing query results, generating charts, and creating PDF reports.

You can also create reusable custom Python tools with your own prewritten functions and pip dependencies. Unlike the code interpreter (which generates code on the fly), custom Python tools run your defined logic with specific inputs.

For more information, see [Python code execution](python-code-execution.md).

## Tool selection intelligence

Each tool includes a **description prompt** which is a detailed instruction that the model reads when deciding which tool to use and how to use it. These prompts shape how your agent reasons about tool selection.

- **Parallel execution** runs when your agent identifies independent operations (such as multiple diagnostic commands that don't depend on each other), it runs them simultaneously in a single turn. This approach reduces investigation time significantly.

- **Task delegation** for complex searches that require multiple rounds of file pattern matching, content searching, and reading, the agent delegates to a specialized built-in Explore task.

- **Tool routing** where the agent selects the most appropriate tool for each operation. It uses simple file pattern searches with FileSearch directly, while complex exploration tasks use the Task tool. Shell commands route through secure execution environments.

The development team continuously refines the tool prompts to improve reasoning quality and investigation speed.

## Knowledge

Your agent uses knowledge tools to access organizational context and build an understanding of your environment over time. Document search finds relevant procedures and runbooks from your [knowledge base](memory.md). Agent memory provides vector search across uploaded files. Application topology maps resource relationships and network connections.

Troubleshooting guide (TSG) retrieval finds and follows guides indexed from Azure DevOps wikis. The knowledge graph builds a persistent entity-relation model of your environment as your agent learns from investigations.

For more information about how knowledge works, see [Memory and knowledge](memory.md). To add documents, see [Upload knowledge documents](upload-knowledge-document.md).

## Communication

Send investigation findings through the channels your team uses. Connect Outlook to email summaries and reports with attachments. Connect Teams to post updates and reply to conversations in your channels.

Both require their respective [connectors](connectors.md) to be configured. For setup and usage, see [Send notifications](send-notifications.md).

## Incident management and DevOps

Your agent integrates with incident management platforms and source code repositories.

- **Incident platforms**: Connect PagerDuty or ServiceNow to receive alerts and manage incident lifecycles. For more information, see [Incident platforms](incident-platforms.md) and [Incident response](incident-response.md).

- **DevOps**: Connect GitHub or Azure DevOps Repos to access repositories, pull requests, issues, and work items. For more information, see [Set up Azure DevOps connector](azure-devops-connector.md).

## Custom tools

Create your own tools for operations specific to your environment. Four types are available:

| Type | Use case |
|---|---|
| **Kusto** | Run predefined KQL queries with parameter substitution. |
| **Python** | Execute custom Python functions with pip dependencies. |
| **Link** | Generate URLs from templates with dynamic parameters. |
| **HTTP client** | Call REST APIs with authentication. |

Create custom tools through the Builder UI. Attach them to [skills](skills.md) or assign them to [custom agents](sub-agents.md). For more information, see [Kusto tools](kusto-tools.md) and [Python code execution](python-code-execution.md).

## Next step

> [!div class="nextstepaction"]
> [Create a Python tool](./create-python-tool.md)

## Related content

- [Connectors](connectors.md)
- [Skills](skills.md)
- [Custom agents](sub-agents.md)
- [Permissions](permissions.md)
- [Memory and knowledge](memory.md)
