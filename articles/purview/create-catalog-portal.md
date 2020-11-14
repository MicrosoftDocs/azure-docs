---
title: "Quickstart: Create an Azure Purview account"
description: This quickstart describes how to create an Azure Purview account. 
author: hophan
ms.author: hophan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: quickstart
ms.date: 10/23/2020
# Customer intent: As a data steward, I want create a new Azure Purview Account so that I can scan and classify my data.
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

1. Go to the **Purview accounts** page in the Azure portal, and then select **Add** to create a new Azure Purview account. Alternatively, you can go to marketplace search for **Purview Accounts** and select **Create**. Note that you can add only one Azure Purview account at a time.

   :::image type="content" source="./media/create-catalog-portal/add-babylon-instance.png" alt-text="Screenshot showing how to create an Azure Purview account instance in the Azure portal.":::

1. On the **Basics** tab, do the following:
    1. Select a **Resource group**.
    1. Enter a **Purview account name** for your catalog. Spaces and symbols aren't allowed.
    1. Choose a  **Location**, and then select **Next: Configuration**.
1. On the **Configuration** tab, select the desired **Platform size** - the allowed values are 4 capacity units (CU) and 16 CU. Select **Next: Tags**.
1. On the **Tags** tab, you can optionally add one or more tags. These tags are for use only in the Azure portal, not Azure Purview.
1. Select **Review & Create**, and then select **Create**. It takes a few minutes to complete the creation. The newly created Azure Purview account instance appears in the list on your **Purview accounts** page.
1. When the new account provisioning is complete select **Go to resource**.

1. Select **Launch purview account**.

   :::image type="content" source="./media/use-purview-studio/launch-from-portal.png" alt-text="Screenshot of the selection to launch the Azure Purview account catalog.":::

## Clean up resources

If you no longer need this Azure Purview account, delete it with the following steps:

1. Go to the **Purview accounts** page in the Azure portal.

2. Select the Azure Purview account that you created at the beginning of this quickstart. Select **Delete**, enter the name of the account, and then select **Delete**.

## Next steps

In this quickstart, you learned how to create an Azure Purview account.

Advance to the next article to learn how to allow users to access your Azure Purview Account. 

> [!div class="nextstepaction"]
> [Add users to your Azure Purview Account](catalog-permissions.md)