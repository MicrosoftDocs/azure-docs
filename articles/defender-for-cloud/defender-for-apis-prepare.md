---
title: Support and prerequisites for deploying the Defender for APIs plan
description: Learn about the requirements for Defender for APIs deployment in Microsoft Defender for Cloud
author: dcurwin
ms.author: dacurwin
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/23/2023
ms.custom: references_regions
---
# Support and prerequisites for Defender for APIs deployment

Review the requirements on this page before setting up [Microsoft Defender for APIs](defender-for-apis-introduction.md). Defender for APIs is currently in preview.

## Cloud and region support

Defender for APIs is in public preview in the Azure commercial cloud, in these regions:
- Asia (Southeast Asia, EastAsia)
- Australia (Australia East, Australia Southeast, Australia Central, Australia Central 2)
- Brazil (Brazil South, Brazil Southeast)
- Canada (Canada Central, Canada East)
- Europe (West Europe, North Europe)
- India (Central India, South India, West India)
- Japan (Japan East, Japan West)
- UK (UK South, UK West)
- US (East US, East US 2, West US, West US 2, West US 3, Central US, North Central US, South Central US, West Central US, East US 2 EUAP, Central US EUAP)

Review the latest cloud support information for Defender for Cloud plans and features in the [cloud support matrix](support-matrix-cloud-environment.md).


## API support

**Feature** | **Supported**
--- | --- 
Availability | This feature is available in the Premium, Standard, Basic, and Developer tiers of Azure API Management.
API gateways | Azure API Management<br/><br/> Defender for APIs currently doesn't onboard APIs that are exposed using the API Management [self-hosted gateway](../api-management/self-hosted-gateway-overview.md), or managed using API Management [workspaces](../api-management/workspaces-overview.md). 
API types | Currently, Defender for APIs discovers and analyzes REST APIs.
Multi-region support | In multi-regional managed and self-hosted Azure API Management deployments, security insights (data classification, authentication check, unused and external APIs) aren't supported in secondary regions. In such cases, data residency requirements are still met. 

## Defender CSPM integration

To explore API security risks using Cloud Security Explorer, the Defender Cloud Security Posture Management (CSPM) plan must be enabled. [Learn more](concept-cloud-security-posture-management.md).


## Onboarding requirements

Onboarding requirements for Defender for APIs are as follows.

**Requirement** | **Details**
--- | ---
API Management instance | At least one API Management instance in an Azure subscription. Defender for APIs is enabled at the level of a subscription.<br/><br/> One or more supported APIs must be imported to the API Management instance.
Azure account | You need an Azure account to sign in to the Azure portal.
Onboarding permissions | To enable and onboard Defender for APIs, you need the Owner or Contributor role on  the Azure subscriptions, resource groups, or Azure API Management instance that you want to secure. If you don't have the Contributor role, you need to enable these roles:<br/><br/> - Security Admin role for full access in Defender for Cloud.<br/> - Security Reader role to view inventory and recommendations in Defender for Cloud.
Onboarding location | You can [enable Defender for APIs in the Defender for Cloud portal](defender-for-apis-deploy.md), or in the [Azure API Management portal](../api-management/protect-with-defender-for-apis.md).

## Next steps

[Enable and onboard](defender-for-apis-deploy.md) Defender for APIs.

