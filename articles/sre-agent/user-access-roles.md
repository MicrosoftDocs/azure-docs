---
title: Role based access control to SRE Agent Preview
description: Learn how users with different roles can interact with SRE Agent.
author: craigshoemaker
ms.topic: conceptual
ms.date: 09/15/2025
ms.author: cshoe
ms.service: azure-sre-agent
---

# Role based access control to SRE Agent Preview

Collaborative environments require user access Azure SRE Agent without compromising governance or security. SRE Agent enforces a role-based access control (RBAC) model that defines how users interact with the agent based on their responsibilities. Whether you're monitoring incidents, triaging and requesting actions, or approving and executing remediations, each role is designed to enforce principle of least privilege access. This model ensures the agent remains secure, auditable, and aligned with your organization’s trust boundaries.

## Role hierarchy

Azure SRE Agent uses RBAC-enforced roles that grant different levels of access to resources in your environment.

- **SRE Agent Admin**: Grants full access to manage SRE Agent configurations including chats and incident response plans—and perform Azure resource actions.

- **SRE Agent Standard User**: Grants access to interact with the SRE Agent to triage incidents and run diagnostics.

- **SRE Agent Reader**: Grants read-only access to all SRE Agent data, including chats, incidents, logs, and configurations. Doesn't permit interaction with the agent.

> [!NOTE]
> The *SRE Agent Admin* role is automatically assigned to the user that creates the agent. That user can then delegate roles to other users.

Agent actions are categorized into the following categories:

- Chat threads
- Incident management

The following table maps roles to types of users to the key actions associated with how they use the agent.

| Role | Typical users | Key actions |
|---|---|---|
| *SRE Agent Reader* | Auditors, monitoring | ▪️View and read agent threads<br><br>▪️View and read resource graph and connected repos<br><br>▪️View and read incident management related activities |
| *SRE Agent Standard User* | L1 Ops, L2 SREs, specialists, first responders, and anyone who wants to query or diagnose Azure resources | ▪️All *SRE Agent Reader* allowed actions<br><br>▪️Create new agent threads and chat with the agent<br><br>▪️Connect source code repos to resources at resource graph level |
| *SRE Agent Admin* | Cloud Admins, SRE managers |▪️All *SRE Agent Standard User* allowed actions<br><br>▪️Create and manage incident response plans<br><br>▪️Approve thread/incident level actions - approve write tools / az cli / kubectl executions<br><br>▪️All delete actions  |

## Example workflow

To demonstrate the security model enforced by SRE Agent, the following table describes a hypothetical security flow from agent creation to usage. This example uses App Service as an example, but the result is the same for any Azure service managed by the agent.

| Step | Actor & role | Action | What happens | Enforcement |
|---|---|---|---|---|
| **1. Create agent** | Azure subscription *Owner* | Deploys a new SRE Agent with privileged access via the Azure portal or Bicep template. | A managed identity is created for the agent. | The creator is automatically assigned the *SRE Agent Admin* role in the agent. |
| **2. Assign roles** | Azure subscription *Owner* or default *SRE Agent Admin* (assigned after creation) | Uses Azure RBAC to grant:<br><br>▪️*SRE Agent Reader* to *Audit* group<br><br>▪️*SRE Agent Standard User* to standard users<br><br>▪️*SRE Agent Admin* to other administrators | Users are segmented by access role in the agent. | Azure RBAC enforces role assignment. User access roles inside the agent restrict which agent capabilities they can invoke. |
| **3. Triage** | *SRE Agent Standard User* (L1 Engineer) with *Contributor* RBAC on Azure Functions | User asks the agent: "Why is my Functions app having connectivity failures?" | Agent runs diagnostics via its managed identity with privileged rights on the Functions. The agent detects that `AzureWebJobsStorage` connection string is invalid. | Agent action limited to its managed identity RBAC (*Contributor* in this case). |
| **4. Request fix** | *SRE Agent Standard User* (L1 Engineer) | User issues the request, "Fix the configuration issue." | Agent drafts a remediation plan to update `AzureWebJobsStorage` setting and restart the app. | User’s *SRE Agent Standard User* role doesn't allow approval or execution of fixes. The agent sends the execution plan to an *SRE Agent Admin* for review and approval. |
| **5. Approval & execution** | *SRE Agent Admin* | Administrator reviews and approves the agent’s proposed change plan. | Agent executes the configuration update and restarts the app using its *Contributor* RBAC on the Functions app. | Execution succeeds because the agent identity has the required Azure RBAC rights. |
| **6. Monitoring** | *SRE Agent Reader* | User opens SRE Agent and sees, "Your Functions app is experiencing connectivity failures." | Reader can view compliance and health metrics. | Agent enforces view-only action, so the user can't interact with the agent or request fixes despite RBAC access on resources. |

## Assign agent roles

SRE Agent subscription owners can use Azure RBAC to grant the following roles for different types of people who use the agent:

- *SRE Agent Reader* to the *Audit* group  
- *SRE Agent Standard User* to any standard users  
- *SRE Agent Admin* to administrators to the agent

To assign roles to users, SRE Agent’s subscription owner uses the following process:

1. Open the agent in the Azure portal.

1. Select **Settings**.

1. Select **Access control  (IAM)**.

1. Select **Go to access control**.

1. Assign the appropriate roles to the relevant users.

    :::image type="content" source="media/user-access-roles/azure-sre-agent-roles.png" alt-text="Screenshot of Azure portal with SRE Agent roles.":::

## Related content

- [Agent run modes](./agent-run-modes.md)
- [Agent managed identity](./agent-managed-identity.md)