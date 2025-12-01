---
title: Responsible AI FAQs for Microsoft Sentinel MCP server
titleSuffix: Microsoft Security  
description: Learn about how Microsoft Responsible AI Standard guides the development and use of Microsoft Sentinel's collection of Model Context Protocol (MCP) tools 
author: poliveria
ms.topic: concept-article
ms.date: 11/18/2025
ms.author: pauloliveria
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to know the frequently asked questions about responsible AI in relation to using Microsoft Sentinel's collection of MCP tools 
---

# Responsible AI FAQs for Microsoft Sentinel MCP server

At Microsoft, we recognize the importance of regulatory compliance as a cornerstone of trust and reliability in AI technologies. We're committed to creating responsible AI by design. Our goal is to develop and deploy AI that has a beneficial impact on and earns trust from society. 

[A core set of principles](https://www.microsoft.com/ai/principles-and-approach) guides our work: fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability. Microsoft Sentinel MCP server is being developed in accordance with our AI principles.

Microsoft is committed to building products and solutions that comply with the EU AI Act and helping our customers use AI compliantly. We’re working closely with European policymakers to shape effective implementation practices. [Read more about how we’re innovating in line with the European Union’s AI act](https://blogs.microsoft.com/on-the-issues/2025/01/15/innovating-in-line-with-the-european-unions-ai-act/). 

| Questions | Answers | 
|----------|----------|
| **What is Microsoft Sentinel Model Context Protocol (MCP) server?**  | Microsoft Sentinel MCP server is a server-side protocol designed to support tools like [`search_tables`](sentinel-mcp-data-exploration-tool.md#semantic-search-on-table-catalog-search_tables), which enable semantic search across tables in the Microsoft Sentinel data lake, and the [triage tool](sentinel-mcp-triage-tool.md), which integrates APIs with your AI models. It provides a structured interface for agents and tools to build security scenarios by retrieving relevant tabular data using natural language queries.  | 
| **What can Microsoft Sentinel unified MCP server interface do?** | The protocol enables semantic data search, entity analysis, and agent creation capabilities on top of Microsoft Sentinel data lake and Microsoft Defender. It allows agents and tools to:<ul><li>Discover relevant tables based on natural language prompts.<li>Retrieve metadata and context about tables to support security investigations.<li>Analyze entities to get a threat verdict and analysis.<li>Integrate seamlessly into workflows for threat hunting, incident response, and research.</ul> | 
|**Who is Microsoft Sentinel’s collection of MCP tools for?** |Our collections are purpose-built for security teams looking to bring AI into their day-to-day security operations. The following roles benefit from these tools:<ul><li>Security analysts<li>Security researchers<li>Threat hunters</ul> |
|**What key scenarios does it support?** |Microsoft Sentinel’s unified MCP server interface supports multiple scenarios. For more information, see [Tool collection in Microsoft Sentinel MCP server](sentinel-mcp-tools-overview.md). |
|**What is the intended use?** |The protocol is intended to support security-focused workflows that require access to structured tabular data in Microsoft Sentinel data lake and Microsoft Defender. It's not a general-purpose AI assistant and is optimized for semantic search within the Microsoft Sentinel data lake.  |
|**What are its limitations?** | <ul><li>**Domain-specific:** The protocol only supports queries related to table search in the Microsoft Sentinel data lake and Microsoft Defender. Prompts outside this scope might result in empty or irrelevant responses.<li>**Data freshness:** Results depend on the current state of the data lake. If data is outdated or incomplete, responses might be limited.<li>**Plugin dependency:** Tools using the protocol must be properly configured to access the right plugins and data sources. </ul>|
|**How does Microsoft ensure responsible AI in this product?** |At Microsoft, we take our commitment to responsible AI seriously. Microsoft Sentinel MCP server is being developed in accordance with our AI principles. We're working with Security Copilot to deliver an experience that encourages responsible use. We designed the Microsoft Sentinel MCP server user experience to keep humans at the center. We developed a safety system that is designed to mitigate failures and prevent misuse with things like harmful content annotation, operational monitoring, and other safeguards. The invite-only early access program is also a part of our approach to responsible AI. We're taking user feedback from those with early access to Microsoft Sentinel MCP server to improve the tool before making it broadly available.<br><br>Responsible AI is a journey, and we continually improve our systems along the way. We're committed to making our AI more reliable and trustworthy, and your feedback helps us do so. |
|**Does Microsoft Sentinel MCP server comply with the EU AI Act?** | We're committed to compliance with the EU AI Act. Our multiyear effort to define, evolve, and implement our [Responsible AI Standard](https://www.microsoft.com/ai/responsible-ai) and internal governance strengthened our readiness. For more information, see [The EU AI Act: A Microsoft overview](https://www.microsoft.com/trust-center/compliance/eu-ai-act).|