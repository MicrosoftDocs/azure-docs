---
title: Microsoft Entra B2B best practices and recommendations
description: Learn best practices and recommendations for business-to-business (B2B) guest user access in Microsoft Entra ID.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 05/17/2023
ms.author: cmulligan
author: csmulligan
manager: celestedg
ms.custom: "it-pro"
ms.collection: M365-identity-device-management
---

# Microsoft Entra B2B best practices
This article contains recommendations and best practices for business-to-business (B2B) collaboration in Microsoft Entra External ID.

> [!IMPORTANT]
> The [email one-time passcode feature](one-time-passcode.md) is now turned on by default for all new tenants and for any existing tenants where you haven't explicitly turned it off. When this feature is turned off, the fallback authentication method is to prompt invitees to create a Microsoft account.

## B2B recommendations

| Recommendation | Comments |
| --- | --- |
| Consult Microsoft Entra guidance for securing your collaboration with external partners | Learn how to take a holistic governance approach to your organization's collaboration with external partners by following the recommendations in [Securing external collaboration in Microsoft Entra ID and Microsoft 365](../architecture/secure-external-access-resources.md). |
| Carefully plan your cross-tenant access and external collaboration settings  | Microsoft Entra External ID gives you a flexible set of controls for managing collaboration with external users and organizations. You can allow or block all collaboration, or configure collaboration only for specific organizations, users, and apps. Before configuring settings for cross-tenant access and external collaboration, take a careful inventory of the organizations you work and partner with. Then determine if you want to enable [B2B direct connect](b2b-direct-connect-overview.md) or [B2B collaboration](what-is-b2b.md) with other Microsoft Entra tenants, and how you want to manage [B2B collaboration invitations](external-collaboration-settings-configure.md).  |
| Use tenant restrictions to control how external accounts are used on your networks and managed devices. | With tenant restrictions, you can prevent your users from using accounts they've created in unknown tenants or accounts they've received from external organizations. We recommend you disallow these accounts and use B2B collaboration instead.  |
| For an optimal sign-in experience, federate with identity providers | Whenever possible, federate directly with identity providers to allow invited users to sign in to your shared apps and resources without having to create Microsoft Accounts (MSAs) or Microsoft Entra accounts. You can use the [Google federation feature](google-federation.md) to allow B2B guest users to sign in with their Google accounts. Or, you can use the [SAML/WS-Fed identity provider (preview) feature](direct-federation.md) to set up federation with any organization whose identity provider (IdP) supports the SAML 2.0 or WS-Fed protocol. |
| Use the Email one-time passcode  feature for B2B guests who can’t authenticate by other means | The [Email one-time passcode](one-time-passcode.md) feature authenticates B2B guest users when they can't be authenticated through other means like Microsoft Entra ID, a Microsoft account (MSA), or Google federation. When the guest user redeems an invitation or accesses a shared resource, they can request a temporary code, which is sent to their email address. Then they enter this code to continue signing in. |
| Add company branding to your sign-in page | You can customize your sign-in page so it's more intuitive for your B2B guest users. See how to [add company branding to sign in and Access Panel pages](../fundamentals/how-to-customize-branding.md). |
| Add your privacy statement to the B2B guest user redemption experience | You can add the URL of your organization's privacy statement to the first time invitation redemption process so that an invited user must consent to your privacy terms to continue. See [How-to: Add your organization's privacy info in Microsoft Entra ID](../fundamentals/properties-area.md). |
| Use the bulk invite (preview) feature to invite multiple B2B guest users at the same time | Invite multiple guest users to your organization at the same time by using the bulk invite preview feature in the Azure portal. This feature lets you upload a CSV file to create B2B guest users and send invitations in bulk. See [Tutorial for bulk inviting B2B users](tutorial-bulk-invite.md). |
| Enforce Conditional Access policies for Microsoft Entra multifactor authentication | We recommend enforcing MFA policies on the apps you want to share with partner B2B users. This way, MFA will be consistently enforced on the apps in your tenant regardless of whether the partner organization is using MFA. See [Conditional Access for B2B collaboration users](authentication-conditional-access.md). |
| If you’re enforcing device-based Conditional Access policies, use exclusion lists to allow access to B2B users | If device-based Conditional Access policies are enabled in your organization, B2B guest user devices will be blocked because they’re not managed by your organization. You can create exclusion lists containing specific partner users to exclude them from the device-based Conditional Access policy. See [Conditional Access for B2B collaboration users](authentication-conditional-access.md). |
| Use a tenant-specific URL when providing direct links to your B2B guest users | As an alternative to the invitation email, you can give a guest a direct link to your app or portal. This direct link must be tenant-specific, meaning it must include a tenant ID or verified domain so the guest can be authenticated in your tenant, where the shared app is located. See [Redemption experience for the guest user](redemption-experience.md). |
| When developing an app, use UserType to determine guest user experience  | If you're developing an application and you want to provide different experiences for tenant users and guest users, use the UserType property. The UserType claim isn't currently included in the token. Applications should use the Microsoft Graph API to query the directory for the user to get their UserType. |
| Change the UserType property *only* if the user’s relationship to the organization changes | Although it’s possible to use PowerShell to convert the UserType property for a user from Member to Guest (and vice-versa), you should change this property only if the relationship of the user to your organization changes. See [Properties of a B2B guest user](user-properties.md).|
| Find out if your environment will be affected by Microsoft Entra directory limits  | Microsoft Entra B2B is subject to Microsoft Entra service directory limits. For details about the number of directories a user can create and the number of directories to which a user or guest user can belong, see [Microsoft Entra service limits and restrictions](../enterprise-users/directory-service-limits-restrictions.md).|
| Manage the B2B account lifecycle with the Sponsor (preview) feature  | A sponsor is a user or group responsible for their guest users. For more details about this new feature see [Sponsor field for B2B users (preview)](b2b-sponsors.md).|

## Next steps

[Manage B2B sharing](external-collaboration-settings-configure.md)
