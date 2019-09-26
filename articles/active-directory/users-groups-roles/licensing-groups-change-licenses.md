---
title: How to migrate users to service licenses with groups - Azure Active Directory | Microsoft Docs
description: Describes the recommended process to migrate users within a group to different service licenses (Office 365 Enterprise E1 and E3) using group-based licensing
services: active-directory
keywords: Azure AD licensing
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: article
ms.workload: identity
ms.subservice: users-groups-roles
ms.date: 09/27/2019
ms.author: curtand
ms.reviewer: sumitp
ms.custom: "it-pro;seo-update-azuread-jan"
ms.collection: M365-identity-device-management
---

# Change the license for a single user in a licensed group in Azure Active Directory

This article describes the recommended method to move users between service licenses when using group-based licensing. The goal of this approach is to ensure that there's no loss of service or data during the migration: users should switch between services seamlessly. Two variants of the migration process are covered:

- Simple migration between service licenses that don't contain conflicting service plans, such as migrating between Office 365 Enterprise E3 and Office 365 Enterprise E5.

- More complex migration between services that contain some conflicting service plans, such as migrating between Office 365 Enterprise E1 and Office 365 Enterprise E3. For more information about conflicts, see [Conflicting service plans](https://docs.microsoft.com/azure/active-directory/active-directory-licensing-group-problem-resolution-azure-portal#conflicting-service-plans) and [Service plans that can't be assigned at the same time](https://docs.microsoft.com/azure/active-directory/active-directory-licensing-product-and-service-plan-reference#service-plans-that-cannot-be-assigned-at-the-same-time).

## Before you begin

Before you begin the migration, it's important to verify certain assumptions are true for all of the users to be migrated. If the assumptions aren't true for all of the users, the migration might fail for some. As a result, some of the users might lose access to services or data. The following assumptions should be verified:

- Users have the current license that's assigned by using group-based licensing. The licenses for the current service are inherited from a single source group and aren't assigned directly.

- You have enough available licenses for the desired service. If you don't have enough licenses, some users might not get the desired license. You can check the number of available licenses.

- Users don't have other assigned service licenses that can conflict with the desired license or prevent removal of the current license. For example, a license from an add-on service like Workplace Analytics or Project Online, that has a dependency on other services.

- Understand how groups are managed in your environment. For example, if you manage groups on-premises and sync them into Azure Active Directory (Azure AD) via Azure AD Connect, then you add/remove users by using your on-premises system. It takes time for the changes to sync into Azure AD and get picked up by group-based licensing. If you're using Azure AD dynamic group memberships, you add/remove users by modifying their attributes instead. However, the overall migration process remains the same. The only difference is how you add/remove users for group membership.

## Change user license plans

1. Sign in to the [Azure portal](https://portal.azure.com/) using a License administrator account in your Azure AD organization.
1. Select **Azure Active Directory**, and then open the **Profile** page for the user or the **Overview** page for the group.
1. Select **Licenses**.
1. Select the **Assignments** command to edit license assignment for the user or group. Azure AD will show you which features it is licensing for each license plan assigned to the user, and automatically resolves license conflicts.

  ![Select the Assignments command on a user or group Licenses page](media/license-change-licenses/assignments-command.png)

1. Edit the options until the licenses are as you want them to be.

    ![Assignments page, with number of purchased services and assigned licenses](media/license-change-licenses/update-license-assignments.png)

## Next steps

Learn about other scenarios for license management through groups in the following articles:

- [Assigning licenses to a group in Azure Active Directory](../users-groups-roles/licensing-groups-assign.md)
- [Identifying and resolving license problems for a group in Azure Active Directory](../users-groups-roles/licensing-groups-resolve-problems.md)
- [How to migrate individual licensed users to group-based licensing in Azure Active Directory](../users-groups-roles/licensing-groups-migrate-users.md)
- [Azure Active Directory group-based licensing additional scenarios](../users-groups-roles/licensing-group-advanced.md)
- [PowerShell examples for group-based licensing in Azure Active Directory](../users-groups-roles/licensing-ps-examples.md)
