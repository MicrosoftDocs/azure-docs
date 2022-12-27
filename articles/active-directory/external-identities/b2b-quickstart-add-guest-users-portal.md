---
title: 'Quickstart: Add a guest user and send an invitation - Azure AD'
description: Use this quickstart to learn how Azure AD admins can add B2B guest users in the Azure portal and walk through the B2B invitation workflow.
services: active-directory
author: msmimart
ms.author: mimart
manager: celestedg
ms.date: 05/10/2022
ms.topic: quickstart
ms.service: active-directory
ms.subservice: B2B
ms.custom: engagement-fy23, it-pro, seo-update-azuread-jan, mode-ui
ms.collection: M365-identity-device-management
#Customer intent: As a tenant admin, I want to walk through the B2B invitation workflow so that I can understand how to add a guest user in the portal, and understand the end user experience.
---

# Quickstart: Add a guest user and send an invitation

With Azure AD [B2B collaboration](what-is-b2b.md), you can invite anyone to collaborate with your organization using their own work, school, or social account.

In this quickstart, you'll learn how to add a new guest user to your Azure AD directory in the Azure portal. You'll also send an invitation and see what the guest user's invitation redemption process looks like. In addition to this quickstart, you can learn more about adding guest users [in the Azure portal](add-users-administrator.md), via [PowerShell](b2b-quickstart-invite-powershell.md), or [in bulk](tutorial-bulk-invite.md).

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete the scenario in this quickstart, you need:

- A role that allows you to create users in your tenant directory, such as the Global Administrator role or a limited administrator directory role (for example, Guest inviter or User administrator).

- Access to a valid email address outside of your Azure AD tenant, such as a separate work, school, or social email address. You'll use this email to create the guest account in your tenant directory and access the invitation.

## Add a new guest user in Azure AD

1. Sign in to the [Azure portal](https://portal.azure.com/) with an account that's been assigned the Global administrator, Guest, inviter, or User administrator role.

1. Under **Azure services**, select **Azure Active Directory** (or use the search box to find and select **Azure Active Directory**).

    :::image type="content" source="media/quickstart-add-users-portal/azure-active-directory-service.png" alt-text="Screenshot showing where to select the Azure Active Directory service.":::

1. Under **Manage**, select **Users**.

    :::image type="content" source="media/quickstart-add-users-portal/quickstart-users-portal-user.png" alt-text="Screenshot showing where to select the Users option.":::

1. Under **New user** select **Invite external user**.

    :::image type="content" source="media/quickstart-add-users-portal/new-guest-user.png" alt-text="Screenshot showing where to select the New guest user option.":::

1. On the **New user** page, select **Invite user** and then add the guest user's information.

   - **Name.** The first and last name of the guest user.
   - **Email address (required)**. The email address of the guest user.
   - **Personal message (optional)** Include a personal welcome message to the guest user.
   - **Groups**: You can add the guest user to one or more existing groups, or you can do it later.
   - **Roles**: If you require Azure AD administrative permissions for the user, you can add them to an Azure AD role.

    :::image type="content" source="media/quickstart-add-users-portal/invite-user.png" alt-text="Screenshot showing the new user page.":::

1. Select **Invite** to automatically send the invitation to the guest user. A notification appears in the upper right with the message **Successfully invited user**.

1. After you send the invitation, the user account is automatically added to the directory as a guest.

    :::image type="content" source="media/quickstart-add-users-portal/new-guest-user-directory.png" alt-text="Screenshot showing the new guest user in the directory.":::


## Accept the invitation

Now sign in as the guest user to see the invitation.

1. Sign in to your test guest user's email account.

1. In your inbox, open the email from "Microsoft Invitations on behalf of Contoso."

    :::image type="content" source="media/quickstart-add-users-portal/quickstart-users-portal-email-small.png" alt-text="Screenshot showing the B2B invitation email.":::


1. In the email body, select **Accept invitation**. A **Review permissions** page opens in the browser.

    :::image type="content" source="media/quickstart-add-users-portal/consent-screen.png" alt-text="Screenshot showing the Review permissions page.":::

1. Select **Accept**.

1. The **My Apps** page opens. Because we haven't assigned any apps to this guest user, you'll see the message "There are no apps to show." In a real-life scenario, you would [add the guest user to an app](add-users-administrator.md#add-guest-users-to-an-application) so the app would appear here.

## Clean up resources

When no longer needed, delete the test guest user.

1. Sign in to the [Azure portal](https://portal.azure.com/) with an account that's been assigned the Global administrator or User administrator role.
1. Select the **Azure Active Directory** service.
1. Under **Manage**, select **Users**.
1. Select the test user, and then select **Delete user**.

## Next steps

In this quickstart, you created a guest user in the Azure portal and sent an invitation to share apps. Then you viewed the redemption process from the guest user's perspective and verified that the guest user was able to access their My Apps page. To learn more about adding guest users for collaboration, see [Add Azure Active Directory B2B collaboration users in the Azure portal](add-users-administrator.md).
