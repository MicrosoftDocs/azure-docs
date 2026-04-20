---
title: Set up the Teams connector in Azure SRE Agent
description: Connect your Azure SRE Agent to a Microsoft Teams channel so it can post updates, reply to conversation threads, and read channel messages.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: teams, connector, notifications, channels, microsoft teams, setup
#customer intent: As an SRE, I want to connect my agent to Microsoft Teams so that it can post investigation updates and notifications to my team's channel.
---

# Set up the Teams connector in Azure SRE Agent

**Estimated time**: 5 minutes

Connect your agent to a Microsoft Teams channel so it can post updates, reply to threads, and read messages. After you complete this tutorial, your agent can send contextual notifications to your team without leaving the SRE Agent portal.

> [!TIP]
> To learn how your agent uses Teams and Outlook for contextual notifications, see [Send notifications](send-notifications.md).

## What you accomplish

By the end of this tutorial, your agent can:

- Post messages to a Microsoft Teams channel
- Reply to existing conversation threads
- Read channel messages for context during investigations

## Prerequisites

Before you begin, make sure you have the following resources and access:

| Requirement | Details |
|---|---|
| **Agent created** | Complete [Step 1: Create an agent](create-agent.md). |
| **Microsoft Teams account** | Access to the target channel where your agent posts messages. |
| **Teams channel URL** | You get this during setup from the target channel. |
| **Contributor role** | Requires `Microsoft.Web/connections/write` and `Microsoft.Authorization/roleAssignments/write` on the agent's resource group. |
| **Managed identity** | A system-assigned or user-assigned managed identity configured on the agent. For more information, see [Connectors](connectors.md). |

## Step 1: Go to connectors

Open the connector configuration page in the SRE Agent portal.

1. Open your agent in the [Azure SRE Agent portal](https://sre.azure.com).
1. In the left sidebar, expand **Builder**.
1. Select **Connectors**.

## Step 2: Add a Teams connector

Add a new Teams connector from the connector picker.

1. Select **Add connector** in the toolbar.
1. In the connector picker, select **Send notification** (Microsoft Teams).
1. Select **Next**.

> [!NOTE]
> Your agent can have only one Teams connector. If a connector already exists, the card is disabled with the message "Your agent can only have one Teams connector."

## Step 3: Sign in to Microsoft Teams

Authenticate by using your Microsoft account to authorize the agent to send messages on your behalf.

1. Wait for the permission check to complete.
1. Select **Sign in to Microsoft Teams**.
1. Complete the OAuth authentication in the popup window.
1. On success, a **Connected as** card appears showing your email address with a green checkmark.

**Checkpoint:** A green checkmark is visible with your email address. If you see a permissions warning, verify you have the Contributor role on the resource group.

> [!WARNING]
> If the authentication dialog doesn't appear, check that your browser isn't blocking popups from `sre.azure.com`.

## Step 4: Paste Teams channel link

Provide the URL for the Teams channel where your agent posts messages.

1. In Microsoft Teams, right-click the target channel and select **Get link to channel**.
1. Copy the channel URL.
1. Back in the connector setup form, paste the URL into the **Teams channel link** field.

The URL should look like:

```
https://teams.microsoft.com/l/channel/19%3A...%40thread.tacv2/channel-name?groupId=...
```

The form automatically extracts the channel ID and group ID from this URL.

**Checkpoint:** The form accepts the URL without error. If the URL is invalid, the field clears the extracted IDs. Verify you copied the link from **Get link to channel** and not from a meeting or chat link.

## Step 5: Select managed identity and save

Choose a managed identity and finalize the connector.

1. From the **Managed identity** dropdown, select a managed identity (system-assigned or user-assigned).
1. Select **Next** to proceed to the **Review + add** step.
1. Verify your connector details.
1. Select **Add connector** to create the connector.

> [!TIP]
> If no managed identities appear in the dropdown, select **Add identity** to configure one in the Azure portal, and then select the refresh button.

**Checkpoint:** A toast notification confirms the connector was created successfully. Your connector appears in the connectors list.

## Step 6: Test your Teams connector

Verify the connector works by asking your agent to post a message.

Ask your agent:

```text
Post to our Teams channel: "SRE Agent is connected and ready for notifications"
```

Your agent formats the message as HTML and posts it to the configured Teams channel.

**Checkpoint:** The agent shows a tool card confirming the message was posted. Check your Teams channel to verify the message appeared.

## Edit or remove the connector

After setup, you can modify or delete your Teams connector from the connectors list.

### Edit

Use the following steps to update an existing Teams connector.

1. In the connectors list, select the **⋯** (more actions) menu on the Teams connector row.
1. Select **Edit connector**.
1. Update the Teams channel link, reauthenticate, or change the managed identity.
1. Select **Save**.

### Delete

Use the following steps to remove a Teams connector.

1. Select **⋯** on the connector row and then select **Delete connector**. Alternatively, select the checkbox and select **Remove** in the toolbar.
1. Confirm the deletion.

After you delete the connector, your agent can't post to Teams. You can add a new Teams connector at any time.

## Troubleshooting

The following table describes common issues and their solutions.

| Issue | Solution |
|---|---|
| Channel link not accepted | Ensure the URL is from **Get link to channel** in Teams, not a meeting or chat link. |
| Permissions warning | You need `Microsoft.Web/connections/write` and `Microsoft.Authorization/roleAssignments/write` roles on the resource group. |
| OAuth popup blocked | Allow popups from `sre.azure.com` in your browser settings. |
| Message doesn't appear in channel | Verify the channel URL is correct and your signed-in account has access to that channel. |
| No managed identities in dropdown | Select **Add identity** to configure one in the Azure portal, then select the refresh button. |

## Summary

Your agent now has an authenticated connection to a Microsoft Teams channel. It can post investigation summaries, reply to threads, and read channel messages on your behalf.

## Next step

> [!div class="nextstepaction"]
> [Send notifications](send-notifications.md)

## Related content

- [Send notifications](send-notifications.md): Learn how your agent uses Outlook and Teams for contextual notifications.
- [Connectors](connectors.md): Overview of all connector types.
- [Scheduled tasks](scheduled-tasks.md): Automate Teams notifications on a schedule.
