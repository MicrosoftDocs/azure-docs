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
Select-MgProfile -Name 'V1.0'

# Connect to Graph beta Endpoint
Select-MgProfile -Name 'beta'
```
3. Microsoft Graph PowerShell using a global administrator role and the appropriate permissions. The IdentityRiskEvent.Read.All, IdentityRiskyUser.ReadWrite.All Or IdentityRiskyUser.ReadWrite.All delegated permissions are required. For example, run the following command to set the permissions to IdentityRiskEvent.Read.All.
```powershell
Connect-MgGraph -Scopes "IdentityRiskEvent.Read.All","IdentityRiskyUser.ReadWrite.All"
```
## List risky detections using PowerShell
You can retrieve the risk detections by the properties of a risk detection in Identity Protection.
```powershell
# List all anonymizedIPAddress risk detections
Get-MgRiskDetection -Filter "RiskType eq 'anonymizedIPAddress'" | Format-Table UserDisplayName, RiskType, RiskLevel, DetectedDateTime

# List all high risk detections for the user 'User01'
Get-MgRiskDetection -Filter "UserDisplayName eq 'User01' and Risklevel eq 'high'" | Format-Table UserDisplayName, RiskType, RiskLevel, DetectedDateTime

```
## List risky users using PowerShell
You can retrieve the risky users and their risky histories in Identity Protection. 
```powershell
# List all high risk users
Get-MgRiskyUser -Filter "RiskLevel eq 'high'" | Format-Table UserDisplayName, RiskDetail, RiskLevel, RiskLastUpdatedDateTime

#  List history of a specific user with detailed risk detection
Get-MgRiskyUserHistory -RiskyUserId 375844b0-2026-4265-b9f1-ee1708491e05| Format-Table RiskDetail, RiskLastUpdatedDateTime, @{N="RiskDetection";E={($_). Activity.RiskEventTypes}}, RiskState, UserDisplayName

```
## Confirm users compromised using Powershell
You can confirm users compromised and flag them as high risky users in Identity Protection.
```powershell
# Confirm Compromised on two users
Confirm-MgRiskyUserCompromised -UserIds "577e09c1-5f26-4870-81ab-6d18194cbb51","bf8ba085-af24-418a-b5b2-3fc71f969bf3"
```
## Dimiss risky users using Powershell
You can bulk dismiss risky users in Identity Protection.
```powershell
# Get a list of high users which are more than 90 days old
$riskyUsers= Get-MgRiskyUser -Filter "RiskLevel eq 'high'" | where RiskLastUpdatedDateTime -LT (Get-Date).AddDays(-90)
# bulk dimmiss the risky users
Invoke-MgDismissRiskyUser -UserIds $riskyUsers.Id
```
## Next steps

- [Get started with the Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/get-started)
- [Tutorial: Identify and remediate risks using Microsoft Graph APIs](/graph/tutorial-riskdetection-api)
- [Overview of Microsoft Graph](https://developer.microsoft.com/graph/docs)
- [Azure Active Directory Identity Protection](./overview-identity-protection.md)
