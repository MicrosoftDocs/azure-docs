---
title: Create or delete users
description: Instructions for how to create new users or delete existing users.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: how-to
ms.date: 04/06/2023
ms.author: sarahlipsey
ms.reviewer: krbain
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# How to create, invite, and delete users (preview)

This article explains how to create a new user, invite a guest user, and delete a user in your Azure Active Directory (Azure AD) tenant. The **User Administrator** or **Global Administrator** role is required.

The updated experience for creating new users covered in this article is available as an Azure AD preview feature. This feature is enabled by default, but you can opt out by going to **Azure AD** > **Preview features** and disabling the **Create user experience** feature. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Instructions for the legacy create user process can be found in the **[Add or delete users](add-users-azure-active-directory.md)** article.

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-hybrid-note.md)]

## Create a new user

1. Sign in to the [Azure portal](https://portal.azure.com/) in the **User Administrator** role.

1. Navigate to **Azure Active Directory** > **Users**.

1. Select **Create new user** from the menu.

### Basics

- **User principal name**: Enter a unique username and select a domain from the menu after the @. Select **Domain not listed** if you need to create a domain for the user. For more information, see [Add your custom domain name](add-custom-domain.md)

- **Mail nickname**: If you need to enter an email nickname that is different from the user principal name you entered, uncheck the **Derive from user principal name** option, then enter the mail nickname.

- **Display name**: Enter the users's name, such as Chris Green or Chris A. Green

- **Password**: Provide a password for the user to use during their initial sign-in. Uncheck the **Auto-generate password** option to enter a different password.

- **Account enabled**: This option is checked by default. Uncheck to prevent the new user from being able to sign-in. You can change this setting after the user is created.

### Properties

There are six categories of user properties you may be able to edit. These properties can be added or updated after the user is created. To manage these details go to **Azure AD** > **Users** and select a user to update.

- **Identity:** Enter the user's first and last name.

- **Job information:** Add any job-related information, such as the user's job title, department, or manager.

- **Contact info:** Add any relevant contact information for the user.

- **Parental controls:** For organizations like K-12 school districts, the user's age group may need to be provided. *Minors* are 12 and under, *Not adult* are 13-18 years old, and *Adults* are 18 and over. The combination of age group and consent provided by parent options determine the Legal age group classification. The Legal age group classification may limit the user's access and authority.

- **Settings:** Decide whether the user can sign in to the Azure Active Directory tenant. You can also specify the user's global location.

- **On-premises:** Accounts synced from Windows Server Active Directory include other values not applicable to Azure AD accounts.

### Assignments

You can assign the user to an administrative unit or group when their account is created. You can assign the user to up to 20 groups or roles. You can only assign the user to one administrative unit.

1. Select **+ Add group**.
1. From the menu that appears, choose up to 20 groups from the list and select the **Select** button.

### Review and create

The final tab captures several key details from the user's details. Review their user principal name, display name, mail nickname, and password. Any group or role assignments are also listed along with the user type.