---
title: "Quickstart: Create an Azure Babylon account"
description: This tutorial describes how top create an Azure Babylon account. 
author: hophan
ms.author: hophan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: quickstart
ms.date: 09/01/2020
# Customer intent: As a data steward, I want create a new Azure Data Catalog so that I can scan and classify my data.
---

# Quickstart: Create an Azure Babylon account

In this quickstart, you create an Azure Babylon account.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your own [Azure Active Directory tenant](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Configure your subscription

If necessary, follow these steps to configure your subscription to enable Azure Babylon to run in your subscription:

   1. In the Azure portal, search for and select **Subscriptions**.

   1. From the list of subscriptions, select the subscription you want to use. Administrative access permission for the subscription is required.

      :::image type="content" source="./media/create-catalog-portal/select-subscription.png" alt-text="Screenshot showing how to select a subscription in the Azure portal.":::

   1. For your subscription, select **Resource providers**. If the **Microsoft.ProjectBabylon** resource provider isn't registered, register it by selecting **Register**.

      :::image type="content" source="./media/create-catalog-portal/register-babylon-resource-provider.png" alt-text="Screenshot showing how to register the  Microsoft dot Project Babylon resource provider in the Azure portal.":::

## Create an Azure Babylon account instance

1. Go to the [**Babylon accounts**](https://aka.ms/babylonportal) page in the Azure portal and select **Add** to create a new Azure Babylon instance.

   :::image type="content" source="./media/create-catalog-portal/add-bablylon-instance.png" alt-text="Screenshot showing how to create an Azure Babylon account instance in the Azure portal.":::

   You can add only one Azure Babylon instance at a time.

1. If necessary, change the subscription to a subscription that's in the allow list for your preview access.

   :::image type="content" source="./media/create-catalog-portal/change-subscription.png" alt-text="Screenshot showing the New Babylon account page with the allow-listed subscription selected.":::

1. Enter a **Babylon account name** for your catalog. Spaces and symbols aren't allowed.

   > [!IMPORTANT]
   > Don't name your catalog with your company name or use sensitive information during the private preview. DNS names are not private, and your company's participation in the private preview might be disclosed via the DNS name.
1. Make a choice for **Location**, and then select **Next**.
1. Optionally, add one or more tags.

   These tags are for use only in the Azure portal, not the catalog. They don't affect the catalog for the purposes of the preview.
1. Select **Review & Create**, and then select **Create**.

   It takes a few minutes to complete catalog creation. The newly created Azure Babylon account instance appears in the list on your **Babylon accounts** page.
1. When the new account is ready, select **Go to resource**.

1. Select **Launch babylon account**.

   :::image type="content" source="./media/create-catalog-portal/launch-bablylon-account.png" alt-text="Screenshot of the selection to launch the Azure Babylon account catalog.":::

## Clean up resources

If you no longer need this Azure Babylon account, delete it with the following steps:

1. Go to the [**Babylon accounts**](https://aka.ms/babylonportal) page in the Azure portal.

2. Select the Azure Babylon instance that you created at the beginning of the tutorial. Select **Delete**, enter the name of the data catalog instance, and then select **Delete**.

## Next steps

In this quickstart, you learned how to create an Azure Babylon account.

Advance to the next article to learn how to add a security principal to a role.

> [!div class="nextstepaction"]
> [Add a security principal](add-security-principal.md)