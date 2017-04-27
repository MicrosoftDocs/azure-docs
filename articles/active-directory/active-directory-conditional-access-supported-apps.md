---
title: Applications and browsers that use conditional access rules in Azure Active Directory | Microsoft Docs
description: With conditional access control, Azure Active Directory checks for specific conditions when it authenticates the user, and to allow application access.
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
ms.date: 04/11/2017
ms.author: markvi

---
# Applications and browsers that use conditional access rules in Azure Active Directory

Conditional access rules are supported in Azure Active Directory (Azure AD)-connected applications, pre-integrated federated software as a service (SaaS) applications, applications that use password single sign-on (SSO), line-of-business applications, and applications that use Azure AD Application Proxy. For a detailed list of applications for which you can use conditional access, see [Services enabled with conditional access](active-directory-conditional-access-technical-reference.md). Conditional access works both with mobile and desktop applications that use modern authentication. In this article, we cover how conditional access works in mobile and desktop apps.

You can use Azure AD sign-in pages in applications that use modern authentication. With a sign-in page, a user is prompted for multi-factor authentication. A message is shown if the user's access is blocked. Modern authentication is required for the device to authenticate with Azure AD, so that device-based conditional access policies are evaluated.

It's important to know which applications can use conditional access rules, and the steps that you might need to take to secure other application entry points.

## Applications that use modern authentication
> [!NOTE]
> If you have a conditional access policy in Azure AD that has an equivalent in Office 365, configure both conditional access policies. This would apply, for example, to conditional access policies for Exchange Online or SharePoint Online.
>
>

The following applications support conditional access for Office 365 and other Azure AD-connected service applications:

| Target service | Platform | Application |
| --- | --- | --- |
| Office 365 Exchange Online |Windows 10 |Mail/Calendar/People app, Outlook 2016, Outlook 2013 (with modern authentication), Skype for Business (with modern authentication) |
| Office 365 Exchange Online |Windows 8.1, Windows 7 |Outlook 2016, Outlook 2013 (with modern authentication), Skype for Business (with modern authentication) |
| Office 365 Exchange Online |iOS, Android |Outlook mobile app |
| Office 365 Exchange Online |Mac OS X |Outlook 2016 for multi-factor authentication and location only; device-based policy support planned for the future, Skype for Business support planned for the future |
| Office 365 SharePoint Online |Windows 10 |Office 2016 apps, Universal Office apps, Office 2013 (with modern authentication), OneDrive sync client (see [notes](https://support.office.com/en-US/article/Azure-Active-Directory-conditional-access-with-the-OneDrive-sync-client-on-Windows-028d73d7-4b86-4ee0-8fb7-9a209434b04e)), Office Groups support planned for the future, SharePoint app support planned for the future |
| Office 365 SharePoint Online |Windows 8.1, Windows 7 |Office 2016 apps, Office 2013 (with modern authentication), OneDrive sync client (see [notes](https://support.office.com/en-US/article/Azure-Active-Directory-conditional-access-with-the-OneDrive-sync-client-on-Windows-028d73d7-4b86-4ee0-8fb7-9a209434b04e)) |
| Office 365 SharePoint Online |iOS, Android |Office mobile apps |
| Office 365 SharePoint Online |Mac OS X |Office 2016 apps for multi-factor authentication and location only; device-based policy support planned for the future |
| Office 365 Yammer |Windows 10, iOS; Android support planned for the future |Office Yammer app |
| Dynamics CRM |Windows 10, Windows 8.1, Windows 7, iOS, and Android |Dynamics CRM app |
| PowerBI service |Windows 10, Windows 8.1, Windows 7, iOS, and Android |PowerBI app |
| Azure Remote App service |Windows 10, Windows 8.1, Windows 7, iOS, Android, and Mac OS X |Azure Remote app |
| Any My Apps app service |Android and iOS |Any My Apps app service |

## Applications that do not use modern authentication
Currently, you must use other methods to block access to apps that do not use modern authentication. Access rules for apps that don't use modern authentication are not enforced by conditional access. This primarily is a consideration for Exchange and SharePoint access. Most earlier versions of apps use older access control protocols.

### Control access in Office 365 SharePoint Online
You can disable legacy protocols for SharePoint access by using the Set-SPOTenant cmdlet. Use this cmdlet to prevent Office clients that use non-modern authentication protocols from accessing SharePoint Online resources.

**Example command**:
    `Set-SPOTenant -LegacyAuthProtocolsEnabled $false`

### Control access in Office 365 Exchange Online
Exchange offers two main categories of protocols. Review the following options, and then select the policy that is right for your organization.

* **Exchange ActiveSync**. By default, conditional access policies for multi-factor authentication and location are not enforced for Exchange ActiveSync. You need to protect access to these services either by configuring Exchange ActiveSync policy directly, or by blocking Exchange ActiveSync by using Active Directory Federation Services (AD FS) rules.
* **Legacy protocols**. You can block legacy protocols with AD FS. This blocks access to older Office clients, such as Office 2013 without modern authentication enabled, and earlier versions of Office.

### Use AD FS to block legacy protocol
You can use the following example rules to block legacy protocol access at the AD FS level. Choose from two common configurations.

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


## Supported browsers

| OS                     | Browsers                 | Support     |
| :--                    | :--                      | :-:         |
| Win 10                 | IE, Edge                 | ![Check][1] |
| Win 10                 | Chrome                   | Coming soon |
| Win 8 / 8.1            | IE, Chrome               | ![Check][1] |
| Win 7                  | IE, Chrome               | ![Check][1] |
| iOS                    | Safari                   | ![Check][1] |
| Android                | Chrome                   | ![Check][1] |
| Windows Phone          | IE, Edge                 | ![Check][1] |
| Windows Server 2016    | IE, Edge                 | ![Check][1] |
| Windows Server 2016    | Chrome                   | Coming soon |
| Windows Server 2012 R2 | IE, Chrome               | ![Check][1] |
| Windows Server 2008 R2 | IE, Chrome               | ![Check][1] |
| Mac OS                 | Safari                   | ![Check][1] |
| Mac OS                 | Chrome                   | Coming soon |


## Next steps

For more details, see [Conditional access in Azure Active Directory](active-directory-conditional-access.md)



<!--Image references-->
[1]: ./media/active-directory-conditional-access-supported-apps/ic195031.png


