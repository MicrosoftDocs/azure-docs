---
title: Live Reports in Azure SRE Agent (preview)
description: Create, refresh, share, and govern reusable dashboards built from your agent's connected operational data.
ms.topic: feature-guide
ms.service: azure-sre-agent
ms.date: 08/21/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
ms.custom: live-reports, dashboards, visualization, connectors, reporting
#customer intent: As an SRE, I want to create reusable operational reports so that my team can monitor current data without rebuilding the same view.
---

# Live reports in Azure SRE Agent (preview)

Live reports are saved, reusable operational dashboards with a consistent layout and refreshable data. Describe the view you need in chat, and Azure SRE Agent builds and saves it on the **Live Reports** page.

After you create a report, its charts and tables remain consistent while the data can be refreshed. Refreshes that only retrieve data through connectors don't consume active-flow Azure Agent Units (AAUs), which can reduce repeated model costs for frequently used operational views. If a report uses a model to summarize or analyze the retrieved data, that model-assisted analysis consumes active-flow AAUs.

Use live reports for recurring operational views such as deployment health, service trends, Kusto data, work items, and internal services exposed through MCP.

## How live reports work

Azure SRE Agent builds a report from the data sources available to your agent and saves its layout and configuration. When you open or reload the report, it retrieves data through the configured connectors and presents the results using the saved charts, tables, and status indicators.

Reports can use connector results cached for up to five minutes. Select **Reload** to retrieve current data. If a report includes model-assisted analysis, the model can classify, group, or summarize the retrieved data.

## What you can include in a report

Reports support the following content:

| Report content | What you can include |
| --- | --- |
| **Connected data** | Data from supported MCP connectors, including Azure Data Explorer (Kusto). |
| **Model-assisted analysis** | Optional classification, grouping, and summarization of retrieved data. Model-assisted analysis consumes active-flow AAUs. |
| **Visualizations** | Charts, sortable tables, diagrams, and status indicators. |

## Prerequisites

To use Live Reports, you need read and write permissions on the agent. To learn how to assign access, see [User roles and permissions](user-roles.md).

A report can retrieve data only through connectors already configured for the agent and within the permissions granted to the agent or connector identity. Creating a report doesn't add a connector or grant access to another system.

## Create a live report

1. Open your SRE Agent.

1. Select **Live Reports** in the navigation.

1. Select **+ New report**. The agent verifies which tools are available.

1. Describe the report you want when prompted and answer any additional questions from the agent.

1. Review the tools the report will use. Approve only the tools and behavior you expect.

1. Wait for the report to save and appear in the gallery.

When generating live reports, include the time range, filters, data sources, and preferred visualization. Here are some example prompts for generating live reports:

### Kusto service trends report

```text
Build a Live Report called "Kusto Service Trends" from my Azure Data Explorer
connector. Cover the last 24 hours and show request volume, error rate, and
p50/p95/p99 latency by service. Include a time-range selector, trend charts,
and a sortable table of operations with the highest error counts.
```

### Deployment health report

```text
Build a Live Report called "Deployment Health" for the last 24 hours. Show
deployment volume, success rate, failed deployments by service and environment,
and a daily trend. Include a sortable table that links to each deployment.
```

## Open, refresh, and update a report

After the agent saves a report:

1. Return to **Live Reports**, and select the report tile.

1. Review the current charts, tables, and status indicators.

1. Select **Reload** to bypass cached tool results and request fresh data.

1. Select **Open authoring thread** to change the layout, filters, data sources, or actions. Describe the change in chat and let the agent save a new version.

1. Open the version picker to inspect an earlier saved version. Select the current version before relying on interactive tool calls.

Earlier versions preserve the report layout and configuration, not historical data. Interactive sections use the current version's tool policy.

## Share, export, or delete a report

In the Azure portal, select **Copy link to report** to share a report. Sharing a link doesn't grant access. The recipient must already have the SRE Agent Standard User or SRE Agent Administrator role on the agent.

Select **Download HTML** from the overflow menu to save a sanitized, static snapshot. The downloaded file can't call SRE Agent tools or load external resources. Handle it according to the data's sensitivity.

To permanently remove a report, select **Delete** from the overflow menu. You must have the SRE Agent Administrator role.

## Usage and costs

Creating a live report or updating an existing one consumes [active-flow](pricing-billing.md#active-flow-variable-cost) AAUs. After the report is created, refreshing it doesn't consume active-flow AAUs when it only retrieves data through connector tools. If the report uses an LLM on refresh to summarize or analyze data, those model calls consume active-flow AAUs.

AAUs consumed while creating or updating a report appear in **Settings** > **Agent consumption**.

For current rates, see [Pricing and billing](pricing-billing.md).

> [!NOTE]
> The preview doesn't provide a per-report or per-user active-flow AAU budget for model-assisted sections. Be mindful of potential costs, and avoid reports that run the model repeatedly or automatically in a loop.

## Run actions from a report

A report can include buttons that invoke tools, such as posting an update or starting a workflow.

The saved report version must include the tool. When the report invokes the tool, the agent applies the configured tool policies and connector permissions. Allowed tools run without approval. If a call requires approval, the approval applies only to that invocation and the exact arguments shown. A call with different arguments requires another approval.

Changing a report in the browser doesn't add tool access. Your SRE Agent role, tool policies, approval requirements, and agent or connector permissions still apply.

Start shared dashboards with read-only tools. Add write actions only when they provide a clear operational benefit. For more information, see [Tool access policies](tool-access-policies.md) and [Security overview](security-overview.md).

## Limitations

During preview, the following limitations apply:

- **Cross-tenant approvals:** If you access an agent from another tenant, you can't approve report tool calls because the SRE Agent Administrator role isn't available across tenants. Reports shared across tenants should avoid tools that require approval.

- **Report size:** Generated report HTML must be 10 MB or smaller. The service rejects a larger report when it tries to save it.

- **Model rate limits:** If the model is rate-limited, the section returns HTTP 429. Retry the report later.

## Troubleshooting

The following items can help you troubleshoot issues with your live reports.

### The agent can't create the report

Confirm that you have read and write permissions on the agent and that the required connector is connected and healthy.

### The data looks stale

Select **Reload** to bypass the short-lived tool result cache. Also confirm that the underlying source has received the expected data.

## Related content

- [MCP connectors and tools](mcp-connectors.md)
- [Operations Hub](operations-hub.md)
- [Agent playground](agent-playground.md)
- [Audit agent actions](audit-agent-actions.md)
- [User roles and permissions](user-roles.md)
- [Agent permissions](permissions.md)
