---
title: Support and prerequisites for Defender for APIs deployment
description: Learn about the requirements for Defender for APIs deployment
author: elazark
ms.author: elkrieger
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/23/2023
---
# Support and prerequisites for Defender for APIs deployment

Review the requirements on this page before setting up [Microsoft Defender for APIs](defender-for-apis-introduction.md). Defender for APIs is currently in preview.

## Cloud and region support

Defender for APIs is in public preview in the Azure commercial cloud, in these regions:
- Asia (SouthEastAsia, EastAsia)
- Australia (AustraliaEast, AustraliaSouthEast, AustraliaCentral, AustraliaCentral2)
- Brazil (BrazilSouth, BrazilSouthEast)
- Canada (CanadaCentral, CandaEast)
- Europe (WestEurope, NorthEurope)
- India (CentralIndia, SouthIndia, WestIndia)
- Japan (JapanEast, JapanWest)
- UK (UKSouth, UKWest)
- US (East US, EastUS2, WestUS, WestUS2, WestUS3, CentralUS, NorthCentralUS, SouthCentralUS, WestCentralUS, EastUS2EUAP, CentralUSEUAP)

Review the latest cloud support information for Defender for Cloud plans and features in the [cloud support matrix](support-matrix-cloud-environment.md).


## API support

**Feature** | **Supported**
--- | --- 
Availability | This feature is available in the Premium, Standard, Basic, and Developer tiers of Azure API Management.
API gateways | Azure API Management<br/><br/> Defender for APIs currently doesn't onboard APIs that are exposed using the API Management [self-hosted gateway](../api-management/self-hosted-gateway-overview.md), or managed using API Management [workspaces](../api-management/workspaces-overview.md). 
API types | Currently, Defender for APIs discovers and analyzes REST APIs.
Multi-region support | In multi-region Azure API Management instances, some ML-based detections and security insights (data classification, authentication check, unused and external APIs) aren't supported in secondary regions. In such cases, data residency requirements are still met. 

## Defender CSPM integration

To explore API security risks using Cloud Security Explorer, the Defender Cloud Security Posture Management (CSPM) plan must be enabled. [Learn more](concept-cloud-security-posture-management.md).


## Deployment requirement

Deployment requirements for Defender for APIs are as follows.

**Requirement** | **Details**
--- | ---
API Management instance | At least one API Management instance in an Azure subscription. Defender for APIs is enabled at the level of a subscription.<br/><br/> One or more supported APIs must be imported to the API Management instance.
Azure account | You need an Azure account to sign into the Azure portal.
Onboarding permissions | To enable and onboard Defender for APIs, you need the Owner or Contributor role on  the Azure subscriptions, resource groups, or Azure API Management instance that you want to secure. If you don't have the Contributor role, you need to enable these roles:<br/><br/> - Security Admin role for full access in Defender for Cloud.<br/> - Security Reader role to view inventory and recommendations in Defender for Cloud.

## Next steps

[Deploy](defender-for-apis-deploy.md) Defender for APIs.

