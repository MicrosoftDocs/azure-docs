---
title: Filter for applications in Conditional Access policy (Preview)
description: Use filter for applications in Conditional Access to manage conditions.
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 07/18/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, oanae

ms.custom: subject-rbac-steps

ms.collection: M365-identity-device-management
---
# Conditional Access: Filter for applications (Preview)

Currently Conditional Access policies can be applied to all apps or to individual apps. Organizations with a large number of apps may find this process difficult to manage across multiple Conditional Access policies. 
 
Application filters are a new feature for Conditional Access that allows organizations to tag service principals with custom attributes. These custom attributes are then added to their Conditional Access policies. Filters for applications are evaluated at token issuance runtime, a common question is if apps are assigned at runtime or configuration time.
 
In this document, you create a custom attribute set, assign a custom security attribute to your application, and create a Conditional Access policy to secure the application. 

> [!IMPORTANT]
> Filter for applications is currently in public preview. For more information about previews, see [Universal License Terms For Online Services](https://www.microsoft.com/licensing/terms/product/ForOnlineServices/all).

## Assign roles

Custom security attributes are security sensitive and can only be managed by delegated users. Even global administrators don't have default permissions for custom security attributes. One or more of the following roles should be assigned to the users who manage or report on these attributes.

| Role name | Description |
| --- | --- |
| Attribute assignment administrator | Assign custom security attribute keys and values to supported Microsoft Entra objects. |
| Attribute assignment reader | Read custom security attribute keys and values for supported Microsoft Entra objects. |
| Attribute definition administrator | Define and manage the definition of custom security attributes. |
| Attribute definition reader | Read the definition of custom security attributes. |

1. Assign the appropriate role to the users who will manage or report on these attributes at the directory scope.

    For detailed steps, see [Assign Azure roles](../../role-based-access-control/role-assignments-portal.md).

## Create custom security attributes

Follow the instructions in the article, [Add or deactivate custom security attributes in Microsoft Entra ID (Preview)](../fundamentals/custom-security-attributes-add.md) to add the following **Attribute set** and **New attributes**. 

- Create an **Attribute set** named *ConditionalAccessTest*.
- Create **New attributes** named *policyRequirement* that **Allow multiple values to be assigned** and **Only allow predefined values to be assigned**. We add the following predefined values:
   - legacyAuthAllowed
   - blockGuesUsers
   - requireMFA
   - requireCompliantDevice
   - requireHybridJoinedDevice
   - requireCompliantApp

:::image type="content" source="media/concept-filter-for-applications/custom-attributes.png" alt-text="A screenshot showing custom security attribute and predefined values in Microsoft Entra ID." lightbox="media/concept-filter-for-applications/custom-attributes.png":::

> [!NOTE] 
> Conditional Access filters for devices only works with custom security attributes of type "string". Custom Security Attributes support creation of Boolean data type but Conditional Access Policy only supports "string".

## Create a Conditional Access policy

:::image type="content" source="media/concept-filter-for-applications/edit-filter-for-applications.png" alt-text="A screenshot showing a Conditional Access policy with the edit filter window showing an attribute of require MFA." lightbox="media/concept-filter-for-applications/edit-filter-for-applications.png":::

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Protection** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
   1. Select **Done**.
1. Under **Target resources**, select the following options:
   1. Select what this policy applies to **Cloud apps**.
   1. Include **Select apps**.
   1. Select **Edit filter**.
   1. Set **Configure** to **Yes**.
   1. Select the **Attribute** we created earlier called *policyRequirement*.
   1. Set **Operator** to **Contains**.
   1. Set **Value** to **requireMFA**.
   1. Select **Done**.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require multifactor authentication**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the settings using [report-only mode](howto-conditional-access-insights-reporting.md), they can move the **Enable policy** toggle from **Report-only** to **On**.

## Configure custom attributes

### Step 1: Set up a sample application

If you already have a test application that makes use of a service principal, you can skip this step.

Set up a sample application that, demonstrates how a job or a Windows service can run with an application identity, instead of a user's identity. Follow the instructions in the article [Quickstart: Get a token and call the Microsoft Graph API by using a console app's identity](../develop/quickstart-v2-netcore-daemon.md) to create this application.

### Step 2: Assign a custom security attribute to an application

When you don't have a service principal listed in your tenant, it can't be targeted. The Office 365 suite is an example of one such service principal.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. Select the service principal you want to apply a custom security attribute to.
1. Under **Manage** > **Custom security attributes (preview)**, select **Add assignment**.
1. Under **Attribute set**, select **ConditionalAccessTest**.
1. Under **Attribute name**, select **policyRequirement**.
1. Under **Assigned values**, select **Add values**, select **requireMFA** from the list, then select **Done**.
1. Select **Save**.

### Step 3: Test the policy

Sign in as a user who the policy would apply to and test to see that MFA is required when accessing the application.

## Other scenarios

- Blocking legacy authentication
- Blocking external access to applications
- Requiring compliant device or Intune app protection policies
- Enforcing sign in frequency controls for specific applications
- Requiring a privileged access workstation for specific applications
- Require session controls for high risk users and specific applications

## Next steps

[Conditional Access templates](concept-conditional-access-policy-common.md)

[Determine effect using Conditional Access report-only mode](howto-conditional-access-insights-reporting.md)

[Use report-only mode for Conditional Access to determine the results of new policy decisions.](concept-conditional-access-report-only.md)
