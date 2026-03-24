---
title: Anthropic as a subprocessor in Azure SRE Agent
description: Learn how Anthropic operates as a Microsoft subprocessor in Azure SRE Agent, including model selection, and data residency controls.
author: craigshoemaker
ms.author: cshoe
ms.topic: conceptual
ms.date: 03/23/2026
ms.service: azure
---

# Anthropic as a subprocessor in Azure SRE Agent

Azure SRE Agent supports multiple AI model providers for investigations, incident response, and operational automation. Anthropic is one of the available providers and operates as a Microsoft subprocessor.

Anthropic operates under Microsoft's oversight with contractual safeguards and technical and organizational measures in place. The Microsoft [Product Terms](https://www.microsoft.com/licensing/terms) and [Microsoft Data Protection Addendum (DPA)](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA) apply when you use Anthropic models through Azure SRE Agent.

For more information about subprocessor data access, see [Microsoft Data Access Management](https://www.microsoft.com/trust-center/privacy/data-access). For a list of all Microsoft subprocessors, see the [Service Trust Portal](https://aka.ms/subprocessor).

> [!IMPORTANT]
> Anthropic models in Azure SRE Agent aren't covered by Microsoft's [EU Data Boundary](/privacy/eudb/eu-data-boundary-learn) commitments. When you select Anthropic, your data (prompts, responses, and resource analysis) might be processed in the United States.

> [!NOTE]
> For customers in the EU, EFTA, and UK, Azure OpenAI is the default provider. Anthropic is available as an opt-in choice. Anthropic isn't available in government clouds (GCC, GCC High, DoD) or sovereign clouds.

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

For more on how Azure SRE Agent handles data, see [Data residency and privacy](data-privacy.md).

## Related content

- [Data residency and privacy in Azure SRE Agent](data-privacy.md)
- [Anthropic as a subprocessor for Microsoft Online Services](/copilot/microsoft-365/connect-to-ai-subprocessor)
- [Microsoft subprocessor list (Service Trust Portal)](https://aka.ms/subprocessor)
- [EU Data Boundary for the Microsoft Cloud](/privacy/eudb/eu-data-boundary-learn)
