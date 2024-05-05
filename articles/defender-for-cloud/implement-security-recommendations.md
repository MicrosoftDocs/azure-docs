---
title: Remediate recommendations
description: Remediate security recommendations in Microsoft Defender for Cloud to improve the security posture of your environments.
ms.topic: how-to
ms.author: elkrieger
author: ElazarK
ms.date: 03/07/2024
ai-usage: ai-assisted
#customer intent: As a security professional, I want to understand how to remediate security recommendations in Microsoft Defender for Cloud so that I can improve my security posture.
---

# Remediate recommendations

Resources and workloads protected by Microsoft Defender for Cloud are assessed against built-in and custom security standards enabled in your Azure subscriptions, AWS accounts, and GCP projects. Based on those assessments, security recommendations provide practical steps to remediate security issues, and improve security posture.

This article describes how to remediate security recommendations in your Defender for Cloud deployment.

Before you attempt to remediate a recommendation you should review it in detail. Learn how to [review security recommendations](review-security-recommendations.md).

## Remediate a recommendation

Recommendations are prioritized based on the risk level of the security issue by default.

In addition to risk level, we recommend that you prioritize the security controls in the default [Microsoft Cloud Security Benchmark (MCSB)](concept-regulatory-compliance.md) standard in Defender for Cloud, since these controls affect your [secure score](secure-score-security-controls.md).

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

    :::image type="content" source="media/implement-security-recommendations/recommendations-page.png" alt-text="Screenshot of the recommendations page that shows all of the affected resources by their risk level." lightbox="media/implement-security-recommendations/recommendations-page.png":::

1. Select a recommendation.

1. Select **Take action**.

1. Locate the Remediate section and follow the remediation instructions.

    :::image type="content" source="./media/implement-security-recommendations/remediate-recommendation.png" alt-text="This screenshot shows manual remediation steps for a recommendation." lightbox="./media/implement-security-recommendations/remediate-recommendation.png":::

## Use the Fix option

To simplify the remediation process, a Fix button might appear in a recommendation. The Fix button helps you quickly remediate a recommendation on multiple resources. If the Fix button is not present in the recommendation, then there is no option to apply a quick fix, and you must follow the presented remediation steps to address the recommendation.

**To remediate a recommendation with the Fix button**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Select a recommendation to remediate.

1. Select **Take action** > **Fix**.

    :::image type="content" source="./media/implement-security-recommendations/microsoft-defender-for-cloud-recommendations-fix-action.png" alt-text="Screenshot that shows recommendations with the Fix action." lightbox="./media/implement-security-recommendations/microsoft-defender-for-cloud-recommendations-fix-action.png":::

1. Follow the rest of the remediation steps.

After remediation completes, it can take several minutes for the change to take place.

## Use the automated remediation scripts

Security admins can fix issues at scale with automatic script generation in AWS and GCP CLI script language. When you select **Take action** > **Fix** on a recommendation where an automated script is available, the following window opens.

:::image type="content" source="./media/implement-security-recommendations/automated-remediation-scripts.png" alt-text="Screenshot that shows recommendations with the automated remediation script." lightbox="./media/implement-security-recommendations/automated-remediation-scripts.png":::

Copy and run the script to remediate the recommendation.

## Next step

> [!div class="nextstepaction"]
> [Governance rules in your remediation processes](governance-rules.md)
