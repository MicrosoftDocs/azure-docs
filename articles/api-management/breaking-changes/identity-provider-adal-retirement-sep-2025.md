---
title: Azure API Management identity providers configuration change (September 2025) | Microsoft Docs
description: Azure API Management is updating the library used for user authentication in the developer portal. If you use Microsoft Entra ID or Azure AD B2C identity providers, you need to update application settings and identity provider configuration to use the Microsoft Authentication Library (MSAL).
services: api-management
documentationcenter: ''
author: mikebudzynski
ms.service: api-management
ms.topic: reference
ms.date: 09/06/2022
ms.author: mibudz
---

# ADAL-based Microsoft Entra ID or Azure AD B2C identity provider retirement (September 2025)

On 30 September, 2025 as part of our continuing work to increase the resiliency of API Management services, we're removing the support for the previous library for user authentication and authorization in the developer portal (AD Authentication Library, or ADAL). You need to migrate your Microsoft Entra ID or Azure AD B2C applications, change identity provider configuration to use the Microsoft Authentication Library (MSAL), and republish your developer portal.

This change will have no effect on the availability of your API Management service. However, you have to take steps described below to configure your API Management service if you wish to continue using Microsoft Entra ID or Azure AD B2C identity providers beyond 30 September, 2025.

## Is my service affected by this change?

Your service is impacted by this change if:

* You've configured an [Microsoft Entra ID](../api-management-howto-aad.md) or [Azure AD B2C](../api-management-howto-aad-b2c.md) identity provider for user account authentication using the ADAL and use the provided developer portal.

## What is the deadline for the change?

On 30 September, 2025, these identity providers will stop functioning. To avoid disruption of your developer portal, you need to update your Microsoft Entra applications and identity provider configuration in Azure API Management by that date. Your developer portal might be at a security risk after Microsoft ADAL support ends in June 1, 2023. 

Developer portal sign-in and sign-up with Microsoft Entra ID or Azure AD B2C will stop working past 30 September, 2025 if you don't update your ADAL-based Microsoft Entra ID or Azure AD B2C identity providers. This new authentication method is more secure, as it relies on the OAuth 2.0 authorization code flow with PKCE and uses an up-to-date software library. 

## What do I need to do?

<a name='update-azure-ad-and-azure-ad-b2c-applications-for-msal-compatibility'></a>

### Update Microsoft Entra ID and Azure AD B2C applications for MSAL compatibility

[Switch redirect URIs to the single-page application type](../../active-directory/develop/migrate-spa-implicit-to-auth-code.md#switch-redirect-uris-to-spa-platform).

### Update identity provider configuration

1. Go to the [Azure portal](https://portal.azure.com) and navigate to your Azure API Management service.
2. Select **Identities** in the menu.
3. Select **Microsoft Entra ID** or **Azure Active Directory B2C** from the list.
4. Select **MSAL** in the **Client library** dropdown.
5. Select **Update**.
6. [Republish your developer portal](../developer-portal-overview.md#publish-the-portal).


## Help and support

If you have questions, get answers from community experts in [Microsoft Q&A](https://aka.ms/apim/azureqa/change/msal-2022). If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

1. For **Summary**, type a description of your issue, for example, "stv1 retirement". 
1. Under **Issue type**, select **Technical**.  
1. Under **Subscription**, select your subscription.  
1. Under **Service**, select **My services**, then select **API Management Service**. 
1. Under **Resource**, select the Azure resource that you’re creating a support request for.  
1. For **Problem type**, select **Authentication and Security**. 
1. For **Problem subtype**, select **Microsoft Entra authentication** or **Azure Active Directory B2C Authentication**.


## More information

* [Authenticate users with Microsoft Entra ID](../api-management-howto-aad.md)
* [Authenticate users with Azure AD B2C](../api-management-howto-aad-b2c.md)
* [Microsoft Q&A](/answers/topics/azure-api-management.html)

## Next steps

See all [upcoming breaking changes and feature retirements](overview.md).
