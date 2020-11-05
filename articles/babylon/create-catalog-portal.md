---
title: "Quickstart: Create an Azure Purview account"
titleSuffix: Azure Purview
description: This quickstart describes how to create an Azure Purview account. 
author: hophan
ms.author: hophan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: quickstart
ms.date: 10/23/2020
# Customer intent: As a data steward, I want create a new Azure Data Catalog so that I can scan and classify my data.
---

# Quickstart: Create an Azure Purview account

In this quickstart, you create an Azure Purview account.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your own [Azure Active Directory tenant](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Configure your subscription

If necessary, follow these steps to configure your subscription to enable Azure Purview to run in your subscription:

   1. In the Azure portal, search for and select **Subscriptions**.

   1. From the list of subscriptions, select the subscription you want to use. Administrative access permission for the subscription is required.

      :::image type="content" source="./media/create-catalog-portal/select-subscription.png" alt-text="Screenshot showing how to select a subscription in the Azure portal.":::

   1. For your subscription, select **Resource providers**. On the **Resource providers** pane, search for the **Microsoft.ProjectBabylon** resource provider. If it isn't registered, register it by selecting **Register**.

      :::image type="content" source="./media/create-catalog-portal/register-babylon-resource-provider.png" alt-text="Screenshot showing how to register the  Microsoft dot Azure Purview resource provider in the Azure portal.":::

## Create an Azure Purview account instance

1. Go to the [**Purview accounts**](https://aka.ms/babylonportal) page in the Azure portal, and then select **Add** to create a new Azure Purview account.

   :::image type="content" source="./media/create-catalog-portal/add-babylon-instance.png" alt-text="Screenshot showing how to create an Azure Purview account instance in the Azure portal.":::

   You can add only one Azure Purview account at a time.

1. Select a **Resource group**, and then enter a **Purview account name** for your catalog. Spaces and symbols aren't allowed.

1. Make a choice for **Location**, and then select **Next: Tags**.
1. Optionally, add one or more tags. These tags are for use only in the Azure portal, not the catalog.
1. Select **Review & Create**, and then select **Create**. It takes a few minutes to complete the catalog creation. The newly created Azure Purview account instance appears in the list on your **Purview accounts** page.
1. When the new account is ready, select **Go to resource**.

1. Select **Launch purview account**.

   :::image type="content" source="./media/create-catalog-portal/launch-babylon-account.png" alt-text="Screenshot of the selection to launch the Azure Purview account catalog.":::

## Clean up resources

If you no longer need this Azure Purview account, delete it with the following steps:

1. Go to the [**Purview accounts**](https://aka.ms/babylonportal) page in the Azure portal.

2. Select the Azure Purview account that you created at the beginning of this quickstart. Select **Delete**, enter the name of the account, and then select **Delete**.

## Next steps

In this quickstart, you learned how to create an Azure Purview account.

Advance to the next article to learn how to add a security principal to a role.

> [!div class="nextstepaction"]
> [Add a security principal](add-security-principal.md)