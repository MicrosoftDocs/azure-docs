---
title: Review alerts for AI applications
description: Learn how to review and respond to security alerts for GenAI applications in Microsoft Defender for Cloud.
ms.topic: how-to
ms.date: 04/08/2024
#customer intent: As a user, I want to learn how to review alerts for GenAI applications in Microsoft Defender for Cloud so that I can improve the security of my GenAI applications.
---

# Review alerts for AI applications

Reviewing security alerts is a crucial aspect of maintaining the security of AI applications. With the increasing adoption of AI technologies, organizations face unique threats and vulnerabilities. Microsoft Defender for Cloud provides powerful security alert capabilities specifically designed to detect and respond to AI-related threats.

By reviewing security alerts for AI applications, organizations can proactively identify and mitigate potential security risks. This allows them to protect sensitive data, prevent unauthorized access, and ensure the integrity of their AI models and deployments. Additionally, reviewing security alerts helps organizations comply with regulatory requirements and maintain trust with their customers.

Microsoft Defender for Cloud's security alert capabilities offer several benefits. Firstly, it provides real-time visibility into potential security incidents, allowing organizations to take immediate action. Secondly, it offers advanced threat intelligence and analytics, enabling organizations to understand the nature and severity of AI-related threats. Lastly, it provides automated response and remediation options, streamlining the incident response process and minimizing the impact of security incidents.

## Prerequisites

To view alerts for GenAI applications, you need:

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- [Enable Defender for Cloud on your Azure subscription](connect-azure-subscription.md).

- Enable [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) on your Azure subscription.

- Have at least one [Azure OpenAI resource](../ai-studio/how-to/create-azure-ai-resource.md), with at least one [model deployment](../ai-studio/how-to/deploy-models-openai.md) connected to it via Azure AI Studio.

## Review GenAI alerts in Defender for Cloud

Alerts in Defender for Cloud help you identify and respond to security issues in your GenAI applications.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud**.

1. Select **Security alerts**.

1. Select **Add filter**.

1. In the filter field, select **Resource type**.

1. In the value field, select **microsoft.cognitiveservices**.

    :::image type="content" source="media/review-alerts-for-ai/filter-cognitive.png" alt-text="Screenshot that shows the microsoft.cognitveservices button selected." lightbox="media/review-alerts-for-ai/filter-cognitive.png":::

1. Select **Ok**.

A list of alerts for your GenAI applications appears. With this list, you should [review the alerts](managing-and-responding-alerts.md#investigate-a-security-alert) and [remediate the alerts](managing-and-responding-alerts.md#respond-to-a-security-alert).

## Next step

> [!div class="nextstepaction"]
> [Identify GenAI workloads and models](identify-ai-workload-model.md)
