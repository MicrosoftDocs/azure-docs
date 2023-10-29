---
title: Implement security recommendations
description: This article explains how to respond to recommendations in Microsoft Defender for Cloud to protect your resources and satisfy security policies.
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
ms.date: 10/29/2023
---

# Implement security recommendations in Microsoft Defender for Cloud

Recommendations give you suggestions on how to better secure your resources. You implement a recommendation by following the remediation steps provided in the recommendation.

<a name="remediation-steps"></a>

## Remediation steps

After reviewing all the recommendations, decide which one to remediate first. We recommend that you prioritize the security controls with the highest potential to increase your secure score.

1. From the list, select a recommendation.

1. Follow the instructions in the **Remediate** section. Each recommendation has its own set of instructions. The following screenshot shows remediation steps for configuring applications to only allow traffic over HTTPS.

    :::image type="content" source="./media/implement-security-recommendations/security-center-remediate-recommendation.png" alt-text="Manual remediation steps for a recommendation." lightbox="./media/implement-security-recommendations/security-center-remediate-recommendation.png":::

1. Once completed, a notification appears informing you whether the issue is resolved.

## Fix button

To simplify remediation and improve your environment's security (and increase your secure score), many recommendations include a **Fix** option.

**Fix** helps you quickly remediate a recommendation on multiple resources.

**To implement a Fix**:

1. Select a recommendation from the list of recommendations.

1. If the remediate section, shows a **Fix** action icon :::image type="icon" source="media/implement-security-recommendations/fix-icon.png" border="false":::.

    :::image type="content" source="./media/implement-security-recommendations/microsoft-defender-for-cloud-recommendations-fix-action.png" alt-text="Recommendations list highlighting recommendations with Fix action" lightbox="./media/implement-security-recommendations/microsoft-defender-for-cloud-recommendations-fix-action.png":::

1. Select the **Fix** button.

1. Follow the rest of the rediation steps

    > [!NOTE]
    > It can take several minutes after remediation completes to see the resources in the **Healthy resources** tab. To view the remediation actions, check the [activity log](#activity-log).

<a name="activity-log"></a>

## Fix actions logged to the activity log

The remediation operation uses a template deployment or REST API `PATCH` request to apply the configuration on the resource. These operations are logged in [Azure activity log](../azure-monitor/essentials/activity-log.md).

## Next steps

In this document, you were shown how to remediate recommendations in Defender for Cloud. To learn how  recommendations are defined and selected for your environment, see the following page:

- [What are security policies, initiatives, and recommendations?](security-policy-concept.md)
