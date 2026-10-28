---
title: Evaluate Azure SRE Agent
description: Learn how new customers can evaluate Azure SRE Agent with a 30-day trial that waives always-on charges.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 09/03/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
---

# Evaluate Azure SRE Agent

Azure SRE Agent brings context from your Azure resources, observability tools, incident platforms, and source code repositories into one place. It uses that context to gather signals, propose a probable root cause, and suggest mitigations.

The agent acts only within the [permissions](./permissions.md) you grant and the approval settings you choose. For the full set of capabilities, see the [Azure SRE Agent overview](./overview.md).

If you're new to SRE Agent, you can run it against your own environment for up to 30 days without paying the *always-on charge*. This fixed hourly charge accrues for as long as an agent exists, whether or not anyone uses it.

During the evaluation period, consumption charges ([active usage](./pricing-billing.md#active-flow-variable-cost)) apply when the agent processes requests, such as responding to chats or running automated tasks. [Terms and conditions](#terms-and-conditions) apply.

## How Azure SRE Agent charges

SRE Agent meters processing in **Azure Agent Units (AAUs)** which is the unit Azure uses to measure agentic work. Your bill combines two components that include a fixed charge for each agent that exists and a variable charge for the work your agents do.

| Charge | What it covers | During the trial |
|---|---|---|
| [**Always-on**](./pricing-billing.md#always-on-flow-fixed-cost) | A fixed hourly AAU rate for each agent. It starts when you create the agent and continues until you delete the agent, whether or not anyone uses it. | Waived for the trial period. |
| [**Active usage**](./pricing-billing.md#active-flow-variable-cost) | A variable AAU charge for processing work, such as answering a question in chat, running a scheduled task, or investigating an incident. | You pay for it. |

An agent is an Azure resource that costs money because it exists, not only when you use it. Deleting the agent is the only action that stops both charges.

Active usage scales with how much work you ask for, and the model provider your agent uses affects the rate. Check the [Azure pricing calculator](https://azure.microsoft.com/pricing/details/sre-agent/) for current pricing in your region, and see [Pricing and billing](./pricing-billing.md#active-flow-by-task-type) for how active usage breaks down by task type.

## What the trial includes

This table summarizes the trial offer:

| Question | Answer |
|---|---|
| **What's the offer?** | Always-on charges are waived while trial access is active. You get the service, minus the fixed charge. |
| **Who's eligible?** | Customers who are new to Azure SRE Agent. |
| **How many agents?** | Up to three agents per account. Deleted agents still count toward the three, so deleting an agent doesn't free up a spot. |
| **How long does it last?** | Up to 30 days. The trial period begins the day you create your first Azure SRE Agent and concludes 30 days after that day. |
| **What's charged?** | Active usage charges apply when the agent does processing work. Always-on charges are waived for the trial period. |
| **What happens when the trial ends?** | Standard pricing, including always-on charges, applies automatically unless you delete the agent before the trial ends. |
| **Any limitations?** | There are no feature limitations for the SRE Agent during the trial period.<br><br>The offer terms describe billing, not feature gating. They also let Microsoft limit, suspend, or terminate trial access in cases of suspected abuse, fraud, or violations of applicable terms. |

## Before you start

Confirm these items before you plan an evaluation. They decide whether you can create an agent, not how to configure one.

| Requirement | What to check |
|---|---|
| **Azure subscription** | You need an active subscription to hold the agent resource. The agent is billed to that subscription like any other Azure resource. |
| **Region availability** | The agent runs in a single Azure region that you choose at creation and can't change later. See [Supported regions](./supported-regions.md). If the **Region** list is empty when you start the create flow, your subscription isn't registered for Azure SRE Agent yet. |
| **Permission to create the agent** | You need **Owner**, or **Contributor** plus **User Access Administrator**, on the subscription or resource group where you create the agent. For the full permission list, including what you need to connect Azure resources, see the [prerequisites](./create-and-set-up.md#prerequisites). |
| **Model provider** | The providers available to you depend on your subscription and region, and your choice affects both capability and AAU rates. See [Choose a model provider](./model-provider-selection.md). |

## What to try during your evaluation

Start your evaluation with a narrow scope. Begin with one agent, one service you know well, and one problem you already understand. By starting with this baseline, you can judge the agent's reasoning against an answer you can check. To create that agent and connect it to your environment, see [Create and set up Azure SRE Agent](./create-and-set-up.md).

Then work down this list. If you only do one thing, do the first one.

1. **Investigate a root cause**: The agent reasons across alerts, logs, metrics, traces, Azure resource state, your connected code, and recent deployments to propose a likely [root cause](./root-cause-analysis.md) and a suggested mitigation.

1. **Validate deployments and releases**: Point the agent at failed pipelines in [Azure DevOps](./ado-connector.md), including build, release, and stage failures, along with pull request and branch events, to proactively find what a recent change broke.

1. **Automate alert response**: Trigger investigations from your [incident platform](./incident-platforms.md), such as Azure Monitor, PagerDuty, or ServiceNow, and guide the response with your team's existing runbooks and practices.

1. **Automate operational workflows**: Beyond incident platforms, a query trigger can start an investigation when a threshold-based log query crosses its threshold, and an [HTTP trigger](./http-triggers.md) lets your own systems start a run with a webhook call. <!-- Publication blocker — Product/Docs: the log-query trigger has no customer-facing article or confirmed public label. Provide the public feature name and a link, or confirm this clause should be cut. -->

1. **Get ahead of operational risks**: Run health checks after a pipeline completes, and catch configuration drift by comparing running resources against your infrastructure-as-code definitions. You can also run [automated health checks](scheduled-tasks.md) to ensure the stability of your systems.

1. **Close the loop**: Send the evidence, root cause, mitigation, and follow-up work to [GitHub, ServiceNow, Azure DevOps, email, or Microsoft Teams](./connectors.md#collaboration-tools) where the results land as issues, work items, and incident updates your team already tracks.

## When the trial ends

The trial period begins the day you create your first Azure SRE Agent and concludes 30 days after that day. When the trial period ends, standard Azure SRE Agent pricing applies automatically and always-on charges begin. There's no second confirmation step. If the agent still exists after 30 days, it starts accruing the fixed charge.

If you decide not to continue, delete the agent before the trial ends. Deleting is the only way to stop always-on charges. Stopping an agent halts active usage, but the always-on charge continues. To delete an agent, open it in the SRE Agent portal, go to **Settings** > **Basics**, and in **Delete SRE Agent** select **Delete**. For a comparison of stopping and deleting, see [Cost optimization tips](./pricing-billing.md#cost-optimization-tips).

While the trial is active, a banner in the SRE Agent portal shows the time remaining. The banner disappears when the trial period ends.

You can track your active usage at any time in the SRE Agent portal under **Settings** > **Agent consumption**.

## Terms and conditions

Customers who are new to Azure SRE Agent may receive up to thirty (30) days of trial access for up to three (3) agents per account.

During the trial period, the always-on charges are waived, and consumption charges still apply. Microsoft reserves the right to limit, suspend, or terminate trial access in cases of suspected abuse, fraud, or violations of applicable terms.

Upon expiration of the 30-day trial period, standard Azure SRE Agent pricing, including always-on charges, will automatically apply unless the customer deletes the agent prior to the trial end date. Learn more about the terms for [Using the Online Services](https://www.microsoft.com/licensing/terms/product/ForOnlineServices/all#clause-350-h3-1) and [Microsoft Enterprise AI Services Code of Conduct](/legal/ai-code-of-conduct).

## Next step

> [!div class="nextstepaction"]
> [Create your agent](./create-and-set-up.md)