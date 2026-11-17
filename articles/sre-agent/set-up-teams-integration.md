---
title: Set up the Teams integration for Azure SRE Agent (preview)
description: Create or reuse an agent identity and agent user, assign a Teams license, and verify a shared Teams conversation with Azure SRE Agent.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 11/13/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE administrator, I want to connect my agent to Teams so that my team can investigate issues in a shared conversation.
---

# Set up the Teams integration for Azure SRE Agent (preview)

Connect Azure SRE Agent to Microsoft Teams as an *agent user*, then verify it in a shared chat or channel.

> [!IMPORTANT]
> Where available, an agent identity enables sending conversation content, including prompts, responses, and tool content from chats that a person starts, to Microsoft Agent 365 for observability. **There's no per-agent opt-out.** Review [Agent 365 data handling](data-privacy.md#agent-365-observability) before setup.

For scheduled posts and reports, use a [notification connector](connect-notification-service.md) instead.

## Prerequisites

- The **SRE Agent Administrator** role and write access to the agent resource for setup and disconnect.
- A user account in the agent's subscription tenant. The person completing setup becomes the agent user's manager.
- The object ID of a sponsor: a user, or a Microsoft 365 or dynamic-membership group, in the subscription's tenant. Security groups aren't supported. In the Microsoft Entra admin center, find the user under **Users** or the group under **Groups** > **All groups**, and copy its **Object ID**.
- A Microsoft 365 administrator who can assign the agent user a license that includes Teams. Agree on the agent user's name and domain with them. SRE Agent doesn't assign or validate licenses.

## Set up the agent identity and user

If **Communication Hub** already shows **Connected to Teams**, [skip to licensing and verification](#assign-a-teams-license-and-verify-a-shared-chat). Don't delete an existing identity or user to repeat setup.

1. In the portal, open **Communication Hub** and select **Set up this agent for Microsoft Teams**.
1. Review or enter the identity details:
   - **New identity:** Enter an **Identity name** and **Sponsor object ID** for the user or group sponsoring the identity. Confirm **Tenant ID** matches your subscription's tenant.
   - **Existing identity:** The details are prefilled. Keep them.
1. Review or enter the agent user details:
   - **New user:** Enter a **User name**, **Domain**, and **Display name**. The sign-in name is user name at domain, such as `sre-oncall@contoso.com`. The service adds ` (SRE Agent)` to the display name.
   - **Existing user** (for example, created with the agent): Keep the prefilled values unchanged to reuse the user.

   Record the user's sign-in name; your Microsoft 365 administrator needs it to assign the license.
1. Confirm **Manager** shows your account and can't be changed in the wizard, then review the license information.

   **Caution:** The tenant and sponsor can't be changed after the identity is created. Verify both before finishing setup.

1. Select **Finish setup**.

## Assign a Teams license and verify a shared chat

1. Have your Microsoft 365 administrator assign the agent user a license that includes Teams.
1. In Teams, add the agent to a test group chat or channel. For example, select **Add agents**, then search for the agent.
1. As an **SRE Agent Administrator**, mention the agent and send `/grant`. Choose the narrowest audience, then select **Grant**. See [shared-conversation access](teams-integration.md#allow-access-in-shared-conversations).
1. As a granted participant, mention the agent and ask a read-only question, such as *"What is your Azure SRE Agent resource ID? Don't make any changes."*
1. If a private **Sign in** card appears, sign in with your work account. If your question gets no response after **Signed in**, send it again.

**Checkpoint:** The agent replies in Teams, and the conversation appears in **Communication Hub**.

For commands, approvals, and day-to-day use, see [Chat with Azure SRE Agent in Teams](teams-integration.md).

## Disconnect

1. In **Communication Hub**, select **Disconnect**.
1. To keep the identity and agent user, leave **Also delete the agent user and agent identity** cleared.
1. Select **Disconnect** and wait for **Agent disconnected from Teams**.

Existing Teams conversations and history aren't deleted. Remove [conversation grants](teams-integration.md#review-change-or-revoke-grants) and the Teams license separately if they're no longer needed.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Setup reports a tenant mismatch or `TenantNotAllowed` | Use the subscription's tenant and sign in to that tenant. |
| `ProvisioningDisabled` | Agent identity isn't available in this region yet. |
| Identity provisioning fails | Review the provisioning error and check the sponsor and identity name: at most 128 characters, no `/`, and not `system` or `none`. |
| The agent doesn't appear in **Add agents** | Confirm that the correct agent user has a license that includes Teams. |
| A participant gets no response | Confirm a grant covers them, they've signed in, and they sent a new message after access was granted. |

## Related content

- [Chat with Azure SRE Agent in Teams](teams-integration.md)
- [Set up Microsoft Entra Agent ID](set-up-entra-agent-id.md)
- [Agent identity](agent-identity.md).
- [User roles and permissions](user-roles.md)
