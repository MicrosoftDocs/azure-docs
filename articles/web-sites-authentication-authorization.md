<properties 
	pageTitle="Authenticate and Authorize Line-of-Business Apps in Azure Websites" 
	description="Learn the different authentication and authorization options for line-of-business applications that are deployed to Azure Websites" 
	services="web-sites" 
	documentationCenter="" 
	authors="cephalin" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="web-sites" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="web" 
	ms.date="02/12/2015" 
	ms.author="cephalin"/>

# Authenticate and Authorize Users in Line-of-Business Applications in Azure Websites #

[Azure Websites](/services/websites/) enables enterprise line-of-business application scenarios by supporting single sign-on (SSO) of users whether they access the application from your on-premises environment or the public internet. It can be integrated with [Azure Active Directory](/services/active-directory/) (AAD) or on-premises secure token service (STS), such as Active Directory Federation Services (AD FS), to authenticate your internal Active Directory (AD) users and authorize them properly.

## Zero-friction authentication and authorization ##

With a few clicks of the button, you can enable authentication and authorization for your website. The checkbox style configuration in every Azure website provides the basic access control of your LOB website. It does so by enforcing HTTPS and authentication to an Azure AD tenant of your choice before granting users access to all website content. For more information, see [Azure Websites Authentication / Authorization](http://azure.microsoft.com/blog/2014/11/13/azure-websites-authentication-authorization/).

>[AZURE.NOTE] This feature is currently in preview.

## Manually implement authentication and authorization ##

In many scenarios, you want to customize the authentication and authorization behavior of the application, such as a login and logout page, custom authorization logic, mult-tenant application behavior, and so on. In these cases, it may be better to configure authentication and authorization manually for greater flexibility of its features. Below are two main options  

-	[Azure AD](../web-sites-dotnet-lob-application-azure-ad/) - You can implement authentication and authorization for your website with Azure AD. Using Azure AD as the identity provider has the following characteristics:
	-	Supports popular authentication protocols, such as [OAuth 2.0](http://oauth.net/2/), [OpenID Connect](http://openid.net/connect/), and [SAML 2.0](http://en.wikipedia.org/wiki/SAML_2.0). For the complete list of supported protocols, see [Azure Active Directory Authentication Protocols](http://msdn.microsoft.com/library/azure/dn151124.aspx).
	-	Can use an Azure-only identity provider without any on-premise infrastructure.
	-	Can also configure directory sync with an on-premise AD (managed on-premise).
	-	Azure AD with directory sync from your on-premise AD domain enables a smooth SSO experience to your website when AD users access from the intranet and the internet. From the intranet, AD users can automatically access the website through Integrated Authentication. From the internet, AD users can log into the website using their Windows credentials.
	-	Provides SSO to [all applications supported by Azure AD](/marketplace/active-directory/), including Azure, Office 365, Dynamics CRM Online, Windows InTune, and thousands of non-Microsoft cloud applications. 
	-	Azure AD delegates management of [relying party](http://en.wikipedia.org/wiki/Relying_party) applications to non-administrator roles, while application access to sensitive directory data must still be configured by global administrators.
	-	Sends a general-purpose set of claim types for all relying party applications. For the list of claim types, see [Supported Token and Claim Types](http://msdn.microsoft.com/library/azure/dn195587.aspx). Claims are not customizable.
	-	[Azure AD Graph API](http://msdn.microsoft.com/library/azure/hh974476.aspx) enables application access to directory data in Azure AD.
-	[On-premise secure token service (STS), such as AD FS](../web-sites-dotnet-lob-application-adfs/) - You can implement authentication and authorization for your website with an on-premise STS like AD FS. Using on-premise AD FS has the following characteristics:
	-	AD FS topology must be deployed on-premise, with cost and management overhead.
	-	Best when company policy demands that AD data be stored on-premise.
	-	Only AD FS administrators can configure [relying party trusts and claim rules](http://technet.microsoft.com/library/dd807108.aspx).
	-	Can manage [claims](http://technet.microsoft.com/library/ee913571.aspx) on a per-application basis.
	-	Must have a separate solution for accessing on-premise AD data through the corporate firewall.
