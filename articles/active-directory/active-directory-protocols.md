<properties
	pageTitle="Active Directory Authentication Protocols | Microsoft Azure"
	description="Active Directory Authentication Protocols"
	services="active-directory"
	documentationCenter=".net"
	authors="priyamohanram"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="01/21/2016"
	ms.author="priyamo"/>

# Active Directory Authentication protocols

Azure AD supports several of the most widely used authentication and authorization protocols.

In this set of articles, we'll look at the supported protocols and their implementation in Azure AD. We'll have sample requests and responses, and since we're integrating directly with the protocols, these articles are largely language-independent.

- [OAuth 2.0 in Azure AD](active-directory-protocols-oauth-code.md): Learn about the OAuth2.0 authorization grant flow and it's implementation in Azure AD.
- [Open ID Connect 1.0](active-directory-protocols-openid-connect-code.md): Learn how to use OpenID Connect authentication protocol in Azure AD.
- [SAML Protocol Reference](active-directory-saml-protocol-reference,md): Learn how to use the SAML protocol to support Single Sign-On and Single Sign-Out in Azure AD.


## Troubleshooting Azure AD Authentication Protocols

This set of articles provides additional information that could be useful for troubleshooting your Azure AD applications, as well as help you understand Azure AD at a deeper level.

- [Federation Metadata](active-directory-federation-metadata.md): Learn how to find and interpret the metadata documents that Azure AD generates.
- [Supported Token and Claim Types](active-directory-token-and-claims.md): Learn about the different claims in the tokens that Azure AD issues.
- [Signing Key Rollover in Azure AD](active-directory-signing-key-rollover.md): Learn about Azure AD’s signing key rollover cadence and how to update the key for the most common application scenarios.
- [Troubleshooting Authentication Protocols](active-directory-error-handling.md): Learn how to interpret and resolve the most common errors when using OAuth 2.0 and Azure AD.
- [Best Practices for OAuth 2.0 in Azure AD](active-directory-oauth-best-practices,md): Learn about the best practices when using OAuth 2.0 in Azure AD and avoid common pitfalls. 
