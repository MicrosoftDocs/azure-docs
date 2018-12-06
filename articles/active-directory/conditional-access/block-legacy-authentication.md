---
title: How to block legacy authentication to Azure Active Directory (Azure AD) with conditional access| Microsoft Docs
description: Learn how to configure a conditional access policy in Azure Active Directory (Azure AD) for access attempts from untrusted networks.
services: active-directory
keywords: conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.component: conditional-access
ms.assetid: 8c1d978f-e80b-420e-853a-8bbddc4bcdad
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/06/2018
ms.author: markvi
ms.reviewer: calebb

---
# How to: Block legacy authentication to Azure AD with conditional access   

To give your users easy access to your cloud apps, Azure Active Directory (Azure AD) supports a broad variety of authentication protocols including legacy authentication. However, legacy protocols don’t support multi-factor authentication (MFA). MFA is in many environments a common requirement to address identity theft. 

If your environment is ready to block legacy authentication to improve your tenant's protection, you can accomplish this goal with conditional access. This article explains how you can configure conditional access policies that block legacy authentication for your tenant.



## Prerequisites

This article assumes that you are familiar with: 

- The [basic concepts](overview.md) of Azure AD conditional access 
- The [best practices](best-practices.md) for configuring conditional access policies in the Azure portal



## Scenario description

Azure AD supports several of the most widely used authentication and authorization protocols including legacy authentication. Legacy authentication refers to protocols that use basic authentication. Typically, these protocols can't enforce any type of second factor authentication. Examples for apps that are based on legacy authentication are:

- Older Microsoft Office apps

- Apps using mail protocols like POP, IMAP, and SMTP

Single factor authentication (for example, username and password) is not enough these days. Passwords are bad as they are easy to guess and we (humans) are bad at choosing good passwords. Passwords are also vulnerable to a variety of attacks like phishing and password spray. One of the easiest things you can do to protect against password threats is to implement MFA. With MFA, even if an attacker gets in possession of a user's password, the password alone is not sufficient to successfully authenticate and access the data.

How can you prevent apps using legacy authentication from accessing your tenant's resources? The recommendation is to just block them with a conditional access policy. If necessary, you allow only certain users and specific network locations to use apps that are based on legacy authentication.




## Implementation

This section explains how to configure a conditional access policy to block legacy authentication. 

### Block legacy authentication 

In a conditional access policy, you can set a condition that is tied to the client apps that are used to access your resources. The client apps condition enables you to narrow down the scope to apps using legacy authentication by selecting **Other clients** for **Mobile apps and desktop clients**.

![Other clients](./media/block-legacy-authentication/01.png)

To block access for these apps, you need to select **Block access**.

![Block access](./media/block-legacy-authentication/02.png)


### Select users and cloud apps

If you want to block legacy authentication for your organization, you probably think that you can accomplish this by selecting:

- All users

- All cloud apps

- Block access
 

![Assignments](./media/block-legacy-authentication/03.png)



Azure has a safety feature that prevents you from creating a policy like this because this configuration violates the  [best practices](best-practices.md) for conditional access policies.
 
![Policy configuration not supported](./media/block-legacy-authentication/04.png)


The safety feature is necessary because *block all users and all cloud apps* has the potential to block your entire organization from signing on to your tenant. You must exclude at least one user to satisfy the minimal best practice requirement. You could also 

![Policy configuration not supported](./media/block-legacy-authentication/05.png)


You can satisfy this safety feature by excluding one user from your policy. Ideally, you should define a few [emergency-access administrative accounts in Azure AD](../users-groups-roles/directory-emergency-access.md) and exclude them from your policy.
 

## Policy deployment

Before you put your policy into production, take care of:
 
- **Service accounts** - Identify user accounts that are used as service accounts or by devices, like conference room phones. Make sure these accounts have strong passwords and add them to an excluded group.
 
- **Sign-in reports** - Review the sign-in report and look for **other client** traffic. Identify top usage and investigate why it is in use. Usually, the traffic is generated by older Office clients that do not use modern authentication, or some third-party mail apps. Make a plan to move usage away from these apps, or if the impact is low, notify your users that they can't use these apps anymore.
 
For more information, see [How should you deploy a new policy?](best-practices.md#how-should-you-deploy-a-new-policy).



## What you should know

Configuring a policy for **Other clients** blocks the entire organization from certain clients like SPConnect. This block happens because older clients authenticate in unexpected ways. The issue doesn't apply to major Office applications like the older Office clients.

It can take up to 24 hours for the policy to go into effect.

You can select all available grant controls for the other clients condition; however, the end-user experience is always the same - blocked access.

You can configure all other conditions next to the other clients condition.




## Next steps

If you are not familiar with configuring conditional access policies yet, see [require MFA for specific apps with Azure Active Directory conditional access](app-based-mfa.md) for an example.
