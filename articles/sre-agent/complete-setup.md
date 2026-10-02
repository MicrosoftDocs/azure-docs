---
title: Complete setup for Azure SRE Agent
description: Decide which data sources to connect to your agent, what each source adds to an investigation, and how to confirm a connection works.
ms.topic: how-to
ms.date: 09/03/2026
ms.service: azure-sre-agent
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As a site reliability engineer, I want to decide which data sources to connect to my agent so that its investigations use the context I actually need.
---

# Complete setup for Azure SRE Agent

Your agent investigates with the context you give it. If you skipped data sources during onboarding, or if an investigation came back thinner than you expected, use this article to decide what to connect next and what each connection adds. This article catalogs the sources available to your agent, while the connector articles cover the procedure for each one.

## Start with the smallest useful set

A code repository and one log source are enough for grounded answers about your systems. Every other source deepens what the agent can see, and you can add sources in any order at any time, so there's no need to finish setup in one sitting.

Code, logs, Azure resources, and knowledge files accumulate. You can add another repository, telemetry provider, or scope whenever you need one, and you can remove what you no longer want. Incidents work differently. Only one incident platform can be active at a time, and connecting a new platform disconnects the current one.

## What each source answers

Each data source lets the agent answer a different kind of question during an investigation.

| Source | What it lets the agent answer | What you need to connect it |
|---|---|---|
| **Code** (recommended) | Why a failure happens. The agent reads source files, traces errors to specific lines, and identifies recent changes. | Access to a GitHub, Azure DevOps, or GitLab repository, plus an authentication method that the provider supports. |
| **Logs** (recommended) | What happened in production. The agent queries your telemetry and correlates entries with code and dependencies. | Read access on the telemetry source, granted to the identity or credentials the connector uses. |
| **Azure resources** | What your environment looks like right now. The agent checks resource configuration, health, and metrics. | An **Owner** or **User Access Administrator** role assignment on each management group, subscription, or resource group you add. |
| **Incidents** | When to start working without being asked. The agent receives alerts from your incident platform and investigates the ones your response plans match. One platform is active at a time. | Azure Monitor connects without credentials, and alerts from your managed resource groups flow to the agent. PagerDuty and ServiceNow need API credentials from your incident platform administrator. |
| **Knowledge files** | How your team wants the work done. The agent follows your runbooks, escalation paths, and architecture notes. | A file in a supported format. See [Upload knowledge documents](upload-knowledge-document.md#supported-file-formats). |

Log providers differ in how they authenticate. Azure Data Explorer, Log Analytics Workspace, and Application Insights use the agent's managed identity. Datadog, Dynatrace, Elasticsearch, New Relic, Splunk, and Hawkeye use service credentials that you supply. The providers you see can vary by tenant and configuration, so use the search box if you don't find the one you want. See [Connect a telemetry source](connect-telemetry-source.md) for the fields each provider asks for.

## Choose what to connect next

Pick the situation that matches what your agent is missing.

- **The agent says it doesn't know anything about your app.** Connect **Code** first. It has the largest effect on investigation quality, and the agent starts exploring the repository as soon as you save the connection.
- **The agent explains your code but can't say what happened in production.** Connect **Logs** next. Choose the provider your team already queries during an incident.
- **Your questions are about resource health, configuration, or scale.** Add **Azure resources**, scoped to the resource group that holds the workload you investigate most.
- **You want the agent working before someone opens a chat.** Connect the incident platform your team already pages from, and then create a response plan that matches a narrow set of alerts. Because only one platform can be active at a time, choose the one that carries your production alerts. See [Incident platforms](incident-platforms.md).
- **The answers are technically correct but ignore how your team operates.** Add **knowledge files** so the agent follows your procedures instead of a generic sequence.

Azure resources and incidents are the two connections most likely to involve someone else. Both change what the agent can reach or when it acts, and both need access that a single engineer might not hold.

## Prerequisites

| Requirement | Details |
|---|---|
| **An agent** | Create one first with [Create and set up](create-and-set-up.md). |
| **Role on the agent** | **SRE Agent Standard User** covers adding code repositories and uploading knowledge documents. **SRE Agent Administrator** covers managing connectors and adding or removing Azure resource scopes. **SRE Agent Author** covers configuring incident management and authoring response plans. See [User roles and permissions](user-roles.md). |
| **Azure role for resource scopes** | An active **Owner** or **User Access Administrator** role assignment on every scope you add, directly or through inheritance. The portal uses it to assign roles to the agent's managed identity. |
| **Access to each source** | Repository access for code, read access on the telemetry source for logs, and platform credentials for PagerDuty or ServiceNow. |
| **Alerts or incidents to receive** | Azure Monitor forwards only the alerts your existing alert rules generate, so confirm that rules exist before you expect incident activity. PagerDuty and ServiceNow forward the incidents their own integrations create. |

<!-- Owner question: which portal role connects an incident platform on the setup page, Administrator through connector write or Author through incident-management write? -->

## Open the setup page

On the **Overview** tab of the [Operations Hub](operations-hub.md), the status bar lists the sources that you didn't configure yet. Select **Complete setup** to open the setup page, which has two tabs.

| Tab | Data sources |
|---|---|
| **Quickstart** | Code, Logs, Azure resources, Incidents |
| **Full setup** | Everything in Quickstart, plus Knowledge files |

Each source appears as a card. A connected card shows a checkmark and a summary such as the number of repositories or log providers attached, along with any errors that need attention.

The page also shows a connection progress bar. The bar tracks how many source types are connected, not how much those sources add to an investigation, and it can count types your setup page doesn't offer. As a result, it might stop short of full even after you connect everything you see. Treat it as a rough indicator rather than a target. Investigation quality comes from connecting the sources your work depends on.

> [!TIP]
> If the agent tells you it doesn't know anything about your app and can't answer questions about it, connect Code before anything else.

## Connect a source

Select the button on the card for the source you want, and then follow the wizard for that provider. For the full procedures, see:

- [Connect source code](connect-source-code.md)
- [Connect a telemetry source](connect-telemetry-source.md)
- [Connectors](connectors.md)
- [Upload knowledge documents](upload-knowledge-document.md)

## Confirm a connection works

Check the card first. A successful connection shows a checkmark and a count of what's attached. Uploaded knowledge files show an **Indexed** status once the agent finishes processing them. To review your knowledge sources, see [Connect knowledge](connect-knowledge.md).

Then confirm the agent can reach the source by asking it something only that source can answer.

| Source | Ask the agent |
|---|---|
| Code | "What does this repository do, and which services does it contain?" |
| Logs | "Check for any errors in the last 24 hours." |
| Azure resources | "Check the health of the resources in resource group `<resource-group-name>`." |
| Knowledge files | "What does our runbook say about handling HTTP 500 errors?" |

A grounded answer shows a tool card for the source the agent queried, along with the result it returned. A generic answer with no tool card, or one that reports missing access, means the connection needs another look. For log queries that fail with a permission error, grant the connector's identity read access on the target resource and try again.

## What changes when you add more context

Connecting an incident platform changes how the agent starts work. Until then, the agent responds to people. Afterward, it also receives incidents from your platform and investigates the ones your response plans match, at the autonomy level each plan sets. To configure that behavior, see [Automate incident response](automate-incidents.md).

Connecting a source isn't billed on its own. Azure SRE Agent meters the processing your agent performs as active flow usage, which covers chats, incidents, scheduled tasks, and triggers. More connected context usually means more of that processing, especially once an incident platform starts investigations without you. Richer context can also shorten an investigation, because the agent spends less effort working around what it can't see. See [Pricing and billing](pricing-billing.md) and [Evaluate Azure SRE Agent](evaluate.md).

## Return to team onboarding

Your **Team onboarding** thread stays in your **Favorites** list in the sidebar. Select it to continue the conversation whenever you have something new to tell the agent, such as a service your team picked up or a procedure that changed.

You can also ask the agent what to set up next. It gives recommendations based on what you've connected and what's still missing. See [Team onboarding](team-onboard.md).

## Next step

> [!div class="nextstepaction"]
> [Run your first investigation](first-investigation.md)

## Related content

- [User roles and permissions](user-roles.md)
- [Connectors](connectors.md)
- [Incident platforms](incident-platforms.md)
- [Diagnose with Azure observability](diagnose-azure-observability.md)
- [Diagnose with external observability](diagnose-observability.md)

