---
title: Explore risks to generative AI applications
description: Learn how to discover potential security risks for your generative AI applications in Microsoft Defender for Cloud.
ms.topic: how-to
ms.date: 04/16/2024
# customer intent: As a user, I want to learn how to identify potential security risks for my generative AI applications in Microsoft Defender for Cloud so that I can enhance their security.
---

# Explore risks to generative AI applications

Microsoft Defender for Cloud provides a comprehensive view of your cloud environment, including the generative artificial intelligence applications within your environment. By using the cloud security explorer, and the recommendations page, you can identify the generative AI applications that exist in your environment and assess their security posture.

Defender for Cloud's AI security posture management capabilities allows you to identify vulnerabilities on your AI container images, Ai code repositories and provides Ai related recommendations.

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- [Enable Defender for Cloud on your Azure subscription](connect-azure-subscription.md).

- Enable [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) on your Azure subscription.

- Have at least one [Azure OpenAI resource](../ai-studio/how-to/create-azure-ai-resource.md), with at least one [model deployment](../ai-studio/how-to/deploy-models-openai.md) connected to it via Azure AI Studio.

## Identify container images with vulnerabilities

If you have multiple generative AI container images within your environment, you can use the cloud security explorer to identify them.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

1. Select the **Container running container images with known Generative AI vulnerabilities** query template.

    :::image type="content" source="media/explore-ai-risk/gen-ai-vulnerable-images-query.png" alt-text="Screenshot that shows where to locate the generative AI vulnerable container images query." lightbox="media/explore-ai-risk/gen-ai-vulnerable-images-query.png":::

1. Select **Search**.

1. Select a result to review its details.

    :::image type="content" source="media/explore-ai-risk/vulnerable-images-results.png" alt-text="Screenshot that shows a sample of results for the vulnerable image query." lightbox="media/explore-ai-risk/vulnerable-images-results.png":::

1. Select a node to review the findings.

    :::image type="content" source="media/explore-ai-risk/vulnerable-images-results-details.png" alt-text="Screenshot that shows the details of the selected containers node." lightbox="media/explore-ai-risk/vulnerable-images-results-details.png":::

1. In the insights section, select a CVE ID from the drop down menu.

1. Select **Open the vulnerability page**.

1. [Remediate the recommendation](implement-security-recommendations.md#remediate-recommendations).

## Identify code repositories with vulnerabilities

If you have multiple generative AI code repositories within your environment, you can use the cloud security explorer to identify them.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

1. Select the **Generative AI vulnerable code repositories that provision Azure OpenAI** query template.

    :::image type="content" source="media/explore-ai-risk/gen-ai-vulnerable-code-query.png" alt-text="Screenshot that shows where to locate the generative AI vulnerable code repositories query." lightbox="media/explore-ai-risk/gen-ai-vulnerable-code-query.png":::

1. Select **Search**.

1. Select a result to review its details.

    :::image type="content" source="media/explore-ai-risk/vulnerable-results.png" alt-text="Screenshot that shows a sample of results for the vulnerable code query." lightbox="media/explore-ai-risk/vulnerable-results.png":::

1. Select a node to review the findings.

    :::image type="content" source="media/explore-ai-risk/vulnerable-results-details.png" alt-text="Screenshot that shows the details of the selected vulnerable code node." lightbox="media/explore-ai-risk/vulnerable-results-details.png":::

1. In the insights section, select a CVE ID from the drop-down menu.

1. Select **Open the vulnerability page**.

1. [Remediate the recommendation](implement-security-recommendations.md#remediate-recommendations).

## Identify generative AI recommendations

Recommendations in Defender for Cloud help you identify and respond to security issues in your generative AI applications.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud**.

1. Select **Recommendations**.

1. Select **Add filter**

1. Select **Azure AI services**.

    :::image type="content" source="media/explore-ai-risk/ai-service-filter.png" alt-text="Screenshot that shows the resource type filter value being set to Azure AI services." lightbox="media/explore-ai-risk/ai-service-filter.png":::

1. Select **Apply**.

1. [Remediate the recommendations](implement-security-recommendations.md).

If no recommendations appear, it means that your generative AI applications are secure and no security issues are detected.

## Identify generative AI attack paths

If you have one or multiple generative AI attack paths within your environment, you can use the attack path analysis to identify them.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud** > **Attack path analysis**.

1. Select **Add filter**.

1. Select **Target**.

1. Select **Azure AI services**.

    :::image type="content" source="media/explore-ai-risk/target-azure-ai.png" alt-text="Screenshot that shows the filter value being set to Azure AI services." lightbox="media/explore-ai-risk/target-azure-ai.png":::

1. Select **Apply**.

1. Select a result.

1. [Remediate the attack path](how-to-manage-attack-path.md#remediate-attack-paths).

## Next step

> [!div class="nextstepaction"]
> [Overview - AI threat protection](ai-threat-protection.md)
