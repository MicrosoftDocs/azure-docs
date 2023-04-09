---
title: Support and prerequisites for Defender for APIs deployment
description: Learn about the requirements for Defender for APIs deployment
author: elazark
ms.author: elazark
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/23/2023
---
# Support and prerequisites for Defender for APIs deployment

Review the requirements on this page before setting up [Microsoft Defender for APIs](defender-for-apis-introduction.md) in Microsoft Defender for Cloud. Defender for APIs is currently in preview.

## Cloud and region support

Defender for APIs is currently in public preview in the Azure commercial cloud, in these regions:
- Asia (SouthEastAsia, EastAsia)
- Australia (AustraliaEast, AustraliaSouthEast, AustraliaCentral, AustraliaCentral2)
- Brazil (BrazilSouth, BrazilSouthEast)
- Canada (CanadaCentral, CandaEast)
- Europe (WestEurope, NorthEurope)
- India (CentralIndia, SouthIndia, WestIndia)
- Japan (JapanEast, JapanWest)
- UK (UKSouth, UKWest)
- US (East US, EastUS2, WestUS, WestUS2, WestUS3, CentralUS, NorthCentralUS, SouthCentralUS, WestCentralUS, EastUS2EUAP, CentralUSEUAP)

Up-to-date cloud support for Defender for Cloud plans and features is tracked in the [cloud support matrix](support-matrix-cloud-environment.md).

## API support

**Feature** | **Supported** | **Details**
--- | --- | ---
API gateways | Azure API Management
API types | REST API

## Permissions

Deployment permissions for Defender for APIs are as follows.

**Permission** | **Details**
--- | ---
Azure account | Needs permissions to sign into the Azure portal
Contributor role | On the Azure subscriptions, resource groups, or APIM service that you want to secure. If you don't have the Contributor role, you need to enable these roles:<br/><br/> Security Admin role for full access in Defender for Cloud.<br/>Security Reader role to view inventory and recommendations in Defender for Cloud.

## Next steps



