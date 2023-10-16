---
title: Protect APIs in API Management with Defender for APIs 
description: Learn how to enable advanced API security features in Azure API Management by using Microsoft Defender for Cloud.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 04/20/2023
ms.author: danlep
---
# Enable advanced API security features using Microsoft Defender for Cloud 

[Defender for APIs](/azure/defender-for-cloud/defender-for-apis-introduction), a capability of [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction), offers full lifecycle protection, detection, and response coverage for APIs that are managed in Azure API Management. The service empowers security practitioners to gain visibility into their business-critical APIs, understand their security posture, prioritize vulnerability fixes, and detect active runtime threats within minutes. 

Capabilities of Defender for APIs include:

* Identify external, unused, or unauthenticated APIs
* Classify APIs that receive or respond with sensitive data
* Apply configuration recommendations to strengthen the security posture of APIs and API Management services
* Detect anomalous and suspicious API traffic patterns and exploits of OWASP API top 10 vulnerabilities
* Prioritize threat remediation
* Integrate with SIEM systems and Defender Cloud Security Posture Management

This article shows how to use the Azure portal to enable Defender for APIs from your API Management instance and view a summary of security recommendations and alerts for onboarded APIs. 

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Preview limitations

* Currently, Defender for APIs discovers and analyzes REST APIs only. 
* Defender for APIs currently doesn't onboard APIs that are exposed using the API Management [self-hosted gateway](self-hosted-gateway-overview.md) or managed using API Management [workspaces](workspaces-overview.md).
* Some ML-based detections and security insights (data classification, authentication check, unused and external APIs) aren't supported in secondary regions in [multi-region](api-management-howto-deploy-multi-region.md) deployments. Defender for APIs relies on local data pipelines to ensure regional data residency and improved performance in such deployments. 
 

## Prerequisites

* At least one API Management instance in an Azure subscription. Defender for APIs is enabled at the level of a subscription. 
* One or more supported APIs must be imported to the API Management instance.
* Role assignment to [enable the Defender for APIs plan](/azure/defender-for-cloud/permissions).
* Contributor or Owner role assignment on relevant Azure subscriptions, resource groups, or API Management instances that you want to secure. 

## Onboard to Defender for APIs

Onboarding APIs to Defender for APIs is a two-step process: enabling the Defender for APIs plan for the subscription, and onboarding unprotected APIs in your API Management instances.   

> [!TIP]
> You can also onboard to Defender for APIs directly in the [Defender for Cloud interface](/azure/defender-for-cloud/defender-for-apis-deploy), where more API security insights and inventory experiences are available.


### Enable the Defender for APIs plan for a subscription

1. Sign in to the [portal](https://portal.azure.com), and go to your API Management instance.

1. In the left menu, select **Microsoft Defender for Cloud (preview)**.

1. Select **Enable Defender on the subscription**.

    :::image type="content" source="media/protect-with-defender-for-apis/enable-defender-for-apis.png" alt-text="Screenshot showing how to enable Defender for APIs in the portal." lightbox="media/protect-with-defender-for-apis/enable-defender-for-apis.png":::

1. On the **Defender plan** page, select **On** for the **APIs** plan.

1. Select **Save**.

### Onboard unprotected APIs to Defender for APIs 

> [!CAUTION]
> Onboarding APIs to Defender for APIs may increase compute, memory, and network utilization of your API Management instance, which in extreme cases may cause an outage of the API Management instance. Do not onboard all APIs at one time if your API Management instance is running at high utilization. Use caution by gradually onboarding APIs, while monitoring the utilization of your instance (for example, using [the capacity metric](api-management-capacity.md)) and scaling out as needed. 

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
   > Affected resources include API collections (APIs) from all API Management instances under the subscription. 

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

## Offboard protected APIs from Defender for APIs

You can remove APIs from protection by Defender for APIs by using Defender for Cloud in the portal. For more information, see [Manage your Defender for APIs deployment](/azure/defender-for-cloud/defender-for-apis-manage).

## Next steps

* Learn more about [Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction)
* Learn more about [API findings, recommendations, and alerts](/azure/defender-for-cloud/defender-for-apis-posture) in Defender for APIs
* Learn how to [upgrade and scale](upgrade-and-scale.md) an API Management instance