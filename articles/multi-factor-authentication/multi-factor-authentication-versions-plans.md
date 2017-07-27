---
title: Azure MFA versions and consumption plans | Microsoft Docs
description: Information about the Multi-factor Authentication client and the different methods and versions available. Details about each consumption plan
keywords: 
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila
editor: yossib

ms.assetid: 
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/26/2017
ms.author: kgremban
---
# How to get Azure Multi-Factor Authentication

When it comes to protecting your accounts, two-step verification should be standard across your organization. This feature is especially important for administrative accounts that have privileged access to resources. For this reason, Microsoft offers basic two-step verification features to Office 365 and Azure administrators. If you want to upgrade the features for your admins, or extend two-step verification to the rest of your users, you can purchase Azure Multi-Factor Authentication. 

This article covers explains the difference between the versions offered to administrators and the full Azure MFA version, and specifies which features are available in each. If you're ready to deploy the complete Azure MFA offering, the later sections covers implementation options and how Microsoft calculates consumption.

>[!IMPORTANT]
>This article is meant to be a guide to help you understand the different ways to buy Azure Multi-Factor Authentication. For specific details about pricing and billing, you should always refer to the [Multi-Factor Authentication pricing page](https://azure.microsoft.com/pricing/details/multi-factor-authentication/).

## Available versions of Azure Multi-Factor Authentication

The following table describes the differences between three versions of multi-factor authentication:

| Version | Description |
| --- | --- |
| Multi-Factor Authentication for Office 365 |This version works exclusively with Office 365 applications and is managed from the Office 365 portal. Administrators can [secure Office 365 resources with two-step verification](https://support.office.com/article/Set-up-multi-factor-authentication-for-Office-365-users-8f0454b2-f51a-4d9c-bcde-2c48e41621c6). This version is part of an Office 365 subscription. |
| Multi-Factor Authentication for Azure Administrators | Global administrators of Azure tenants can enable two-step verification for their global admin accounts at no additional cost.|
| Azure Multi-Factor Authentication | Often referred to as the "full" version, Azure Multi-Factor Authentication offers the richest set of capabilities. It provides additional configuration options via the [Azure classic portal](https://manage.windowsazure.com), advanced reporting, and support for a range of on-premises and cloud applications. Azure Multi-Factor Authentication is included in Azure Active Directory Premium (P1 and P2 plans) and Enterprise Mobility + Security (E3 and E5 plans), and can be deployed either [in the cloud or on premises](multi-factor-authentication-get-started.md). |

## Feature comparison of versions
The following table provides a list of the features that are available in the various versions of Azure Multi-Factor Authentication.

> [!NOTE]
> This comparison table discusses the features that are part of each version of Multi-Factor Authentication. If you have the full Azure Multi-Factor Authentication service, some features may not be available depending on whether you use [MFA in the cloud or MFA on-premises](multi-factor-authentication-get-started.md).


| Feature | Multi-Factor Authentication for Office 365 | Multi-Factor Authentication for Azure Administrators | Azure Multi-Factor Authentication |
| --- |:---:|:---:|:---:|
| Protect admin accounts with MFA |● |● (Global Administrator accounts only) |● |
| Mobile app as a second factor |● |● |● |
| Phone call as a second factor |● |● |● |
| SMS as a second factor |● |● |● |
| App passwords for clients that don't support MFA |● |● |● |
| Admin control over verification methods |● |● |● |
| PIN mode | | |● |
| Fraud alert | | |● |
| MFA Reports | | |● |
| One-Time Bypass | | |● |
| Custom greetings for phone calls | | |● |
| Custom caller ID for phone calls | | |● |
| Trusted IPs | | |● |
| Remember MFA for trusted devices |● |● |● |
| MFA SDK | | |● (Requires Multi-Factor Auth provider and full Azure subscription) |
| MFA for on-premises applications | | |● |

## How to get Azure Multi-Factor Authentication
If you would like the full functionality offered by Azure Multi-Factor Authentication, there are several options:

### Option 1 - MFA licenses

Purchase Azure Multi-Factor Authentication licenses and assign them to your users in Azure Active Directory. 

If you use this option, you should create an Azure Multi-Factor Authentication Provider only if you also need to provide two-step verification for some users that don't have licenses. Otherwise, you might be billed twice.

### Option 2 - Bundled licenses that include MFA

Purchase licenses that include Azure Multi-Factor Authentication, like Azure Active Directory Premium (P1 or P2) or Enterprise Mobility + Security (E3 or E5), and assign them to your users in Azure Active Directory. 

If you use this option, you should create an Azure Multi-Factor Authentication Provider only if you also need to provide two-step verification for some users that don't have licenses. Otherwise, you might be billed twice. 

### Option 3 - MFA consumption-based model

Create an Azure Multi-Factor Authentication Provider within an Azure subscription. Azure MFA Providers are Azure resources that are billed against your Enterprise Agreement, Azure monetary commitment, or credit card like all other Azure resources. These providers can only be created in full Azure subscriptions, not limited Azure subscriptions that have a $0 spending limit. Limited subscriptions are created when you activate licenses, like in options 1 and 2. 

When using an Azure Multi-Factor Authentication Provider, there are two usage models available that are billed through your Azure subscription:  

1. **Per User** - For enterprises that want to enable two-step verification for a fixed number of employees who regularly need authentication. Per-user billing is based on the number of users enabled for MFA in your Azure AD tenant and/or your Azure MFA Server. If users are enabled for MFA in both Azure AD and Azure MFA Server, and domain sync (Azure AD Connect) is enabled, then we count the larger set of users. If domain sync isn't enabled, then we count the sum of all users enabled for MFA in Azure AD and Azure MFA Server. Billing is prorated and reported to the Commerce system daily. 

  > [!NOTE]
  > Billing example 1: 
  > You have 5,000 users enabled for MFA today. The MFA system divides that number by 31, and reports 161.29 users for that day. Tomorrow you enable 15 more users, so the MFA system reports 161.77 users for that day. By the end of the billing cycle, the total number of users billed against your Azure subscription adds up to around 5,000. 
  >
  > Billing example 2:
  > You have a mixture of users with licenses and users without, so you have a per-user Azure MFA Provider to make up the difference. There are 4,500 Enterprise Mobility + Security licenses on your tenant, but 5,000 users enabled for MFA. Your Azure subscription is billed for 500 users, prorated and reported daily as 16.13 users. 

2. **Per Authentication** - For enterprises that want to enable two-step verification for a large group of users who infrequently need authentication. Billing is based on the number of two-step verification requests received by the Azure MFA cloud service, regardless of whether those verifications succeed or are denied. This billing appears on your Azure usage statement in packs of 10 authentications, and is reported to the Commerce system daily. 

  > [!NOTE]
  > Billing example 3:
  > Today, the Azure MFA service received 3,105 two-step verification requests. Your Azure subscription is billed for 310.5 authentication packs. 

It's important to note that you can have Azure MFA licenses, but still get billed for consumption-based configuration. If you set up a per-authentication Azure MFA Provider, you are billed for every two-step verification request, even those done by users who have licenses. If you set up a per-user Azure MFA Provider on a domain that isn't linked to your Azure AD tenant, you are billed per enabled user even if your users have licenses on Azure AD. 

## Next steps

- For more pricing details, see [Azure MFA Pricing](https://azure.microsoft.com/pricing/details/multi-factor-authentication/).

- Choose whether to deploy Azure MFA [in the cloud or on-premises](multi-factor-authentication-get-started.md)