---
title: Enable single sign-on for dev boxes
titleSuffix: Microsoft Dev Box
description: Learn how to enable single sign-on for dev boxes Edit an existing pool to configure single sign-on for new dev boxes.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/24/2024
ms.topic: how-to

#customer intent: As a platform engineer, I want to enable single sign-on for dev boxes, so that my dev box users have a smoother sign-on experience.
---

# Enable single sign-on for dev boxes

In this article, you learn how to enable single sign-on (SSO) for dev boxes in Microsoft Dev Box pools. 

SSO allows you to skip the credential prompt when connecting to a dev box and automatically sign in to Windows through Microsoft Entra authentication. Microsoft Entra authentication provides other benefits including passwordless authentication and support for third-party identity providers. To get started, review the steps to configure single sign-on.

## Prerequisites

- To enable SSO for dev boxes, you must configure single sign-on for your organization. For more information, see: [Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID authentication](/azure/virtual-desktop/configure-single-sign-on).
 
## Enable SSO for dev boxes

Single sign-on is enabled at the pool level. Dev Box supports single sign-on for dev box pools that use Microsoft Entra joined networks, and Microsoft hosted network, but not pools using Microsoft Entra hybrid joined networks.

When you enable SSO for a pool, all new dev boxes created from that pool use SSO. Existing dev boxes continue to use the existing sign-on method. You can enable single sign-on for dev boxes as you create a pool, or an existing pool.

### Enable SSO when creating a new pool

To enable SSO for dev boxes as you create a pool, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter *projects*. 
1. In the list of results, select **Projects**.
1. Select the project in which you want to create the pool.
1. In the left menu, under **Manage**, select **Dev box pools**.
1. In the toolbar, select **Create**.
1. On the **Create pool** page, under **Management**, select **Enable single sign-on**.

    :::image type="content" source="./media/how-to-enable-single-sign-on/create-pool-single-sign-on.png" alt-text="Screenshot that shows the Create pool page in Microsoft Dev Box." lightbox="./media/how-to-enable-single-sign-on/create-pool-single-sign-on.png":::

1. Enter the remaining details for your new pool, and then select **Create**.

### Enable SSO for an existing pool

To enable SSO for dev boxes in an existing pool, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter *projects*. 
1. In the list of results, select **Projects**.
1. Select the project that contains the pool you want to enable SSO for.
1. In the left menu, under **Manage**, select **Dev box pools**.
1. Select the pool that you want to enable SSO for.
1. On the line for the pool, at the right end, select **...** and then select **Edit**.
 
   :::image type="content" source="media/how-to-enable-single-sign-on/azure-portal-pool-edit.png" alt-text="Screenshot of the Azure portal showing the list of pools in a project with the menu and edit option highlighted." lightbox="media/how-to-enable-single-sign-on/azure-portal-pool-edit.png":::
 
1. On the **Edit pool** page, under **Management**, select **Enable single sign-on**, and then select **Save**.

    :::image type="content" source="./media/how-to-enable-single-sign-on/edit-pool-single-sign-on.png" alt-text="Screenshot that shows the Edit pool page in Microsoft Dev Box, with Enable single sign-on highlighted." lightbox="./media/how-to-enable-single-sign-on/edit-pool-single-sign-on.png":::

## Disable SSO for dev boxes

You can disable SSO for a pool at any time by deselecting the **Enable single sign-on** option on the **Edit pool** page.

To disable SSO for dev boxes in an existing pool, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter *projects*. 
1. In the list of results, select **Projects**.
1. Select the project that contains the pool you want to disable SSO for.
1. In the left menu, under **Manage**, select **Dev box pools**.
1. Select the pool that you want to disable SSO for.
1. On the line for the pool, at the right end, select **...** and then select **Edit**.
 
   :::image type="content" source="media/how-to-enable-single-sign-on/azure-portal-pool-edit.png" alt-text="Screenshot of the Azure portal showing the list of pools in a project with the menu and edit option highlighted." lightbox="media/how-to-enable-single-sign-on/azure-portal-pool-edit.png":::
 
1. On the **Edit pool** page, under **Management**, clear **Enable single sign-on**, and then select **Save**.
  
    :::image type="content" source="./media/how-to-enable-single-sign-on/edit-pool-single-sign-on.png" alt-text="Screenshot that shows the Edit pool page in Microsoft Dev Box, with Enable single sign-on highlighted." lightbox="./media/how-to-enable-single-sign-on/edit-pool-single-sign-on.png"::: 

If you disable single sign-on for a pool, new dev boxes created from that pool prompt the user for credentials. Existing dev boxes continue to use SSO.

## Understand the SSO user experience

When single sign-on is enabled for a pool, your sign-on experience is as follows:

The first time you connect to a dev box with single sign-on enabled, you first sign into your physical machine. Then you connect to your dev box from the Remote Desktop app or the developer portal. When the dev box starts up, you must enter your credentials to access the dev box. 

The next time you connect to your dev box, whether through the Remote Desktop app or through the developer portal, you don't have to enter your credentials. 

If your connection to your dev box is interrupted because your client machine goes to sleep, you see a message explaining the issue, and you can reconnect by selecting the **Reconnect** button. You don't have to reenter your credentials. 

## Related content

- [Configure single sign-on for Windows 365 using Microsoft Entra authentication](/windows-365/enterprise/configure-single-sign-on)