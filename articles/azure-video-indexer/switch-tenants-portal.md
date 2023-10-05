---
title: Switch between tenants on the Azure AI Video Indexer website
description: This article shows how to switch between tenants in the Azure AI Video Indexer website. 
ms.topic: how-to
ms.date: 01/24/2023
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Switch between multiple tenants

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

When working with multiple tenants/directories in the Azure environment user might need to switch between the different directories. 

When logging in the Azure AI Video Indexer website, a default directory will load and the relevant accounts and list them in the **Account list**.

> [!Note]
> Trial accounts and Classic accounts are global and not tenant-specific. Hence, the tenant switching described in this article only applies to your ARM accounts.
>
> The option to switch directories is available only for users using Azure Active Directory (Azure AD) to log in. 

This article shows two options to solve the same problem - how to switch tenants:

- When starting [from within the Azure AI Video Indexer website](#switch-tenants-from-within-the-azure-ai-video-indexer-website).
- When starting [from outside of the Azure AI Video Indexer website](#switch-tenants-from-outside-the-azure-ai-video-indexer-website).

## Switch tenants from within the Azure AI Video Indexer website

1. To switch between directories in the [Azure AI Video Indexer](https://www.videoindexer.ai/), open the **User menu** > select **Switch directory**.

    > [!div class="mx-imgBorder"]
    > ![Screenshot of a user name.](./media/switch-directory/avi-user-switch.png)

    Here user can view all detected directories listed. The current directory will be marked, once a different directory is selected the **Switch directory** button will be available. 

    > [!div class="mx-imgBorder"]
    > ![Screenshot of a tenant list.](./media/switch-directory/tenants.png)

    Once clicked, the authenticated credentials will be used to sign in again to the Azure AI Video Indexer website with the new directory.

## Switch tenants from outside the Azure AI Video Indexer website

This section shows how to get the domain name from the Azure portal. You can then sign in with it into th the [Azure AI Video Indexer](https://www.videoindexer.ai/) website.

### Get the domain name

1. Sign in to the [Azure portal](https://portal.azure.com) using the same subscription tenant in which your Azure AI Video Indexer Azure Resource Manager (ARM) account was created. 
1. Hover over your account name (in the right-top corner). 

    > [!div class="mx-imgBorder"]
    > ![Hover over your account name.](./media/switch-directory/account-attributes.png)
1. Get the domain name of the current Azure subscription, you'll need it for the last step of the following section. 

If you want to see domains for all of your directories and switch between them, see [Switch and manage directories with the Azure portal](../azure-portal/set-preferences.md#switch-and-manage-directories).

### Sign in with the correct domain name on the AVI website

1. Go to the [Azure AI Video Indexer](https://www.videoindexer.ai/) website.
1. Press **Sign out** after pressing the button in the top-right corner.
1. On the AVI website, press **Sign in** and choose the Azure AD account.

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
1. Enter the domain name you copied in the [Get the domain name from the Azure portal](#get-the-domain-name) section.

    > [!div class="mx-imgBorder"]
    > ![Find the organization.](./media/switch-directory/find-your-organization.png)

## Next steps

[FAQ](faq.yml)
