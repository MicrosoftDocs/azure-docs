<properties
   pageTitle="How to build an Azure AD Multi-Tenant Application"
   description="This article will walk you through the concepts and steps required, to build a SaaS application that can authenticate a user from any Azure AD tenant."
   services="active-directory"
   documentationCenter="dev-center-name"
   authors="bryanla"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="07/15/2015"
   ms.author="bryanla;skwan"/>

# How to enable your application to authenticate any Azure Active Directory user

This is the first in a series of "HowTo" articles, directed toward Software as a Service (SaaS) application developers. SaaS applications are usually built by Cloud Service Vendor (CSV) or Independent Software Vendor (ISV) developers, who need to make their applications available as a shared service to multiple organizations, vs. an application dedicated to a single organization.  

Whether you've set out to build a SaaS application from the start, need to convert your application to SaaS architecture, or want to explore integration with Azure Active Directory (AD), this article will help you understand the role Azure AD can play in your authentication design and implementation.

## Overview

For the purposes of this article, let's define SaaS in terms of a ***multi-tenant*** application architecture: one that needs to share it's code across ***multiple*** organizations, while enforcing secure/isolated data access on a per-organization basis (aka: ***tenant***).  Once a user is authenticated, the application can access user data in a secure fashion, operating under the context of the user's identity.  Let's also assume that we have 2 SaaS applications in the mix:
 
- your SaaS application, which uses multi-tenancy to partition/secure *user* data 
- Azure AD, which uses multi-tenancy to partion/secure *directory* data

With those definitions, the opportunity for leveraging Azure AD to authenticate your application's users becomes clearer.  Specifically, for the set of organizations/tenants that subscribe to both your application AND Microsoft Azure, you can design your application to delegate authentication of all of those users to their Azure AD tenant. That means any new subscribers that also have an Azure subscription, can authenticate using their Azure AD credentials going forward, with no additional architectural or coding changes required. When you consider the user base that already has Azure AD credentials (including Office 365 subscribers, for example), this creates a huge opportunity that could be appealing to both you and your subscribers.

Finally, let's reinforce these concepts by considering the topology that exists between the large multi-tenant SaaS applications found in Office 365 and their relationship to Azure AD, and comparing it with a simple Azure scenario.  When you sign up for an Azure subscription, you automatically get an Azure AD tenant, which the subscription *trusts* for it's identity needs.  Applications you build in Azure are also assigned to the subscription, allowing them to take advantage of your Azure AD tenant for user account management and authentication.  In the same way that an Azure application accesses Azure AD services through a subscription, Office 365 SaaS tenants are *also* associated with their an Azure AD tenant through a subscription, to provide user account management and authentication.  Further, any common subscribers between Office 365 and our Azure application, can use their Office 365 credentials to authenticate with our Azure application, just by enabling our Azure application to be aware of multiple Azure AD tenants.

![O365-AD-Topology][1]

## Prerequisites
As we walk through the relevant concepts for this scenario, we will prescriptively show you how to apply those concepts using a set of related code samples, reinforcing the concepts. It is assumed that you have a basic understanding of Azure AD, including [why/how you would integrate your application with Azure AD] [ACOM-How-To-Integrate], as well as the [basics of Azure AD authentication and supported authentication scenarios](active-directory-authentication-scenarios).

You should also be comfortable editing your Azure AD tenant's application configurations in the [Azure portal][Azure-portal]


> [AZURE!NOTE] This is an early version of this article.  The final version will go 
> into more depth on each of the topics discussed below, relating each to a corresponding
> code sample

## Best practices
- Azure AD application configuration
	- App ID URI: provides a unique/logical identifier which AAD associates with this application. In order to configure this application as Multi-Tenant, the "App ID URI" must be in a verified custom domain for an external user to grant your application access to their AAD data (ie:  xxxx.Test.OnMicrosoft.Com , if your directory domain is  Test.OnMicrosoft.Com ). It must also be unique within your directory, and therefore not being used as the "App ID URI" for any other applications.

	- Multi-Tenant: must be set to "yes", indicating that your application requires consent from owners of multiple AAD tenants, to grant access to their directories. 

- Consent experience 
	- on first use (consider dev, ITPro, end user experiences)
	- User vs. Admin consent
		- Users can consent to the app if it only needs access to personal permissions, otherwise needs admin consent
		- once the app is consented it will appear in the user's tenant (if it’s a web app)

- Known clients 
	- by topology

- Authenticating with the Common Endpoint 
	- required when you're authenticating with multiple Azure AD tenants because you don't know which Azure AD tenant your users belong to.

- Issuer/Token Validation - must be handled by your application

- Managing the sign-in experience and best practices
	- The user should be presented with a form that walks them through the registration process. Here they can choose if they want to follow the "admin consent" flow (the app gets provisioned for all the users in one organization - requiring the user to sign up using an administrator) or the "user consent" flow (the app gets provisioned for one user only). 

	- When they attempt to authenticate, they will be transferred to the Azure AD portal, to sign in as the user they want to use for consenting. If the user is from an Azure AD tenant that is different from the one associate with your application, they will be presented with a consent page.

- Multi-tenant Code samples
	- [Github One] [GH1]
	- [Github Two] [GH2]
	- [Github Three] [GH3]

## Next steps

[How to integrate an application with Azure AD](active-directory-how-to-integrate).

<!--Image references-->
[1]: ./media/active-directory-devhowto-auth-using-any-aad/multi-tenant-aad.png

<!--Reference style links -->
[ACOM-How-To-Integrate]: active-directory-how-to-integrate
[Azure-portal]: https://manage.azure.com
[GH1]: https://github.com/AzureADSamples/WebApp-MultiTenant-OpenIdConnect-DotNet
[GH2]: https://github.com/AzureADSamples/WebApp-WebAPI-MultiTenant-OpenIdConnect-DotNet
[GH3]: https://github.com/AzureADSamples/NativeClient-WebAPI-MultiTenant-WindowsStore
 
