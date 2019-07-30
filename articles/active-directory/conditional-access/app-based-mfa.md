---
title: Quickstart - Require multi-factor authentication (MFA) for specific apps with Azure Active Directory Conditional Access | Microsoft Docs
description: In this quickstart, you learn how you can tie your authentication requirements to the type of accessed cloud app using Azure Active Directory (Azure AD) Conditional Access.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: quickstart 
ms.date: 01/30/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

#Customer intent: As an IT admin, I want to configure MFA on a per app basis, so that my users have a convenient sign-on experience and our mission critical apps are protected with strong authentication.
ms.collection: M365-identity-device-management
---
# Quickstart: Require MFA for specific apps with Azure Active Directory Conditional Access

To simplify the sign in experience of your users, you might want to allow them to sign in to your cloud apps using a user name and a password. However, many environments have at least a few apps for which it is advisable to require a stronger form of account verification, such as multi-factor authentication (MFA). This policy might be true for access to your organization's email system or your HR apps. In Azure Active Directory (Azure AD), you can accomplish this goal with a Conditional Access policy.

This quickstart shows how to configure an [Azure AD Conditional Access policy](../active-directory-conditional-access-azure-portal.md) that requires multi-factor authentication for a selected cloud app in your environment.

![Example Conditional Access policy in the Azure portal](./media/app-based-mfa/32.png)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete the scenario in this quickstart, you need:

- **Access to an Azure AD Premium edition** - Azure AD Conditional Access is an Azure AD Premium capability.
- **A test account called Isabella Simonsen** - If you don't know how to create a test account, see [Add cloud-based users](../fundamentals/add-users-azure-active-directory.md#add-a-new-user).

The scenario in this quickstart requires that per user MFA is not enabled for your test account. For more information, see [How to require two-step verification for a user](../authentication/howto-mfa-userstates.md).

## Test your experience

The goal of this step is to get an impression of the experience without a Conditional Access policy.

**To initialize your environment:**

1. Sign in to your Azure portal as Isabella Simonsen.
1. Sign out.

## Create your Conditional Access policy

This section shows how to create the required Conditional Access policy. The scenario in this quickstart uses:

- The Azure portal as placeholder for a cloud app that requires MFA. 
- Your sample user to test the Conditional Access policy.  

In your policy, set:

| Setting | Value |
| --- | --- |
| Users and groups | Isabella Simonsen |
| Cloud apps | Microsoft Azure Management |
| Grant access | Require multi-factor authentication |

![Expanded Conditional Access policy](./media/app-based-mfa/31.png)

**To configure your Conditional Access policy:**

1. Sign in to your [Azure portal](https://portal.azure.com) as global administrator, security administrator, or a Conditional Access administrator.
1. In the Azure portal, on the left navbar, click **Azure Active Directory**.

   ![Azure Active Directory](./media/app-based-mfa/02.png)

1. On the **Azure Active Directory** page, in the **Security** section, click **Conditional Access**.

   ![Conditional Access](./media/app-based-mfa/03.png)

1. On the **Conditional Access** page, in the toolbar on the top, click **New policy**.

   ![Add](./media/app-based-mfa/04.png)

1. On the **New** page, in the **Name** textbox, type **Require MFA for Azure portal access**.

   ![Name](./media/app-based-mfa/05.png)

1. In the **Assignment** section, click **Users and groups**.

   ![Users and groups](./media/app-based-mfa/06.png)

1. On the **Users and groups** page, perform the following steps:

   ![Users and groups](./media/app-based-mfa/24.png)

   1. Click **Select users and groups**, and then select **Users and groups**.
   1. Click **Select**.
   1. On the **Select** page, select **Isabella Simonsen**, and then click **Select**.
   1. On the **Users and groups** page, click **Done**.

1. Click **Cloud apps**.

   ![Cloud apps](./media/app-based-mfa/08.png)

1. On the **Cloud apps** page, perform the following steps:

   ![Select cloud apps](./media/app-based-mfa/26.png)

   1. Click **Select apps**.
   1. Click **Select**.
   1. On the **Select** page, select **Microsoft Azure Management**, and then click **Select**.
   1. On the **Cloud apps** page, click **Done**.

1. In the **Access controls** section, click **Grant**.

   ![Access controls](./media/app-based-mfa/10.png)

1. On the **Grant** page, perform the following steps:

   ![Grant](./media/app-based-mfa/11.png)

   1. Select **Grant access**.
   1. Select **Require multi-factor authentication**.
   1. Click **Select**.

1. In the **Enable policy** section, click **On**.

   ![Enable policy](./media/app-based-mfa/18.png)

1. Click **Create**.

## Evaluate a simulated sign in

Now that you have configured your Conditional Access policy, you probably want to know whether it works as expected. As a first step, use the Conditional Access what if policy tool to simulate a sign in of your test user. The simulation estimates the impact this sign in has on your policies and generates a simulation report.  

To initialize the **What If** policy evaluation tool, set:

- **Isabella Simonsen** as user
- **Microsoft Azure Management** as cloud app

Clicking **What If** creates a simulation report that shows:

- **Require MFA for Azure portal access** under **Policies that will apply**
- **Require multi-factor authentication** as **Grant Controls**.

![What if policy tool](./media/app-based-mfa/23.png)

**To evaluate your Conditional Access policy:**

1. On the [Conditional Access - Policies](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ConditionalAccessBlade/Policies) page, in the menu on the top, click **What If**.  

   ![What If](./media/app-based-mfa/14.png)

1. Click **Users**, select **Isabella Simonsen**, and then click **Select**.

   ![User](./media/app-based-mfa/15.png)

1. To select a cloud app, perform the following steps:

   ![Cloud apps](./media/app-based-mfa/16.png)

   1. Click **Cloud apps**.
   1. On the **Cloud apps page**, click **Select apps**.
   1. Click **Select**.
   1. On the **Select** page, select **Microsoft Azure Management**, and then click **Select**.
   1. On the cloud apps page, click **Done**.

1. Click **What If**.

## Test your Conditional Access policy

In the previous section, you have learned how to evaluate a simulated sign in. In addition to a simulation, you should also test your Conditional Access policy to ensure that it works as expected.

To test your policy, try to sign in to your [Azure portal](https://portal.azure.com) using your **Isabella Simonsen** test account. You should see a dialog that requires you to set up your account for additional security verification.

![Multi-factor authentication](./media/app-based-mfa/22.png)

## Clean up resources

When no longer needed, delete the test user and the Conditional Access policy:

- If you don't know how to delete an Azure AD user, see [Delete users from Azure AD](../fundamentals/add-users-azure-active-directory.md#delete-a-user).
- To delete your policy, select your policy, and then click **Delete** in the quick access toolbar.

    ![Multi-factor authentication](./media/app-based-mfa/33.png)

## Next steps

> [!div class="nextstepaction"]
> [Require terms of use to be accepted](require-tou.md)
> [Block access when a session risk is detected](app-sign-in-risk.md)
