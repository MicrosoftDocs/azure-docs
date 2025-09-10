---
title: Azure SRE Agent Preview roles and access management
description: TODO.
author: craigshoemaker
ms.topic: conceptual
ms.date: 09/09/2025
ms.author: cshoe
ms.service: azure-sre-agent
---

<!-- 

who can create agent
who can access agent
how can agent perform actions

 -->

# Azure SRE Agent Preview roles and access management

The Azure SRE Agent features a flexible model for managing roles and access management based on Azure RBAC and the [Principle of Least Privilege](/entra/identity-platform/secure-least-privileged-access). The security model implemented in SRE Agent ensures that users only interact with the agent and managed resources according to the overall permission model.

Azure SRE Agent uses different roles that grant different levels of access to resources in your environment. There are three different RBAC-enforced roles associated with Azure SRE Agent:

- **SRE Agent Admin**: Has full control of the agent’s lifecycle. Can approve and execute fixes proposed by the agent.

- **SRE Agent User**: Can triage incidents, ask diagnostic questions, request fixes, and escalate issues to administrators.

- **SRE Agent Reader**: Has read-only access to dashboards, logs, and reports.

> [!NOTE]
> The Administrator role is automatically assigned to the user creating the agent. That user can then delegate roles to other users.

The following table maps roles to types of users to the key actions associated with how they use the agent.

| Role | Typical users | Key actions |
|---|---|---|
| SRE Agent Admin | Cloud Admins, SRE managers | Full lifecycle, approve actions |
| SRE Agent User | L1 Ops, L2 SREs, specialists, first responders | Chat with the agent, initiate diagnostics, initiate write actions |
| SRE Agent Reader | Auditors, monitoring | View chats, configs, logs |

## Example workflow

To demonstrate the security model enforced by SRE Agent, the following table describes the typical security flow from agent creation to usage.

| Step | Actor & role | Action | What happens | Enforcement |
|---|---|---|---|---|
| 1. Create agent | Azure Subscription Owner | Deploys a new SRE Agent via the Azure portal or Bicep template. | A managed identity is created for the agent. | The creator is automatically assigned the *SRE Agent Admin* role in the agent. |
| 2. Assign roles | Azure Subscription Owner or default SRE Agent admin (assigned after creation) | Uses Azure RBAC to grant:<br><br>– SRE Agent Reader to Audit group<br><br>– SRE Agent User to standard users<br><br>– SRE Agent Admin to other Admins | Users are now segmented by access role in the agent. | Azure RBAC enforces role assignment. User Access Roles inside the agent restrict which agent capabilities they can invoke. |
| 3. Triage | SRE Agent User (L1 Engineer) with Contributor RBAC on App Service | Asks agent: "Why is my web app returning 500 errors?" | Agent runs diagnostics via its managed identity (with Privileged rights on the App Service). Detects that `AzureWebJobsStorage` connection string is invalid. | Agent action limited to its managed identity RBAC (Contributor in this case). |
| 4. Request Fix | SRE Agent User (L1 Engineer) | Requests: "Fix the configuration issue." | Agent drafts a remediation plan: update `AzureWebJobsStorage` setting and restart App Service. | User’s SRE Agent User role doesn't allow approval/execution of fixes. The agent sends the execution plan to Admin for review. |
| 5. Approval & execution | SRE Agent Admin | Reviews and approves agent’s proposed change plan. | Agent executes the configuration update and restarts App Service using its Contributor RBAC on the App Service. | Execution succeeds because the agent identity has the required Azure RBAC rights. |
| 6. Monitoring | SRE Agent Reader | Opens SRE Agent and sees: "App Service is reporting HTTP 500 errors." | Auditor can view compliance and health metrics. | Agent enforces View-Only action, so auditor can't request fixes despite RBAC access on resources. |

:::image type="content" source="media/roles-access-management/azure-sre-agent-roles-onboarding.png" alt-text="Diagram of Azure SRE Agent roles onboarding flow.":::

### Agent actions

The agent can only take action when it has user consent and the appropriate RBAC assignments to take an action. Users provide explicit consent when the agent is running in review mode, and implicit consent for agents working autonomously in the context of an incident response plan.

Examples of agent actions include:

- Create or update incidents in connected platforms (PagerDuty, ServiceNow, GitHub, Azure DevOps).

- Run diagnostics on Azure resources (query logs, fetch metrics, inspect states).

- Execute mitigations (restart services, scale resources, rollback deployments).

- Access observability data (dashboards, charts, traces).

For more information on how RBAC security is enforced, see [Agent actions in Azure SRE Agent](agent-actions.md).

## User actions

Azure RBAC enforces security at the resource, resource group, or subscription level.

Consider the following questions:

- What happens when a user's permission level doesn't match what they are trying to do in the agent?

- What happens when a user is more restricted inside the agent than they are outside the agent?

The answer to both of these questions is the same. The agent permissions scope takes precedence. This security model prevents "backdoor" elevation of privileges via the agent.

Here's a few example scenarios that can help illustrate how the security model is enforced.

| Scenario | User's SRE Agent role | User's other role profile | Description |
|---|---|---|---|
| User has elevated rights on the agent's resource group, but only has reader access to the agent. | *SRE Agent Reader* | *Owner* role on the agent's resource group | The RBAC rules normally would allow this user to create or delete resources in the resource group, however this user's capability is limited inside the agent. Since the user is only set as an *SRE Agent Reader*, the user can only view logs, chats, and configuration files. |
| User is an owner to a resource, but is only a user of the agent. | *SRE Agent User* | *Owner* on an AKS cluster managed by SRE Agent | The user, outside the agent, can directly scale the cluster via CLI or Azure portal since this user has the *Owner* role to the AKS cluster. However, within the agent, their *SRE Agent Reader* role restricts them to only triage, diagnostics, and escalation requests.<br><br>This user can't approve mitigations inside the agent, even with elevated privileges outside the agent. Only *SRE Agent Admin* users can perform these privileged actions. |
| User is an administrator to the agent, but it has limited access to resources managed by the agent. | *SRE Agent Admin* | User *doesn't* have *Contributor* or *Owner* access to an App Service instance managed by the agent | A request fails when this user tries to roll back the App Service instance. This operation fails because the agent’s managed identity doesn't have *Contributor* permissions on the App Service instance.<br><br>The *SRE Agent Admin* role gives the user authority in the agent, but Azure RBAC rules enforce boundaries limit what the user can do outside the agent. |

## Assign agent roles

SRE Agent Subscription Owners use Azure RBAC to grant the following roles for different types of people using the agent:

– *SRE Agent Reader* to the *Audit* group  
– *SRE Agent User* to any standard users  
– *SRE Agent Admin* to administrators to the agent

To assign roles to users, SRE Agent’s subscription owner uses the following process:

1. Open the agent in the Azure portal.

1. Select **Settings**.

1. Select **Access control  (IAM)**.

1. Select **Go to access control**.

1. Assign the appropriate roles to the relevant users.
