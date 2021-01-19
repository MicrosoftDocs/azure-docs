---
title: Manage external access with Azure Active Directory Conditional Access 
description: How to use Azure Active Directory conditional Access policies to secure external access to resources.
services: active-directory
author: BarbaraSelden
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 12/18/2020
ms.author: baselden
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Manage external access with Conditional Access policies 

[Conditional Access](../conditional-access/overview.md) is the tool Azure AD uses to bring together signals, enforce policies, and determine whether a user should be allowed access to resources. For detailed information on how to create and use Conditional Access policies (Conditional Access policies), see [Plan a Conditional Access deployment](../conditional-access/plan-conditional-access.md). 

![Diagram of Conditional Access signals and decisions](media/secure-external-access//7-conditional-access-signals.png)



This article discusses applying Conditional Access policies to external users and assumes you don't have access to [Entitlement Management](../governance/entitlement-management-overview.md) functionality. Conditional Access policies can be and are used alongside Entitlement Management.

Earlier in this document set, you [created a security plan](3-secure-access-plan.md) that outlined:

* Applications and resources have the same security requirements and can be grouped for access.

* Sign-in requirements for external users.

You will use that plan to create your Conditional Access policies for external access. 

> [!IMPORTANT]
> Create a few external user test accounts so that you can test the policies you create before applying them to all external users.

## Conditional Access policies for external access

The following are best practices related to governing external access with Conditional Access policies.

* If you can't use connected organizations in Entitlement Management, create an Azure AD security group or Microsoft 365 group for each partner organization you work with. Assign all users from that partner to the group. You may then use those groups in Conditional Access policies.

* Create as few Conditional Access policies as possible. For applications that have the same access needs, add them all to the same policy.  
‎ 
   > [!NOTE]
   > Conditional Access policies can apply to a maximum of 250 applications. If more than 250 Apps have the same access needs, create duplicate policies. Policy A will apply to apps 1-250, policy B will apply to apps 251-500, etc.

* Clearly name policies specific to external access with a naming convention. One naming convention is ‎*ExternalAccess_actiontaken_AppGroup*. For example ExternalAccess_Block_FinanceApps.

## Block all external users from resources

You can block external users from accessing specific sets of resources with Conditional Access policies. Once you've determined the set of resources to which you want to block access, create a policy.

To create a policy that blocks access for external users to a set of applications:

1. Access the **Azure portal**, select **Azure Active Directory**, select**Security**, then select **Conditional Access**.

2. Select **New Policy**, and enter a **name**, for example ExternalAccess_Block_FinanceApps

3. Select **Users and group**s. On the Include tab, choose **Select users and groups**, then select **All guests and external users**. 

4. Select **Exclude** and enter your Administrator group(s) and any emergency access (break-glass) accounts.

5. Select **Cloud apps or actions**, choose **Select Apps**, select all of the apps to which you want to block external access, then choose **Select**.

6. Select **Conditions**, select **Locations**, under Configure select **Yes**, and select **Any location**.

7. Under Access controls, select **Grant**, change the toggle to **Block**, and choose **Select**.

8. Ensure that the Enable policy setting is set to **Report only**, then select **Create**.

## Block external access to all except specific external users

There may be times you want to block external users except a specific group. For example, you may want to block all external users except those working for the finance team from the finance applications. To do this:

1. Create a security group to hold the external users who should access the finance group.

2. Follow steps 1-3 in block external access from resources above.

3. In step 4, add the security group you want to exclude from being blocked from the finance apps.

4. Perform the rest of the steps.

## Implement Conditional Access

Many common Conditional Access policies are documented. See the following which you can adapt for external users.

* [Require Multi-Factor Authentication for all users](../conditional-access/howto-conditional-access-policy-all-users-mfa.md)

* [User risk-based Conditional Access](../conditional-access/howto-conditional-access-policy-risk-user.md)

* [Require Multi-Factor Authentication for access from untrusted networks](../conditional-access/untrusted-networks.md) 

* [Require Terms of Use](../conditional-access/terms-of-use.md)

## Next steps

See the following articles on securing external access to resources. We recommend you take the actions in the listed order.

1. [Determine your desired security posture for external access](1-secure-access-posture.md)

2. [Discover your current state](2-secure-access-current-state.md)

3. [Create a governance plan](3-secure-access-plan.md)

4. [Use groups for security](4-secure-access-groups.md)

5. [Transition to Azure AD B2B](5-secure-access-b2b.md)

6. [Secure access with Entitlement Management](6-secure-access-entitlement-managment.md)

7. [Secure access with Conditional Access policies](7-secure-access-conditional-access.md) (You are here)

8. [Secure access with Sensitivity labels](8-secure-access-sensitivity-labels.md)

9. [Secure access to Microsoft Teams, OneDrive, and SharePoint](9-secure-access-teams-sharepoint.md)
