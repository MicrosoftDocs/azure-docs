---
title: Remediate security recommendations in Microsoft Defender for Cloud 
description: Learn how to remediate security recommendations in Microsoft Defender for Cloud 
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
ms.date: 11/22/2023
---
# Remediate security recommendations

Resources and workloads protected by Microsoft Defender for Cloud are assessed against built-in and custom security standards enabled in your Azure subscriptions, AWS accounts, and GCP projects. Based on those assessments, security recommendations provide practical steps to remediate security issues, and improve security posture.

This article describes how to remediate security recommendations in your Defender for Cloud deployment using the latest version of the portal experience.

## Before you start

Before you attempt to remediate a recommendation you should review it in detail. Learn how to [review security recommendations](review-security-recommendations.md).

> [!IMPORTANT]
> This page discusses how to use the new recommendations experience where you have the ability to prioritize your recommendations by their effective risk level. To view this experience you must select **Try it now**.
>
> :::image type="content" source="media/review-security-recommendations/try-it-now.png" alt-text="Screenshot that shows where the try it now button is located on the recommendation page." lightbox="media/review-security-recommendations/try-it-now.png":::

## Group recommendations by risk level

Before you start remediating, we recommend grouping your recommendations by risk level in order to remediate the most critical recommendations first.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Select **Group by** > **Primary grouping** > **Risk level** > **Apply**.

    :::image type="content" source="media/implement-security-recommendations/group-by-risk-level.png" alt-text="Screenshot of the recommendations page that shows how to group your recommendations." lightbox="media/implement-security-recommendations/group-by-risk-level.png":::

    Recommendations are displayed in groups of risk levels.

You can now review critical and other recommendations to understand the recommendation and remediation steps. Use the graph to understand the risk to your business, including which resources are exploitable, and the effect that the recommendation has on your business.

## Remediate recommendations

After reviewing recommendations by risk, decide which one to remediate first.

In addition to risk level, we recommend that you prioritize the security controls in the default [Microsoft Cloud Security Benchmark (MCSB)](concept-regulatory-compliance.md) standard in Defender for Cloud, since these controls affect your [secure score](secure-score-security-controls.md).

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Select a recommendation to remediate.

1. Select **Take action** 

1. Locate the Remediate section and follow the remediation instructions.

    :::image type="content" source="./media/implement-security-recommendations/security-center-remediate-recommendation.png" alt-text="This screenshots shows manual remediation steps for a recommendation." lightbox="./media/implement-security-recommendations/security-center-remediate-recommendation.png":::

## Use the Fix option

To simplify remediation and improve your environment's security (and increase your secure score), many recommendations include a **Fix** option to help you quickly remediate a recommendation on multiple resources.

**To remediate a recommendation with the Fix button**:

1. In the **Recommendations**  page, select a recommendation that shows the **Fix** action icon: :::image type="icon" source="media/implement-security-recommendations/fix-icon.png" border="false":::.

    :::image type="content" source="./media/implement-security-recommendations/microsoft-defender-for-cloud-recommendations-fix-action.png" alt-text="This screenshot shows recommendations with the Fix action" lightbox="./media/implement-security-recommendations/microsoft-defender-for-cloud-recommendations-fix-action.png":::

1. Select **Take action** > **Fix**.

1. Follow the rest of the remediation steps.

After remediation completes, it can take several minutes to see the resources appear in the **Findings** tab when the status is filtered to view **Healthy** resources. 

## Next steps

[Learn about](governance-rules.md) using governance rules in your remediation processes.


