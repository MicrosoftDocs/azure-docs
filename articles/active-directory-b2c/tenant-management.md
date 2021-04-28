---
title: Manage your Azure Active Directory B2C
titleSuffix: Azure Active Directory B2C
description: Learn how to manage your Azure Active Directory B2C tenant. Learn which Azure AD features are supported in Azure AD B2C, how to use administrator roles to manage resources, and how to add work accounts and guest users to your Azure AD B2C tenant.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 04/19/2021
ms.custom: project-no-code
ms.author: mimart
ms.subservice: B2C
---

# Manage your Azure Active Directory B2C tenant

In Azure Active Directory B2C (Azure AD B2C), a tenant represents your directory of consumer users. Each Azure AD B2C tenant is distinct and separate from any other Azure AD B2C tenant. An Azure AD B2C tenant is different than an Azure Active Directory tenant, which you may already have. In this article, you learn how to manage your Azure AD B2C tenant.

## Supported Azure AD features

Azure AD B2C relies the Azure AD platform. The following Azure AD features can be used in your Azure AD B2C tenant.

|Feature  |Azure AD  | Azure AD B2C |
|---------|---------|---------|
| [Groups](../active-directory/fundamentals/active-directory-groups-create-azure-portal.md) | Groups can be used to manage administrative and user accounts.| Groups can be used to manage administrative accounts. [Consumer accounts](user-overview.md#consumer-user) don't support groups. |
| [Inviting External Identities guests](../active-directory//external-identities/add-users-administrator.md)| You can invite guest users and configure External Identities features such as federation and sign-in with Facebook and Google accounts. | You can invite only a Microsoft account or an Azure AD user as a guest to your Azure AD tenant for accessing applications or managing tenants. For [consumer accounts](user-overview.md#consumer-user), you use Azure AD B2C user flows and custom policies to manage users and sign-up or sign-in with external identity providers, such as Google or Facebook. |
| [Roles and administrators](../active-directory/fundamentals/active-directory-users-assign-role-azure-portal.md)| Fully supported for administrative and user accounts. | Roles are not supported with [consumer accounts](user-overview.md#consumer-user). Consumer accounts don't have access to any Azure resources.|
| [Custom domain names](../active-directory/roles/permissions-reference.md#) |  You can use Azure AD custom domains for administrative accounts only. | [Consumer accounts](user-overview.md#consumer-user) can sign in with a username, phone number, or any email address. You can use [custom domains](custom-domain.md) in your redirect URLs.|
| [Conditional Access](../active-directory/roles/permissions-reference.md#) | Fully supported for administrative and user accounts. | A subset of Azure AD Conditional Access features is supported with [consumer accounts](user-overview.md#consumer-user) Lean how to configure Azure AD B2C [custom domain](conditional-access-user-flow.md).|

## Other Azure resources in your tenant

In an Azure AD B2C tenant, you can't provision other Azure resources such as virtual machines, Azure web apps, or Azure functions. You must create these resources in your Azure AD tenant.

## Azure AD B2C accounts overview

The following types of accounts can be created in an Azure AD B2C tenant:

In an Azure AD B2C tenant, there are several types of accounts that can be created as described in the [Overview of user accounts in Azure Active Directory B2C](user-overview.md) article.

- **Work account** - A work account can access resources in a tenant, and with an administrator role, can manage tenants.
- **Guest account** - A guest account can only be a Microsoft account or an Azure Active Directory user that can be used to access applications or manage tenants.
- **Consumer account** - A consumer account is used by a user of the applications you've registered with Azure AD B2C.

For details about these account types, see [Overview of user accounts in Azure Active Directory B2C](user-overview.md). Any user who will be assigned to manage your Azure AD B2C tenant must have an Azure AD user account so they can access Azure-related services. You can add such a user by [creating an account](#add-an-administrator-work-account) (work account) in your Azure AD B2C tenant, or by [inviting them](#invite-an-administrator-guest-account) to your Azure AD B2C tenant as a guest user.

## Use roles to control resource access

When planning your access control strategy, it's best to assign users the least privileged role required to access resources. The following table describes the primary resources in your Azure AD B2C tenant and the most suitable administrative roles for the users who manage them.

|Resource  |Description  |Role  |
|---------|---------|---------|
|[Application registrations](tutorial-register-applications.md) | Create and manage all aspects of your web, mobile, and native application registrations within Azure AD B2C.|[Application Administrator](../active-directory/roles/permissions-reference.md#global-administrator)|
|[Identity providers](add-identity-provider.md)| Configure the [local identity provider](identity-provider-local.md) and external social or enterprise identity providers. | [External Identity Provider Administrator](../active-directory/roles/permissions-reference.md#external-identity-provider-administrator)|
|[API connectors](add-api-connector.md)| Integrate your user flows with web APIs to customize the user experience and integrate with external systems.|[External ID User Flow Attribute Administrator](../active-directory/roles/permissions-reference.md#external-id-user-flow-administrator)|
|[Company branding](customize-ui.md#configure-company-branding)| Customize your user flow pages.| [Global Administrator](../active-directory/roles/permissions-reference.md#global-administrator)|
|[User attributes](user-flow-custom-attributes.md)| Add or delete custom attributes available to all user flows.| [External ID User Flow Attribute Administrator](../active-directory/roles/permissions-reference.md#external-id-user-flow-attribute-administrator)|
|Manage users| Manage [consumer accounts](manage-users-portal.md) and administrative accounts as described in this article.| [User Administrator](../active-directory/roles/permissions-reference.md#user-administrator)|
|Roles and administrators| Manage role assignments in Azure AD B2C directory. Create and manage groups that can be assigned to Azure AD B2C roles. |[Global Administrator](../active-directory/roles/permissions-reference.md#global-administrator), [Privileged Role Administrator](../active-directory/roles/permissions-reference.md#privileged-role-administrator)|
|[User flows](user-flow-overview.md)|For quick configuration and enablement of common identity tasks, like sign-up, sign-in, and profile editing.| [External ID User Flow Attribute Administrator](../active-directory/roles/permissions-reference.md#external-id-user-flow-administrator)|
|[Custom policies](user-flow-overview.md)| Create, read, update, and delete all custom policies in Azure AD B2C.| [B2C IEF Policy Administrator](../active-directory/roles/permissions-reference.md#b2c-ief-policy-administrator)|
|[Policy keys](policy-keys-overview.md)|Add and manage encryption keys for signing and validating tokens, client secrets, certificates, and passwords used in custom policies.|[B2C IEF Keyset Administrator](../active-directory/roles/permissions-reference.md#b2c-ief-keyset-administrator)|


## Add an administrator (work account)

To create a new administrative account, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/) with Global Administrator or Privileged Role Administrator permissions.
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. Under **Azure services**, select **Azure AD B2C**. Or use the search box to find and select **Azure AD B2C**.
1. Under **Manage**, select **Users**.
1. Select **New user**.
1. On the **User** page, enter information for this user:

   - **Name**. Required. The first and last name of the new user. For example, *Mary Parker*.
   - **User name**. Required. The user name of the new user. For example, `mary@contoso.com`.
     The domain part of the user name must use either the initial default domain name, *\<yourdomainname>.onmicrosoft.com*.
   - **Groups**. Optionally, you can add the user to one or more existing groups. You can also add the user to groups at a later time. 
   - **Directory role**: If you require Azure AD administrative permissions for the user, you can add them to an Azure AD role. You can assign the user to be a Global administrator or one or more of the limited administrator roles in Azure AD. For more information about assigning roles, see [Use roles to control resource access](#use-roles-to-control-resource-access).
   - **Job info**: You can add more information about the user here, or do it later. 

1. Copy the autogenerated password provided in the **Password** box. You'll need to give this password to the user to sign in for the first time.
1. Select **Create**.

The user is created and added to your Azure AD B2C tenant. It's preferable to have at least one work account native to your Azure AD B2C tenant assigned the Global Administrator role. This account can be considered a break-glass account.

## Invite an administrator (guest account)

You can also invite a new guest user to manage your tenant. The guest account is the preferred option when your organization also has Azure AD because the lifecycle of this identity can be managed externally. 

To invite a user, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/) with Global Administrator or Privileged Role Administrator permissions.
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. Under **Azure services**, select **Azure AD B2C**. Or use the search box to find and select **Azure AD B2C**.
1. Under **Manage**, select **Users**.
1. Select **New guest account**.
1. On the **User** page, enter information for this user:

   - **Name**. Required. The first and last name of the new user. For example, *Mary Parker*.
   - **Email address**. Required. The email address of the user you would like to invite. For example, `mary@contoso.com`.   
   - **Personal message**: You add a personal message that will be included in the invite email.
   - **Groups**. Optionally, you can add the user to one or more existing groups. You can also add the user to groups at a later time.
   - **Directory role**: If you require Azure AD administrative permissions for the user, you can add them to an Azure AD role. You can assign the user to be a Global administrator or one or more of the limited administrator roles in Azure AD. For more information about assigning roles, see [Use roles to control resource access](#use-roles-to-control-resource-access).
   - **Job info**: You can add more information about the user here, or do it later.

1. Select **Create**.

An invitation email is sent to the user. The user needs to accept the invitation to be able to sign in.

### Resend the invitation email

If the guest didn't receive the invitation email, or the invitation expired, you can resend the invite. As an alternative to the invitation email, you can give a guest a direct link to accept the invitation. To resend the invitation and get the direct link:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. Under **Azure services**, select **Azure AD B2C**. Or use the search box to find and select **Azure AD B2C**.
1. Under **Manage**, select **Users**.
1. Search for and select the user you want to resend the invite to.
1. In the **User | Profile** page, under **Identity**, select **(Manage)**.
    
    ![Screenshot shows how to resend guest account invitation email.](./media/tenant-management/guest-account-resend-invite.png)

1. For **Resend invite?**, select **Yes**. When **Are you sure you want to resend an invitation?** appears, select **Yes**.
1. Azure AD B2C sends the invitation. You can also copy the invitation URL and provide it directly to the guest.
    
    ![Screenshot shows how get the invitation URL.](./media/tenant-management/guest-account-invitation-url.png)  
 
## Add a role assignment

You can assign a role when you [create a user](#add-an-administrator-work-account) or [invite a guest user](#invite-an-administrator-guest-account). You can add a role, change the role, or remove a role for a user:

1. Sign in to the [Azure portal](https://portal.azure.com/) with Global Administrator or Privileged Role Administrator permissions.
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. Under **Azure services**, select **Azure AD B2C**. Or use the search box to find and select **Azure AD B2C**.
1. Under **Manage**, select **Users**.
1. Select the user you want to change the roles for. Then select **Assigned roles**.
1. Select **Add assignments**, select the role to assign (for example, *Application administrator*), and then choose **Add**.

## Remove a role assignment

If you need to remove a role assignment from a user, follow these steps:

1. Select **Azure AD B2C**, select **Users**, and then search for and select the user.
1. Select **Assigned roles**. Select the role you want to remove, for example *Application administrator*, and then select **Remove assignment**.

## Review administrator account role assignments

As part of an auditing process, you typically review which users are assigned to specific roles in the Azure AD B2C directory. Use the following steps to audit which users are currently assigned privileged roles.

1. Sign in to the [Azure portal](https://portal.azure.com/) with Global Administrator or Privileged Role Administrator permissions.
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. Under **Azure services**, select **Azure AD B2C**. Or use the search box to find and select **Azure AD B2C**.
1. Under **Manage**, select **Roles and administrators**.
1. Select a role, such as **Global administrator**. The **Role | Assignments** page lists the users with that role.

## Delete an administrator account

To delete an existing user, you must have a *Global administrator* role assignment. Global admins can delete any user, including other admins. *User administrators* can delete any non-admin user.

1. In your Azure AD B2C directory, select **Users**, and then select the user you want to delete.
1. Select **Delete**, and then **Yes** to confirm the deletion.

The user is deleted and no longer appears on the **Users - All users** page. The user can be seen on the **Deleted users** page for the next 30 days and can be restored during that time. For more information about restoring a user, see [Restore or remove a recently deleted user using Azure Active Directory](../active-directory/fundamentals/active-directory-users-restore.md).

## Protect administrative accounts

It's recommended that you protect all administrator accounts with multi-factor authentication (MFA) for more security. MFA is an identity verification process during sign-in that prompts the user for a more form of identification, such as a verification code on their mobile device or a request in their Microsoft Authenticator app.

![Authentication methods in use at the sign-in screenshot](./media/tenant-management/sing-in-with-multi-factor-authentication.png)

You can enable [Azure AD security defaults](../active-directory/fundamentals/concept-fundamentals-security-defaults.md) to force all administrative accounts to use MFA.



## Next steps

- [Create an Azure Active Directory B2C tenant in the Azure portal](tutorial-create-tenant.md)

