---
title: Securing workload identities with Azure AD Identity Protection
description: Workload identity risk in Azure AD Identity Protection

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: conceptual
ms.date: 11/29/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: karenhoran
ms.reviewer: etbasser

ms.collection: M365-identity-device-management
---
# Securing workload identities with Identity Protection

A key component to any organization’s Zero Trust approach must include securing identities for users and applications. This new capability builds upon Identity Protection’s foundation in detecting identity-based threats and expands that foundation to include threat detection for applications and service principals. We're now combining this signal with Conditional Access to enable adaptive risk-based authentication controls. 

Organizations can now view risky application or service principal accounts and risk detection events using two new Graph API collections:

1.	One new detection, entitled Suspicious Sign-ins. This risk detection indicates sign-in properties or patterns that are unusual for this service principal and may be an indicator of compromise. The detection baselines sign-in behavior between 2 and 60 days, and fires if one or more of the following unfamiliar properties occur during a later sign-in:
    1. IP address / ASN
    1. Target resource
    1. User agent
    1. Hosting/non-hosting IP change
    1. IP country
    1. Credential type

      > [!IMPORTANT]
      > We mark accounts at high risk when this detection fires because this can indicate account takeover for the subject application. Legitimate changes to an application’s configuration sometimes trigger this detection. 

1.	Conditional Access for workload identities: This feature allows you to block access for specific accounts you choose when Identity Protection marks them “at risk.” Enforcement through Conditional Access is currently limited to single-tenant apps only. Multi-tenant apps and services using a Managed Identity aren't in scope. 

## Configuration

### Required permissions

You must be assigned the security reader, security administrator, or global administrator role or have the following permissions delegated to interact with service principal risk detections.

| Permission | Display String | Description | Admin Consent Required | Microsoft Account supported |
| --- |  --- |  --- |  --- |  --- | 
| IdentityRiskyUser.Read.All <br><br> Roles granted access: Global Administrator, Security Administrator, or Security Reader. | Read identity service principal risk information | Allows the app to read identity service principal risk information for all service principals in your organization on behalf of the signed-in user. | Yes | No |
| IdentityRiskyUser.ReadWrite.All <br><br> Roles granted access: Global Administrator, Security Administrator. | Read and update identity service principal risk information | Allows the app to read and update identity service principal risk information for all service principals in your organization on behalf of the signed-in user. | Yes | No |

Application permissions

| Permission | Display String | Description | Admin Consent Required |
| --- |  --- |  --- |  --- |
| IdentityRiskyUser.Read.All <br><br> Roles granted access: Global Administrator, Security Administrator, or Security Reader. | Read identity service principal risk information | Allows the app to read identity service principal risk information for all service principals in your organization without a signed-in user. | Yes |
| IdentityRiskyUser.ReadWrite.All <br><br> Roles granted access: Global Administrator, Security Administrator. | Read and update identity service principal risk information | Allows the app to read and update identity service principal risk information for all service principals in your organization without a signed-in user. | Yes |

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

This article assumes you're familiar with [using the Microsoft Graph API](/graph/use-the-api). 

### Sample API call

```msgraph-interactive
GET https://canary.graph.microsoft.com/testprodbetasppp/identityProtection/servicePrincipalRiskDetections
```

The sample should return a response like the following JSON:

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

For this sample, you must enter your own event ID in the request.

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

## Investigate risky service principals

1. Investigate sign-in activity:
   1. Information can be found in the Azure AD sign-in logs under **Service Principal sign-ins** and **Managed Identity sign-ins** You must enable the Sign-ins preview to view these tabs.
      1. Determine if this application’s sign-in activity is showing suspicious behavior. For example:
         1. Is the application accessing unusual resources?
         1. Are there too many sign-ins given the expected behavior?
         1. Is the application active at the wrong times of day?
         1. Are sign-ins made from an unrecognized IP address?
      1. You may need to confer with the application's development team or owner for more detail. 
1.	Check for abnormal credential changes:
   1. The required information can be found in the Azure AD audit logs.
      1. Filter for “Category” by “Application Management” and “Activity” by “Update Application - Certificates and secrets management”.
      1. Check to see if there was an unauthorized change to credentials on the account.
      1. Check if there are more credentials than required assigned to the service principal.
      1. When checking for credentials, check both the application and any associated service principal objects. 
1. Search for anomalous configuration changes:
   1. Check the Azure AD audit logs filter “Activity” by “Update Application” or “Update Service Principal”.
   1. Confirm that the connection strings are consistent and if the sign-out URL has been modified.
   1. Confirm the domains in the URI are in-line with those domains registered.
   1.	Determine if anyone has added an unauthorized redirect URI.
   1. Confirm ownership of the redirect URI that you own to ensure it didn't expire and was claimed by an adversary.
1. Check application consent for the flagged application.
   1. Check the Azure AD audit logs filter “Activity” by “Consent to application” to see all consent grants to that application.
   1. Determine if there was suspicious end-user consent to the app.
   1. Check the Azure AD audit logs to find if the permissions granted are too broad, like tenant-wide or admin-consented.
   1. Check if consent was granted by user identities that shouldn't be able, or if the actions were done at strange dates and times.
1. Check for suspicious app roles.
   1. This information can be investigated using the Azure AD audit logs filter “Activity” by “Add app role assignment to service principal”.
   1. Confirm if the assigned roles have high privilege.
   1. Confirm if the assigned privileges are necessary.
1.	Check for unverified commercial apps:
   1. Check if commercial gallery applications are being used.

Once you determine if the application was compromised, call the API to dismiss the risk or confirm compromise.

## Remediation

1.	Inventory credentials assigned to the Risky Service Principal.
   1. Execute a Microsoft Graph call using GET ~/application/{id} where the **id** passed is the application object ID.
1.	Parse the output for credentials. The output may contain passwordCredentials or keyCredentials. Record the keyIds for all. For example: 
      ```json
      "keyCredentials": [],
      "parentalControlSettings": {
         "countriesBlockedForMinors": [],
         "legalAgeGroupRule": "Allow"
      },
      "passwordCredentials": [
         {
            "customKeyIdentifier": null,
            "displayName": "Test",
            "endDateTime": "2021-12-16T19:19:36.997Z",
            "hint": "7~-",
            "keyId": "9f92041c-46b9-4ebc-95fd-e45745734bef",
            "secretText": null,
            "startDateTime": "2021-06-16T18:19:36.997Z"
         }
      ],
      ```         

1.	Add a new (x509) certificate credential to the application object via application addKey API: POST ~/applications/{id}/addKey. Then IMMEDIATELY do the next step.
1.	Remove all old credentials. For each old password credential, remove it using POST ~/applications/{id}/removePassword. For each old key credential, remove it using POST ~/applications/{id}/removeKey.

### Remediation of all Service Principals associated to Application

Follow these steps if your tenant hosts or registers a multi-tenant application or registers multiple service principals associated to the application. Complete similar steps to what is listed above:

1.	GET ~/servicePrincipals/{id}.
1.	Find passwordCredentials and keyCredentials in the response, record all OLD keyIds.
1.	Remove all old password and key credentials. Use POST ~/servicePrincipals/{id}/removePassword and POST ~/servicePrincipals/{id}/removeKey for these tasks.

### Remediation of resources the affected Service Principal(s) has access to:

Remediate any KeyVault secrets that the Service Principal has access to by rotating them, in the following priority:

1. Secrets directly exposed with GetSecret() calls.
1. The rest of the secrets in exposed KeyVaults.
1. The rest of the secrets across any exposed subscriptions.

## Enable a risk-based Conditional Access policy

Organizations can choose to enable Conditional Access for workload identities to block service principals at risk.

This feature is currently limited to single-tenant applications. Multi-tenant applications and services using a Managed Identity are not yet in scope. For general guidance on using Graph to configure Conditional Access polices, please see our existing documentation. 
1.	Confirm the test account is at risk using Graph API and note the specific “id” of the SP account. See above step.

2.	Set a risk-based CA policy to be enforced against that same account, specifying it under “includeServicePrincipals” per the example below. Provide a name for the policy. The sample below will block on all risk levels, low through high. 

In Graph Explorer, POST to beta with the following URL and query in the request body:

https://canary.graph.microsoft.com/testprodbetaserviceprincipalrisk/identity/conditionalAccess/policies 

{"displayName":"Test policy on service principals with risk condition","state":"disabled","conditions":{"applications":{"includeApplications":["All"],"excludeApplications":[],"includeUserActions":[],"includeAuthenticationContextClassReferences":[],"applicationFilter":null},"userRiskLevels":[],"signInRiskLevels":[],"clientApplications":{"includeServicePrincipals":["784b3082-c56d-48ed-8c2b-588aa9543e66"],"excludeServicePrincipals":[]},"servicePrincipalRiskLevels":["low" , “medium” , “high”]},"grantControls":{"operator":"and","builtInControls":["block"],"customAuthenticationFactors":[],"termsOfUse":[]}}


## Next steps

Conditional Access for workload identities

Microsoft Graph API
