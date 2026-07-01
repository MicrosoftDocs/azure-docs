---
title: Run your first investigation with Azure SRE Agent
description: Ask your agent to investigate a live issue and watch it diagnose root causes using your code, Azure resources, and knowledge files.
ms.topic: tutorial
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.service: azure-sre-agent
ms.ai-usage: ai-assisted
ms.custom: first investigation, chat, diagnose, root cause, getting started
#customer intent: As a site reliability engineer, I want to run my first investigation so that I can see how the agent diagnoses issues using my code, Azure resources, and knowledge files.
---

# Run your first investigation with Azure SRE Agent

**Estimated time**: 5 minutes

Ask the agent to investigate an issue and watch it diagnose the root cause using your code, Azure resources, and the knowledge files it built during onboarding.

## What you accomplish

By the end of this guide, you:

- Ask the agent to investigate a live issue in chat
- Watch it read source code, query Azure resources, and check logs in real time
- Receive a root cause diagnosis with code references and a recommended fix

## Prerequisites

| Requirement | Details |
|---|---|
| **Completed Steps 1–3** | [Create your agent](create-agent.md), [Add knowledge](first-value.md), and [Connect source code](connect-source-code.md). |
| **Code repository connected** | The agent needs access to your source code to trace errors to specific files. |

> [!TIP]
> You can still run an investigation without all data sources connected, but the results are richer with code and Azure resources. To complete your setup, see [Complete your setup](complete-setup.md).

## Start the investigation

Open a new chat thread and describe the problem you want the agent to investigate.

1. Select **New chat thread** in the left sidebar.
1. Describe the problem you want investigated. Be specific about which service or resource group is affected. For example:

   > "Users report that the Add to Cart feature on our app is broken. The cart API returns errors. Can you investigate the container apps in the resource group?"

1. Select **Send**.

:::image type="content" source="media/first-investigation/chat-asking-about-issue.png" alt-text="Screenshot of the chat input with an investigation request describing a broken cart API." lightbox="media/first-investigation/chat-asking-about-issue.png":::

### Watch the agent work

The agent builds an investigation plan and executes it step by step. You can watch each phase in real time.

**Phase 1: Read context:** The agent reads the knowledge files it built during onboarding, including architecture docs, team context, and runbooks, to orient itself.

**Phase 2: Explore code:** When you use [deep context](workspace-tools.md), the agent reads source files from your connected repository. It searches for code paths related to the issue, identifies error handlers, and traces the call chain.

:::image type="content" source="media/first-investigation/agent-investigating-1.png" alt-text="Screenshot of the agent reading source code files and identifying a memory leak in CartController.cs." lightbox="media/first-investigation/agent-investigating-1.png":::

**Phase 3: Query Azure resources:** The agent runs Azure CLI commands to check live resource state, including container app status, memory and CPU limits, system logs, and console logs.

**Phase 4: Deliver the diagnosis:** The agent presents a structured diagnosis with the following details:

- **Root cause**: The specific code bug or configuration issue, with file and line number references.
- **Evidence** Code snippets, crash logs, and resource constraints that confirm the finding.
- **Recommended fix**: Exactly what to change, with a code diff showing lines to remove or modify.

:::image type="content" source="media/first-investigation/agent-recommended-fix.png" alt-text="Screenshot of the agent presenting root cause analysis with a code fix and crash log evidence." lightbox="media/first-investigation/agent-recommended-fix.png":::

**Checkpoint:** The agent delivers a complete investigation with root cause, evidence from live logs, and a recommended code fix, all traced back to your actual source code and Azure resources.

> [!TIP]
> Try asking about something real in your environment:
>
> - "Check the health of the container apps in resource group X."
> - "We're seeing 5xx errors on our API. Can you investigate?"
> - "What recent changes were deployed to our backend service?"

## Next step

> [!div class="nextstepaction"]
> [Step 4: Incident response](incident-response.md)

## Related content

- [Workspace tools](workspace-tools.md): How the agent reads, searches, and edits code.
- [Root cause analysis](root-cause-analysis.md): How the agent identifies root causes.
- [Complete your setup](complete-setup.md): Connect any data sources you skipped.
- [Ask the agent for help](ask-agent.md): More examples of what you can ask.
