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

Azure Active Directory (Azure AD) allows you to use *groups* to control access to applications and resources in an organization. Azure AD supports including several group types in an access token's [groups claims](./access-tokens.md#payload-claims), and your app can obtain a subset of the security-enabled group types in the groups claims by filtering on the groups' *securityEnabled* property.

This article outlines some of the potential security risks associated with groups and the best practices to mitigate against them.

## Azure AD group types

Azure AD provides three different types of groups that can be used for secure access control.

### Security groups

You can use security groups to control access to resources. If the join policy of the security groups is selected to ‘*allow anyone to join*’, the Azure AD *My Groups* portal provides the capability to add members to an Azure AD security group without owner approval. When such a group is used to give access to an external resource, the risk of elevation of privileges is introduced.

:::image type="content" source="./media/secure-group-access-control/groups-for-access-control.png" alt-text="create group join policy in My Groups portal":::

### Microsoft 365 groups

Most customers have hybrid needs to use the same group for both access control and collaboration purposes. Therefore, is it possible to use Microsoft 365 groups as an access group, by setting *securityEnabled* property of a Microsoft 365 group to be true. It's important to consider the Microsoft 365 group [visibility concept](/graph/api/resources/group?view=graph-rest-1.0&preserve-view=true#group-visibility-options). The property controls the join policy of the group and visibility of group resources. Depending on the value of the property, either *Private* or *Public*, users of the tenant can join the group with or without group owner approval. When a Public group is used to give access to an external resource, the risk of elevation of privileges exists.

### Cloud-synced security groups

You can control access to cloud resources by using Active Directory security groups synchronized to Azure Active Directory.

The *securityEnabled* property of an on-premises group's directory object identifies it as a group that can be used for access control. A cloud group inherits the on-premises group's *securityEnabled* property value when the on-premises group is synchronized to the cloud.

In addition to using security-enabled groups for access control in your own applications, Microsoft services like Exchange, SharePoint, and the Azure RBAC rely on the *securityEnabled* property for controlling access to resources.

## Best practices to mitigate risk

This table presents several security best practices for security groups and the potential security risks each practice mitigates.

|Security best practice   |Security risk mitigated   |
|--------------------------|---------------------------|
|**Ensure resource owner and group owner are the same principal**. Applications should build their own group management experience and create new groups to manage access. For example, an application can create groups with *Group.Create* permission and add itself as the owner of the group. This way the application has control over its groups without being over privileged to modify other groups in the tenant.|When group owners and resource owners are different users or entities, group owners can add users to the group who aren't supposed to get access to the resource and thus give access to the resource unintentionally.|
|**Build an implicit contract between resource owner(s) and group owner(s)**. The resource owner and the group owner should align on the group purpose, policies, and members that can be added to the group to get access to the resource. This level of trust is non-technical and relies on human or business contract.|When you use a *Public* group for access control, any member can join the group and get access to the resource. When a Public on-premises synced group is used to give access to a resource in the cloud, users joining this group on-premises can get access to the cloud resource as well. Azure AD *My Groups* portal also provides the capability to add members to an Azure AD security group without owner approval, if the join policy of these security groups is selected to allow anyone to join.|
|**Ad-hoc risk mitigation**. When you use a group for access control and you identify a risk factor due to certain group settings, you can modify the group to mitigate the risk. For example, changing the group join policy from Public to Private, or removing child groups from the parent group or modifying the group not to allow guest users to join. This is the least secure model and is often reactive after the risk factor is already reported.|When you use a group for access control and it has other groups as its members, members of the subgroups can get access to the resource. In this case, there are multiple group owners - owners of the parent group and subgroups. Aligning with multiple group owners on the purpose of each group and how to add the right members to these groups is more complex and more prone to accidental grant of access.|

## Next steps

- [Manage app and resource access using Azure Active Directory groups](../fundamentals/active-directory-manage-groups.md)
- [Access with Azure Active Directory groups](/azure/devops/organizations/accounts/manage-azure-active-directory-groups)
