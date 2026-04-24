---
title: Workflow automation in Azure SRE Agent
description: Automate operational workflows by connecting triggers, subagents, and tools to run without manual intervention.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 04/24/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
ms.custom: automation, triggers, workflows, scheduled tasks, custom agents
#customer intent: As an SRE, I want to automate operational workflows so that incidents are handled end-to-end without manual handoffs.
---

# Workflow automation in Azure SRE Agent

Operational workflows span multiple tools and require someone to remember what comes next. You check status in one system, make a decision, execute in another, and notify your team in a third. Each handoff adds latency and risk.

> [!TIP]
> Workflow automation helps you by:
> - Handling incidents end-to-end without waking anyone
> - Running scheduled tasks automatically with human oversight when needed
> - Applying knowledge from past incidents consistently every time

## How workflow automation works

**What you'll achieve:**
- Automated workflows that run on schedule or in response to incidents
- Custom agents with specific tools for specialized tasks
- End-to-end flows: trigger → investigate → act → notify

When a trigger fires (scheduled time or incident), your agent:

1. **Receives the trigger.** A scheduled task runs or an incident matches a response plan.
2. **Invokes the custom agent.** The configured custom agent starts with its tools and instructions.
3. **Executes the workflow.** The custom agent investigates, takes actions, and coordinates with other custom agents if needed.
4. **Notifies your team.** Results are posted to Teams, email, or your incident platform.

Each custom agent has access to specific tools (from connectors) and follows its instructions autonomously or with approval, depending on the run mode.

## What makes this different

**Unlike scripts**, your agent adapts when patterns change. Scripts break when inputs vary. Your agent reasons about what to do based on what it finds.

**Unlike runbooks**, your agent executes the workflow, not just documents it. Runbooks tell humans what to do. Your agent does it.

**Unlike IFTTT-style automation**, your agent investigates before acting. It doesn't blindly execute when a trigger fires. Instead, it assesses the situation and decides the appropriate response.

## Before and after

| Before | After |
|--------|-------|
| Check status in monitoring tool | Agent queries automatically |
| Decide what to do based on data | Agent reasons and proposes action |
| Execute fix in another system | Agent executes via connected tools |
| Notify team in Slack/Teams | Agent sends contextual notification |
| Log what happened | Agent records actions in thread |

## Building a workflow

Workflows combine three building blocks:

| Building block | What it does | Where to configure |
|---|---|---|
| **Connectors** | Provide tools from external systems (Outlook, Teams, GitHub, PagerDuty) | Builder > Connectors |
| **Custom agents** | Specialized workers with specific tool access and autonomy settings | Builder > Agent Canvas |
| **Triggers** | Start workflows on schedule or in response to incidents | Scheduled tasks / Incident response plans |

For step-by-step setup, see [Step 5: Automate Workflows](automate-workflows.md) in the getting started guide.

## Example: Daily health report with email

This workflow checks Azure resource health and emails a summary:

1. **Connector**: Add **Send email (Office 365 Outlook)**
2. **Custom agent**: Create `health-reporter` with `SendOutlookEmail` tool
3. **Scheduled task**: Attach to custom agent with prompt:

```text
Check the health of Azure resources in prod-rg:
1. Query Azure Resource Health for any degraded resources
2. Check Application Insights for error rate trends
3. Summarize findings
4. Email the report using SendOutlookEmail
```

The agent runs this daily, investigates, and sends the email without any manual steps.

## Custom agent delegation

When a workflow needs different expertise at different steps, use multiple custom agents:

| Step | Custom agent | Why |
|------|----------|-----|
| Database diagnostics | @DatabaseExpert | Specialized KQL queries |
| Send notifications | @Notifier | Email and Teams tools |
| Create incidents | @IncidentCreator | PagerDuty/ServiceNow integration |

The orchestrator delegates tasks to custom agents as needed. See [Custom agents](sub-agents.md).

## Best practices

| Practice | Why it matters |
|----------|---------------|
| **Test in the Playground first** | Verify your custom agent's behavior before attaching to a trigger |
| **Start in Review mode** | Verify the agent's judgment before full automation |
| **Test with "Run task now"** | Validate scheduled workflows before production |
| **One tool per custom agent** | Easier to audit, debug, and update |
| **Use descriptive names** | `email-health-report` vs `custom-agent-1` |

Before attaching a scheduled task, test your custom agent:
1. Go to **Builder** → **Agent Canvas**
1. Select **Test playground** view
1. Pick a custom agent from the dropdown and select **Apply**
1. Type your planned instructions in the Test panel and verify the agent executes them correctly

Once you're confident in the behavior, attach the trigger.

## Get started

| Resource | What you'll learn |
|----------|-------------------|
| [Step 5: Automate workflows](automate-workflows.md) | Build an automated health check with email notifications |
| [Create a scheduled task](create-scheduled-task.md) | Step-by-step tutorial for scheduled automations |

## Related content

| Capability | What it adds |
|------------|--------------|
| [Scheduled Tasks](scheduled-tasks.md) | Proactive monitoring and recurring task patterns |
| [Execute Mitigations](execute-mitigations.md) | Actions your workflows can take |
| [Send Notifications](send-notifications.md) | Notification patterns and channels |
| [Incident Response](incident-response.md) | Response plan triggers |
| [Custom agents](sub-agents.md) | Detailed custom agent configuration |
| [Connectors](connectors.md) | Available tool integrations |
