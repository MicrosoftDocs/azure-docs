---
title: Use deep investigation in Azure SRE Agent Preview
description: Use a hypothesis-driven approach to explore multiple potential root causes before acting on mitigation steps.
author: craigshoemaker
ms.author: cshoe
ms.topic: tutorial
ms.date: 11/04/2025
ms.service: azure
---

# Use deep investigation in Azure SRE Agent Preview

Deep investigation gives you greater transparency and accuracy when diagnosing complex issues in the SRE Agent. Unlike standard queries that provide quick insights, deep investigation uses a hypothesis-driven approach so you can explore multiple potential root causes before you decide on mitigation steps.

Use deep investigation when:

- You're investigating **high-impact, complex issues**, such as production-level outages or critical incidents.
- You suspect **multiple root causes**, requiring systematic validation.
- You need **visibility into the agent’s reasoning process**, similar to war room investigations.

For simple queries, standard investigation is often all you need. However, when you encounter cases where you suspect you need a structured, multi-path analysis to locate the root cause, then use deep investigation.

## How deep investigation works

Deep investigation uses a hypothesis-driven approach that goes beyond surface-level checks. Instead of stopping at the first plausible explanation, the agent systematically explores and validates multiple possibilities, and provides a transparent view of its reasoning.

Here’s an example:

1. **Initial investigation**: The agent analyzes your prompt and gathers relevant logs, metrics, and contextual data. This step ensures the investigation starts with a solid foundation, similar to how an engineer reviews system health before forming conclusions.

1. **Hypothesis generation**: Instead of jumping to a single answer, the agent creates two to four high-level hypotheses about potential root causes. These hypotheses represent different investigative paths to provide a structured starting point for deeper analysis. These paths could include scenarios such as database load, network latency, or configuration drift.

1. **Validation process**: The agent tests each hypothesis through iterative checks. If a hypothesis appears valid, the agent digs deeper, generating subhypotheses to uncover contributing factors. For example, a validated "High DB load" hypothesis might lead to checks for query spikes or index fragmentation. The agent documents invalid hypotheses so you know what it ruled out, which is critical in complex troubleshooting scenarios.

1. **Mitigation strategies**: After the agent confirms one or more root causes, it suggests actionable remediation steps. These steps can include rolling back a deployment, adjusting resource allocations, or applying configuration fixes. The goal isn't just to identify problems but to guide resolution.

1. **Structured output**: The agent presents all findings, which include validated and invalidated hypotheses, in a clear, visual format. This transparency helps you understand the reasoning process, making it easier to trust and act on recommendations.

## Enable deep investigation

To enable deep investigation in your chat, select the deep investigation (:::image type="icon" source="media/deep-investigation/sre-agent-deep-investigation-icon.png" border="false":::) icon in your chat before submitting your query.

:::image type="content" source="media/deep-investigation/sre-agent-chat-window-deep-investigation.png" alt-text="Screenshot of Azure SRE Agent highlighting the deep investigation button.":::

## Related content

- [Incident management overview](incident-management.md)
