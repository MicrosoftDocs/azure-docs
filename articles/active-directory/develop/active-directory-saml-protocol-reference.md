---
title: How the Microsoft identity platform uses the SAML protocol
description: This article provides an overview of the single sign-on and Single Sign-Out SAML profiles in Azure Active Directory.
services: active-directory
author: kenwith
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 11/4/2022
ms.author: kenwith
ms.custom: aaddev, engagement-fy23
ms.reviewer: paulgarn
---

# How the Microsoft identity platform uses the SAML protocol

The Microsoft identity platform uses the SAML 2.0 and other protocols to enable applications to provide a single sign-on (SSO) experience to their users. The [Single Sign-On (SSO)](single-sign-on-saml-protocol.md) and [Single Sign-Out](single-sign-out-saml-protocol.md) SAML profiles of Azure Active Directory (Azure AD) explain how SAML assertions, protocols, and bindings are used in the identity provider service.

The SAML protocol requires the identity provider (Microsoft identity platform) and the service provider (the application) to exchange information about themselves.

When an application is registered with Azure AD, the app developer registers federation-related information with Azure AD. This information includes the **Redirect URI** and **Metadata URI** of the application.

The Microsoft identity platform uses the cloud service's **Metadata URI** to retrieve the signing key and the logout URI. This way the Microsoft identity platform can send the response to the correct URL. In the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>; 

- Open the app in **Azure Active Directory** and select **App registrations**
- Under **Manage**, select **Authentication**. From there you can update the Logout URL. 

Azure AD exposes tenant-specific and common (tenant-independent) SSO and single sign-out endpoints. These URLs represent addressable locations, and aren't only identifiers. You can then go to the endpoint to read the metadata.

- The tenant-specific endpoint is located at `https://login.microsoftonline.com/<TenantDomainName>/FederationMetadata/2007-06/FederationMetadata.xml`. The *\<TenantDomainName>* placeholder represents a registered domain name or TenantID GUID of an Azure AD tenant. For example, the federation metadata of the `contoso.com` tenant is at: https://login.microsoftonline.com/contoso.com/FederationMetadata/2007-06/FederationMetadata.xml

- The tenant-independent endpoint is located at
  `https://login.microsoftonline.com/common/FederationMetadata/2007-06/FederationMetadata.xml`. In this endpoint address, *common* appears instead of a tenant domain name or ID.

## Next steps

For information about the federation metadata documents that Azure AD publishes, see [Federation Metadata](../azuread-dev/azure-ad-federation-metadata.md).
