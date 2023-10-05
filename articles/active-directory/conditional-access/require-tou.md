---
title: Quickstart require Terms of Use at sign-in
description: Quickstart require terms of use acceptance before access to selected cloud apps is granted with Microsoft Entra Conditional Access.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: quickstart
ms.date: 09/22/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb

ms.collection: M365-identity-device-management
---
# Quickstart: Require terms of use to be accepted before accessing cloud apps

In this quickstart, you'll configure a Conditional Access policy in Microsoft Entra ID to require users to accept terms of use. 

## Prerequisites

To complete the scenario in this quickstart, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Microsoft Entra ID P1 or P2 - Microsoft Entra Conditional Access is a Microsoft Entra ID P1 or P2 capability.
- A test account to sign-in with - If you don't know how to create a test account, see [Add cloud-based users](../fundamentals/add-users.md#add-a-new-user).

## Sign-in without terms of use

The goal of this step is to get an impression of the sign-in experience without a Conditional Access policy.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as your test user.
1. Sign out.

## Create your terms of use

This section provides you with the steps to create a sample ToU. When you create a ToU, you select a value for **Enforce with Conditional Access policy templates**. Selecting **Custom policy** opens the dialog to create a new Conditional Access policy as soon as your ToU has been created.

1. In Microsoft Word, create a new document.
1. Type **My terms of use**, and then save the document on your computer as **mytou.pdf**.
1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Protection** > **Conditional Access** > **Terms of use**.


   :::image type="content" source="media/require-tou/terms-of-use-azure-ad-conditional-access.png" alt-text="Screenshot of terms of use highlighting the new terms button." lightbox="media/require-tou/terms-of-use-azure-ad-conditional-access.png":::

1. In the menu on the top, select **New terms**.

   :::image type="content" source="media/require-tou/new-terms-of-use-creation.png" alt-text="Screenshot that shows creating a new terms of use policy." lightbox="media/require-tou/new-terms-of-use-creation.png":::

1. In the **Name** textbox, type **My TOU**.
1. Upload your terms of use PDF file.
1. Select your default language.
1. In the **Display name** textbox, type **My TOU**.
1. As **Require users to expand the terms of use**, select **On**.
1. As **Enforce with Conditional Access policy templates**, select **Custom policy**.
1. Select **Create**.

## Create a Conditional Access policy

This section shows how to create the required Conditional Access policy. 

The scenario in this quickstart uses:

- The Azure portal as placeholder for a cloud app that requires your ToU to be accepted. 
- Your sample user to test the Conditional Access policy.  

**To configure your Conditional Access policy:**

1. On the **New** page, in the **Name** textbox, type **Require Terms of Use**.
1. Under Assignments, select **Users or workload identities**.
   1. Under Include, choose **Select users and groups** > **Users and groups**.
   1. Choose your test user, and choose **Select**.
1. Under Assignments, select **Cloud apps or actions**.
1. Select **Cloud apps or actions**.
   1. Under Include, choose **Select apps**.
   1. Select **Microsoft Azure Management**, and then choose **Select**.
1. Under **Access controls**, select **Grant**.
   1. Select **Grant access**.
   1. Select the terms of use you created previously called **My TOU** and choose **Select**.
1. In the **Enable policy** section, select **On**.
1. Select **Create**.

## Test your Conditional Access policy

In the previous section, you created a Conditional Access policy requiring terms of use be accepted. 

To test your policy, try to sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) using your test account. You should see a dialog that requires you to accept your terms of use.

:::image type="content" source="./media/require-tou/57.png" alt-text="Screenshot of a dialog box titled Identity Security Protection terms of use, with Decline and Accept buttons and a button labeled My TOU." border="false":::

## Clean up resources

When no longer needed, delete the test user and the Conditional Access policy:

- If you don't know how to delete a Microsoft Entra user, see [Delete users from Microsoft Entra ID](../fundamentals/add-users.md#delete-a-user).
- To delete your policy, select the ellipsis (`...`) next to your policies name, then select **Delete**.
- To delete your terms of use, select it, and then select **Delete terms**.

    :::image type="content" source="./media/require-tou/29.png" alt-text="Screenshot showing part of a table listing terms of use documents. The My T O U document is visible. In the menu, Delete terms is highlighted." border="false":::

## Next steps

> [!div class="nextstepaction"]
> [Require MFA for specific apps](../authentication/tutorial-enable-azure-mfa.md)
