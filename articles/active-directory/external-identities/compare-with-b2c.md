---

title: Compare External Identities - Azure Active Directory | Microsoft Docs
description: Azure AD External Identities allow people outside your organization to access your apps and resources using their own identity. Compare solutions for External Identities, including Azure Active Directory B2B collaboration and Azure AD B2C.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: overview
ms.date: 10/08/2020
ms.custom: project-no-code
ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: elisolMS

ms.collection: M365-identity-device-management
---

# What are External Identities in Azure Active Directory?

With External Identities in Azure AD, you can allow people outside your organization to access your apps and resources, while letting them sign in using whatever identity they prefer. Your partners, distributors, suppliers, vendors, and other guest users can "bring their own identities." Whether they're part of Azure AD or another IT-managed system, or have an unmanaged social identity like Google or Facebook, they can use their own credentials to sign in. The identity provider manages the external user’s identity, and you manage access to your apps with Azure AD to keep your resources protected. 

## External Identities scenarios

Azure AD External Identities focuses less on a user's relationship to your organization and more on how the user wants to sign in to your apps and resources. Within this framework, Azure AD supports a variety of scenarios from business-to-business (B2B) collaboration to app development for customers and consumers (business-to-consumer, or B2C).

- **Share your apps and resources with external users (B2B collaboration)**. Invite external users into your own tenant as "guest" users that you can assign permissions to (for authorization) while letting them use their existing credentials (for authentication). Users sign in to the shared resources using a simple invitation and redemption process with their work, school, or other email account. And now with the availability of [self-service sign-up user flows (preview)](self-service-sign-up-overview.md), you can allow external users to sign up for applications themselves. The experience can be customized to allow sign-up with a work, school, or social identity (like Google or Facebook). You can also collect information about the user during the sign-up process. For more information, see the [Azure AD B2B documentation](index.yml).

- **Develop white-labeled apps for consumers and customers (Azure AD B2C)**. If you're a business or developer creating customer-facing apps, you can scale to consumers, customers, or citizens by using an Azure AD B2C. Developers can use Azure AD as the full-featured identity system for their application. Customers can sign in with an identity they already have established (like Facebook or Gmail). With Azure AD B2C, you can completely customize and control how customers sign up, sign in, and manage their profiles when using your applications. For more information, see the [Azure AD B2C documentation](../../active-directory-b2c/index.yml).

## Compare External Identities solutions

The following table gives a detailed comparison of the scenarios you can enable with Azure AD External Identities.

|   | External user collaboration (B2B) | Apps for consumers or customers (B2C)  |
| ---- | --- | --- |
| **Primary scenario** | Collaboration using Microsoft applications (Microsoft 365, Teams, etc.) or your own collaboration software.  | Transactional applications using custom developed applications.   |
| **Intended for**    | Organizations that want to be able to authenticate users from a partner organization, regardless of identity provider.    | Inviting customers of your mobile and web apps, whether individuals, institutional or organizational customers into an Azure AD directory separate from your own organization's directory. |
| **Identities supported** | Employees with work or school accounts, partners with work or school accounts, or any email address. Soon to support direct federation.      | Consumer users with local application accounts (any email address or user name) or any supported social identity with direct federation.       |
| **External user management**   | External users are managed in the same directory as employees, but annotated specially. They can be managed the same way as employees, they can be added to the same groups, and so on.    | External users are managed in the application directory. They're managed separately from the organization's employee and partner directory (if any).  |
| **Single sign-on (SSO)**      | SSO to all Azure AD-connected apps is supported. For example, you can provide access to Microsoft 365 or on-premises apps, and to other SaaS apps such as Salesforce or Workday.    | SSO to customer owned apps within the Azure AD B2C tenants is supported. SSO to Microsoft 365 or to other Microsoft SaaS apps isn't supported.    |
| **External user lifecycle**    | Partner lifecycle: Managed by the host/inviting organization.    | Customer lifecycle: Self-serve or managed by the application.      |
| **Security policy and compliance**        | Managed by the host/inviting organization (for example, with [Conditional Access policies](conditional-access.md)). | Managed by the application.        |
| **Branding**  | Host/inviting organization's brand is used.    | Managed by application. Typically tends to be product branded, with the organization fading into the background.   |
|  **Billing model**  |  Pricing is based on monthly active users (MAU). See [External Identities pricing](external-identities-pricing.md).  |  Pricing is based on monthly active users (MAU). See [Azure AD B2C billing model](../../active-directory-b2c/billing.md)  |
| **More information** | [Blog post](https://blogs.technet.microsoft.com/enterprisemobility/2017/02/01/azure-ad-b2b-new-updates-make-cross-business-collab-easy/), [Documentation](what-is-b2b.md)                   | [Product page](https://azure.microsoft.com/services/active-directory-b2c/), [Documentation](../../active-directory-b2c/index.yml)       |

Secure and manage customers and partners beyond your organizational boundaries with Azure AD External Identities.

## About multitenant applications

When you develop applications intended for other Azure AD tenants, you can target users from a single organization (single tenant), or users from any organization that already has an Azure AD tenant (called multitenant applications). App registrations in Azure AD are single tenant by default, but you can make your registration multitenant. This multitenant application is registered once by yourself in your own Azure AD. But then any Azure AD user from any organization can use the application without additional work on your part. For more information, see [Manage identity in multitenant applications](https://docs.microsoft.com/azure/architecture/multitenant-identity/), [How-to Guide](../develop/howto-convert-app-to-be-multi-tenant.md).

## Next steps

- [What is Azure AD B2B collaboration?](what-is-b2b.md)
- [About Azure AD B2C](../../active-directory-b2c/overview.md)
