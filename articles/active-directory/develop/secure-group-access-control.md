---
title: Secure access control using groups in Microsoft Entra ID
description: Learn about how groups are used to securely control access to resources in Microsoft Entra ID.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity 
ms.date: 01/06/2023
ms.custom: template-concept
ms.author: davidmu
ms.reviewer: jodah
# Customer intent: As a developer, I want to learn how to most securely use Microsoft Entra groups to control access to resources.
---

# Secure access control using groups in Microsoft Entra ID

Microsoft Entra ID allows the use of groups to manage access to resources in an organization. Use groups for access control to manage and minimize access to applications. When groups are used, only members of those groups can access the resource. Using groups also enables the following management features:

- Attribute-based dynamic groups
- External groups synced from on-premises Active Directory
- Administrator managed or self-service managed groups

To learn more about the benefits of groups for access control, see [manage access to an application](../manage-apps/what-is-access-management.md).

While developing an application, authorize access with the groups claim. To learn more, see how to [configure group claims for applications with Microsoft Entra ID](../hybrid/connect/how-to-connect-fed-group-claims.md).

Today, many applications select a subset of groups with the `securityEnabled` flag set to `true` to avoid scale challenges, that is, to reduce the number of groups returned in the token. Setting the `securityEnabled` flag to be true for a group doesn't guarantee that the group is securely managed.

## Best practices to mitigate risk

The following table presents several security best practices for security groups and the potential security risks each practice mitigates.

|Security best practice   |Security risk mitigated   |
|--------------------------|---------------------------|
|**Ensure resource owner and group owner are the same principal**. Applications should build their own group management experience and create new groups to manage access. For example, an application can create groups with the `Group.Create` permission and add itself as the owner of the group. This way the application has control over its groups without being over privileged to modify other groups in the tenant.|When group owners and resource owners are different entities, group owners can add users to the group who aren't supposed to access the resource but can then access it unintentionally.|
|**Build an implicit contract between the resource owner and group owner**. The resource owner and the group owner should align on the group purpose, policies, and members that can be added to the group to get access to the resource. This level of trust is non-technical and relies on human or business contract.|When group owners and resource owners have different intentions, the group owner may add users to the group the resource owner didn't intend on giving access to. This action can result in unnecessary and potentially risky access.|
|**Use private groups for access control**. Microsoft 365 groups are managed by the [visibility concept](/graph/api/resources/group?view=graph-rest-1.0#group-visibility-options&preserve-view=true). This property controls the join policy of the group and visibility of group resources. Security groups have join policies that either allow anyone to join or require owner approval. On-premises-synced groups can also be public or private. Users joining an on-premises-synced group can get access to cloud resource as well.|When you use a public group for access control, any member can join the group and get access to the resource. The risk of elevation of privilege exists when a public group is used to give access to an external resource.|
|**Group nesting**. When you use a group for access control and it has other groups as its members, members of the subgroups can get access to the resource. In this case, there are multiple group owners of the parent group and the subgroups.|Aligning with multiple group owners on the purpose of each group and how to add the right members to these groups is more complex and more prone to accidental grant of access. Limit the number of nested groups or don't use them at all if possible.|

## Next steps

- [Manage app and resource access using Microsoft Entra groups](../fundamentals/concept-learn-about-groups.md)
- [Restrict your Microsoft Entra app to a set of users in a Microsoft Entra tenant](./howto-restrict-your-app-to-a-set-of-users.md)
