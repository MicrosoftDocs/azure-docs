---
title: Agent run modes in Azure SRE Agent Preview
description: Learn how the agent gets your consent for elevated credentials to take action on write operations.
author: craigshoemaker
ms.author: cshoe
ms.topic: conceptual
ms.date: 09/12/2025
ms.service: azure
---

# Agent run modes in Azure SRE Agent Preview

As Azure SRE Agent works within your environment, there are two questions at the core of every write action the agent takes:

| Question | Request type |
|---|---|
| Should the agent take action on a generated plan that includes a write operation? | Consent |
| When the agent doesn't have the required permissions to take action, can it get temporary access to the user's credentials? | Credentials |

These questions surround the issues of:

1. Do you grant *consent* to the agent to take a write action?
1. If the agent requires elevated security for an action, do you grant temporary access to your *credentials* to perform an action?

The first question surrounds whether or not a given action is the right choice. The second question concerns with the security context surrounding the agent action.

## Review vs. autonomous mode

By default Azure SRE Agent operates in *review* mode. When in review mode, the agent generates an execution plan and waits for your consent before taking action. When the agent is working in *autonomous* mode, the agent is given implicit consent to work on your behalf, but the scope is limited.

Rather than being able to work autonomously in any context, you can only enable autonomous mode in the context of an [incident management plan](incident-management.md). This limited scope gives you the assurance that the autonomous nature of the agent only operates inside discreet boundaries you define ahead of time.

## Review mode

When the agent is working in *review* mode, it works on your behalf to create an execution plan based on your prompts. Once generated, then the agent requests consent to act on the plan. If you consent to the proposed action, then the agent might need to prompt for access to elevated credentials.

The following diagram depicts the decision flow of how an agent gets both consent and the right credentials to operate in review mode.

:::image type="content" source="media/agent-run-modes/azure-sre-agent-agent-actions-review-mode.png" alt-text="Diagram depicting the security workflow with SRE Agent runs in review mode. ":::

| Step | Description | Example scenario |
|---|---|---|
| 1 | **Agent generates an execution plan**<br>The agent maps out a plan and is now ready to take action. | The agent recognizes that a VM isn't responding and decides that the best plan is to restart the VM. |
| 2 | **Action requires your consent to proceed**<br>The agent prompts the user to consent to the generated plan.<br><br>If approved, then the agent attempts to execute the plan.<br><br>If denied, processing stops and the agent takes no action. | The agent asks you if you want to restart the VM. |
| 3 | **Agent attempts to take action**<br>The agent has consent to act on the generated execution plan and attempts to take action.<br><br>If the agent has the needed credentials, then it executes the action.<br><br>If the agent doesn't have the appropriate credentials, then it needs to get them from the user. | The agent faces a security challenge because it doesn't have sufficient permissions as it tries to restart the VM. |
| 4 | **Agent prompts for credentials**<br>The agent prompts the user for temporary access to their credentials.<br><br>If approved, the credentials are provided using [Microsoft Entra OBO flow](/entra/identity-platform/v2-oauth2-on-behalf-of-flow).<br><br>If you denied, processing stops and the agent takes no action. | The agent is granted the appropriate credentials via the Microsoft Entra OBO flow and is now ready to restart the VM.<br><br>Alternatively, if the request is denied, or the user doesn't have the appropriate credentials, then the flow stops after this step. |
| 5 | **Agent executes the plan**<br>The agent carries out the actions against the generated plan and returns a response to the user.  | Agent restarts the VM. |
| 6 | **Processing ends**<br>Either the requested operation completes, or processing is terminated because the agent was denied consent to execute the plan.<br><br>Execution could also stop if the user doesn't have the right credentials to provide to the agent.  | The VM is restarted. |

Consider the following key takeaways when working in review mode:

* If you deny consent to the agent's execution plan, it takes no action on your behalf.
* If you deny access to your credentials, the agent takes no action on your behalf.
* The agent first attempts to take action. If the agent is met with a security challenge, then it requests temporary access to your credentials.
* Any access to user credentials are revoked once the action is complete.

## Autonomous mode

When the agent is working in *autonomous* mode inside an incident resolution workflow, it has implicit consent to work on your behalf against execution plans. If the agent doesn't have the appropriate permissions, the then it requests temporary access to your credentials.

The following diagram depicts the decision flow of how an agent gets credentials in autonomous mode.

:::image type="content" source="media/agent-run-modes/azure-sre-agent-agent-actions-autonomous-mode.png" alt-text="Diagram depicting the security workflow with SRE Agent runs in autonomous mode.":::

| Step | Description | Example scenario |
|---|---|---|
| 1 | **Agent generates an execution plan**<br>The agent maps out plan and is now ready to take action. | The agent recognizes that a VM isn't responding and decides the best plan is to restart the VM. |
| 2 | **Agent attempts to take action**<br>The agent has consent to act on the generated execution plan and attempts to take action.<br><br>If the agent has the needed credentials, then it executes the action.<br><br>If the agent doesn't have the appropriate credentials, then it needs to get them from the user. | The agent faces a security challenge because it doesn't have sufficient credentials as it tries to restart the VM. |
| 3 | **Agent prompts for credentials**<br>The agent prompts the user for temporary access to their credentials.<br><br>If approved, the credentials are provided using [Microsoft Entra OBO flow](/entra/identity-platform/v2-oauth2-on-behalf-of-flow).<br><br>If you denied, processing stops and the agent takes no action. | The agent is granted the appropriate credentials via the Microsoft Entra OBO flow and is now ready to restart the VM.<br><br>Alternatively, if the request is denied, or the user doesn't have the appropriate credentials, then the flow stops after this step. |
| 4 | **Agent executes the plan**<br>The agent carries out the actions against the generated plan and returns a response to the user. | Agent restarts the VM. |
| 5 | **Processing ends**<br>Either the requested operation completes, or processing is terminated because the agent was denied consent to execute the plan.<br><br>Execution could also stop if the user doesn't have the right credentials to provide to the agent. | The VM is restarted. |

Consider the following key takeaways when working in an autonomous incident resolution workflow:

* If you deny access to your credentials, the agent takes no action on your behalf.
* The agent first attempts to take action. If the agent is met with a security challenge, then it requests temporary access to your credentials.
* Any access to user credentials are revoked once the action is complete.

The agent behaves differently depending on the assigned permissions, the execution mode, and the type of action that it attempts to make.

### Read-only actions

The following table details how the agent behaves when it attempts to conduct a read-only operation that requires elevated permissions.

| Agent has permission? | Execution mode | Agent behavior |
|---|---|---|
| Yes | Review | Uses its permissions to perform the action |
| No | Review | Prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |
| Yes | Automatic | Uses its permissions to perform the action |
| No | Automatic | Prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |

### Write actions

The following table details how the agent behaves when it attempts to conduct a write operation.

| Agent has permission? | Execution mode | Agent behavior |
|---|---|---|
| Yes | Review | Prompts for consent to take action, and then uses its permissions to perform the action once consent is granted |
| No | Review | Prompts for consent to take action, and then prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |
| Yes | Automatic | Uses its permissions to perform the action |
| No | Automatic | Prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |

## Related content

* [Incident management](incident-management.md)
* [User access roles](user-access-roles.md)
