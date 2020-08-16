---
title: Create & delete Azure AD B2C consumer user accounts in the Azure portal
description: Learn how to use the Azure portal to create and delete consumer users in your Azure AD B2C directory.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 11/09/2019
ms.author: mimart
ms.subservice: B2C
---

# Use the Azure portal to create and delete consumer users in Azure AD B2C

There might be scenarios in which you want to manually create consumer accounts in your Azure Active Directory B2C (Azure AD B2C) directory. Although consumer accounts in an Azure AD B2C directory are most commonly created when users sign up to use one of your applications, you can create them programmatically and by using the Azure portal. This article focuses on the Azure portal method of user creation and deletion.

To add or delete users, your account must be assigned the *User administrator* or *Global administrator* role.

[!INCLUDE [active-directory-b2c-public-preview](../../includes/active-directory-b2c-public-preview.md)]

## Types of user accounts

As described in [Overview of user accounts in Azure AD B2C](user-overview.md), there are three types of user accounts that can be created in an Azure AD B2C directory:

* Work
* Guest
* Consumer

This article focuses on working with **consumer accounts** in the Azure portal. For information about creating and deleting Work and Guest accounts, see [Add or delete users using Azure Active Directory](../active-directory/fundamentals/add-users-azure-active-directory.md).

## Create a consumer user

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Under **Manage**, select **Users**.
1. Select **New user**.
1. Select **Create Azure AD B2C user**.
1. Choose a **Sign in method** and enter either an **Email** address or a **Username** for the new user. The sign in method you select here must match the setting you've specified for your Azure AD B2C tenant's *Local account* identity provider (see **Manage** > **Identity providers** in your Azure AD B2C tenant).
1. Enter a **Name** for the user. This is typically the full name (given and surname) of the user.
1. (Optional) You can **Block sign in** if you wish to delay the ability for the user to sign in. You can enable sign in later by editing the user's **Profile** in the Azure portal.
1. Choose **Auto-generate password** or **Let me create password**.
1. Specify the user's **First name** and **Last name**.
1. Select **Create**.

Unless you've selected **Block sign in**, the user can now sign in using the sign in method (email or username) that you specified.

## Delete a consumer user

1. In your Azure AD B2C directory, select **Users**, and then select the user you want to delete.
1. Select **Delete**, and then **Yes** to confirm the deletion.

For details about restoring a user within the first 30 days after deletion, or for permanently deleting a user, see [Restore or remove a recently deleted user using Azure Active Directory](../active-directory/fundamentals/active-directory-users-restore.md).

## Next steps

For automated user management scenarios, for example migrating users from another identity provider to your Azure AD B2C directory, see [Azure AD B2C: User migration](user-migration.md).
