---
title: Enable B2B external collaboration settings
description: Learn how to enable Active Directory B2B external collaboration and manage who can invite guest users. Use the Guest Inviter role to delegate invitations.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.custom: has-azure-ad-ps-ref
ms.topic: how-to
ms.date: 10/24/2022

ms.author: mimart
author: msmimart
manager: celestedg

ms.collection: M365-identity-device-management
---

# Configure external collaboration settings

External collaboration settings let you specify what roles in your organization can invite external users for B2B collaboration. These settings also include options for [allowing or blocking specific domains](allow-deny-list.md), and options for restricting what external guest users can see in your Microsoft Entra directory. The following options are available:

- **Determine guest user access**: Microsoft Entra External ID allows you to restrict what external guest users can see in your Microsoft Entra directory. For example, you can limit guest users' view of group memberships, or allow guests to view only their own profile information.

- **Specify who can invite guests**: By default, all users in your organization, including B2B collaboration guest users, can invite external users to B2B collaboration. If you want to limit the ability to send invitations, you can turn invitations on or off for everyone, or limit invitations to certain roles.

- **Enable guest self-service sign-up via user flows**: For applications you build, you can create user flows that allow a user to sign up for an app and create a new guest account. You can enable the feature in your external collaboration settings, and then [add a self-service sign-up user flow to your app](self-service-sign-up-user-flow.md).

- **Allow or block domains**: You can use collaboration restrictions to allow or deny invitations to the domains you specify. For details, see [Allow or block domains](allow-deny-list.md).

For B2B collaboration with other Microsoft Entra organizations, you should also review your [cross-tenant access settings](cross-tenant-access-settings-b2b-collaboration.md) to ensure your inbound and outbound B2B collaboration and scope access to specific users, groups, and applications.

For B2B collaboration end-users who perform cross-tenant sign-ins, their home tenant branding appears, even if there isn't custom branding specified. In the following example, the company branding for Woodgrove Groceries appears on the left. The example on the right displays the default branding for the user's home tenant.

:::image type="content" source="media/external-identities-overview/b2b-comparison.png" alt-text="Screenshots showing a comparison of the branded sign-in experience and the default sign-in experience.":::

## Configure settings in the portal

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [External Identity Provider administrator](../roles/permissions-reference.md#external-identity-provider-administrator).

1. Browse to **Identity** > **External Identities** > **External collaboration settings**.

1. Under **Guest user access**, choose the level of access you want guest users to have:
  
    ![Screenshot showing Guest user access settings.](./media/external-collaboration-settings-configure/guest-user-access.png)

   - **Guest users have the same access as members (most inclusive)**: This option gives guests the same access to Microsoft Entra resources and directory data as member users.

   - **Guest users have limited access to properties and memberships of directory objects**: (Default) This setting blocks guests from certain directory tasks, like enumerating users, groups, or other directory resources. Guests can see membership of all non-hidden groups. [Learn more about default guest permissions](../fundamentals/users-default-permissions.md#member-and-guest-users).

   - **Guest user access is restricted to properties and memberships of their own directory objects (most restrictive)**: With this setting, guests can access only their own profiles. Guests aren't allowed to see other users' profiles, groups, or group memberships.

1. Under **Guest invite settings**, choose the appropriate settings:

    ![Screenshot showing Guest invite settings.](./media/external-collaboration-settings-configure/guest-invite-settings.png)

   - **Anyone in the organization can invite guest users including guests and non-admins (most inclusive)**: To allow guests in the organization to invite other guests including those who aren't members of an organization, select this radio button.
   - **Member users and users assigned to specific admin roles can invite guest users including guests with member permissions**: To allow member users and users who have specific administrator roles to invite guests, select this radio button.
   - **Only users assigned to specific admin roles can invite guest users**: To allow only those users with administrator roles to invite guests, select this radio button. The administrator roles include [Global Administrator](../roles/permissions-reference.md#global-administrator), [User Administrator](../roles/permissions-reference.md#user-administrator), and [Guest Inviter](../roles/permissions-reference.md#guest-inviter).
   - **No one in the organization can invite guest users including admins (most restrictive)**: To deny everyone in the organization from inviting guests, select this radio button.

1. Under **Enable guest self-service sign up via user flows**, select **Yes** if you want to be able to create user flows that let users sign up for apps. For more information about this setting, see [Add a self-service sign-up user flow to an app](self-service-sign-up-user-flow.md).

    ![Screenshot showing Self-service sign up via user flows setting.](./media/external-collaboration-settings-configure/self-service-sign-up-setting.png)

1. Under **External user leave settings**, you can control whether external users can remove themselves from your organization. If you set this option to **No**, external users will need to contact your admin or privacy contact to be removed.

   - **Yes**: Users can leave the organization themselves without approval from your admin or privacy contact.
   - **No**: Users can't leave your organization themselves. They'll see a message guiding them to contact your admin or privacy contact to request removal from your organization.

   > [!IMPORTANT]
   > You can configure **External user leave settings** only if you have [added your privacy information](../fundamentals/properties-area.md) to your Microsoft Entra tenant. Otherwise, this setting will be unavailable.

   ![Screenshot showing External user leave settings in the portal.](media/external-collaboration-settings-configure/external-user-leave-settings.png)

1. Under **Collaboration restrictions**, you can choose whether to allow or deny invitations to the domains you specify and enter specific domain names in the text boxes. For multiple domains, enter each domain on a new line. For more information, see [Allow or block invitations to B2B users from specific organizations](allow-deny-list.md).

    ![Screenshot showing Collaboration restrictions settings.](./media/external-collaboration-settings-configure/collaboration-restrictions.png)

## Configure settings with Microsoft Graph

External collaboration settings can be configured by using the Microsoft Graph API:

- For **Guest user access restrictions** and **Guest invite restrictions**, use the [authorizationPolicy](/graph/api/resources/authorizationpolicy?view=graph-rest-1.0&preserve-view=true) resource type.
- For the **Enable guest self-service sign up via user flows** setting, use [authenticationFlowsPolicy](/graph/api/resources/authenticationflowspolicy?view=graph-rest-1.0&preserve-view=true) resource type.
- For email one-time passcode settings (now on the **All identity providers** page in the Microsoft Entra admin center), use the [emailAuthenticationMethodConfiguration](/graph/api/resources/emailAuthenticationMethodConfiguration?view=graph-rest-1.0&preserve-view=true) resource type.

## Assign the Guest Inviter role to a user

With the Guest Inviter role, you can give individual users the ability to invite guests without assigning them a global administrator or other admin role. Assign the Guest inviter role to individuals. Then make sure you set **Admins and users in the guest inviter role can invite** to **Yes**.

Here's an example that shows how to use Microsoft Graph PowerShell to add a user to the `Guest Inviter` role:


```powershell

Import-Module Microsoft.Graph.Identity.DirectoryManagement

$roleName = "Guest Inviter"
$role = Get-MgDirectoryRole | where {$_.DisplayName -eq $roleName}
$userId = <User Id/User Principal Name>

$DirObject = @{
  "@odata.id" = "https://graph.microsoft.com/v1.0/directoryObjects/$userId"
  }

New-MgDirectoryRoleMemberByRef -DirectoryRoleId $role.Id -BodyParameter $DirObject

```

## Sign-in logs for B2B users

When a B2B user signs into a resource tenant to collaborate, a sign-in log is generated in both the home tenant and the resource tenant. These logs include information such as the application being used, email addresses, tenant name, and tenant ID for both the home tenant and the resource tenant. 

## Next steps

See the following articles on Microsoft Entra B2B collaboration:

- [What is Microsoft Entra B2B collaboration?](what-is-b2b.md)
- [Adding a B2B collaboration user to a role](./add-users-administrator.md)

