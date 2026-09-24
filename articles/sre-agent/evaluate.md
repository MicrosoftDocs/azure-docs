---
title: Evaluate Azure SRE Agent
description: Learn how new customers can evaluate Azure SRE Agent with a 30-day trial that waives always-on charges.
ms.topic: reference
ms.service: azure-sre-agent
ms.date: 08/20/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
---

# Evaluate Azure SRE Agent

New customers can create agents to evaluate Azure SRE Agent's capabilities for up to 30 days without incurring [baseline fixed charges](./pricing-billing.md#always-on-flow-fixed-cost). During the evaluation period, consumption charges ([active usage](./pricing-billing.md#active-flow-variable-cost)) apply when the agent processes requests, such as responding to chats or running automated tasks.

[Terms and conditions](#terms-and-conditions) apply.

The following table explains the details surrounding the trial period:

| Question | Answer |
|---|---|
| What's the offer? | 30-day trial without always-on Azure Agent Units (AAUs) costs. |
| Who's eligible? | Azure customers without an SRE Agent as of Aug 25, 2026. |
| How many agents? | Three agents per customer, including deleted agents. |
| How long does it last? | Thirty days from agent creation. Each agent gets its own 30-day trial window. |
| What's charged? | Consumption charges apply when the agent does processing work. |
| What happens when the trial ends? | Thirty days after you create the agent, the always-on billing starts automatically unless you delete the agent. |
| Any limitations? | There are no feature limitations for the SRE Agent during the trial period. |

When you create your [first agent](create-and-set-up.md), your trial starts automatically.

## Get started

To begin, you can create and connect your agent at no charge to your telemetry, source code, and domain knowledge. Much like onboarding a new team member, you want your agent to know about the specifics of your environment so the analysis is tailored to your organization. For instance, you can connect different resources including runbooks, documentation, web pages, and repositories so the agent's work reflects your systems.

- **Create your agent**: Use the SRE Agent portal to [create your agent](create-and-set-up.md).

- **Connect your telemetry sources**: [Connect logs, metrics, traces, and alerts including Azure native and non-Microsoft sources](./connect-telemetry-source.md) so the agent can ground its reasoning in evidence from your own services. The agent can connect to any resources available as [MCP servers](mcp-server.md) and HTTP endpoints as [Python tools](create-python-tool.md).

- **Add your domain knowledge**: [Give the agent your team context](./connect-knowledge.md) so its answers reflect your runbooks, service details, and operating practices.

- **Connect your source code**: [Add the repositories your service depends on](./connect-source-code.md) so the agent can relate symptoms to the code and recent changes you want it to evaluate.

- **Access resources behind a VNet**: [Connect the agent](network-integration.md) to your private network.

## Top use cases

Here are some common ways you can use the 30-day trial to best evaluate Azure SRE Agent:

- **Investigate a root cause**: The agent reasons across alerts, logs, metrics, traces, Azure resource state, your connected code, and recent deployments to propose a likely [root cause](./root-cause-analysis.md) and a suggested mitigation.

- **Validate deployments and releases**: Point the agent at failed pipelines in [Azure DevOps](./ado-connector.md), including build, release, and stage failures, along with pull request and branch events, to proactively find what a recent change broke.

- **Automate alert response**: Trigger investigations from your [incident platform](./incident-platforms.md), such as Azure Monitor, PagerDuty, or ServiceNow, and guide the response with your team's existing runbooks and practices.

- **Automate operational workflows**: Beyond incident platforms, a query trigger can start an investigation when a threshold-based log query crosses its threshold, and an [HTTP trigger](./http-triggers.md) lets your own systems start a run with a webhook call.

- **Get ahead of operational risks**: Run health checks after a pipeline completes, and catch configuration drift by comparing running resources against your infrastructure-as-code definitions. You can also run [automated health checks](scheduled-tasks.md) to ensure the stability of your systems.

- **Close the loop**: Send the evidence, root cause, mitigation, and follow-up work to [GitHub, ServiceNow, Azure DevOps, email, or Microsoft Teams](./connectors.md#collaboration-tools) where the results land as issues, work items, and incident updates your team already tracks.

## When the trial ends

A banner in the SRE Agent portal shows the time remaining in your trial. The banner is visible in the portal throughout the trial period, and it disappears when always-on billing begins on the 31st day of the agent's existence.

During the trial period, you can track the active AAU consumption in the portal under **Agent consumption**.

## Terms and conditions

Customers who are new to Azure SRE Agent may receive up to thirty (30) days of trial access for up to three (3) agents per account.

During the trial period, the always-on charges are waived, and consumption charges still apply. Microsoft reserves the right to limit, suspend, or terminate trial access in cases of suspected abuse, fraud, or violations of applicable terms.

Upon expiration of the 30-day trial period, standard Azure SRE Agent pricing, including always-on charges, will automatically apply unless the customer deletes the agent prior to the trial end date. Learn more about the terms for [Using the Online Services](https://www.microsoft.com/licensing/terms/product/ForOnlineServices/all#clause-350-h3-1) and [Microsoft Enterprise AI Services Code of Conduct](/legal/ai-code-of-conduct).

## Related content

- [Pricing and billing](./pricing-billing.md)

## Next step

> [!div class="nextstepaction"]
> [Create your agent](create-and-set-up.md)