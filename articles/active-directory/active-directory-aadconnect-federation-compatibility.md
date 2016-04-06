<properties
	pageTitle="Azure AD federation compatibility list"
	description="This page has 3rd party identity providers that can be used to implement single sign-on."
	services="active-directory"
	documentationCenter=""
	authors="billmath"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/06/2016"
	ms.author="billmath"/>

# Azure AD Federation Compatibility List
Azure Active Directory provides single-sign on and enhanced application access security for Office 365 and other Microsoft Online services for hybrid and cloud-only implementations without requiring any 3rd party solution. Office 365, like most of Microsoft’s Online services, is integrated with Azure Active Directory for directory services, authentication and authorization. Azure Active Directory also provides single sign-on to thousands of SaaS applications and on-premises web applications. Please see the Azure Active Directory application gallery for supported SaaS applications.

For organizations that have invested in third-party federation solutions, this topic contains guidance for configuring single sign-on for their Windows Server Active Directory users with Microsoft Online services by using third-party identity providers that are included in the “Azure Active Directory federation compatibility list” below. 

Microsoft tested these single sign-on experiences using third-party identity providers against a set of use cases common with Azure Active Directory.

>[AZURE.IMPORTANT] Microsoft tested only the federation functionality of these single sign-on scenarios. Microsoft did not perform any testing of the synchronization, two-factor authentication, etc. components of these single sign-on scenarios.

>Use of Sign-in by Alternate ID to UPN is also not tested in this program.



- [Azure Active Directory](#azure-active-directory)
- Optimal IDM Virtual Identity Server Federation Services 
- PingFederate 6.11 
- PingFederate 7.2 
- Centrify 
- IBM Tivoli Federated Identity Manager 6.2.2 
- SecureAuth IdP 7.2.0 
- CA SiteMinder 12.52 
- RadiantOne CFS 3.0 
- Okta 
- OneLogin 
- NetIQ Access Manager 4.0.1 
- BIG-IP with Access Policy Manager BIG-IP ver. 11.3x – 11.6x 
- VMware  Workspace Portal version 2.1 
- Sign&go 5.3 
- IceWall Federation Version 3.0 
- CA Secure Cloud 
- Dell One Identity Cloud Access Manager v7.1 
- AuthAnvil Single Sign On 4.5 

>[AZURE.IMPORTANT] Since these are third-party products, Microsoft does not provide support for the deployment, configuration, troubleshooting, best practices, etc. issues and questions regarding these identity providers. For support and questions regarding these identity providers, contact the supported third-parties directly.

>These third-party identity providers were tested for interoperability with Microsoft cloud services using WS-Federation and WS-Trust protocols only. Testing did not include using the SAML protocol.

## Azure Active Directory 
Azure Active Directory can authenticate users by federating with your on-premises Active-Directory or without an on-premises federation server through the use of password sync. 

The following is the scenario support matrix for this sign-on experience: 


| Client |Support  |Exceptions|
| --------- | --------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |None|
| Rich client applications such as Lync, Office Subscription, CRM |  Supported |None|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|
|Modern Applications using ADAL such as Office 2016| Supported|None|
For more information about using Azure Active Directory with AD FS see [Active Directory Federation Services (ADFS)](active-directory-aadconnect-get-started-custom.md#configuring-federation-with-ad-fs)
For more information about using Azure Active Directory with Password sync see [Azure AD Connect](active-directory-aadconnect.md).


## Optimal IDM Virtual Identity Server Federation Services 
## PingFederate 6.11 
## PingFederate 7.2 
## Centrify 
## IBM Tivoli Federated Identity Manager 6.2.2 
## SecureAuth IdP 7.2.0 
## CA SiteMinder 12.52 
## RadiantOne CFS 3.0 
## Okta 
## OneLogin 
## NetIQ Access Manager 4.0.1 
## BIG-IP with Access Policy Manager BIG-IP ver. 11.3x – 11.6x 
## VMware  Workspace Portal version 2.1 
## Sign&go 5.3 
## IceWall Federation Version 3.0 
## CA Secure Cloud 
## Dell One Identity Cloud Access Manager v7.1 
## AuthAnvil Single Sign On 4.5 