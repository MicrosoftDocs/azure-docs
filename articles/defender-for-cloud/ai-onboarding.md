---
title: Onboard Defender for AI Workloads
description: Learn how to enable the Defender for AI Workloads plan on your Azure subscription for Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 05/02/2024
---

# Onboard Defender for AI Workloads

The Defender for AI Workloads plan in Microsoft Defender for Cloud provides AI threat protection capabilities that can help you identify and respond in real time to security issues in your generative AI applications.

> [!IMPORTANT]
> The Defender for AI Workloads plan is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- Read up on [Overview - AI threat protection](ai-threat-protection.md).

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- We recommend that you don't opt out of prompt based prompt-base triggered alerts for [Azure OpenAI content filtering](../ai-services/openai/concepts/content-filter.md). If you opt out of prompt-based trigger alerts and remove that capability, it can affect Defender for Cloud's ability to monitor and detect such attacks.

## Enroll in the limited preview

To get started, you must [sign up](https://aka.ms/D4AI/PublicPreviewAccess) for the plan and be accepted. 

Once accepted, you can onboard the Defender for AI Workloads plan in Defender for Cloud to provide threat protection for AI workloads in your Azure environment.

1. Fill out the [registration form](https://aka.ms/D4AI/PublicPreviewAccess).

1. Wait to receive an email that confirms your acceptance or rejection from the preview program.

If you're accepted into the preview program, you can enable the Defender for AI Workloads plan to your Azure subscription.

## Enable the Defender for AI Workloads plan

You can enable the Defender for AI Workloads plan on an Azure subscription.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant Azure subscription.

1. On the Defender plans page, toggle the AI Workloads plan to **On**.

    :::image type="content" source="media/ai-onboarding/enable-ai-workloads-plan.png" alt-text="Screenshot that shows you how to toggle the Defender for AI Workloads plan to on." lightbox="media/ai-onboarding/enable-ai-workloads-plan.png":::

## Next step

> [!div class="nextstepaction"]
> [Manage and respond to the security alerts](managing-and-responding-alerts.yml)
