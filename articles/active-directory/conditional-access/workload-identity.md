---
title: Azure Active Directory Conditional Access for workload identities preview
description: Protecting workload identities with Conditional Access policies

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 01/10/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: karenhoran
ms.reviewer: dawoo

ms.collection: M365-identity-device-management
---
# Conditional Access for workload identities preview

Previously, Conditional Access policies applied only to users when they access apps and services like SharePoint online or the Azure portal. This preview adds support for Conditional Access policies applied to service principals owned by the organization. We call this capability  Conditional Access for workload identities. 

A workload identity is an identity that allows an application or service principal access to resources, sometimes in the context of a user. These workload identities differ from traditional user accounts as:

- They usually have no formal lifecycle process.
- Need to store their credentials or secrets somewhere.
- Applications may use multiple identities. 
 
These differences make workload identities difficult to manage, puts them at higher risk for leaks, and reduces the potential for securing access.

> [!IMPORTANT]
> In public preview, you can scope Conditional Access policies to service principals in Azure AD with an Azure Active Directory Premium P2 edition active in your tenant. After general availability, additional licenses might be required.

> [!NOTE]
> Policy can be applied to single tenant service principals that have been registered in your tenant. Third party SaaS and multi-tenanted apps are out of scope. Managed identities are not covered by policy. 

This preview enables blocking service principals from outside of trusted IP ranges, such as a corporate network public IP ranges. 

## Implementation

### Step 1: Set up a sample application

If you already have a test application that makes use of a service principal, you can skip this step.

Set up a sample application that, demonstrates how a job or a Windows service can run with an application identity, instead of a user's identity. Follow the instructions in the article [Quickstart: Get a token and call the Microsoft Graph API by using a console app's identity](../develop/quickstart-v2-netcore-daemon.md) to create this application.

### Step 2: Create a Conditional Access policy

Create a location based Conditional Access policy that applies to service principals.

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
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

## Roll back

If you wish to roll back this feature, you can delete or disable any created policies.

## Sign-in logs

The sign-in logs are used to review how policy is enforced for service principals or the expected affects of policy when using report-only mode.

1. Browse to **Azure Active Directory** > **Sign-in logs** > **Service principal sign-ins**.
1. Select a log entry and choose the **Conditional Access** tab to view evaluation information.

Failure reason when Service Principal is blocked by Conditional Access: “Access has been blocked due to conditional access policies.” 

## Reference

### Finding the objectID

You can get the objectID of the service principal from Azure AD Enterprise Applications. The Object ID in Azure AD App registrations cannot be used. This identifier is the Object ID of the app registration, not of the service principal.

1. Browse to the **Azure portal** > **Azure Active Directory** > **Enterprise Applications**, find the application you registered.
1. From the **Overview** tab, copy the **Object ID** of the application. This identifier is the unique to the service principal, used by Conditional Access policy to find the calling app.

### Microsoft Graph

Sample JSON for configuration using the Microsoft Graph beta endpoint.

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
 