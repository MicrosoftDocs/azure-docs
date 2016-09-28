
<properties
	pageTitle="Conditional access- What applications are supported | Microsoft Azure"
	description="With conditional access control, Azure Active Directory checks the specific conditions you pick when authenticating the user and before allowing access to the application. Once those conditions are met, the user is authenticated and allowed access to the application."
    services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity" 
	ms.date="09/26/2016"
	ms.author="markvi"/>


# Conditional access support for applications

Conditional access rules are supported across Azure Active Directory connected applications, pre-integrated federated SaaS applications, applications that use password single sign-on, and line of business applications and Azure AD Application Proxy. For a detailed list of applications where you can enable conditional access, see [Services enabled with conditional access](active-directory-conditional-access-technical-reference.md#Services-enabled-with-conditional-access). Conditional access works with mobile and desktop applications that use modern authentication. This topic explains what is supported regarding mobile and desktop version of these apps.

Applications with modern authentication can display Azure AD sign in pages. This allows a user to be prompted inline for multi-factor authentication or show an end user facing message when an access is blocked. Modern authentication is also required for the device to be able to authenticate with Azure AD so device-based conditional access policies are evaluated.

It is important to understand which applications are supported as well as steps that may be necessary to secure other entry points.

## Applications using modern authentication
The following applications support conditional access when accessing Office 365 and other Azure AD connected service applications:

| Target Service  | Platform  | Application                                                  |
|--------------|-----------------|----------------------------------------------------------------|
|Office 365 Exchange Online | Windows 10|Mail/Calendar/People app, Outlook 2016, Outlook 2013 (with modern auth enabled), Skype for Business (with modern auth)|
|Office 365 Exchange Online| Windows 7, Windows 8.1, |Outlook 2016, Outlook 2013 (with modern auth enabled), Skype for Business (with modern auth)|
|Office 365 Exchange Online|iOS, Android|  Outlook mobile app|
|Office 365 Exchange Online|Mac OSX| Outlook 2016 for MFA/location only; device-based policies support coming in the future, Skype for Business support coming in the future|
|Office 365 SharePoint Online|Windows 10| Office 2016 apps, Office Universal apps, Office 2013 (with modern auth enabled), OneDrive for Business app (NGSC or next generation sync client) support coming in the future, Office Groups support coming in the future, SharePoint app support coming in the future|
|Office 365 SharePoint Online|Windows 7, Windows 8.1,|Office 2016 apps, Office 2013 (with modern auth enabled), OneDrive for Business app (Groove sync client)|
|Office 365 SharePoint Online|iOS, Android|  Office mobile apps |
|Office 365 SharePoint Online|Mac OSX| Office 2016 apps for MFA/location only; device-based policies support coming in the future|
|Office 365 Yammer|Windows 10, iOS and Android | Office Yammer app|
|Dynamics CRM|Windows 10, 7, 8.1, iOS and Android | Dynamics CRM app|
|PowerBI service|Windows 10, 7, 8.1, iOS and Android | PowerBI app|
|Azure Remote App service|Windows 10, 7, 8.1, iOS and Android, Mac OSX |Azure Remote app|
|Any My Apps app service|Android and iOS|Any My Apps app service |


## Applications that do not use modern authentication

Currently, apps that do not use modern authentication must be blocked access by using other methods, because they are not enforced by conditional access. This is primarily a consideration for Exchange and SharePoint access, as previous app versions have been built using older protocols.

## Office 365 SharePoint Online

Legacy protocols can be disabled at SharePoint, by using the Set-SPOTenant cmdlet. This cmdlet will prevent Office clients using non-modern authentication protocols from accessing SharePoint Online resources. 

**Example command**:
    `Set-SPOTenant -LegacyAuthProtocolsEnabled $false`
 
## Office 365 Exchange Online

On Exchange, there are two main categories of protocol review and select the right policy for your organization:

1. Exchange ActiveSync. By default, conditional access policy for MFA and Location is not enforced for Exchange ActiveSync. This allows access to be protected either by configuring Exchange ActiveSync policy directly, or by blocking Exchange ActiveSync using AD FS rules.
2. Legacy protocols. Legacy protocols can be blocked at AD FS. This will block access for older Office clients, such as Office 2013 without modern authentication enabled and earlier.


### Example AD FS Rules
The following rules can be used to block legacy protocol access at AD FS, in two common configurations.

### Option 1: Allow Exchange ActiveSync and only allow legacy apps on the intranet

By applying the following three rules to the AD FS Relying Party Trust for Microsoft Office 365 Identity Platform, Exchange ActiveSync traffic will be allowed, along with browser and modern authentication traffic. Legacy apps will be blocked from the extranet. 

Rule 1

    `@RuleName = “Allow all intranet traffic”
	c1:[Type == "http://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork", Value == "true"] 
	=> issue(Type = "http://schemas.microsoft.com/authorization/claims/permit", Value = "true");`

Rule 2

    @RuleName = “Allow EAS”
	c1:[Type == "http://schemas.microsoft.com/2012/01/requestcontext/claims/x-ms-client-application", Value == "Microsoft.Exchange.ActiveSync"] 
	=> issue(Type = "http://schemas.microsoft.com/authorization/claims/permit", Value = "true");

Rule 3

	@RuleName = “Allow Extranet browser or browser dialog traffic”
	c1:[Type == " http://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork", Value == "false"] && 
	c2:[Type == "http://schemas.microsoft.com/2012/01/requestcontext/claims/x-ms-endpoint-absolute-path", Value =~ "(/adfs/ls)|(/adfs/oauth2)"] 
	=> issue(Type = "http://schemas.microsoft.com/authorization/claims/permit", Value = "true");

### Option 2: Allow Exchange ActiveSync and block legacy apps 
By applying the following three rules to the AD FS Relying Party Trust for Microsoft Office 365 Identity Platform, Exchange ActiveSync traffic will be allowed, along with browser and modern authentication traffic. Legacy apps will be blocked from any location. 

Rule 1

    @RuleName = “Allow all intranet traffic only for browser and modern authentication clients”
	c1:[Type == "http://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork", Value == "true"] && 
	c2:[Type == "http://schemas.microsoft.com/2012/01/requestcontext/claims/x-ms-endpoint-absolute-path", Value =~ "(/adfs/ls)|(/adfs/oauth2)"] 
	=> issue(Type = "http://schemas.microsoft.com/authorization/claims/permit", Value = "true");


Rule 2 

    @RuleName = “Allow EAS”
	c1:[Type == "http://schemas.microsoft.com/2012/01/requestcontext/claims/x-ms-client-application", Value == "Microsoft.Exchange.ActiveSync"] 
	=> issue(Type = "http://schemas.microsoft.com/authorization/claims/permit", Value = "true");


Rule 3 

    @RuleName = “Allow Extranet browser or browser dialog traffic”
	c1:[Type == " http://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork", Value == "false"] && 
	c2:[Type == "http://schemas.microsoft.com/2012/01/requestcontext/claims/x-ms-endpoint-absolute-path", Value =~ "(/adfs/ls)|(/adfs/oauth2)"] 
	=> issue(Type = "http://schemas.microsoft.com/authorization/claims/permit", Value = "true");








