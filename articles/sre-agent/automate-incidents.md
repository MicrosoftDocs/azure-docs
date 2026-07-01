---
title: "Tutorial: Automate Incident Response in Azure SRE Agent"
description: Connect Azure Monitor, create response plans, and let your agent investigate and resolve incidents autonomously from detection to fix.
ms.topic: tutorial
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.service: azure-sre-agent
ms.ai-usage: ai-assisted
#customer intent: As a site reliability engineer, I want to connect my incident platform and create response plans so that my agent automatically investigates and resolves incidents end-to-end.
---

# Tutorial: Automate incident response in Azure SRE Agent

**Estimated time**: 10 minutes

Connect your incident platform and let your agent handle alerts automatically. The system handles alerts from detection to diagnosis to fix, all without you typing a single message.

## What you accomplish

By the end of this step, your agent:

- Connects to Azure Monitor as your incident platform
- Receives incidents filtered by severity through a response plan
- Investigates matching alerts end-to-end, including code fixes and pull requests

## Prerequisites

| Requirement | Details |
|---|---|
| **Completed Steps 1–3** | [Create agent](create-agent.md), [Add knowledge](first-value.md), [Connect source code](connect-source-code.md). |
| **Azure resources connected** | At least one Azure subscription with resources the agent can monitor. |

## Connect Azure Monitor

Link Azure Monitor as your incident platform so the agent automatically receives alerts.

1. In the left sidebar, go to **Builder** > **Incident platform**.
1. Select the **Incident platform** dropdown and choose **Azure Monitor**.
1. The **Quickstart response plan** toggle is on by default. Turn it off as you create your own response plan in the next section.
1. Select **Save**.

Wait for the connection to complete. The status changes to **"Azure Monitor connected. Your next step is to set up incident response plans."**

:::image type="content" source="media/automate-incidents/response-plan-saved.png" alt-text="Screenshot of Azure Monitor connected with a green checkmark status." lightbox="media/automate-incidents/response-plan-saved.png":::

**Checkpoint:** The incident platform page shows a green checkmark with **Azure Monitor connected**.

> [!TIP]
> You can also connect [PagerDuty](pagerduty-incidents.md) or [ServiceNow](servicenow-incidents.md) from the same dropdown.

## Create an incident response plan

An incident response plan tells the agent which incidents to pick up and how much autonomy it has. The following steps are for Azure Monitor. PagerDuty and ServiceNow response plans use different filter fields based on their own incident metadata, such as priority, category, and assignment group.

1. Go to **Builder** > **Incident response plans** in the left sidebar.

1. Select **New incident response plan**.

1. **Step 1: Set up incident filters:**

   - Enter a name, such as `all-incidents`.
   - Select severity levels. Choose **All severity** to catch everything during setup.
   - Optionally, add a title filter to narrow scope.

1. Select **Next**.

   :::image type="content" source="media/automate-incidents/response-plan-step-1.png" alt-text="Screenshot of the response plan creation form with name and severity fields." lightbox="media/automate-incidents/response-plan-step-1.png":::

1. **Step 2: Preview filter results:** Review matching past incidents from your incident platform (empty if no incidents exist yet). Select **Next**.

1. **Step 3: Save response plan:**
   - Choose how much control the agent has:
     - **Autonomous (Default)**: The agent investigates and acts independently, including code fixes and container restarts.
     - **Review**: The agent diagnoses but waits for your approval before acting.
   - Select **Save**.

:::image type="content" source="media/automate-incidents/response-plan-step-3-save.png" alt-text="Screenshot of the response plan autonomy options showing Review and Autonomous modes." lightbox="media/automate-incidents/response-plan-step-3-save.png":::

**Checkpoint:** Your response plan appears in the list with status **On** and the autonomy level you selected.

## What happens when an alert fires

When Azure Monitor fires an alert that matches your response plan, the agent investigates automatically. What the agent does depends on the context you gave it. Runbooks, code repositories, Azure resources, and prior investigations all shape the depth and actions of the investigation.

### Example: HTTP 500 errors on a container app

In this example, the agent has a runbook for handling HTTP 500 errors, a connected code repository, and Azure resource access.

:::image type="content" source="media/automate-incidents/incident-completed.png" alt-text="Screenshot of the incidents page showing one completed Sev3 alert with green Completed status." lightbox="media/automate-incidents/incident-completed.png":::

**The agent builds a plan from your runbook.** Rather than following a generic troubleshooting sequence, the agent reads the HTTP 500 runbook you upload during onboarding and follows your team's procedures. The agent checks for upstream dependencies first, then connection pool, then recent deployments.

:::image type="content" source="media/automate-incidents/incident-full-page-top.png" alt-text="Screenshot of the agent showing investigation plan for HTTP 5xx alert with six numbered steps." lightbox="media/automate-incidents/incident-full-page-top.png":::

**The agent recalls prior knowledge.** If the agent investigated a similar issue before, it recognizes the pattern and skips discovery. It does this operation to combine your runbook procedures with what it learned from previous investigations.

**The agent takes action.** In **Review** mode, the agent asks for your approval before each action. In **Autonomous** mode, it acts independently. In this example, the agent:

- Reads the source code and identifies the root cause
- Edits the code to fix the bug
- Restarts the container to mitigate the alert
- Commits the fix and pushes it to a new branch
- Creates a GitHub issue for tracking
- Verifies the service is healthy after the fix

**The agent delivers a remediation summary.** The agent produces a structured report with everything the team needs to follow up:

:::image type="content" source="media/automate-incidents/incident-full-page-code-fix.png" alt-text="Screenshot of the remediation summary table showing alert, mitigation, permanent fix, root cause, status, and tracking." lightbox="media/automate-incidents/incident-full-page-code-fix.png":::

| Item | What the agent reports |
|---|---|
| **Alert** | Which alert fired, severity, affected resource |
| **Immediate mitigation** | What was done to restore service right now |
| **Permanent fix** | Code changes made and branch pushed |
| **Root cause** | Specific code bug or configuration issue with file references |
| **Status** | Current health of the affected resource |
| **Tracking** | GitHub issue number |
| **Next steps** | Merge pull request and redeploy |

> [!NOTE]
> Your results vary based on the context your agent has. An agent with more runbooks, connected repositories, and prior investigations produces deeper, more targeted responses.

## Next step

> [!div class="nextstepaction"]
> [Step 5: Automate actions](automate-actions.md)

## Related content

- [Incident response plans](incident-response-plans.md)
- [PagerDuty incidents](pagerduty-incidents.md)
- [ServiceNow incidents](servicenow-incidents.md)
- [Memory and knowledge](memory.md)
- [Monitor agent usage](monitor-agent-usage.md)
