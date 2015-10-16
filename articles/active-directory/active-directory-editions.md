<properties
	pageTitle="Azure Active Directory editions | Microsoft Azure"
	description="A topic that explains choices for free and paid editions of Azure Active Directory."
	services="active-directory"
	documentationCenter=""
	authors="MarkusVi"
	manager="StevenPo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/13/2015"
	ms.author="markvi"/>

# Azure Active Directory editions

All Microsoft Online business services rely on Azure Active Directory for sign-on and other identity needs. If you subscribe to any of Microsoft Online business services (e.g. Office 365, Microsoft Azure, etc), you get Azure Active Directory (Azure AD) with access to all of the Free features, described below.  

Azure Active Directory is a service that provides comprehensive identity and access management capabilities in the cloud for your employees, partners and customers. It combines directory services, advanced identity governance, a rich standards-based platform for developers, and application access management for your own or any of thousands of pre-integrated applications. With the Azure Active Directory Free edition, you can manage users and groups, synchronize with on-premises directories, get single sign-on across Azure, Office 365, and thousands of popular SaaS applications like Salesforce, Workday, Concur, DocuSign, Google Apps, Box, ServiceNow, Dropbox, and more. To learn more about Azure Active Directory, read [What is Azure AD](active-directory-whatis.md).


To enhance your Azure Active Directory, you can add paid capabilities using the Azure Active Directory Basic and Premium editions. Azure Active Directory paid editions are built on top of your existing free directory, providing enterprise class capabilities spanning self-service, enhanced monitoring, security reporting, Multi-Factored Authentication (MFA), and secure access for your mobile workforce.

Office 365 subscriptions include additional Azure Active Directory features described in the comparison table below. 


> [AZURE.NOTE] For the pricing options of these editions, see [Azure Active Directory Pricing](https://azure.microsoft.com/en-us/pricing/details/active-directory/). Azure Active Directory Premium and Azure Active Directory Basic are not currently supported in China. Please contact us at the Azure Active Directory Forum for more information


- **Azure Active Directory Basic** - Designed for task workers with cloud-first needs, this edition provides cloud centric application access and self-service identity management solutions. With the Basic edition of Azure Active Directory, you get productivity enhancing and cost reducing features like group-based access management, self-service password reset for cloud applications, and Azure Active Directory Application Proxy (to publish on-premises web applications using Azure Active Directory) all backed by an enterprise-level SLA of 99.9 percent uptime.
 
- **Azure Active Directory Premium** - Designed to empower organizations with more demanding identity and access management needs, Azure Active Directory Premium edition adds feature-rich enterprise-level identity management capabilities and enables hybrid users to seamlessly access on-premises and cloud capabilities. This edition includes everything you need for information worker and identity administrators in hybrid environments across application access, self-service IAM, identity protection and security in the cloud. It supports advanced administration and delegation resources like dynamic groups and self-service group management. It includes Microsoft Identity Manager (an on-premises identity and access management suite) and provides cloud write-back capabilities enabling solutions like self-service password reset for your on-premises users. 

To sign up and start using Active Directory Premium today, see [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md).


> [AZURE.NOTE] 
>A number of Azure Active Directory capabilities are available through "pay as you go" editions:
>
>- Active Directory B2C, is the identity and access management solution for your consumer-facing applications. For more details, see [Azure Active Directory B2C](https://azure.microsoft.com/documentation/services/active-directory-b2c/)
 
>-	Azure Multi-Factor Authentication can be used through per user or per authentication providers. For more details, see [What is Azure Multi-Factor Authentication?](multi-factor-authentication.md) 







| Feature Type| Features| Free Edition| Basic Edition| Premium Edition |
| --- | --- | --- | --- | --- |
| **Common features**| Directory as a service| ![Check][12] Up to 500K users [1]| ![Check][12] No object limit| ![Check][12] No object limit|
|  | [User and group management using UI or Windows PowerShell cmdlets](active-directory-administer.md)| ![Check][12]| ![Check][12]| ![Check][12]|
|  | [Device registration](active-directory-conditional-access-device-registration-overview.md)| ![Check][12]| ![Check][12]| ![Check][12]|
|  | [Access Panel portal for SSO-based user access to SaaS and custom applications](active-directory-saas-access-panel-introduction.md)| ![Check][12] Up to 10 apps per user [2]| ![Check][12] Up to 1- apps per user [2]| ![Check][12] No app limit|
|  | [User-based application access management and provisioning](active-directory-saas-app-provisioning.md)| ![Check][12]| ![Check][12]| ![Check][12]|
|  | Self-service password change for cloud users| ![Check][12]| ![Check][12]| ![Check][12]|
|  | [Azure AD Connect – For syncing between on-premises directories and Azure Active Directory](active-directory-aadconnect.md)| ![Check][12]| ![Check][12]| ![Check][12]|
|  | [Standard security reports](active-directory-view-access-usage-reports.md)| ![Check][12]| ![Check][12]| ![Check][12]|
|  | [B2B collaboration (cross-organization collaboration) (in preview)](active-directory-b2b-collaboration-overview.md)| ![Check][12]| ![Check][12]| ![Check][12]|
| **Premium and Basic features**| [Customization of company logo and colors to the Sign In and Access Panel pages](active-directory-add-company-branding.md)| Included with Office 365 subscriptions [4]| ![Check][12]| ![Check][12]|
|  | [Self-service password reset for cloud users](active-directory-passwords.md)| Included with Office 365 subscriptions [4]| ![Check][12]| ![Check][12]|
|  | [Application Proxy: Secure Remote Access and SSO to on-premises web applications](active-directory-application-proxy-get-started.md)|  | ![Check][12]| ![Check][12]|
|  | [Group-based application access management and provisioning](active-directory-accessmanagement-group-saasapps.md)|  | ![Check][12]| ![Check][12]|
|  | [High availability SLA uptime (99.9%)](https://azure.microsoft.com/en-us/support/legal/sla/)| Microsoft Online Services SLA [5]| ![Check][12]| ![Check][12]|
| **Premium only features**| [Advanced application usage reporting](active-directory-view-access-usage-reports.md)|  |  | ![Check][12]|
|  | [Self-service group management for cloud users](Self-service group management for users in Azure AD)|  |  | ![Check][12]|
|  | [Self-service password reset with on-premises write-back](active-directory-passwords-getting-started.md/#enable-users-to-reset-or-change-their-ad-passwords)|  |  | ![Check][12]|
|  | [Microsoft Identity Manager (MIM) user licenses – For on-premises identity and access management](http://www.microsoft.com/en-us/server-cloud/products/microsoft-identity-manager/default.aspx)|  |  | ![Check][12] [3]|
|  | [Advanced anomaly security reports (machine learning-based)](active-directory-view-access-usage-reports.md)|  |  | ![Check][12]|
|  | [Cloud app discovery](active-directory-cloudappdiscovery-whatis.md)|  |  | ![Check][12]|
|  | [Multi-Factor Authentication service for cloud users](multi-factor-authentication.md)| Included with Office 365 subscriptions [4]|  | ![Check][12]|
|  | [Multi-Factor Authentication server for on-premises users](multi-factor-authentication.md)|  |  | ![Check][12]|
|  | [Azure Active Directory Connect Health to monitor the health of on-premises Active Directory infrastructure, and get usage analytics](active-directory-aadconnect-health.md)|  |  | ![Check][12]|




[1] The 500k object limit does not apply for Office 365, Microsoft Intune or any other Microsoft online service that relies on Azure Active Directory for directory services.

[2] With Azure Active Directory Free and Azure Active Directory Basic, end users who have been assigned access to each SaaS app, can see up to 10 apps in their Access Panel and get SSO access to them (assuming they have first been configured with SSO by the admin). Admins can configure SSO and assign user access to as many SaaS apps as they want with Free, however end users will only see 10 apps in their Access Panel at a time.

[3] Microsoft Identity Manager Server software rights are granted with Windows Server licenses (any edition). Because Microsoft Identity Manager runs on the Windows Server operating system, as long as the server is running a valid, licensed copy of Windows Server, then Microsoft Identity Manager can be installed and used on that server. No other separate license is required for Microsoft Identity Manager Server.

[4] Azure AD paid features included with Office 365 are limited to use when accessing Office 365 applications only.

[5] Each of Microsoft's Online business Services, Office 365, Microsoft Intune, or any other Microsoft online service that relies on Azure Active Directory for directory services, carry their own service SLA which extends to their use of Azure Active Directory. To learn more, see [Microsoft online services SLA](https://gallery.technet.microsoft.com/online-SLA-ea09109e).




## What's next

- [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md)
- [Add company branding to your Sign In and Access Panel pages](active-directory-add-company-branding.md)
- [View your access and usage reports](active-directory-view-access-usage-reports.md)


<!--Image references-->
[12]: ./media/active-directory-editions/ic195031.png