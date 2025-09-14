---
title: What is the Microsoft Sentinel Platform?
description: Learn about Microsoft Sentinel, which consolidates security telemetry in a cloud-native data lake and graph, enabling cost‑efficient retention, KQL/AI analytics, and automated SOAR workflows with MCP support.
author: guywi-ms
ms.author: guywild
ms.topic: overview
ms.service: microsoft-sentinel
ms.date: 09/14/2025
ms.custom: sfi-image-nochange

Customer intent: As a security or IT decision‑maker, I need to assess Microsoft Sentinel’s cloud‑native, fully managed architecture - centered on the Sentinel data lake and Graph - so I can determine fit for our security, operational, and migration requirements.

---

# What is the Microsoft Sentinel?

Microsoft Sentinel is an AI-first security platform and cloud-native security information and event management (SIEM) that consolidates security data, scales dynamically, and enables agentic automation across hybrid environments. Anchored by the Microsoft Sentinel data lake, it serves as the foundation of modern cybersecurity operations, delivering proactive, AI-enhanced defense capabilities that adapt to evolving threats.

This article provides an overview of Microsoft Sentinel, its core components, and how it empowers security operations teams to detect, investigate, and respond to threats efficiently.

## Microsoft Sentinel architecture overview

This diagram illustrates the high-level architecture of the Microsoft Sentinel platform and SIEM, highlighting its core components.

:::image type="content" source="media/sentinel-platform-overview/microsoft sentinel platform.png" alt-text="A diagram that depicts the Microsoft Sentinel platform overview" link="media/sentinel-platform-overview/microsoft sentinel platform.png" lightbox="media/sentinel-platform-overview/microsoft sentinel platform.png":::

## Core components of the Microsoft Sentinel platform

### Microsoft Sentinel data lake

Microsoft Sentinel data lake is a cloud-native, fully managed data lake purpose-built for security operations and designed to unify, retain, and analyze all your organization’s security data at scale.

The data lake:

- Centralizes logs from Microsoft 365, Defender, Azure, Microsoft Entra, Purview, Intune, and over 350 data connectors—including Amazon Web Services (AWS) and Google Cloud Platform (GCP)—to eliminate data silos.

- Optimizes costs by decoupling data ingestion from analytics, so you can store massive volumes of security data and apply the most effective analytic engines for tasks like threat hunting, anomaly detection, and deep forensic investigations.

- Enables multi-modal analytics on a single copy of open-format data using Kusto queries, scheduled jobs, and AI-powered notebooks in Visual Studio Code - no infrastructure setup required.

For more information, see [Microsoft Sentinel data lake overview (preview)](../sentinel/datalake/sentinel-lake-overview.md).

### Data connectors

Collect data across your entire digital estate wherever the data resides, including all users, devices, applications, and infrastructure, both on-premises and in multiple clouds:

-  350+ out-of-the-box data connectors with support for first and third-party security solutions and cloud platforms

- A built-in table management experience that simplifies selecting data storage, supporting tiered placement across analytic and data lake tiers.

- Data ingested into the analytics tier is automatically mirrored in the data lake tier, ensuring data lake tier remains the central, unified repository for all security data.

- No-code and custom connector options

- Data normalization to translate various sources into a uniform, normalized view

For more information, see [Microsoft Sentinel data connectors](./connect-data-sources.md).

### Microsoft Sentinel graph

Graph-based analytics enable deep visibility into threat relationships and attack paths: 

- Instantly visualize the scope of an incident, including at-risk users and systems, with Blast Radius in Microsoft Defender’s Incident graph, enabling faster containment and remediation by prioritizing top targets reachable via compromised credentials.

- Proactively discover threats by mapping and visualizing user-device relationships and privileged access paths to critical assets with Hunting graph in Microsoft Defender, enabling a shift from reactive alert response to strategic vulnerability identification.

- Enable data security teams to trace sensitive data movement across platforms, assess the full impact of insider activity, and take targeted actions to prevent future leaks with data risks graph in Purview Insider Risk Management (IRM).

- Identify and map sensitive data access and movement by correlating audit logs, Microsoft Entra logs, and threat intelligence using Purview Data Risk Graph within Purview Data Security Investigation (DSI), enabling rapid scoping of potential exfiltration and visualization of risky user-file interactions.

For more information, see https://aka.ms/sentinel/platform/graph.

### Model Context Protocol (MCP) server

The MCP server acts as a secure bridge between Security Copilot agents and Microsoft Sentinel data:

-  Enables Security Copilot to interact with Microsoft Sentinel data using plain language, eliminating the need for KQL queries, eliminating the need for KQL queries or custom connectors, making security data more accessible to all security analysts.

- Standardized tools and schemas that simplify the creation and deployment of Security Copilot agents, allowing SOC teams to discover, invoke, and reuse tools efficiently.

- Improves accuracy and reliability of investigations and automation. By using typed schemas and predictable tool discovery, MCP reduces AI hallucinations and ensures more reliable outputs during investigations and automation.

- Flexible and scalable automation by enabling SOC teams to convert KQL or GQL queries into reusable MCP tools that can be invoked via natural language.

- Unify security context and use cases by using MCP to integrate with the Microsoft Sentinel data lake and Microsoft Sentinel graph to enhance threat detection, investigation, and response workflows, with practical applications like querying failed sign-in attempts and building agents through the Security Copilot Portal.

For more information, see [What is MCP? (Preview) - Microsoft Security | Microsoft Learn](../sentinel/datalake/sentinel-mcp-overview.md).

## Microsoft Sentinel SIEM

## Get started

To get started with Microsoft Sentinel data lake and Microsoft Sentinel graph, follow these steps in the [onboarding guide](../sentinel/datalake/sentinel-lake-onboarding.md). For more information on using other capabilities, see the following articles:

- [Jupyter notebooks in the Microsoft Sentinel data lake (preview)](../sentinel/datalake/notebooks-overview.md).
- [KQL and the Microsoft Sentinel data lake (preview)](../sentinel/datalake/kql-overview.md)
- [Permissions for the Microsoft Sentinel data lake (preview)](./roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake)
- [Manage data tiers and retention in Microsoft Defender Portal (preview)](./manage-data-overview.md)
- [Manage and monitor costs for Microsoft Sentinel](./billing-monitor-costs.md)