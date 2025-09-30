---
title: What is Microsoft Sentinel MCP server's tool collection?
titleSuffix: Microsoft Security  
description: Learn about the different MCP collection of tools in Microsoft Sentinel 
author: poliveria
ms.topic: how-to
ms.date: 09/30/2025
ms.author: pauloliveria
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to understand the different tools in Microsoft Sentinel MCP server 
---

# Tool collection in Microsoft Sentinel MCP server (preview)

> [!IMPORTANT]
> Microsoft Sentinel MCP server is currently in preview.
> This information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

Microsoft Sentinel’s Model Context Protocol (MCP) Server collections are logical groupings of related security-focused MCP tools that you can use in any [compatible client](sentinel-mcp-get-started.md#supported-code-editors-and-agent-platforms) to search and retrieve data from tables and create agents.

Our collections are scenario-focused and have security-optimized descriptions that help AI models pick the right tools and deliver those outcomes. For example, you can use the following sample prompts to get the appropriate tool:
- Find the top three users that are at risk and explain why they are at risk.
- Find sign-in failures in the last 24 hours and give me a brief summary of key findings.
- Identify devices that showed an outstanding number of outgoing network connections.


## Available collections

The following table lists the available collections you can use:

| Collection | Description | 
|----------|----------|
| [Data exploration](sentinel-mcp-data-exploration-tool.md) | Explore security data in Microsoft Sentinel data lake by searching for relevant tables and query lake | 
| [Security Copilot agent creation](sentinel-mcp-agent-creation-tool.md) | Create Microsoft Security Copilot agents for complex workflows | 

## Related content
- [What is Microsoft Sentinel’s support for Model Context Protocol (MCP)?](sentinel-mcp-overview.md) 
- [Get started with Microsoft Sentinel MCP server](sentinel-mcp-get-started.md)