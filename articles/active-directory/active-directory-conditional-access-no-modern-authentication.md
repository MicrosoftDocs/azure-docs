---
title: Block access to Enterprise applications in the Azure portal that don't use modern authentication | Microsoft Docs
description: Learn how to block access to Enterprise applications in the Azure portal that don't use modern authentication.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 62349fba-3cc0-4ab5-babe-372b3389eff6
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/07/2017
ms.author: markvi
ms.reviewer: calebb

---

# Block access to Enterprise applications in the Azure portal that don't use modern authentication

With [Azure Active Directory (Azure AD) conditional access](active-directory-conditional-access-azure-portal.md), you can control how authorized users can access your Enterprise applications. You can only use Azure AD conditional access for applications that use [modern authentication](https://support.office.com/article/Using-Office-365-modern-authentication-with-Office-clients-776c0036-66fd-41cb-8928-5495c0f9168a). 

This topic explains, how you can block access to applications that don't use modern authentication.   


## Control access in Office 365 SharePoint Online

You can disable legacy protocols for SharePoint access by using the Set-SPOTenant cmdlet. Use this cmdlet to prevent Office clients that use non-modern authentication protocols from accessing SharePoint Online resources.

**Example command**:
    `Set-SPOTenant -LegacyAuthProtocolsEnabled $false`

## Control access in Office 365 Exchange Online

Exchange supports two main categories of protocols. Review the following options, and then select the policy that is right for your organization.

* **Exchange ActiveSync**. By default, conditional access policies for multi-factor authentication and location are not enforced for Exchange ActiveSync. You need to protect access to these services either by configuring Exchange ActiveSync policy directly, or by blocking Exchange ActiveSync by using Active Directory Federation Services (AD FS) rules.
* **Legacy protocols**. You can block legacy protocols with AD FS. This blocks access to older Office clients, such as Office 2013 without modern authentication enabled, and earlier versions of Office.

### Use AD FS to block legacy protocol
You can use the following example issuance authorization rules to block legacy protocol access at the AD FS level. Choose from two common configurations.

#### Option 1: Allow Exchange ActiveSync, and allow legacy apps, but only on the intranet
By applying the following three rules to the AD FS relying party trust for Microsoft Office 365 Identity Platform, Exchange ActiveSync traffic, and browser and modern authentication traffic, have access. Legacy apps are blocked from the extranet.

##### Rule 1
    @RuleName = "Allow all intranet traffic"
    c1:[Type == "http://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork", Value == "true"]
    => issue(Type = "http://schemas.microsoft.com/authorization/claims/permit", Value = "true");

##### Rule 2
    @RuleName = "Allow Exchange ActiveSync"
    c1:[Type == "http://schemas.microsoft.com/2012/01/requestcontext/claims/x-ms-client-application", Value == "Microsoft.Exchange.ActiveSync"]
    => issue(Type = "http://schemas.microsoft.com/authorization/claims/permit", Value = "true");

##### Rule 3
    @RuleName = "Allow extranet browser and browser dialog traffic"
    c1:[Type == "http://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork", Value == "false"] &&
    c2:[Type == "http://schemas.microsoft.com/2012/01/requestcontext/claims/x-ms-endpoint-absolute-path", Value =~ "(/adfs/ls)|(/adfs/oauth2)"]
    => issue(Type = "http://schemas.microsoft.com/authorization/claims/permit", Value = "true");

#### Option 2: Allow Exchange ActiveSync, and block legacy apps
By applying the following three rules to the AD FS relying party trust for Microsoft Office 365 Identity Platform, Exchange ActiveSync traffic, and browser and modern authentication traffic, have access. Legacy apps are blocked from any location.

##### Rule 1
    @RuleName = "Allow all intranet traffic only for browser and modern authentication clients"
    c1:[Type == "http://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork", Value == "true"] &&
    c2:[Type == "http://schemas.microsoft.com/2012/01/requestcontext/claims/x-ms-endpoint-absolute-path", Value =~ "(/adfs/ls)|(/adfs/oauth2)"]
    => issue(Type = "http://schemas.microsoft.com/authorization/claims/permit", Value = "true");


##### Rule 2
    @RuleName = "Allow Exchange ActiveSync"
    c1:[Type == "http://schemas.microsoft.com/2012/01/requestcontext/claims/x-ms-client-application", Value == "Microsoft.Exchange.ActiveSync"]
    => issue(Type = "http://schemas.microsoft.com/authorization/claims/permit", Value = "true");


##### Rule 3
    @RuleName = "Allow extranet browser and browser dialog traffic"
    c1:[Type == "http://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork", Value == "false"] &&
    c2:[Type == "http://schemas.microsoft.com/2012/01/requestcontext/claims/x-ms-endpoint-absolute-path", Value =~ "(/adfs/ls)|(/adfs/oauth2)"]
    => issue(Type = "http://schemas.microsoft.com/authorization/claims/permit", Value = "true");

## Next steps

For more information, see [Conditional access in Azure Active Directory](active-directory-conditional-access.md)




