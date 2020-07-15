---
title: Add or remove group members - Azure Active Directory | Microsoft Docs
description: Instructions about how to add or remove members from a group using Azure Active Directory.
services: active-directory
author: msaburnley
manager: daveba

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: how-to
ms.date: 08/23/2018
ms.author: ajburnle
ms.custom: "it-pro, seodec18"
ms.reviewer: krbain
ms.collection: M365-identity-device-management
---

# Add or remove group members using Azure Active Directory
Using Azure Active Directory, you can continue to add and remove group members.

## To add group members

1. Sign in to the [Azure portal](https://portal.azure.com) using a Global administrator account for the directory.

2. Select **Azure Active Directory**, and then select **Groups**.

3. From the **Groups - All groups** page, search for and select the group you want to add the member to. In this case, use our previously created group, **MDM policy - West**.

    ![Groups-All groups page, group name highlighted](media/active-directory-groups-members-azure-portal/group-all-groups-screen.png)

4. From the **MDM policy - West Overview** page, select **Members** from the **Manage** area.

    ![MDM policy - West Overview page, with Members option highlighted](media/active-directory-groups-members-azure-portal/group-overview-blade.png)

5. Select **Add members**, and then search and select each of the members you want to add to the group, and then choose **Select**.

    You'll get a message that says the members were added successfully.

    ![Add members page, with searched for member shown](media/active-directory-groups-members-azure-portal/update-members.png)

6. Refresh the screen to see all of the member names added to the group.

## To remove group members

1. From the **Groups - All groups** page, search for and select the group you want to remove the member from. Again we'll use, **MDM policy - West**.

2. Select **Members** from the **Manage** area, search for and select the name of the member to remove, and then select **Remove**.

    ![Member info page, with Remove option](media/active-directory-groups-members-azure-portal/remove-members-from-group.png)

## Next steps

- [View your groups and members](active-directory-groups-view-azure-portal.md)

- [Edit your group settings](active-directory-groups-settings-azure-portal.md)

- [Manage access to resources using groups](active-directory-manage-groups.md)

- [Manage dynamic rules for users in a group](../users-groups-roles/groups-create-rule.md)

- [Associate or add an Azure subscription to Azure Active Directory](active-directory-how-subscriptions-associated-directory.md)
