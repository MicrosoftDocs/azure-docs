---
title: Run your first investigation with Azure SRE Agent
description: Ask your agent to investigate an issue using the code, logs, Azure resources, and knowledge connected to your agent.
ms.topic: tutorial
ms.date: 08/21/2026
author: craigshoemaker
ms.author: cshoe
ms.service: azure-sre-agent
ms.ai-usage: ai-assisted
ms.custom: first investigation, chat, diagnose, root cause, getting started
#customer intent: As a site reliability engineer, I want to run my first investigation so that I can see how the agent diagnoses issues using my code, Azure resources, and knowledge files.
---

# Run your first investigation with Azure SRE Agent

**Estimated time**: 5 minutes

Ask the agent to investigate an issue by using the context connected to your agent.

[!INCLUDE [evaluate-offer](includes/evaluate-offer.md)]

## What you accomplish

By the end of this guide, you:

- Ask the agent to investigate a live issue in chat
- Watch it use the code, logs, and Azure resources available to it
- Review a diagnosis grounded in the connected sources

## Prerequisites

| Requirement | Details |
|---|---|
| **Completed Steps 1–2** | [Create and set up](create-and-set-up.md) and [Team onboarding](team-onboard.md). |
| **Recommended context** | Connect code, logs, and Azure resources for richer results. You can still investigate with partial setup. |

> [!TIP]
> You can still run an investigation without all data sources connected, but the results are richer with code and telemetry. Optional Azure resource access can add live resource context. To complete your setup, see [Complete your setup](complete-setup.md).

## Start the investigation

Open a new chat thread and describe the problem you want the agent to investigate.

1. Select **New thread** in the left sidebar.
1. Describe the problem you want investigated. Be specific about which service or resource group is affected. For example:

   > "Users report that the Add to Cart feature on our app is broken. The cart API returns errors. Can you investigate the container apps in the resource group?"

1. Select **Send**.

:::image type="content" source="media/first-investigation/chat-asking-about-issue.png" alt-text="Screenshot of the chat input with an investigation request describing a broken cart API." lightbox="media/first-investigation/chat-asking-about-issue.png":::

### Watch the agent work

The agent builds an investigation plan and executes it step by step. You can watch each phase in real time.

**Phase 1: Read context:** The agent reads the knowledge files it built during onboarding, including architecture docs, team context, and runbooks, to orient itself.

**Phase 2: Explore code:** If you connect a code repository, the agent reads relevant source files, searches for code paths related to the issue, and traces the call chain.

:::image type="content" source="media/first-investigation/agent-investigating-1.png" alt-text="Screenshot of the agent reading source code files and identifying a memory leak in CartController.cs." lightbox="media/first-investigation/agent-investigating-1.png":::

**Phase 3: Query Azure resources:** If you connect Azure resources and logging providers, the agent checks the live resource state and available telemetry.

**Phase 4: Deliver the diagnosis:** Based on the available evidence, the agent can present the following details:

- **Root cause**: The specific code bug or configuration issue, with file and line number references.
- **Evidence**: Code snippets, logs, and resource details that support the finding.
- **Recommended fix**: Exactly what to change, with a code diff showing lines to remove or modify.

:::image type="content" source="media/first-investigation/agent-recommended-fix.png" alt-text="Screenshot of the agent presenting root cause analysis with a code fix and crash log evidence." lightbox="media/first-investigation/agent-recommended-fix.png":::

**Checkpoint:** The response identifies the sources used and explains the diagnosis or the next data source needed. When you connect code, logs, and Azure resources, the response can include code references, telemetry evidence, and a recommended fix.

> [!TIP]
> Try asking about something real in your environment:
>
> - "Check the health of the container apps in resource group X."
> - "We're seeing 5xx errors on our API. Can you investigate?"
> - "What recent changes were deployed to our backend service?"

## Next step

> [!div class="nextstepaction"]
> [Step 4: Automate incident response](automate-incidents.md)

## Related content

- [Deep context](agent-reasoning.md#deep-context): How the agent reads, searches, and understands code.
- [Root cause analysis](root-cause-analysis.md): How the agent identifies root causes.
- [Complete your setup](complete-setup.md): Connect any data sources you skipped.
- [Ask the agent for help](ask-agent.md): More examples of what you can ask.
