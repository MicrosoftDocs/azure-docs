---

title: Compare B2B collaboration and B2C - Azure Active Directory | Microsoft Docs
description: What is the difference between Azure Active Directory B2B collaboration and Azure AD B2C?

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: overview
ms.date: 01/30/2019

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: elisolMS

ms.collection: M365-identity-device-management
---

# Compare B2B collaboration and B2C in Azure Active Directory

Both Azure Active Directory (Azure AD) B2B collaboration and Azure AD B2C allow you to work with external users in Azure AD. But how do they compare?

**Azure AD B2B** is for businesses that want to securely share files and resources with external users so they can collaborate. An Azure admin sets up B2B in the Azure portal, and Azure AD takes care of federation between your business and your external partner. Users sign in to the shared resources using a simple invitation and redemption process with their work or school account, or any email account.
 
**Azure AD B2C** is primarily for businesses and developers that create customer-facing apps. With Azure AD B2C, developers can use Azure AD as the full-featured identity system for their application, while letting customers sign in with an identity they already have established (like Facebook or Gmail).

The table below gives a detailed comparison.


B2B collaboration capabilities |	 Azure AD B2C stand-alone offering
-------- | --------
Intended for: Organizations that want to be able to authenticate users from a partner organization, regardless of identity provider. | Intended for: Inviting customers of your mobile and web apps, whether individuals, institutional or organizational customers into your Azure AD.
Identities supported: Employees with work or school accounts, partners with work or school accounts, or any email address. Soon to support direct federation.  | Identities supported: Consumer users with local application accounts (any email address or user name) or any supported social identity with direct federation.
External users are managed in the same directory as employees, but annotated specially. They can be managed the same way as employees, they can be added to the same groups, and so on  | External users are managed in the application directory. They're managed separately from the organization’s employee and partner directory (if any).
Single sign-on (SSO) to all Azure AD-connected apps is supported. For example, you can provide access to Office 365 or on-premises apps, and to other SaaS apps such as Salesforce or Workday.  |  SSO to customer owned apps within the Azure AD B2C tenants is supported. SSO to Office 365 or to other Microsoft and non-Microsoft SaaS apps is not supported.
Partner lifecycle: Managed by the host/inviting organization.  | Customer lifecycle: Self-serve or managed by the application.
Security policy and compliance: Managed by the host/inviting organization (for example, with [Conditional Access policies](https://docs.microsoft.com/azure/active-directory/b2b/conditional-access)).  | Security policy and compliance: Managed by the application.
Branding: Host/inviting organization’s brand is used.  |	Branding: Managed by application. Typically tends to be product branded, with the organization fading into the background.
More info: [Blog post](https://blogs.technet.microsoft.com/enterprisemobility/2017/02/01/azure-ad-b2b-new-updates-make-cross-business-collab-easy/), [Documentation](what-is-b2b.md)  | More info: [Product page](https://azure.microsoft.com/services/active-directory-b2c/), [Documentation](https://docs.microsoft.com/azure/active-directory-b2c/)


### Next steps

- [What is Azure AD B2B collaboration?](what-is-b2b.md)
- [B2B collaboration user properties](user-properties.md)

