---
title: Identify Gen-AI vulnerable code repositories
description: Learn how to use the cloud security explorer to determine all code repositories within your environment, that contain known Generative AI vulnerabilities and provision Azure OpenAI.
ms.topic: how-to
ms.date: 04/02/2024
# customer intent: As a user, I want to learn how to identify all code repositories within my environment, that contain known Generative AI vulnerabilities and provision Azure OpenAI so that I can assess their security posture.
---

# Identify Gen-AI vulnerable code repositories

Defender for Cloud provides a comprehensive view of your cloud environment, including the generative artificial intelligence (Gen-AI) code repositories within your environment that contain known Gen-AI vulnerabilities and provision Azure OpenAI. By using the cloud security explorer, you can all of these repositories that exist in your environment and assess their security posture.

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- [Enable Defender for Cloud on your Azure subscription](connect-azure-subscription.md).

- Enable [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) on your Azure subscription.

- Have at least one [Azure OpenAI resource](../ai-studio/how-to/create-azure-ai-resource.md), with at least one [model deployment](../ai-studio/how-to/deploy-models-openai.md) connected to it via Azure AI Studio.

## Identify Gen-AI vulnerable code repositories with cloud security explorer

If you have multiple Gen-AI code repositories within your environment, you can use the cloud security explorer to identify them.

**To identify Gen-AI vulnerable code repositories in your environment**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

1. Select the **Gen-AI vulnerable code repositories that provision Azure OpenAI** query template.

    :::image type="content" source="media/identify-ai-vulnerable-code/gen-ai-vulnerable-code-query.png" alt-text="Screenshot that shows where to locate the Gen-AI vulnerable code repositories query." lightbox="media/identify-ai-vulnerable-code/gen-ai-vulnerable-code-query.png":::

1. Select **Search**.

1. Select a result to review its details.

    :::image type="content" source="media/identify-ai-vulnerable-code/vulnerable-results.png" alt-text="Screenshot that shows a sample of results for the query." lightbox="media/identify-ai-vulnerable-code/vulnerable-results.png":::

1. Select a node to review the findings.

    :::image type="content" source="media/identify-ai-vulnerable-code/vulnerable-results-details.png" alt-text="Screenshot that shows the details of the selected node." lightbox="media/identify-ai-vulnerable-code/vulnerable-results-details.png":::

1. In the insights section, select a CVE ID from the drop down menu.

1. Select **Open the vulnerability page**.

1. [Remediate the recommendation](implement-security-recommendations.md#remediate-recommendations).

## Next step

> [!div class="nextstepaction"]
> [Identify Gen-AI vulnerable container images](identify-ai-vulnerable-images.md)
