---
title: "Tutorial: Use DocsGuide in Azure SRE Agent"
description: Learn how to ask your Azure SRE Agent questions about its features and get accurate answers from official documentation.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: docsguide, documentation, how-to, tutorial, self-help
#customer intent: As an SRE, I want to ask my agent about SRE Agent features directly in chat so that I can learn how to use it without leaving my conversation.
---

# Tutorial: Use DocsGuide in Azure SRE Agent

In this tutorial, use DocsGuide (the built-in documentation capability) to ask your agent questions about Azure SRE Agent features, configuration, and concepts. DocsGuide answers from live official documentation, so responses stay current as features evolve.

**Estimated time**: 5 minutes

In this tutorial, you:

> [!div class="checklist"]
> - Ask a concept question and observe the DocsGuide response card
> - Ask a setup question and receive step-by-step guidance
> - Ask a feature question and review capability details
> - Explore different question patterns that trigger DocsGuide

## Prerequisites

Before you begin, make sure you have the following resources:

- An Azure SRE Agent in **Running** state
- Access to the agent's chat interface
- Outbound network access to `sre.azure.com` (DocsGuide fetches documentation pages at runtime)

## Open the agent chat

Start by going to the agent portal and opening a conversation.

1. Go to [sre.azure.com](https://sre.azure.com) and select your agent.
1. The chat interface opens with a **New thread** view and an input field.

<!-- Replace the source path with the actual hosted screenshot showing the agent chat interface with the "New thread" view. -->
:::image type="content" source="media/use-docsguide/docsguide-chat-ready.png" alt-text="Screenshot of the agent chat interface showing the New thread view with the chat input ready." lightbox="media/use-docsguide/docsguide-chat-ready.png":::

**Checkpoint:** The chat input is visible and shows the placeholder "Ask a question or enter a slash(/) to use a command."

## Ask a concept question

Try asking a question about an Azure SRE Agent concept to see how DocsGuide responds.

Type the following question in the chat input:

```text
What are run modes?
```

Wait about 10 seconds for the response.

<!-- Replace the source path with the actual hosted screenshot showing the DocsGuide response card for the "run modes" question. -->
:::image type="content" source="media/use-docsguide/docsguide-run-modes-card.png" alt-text="Screenshot of the DocsGuide custom agent card showing the Define run modes task with a green checkmark inside a Parallel Exploration container." lightbox="media/use-docsguide/docsguide-run-modes-card.png":::

**Checkpoint:** You see:

- A **Parallel Exploration** card with "1 agent · 1 completed"
- A nested **DocsGuide** custom agent card with a search icon and green checkmark
- The DocsGuide card shows its task (for example, "Define run modes")
- Below the card, the agent's synthesized answer about run modes

## Ask a setup question

Next, try a setup-oriented question to see how DocsGuide provides step-by-step guidance.

Type the following question:

```text
How do I connect PagerDuty to my agent?
```

**Checkpoint:** The response includes specific setup steps. Navigate to **Settings** > **Incident platform**, enter an API key, enable the quickstart response plan which is sourced from the official PagerDuty tutorial documentation.

## Ask a feature question

Ask about a specific capability to see how DocsGuide explains features.

Type the following question:

```text
How do scheduled tasks work?
```

**Checkpoint:** The response explains scheduled task creation, recurrence options, and how they connect to custom agents which are drawn from the scheduled tasks capability and tutorial pages.

## Try "Can I" questions

The "Can I..." question pattern also triggers DocsGuide.

Type the following question:

```text
Can I use Python to extend my agent?
```

**Checkpoint:** DocsGuide returns information about Python tools, including how to create and deploy custom Python tools, sourced from the Python code execution documentation.

## Tips for effective questions

Use these question patterns to get the most accurate and complete answers from DocsGuide.

| Question type | Good example | Less effective example |
|---|---|---|
| **Specific feature** | "How do I set up incident response plans?" | "Tell me about the agent" |
| **Setup steps** | "How do I connect my Kusto connector?" | "Set up everything" |
| **Concept clarification** | "What is the difference between skills and knowledge?" | "Explain the agent" |
| **Capability check** | "Can I send notifications via Teams?" | "What can you do?" |

> [!TIP]
> Three question patterns work best: **"How do I..."**, **"Can I..."**, and **"What is..."**. The more specific the question, the more targeted the response.

## Summary

In this tutorial, you learned how to:

- Use DocsGuide to ask documentation questions directly in the agent chat.
- Ask concept, setup, and feature questions to get accurate, cited answers.
- Recognize the DocsGuide custom agent task card that shows which documentation pages were consulted.
- Use specific question patterns ("How do I...", "Can I...", "What is...") for the best results.

DocsGuide answers come from official documentation at sre.azure.com, not training data. The capability works the same way in the portal chat and the Teams bot.

## Next step

> [!div class="nextstepaction"]
> [Learn how DocsGuide works](docsguide.md)

## Related content

- [Learn via chat](docsguide.md)
- [Subagents](sub-agents.md)
- [Agent playground](agent-playground.md)
