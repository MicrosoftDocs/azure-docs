---
title: Overview of user accounts in Azure Active Directory B2C
description: Learn about the types of user accounts that can be used in Azure Active Directory B2C.
author: garrodonnell
manager: CelesteDG
ms.service: active-directory
ms.date: 02/13/2024
ms.topic: concept-article
ms.author: godonnell
ms.subservice: B2C
ms.custom: b2c-support

#Customer intent: As a developer or IT administrator, I want to understand the different types of user accounts available Azure AD B2C, so that I can properly manage and configure user accounts for my tenant.
---

# Overview of user accounts in Azure Active Directory B2C

In Azure Active Directory B2C (Azure AD B2C), there are several types of accounts that can be created. These account types are shared across Microsoft Entra ID, Microsoft Entra B2B, and Azure Active Directory B2C (Azure AD B2C).

The following types of accounts are available:

- **Work account** - A work account can access resources in a tenant, and with an administrator role, can manage tenants.
- **Guest account** - A guest account can only be a Microsoft account or a Microsoft Entra user that can be used to share administration responsibilities such as [managing a tenant](tenant-management-manage-administrator.md).
- **Consumer account** - A consumer account is used by a user of the applications you've registered with Azure AD B2C. Consumer accounts can be created by:
  - The user going through a sign-up user flow in an Azure AD B2C application
  - Using Microsoft Graph API by a tenant administrator.
  - Using the Azure portal by a tenant administrator.

## Work account

A work account is created the same way for all tenants based on Microsoft Entra ID. To create a work account, you can use the information in [Quickstart: Add new users to Microsoft Entra ID](/entra/fundamentals/how-to-create-delete-users). A work account is created using the **New user** choice in the Azure portal.

When you add a new work account, you need to consider the following configuration settings:

- **Name** and **User name** - The **Name** property contains the given and surname of the user. The **User name** is the identifier that the user enters to sign in. The user name includes the full domain. The domain name portion of the user name must either be the initial default domain name *your-domain.onmicrosoft.com*, or a verified, non-federated [custom domain](/entra/fundamentals/add-custom-domain) name such as *contoso.com*. 
- **Email** - The new user can also sign in using an email address. We do not support special characters or multibyte characters in email, for example Japanese characters.
- **Profile** - The account is set up with a profile of user data. You have the opportunity to enter a first name, last name, job title, and department name. You can edit the profile after the account is created.
- **Groups** - Use groups to perform management tasks such as assigning licenses or permissions to many users, or devices at once. You can put the new account into an existing [group](../active-directory/fundamentals/how-to-manage-groups.md) in your tenant.
- **Directory role** - You need to specify the level of access that the user account has to resources in your tenant. For more information about the roles that can be selected, see [Microsoft Entra built-in roles](/entra/identity/role-based-access-control/permissions-reference).

### Create a work account

You can use the following information to create a new work account:

- [Azure portal](/entra/fundamentals/how-to-create-delete-users)
- [Microsoft Graph](/graph/api/user-post-users)

### Update a user profile

You can use the following information to update the profile of a user:

- [Azure portal](/entra/fundamentals/how-to-manage-user-profile-info)
- [Microsoft Graph](/graph/api/user-update)

### Reset a password for a user

You can use the following information to reset the password of a user:

- [Azure portal](/entra/fundamentals/users-reset-password-azure-portal)
- [Microsoft Graph](/graph/api/user-update)

## Guest user

You can invite external users to your tenant as a guest user. A typical scenario for inviting a guest user to your Azure AD B2C tenant is to share administration responsibilities. For an example of using a guest account, see [Properties of a Microsoft Entra B2B collaboration user](../active-directory/external-identities/user-properties.md).

When you invite a guest user to your tenant, you provide the email address of the recipient and a message describing the invitation. The invitation link takes the user to the consent page. If an inbox isn't attached to the email address, the user can navigate to the consent page by going to a Microsoft page using the invited credentials. The user is then forced to redeem the invitation the same way as selecting the link in the email. For example: `https://myapps.microsoft.com/B2CTENANTNAME`.

You can also use the [Microsoft Graph API](/graph/api/invitation-post) to invite a guest user.

## Consumer user

The consumer user can sign in to applications secured by Azure AD B2C, but cannot access Azure resources such as the Azure portal. The consumer user can use a local account or federated accounts, such as Facebook or Twitter. A consumer account is created by using a [sign-up or sign-in user flow](user-flow-overview.md), using the Microsoft Graph API, or by using the Azure portal.

You can specify the data that is collected when a consumer user account is created. For more information, see [Add user attributes and customize user input](configure-user-input.md).

For more information about managing consumer accounts, see [Manage Azure AD B2C user accounts with Microsoft Graph](./microsoft-graph-operations.md).

### Migrate consumer user accounts

You might have a need to migrate existing consumer user accounts from any identity provider to Azure AD B2C. For more information, see [Migrate users to Azure AD B2C](user-migration.md).