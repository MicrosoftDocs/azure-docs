---
title: Data residency and privacy in Azure SRE Agent
description: Learn how Azure SRE Agent handles your data.
author: craigshoemaker
ms.author: cshoe
ms.topic: tutorial
ms.date: 04/03/2026
ms.service: azure
---

# Data residency and privacy in Azure SRE Agent

This article explains how the SRE Agent handles your data, including where it stores your data, how it processes your data, and the privacy measures it uses to protect your information.

## Data residency

- The SRE Agent transfers and stores all content and conversation history in its Azure region. This data includes prompts, responses, and resource analysis.  

- The SRE Agent transfers all data to its Azure region, regardless of the Azure region of origin for the services it manages.

- The SRE Agent processes and stores data within the region you select when you create the agent.

## Privacy

- Microsoft doesn't use your data to train AI models.

- The service uses your data only to provide its functionality and to improve and debug the service as needed.

- The service isolates data by using tenant and Azure subscription boundaries.

## Model provider data residency

Where your data is processed depends on the model provider you select for your agent.

| Model provider | Data processing location | EU Data Boundary (EUDB) |
|---------------|------------------------|------------------------|
| **Azure OpenAI** | Processed within your agent's Azure region | Covered by EUDB commitments |
| **Anthropic** | Processed in the United States | Excluded from EUDB |

When you select Anthropic as your model provider, prompts, responses, and resource analysis are sent to Anthropic's infrastructure in the United States. If EU Data Boundary compliance is required for your use case, select Azure OpenAI instead. You can change your model provider at any time in **Settings > Basics**.

> [!NOTE]
> Regardless of which model provider you choose, your data is never used to train models. Anthropic follows a [zero data retention](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching#zero-data-retention) policy for API usage—prompts and responses aren't stored after processing. Anthropic's data handling as a Microsoft subprocessor is governed by Microsoft's enterprise agreements. [Learn more about SRE Agent data handling](https://go.microsoft.com/fwlink/?linkid=2356387).

## Related content

| Resource | Description |
|----------|-------------|
| [Supported regions](supported-regions.md) | Azure regions where SRE Agent is available |
| [Network requirements](network-requirements.md) | Firewall and network configuration |
