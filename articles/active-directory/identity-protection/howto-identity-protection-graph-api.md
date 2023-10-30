---
title: Microsoft Graph PowerShell SDK and Microsoft Entra ID Protection
description: Query Microsoft Graph risk detections and associated information from Microsoft Entra ID

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 09/13/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: chuqiaoshi

ms.collection: M365-identity-device-management
---
# Microsoft Entra ID Protection and the Microsoft Graph PowerShell 

Microsoft Graph is the Microsoft unified API endpoint and the home of [Microsoft Entra ID Protection](./overview-identity-protection.md) APIs. This article will show you how to use the [Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/get-started) to manage risky users using PowerShell. Organizations that want to query the Microsoft Graph APIs directly can use the article, [Tutorial: Identify and remediate risks using Microsoft Graph APIs](/graph/tutorial-riskdetection-api) to begin that journey.

To successfully complete this tutorial, make sure you have the required prerequisites:

- Microsoft Graph PowerShell SDK is installed. For more information, see the article [Install the Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/installation?view=graph-powershell-1.0&preserve-view=true).
- Microsoft Graph PowerShell using a [Security Administrator](../roles/permissions-reference.md#security-administrator) role. The IdentityRiskEvent.Read.All, IdentityRiskyUser.ReadWrite.All Or IdentityRiskyUser.ReadWrite.All delegated permissions are required. To set the permissions to IdentityRiskEvent.Read.All and IdentityRiskyUser.ReadWrite.All, run:

   ```powershell
   Connect-MgGraph -Scopes "IdentityRiskEvent.Read.All","IdentityRiskyUser.ReadWrite.All"
   ```

If you use app-only authentication, see the article [Use app-only authentication with the Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/app-only?view=graph-powershell-1.0&tabs=azure-portal&preserve-view=true). To register an application with the required application permissions, prepare a certificate and run:

```powershell
Connect-MgGraph -ClientID YOUR_APP_ID -TenantId YOUR_TENANT_ID -CertificateName YOUR_CERT_SUBJECT ## Or -CertificateThumbprint instead of -CertificateName
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

## Confirm users compromised using PowerShell

You can confirm users compromised and flag them as high risky users in Identity Protection.

```powershell
# Confirm Compromised on two users
Confirm-MgRiskyUserCompromised -UserIds "577e09c1-5f26-4870-81ab-6d18194cbb51","bf8ba085-af24-418a-b5b2-3fc71f969bf3"
```

## Dismiss risky users using PowerShell

You can bulk dismiss risky users in Identity Protection.

```powershell
# Get a list of high risky users which are more than 90 days old
$riskyUsers= Get-MgRiskyUser -Filter "RiskLevel eq 'high'" | where RiskLastUpdatedDateTime -LT (Get-Date).AddDays(-90)
# bulk dimmiss the risky users
Invoke-MgDismissRiskyUser -UserIds $riskyUsers.Id
```

## Next steps

- [Get started with the Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/get-started)
- [Tutorial: Identify and remediate risks using Microsoft Graph APIs](/graph/tutorial-riskdetection-api)
- [Overview of Microsoft Graph](https://developer.microsoft.com/graph/docs)
- [Microsoft Entra ID Protection](./overview-identity-protection.md)
