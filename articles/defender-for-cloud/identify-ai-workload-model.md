---
title: Discover generative AI workloads
description: Learn how to use the cloud security explorer to determine which AI workloads and models are running in your environment.
ms.topic: how-to
ms.date: 05/05/2024
# customer intent: As a user, I want to learn how to identify AI workloads and models in my environment so that I can assess their security posture.
---

# Discover generative AI workloads

The Defender Cloud Security Posture Management (CSPM) plan in Microsoft Defender for Cloud provides a comprehensive view of your organization's AI Bill of Materials (AI BOM). The instructions in this article explain how to use the cloud security explorer to identify the AI workloads and models that are running in your environment. With the results, you can assess the security posture of the scanned AI workloads.

## Prerequisites

- Read about [AI security posture management](ai-security-posture.md).

- Learn more about [investigating risks with the cloud security explorer and attack paths](concept-attack-path.md).

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- Enable [Defender for Cloud on your Azure subscription](connect-azure-subscription.md).

- Enable [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) on your Azure subscription.

- Have at least one environment with AI supported workloads (Azure OpenAI, AWS account).

## Discover AI workloads and models in use

The cloud security explorer can be used to identify generative AI workloads and models running in your environment.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

1. Select the **AI workloads and models in use** query template.

    :::image type="content" source="media/identify-ai-workload-model/ai-workload-query.png" alt-text="Screenshot that shows where to locate the AI workloads and models in use query template in the Cloud Security Explorer page." lightbox="media/identify-ai-workload-model/ai-workload-query.png":::

1. Select **Search**.

1. Select a result to review its details.

    :::image type="content" source="media/identify-ai-workload-model/result-details.png" alt-text="Screenshot of the results of the query with one of the results selected and the results detail pane open." lightbox="media/identify-ai-workload-model/result-details.png":::

1. Select a node to review the findings.

    :::image type="content" source="media/identify-ai-workload-model/additional-resource-details.png" alt-text="Screenshot of the results with a different resource selected and its results are displayed." lightbox="media/identify-ai-workload-model/additional-resource-details.png":::

    The findings show the deployed models that are running on your resources and specific model metadata regarding those deployments.

## Next step

> [!div class="nextstepaction"]
> [Explore risks to pre-deployment generative AI artifacts](explore-ai-risk.md)
