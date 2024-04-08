---
title: Review recommendations for AI applications
description: Learn how to review recommendations for Gen-AI applications in Microsoft Defender for Cloud to secure your AI environments.
ms.topic: how-to
ms.date: 04/01/2024
#customer intent: As a user, I want to learn how to review recommendations for Gen-AI applications in Microsoft Defender for Cloud so that I can improve the security of my Gen-AI applications.
---

# Review recommendations for AI applications

Microsoft Defender for Cloud provides recommendations that provide practical steps to remediate security issues, and improve security posture. You can review recommendations for your Generative Artificial Intelligence (Gen-AI) applications in Microsoft Defender for Cloud so that you receive recommendations for your AI resources.

## Prerequisites

To view recommendations for Gen-AI applications, you need the following:

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- [Enable Defender for Cloud on your Azure subscription](connect-azure-subscription.md).

- Enable [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) on your Azure subscription.

- Have at least one [Azure OpenAI resource](../ai-studio/how-to/create-azure-ai-resource.md), with at least one [model deployment](../ai-studio/how-to/deploy-models-openai.md) connected to it via Azure AI Studio.

## Review Gen-AI recommendations in Defender for Cloud

Recommendations in Defender for Cloud help you identify and respond to security issues in your Gen-AI applications.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud**.

1. Select **Recommendations**.

1. Select **Add filter**

1. Select **Azure AI services**.

    :::image type="content" source="media/review-recommendations-for-ai/ai-service-filter.png" alt-text="Screenshot that shows the resource type filter value being set to Azure AI services." lightbox="media/review-recommendations-for-ai/ai-service-filter.png":::

1. Select **Apply**.

A list of recommendations for your Gen-AI applications appears. [Review the recommendations](review-security-recommendations.md) and [remediate the recommendations](implement-security-recommendations.md).

If no recommendations appear, it means that your Gen-AI applications are secure and no security issues are detected.

## Next Step

> [!div class="nextstepaction"]
> [Review alerts for Gen-AI applications](review-alerts-for-ai.md)
