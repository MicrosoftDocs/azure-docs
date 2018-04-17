---
title: Add privacy info to the Azure AD Properties blade | Microsoft Docs
description: Explains how to add your organization's privacy info to the Azure Active Directory (Azure AD) Properties blade.
services: active-directory
documentationcenter: ''
author: eross-msft
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/17/2018
ms.author: lizross
ms.reviewer: bpham
ms.custom: it-pro
---

# How-to: Add privacy info to the Properties blade in Azure AD
This article explains how a tenant admin can add privacy-related info to an organization’s Azure Active Directory (Azure AD) tenant, by using the Azure portal.

We strongly recommend that you add your global privacy contact and your organization’s privacy statement so that both internal employees and external guests can review your policies. For info about what to include in your privacy statement, see the … article.

[!INCLUDE [active-directory-gdpr-note](../../includes/active-directory-gdpr-note.md)]

**To access the Properties blade and add your privacy info**

1.	Sign in to the Azure portal as a tenant administrator.

2.	On the left navbar, select **Azure Active Directory**, and then select **Properties**.

    The **Properties** blade appears.

    ![Azure AD Properties blade highlighting the privacy info area](/media/active-directory-properties-blade/properties-blade.png)

3.	Add your privacy info for your employees:

    - **Technical contact.** Type the email address for the person internal employees and external guests should contact for technical support within your organization.
	
    - **Global privacy contact.** Type the email address for the person internal employees and external guests should contact for inquiries about personal data privacy. This employee is also the person that Microsoft will contact in the event of a data breach. If there is no person listed here, Microsoft will contact your global administrators.

    - **Privacy statement URL.** Type the link to your organization’s document that describes how your organization handles both internal and external guests data privacy.

    >[!Important]
    >If you don’t include your own privacy statement, your internal employees and external guests will see text in the Review Permissions box that says, **<_your org name_> has not provided links to their terms for you to review**.

4.	Select **Save**.


