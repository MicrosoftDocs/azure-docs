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

### Microsoft Sentinel Data Lake

Microsoft Sentinel data lake is a cloud-native, fully managed data lake purpose-built for security operations and designed to unify, retain, and analyze all your organization’s security data at scale.

- Eliminate data silos by centralizing security logs from Microsoft 365, Defender, Azure, Entra, Purview, Intune, and over 350 data connectors including AWS and GCP.
- Delivers a cost-optimized security strategy by decoupling data ingestion from analytics.
- Enables multi-modal security analytics using Kusto queries, scheduled jobs, and AI-powered notebooks via Visual Studio Code extension.

Learn more: [Microsoft Sentinel data lake overview (preview)](url_s://learn.microsoft.com/en-us/azure/sentinel/datalake/sentinel-lake-overview)

### Data Connectors

Collect data across your entire digital estate:

- 350+ out-of-the-box data connectors
- Built-in table management with tiered placement
- Analytics tier data mirrored in the data lake tier
- No-code and custom connector options
- Data normalization for unified views

Learn more: [Microsoft Sentinel data connectors](https://learn.microsoft.com/en-us/azure/sentinel/connect-data-sources)

### Sentinel Graph

Graph-based analytics enable deep visibility into threat relationships and attack paths:

- Visualize incident scope with Blast Radius
- Map user-device relationships and privileged access paths
- Trace sensitive data movement with Purview Insider Risk Management
- Correlate audit logs and threat intelligence using Purview Data Risk Graph

Learn more: [Sentinel Graph](https://aka.ms/sentinel/platform/graph)

### Model Context Protocol (MCP) Server

The MCP server acts as a secure bridge between Security Copilot agents and Sentinel data:

- Enables natural language interaction with Sentinel data
- Standardized tools and schemas for agent creation
- Reduces AI hallucinations and improves reliability
- Converts KQL/GQL queries into reusable MCP tools
- Integrates with Sentinel data lake and graph

Learn more: [What is MCP? (Preview)](https://review.learn.microsoft.com/en-us/azure/sentinel/datalake/mcp-overview?branch=pr-en-us-305360)

### Get Started

To get started with Microsoft Sentinel data lake and graph:

- [Onboarding guide](https://learn.microsoft.com/en-us/azure/sentinel/datalake/sentinel-lake-onboarding)
- [Jupyter notebooks in Sentinel data lake (preview)](https://learn.microsoft.com/en-us/azure/sentinel/datalake/notebooks-overview)
- [KQL and Sentinel data lake (preview)](https://learn.microsoft.com/en-us/azure/sentinel/datalake/kql-overview)
- [Permissions for Sentinel data lake (preview)](https://learn.microsoft.com/en-us/azure/sentinel/roles)
- [Manage data tiers and retention](https://aka.ms/manage-data-defender-portal-overview)
- [Monitor costs for Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/billing-monitor-costs)