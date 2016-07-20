<properties
	pageTitle="Azure AD SAML Protocol Reference | Microsoft Azure"
	description="This article provides an overview of the Single Sign-On and Single Sign-Out SAML profiles in Azure Active Directory."
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
	ms.date="06/23/2016"
	ms.author="priyamo"/>


# How Azure Active Directory uses the SAML protocol

Azure Active Directory (Azure AD) uses the SAML 2.0 protocol to enable applications to provide a single sign-on experience to their users. The [Single Sign-On](active-directory-single-sign-on-protocol-reference.md) and [Single Sign-Out](active-directory-single-sign-out-protocol-reference.md) SAML profiles of Azure AD explain how SAML assertions, protocols and bindings are used in the identity provider service.

SAML Protocol requires the identity provider (Azure AD) and the service provider (the application) to exchange information about themselves.

When an application is registered with Azure AD, the app developer registers federation-related information with Azure AD. This includes the **Redirect URI** and **Metadata URI** of the application.

Azure AD uses the **Metadata URI** of the cloud service to retrieve the signing key and the logout URI of the cloud service. If the application does not support a metadata URI, the developer must contact Microsoft support to provide the logout URI and signing key.

Azure Active Directory exposes tenant-specific and common (tenant-independent) single sign-on and single sign-out endpoints. These URLs represent addressable locations -- they are not just an identifiers -- so you can go to the endpoint to read the metadata.

 - The Tenant-specific endpoint is located at `https://login.microsoftonline.com/<TenantDomainName>/FederationMetadata/2007-06/FederationMetadata.xml`.  The <TenantDomainName> placeholder represents a registered domain name or TenantID GUID of an Azure AD tenant. For example, the federation metadata of the contoso.com tenant is at: https://login.microsoftonline.com/contoso.com/FederationMetadata/2007-06/FederationMetadata.xml

- The Tenant-independent endpoint is located at
`https://login.microsoftonline.com/common/FederationMetadata/2007-06/FederationMetadata.xml`.In this endpoint address, **common** appears, instead of a tenant domain name or ID.

For information about the Federation Metadata documents that Azure AD publishes, see [Federation Metadata](active-directory-federation-metadata.md).
