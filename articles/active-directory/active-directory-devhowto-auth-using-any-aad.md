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
   ms.date="07/10/2015"
   ms.author="bryanla;skwan"/>

# How to enable your application to authenticate any Azure Active Directory user

This is the first in a series of "HowTo" articles, directed toward Software as a Service (SaaS) application developers. SaaS applications are typically built by Cloud Service Vendor (CSV) or Independent Software Vendor (ISV) developers, who need to make their applications available as a shared service to multiple organizations, vs. an application dedicated to a single organization.  

Whether you've set out to build a SaaS application from the start, need to convert your application to SaaS architecture, or want to explore integration with Azure Active Directory (AD), this article will help you understand the role Azure AD can play in your authentication design and implementation.

## Overview

### Defining multi-tenant
For the purposes of this article, let's define SaaS in terms of a ***multi-tenant*** application architecture: one that needs to share it's code across ***multiple*** organizations, while enforcing secure/isolated data access on a per-organization basis (aka: ***tenant***).  Once a user is authenticated, the application can access user data in a secure fashion, operating under the context of the user's identity.  Let's also assume that we have 2 SaaS applications in the mix:
 
- your SaaS application, which uses multi-tenancy to partition/secure *user* data 
- Azure AD, which uses multi-tenancy to partion/secure *directory* data

### Integrating with multiple Azure AD tenants
With those definitions, the opportunity for leveraging Azure AD to authenticate your application's users becomes clearer.  Specifically, for the set of organizations/tenants that subscribe to both your application AND Microsoft Azure, you can design your application to delegate authentication of all of those users to their Azure AD tenant. That means any new subscribers that also have an Azure subscription, can authenticate using their Azure AD credentials going forward, with no additional architectural or coding changes required. When you consider the user base that already has Azure AD credentials (including Office 365 subscribers, for example), this creates a huge opportunity that could be appealing to both you and your subscribers.

### A real world example
Finally, let's reinforce these concepts by considering the topology that exists between the large multi-tenant SaaS applications found in Office 365 and their relationship to Azure AD, and comparing it with a simple Azure scenario.  When you sign up for an Azure subscription, you automatically get an Azure AD tenant, which the subscription *trusts* for it's identity needs.  Applications you build in Azure are also assigned to the subscription, allowing them to take advantage of your Azure AD tenant for user account management and authentication.  

In the same way that an Azure application accesses Azure AD services through a subscription, Office 365 SaaS tenants are *also* associated with an  Azure AD tenant via a subscription, for user account management and authentication.  Further, any common subscribers between Office 365 and our Azure application, can use their Office 365 credentials to authenticate with our Azure application, just by enabling our Azure application to be aware of multiple Azure AD tenants.  

![O365-AD-Topology][1]

We will spend the remainder of this article on exactly that: helping you understand how you can *build/enable multi-tenant aware applications*, where tenant refers to an Azure AD tenant.

## Prerequisites
As we walk through the relevant concepts for this scenario, we will prescriptively show you how to apply those concepts using a set of related code samples, reinforcing the concepts. It is assumed that you have a basic understanding of Azure AD, including [why/how you would integrate your application with Azure AD] [ACOM-How-To-Integrate], as well as the [basics of Azure AD authentication and supported authentication scenarios] [ACOM-Auth-Scenarios].

You should also be comfortable editing your Azure AD tenant's application configurations in the [Azure portal][Azure-portal]


> [AZURE.NOTE] 
This is an early version of this article.  The final version will go into more depth on each of the topics discussed below, providing narrative for the corresponding implementations in the code samples.

## Best practices
### Azure AD application configuration

- App ID URI: provides a unique/logical identifier which AAD associates with this application. In order to configure this application as Multi-Tenant, the "App ID URI" must be in a verified custom domain for an external user to grant your application access to their AAD data (ie:  xxxx.Test.OnMicrosoft.Com , if your directory domain is  Test.OnMicrosoft.Com ). It must also be unique within your directory, and therefore not being used as the "App ID URI" for any other applications.

- Multi-Tenant: must be set to "yes", indicating that your application requires consent from owners of multiple AAD tenants, to grant access to their directories. 

### Consent experience 

- on first use (consider dev, ITPro, end user experiences)
- User vs. Admin consent
	- Users can consent to the app if it only needs access to personal permissions, otherwise needs admin consent
	- once the app is consented it will appear in the user's tenant (if it’s a web app)

### Known clients 
- by topology

### Authenticating with the Common Endpoint 
- required when you're authenticating with multiple Azure AD tenants because you don't know which Azure AD tenant your users belong to.

### Issuer/Token Validation 
- must be handled by your application

### Managing the sign-up/sign-in experience and best practices
- The user should be presented with a form that walks them through the registration process. Here they can choose if they want to follow the "admin consent" flow (the app gets provisioned for all the users in one organization - requiring the user to sign up using an administrator) or the "user consent" flow (the app gets provisioned for one user only). 

- When they attempt to authenticate, they will be transferred to the Azure AD portal, to sign in as the user they want to use for consenting. If the user is from an Azure AD tenant that is different from the one associate with your application, they will be presented with a consent page.

### Code samples
The following code samples show you how to authenticate user accounts from any Azure Active Directory tenant, by implementing authentication for various types of client applications, including a Web app, Web API, and Native client

- [WebApp-MultiTenant-OpenIdConnect-DotNet] [GH1] is a .Net MVC Web sample that also shows you how to:
	- build a .Net MVC Web app client 
	- provide a registration/sign-up experience
	- use the ASP.Net OpenID Connect OWIN middleware and the Active Directory 
		
- [WebApp-WebAPI-MultiTenant-OpenIdConnect-DotNet] [GH2] is a .Net MVC Web sample that shows you how to:
	- build a .Net MVC Web app client and Web API client 
	- call a web API that is secured using Azure AD 
	- provide a registration/sign-up experience
	- use the ASP.Net OpenID Connect OWIN middleware and the Active Directory 
	- leverage the authorization code received at sign in time to invoke the Graph API

- [NativeClient-WebAPI-MultiTenant-WindowsStore] [GH3] is a Windows Store application  and Web API sample that shows you how to
	- build a Native Windows store client and Web API client
	- call a web API that is secured using Azure AD 
	- provide a registration/sign-up experience
	- use the Active Directory Authentication Library (ADAL) to obtain a JWT access token through the OAuth 2.0 protocol, which is sent to the web API to authenticate the user

For more information about how the protocols work in this scenario and other scenarios, see [Authentication Scenarios for Azure AD] [ACOM-Auth-scenarios]

## Next steps

[How to integrate an application with Azure AD] [ACOM-How-To-Integrate].

<!--Image references-->
[1]: ./media/active-directory-devhowto-auth-using-any-aad/multi-tenant-aad.png

<!--Reference style links -->
[ACOM-How-To-Integrate]: ./active-directory-how-to-integrate.md
[ACOM-Auth-Scenarios]: ./active-directory-authentication-scenarios.md
[Azure-portal]: https://manage.windowsazure.com
[GH1]: https://github.com/AzureADSamples/WebApp-MultiTenant-OpenIdConnect-DotNet
[GH2]: https://github.com/AzureADSamples/WebApp-WebAPI-MultiTenant-OpenIdConnect-DotNet
[GH3]: https://github.com/AzureADSamples/NativeClient-WebAPI-MultiTenant-WindowsStore
 
