---
title: Send Notifications in Azure SRE Agent
description: Send contextual notifications to Microsoft Teams, Outlook, or MCP-enabled tools with investigation summaries, root cause analysis, and recommended actions.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: notifications, alerts, Teams, Outlook, email, messages, MCP, attachments
#customer intent: As an SRE, I want to send contextual notifications from my agent so that my team gets investigation summaries instead of raw alerts.
---

# Send notifications in Azure SRE Agent
Azure SRE Agent sends contextual notifications to Microsoft Teams, Outlook, or any MCP-enabled tool. Instead of forwarding raw alerts, the agent investigates first and then delivers summaries that include root cause analysis, impact assessment, and recommended actions so your team can act immediately.

<!-- > [!VIDEO <VIDEO_URL_FOR_AZURE_SRE_SMART_NOTIFICATIONS>]
Replace <VIDEO_URL_FOR_AZURE_SRE_SMART_NOTIFICATIONS> with the hosted URL for the Azure SRE Smart Notifications video. -->

> [!TIP]
> Your team gets an investigation summary, not raw alerts. Context is included automatically so recipients can act immediately. Works with Outlook and Teams built-in, plus any MCP-enabled tool.

## The problem

Raw alerts tell you something is wrong without telling you what to do. You get "High CPU on prod-web-01" and then spend 15 minutes investigating before you can act.

## How notifications work

Your agent investigates first, then sends notifications with context already included. Ask in chat: "Send an email to the team summarizing what happened with the checkout errors." The agent formats findings, adds evidence links, and sends the message through connected channels.

### Built-in channels

The following table describes the built-in notification channels.

| Channel | Connector | Description |
|---------|-----------|-------------|
| **Outlook** | Office 365 Outlook | Send email, reply to threads, list inbox |
| **Teams** | Microsoft Teams | Post to channels, reply to threads, read messages |

### Non-Microsoft tools via MCP

Any tool with an MCP server can receive notifications. If your team uses PagerDuty, Slack, Jira, or another system that exposes an MCP server, connect it through **Builder > Connectors > MCP server**. The agent discovers available tools automatically from the MCP server. No built-in integration is required.

## What makes notifications different

Unlike alert forwarding, your agent doesn't pass signals through unchanged. It investigates first, then notifies you with context that includes root cause, impact, and recommended action.

Unlike manual notifications, your agent formats findings professionally. You don't need to copy and paste between tools or summarize the same incident multiple times for different audiences.

Unlike runbook-driven escalation, your agent decides what to include based on what it discovered. If the investigation found that a deployment caused the issue, that detail is included in the notification.

## Before and after

The following table compares notification workflows before and after using the agent.

| Before | After |
|--------|-------|
| Raw alert: "High CPU on prod-web-01" | Contextual summary with root cause and recommended fix |
| Copy-paste investigation notes into email | Agent formats findings as professional HTML |
| Manually post updates to Teams | Agent replies to the same thread as the issue evolves |
| Remember which channel gets which severity | Agent uses connected tools based on your request |

## Email capabilities

The Outlook connector provides the following tools.

| Tool | Description |
|------|-------------|
| **Send email** | Compose and send to any recipient with HTML formatting |
| **Get email** | Retrieve a specific email by ID (body truncated at 12,288 characters) |
| **Reply to email** | Continue existing email threads |
| **List emails** | Read message metadata from any folder (bodies excluded to prevent context overflow) |
| **Move email** | Organize messages into folders |

The agent automatically formats investigation findings as professional HTML emails. All email tools support shared mailboxes. Specify an optional mailbox address to send from or read a shared inbox.

### Attachments

The agent can send emails with file attachments. Total attachment size must be 5 MB or less across all files in a single email. The agent validates attachment size before sending and returns a clear error if the limit is exceeded.

## Teams capabilities

The Teams connector provides the following tools.

| Tool | Description |
|------|-------------|
| **Post message** | Send to a configured Teams channel |
| **Reply to thread** | Update an existing conversation |
| **Get messages** | Read recent channel messages |

Updates about the same issue stay in the same thread, so your channels stay organized.

> [!NOTE]
> Teams messages must be formatted as HTML, not Markdown. The agent handles this formatting automatically when composing messages.

## Use notifications

After you connect Outlook or Teams through **Builder > Connectors**, ask the agent directly in chat:

```text
Send an email to oncall@contoso.com summarizing the investigation
```

```text
Post to our Teams channel that the deployment rollback completed
```

The agent uses connected tools immediately. No subagent is required for ad-hoc notifications. For automated notifications triggered by scheduled tasks or incident response plans, configure the tools on the appropriate subagent.

## Set up notification connectors

Before your agent can send email or post to Teams, connect the appropriate connector and sign in by using your Microsoft account. Both connectors use an OAuth sign-in flow. Your agent sends notifications as the authenticated user.

The following table summarizes the setup process for each connector.

| Connector | Setup path | Sign-in flow | Result |
|-----------|------------|--------------|--------|
| **Office 365 Outlook** | **Builder > Connectors > Add connector > Send email** | Sign in by using your Microsoft account (OAuth) | Your agent can send email, reply to threads, and list inbox as you |
| **Microsoft Teams** | **Builder > Connectors > Add connector > Send notification** | Sign in by using your Microsoft account (OAuth), then paste a Teams channel link | Your agent posts to the linked channel as you |

Key details:

- Both connectors authenticate through OAuth. You don't need API keys or service accounts.
- Your agent sends notifications as the signed-in user. Recipients see the message from your account, not from a bot.
- To change the sending identity, disconnect and reconnect by using a different Microsoft account.
- Your agent can have one Outlook connector and one Teams connector at a time. The **Add connector** wizard disables a connector type if one already exists.

## Best practices

The following table describes recommended practices for notifications.

| Practice | Why |
|----------|-----|
| **Ask explicitly** | The agent only sends notifications when you ask. It doesn't send email unsolicited. |
| **Use scheduled tasks for digests** | Collect findings and post once daily instead of per-alert. |

## Next step

> [!div class="nextstepaction"]
> [Set up the Teams bot](./teams-bot.md)

## Related content

- [Scheduled tasks](scheduled-tasks.md)
- [Workflow automation](workflow-automation.md)
- [Run modes](run-modes.md)
- [Get started: Automate and extend](automate-actions.md)
