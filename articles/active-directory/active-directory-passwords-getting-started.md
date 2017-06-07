---
title: 'Quick Start: Azure AD SSPR | Microsoft Docs'
description: Rapidly deploy Azure AD self-service password reset
services: active-directory
keywords: 
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
editor: gahug

ms.assetid: bde8799f-0b42-446a-ad95-7ebb374c3bec
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 05/12/2017
ms.author: joflore
ms.custom: it-pro

---
# Quick Start: Azure AD self-service password reset

## Rapidly deploy self-service password reset

Self-service password reset (SSPR) offers a simple means for IT administrators to empower users to reset or unlock their passwords or accounts. The system includes detailed reporting to track when users use the system along with notifications to alert you to misuse or abuse.

This guide assumes you already have a working trial or licensed Azure AD tenant. If you need help setting up Azure AD, see the article [Getting Started with Azure AD](https://azure.microsoft.com/trial/get-started-active-directory/).

1. From your existing Azure AD tenant, select **"Password reset"**

2. From the **"Properties"** screen, under the option "Self Service Password Reset Enabled" choose one of the following
    * Nobody - No one is able to use SSPR functionality
    * A group - Only members of a specific Azure AD group that you choose are able to use SSPR functionality
    * Everybody - All users with accounts in your Azure AD tenant are able to use SSPR functionality

3. From the **"Authentication methods"** screen choose
    * "Number of methods required to reset" - We support a minimum of one or a maximum of two
    * "Methods available to users" - We need at least one but it never hurts to have an extra choice available
        * **Email** sends an email with a code to the user's configured authentication email address
        * **Mobile Phone** gives the user the choice to receive a call or text with a code to their configured mobile phone number
        * **Office Phone** calls the user with a code to their configured office phone number
        * **Security Questions** requires you to choose
            * "Number of questions required to register" is the minimum for successful registration, meaning a user can choose to answer more to create a pool of questions to pull from. This option can be set from 3-5 and must be greater than or equal to the number of questions required to reset.
            * "Number of questions required to reset" can be set from 3-5 questions to be answered correctly before allowing a users password to be reset or unlocked.
                * Custom questions can be added by clicking the "Custom" button when selecting security questions

4. RECOMMENDED: **"Customization"** allows you to change the "Contact your administrator" link to point to a page or email address you define

5. OPTIONAL: The **"Registration"** screen provides administrators the options for:
    * "Require users to register when signing in"
    * "Number of days before users are asked to reconfirm their authentication information"

6. OPTIONAL: The **"Notification"**  provides administrators the options to:
    * Notify users on password resets
    * Notify all admins when other admins reset their password

**At this point, you have configured SSPR for your Azure AD tenant**. You can stop here or continue on to configure synchronization of passwords to an on-premises AD domain.

> [!NOTE]
> Test SSPR with a user and not an administrator as Microsoft enforces strong authentication requirements for Azure administrator type accounts. For more information regarding the administrator password policy, see our [password policy article](active-directory-passwords-policy.md#administrator-password-policy-differences).

## Configure synchronization to existing identity source

To enable on-premises identity synchronization to Azure AD, you need to install and configure [Azure AD Connect](./connect/active-directory-aadconnect.md) on a server in your organization. This application handles synchronizing users and groups from your existing identity source to your Azure AD Domain.

* [Upgrade from DirSync or Azure AD Sync to Azure AD Connect](./connect/active-directory-aadconnect-dirsync-deprecated.md)
* [Getting started with Azure AD Connect using express settings](./connect/active-directory-aadconnect-get-started-express.md)
* [Configure password writeback](active-directory-passwords-writeback.md#configuring-password-writeback) to write passwords from Azure AD back to your on-premises directory.

## Disabling self-service password reset

Disabling self-service password reset is as simple as opening your Azure AD tenant and going to **Password Reset**, **Properties**, and choosing **Nobody** under **Self Service Password Reset Enabled**

## Next steps
The following links provide additional information regarding password reset using Azure AD

* [**Licensing**](active-directory-passwords-licensing.md) - Configure your Azure AD Licensing
* [**Data**](active-directory-passwords-data.md) - Understand the data that is required and how it is used for password management
* [**Rollout**](active-directory-passwords-best-practices.md) - Plan and deploy SSPR to your users using the guidance found here
* [**Customize**](active-directory-passwords-customize.md) - Customize the look and feel of the SSPR experience for your company.
* [**Policy**](active-directory-passwords-policy.md) - Understand and set Azure AD password policies
* [**Reporting**](active-directory-passwords-reporting.md) - Discover if, when, and where your users are accessing SSPR functionality
* [**Technical Deep Dive**](active-directory-passwords-how-it-works.md) - Go behind the curtain to understand how it works
* [**Frequently Asked Questions**](active-directory-passwords-faq.md) - How? Why? What? Where? Who? When? - Answers to questions you always wanted to ask
* [**Troubleshoot**](active-directory-passwords-troubleshoot.md) - Learn how to resolve common issues that we see with SSPR
