---
title: "Tutorial: Create an Incident Response Plan for Azure SRE Agent"
description: Create a response plan from the Agent Canvas that routes specific incidents to a custom agent, and use the enable or disable toggle to control when it's active.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: incident trigger, response plan, filter, custom agent, automation, tutorial, toggle, enable, disable, agent canvas
#customer intent: As an SRE, I want to create an incident response plan so that matching incidents are automatically routed to the right custom agent for investigation.
---

# Tutorial: Create an incident response plan for Azure SRE Agent

In this tutorial, you create a response plan that filters incidents by severity and service, routes matching incidents to a specific custom agent for automated investigation, and learn how to use the enable or disable toggle.

**Estimated time**: 5-10 minutes

In this tutorial, you:

> [!div class="checklist"]
> - Create a response plan from the Agent Canvas
> - Configure filter criteria (severity, service, type, title) to route incidents
> - Preview matching historical incidents before committing
> - Use the enable/disable toggle to pause and resume routing
> - Verify plans in the response plans grid

## Prerequisites

- An agent with an incident platform connected (PagerDuty, ServiceNow, or Azure Monitor)
- At least one custom agent is configured
- Contributor or Owner role on the agent resource

> [!NOTE]
> For more information about incident response plans and the problems they solve, see [Incident response plans](incident-response-plans.md).

## Open the Agent Canvas

In the SRE Agent portal, select your agent. In the left sidebar, go to **Builder** > **Agent Canvas**.

> [!WARNING]
> When you first connect an incident platform, the portal might automatically create a default **quickstart** response plan. Before you create custom plans, switch to **Table view** and select the **Incident response plans** tab to check. Delete the **quickstart** plan if it exists. Overlapping plans can cause incidents to be routed incorrectly or processed twice.

## Create a new response plan

In Agent Canvas, select the **Create** dropdown arrow in the toolbar. Select **Trigger** > **Incident response plan**.

The create dialog opens.

Fill in the filter criteria. The fields shown depend on your incident platform:

- **Incident response plan name**: Enter a descriptive name, such as `high-sev-api-trigger`.

For **Azure Monitor**:

- **Severity**: Select one or more severity levels (multiselect).
- **Title contains** (optional): Add a keyword to narrow matches further.

For **PagerDuty / ServiceNow**:

- **Impacted service**: Select the service this plan covers, or select "All".
- **Incident type**: Choose the incident classification, or select "All incident types".
- **Priority**: Select one or more priority levels (multiselect, such as P1 and P2).
- **Title contains** (optional): Add a keyword to narrow matches further.

Choose the response configuration:

- **Response custom agent**: Select the custom agent that handles matched incidents.
- **Agent autonomy level**: Choose how your agent responds:
  - **Autonomous (Default)**: Your agent independently investigates and performs mitigation.
  - **Review**: Your agent proposes actions for your approval before executing.

> [!TIP]
> Start with **Review** mode for new plans if you want to validate your agent's investigation behavior before granting full autonomy. New plans default to Autonomous.

### Configure alert reinvestigation cooldown (Azure Monitor only)

If your incident platform is **Azure Monitor**, a **Reinvestigation cooldown** section appears below the autonomy level:

- **Enable** (checkbox, default: on): When enabled, recurring fires of the same alert rule within the cooldown window merge into the existing investigation thread instead of starting a new one. Resolved threads within the window are reopened.
- **Cooldown time** (spinner, default: 3 hours, range: 1-24): How long after a thread is resolved or closed before a new fire creates a fresh investigation instead of reopening the existing thread.

Leave the defaults for most alert rules. Disable the cooldown only for critical alerts where every fire needs independent investigation.

> [!WARNING]
> Disabling the cooldown can significantly increase token consumption for noisy alert rules. A rule that fires every 5 minutes would create a new investigation each time.

Fill in all required fields: plan name, impacted service, incident type, and at least one priority level. The **Next** button becomes enabled.

## Preview matching incidents

Select **Next**. The incidents preview shows a table of past incidents that match your filter criteria.

The table displays the following columns for each matching incident:

- **Priority**, **Date created**, **Title**, **Incident ID**, and **Status**

A time range filter (default: Last 90 days) adjusts the preview window.

Review the results:

- **Too many matches?** Go back and add a severity restriction or title keyword.
- **No matches?** This condition is normal for new services. Your plan still works for future incidents.
- **Right number?** Your filter is well-tuned.

Select **Create incident response plan** to save the plan.

The plan appears in the grid with the status set to **On** (green badge).

## Turn a plan off and on

Select your plan by selecting its checkbox in the grid.

1. Select **Turn off** in the toolbar. A confirmation dialog appears.
1. Select **Yes** to disable the plan.

The status badge changes to **Off**. The scanner stops matching incidents against this plan. Your filter configuration is preserved.

To re-enable:

1. Select the plan again.
1. Select **Turn on**. The change takes effect immediately with no confirmation.

The status badge returns to **On**.

At this point, you can switch a plan between On and Off without deleting it.

## Verify in the response plans grid

You can see your plan in the **Incident response plans** page grid with the status badge, custom agent, severity filter, and autonomy level columns.

Confirm the following information:

- Your plan appears in the grid with the correct status, custom agent, and severity.

> [!TIP]
> Use the **Title contains** filter to test safely. Set it to match a specific test incident title (for example, `[TEST] CPU spike`) and create a test incident with that title. This approach validates your agent's behavior without affecting production routing. Once verified, adjust or remove the title filter.

## Edit or delete a response plan

### Edit a response plan

To edit a response plan:

1. In the response plans grid, select the **plan ID link** to open the plan.
1. The edit view opens with all current settings prepopulated.
1. Modify the filter criteria, custom agent, or autonomy level.
1. Select **Save** to apply changes.

### Delete a response plan

To delete a response plan:

1. Select the plan using the checkbox in the grid.
1. Select **Delete** in the toolbar.
1. When the confirmation dialog appears, select **Yes**.

Deleted plans stop routing incidents immediately. Active investigations that the plan started continue to completion.

## Next step

> [!div class="nextstepaction"]
> [Learn about response plans](incident-response-plans.md)

## Related content

| Resource | Description |
|----------|-------------|
| [Incident response plans](incident-response-plans.md) | Understand the full response plans capability. |
| [Connect to Azure Data Explorer](kusto-connector.md) | Give your custom agent access to log data. |
| [Deep investigation](deep-investigation.md) | Complex root cause analysis. |
| [Custom agents](sub-agents.md) | Specialized custom agents for different incident types. |