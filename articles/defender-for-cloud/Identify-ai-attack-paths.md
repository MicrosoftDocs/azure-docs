---
title: Identify Gen-AI attack paths
description: Learn how to identify attack paths for your Gen-AI applications in Microsoft Defender for Cloud and enhance their security.
ms.topic: how-to
ms.date: 04/04/2024
#customer intent: As a user, I want to learn how to identify attack paths for my Gen-AI applications in Microsoft Defender for Cloud so that I can enhance their security.
---

# Identify Gen-AI attack paths

Defender for Cloud's attack path analysis provides a comprehensive view of your cloud environment, including the generative artificial intelligence (Gen-AI) attack paths within your environment. You can identify the attack paths that exist in your environment and remediate the related security issues.

Attack path analysis helps you understand how an attacker can move laterally through your environment to reach a target resource. By identifying these paths, you can take steps to secure your environment and prevent potential attacks to your Gen-AI applications.

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- [Enable Defender for Cloud on your Azure subscription](connect-azure-subscription.md).

- Enable [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) on your Azure subscription.

- Have at least one [Azure OpenAI resource](../ai-studio/how-to/create-azure-ai-resource.md), with at least one [model deployment](../ai-studio/how-to/deploy-models-openai.md) connected to it via Azure AI Studio.

## Identify Gen-AI attack paths with attack path analysis

If you have one or multiple Gen-AI attack paths within your environment, you can use the attack path analysis to identify them.

**To identify Gen-AI attack paths in your environment**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud** > **Attack path analysis**.

1. Select **Add filter**.

1. Select **Target**.

1. Select **Azure AI services**.

    :::image type="content" source="media/identify-ai-attack-paths/target-azure-ai.png" alt-text="Screenshot that shows the resource type filter value being set to Azure AI services." lightbox="media/identify-ai-attack-paths/target-azure-ai.png":::

1. Select **Apply**.

1. Select a result.

1. [Remediate the attack path](how-to-manage-attack-path.md#remediate-attack-paths).

## Next step

> [!div class="nextstepaction"]
> 
