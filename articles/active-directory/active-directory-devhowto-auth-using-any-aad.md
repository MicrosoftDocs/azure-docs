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
   ms.date="07/20/2015"
   ms.author="bryanla;skwan"/>

# How to enable your application to authenticate any Azure Active Directory user

This article is directed toward Software as a Service (SaaS) application developers. SaaS applications are typically built by Cloud Service Vendor (CSV) or Independent Software Vendor (ISV) developers, who need to make their applications available as a shared service to multiple organizations, vs. an application dedicated to a single organization.  

Whether you've set out to build a SaaS application from the start, need to convert your application to SaaS architecture, or want to explore integration with Azure Active Directory (AD), this article will help you understand the role Azure AD can play in your authentication design and implementation.

## Overview

### Defining multi-tenancy
In general, a multi-tenant application is one that shares ***multiple*** instances of its code, allowing it to enforce secure/isolated data access on a per-organization basis (aka: ***tenant***). For the purposes of this article, let's assume that we have 2 types of multi-tenancy in the mix:
 
- Your line-of-business (LOB) SaaS application, which can use multi-tenancy to partition/secure *business* data. Once a user is authenticated, the application accesses data in a secure fashion under the context of the authenticated user. 
- Azure AD, Identity Management as a Service (IDMaaS) software which uses multi-tenancy to partion/secure *directory* data, providing a single point of management for an organization's directory data, such as user accounts.  

We will spend the remainder of this article helping you learn how to build/enable your SaaS application to be *multi-tenant-aware*, where tenant refers to an Azure AD tenant, allowing your SaaS application to delegate authentication/authorization to your subscribers' Azure AD tenants.


### Integrating with multiple Azure AD tenants
With those definitions, the opportunity for leveraging Azure AD to authenticate your application's users becomes clearer.  Specifically, for the set of organizations that subscribe to both your application AND a service already using Azure AD, you can design your application to delegate authentication of all of those users to their Azure AD tenant. That means any future subscribers that also use Azure AD, can authenticate using their Azure AD credentials going forward, with no additional architectural or coding changes required. When you consider the user base that already has Azure AD credentials (including Office 365 subscribers, for example), this creates a huge opportunity that could be appealing to both you and your subscribers.

### A real world example
Finally, let's reinforce these concepts by considering the topology that exists between the large multi-tenant SaaS applications found in Office 365 and their relationship to Azure AD, and comparing it with a simple Azure SaaS application scenario.  

When you sign up for an Azure subscription, you automatically get an Azure AD tenant, which the subscription *trusts* for it's identity needs.  Applications you build in Azure are also assigned to the subscription, allowing them to take advantage of the Azure AD tenant for user account management, authentication, authorization, etc..  

In the same way that the Azure SaaS application accesses Azure AD services through a subscription, Office 365 SaaS tenants are *also* associated with their own Azure AD tenant via a subscription, providing each subscriber with user account management and authentication.  Further, any common subscribers between Office 365 and the Azure application, can use their Office 365 credentials to authenticate with the Azure application, just by enabling the application to be aware of multiple Azure AD tenants.  

![O365-AD-Topology][1]

## Prerequisites
As we walk through the relevant concepts for this scenario, we will show you how to apply and reinforce those concepts using a set of related code samples. It is assumed that you have a basic understanding of Azure AD, including [why/how you would integrate your application with Azure AD] [ACOM-How-To-Integrate], as well as the [basics of Azure AD authentication and supported authentication scenarios] [ACOM-Auth-Scenarios].

You should also be comfortable editing your Azure AD tenant's application configurations in the [Azure portal][Azure-portal]


> [AZURE.NOTE] 
This is an early version of this article.  The final version will go into more depth on each of the topics discussed below, providing narrative for the corresponding implementations in the code samples.

## Best practices
### Azure AD application configuration
TODO: provide an overview of Azure AD application configuration requirements for AzureAD multi-tenancy

- App ID URI: provides a unique/logical identifier which AAD associates with this application. In order to configure this application as Multi-Tenant, the "App ID URI" must be in a verified custom domain for an external user to grant your application access to their AAD data (ie:  xxxx.Test.OnMicrosoft.Com , if your directory domain is  Test.OnMicrosoft.Com ). It must also be unique within your directory, and therefore not being used as the "App ID URI" for any other applications.

- Multi-Tenant: must be set to "yes", indicating that your application requires consent from owners of multiple AAD tenants, to grant access to their directories. 

### Known clients by topology 
For the client application to be able to call a Web API on an Azure AD tenant other than the one where you developed the app, you need to explicitly bind the client app entry in Azure AD with the entry for the Web API. You can do so by adding the client ID of the application to the manifest of the Web API by:

1. Log into the [Azure portal](https://manage.windowsazure.com)
2. Navigate to the Azure AD tenant and application configuration page
3. Retrieve the Web API manifest file 
4. In the manifest, locate the knownClientApplications property and add to it the client ID assigned to the application during registration. The manifest entry should look like the following:  
	"knownClientApplications": [ "94da0930-763f-45c7-8d26-04d5938baab2" ] 
5. Save the manifest 

### Consent experience 
TODO: Provide an overview of the consent experience

- on first use (consider dev, ITPro, end user experiences)
- User vs. Admin consent
	- Users can consent to the app if it only needs access to personal permissions, otherwise needs admin consent
	- once the app is consented it will appear in the user's tenant (if it’s a web app)
- point to Dan's new "Consent Framework Quickstart"?

### Managing the user registration experience
Your application may offer a registration experience for users, which automates the consent process. When they attempt to authenticate with your application, they will be transferred to the Azure AD portal, to sign in as the user they want to use for consenting. If the user is from an Azure AD tenant that is different from the one associated with your application, they will be presented with a consent page that will walk them through the registration process.  

The user can choose to either follow either :

- the "admin consent" flow, where the application gets provisioned for all the users in one organization, requiring the user to authenticate using administrator credentials
- the "user consent" flow, where the application gets provisioned for a single user

Once they click on a sign up (or sign-in) button, the application will need to redirect the browser to the Azure AD OAuth 2.0 authorize endpoint, or an OpenID Connect userinfo endpoint. These endpoints allow the application to get information about the new user by inspecting the id_token.  For the "admin consent" flow, you can also pass a prompt=admin_consent parameter to trigger the administrator consent experience, where the administrator will grant consent on behalf of their organization. On successful consent, the response will contain admin_consent=true. When redeeming an access token, you’ll also receive an id_token that will provide information on the organization and the administrator that signed up for your application.

### Authenticating with the Common Endpoint 
When your application needs to be able to authenticate with multiple Azure AD tenants, you don't know in advance which Azure AD tenant your users belong to. A single tenant application only needs to look in its own directory for a user, while a multi-tenant application needs to identify a specific user from all the directories in Azure AD. 

To accomplish this task, Azure AD provides a common authentication endpoint where any multi-tenant application can direct sign-in requests, instead of a tenant-specific endpoint. This endpoint is https://login.microsoftonline.com/common for all directories in Azure AD, whereas a tenant-specific endpoint might be https://login.microsoftonline.com/contoso.onmicrosoft.com. The common endpoint is especially important to consider when developing your application because you’ll need the necessary logic to handle multiple tenants during sign-in, sign-out, and token validation.

### Issuer/Token Validation 
- must be handled by your application

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
[OAuth-2]: http://tools.ietf.org/html/rfc6749
 
