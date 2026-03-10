---
title: Supported Regions for Azure SRE Agent
description: Find Azure regions where Azure SRE Agent is available and learn how to check region availability for your subscription.
ms.topic: reference
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an Azure administrator, I want to know which regions support Azure SRE Agent so that I can deploy my agent in the appropriate location.
ms.custom: references_regions
---

# Supported regions for Azure SRE Agent

Azure SRE Agent is available in select Azure regions. This reference lists the currently supported regions and provides guidance on choosing a region for your agent.

## Available regions

The following table lists the Azure regions where you can deploy Azure SRE Agent.

| Region | Canonical name | Geographic area |
|---|---|---|
| East US 2 | `eastus2` | United States |
| Sweden Central | `swedencentral` | Europe |
| Australia East | `australiaeast` | Asia Pacific |

## Check your available regions

To see which regions are available for your subscription, follow these steps:

1. Go to [sre.azure.com](https://sre.azure.com).
1. Select **Create agent**.
1. Choose your **Subscription** from the dropdown.
1. Open the **Region** dropdown.

The dropdown displays all regions available for your subscription.

### No regions appear

If the **Region** dropdown is empty, you're not registered for Azure SRE Agent. [Submit a registration request](https://github.com/microsoft/sre-agent/issues/new?labels=registration&title=Subscription+registration+request) with your subscription ID.

## Region selection guidance

Use the following recommendations when you choose a region for your agent.

| Scenario | Recommendation |
|---|---|
| Data residency requirements | Choose a region in your required geography. |
| Cross-region resources | Your agent can access resources in any region where you grant permissions. The agent region only determines where the agent compute runs. |

> [!NOTE]
> You deploy your agent to a single region in a single subscription, but it can manage resources across regions and across subscriptions. As long as the agent's managed identity has the appropriate permissions, it can query, diagnose, and take action on resources anywhere in your Azure environment, regardless of which region or subscription they belong to.

## Frequently asked questions

This section answers common questions about Azure SRE Agent region support.

### Can I deploy agents to multiple regions?

Each agent is deployed to a single region. To operate in multiple regions, create a separate agent in each region.

### Can I change an agent's region after creation?

No. You set the region during agent creation and can't change it afterward. Create a new agent to use a different region.

## Next step

> [!div class="nextstepaction"]
> [Create your agent](./create-agent.md)

## Related content

- [Create an agent](create-agent.md)
- [Supported regions overview](supported-regions.md)
- [Network requirements](network-requirements.md)
