---
title: Onboard Defender for AI Workloads
description: Learn how to enable the Defender for AI Workloads plan on your Azure subscription for Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 04/17/2024
---

# Onboard Defender for AI Workloads

The Defender for AI wokload plan in Defender for Cloud provides security posture management capabilities for generative AI workloads and models running in your environment. To get started onboard the plan.

> [!IMPORTANT]
> The Defender for Workloads AI plan is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- You must sign up for and be approved for the preview by [filling out the preview form](https://aka.ms/D4AI/PublicPreviewAccess).

- Defender for Cloud relies on [Azure Open AI content filtering](../ai-services/openai/concepts/content-filter.md) for prompt-base triggered alert. If you opt out of prompt-based trigger alerts and removed that capability, it can affect Defender for Cloud's ability to monitor and detect such attacks.

- Read up on [Overview - AI threat protection](ai-threat-protection.md).

Currently supported AI workloads include: 

- Azure OpenAI Service
- Azure Machine Learning
- Amazon Bedrock.

## Enable the Defender for AI workload plan

You can enable the Defender for AI workload plan on an Azure subscription and AWS accounts.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant Azure subscription or AWS account.

1. On the Defender plans page, toggle the AI Workloads plan to **On**.

    :::image type="content" source="media/ai-onboarding/enable-ai-workloads-plan.png" alt-text="Screenshot that shows you how to toggle the Defender for AI Workloads plan to on." lightbox="media/ai-onboarding/enable-ai-workloads-plan.png":::

### Remediate alerts

After you have onboarded the Defender for AI Workloads plan, you can [manage and respond to the security alerts](managing-and-responding-alerts.md) that generate for your AI applications and remediate them.

## Next step

> [!div class="nextstepaction"]
> [Manage and respond to the security alerts](managing-and-responding-alerts.md)
