---
title: Explore risks to pre-deployment generative AI artifacts
description: Learn how to discover potential security risks for your generative AI applications in Microsoft Defender for Cloud.
ms.topic: how-to
ms.date: 05/05/2024
# customer intent: As a user, I want to learn how to identify potential security risks for my generative AI applications in Microsoft Defender for Cloud so that I can enhance their security.
---

# Explore risks to pre-deployment generative AI artifacts

Defender Cloud Security Posture Management (CSPM) plan in Microsoft Defender for Cloud helps you to improve the security posture of generative AI apps, by identifying vulnerabilities in generative AI libraries that exist in your AI artifacts such as container images and code repositories. This article explains how to explore, identify security risks for those applications.

## Prerequisites

- Read about [AI security posture management](ai-security-posture.md).

- Learn more about [investigating risks with the cloud security explorer and attack paths](concept-attack-path.md).

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- Enable [Defender for Cloud on your Azure subscription](connect-azure-subscription.md).

- Enable [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) on your Azure subscription.

- Have at least one [Azure OpenAI resource](../ai-studio/how-to/create-azure-ai-resource.md), with at least one [model deployment](../ai-studio/how-to/deploy-models-openai.md) connected to it via Azure AI Studio.

## Identify containers running on vulnerable generative AI container images

The cloud security explorer can be used to identify containers that are running generative AI container images with known vulnerabilities.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

1. Select the **Container running container images with known Generative AI vulnerabilities** query template.

    :::image type="content" source="media/explore-ai-risk/gen-ai-vulnerable-images-query.png" alt-text="Screenshot that shows where to locate the generative AI vulnerable container images query." lightbox="media/explore-ai-risk/gen-ai-vulnerable-images-query.png":::

1. Select **Search**.

1. Select a result to review its details.

    :::image type="content" source="media/explore-ai-risk/vulnerable-images-results.png" alt-text="Screenshot that shows a sample of results for the vulnerable image query." lightbox="media/explore-ai-risk/vulnerable-images-results.png":::

1. Select a node to review the findings.

    :::image type="content" source="media/explore-ai-risk/vulnerable-images-results-details.png" alt-text="Screenshot that shows the details of the selected containers node." lightbox="media/explore-ai-risk/vulnerable-images-results-details.png":::

1. In the insights section, select a CVE ID from the drop-down menu.

1. Select **Open the vulnerability page**.

1. [Remediate the recommendation](implement-security-recommendations.md#remediate-recommendations).

## Identify vulnerable generative AI code repositories

The cloud security explorer can be used to identify vulnerable generative AI code repositories, that provision Azure OpenAI. 

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

## Related content

- [Overview - AI threat protection](ai-threat-protection.md)
- [Review security recommendations](review-security-recommendations.md)
- [Identify and remediate attack paths](how-to-manage-attack-path.md)
