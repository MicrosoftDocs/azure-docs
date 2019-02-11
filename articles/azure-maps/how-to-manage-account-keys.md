---
title: Manage your Azure Maps account and keys | Microsoft Docs 
description: You can use the Azure portal to manage your Azure Maps account and manage your access keys.
author: walsehgal
ms.author: v-musehg
ms.date: 12/12/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Manage your Azure Maps account and keys

You can manage your Azure Maps account and keys through the Azure portal. After you have an account and a key, you can implement the APIs in your website or mobile application.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a new account

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **Create a resource** in the upper-left corner of the Azure portal.

3. Search for and select **Maps**. Then select **Create**.

4. Enter the information for your new account.

![Enter account information in the portal](./media/how-to-manage-account-keys/new-account-portal.png)

## Manage keys on the account page

After you create an account, you get two randomly generated keys. To retrieve map data or create a new JavaScript map instance, use the keys to authenticate against the Azure Maps APIs.

You can find your keys in the Azure portal. Navigate to your account. Then select **Keys** from the menu.

![Manage account keys in the portal](./media/how-to-manage-account-keys/account-keys-portal.png)

From this page, you can copy your keys or generate new ones.

## Delete an account

You can delete an account from the Azure portal. Navigate to the account overview page and select **Delete**.

![Delete your account in the portal](./media/how-to-manage-account-keys/account-delete-portal.png)

You then see a confirmation page. You can confirm the deletion of your account by typing its name.

## Next steps

* Learn how to manage an Azure Maps account pricing tier:
    > [!div class="nextstepaction"]	
    > [Manage a pricing tier](./how-to-manage-pricing-tier.md)

* Learn how to see the API usage metrics for your Azure Maps account:
    > [!div class="nextstepaction"]	
    > [View usage metrics](./how-to-view-api-usage.md)
