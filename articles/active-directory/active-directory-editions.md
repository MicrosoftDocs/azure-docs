<properties
	pageTitle="Azure Active Directory editions | Microsoft Azure"
	description="A topic that explains choices for free and paid editions of Azure Active Directory."
	services="active-directory"
	documentationCenter=""
	authors="MarkusVi"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/17/2015"
	ms.author="markvi"/>

# Azure Active Directory editions

All Microsoft Online business services rely on Azure Active Directory for sign-on and other identity needs. If you subscribe to any of Microsoft Online business services (e.g. Office 365, Microsoft Azure, etc), you get Azure Active Directory (Azure AD) with access to all of the Free features, described below.  

Azure Active Directory is a service that provides comprehensive identity and access management capabilities in the cloud for your employees, partners and customers. It combines directory services, advanced identity governance, a rich standards-based platform for developers, and application access management for your own or any of thousands of pre-integrated applications. With the Azure Active Directory Free edition, you can manage users and groups, synchronize with on-premises directories, get single sign-on across Azure, Office 365, and thousands of popular SaaS applications like Salesforce, Workday, Concur, DocuSign, Google Apps, Box, ServiceNow, Dropbox, and more. To learn more about Azure Active Directory, read [What is Azure AD](active-directory-whatis.md).


To enhance your Azure Active Directory, you can add paid capabilities using the Azure Active Directory Basic and Premium editions. Azure Active Directory paid editions are built on top of your existing free directory, providing enterprise class capabilities spanning self-service, enhanced monitoring, security reporting, Multi-Factor Authentication (MFA), and secure access for your mobile workforce.

Office 365 subscriptions include additional Azure Active Directory features described in the comparison table below. 


> [AZURE.NOTE] For the pricing options of these editions, see [Azure Active Directory Pricing](https://azure.microsoft.com/pricing/details/active-directory/). <br>Azure Active Directory Premium and Azure Active Directory Basic are not currently supported in China. Please contact us at the Azure Active Directory Forum for more information


- **Azure Active Directory Basic** - Designed for task workers with cloud-first needs, this edition provides cloud centric application access and self-service identity management solutions. With the Basic edition of Azure Active Directory, you get productivity enhancing and cost reducing features like group-based access management, self-service password reset for cloud applications, and Azure Active Directory Application Proxy (to publish on-premises web applications using Azure Active Directory), all backed by an enterprise-level SLA of 99.9 percent uptime.
 
- **Azure Active Directory Premium** - Designed to empower organizations with more demanding identity and access management needs, Azure Active Directory Premium edition adds feature-rich enterprise-level identity management capabilities and enables hybrid users to seamlessly access on-premises and cloud capabilities. This edition includes everything you need for information worker and identity administrators in hybrid environments across application access, self-service identity and access management (IAM), identity protection and security in the cloud. It supports advanced administration and delegation resources like dynamic groups and self-service group management. It includes Microsoft Identity Manager (an on-premises identity and access management suite) and provides cloud write-back capabilities enabling solutions like self-service password reset for your on-premises users. 

To sign up and start using Active Directory Premium today, see [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md).


> [AZURE.NOTE] 
>A number of Azure Active Directory capabilities are available through "pay as you go" editions:
>
>- Active Directory B2C is the identity and access management solution for your consumer-facing applications. For more details, see [Azure Active Directory B2C](https://azure.microsoft.com/documentation/services/active-directory-b2c/)
 
>-	Azure Multi-Factor Authentication can be used through per user or per authentication providers. For more details, see [What is Azure Multi-Factor Authentication?](multi-factor-authentication.md) 


<br>

| Feature Type| Features| Free Edition| Basic Edition| Premium Edition| Office 365 Apps Only |
| --- | --- | --- | --- | --- | --- |
| **Common features**| Directory objects| Up to 500,000 objects| No object limit| No object limit| No object limit for Office 365 user accounts|
|  | [User and group management (add / update / delete), user-based provisioning](active-directory-administer.md), [device registration](active-directory-conditional-access-device-registration-overview.md)| ![Check][12]| ![Check][12]| ![Check][12]| ![Check][12]|
|  | SSO to SaaS apps, custom apps, Application Proxy apps| 10 apps per user| 10 apps per user| no limit| 10 apps per user|
|  | Self-service password change for cloud users| ![Check][12]| ![Check][12]| ![Check][12]| ![Check][12]|
|  | [Azure AD Connect - For syncing between on-premises directories and Azure Active Directory](active-directory-aadconnect.md)| ![Check][12]| ![Check][12]| ![Check][12]| ![Check][12]|
|  | **Preview**:[ B2B collaboration](active-directory-b2b-collaboration-overview.md)| ![Check][12]| ![Check][12]| ![Check][12]| ![Check][12]|
|  | [Security / usage reports](active-directory-view-access-usage-reports.md)| Basic reports| Advanced reports| Basic reports| Basic reports|
| **Premium and Basic features**| [Group-based application access management and provisioning](active-directory-accessmanagement-group-saasapps.md)|  | ![Check][12]| ![Check][12]|  |
|  | [Self-service password reset for cloud users](active-directory-passwords.md)|  | ![Check][12]| ![Check][12]| ![Check][12]|
|  | [Company branding (Log-on pages and Access Panel customization)](active-directory-add-company-branding.md)|  | ![Check][12]| ![Check][12]| ![Check][12]|
|  | [Application Proxy](active-directory-application-proxy-get-started.md)|  | ![Check][12]| ![Check][12]|  |
|  | [High availability SLA uptime (99.9%)](https://azure.microsoft.com/support/legal/sla/)|  | ![Check][12]| ![Check][12]| ![Check][12]|
| **Premium only features**| [Self-service group management / self-service application addition / dynamic group membership](Self-service group management for users in Azure AD.md)|  |  | ![Check][12]|  |
|  | [Self-service password reset, change, unlock with on-premises write-back](active-directory-passwords-getting-started.md/#enable-users-to-reset-or-change-their-ad-passwords)|  |  | ![Check][12]|  |
|  | [Multi-Factor Authentication (cloud and on-premises)](multi-factor-authentication.md)|  |  | ![Check][12]| Limited to cloud only for Office 365 Apps|
|  | [Microsoft Identity Manager (MIM) user licenses and MIM server](http://www.microsoft.com/server-cloud/products/microsoft-identity-manager/default.aspx)|  |  | ![Check][12]|  |
|  | [Cloud App Discovery](active-directory-cloudappdiscovery-whatis.md)|  |  | ![Check][12]|  |
|  | [Azure Active Directory Connect Health](active-directory-aadconnect-health.md)|  |  | ![Check][12]|  |
|  | Automatic password rollover for group accounts|  |  | ![Check][12]|  |
|  | **Preview**: Conditional Access|  |  | ![Check][12]|  |
|  | **Preview**: Privileged Identity Management|  |  | ![Check][12]|  |
| **Azure Active Directory Join – Windows 10 only related features**| Join a Windows 10 device to Azure AD, Desktop SSO, Microsoft Passport for Azure AD, Administrator Bitlocker recovery| ![Check][12]| ![Check][12]| ![Check][12]| ![Check][12]|
|  | MDM auto-enrolment,  Self-Service Bitlocker recovery, Additional  local administrators to Windows 10 devices via Azure AD Join|  |  | ![Check][12]|  |







## What's next

- [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md)
- [Add company branding to your Sign In and Access Panel pages](active-directory-add-company-branding.md)
- [View your access and usage reports](active-directory-view-access-usage-reports.md)


<!--Image references-->
[12]: ./media/active-directory-editions/ic195031.png
