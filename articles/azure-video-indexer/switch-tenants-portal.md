---
title: Switch between tenants on the Azure Video Indexer website
description: This article shows how to switch between tenants in the Azure Video Indexer website. 
ms.topic: how-to
ms.date: 08/26/2022
---

# Switch between multiple tenants

This article shows how to switch between multiple tenants on the Azure Video Indexer website. When you create an ARM-based account, the new account may not show up on the Azure Video Indexer website. So you need to make sure to sign in with the correct domain.

The article shows how to sign in with the correct domain name into the Azure Video Indexer website. 

## Get the domain name for the Azure portal

1. In the [Azure portal](https://portal.azure.com/), sign in with the same subscription in which your Azure Video Indexer Azure Resource Manager account was created. 
1. Hover over your account name (in the right-top corner). 

    > [!div class="mx-imgBorder"]
    > ![Hover over your account name.](./media/switch-directory/account-attributes.png)
1. Get the domain name of the current Azure subscription, you'll need it for the last step of the following section. 

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