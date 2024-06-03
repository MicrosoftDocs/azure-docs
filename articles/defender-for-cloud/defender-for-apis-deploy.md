---
title: Protect your APIs with Defender for APIs
description: Learn how to enable and deploy the Defender for APIs plan in the Microsoft Defender for Cloud portal.
author: dcurwin
ms.author: dacurwin
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/03/2024
---

# Protect your APIs with Defender for APIs

Defender for APIs in Microsoft Defender for Cloud offers full lifecycle protection, detection, and response coverage for APIs.

Defender for APIs helps you to gain visibility into business-critical APIs. You can investigate and improve your API security posture, prioritize vulnerability fixes, and quickly detect active real-time threats.

This article describes how to enable and onboard the Defender for APIs plan in the Defender for Cloud portal. Alternately, you can [enable Defender for APIs within an API Management instance](../api-management/protect-with-defender-for-apis.md) in the Azure portal.

Learn more about the [Microsoft Defender for APIs](defender-for-apis-introduction.md) plan in the Microsoft Defender for Cloud.
Learn more about [Defender for APIs](defender-for-apis-introduction.md).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- Review [Defender for APIs support, permissions, and requirements](defender-for-apis-introduction.md) before you begin deployment.

- You enable Defender for APIs at the subscription level.

- Ensure that APIs you want to secure are published in [Azure API management](../api-management/api-management-key-concepts.md). Follow [these instructions](../api-management/get-started-create-service-instance.md) to set up Azure API Management.

- You must select a plan that grants entitlement appropriate for the API traffic volume in your subscription to receive the most optimal pricing. By default, subscriptions are opted into "Plan 1", which can lead to unexpected overages if your subscription has API traffic higher than the [one million API calls entitlement](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/SecurityMenuBlade/~/18).

## Enable the Defender for APIs plan

When selecting a plan, consider these points:

- Defender for APIs protects only those APIs that are onboarded to Defender for APIs. This means you can activate the plan at the subscription level, and complete the second step of onboarding by fixing the onboarding recommendation. For more information about onboarding, see the [onboarding guide](defender-for-apis-deploy.md#enable-the-defender-for-apis-plan).
- Defender for APIs has five pricing plans, each with a different entitlement limit and monthly fee. The billing is done at the subscription level.  
- Billing is applied to the entire subscription based on the total amount of API traffic monitored over the month for the subscription.
- The API traffic counted towards the billing is reset to 0 at the start of each month (every billing cycle).
- The overages are computed on API traffic exceeding the entitlement limit per plan selection during the month for your entire subscription.

To select the best plan for your subscription from the Microsoft Defender for Cloud [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/), follow these steps and choose the plan that matches your subscriptions’ API traffic requirements:  

1. Sign into the [portal](https://portal.azure.com/), and in Defender for Cloud, select **Environment settings**.

1. Select the subscription that contains the managed APIs that you want to protect.

    :::image type="content" source="media/defender-for-apis-entitlement-plans/select-environment-settings.png" alt-text="Screenshot that shows where to select Environment settings." lightbox="media/defender-for-apis-entitlement-plans/select-environment-settings.png":::

1. Select **Details** under the pricing column for the APIs plan.

    :::image type="content" source="media/defender-for-apis-entitlement-plans/select-api-details.png" alt-text="Screenshot that shows where to select API details." lightbox="media/defender-for-apis-entitlement-plans/select-api-details.png":::

1. Select the plan that is suitable for your subscription.
1. Select **Save**.

## Selecting the optimal plan based on historical Azure API Management API traffic usage

You must select a plan that grants entitlement appropriate for the API traffic volume in your subscription to receive the most optimal pricing. By default, subscriptions are opted into **Plan 1**, which can lead to unexpected overages if your subscription has API traffic higher than the [one million API calls entitlement](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/SecurityMenuBlade/~/18).

**To estimate the monthly API traffic in Azure API Management:**

1. Navigate to the Azure API Management portal and select **Metrics** under the Monitoring menu bar item.  

    :::image type="content" source="media/defender-for-apis-entitlement-plans/select-metrics.png" alt-text="Screenshot that shows where to select metrics." lightbox="media/defender-for-apis-entitlement-plans/select-metrics.png":::

1. Select the time range as **Last 30 days**.
1. Select and set the following parameters:

    1. Scope: **Azure API Management Service Name**
    1. Metric Namespace: **API Management service standard metrics**
    1. Metric = **Requests**
    1. Aggregation = **Sum**

1. After setting the above parameters, the query will automatically run, and the total number of requests for the past 30 days appears at the bottom of the screen. In the screenshot example, the query results in 414 total number of requests.

    :::image type="content" source="media/defender-for-apis-entitlement-plans/metrics-results.png" alt-text="Screenshot that shows metrics results." lightbox="media/defender-for-apis-entitlement-plans/metrics-results.png":::

    > [!NOTE]
    > These instructions are for calculating the usage per Azure API management service. To calculate the estimated traffic usage for *all* API management services within the Azure subscription, change the **Scope** parameter to each Azure API management service within the Azure subscription, re-run the query, and sum the query results.

If you don't have access to run the metrics query, reach out to your internal Azure API Management administrator or your Microsoft account manager.  

> [!NOTE]
> After enabling Defender for APIs, onboarded APIs take up to 50 minutes to appear in the **Recommendations** tab. Security insights are available in the **Workload protections** > **API security** dashboard within 40 minutes of onboarding.

## Onboard APIs

1. In the Defender for Cloud portal, select **Recommendations**.
1. Search for *Defender for APIs*.
1. Under **Enable enhanced security features** select the security recommendation **Azure API Management APIs should be onboarded to Defender for APIs**:

    :::image type="content" source="media/defender-for-apis-deploy/api-recommendations.png" alt-text="Screenshot that shows how to turn on the Defender for APIs plan from the recommendation." lightbox="media/defender-for-apis-deploy/api-recommendations.png":::

1. In the recommendation page you can review the recommendation severity, update interval, description, and remediation steps.
1. Review the resources in scope for the recommendations:
    - **Unhealthy resources**: Resources that aren't onboarded to Defender for APIs.
    - **Healthy resources**: API resources that are onboarded to Defender for APIs.
    - **Not applicable resources**: API resources that aren't applicable for protection.

1. In **Unhealthy resources** select the APIs that you want to protect with Defender for APIs.
1. Select **Fix**:

    :::image type="content" source="media/defender-for-apis-deploy/api-recommendation-details.png" alt-text="Screenshot that shows the recommendation details for turning on the plan." lightbox="media/defender-for-apis-deploy/api-recommendation-details.png":::

1. In **Fixing resources** review the selected APIs and select **Fix resources**:

    :::image type="content" source="media/defender-for-apis-deploy/fix-resources.png" alt-text="Screenshot that shows how to fix unhealthy resources." lightbox="media/defender-for-apis-deploy/fix-resources.png":::

1. Verify that remediation was successful:

    :::image type="content" source="media/defender-for-apis-deploy/fix-resources-confirm.png" alt-text="Screenshot that confirms that remediation was successful." lightbox="media/defender-for-apis-deploy/fix-resources-confirm.png":::

## Track onboarded API resources

After onboarding the API resources, you can track their status in the Defender for Cloud portal > **Workload protections** > **API security**:

:::image type="content" source="media/defender-for-apis-deploy/track-resources.png" alt-text="Screenshot that shows how to track onboarded API resources." lightbox="media/defender-for-apis-deploy/track-resources.png":::

You can also navigate to other collections to learn about what types of insights or risks might exist in the inventory:

:::image type="content" source="media/defender-for-apis-deploy/collection-overview.png" alt-text="Screenshot showing the overview of API collections." lightbox="media/defender-for-apis-deploy/collection-overview.png":::

## Next steps

- [Review](defender-for-apis-posture.md) API threats and security posture.
- [Investigate API findings, recommendations, and alerts](defender-for-apis-posture.md).
