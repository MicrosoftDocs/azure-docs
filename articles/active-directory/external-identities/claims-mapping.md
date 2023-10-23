---
title: B2B collaboration user claims mapping
description: Customize the user claims that are issued in the SAML token for Microsoft Entra B2B users.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 08/30/2023

ms.author: cmulligan
author: csmulligan
manager: celestedg


ms.collection: engagement-fy23, M365-identity-device-management
---

# B2B collaboration user claims mapping in Microsoft Entra External ID

With Microsoft Entra External ID, you can customize the claims that are issued in the SAML token for [B2B collaboration](what-is-b2b.md) users. When a user authenticates to the application, Microsoft Entra ID issues a SAML token to the app that contains information (or claims) about the user that uniquely identifies them. By default, this claim includes the user's user name, email address, first name, and last name.

In the [Microsoft Entra admin center](https://entra.microsoft.com), you can view or edit the claims that are sent in the SAML token to the application. To access the settings, browse to **Identity** > **Applications** > **Enterprise applications** > the application that's configured for single sign-on > **Single sign-on**. See the SAML token settings in the **User Attributes** section.

:::image type="content" source="media/claims-mapping/view-claims-in-saml-token-attributes.png" alt-text="Screenshot of the SAML token attributes in the UI.":::

There are two possible reasons why you might need to edit the claims that are issued in the SAML token:

1. The application requires a different set of claim URIs or claim values.

2. The application requires the NameIdentifier claim to be something other than the user principal name [(UPN)](../hybrid/connect/plan-connect-userprincipalname.md#what-is-userprincipalname) that's stored in Microsoft Entra ID.

For information about how to add and edit claims, see [Customizing claims issued in the SAML token for enterprise applications in Microsoft Entra ID](../develop/saml-claims-customization.md).

## UPN claims behavior for B2B users

If you need to issue the UPN value as an application token claim, the actual claim mapping may behave differently for B2B users. If the B2B user authenticates with an external Microsoft Entra identity and you issue user.userprincipalname as the source attribute, Microsoft Entra ID instead issues the mail attribute.  

For example, let’s say you invite an external user whose email is `james@contoso.com` and whose identity exists in an external Microsoft Entra tenant. James’ UPN in the inviting tenant is created from the invited email and the inviting tenant's original default domain. So, let’s say James’ UPN becomes `James_contoso.com#EXT#@fabrikam.onmicrosoft.com`. For the SAML application that issues user.userprincipalname as the NameID, the value passed for James is `james@contoso.com`.  

All [other external identity types](redemption-experience.md#invitation-redemption-flow) such as SAML/WS-Fed, Google, Email OTP issues the UPN value rather than the email value when you issue user.userprincipalname as a claim. If you want the actual UPN to be issued in the token claim for all B2B users, you can set user.localuserprincipalname as the source attribute instead. 

>[!NOTE]
>The behavior mentioned in this section is same for both cloud-only B2B users and synced users who were [invited/converted to B2B collaboration](invite-internal-users.md). 

## Next steps

- For information about B2B collaboration user properties, see [Properties of a Microsoft Entra B2B collaboration user](user-properties.md).
- For information about user tokens for B2B collaboration users, see [Understand user tokens in Microsoft Entra B2B collaboration](user-token.md).
