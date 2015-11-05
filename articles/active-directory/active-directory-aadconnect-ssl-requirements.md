<properties
	pageTitle="Azure AD Connect - SSL Certificate Requirements | Microsoft Azure"
	description="The Azure AD Connect SSL Certificate requirements for using with AD FS."
	services="active-directory"
	documentationCenter=""
	authors="billmath"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/13/2015"
	ms.author="billmath"/>

# Azure AD Connect - SSL Certificate Requirements

**Important:** it’s strongly recommended to use the same SSL certificate across all nodes of your AD FS farm as well as all Web Application proxy servers.

- This certificate must be an X509 certificate.
- You can use a self-signed certificate on federation servers in a test lab environment; however, for a production environment, we recommend that you obtain the certificate from a public CA.
	- If using a certificate that is not publicly trusted, ensure that the certificate installed on each Web Application Proxy server is trusted on both the local server and on all federation servers
- Certificates based on CryptoAPI next generation (CNG) keys and key storage providers are not supported.  This means you must use a certificate based on a CSP (cryptographic service provider) and not a KSP (key storage provider).
- The identity of the certificate must match the federation service name (for example, fs.contoso.com).
	- The identity is either a subject alternative name (SAN) extension of type dNSName or, if there are no SAN entries, the subject name specified as a common name.  
	- Multiple SAN entries can be present in the certificate, provided one of them matches the federation service name.
	- If you are planning to use Workplace Join, an additional SAN is required with the value “enterpriseregistration.” followed by the User Principal Name (UPN) suffix of your organization, for example, enterpriseregistration.contoso.com.

Wild card certificates are supported.  
