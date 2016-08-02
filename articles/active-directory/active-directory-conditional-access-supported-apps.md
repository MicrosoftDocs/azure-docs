
<properties
	pageTitle="Conditional access- What applications are supported | Microsoft Azure"
	description="With conditional access control, Azure Active Directory checks the specific conditions you pick when authenticating the user and before allowing access to the application. Once those conditions are met, the user is authenticated and allowed access to the application."
    services="active-directory"
	documentationCenter=""
	authors="femila"
	manager="swadhwa"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity" 
	ms.date="07/14/2016"
	ms.author="femila"/>


# Conditional access support for applications

Conditional Access rules are supported across Azure AD connected applications, pre-integrated federated SaaS applications, applications that use password single sign-on, and line of business applications and Azure AD Application Proxy. For a detailed list of applications where you can enable conditional access, see [Services enabled with conditional access](active-directory-conditional-access-technical-reference.md#Services-enabled-with-conditional-access). Conditional access works with mobile and desktop applications that use modern authentication. This topic explains what is supported regarding mobile and desktop version of these apps.

 Applications with modern authentication can display Azure AD sign in pages. This allows a user to be prompted inline for multi-factor authentication or show an end user facing message when an access is blocked.
It is important to understand which applications are supported as well as steps that may be necessary to secure other entry points.

## Applications using modern authentication
The following applications have been tested with multi-factor authentication (MFA) and location policy set on the target service.

| Application  | Target Service  | Platform                                                       |
|--------------|-----------------|----------------------------------------------------------------|
| Outlook 2016 | Exchange        |  Windows 10,  Windows Mobile 10,  Windows 8.1, Windows 7, Mac  |
| Outlook 2013 (Requires modern authentication to be enabled)| Exchange |Windows 10, Windows Mobile 10, Windows 8.1, Windows 7|
|Skype for Business (with modern authentication)|Exchange (Exchange is accessed for calendar and conversation history)|  Windows 10, Windows 8.1, Windows 7 |
|Outlook Mobile app|Exchange| iOS and Android |
|Office 2016; Word, Excel, Sharepoint|SharePoint| Windows 10, Windows Mobile 10, Windows 8.1, Windows 7, Mac |
|Office 2013 (Requires modern authentication to be enabled)|SharePoint|Windows 10, Windows Mobile 10, Windows 8.1, Windows 7|
|Dynamics CRM app|Dynamics CRM| Windows 10, Windows 8.1, Windows 7, iOS, Android|
| Yammer app|Yammer| Windows Mobile 10, iOS, Android|
|Azure Remote App|Azure Remote App service|Windows 10, Windows 8.1, Windows 7,Mac, iOS, Android|

## Applications that do not use modern authentication

Currently, apps that do not use modern authentication must be blocked access by using other methods, because they are not enforced by conditional access. This is primarily a consideration for Exchange and SharePoint access, as previous app versions have been built using older protocols.

## SharePoint
Legacy protocols can be disabled at SharePoint, by using the Set-SPOTenant cmdlet. This cmdlet will prevent Office clients using non-modern authentication protocols from accessing SharePoint Online resources. 

**Example command**:
    `Set-SPOTenant -LegacyAuthProtocolsEnabled $false`
 
## Exchange

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








