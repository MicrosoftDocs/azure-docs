---
title: Tools in Azure SRE Agent
description: Learn how your agent's tools are organized, including built-in Azure tools, MCP extensibility, code execution, knowledge, and communication.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 03/06/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: tools, built-in tools, mcp, code execution, knowledge, communication, incident management, devops, custom tools
#customer intent: As an SRE, I want to understand the different tool categories so that I can extend my agent with the right capabilities for my environment.
---

# Tools in Azure SRE Agent
Tools are the atomic capabilities your agent uses to take action. They enable querying logs, running commands, executing code, searching documents, and sending notifications. Your agent selects the right tools automatically based on the task at hand.

| Category | What it covers | Setup |
|---|---|---|
| [**Built-in**](#built-in-tools) | Azure operations, diagnostics, monitoring, log queries, and visualization | None (available through managed identity) |
| [**MCP**](#mcp-tools) | Any external service via Model Context Protocol | Add an MCP connector |
| [**Code execution**](#code-execution) | Python and shell execution in sandboxed environments | None (built-in) |
| [**Knowledge**](#knowledge) | Document search, agent memory, application topology | None (built-in; some features require connectors) |
| [**Communication**](#communication) | Email and Teams notifications | Add Outlook or Teams connector |
| [**Incident management and DevOps**](#incident-management-and-devops) | Incident platforms and source code repositories | Add platform connector |
| [**Custom tools**](#custom-tools) | Your own Kusto, Python, Link, and HTTP tools | Create in Builder UI |

Tools combine with [skills](skills.md) and [subagents](sub-agents.md) to create powerful automation. Skills attach tools to procedural instructions. Subagents get dedicated tool sets for their domain.

## Built-in tools

Your agent includes tools for Azure operations, diagnostics, monitoring, and log queries. These tools work immediately through the agent's managed identity, so no connector setup is required. Ensure your agent has appropriate [RBAC permissions](permissions.md) on target resources.

Built-in tools cover the full operational spectrum: run Azure CLI commands, query Application Insights and Log Analytics, analyze Azure Monitor metrics, manage AKS clusters with kubectl, diagnose Container Apps, Function Apps, App Service, and more. Specialized diagnostic tools perform deeper analysis, including CPU profiling, API Management diagnostics, deployment verification, reliability assessment, and remediation actions. Visualization tools generate charts and integrate with Grafana dashboards.

Your agent selects the right tool based on the resource type and the nature of your question. For a deeper look at Azure diagnostic capabilities, see [Azure observability](diagnose-azure-observability.md) and [Root cause analysis](root-cause-analysis.md).

## MCP tools

The [Model Context Protocol](connectors.md) (MCP) extends your agent with tools from any MCP-compatible server. You can connect your own servers or third-party MCP servers for observability platforms like Datadog, Elasticsearch, Dynatrace, New Relic, Splunk, and Hawkeye.

When you connect an MCP server, your agent automatically discovers its tools. Each tool uses a namespace with its connection ID (for example, `my-server_list_incidents`). You can assign MCP tools to subagents by using wildcard patterns like `my-server/*` to include all tools from a connection. When an MCP tool runs, the tool card in chat shows a single status line with the tool name and result.

For connector setup, see [Connectors](connectors.md).

## Code execution

Your agent can write and execute code in sandboxed environments for data analysis, custom calculations, and report generation. The built-in code interpreter runs Python and shell commands in an isolated container, which is useful for processing query results, generating charts, and creating PDF reports.

You can also create reusable custom Python tools with your own prewritten functions and pip dependencies. Unlike the code interpreter (which generates code on the fly), custom Python tools run your defined logic with specific inputs.

For more information, see [Python code execution](python-code-execution.md).

## Knowledge

Your agent uses knowledge tools to access organizational context and build understanding of your environment over time. Document search finds relevant procedures and runbooks from your [knowledge base](memory.md). Agent memory provides vector search across uploaded files. Application topology maps resource relationships and network connections.

Troubleshooting guide (TSG) retrieval finds and follows guides indexed from Azure DevOps wikis. The knowledge graph builds a persistent entity-relation model of your environment as your agent learns from investigations.

For more on how knowledge works, see [Memory and knowledge](memory.md). To add documents, see [Upload knowledge documents](upload-knowledge-document.md).

## Communication

Send investigation findings through the channels your team uses. Connect Outlook to email summaries and reports with attachments. Connect Teams to post updates and reply to conversations in your channels.

Both require their respective [connectors](connectors.md) to be configured. For setup and usage, see [Send notifications](send-notifications.md).

## Incident management and DevOps

Your agent integrates with incident management platforms and source code repositories.

- **Incident platforms**: Connect PagerDuty or ServiceNow to receive alerts and manage incident lifecycles. For more information, see [Incident platforms](incident-platforms.md) and [Incident response](incident-response.md).

- **DevOps**: Connect GitHub or Azure DevOps to access repositories, pull requests, issues, and work items. For more information, see [Set up Azure DevOps connector](azure-devops-connector.md).

## Custom tools

Create your own tools for operations specific to your environment. Four types are available.

| Type | Use case |
|---|---|
| **Kusto** | Run predefined KQL queries with parameter substitution. |
| **Python** | Execute custom Python functions with pip dependencies. |
| **Link** | Generate URLs from templates with dynamic parameters. |
| **HTTP client** | Call REST APIs with authentication. |

Create custom tools through the Builder UI. Attach them to [skills](skills.md) or assign them to [subagents](sub-agents.md). For more information, see [Kusto tools](kusto-tools.md) and [Python code execution](python-code-execution.md).

## Next step

> [!div class="nextstepaction"]
> [Create a Python tool](./create-python-tool.md)

## Related content

- [Connectors](connectors.md)
- [Skills](skills.md)
- [Subagents](sub-agents.md)
- [Permissions](permissions.md)
- [Memory and knowledge](memory.md)
