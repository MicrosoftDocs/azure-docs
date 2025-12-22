---
title: Get started with Microsoft Sentinel MCP server
titleSuffix: Microsoft Security  
description: Learn how to set up and use Microsoft Sentinel's Model Context Protocol (MCP) collection of security tools to enable natural language queries and AI-powered security investigations 
author: poliveria
ms.topic: get-started
ms.date: 11/24/2025
ms.author: pauloliveria
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to configure Microsoft Sentinel MCP server so that I can use natural language to query security data and accelerate investigations.
---

# Get started with Microsoft Sentinel MCP server 

This article shows you how to set up and use Microsoft Sentinel's Model Context Protocol (MCP) collection of security tools to enable natural language queries against your security data. Sentinel's support for MCP enables security teams to bring AI into their security operations by allowing AI models to access security data in a standard way. 

Sentinel's [collection](sentinel-mcp-tools-overview.md) of security tools works with multiple clients and automation platforms. You can use these tools to: 
- Search for relevant tables
- Retrieve data
- Analyze entities
- Create Security Copilot agents
- Triage incidents
- Hunt for threats

## Prerequisites

To use Microsoft Sentinel MCP server and access its collection of tools, you need to be onboarded to at least one of the following products:
- [Microsoft Sentinel data lake](sentinel-lake-onboarding.md)
- [Microsoft Sentinel in Microsoft Defender portal](/unified-secops/microsoft-sentinel-onboard)
- [Microsoft Defender XDR or Microsoft Defender for Endpoint](/unified-secops/overview-deploy)

For more information about a tool collection's specific product prerequisites, see their respective articles. 


You also need the **Security reader** role to list and invoke Sentinel's collection of MCP tools. The [triage tool collection](sentinel-mcp-triage-tool.md) lets you use any tool your existing permissions grant you.



## Add Microsoft Sentinel's collection of MCP tools
For more information on how to add Microsoft Sentinel's collection of MCP tools, see the articles for the following AI-powered code editors and agent-building platforms:
- [Microsoft Security Copilot](sentinel-mcp-use-tool-security-copilot.md#add-a-microsoft-sentinel-tool-collection)
- [Microsoft Copilot Studio](sentinel-mcp-use-tool-copilot-studio.md#add-a-microsoft-sentinel-tool-collection)
- [Microsoft Foundry](sentinel-mcp-use-tool-azure-ai-foundry.md#add-a-microsoft-sentinel-tool-collection)
- [Visual Studio Code](sentinel-mcp-use-tool-visual-studio-code.md)

## Test your added tools with sample prompts

After adding Microsoft Sentinel's collection of tools, use the following sample prompts to interact with data in your Microsoft Sentinel data lake. 


- Find the top three users that are at risk and explain why they're at risk.
- Find sign-in failures in the last 24 hours and give me a brief summary of key findings.
- Identify devices that showed an outstanding number of outgoing network connections.
- Help me understand if the user <user object ID\> is compromised.
- Investigate users with a password spray alert in the last seven days and tell me if any of them are compromised.
- Find all the URL IOCs from <threat analytics report\> and analyze them to tell me everything Microsoft knows about them.

To understand how agents invoke our tools to answer these prompts, see [How Microsoft Sentinel MCP tools work alongside your agent](sentinel-mcp-data-exploration-tool.md#how-microsoft-sentinel-mcp-tools-work-alongside-your-agent).

## Next step
- [Tool collection in Microsoft Sentinel MCP server](sentinel-mcp-tools-overview.md)
