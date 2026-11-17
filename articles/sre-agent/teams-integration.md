---
title: Chat with Azure SRE Agent in Microsoft Teams (preview)
description: Investigate issues with Azure SRE Agent in Teams, manage shared-conversation access, and respond to tool approval and authorization cards.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 11/13/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to investigate issues and respond to approval requests with my team in Microsoft Teams.
---

# Chat with Azure SRE Agent in Microsoft Teams (preview)

Use Teams to investigate issues with your team, choose subagents, and respond to tool requests. Conversations map to threads in the SRE Agent portal.

> [!NOTE]
> The Teams integration is in preview and requires a connected, licensed agent user. Start with [Teams setup](set-up-teams-integration.md).

## Start a conversation

| Conversation | Access required | How to use it |
| --- | --- | --- |
| Existing one-to-one chat | A chat-capable role, such as **SRE Agent Standard User**. Reader and Author alone don't permit chat. | Send a message; no mention is needed. |
| Group or meeting chat | An administrator's conversation grant covering the participant. | Add the agent and mention it to start. Follow-up messages don't need a mention unless muted. |
| Channel | An administrator's conversation grant covering the participant. | Mention the agent in a post. Each root post has its own agent thread; replies share that thread. |

On a private **Sign in** card, use your work account and wait for **Signed in**. If your original message got no response, send it again. Each person signs in separately.

Teams can show an acceptance reaction, **Thinking**, activity stages, approval cards, and the final reply. Select **View in SRE Agent** for the portal thread and tool details.

In a shared conversation, a message mentioning another person or agent but not this agent is ignored, even when unmuted.

## Allow access in shared conversations

An **SRE Agent Administrator** must grant access before the agent responds in a shared conversation. A grant replaces covered participants' individual SRE Agent role checks. Teams membership alone doesn't grant access.

Mention the agent with one of these commands:

| Command | Audience |
| --- | --- |
| `/grant` | Opens a card to select **All users**, **Current users**, or **Specific users**, then **Grant**. |
| `/grant All` | Everyone in the conversation. |
| `/grant Current` | People in the conversation at grant time. |
| `/grant Users a@contoso.com, b@contoso.com` | The listed people. |

Choose the narrowest audience. The `/grant` card expires after one hour; run the command again if needed.

### Review, change, or revoke grants

In **Communication Hub**, find the chat or channel. **Participant access** shows the scope; **Access updated** shows who changed it and when.

- **Change the audience:** Run `/grant` again in Teams.
- **Revoke access:** Select **Remove Grants**. The conversation and history are kept; one-to-one chats aren't affected.
- **Remove a thread or conversation:** **Remove this thread** and the row's **Remove** action also revoke grants for the **whole chat or channel**.

## Use commands

In shared conversations, mention the agent before a command.

| Command | Purpose | Who can use it |
| --- | --- | --- |
| `/new [prompt]` | Start a new agent thread. | Users who can chat. |
| `/agent` | List subagents and show the selected one. | Users who can chat. |
| `/agent <name> [prompt]` | Start with a subagent; also assign it in shared conversations. | Users who can chat (one-to-one); **SRE Agent Administrator** (shared). |
| `/cancel` | Stop the current operation. | Users who can chat. |
| `/mute` | Respond only when mentioned. | Users who can chat (shared only). |
| `/unmute` | Respond to follow-up messages without a mention. | Users who can chat (shared only). |
| `/grant` | Grant shared-conversation access. | **SRE Agent Administrator**. |

> [!NOTE]
> `/mute` doesn't remove access. To stop the integration, [disconnect Teams](set-up-teams-integration.md#disconnect).

In shared conversations, `/new` keeps the assigned subagent. Only an **SRE Agent Administrator** can change it.

## Approve tool calls

Conversation access, approval to use the agent's permissions, and permission to act on your behalf are separate.

| Card type | Label | Controls |
| --- | --- | --- |
| Tool approval | **Tool approval required** | **Approve** allows the call to use the agent's permissions. |
| Tool authorization | **Tool authorization required** | **Authorize** allows the call to use your permissions. |
| Azure CLI or kubectl approval | **Approval required**, with an action title such as **Updating Azure resource** | **Approve** when inline approval is allowed; otherwise approve in the portal. **Cancel**, **View in SRE Agent**. |
| Azure CLI or kubectl authorization | **Authorization required** or **Grant permissions to run this command** | **Grant permissions**, **Cancel**, **View in SRE Agent**. |

Review the command, parameters, and requested scope before responding.

Each approval applies to one call. Only an **SRE Agent Administrator** can approve or authorize; a conversation grant doesn't give this permission. On-behalf-of authorization has additional [account and permission requirements](permissions.md#on-behalf-of-obo).

Approval doesn't guarantee success: if the agent's permissions are refused, a separate **Grant permissions to run this command** card can follow, requesting use of your permissions.

On a CLI authorization card, **Cancel** lets the agent continue without that command; dismissing the card doesn't cancel it. The updated card shows the result and decision maker. Portal decisions also update the Teams card.

### Request notifications

Approval and authorization requests can be announced in one group chat, meeting chat, or channel, set under **Notifications** in **Communication Hub**. These cards offer only **View in SRE Agent**; approve or authorize in the portal. Requests from one-to-one Teams chats aren't announced, and a conversation isn't notified about itself. For scheduled reports, use a [notification connector](connect-notification-service.md).

### Group chat replies

In **Communication Hub**, **Group chat replies** sets where answers and approval cards appear in group chats:

- **In the main chat:** Directly in the chat, like a one-to-one chat.
- **In a thread:** In a thread under each message.

## Limitations

- Edits and deletions of messages don't trigger the agent.
- Interactive clarifying questions don't appear in Teams. The agent usually asks follow-up questions as text. If a thread pauses for a question, answer it in the portal through **View in SRE Agent**.
- Attachments require separate enablement.
- Channel context includes the root post and the last 24 replies.
- If a command or its parameters are too long to display in Teams, approve the request in the portal.
- You can't link a Teams chat to an incident.

## Related content

- [Set up the Teams integration](set-up-teams-integration.md)
- [Set up Microsoft Entra Agent ID](set-up-entra-agent-id.md)
- [User roles and permissions](user-roles.md)
- [Custom agents](sub-agents.md)
