---
title: What is the Microsoft Sentinel Platform?
description: Learn about Microsoft Sentinel, which consolidates security telemetry in a cloud-native data lake and graph, enabling cost‑efficient retention, KQL/AI analytics, and automated SOAR workflows with MCP support.
author: guywi-ms
ms.author: guywild
ms.topic: overview
ms.service: microsoft-sentinel
ms.date: 09/14/2025
ms.custom: sfi-image-nochange

Customer intent: As a security or IT decision‑maker evaluating SIEM/SOAR options, I need to assess Microsoft Sentinel’s cloud‑native, fully managed architecture—centered on the Sentinel data lake and Graph—that explains integrations, analytics and AI capabilities, automation and SOAR workflows, operational benefits, and governance posture so I can determine fit for our security, operational, and migration requirements.

---

# What is the Microsoft Sentinel Platform

Microsoft Sentinel is an AI-first security platform designed to unify security data, scale dynamically, and enable agentic automation across heterogeneous environments. Anchored by the Microsoft Sentinel data lake, it serves as the foundation of modern cybersecurity operations, delivering proactive, AI-enhanced defense capabilities that adapt to evolving threats.

:::image type="content" source="media/sentinel-platform-overview/microsoft sentinel platform.png" alt-text="A diagram that depicts the Microsoft Sentinel platform overview" link="media/sentinel-platform-overview/microsoft sentinel platform.png" lightbox="media/sentinel-platform-overview/microsoft sentinel platform.png":::

## Core Components of the Microsoft Sentinel Platform

## Microsoft Sentinel data lake

Microsoft Sentinel data lake is a cloud-native, fully managed data lake purpose-built for security operations and designed to unify, retain, and analyze all your organization’s security data at scale.

- Eliminate data silos by centralizing security logs from Microsoft 365, Defender, Azure, Entra, Purview, Intune, and over 350 data connectors including AWS and GCP. 

- Delivers a cost-optimized security strategy by decoupling data ingestion from analytics, giving SOC teams the freedom to store massive security data volumes and apply the most effective analytic engines for targeted use cases like threat hunting, anomaly detection, and deep forensic investigations.

- Enables multi-modal security analytics on a single copy of open-format data using Kusto queries, scheduled jobs, and AI-powered notebooks via Visual Studio Code extension, allowing promotion of insights to the analytics tier without infrastructure setup.

Learn more at [Microsoft Sentinel data lake overview (preview)](../sentinel/datalake/sentinel-lake-overview.md).

## Data connectors

Collect data across your entire digital estate wherever the data resides, including all users, devices, applications, and infrastructure, both on-premises and in multiple clouds:

-  350+ out-of-the-box data connectors with support for first and third-party security solutions and cloud platforms

- A built-in table management experience that simplifies selecting data storage, supporting tiered placement across analytic and data lake tiers.

- Data ingested into the analytics tier is automatically mirrored in the data lake tier, ensuring data lake tier remains the central, unified repository for all security data.

- No-code and custom connector options

- Data normalization to translate various sources into a uniform, normalized view

Learn more at [Microsoft Sentinel data connectors](./connect-data-sources).

## Sentinel graph

Graph-based analytics enable deep visibility into threat relationships and attack paths: 

- Instantly visualize the scope of an incident, including at-risk users and systems, with Blast Radius in Microsoft Defender’s Incident graph, enabling faster containment and remediation by prioritizing top targets reachable via compromised credentials.

- Proactively discover threats by mapping and visualizing user-device relationships and privileged access paths to critical assets with Hunting graph in Microsoft Defender, enabling a shift from reactive alert response to strategic vulnerability identification.

- Enable data security teams to trace sensitive data movement across platforms, assess the full impact of insider activity, and take targeted actions to prevent future leaks with data risks graph in Purview Insider Risk Management (IRM).

- Identify and map sensitive data access and movement by correlating audit logs, Entra logs, and threat intelligence using Purview Data Risk Graph within Purview Data Security Investigation (DSI), enabling rapid scoping of potential exfiltration and visualization of risky user-file interactions.

Learn more at https://aka.ms/sentinel/platform/graph.

## Model Context Protocol (MCP) server

The MCP server acts as a secure bridge between Security Copilot agents and Sentinel data:

-  Enables Security Copilot to interact with Sentinel data using plain language, eliminating the need for KQL queries, eliminating the need for KQL queries or custom connectors, making security data more accessible to all security analysts.

- Standardized tools and schemas that simplify the creation and deployment of Security Copilot agents, allowing SOC teams to discover, invoke, and reuse tools efficiently.

- Improves accuracy and reliability of investigations and automation. By using typed schemas and predictable tool discovery, MCP reduces AI hallucinations and ensures more reliable outputs during investigations and automation.

- Flexible and scalable automation by enabling SOC teams to convert KQL or GQL queries into reusable MCP tools that can be invoked via natural language.

- Unify security context and use cases by using MCP to integrate with the Sentinel data lake and Sentinel graph to enhance threat detection, investigation, and response workflows, with practical applications like querying failed sign-in attempts and building agents through the Security Copilot Portal.

Learn more at [What is MCP? (Preview) - Microsoft Security | Microsoft Learn](../sentinel/datalake/sentinel-mcp-overview.md).

## Get started

To get started with Microsoft Sentinel data lake and Sentinel graph, follow these steps in the [onboarding guide](../sentinel/datalake/sentinel-lake-onboarding.md). For more information on using other capabilties, see the following articles:

- [Jupyter notebooks in the Microsoft Sentinel data lake (preview)](../sentinel/datalake/notebooks-overview.md).
- [KQL and the Microsoft Sentinel data lake (preview)](../sentinel/datalake/kql-overview.md)
- [Permissions for the Microsoft Sentinel data lake (preview)](./roles#roles-and-permissions-for-the-microsoft-sentinel-data-lake-preview)
- [Manage data tiers and retention in Microsoft Defender Portal (preview)](./manage-data-overview)
- [Manage and monitor costs for Microsoft Sentinel](./billing-monitor-costs.md)