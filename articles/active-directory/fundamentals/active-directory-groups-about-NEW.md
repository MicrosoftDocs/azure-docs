---
title: How to manage groups - Azure Active Directory | Microsoft Docs
description: Information about Azure Active Directory groups and access rights
services: active-directory
author: barclayn
manager: rkarlin

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: how-to
ms.date: 08/29/2018
ms.author: barclayn
ms.reviewer: krbain
ms.custom: "it-pro, seodec18"                      
ms.collection: M365-identity-device-management
---
# Learn about groups and access rights in Azure Active Directory

Azure Active Directory (Azure AD) provides several ways to manage access to resources, applications, and tasks. With Azure AD groups you can grant access and permissions to a group of users instead of for each individual user. Limiting access to Azure AD resources to only those users who need it is one of the core security principals of [Zero Trust](https://docs.microsoft.com/security/zero-trust/zero-trust-overview). This article provides an overview of how groups and access rights can be used to together to make managing your Azure AD users easier while also applying security best practices.

Azure AD lets you use groups to manage access to applications, data, and resources. Resources can be:

- Part of the Azure AD organization, such as permissions to manage objects through roles in Azure AD
- External to the organization, such as for Software as a Service (SaaS) apps
- Azure services
- SharePoint sites
- On-premises resources

Some groups can't be managed in the Azure AD portal:

- Groups synced from on-premises Active Directory can be managed only in on-premises Active Directory.
- Distribution lists and mail-enabled security groups are managed only in Exchange admin center or Microsoft 365 admin center. You must sign in to Exchange admin center or Microsoft 365 admin center to manage these groups.

## What to know before creating a group

There are two group types and three group membership types. Review the options to find the right combination for your scenario.

### Group types:

**Security:** Used to manage user and computer access to shared resources.

For example, you can create a security group so that all group members have the same set of security permissions. Members of a security group can include users, devices, other groups, and [service principals](../fundamentals/service-accounts-principal.md), which define access policy and permissions. Owners of a security group can include users and service principals. For more info about managing access to resources, see [Manage access to resources with Azure Active Directory groups](active-directory-manage-groups.md).

**Microsoft 365:** Provides collaboration opportunities by giving group members access to a shared mailbox, calendar, files, SharePoint sites, and more.

This option also lets you give people outside of your organization access to the group. Members of a Microsoft 365 group can only include users. Owners of a Microsoft 365 group can include users and service principals. For more info about Microsoft 365 Groups, see [Learn about Microsoft 365 Groups](https://support.office.com/article/learn-about-office-365-groups-b565caa1-5c40-40ef-9915-60fdb2d97fa2).

### Membership types:
- **Assigned:** Lets you add specific users as members of a group and have unique permissions.
- **Dynamic user:** Lets you use dynamic membership rules to automatically add and remove members. If a member's attributes change, the system looks at your dynamic group rules for the directory to see if the member meets the rule requirements (is added) or no longer meets the rules requirements (is removed).
- **Dynamic device:** Lets you use dynamic group rules to automatically add and remove devices. If a device's attributes change, the system looks at your dynamic group rules for the directory to see if the device meets the rule requirements (is added) or no longer meets the rules requirements (is removed).

    > [!IMPORTANT]
    > You can create a dynamic group for either devices or users, but not for both. You can't create a device group based on the device owners' attributes. Device membership rules can only reference device attributions. For more info about creating a dynamic group for users and devices, see [Create a dynamic group and check status](../enterprise-users/groups-create-rule.md)


## What to know about group-based licensing

Microsoft paid cloud services, such as Microsoft 365, Enterprise Mobility + Security, Dynamics 365, and other similar products, require licenses. These licenses are assigned to each user who needs access to these services. To manage licenses, administrators use one of the management portals (Office or Azure) and PowerShell cmdlets. Azure Azure AD is the underlying infrastructure that supports identity management for all Microsoft cloud services. Azure AD stores information about license assignment states for users.

Azure AD includes group-based licensing, which allows you to assign one or more product licenses to a group. Azure AD ensures that the licenses are assigned to all members of the group. Any new members who join the group are assigned the appropriate licenses. When they leave the group, those licenses are removed. This licensing management eliminates the need for automating license management via PowerShell to reflect changes in the organization and departmental structure on a per-user basis.

### Licensing requirements
You must have one of the following licenses **for every user who benefits from** group-based licensing:

- Paid or trial subscription for Azure AD Premium P1 and above

- Paid or trial edition of Microsoft 365 Business Premium or Office 365 Enterprise E3 or Office 365 A3 or Office 365 GCC G3 or Office 365 E3 for GCCH or Office 365 E3 for DOD and above

### Required number of licenses
For any groups assigned a license, you must also have a license for each unique member. While you don't have to assign each member of the group a license, you must have at least enough licenses to include all of the members. For example, if you have 1,000 unique members who are part of licensed groups in your tenant, you must have at least 1,000 licenses to meet the licensing agreement.

### Features of group-based licensing

Licenses can be assigned to any security group in Azure AD. Security groups can be synced from on-premises, by using [Azure AD Connect](../hybrid/whatis-azure-ad-connect.md). You can also create security groups directly in Azure AD (also called cloud-only groups), or automatically via the [Azure AD dynamic group feature](../enterprise-users/groups-create-rule.md).

When a product license is assigned to a group, the administrator can disable one or more service plans in the product. Typically, this assignment is done when the organization is not yet ready to start using a service included in a product. For example, the administrator might assign Microsoft 365 to a department, but temporarily disable the Yammer service.

All Microsoft cloud services that require user-level licensing are supported. This support includes all Microsoft 365 products, Enterprise Mobility + Security, and Dynamics 365.

Group-based licensing is currently available only through the [Azure portal](https://portal.azure.com). If you primarily use other management portals for user and group management, such as the [Microsoft 365 admin center](https://admin.microsoft.com), you can continue to do so. But you should use the Azure portal to manage licenses at the group level.

Azure AD automatically manages license modifications that result from group membership changes. Typically, license modifications are effective within minutes of a membership change.

A user can be a member of multiple groups with license policies specified. A user can also have some licenses that were directly assigned, outside of any groups. The resulting user state is a combination of all assigned product and service licenses. If a user is assigned the same license from multiple sources, the license will be consumed only once.

In some cases, licenses cannot be assigned to a user. For example, there might not be enough available licenses in the tenant, or conflicting services might have been assigned at the same time. Administrators have access to information about users for whom Azure AD could not fully process group licenses. They can then take corrective action based on that information.

To learn more about other scenarios for license management through group-based licensing, see:

* [Assigning licenses to a group in Azure Active Directory](../enterprise-users/licensing-groups-assign.md)
* [Identifying and resolving license problems for a group in Azure Active Directory](../enterprise-users/licensing-groups-resolve-problems.md)
* [How to migrate individual licensed users to group-based licensing in Azure Active Directory](../enterprise-users/licensing-groups-migrate-users.md)
* [How to migrate users between product licenses using group-based licensing in Azure Active Directory](../enterprise-users/licensing-groups-change-licenses.md)
* [Azure Active Directory group-based licensing additional scenarios](../enterprise-users/licensing-group-advanced.md)
* [PowerShell examples for group-based licensing in Azure Active Directory](../enterprise-users/licensing-ps-examples.md)

## What to know before adding access rights to a group

After creating an Azure AD group, you need to grant it the appropriate access. Each application, resource, and service that requires access permissions needs to be managed separately because the permissions for one may not be the same as another. Grant access using the [principle of least privilege](../develop/secure-least-privileged-access.md) to help reduce the risk of attack or a security breach.

### How access management in Azure AD works

Azure AD helps you give access to your organization's resources by providing access rights to a single user or to an entire Azure AD group. Using groups lets the resource owner or Azure AD directory owner assign a set of access permissions to all the members of the group. The resource or directory owner can also give management rights for the member list to someone else, such as a department manager or a help desk administrator, letting that person add and remove members, as needed. For more information about how to manage group owners, see [Manage group owners](active-directory-accessmanagement-managing-group-owners.md)

![Azure Active Directory access management diagram](./media/active-directory-manage-groups/active-directory-access-management-works.png)

### Ways to assign access rights

After creating a group, you need to decide how to assign access rights. Explore the ways to assign access rights to determine the best process for your scenario. 

- **Direct assignment.** The resource owner directly assigns the user to the resource.

- **Group assignment.** The resource owner assigns an Azure AD group to the resource, which automatically gives all of the group members access to the resource. Group membership is managed by both the group owner and the resource owner, letting either owner add or remove members from the group. For more information about adding or removing group membership, see [How to: Add or remove a group from another group using the Azure Active Directory portal](active-directory-groups-membership-azure-portal.md). 

- **Rule-based assignment.** The resource owner creates a group and uses a rule to define which users are assigned to a specific resource. The rule is based on attributes that are assigned to individual users. The resource owner manages the rule, determining which attributes and values are required to allow access the resource. For more information, see [Create a dynamic group and check status](../enterprise-users/groups-create-rule.md).

- **External authority assignment.** Access comes from an external source, such as an on-premises directory or a SaaS app. In this situation, the resource owner assigns a group to provide access to the resource and then the external source manages the group members.

   ![Overview of access management diagram](./media/active-directory-manage-groups/access-management-overview.png)

### Can users join groups without being assigned?
The group owner can let users find their own groups to join, instead of assigning them. The owner can also set up the group to automatically accept all users that join or to require approval.

After a user requests to join a group, the request is forwarded to the group owner. If it's required, the owner can approve the request and the user is notified of the group membership. However, if you have multiple owners and one of them disapproves, the user is notified, but isn't added to the group. For more information and instructions about how to let your users request to join groups, see [Set up Azure AD so users can request to join groups](../enterprise-users/groups-self-service-management.md).

## Next steps

- [Create and manage Azure AD groups and group membership](../fundamentals/active-directory-groups-NEW.md)

- [Manage access to SaaS apps using groups](../enterprise-users/groups-saasapps.md)

- [Manage dynamic rules for users in a group](../enterprise-users/groups-create-rule.md)

- [Scenarios, limitations, and known issues using groups to manage licensing in Azure Active Directory](../enterprise-users/licensing-group-advanced.md#limitations-and-known-issues)

- [Learn about Privileged Identity Management for Azure AD roles](../../active-directory/privileged-identity-management/pim-create-azure-ad-roles-and-resource-roles-review.md)