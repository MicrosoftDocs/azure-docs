---
title: "Step 5: Automate actions in Azure SRE Agent"
description: Create scheduled tasks with email notifications using connectors, subagents, and scheduled task triggers.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 04/02/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
ms.custom: automation, scheduled tasks, MCP, notifications, getting started
#customer intent: As a site reliability engineer, I want to automate health checks with email notifications so that I can proactively monitor my systems without manual intervention.
---

# Step 5: Automate actions in Azure SRE Agent

Build an automated health check that runs on schedule and sends results via email. You connect a tool (Outlook), create a custom agent to use it, and attach a scheduled task to trigger it.

## What you accomplish

By the end of this step, your agent:
- Has an Outlook connector that provides email tools
- Has a custom agent configured with the SendOutlookEmail tool
- Runs a scheduled task that executes the custom agent daily

---

## Prerequisites

| Requirement | Details |
|-------------|---------|
| **Agent created** | Complete the agent setup in the [Azure portal](https://portal.azure.com) first |

> [!TIP]
> Enrich your automated tasks
> While not required, completing the knowledge setup and [connecting source code](connect-source-code.md) makes your scheduled tasks more effective. Health checks can reference your runbooks and correlate findings to recent code changes, turning generic reports into actionable insights.

---

## Step 1: Add the Outlook connector

First, connect an external tool. You need the connector before you can give its tools to a custom agent.

1. Select **Builder** in the left sidebar.
1. Select **Connectors**.
1. Select **Add connector**.
1. Select the **Notification** tab, then select **Send email (Office 365 Outlook)**.
1. Sign in with your Microsoft account.
1. Select **Add connector**.

The connector creates tools your custom agents can use: `SendOutlookEmail`, `GetOutlookEmail`, `ListOutlookEmails`, and others.

---

## Step 2: Create a custom agent with the email tool

Next, create a custom agent that can send emails. Custom agents are specialized workers that the agent can invoke for specific tasks.

1. Select **Builder → Custom agent builder**.
1. Select **Create custom agent** (or the plus icon on the canvas).
1. Name it `email-notifications`.
1. Set **Autonomy** to "Autonomous" (runs without user confirmation).
1. Add the tool: Select the tools dropdown and select **SendOutlookEmail**.
1. Select **Save**.

Your custom agent now appears on the canvas with its connected tool.

---

## Step 3: Add a scheduled task to the custom agent

Now link a scheduled task to the custom agent. You do this step directly from the custom agent node.

1. Select the **plus sign (+)** on the left side of the `email-notifications` custom agent node.

1. Select **Add scheduled task**.

1. Fill in the task details:

    | Field | Value |
    | --- | --- |
    | **Task name** | `daily-resource-health-report` |
    | **Schedule** | Every 24 hours (or use cron: `0 8 * * *` for 8 AM daily) |
    | **Notification channel** | (Optional) Teams webhook URL |

1. Enter the task prompt:

    ```text
    Check the health of our Azure resources:
    1. Verify all container apps are running
    2. Check CPU and memory metrics over the last hour
    3. Review any recent warning logs
    4. Summarize findings and send a report via email using SendOutlookEmail
    ```

1. Select **Save**.

The canvas now shows the complete workflow: scheduled task → custom agent → tool.

> [!TIP]
> The scheduled task triggers the custom agent, which has access to the SendOutlookEmail tool from the Outlook connector. Without the connector, the custom agent has no email tool. Without the custom agent, the scheduled task has no way to send notifications.

---

## Verify it works

Test your scheduled task:

1. Select **Scheduled tasks** in the left sidebar.
1. Select your task in the list (check the checkbox).
1. Select **Run task now** in the toolbar.
1. Select the chat thread that opens to see execution details.

The agent shows:

- Active status and execution time
- Planning and reasoning steps
- Tool invocations (SendOutlookEmail)
- Completion confirmation

---

## What you unlocked

Your agent now:
- Connects to external tools (Outlook)
- Runs custom agents with specific tool access
- Executes scheduled tasks automatically
- Sends proactive notifications without manual triggers

**You completed the getting started journey!**

---

## Related content

Your agent is fully operational. Here's where to go deeper:

### Understand the concepts
- [Custom agents](sub-agents.md): How custom agents work, when to use them, autonomy levels
- [Connectors](connectors.md): All available connectors and how they extend your agent
- [Tools](tools.md): Built-in tools and how to add custom ones
- [Skills](skills.md): Modular capabilities your agent loads on demand

### Explore more capabilities
- [Scheduled tasks](scheduled-tasks.md): Full capability details for automated recurring work
- [Send notifications](send-notifications.md): Notify your team via Teams, Outlook, or MCP tools
- [Workflow automation](workflow-automation.md): Chain actions together for complex workflows
- [Agent hooks](agent-hooks.md): Validate agent responses and audit tool usage
- [Monitor agent usage](monitor-agent-usage.md): Track how your agent is being used
- [Audit agent actions](audit-agent-actions.md): Review what your agent did and why

### Add more connectors
- [Tutorial: Connect Azure Data Explorer for log queries](kusto-connector.md)
- [Tutorial: Build custom MCP connectors](mcp-connector.md): Jira, Slack, Grafana, any API

### Advanced automation

- [Tutorial: Scheduled task patterns](create-scheduled-task.md): Cron expressions, business hours, chained workflows
- [Tutorial: Set up response plans](response-plan.md): Configure incident automation
- [Tutorial: Create Python tools](create-python-tool.md): Extend your agent with custom Python code
- [Tutorial: Agent hooks](agent-hooks.md): Add guardrails to automated actions
