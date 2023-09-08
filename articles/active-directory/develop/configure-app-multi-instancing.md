---
title: Configure app multi-instancing
description: Learn about multi-instancing, which is needed for configuring multiple instances of the same application within a tenant.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.custom: aaddev, curation-claims
ms.workload: identity
ms.topic: how-to
ms.date: 06/09/2023
ms.author: davidmu
ms.reviewer: rahulnagraj, alamaral, jeedes
---

# Configure app multi-instancing

App multi-instancing refers to the need for the configuration of multiple instances of the same application within a tenant. For example, the organization has multiple accounts, each of which needs a separate service principal to handle instance-specific claims mapping and roles assignment. Or the customer has multiple instances of an application, which doesn't need special claims mapping, but does need separate service principals for separate signing keys.

## Sign-in approaches

A user can sign-in to an application one of the following ways:

- Through the application directly, which is known as service provider (SP) initiated single sign-on (SSO).
- Go directly to the identity provider (IDP), known as IDP initiated SSO. 

Depending on which approach is used within your organization, follow the appropriate instructions described in this article.

## SP initiated SSO

In the SAML request of SP initiated SSO, the `issuer` specified is usually the app ID URI. Utilizing App ID URI doesn't allow the customer to distinguish which instance of an application is being targeted when using SP initiated SSO.

### Configure SP initiated SSO

Update the SAML single sign-on service URL configured within the service provider for each instance to include the service principal guid as part of the URL. For example, the general SSO sign-in URL for SAML is `https://login.microsoftonline.com/<tenantid>/saml2`, the URL can be updated to target a specific service principal, such as `https://login.microsoftonline.com/<tenantid>/saml2/<issuer>`.

Only service principal identifiers in GUID format are accepted for the issuer value. The service principal identifiers override the issuer in the SAML request and response, and the rest of the flow is completed as usual. There's one exception: if the application requires the request to be signed, the request is rejected even if the signature was valid. The rejection is done to avoid any security risks with functionally overriding values in a signed request.

## IDP initiated SSO

The IDP initiated SSO feature exposes the following settings for each application:

- An **audience override** option exposed for configuration by using claims mapping or the portal. The intended use case is applications that require the same audience for multiple instances. This setting is ignored if no custom signing key is configured for the application.

- An **issuer with application id** flag to indicate the issuer should be unique for each application instead of unique for each tenant. This setting is ignored if no custom signing key is configured for the application.

### Configure IDP initiated SSO

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications**. 
1. Open any SSO enabled enterprise app and navigate to the SAML single sign-on blade.
1. Select **Edit** on the **User Attributes & Claims** panel.
1. Select **Edit** to open the advanced options blade.
1. Configure both options according to your preferences and then select **Save**.

## Next steps

- To learn more about how to configure this policy see [Customize app SAML token claims](./saml-claims-customization.md)
