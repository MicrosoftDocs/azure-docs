---
title: Controls in Azure Active Directory conditional access | Microsoft Docs
description: Learn how controls in Azure Active Directory conditional access work.
services: active-directory
keywords: conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.assetid: 8c1d978f-e80b-420e-853a-8bbddc4bcdad
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/29/2017
ms.author: markvi
ms.reviewer: calebb

---

# Azure Active Directory what if tool - preview

[Conditional access](active-directory-conditional-access-azure-portal.md) is a capability of Azure Active directory (Azure AD) that enables you to control how authorized users access your cloud apps. How do you know whether the conditional access policies in your environment works as expected? You can use the **conditional access what if policy evaluation tool** to answer this question.

This article explains how you can use this tool to test your conditional access policies.

## What it is

**The conditional access what if policy evaluation tool** allows you to understand the impact your conditional access policies have in your environment. Instead of test driving your policies by performing multiple sign-ins, this tool enables you to simulate the impact of your policies on sign-ins. 

The what if tool provides you with the ability to select the conditions that are satisfied by the sign-in in your simulation. When you run a simulation, the returned result displays a list of policies that satisfy these conditions. In the returned list of policies, you can also see the controls each policy would enforce. 

The tool does not only list Azure AD conditional access policies, but also classic policies that are affected, including a link to the classic policies user interface. You can use this information during a migration of classic policies.
 

## How it works

The condition options in the what if tool mimic the condition options in conditional access policy. The Conditions supplied in "What If" populate a NuGet package which Azure AD uses to perform policy evaluation. Those policies that have their Conditions satisfied appear in the Evaluation results and they indicate the Access Controls that are enforced. 

## Running the tool

You can find the **what if** tool on the **[Conditional access - Policies](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ConditionalAccessBlade/Policies)**  page in the Azure portal.

To start the tool, in the toolbar on top of the list of policies, click **What if**.

![What if](./media/active-directory-conditional-access-whatif/01.png)


## What you need to know

### User

You can only select one user. This is the only field you must set.

### Cloud apps

Select **All cloud apps** to see all policies applying to the specified user. This is the default setting.
You can narrow down the scope to policies affecting specific cloud apps by selecting them.

### Policies

The what if tool only evaluates conditional access policies that are enabled.


## Supported conditions

The **what if** tool supports the following conditions:

![What if](./media/active-directory-conditional-access-whatif/02.png)


- **IP address** - A single IPv4 address. This is be the Internet facing IPv4 address of the device the user signed in from. You can verify the IP address of a device by, for example, navigating to [What is my IP address](https://whatismyipaddress.com). 

- **[Device platforms](active-directory-conditional-access-azure-portal.md#device-platforms)** - This setting is the equivalent of **All platforms (including unsupported)**. It is important to remember browsers that were opened in private mode cannot satisfy device-based policy checks because the primary refresh token (PRT) is not forwarded in this mode.

- **[Client apps](active-directory-conditional-access-azure-portal.md#client-apps)** - By default, this setting causes an evaluation of all policies having **Browser** or **Mobile apps and desktop clients** individually or both selected. It also detects policies that enforce **Exchange ActiveSync (EAS)**. Selecting **Browser** evaluates all policies having at least **Browser** selected. Selecting **Mobile apps and desktop clients** evaluates all policies having at least **Mobile apps and desktop clients** selected. 

- **[Sign-in risk](active-directory-conditional-access-azure-portal.md#sign-in-risk)**   


## Evaluation 

You start an evaluation by clicking **What if**. The evaluation result provides you with a report that consists of: 

![What if](./media/active-directory-conditional-access-whatif/03.png)

- An indicator whether classic policies exist in your environment
- Policies that apply to your user
- Policies that don't apply to your user


If classic policies exists for the selected cloud apps, an indicator is presented to you. By clicking the indicator, you are redirected to the classic policies page. On the classic policies page, you can migrate a classic policy or just disable it. You can return to your evaluation result by closing this page.

On the list of policies that apply to your selected user, you can also find a list of grant controls and session controls your user must satisfy.

On the list of policies that don't apply to your user, you can and also find the reasons why these policies don't apply. For each listed policy, the reason represents the first condition that was not satisfied. A possible reason for a policy that is not applied is a disabled policy because they are not further evaluated.   



## Next steps

- If you want to know how to configure a conditional access policy, see [get started with conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal-get-started.md).

- If you are ready to configure conditional access policies for your environment, see the [best practices for conditional access in Azure Active Directory](active-directory-conditional-access-best-practices.md). 
