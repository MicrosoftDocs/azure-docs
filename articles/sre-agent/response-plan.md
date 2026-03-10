---
title: "Tutorial: Set Up an Incident Trigger for Azure SRE Agent"
description: Create an incident trigger that routes specific incident types to a specialized subagent in the Subagent builder.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: incident trigger, response plan, filter, subagent, automation, tutorial
#customer intent: As an SRE, I want to set up an incident trigger so that matching incidents are automatically routed to the right subagent for investigation.
---

# Tutorial: Set up an incident trigger for Azure SRE Agent
In this tutorial, you create an incident trigger on the Subagent builder canvas that filters incidents by severity and service, and routes matching incidents to a specific subagent for automated investigation.

**Estimated time**: 5-10 minutes

In this tutorial, you:

> [!div class="checklist"]
> - Create an incident trigger from the Subagent builder canvas
> - Configure filter criteria (severity, service, type, title) to route incidents
> - Preview matching historical incidents before committing
> - Choose between Autonomous and Review autonomy levels for the response subagent

## Prerequisites

- An agent with an incident platform connected (PagerDuty, ServiceNow, or Azure Monitor)
- At least one subagent configured
- Contributor or Owner role on the agent resource

> [!NOTE]
> For more information about incident response plans and the problems they solve, see [Incident response plans](incident-response-plans.md).

## Open the Subagent builder

In the SRE Agent portal, select your agent. In the left sidebar, go to **Builder** > **Subagent builder**.

> [!WARNING]
> When you first connect an incident platform, the portal might automatically create a default **quickstart** response plan. Before you create custom triggers, check **Builder** > **Incident response plans** and delete the quickstart plan if it exists. Overlapping plans can cause incidents to be routed incorrectly or processed twice.

The canvas view loads, showing your subagent nodes, any existing trigger nodes, and connected tools.

:::image type="content" source="media/response-plan/incident-trigger-step-01-canvas.png" alt-text="Screenshot of the subagent builder canvas view showing subagent nodes and existing trigger nodes.":::

## Add an incident trigger to a subagent

Find the subagent you want to handle matching incidents and select the circular **+** button on the left side of the subagent node.

A menu appears with two groups. Under **Trigger**, select **Add incident trigger**.

:::image type="content" source="media/response-plan/incident-trigger-step-02-menu.png" alt-text="Screenshot of the menu showing Trigger group with Add incident trigger and Add scheduled task options.":::

The **Create incident trigger** dialog opens.

> [!NOTE]
> If no incident platform is connected, a warning message appears: "You need an incident platform to add an incident trigger." Select **Connect an incident platform** to set up an incident platform.

## Configure trigger details

The dialog shows a two-step wizard. In step 1 (**Incident trigger**), enter the filter criteria:

:::image type="content" source="media/response-plan/incident-trigger-step-03-dialog.png" alt-text="Screenshot of the Create incident trigger dialog showing trigger details form with fields for name, service, type, and priority.":::

1. **Trigger name**: Enter a descriptive name, such as `high-sev-api-trigger`.
1. **Impacted service**: Select the service this trigger covers from the dropdown.
1. **Incident type**: Choose the incident classification.
1. **Priority**: Select one or more severity levels. Select multiple options to combine them, such as P1 and P2.

    :::image type="content" source="media/response-plan/incident-trigger-step-04-priority.png" alt-text="Screenshot of the priority multi-select dropdown showing P1 and P2 checked.":::

1. **Title contains** (optional): Add a keyword to narrow matches further.

Make sure you fill in all required fields: trigger name, impacted service, incident type, and at least one priority level. The **Next** button becomes enabled.

## Choose the response subagent and autonomy level

Scroll down to the **Subagent** section to configure the response behavior.

:::image type="content" source="media/response-plan/incident-trigger-step-05-sub-agent.png" alt-text="Screenshot of the subagent section showing pre-selected response subagent and autonomy level radio buttons.":::

Configure the following options:

- **Response subagent**: The subagent you selected when you selected the **+** button. Change it if needed.
- **Agent autonomy level**: Choose how your agent responds:
  - **Autonomous (Default)**: Your agent independently performs mitigation or resource modifications.
  - **Review**: Your agent proposes actions for your approval before executing.

> [!TIP]
> Start with **Review** mode for new triggers so you can validate your agent's investigation behavior before granting full autonomy.

Select **Next**.

## Preview matching incidents

The **Incidents preview** step shows a table of past incidents that match your filter criteria.

:::image type="content" source="media/response-plan/incident-trigger-step-06-preview.png" alt-text="Screenshot of the incidents preview step showing matching past incidents table with priority, date, title, incident ID, and status columns.":::

The table displays the following columns for each matching incident:

- **Priority**
- **Date created**
- **Title**
- **Incident ID**
- **Status**

A time range filter (default: Last 90 days) adjusts the preview window.

Review the results:

- **Too many matches?** Go back and add a severity restriction or title keyword.
- **No matches?** This condition is normal for new services. Your trigger still works for future incidents.
- **Right number?** Your filter is well-tuned.

Select **Create** to save the trigger.

## Verify the trigger on the canvas

After you create the trigger, the canvas refreshes. Your new trigger node appears with an edge connecting it to the subagent.

:::image type="content" source="media/response-plan/incident-trigger-step-07-created.png" alt-text="Screenshot of the subagent builder canvas showing new incident trigger node connected to the subagent with an edge.":::

Confirm the following information:

- The trigger node shows your trigger name and "Incident trigger" label.
- An edge connects the trigger to your chosen subagent.
- The trigger shows "On" status.

## How a trigger processes incidents

When an incident that matches your filter criteria fires on your incident platform, the following sequence occurs:

1. Your agent detects the incoming incident.
1. It evaluates the incident against all active triggers.
1. The matching trigger routes the incident to the linked subagent.
1. The subagent investigates with its configured tools and autonomy level.
1. A new investigation thread appears in your agent's chat.

> [!TIP]
> Use the **Title contains** filter to test safely. Set it to match a specific test incident title (for example, `[TEST] CPU spike`) and create a test incident with that title. This approach validates your agent's behavior without affecting production routing. Once verified, adjust or remove the title filter.

## Next step

> [!div class="nextstepaction"]
> [Learn about response plans](./incident-response-plans.md)

## Related content

- [Subagents](sub-agents.md)
- [Set up a Kusto connector](kusto-connector.md)
- [Incident response plans](incident-response-plans.md)
