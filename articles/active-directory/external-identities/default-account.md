---

title: Add Microsoft Entra account as an identity provider
description: Use Microsoft Entra ID to enable an external user (guest) to sign in to your Microsoft Entra apps with their Microsoft Entra work or school account.

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
# Customer intent: As a tenant administrator, I want to add Microsoft Entra ID as an identity provider for external guest users.
---

# Add Microsoft Entra ID as an identity provider for External ID

Microsoft Entra ID is available as an identity provider option for B2B collaboration by default. If an external guest user has a Microsoft Entra account through work or school, they can redeem your B2B collaboration invitations or complete your sign-up user flows using their Microsoft Entra account.

<a name='guest-sign-in-using-azure-active-directory-accounts'></a>

## Guest sign-in using Microsoft Entra accounts

If you want to enable guest users to sign in with their Microsoft Entra account, you can use either the invitation flow or a self-service sign-up user flow. No additional configuration is required.

:::image type="content" source="media/default-account/default-account-identity-provider.png" alt-text="Screenshot of Microsoft Entra account in the identity provider list." lightbox="media/default-account/default-account-identity-provider.png":::

<a name='azure-ad-account-in-the-invitation-flow'></a>

### Microsoft Entra account in the invitation flow

When you [invite a guest user](add-users-administrator.md) to B2B collaboration, you can specify their Microsoft Entra account as the **Email address** they'll use to sign in.

:::image type="content" source="media/default-account/default-account-invite.png" alt-text="Screenshot of inviting a guest user using the Microsoft Entra account." lightbox="media/default-account/default-account-invite.png":::

<a name='azure-ad-account-in-self-service-sign-up-user-flows'></a>

### Microsoft Entra account in self-service sign-up user flows

Microsoft Entra account is an identity provider option for your self-service sign-up user flows. Users can sign up for your applications using their own Microsoft Entra accounts. First, you'll need to [enable self-service sign-up](self-service-sign-up-user-flow.md) for your tenant. Then you can set up a user flow for the application and select Microsoft Entra ID as one of the sign-in options.

:::image type="content" source="media/default-account/default-account-user-flow.png" alt-text="Screenshot of Microsoft Entra account in a self-service sign-up user flow." lightbox="media/default-account/default-account-user-flow.png":::

## Verifying the application's publisher domain
As of November 2020, new application registrations show up as unverified in the user consent prompt unless [the application's publisher domain is verified](../develop/howto-configure-publisher-domain.md), ***and*** the company’s identity has been verified with the Microsoft Partner Network and associated with the application. ([Learn more](../develop/publisher-verification-overview.md) about this change.) For Microsoft Entra user flows, the publisher’s domain appears only when using a [Microsoft account](microsoft-account.md) or other Microsoft Entra tenant as the identity provider. To meet these new requirements, follow these steps:

1. [Verify your company identity using your Microsoft Partner Network (MPN) account](/partner-center/verification-responses). This process verifies information about your company and your company’s primary contact.
1. Complete the publisher verification process to associate your MPN account with your app registration using one of the following options:
   - If the app registration for the Microsoft account identity provider is in a Microsoft Entra tenant, [verify your app in the App Registration portal](../develop/mark-app-as-publisher-verified.md).
   - If your app registration for the Microsoft account identity provider is in an Azure AD B2C tenant, [mark your app as publisher verified using Microsoft Graph APIs](../develop/troubleshoot-publisher-verification.md#making-microsoft-graph-api-calls) (for example, using Graph Explorer).

## Next steps

- [Microsoft account](microsoft-account.md)
- [Add Microsoft Entra B2B collaboration users](add-users-administrator.md)
- [Add self-service sign-up to an app](self-service-sign-up-user-flow.md)
