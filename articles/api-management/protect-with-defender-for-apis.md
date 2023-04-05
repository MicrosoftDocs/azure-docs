---
title: Defend API Management against DDoS attacks 
description: Learn how to protect your API Management instance in an external virtual network against volumetric and protocol DDoS attacks by using Azure DDoS Protection.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 01/24/2023
ms.author: danlep
---
# Use Azure Defender for APIs to protect against API threats

This article shows how to protect your Azure API Management instance against API threats using Azure Defender for APIs (preview) and provides some considerations for enabling this protection.

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Preview limitations

* This feature isn't supported in the API Management [self-hosted gateway](self-hosted-gateway-overview.md).
* This feature isn't supported in API Management [workspaces](workspaces-overview.md).
* In [multi-region](api-management-howto-deploy-multi-region.md) deployments of API Management, some ML-based detections currently don't work in secondary regions. 

> [!NOTE]
> Regional gateways will log traffic to regional monitoring pipelines, supporting environments with data residency requirements.



## Prerequisites

* An API Management instance

<!-- Does Defender for APIs protect one, or one or more APIM instances? -->

## Benefits

Defender for APIs, a part of Microsoft [Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction.md), offers full lifecycle protection, detection, and response coverage for APIs. The service empowers security practitioners to gain visibility into their business-critical APIs, understand their security posture, prioritize vulnerability fixes, and detect active runtime threats within minutes. Currently, the service supports APIs published in Azure API Management. 


## How to integrate
Onboarding APIs from Azure API Management to Defender for APIs is a two-step process:   

1. First, enable the Defender for APIs plan for a subscription  

1. Second, onboard unprotected APIs to Defender for APIs 

Follow instructions in Quickstart: Enabling enhanced API security features from Microsoft Defender for Cloud to onboard and protect your API collections.  
## Performance considerations

Things to watch out for: performance impact, possible outage if onboarding everything at once, higher cost over time,; onboard gradually and monitor capacity metric

## Next steps

* Learn more about [scaling](upgrade-and-scale.md) and API Management instance. 