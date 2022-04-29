---
title: Secure access control using groups in Azure AD - Microsoft identity platform
description: Learn about how groups are used to securely control access to resources in Azure AD.
services: active-directory
author: chrischiedo
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity 
ms.date: 2/21/2022
ms.custom: template-concept
ms.author: cchiedo
ms.reviewer: jodah, marsma

# Customer intent: As a developer, I want to learn how to most securely use Azure AD groups to control access to resources.
---

# Secure access control using groups in Azure AD

Azure Active Directory (Azure AD) allows the use of groups to manage access to resources in an organization. You should use groups for access control when you want to manage and minimize access to applications. When groups are used, only members of those groups can access the resource. Using groups also allows you to benefit from several Azure AD group management features, such as attribute-based dynamic groups, external groups synced from on-premises Active Directory, and Administrator managed or self-service managed groups. To learn more about the benefits of groups for access control, see [manage access to an application](../manage-apps/what-is-access-management.md).

While developing an application, you can authorize access with the [groups claim](/graph/api/resources/application?view=graph-rest-1.0#properties&preserve-view=true). To learn more, see how to [configure group claims for applications with Azure AD](../hybrid/how-to-connect-fed-group-claims.md).

Today, many applications select a subset of groups with the *securityEnabled* flag set to *true* to avoid scale challenges, that is, to reduce the number of groups returned in the token. Setting the *securityEnabled* flag to be true for a group doesn't guarantee that the group is securely managed. Therefore, we suggest following the best practices described below:


## Best practices to mitigate risk

This table presents several security best practices for security groups and the potential security risks each practice mitigates.

|Security best practice   |Security risk mitigated   |
|--------------------------|---------------------------|
|**Ensure resource owner and group owner are the same principal**. Applications should build their own group management experience and create new groups to manage access. For example, an application can create groups with *Group. Create* permission and add itself as the owner of the group. This way the application has control over its groups without being over privileged to modify other groups in the tenant.|When group owners and resource owners are different users or entities, group owners can add users to the group who aren't supposed to get access to the resource and thus give access to the resource unintentionally.|
|**Build an implicit contract between resource owner(s) and group owner(s)**. The resource owner and the group owner should align on the group purpose, policies, and members that can be added to the group to get access to the resource. This level of trust is non-technical and relies on human or business contract.|When group owners and resource owners have different intentions, the group owner may add users to the group the resource owner didn't intend on giving access to. This can result in unnecessary and potentially risky access.|
|**Use private groups for access control**. Microsoft 365 groups are managed by the [visibility concept](/graph/api/resources/group?view=graph-rest-1.0#group-visibility-options&preserve-view=true). This property controls the join policy of the group and visibility of group resources. Security groups have join policies that either allow anyone to join or require owner approval. On-premises-synced groups can also be public or private. When they're used to give access to a resource in the cloud, users joining this group on-premises can get access to the cloud resource as well.|When you use a *Public* group for access control, any member can join the group and get access to the resource. When a *Public* group is used to give access to an external resource, the risk of elevation of privilege exists.|
|**Group nesting**. When you use a group for access control and it has other groups as its members, members of the subgroups can get access to the resource. In this case, there are multiple group owners - owners of the parent group and the subgroups.|Aligning with multiple group owners on the purpose of each group and how to add the right members to these groups is more complex and more prone to accidental grant of access. Therefore, you should limit the number of nested groups or don't use them at all if possible.|

## Next steps

For more information about groups in Azure AD, see the following:

- [Manage app and resource access using Azure Active Directory groups](../fundamentals/active-directory-manage-groups.md)
- [Access with Azure Active Directory groups](/azure/devops/organizations/accounts/manage-azure-active-directory-groups)
- [Restrict your Azure AD app to a set of users in an Azure AD tenant](./howto-restrict-your-app-to-a-set-of-users.md)
