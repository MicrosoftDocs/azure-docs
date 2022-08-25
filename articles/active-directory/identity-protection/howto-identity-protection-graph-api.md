---
title: Microsoft Graph PowerShell SDK and Azure Active Directory Identity Protection
description: Query Microsoft Graph risk detections and associated information from Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 08/23/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# Azure Active Directory Identity Protection and the Microsoft Graph PowerShell SDK

Microsoft Graph is the Microsoft unified API endpoint and the home of [Azure Active Directory Identity Protection](./overview-identity-protection.md) APIs. This article will show you how to use the [Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/get-started) to get risky user details using PowerShell. Organizations that want to query the Microsoft Graph APIs directly can use the article, [Tutorial: Identify and remediate risks using Microsoft Graph APIs](/graph/tutorial-riskdetection-api) to begin that journey.

To successfully complete this tutorial, make sure you have the required prerequisites:

1. Microsoft Graph PowerShell SDK is installed. Follow the [installation guide](/powershell/microsoftgraph/installation?view=graph-powershell-1.0) for more info on how to do this.
2. Entitlement management is available in the beta version of Microsoft Graph PowerShell. Run the following command to set your profile to beta.
```powershell
# Connect to Graph V1.0 Endpoint
Connect-MgGraph -Name 'V1.0'
# Connect to Graph beta Endpoint
Connect-MgGraph -Name 'beta'
```
3. Microsoft Graph PowerShell using a global administrator role and the appropriate permissions. The IdentityRiskEvent.Read.All, IdentityRiskyUser.ReadWrite.All Or IdentityRiskyUser.ReadWrite.All delegated permissions are required. For example, run the following command to set the permissions to IdentityRiskEvent.Read.All.
```powershell
Connect-MgGraph -Scopes "IdentityRiskEvent.Read.All"
```
## List risky detections using PowerShell

You can retrieve the risk detections by the  in Identity Protection via 

```powershell

Get-MgRiskDetection -Filter "RiskType eq 'anonymizedIPAddress'" | Format-Table UserDisplayName, RiskType, RiskLevel, DetectedDateTime

Get-MgRiskDetection -Filter "UserDisplayName eq 'User01' and Risklevel eq 'high'" | Format-Table UserDisplayName, RiskType, RiskLevel, DetectedDateTime

```
## List risky users using PowerShell
## Dimiss risky users using Powershell

## Next steps

- [Get started with the Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/get-started)
- [Tutorial: Identify and remediate risks using Microsoft Graph APIs](/graph/tutorial-riskdetection-api)
- [Overview of Microsoft Graph](https://developer.microsoft.com/graph/docs)
- [Get access without a user](/graph/auth-v2-service)
- [Azure AD Identity Protection Service Root](/graph/api/resources/identityprotectionroot)
- [Azure Active Directory Identity Protection](./overview-identity-protection.md)
