---
title: Protect APIs in API Management with Defender for APIs 
description: Learn how to enable enhanced API security features in Azure API Management by using Microsoft Defender for Cloud.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 04/14/2023
ms.author: danlep
---
# Enable enhanced API security features using Microsoft Defender for Cloud 
<!-- Update links to D4APIs docs when available -->

Defender for APIs (preview), a new capability of Microsoft Defender for Cloud, offers full lifecycle protection, detection, and response coverage for APIs that are managed in Azure API Management. The service empowers security practitioners to gain visibility into their business-critical APIs, understand their security posture, prioritize vulnerability fixes, and detect active runtime threats within minutes.  

This article shows how to use the Azure portal to enable Defender for APIs from your API Management instance and view a summary of security recommendations and alerts for onboarded APIs. You can also enable Defender for APIs directly in the Microsoft Defender for Cloud console, where more API security insights and inventory experiences are available. 

To learn more, see:

* [Microsoft Defender for APIs – Benefits and features](https://aka.ms/apiSecurityOverview) 
* [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction)

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Preview limitations

* Currently, Defender for APIs discovers and analyzes REST APIs only. 
* Defender for APIs currently doesn't onboard APIs that are exposed using the API Management [self-hosted gateway](self-hosted-gateway-overview.md) or managed using API Management [workspaces](workspaces-overview.md).
* Some ML-based detections and security insights (data classification, authentication check, unused and external APIs) for instances with [multi-region](api-management-howto-deploy-multi-region.md) deployments aren't supported in secondary regions. In such cases, data residency requirements are still met.  

## Prerequisites

* At least one API Management instance in an Azure subscription. Defender for APIs is enabled at the level of a subscription. 
* One or more supported APIs must be imported to the API Management instance.
* Permissions to [enable the Defender for APIs plan](/azure/defender-for-cloud/permissions).
* Owner or Contributor permissions on the API Management instance. 

## Onboard to Defender for APIs

Onboarding APIs to Defender for APIs is a two-step process: enabling the Defender for APIs plan, and onboarding unprotected APIs in your API Management instances.   

> [!CAUTION]
> Onboarding APIs to Defender for APIs may increase compute, memory, and network utilization of your API Management instance. Do not onboard all APIs at one time if your API Management instance is running at high utilization. Use caution by gradually onboarding APIs, while monitoring the utilization of your instance (for example, using [the capacity metric](api-management-capacity.md)) and scaling out as needed. 

### Enable the Defender for APIs plan for a subscription

1. Sign in to the [portal](https://portal.azure.com), and go to your API Management instance.

1. In the left menu, select **Microsoft Defender for Cloud (preview)**.

1. Select **Enable Defender on the subscription**.

    :::image type="content" source="media/protect-with-defender-for-apis/enable-defender-for-apis.png" alt-text="Screenshot showing how to enable Defender for APIs in the portal." lightbox="media/protect-with-defender-for-apis/enable-defender-for-apis.png":::

1. On the **Defender plan** page, select **On** for the **APIs** plan.

1. Select **Save**.


### Onboard unprotected APIs to Defender for APIs 

1. In the portal, go back to your API Management instance.
1. In the left menu, select **Microsoft Defender for Cloud (preview)**.
1. Under **Recommendations**, select **Azure API Management APIs should be onboarded to Defender for APIs**.
    :::image type="content" source="media/protect-with-defender-for-apis/defender-for-apis-recommendations.png" alt-text="Screenshot of Defender for APIs recommendations in the portal." lightbox="media/protect-with-defender-for-apis/defender-for-apis-recommendations.png":::
1. On the next screen, review details about the recommendation:
    * Severity  
    * Refresh interval for security findings 
    * Description and remediation steps
    * Affected resources, classified as **Healthy** (onboarded to Defender for APIs), **Unhealthy** (not onboarded), or **Not applicable**, along with associated metadata from API Management
    
   > [!NOTE]
   > Affected resources include all API collections (that is, APIs and their associated operations) from all API Management instances under the subscription. 

1. From the list of **Unhealthy** resources, select the API(s) that you wish to onboard to Defender for APIs.
1. Select **Fix**, and then select **Fix resources**.
    :::image type="content" source="media/protect-with-defender-for-apis/fix-unhealthy-resources.png" alt-text="Screenshot of onboarding unhealthy APIs in the portal." lightbox="media/protect-with-defender-for-apis/fix-unhealthy-resources.png":::
1.  Track the status of onboarded resources under **Notifications**. 

> [!NOTE]
> Defender for APIs takes 30 minutes to generate its first security insights after onboarding an API. Thereafter, security insights are refreshed every 30 minutes. 
> 

## View security coverage

After you onboard the APIs from API Management, Defender for APIs receives API traffic that will be used to build security insights and monitor for threats. Defender for APIs generates security recommendations for risky and vulnerable APIs.  

You can view a summary of all security recommendations and alerts for onboarded APIs by selecting **Microsoft Defender for Cloud (preview)** in the menu for your API Management instance:

1. In the portal, go to your API Management instance and select **Microsoft Defender for Cloud (preview**) from the left menu.
1. Review **Recommendations** and **Security insights and alerts**.

    :::image type="content" source="media/protect-with-defender-for-apis/view-security-insights.png" alt-text="Screenshot of API security insights in the portal." lightbox="media/protect-with-defender-for-apis/view-security-insights.png":::

For the security alerts received, Defender for APIs suggests necessary steps to perform the required analysis and validate the potential exploit or anomaly associated with the APIs. Follow the steps in the security alert to fix and return the APIs to healthy status. 

To learn more about the benefits of Defender for APIs, including additional API inventory experiences within Defender for Cloud, see [Microsoft Defender for APIs – Benefits and features](https://aka.ms/apiSecurityOverview). 

## Next steps

* Learn more about Defender for APIs:
    * [Benefits and features](https://aka.ms/apiSecurityOverview) 
    * [API security alerts](https://aka.ms/apiSecurityAlerts)
    * [API security threats](https://aka.ms/apiSecurityRecommendations)
    * [API security troubleshooting guide](https://aka.ms/apiSecurityTroubleshooting)
    * [Pricing](https://azure.microsoft.com/pricing/details/defender-for-cloud/)
* Learn how to [upgrade and scale](upgrade-and-scale.md) an API Management instance.