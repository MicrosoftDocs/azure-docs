---
title: Azure Active Directory Conditional Access FAQs | Microsoft Docs
description: Get answers to frequently asked questions about Conditional Access in Azure Active Directory.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: article
ms.date: 05/28/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Azure Active Directory Conditional Access FAQs

## Which applications work with Conditional Access policies?

For information about applications that work with Conditional Access policies, see [Applications and browsers that use Conditional Access rules in Azure Active Directory](concept-conditional-access-cloud-apps.md).

## Are Conditional Access policies enforced for B2B collaboration and guest users?

Policies are enforced for business-to-business (B2B) collaboration users. However, in some cases, a user might not be able to satisfy the policy requirements. For example, a guest user's organization might not support multi-factor authentication. 

## Does a SharePoint Online policy also apply to OneDrive for Business?

Yes. A SharePoint Online policy also applies to OneDrive for Business. For more information, see the article, [Conditional Access service dependencies](service-dependencies.md) and consider targeting policies to the [Office 365 app](concept-conditional-access-cloud-apps.md#office-365-preview) instead.

## Why can’t I set a policy directly on client apps, like Word or Outlook?

A Conditional Access policy sets requirements for accessing a service. It's enforced when authentication to that service occurs. The policy is not set directly on a client application. Instead, it is applied when a client calls a service. For example, a policy set on SharePoint applies to clients calling SharePoint. A policy set on Exchange applies to Outlook. For more information, see the article, [Conditional Access service dependencies](service-dependencies.md) and consider targeting policies to the [Office 365 app](concept-conditional-access-cloud-apps.md#office-365-preview) instead.

## Does a Conditional Access policy apply to service accounts?

Conditional Access policies apply to all user accounts. This includes user accounts that are used as service accounts. Often, a service account that runs unattended can't satisfy the requirements of a Conditional Access policy. For example, multi-factor authentication might be required. Service accounts can be excluded from a policy by using a [user or group exclusion](concept-conditional-access-users-groups.md#exclude-users). 

## What is the default exclusion policy for unsupported device platforms?

Currently, Conditional Access policies are selectively enforced on users of iOS and Android devices. Applications on other device platforms are, by default, not affected by the Conditional Access policy for iOS and Android devices. A tenant admin can choose to override the global policy to disallow access to users on platforms that are not supported.

## How do Conditional Access policies work for Microsoft Teams?

Microsoft Teams relies heavily on Exchange Online and SharePoint Online for core productivity scenarios, like meetings, calendars, and file sharing. Conditional Access policies that are set for these cloud apps apply to Microsoft Teams when a user signs directly into Microsoft Teams.

Microsoft Teams also is supported separately as a cloud app in Conditional Access policies. Conditional Access policies that are set for a cloud app apply to Microsoft Teams when a user signs in. However, without the correct policies on other apps like Exchange Online and SharePoint Online users may still be able to access those resources directly.

Microsoft Teams desktop clients for Windows and Mac support modern authentication. Modern authentication brings sign-in based on the Azure Active Directory Authentication Library (ADAL) to Microsoft Office client applications across platforms.

For more information, see the article, [Conditional Access service dependencies](service-dependencies.md) and consider targeting policies to the [Office 365 app](concept-conditional-access-cloud-apps.md#office-365-preview) instead.

## Next steps

- To configure Conditional Access policies for your environment, see the [Best practices for Conditional Access in Azure Active Directory](best-practices.md). 
