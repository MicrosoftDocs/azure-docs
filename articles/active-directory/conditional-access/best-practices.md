---
title: Best practices for Conditional Access in Azure Active Directory  | Microsoft Docs
description: Learn about things you should know and what it is you should avoid doing when configuring Conditional Access policies.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: article
ms.date: 01/25/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

ms.collection: M365-identity-device-management
---
# Best practices for Conditional Access in Azure Active Directory

With [Azure Active Directory (Azure AD) Conditional Access](../active-directory-conditional-access-azure-portal.md), you can control how authorized users access your cloud apps. This article provides you with information about:

- Things you should know 
- What it is you should avoid doing when configuring Conditional Access policies. 

This article assumes that you are familiar with the concepts and the terminology outlined in [What is Conditional Access in Azure Active Directory?](../active-directory-conditional-access-azure-portal.md)

## What's required to make a policy work?

When you create a new policy, there are no users, groups, apps, or access controls selected.

![Cloud apps](./media/best-practices/02.png)

To make your policy work, you must configure:

| What           | How                                  | Why |
| :--            | :--                                  | :-- |
| **Cloud apps** |Select one or more apps.  | The goal of a Conditional Access policy is to enable you to control how authorized users can access cloud apps.|
| **Users and groups** | Select at least one user or group that is authorized to access your selected cloud apps. | A Conditional Access policy that has no users and groups assigned, is never triggered. |
| **Access controls** | Select at least one access control. | If your conditions are satisfied, your policy processor needs to know what to do. |

## What you should know

### How are Conditional Access policies applied?

More than one Conditional Access policy may apply when you access a cloud app. In this case, all policies that apply must be satisfied. For example, if one policy requires multi-factor authentication (MFA) and another requires a compliant device, you must complete MFA, and use a compliant device. 

All policies are enforced in two phases:

- Phase 1: 
   - Detail collection: Gather details to identify policies that would already be satisfied.
   - During this phase, users may see a certificate prompt if device compliance is part of your Conditional Access policies. This prompt may occur for browser apps when the device operating system is not Windows 10.
   - Phase 1 of policy evaluation occurs for all enabled policies and policies in [report-only mode](concept-conditional-access-report-only.md).
- Phase 2:
   - Enforcement: Taking in to account the details gathered in phase 1, request user to satisfy any additional requirements that have not been met.
   - Apply results to session. 
   - Phase 2 of policy evaluation occurs for all enabled policies.

### How are assignments evaluated?

All assignments are logically **ANDed**. If you have more than one assignment configured, all assignments must be satisfied to trigger a policy.  

If you need to configure a location condition that applies to all connections made from outside your organization's network:

- Include **All locations**
- Exclude **All trusted IPs**

### What to do if you are locked out of the Azure AD admin portal?

If you are locked out of the Azure AD portal due to an incorrect setting in a Conditional Access policy:

- Check is there are other administrators in your organization that aren't blocked yet. An administrator with access to the Azure portal can disable the policy that is impacting your sign in. 
- If none of the administrators in your organization can update the policy, you need to submit a support request. Microsoft support can review and update Conditional Access policies that are preventing access.

### What happens if you have policies in the Azure classic portal and Azure portal configured?  

Both policies are enforced by Azure Active Directory and the user gets access only when all requirements are met.

### What happens if you have policies in the Intune Silverlight portal and the Azure portal?

Both policies are enforced by Azure Active Directory and the user gets access only when all requirements are met.

### What happens if I have multiple policies for the same user configured?  

For every sign-in, Azure Active Directory evaluates all policies and ensures that all requirements are met before granted access to the user. Block access trumps all other configuration settings. 

### Does Conditional Access work with Exchange ActiveSync?

Yes, you can use Exchange ActiveSync in a Conditional Access policy.

Some cloud apps like SharePoint Online and Exchange Online also support legacy authentication protocols. When a client app can use a legacy authentication protocol to access a cloud app, Azure AD cannot enforce a Conditional Access policy on this access attempt. To prevent a client app from bypassing the enforcement of policies, you should check whether it is possible to only enable modern authentication on the affected cloud apps.

### How should you configure Conditional Access with Office 365 apps?

Because Office 365 apps are interconnected, we recommend assigning commonly used apps together when creating policies.

Common interconnected applications include Microsoft Flow, Microsoft Planner, Microsoft Teams, Office 365 Exchange Online, Office 365 SharePoint Online, and Office 365 Yammer.

It is important for policies that require user interactions, like multi-factor authentication, when access is controlled at the beginning of a session or task. If you don't, users won't be able to complete some tasks within an app. For example, if you require multi-factor authentication on unmanaged devices to access SharePoint but not to email, users working in their email won't be able to attach SharePoint files to a message. More information can be found in the article, [What are service dependencies in Azure Active Directory Conditional Access?](service-dependencies.md).

## What you should avoid doing

The Conditional Access framework provides you with a great configuration flexibility. However, great flexibility  also means that you should carefully review each configuration policy before releasing it to avoid undesirable results. In this context, you should pay special attention to assignments affecting complete sets such as **all users / groups / cloud apps**.

In your environment, you should avoid the following configurations:

**For all users, all cloud apps:**

- **Block access** - This configuration blocks your entire organization, which is definitely not a good idea.
- **Require compliant device** - For users that have not enrolled their devices yet, this policy blocks all access including access to the Intune portal. If you are an administrator without an enrolled device, this policy blocks you from getting back into the Azure portal to change the policy.
- **Require domain join** - This policy block access has also the potential to block access for all users in your organization if you don't have a domain-joined device yet.
- **Require app protection policy** - This policy block access has also the potential to block access for all users in your organization if you don't have an Intune policy. If you are an administrator without a client application that has an Intune app protection policy, this policy blocks you from getting back into portals such as Intune and Azure.

**For all users, all cloud apps, all device platforms:**

- **Block access** - This configuration blocks your entire organization, which is definitely not a good idea.

## How should you deploy a new policy?

As a first step, you should evaluate your policy using the [what if tool](what-if-tool.md).

When new policies are ready for your environment, deploy them in phases:

1. Apply a policy to a small set of users and verify it behaves as expected. 
1. When you expand a policy to include more users. Continue to exclude all administrators from the policy to ensure that they still have access and can update a policy if a change is required.
1. Apply a policy to all users only if necessary. 

As a best practice, create a user account that is:

- Dedicated to policy administration 
- Excluded from all your policies

## Policy migration

Consider migrating the policies you have not created in the Azure portal because:

- You can now address scenarios you could not handle before.
- You can reduce the number of policies you have to manage by consolidating them.   
- You can manage all your Conditional Access policies in one central location.
- The Azure classic portal has been retired.   

For more information, see [Migrate classic policies in the Azure portal](policy-migration.md).

## Next steps

If you want to know:

- How to configure a Conditional Access policy, see [Require MFA for specific apps with Azure Active Directory Conditional Access](app-based-mfa.md).
- How to plan your Conditional Access policies, see [How to plan your Conditional Access deployment in Azure Active Directory](plan-conditional-access.md).
