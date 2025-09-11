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

# What is Microsoft Sentinel MCP (Model Context Protocol)?

MCP, or Model Context Protocol, is a framework designed to enhance the interoperability and contextual understanding of security models within Microsoft Sentinel. By providing a standardized way to represent and share contextual information about security entities, MCP enables more effective collaboration and analysis across different security tools and platforms.

This document provides security analysts and IT professionals an overview of MCP, including its key features, benefits, and use cases.

## Key features of MCP

The following are some of the key features and benefits of MCP:

- **Natural Language Access to Security Data**: MCP enables agents like *Security Copilot* to interact with Sentinel data using plain language. This removes the need for writing KQL queries or building custom connectors, making it easier for nondevelopers to access and analyze security data.

- **Accelerated Agent Development**: MCP exposes standardized tools, which allows developers to build and deploy AI agents faster. These agents can discover, invoke, and reuse tools without needing to understand every schema or API endpoint.

- **Improved Accuracy and Reliability**: MCP uses strongly typed schemas and predictable tool discovery, which helps ensure AI agents generate more accurate and trustworthy outputs during investigations and automation.

- **Custom Tool Creation**: Security teams can author and convert KQL or GQL queries into reusable MCP tools. These tools can then be invoked via natural language, enabling flexible and scalable automation.

- **Unified Security Context**: Sentinel’s MCP server integrates with its security data lake and graph, offering long-term retention and multiple analytics engines. This unified context enhances threat detection, investigation, and response workflows.

## Use Cases for MCP

Here are some examples of how MCP can be used to enhance security operations:

- **Security Copilot Integration**: Ask a question like “Show me all failed sign-in attempts in the last 24 hours,” and Security Copilot uses MCP to query the data lake and return results. No manual scripting required.
- **Agent Creation**: You can build agents using YAML files, form-based UI in the Security Copilot Portal, or directly through MCP endpoints (discover, build, publish).
- **Custom Tool Creation**: Convert KQL or GQL queries into reusable tools that can be invoked via natural language. For example, you could create a tool that queries the data lake for all failed sign-in attempts and returns the results in a specific format.

