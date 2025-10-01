---
title: What is Microsoft Sentinel?
description: Learn about Microsoft Sentinel, an AI-first, cloud-native security information and event management (SIEM) and security platform that consolidates and analyzes security data at scale, empowers security operations teams with proactive, AI-enhanced defense capabilities, and provides unified tools for detecting, investigating, and responding to threats across hybrid and multicloud environments.
author: guywi-ms
ms.author: guywild
ms.topic: overview
ms.service: microsoft-sentinel
ms.date: 09/14/2025
ms.custom: sfi-image-nochange

Customer intent: As a security or IT decision‑maker, I need to assess Microsoft Sentinel’s cloud‑native, fully managed architecture - centered on the Sentinel data lake and graph - so I can determine fit for our security, operational, and migration requirements.

---

# What is Microsoft Sentinel?

Microsoft Sentinel is a cloud-native Security Information and Event Management (SIEM) and unified security platform for agentic defense. To meet the demands of today’s complex threats, Microsoft Sentinel has evolved from a traditional SIEM to a SIEM and platform - extending beyond static, rule-based controls and post-breach response to provide an AI-ready, data-first foundation that transforms telemetry into a security graph, standardizes access for agents, and coordinates autonomous actions, while keeping humans in command of strategy and high impact investigations.

As a SIEM, Microsoft Sentinel delivers AI-driven security across multicloud and multiplatform environments, offering robust capabilities for threat detection, investigation, hunting, response, and automated attack disruption. As a platform, Microsoft Sentinel provides a foundation built on a modern data lake for deep insights, graph capabilities for contextual analysis, a hosted Model Context Protocol (MCP) server for agent-ready tooling, and developer capabilities for building and deploying solutions through the Security Store.

This article provides an overview of Microsoft Sentinel and its core components. It explains how Microsoft Sentinel helps security operations teams detect and respond to threats, and adapt continuously by unifying data, automating responses, and deriving AI-driven insights.

## AI-first, end-to-end SIEM and security platform 

This diagram illustrates the Microsoft Sentinel AI-first, end-to-end SIEM and security platform, highlighting its core components and its integration with [Microsoft Security Copilot](/copilot/security/microsoft-security-copilot).

:::image type="content" source="media/sentinel-overview/microsoft-sentinel-overview.png" alt-text="A diagram that depicts the Microsoft Sentinel AI-first, end-to-end SIEM and security platform." link="media/sentinel-overview/microsoft-sentinel-overview.png" lightbox="media/sentinel-overview/microsoft-sentinel-overview.png":::

## Microsoft Sentinel SIEM

The cloud-native Microsoft Sentinel SIEM solution delivers AI-powered security across multicloud and multiplatform environments. It provides comprehensive capabilities for threat detection, investigation, response, and proactive hunting, giving security teams a unified view of their enterprise.

Microsoft Sentinel SIEM is available in the Microsoft Defender portal - for customers with or without Defender XDR or an E5 license - offering a unified security operations experience. This integration streamlines workflows, enhances visibility, and helps analysts respond faster and more precisely to increasingly complex threats.

The integration of Microsoft Sentinel SIEM with the Defender portal and Security Copilot creates a powerful ecosystem that enhances security operations. Security Copilot enables analysts to interact with Microsoft Sentinel data using natural language, generate hunting queries, and automate investigations, making threat response faster and more accessible.

For more information, see [What is Microsoft Sentinel SIEM?](./overview.md).

### Data connectors

Collect data across your entire digital estate wherever the data resides, including all users, devices, applications, and infrastructure, both on-premises and in multiple clouds:

- 350+ out-of-the-box data connectors with support for first and third-party security solutions and cloud platforms

- A built-in table management experience that simplifies selecting data storage, supporting tiered placement across analytic and data lake tiers.

- Data ingested into the analytics tier is automatically mirrored in the data lake tier, ensuring data lake tier remains the central, unified repository for all security data.

- No-code and custom connector options

- Data normalization to translate various sources into a uniform, normalized view

For more information, see [Microsoft Sentinel data connectors](./connect-data-sources.md).


## Core components of the Microsoft Sentinel platform

### Microsoft Sentinel data lake

Microsoft Sentinel data lake is a fully managed, cloud-native data lake purpose-built for security operations. It unifies, retains, and analyzes security data at scale - providing the foundation for advanced analytics, AI-driven insights, and agentic defense.

Designed for flexibility and depth, the data lake supports multi-modal analytics - including Kusto queries, graph-based relationship analysis, Microsoft Modeling Language (MML), Security Copilot agents, and AI-powered notebooks in Visual Studio Code - all on a single copy of open-format data.

With cost-efficient storage and long-term retention, security teams can investigate persistent threats, enrich alerts with historical context, and build behavioral baselines using months of data, without the overhead of traditional infrastructure.

Microsoft Sentinel data lake's key capabilities include:

- Centralizes logs from Microsoft 365, Defender, Azure, Microsoft Entra, Microsoft Purview, Microsoft Intune, and over 350 data connectors - including Amazon Web Services (AWS) and Google Cloud Platform (GCP) - to eliminate data silos.

- Optimizes costs by decoupling data ingestion from analytics, so you can store massive volumes of security data and apply the most effective analytic engines for tasks like threat hunting, anomaly detection, and deep forensic investigations.

- Enables multi-modal analytics on a single copy of open-format data using Kusto queries, scheduled jobs, and AI-powered notebooks in Visual Studio Code - no infrastructure setup required.

For more information, see [What is Microsoft Sentinel data lake?](../sentinel/datalake/sentinel-lake-overview.md).


### Microsoft Sentinel graph

Microsoft Sentinel graph provides unified graph analytics capability by modeling and analyzing complex relationships across assets, identities, activities, and threat intelligence. It enables Microsoft Defenders and AI agents to reason over interconnected data, offering deeper insights and faster response to cyber threats.

Microsoft Sentinel graph's key capabilities include:

- Unified graph-based analytics that power built-in experiences across security, compliance, identity, and the Microsoft Security ecosystem.
- Real-world relationship modeling that uses nodes and edges to represent users, devices, cloud resources, data flows, and attacker actions.
- Enhanced threat reasoning to help Defenders answer complex questions, such as which vulnerable paths an attacker could take from a compromised entity to a critical asset.
- End-to-end defense with support for both pre-breach and post-breach scenarios, using interconnected graphs across Microsoft Defender and Microsoft Purview.

For more information, see [What is Microsoft Sentinel graph?](../sentinel/datalake/sentinel-graph-overview.md).

### Microsoft Sentinel model context protocol (MCP) server

Microsoft Sentinel MCP server provides a unified, hosted interface that enables security teams to interact with security data using natural language and build intelligent security agents - without infrastructure setup or custom connectors.  This integration simplifies data exploration and automation, making AI-driven security operations more accessible and effective.

Microsoft Sentinel MCP server's key capabilities include:

- A hosted interface that uses Microsoft Entra for identity and supports compatible clients for seamless AI operations.
- Natural language security tooling, including scenario-focused tools for querying and reasoning over Microsoft Sentinel data lake without schema knowledge or coding.
- Accelerated agent creation whereby engineers can build customized security agents using natural language, reducing manual effort and speeding up automation.
- Native integration with Microsoft Sentinel’s data lake enables rich context engineering without compromising on data coverage or cost.

For more information, see [What is Microsoft Sentinel’s support for Model Context Protocol (MCP)?](../sentinel/datalake/sentinel-mcp-overview.md).

## Microsoft Sentinel developer experience

Microsoft Sentinel offers extensive capabilities for partners to create impactful solutions they can publish through the Microsoft Security Store or the Microsoft Sentinel SIEM Content Hub. Building on top of Microsoft Sentinel lets you support new scenarios using a wide range of security data, processing capabilities, and AI experiences, without the need for new pipelines, compute engines, or storage infrastructure. 

For example, partners can create, package, and publish: 

- Microsoft Sentinel SIEM content such as connectors, analytic rules, hunting queries, and playbooks. 
- Microsoft Sentinel platform content, such as connectors, Jupyter notebook jobs to analyze the data, and agents that correlate that data with existing lake content. The agent can then interact with other endpoints and external applications to provide customers with a powerful unified experience. 

For more information, see [Build and publish Microsoft Sentinel solutions](./partner-integrations.md).

## Get started

To get started with the Microsoft Sentinel platform and SIEM, see:

- [Onboard Microsoft Sentinel](quickstart-onboard.md)
- [Onboard to Microsoft Sentinel data lake and Microsoft Sentinel graph](../sentinel/datalake/sentinel-lake-onboarding.md)
- [Microsoft Sentinel data connector](../sentinel/connect-data-sources.md)
- [Get started with Microsoft Sentinel MCP server (preview)](../sentinel/datalake/sentinel-mcp-get-started.md)
- [Manage data tiers and retention in Microsoft Defender Portal (preview)](./manage-data-overview.md)
- [Manage and monitor costs for Microsoft Sentinel](./billing-monitor-costs.md)
- [Jupyter notebooks in the Microsoft Sentinel data lake](../sentinel/datalake/notebooks-overview.md)
- [Build and publish Microsoft Sentinel solutions](../sentinel/partner-integrations.md)