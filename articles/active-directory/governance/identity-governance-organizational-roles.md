---
title: Govern access with an organizational role model - Azure AD
description: Azure Active Directory Identity Governance allows you to model organizational roles using access packages.
services: active-directory
documentationcenter: ''
author: markwahl-msft
manager: amycolannino
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 12/1/2022
ms.author: mwahl
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management
---

# Govern access with an organizational role model

Role-based access control (RBAC) provides a framework for classifying users and IT resources. This framework allows you to make explicit their relationship and the access rights that are appropriate according to that classification. For example, by assigning to a user attributes that specify the users job title and project assignments, the user can be granted access to tools needed for the user's job and data that the user needs to contribute to a particular project. When the user assumes a different job and different project assignments, changing the attributes that specify the user's job title and projects automatically blocks access to the resources only required for the users previous position.

In Azure AD, you can use role models in several ways to manage access at scale through identity governance.

 * You can use access packages to represent organizational roles in your organization, such as "sales representative". An access package representing that organizational role would include all the access rights that a sales representative might typically need, across multiple resources.
 * Applications [can define their own roles](../develop/howto-add-app-roles-in-azure-ad-apps.md). For example, if you had a sales application, and that application included the app role "salesperson", you could then [include that role in an access package](entitlement-management-access-package-resources.md).
 * You can use roles for [delegating administrative access](entitlement-management-delegate.md).  If you have a catalog for all the access packages needed by sales, you could assign someone to be responsible for that catalog, by assigning them a catalog-specific role.

This article discusses how to model organizational roles, using entitlement management access packages.

## Mapping organizational role concepts

The following table illustrates how concepts in organizational role definitions you might be familiar with in other products correspond to capabilities in entitlement management.

| Concept in organizational role modeling | Representation in Entitlement Management |
| --- | --- |
| Delegated role management | [Delegate to catalog creators](entitlement-management-delegate-catalog.md) |
| Collection of permissions across one or more applications | [Create an access package with resource roles](entitlement-management-access-package-create.md) |
| Restrict duration of access a role provides | [Set an access package's policy lifecycle settings to have an expiration date](entitlement-management-access-package-lifecycle-policy.md) |
| Individual assignment to a role | [Create a direct assignment to an access package](entitlement-management-access-package-assignments.md#directly-assign-a-user) |
| Assignment of roles to users based on properties (such as their department) | [Establish automatic assignment to an access package](entitlement-management-access-package-auto-assignment-policy.md) |
| Users can request and be approved for a role | [Configure policy settings for who can request an access package](entitlement-management-access-package-request-policy.md) |
| Access recertification of role members | [Set recurring access review settings in an access package policy](entitlement-management-access-reviews-create.md) |
| Separation of duties between roles | [Define two or more access packages as incompatible](entitlement-management-access-package-incompatible.md)|


## Next steps

- [What is Azure AD entitlement management?](entitlement-management-overview.md)
- [Define governance policies](identity-governance-applications-define.md)
- [Integrate an application with Azure AD](identity-governance-applications-integrate.md)
- [Deploy governance policies](identity-governance-applications-deploy.md)
