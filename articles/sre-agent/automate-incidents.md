---
title: "Tutorial: Automate Incident Response in Azure SRE Agent"
description: Connect Azure Monitor, create a response plan, and see how your agent investigates matching alerts.
ms.topic: tutorial
ms.date: 08/21/2026
author: craigshoemaker
ms.author: cshoe
ms.service: azure-sre-agent
ms.ai-usage: ai-assisted
#customer intent: As a site reliability engineer, I want to connect my incident platform and create response plans so that my agent investigates matching incidents with the configured level of autonomy.
---

# Tutorial: Automate incident response in Azure SRE Agent

**Estimated time**: 10 minutes

Connect your incident platform and configure how your agent investigates matching alerts.

## What you accomplish

By the end of this step, your agent:

- Connects to Azure Monitor as your incident platform
- Receives incidents filtered by severity through a response plan
- Investigates matching alerts and reports its findings

## Prerequisites

| Requirement | Details |
|---|---|
| **Completed Steps 1–3** | [Create and set up](create-and-set-up.md), [Team onboarding](team-onboard.md), and [First investigation](first-investigation.md). |
| **For the end-to-end example** | A connected code repository and logging provider, a non-production Azure Monitor test alert, and permission to approve proposed actions. |

## Connect Azure Monitor

Link Azure Monitor as your incident platform so the agent automatically receives alerts.

1. In the left sidebar, go to **Incidents** > **Triggers + response plans**.
1. If no incident platform is connected, select **Connect an incident platform**.
1. In **Choose platform**, select **Azure Monitor**.
1. In **Connect to platform**, complete the required fields, and then select **Save** to connect Azure Monitor.

Wait for the connection to complete. The status changes to **"Azure Monitor connected. Your next step is to set up incident response plans."**

**Checkpoint:** The incident platform page shows a green checkmark with **Azure Monitor connected**.

> [!TIP]
> You can also connect [PagerDuty](pagerduty-incidents.md) or [ServiceNow](servicenow-incidents.md) from the platform picker.

## Create an incident response plan

An incident response plan tells the agent which incidents to pick up and how much autonomy it has. The following steps are for Azure Monitor. PagerDuty and ServiceNow response plans use different filter fields based on their own incident metadata, such as priority, category, and assignment group.

1. Go to **Incidents** > **Triggers + response plans**.

1. Open the creation dialog:
   - If no response plans exist, select **Add an incident response plan**.
   - If a response plan already exists, select **Create a response plan**.

1. In **Step 1: Response plan**, configure the response plan details:

   - In **Incident response plan name**, enter a descriptive name, such as `test-alerts-review`.
   - In **Severity**, select the severity used by your non-production test alert.
   - In **Title contains**, enter text that appears in the test alert title.
   - In **Title does not contain**, add any title keywords that the plan should exclude.

   :::image type="content" source="media/automate-incidents/response-plan-details.png" alt-text="Screenshot of the Response plan step showing name, severity, title inclusion, and title exclusion filters." lightbox="media/automate-incidents/response-plan-details.png":::

1. In the same step, configure how the agent responds:

   - In **Response subagent**, select the agent that should investigate matching alerts.
   - Under **Agent autonomy level**, select **Review** so proposed actions require approval. **Autonomous** is the default.
   - Optionally enable **Alert reinvestigation cooldown** and set the cooldown time to avoid reinvestigating the same alert repeatedly within that period.

1. Select **Next**.

   :::image type="content" source="media/automate-incidents/response-plan-behavior.png" alt-text="Screenshot of the Response plan step showing response subagent, autonomy level, and reinvestigation cooldown settings." lightbox="media/automate-incidents/response-plan-behavior.png":::

1. In **Step 2: Incidents preview**:
   - Select a lookback period, such as **Last 7 days**.
   - Review the matching alerts. If an expected alert is missing, select **Back** and adjust the filters.
   - An empty list means no alerts matched the current filters and lookback period.

1. Select **Create**.

   :::image type="content" source="media/automate-incidents/response-plan-incidents-preview.png" alt-text="Screenshot of the Incidents preview step showing the lookback selector, matching-alert table, and Create button." lightbox="media/automate-incidents/response-plan-incidents-preview.png":::

**Checkpoint:** Your response plan appears in the list with status **On** and mode **Review**.

## What happens when an alert fires

When Azure Monitor fires an alert that matches your response plan, the agent investigates automatically. What the agent does depends on the context you gave it. Runbooks, code repositories, Azure resources, and prior investigations all shape the depth and actions of the investigation.

### Example: HTTP 500 errors on a container app

In this example, the agent has a runbook for handling HTTP 500 errors, a connected code repository, and Azure resource access.

:::image type="content" source="media/automate-incidents/incident-completed.png" alt-text="Screenshot of the incidents page showing one completed Sev3 alert with green Completed status." lightbox="media/automate-incidents/incident-completed.png":::

**The agent builds a plan from your runbook.** Rather than following a generic troubleshooting sequence, the agent reads the HTTP 500 runbook you upload during onboarding and follows your team's procedures. The agent checks for upstream dependencies first, then connection pool, then recent deployments.

:::image type="content" source="media/automate-incidents/incident-full-page-top.png" alt-text="Screenshot of the agent showing investigation plan for HTTP 5xx alert with six numbered steps." lightbox="media/automate-incidents/incident-full-page-top.png":::

**The agent recalls prior knowledge.** If the agent investigated a similar issue before, it recognizes the pattern and skips discovery. It does this operation to combine your runbook procedures with what it learned from previous investigations.

**The agent proposes or takes action according to the selected mode.** In **Review** mode, the agent asks for approval before an action. In **Autonomous** mode, it can act within its configured permissions.

**The agent delivers an investigation summary.** The report explains what the agent found, the evidence it used, and the next action for your team.

> [!NOTE]
> Your results vary based on the context your agent has. An agent with more runbooks, connected repositories, and prior investigations produces deeper, more targeted responses.

## Next step

> [!div class="nextstepaction"]
> [Step 5: Automate workflows](automate-workflows.md)

## Related content

- [Incident response plans](incident-response-plans.md)
- [PagerDuty incidents](pagerduty-incidents.md)
- [ServiceNow incidents](servicenow-incidents.md)
- [Memory and knowledge](memory.md)
- [Monitor agent usage](monitor-agent-usage.md)
