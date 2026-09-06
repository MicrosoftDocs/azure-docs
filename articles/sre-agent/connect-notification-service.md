---
title: Connect a Notification Service in Azure SRE Agent
description: Learn how to connect Office 365 Outlook, Microsoft Teams, Google Gmail, and Yammer/Viva Engage to Azure SRE Agent so your agent can send incident updates with approval.
author: craigshoemaker
ms.author: cshoe
ms.date: 07/17/2026
ms.topic: tutorial
ms.service: azure-sre-agent
ai-usage: ai-assisted
ms.custom: connectors, managed-connectors, outlook, teams, gmail, yammer, viva-engage, notifications
#customer intent: As an SRE, I want to connect a notification service so that my agent can notify people during an incident with my approval.
---

# Connect a notification service

Use a notification service when the agent needs to share what it finds. It can email an incident summary or post an update to a collaboration channel so the right people see the investigation status.

This tutorial covers Office 365 Outlook, Microsoft Teams, Google Gmail, and Yammer/Viva Engage. These connectors use the managed connector wizard, so this article focuses on notification details: authentication, operations, and governance that keeps messages going to the right destination.

> [!IMPORTANT]
> Managed connectors are in preview. Connector availability, fields, and operations can change.

## Prerequisites

- A running SRE Agent and access to [sre.azure.com](https://sre.azure.com).
- Permission to configure connectors on the agent.
- An account for the service with permission to send mail or post to the destination you want to use.

If you haven't set up a connector before, start with [Set up a managed connector](setup-managed-connector.md) for the full wizard walkthrough. This article calls out only the notification differences.

## Notification connectors

| Connector | Service | Availability | Authentication | Typical use |
|-----------|---------|--------------|----------------|-------------|
| Office 365 Outlook | Microsoft Outlook | Default | Sign in with OAuth | Send email summaries and updates |
| Microsoft Teams | Microsoft Teams | Default | Sign in with OAuth | Post messages to Teams channels and chats |
| Google Gmail | Google Gmail | Preview | Sign in with OAuth | Send and read Gmail messages |
| Yammer/Viva Engage | Microsoft Viva Engage | Preview | Sign in with OAuth | Post messages to Viva Engage communities |

These notification connectors use a single sign-in. Messages come from the account you authorize, so the agent's messages appear from you or that account.

## Step 1: Add the connector

1. Go to [sre.azure.com](https://sre.azure.com) and select your agent.

1. In the left sidebar, expand **Builder**, and then select **Connectors**.

1. Select **Add connector**.

1. On the **Notification** tab, select your service.

## Step 2: Authenticate

1. Complete the sign-in or credential flow shown by the connector.

1. Wait for the connection card to show a green checkmark and your account name or connection status.

## Step 3: Set up tools

On the **Set up tools** step, enable the operation that sends the message you want. For example, choose a send-email operation, a post-to-channel operation, or another notification operation shown by the connector.

A notification connector usually needs only one or two operations. Enable the smallest set that supports your incident communication process.

## Step 4: Govern destinations

Notification operations reach people and durable systems, so govern them carefully. Lock the destination and require approval.

1. Set send and post operations to **Ask** so the agent shows you each message before it sends.

1. Turn on **Parameter policy** for that operation and lock the destination. Lock the recipient address for email or the channel, chat, or community for Teams, Gmail, or Viva Engage.

For a send-email operation, a safe configuration looks like this:

| Parameter | Policy | Result at runtime |
|-----------|--------|-------------------|
| To | Locked to your on-call list | The agent always sends to this address. |
| Subject | Agent-filled | The agent writes the subject from context. |
| Body | Agent-filled | The agent writes the body from context. |

For a channel or community post, lock the channel, chat, or community destination and let the agent fill the message body from incident context. The agent can draft the update without choosing where it lands.

## Step 5: Validate with a scenario

1. Open a chat with your agent.

1. Ask it to send a summary, such as:

   ```text
   Send a summary of the last incident to the on-call channel.
   ```

1. Because you set the operation to **Ask**, the agent shows the message it plans to send, including the locked destination.

1. Review and approve the action. Confirm it arrived in the mailbox, channel, chat, or community.

When the update lands in the right place with your approval, the connector and its governance work end to end.

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| The message goes to the wrong place | The destination parameter isn't locked | Reopen the connector, turn on parameter policy for the operation, and lock the recipient, channel, chat, or community. |
| The agent sends without asking | The operation is set to Allow | Reopen the connector and set the operation to Ask. |
| Send or post fails with a permission error | The account can't write to that destination | Confirm the account can send mail or post to the destination, then retry. |
| The agent can't find the channel, chat, or community | The destination name is wrong or the account doesn't have access | Confirm the exact destination and that the account has access. |

## Related content

- [Connect a source code service](connect-code-service.md)
- [Connect a telemetry source](connect-telemetry-source.md)
- [Set up a managed connector](setup-managed-connector.md)
