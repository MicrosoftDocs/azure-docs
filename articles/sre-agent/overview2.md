---
title: Azure SRE Agent overview (preview)
description: Learn how AI-enabled agents help solve problems and support resilient and self-healing systems on your behalf.
author: craigshoemaker
ms.topic: conceptual
ms.date: 08/20/2025
ms.author: cshoe
ms.service: azure
---

# Azure SRE Agent overview (preview)

**Transform reactive operations into proactive reliability for apps on Azure**

Azure SRE Agent is an AI-powered reliability assistant that helps you **prevent, diagnose, and resolve production issues faster with less toil**.  
Ask questions in natural language, get explainable RCAs, and orchestrate incident workflows with **human-in-the-loop approvals** or **autonomous execution within scoped guardrails**.

## What You Can Do with SRE Agent

| 🗨️ **Ask & Understand** | ⚙️ **Automate Incidents** | 🛡️ **Stay Proactive** |
|-------------------------|---------------------------|------------------------|
| Ask plain-language questions about Azure resources, incidents, and health. | Diagnose, mitigate, and resolve incidents across Azure Monitor and integrated tools like ServiceNow—automatically or with approvals. | Agent sends daily summaries of environment health, flags spikes in CPU/memory usage, and identifies resources not following security best practices. |
| **Examples:**<br>• What changed in *payments-prod* in last 24h?<br>• Which resources are unhealthy?<br>• What alerts are active now? | **Examples:**<br>• Incidents from ServiceNow<br>• 500 error alerts from Azure Monitor | **Examples:**<br>• Daily health summary for *prod-web*<br>• CPU spike detection<br>• Security compliance violations |

### 🎥 Watch the Overview Demo
https://img.youtube.com/vi/DRWppVNOTqQ/0.jpg](https://www.youtube.com/watch?v=DRWppVNOTqQ&t=12s)

## Key Capabilities

- ⚙️ **Incident Automation**  
  Diagnose, enrich, and orchestrate workflows across Azure Monitor and supported tools with **human-in-the-loop approvals** or **autonomous execution within scoped guardrails**.

- 🧠 **Explainable RCA**  
  Correlates metrics, logs, traces, recent deployments, and config diffs to propose likely causes and safe mitigations.

- 🛠️ **Dev Work Item Creation**  
  Automatically create developer work items in **GitHub** or **Azure DevOps**, linking incidents to commits, PRs, and deployment history. Includes repro steps, logs, and suspects to accelerate resolution.

- 💬 **Natural Language Insights**  
  Ask in plain English; SRE Agent translates to telemetry/config checks and returns concise answers with links and next steps.

## Integrations

- **Observability:** Azure Monitor (metrics, logs, traces), Application Insights  
- **Incidents & Work:** ServiceNow, PagerDuty, Jira, Azure Boards  
- **Source Code:** GitHub, Azure DevOps

## Quick Start

### 🧪 Try It Out (Prompts & Exploration)
1. Create a new agent in your subscription with Reader permissions.  
2. Try prompts like:  
   - *What changed in payments-prod in last 24h?*  
   - *What’s the CPU and memory utilization of my app?*  
3. Review suggested next steps and evidence.

### 🚨 Handle an Incident (End-to-End Flow)
1. Create a new agent in your subscription with Reader permissions.  
2. Enable integrations:  
   - Incident management tools (e.g., ServiceNow, PagerDuty)  
   - Ticketing systems (e.g., Jira, Azure Boards)  
   - Source code repositories (e.g., GitHub, Azure DevOps)  
3. Send a test incident to validate enrichment, RCA, and automation flow.  
4. Review incident context, RCA timeline, and proposed mitigations.

## Preview Notes

- **Public Preview:** Availability varies by region/tenant configuration.  
- **Pricing:** Preview billing begins **September 1, 2025**, using Azure Agent Units (AAU). See pricing page for details.
