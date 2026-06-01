---
title: Data residency and privacy in Azure SRE Agent
description: Learn how Azure SRE Agent handles your data, including how Anthropic serves as a non-Microsoft provider managed by Microsoft, model selection, and data residency controls.
author: craigshoemaker
ms.author: cshoe
ms.topic: concept-article
ms.date: 04/07/2026
ms.service: azure
ms.custom: references_regions
---

# Data residency and privacy in Azure SRE Agent

This article explains how the SRE Agent handles your data, including where it stores your data, how it processes your data, and the privacy measures it uses to protect your information.

Azure SRE Agent supports multiple AI model providers for investigations, incident response, and operational automation. Anthropic is one of the available providers and operates as a non-Microsoft provider managed by Microsoft.

Anthropic operates under Microsoft's oversight with contractual safeguards and technical and organizational measures in place. The Microsoft [Product Terms](https://www.microsoft.com/licensing/terms) and [Microsoft Data Protection Addendum (DPA)](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA) apply when you use Anthropic models through Azure SRE Agent.

For more information about non-Microsoft data access, see [Microsoft Data Access Management](https://www.microsoft.com/trust-center/privacy/data-access). For a list of all non-Microsoft providers that Microsoft works with, see the [Service Trust Portal](https://aka.ms/subprocessor).

> [!IMPORTANT]
> Anthropic models in Azure SRE Agent aren't covered by Microsoft's [EU Data Boundary](/privacy/eudb/eu-data-boundary-learn) commitments. When you select Anthropic, your data (prompts, responses, and resource analysis) might be processed in the United States.

> [!NOTE]
> For customers in the EU, EFTA, and UK, Azure OpenAI is the default provider. Anthropic is available as an opt-in choice. Anthropic isn't available in government clouds (GCC, GCC High, DoD) or sovereign clouds.

## Data residency

- The SRE Agent transfers and stores all content and conversation history in its Azure region. This data includes prompts, responses, and resource analysis.  

- The SRE Agent transfers all data to its Azure region, regardless of the Azure region of origin for the services it manages.

- The SRE Agent processes and stores data within the region you select when you create the agent.

## Privacy

- Microsoft doesn't use your data to train AI models.

- The service uses your data only to provide its functionality and to improve and debug the service as needed.

- The service isolates data by using tenant and Azure subscription boundaries.

## How model selection works

You choose which AI provider powers your agent. The two options are:

- **Azure OpenAI**: Covered by EU Data Boundary commitments. The default for customers in the EU, EFTA, and UK.

- **Anthropic**: The default for all other regions. Not covered by EU Data Boundary commitments.

When you select Anthropic, your data (prompts, responses, and resource analysis) might be processed in the United States.

## Default settings by region

| Region | Anthropic | Azure OpenAI | Notes |
|--------|-----------|--------------|-------|
| **Most commercial regions**<br><br>(US, APAC, etc.) | Default | Available | No data residency restrictions |
| **EU, EFTA, and UK** | Available (opt-in) | Default | Anthropic isn't covered by EU Data Boundary |
| **Government clouds**<br><br>(GCC, GCC High, DoD) | Not available | Default | Anthropic isn't available in government or sovereign clouds |

## Verify the active model provider

To check which AI model provider your agent is currently using:

1. Go to the [Azure SRE Agent portal](https://sre.azure.com).
1. Select your agent, and then go to **Settings**.
1. Under **AI Model Provider**, view the active provider.

## Enable Anthropic in EU Data Boundary regions

If your organization is in the EU, EFTA, or UK and you want to use Anthropic:

1. Go to the [Azure SRE Agent portal](https://sre.azure.com).
1. Select your agent, and then go to **Settings**.
1. Under **AI Model Provider**, select **Anthropic**.
1. Review the data residency notice and confirm.

> [!NOTE]
> By selecting Anthropic, you acknowledge that your data might be processed outside the EU Data Boundary, including in the United States.

## Data handling

When you use Anthropic models in Azure SRE Agent:

- Anthropic processes data under Microsoft's direction and contractual safeguards.
- The [Microsoft DPA](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA) and [Product Terms](https://www.microsoft.com/licensing/terms) apply.
- Both Microsoft and Anthropic don't use your data to train AI models.
- Your data is isolated by tenant and Azure subscription.

## Related content

| Resource | Description |
|----------|-------------|
| [Supported regions](supported-regions.md) | Azure regions where SRE Agent is available |
| [Network requirements](network-requirements.md) | Firewall and network configuration |
