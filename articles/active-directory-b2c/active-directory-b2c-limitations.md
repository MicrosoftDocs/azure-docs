<properties
	pageTitle="Azure Active Directory B2C preview: Limitations & restrictions | Microsoft Azure"
	description="A list of limitations & restrictions with Azure Active Directory B2C"
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/28/2015"
	ms.author="swkrish"/>

# Azure Active Directory B2C preview: Limitations & Restrictions

There are several features & functionalities of Azure Active Directory (AD) B2C that are not yet supported during the preview. Many of these limitations will be removed before Azure AD B2C reaches general availability, but you should be aware of them if you are building consumer-facing applications using Azure AD B2C during preview.

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

## Issues during Creation of Azure AD B2C Directories

There are known issues that you may encounter during the [creation of an Azure AD B2C tenant](active-directory-b2c-get-started). Check out this [article](active-directory-b2c-support-create-directory.md) for guidance.

## Branding issues on Verification Emails and Self-service Password Reset Pages

The default verification emails and self-service password reset pages contain "Microsoft" and "Azure" branding elements. We will remove these going forward. You can change the branding on these pages using the [company branding feature](./active-directory/active-directory-add-company-branding.md), upon which these branding elements will not appear.

## Support for Production Applications

Applications that integrate with Azure AD B2C should not be released to the public as production level applications. Azure AD B2C is in preview at this time - breaking changes may be introduced at any point in time, and there is no SLA guaranteed by the service. Support will not be provided for any incidents that may occur. If you are willing to accept the risks of taking a dependency on a service that is still in development, you must tweet us @AzureAD to discuss the scope of your application or service.

## Restrictions on Applications

The following types of applications are not currently supported in Azure AD B2C preview. For a description of the supported types of applications, refer to this [article](active-directory-b2c-apps).

### Single Page Applications (Javascript)

Many modern applications have a Single Page Application (SPA) front-end written primarily in Javascript and often using a SPA frameworks such as AngularJS, Ember.js, Durandal, etc. This flow is not yet available in Azure AD B2C preview.

### Daemons / Server Side Applications

Applications that contain long running processes or that operate without the presence of a user also need a way to access secured resources, such as Web APIs. These applications can authenticate and get tokens using the application's identity (rather than a consumer's delegated identity) using the [OAuth 2.0 client credentials flow](active-directory-b2c-protocols.md#oauth2-client-credentials-grant-flow). This flow is not yet available in Azure AD B2C preview - which is to say that applications can only get tokens after an interactive consumer sign-in flow has occurred.

### Standalone Web APIs

In the Azure AD B2C preview, you have the ability to [build a Web API that is secured using OAuth 2.0 tokens](active-directory-b2c-apps.md#web-apis). However, that Web API will only be able to receive tokens from a client that shares the same Application ID. Building a Web API that is accessed from several different clients is not supported.

### Web API Chains (On-Behalf-Of)

Many architectures include a Web API that needs to call another downstream Web API, both secured by Azure AD B2C.  This scenario is common in native clients that have a Web API backend, which in turn calls a Microsoft Online service such as the Azure AD Graph API.

This chained Web API scenario can be supported using the OAuth 2.0 Jwt Bearer Credential grant, otherwise known as the On-Behalf-Of Flow. However, the On-Behalf-Of flow is not currently implemented in the Azure AD B2C preview.

## Restriction on Libraries & SDKs

Not all languages and platforms have libraries that support Azure AD B2C preview. The set of authentication libraries is currently limited to .NET, iOS, Android and NodeJS. Corresponding quick start tutorials for each are available in our [Getting Started](active-directory-b2c-overview.md#getting-started) section.

If you wish to integrate an application with Azure AD B2C preview using another language or platform, refer to the [OAuth 2.0 and OpenID Connect Protocol Reference](active-directory-b2c-protocols.md) which will instruct you on how to construct the HTTP messages necessary to communicate with the Azure AD B2C service.

## Restriction on Protocols

Azure AD B2C preview supports OpenID Connect and OAuth 2.0. However, not all features and capabilities of each protocol have been implemented. To better understand the scope of supported protocol functionality in Azure AD B2C preview, read through our [OpenID Connect and OAuth 2.0 protocol reference](active-directory-b2c-protocols.md).

## Restriction on Tokens

Many of the tokens issued by Azure AD B2C preview are implemented as JSON Web Tokens, or JWTs. However, not all information contained in JWTs (known as "claims") is quite as it should be or is missing. Some examples include the "sub" and the "preferred_username" claims. You should expect things here to change quite a bit during the preview. To better understand the tokens emitted currently by the Azure AD B2C service, read through our [token reference](active-directory-b2c-tokens.md).

## Issues with User Management on the Azure Portal

B2C features are accessible on the Azure preview portal. However, you can use the Azure portal to access other tenant features, including user management. Currently there are a couple of known issues with user management (the **Users** tab) on the Azure portal.

- For a local account user (i.e., a consumer who signs up with an email address & password or a username & password), the **User Name** field doesn't correspond to the sign-in identifier (email address or username) used during sign-up. This is because the field displayed on the Azure portal is actually the User Principal Name (UPN), which is unused in B2C scenarios. To view the sign-in identifier of the local account, find the user object in [Graph Explorer](https://graphexplorer.cloudapp.net/). You will find the same issue with a social account user (i.e., a consumer who signs up with Facebook, Google+, etc.), but in that case, there is no sign-in identifier to speak of.

    ![Local account - UPN](./media/active-directory-b2c-limitations/limitations-user-mgmt.png)

- For a local account user, you will not able to edit any of the fields and save changes on the **Profile** tab. We will fix this soon.

## Issues with Admin-initiated Password Reset on the Azure Portal

If you reset the password for a local account-based consumer on the Azure Portal (the **Reset Password** command on the **Users** tab), that consumer will not be able to change his or her password on the next sign-in & will be locked out of your applications. We are working on fixing this issue. As a workaround, use the [Azure AD Graph API](active-directory-b2c-devquickstarts-graph-dotnet.md) to reset the consumer's password.

## Restriction on Deletion of Azure AD B2C Directories

You won't be able to delete an Azure AD B2C tenant in the Azure portal.
