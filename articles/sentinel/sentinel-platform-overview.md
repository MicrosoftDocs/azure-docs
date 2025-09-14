---
title: What is the Microsoft Sentinel Platform?
description: Learn about Microsoft Sentinel, a scalable, cloud-native SIEM and SOAR that uses AI, analytics, and automation for threat detection, investigation, and response.
author: guywi-ms
ms.author: guywild
ms.topic: overview
ms.service: microsoft-sentinel
ms.date: 09/14/2025
ms.custom: sfi-image-nochange

Customer intent: As a business decision-maker evaluating SIEM/SOAR solutions, I need a concise summary of Microsoft Sentinel’s cloud-native capabilities to decide whether it meets our security, compliance, and operational needs and to plan adoption or migration.

---

# What is the Microsoft Sentinel Platform?

Microsoft Sentinel is an AI-first security platform designed to unify security data, scale dynamically, and enable agentic automation across heterogeneous environments. Anchored by the Microsoft Sentinel data lake, it delivers proactive, AI-enhanced defense capabilities that adapt to evolving threats.

## Core Components of the Microsoft Sentinel Platform

### Microsoft Sentinel Data Lake

- Cloud-native, fully managed data lake for security operations.
- Centralizes logs from Microsoft 365, Defender, Azure, Entra, Purview, Intune, AWS, GCP, and more.
- Decouples ingestion from analytics for cost optimization.
- Supports Kusto queries, scheduled jobs, and AI-powered notebooks via VS Code.
- Promotes insights to analytics tier without infrastructure setup.

### Data Connectors

- 350+ out-of-the-box connectors for first- and third-party solutions.
- Supports multi-cloud, SaaS, and on-premises environments.
- Built-in table management and tiered data placement.
- No-code and custom connector options.
- Normalizes data for unified views.

### Graph-Based Analytics

- Visualize incident scope with Blast Radius in Microsoft Defender.
- Map user-device relationships and privileged access paths.
- Trace sensitive data movement with Purview Insider Risk Management.
- Correlate audit logs and threat intelligence using Purview Data Risk Graph.

### Model Context Protocol (MCP) Server

- Secure bridge between Security Copilot agents and Sentinel data.
- Enables natural language interaction with Sentinel data.
- Standardized tools and schemas for agent creation.
- Reduces AI hallucinations and improves reliability.
- Converts KQL/GQL queries into reusable MCP tools.

### Getting Started

- Follow onboarding guide for Sentinel Data Lake and Graph.
- Explore:
  - Jupyter notebooks
  - KQL usage
  - Permissions
  - Data tier management
