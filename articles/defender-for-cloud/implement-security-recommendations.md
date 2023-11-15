---
title: Remediate security recommendations in Microsoft Defender for Cloud 
description: Learn how to remediate security recommendations in Microsoft Defender for Cloud 
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
ms.date: 10/20/2022
---
# Remediate security recommendations

Resources and workloads protected by Microsoft Defender for Cloud are assessed against built-in and custom security standards enabled in your Azure subscriptions, AWS accounts, and GCP projects. Based on those assessments, security recommendations provide practical steps to remediate security issues, and improve security posture.

This article describes how to remediate security recommendations in your Defender for Cloud deployment using the latest version of the portal experience.

## Before you start

Before you attempt to remediate a recommendation you should review it in detail. Learn how to [review security recommendations](review-security-recommendations.md).

## Group recommendations by risk level

Before you start remediating, we recommend grouping your recommendations by risk level in order to remediate the most critical recommendations first.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Select **Group by** > **Primary grouping** > **Risk level** > **Apply**.

    :::image type="content" source="media/implement-security-recommendations/group-by-risk-level.png" alt-text="Screenshot of the recommendations page that shows how to group your recommendations." lightbox="media/implement-security-recommendations/group-by-risk-level.png":::

    Recommendations are displayed in groups of risk levels.

1. Review critical and other recommendations to understand the recommendation and remediation steps. Use the graph to understand the risk to your business, including which resources are exploitable, and the effect that the recommendation has on your business.


## Remediate recommendations

After reviewing recommendations by risk, decide which one to remediate first.

In addition to risk level, we recommend that you prioritize the security controls in the default [Microsoft Cloud Security Benchmark (MCSB)](concept-regulatory-compliance.md) standard in Defender for Cloud, since these controls affect your [secure score](secure-score-security-controls.md).


1. In the **Recommendations** page, select the recommendation you want to remediate.

1. In the recommendation details page, select **Take action** > **Remediate**.
1. Follow the remediation instructions.

    As an example, the following screenshot shows remediation steps for configuring applications to only allow traffic over HTTPS.

    :::image type="content" source="./media/implement-security-recommendations/security-center-remediate-recommendation.png" alt-text="This screenshots shows manual remediation steps for a recommendation." lightbox="./media/implement-security-recommendations/security-center-remediate-recommendation.png":::

1. Once completed, a notification appears informing you whether the issue is resolved.

## Use the Fix option

To simplify remediation and improve your environment's security (and increase your secure score), many recommendations include a **Fix** option to help you quickly remediate a recommendation on multiple resources.

1. In the **Recommendations**  page, select a recommendation that shows the **Fix** action icon: :::image type="icon" source="media/implement-security-recommendations/fix-icon.png" border="false":::.

    :::image type="content" source="./media/implement-security-recommendations/microsoft-defender-for-cloud-recommendations-fix-action.png" alt-text="This screenshot shows recommendations with the Fix action" lightbox="./media/implement-security-recommendations/microsoft-defender-for-cloud-recommendations-fix-action.png":::

1. In **Take action**, select **Fix**.
1. Follow the rest of the remediation steps.


After remediation completes, it can take several minutes to see the resources appear in the **Findings** tab when the status is filtered to view **Healthy** resources. 

## Next steps

[Learn about](governance-rules.md) using governance rules in your remediation processes.


