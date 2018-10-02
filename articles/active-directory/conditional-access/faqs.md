---
title: Azure Active Directory conditional access FAQs | Microsoft Docs
description: Get answers to frequently asked questions about conditional access in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman

ms.assetid: 14f7fc83-f4bb-41bf-b6f1-a9bb97717c34
ms.service: active-directory
ms.component: conditional-access
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/15/2018
ms.author: markvi
ms.reviewer: calebb

---
# Azure Active Directory conditional access FAQs

## Which applications work with conditional access policies?

For information about applications that work with conditional access policies, see [Applications and browsers that use conditional access rules in Azure Active Directory](technical-reference.md).

## Are conditional access policies enforced for B2B collaboration and guest users?

Policies are enforced for business-to-business (B2B) collaboration users. However, in some cases, a user might not be able to satisfy the policy requirements. For example, a guest user's organization might not support multi-factor authentication. 



## Does a SharePoint Online policy also apply to OneDrive for Business?

Yes. A SharePoint Online policy also applies to OneDrive for Business.


## Why can’t I set a policy on client apps, like Word or Outlook?

A conditional access policy sets requirements for accessing a service. It's enforced when authentication to that service occurs. The policy is not set directly on a client application. Instead, it is applied when a client calls a service. For example, a policy set on SharePoint applies to clients calling SharePoint. A policy set on Exchange applies to Outlook.

## Does a conditional access policy apply to service accounts?

Conditional access policies apply to all user accounts. This includes user accounts that are used as service accounts. Often, a service account that runs unattended can't satisfy the requirements of a conditional access policy. For example, multi-factor authentication might be required. Service accounts can be excluded from a policy by using conditional access policy management settings. 

## Are Graph APIs available for configuring conditional access policies?

Currently, no. 

## What is the default exclusion policy for unsupported device platforms?

Currently, conditional access policies are selectively enforced on users of iOS and Android devices. Applications on other device platforms are, by default, not affected by the conditional access policy for iOS and Android devices. A tenant admin can choose to override the global policy to disallow access to users on platforms that are not supported.


## How do conditional access policies work for Microsoft Teams?

Microsoft Teams relies heavily on Exchange Online and SharePoint Online for core productivity scenarios, like meetings, calendars, and file sharing. Conditional access policies that are set for these cloud apps apply to Microsoft Teams when a user signs directly into Microsoft Teams.

Microsoft Teams also is supported separately as a cloud app in Azure Active Directory conditional access policies. Conditional access policies that are set for a cloud app apply to Microsoft Teams when a user signs in. However, without the correct policies on other apps like Exchange Online and SharePoint Online users may still be able to access those resources directly.

Microsoft Teams desktop clients for Windows and Mac support modern authentication. Modern authentication brings sign-in based on the Azure Active Directory Authentication Library (ADAL) to Microsoft Office client applications across platforms.