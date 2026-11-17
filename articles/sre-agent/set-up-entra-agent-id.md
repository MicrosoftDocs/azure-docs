---
title: Set up Microsoft Entra Agent ID for Microsoft Agent 365 integration (preview)
description: Create a governed Microsoft Entra agent identity and user for Azure SRE Agent, and review identity-based Agent 365 content export before opting in.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 11/13/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE administrator, I want to create a governed agent identity with my SRE Agent so that I can manage it in Microsoft Entra.
---

# Set up Microsoft Entra Agent ID for Microsoft Agent 365 integration (preview)

Create a governed Microsoft Entra Agent ID and its associated agent user while deploying a new Azure SRE Agent. Use the Agent ID for native Teams integration and configuration with Microsoft Purview and Microsoft Defender through Microsoft Agent 365.

The identity is separate from the agent's user-assigned managed identity (UAMI) for Azure resource access.

## Prerequisites

- An Azure subscription and [permissions to create an SRE Agent](create-and-set-up.md#prerequisites).
- The object ID of a sponsor: a user, or a Microsoft 365 or dynamic-membership group, in the subscription's tenant. Security groups aren't supported. In the Microsoft Entra admin center, find the user under **Users** or the group under **Groups** > **All groups**, and copy its **Object ID**.
- The subscription's Microsoft Entra tenant ID, plus an agreed user name, domain, and display name for the agent user.

## Create an agent with an agent identity

> [!IMPORTANT]
> Agent ID can cause data to be sent to the customer's sign-up regions. For more information, see [Agent 365 data handling](data-privacy.md#agent-365-observability).

1. Go to the [SRE Agent portal](https://sre.azure.com/), sign in, and select **Create agent**.
1. Complete **Basics**, including the subscription, resource group, name, region, model provider, and Application Insights. Configure the UAMI for Azure access as needed. See [Configure basics](create-and-set-up.md#configure-basics).
1. Select **Next** to open **Advanced setup**.
1. Under **Agent identity** (preview), select the **Set up agent identity** checkbox and complete the identity and agent user fields:

   | Field | What to provide |
   | --- | --- |
   | **Identity name** | A name for the governed identity, such as `sre-ops`. Required. |
   | **Sponsor object ID** | The **Object ID** of the sponsoring user or group. Required. |
   | **Tenant ID** | Leave the prefilled subscription tenant. Only that tenant is accepted. |
   | **Display name** | Required. The service appends ` (SRE Agent)` to the agent user's display name. |
   | **User name** and **Domain** | Both required; together they form the agent user's email address, such as `sre-oncall@contoso.com`. |
   | **Manager** | Your signed-in user account. It can't be changed in the wizard. |

1. Continue to **Review + create**. Verify the agent configuration, identity, sponsor, tenant, and agent user.
1. Start deployment and follow **Deploy** until it succeeds.

## Verify the provisioned identity

1. Open the agent and go to **Settings** > **General**.
1. Confirm **Agent identity** shows your identity name. Select it to open the identity in Microsoft Entra.

## Next steps

- **Azure resource access:** Creating the governed identity doesn't change the selected resource-access identity or copy the UAMI's role assignments. Continue managing access through [agent permissions](permissions.md).
- **Teams:** The agent user is already created. In [Teams setup](set-up-teams-integration.md), keep its loaded user name, domain, and display name unchanged to reuse it. Don't repeat user creation or delete the identity to restart setup.
- **Security and compliance:** Review [Microsoft Purview protections for Agent 365](/purview/ai-agent-365#getting-started-recommended-steps) and [Microsoft Defender setup for AI agents](/defender-xdr/security-for-ai/get-started-defender-security-for-ai).

For the distinction between governed identities and managed identities, see [Agent identity](agent-identity.md).
