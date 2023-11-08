---
title: Implement security recommendations
description: This article explains how to respond to recommendations in Microsoft Defender for Cloud to protect your resources and satisfy security policies.
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
ms.date: 11/08/2023
---

# Implement security recommendations

Recommendations give you suggestions on how to better secure your resources. You implement a recommendation by following the remediation steps provided in the recommendation. 

## Review recommendation

Before you attempt to remediate a recommendation you should review all of the aspects of th recommendation. If you don't know all of the features of the recommendations page you can learn how to [review security recommendations](review-security-recommendations.md).

## Group recommendations by risk level

Before you remediate recommendations, you have the ability to group your recommendations in several ways. For example, risk level, owner, environment, affected resource and more. We recommend grouping your recommendations by risk level in order to remediate the most critical recommendations first.

**To group recommendations by risk level**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Select **Group by** > **Risk level**.

    :::image type="content" source="media/implement-security-recommendations/group-by-risk-level.png" alt-text="Screenshot of the recommendations page that shows how to group your recommendations." lightbox="media/implement-security-recommendations/group-by-risk-level.png":::

After grouping your recommendations you should review your recommendations by reading the description, understanding what the remediation steps are asking you to do and use the graph to understand the risk to your business, which includes which of your resources are exploitable and what effect the recommendation has on your business.

To better understand the recommendations page, you can learn how to [review your security recommendations](review-security-recommendations.md).

## Remediate recommendations

After reviewing all the recommendations, decide which one to remediate first. We recommend that you prioritize the security controls with the highest potential to increase your secure score.

1. Select a recommendation.

1. Follow the instructions in the **Remediate** section. Each recommendation has its own set of instructions. The following screenshot shows remediation steps for configuring applications to only allow traffic over HTTPS.

    :::image type="content" source="./media/implement-security-recommendations/security-center-remediate-recommendation.png" alt-text="Manual remediation steps for a recommendation." lightbox="./media/implement-security-recommendations/security-center-remediate-recommendation.png":::

1. Once completed, a notification appears informing you whether the issue is resolved.

## Fix button

To simplify remediation and improve your environment's security (and increase your secure score), many recommendations include a **Fix** option.

The **Fix** option helps you quickly remediate a recommendation on multiple resources.

**To implement a Fix**:

1. Select a recommendation from the list of recommendations.

1. Select the **Fix** button if it's available in the remediate section.

    :::image type="content" source="./media/implement-security-recommendations/microsoft-defender-for-cloud-recommendations-fix-action.png" alt-text="Screenshot of the recommendations list that highlights recommendations where the fix action is available." lightbox="./media/implement-security-recommendations/microsoft-defender-for-cloud-recommendations-fix-action.png":::

1. Follow the rest of the remediation steps.

    > [!NOTE]
    > It can take several minutes after remediation completes to see the resources in the **Healthy resources** tab. To view the remediation actions, check the [activity log](#activity-log).

<a name="activity-log"></a>

## Fix actions logged to the activity log

The remediation operation uses a template deployment or REST API `PATCH` request to apply the configuration on the resource. These operations are logged in [Azure activity log](../azure-monitor/essentials/activity-log.md).

## Next steps

In this document, you were shown how to remediate recommendations in Defender for Cloud. To learn how  recommendations are defined and selected for your environment, see the following page:

- [What are security policies, initiatives, and recommendations?](security-policy-concept.md)
