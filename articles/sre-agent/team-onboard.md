---
title: Team onboarding for Azure SRE Agent
description: Teach your agent about your team, application architecture, and operational procedures to build persistent memory for investigations.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: team onboarding, learn command, memory files, runbook, architecture, knowledge base, getting started
#customer intent: As a site reliability engineer, I want to teach my agent about my team structure, services, and procedures so that it has the context it needs for every future investigation.
---

# Team onboarding for Azure SRE Agent

Teach the agent about your team&mdash;who's on call, what services you own, how you handle incidents. At the same time, the agent learns from the context you connected during setup (code repositories, Azure resources, logs) to build a complete picture of your environment. The agent references this persistent memory in every future conversation.

## What you accomplish

By the end of this guide, you:

- **Teach the agent about your team, share who's on call, what services you own, and how escalation works
- **Share your operational knowledge**. Tell the agent about your troubleshooting procedures, playbooks, and how your team handles incidents
- **Let the agent explore your code**. If you connect a repository during setup, the agent reads it to understand your architecture, frameworks, and dependencies

## Prerequisites

| Requirement | Details |
|---|---|
| **Agent created** | Complete [Step 1: Create and set up](create-and-set-up.md) first. |

> [!TIP]
> **Didn't finish setup?** You can still talk to the agent and complete team onboarding&mdash;the agent works without connected data sources. However, for the best experience, go to [Complete your setup](complete-setup.md) first to connect your code repository and Azure resources. The agent's onboarding interview is richer when it can read your code.

## How team onboarding starts

When you select **Done and go to agent** from the setup page, the agent opens the **Team onboarding** thread, a pinned conversation in your Favorites sidebar.

The agent starts by **building knowledge about your connected resources**. It explores your code repository, Azure subscriptions, and any other data sources you connected during setup. You see a progress indicator during this analysis, and you can chat about other topics in the meantime.

When the agent finishes, it greets you by name and begins the interactive onboarding interview.

**Checkpoint:** The **Team onboarding** thread appears in your Favorites sidebar. The agent shows progress as it builds knowledge from your connected context.

## What the agent learns from your connected context

If you connect data sources during setup, the agent explores them automatically. You don't need to do anything.

### Your codebase

The agent reads your connected repository. It explores the README, directory structure, frameworks, and dependencies. You see a summary of what it found.

:::image type="content" source="media/team-onboarding/agent-reads-code.png" alt-text="Screenshot of the agent exploring the repository structure and creating an architecture file." lightbox="media/team-onboarding/agent-reads-code.png":::

If anything's missing, just tell it:

> "We also have a background worker in the `/jobs` directory that processes queue messages."

The agent updates its memory.

### Your Azure resources

If you connect subscriptions or resource groups, the agent explores your infrastructure. It lists services, resource types, and configurations.

## What you share with the agent

The agent interviews you, and you can share things on your own too. Answer questions, volunteer details, or upload files whenever you're ready. The agent saves everything to persistent memory, and you can always add later.

### Your team

The agent asks about your team structure. Answer naturally, and the agent extracts the important details.

**Example conversation:**

> **Agent:** Tell me about your team. What services do you own, and what does your on-call rotation look like?
>
> **You:** We're the Platform Reliability team, six engineers. We own the API gateway and the authentication service. On-call is weekly rotation, and we use PagerDuty for alerting. Our escalation path goes to the senior on-call, then to the engineering manager.
>
> **Agent:** Got it! I've saved this to memory. Here's what I recorded:
> - **Team:** Platform Reliability, six engineers
> - **Services owned:** API gateway, authentication service
> - **On-call:** Weekly rotation via PagerDuty
> - **Escalation:** Senior on-call → Engineering manager

:::image type="content" source="media/team-onboarding/team-response.png" alt-text="Screenshot of the agent confirming it saved team context to memory." lightbox="media/team-onboarding/team-response.png":::

### Your procedures and knowledge

Share how your team handles incidents. You can either upload files or describe procedures in chat.

**Upload a file:** Select the **+** button in the chat input, select **Attach file**, and choose your file (Markdown, PDF, or text). The agent reads the file, extracts key procedures, and saves them to memory.

:::image type="content" source="media/team-onboarding/upload-menu.png" alt-text="Screenshot of the plus button menu showing the Attach file option." lightbox="media/team-onboarding/upload-menu.png":::

**Or just tell the agent:** No formal documentation? Describe your procedures in chat:

> "When we see high CPU on the API gateway, we first check upstream dependencies, then verify the connection pool, then review recent deployments."

The agent extracts the important details and saves them to persistent memory, as if you uploaded a file.

:::image type="content" source="media/team-onboarding/runbook-learned.png" alt-text="Screenshot of the agent confirming it learned procedures and listing extracted steps." lightbox="media/team-onboarding/runbook-learned.png":::

> [!TIP]
> You can share more knowledge anytime. Upload more files or describe procedures in any chat. The agent merges everything into its persistent memory.

## Ask the agent what to do next

After onboarding, ask the agent what else you should set up. Try:

> "What should I do next?" or "Where do I start?"

The agent gives you prioritized recommendations based on your connections and what's still missing. Recommendations might include connecting more data sources, uploading more runbooks, or setting up incident response. For a full checklist, see [Complete your setup](complete-setup.md).

**Checkpoint:** The agent displays a numbered list of recommendations tailored to your team.

## What the agent remembers

After onboarding, the agent creates persistent memory files that it consults during every investigation.

| Memory file | Contents | Created during |
|---|---|---|
| `architecture.md` | Repository structure, frameworks, service dependencies, key code paths | Codebase exploration |
| `team.md` | Team name, size, services owned, on-call rotation, escalation paths | Team context interview |
| `debugging.md` | Troubleshooting procedures, runbook steps, known issues | Knowledge sharing (file upload or chat) |

These files persist across sessions. The agent references them automatically&mdash;you don't need to remind it about your team or procedures.

## Next step

> [!TIP]
> **Before moving on:** If you skipped connecting data sources during setup, now is a good time to go to [Complete your setup](complete-setup.md) and connect your code repository and Azure resources. The agent investigates better with more context.

> [!div class="nextstepaction"]
> [Step 3: Your first investigation](usage.md)

## Related content

- [Memory and knowledge](memory.md): How the agent stores and uses persistent knowledge.
- [Agent permissions](permissions.md): How access levels and RBAC roles work.
