---
title: Best practices for conditional access in Azure Active Directory  | Microsoft Docs
description: Learn about things you should know and what it is you should avoid doing when configuring conditional access policies.
services: active-directory
keywords: conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.assetid: 8c1d978f-e80b-420e-853a-8bbddc4bcdad
ms.service: active-directory
ms.component: conditional-access
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 08/23/2018
ms.author: markvi
ms.reviewer: calebb

---
# Best practices for conditional access in Azure Active Directory

With [Azure Active Directory (Azure AD) conditional access](../active-directory-conditional-access-azure-portal.md), you can control how authorized users access your cloud apps. This article provides you with information about:

- Things you should know 
- What it is you should avoid doing when configuring conditional access policies. 

This article assumes that you familiar the concepts and the terminology outlined in [What is conditional access in Azure Active Directory?](../active-directory-conditional-access-azure-portal.md)



## What’s required to make a policy work?

When you create a new policy, there are no users, groups, apps, or access controls selected.

![Cloud apps](./media/best-practices/02.png)


To make your policy work, you must configure:


|What           | How                                  | Why|
|:--            | :--                                  | :-- |
|**Cloud apps** |You need to select one or more apps.  | The goal of a conditional access policy is to enable you to control how authorized users can access cloud apps.|
| **Users and groups** | You need to select at least one user or group that is authorized to access your selected cloud apps. | A conditional access policy that has no users and groups assigned, is never triggered. |
| **Access controls** | You need to select at least one access control. | If your conditions are satisfied, your policy processor needs to know what to do.|




## What you should know

### How are assignments evaluated?

All assignments are logically **ANDed**. If you have more than one assignment configured, all assignments must be satisfied to trigger a policy.  

If you need to configure a location condition that applies to all connections made from outside your organization's network:

- Include **All locations**
- Exclude **All trusted IPs**


### What to do if you are locked out of the Azure AD admin portal?

If you are locked out of the Azure AD portal due to an incorrect setting in a conditional access policy:

- Verify whether there are other administrators in your organization that are not blocked yet. An administrator with access to the Azure portal can disable the policy that is impacting your sign in. 

- If none of the administrators in your organization can update the policy, you need to submit a support request. Microsoft support can review and update conditional access policies that are preventing access.


### What happens if you have policies in the Azure classic portal and Azure portal configured?  

Both policies are enforced by Azure Active Directory and the user gets access only when all requirements are met.

### What happens if you have policies in the Intune Silverlight portal and the Azure portal?

Both policies are enforced by Azure Active Directory and the user gets access only when all requirements are met.

### What happens if I have multiple policies for the same user configured?  

For every sign-in, Azure Active Directory evaluates all policies and ensures that all requirements are met before granted access to the user. Block access trumps all other configuration settings. 


### Does conditional access work with Exchange ActiveSync?

Yes, you can use Exchange ActiveSync in a conditional access policy.






## What you should avoid doing

The conditional access framework provides you with a great configuration flexibility. However, great flexibility  also means that you should carefully review each configuration policy before releasing it to avoid undesirable results. In this context, you should pay special attention to assignments affecting complete sets such as **all users / groups / cloud apps**.

In your environment, you should avoid the following configurations:


**For all users, all cloud apps:**

- **Block access** - This configuration blocks your entire organization, which is definitely not a good idea.

- **Require compliant device** - For users that have not enrolled their devices yet, this policy blocks all access including access to the Intune portal. If you are an administrator without an enrolled device, this policy blocks you from getting back into the Azure portal to change the policy.

- **Require domain join** - This policy block access has also the potential to block access for all users in your organization if you don't have a domain-joined device yet.


**For all users, all cloud apps, all device platforms:**

- **Block access** - This configuration blocks your entire organization, which is definitely not a good idea.


## How should you deploy a new policy?

As a first step, you should evaluate your policy using the [what if tool](what-if-tool.md).

When you are ready to deploy a new policy into your environment, you should do this in phases:

1. Apply a policy to a small set of users and verify it behaves as expected. 

2.  When you expand a policy to include more users, continue to exclude all administrators from the policy. This ensures that administrators still have access and can update a policy if a change is required.

3. Apply a policy to all users only if this is really required. 

As a best practice, create a user account that is:

- Dedicated to policy administration 
- Excluded from all your policies


## Policy migration

Consider migrating the policies you have not created in the Azure portal because:

- You can now address scenarios you could not handle before.

- You can reduce the number of policies you have to manage by consolidating them.   

- You can manage all your conditional access policies in one central location.

- The Azure classic portal has been retired.   


For more information, see [Migrate classic policies in the Azure portal](policy-migration.md).


## Next steps

If you want to know how to configure a conditional access policy, see [Require MFA for specific apps with Azure Active Directory conditional access](app-based-mfa.md).
