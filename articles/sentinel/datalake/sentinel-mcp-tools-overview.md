---
title: What is Microsoft Sentinel MCP server's tool collection?
titleSuffix: Microsoft Security  
description: Learn about the different MCP collection of tools in Microsoft Sentinel 
author: poliveria
ms.topic: article
ms.date: 12/01/2025
ms.author: pauloliveria
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to understand the different tools in Microsoft Sentinel MCP server 
---

# Tool collection in Microsoft Sentinel MCP server

Microsoft Sentinel’s Model Context Protocol (MCP) Server collections are logical groupings of related security-focused MCP tools that you can use in any [compatible client](sentinel-mcp-get-started.md#add-microsoft-sentinels-collection-of-mcp-tools) to:
- Search for relevant tables
- Retrieve data
- Analyze entities
- Create Security Copilot agents
- Triage incidents
- Hunt for threats

Our collections are scenario-focused and have security-optimized descriptions that help AI models pick the right tools and deliver those outcomes. For example, you can use the following sample prompts to get the appropriate tool:
- Find the top three users that are at risk and explain why they're at risk.
- Find sign-in failures in the last 24 hours and give me a brief summary of key findings.
- Identify devices that showed an outstanding number of outgoing network connections.
- Help me understand if the user <user object ID\> is compromised.
- Investigate users with a password spray alert in the last seven days and tell me if any of them are compromised.
- Find all the URL IOCs from <threat analytics report\> and analyze them to tell me everything Microsoft knows about them.

## Available collections

The following table lists the available collections you can use:

| Collection | Description | Server URL |
|----------|----------|----------|
| [Data exploration](sentinel-mcp-data-exploration-tool.md) | Explore security data in Microsoft Sentinel data lake by searching for relevant tables, querying the lake, and analyzing entities | `https://sentinel.microsoft.com/mcp/data-exploration`|
| [Security Copilot agent creation](sentinel-mcp-agent-creation-tool.md) | Create Microsoft Security Copilot agents for complex workflows |`https://sentinel.microsoft.com/mcp/security-copilot-agent-creation`|
| [Triage](sentinel-mcp-triage-tool.md) | Triage incidents rapidly and hunt over your own data easily | `https://sentinel.microsoft.com/mcp/triage`|


## Create your own custom MCP tool
You can enable agents to retrieve and reason over knowledge from your library of saved Kusto Query Language (KQL) queries in [advanced hunting](/defender-xdr/advanced-hunting-microsoft-defender?toc=%2Fazure%2Fsentinel%2FTOC.json&bc=%2Fazure%2Fsentinel%2Fbreadcrumb%2Ftoc.json) by using custom MCP tools. Creating your own Sentinel MCP tools lets you have granular control over the data accessible to your security agents and create deterministic agentic workflows. 

For more information, see [Create and use custom Microsoft Sentinel MCP tools](sentinel-mcp-create-custom-tool.md).


## Related content
- [What is Microsoft Sentinel’s support for Model Context Protocol (MCP)?](sentinel-mcp-overview.md) 
- [Get started with Microsoft Sentinel MCP server](sentinel-mcp-get-started.md)