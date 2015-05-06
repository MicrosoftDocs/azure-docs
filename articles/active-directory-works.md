<properties
	pageTitle="How does Azure AD work?"
	description="Azure AD creates an identity landscape that is yours in the cloud. It can be connected to your on-premises identity system or used independently."
	services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="05/05/2015"
	ms.author="curtand"/>



# How does Azure Active Directory work?


[What is Azure AD?](active-directory-whatis.md)<br>
[Get started](active-directory-get-started.md)<br>
[Next steps](active-directory-next-steps.md)<br>
[Learn more](active-directory-learn-map.md)


Azure AD creates an identity landscape that is yours in the cloud. It can be connected to your on-premises identity system or used independently.

You can think of an account in Azure AD as your driver's license for the cloud: it's your unique ID for accessing services online. In that sense, Azure AD works like your own private registrar in the cloud for those driver's licenses.  It enables identities to be used anywhere in the cloud, and improves mobility for users who access resources on-premises.

> [AZURE.NOTE] To use Azure Active Directory, you need an Azure account. If you don't have an account, you can [sign up for a free Azure account](http://azure.microsoft.com/pricing/free-trial/).

## How does Azure AD support Office 365, Microsoft Intune, and other Azure services?
The Azure portal, Office 365 Admin Center, Microsoft Intune account portal, and the cmdlets from the Azure AD PowerShell module all read from and write to a single shared instance of Azure AD that is associated with your directory. Portals (or cmdlets) act as a front-end interface that pulls in or changes your directory information. [Learn more about support for other services](active-directory-administer.md#what-is-an-azure-ad-tenant)

## How does Azure AD support 3rd party applications?
Azure AD simplifies authentication for developers by providing identity as a service, along with open source libraries for different platforms to help you start coding quickly. [Learn more about authentication scenarios for Azure AD](active-directory-authentication-scenarios.md).


## How does Azure AD extend my on-premises directory?
Azure AD supports several of the most widely used authentication and authorization protocols. [Learn more about Azure Active Directory authentication protocols](active-directory-authentication-scenarios.md).

## How does Azure help me manage identities?
Want to understand more about how to manage Azure AD? How to get a directory? How to delete a directory? How to manage directory data? Learn more about administering Azure AD directory. [Learn more about how to administer Azure AD](active-directory-administer.md).

## Additional Resources

* [Sign up for Azure as an organization](sign-up-organization.md)
* [Azure Identity](fundamentals-identity.md)
