---
title: Overview of Operations Hub in Azure SRE Agent
description: Learn how Operations Hub provides real-time visibility into your Azure SRE Agent health, incident effectiveness, and automation reliability across your environment.
ms.topic: concept-article
ms.date: 05/14/2026
author: craigshoemaker
ms.author: cshoe
ms.service: azure-sre-agent
---

# Overview of operations hub in Azure SRE Agent overview

The SRE Agent operations hub gives you real-time visibility into how your Azure SRE Agent performs across incidents, automations, integrations, and operational health in one place. Instead of checking individual threads, setup pages, and automation runs separately, you see the unified signals that matter: agent health, pending actions, connector readiness, and automation reliability.

## What is operations hub?

Operations Hub consolidates operational intelligence about your SRE Agent into three focused dashboards. Without a central view, teams reconstruct agent state manually by opening individual incident threads, checking automations one by one, and reviewing integrations across separate pages. This manual approach doesn't scale. Operations hub moves your team from reactive investigation to proactive management by surfacing leading indicators of issues before they impact incident response.

## Key tabs and capabilities

Operations hub organizes system-level visibility into three tabs. Each tab answers a different operational question:

### Overview tab

**Question:** What needs my attention right now?

The Overview tab displays a time-based summary of recent activity, pending actions, system health status, and data source readiness. You get a quick operational snapshot of your agent without navigating between setup pages, usage dashboards, and individual incident threads.

Key signals include:

- **Pending actions**: Items awaiting user response or approval

- **System health**: Overall agent operational status

- **Data source readiness**: Connector and integration configuration status

- **Activity summary**: Recent incident threads and automation runs

### Incident Analytics tab

**Question:** Is the agent actually helping during incidents?

Incident Analytics measures effectiveness, not just activity. You evaluate whether your SRE Agent saves time, improves mitigation speed, and meaningfully contributes to incident response across all your incident sources (Azure Monitor, ServiceNow, PagerDuty, IcM, and others).

A busy agent isn't necessarily a useful agent. Incident Analytics helps you distinguish between work performed and value delivered to your incident response process.

### Automation tab

**Question:** Are my recurring and event-driven workflows healthy and reliable?

As your scheduled tasks and HTTP triggers grow, individual workflow checks become inefficient. The Automation tab surfaces reliability patterns such as success rates, run duration trends, and failure clustering, so you spot issues early with full context.

Common patterns you detect:

- Declining success rates over time
- Increasing run durations
- Specific automations failing repeatedly

## How operations hub improves your operations

Operations Hub shifts your team from reactive investigation to proactive management. Instead of discovering issues after opening a thread or reviewing failed workflows, you see leading indicators early:

- **Pending action buildup**: Actions waiting on approval or user input
- **Connector degradation**: Integration health declining over time
- **Activity trend changes**: Shifts in agent usage patterns
- **Automation reliability decline**: Increasing failure rates or run duration
- **Incident effectiveness shifts**: Changes suggesting reduced incident response impact

This proactive visibility builds trust in your SRE Agent. Teams rely more confidently on the agent when they can monitor its behavior at a glance, rather than only after problems occur.

## When to use operations hub

Use operations hub when you need to:

- **Monitor overall agent health**: Get a system view rather than checking individual components

- **Track incident response contribution**: Measure whether the agent improves your incident outcomes

- **Manage automation reliability**: Identify patterns in automation performance before they cause outages

- **Establish operational baselines**: Understand normal behavior to spot anomalies early

## Limitations

- Operations hub displays data for the last 30 days by default; historical data beyond this period requires archival queries

- Automation analytics currently support runs triggered from operations hub UI; webhook and programmatic triggers have limited visibility in early releases

## Related content

- [Overview of Azure SRE Agent](overview.md): Learn about SRE Agent core capabilities and use cases.
- [Connectors in Azure SRE Agent](connectors.md): Set up incident sources and automation integrations.
- [MCP connectors and tools](mcp-connectors.md): Understand the Model Context Protocol integration for agent extensibility.
