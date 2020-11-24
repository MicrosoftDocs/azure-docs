---
title: Sign in to Azure Notebooks Preview
description: Quickly sign into Azure Notebooks Preview and set a user ID, which gives you the ability to access saved projects and share notebooks with others.
ms.topic: quickstart
ms.date: 04/15/2019
---

# Quickstart: Sign in and set a user ID for Azure Notebooks Preview

[!INCLUDE [notebooks-status](../../includes/notebooks-status.md)]

Although you can always view Azure Notebooks without signing in, you must sign in to run notebooks, access saved projects and notebooks, and share your notebooks with others.

## Sign in

1. Select **Sign in** on the top right of [notebooks.azure.com](https://notebooks.azure.com/).

    ![Location of Sign-in command on Azure Notebooks](media/accounts/sign-in-command.png)

1. When prompted, enter the email address of a Microsoft Account or a work or school account and select **Next**. Account types are described on [Your user account for Azure Notebooks](azure-notebooks-user-account.md). If you don't have a Microsoft Account, or wish to make one for use specifically with Azure Notebooks, select **Create one**:

    ![Create new Microsoft account command in sign-in prompt](media/accounts/create-new-microsoft-account.png)

    > [!Tip]
    > If you attempt to create a new account with an email address that already has an account associated with it, you may see the message, "You can't sign up here with a work or school email address. Use a personal email, such as Gmail or Yahoo!, or get a new Outlook email." In that case, try signing in with the work email address without creating a new account.

1. Enter your password when prompted.

1. If you're signing in for the first time, Azure Notebooks asks for permission to access your account. Select **Yes** to continue:

    ![Account permissions prompt](media/accounts/account-permission-prompt.png)

## Set a user ID

1. Upon first sign in, you're assigned a temporary user ID like "anon-idrca3". Whenever you have a user ID that begins with "anon-", Azure Notebooks prompts you to create an ID of your own. Your user ID is used in any URL that you obtain to share your projects and notebooks, so choose something that's unique and meaningful to you.

    ![Prompt to enter a user ID for Azure Notebooks](media/accounts/create-user-id.png)

    If you select **No Thanks**, Azure Notebooks continues to prompt you for a user ID each time you sign in. Your user ID can also be set at any time in your [user profile](azure-notebooks-user-profile.md).

1. After successfully signing in, Azure Notebooks navigates to your public profile page, on which you can select **Edit Profile Information** to fill out the rest of your information (for more information, see [Your profile and user ID](azure-notebooks-user-profile.md)):

    ![Initial view of an Azure Notebooks profile page](media/accounts/profile-page-new.png)

> [!NOTE]
> If you see the message, "User ID is already in use," try a different ID. User IDs are unique across all Azure Notebooks accounts, and Azure Notebooks also reserves certain user IDs, such as Microsoft brand names.

## Sign out

To sign out, select your username on the upper right of the page, then select **Sign out**:

![Location of sign-out command on Azure Notebooks](media/accounts/sign-out-command.png)

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Create and share a notebook](quickstart-create-share-jupyter-notebook.md)
