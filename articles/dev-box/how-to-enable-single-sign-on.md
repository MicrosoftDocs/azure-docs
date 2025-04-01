---
title: Enable Single Sign-On for Dev Boxes
titleSuffix: Microsoft Dev Box
description: Learn how to enable single sign-on for dev boxes. Edit an existing pool to configure single sign-on for new dev boxes.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/24/2024
ms.topic: how-to

#customer intent: As a platform engineer, I want to enable single sign-on for dev boxes so that my dev box users have a smoother sign-in experience.
---

# Enable single sign-on for dev boxes

In this article, you learn how to enable single sign-on (SSO) for dev boxes in Microsoft Dev Box pools.

By using SSO, you can skip the credential prompt when you connect to a dev box and automatically sign in to Windows through Microsoft Entra authentication. Microsoft Entra authentication also provides passwordless authentication and support for third-party identity providers. To get started, review the steps to configure SSO.

## Prerequisites

To enable SSO for dev boxes, you must configure SSO for your organization. For more information, see [Configure single sign-on for Azure Virtual Desktop by using Microsoft Entra ID authentication](/azure/virtual-desktop/configure-single-sign-on).

## Enable SSO for dev boxes

SSO is enabled at the pool level. Dev Box supports SSO for dev box pools that use Microsoft Entra joined networks, and Microsoft hosted networks, but not pools that use Microsoft Entra hybrid-joined networks.

When you enable SSO for a pool, all new dev boxes created from that pool use SSO. Existing dev boxes continue to use the existing sign-on method. You can enable SSO for dev boxes when you create a new pool. You can also enable SSO for an existing pool.

### Enable SSO when you create a new pool

To enable SSO for dev boxes when you create a pool, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **projects**.
1. In the list of results, select **Projects**.
1. Select the project for which you want to create the pool.
1. On the left menu, under **Manage**, select **Dev box pools**.
1. On the toolbar, select **Create**.
1. On the **Create pool** page, under **Management**, select **Enable single sign-on**.

    :::image type="content" source="./media/how-to-enable-single-sign-on/create-pool-single-sign-on.png" alt-text="Screenshot that shows the Create a dev box pool page in Dev Box." lightbox="./media/how-to-enable-single-sign-on/create-pool-single-sign-on.png":::

1. Enter the remaining details for your new pool, and select **Create**.

### Enable SSO for an existing pool

To enable SSO for dev boxes in an existing pool, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **projects**.
1. In the list of results, select **Projects**.
1. Select the project that contains the pool for which you want to enable SSO.
1. On the left menu, under **Manage**, select **Dev box pools**.
1. Select the pool for which you want to enable SSO.
1. On the line for the pool, select the ellipsis (**...**) and then select **Edit**.
 
   :::image type="content" source="media/how-to-enable-single-sign-on/azure-portal-pool-edit.png" alt-text="Screenshot that shows the Azure portal with the list of pools in a project with the menu and Edit option highlighted." lightbox="media/how-to-enable-single-sign-on/azure-portal-pool-edit.png":::

1. On the **Edit pool** page, under **Management**, select **Enable single sign-on** and then select **Save**.

    :::image type="content" source="./media/how-to-enable-single-sign-on/edit-pool-single-sign-on.png" alt-text="Screenshot that shows the Edit pool page in Dev Box with Enable single sign-on highlighted." lightbox="./media/how-to-enable-single-sign-on/edit-pool-single-sign-on.png":::

## Disable SSO for dev boxes

You can disable SSO for a pool at any time by clearing the **Enable single sign-on** option on the **Edit pool** page.

To disable SSO for dev boxes in an existing pool, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **projects**.
1. In the list of results, select **Projects**.
1. Select the project that contains the pool for which you want to disable SSO.
1. On the left menu, under **Manage**, select **Dev box pools**.
1. Select the pool for which you want to disable SSO.
1. On the line for the pool, select the ellipsis (**...**) and then select **Edit**.

   :::image type="content" source="media/how-to-enable-single-sign-on/azure-portal-pool-edit.png" alt-text="Screenshot that shows the Azure portal with the list of pools in a project with the menu and Edit option highlighted." lightbox="media/how-to-enable-single-sign-on/azure-portal-pool-edit.png":::

1. On the **Edit pool** page, under **Management**, clear **Enable single sign-on** and select **Save**.
  
    :::image type="content" source="./media/how-to-enable-single-sign-on/edit-pool-single-sign-on.png" alt-text="Screenshot that shows the Edit pool page in Dev Box, with Enable single sign-on highlighted." lightbox="./media/how-to-enable-single-sign-on/edit-pool-single-sign-on.png":::

If you disable SSO for a pool, new dev boxes created from that pool prompt the user for credentials. Existing dev boxes continue to use SSO.

## Understand the SSO user experience

When SSO is enabled for a pool, your sign-on experience is:

- The first time you connect to a dev box with SSO enabled, you sign in to your physical machine. Then you connect to your dev box from the developer portal. When the dev box starts up, you must enter your credentials to access the dev box.
- The next time you connect to your dev box, you don't have to enter your credentials.

If your connection to your dev box is interrupted because your client machine goes to sleep, a message appears that explains the issue. To reconnect, select **Reconnect**. You don't have to reenter your credentials.

## Related content

- [Configure single sign-on for Windows 365 by using Microsoft Entra authentication](/windows-365/enterprise/configure-single-sign-on)