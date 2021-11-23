---

title: Compare External Identities - Azure Active Directory | Microsoft Docs
description: Azure AD External Identities allow people outside your organization to access your apps and resources using their own identity. Compare solutions for External Identities, including Azure Active Directory B2B collaboration and Azure AD B2C.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: overview
ms.date: 07/13/2021
ms.custom: project-no-code
ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: elisolMS

ms.collection: M365-identity-device-management
---

# What are External Identities in Azure Active Directory?

With External Identities in Azure AD, you can allow people outside your organization to access your apps and resources, while letting them sign in using whatever identity they prefer. Your partners, distributors, suppliers, vendors, and other guest users can "bring their own identities." Whether they have a corporate or government-issued digital identity, or an unmanaged social identity like Google or Facebook, they can use their own credentials to sign in. The external user’s identity provider manages their identity, and you manage access to your apps with Azure AD to keep your resources protected.

## External Identities scenarios

Azure AD External Identities focuses less on a user's relationship to your organization and more on how the user wants to sign in to your apps and resources. Within this framework, Azure AD supports a variety of scenarios from business-to-business (B2B) collaboration to access management for consumer/customer- or citizen-facing applications (business-to-customer, or B2C).

- **Share your apps and resources with external users (B2B collaboration)**. Invite external users into your own tenant as "guest" users that you can assign permissions to (for authorization) while letting them use their existing credentials (for authentication). Users sign in to the shared resources using a simple invitation and redemption process with their work, school, or other email account. You can also use [Azure AD entitlement management](../governance/entitlement-management-overview.md) to configure policies that [manage access for external users](../governance/entitlement-management-external-users.md#how-access-works-for-external-users). And now with the availability of [self-service sign-up user flows](self-service-sign-up-overview.md), you can allow external users to sign up for applications themselves. The experience can be customized to allow sign-up with a work, school, or social identity (like Google or Facebook). You can also collect information about the user during the sign-up process. For more information, see the [Azure AD B2B documentation](index.yml).

- **Build user journeys with a white-label identity management solution for consumer- and customer-facing apps (Azure AD B2C)**. If you're a business or developer creating customer-facing apps, you can scale to millions of consumers, customers, or citizens by using Azure AD B2C. Developers can use Azure AD as the full-featured Customer Identity and Access Management (CIAM) system for their applications. Customers can sign in with an identity they already have established (like Facebook or Gmail). With Azure AD B2C, you can completely customize and control how customers sign up, sign in, and manage their profiles when using your applications. For more information, see the [Azure AD B2C documentation](../../active-directory-b2c/index.yml).

## Compare External Identities solutions

The following table gives a detailed comparison of the scenarios you can enable with Azure AD External Identities.

|   | External user collaboration (B2B) | Access to consumer/customer-facing apps (B2C)  |
| ---- | --- | --- |
| **Primary scenario** | Collaboration using Microsoft applications (Microsoft 365, Teams, etc.) or your own applications (SaaS apps, custom-developed apps, etc.).  | Identity and access management for modern SaaS or custom-developed applications (not first-party Microsoft apps).   |
| **Intended for**    | Collaborating with business partners from external organizations like suppliers, partners, vendors. Users appear as guest users in your directory. These users may or may not have managed IT.  | Customers of your product. These users are managed in a separate Azure AD directory.  |
| **Identity providers supported** | External users can collaborate using work accounts, school accounts, any email address, SAML and WS-Fed based identity providers, Gmail, and Facebook.  | Consumer users with local application accounts (any email address or user name), various supported social identities, and users with corporate and government-issued identities via SAML/WS-Fed based identity provider federation.       |
| **External user management**   | External users are managed in the same directory as employees, but are typically annotated as guest users. Guest users can be managed the same way as employees, added to the same groups, and so on.    | External users are managed in the Azure AD B2C directory. They're managed separately from the organization's employee and partner directory (if any).  |
| **Single sign-on (SSO)**      | SSO to all Azure AD-connected apps is supported. For example, you can provide access to Microsoft 365 or on-premises apps, and to other SaaS apps such as Salesforce or Workday.    | SSO to customer owned apps within the Azure AD B2C tenants is supported. SSO to Microsoft 365 or to other Microsoft SaaS apps isn't supported.    |
| **Security policy and compliance**        | Managed by the host/inviting organization (for example, with [Conditional Access policies](conditional-access.md)). | Managed by the organization via Conditional Access and Identity Protection.        |
| **Branding**  | Host/inviting organization's brand is used.    | Fully customizable branding per application or organization.   |
| **Billing model** | [External Identities pricing](https://azure.microsoft.com/pricing/details/active-directory/external-identities/) based on monthly active users (MAU). <br>(See also: [B2B setup details](external-identities-pricing.md)) | [External Identities pricing](https://azure.microsoft.com/pricing/details/active-directory/external-identities/) based on monthly active users (MAU). <br>(See also: [B2C setup details](../../active-directory-b2c/billing.md)) |
| **More information** | [Blog post](https://blogs.technet.microsoft.com/enterprisemobility/2017/02/01/azure-ad-b2b-new-updates-make-cross-business-collab-easy/), [Documentation](what-is-b2b.md)                   | [Product page](https://azure.microsoft.com/services/active-directory-b2c/), [Documentation](../../active-directory-b2c/index.yml)       |

Secure and manage customers and partners beyond your organizational boundaries with Azure AD External Identities.

## About multitenant applications

If you're providing an app as a service and you don't want to manage your customers' user accounts, a multitenant app is likely the right choice for you. When you develop applications intended for other Azure AD tenants, you can target users from a single organization (single tenant), or users from any organization that already has an Azure AD tenant (multitenant applications). App registrations in Azure AD are single tenant by default, but you can make your registration multitenant. This multitenant application is registered once by yourself in your own Azure AD. But then any Azure AD user from any organization can use the application without additional work on your part. For more information, see [Manage identity in multitenant applications](/azure/architecture/multitenant-identity/), [How-to Guide](../develop/howto-convert-app-to-be-multi-tenant.md).

## Next steps

- [What is Azure AD B2B collaboration?](what-is-b2b.md)
- [About Azure AD B2C](../../active-directory-b2c/overview.md)