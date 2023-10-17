---
title: Microsoft Entra Conditional Access for workload identities 
description: Protecting workload identities with Conditional Access policies

services: active-directory
ms.service: active-directory
ms.subservice: workload-identities
ms.topic: how-to
ms.date: 07/18/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: swethar

ms.collection: M365-identity-device-management
---
# Conditional Access for workload identities 

Conditional Access policies have historically applied only to users when they access apps and services like SharePoint Online. We're now extending support for Conditional Access policies to be applied to service principals owned by the organization. We call this capability Conditional Access for workload identities. 

A [workload identity](../workload-identities/workload-identities-overview.md) is an identity that allows an application or service principal access to resources, sometimes in the context of a user. These workload identities differ from traditional user accounts as they:

- Can’t perform multifactor authentication.
- Often have no formal lifecycle process.
- Need to store their credentials or secrets somewhere.

These differences make workload identities harder to manage and put them at higher risk for compromise.

> [!IMPORTANT]
> Workload Identities Premium licenses are required to create or modify Conditional Access policies scoped to service principals. 
> In directories without appropriate licenses, existing Conditional Access policies for workload identities will continue to function, but can't be modified. For more information, see [Microsoft Entra Workload ID](https://www.microsoft.com/security/business/identity-access/microsoft-entra-workload-identities#office-StandaloneSKU-k3hubfz).  

> [!NOTE]
> Policy can be applied to single tenant service principals that have been registered in your tenant. Third party SaaS and multi-tenanted apps are out of scope. Managed identities are not covered by policy. 

Conditional Access for workload identities enables blocking service principals from outside of trusted public IP ranges, or based on risk detected by Microsoft Entra ID Protection.

## Implementation

### Create a location-based Conditional Access policy

Create a location based Conditional Access policy that applies to service principals.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Protection** > **Conditional Access**.
1. Select **Create new policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **What does this policy apply to?**, select **Workload identities**.
   1. Under **Include**, choose **Select service principals**, and select the appropriate service principals from the list.
1. Under **Target resources** > **Cloud apps** > **Include**, select **All cloud apps**. The policy applies only when a service principal requests a token.
1. Under **Conditions** > **Locations**, include **Any location** and exclude **Selected locations** where you want to allow access.
1. Under **Grant**, **Block access** is the only available option. Access is blocked when a token request is made from outside the allowed range.
1. Your policy can be saved in **Report-only** mode, allowing administrators to estimate the effects, or policy is enforced by turning policy **On**.
1. Select **Create** to complete your policy.

### Create a risk-based Conditional Access policy

Create a risk-based Conditional Access policy that applies to service principals.

:::image type="content" source="media/workload-identity/conditional-access-workload-identity-risk-policy.png" alt-text="Creating a Conditional Access policy with a workload identity and risk as a condition." lightbox="media/workload-identity/conditional-access-workload-identity-risk-policy.png":::

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Protection** > **Conditional Access**.
1. Select **Create new policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **What does this policy apply to?**, select **Workload identities**.
   1. Under **Include**, choose **Select service principals**, and select the appropriate service principals from the list.
1. Under **Target resources** > **Cloud apps** > **Include**, select **All cloud apps**. The policy applies only when a service principal requests a token.
1. Under **Conditions** > **Service principal risk**
   1. Set the **Configure** toggle to **Yes**.
   1. Select the levels of risk where you want this policy to trigger.
   1. Select **Done**.
1. Under **Grant**, **Block access** is the only available option. Access is blocked when the specified risk levels are seen.
1. Your policy can be saved in **Report-only** mode, allowing administrators to estimate the effects, or policy is enforced by turning policy **On**.
1. Select **Create** to complete your policy.

## Roll back

If you wish to roll back this feature, you can delete or disable any created policies.

## Sign-in logs

The sign-in logs are used to review how policy is enforced for service principals or the expected affects of policy when using report-only mode.

1. Browse to **Identity** > **Monitoring & health** > **Sign-in logs** > **Service principal sign-ins**.
1. Select a log entry and choose the **Conditional Access** tab to view evaluation information.

Failure reason when Service Principal is blocked by Conditional Access: “Access has been blocked due to Conditional Access policies.” 

#### Report-only mode

To view results of a location-based policy, refer to the **Report-only** tab of events in the **Sign-in report**, or use the **Conditional Access Insights and Reporting** workbook. 

To view results of a risk-based policy, refer to the **Report-only** tab of events in the **Sign-in report**.

## Reference

### Finding the objectID

You can get the objectID of the service principal from Microsoft Entra Enterprise Applications. The Object ID in Microsoft Entra App registrations can’t be used. This identifier is the Object ID of the app registration, not of the service principal.

1. Browse to **Identity** > **Applications** > **Enterprise Applications**, find the application you registered.
1. From the **Overview** tab, copy the **Object ID** of the application. This identifier is the unique to the service principal, used by Conditional Access policy to find the calling app.

### Microsoft Graph

Sample JSON for location-based configuration using the Microsoft Graph beta endpoint.

```json
{
  "displayName": "Name",
  "state": "enabled OR disabled OR enabledForReportingButNotEnforced",
  "conditions": {
    "applications": {
      "includeApplications": [
        "All"
      ]
    },
    "clientApplications": {
      "includeServicePrincipals": [
        "[Service principal Object ID] OR ServicePrincipalsInMyTenant"
      ],
      "excludeServicePrincipals": [
        "[Service principal Object ID]"
      ]
    },
    "locations": {
      "includeLocations": [
        "All"
      ],
      "excludeLocations": [
        "[Named location ID] OR AllTrusted"
      ]
    }
  },
  "grantControls": {
    "operator": "and",
    "builtInControls": [
      "block"
    ]
  }
}
```

## Next steps

- [Using the location condition in a Conditional Access policy](location-condition.md)
- [Conditional Access: Programmatic access](howto-conditional-access-apis.md)
- [What is Conditional Access report-only mode?](concept-conditional-access-report-only.md)
 
