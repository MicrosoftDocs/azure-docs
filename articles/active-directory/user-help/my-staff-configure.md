---
title: My staff delegated user management (preview) - Azure AD | Microsoft Docs
description:  Delegate user management using My staff and administrative units
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.topic: article
ms.service: active-directory
ms.subservice: user-help
ms.workload: identity
ms.date: 03/20/2020
ms.author: curtand
ms.reviewer: sahenry
ms.custom: oldportal;it-pro;

---
# My staff user management delegation (preview)

**My staff** enables work team managers, such as store managers, to ensure that their staff members are able to access their Azure AD accounts. Instead of relying on a central helpdesk, organizations can delegate common tasks such as resetting passwords or changing phone numbers to a team manager. With My staff, a user who can't access their account can re-gain access in just a couple of clicks – no helpdesk or IT staff required.

Before you configure My staff for your organization, we recommend that you review this documentation as well as the [team manager documentation](my-staff-team-manager.md) to ensure you understand the functionality and impact of this feature on your users. You can leverage the user documentation to train and prepare your users for the new experience and help to ensure a successful rollout.

## How My staff works

My staff is based on administrative Units (AUs), which are a container of resources over which a user is given scoped administrative control. In My staff, AUs are used to define a set of users such as a store or department; for example, a team manager assigned to a role that is scoped to one or more AUs. In the screenshot below, the user has been granted the Authentication Administrative role, and the three AUs are the role scope.

![My staff where a user has been assigned to the Authentication Administrator role](media/my-staff-configure/example-user.png)

## How to enable My staff

Once you have configured AUs, you can enable your users to access my staff. Regardless of who is enabled to use my staff, only users who have been assigned an administrative role will be able to access my staff. To enable My staff, complete the following steps:

1. Sign into the Azure portal as a User administrator or a Global administrator.
2. Browse to **Azure Active Directory** > **User settings** > **Manage settings for access panel preview features**.
3. Under **Administrators can access My staff**, you can choose to enable for all users, selected users, or no user access.

## Using My staff

After my staff has been enabled, the users who are enabled and have been assigned an administrative role can access it through https://mystaff.microsoft.com. When you enable a user in My staff, you are shown a list of AUs that you have been given administrative permissions over. Select an AU to view the members of that AU. After you select an AU, you can select a user to open their profile.

## Reset a user's password

To do this, you must be assigned to the [Helpdesk Administrator](../users-groups-roles/directory-assign-admin-roles.md#helpdesk-administrator) role. From **My staff**, open a user's profile. Choose **Reset password**.

- If the user is cloud-only, you will be shown a temporary password that you can give to the user.
- If the user is synced from on-premises Active Directory, you are prompted to enter a password that meets your on-premises AD policies. You can then give that password to the user.

The user is prompted to change their password the next time they sign in.

## Search

You can search for locations and users in your organization. Use the search bar at the top of the My staff experience. You can search across all locations and users in your organization, but you can only make changes to users who are in a location to which you have been given admin permissions.

You can also search for a user within a location. To do this, use the search bar at the top of the user list.

## Audit logs

You can view audit logs for My staff in the Azure Active Directory portal. The following audit logs are generated from My staff:

- Reset password (by admin)
- Other ?

<!-- ## Manage a user's phone number (coming soon)

From My staff, open a user's profile. Choose the plus icon in the "Phone number" section. Add a phone number for the user. You can also choose pencil icon to change the phone number. Lastly, you can choose the trashcan icon to delete the phone number from the user's profile.

Depending on your settings, the user can use the phone number you set to sign in with SMS sign in, perform Multi-Factor Authentication, and perform self-service password reset.
To do this, you must have the Authentication Administrator role or a more privileged role.
-->

## Next steps

[Azure Active Directory editions](../fundamentals/active-directory-whatis.md)
