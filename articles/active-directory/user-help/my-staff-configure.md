---
title: My Staff to delegate managing users (preview) - Azure AD | Microsoft Docs
description:  Delegate user management using My Staff and administrative units
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
# Manage your users with My Staff (preview)

My Staff enables certain authorized users, such as a store manager or a team lead, to ensure that their staff members are able to access to their Azure AD accounts. Instead of relying on a central helpdesk, organizations can delegate common tasks such as resetting passwords or changing phone numbers to a team manager. With My Staff, a user who can't access their account can regain access in just a couple of clicks--no helpdesk or IT staff required.

Before you configure My Staff for your organization, we recommend that you review this documentation as well as the [user documentation](my-staff-team-manager.md) to ensure you understand the functionality and impact of this feature on your users. You can leverage the user documentation to train and prepare your users for the new experience and help to ensure a successful rollout.

## How My Staff works

My Staff is based on administrative units (AUs), which are a container of resources which can be used to restrict the scope of a role assignment's administrative control. In My Staff, AUs are used to define a subset of an organization's users such as a store or department. Then, for example, a team manager could be assigned to a role whose scope is one or more AUs. In the example below, the user has been granted the Authentication Administrative role, and the three AUs are the scope of the role.

![My Staff where a user has been assigned to the Authentication Administrator role](media/my-staff-configure/example-user.png)

## How to enable My Staff

Once you have configured AUs, you can enable your users to access my staff. Regardless of who is enabled to use my staff, only users who have been assigned an administrative role will be able to access my staff. To enable My Staff, complete the following steps:

1. Sign into the Azure portal as a User administrator or a Global administrator.
2. Browse to **Azure Active Directory** > **User settings** > **Manage settings for access panel preview features**.
3. Under **Administrators can access My Staff**, you can choose to enable for all users, selected users, or no user access.

## Using My Staff

When a user goes to My Staff, they are shown a list of AUs (seen as "locations") over which they have administrative permissions. If an administrator's permissions do not have an AU scope, they will see all AUs in the organization. After my staff has been enabled, the users who are enabled and have been assigned an administrative role can access it through https://mystaff.microsoft.com. They can select an AU to view the members of that AU, and then select a user to open their profile.

## Reset a user's password

To reset a user's password, you must be assigned one of the following roles:

- Password Administrator
- Helpdesk Administrator
- Authentication Administrator
- Global Administrator
- Company Administrator

From **My Staff**, open a user's profile. Select **Reset password**.

- If the user is cloud-only, you will be shown a temporary password that you can give to the user.
- If the user is synced from on-premises Active Directory, you are prompted to enter a password that meets your on-premises AD policies. You can then give that password to the user.

The user is prompted to change their password the next time they sign in.

## Search

You can search for AUs and users in your organization using the search bar in My Staff. You can search across all locations and users in your organization, but you can only make changes to users who are in a AU over which you have been given admin permissions.

You can also search for a user within an AU. To do this, use the search bar at the top of the user list.

## Audit logs

You can view audit logs for My Staff in the Azure Active Directory portal. The following audit logs are generated from My Staff:

- Reset password (by admin)

## Manage a user's phone number

From My Staff, open a user's profile. Select the plus icon in the **Phone number** section. Add a phone number for the user. You can also select pencil icon to change the phone number, or select the trashcan icon to remove the phone number from the user's profile.

Depending on your settings, the user can use the phone number you set up to sign in with SMS sign-in, perform multi-factor authentication, and perform self-service password reset.

To manage a user's phone number, you must be assigned to the Authentication Administrator role.

## Next steps

[Azure Active Directory editions](../fundamentals/active-directory-whatis.md)
