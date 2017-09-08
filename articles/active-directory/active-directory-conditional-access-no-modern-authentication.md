---
title: Set up SharePoint and Exchange Online for Azure Active Directory conditional access | Microsoft Docs
description: Learn how to set up SharePoint and Exchange online for Azure Active Directory conditional access.
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

# Set up SharePoint and Exchange Online for Azure Active Directory conditional access 

With [Azure Active Directory (Azure AD) conditional access](active-directory-conditional-access-azure-portal.md), you can control how users access your cloud apps. If you want to use conditional access to control access to SharePoint and Exchange online, you need to:

- Review whether your conditional access scenario is supported
- Prevent client apps from bypassing the enforcement of your conditional access policies.   

This article explains, how you can address both cases.


## What you need to know

You can only use Azure AD conditional access to protect cloud apps when the authentication attempt of a client app is based on [modern authentication](https://support.office.com/article/Using-Office-365-modern-authentication-with-Office-clients-776c0036-66fd-41cb-8928-5495c0f9168a). In addition to modern authentication, some cloud apps also support legacy authentication protocols. This applies, for example, to SharePoint Online and Exchange Online. 
When a client app can use a legacy authentication protocol to access a cloud app, Azure AD cannot enforce a conditional access policy on this access attempt. To prevent a client app from bypassing the enforcement of policies, you should check whether it is possible to only enable modern authentication on the affected cloud apps. 
 
## Control access to SharePoint Online

In addition to modern authentication, SharePoint Online also supports legacy authentication protocols. If the legacy authentication protocols are enabled, 
You can disable legacy authentication protocols for SharePoint access by using the **[Set-SPOTenant](https://technet.microsoft.com/library/fp161390.aspx)** cmdlet: 

	Set-SPOTenant -LegacyAuthProtocolsEnabled $false

## Control access to Exchange Online

Exchange supports two main categories of protocols:

- Exchange ActiveSync

- Legacy authentication protocols

You should review the following options, and then select the policy that is right for your organization.


### Exchange ActiveSync

By default, the following conditional access policies are not enforced for Exchange ActiveSync:

- Multi-factor authentication 

- Location 

To protect access to these services, you can:

- Configure an Exchange ActiveSync policy 

- Block Exchange ActiveSync by using Active Directory Federation Services (AD FS) rules.

### Legacy protocols

You can block legacy protocols with AD FS. This blocks access from:

- Older Office clients, such as Office 2013 without modern authentication enabled 
- Earlier versions of Office

## Use AD FS to block legacy protocol

You can use the following sample issuance authorization rules to block legacy protocol access at the AD FS level. 

### Option 1: Allow Exchange ActiveSync, and allow legacy apps, but only on the intranet

By applying the following three rules, you enable access for:

- Exchange ActiveSync traffic
- Browser traffic
- Modern authentication traffic

Legacy client apps from the extranet are blocked .

**Rule 1:**

    @RuleName = "Allow all intranet traffic"
    c1:[Type == "http://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork", Value == "true"]
    => issue(Type = "http://schemas.microsoft.com/authorization/claims/permit", Value = "true");

**Rule 2:**

    @RuleName = "Allow Exchange ActiveSync"
    c1:[Type == "http://schemas.microsoft.com/2012/01/requestcontext/claims/x-ms-client-application", Value == "Microsoft.Exchange.ActiveSync"]
    => issue(Type = "http://schemas.microsoft.com/authorization/claims/permit", Value = "true");

**Rule 3:**

    @RuleName = "Allow extranet browser and browser dialog traffic"
    c1:[Type == "http://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork", Value == "false"] &&
    c2:[Type == "http://schemas.microsoft.com/2012/01/requestcontext/claims/x-ms-endpoint-absolute-path", Value =~ "(/adfs/ls)|(/adfs/oauth2)"]
    => issue(Type = "http://schemas.microsoft.com/authorization/claims/permit", Value = "true");

### Option 2: Allow Exchange ActiveSync, and block legacy apps

By applying the following three rules, you enable access for: 

- Exchange ActiveSync traffic

- Browser traffic

- Modern authentication traffic

Legacy apps from any location are blocked .

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




