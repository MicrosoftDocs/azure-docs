---
title: Schedule tasks with Azure SRE Agent Preview
description: Learn how to use scheduled tasks in SRE Agent to automate monitoring, enforce security, and validate recovery.
author: craigshoemaker
ms.topic: overview
ms.date: 11/10/2025
ms.author: cshoe
ms.service: azure-sre-agent
---

# Scheduled tasks in Azure SRE Agent Preview

Scheduled tasks in Azure SRE Agent let you automate workflows such as monitoring, maintenance, and security checks on a schedule you define. You can create these tasks manually, request them during a chat with the agent, or allow the agent to generate them autonomously as part of [incident response](incident-response-plan.md). Scheduled tasks helps you move from reacting to problems to being proactive with tasks that run consistently and without manual effort.

The following scenarios show you some common use cases for using scheduled tasks:

> [!NOTE]
> This list isn't meant to be comprehensive, but it describes different ways you can use scheduled tasks in your environment.

- **Custom monitoring**: Monitor resource health where alerts aren't configured.
- **Security best practices**: Run vulnerability scans and compliance checks on applications.
- **Post-incident health checks**: Validate database recovery and API health after mitigation.

## Create a scheduled task

1. Open your agent in the Azure portal.

1. Select the **Scheduled tasks** tab.

1. Select **Create scheduled task**.

1. Enter the following values in the *Create scheduled task* window:

    | Setting | Value |
    |--|--|
    | Name | Enter a name for your task. |
    | Description | Enter a description for your task. |
    | When should this task run? | Enter a description in plain English that describes when you want this task to run. |
    | How often should it run? | Enter a description in plain English that describes how often your task runs. For example, you could enter *Wednesdays at 9am Pacific*.<br><br>Once you enter details on when and how often you want your task to run, you can select the **Draft the cron for me** to have the portal turn your description into a cron expression for use by the agent. |
    | End date | Enter the last date you want this task to run. |
    | Agent instructions | Enter a description of what you want your task to do. See the [examples](#examples) for suggestions on how you can craft your custom instructions.<br><br>You can use the **Polish instructions** button to let the AI model improve the prompt you give it. |
    | Max executions | Enter the maximum number of times you want this task to run.<br><br>The value you enter here takes precedence over the *End date* value. |

1. Select the **Create scheduled task** button.

## Best practices

- Write prompts that are concise and specific.
- Use compliance frameworks for security-related tasks.
- Avoid ambiguous schedules (for example, "every hour" without an end condition).

## Examples

The following examples demonstrate a few sample sets of custom instructions you could define for a scheduled task.

> [!NOTE]
> These custom instructions use placeholders to represent sensitive data.

# [Health check](#tab/health-check)

```prompt
Create a health check task designed to run after an 
incident mitigation where a PostgreSQL DB was down. 

The task runs to check if the database remains healthy 
for the next 30 minutes after mitigation.

This task runs autonomously every 1 minute for up 
to 30 executions to validate post-recovery health 
after DB startup.

- On failure, it collects logs, notifies, and 
    escalates if the database is down.

- On success, it records a summary.

- At completion, it generates a PDF report with 
    metrics, logs, and a pass/fail summary.
```

# [Security analysis](#tab/security-analysis)

```prompt
Create a security check task that runs every week 
to perform security review of my application <APPLICATION_NAME>, 
focusing on authentication, secrets, access controls, 
infrastructure, and dependencies.
```

---

## Related content

- [Incident response plans in Azure SRE Agent](incident-response-plan.md)
- [Incident management in Azure SRE Agent](incident-management.md)
