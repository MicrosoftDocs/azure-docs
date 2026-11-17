---
title: Agent identity in Azure SRE Agent
description: Learn how Azure SRE Agent uses managed identities and Microsoft Entra agent identities to authenticate to Azure resources and external connectors.
ms.topic: article
ms.service: azure-sre-agent
ms.date: 11/13/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: identity, managed identity, uami, connectors, oauth, security
#customer intent: As an SRE, I want to understand the identities my agent uses so that I can manage access and configure connectors correctly.
---

# Agent identity in Azure SRE Agent

When you create an agent, Azure automatically provisions identity resources. This article explains what gets created, why two identities exist, and how connectors use them.

For information about how your agent gets permissions on Azure resources (RBAC roles, permission levels, on-behalf-of flow), see [Agent permissions](permissions.md).

## What gets created

Two managed identities are created alongside your agent.

| Identity | What it is | What you do with it |
|---|---|---|
| **User-assigned managed identity (UAMI)** | A standalone identity resource in your resource group | Assign RBAC roles, select it when setting up connectors. This is the identity you manage |
| **System-assigned managed identity** | An internal identity used by the agent's infrastructure | Nothing—this identity is managed automatically and used for internal operations only |

The UAMI is the default identity you work with. It appears in your resource group, you assign RBAC roles to it, and you select it when setting up connectors. Creating an optional [Microsoft Entra agent identity](#microsoft-entra-agent-identity-preview) is separate from selecting an identity for Azure resource access.

> [!TIP]
> When you see a managed identity dropdown in the portal (for connectors, repositories, or other integrations), select your agent's UAMI. It's the identity that matches your RBAC role assignments.

## Where your agent's UAMI is used

Your agent's UAMI is the primary identity for most operations.

| Operation | Identity | Notes |
|---|---|---|
| **Azure resource operations** (Azure Resource Manager, CLI, diagnostics) | UAMI by default | The RBAC roles assigned to the configured identity determine what the agent can access |
| **Communication connectors** (Outlook, Teams) | UAMI + your OAuth credentials | You sign in via OAuth; the UAMI brokers authentication to the connector resource |
| **Data connectors** (Azure Data Explorer) | UAMI | Grant the UAMI permissions on the target Kusto cluster |
| **Source code connectors** (GitHub, Azure DevOps) | UAMI (for Azure DevOps managed identity) | Azure DevOps connector uses UAMI; GitHub uses OAuth |
| **MCP connectors** | Varies | You provide endpoint URL and credentials; optionally assign a managed identity for downstream Azure calls |
| **Internal infrastructure** | UAMI | Used automatically for the agent's internal operations |
| **Key Vault** | UAMI (preferred) or system-assigned | Falls back to system-assigned if no UAMI is specified |

## Microsoft Entra agent identity (preview)

Opt in to a governed identity in [Microsoft Entra Agent ID](/entra/agent-id/agent-identities) during [agent creation](set-up-entra-agent-id.md#create-an-agent-with-an-agent-identity), in **Advanced setup**. It isn't created by default and doesn't replace the agent's managed identities.

| Capability | UAMI | Microsoft Entra agent identity |
|---|---|---|
| Creation | Created with the agent. | Optional during agent creation in **Advanced setup**, or during Teams setup. |
| Governance | Azure RBAC role assignments. | Microsoft Entra sponsors, sign-in logs, and account controls. |
| Teams presence | Doesn't provide a Teams user account. | Selecting **Set up agent identity** during agent creation also provisions an agent user. Connecting it to [Teams](teams-integration.md) and assigning its license are separate. |

Creating an Agent ID doesn't change the selected identity for Azure resource access or transfer role assignments. The UAMI remains the default. Managed-identity connectors and service infrastructure keep their managed identities. Continue managing access through [agent permissions](permissions.md).

Where export is available, having the agent identity enables Agent 365 content export by default for person-started portal and Teams chat turns, with no per-agent opt-out. Its [data-handling and location rules](data-privacy.md#agent-365-observability) are separate from Azure resource-access permissions and the agent's deployment region.

## How connectors use identity

Different connector types use identity differently. The key distinction is whether the connector needs to go through Azure Resource Manager (ARM) to reach the external service.

### Communication connectors (Outlook, Teams)

When you set up a communication connector, two things happen:

1. **You sign in** with your account via OAuth, which gives the connector your user credentials.
1. **You select a UAMI** from the identity dropdown, which the connector uses to authenticate to the connector resource.

The connector stores your OAuth token securely in a connector resource. The connector resource acts as a secure bridge. The resource holds your credentials so the agent doesn't need direct access to them. It uses the UAMI to broker the authentication when the agent sends an email or posts a Teams message on your behalf.

Agent-user chat uses the separate [Teams integration](teams-integration.md) (preview). Each person signs in to that integration with their work account through a private Teams card; it doesn't use the setup administrator's outbound-connector authorization.

### Data connectors (Azure Data Explorer / Kusto)

For Kusto connectors, the agent uses the UAMI directly to authenticate to your Azure Data Explorer cluster. No OAuth sign-in is needed. Grant the UAMI the required permissions, such as the **Viewer** role, on the Kusto cluster.

### Source code connectors (GitHub, Azure DevOps)

Source code connectors use different authentication methods depending on the platform.

- **Azure DevOps:** Uses the UAMI for managed identity authentication. Select the UAMI from the identity dropdown and grant it access to your Azure DevOps organization.
- **GitHub:** Uses OAuth authentication. Sign in by using your GitHub account. No managed identity is needed for the GitHub connection itself.

### Custom MCP connectors

MCP connectors use endpoint-based authentication. Provide the MCP server URL along with credentials, such as an API key, Bearer token, or OAuth. You can optionally assign a managed identity for the MCP server to use when making downstream Azure API calls.

## Find your agent's UAMI

You can locate your agent's user-assigned managed identity from the agent portal, the Azure portal, or the Azure CLI.

**From the agent portal:**

1. Go to **Settings** > **General** and find the **Azure settings** section.
1. The identity name appears in the **Managed identity** field.
1. Select **Go to Identity** to open it in the Azure portal.

**From the Azure portal:**

1. Go to your agent's resource group.
1. Find the `id-*` managed identity resource.
1. Copy the **Object (principal) ID**. Use this value for RBAC role assignments.

**From Azure CLI:**

This command returns only attached user-assigned managed identities, not the governed Agent ID or agent user. To find the governed identity's name, use **Settings** > **General** > **Agent identity**.

```azurecli
# List user-assigned identities on the agent resource
az resource show \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <AGENT_NAME> \
  --resource-type Microsoft.App/agents \
  --api-version 2026-07-01 \
  --query identity.userAssignedIdentities
```

For the configured UAMI, use the matching entry's `principalId` for role assignments, not its resource ID or `clientId`.

## Next step

> [!div class="nextstepaction"]
> [Configure agent permissions](./permissions.md)

## Related content

- [Agent permissions](permissions.md): Learn how to configure RBAC roles and permission levels for your agent.
- [Connectors](connectors.md): Set up connector types and learn how they extend your agent's capabilities.
- [User roles and permissions](user-roles.md): Control who can view, interact with, and administer your agent.
- [Set up Microsoft Entra Agent ID](set-up-entra-agent-id.md): Create and verify a governed identity during agent creation.
- [Set up the Teams integration](set-up-teams-integration.md): Reuse an existing identity or complete new identity and agent user setup for Teams chat.
