---
title: "Tutorial: Create an incident response plan in Azure SRE Agent"
description: Create a response plan that routes incidents to a custom agent and use the toggle to control when it's active.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 04/02/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
ms.custom: incident trigger, response plan, filter, custom agent, automation, tutorial, toggle, enable, disable, agent canvas
#customer intent: As an SRE, I want to create an incident response plan so that matching incidents are automatically routed to the right custom agent for investigation.
---

# Create an incident response plan in Azure SRE Agent

Incident response plans let you automatically route incoming incidents to the right custom agent based on filter criteria like severity, service, and incident type. Instead of manually triaging each alert, you define the conditions once and your agent handles matching incidents as they arrive.

In this tutorial, you create a response plan from the Agent Canvas, preview matching incidents, and use the enable/disable toggle to control when the plan is active.

## Prerequisites

- An agent with an incident platform connected (PagerDuty, ServiceNow, or Azure Monitor)
- At least one custom agent configured
- Contributor or Owner role on the agent resource

---

## Step 1: Open the Agent Canvas

In the SRE Agent portal, select your agent. In the left sidebar, go to **Builder** → **Agent Canvas**.

> [!WARNING]
> When you first connect an incident platform, a default **quickstart** response plan might be created automatically. Before creating custom plans, switch to **Table view** and select the **Incident response plans** tab to check. Delete the quickstart plan if it exists. Overlapping plans can cause incidents to be routed incorrectly or processed twice.

## Step 2: Create a new response plan

In the Agent Canvas, select **Create** in the toolbar. Select **Trigger** > **Incident response plan**.

The create dialog opens.

Fill in the filter criteria. The fields you see depend on your incident platform:

- **Incident response plan name**: Enter a descriptive name, such as `high-sev-api-trigger`.

For **Azure Monitor**:

- **Severity**: Select one or more severity levels.
- **Title contains** (optional): Add a keyword to narrow matches.

For **PagerDuty / ServiceNow**:

- **Impacted service**: Select the service this plan covers, or select **All**.
- **Incident type**: Choose the incident classification, or select **All incident types**.
- **Priority**: Select one or more priority levels, such as P1 and P2.
- **Title contains** (optional): Add a keyword to narrow matches.

Choose the response configuration:

- **Response custom agent**: Select the custom agent that handles matched incidents.

- **Agent autonomy level**: Choose how your agent responds:
  - **Autonomous (Default)**: Your agent independently investigates and performs mitigation.
  - **Review**: Your agent proposes actions for your approval before executing.

> [!NOTE]
> When you select **Autonomous (Default)**, an ℹ️ icon appears next to the option.
> 
> Select it to review the **Autonomous mode acknowledgment** - a summary of what autonomous execution means, including agent boundaries, AI model limitations, and your responsibilities. See [Response plans -> Custom agent configuration](incident-response-plans.md#custom-agent-configuration) for details.

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

## Step 3: Preview matching incidents

Select **Next**. The incidents preview shows a table of past incidents that match your filter criteria.

The table displays:

- **Priority**, **Date created**, **Title**, **Incident ID**, and **Status** for each matching incident
- A time range filter (default: Last 90 days) to adjust the preview window

Review the results:

- **Too many matches?** Go back and add a severity restriction or title keyword.
- **No matches?** This result is normal for new services. Your plan still works for future incidents.
- **Right number?** Your filter is well-tuned.

Select **Create incident response plan** to save the plan.

**Checkpoint:** The plan appears in the grid with Status **On** (green badge).

## Step 4: Turn a plan off and on

Select your plan by checking its checkbox in the grid.

1. Select **Turn off** in the toolbar. A confirmation dialog appears.
1. Select **Yes** to disable the plan.

The status badge changes to **Off**. The scanner stops matching incidents against this plan. Your filter configuration is preserved.

To re-enable the plan, follow these steps:

1. Select the plan again.
1. Select **Turn on**. It takes effect immediately with no confirmation.

The status badge returns to **On**.

**Checkpoint:** The toggle works - you can switch a plan between On and Off without deleting it.

## Step 5: Verify in the response plans grid

You can see your plan right in the **Incident response plans** page grid with the status badge, custom agent, severity filter, and autonomy level columns.

**Checkpoint:** Your plan appears in the grid with the correct status, custom agent, and severity.

> [!TIP]
> Use the **Title contains** filter to test safely. Set it to match a specific test incident title (for example, `"[TEST] CPU spike"`) and create a test incident with that title. This method validates your agent's behavior without affecting production routing. Once verified, adjust or remove the title filter.

## Edit or delete a response plan

### Edit

1. In the response plans grid, select the **plan ID link** to open the plan.
1. The edit view opens with all current settings prepopulated.
1. Modify the filter criteria, custom agent, or autonomy level.
1. Select **Save** to apply your changes.

### Delete

1. Select the plan by using the checkbox in the grid.
1. Select **Delete** in the toolbar.
1. A confirmation dialog appears. Select **Yes** to confirm.

Deleted plans stop routing incidents immediately. Active investigations that the plan started continue to completion.

## What you learned

- How to create response plans from the **Incident response plans** page.
- How filter criteria (severity, service, type, title) route incidents to the right custom agent.
- How to preview matching historical incidents before committing.
- How to use the enable/disable toggle to pause and resume routing.
- How to verify plans in the unified grid view in the Agent Canvas.
- The difference between Autonomous and Review autonomy levels.

## Related content

| Resource | What you learn |
|----------|-------------------|
| [Incident Response Plans](incident-response-plans.md) | Understand the full response plans capability |
| [Connect a data source](kusto-connector.md) | Give your custom agent access to log data |
| [Deep Investigation](deep-investigation.md) | Complex root cause analysis |
| [Custom agents](sub-agents.md) | Specialized custom agents for different incident types |
