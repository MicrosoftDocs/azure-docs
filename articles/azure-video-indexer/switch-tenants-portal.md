---
title: Switch between tenants on the Azure Video Indexer website
description: This article shows how to switch between tenants in the Azure Video Indexer website. 
ms.topic: how-to
ms.date: 08/26/2022
---

# Switch between multiple tenants

This article shows how to switch between multiple tenants on the Azure Video Indexer website. When you create an ARM-based account, the new account may not show up on the Azure Video Indexer website. So you need to make sure to sign in with the correct domain.

The steps that show how to sign in with the correct domain name are shown in this article:

1. You first go to the Azure portal to get the domain name. 
1. You then sign out of your Azure Video Indexer (AVI) account on the AVI website and sign in with the domain name you got from the Azure portal. 

## Sign in to the Azure portal to get the domain name

From a browser, go to the Azure [portal](https://portal.azure.com/) and sign in with your Azure account.

If you have multiple subscriptions and need to switch subscriptions:

1. Select the profile button, and then select the **Switch Directory** link.

    > [!div class="mx-imgBorder"]
    > ![Select Switch directory in the Azure portal.](./media/switch-directory/choose-subscription.png)
1. Select the **All Directories** tab.
1. Find the directory you want to switch to. For more information, see [Switch and manage directories](../azure-portal/set-preferences.md#switch-and-manage-directories).
1. Copy the domain name for the selected directory, you'll use it in the last step of the next section.

## Sign in with the correct domain name on the AVI website

1. Go to the [Azure Video Indexer](https://www.videoindexer.ai/) website.
1. Press **Sign out** after pressing the button in the top-right corner.
1. On the AVI website, press **Sign in** and choose the AAD account.

    > [!div class="mx-imgBorder"]
    > ![Sign in with the AAD account.](./media/switch-directory/choose-account.png)
1. Press **Use another account**.

    > [!div class="mx-imgBorder"]
    > ![Choose another account.](./media/switch-directory/use-another-account.png)
1. Choose **Sign-in with other options**.

    > [!div class="mx-imgBorder"]
    > ![Sign in with other options.](./media/switch-directory/sign-in-options.png)
1. Press **Sign in to an organization**.

    > [!div class="mx-imgBorder"]
    > ![Sign in to an organization.](./media/switch-directory/sign-in-organization.png)
1. Enter the domain name you copied in the [Sign in to the Azure portal to get the domain name](#sign-in-to-the-azure-portal-to-get-the-domain-name) section.

    > [!div class="mx-imgBorder"]
    > ![Find the organization.](./media/switch-directory/find-your-organization.png)

## Next steps

[FAQ](faq.yml)