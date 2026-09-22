---
title: Complete setup for Azure SRE Agent
description: Finish connecting data sources you skipped during onboarding. See what's missing and configure each source from the setup page.
ms.topic: how-to
ms.date: 08/21/2026
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

The more sources you connect, the more the progress bar fills, and the better the agent's investigations become.

## Open the setup page

To return to the setup page, open your agent and select **Complete setup**. The page has two tabs.

| Tab | Data sources |
|---|---|
| **Quickstart** | Code, Logs, Azure resources, Incidents |
| **Full setup** | Everything in Quickstart, plus Knowledge files |

> [!TIP]
> If you see the message "SRE Agent doesn't know anything about your app and won't be able to answer questions," start by connecting Code. It has the highest impact on investigation quality.

## What each source adds

Each data source gives your agent different capabilities during investigations:

- **Code (Recommended):** Connect a GitHub, Azure DevOps, or GitLab repository. Your agent reads source files, traces errors to specific lines, and identifies recent changes.
- **Logs (Recommended):** Connect Azure Data Explorer, Log Analytics Workspace, Application Insights, or another provider shown in the picker. Your agent correlates logs with code and dependencies to trace issues.
- **Incidents:** Connect Azure Monitor or PagerDuty so your agent can pick up and investigate incoming alerts.
- **Azure resources:** Add management groups, subscriptions, or resource groups so your agent can query metrics and check resource health.
- **Knowledge files:** Add runbooks and architecture documents so your agent can follow your team's procedures during investigations.

For detailed instructions on connecting individual sources, see [Connect source code](connect-source-code.md), [Connectors](connectors.md), and [Upload knowledge documents](upload-knowledge-document.md).

## Return to team onboarding

Your team onboarding thread, **Team onboarding**, is always visible in your **Favorites** list in the sidebar. Select it to continue the conversation at any time.

You can also type `/learn` in any chat to restart the onboarding interview.

## Next step

> [!div class="nextstepaction"]
> [Step 3: Run your first investigation](first-investigation.md)

## Related content

- [Connectors](connectors.md)
- [Diagnose with Azure observability](diagnose-azure-observability.md)
- [Diagnose with external observability](diagnose-observability.md)
