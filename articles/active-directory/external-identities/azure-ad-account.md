---

title: Add Azure AD Account as an identity provider
description: Use Azure Active Directory to enable an external user (guest) to sign in to your Azure AD apps with their Azure AD work or school account.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 03/27/2023
ms.author: mimart
author: msmimart
manager: celestedg
ms.collection: M365-identity-device-management
ms.custom: engagement-fy23
# Customer intent: As a tenant administrator, I want to add Azure AD as an identity provider for external guest users.
---

# Add Azure Active Directory (Azure AD) as an identity provider for External Identities

Azure Active Directory is available as an identity provider option for B2B collaboration by default. If an external guest user has an Azure AD account through work or school, they can redeem your B2B collaboration invitations or complete your sign-up user flows using their Azure AD account.

## Guest sign-in using Azure Active Directory accounts

Azure Active Directory is available in the list of External Identities identity providers by default. No further configuration is needed to allow guest users to sign in with their Azure AD account using either the invitation flow or a self-service sign-up user flow.

:::image type="content" source="media/azure-ad-account/azure-ad-account-identity-provider.png" alt-text="Screenshot of Azure AD account in the identity provider list." lightbox="media/azure-ad-account/azure-ad-account-identity-provider.png":::

### Azure AD account in the invitation flow

When you [invite a guest user](add-users-administrator.md) to B2B collaboration, you can specify their Azure AD account as the **Email address** they'll use to sign in.

:::image type="content" source="media/azure-ad-account/azure-ad-account-invite.png" alt-text="Screenshot of inviting a guest user using the Azure AD account." lightbox="media/azure-ad-account/azure-ad-account-invite.png":::

### Azure AD account in self-service sign-up user flows

Azure AD account is an identity provider option for your self-service sign-up user flows. Users can sign up for your applications using their own Azure AD accounts. First, you'll need to [enable self-service sign-up](self-service-sign-up-user-flow.md) for your tenant. Then you can set up a user flow for the application and select Azure Active Directory as one of the sign-in options.

:::image type="content" source="media/azure-ad-account/azure-ad-account-user-flow.png" alt-text="Screenshot of Azure Ad account in a self-service sign-up user flow." lightbox="media/azure-ad-account/azure-ad-account-user-flow.png":::

## Verifying the application's publisher domain
As of November 2020, new application registrations show up as unverified in the user consent prompt unless [the application's publisher domain is verified](../develop/howto-configure-publisher-domain.md), ***and*** the company’s identity has been verified with the Microsoft Partner Network and associated with the application. ([Learn more](../develop/publisher-verification-overview.md) about this change.) For Azure AD user flows, the publisher’s domain appears only when using a [Microsoft account](microsoft-account.md) or other Azure AD tenant as the identity provider. To meet these new requirements, follow these steps:

1. [Verify your company identity using your Microsoft Partner Network (MPN) account](/partner-center/verification-responses). This process verifies information about your company and your company’s primary contact.
1. Complete the publisher verification process to associate your MPN account with your app registration using one of the following options:
   - If the app registration for the Microsoft account identity provider is in an Azure AD tenant, [verify your app in the App Registration portal](../develop/mark-app-as-publisher-verified.md).
   - If your app registration for the Microsoft account identity provider is in an Azure AD B2C tenant, [mark your app as publisher verified using Microsoft Graph APIs](../develop/troubleshoot-publisher-verification.md#making-microsoft-graph-api-calls) (for example, using Graph Explorer).

## Next steps

- [Microsoft account](microsoft-account.md)
- [Add Azure Active Directory B2B collaboration users](add-users-administrator.md)
- [Add self-service sign-up to an app](self-service-sign-up-user-flow.md)
