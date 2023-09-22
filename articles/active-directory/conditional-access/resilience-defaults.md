---
title: Resilience defaults for Microsoft Entra Conditional Access
description: Resilience defaults and the Microsoft Entra Backup Authentication Service

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 09/13/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: dawoo

ms.collection: M365-identity-device-management
---
# Conditional Access: Resilience defaults

If there was an outage of the primary authentication service, the Microsoft Entra Backup Authentication Service may automatically issue access tokens to applications for existing sessions. This functionality may significantly increase Microsoft Entra resilience, because reauthentications for existing sessions account for more than 90% of authentications to Microsoft Entra ID. The Backup Authentication Service doesn't support new sessions or authentications by guest users.

For authentications protected by Conditional Access, policies are reevaluated before access tokens are issued to determine:

1. Which Conditional Access policies apply?
1. For policies that do apply, were the required controls are satisfied?

During an outage, not all conditions can be evaluated in real time by the Backup Authentication Service to determine whether a Conditional Access policy should apply. Conditional Access resilience defaults are a new session control that lets admins decide between:

- Whether to block authentications during an outage whenever a policy condition can’t be evaluated in real-time.
- Allow policies to be evaluated using data collected at the beginning of the user’s session. 

> [!IMPORTANT]
> Resilience defaults are automatically enabled for all new and existing policies, and Microsoft highly recommends leaving the resilience defaults enabled to mitigate the impact of an outage. Admins may disable resilience defaults for individual Conditional Access policies. 

## How does it work?

During an outage, the Backup Authentication Service will automatically reissue access tokens for certain sessions:

| Session description | Access granted |
| --- | --- |
| New session | No |
| Existing session – No Conditional Access policies are configured | Yes |
| Existing session – Conditional Access policies configured and the required controls, like MFA, were previously satisfied | Yes |
| Existing session – Conditional Access policies configured and the required controls, like MFA, weren't previously satisfied | Determined by resilience defaults |

When an existing session expires during a Microsoft Entra outage, the request for a new access token is routed to the Backup Authentication Service and all Conditional Access policies are reevaluated. If there are no Conditional Access policies or all the required controls, such as MFA, were previously satisfied at the beginning of the session, the Backup Authentication Service issues a new access token to extend the session. 

If the required controls of a policy weren't previously satisfied, the policy is reevaluated to determine whether access should be granted or denied. However, not all conditions can be reevaluated real time during an outage. These conditions include: 

- Group membership
- Role membership
- Sign-in risk
- User risk
- Country/region location (resolving new IP or GPS coordinates)
- Authentication strengths

When active, the Backup Authentication Service doesn't evaluate authentication methods required by [authentication strengths](../authentication/concept-authentication-strengths.md). If you used a non-phishing-resistant authentication method before an outage, during an outage you aren't prompted for multifactor authentication even if accessing a resource protected by a Conditional Access policy with a phishing-resistant authentication strength.

## Resilience defaults enabled

When resilience defaults are enabled, the Backup Authentication Service may use data collected at the beginning of the session to evaluate whether the policy should apply in the absence of real-time data. By default, all policies will have resilience defaults enabled. The setting may be disabled for individual policies when real-time policy evaluation is required for access to sensitive applications during an outage.

**Example**: A policy with resilience defaults enabled requires all global admins accessing the Azure portal to do MFA. Before an outage, if a user who isn't a Global Administrator accesses the Azure portal, the policy wouldn't apply, and the user would be granted access without being prompted for MFA. During an outage, the Backup Authentication Service would reevaluate the policy to determine whether the user should be prompted for MFA. **Since the Backup Authentication Service cannot evaluate role membership in real-time, it would use data collected at the beginning of the user’s session to determine that the policy should still not apply. As a result, the user would be granted access without being prompted for MFA.**

## Resilience defaults disabled

When resilience defaults are disabled, the Backup Authentication Service won't use data collected at the beginning of the session to evaluate conditions. During an outage, if a policy condition can’t be evaluated in real-time, access will be denied.

**Example**: A policy with resilience defaults disabled requires all global admins accessing the Azure portal to do MFA. Before an outage, if a user who isn't a Global Administrator accesses the Azure portal, the policy wouldn't apply, and the user would be granted access without being prompted for MFA. During an outage, the Backup Authentication Service would reevaluate the policy to determine whether the user should be prompted for MFA. **Since the Backup Authentication Service cannot evaluate role membership in real-time, it would block the user from accessing the Azure Portal.**

> [!WARNING]
> Disabling resilience defaults for a policy that applies to a group or role will reduce the resilience for all users in your tenant. Since group and role membership cannot be evaluated in real-time during an outage, even users who do not belong to the group or role in the policy assignment will be denied access to the application in scope of the policy. To avoid reducing resilience for all users not in scope of the policy, consider applying the policy to individual users instead of groups or roles. 

## Testing resilience defaults

It isn't possible to conduct a dry run using the Backup Authentication Service or simulate the result of a policy with resilience defaults enabled or disabled at this time. Microsoft Entra ID will conduct monthly exercises using the Backup Authentication Service. The sign-in logs will display if the Backup Authentication Service was used to issue the access token. In **Identity** > **Monitoring & health** > **Sign-in Logs** blade, you can add the filter "Token issuer type == Microsoft Entra Backup Auth" to display the logs processed by Microsoft Entra Backup Authentication service. 

## Configuring resilience defaults

You can configure Conditional Access resilience defaults from the Microsoft Entra admin center, MS Graph APIs, or PowerShell. 

### Microsoft Entra admin center

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Protection** > **Conditional Access**.
1. Create a new policy or select an existing policy
1. Open the Session control settings
1. Select Disable resilience defaults to disable the setting for this policy. Sign-ins in scope of the policy will be blocked during a Microsoft Entra outage
1. Save changes to the policy

### MS Graph APIs

You can also manage resilience defaults for your Conditional Access policies using the MS Graph API and the [Microsoft Graph Explorer](/graph/graph-explorer/graph-explorer-overview). 

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

```powershell
Install-Module Microsoft.Graph.Authentication
```

Connect to Microsoft Graph, requesting the required scopes:

```powershell
Connect-MgGraph -Scopes Policy.Read.All,Policy.ReadWrite.ConditionalAccess,Application.Read.All -TenantId <TenantID>
```

Authenticate when prompted.

Create the JSON body for the PATCH request:

```powershell
$patchBody = '{"sessionControls": {"disableResilienceDefaults": true}}'
```

Execute the patch operation:

```powershell
Invoke-MgGraphRequest -Method PATCH -Uri https://graph.microsoft.com/beta/identity/conditionalAccess/policies/<PolicyID> -Body $patchBody
```

## Recommendations

Microsoft recommends enabling resilience defaults. While there are no direct security concerns, customers should evaluate whether they want to allow the Backup Authentication Service to evaluate Conditional Access policies during an outage using data collected at the beginning of the session as opposed to in real time. 

It's possible that a user’s role or group membership may have changed since the beginning of the session. With [Continuous Access Evaluation (CAE)](concept-continuous-access-evaluation.md), access tokens are valid for 24 hours, but subject to instant revocation events. The Backup Authentication Service subscribes to the same revocation events CAE. If a user’s token is revoked as part of CAE, the user is unable to sign in during an outage. When resilience defaults are enabled, existing sessions that expire during an outage will be extended. Sessions are extended even if the policy was configured with a session control to enforce a sign-in frequency. For example, a policy with resilience defaults enabled may require that users reauthenticate every hour to access a SharePoint site. During an outage, the user’s session would be extended even though Microsoft Entra ID may not be available to reauthenticate the user. 

## Next steps

- [Continuous Access Evaluation (CAE)](concept-continuous-access-evaluation.md)
