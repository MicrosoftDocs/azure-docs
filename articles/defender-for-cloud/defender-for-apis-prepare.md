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

> [!NOTE]
> If an Azure API Management instance is [deployed to multiple Azure regions](/azure/api-management/api-management-howto-deploy-multi-region), Defender for APIs functionality is only available in the primary region.

## API support

**Feature** | **Supported** 
--- | --- 
API gateways | Azure API Management
API types | REST API

## Defender CSPM integration

To explore API security risks using Cloud Security Explorer, the Defender Cloud Security Posture Management (CSPM) plan must be enabled. [Learn more](concept-cloud-security-posture-management.md).


## Account/role requirements

Account and role requirements for Defender for APIs are as follows.

**Permission** | **Details**
--- | ---
Azure account | You need an Azure account to sign into the Azure portal.
Contributor role | To deploy Defender for APIs, you need the Contributor role on  the Azure subscriptions, resource groups, or Azure API Management instance that you want to secure. If you don't have the Contributor role, you need to enable these roles:<br/><br/> - Security Admin role for full access in Defender for Cloud.<br/> - Security Reader role to view inventory and recommendations in Defender for Cloud.

## Next steps

[Deploy](defender-for-apis-deploy.md) Defender for APIs.

