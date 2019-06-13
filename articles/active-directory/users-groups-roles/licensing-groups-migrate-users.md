---

title: Add individually licensed users to group-based licensing - Azure Active Directory | Microsoft Docs
description: How to migrate from individual user licenses to group-based licensing using Azure Active Directory
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
ms.date: 03/18/2019
ms.author: curtand
ms.reviewer: sumitp
ms.custom: "seohack1;it-pro"
ms.collection: M365-identity-device-management
---

# How to migrate users with individual licenses to groups for licensing

You may have existing licenses deployed to users in the organizations via “direct assignment”; that is, using PowerShell scripts or other tools to assign individual user licenses. Before you begin using group-based licensing to manage licenses in your organization, you can use this migration plan to seamlessly replace existing solutions with group-based licensing.

The most important thing to keep in mind is that you should avoid a situation where migrating to group-based licensing will result in users temporarily losing their currently assigned licenses. Any process that may result in removal of licenses should be avoided to remove the risk of users losing access to services and their data.

## Recommended migration process

1. You have existing automation (for example, PowerShell) managing license assignment and removal for users. Leave it running as is.

2. Create a new licensing group (or decide which existing groups to use) and make sure that all required users are added as members.

3. Assign the required licenses to those groups; your goal should be to reflect the same licensing state your existing automation (for example, PowerShell) is applying to those users.

4. Verify that licenses have been applied to all users in those groups. This application can be done by checking the processing state on each group and by checking Audit Logs.

   - You can spot check individual users by looking at their license details. You will see that they have the same licenses assigned “directly” and “inherited” from groups.

   - You can run a PowerShell script to [verify how licenses are assigned to users](licensing-group-advanced.md#use-powershell-to-see-who-has-inherited-and-direct-licenses).

   - When the same product license is assigned to the user both directly and through a group, only one license is consumed by the user. Hence no additional licenses are required to perform migration.

5. Verify that no license assignments failed by checking each group for users in error state. For more information, see [Identifying and resolving license problems for a group](licensing-groups-resolve-problems.md).

6. Consider removing the original direct assignments; you may want to do it gradually, in “waves”, to monitor the outcome on a subset of users first.

   You could leave the original direct assignments on users, but when the users leave their licensed groups they will still retain the original license, which is possibly not what you want.

## An example

An organization has 1,000 users. All users require Enterprise Mobility + Security (EMS) licenses. 200 users are in the Finance Department and require Office 365 Enterprise E3 licenses. Currently the organization has a PowerShell script running on premises, adding and removing licenses from users as they come and go. However, the organization wants to replace the script with group-based licensing so licenses can be managed automatically by Azure AD.

Here is what the migration process could look like:

1. Using the Azure portal, assign the EMS license to the **All users** group in Azure AD. Assign the E3 license to the **Finance department** group that contains all the required users.

2. For each group, confirm that license assignment has completed for all users. Go to the blade for each group, select **Licenses**, and check the processing status at the top of the **Licenses** blade.

   - Look for “Latest license changes have been applied to all users" to confirm processing has completed.

   - Look for a notification on top about any users for whom licenses may have not been successfully assigned. Did we run out of licenses for some users? Do some users have conflicting license SKUs that prevent them from inheriting group licenses?

3. Spot check some users to verify that they have both the direct and group licenses applied. Go to the blade for a user, select **Licenses**, and examine the state of licenses.

   - This is the expected user state during migration:

      ![the expected user state during migration](./media/licensing-groups-migrate-users/expected-user-state.png)

   This confirms that the user has both direct and inherited licenses. We see that both **EMS** and **E3** are assigned.

   - Select each license to show details about the enabled services. This can be used to check if the direct and group licenses enable exactly the same service plans for the user.

      ![check service plans for the user](./media/licensing-groups-migrate-users/check-service-plans.png)

4. After confirming that both direct and group licenses are equivalent, you can start removing direct licenses from users. You can test this by removing them for individual users in the portal and then run automation scripts to have them removed in bulk. Here is an example of the same user with the direct licenses removed through the portal. Notice that the license state remains unchanged, but we no longer see direct assignments.

   ![confirm that direct licenses are removed](./media/licensing-groups-migrate-users/direct-licenses-removed.png)

## Next steps

To learn more about other scenarios for license management through groups, read

* [What is group-based licensing in Azure Active Directory?](../fundamentals/active-directory-licensing-whatis-azure-portal.md)
* [Assigning licenses to a group in Azure Active Directory](licensing-groups-assign.md)
* [Identifying and resolving license problems for a group in Azure Active Directory](licensing-groups-resolve-problems.md)
* [How to migrate users between product licenses using group-based licensing in Azure Active Directory](licensing-groups-change-licenses.md)
* [Azure Active Directory group-based licensing additional scenarios](licensing-group-advanced.md)
* [PowerShell examples for group-based licensing in Azure Active Directory](licensing-ps-examples.md)
