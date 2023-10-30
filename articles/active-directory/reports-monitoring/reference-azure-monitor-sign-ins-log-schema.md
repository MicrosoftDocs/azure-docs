---
title: Sign-in log schema in Azure Monitor
description: Describe the Microsoft Entra sign-in log schema for use in Azure Monitor
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 10/31/2022
ms.author: sarahlipsey
ms.reviewer: besiler

ms.collection: M365-identity-device-management
---

# Interpret the Microsoft Entra sign-in logs schema in Azure Monitor

This article describes the Microsoft Entra sign-in log schema in Azure Monitor. Information related to sign-ins is provided under the *Properties* attribute of the `records` object.


```json
{
  "time": "2019-03-12T16:02:15.5522137Z",
  "resourceId": "/tenants/<TENANT ID>/providers/Microsoft.aadiam",
  "operationName": "Sign-in activity",
  "operationVersion": "1.0",
  "category": "SignInLogs",
  "tenantId": "<TENANT ID>",
  "resultType": "50140",
  "resultSignature": "None",
  "resultDescription": "This error occurred due to 'Keep me signed in' interrupt when the user was signing-in.",
  "durationMs": 0,
  "callerIpAddress": "<CALLER IP ADDRESS>",
  "correlationId": "a75a10bd-c126-486b-9742-c03110d36262",
  "identity": "Timothy Perkins",
  "Level": 4,
  "location": "US",
  "properties": 
       {
    "id": "0231f922-93fa-4005-bb11-b344eca03c01",
    "createdDateTime": "2019-03-12T16:02:15.5522137+00:00",
    "userDisplayName": "Timothy Perkins",
    "userPrincipalName": "<USER PRINCIPAL NAME>",
    "userId": "<USER ID>",
    "appId": "<APPLICATION ID>",
    "appDisplayName": "Azure Portal",
    "ipAddress": "<IP ADDRESS>",
    "status": {
      "errorCode": 50140,
      "failureReason": "This error occurred due to 'Keep me signed in' interrupt when the user was signing-in."
    },
    "clientAppUsed": "Browser",
    "userAgent": "<USER AGENT>",
    "deviceDetail":
   {
     "deviceId": "8bfcb982-6856-4402-924c-ada2486321cc",
     "operatingSystem": "Windows 10",
     "browser": "Chrome 72.0.3626"
     },
    "location":
    {
      "city": "Bellevue",
      "state": "Washington",
      "countryOrRegion": "US",
      "geoCoordinates": 
     {
        "latitude": 45,
        "longitude": 122
      }
    },
    "correlationId": "a75a10bd-c126-486b-9742-c03110d36262",
    "conditionalAccessStatus": "notApplied",
    "appliedConditionalAccessPolicies": [
      {
        "id": "ae11ffaa-9879-44e0-972c-7538fd5c4d1a",
        "displayName": "HR app access policy",
        "enforcedGrantControls": [
          "Mfa"
        ],
        "enforcedSessionControls": [],
        "result": "notApplied",
        "conditionsSatisfied": 0,
        "conditionsNotSatisfied": 0
      },
      {
        "id": "b915a70b-2eee-47b6-85b6-ff4f4a66256d",
        "displayName": "MFA for all but global support access",
        "enforcedGrantControls": [],
        "enforcedSessionControls": [],
        "result": "notEnabled",
        "conditionsSatisfied": 0,
        "conditionsNotSatisfied": 0
      },
      {
        "id": "830f27fa-67a8-461f-8791-635b7225caf1",
        "displayName": "Header Based Application Control",
        "enforcedGrantControls": [
          "Mfa"
        ],
        "enforcedSessionControls": [],
        "result": "notApplied",
        "conditionsSatisfied": 0,
        "conditionsNotSatisfied": 0
      },
      {
        "id": "8ed8d7f7-0a2e-437b-b512-9e47bed562e6",
        "displayName": "MFA for everyones",
        "enforcedGrantControls": [],
        "enforcedSessionControls": [],
        "result": "notEnabled",
        "conditionsSatisfied": 0,
        "conditionsNotSatisfied": 0
      },
      {
        "id": "52924e0f-798b-4afd-8c42-49055c7d6395",
        "displayName": "Device compliant",
        "enforcedGrantControls": [],
        "enforcedSessionControls": [],
        "result": "notEnabled",
        "conditionsSatisfied": 0,
        "conditionsNotSatisfied": 0
      }
    ],
    "originalRequestId": "f2f0a254-f831-43b9-bcb0-2646fb645c00",
    "isInteractive": true,
    "authenticationProcessingDetails": [
      {
        "key": "Login Hint Present",
        "value": "True"
      }
    ],
    "networkLocationDetails": [],
    "processingTimeInMilliseconds": 238,
    "riskDetail": "none",
    "riskLevelAggregated": "none",
    "riskLevelDuringSignIn": "none",
    "riskState": "none",
    "riskEventTypes": [],
    "riskEventTypes_v2": [],
    "resourceDisplayName": "Office 365 SharePoint Online",
    "resourceId": "00000003-0000-0ff1-ce00-000000000000",
    "resourceTenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47",
    "homeTenantId": "<USER HOME TENANT ID>",
    "tokenIssuerName": "",
    "tokenIssuerType": "AzureAD",
    "authenticationDetails": [
      {
        "authenticationStepDateTime": "2019-03-12T16:02:15.5522137+00:00",
        "authenticationMethod": "Previously satisfied",
        "succeeded": true,
        "authenticationStepResultDetail": "First factor requirement satisfied by claim in the token",
        "authenticationStepRequirement": "Primary authentication",
        "StatusSequence": 0,
        "RequestSequence": 0
      },
      {
        "authenticationStepDateTime": "2021-08-12T15:48:12.8677211+00:00",
        "authenticationMethod": "Previously satisfied",
        "succeeded": true,
        "authenticationStepResultDetail": "MFA requirement satisfied by claim in the token",
        "authenticationStepRequirement": "Multi-factor authentication"
      }
    ],
    "authenticationRequirementPolicies": [
      {
        "requirementProvider": "multiConditionalAccess",
        "detail": "Conditional Access"
      }
    ],
    "authenticationRequirement": "multiFactorAuthentication",
    "alternateSignInName": "<ALTERNATE SIGN IN>",
    "signInIdentifier": "<SIGN IN IDENTIFIER>",
    "servicePrincipalId": "",
    "userType": "Member",
    "flaggedForReview": false,
    "isTenantRestricted": false,
    "autonomousSystemNumber": 8000,
    "crossTenantAccessType": "none",
    "privateLinkDetails": {},
    "ssoExtensionVersion": ""
    }
}

```


## Field descriptions

| Field name | Key | Description |
| --- | --- | --- | 
| Time |  - | The date and time, in UTC. |
| ResourceId | - | This value is unmapped, and you can safely ignore this field.  |
| OperationName | - | For sign-ins, this value is always *Sign-in activity*. |
| OperationVersion | - | The REST API version that's requested by the client. |
| Category | - | For sign-ins, this value is always *SignIn*. | 
| TenantId | - | The tenant GUID that's associated with the logs. |
| ResultType | - | The result of the sign-in operation can be `0` for success or an *error code* for failure. | 
| ResultSignature | - | This value is always *None*. |
| ResultDescription | N/A or blank | Provides the error description for the sign-in operation. |
| riskDetail | riskDetail | Provides the 'reason' behind a specific state of a risky user, sign-in or a risk detection. The possible values are: `none`, `adminGeneratedTemporaryPassword`, `userPerformedSecuredPasswordChange`, `userPerformedSecuredPasswordReset`, `adminConfirmedSigninSafe`, `aiConfirmedSigninSafe`, `userPassedMFADrivenByRiskBasedPolicy`, `adminDismissedAllRiskForUser`, `adminConfirmedSigninCompromised`, `unknownFutureValue`. The value `none` means that no action has been performed on the user or sign-in so far. <br>**Note:** Details for this property require a Microsoft Entra ID P2 license. Other licenses return the value `hidden`. |
| riskEventTypes | riskEventTypes | Risk detection types associated with the sign-in. The possible values are: `unlikelyTravel`, `anonymizedIPAddress`, `maliciousIPAddress`, `unfamiliarFeatures`, `malwareInfectedIPAddress`, `suspiciousIPAddress`, `leakedCredentials`, `investigationsThreatIntelligence`,  `generic`, and `unknownFutureValue`. |
| authProcessingDetails	| Azure Active Directory Authentication Library | Contains Family, Library, and Platform information in format: "Family: Microsoft Authentication Library: ADAL.JS 1.0.0 Platform: JS" |
| authProcessingDetails	| IsCAEToken | Values are True or False |
| riskLevelAggregated | riskLevel | Aggregated risk level. The possible values are: `none`, `low`, `medium`, `high`, `hidden`, and `unknownFutureValue`. The value `hidden` means the user or sign-in wasn't enabled for Microsoft Entra ID Protection. **Note:** Details for this property are only available for Microsoft Entra ID P2 customers. All other customers will be returned `hidden`. |
| riskLevelDuringSignIn | riskLevel | Risk level during sign-in. The possible values are: `none`, `low`, `medium`, `high`, `hidden`, and `unknownFutureValue`. The value `hidden` means the user or sign-in wasn't enabled for Microsoft Entra ID Protection. **Note:** Details for this property are only available for Microsoft Entra ID P2 customers. All other customers will be returned `hidden`. |
| riskState | riskState | Reports status of the risky user, sign-in, or a risk detection. The possible values are: `none`, `confirmedSafe`, `remediated`, `dismissed`, `atRisk`, `confirmedCompromised`, `unknownFutureValue`. |
| DurationMs | - | This value is unmapped, and you can safely ignore this field. |
| CallerIpAddress | - | The IP address of the client that made the request. | 
| CorrelationId | - | The optional GUID that's passed by the client. This value can help correlate client-side operations with server-side operations, and it's useful when you're tracking logs that span services. |
| Identity | - | The identity from the token that was presented when you made the request. It can be a user account, system account, or service principal. |
| Level | - | Provides the type of message. For audit, it's always *Informational*. |
| Location | - | Provides the location of the sign-in activity. |
| Properties | - | Lists all the properties that are associated with sign-ins.|
| ResultType | - | Contains the Microsoft Entra error code for the sign-in event (if an error code was present).|



## Next steps

* [Interpret audit logs schema in Azure Monitor](./overview-reports.md)
* [Read more about Azure platform logs](../../azure-monitor/essentials/platform-logs-overview.md)
