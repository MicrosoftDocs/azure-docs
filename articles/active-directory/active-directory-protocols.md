<properties
	pageTitle="Active Directory Authentication Protocols | Microsoft Azure"
	description="This article provides an overview of the various authentication and authorization protocols that Azure Active Directory supports."
	services="active-directory"
	documentationCenter=".net"
	authors="priyamohanram"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/06/2016"
	ms.author="priyamo"/>

# Active Directory Authentication Protocols

Azure Active Directory (Azure AD) supports several of the most widely used authentication and authorization protocols.

In this set of articles, we'll look at the supported protocols and their implementation in Azure AD. We'll have sample requests and responses, and since we're integrating directly with the protocols, these articles are largely language-independent.

- [OAuth 2.0 authorization code grant](active-directory-protocols-oauth-code.md): Learn about the OAuth2.0 "authorization code" authorization grant and its implementation in Azure AD.
- [OAuth 2.0 implicit grant](active-directory-dev-understanding-oauth2-implicit-grant.md) : Learn about the OAuth 2.0 "implicit" authorization grant, and whether it's right for your application.
- [Open ID Connect 1.0](active-directory-protocols-openid-connect-code.md): Learn how to use OpenID Connect authentication protocol in Azure AD.
- [SAML Protocol Reference](active-directory-saml-protocol-reference.md): Learn how to use the SAML protocol to support [Single Sign-On](active-directory-single-sign-on-protocol-reference.md) and [Single Sign-Out](active-directory-single-sign-out-protocol-reference.md) in Azure AD.


## Reference and Troubleshooting

This set of articles provides additional information that could be useful for troubleshooting your Azure AD applications, as well as help you understand Azure AD at a deeper level.

- [Federation Metadata](active-directory-federation-metadata.md): Learn how to find and interpret the metadata documents that Azure AD generates.
- [Supported Token and Claim Types](active-directory-token-and-claims.md): Learn about the different claims in the tokens that Azure AD issues.
- [Signing Key Rollover in Azure AD](active-directory-signing-key-rollover.md): Learn about Azure AD’s signing key rollover cadence and how to update the key for the most common application scenarios.
- [Troubleshooting Authentication Protocols](active-directory-error-handling.md): Learn how to interpret and resolve the most common errors when using OAuth 2.0 and Azure AD.
- [Best Practices for OAuth 2.0 in Azure AD](active-directory-oauth-best-practices.md): Learn about the best practices when using OAuth 2.0 in Azure AD and avoid common pitfalls.
