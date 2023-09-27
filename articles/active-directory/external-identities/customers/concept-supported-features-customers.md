---
title: Supported features in customer tenants
description: Learn about supported features in customer tenants.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 05/31/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn about features supported in a CIAM tenant. 
---
# Supported features in Microsoft Entra ID for customers (preview)

Microsoft Entra ID for customers is designed for businesses that want to make applications available to their customers, using the Microsoft Entra platform for identity and access. With the introduction of this feature, Microsoft Entra ID now offers two different types of tenants that you can create and manage:

- A **workforce tenant** contains your employees and the apps and resources that are internal to your organization. If you've worked with Microsoft Entra ID, this is the type of tenant you're already familiar with. You might already have an existing workforce tenant for your organization.

- A **customer tenant** represents your customer-facing app, resources, and directory of customer accounts. A customer tenant is distinct and separate from your workforce tenant.

[!INCLUDE [preview-alert](../customers/includes/preview-alert/preview-alert-ciam.md)]

## Compare workforce and customer tenant capabilities

Although workforce tenants and customer tenants are built on the same underlying Microsoft Entra platform, there are some feature differences. The following table compares the features available in each type of tenant.

> [!NOTE]
> During preview, features or capabilities that require a premium license are unavailable in customer tenants.

|Feature  |Workforce tenant  | Customer tenant |
|---------|---------|---------|
| **External Identities** | Invite partners and other external users to your workforce tenant for collaboration. External users become guests in your workforce directory. | Enable self-service sign-up for customers and authorize access to apps. Users are added to your directory as customer accounts.  |
| **Authentication methods and identity providers** | - Microsoft Entra accounts </br>- Microsoft accounts </br>- Email one-time passcode </br>- Google federation</br>- Facebook federation</br>- SAML/WS-Fed federation | - Local account (Email and password)  </br>- Email one-time passcode </br>- Google federation</br>- Facebook federation|
| **Groups** | [Groups](../../fundamentals/how-to-manage-groups.md) can be used to manage administrative and user accounts.| Groups can be used to manage administrative accounts. Support for Microsoft Entra groups and [application roles](how-to-use-app-roles-customers.md) is being phased into customer tenants. For the latest updates, see [Groups and application roles support](reference-group-app-roles-support.md). |
| **Roles and administrators**| [Roles and administrators](../../fundamentals/how-subscriptions-associated-directory.md) are fully supported for administrative and user accounts. | Roles aren't supported with customer accounts. Customer accounts don't have access to tenant resources.|
| **Custom domain names** |  You can use [custom domains](../../fundamentals/add-custom-domain.md) for administrative accounts only. | Not currently supported. However, the URLs visible to customers in sign-up and sign-in pages are neutral, unbranded URLs. [Learn more](concept-branding-customers.md)|
| **Conditional Access** | [Conditional Access](../../conditional-access/overview.md) is fully supported for administrative and user accounts. | A subset of the Microsoft Entra Conditional Access is available. Multifactor authentication (MFA) is supported with local accounts in customer tenants. [Learn more](concept-security-customers.md).|
|   **Identity protection**    |   Provides ongoing risk detection for your Microsoft Entra tenant. It allows organizations to discover, investigate, and remediate identity-based risks.    |   A subset of the Microsoft Entra ID Protection risk detections is available. [Learn more](how-to-identity-protection-customers.md).    |
|   **Application registration**     |   SAML relying parties, OpenID Connect, and OAuth2    |   OpenID Connect and OAuth2    |
|   **Custom authentication extension**    |   Add claims from external systems.    |   Add claims from external systems.    |  
|   **Token customization**    |   Add user attributes, custom authentication extension (preview), claims transformation and security groups membership to token claims.     |   Add user attributes, custom authentication extension and security groups membership to token claims. [Learn more](how-to-add-attributes-to-token.md).    |
|   **Self-service password reset**    |   Allow users to reset their password using up to two authentication methods (see the next row for available methods).    |   Allow users to reset their password using email with one time passcode. [Learn more](how-to-enable-password-reset-customers.md).     |  
|   **Authentication methods**    | - Username and password</br>- Microsoft Authenticator</br>- FIDO2</br>- SMS</br>- Temporary Access Pass</br>- Third-party software OATH tokens</br>- Voice call</br>- Email one-time passcode</br>- Certificate-based authentication    |   </br>- Username and password</br>- Email one-time passcode    | 
|   **Company branding**    |   Microsoft Entra tenant supports Microsoft look and feel as a default state for authentication experience. Administrators can customize the default Microsoft sign-in experience.    |   Microsoft provides a neutral branding as the default for the customer tenant, which can be customized to meet the specific needs of your company. The default branding for the customer tenant is neutral and doesn't include any existing Microsoft branding. [Learn more](concept-branding-customers.md).    |  
|   **Language customization**    | Customize the sign-in experience based on browser language when users authenticate into your corporate intranet or web-based applications.     |   Use languages to modify the strings displayed to your customers as part of the sign-in and sign-up process. [Learn more](concept-branding-customers.md).   |
|   **Custom attributes**    |    Use directory extension attributes to store additional data in the Microsoft Entra directory for user objects, groups, tenant details, and service principals.    |   Use directory extension attributes to store additional data in the customer directory for user objects. Create custom user attributes and add them to your sign-up user flow. [Learn more](how-to-define-custom-attributes.md).    |


## Next steps

- [Planning for CIAM](concept-planning-your-solution.md)
