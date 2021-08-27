---
title: Resilience defaults for Azure AD Conditional Access
description: Resilience defaults and the Azure AD Backup Authentication Service

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 08/27/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: karenhoran
ms.reviewer: dawoo

ms.collection: M365-identity-device-management
---
# Conditional Access: Resilience defaults

In case of an outage of the primary authentication service, the Azure Active Directory (Azure AD) Backup Authentication Service may automatically issue access tokens to applications for existing sessions. This may significantly increase Azure AD resilience, because re-authentications for existing sessions account for more than 90% of authentications to Azure AD. The Backup Authentication Service does not support new sessions or authentications by guest users.

For authentications in scope of Conditional Access, policies are re-evaluated before access tokens are issued to determine:

1.	Which Conditional Access policies apply
1.	For policies that do apply, whether the required controls are satisfied

However, during an outage, not all policy conditions can be evaluated in real-time by the Backup Authentication Service to determine whether a Conditional Access policy should apply. Conditional Access resilience defaults is a new session control that lets admins decide whether to block authentications during an outage whenever a policy condition cannot be evaluated in real-time or allow policies to be evaluated using data collected at the beginning of the user’s session. 

> [!IMPORTANT]
> Resilience defaults are automatically enabled for all new and existing policies, and Microsoft highly recommends leaving the resilience defaults enabled to mitigate the impact of an outage. Admins may disable resilience defaults for individual Conditional Access policies. 

## How does it work?

During an outage, the Backup Authentication Service will automatically re-issue access tokens for certain sessions:

| Session description | Access granted |
| --- | --- |
| New session | No |
| Existing session – No Conditional Access policies configured | Yes |
| Existing session – Conditional Access policies configured and the required controls (e.g., MFA) were previously satisfied | Yes |
| Existing session – Conditional Access policies configured and the required controls (e.g., MFA) were not previously satisfied | Determined by resilience defaults |

When an existing session expires during an Azure AD outage, the request for a new access token is routed to the Backup Authentication Service and all Conditional Access policies are re-evaluated. If there are no Conditional Access policies or all the required controls (such as MFA) were previously satisfied at the beginning of the session, the Backup Authentication Service issues a new access token to extend the session. 

If the required controls of a policy were not previously satisfied, the policy is re-evaluated to determine whether access should be granted or denied. However, not all policy conditions can be re-evaluated real-time during an outage. These conditions include: 

- Group membership
- Role membership
- Sign-in risk
- User risk
- Country location (resolving new IP or GPS coordinates)

## Resilience defaults enabled

When resilience defaults are enabled, the Backup Authentication Service may use data collected at the beginning of the session to evaluate whether the policy should apply in the absence of real-time data. By default, all policies will have resilience defaults enabled. The setting may be disabled for individual policies when real-time policy evaluation is required for access to sensitive applications during an outage.

**Example**: A policy with resilience defaults enabled requires all global admins accessing the Azure Portal to perform MFA. Prior to an outage, if a user who is not a global admin accesses the Azure Portal, the policy would not apply, and the user would be granted access without being prompted for MFA. During an outage, the Backup Authentication Service would re-evaluate the policy to determine whether the user should be prompted for MFA. **Since the Backup Authentication Service cannot evaluate role membership in real-time, it would use data collected at the beginning of the user’s session to determine that the policy should still not apply. As a result, the user would be granted access without being prompted for MFA.**

## Resilience defaults disabled

When resilience defaults are disabled, the Backup Authentication Service will not use data collected at the beginning of the session to evaluate policy conditions. During an outage, if a policy condition cannot be evaluated in real-time, access will be denied.

**Example**: A policy with resilience defaults disabled requires all global admins accessing the Azure Portal to perform MFA. Prior to an outage, if a user who is not a global admin accesses the Azure Portal, the policy would not apply, and the user would be granted access without being prompted for MFA. During an outage, the Backup Authentication Service would re-evaluate the policy to determine whether the user should be prompted for MFA. **Since the Backup Authentication Service cannot evaluate role membership in real-time, it would block the user from accessing the Azure Portal.**

> [!WARNING]
> Disabling resilience defaults for a policy that applies to a group or role will reduce the resilience for all users in your tenant. Since group and role membership cannot be evaluated in real-time during an outage, even users who do not belong to the group or role in the policy assignment will be denied access to the application in scope of the policy. To avoid reducing resilience for all users not in scope of the policy, consider applying the policy to individual users instead of groups or roles. 

## Testing resilience defaults

It is not possible to conduct a dry run using the Backup Authentication Service or simulate the result of a policy with resilience defaults enabled or disabled at this time. However, Azure AD will conduct monthly exercises using the Backup Authentication Service and the sign-in logs will display if the Backup Authentication Service was used to issue the access token.

## Configuring resilience defaults

You can configure Conditional Access resilience defaults from the Azure Portal, MS Graph APIs, or PowerShell. 

### Azure Portal

1.	Navigate to the Azure portal > Security > Conditional Access
1.	Create a new policy or select an existing policy
1.	Open the Session control settings
1.	Select Disable resilience defaults to disable the setting for this policy. Sign-ins in scope of the policy will be blocked during an Azure AD outage
1.	Save changes to the policy

### MS Graph APIs

You can also manage resilience defaults for your Conditional Access policies using the MS Graph API and the [Microsoft Graph Explorer](/graph/graph-explorer). 

Sample request URL: 

`PATCH https://graph.microsoft.com/beta/identity/conditionalAccess/policies/policyId`

Sample request body: 

```json

{
"sessionControls": {
"disableResilienceDefaults": true
}
}
```

### PowerShell

This patch operation may be deployed using Microsoft PowerShell after installation of the Microsoft.Graph.Authentication module. To install this module, open an elevated PowerShell prompt and execute

`Install-Module Microsoft.Graph.Authentication`

Connect to Microsoft Graph, requesting the required scopes –

`Connect-MgGraph -Scopes Policy.Read.All,Policy.ReadWrite.ConditionalAccess,Application.Read.All -TenantId <TenantID>`

Authenticate when prompted.

Create the JSON body for the PATCH request –

`$patchBody = '{"sessionControls": {"disableResilienceDefaults": true}}'`

Execute the patch operation –

`Invoke-MgGraphRequest -Method PATCH -Uri https://graph.microsoft.com/beta/identity/conditionalAccess/policies/<PolicyID> -Body $patchBody`

## Recommendations

Microsoft recommends enabling resilience defaults. While there are no direct security concerns, customers should evaluate whether they want to allow the Backup Authentication Service to evaluate Conditional Access policies during an outage using data collected at the beginning of the session (as opposed to in real-time). 

It is possible that a user’s role or group membership may have changed since the beginning of the session. With [Continuous Access Evaluation (CAE)](concept-continuous-access-evaluation.md), access tokens are valid for 24 hours, but subject to instant revocation events (such as termination, password change, device state change, risky sign-in, etc.). The Backup Authentication Service subscribes to the same revocation events, so if a user’s token is revoked as part of CAE, the user is unable to sign in during an outage. When resilience defaults are enabled, existing sessions that expire during an outage will be extended, even if the policy was configured with a session control to enforce a sign-in frequency. For example, a policy with resilience defaults enabled may require that users re-authenticate every hour to access a SharePoint site. During an outage, the user’s session would be extended even though Azure AD may not be available to re-authenticate the user. 

## Next steps

- [Continuous Access Evaluation (CAE)](concept-continuous-access-evaluation.md)
