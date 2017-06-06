---

title: Compare B2B collaboration and B2C in Azure Active Directory | Microsoft Docs
description: What is the difference between Azure Active Directory B2B collaboration and Azure AD B2C?
services: active-directory
documentationcenter: ''
author: sasubram
manager: femila
editor: ''
tags: ''

ms.assetid:
ms.service: active-directory
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: identity
ms.date: 03/15/2017
ms.author: sasubram

---

# Compare B2B collaboration and B2C in Azure Active Directory

Both Azure Active Directory (Azure AD) B2B collaboration and Azure AD B2C allow you to work with external users in Azure AD. But how do they compare?


B2B collaboration capabilities |	 Azure AD B2C stand-alone offering
-------- | --------
Intended for: Organizations that want to be able to authenticate users from a partner organization, regardless of identity provider. | Intended for: Inviting customers of your mobile and web apps, whether individuals, institutional or organizational customers into your Azure AD.
Identities supported: Employees with work or school accounts, partners with work or school accounts, or any email address. Soon to support direct federation.  | Identities supported: Consumer users with local application accounts (any email address or user name) or any supported social identity with direct federation.
Which directory the partner users are in: Partner users from the external organization are managed in the same directory as employees, but annotated specially. They can be managed the same way as employees, can be added to the same groups, and so on  | Which directory the customer user entities are in: In the application directory. Managed separately from the organization’s employee and partner directory (if any.
Single sign-on (SSO) to all Azure AD-connected apps is supported. For example, you can provide access to Office 365 or on-premises apps, and to other SaaS apps such as Salesforce or Workday.  |  SSO to customer owned apps within the Azure AD B2C tenants is supported. SSO to Office 365 or to other Microsoft and non-Microsoft SaaS apps is not supported.
Partner lifecycle: Managed by the host/inviting organization.  | Customer lifecycle: Self-serve or managed by the application.
Security policy and compliance: Managed by the host/inviting organization.  | Security policy and compliance: Managed by the application.
Branding: Host/inviting organization’s brand is used.  |	Branding: Managed by application. Typically tends to be product branded, with the organization fading into the background.
More info: [Blog post](https://blogs.technet.microsoft.com/enterprisemobility/2017/02/01/azure-ad-b2b-new-updates-make-cross-business-collab-easy/), [Documentation](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b)  | More info: [Product page](https://azure.microsoft.com/en-us/services/active-directory-b2c/), [Documentation](https://docs.microsoft.com/en-us/azure/active-directory-b2c/)


### Next steps

Browse our other articles on Azure AD B2B collaboration:

* [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
* [B2B collaboration user properties](active-directory-b2b-user-properties.md)
* [Adding a B2B collaboration user to a role](active-directory-b2b-add-guest-to-role.md)
* [Delegate B2B collaboration invitations](active-directory-b2b-delegate-invitations.md)
* [Dynamic groups and B2B collaboration](active-directory-b2b-dynamic-groups.md)
* [Configure SaaS apps for B2B collaboration](active-directory-b2b-configure-saas-apps.md)
* [B2B collaboration user tokens](active-directory-b2b-user-token.md)
* [B2B collaboration user claims mapping](active-directory-b2b-claims-mapping.md)
* [Office 365 external sharing](active-directory-b2b-o365-external-user.md)
* [B2B collaboration current limitations](active-directory-b2b-current-limitations.md)
* [Getting support for B2B collaboration](active-directory-b2b-support.md)
