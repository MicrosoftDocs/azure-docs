---
title: Review alerts for Gen-AI applications
description: Learn how to review alerts for Gen-AI applications in Microsoft Defender for Cloud.
ms.topic: how-to
ms.date: 04/01/2024
#customer intent: As a user, I want to learn how to review alerts for Gen-AI applications in Microsoft Defender for Cloud so that I can improve the security of my Gen-AI applications.
---

# Review alerts for Gen-AI applications

Generative Artificial Intelligence (Gen-AI) based applications introduce various new risks and threats to organizations including Disruption of Service (DOS) attacks and User Prompt Injection Attacks (UPIA). These risks can generate the following alerts in Microsoft Defender for Cloud:

- **Jailbreak** - UPIA - an intentional attempt by a user to exploit the vulnerabilities of an LLM-powered system, bypass its safety mechanisms, and provoke restricted behaviors.

- **Credential threat** - UPIA - an attempt by a user to get priveleged information such as usernames and passwords from the AI.

- **Sensitive data leak** - UPIA - an attempt by a user to bypass the model and application guardrails and obtain unauthorized sensitive data.

- **Wallet / DOS** - an attempt by a user to disrupt the service by sending a large number of requests to the AI model.

Organizations need to identify, catalog, monitor, and govern the utilization of Gen-AI applications against potential risks such as sensitive information disclosure and insecure response handling.

To combat these risks, Microsoft Defender for Cloud provides alerts that help you identify and respond to security issues in your Gen-AI applications.

## Prerequisites

To view alerts for Gen-AI applications, you need the following:

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- [Enable Defender for Cloud on your Azure subscription](connect-azure-subscription.md).

- Enable [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) on your Azure subscription.

- Have at least one [Azure OpenAI resource](../ai-studio/how-to/create-azure-ai-resource.md), with at least one [model deployment](../ai-studio/how-to/deploy-models-openai.md) connected to it via Azure AI Studio.

## Review Gen-AI alerts in Defender for Cloud

To review alerts for Gen-AI applications in Microsoft Defender for Cloud:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud**.

1. Select **Security alerts**.

1. Select **Add filter**.

1. In the filter field, select **Resource type**.

1. In the value field, select **microsoft.cognitiveservices**.

    :::image type="content" source="media/review-alerts-for-ai/filter-cognitive.png" alt-text="Screenshot that shows the microsoft.cognitveservices button selected.":::

1. Select **Ok**.

A list of alerts for your Gen-AI applications appears. With this list, you should [review the alerts](managing-and-responding-alerts.md#investigate-a-security-alert) and [remediate the alerts](managing-and-responding-alerts.md#respond-to-a-security-alert).

## Next step

> [!div class="nextstepaction"]
> [Remediate alerts](managing-and-responding-alerts.md#respond-to-a-security-alert)
