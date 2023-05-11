---
title: Enable Defender for APIs in Defender for Cloud 
description: Learn about deploying the Defender for APIs plan in Defender for Cloud
author: elazark
ms.author: elkrieger
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/23/2023
---
# Onboard Defender for APIs

This article describes how to deploy the [Microsoft Defender for APIs](defender-for-apis-introduction.md) plan in the Microsoft Defender for Cloud portal. Defender for APIs is currently in preview.

## Before you start

- Review [Defender for APIs support, permissions, and requirements](defender-for-apis-introduction.md) before you begin deployment.
- Make sure that Defender for Cloud is enabled in your Azure subscription. You enable Defender for APIs at the subscription level.
- Ensure that APIs you want to secure are published in [Azure API management](/azure/api-management/api-management-key-concepts). Follow [these instructions](/azure/api-management/get-started-create-service-instance) to set up Azure API Management.

> [!NOTE]
> This article describes how to enable and onboard the Defender for APIs plan in the Defender for Cloud portal. Alternately, you can [enable Defender for APIs within an API Management instance](../api-management/protect-with-defender-for-apis.md) in the Azure portal.

## Enable the plan

1. Sign into the [portal](https://portal.azure.com/), and in Defender for Cloud, select **Environment settings**.
1. Select the subscription that contains the managed APIs that you want to protect.
1. In the **APIs** plan, select **On**. Then select **Save**.

    :::image type="content" source="media/defender-for-apis-deploy/enable-plan.png" alt-text="Screenshot that shows how to turn on the Defender for APIs plan in the portal." lightbox="media/defender-for-apis-deploy/enable-plan.png":::

> [!NOTE]
> After enabling Defender for APIs, onboarded APIs take up to 50 minutes to appear in the **Recommendations** tab. Security insights are available in the **Workload protections** > **API security** dashboard within 40 minutes of onboarding.

## Onboard APIs

1. In the Defender for Cloud portal, select **Recommendations**.
1. Search for *Defender for APIs*.
1. Under **Enable enhanced security features**, select the security recommendation **Azure API Management APIs should be onboarded to Defender for APIs**.

    :::image type="content" source="media/defender-for-apis-deploy/api-recommendations.png" alt-text="Screenshot that shows how to turn on the Defender for APIs plan from the recommendation." lightbox="media/defender-for-apis-deploy/api-recommendations.png":::


1. In the recommendation page, you can review the recommendation severity, update interval, description, and remediation steps.
1. Review the resources in scope for the recommendations:
    - **Unhealthy resources**: Resources that aren't onboarded to Defender for APIs.
    - **Healthy resources**: API resources that are onboarded to Defender for APIs.
    - **Not applicable resources**: API resources that aren't applicable for protection.

1. In **Unhealthy resources**, select the APIs that you want to protect with Defender for APIs.
1. Select **Fix**. 

    :::image type="content" source="media/defender-for-apis-deploy/api-recommendation-details.png" alt-text="Screenshot that shows the recommendation details for turning on the plan." lightbox="media/defender-for-apis-deploy/api-recommendation-details.png":::

1. In **Fixing resources**, review the selected APIs, and select **Fix resources**.

    :::image type="content" source="media/defender-for-apis-deploy/fix-resources.png" alt-text="Screenshot that shows how to fix unhealthy resources." lightbox="media/defender-for-apis-deploy/fix-resources.png":::

1. Verify that remediation was successful.

    :::image type="content" source="media/defender-for-apis-deploy/fix-resources-confirm.png" alt-text="Screenshot that confirms that remediation was successful." lightbox="media/defender-for-apis-deploy/fix-resources-confirm.png":::

## Track onboarded API resources

After onboarding the API resources, you can track their status in the Defender for Cloud portal > **Workload protections** > **API security**.

:::image type="content" source="media/defender-for-apis-deploy/track-resources.png" alt-text="Screenshot that shows how to track onboarded API resources." lightbox="media/defender-for-apis-deploy/track-resources.png":::


## Next steps

[Review](defender-for-apis-posture.md) API threats and security posture.

