---
title: Add privacy info to the Azure AD Properties area | Microsoft Docs
description: Explains how to add your organization's privacy info to the Azure Active Directory (Azure AD) Properties area.
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

# How-to: Add privacy info to the Properties area in Azure Active Directory
This article explains how a tenant admin can add privacy-related info to an organization’s Azure Active Directory (Azure AD) tenant, through the Azure portal.

We strongly recommend you add both your global privacy contact and your organization’s privacy statement, so your internal employees and external guests can review your policies. For info about what to include in your privacy statement, see the <!--need link from Gregg Brown (CELA)--> article. 

[!INCLUDE [gdpr-intro-sentence](../../includes/gdpr-intro-sentence.md)]

**To access the Properties area to add your privacy info**

1.	Sign in to the Azure portal as a tenant administrator.

2.	On the left navbar, select **Azure Active Directory**, and then select **Properties**.

    The **Properties** area appears.

    ![Azure AD Properties area highlighting the privacy info area](./media/active-directory-properties-area/properties-area.png)

3.	Add your privacy info for your employees:

    - **Technical contact.** Type the email address for the person internal employees and external guests should contact for technical support within your organization.
	
    - **Global privacy contact.** Type the email address for the person who internal employees and external guests should contact for inquiries about personal data privacy. This person is also who Microsoft contacts if there's a data breach. If there's no person listed here, Microsoft contacts your global administrators.

    - **Privacy statement URL.** Type the link to your organization’s document that describes how your organization handles both internal and external guest's data privacy.

        >[!Important]
        >If you don’t include your own privacy statement, your internal employees and external guests see text in the **Review Permissions** box that says, **<_your org name_> has not provided links to their terms for you to review**.

4.	Select **Save**.

## See also

- [Info about Data Protection Impact Assessments (DPIAs)](https://servicetrust.microsoft.com/ViewPage/GDPRDPIA)

- [Info about Data Subject Requests (DSRs)](https://servicetrust.microsoft.com/ViewPage/GDPRDSR)
 
- [Info about data breach notifications](https://servicetrust.microsoft.com/ViewPage/GDPRBreach)