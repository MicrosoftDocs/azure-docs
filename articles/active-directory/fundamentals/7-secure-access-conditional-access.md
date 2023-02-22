---
title: Manage external access to resources with Conditional Access 
description: Learn to use Conditional Access policies to secure external access to resources.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 02/22/2023
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Manage external access to resources with Conditional Access policies 

Conditional Access interprets signals, enforces policies, and determines if a user is granted access to resources. In this article, learn about applying Conditional Access policies to external users. The article assumes you might not have access to entitlement management, which can be used with Conditional Access. 

Learn more: 

* [What is Conditional Access?](../conditional-access/overview.md)
* [Plan a Conditional Access deployment](../conditional-access/plan-conditional-access.md)
* [What is entitlement management?](../governance/entitlement-management-overview.md)

The following diagram illustrates signals to Conditional Access that trigger access processes. 

   ![Diagram of Conditional Access signals and decisions.](media/secure-external-access//7-conditional-access-signals.png)

## Align a security plan with Conditional Access polices

In the third article, in the set of ten articles, there is guidance on creating a security plan. Use that plan to help create Conditional Access policies for external access. Part of the security plan includes:

* Grouped applications and resources for simplified access
* Sign-in requirements for external users

> [!IMPORTANT]
> Create internal and external user test accounts to test policies before applying them.

See article three, [Create a security plan for external access to resources](3-secure-access-plan.md)

## Conditional Access policies for external access

The following sections are best practices for governing external access with Conditional Access policies.

### Entitlement management or groups

If you can’t use connected organizations in entitlement management, create an Azure AD security group, or Microsoft 365 Group for partner organizations. Assign users from that partner to the group. You can use the groups in Conditional Access policies.

Learn more: 

* [What is entitlement management?](../governance/entitlement-management-overview.md)
* [Manage Azure Active Directory groups and group membership](how-to-manage-groups.md)
* [Overview of Microsoft 365 Groups for administrators](/microsoft-365/admin/create-groups/office-365-groups?view=o365-worldwide&preserve-view=true)


### Conditional Access policy creation

Create as few Conditional Access policies as possible. For applications that have the same access needs, add them all to the same policy.  

Conditional Access policies can apply to a maximum of 250 applications. If more than 250 Apps have the same access needs, create duplicate policies. Policy A will apply to apps 1-250, policy B will apply to apps 251-500, etc.

### Naming convention

Use a naming convention that clarifies policy purpose. External access examples are:

* ExternalAccess_actiontaken_AppGroup
* ExternalAccess_Block_FinanceApps

## Block external users from resources

You can block external users from accessing resources with Conditional Access policies. 

Sign in to the **Azure portal** as a Conditional Access Administrator, Security Administrator, or Global Administrator.
Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
Select **New policy**.
Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies, for example ExternalAccess_Block_FinanceApps.
Under **Assignments**, select **Users or workload identities**.
Under **Include**, select **All guests and external users**. 
Under **Exclude**, select **Users and groups** and choose your organization's [emergency access or break-glass accounts](../roles/security-emergency-access.md). 
Select **Done**.
Under **Cloud apps or actions** > **Include**, select **All cloud apps**.
Under **Exclude**, select any applications that shouldn’t be blocked.
Under **Access controls** > **Grant**, select **Block access**, and choose **Select**.
Confirm your settings and set **Enable policy** to **Report-only**.
Select **Create** to create to enable your policy.

After confirming your settings using [report-only mode](../conditional-access/howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

### Block external access to all except specific external users

There may be times you want to block external users except a specific group. For example, you may want to block all external users except those working for the finance team from the finance applications. To do this [Create a security group](active-directory-groups-create-azure-portal.md) to contain the external users who should access the finance applications:

Sign in to the **Azure portal** as a Conditional Access Administrator, Security Administrator, or Global Administrator.
Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
Select **New policy**.
Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies, for example ExternalAccess_Block_AllButFinance.
Under **Assignments**, select **Users or workload identities**.
Under **Include**, select **All guests and external users**. 
Under **Exclude**, select **Users and groups**, 
Choose your organization's [emergency access or break-glass accounts](../roles/security-emergency-access.md). 
Choose the security group of external users you want to exclude from being blocked from specific applications.
Select **Done**.
Under **Cloud apps or actions** > **Include**, select **All cloud apps**.
Under **Exclude**, select the finance applications that shouldn’t be blocked.
Under **Access controls** > **Grant**, select **Block access**, and choose **Select**.
Confirm your settings and set **Enable policy** to **Report-only**.
Select **Create** to create to enable your policy.

After confirming your settings using [report-only mode](../conditional-access/howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

### External partner access

Conditional Access policies that target external users may interfere with service provider access, for example granular delegated admin privileges [Introduction to granular delegated admin privileges (GDAP)](/partner-center/gdap-introduction).

## Implement Conditional Access

Many common Conditional Access policies are documented. See the article [Common Conditional Access policies](../conditional-access/concept-conditional-access-policy-common.md) for other common policies you may want to adapt for external users.

## Next steps

See the following articles on securing external access to resources. We recommend you take the actions in the listed order.

1. [Determine your desired security posture for external access](1-secure-access-posture.md)
1. [Discover your current state](2-secure-access-current-state.md)
1. [Create a governance plan](3-secure-access-plan.md)
1. [Use groups for security](4-secure-access-groups.md)
1. [Transition to Azure AD B2B](5-secure-access-b2b.md)
1. [Secure access with Entitlement Management](6-secure-access-entitlement-managment.md)
1. [Secure access with Conditional Access policies](7-secure-access-conditional-access.md) (You’re here)
1. [Secure access with Sensitivity labels](8-secure-access-sensitivity-labels.md)
1. [Secure access to Microsoft Teams, OneDrive, and SharePoint](9-secure-access-teams-sharepoint.md)
