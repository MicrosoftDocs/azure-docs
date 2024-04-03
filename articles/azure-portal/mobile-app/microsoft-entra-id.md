---
title: Use Microsoft Entra ID with the Azure mobile app
description: Use the Azure mobile app to manage users and groups with Microsoft Entra ID.
ms.date: 03/08/2024
ms.topic: conceptual
---

# Use Microsoft Entra ID with the Azure mobile app

The Azure mobile app provides access to Microsoft Entra ID. You can perform tasks such as managing users and updating group memberships from within the app.

To access Microsoft Entra ID, open the Azure mobile app and sign in with your Azure account. From **Home**, scroll down to select the **Microsoft Entra ID** card.

> [!NOTE]
> Your account must have the appropriate permissions in order to perform these tasks. For example, to invite a user to your tenant, you must have a role that includes this permission, such as [Guest Inviter](/entra/identity/role-based-access-control/permissions-reference) role or [User Administrator](/entra/identity/role-based-access-control/permissions-reference).

## Invite a user to the tenant

To invite a [guest user](/entra/external-id/what-is-b2b) to your tenant from the Azure mobile app:

1. In **Microsoft Entra ID**, select **Users**, then select the **+** icon in the top right corner.
1. Select **Invite user**, then enter the user's name and email address. You can optionally add a message for the user.
1. Select **Invite** in the top right corner, then select **Save** to confirm your changes.

## Add users to a group

To add one or more users to a group from the Azure mobile app:

1. In **Microsoft Entra ID**, select **Groups**.
1. Search or scroll to find the desired group, then tap to select it.
1. On the **Members** card, select **See All**. The current list of members is displayed.
1. Select the **+** icon in the top right corner.
1. Search or scroll to find users you want to add to the group, then select the user(s) by tapping the circle next to their name.
1. Select **Add** in the top right corner to add the selected users(s) to the group.

## Add group memberships for a specified user

You can also add a single user to one or more groups in the **Users** section of **Microsoft Entra ID** in the Azure mobile app. To do so:

1. In **Microsoft Entra ID**, select **Users**, then search or scroll to find and select the desired user.
1. On the **Groups** card, select **See All** to display all current group memberships for that user.
1. Select the **+** icon in the top right corner.
1. Search or scroll to find groups to which this user should be added, then select the group(s) by tapping the circle next to the group name.
1. Select **Add** in the top right corner to add the user to the selected group(s).

## Manage authentication methods or reset password for a user

To [manage authentication methods](/entra/identity/authentication/concept-authentication-methods-manage) or [reset a user's password](/entra/fundamentals/users-reset-password-azure-portal), you need to do the following steps:

1. In **Microsoft Entra ID**, select **Users**, then search or scroll to find and select the desired user.
1. On the **Authentication methods** card, select **Manage**.
1. Select **Reset password** to assign a temporary password to the user, or **Authentication methods** to manage to Tap on the desired user, then tap on “Reset password” or “Authentication methods” based on your permissions.

> [!NOTE]
> You won't see the **Authentication methods** card if you don't have the appropriate permissions to manage authentication methods and/or password changes for a user.

## Activate Privileged Identity Management (PIM) roles

If you have been made eligible for an administrative role through Microsoft Entra Privileged Identity Management (PIM), you must activate the role assignment when you need to perform privileged actions. This activation can be done from within the Azure mobile app.

For more information, see [Activate PIM roles using the Azure mobile app](/entra/id-governance/privileged-identity-management/pim-how-to-activate-role).

## Next steps

- Learn more about the [Azure mobile app](overview.md).
- Download the Azure mobile app for free from the [Apple App Store](https://aka.ms/ReferAzureIOSEntraIDMobileAppDocs), [Google Play](https://aka.ms/azureapp/android/doc) or [Amazon App Store](https://aka.ms/azureapp/amazon/doc).
