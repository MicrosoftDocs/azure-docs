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

[Conditional access](active-directory-conditional-access-azure-portal.md) is a capability of Azure Active directory (Azure AD) that enables you to control how authorized users access your cloud apps. How do you know whether the conditional access policies in your environment work as expected? To answer this question, you can use the **conditional access what if policy evaluation tool**.

This article explains how you can use this tool to test your conditional access policies.

## What it is

The **conditional access what if policy evaluation tool** allows you to understand the impact your conditional access policies have in your environment. Instead of test driving your policies by performing multiple sign-ins manually, this tool enables you to evaluate a simulated sign-in of a user. The simulation determines the impact this sign-in has on your policies and generates a simulation report. The report does not only cover conditional access policies but also [classic policies](active-directory-conditional-access-migration.md#classic-policies) if they exist.    

## How it works

In the **conditional access what if policy evaluation tool**, you first need to configure the settings of a sign-in scenario you want to simulate. These settings include:

- The user you want to test drive

- The cloud apps the user would attempt to access

- The conditions under which access to the configures cloud apps is performed
     
As a next step, you can initiate a simulation run that evaluates the impact of your settings. The configured settings populate a [NuGet package](https://docs.microsoft.com/nuget/what-is-nuget) Azure AD uses to perform a policy evaluation. Only policies that are enabled are part of an evaluation run.


When the evaluation has finished, the tool generates a report of the evaluation results.


## Running the tool

You can find the **what if** tool on the **[Conditional access - Policies](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ConditionalAccessBlade/Policies)**  page in the Azure portal.

To start the tool, in the toolbar on top of the list of policies, click **What if**.

![What if](./media/active-directory-conditional-access-whatif/01.png)

Before you can run an evaluation, you must configure the settings.

## Settings

This section provides you with information about the settings of simulation run.

![What if](./media/active-directory-conditional-access-whatif/02.png)


### User

You can only select one user. This is the only field you must set.

### Cloud apps

The default for this setting is **All cloud apps**. The default setting performs an evaluation of all available policies in your environment. You can narrow down the scope to policies affecting specific cloud apps.


### IP address

The IP address is a single IPv4 address to mimic the [location condition](active-directory-conditional-access-azure-portal.md#locations). The address represents Internet facing address of the device used by your user to sign in. You can verify the IP address of a device by, for example, navigating to [What is my IP address](https://whatismyipaddress.com).    

### Device platforms

This setting mimics the [device platforms condition](active-directory-conditional-access-azure-portal.md#device-platforms) and represents the equivalent of **All platforms (including unsupported)**. It is important to remember that browsers that were opened in private mode cannot satisfy [device-based](active-directory-conditional-access-policy-connected-applications.md) policy checks because the primary refresh token (PRT) is not forwarded in this mode.

### Client apps

This setting mimics the [client apps condition](active-directory-conditional-access-azure-portal.md#client-apps).
By default, this setting causes an evaluation of all policies having **Browser** or **Mobile apps and desktop clients** either individually or both selected. It also detects policies that enforce **Exchange ActiveSync (EAS)**. 

Selecting **Browser** evaluates all policies having at least **Browser** selected. Selecting **Mobile apps and desktop clients** evaluates all policies having at least **Mobile apps and desktop clients** selected. 


### Sign-in risk

This setting mimics the [sign-in risk condition](active-directory-conditional-access-azure-portal.md#sign-in-risk).   


## Evaluation 

You start an evaluation by clicking **What if**. The evaluation result provides you with a report that consists of: 

![What if](./media/active-directory-conditional-access-whatif/03.png)

- An indicator whether classic policies exist in your environment
- Policies that apply to your user
- Policies that don't apply to your user


If classic policies exists for the selected cloud apps, an indicator is presented to you. By clicking the indicator, you are redirected to the classic policies page. On the classic policies page, you can migrate a classic policy or just disable it. You can return to your evaluation result by closing this page.

On the list of policies that apply to your selected user, you can also find a list of [grant controls](active-directory-conditional-access-controls.md#grant-controls) and [session](active-directory-conditional-access-controls.md#session-controls) controls your user must satisfy.

On the list of policies that don't apply to your user, you can and also find the reasons why these policies don't apply. For each listed policy, the reason represents the first condition that was not satisfied. A possible reason for a policy that is not applied is a disabled policy because they are not further evaluated.   



## Next steps

- If you want to know how to configure a conditional access policy, see [get started with conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal-get-started.md).

- If you are ready to configure conditional access policies for your environment, see the [best practices for conditional access in Azure Active Directory](active-directory-conditional-access-best-practices.md). 

- if you want to migrate classic policies, see [Migrate classic policies in the Azure portal](active-directory-conditional-access-migration.md)  
