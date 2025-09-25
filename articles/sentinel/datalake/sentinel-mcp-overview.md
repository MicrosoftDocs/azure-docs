---
title: What is MCP? (Preview)
titleSuffix: Microsoft Security  
description: Learn how Model Context Protocol (MCP) 
author: mberdugo
ms.topic: overview
ms.date: 09/2/2025
ms.author: monaberdugo
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to understand
---

# What is Sentinel’s support for Model Context Protocol (MCP)? 

Microsoft Sentinel, our security platform, is introducing support for Model Context Protocol (MCP) comprising multiple scenario-focused collections of security tools through a unified server interface allowing customers to interactively query security data in natural language and build effective security agents that can perform complex automation. Our collection of security tools help security teams bring AI into their daily security operations to assist with common tasks like data exploration, threat intelligence and building agentic automation. 

## Key features of Sentinel’s support for MCP

The following are some of the key features and benefits of Sentinel’s MCP servers:

- **Fully hosted and protected**: Sentinel’s unified MCP server interface is fully hosted, requires no infrastructure deployment, and uses Microsoft Entra for identity. Security teams can connect compatible clients to streamline daily AI operations. 

- **Scenario-focused security tools**: Sentinel’s MCP support comes via scenario focused collections of ready-to-use security tools, helping teams achieve outcomes quickly.

- **Natural Language access**: Security teams can use purpose-built security tools to interact and reason over security data in Sentinel using natural language, removing the need for code-first integrations, understanding data schema, or writing well-formed data queries.

- **Faster agent development**: Sentinel’s collection of security tools automate discovery and retrieval of security data, speeding up efficient security agent creation.

- **Better accuracy and reliability**: Sentinel’s security-optimized collection of security tools deliver predictable, actionable responses to customize agents delivering better accuracy and reliability in complex automations.

- **Comprehensive security context engineering**: The data lake lets you bring all your security data into Microsoft Sentinel cost-effectively, removing the need to choose between coverage and cost.  Sentinel’s collection of tools natively integrates with the security data lake allowing you to build comprehensive security context engineering.

## Introduction to Model Context Protocol (MCP) 

The Model Context Protocol (MCP) is an open protocol designed to manage how language models interact with external tools, memory, and context in a safe, structured, and stateful way. MCP defines a client-server architecture with several components: 

- **MCP Host**: The AI application that coordinates and manages one or multiple MCP clients

- **MCP Client**: A component that maintains a connection to an MCP server and obtains context from an MCP server for the MCP host to use

- **MCP Server**: A program that provides context to MCP clients

For example: Visual Studio Code acts as an MCP host. When Visual Studio Code establishes a connection to an MCP server, such as the Sentinel MCP server for data exploration, the Visual Studio Code runtime instantiates an MCP client object that maintains the connection to the connected MCP server. Learn more about MCP architecture here.

## Scenarios for using the Sentinel’s MCP collections

Once you connect a compatible client with Sentinel’s MCP collections, you can use tools to:

- **Build Security Copilot agents through natural language:** Security Operations Center (SOC) engineers often spend weeks manually automating playbooks due to fragmented data sources and rigid schema requirements. With our agent creation tools, engineers can describe their intent in natural language to quickly build agents with the right LLM instructions and tools that reason over their Security data, creating automations that are customized to their organization's workflows and processes.  
Get started with building agents .

- **Interactively explore long term security data**: Security analysts and threat hunters, like those focusing on identity-based attacks, need to quickly query and correlate data across various security tables. Today, they must have knowledge of all tables and how what data each table contains. With our data exploration collection, analysts can now use natural language prompts to search and retrieve relevant data from tables in Sentinel data lake without needing to remember tables, their schema or write well-formed KQL queries.  

  For example, an analyst can ask to possible insider threats by correlating file activity with Purview sensitivity label to uncover signs of data exfiltration, policy violations, or suspicious user behavior that may have gone unnoticed during the original 90–180 day / time window. This interactive approach accelerates threat discovery and investigation while reducing reliance on manual query formulation. Get started with interactive threat hunting over long term data.

- **Access threat intelligence contextually**: Security teams can integrate threat intelligence directly into their agent workflows, prioritizing incidents and alerts that match known attack patterns, threat actors, or key indicators of compromise using our threat intelligence collection of tools. When an SOC analyst receives an alert in Sentinel, they can leverage our threat intelligence collection to quickly access threat actors, indicators of compromise, and their ingested threat intelligence. This enables the team to identify connections to malware groups and infrastructure reuse and take swift action by generating detections and blocking threats. Get started with threat intelligence.
