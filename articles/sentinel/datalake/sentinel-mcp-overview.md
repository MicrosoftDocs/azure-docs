---
title: What is Microsoft Sentinel’s support for MCP? 
titleSuffix: Microsoft Security  
description: Learn how Model Context Protocol (MCP) 
author: mberdugo
ms.topic: overview
ms.date: 12/01/2025
ms.author: monaberdugo
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to understand Microsoft Sentinel’s support for Model Context Protocol (MCP)
---

# What is Microsoft Sentinel’s support for Model Context Protocol (MCP)? 


Microsoft Sentinel, our security platform, introduces support for Model Context Protocol (MCP). This support includes multiple scenario-focused collections of security tools through a unified server interface. With this support, you can interactively query security data in natural language and build effective security agents that can perform complex automation. Our collection of security tools helps security teams bring AI into their daily security operations to assist with common tasks like data exploration, building agentic automation, and incident triage and threat hunting.

## Key features of Microsoft Sentinel’s support for MCP

The following features and benefits are part of Microsoft Sentinel’s MCP servers:

- **Unified, hosted interface for AI-driven security operations**: Microsoft Sentinel’s unified MCP server interface is fully hosted, requires no infrastructure deployment, and uses Microsoft Entra for identity. Security teams can connect compatible clients to streamline daily AI operations.

- **Scenario-focused and natural language security tools**: Microsoft Sentinel’s MCP support comes through scenario-focused collections of ready-to-use security tools. These collections help security teams interact and reason over security data in Microsoft Sentinel data lake and Microsoft Defender using natural language, removing the need for code-first integration, understanding data schema, or writing well-formed data queries.

- **Accelerated development of effective security agents**: Microsoft Sentinel’s collection of security tools automates discovery and retrieval of security data and delivers predictable, actionable responses to customize agents. This support speeds up efficient security agent creation and delivers better and highly effective security agents.

- **Cost-effective, context-rich security data integration**: The data lake lets you bring all your security data into Microsoft Sentinel cost-effectively, so you don't need to choose between coverage and cost. Microsoft Sentinel’s collection of tools natively integrates with the security data lake and Microsoft Defender, letting you build comprehensive security context engineering.


## Introduction to MCP 

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open protocol that manages how language models interact with external tools, memory, and context in a safe, structured, and stateful way. MCP uses a client-server architecture with several components: 

- **MCP host**: The AI application that coordinates and manages one or multiple MCP clients

- **MCP client**: A component that maintains a connection to an MCP server and obtains context from an MCP server for the MCP host to use

- **MCP server**: A program that provides context to MCP clients

For example, Visual Studio Code acts as an MCP host. When Visual Studio Code establishes a connection to an MCP server, such as the Microsoft Sentinel MCP server for data exploration, the Visual Studio Code runtime instantiates an MCP client object that maintains the connection to the connected MCP server.

[Learn more about MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture)

## Scenarios for using Microsoft Sentinel’s MCP collections

When you connect a [compatible client](sentinel-mcp-get-started.md#add-microsoft-sentinels-collection-of-mcp-tools) with Microsoft Sentinel’s MCP collections, you can use tools to:

- **Interactively explore long term security data**: Security analysts and threat hunters, like those focusing on identity-based attacks, need to quickly query and correlate data across various security tables. Today, they must have knowledge of all tables and what data each table contains. With our data exploration collection, analysts can now use natural language prompts to search and retrieve relevant data from tables in Microsoft Sentinel data lake without needing to remember tables and their schema or writing well-formed Kusto Query Language (KQL) queries.  

  For example, an analyst can look for possible insider threats by correlating file activity with Purview sensitivity label to uncover signs of data exfiltration, policy violations, or suspicious user behavior that might have gone unnoticed during the original 90 to 180 day/time window. This interactive approach accelerates threat discovery and investigation while reducing reliance on manual query formulation. 
  
    [Get started with data exploration over long term data](sentinel-mcp-data-exploration-tool.md)
  
-	**Analyze entities across your security data:** Security Operations Center (SOC) engineers, analysts, and even agents need an easy way to analyze and triage entities, such as URLs and users, using all of an organizations security data. However, today’s fragmented data sources make this process complex and time-consuming to automate. As one of the most common incident triage tasks, entity enrichment therefore often becomes a manual context-gathering effort, slowing down response times. With the entity analyzer tools in the data exploration collection, analysts and SOC engineers have a one-click action that can retrieve, reason over, and clearly present comprehensive verdicts and analyses on entities using the security data in the data lake, making it easy to automate entity enrichment for you and the agents you build.

    [Get started with analyzing entities automatically during investigations](sentinel-mcp-data-exploration-tool.md#entity-analyzer-preview)

- **Build Security Copilot agents through natural language:** SOC engineers often spend weeks manually automating playbooks due to fragmented data sources and rigid schema requirements. With our agent creation tools, engineers can describe their intent in natural language to quickly build agents with the right AI model instructions and tools that reason over their security data, creating automations that are customized to their organization's workflows and processes.  

  [Get started with building agents](sentinel-mcp-agent-creation-tool.md)

-	**Triage incidents and hunt for threats:** SOC engineers need to prioritize incidents rapidly and hunt over your organization’s own data easily without having to worry about security workflow issues and interoperability among platforms and tools that they use. Our triage collection of tools integrates your AI models with APIs that support incident triage and hunting. This integration reduces mean time to resolution, risk exposure, and dwell time and empowers your team to leverage AI for smarter and faster decision-making. 
 
    [Get started with incident triage and threat hunting](sentinel-mcp-triage-tool.md)



## Related content
- [Get started with Microsoft Sentinel MCP server](sentinel-mcp-get-started.md)
- [Tool collection in Microsoft Sentinel MCP server](sentinel-mcp-tools-overview.md)