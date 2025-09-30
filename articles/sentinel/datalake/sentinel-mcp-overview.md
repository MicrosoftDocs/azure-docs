---
title: What is Microsoft Sentinel’s support for MCP? (preview)
titleSuffix: Microsoft Security  
description: Learn how Model Context Protocol (MCP) 
author: mberdugo
ms.topic: overview
ms.date: 09/2/2025
ms.author: monaberdugo
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to understand Microsoft Sentinel’s support for Model Context Protocol (MCP)
---

# What is Microsoft Sentinel’s support for Model Context Protocol (MCP)? 

> [!IMPORTANT]
> Microsoft Sentinel MCP server is currently in preview.
> This information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

Microsoft Sentinel, our security platform, is introducing support for Model Context Protocol (MCP). This support comprises multiple scenario-focused collections of security tools through a unified server interface, allowing customers to interactively query security data in natural language and build effective security agents that can perform complex automation. Our collection of security tools help security teams bring AI into their daily security operations to assist with common tasks like data exploration and building agentic automation.

## Key features of Microsoft Sentinel’s support for MCP

The following are some of the key features and benefits of Microsoft Sentinel’s MCP servers:

- **Unified, hosted interface for AI-driven security operations**: Microsoft Sentinel’s unified MCP server interface is fully hosted, requires no infrastructure deployment, and uses Microsoft Entra for identity. Security teams can connect compatible clients to streamline daily AI operations.

- **Scenario-focused and natural language security tools**: Microsoft Sentinel’s MCP support comes through scenario-focused collections of ready-to-use security tools. These collections help Security teams interact and reason over security data in Microsoft Sentinel data lake using natural language, removing the need for code-first integration, understanding data schema, or writing well-formed data queries.

- **Accelerated development of effective security agents**: Microsoft Sentinel’s collection of security tools automate discovery and retrieval of security data and deliver predictable, actionable responses to customize agents, speeding up efficient security agent creation and delivering better and highly effective security agents.

- **Cost-Effective, Context-Rich Security Data Integration**: The data lake lets you bring all your security data into Microsoft Sentinel cost-effectively, removing the need to choose between coverage and cost. Microsoft Sentinel’s collection of tools natively integrates with the security data lake, letting you build comprehensive security context engineering.


## Introduction to MCP 

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open protocol designed to manage how language models interact with external tools, memory, and context in a safe, structured, and stateful way. MCP defines a client-server architecture with several components: 

- **MCP host**: The AI application that coordinates and manages one or multiple MCP clients

- **MCP client**: A component that maintains a connection to an MCP server and obtains context from an MCP server for the MCP host to use

- **MCP server**: A program that provides context to MCP clients

For example, Visual Studio Code acts as an MCP host. When Visual Studio Code establishes a connection to an MCP server, such as the Microsoft Sentinel MCP server for data exploration, the Visual Studio Code runtime instantiates an MCP client object that maintains the connection to the connected MCP server.

[Learn more about MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture)

## Scenarios for using Microsoft Sentinel’s MCP collections

Once you connect a [compatible client](sentinel-mcp-get-started.md#supported-code-editors-and-agent-platforms) with Microsoft Sentinel’s MCP collections, you can use tools to:

- **Interactively explore long term security data**: Security analysts and threat hunters, like those focusing on identity-based attacks, need to quickly query and correlate data across various security tables. Today, they must have knowledge of all tables and what data each table contains. With our data exploration collection, analysts can now use natural language prompts to search and retrieve relevant data from tables in Microsoft Sentinel data lake without needing to remember tables and their schema or writing well-formed Kusto Query Language (KQL) queries.  

  For example, an analyst can look for possible insider threats by correlating file activity with Purview sensitivity label to uncover signs of data exfiltration, policy violations, or suspicious user behavior that might have gone unnoticed during the original 90 to 180 day/time window. This interactive approach accelerates threat discovery and investigation while reducing reliance on manual query formulation. 
  
    [Get started with data exploration over long term data](sentinel-mcp-data-exploration-tool.md)
  
- **Build Security Copilot agents through natural language:** Security Operations Center (SOC) engineers often spend weeks manually automating playbooks due to fragmented data sources and rigid schema requirements. With our agent creation tools, engineers can describe their intent in natural language to quickly build agents with the right AI model instructions and tools that reason over their security data, creating automations that are customized to their organization's workflows and processes.  

  [Get started with building agents](sentinel-mcp-agent-creation-tool.md)


## Related content
- [Get started with Microsoft Sentinel MCP server](sentinel-mcp-get-started.md)
- [Tool collection in Microsoft Sentinel MCP server](sentinel-mcp-tools-overview.md)