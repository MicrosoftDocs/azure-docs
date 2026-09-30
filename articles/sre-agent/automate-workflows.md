---
title: Automate workflows in Azure SRE Agent
description: Schedule recurring health checks, connect notification tools, and build automated workflows with connectors and custom agents.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 09/03/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
ms.custom: automation, scheduled tasks, connectors, custom agents, workflow, notifications, getting started
#customer intent: As a site reliability engineer, I want to connect tools, create custom agents, and schedule recurring tasks so that my agent automates routine operational work without manual intervention.
---

# Automate workflows in Azure SRE Agent

Your team probably has recurring tasks like checking service health every morning, reviewing overnight alerts, verifying certificate expirations, or posting weekly capacity reports. Connect your tools, build a workflow, and let the agent run it on a schedule.

## What you accomplish

- Connect a notification tool so the agent can send messages
- Create a custom agent that uses that tool
- Schedule a recurring health check that runs automatically
- See the complete workflow on the Agent Canvas

## Prerequisites

| Requirement | Details |
|-------------|---------|
| **Completed articles** | [Create and set up](create-and-set-up.md) and [Team onboarding](team-onboard.md). |
| **Role on the agent** | The **SRE Agent Administrator** role covers every step in this article. Other roles cover only part of the work. An *Author* can create the custom agent but not the scheduled task, and a *Standard User* can create the scheduled task but not the custom agent. Adding a connector requires the *Administrator* role. See [User roles and permissions](user-roles.md). |
| **An account to send from** | A Microsoft 365 account with an active Outlook mailbox. The agent signs in as this account, and the reports it sends arrive from this address. |
| **Consent to authorize the connector** | If your organization restricts which applications people can approve, an administrator might need to consent to the sign-in before the connector connects. |
| **Azure context for this example** | Access to the Azure resources the task checks. A logging provider is needed only if the task requests logs. The agent's identity needs suitable Azure role-based access control (RBAC) permissions for the requested data. See [Agent permissions](permissions.md). |
| **Recipient** | An email address that can receive the test report. |


> [!TIP]
> [Run your first investigation](first-investigation.md) and [Automate incident response](automate-incidents.md) aren't required for this article, but completing them first gives you a better understanding of what workflows can automate.

## How it works

Automation connects three building blocks, each one set up through the portal:

| Building block | What it does | Example |
|---------------|-------------|---------|
| **Connector** | Gives the agent access to an external service | Outlook, Teams, Datadog, Splunk |
| **Custom agent** | A specialized worker with access to specific tools | `health-check-reporter` with permission to send messages |
| **Scheduled task** | Triggers a custom agent on a recurring schedule | "Every morning at 8 AM, check resource health and send a summary" |

In the portal, the second block appears as **Custom Agent**.

The following walkthrough builds a morning health report delivered by email, but the same three blocks cover other recurring work. Change the instructions and the schedule to review overnight alerts, check certificate expirations, or post a weekly capacity summary. A weekly report sent to a distribution list also gives your leadership a standing record that nobody has to assemble by hand.

## Add a connector

Connectors let the agent interact with external services. Start with a notification tool so your agent can report findings. These steps set up an Outlook connector. For Teams, see [Set up a Teams connector](set-up-teams-connector.md).

Two identities are in scope before you begin. Your sign-in authorizes the agent to act in Outlook, which is why the mail it sends comes from your account. The agent uses its own user-assigned managed identity to reach Azure and gather the resource data for the report, so the RBAC roles assigned to that identity decide what the report can include. Azure creates that identity with the agent, so you don't create one here. For more information, see [Agent identity](agent-identity.md) and [Agent permissions](permissions.md).

1. Go to **Build + setup** > **Connectors** in the side navigation.
1. Select **Add connector**.
1. Select the **Notification** tab.
1. Select the **Office 365 Outlook** connector for the **Microsoft Outlook** service.
1. Select **Next**.
1. Sign in and authorize access, and then select **Next**.
1. In **Set up tools**, select the email-send operation. The wizard rail labels this step **Configure tools**.
1. Set its **Permission** to **Ask**.
1. Turn on **Parameter policy** for the email-send operation.
1. In its recipient or **To** parameter, enter the recipient address from the prerequisites.
1. Select **Next**.
1. Review the configuration, and then select **Create**.

**Checkpoint:** The connector appears in the connectors list with a status of **Connected**.

> [!IMPORTANT]
> **Ask** pauses for your approval during a chat, but a scheduled task running in autonomous mode calls the operation without asking. Locking the recipient address is what keeps an unattended run from mailing the wrong person. For more information, see [Run modes](run-modes.md).

> [!TIP]
> You can also add connectors based on the Model Context Protocol (MCP) for Datadog, Splunk, Elasticsearch, Dynatrace, New Relic, and custom MCP servers. See [MCP connectors](mcp-connectors.md) for the full list.

## Create a custom agent

Custom agents are specialized workers with access to specific tools. You build and connect them on the **Agent Canvas**, a visual diagram of your custom agents, their tools, and the triggers that start them.

1. Go to **Build + setup** > **Agent Canvas** in the side navigation.
1. Select **Create** in the toolbar, and then select **Custom Agent**. The creation dialog opens with two tabs, **Form** and **YAML**.
1. Fill in the required fields:
   - **Custom agent name**: for example, `health-check-reporter`
   - **Instructions**: describe what this custom agent does and include the report recipient, for example, "You are a health check reporter. Check Azure resource health for my container apps and email the summary to ops@example.com."
1. Select **Choose tools**, and then select the email-send tool from your connector along with the Azure tools the report needs. Tools are the individual operations the agent can call. Choosing tools here overrides the global tool defaults for this custom agent, and leaving the selection empty lets it inherit all global tools. See [Tools](tools.md) and [Tools and skills](global-tools-page.md).
1. Select **Create**.

Good instructions name the scope, the check, and what to do with the result. The example instruction works because it says which resources to look at, what to look for, and where the summary goes, so the agent doesn't have to guess any of the three. The **YAML** tab shows the same definition as text, so you can review or copy what you built.

The custom agent appears as a node on the canvas, and its selected Outlook operation shows up in a toolbox node, typically with an **MCP** badge.

**Checkpoint:** The canvas shows the custom-agent node and a toolbox node containing the selected Outlook tool.

> [!TIP]
> The custom agent form also lets you assign skills and hooks. Skills are reusable procedures the agent loads when they're relevant, and hooks are controls that run before or after an action to keep it within bounds. See [Create a subagent](create-subagent.md) for the full walkthrough, [Skills](skills.md), and [Agent hooks](agent-hooks.md).

## Schedule a recurring task

Link a scheduled task to the custom agent so it runs automatically.

1. Select the **+** button on the side of your custom-agent node.
1. Under the **Trigger** group, select **Add scheduled task**. The dialog opens with **Response custom agent** already set to that agent.
1. Fill in the fields:

    | Field | Example value |
    |---|---|
    | **Task name** | `daily-health-report` |
    | **Response custom agent** | Your custom agent, already selected |
    | **Task details** | Check the health of the resources in my resource group. Verify all apps are running, check CPU and memory metrics over the last hour, and review any recent warning logs. Summarize findings and send the report. |
    | **Frequency** | Daily |
    | **Time of day** | 8:00 AM |

1. Select **Create task**.

The **Time of day** label shows the time zone your browser is in, such as **Time of day (PST)**, but the schedule is saved as UTC without a time zone. The task always runs at the same UTC time, so after a daylight saving change it runs an hour earlier or later than the local time you picked. If you set **Frequency** to **Custom cron**, the time picker is replaced by a **Cron expression (UTC)** field, and the expression is read as UTC.

Every run consumes agent usage, and a daily task keeps consuming it until you turn the task off. Pick the lowest frequency that still gives you the signal you need. For how usage is measured, see [Pricing and billing](pricing-billing.md).

The canvas now shows the complete workflow chain.

## Verify the outcome

Run the task immediately to verify everything works:

1. Go to **Automation** in the side navigation, where you can see your scheduled tasks. Older links to the scheduled tasks page redirect here.
1. Select the checkbox next to your task.
1. Select **Run now** in the toolbar.
1. To watch the run, select your task name to open the executions view, and then select the **Thread name** link. You can also find the thread under **Chats** in the sidebar.

**Run now** submits the execution request and refreshes the task list. What the run produces, from the health checks and metrics through to the emailed report, depends on the tools you selected, the agent's access to your resources and telemetry, and the health of the connector.

**Checkpoint:** An execution appears for the task. If the execution resolves a thread, the executions view shows a **Thread name** link. Otherwise it shows **No thread found**. If the execution succeeds and invokes the Outlook tool, verify that the recipient receives the report.

## If the task doesn't run

A scheduled task can finish without producing the result you expected. Start with the execution history.

1. Go to **Automation** and select the task name. Each execution row shows the start time, a **Success** or **Failed** status, and either a **Thread name** link or **No thread found**. The row doesn't show an error message, so open the thread to see what happened.
1. Open the most recent thread. It shows how the agent planned the work, which tools it called, and what it concluded.
1. An execution is marked successful once its work is handed to a thread, so a run can show **Success** even if the agent later stopped, paused for approval, or hit a failed tool call. Read the thread before you trust the status.
1. If no execution appears at all, confirm the task status is **On** and check the next run time.

| What you see | Likely cause | What to do |
|---|---|---|
| The execution shows **Success**, but no email arrives | The email operation isn't enabled on the connector, the recipient parameter is locked to a different address, or the agent never reached the send step | Open the thread to see whether the agent called the Outlook tool. Then edit the connector, confirm the send operation is selected, and check the locked **To** value |
| The execution shows **Success**, and the thread is waiting for approval | The task's **Agent autonomy level** is **Review**, so the agent pauses in the thread before it acts | Open the thread and approve the pending action, or edit the task and set **Agent autonomy level** to **Autonomous** |
| The execution shows **No thread found** | The run failed before it created a thread | Confirm the connector status is **Connected** and the task's **Response custom agent** still exists, then select **Run now** to try again |
| The connector isn't **Connected** | The authorization expired, or the account lost access to the mailbox | Edit the connector and sign in again |
| The report arrives with no resource data | The agent's identity doesn't have access to the resources the task checks | Review the assignments described in [Agent permissions](permissions.md) |

For more troubleshooting and task management, see [Create and edit scheduled tasks](create-scheduled-task.md).

## Clean up resources

After you verify the report, use **Turn off** or **Delete** for a scheduled task you don't plan to keep. Use **Remove** or **Disconnect** for the connector. Revoke the Outlook OAuth grant when it's no longer needed.

## You completed the getting-started journey

You built a workflow end to end. A connector gives your agent a way to reach Outlook, a custom agent knows what to check and where to report it, and a scheduled task runs the whole chain on its own.

Your agent can now:

- **Automate workflows**: Run scheduled tasks through custom agents and connectors.
- **Use team context**: Draw on the knowledge sources and team details you connected during setup and onboarding.

If you completed [Run your first investigation](first-investigation.md), you also saw the agent diagnose a problem using your code, telemetry, and Azure context. If you completed [Automate incident response](automate-incidents.md), it picks up alerts that match a response plan and investigates them without being asked.

## Related capabilities

| Capability | What it adds |
|------------|-------------|
| [Scheduled tasks](scheduled-tasks.md) | Advanced scheduling options and task management |
| [Connectors](connectors.md) | How connectors provide tools to your agent |
| [Custom agents](sub-agents.md) | How custom agents delegate and specialize work |

## Related content

Now that you're set up, explore Concepts to understand how the agent works, or try a tutorial for hands-on guidance on advanced features.

| Where to go | What you'll find |
|-------------|-----------------|
| [Concepts](user-roles.md) | How roles, permissions, memory, connectors, and agent reasoning work |
| [Capabilities](incident-response.md) | Detailed pages on every feature the agent offers |
| [Tutorials](deep-investigation.md) | Step-by-step guides for deep investigation, connectors, hooks, and more |
