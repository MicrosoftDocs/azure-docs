---
title: 'Tutorial - Multi-factor authentication for B2B'
description: In this tutorial, learn how to require multi-factor authentication (MFA) when you use Azure AD B2B to collaborate with external users and partner organizations.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: tutorial
ms.date: 07/28/2023

ms.author: cmulligan
author: csmulligan
manager: CelesteDG
ms.custom: "engagement-fy23, it-pro, seo-update-azuread-jan"
ms.collection: M365-identity-device-management

# Customer intent: As a tenant administrator, I want to set up MFA requirement for B2B guest users to protect my apps and resources. 
---

# Tutorial: Enforce multi-factor authentication for B2B guest users

When collaborating with external B2B guest users, it’s a good idea to protect your apps with multi-factor authentication (MFA) policies. Then external users will need more than just a user name and password to access your resources. In Azure Active Directory (Azure AD), you can accomplish this goal with a Conditional Access policy that requires MFA for access. MFA policies can be enforced at the tenant, app, or individual guest user level, the same way that they're enabled for members of your own organization. The resource tenant is always responsible for Azure AD Multi-Factor Authentication for users, even if the guest user’s organization has Multi-Factor Authentication capabilities.

Example:

:::image type="content" source="media/tutorial-mfa/b2b-mfa-example.png" alt-text="Diagram showing a guest user signing into a company's apps.":::


1. An admin or employee at Company A invites a guest user to use a cloud or on-premises application that is configured to require MFA for access.
1. The guest user signs in with their own work, school, or social identity.
1. The user is asked to complete an MFA challenge. 
1. The user sets up MFA with Company A and chooses their MFA option. The user is allowed access to the application.

>[!NOTE]
>Azure AD Multi-Factor Authentication is done at resource tenancy to ensure predictability. When the guest user signs in, they'll see the resource tenant sign-in page displayed in the background, and their own home tenant sign-in page and company logo in the foreground.

In this tutorial, you will:

> [!div class="checklist"]
>
> - Test the sign-in experience before MFA setup.
> - Create a Conditional Access policy that requires MFA for access to a cloud app in your environment. In this tutorial, we’ll use the Microsoft Azure Management app to illustrate the process.
> - Use the What If tool to simulate MFA sign-in.
> - Test your Conditional Access policy.
> - Clean up the test user and policy.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete the scenario in this tutorial, you need:

- **Access to Azure AD Premium edition**, which includes Conditional Access policy capabilities. To enforce MFA, you need to create an Azure AD Conditional Access policy. MFA policies are always enforced at your organization, regardless of whether the partner has MFA capabilities.
- **A valid external email account** that you can add to your tenant directory as a guest user and use to sign in. If you don't know how to create a guest account, see [Add a B2B guest user in the Azure portal](add-users-administrator.md).

## Create a test guest user in Azure AD

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
1. In the Azure portal, select **Azure Active Directory**.
1. In the left menu, under **Manage**, select **Users**.
1. Select **New user**, and then select **Invite external user**.

    :::image type="content" source="media/tutorial-mfa/tutorial-mfa-new-user.png" alt-text="Screenshot showing where to select the new guest user option." lightbox="media/tutorial-mfa/tutorial-mfa-new-user.png":::

1. Under **Identity** on the **Basics** tab, enter the email address of the external user. Optionally, include a display name and welcome message.

    :::image type="content" source="media/tutorial-mfa/tutorial-mfa-new-user-identity.png" alt-text="Screenshot showing where to enter the guest email.":::

1. Optionally, you can add further details to the user under the **Properties** and **Assignments** tabs.
1. Select **Review + invite** to automatically send the invitation to the guest user. A **Successfully invited user** message appears.
1. After you send the invitation, the user account is automatically added to the directory as a guest.

## Test the sign-in experience before MFA setup

1. Use your test user name and password to sign in to the [Azure portal](https://portal.azure.com).
1. You should be able to access the Azure portal using only your sign-in credentials. No other authentication is required.
1. Sign out.

## Create a Conditional Access policy that requires MFA

1. Sign in to the [Azure portal](https://portal.azure.com) as a security administrator or a Conditional Access administrator.
1. In the Azure portal, select **Azure Active Directory**.
1. In the left menu, under **Manage**, select **Security**.
1. Under **Protect**, select **Conditional Access**.
1. On the **Conditional Access** page, in the toolbar on the top, select **New policy**.
1. On the **New** page, in the **Name** textbox, type **Require MFA for B2B portal access**.
1. In the **Assignments** section, choose the link under **Users and groups**.
1. On the **Users and groups** page, choose **Select users and groups**, and then choose **Guest or external users**. You can assign the policy to different [external user types](authentication-conditional-access.md#assigning-conditional-access-policies-to-external-user-types), built-in directory roles, or users and groups. 

    :::image type="content" source="media/tutorial-mfa/tutorial-mfa-user-access.png" alt-text="Screenshot showing selecting all guest users.":::

1. In the **Assignments** section, choose the link under **Cloud apps or actions**.
1. Choose **Select apps**, and then choose the link under **Select**.

    :::image type="content" source="media/tutorial-mfa/tutorial-mfa-app-access.png" alt-text="Screenshot showing the Cloud apps page and the Select option." lightbox="media/tutorial-mfa/tutorial-mfa-app-access.png":::

1. On the **Select** page, choose **Microsoft Azure Management**, and then choose **Select**.

1. On the **New** page, in the **Access controls** section, choose the link under **Grant**.
1. On the **Grant** page, choose **Grant access**, select the **Require multi-factor authentication** check box, and then choose **Select**.

    :::image type="content" source="media/tutorial-mfa/tutorial-mfa-grant-access.png" alt-text="Screenshot showing the Require multi-factor authentication option.":::


1. Under **Enable policy**, select **On**.

    :::image type="content" source="media/tutorial-mfa/tutorial-mfa-enable-policy.png" alt-text="Screenshot showing the Enable policy option set to On.":::

1. Select **Create**.

## Use the What If option to simulate sign-in

1. On the **Conditional Access | Policies** page, select **What If**.

    :::image type="content" source="media/tutorial-mfa/tutorial-mfa-what-if.png" alt-text="Screenshot that highlights where to select the What if option on the Conditional Access - Policies page.":::

1. Select the link under **User**. 
1. In the search box, type the name of your test guest user. Choose the user in the search results, and then choose **Select**.

    :::image type="content" source="media/tutorial-mfa/tutorial-mfa-what-if-user.png" alt-text="Screenshot showing a guest user selected.":::

1. Select the link under **Cloud apps, actions, or authentication content**. Choose **Select apps**, and then choose the link under **Select**.

    :::image type="content" source="media/tutorial-mfa/tutorial-mfa-what-if-app.png" alt-text="Screenshot showing the Microsoft Azure Management app selected." lightbox="media/tutorial-mfa/tutorial-mfa-what-if-app.png":::

1. On the **Cloud apps** page, in the applications list, choose **Microsoft Azure Management**, and then choose **Select**.
1. Choose **What If**, and verify that your new policy appears under **Evaluation results** on the **Policies that will apply** tab.

    :::image type="content" source="media/tutorial-mfa/tutorial-mfa-whatif-4.png" alt-text="Screenshot showing the results of the What If evaluation.":::

## Test your Conditional Access policy

1. Use your test user name and password to sign in to the [Azure portal](https://portal.azure.com).
1. You should see a request for more authentication methods. It can take some time for the policy to take effect.

    :::image type="content" source="media/tutorial-mfa/mfa-required.PNG" alt-text="Screenshot showing the More information required message.":::

    > [!NOTE]
    > You also can configure [cross-tenant access settings](cross-tenant-access-overview.md) to trust the MFA from the Azure AD home tenant. This allows external Azure AD users to use the MFA registered in their own tenant rather than register in the resource tenant.

1. Sign out.

## Clean up resources

When no longer needed, remove the test user and the test Conditional Access policy.

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
1. In the left pane, select **Azure Active Directory**.
1. Under **Manage**, select **Users**.
1. Select the test user, and then select **Delete user**.
1. In the left pane, select **Azure Active Directory**.
1. Under **Security**, select **Conditional Access**.
1. In the **Policy Name** list, select the context menu (…) for your test policy, and then select **Delete**. Select **Yes** to confirm.

## Next steps

In this tutorial, you’ve created a Conditional Access policy that requires guest users to use MFA when signing in to one of your cloud apps. To learn more about adding guest users for collaboration, see [Add Azure Active Directory B2B collaboration users in the Azure portal](add-users-administrator.md).
