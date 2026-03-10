---
title: Chat from Your Tools in Azure SRE Agent
description: Interact with your agent directly in Microsoft Teams without leaving your current workflow.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: teams, bot, chat, integrations
#customer intent: As an SRE, I want to chat with my agent from Microsoft Teams so that I can investigate incidents without leaving my current workflow.
---

# Chat from your tools in Azure SRE Agent
Chat with your agent directly in Microsoft Teams. Send direct messages for private investigations, or `@` mention your agent in channels so your whole team sees the analysis. Every channel connects to the same agent with the same reasoning, memory, and tool access.

## The problem

Your agent lives in the SRE Agent portal, but you don't. You're in a Teams channel coordinating with your team, in a terminal running diagnostics, or deep in an incident thread gathering context. Every time you need your agent, you context-switch. To make the switch open a new tab, navigate to the portal, re-enter the context you already have, and then bring the answer back to where you started.

That round-trip breaks your flow. Your team can't see what you asked or what the agent found unless you copy-paste it. The context you built up in Teams doesn't travel with you.

## How it works

Your agent is accessible beyond the portal. Each channel connects to the same backend. Connecting to the identical backend allows the channel to connect to the same reasoning engine, the same connected data sources, and the same memory. A conversation started in Teams creates the same quality investigation as one in the portal.

:::image type="content" source="media/chat-from-your-tools/conversation-channels-external.svg" alt-text="Diagram showing ways to chat with your agent including Teams Bot and the portal." border="false":::

## Teams bot

Your agent appears as a Microsoft Teams bot. Message it directly for private investigations, or @-mention it in channels so your whole team sees the analysis.

### Direct messages

Start a private conversation, just like messaging a colleague:

```text
You: Why is api-gateway-prod returning 502 errors?

Agent: Checking api-gateway-prod...

Found 342 502 errors in the last hour.
Root cause: Health probe pointing to /health but deployment
changed endpoint to /healthz at 14:23.

Recommendation: Update health probe path to /healthz.
```

### Channel @-mentions

@-mention your agent in a Teams channel so everyone sees the investigation:

```text
Sarah: @SREAgent check prod health after the 2pm deploy

Agent: Running production health check...

✅ 10/12 services healthy
⚠️ api-gateway-prod: 502 error rate at 4.2%
⚠️ cache-service-east: Memory at 91%

Investigating api-gateway-prod errors...
```

Anyone in the channel can ask follow-up questions. The agent maintains context throughout the conversation.

### How Teams delivery works

When you message the agent in Teams, it sends a brief acknowledgment while deeper analysis runs in the background. The agent automatically delivers responses back to your Teams conversation. If you want full tool-call detail, you can also see the same investigation in the portal.

### Set up Teams

Teams bot integration requires deploying an Azure Bot Service resource and a Teams app manifest. For step-by-step instructions, see [Tutorial: Set up a Teams bot](teams-bot.md).

## What makes this different

The following table compares working with and without the chat-from-your-tools integration.

| Scenario | Without | With chat from your tools |
|--|--|--|
| **Context switching** | Leave Teams, open portal, re-enter context | Stay where you are — the agent comes to you |
| **Team visibility** | Only you see the analysis | The whole team sees it in the Teams channel |
| **Consistency** | Portal-only access | Same reasoning engine in every channel |

## Next step

> [!div class="nextstepaction"]
> [Set up the Teams bot](./teams-bot.md)

## Related content

- [Tutorial: Set up a Teams bot](teams-bot.md)
- [Agent reasoning](agent-reasoning.md)
