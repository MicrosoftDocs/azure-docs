---
title: Defend API Management against DDoS attacks 
description: Learn how to protect your API Management instance in an external virtual network against volumetric and protocol DDoS attacks by using Azure DDoS Protection.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 04/06/2023
ms.author: danlep
---
# Use Azure Defender for APIs to protect against API threats
<!-- Update links to D4APIs docs when available -->
This article shows how to identify and protect against API threats exposed in your API Management instance by using Azure [Defender for APIs](https://aka.ms/apiSecurityOverview) (preview). Background about this feature and considerations for use are also provided.

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Preview limitations

* Currently, Defender for APIs only discovers and analyzes REST APIs. 
* This feature isn't supported in the API Management [self-hosted gateway](self-hosted-gateway-overview.md).
* This feature isn't supported for APIs in API Management [workspaces](workspaces-overview.md).
* In [multi-region](api-management-howto-deploy-multi-region.md) deployments of API Management, some ML-based detections, data classification capabilities, and security insights that are available in the primary region currently don't work in secondary regions. In secondary regions, data residency requirements are still met.

## Benefits

Defender for APIs, a part of Microsoft [Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction.md), offers full lifecycle protection, detection, and response coverage for APIs. The service empowers security practitioners to gain visibility into their business-critical APIs, understand their security posture, prioritize vulnerability fixes, and detect active runtime threats within minutes. Currently, the service supports APIs managed in Azure API Management. 

Defender for APIs has the following key capabilities:

* **API inventory** - Discover and catalog all APIs managed in API Management.

* **API security insights** - Identify external, unused, and unauthenticated APIs, and attack paths, and provide hardening recommendations.

* **API data classification** -  Classify APIs that handle sensitive data for risk prioritization.

* **OWASP API Top 10 threat detection** - Detect exploits using ML-based and rule-based detections, monitor API traffic for compromise.

* **Threat response** - Integrate or export alerts into SIEM systems for investigation and threat response workflows.

* **Integration with [cloud security graph](/defender-for-cloud/concept-attack-path)** - Query API inventory, insights, and recommendations for prioritized remediation and attack path analysis.

## Prerequisites

* One or more API Management instances in an Azure subscription. Defender for APIs is enabled at the level of an Azure subscription. 
* At least one REST API must be imported to an instance. 

## Onboard to Defender for APIs
Onboarding APIs from Azure API Management to Defender for APIs is a two-step process:   

1. First, enable the Defender for APIs plan for a subscription 

    1. Sign in to the [portal](https://portal.azure.com), and go to **Defender for Cloud**.
    1. In the left menu, select **Environment settings**
    1. In **Defender plans**, enable **APIs**.

    After the Defender for APIs plan is turned on, APIs in the API Management instances that are available for onboarding are listed on the **Recommendations** page.
1. Next, onboard unprotected APIs to Defender for APIs 

    1. In the portal, go to **Defender for Cloud** > **Recommendations**.
    1. Search for **Defender for APIs**.
    1. Under **Enable enhanced security features**, select **Azure API Management APIs should be onboarded to Defender for APIs**.
    1. Select an API that you wish to onboard to Defender for APIs from the list of **Unhealthy** resources. 
    1. Select **Fix**. 

For details, see  [Quickstart: Enabling enhanced API security features from Microsoft Defender for Cloud](https://aka.ms/apiSecurityApimOnboarding).  

> [!WARNING]
> Onboarding APIs to Defender for APIs will increase compute and memory utilization by your API Management instance and may affect gateway performance. Onboard APIs gradually, monitor the gateway performance, and scale out the API Management instance as needed. For more information, see [Performance considerations](#performance-considerations).

> [!NOTE]
> Defender for APIs will take 30 minutes to generate its first security insights after onboarding an API. Thereafter, security insights are refreshed every 30 minutes. 
> 

## View security insights

After APIs are onboarded and security insights are generated, view security insights in the portal.

1. In the portal, go to **Defender for Cloud** > **Workload protections**.
1. Select **API security**.

Review security insights for an onboarded API (called an *API collection* in Defender for APIs) or operation (*API endpoint*).

## Performance considerations

Onboarding APIs to Defender for APIs can affect the performance of the API Management instance in which they're managed. Onboard APIs gradually and monitor your API Management instances for performance changes. Performance impacts by Defender for APIs can be mitigated by scaling or upgrading an API Management instance.     

* **Reduced gateway performance** - The performance of your API Management gateway (throughput of API requests) may be reduced when many APIs are onboarded from an instance.
* **Possible outage** - If you onboard multiple APIs from an API Management instance at one time, it is possible to cause a gateway outage. 
* **Monitor capacity metric** - Monitor the [capacity](api-management-capacity.md) metric to evaluate changes in the load on an API Management instance caused by onboarding to Defender for APIs. Look at long-term trends or averages when making decisions to [scale](api-management-capacity.md#use-capacity-for-scaling-decisions) an API Management instance


## Next steps

* Learn more about Defender for APIs:
    * [Benefits and features](https://aka.ms/apiSecurityOverview)
    * [API security alerts](https://aka.ms/apiSecurityAlerts)
    * [API security threats](https://aka.ms/apiSecurityRecommendations)
    * [API security troubleshooting guide](https://aka.ms/apiSecurityTroubleshooting)
* Learn how to [upgrade and scale](upgrade-and-scale.md) an API Management instance.