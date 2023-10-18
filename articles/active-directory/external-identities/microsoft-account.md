---

title: Add Microsoft account (MSA) as an identity provider
description: Use Microsoft Entra External ID to enable an external user (guest) to sign in to your Microsoft Entra apps with their Microsoft account (MSA).

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 01/12/2023

ms.author: mimart
author: msmimart
manager: celestedg
ms.collection: engagement-fy23, M365-identity-device-management

#Customer intent: As a Microsoft Entra administrator user, I want to set up an invitation flow or a self-service sign-up user flow for guest users, so they can sign into my Microsoft Entra apps with their Microsoft account (MSA).
---

# Add Microsoft account (MSA) as an identity provider for External Identities

Your B2B guest users can use their own personal Microsoft accounts for B2B collaboration without further configuration. Guest users can redeem your B2B collaboration invitations or complete your sign-up user flows using their personal Microsoft account.

Microsoft accounts are set up by a user to get access to consumer-oriented Microsoft products and cloud services, such as Outlook, OneDrive, Xbox LIVE, or Microsoft 365. The account is created and stored in the Microsoft consumer identity account system, run by Microsoft.

## Guest sign-in using Microsoft accounts

Microsoft account is available by default in the list of **External Identities** > **All identity providers**. No further configuration is needed to allow guest users to sign in with their Microsoft account, using either the invitation flow, or a self-service sign-up user flow.

:::image type="content" source="media/microsoft-account/microsoft-account-identity-provider.png" alt-text="Screenshot of Microsoft account in the identity providers list.":::

### Microsoft account in the invitation flow

When you [invite a guest user](add-users-administrator.md) to B2B collaboration, you can specify their Microsoft account as the email address they'll use to sign in.

:::image type="content" source="media/microsoft-account/microsoft-account-invite.png" alt-text="Screenshot of invite using a Microsoft account.":::

### Microsoft account in self-service sign-up user flows

Microsoft account is an identity provider option for your self-service sign-up user flows. Users can sign up for your applications using their own Microsoft accounts. First, you'll need to [enable self-service sign-up](self-service-sign-up-user-flow.md) for your tenant. Then you can set up a user flow for the application, and select Microsoft account as one of the sign-in options.

:::image type="content" source="media/microsoft-account/microsoft-account-user-flow.png" alt-text="Screenshot of the Microsoft account in a self-service sign-up user flow.":::

## Verifying the application's publisher domain
As of November 2020, new application registrations show up as unverified in the user consent prompt, unless [the application's publisher domain is verified](../develop/howto-configure-publisher-domain.md), ***and*** the company’s identity has been verified with the Microsoft Partner Network and associated with the application.  For Microsoft Entra External ID user flows, the publisher’s domain appears only when using a Microsoft account or another Microsoft Entra tenant as the identity provider. To meet these new requirements, follow the steps below:

1. [Verify your company identity using your Microsoft Partner Network (MPN) account](/partner-center/verification-responses). This process verifies information about your company and your company’s primary contact.
1. Complete the publisher verification process to associate your MPN account with your app registration using one of the following options:
   - If the app registration for the Microsoft account identity provider is in a Microsoft Entra tenant, [verify your app in the App Registration portal](../develop/mark-app-as-publisher-verified.md).
   - If your app registration for the Microsoft account identity provider is in an Azure AD B2C tenant, [mark your app as publisher verified using Microsoft Graph APIs](../develop/troubleshoot-publisher-verification.md#making-microsoft-graph-api-calls) (for example, using Graph Explorer).

## Next steps

- [Publisher verification overview](../develop/publisher-verification-overview.md)
- [Add Microsoft Entra ID as an identity provider for External Identities](default-account.md)
