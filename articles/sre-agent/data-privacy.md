---
title: Data residency and privacy in Azure SRE Agent
description: Learn how Azure SRE Agent handles your data, including how Anthropic serves as a non-Microsoft provider managed by Microsoft, model selection, and data residency controls.
author: craigshoemaker
ms.author: cshoe
ms.topic: concept-article
ms.date: 10/11/2026
ms.service: azure
ms.custom: references_regions
---

# Data residency and privacy in Azure SRE Agent

This article explains how the SRE Agent handles your data, including where it stores your data, how it processes your data, and the privacy measures it uses to protect your information.

Azure SRE Agent supports multiple AI model providers for investigations, incident response, and operational automation. Anthropic is one of the available providers and operates as a non-Microsoft provider managed by Microsoft.

> [!IMPORTANT]
> When you select Anthropic, your data can be processed globally and isn't covered by Microsoft's EU Data Boundary commitments.

## Data residency

Data residency depends on where your selected model provider processes inference requests and where Azure SRE Agent stores your data.

### Model inference

Azure SRE Agent processes model inference requests according to the selected provider:

- **Azure OpenAI:** For agents deployed in EU and EFTA regions, inference stays within Microsoft's [EU Data Boundary](/privacy/eudb/eu-data-boundary-learn). Outside the boundary, inference can happen globally.
- **Anthropic:** Inference can happen globally and isn't covered by Microsoft's EU Data Boundary commitments.

The default and available providers vary by region:

| Region category | Anthropic | Azure OpenAI |
| --- | --- | --- |
| **Commercial regions outside the EU, EFTA, and UK** | Default | Available |
| **EU, EFTA, and UK** | Available (opt-in) | Default |
| **Government and sovereign clouds** | Not available | Default |

### Stored data

Azure SRE Agent stores data according to the following rules, regardless of where your managed resources are located.

- **Conversation history and uploaded files:** Stored in the agent region you select. Conversation history includes prompts, responses, and serialized tool messages, which can contain resource analysis, result excerpts, or summaries.
- **Memory and knowledge search indexes:** Stored in the selected agent region unless the [following table](#search-index-regional-placement) specifies another region.

#### Search-index regional placement

For the following agent regions, memory and knowledge search indexes might be stored in another region.

| Agent region | Search-service region |
| --- | --- |
| East US 2 | Central US or East US 2 |
| West US 2 | North Central US, West US 3, or West US 2 |
| West US 3 | North Central US or West US 3 |
| South India | Central India |

## Verify the active model provider

To check which AI model provider your agent is currently using:

1. Go to the [Azure SRE Agent portal](https://sre.azure.com).
1. Select your agent, and then go to **Settings**.
1. Under **AI Model Provider**, view the active provider.

## Enable Anthropic where it's available as an opt-in choice

If Anthropic is available as an opt-in choice for your agent:

1. Go to the [Azure SRE Agent portal](https://sre.azure.com).
1. Select your agent, and then go to **Settings**.
1. Under **AI Model Provider**, select **Anthropic**.
1. Review the data residency notice and confirm.

> [!NOTE]
> By selecting Anthropic, you acknowledge that your data can be processed globally.

## Data handling

When your agent investigates an issue, it queries your data sources. The service stores tool results, which can include query results, with the conversation thread.

Anthropic operates under Microsoft's oversight with contractual safeguards and technical and organizational measures in place. The Microsoft [Product Terms](https://www.microsoft.com/licensing/terms) and [Microsoft Data Protection Addendum (DPA)](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA) apply when you use Anthropic models through Azure SRE Agent.

For more information about non-Microsoft data access, see [Microsoft Data Access Management](https://www.microsoft.com/trust-center/privacy/data-access). For a list of all non-Microsoft providers that Microsoft works with, see the [Service Trust Portal](https://aka.ms/subprocessor).

For Azure OpenAI data handling, see [Data, privacy, and security for Azure OpenAI](/azure/foundry/responsible-ai/openai/data-privacy).

## Privacy

Microsoft and Anthropic don't use your data to train AI models. The service uses your data only to provide, support, and debug the service, and it isolates your data by tenant and Azure subscription.

Microsoft engineers don't have default access to Azure SRE Agent customer data. Access required for support or service operations is governed by [Microsoft Data Access Management](https://www.microsoft.com/trust-center/privacy/data-access).

[Customer Lockbox for Microsoft Azure](/azure/security/fundamentals/customer-lockbox-overview) isn't currently supported for Azure SRE Agent.

## Data retention and deletion

Azure SRE Agent keeps your conversations, uploaded knowledge, agent memory, and connector settings until you delete them. It doesn't delete them automatically.

- **Threads:** Delete a thread to remove its conversation, files, and session insights. Agent memory learned from a deleted thread might remain until you delete the agent.
- **Knowledge documents:** Remove a document from the knowledge base.
- **Connectors:** Remove a connector to delete its stored credentials.
- **Agent:** Delete the agent to remove its agent-managed data, including conversations, memory, knowledge, files, search indexes, and credentials.
- **Application Insights:** Data sent to your Application Insights resource follows that resource's retention settings.

> [!NOTE]
> Agent deletion can't be undone through Azure SRE Agent. Before deleting an agent, keep copies of any content you need outside the agent. We recommend maintaining your original knowledge documents and configuration files in a version-controlled repository you control.

## Related content

| Resource | Description |
| --- | --- |
| [Supported regions](/azure/sre-agent/supported-regions) | Azure regions where SRE Agent is available |
| [Network requirements](/azure/sre-agent/network-requirements) | Firewall and network configuration |
| [Security overview](/azure/sre-agent/security-overview) | Execution isolation, credentials, per-agent isolation, encryption, audit, and private-network controls |
| [Agent permissions and identity](/azure/sre-agent/permissions) | Setup and runtime roles, managed identity, least privilege, and action approval |
| [Microsoft Data Access Management](https://www.microsoft.com/trust-center/privacy/data-access) | Microsoft data-access controls |
| [Microsoft Product Terms](https://www.microsoft.com/licensing/terms) | Product-specific contractual terms |
| [Microsoft DPA](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA) | Microsoft data-protection commitments |
| [Service Trust Portal](https://aka.ms/subprocessor) | Subprocessor and compliance information |
