---

title: Compare External Identities - Azure Active Directory | Microsoft Docs
description: Azure AD External Identities allow people outside your organization to access your apps and resources using their own identity. Compare solutions for External Identities, including Azure Active Directory B2B collaboration and Azure AD B2C.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: overview
ms.date: 05/19/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: elisolMS

ms.collection: M365-identity-device-management
---

# Compare solutions for External Identities in Azure Active Directory

With  External Identities in Azure AD, you can allow people outside your organization to access your apps and resources, while letting them sign in using whatever identity they prefer. Your partners, distributors, suppliers, vendors, and other guest users can "bring their own identities." Whether they're part of Azure AD or another IT-managed system, or have an unmanaged social identity like Google or Facebook, they can use their own credentials to sign in. The identity provider manages the external user’s identity, and you manage access to your apps with Azure AD to keep your resources protected. 

## External Identities scenarios

Azure AD External Identities focuses less on a user's relationship to your organization and more on the way an individual wants to sign in to your apps and resources. Within this framework, Azure AD supports a variety of scenarios from business-to-business (B2B) collaboration to app development for customers and consumers (business-to-consumer, or B2C).

- **Share apps with external users (B2B collaboration)**. Invite external users into your own tenant as "guest" users that you can assign permissions to (for authorization) while allowing them to use their existing credentials (for authentication). Users sign in to the shared resources using a simple invitation and redemption process with their work account, school account, or any email account. And now with the availability of Self-service sign-up user flows (Preview), you can also provide a sign-in experience for your external users through the application you want to share. You can configure user flow settings to control how the user signs up for the application and that allows them to use their work account, school account, or any social identity (like Google or Facebook) they want to use.  For more information, see the [Azure AD B2B documentation](index.yml).

- **Develop apps intended for other Azure AD tenants (single-tenant or multi-tenant)**. When developing applications for Azure AD, you can target users from a single organization (single tenant), or users from any organization that already has an Azure AD tenant (called multi-tenant applications). These multi-tenant applications are registered once by yourself in your own Azure AD, but can then be used by any Azure AD user from any organization without any additional work on your part.

- **Develop white-labeled apps for consumers and customers (Azure AD B2C)**. If you're a business or developer creating customer-facing apps, you can scale to consumers, customers, or citizens by using an Azure AD B2C. Developers can use Azure AD as the full-featured identity system for their application, while letting customers sign in with an identity they already have established (like Facebook or Gmail). With Azure AD B2C, you can completely customize and control how customers sign up, sign in, and manage their profiles when using your applications. For more information, see the [Azure AD B2C documentation](https://docs.microsoft.com/azure/active-directory-b2c/).

The table below gives a detailed comparison of the various scenarios you can enable with Azure AD External Identities.

| Multi-tenant applications  | External user collaboration (B2B) | Apps for consumers or customers (B2C)  |
| ---- | --- | --- |
| Primary scenario: Enterprise Software-as-a-Service (SaaS) | Primary scenario: Collaboration using Microsoft applications (Office 365, Teams, ...) or your own collaboration software.  | Primary scenario: Transactional applications using custom developed applications.   |
| Intended for: Organizations that want to provide software to many enterprise customers.    | Intended for: Organizations that want to be able to authenticate users from a partner organization, regardless of identity provider.    | Intended for: Inviting customers of your mobile and web apps, whether individuals, institutional or organizational customers into an Azure AD directory separate from your own organization's directory. |
| Identities supported: Employees with Azure AD accounts. | Identities supported: Employees with work or school accounts, partners with work or school accounts, or any email address. Soon to support direct federation.      | Identities supported: Consumer users with local application accounts (any email address or user name) or any supported social identity with direct federation.       |
| External users are managed in their own directory, isolated from the directory where the application was registered.    | External users are managed in the same directory as employees, but annotated specially. They can be managed the same way as employees, they can be added to the same groups, and so on.    | External users are managed in the application directory. They're managed separately from the organization's employee and partner directory (if any).  |
| Single sign-on: SSO to all Azure AD-connected apps is supported.          | Single sign-on: SSO to all Azure AD-connected apps is supported. For example, you can provide access to Office 365 or on-premises apps, and to other SaaS apps such as Salesforce or Workday.    | Single sign-on: SSO to customer owned apps within the Azure AD B2C tenants is supported. SSO to Office 365 or to other Microsoft SaaS apps is not supported.    |
| Customer lifecycle: Managed by the user's home organization.      | Partner lifecycle: Managed by the host/inviting organization.    | Customer lifecycle: Self-serve or managed by the application.      |
| Security policy and compliance: Managed by the host/inviting organization (for example, with [Conditional Access policies](https://docs.microsoft.com/azure/active-directory/b2b/conditional-access)).           | Security policy and compliance: Managed by the host/inviting organization (for example, with [Conditional Access policies](https://docs.microsoft.com/azure/active-directory/b2b/conditional-access)). | Security policy and compliance: Managed by the application.        |
| Branding: Host/inviting organization's brand is used.   | Branding: Host/inviting organization's brand is used.    | Branding: Managed by application. Typically tends to be product branded, with the organization fading into the background.   |
| More info: [Manage identity in multi-tenant applications](https://docs.microsoft.com/azure/architecture/multitenant-identity/), [How-to Guide](https://docs.microsoft.com/azure/active-directory/develop/howto-convert-app-to-be-multi-tenant) | More info: [Blog post](https://blogs.technet.microsoft.com/enterprisemobility/2017/02/01/azure-ad-b2b-new-updates-make-cross-business-collab-easy/), [Documentation](what-is-b2b.md)                   | More info: [Product page](https://azure.microsoft.com/services/active-directory-b2c/), [Documentation](https://docs.microsoft.com/azure/active-directory-b2c/)       |

Secure and manage customers and partners beyond your organizational boundaries with Azure AD External Identities.

### Next steps

- [What is Azure AD B2B collaboration?](what-is-b2b.md)
- [About Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/overview)
