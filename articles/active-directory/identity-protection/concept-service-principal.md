---
title: Azure AD Identity Protection 
description: 

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: conceptual
ms.date: 11/15/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: karenhoran
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# Securing applications and service principals with Identity Protection

A key component to any organization’s Zero Trust approach must include securing identities for users and applications. This new capability builds upon Identity Protection’s foundation in detecting identity-based threats and expands that foundation to include threat detection for applications and service principals. We are now combining this signal with Conditional Access to enable adaptive risk-based authentication controls. 

Organizations can now view risky application or service principal accounts and risk detection events using two new Graph API collections:

1.	One new detection, entitled Suspicious Sign-ins. This risk detection indicates sign-in properties or patterns that are unusual for this service principal and may be an indicator of compromise. The detection baselines sign-in behavior between 2 and 60 days, and fires if one or more of the following unfamiliar properties occur during a subsequent sign-in:

   1. IP address / ASN
   1. Target resource
   1. User agent
   1. Hosting/non-hosting IP change
   1. IP country
   1. Credential type

   > [!IMPORTANT]
   > We mark accounts at high risk when this detection fires because this can indicate account takeover for the subject application. Legitimate changes to an application’s configuration sometimes trigger this detection. 

1.	Conditional Access for workload identities: This allows you to block access for specific accounts you designate when Identity Protection marks them “at risk.” Enforcement through Conditional Access is currently limited to single-tenant apps only. Multi-tenant apps and services using a Managed Identity are not in scope. 

## Configuration

### Required permissions

You must be assigned the security reader, security administrator, or global administrator role or have the following permissions delegated to interact with service principal risk detections.

| Permission | Display String | Description | Admin Consent Required | Microsoft Account supported |
| --- |  --- |  --- |  --- |  --- | 
| IdentityRiskyUser.Read.All | Roles granted access: Global Administrator, Security Administrator, or Security Reader. | Read identity service principal risk information | Allows the app to read identity service principal risk information for all service principals in your organization on behalf of the signed-in user. | Yes | No |
| IdentityRiskyUser.ReadWrite.All | Roles granted access: Global Administrator, Security Administrator. | Read and update identity service principal risk information | Allows the app to read and update identity service principal risk information for all service principals in your organization on behalf of the signed-in user. | Yes | No |

Application permissions

| Permission | Display String | Description | Admin Consent Required |
| --- |  --- |  --- |  --- |
| IdentityRiskyUser.Read.All | Roles granted access: Global Administrator, Security Administrator, or Security Reader. | Read identity service principal risk information | Allows the app to read identity service principal risk information for all service principals in your organization without a signed-in user. | Yes |
| IdentityRiskyUser.ReadWrite.All | Roles granted access: Global Administrator, Security Administrator. | Read and update identity service principal risk information | Allows the app to read and update identity service principal risk information for all service principals in your organization without a signed-in user. | Yes |

You must be assigned the Conditional Access administrator, security reader, security administrator, or global administrator role or have the following permissions delegated to interact with any associated Conditional Access policies.

| Permission type | Permissions (all three permissions below are required for read and write operations) |
| --- |  --- | 
| Delegated (work or school account) | Policy.Read.All, Policy.ReadWrite.ConditionalAccess, and Application.Read.All | 
| Application | Policy.Read.All, Policy.ReadWrite.ConditionalAccess, and Application.Read.All |

One of the following permissions is required to call the read API. To learn more, including how to choose permissions, see the article Microsoft Graph permissions reference.

| Permission type | Permissions |
| --- | --- | 
| Delegated (work or school account) | Policy.Read.All |
| Application | Policy.Read.All |

## Using the API

This article assumes you are familiar with [using the Microsoft Graph API](/graph/use-the-api). 

### Sample API call

```msgraph-interactive
GET https://canary.graph.microsoft.com/testprodbetasppp/identityProtection/servicePrincipalRiskDetections
```

The sample should return the following response:

```json
"id": "e16a64db-99f5-400c-8291-bbc923679dbf",
"requestId": null,
"correlationId": null,
"riskEventType": "azureADThreatIntelligence",
"riskState": "atRisk",
"riskLevel": "High",
"riskDetail": "none",
"source": "IdentityProtection",
"detectionTimingType": "offline",
"activity": "servicePrincipal",
"ipAddress": null,
"activityDateTime": "2021-03-01T02:52:30.4663029Z",
"detectedDateTime": "2021-03-01T02:52:30.4663029Z",
"lastUpdatedDateTime": "2021-04-05T21:34:27.5786837Z",
"servicePrincipalId": "99fb9703-b586-4438-9160-302f6302b799",
"servicePrincipalDisplayName": "test application2",
"appId": "00000013-0000-0000-c000-000000000000",
"keyIds": ["3f5518bb-4d4d-480f-bdd0-7b04a58e2800"],
"additionalInfo": null,
"location": null

```

### Get servicePrincipalRiskDetection

For this sample you must enter your own event ID in the request.

```msgraph-interactive
GET https://canary.graph.microsoft.com/testprodbetasppp/identityProtection/servicePrincipalRiskDetections/<eventIDGoesHere>
```

Example response

```json
"id": "6a5874ca-abcd-9d82-5ad39bd71600",
"requestId": null,
"correlationId": null,
"riskEventType": "azureADThreatIntelligence",
"riskState": "dismissed",
"riskLevel": "none",
"riskDetail": "none",
"source": "IdentityProtection",
"detectionTimingType": "offline",
"activity": "servicePrincipal",
"ipAddress": null,
"activityDateTime": "2021-03-01T02:52:30.4663029Z",
"detectedDateTime": "2021-03-01T02:52:30.4663029Z",
"lastUpdatedDateTime": "2021-04-05T21:34:27.5786837Z",
"servicePrincipalId": "99fb9703-b586-4438-9160-302f6302b799",
"servicePrincipalDisplayName": "test application",
"appId": "00000013-0000-0000-c000-000000000000",
"keyIds": [],
"additionalInfo": null,
"location": null
```


## Next steps

Conditional Access for workload identities

Microsoft Graph API
