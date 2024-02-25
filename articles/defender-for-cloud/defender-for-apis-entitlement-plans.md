---
title: Selecting entitlement plans for Defender for APIs
description: Learn about the available entitlement plans for Defender for APIs deployment in Microsoft Defender for Cloud.
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 12/03/2023
ms.custom: references_regions
---
# Selecting entitlement plans for Defender for API

Microsoft Defender for APIs is a new plan within Microsoft Defender that monitors and protects your APIs from API security risks, vulnerabilities, and exploits. The [Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) is planned for update with the pricing information and pricing calculators by early March 2024. In the meantime, use this document to select the correct Defender for APIs entitlement plans. 

When selecting a plan, consider the following important points:

- Defender for APIs protects only those APIs that are onboarded to Defender for APIs. This means you can activate the plan at the subscription level, and complete the second step of onboarding by fixing the onboarding recommendation. (For more information about onboarding, see the [onboarding guide](defender-for-apis-deploy.md#enable-the-defender-for-apis-plan)).
- Defender for APIs has five pricing plans, each with a different entitlement limit and monthly fee. The billing is done at the subscription level.  
- The billing is applied to the entire subscription based on the total amount of API traffic monitored over the month for the subscription. 
- The API traffic counted towards the billing is reset to 0 at the start of each month (every billing cycle). 
- The overages are computed on API traffic exceeding the entitlement limit per plan selection during the month for your entire subscription.

To select the best plan for your subscription from Microsoft Defender for Cloud pricing page, follow these steps and choose the plan that matches your subscriptions’ API traffic requirements:  

  > [!NOTE]
  > You need to have the appropriate permissions on the subscription to pick a plan when you turn on Microsoft Defender for APIs. Refer to the [roles and permission requirements](defender-for-apis-prepare.md). 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Environment Settings** and select the Azure Subscription that either has Defender for APIs enabled or the one that you wish to enable.

    :::image type="content" source="media/defender-for-apis-entitlement-plans/select-environment-settings.png" alt-text="Screenshot that shows where to select Environment settings." lightbox="media/defender-for-apis-entitlement-plans/select-environment-settings.png":::
   
1. Select **Details** under the pricing column for the APIs plan.     

    :::image type="content" source="media/defender-for-apis-entitlement-plans/select-api-details.png" alt-text="Screenshot that shows where to select API details." lightbox="media/defender-for-apis-entitlement-plans/select-api-details.png":::
 
1. Select the plan that is suitable for your subscription. 
1. Select **Save**. 

## Selecting the optimal plan based on historical Azure API Management API traffic usage

You must select a plan that grants entitlement appropriate for the API traffic volume in your subscription to receive the most optimal pricing. By default, subscriptions are opted into **Plan 1**, which can lead to unexpected overages if your subscription has API traffic higher than the [one million API calls entitlement](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/SecurityMenuBlade/~/18). 

To estimate the monthly API traffic in Azure API Management, do the following steps: 

1. Navigate to the Azure API Management portal and select **Metrics** under the Monitoring menu bar item.  

    :::image type="content" source="media/defender-for-apis-entitlement-plans/select-metrics.png" alt-text="Screenshot that shows where to select metrics." lightbox="media/defender-for-apis-entitlement-plans/select-metrics.png":::

1. Select the time range as **Last 30 days**.
1. Select the following parameters:

    1. Scope: **Azure API Management Service Name** 
    1. Metric Namespace: **API Management service standard metrics**
    1. Metric = **Requests**
    1. Aggregation = **Sum**
    
1. After setting the above parameters, the query will automatically run, and the total number of requests for the past 30 days appear at the bottom of the screen (in the screenshot example, the query results in 414 total number of requests).

    :::image type="content" source="media/defender-for-apis-entitlement-plans/metrics-results.png" alt-text="Screenshot that shows metrics results." lightbox="media/defender-for-apis-entitlement-plans/metrics-results.png":::

    > [!NOTE]
    > These instructions are for calculating the usage per Azure API management service. To calculate the estimated traffic usage for *all* API management services within the Azure subscription, change the **Scope** parameter to each Azure API management service within the Azure subscription, re-run the query, and sum the query results. 

If you don't have access to run the metrics query, reach out to your internal Azure API Management administrator or your Microsoft account manager.  

## Limitations

API management service resources don't enable multi-selection with metrics. You can let the API Management service team know this capability is important and upvote this request.

## Next steps

Learn how to [investigate API findings, recommendations, and alerts](defender-for-apis-posture.md).   
