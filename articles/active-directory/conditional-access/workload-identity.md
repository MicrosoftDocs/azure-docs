---
title: Azure Active Directory Conditional Access for workload identities preview
description: Protecting workload identities with Conditional Access policies

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 03/25/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: dawoo

ms.collection: M365-identity-device-management
---
# Conditional Access for workload identities preview

Previously, Conditional Access policies applied only to users when they access apps and services like SharePoint online or the Azure portal. This preview adds support for Conditional Access policies applied to service principals owned by the organization. We call this capability  Conditional Access for workload identities. 

A [workload identity](../develop/workload-identities-overview.md) is an identity that allows an application or service principal access to resources, sometimes in the context of a user. These workload identities differ from traditional user accounts as they:

- Can’t perform multi-factor authentication.
- Often have no formal lifecycle process.
- Need to store their credentials or secrets somewhere.

These differences make workload identities harder to manage and put them at higher risk for compromise.

> [!IMPORTANT]
> In public preview, you can scope Conditional Access policies to service principals in Azure AD with an Azure Active Directory Premium P2 edition active in your tenant. After general availability, additional licenses might be required.

> [!NOTE]
> Policy can be applied to single tenant service principals that have been registered in your tenant. Third party SaaS and multi-tenanted apps are out of scope. Managed identities are not covered by policy. 

This preview enables blocking service principals from outside of trusted public IP ranges, or based on risk detected by Azure AD Identity Protection.

## Implementation

### Create a location-based Conditional Access policy

Create a location based Conditional Access policy that applies to service principals.

1. Sign in to the **Azure portal** as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **What does this policy apply to?**, select **Workload identities (Preview)**.
   1. Under **Include**, choose **Select service principals**, and select the appropriate service principals from the list.
1. Under **Cloud apps or actions**, select **All cloud apps**. The policy will apply only when a service principal requests a token.
1. Under **Conditions** > **Locations**, include **Any location** and exclude **Selected locations** where you want to allow access.
1. Under **Grant**, **Block access** is the only available option. Access is blocked when a token request is made from outside the allowed range.
1. Your policy can be saved in **Report-only** mode, allowing administrators to estimate the effects, or policy is enforced by turning policy **On**.
1. Select **Create** to complete your policy.

### Create a risk-based Conditional Access policy

Create a location based Conditional Access policy that applies to service principals.

:::image type="content" source="media/workload-identity/conditional-access-workload-identity-risk-policy.png" alt-text="Creating a Conditional Access policy with a workload identity and risk as a condition." lightbox="media/workload-identity/conditional-access-workload-identity-risk-policy.png":::

1. Sign in to the **Azure portal** as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **What does this policy apply to?**, select **Workload identities (Preview)**.
   1. Under **Include**, choose **Select service principals**, and select the appropriate service principals from the list.
1. Under **Cloud apps or actions**, select **All cloud apps**. The policy will apply only when a service principal requests a token.
1. Under **Conditions** > **Service principal risk (Preview)**
   1. Set the **Configure** toggle to **Yes**.
   1. Select the levels of risk where you want this policy to trigger.
   1. Select **Done**.
1. Under **Grant**, **Block access** is the only available option. Access is blocked when a token request is made from outside the allowed range.
1. Your policy can be saved in **Report-only** mode, allowing administrators to estimate the effects, or policy is enforced by turning policy **On**.
1. Select **Create** to complete your policy.

## Roll back

If you wish to roll back this feature, you can delete or disable any created policies.

## Sign-in logs

The sign-in logs are used to review how policy is enforced for service principals or the expected affects of policy when using report-only mode.

1. Browse to **Azure Active Directory** > **Sign-in logs** > **Service principal sign-ins**.
1. Select a log entry and choose the **Conditional Access** tab to view evaluation information.

Failure reason when Service Principal is blocked by Conditional Access: “Access has been blocked due to conditional access policies.” 

#### Report-only mode

To view results of a location-based policy, refer to the **Report-only** tab of events in the **Sign-in report**, or use the **Conditional Access Insights and Reporting** workbook. 

To view results of a risk-based policy, refer to the **Report-only** tab of events in the **Sign-in report**.

## Reference

### Finding the objectID

You can get the objectID of the service principal from Azure AD Enterprise Applications. The Object ID in Azure AD App registrations can’t be used. This identifier is the Object ID of the app registration, not of the service principal.

1. Browse to the **Azure portal** > **Azure Active Directory** > **Enterprise Applications**, find the application you registered.
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
      ],
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
 