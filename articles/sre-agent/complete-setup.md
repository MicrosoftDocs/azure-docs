---
title: Complete setup for Azure SRE Agent
description: Finish connecting data sources you skipped during onboarding. See what's missing and configure each source from the setup page.
ms.topic: how-to
ms.date: 03/16/2026
ms.service: azure-sre-agent
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As a site reliability engineer, I want to finish connecting data sources I skipped during onboarding so that my agent has the context it needs for investigations.
---

# Complete setup for Azure SRE Agent

If you skip any data sources during onboarding, you can add them later. The agent shows you what's missing and provides a direct path to configure each source.

## How you know something is missing

The setup page displays a progress bar that tracks which data sources are configured. You can return to it anytime to see what's missing and connect more sources.

:::image type="content" source="media/complete-setup/sources-not-configured.png" alt-text="Screenshot of the setup page showing unconfigured data sources with a progress bar." lightbox="media/complete-setup/sources-not-configured.png":::

The more sources you connect, the more the progress bar fills, and the better the agent's investigations become.

## Open the setup page

To return to the setup page, select **Complete setup** in the status bar. The setup page has two tabs.

| Tab | Data sources |
|---|---|
| **Quickstart** | Code, Logs, Deployments, Incidents |
| **Full setup** | Everything in Quickstart, plus Azure resources and knowledge files |

:::image type="content" source="media/complete-setup/complete-setup-page.png" alt-text="Screenshot of the setup page showing data source cards with Connect buttons for Code, Logs, Deployments, and Incidents." lightbox="media/complete-setup/complete-setup-page.png":::

> [!TIP]
> If you see the message "SRE Agent doesn't know anything about your app and won't be able to answer questions," start by connecting Code. It has the highest impact on investigation quality.

## What each source adds

Each data source gives your agent different capabilities during investigations. The following table describes the available data sources and the value they provide.

| Source | What to connect | How it helps |
|---|---|---|
| **Code** (Recommended) | GitHub or Azure DevOps repository | Agent reads source files, traces errors to specific lines, and identifies recent changes. |
| **Logs** (Recommended) | Azure Data Explorer (Kusto), Datadog, Splunk, Elasticsearch, Dynatrace, New Relic | Agent queries log and correlate log entries with code and dependencies to trace problems across your system. |
| **Deployments** | Deployment pipeline | Agent correlates incidents with recent deployments and rollouts. |
| **Incidents** | Azure Monitor or PagerDuty | Agent automatically picks up and investigates incoming alerts. |
| **Azure resources** | Subscriptions or resource groups | Agent queries metrics, checks resource health, and runs Azure CLI commands. |
| **Knowledge files** | Runbooks, architecture docs | Agent follows your team's procedures during investigations. |

For detailed instructions on connecting individual sources, see [Connect source code](connect-source-code.md), [Connectors](connectors.md), and [Upload knowledge documents](upload-knowledge-document.md).

## Return to team onboarding

Your team onboarding thread, **Team onboarding**, is always visible in your **Favorites** list in the sidebar. Select it to continue the conversation at any time.

You can also type `/learn` in any chat to restart the onboarding interview.

## Next step

> [!div class="nextstepaction"]
> [Diagnose your first incident](./usage.md)

## Related content

- [Step 1: Create your agent](create-agent.md)
- [Step 2: Add your team's knowledge](first-value.md)
- [Step 3: Connect source code](connect-source-code.md)
- [Connectors](connectors.md)
- [Diagnose with Azure observability](diagnose-azure-observability.md)
- [Diagnose with external observability](diagnose-observability.md)
