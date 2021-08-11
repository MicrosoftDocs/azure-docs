---
title: 'Quickstart: Create an Azure Purview account in the Azure portal'
description: This Quickstart describes how to create an Azure Purview account and configure permissions to begin using it.
author: nayenama
ms.author: nayenama
ms.date: 10/23/2020
ms.topic: quickstart
ms.service: purview
ms.subservice: purview-data-catalog
ms.custom:
  - mode-portal
# Customer intent: As a data steward, I want create a new Azure Purview Account so that I can scan and classify my data.
---
# Quickstart: Create an Azure Purview account in the Azure portal.

This quickstart describes the steps to create an Azure Purview account by using the Azure portal.

## Create an Azure Purview account 

1. Go to the **Purview accounts** page in the Azure portal, and then select **Create** to create a new Azure Purview account. Alternatively, you can go to marketplace search for **Purview** and select **Create**. Note that you can add only one Azure Purview account at a time.

   :::image type="content" source="media/create-catalog-portal/add-purview-instance.png" alt-text="Screenshot showing how to create an Azure Purview account instance in the Azure portal.":::

    > [!Note] 
    > Azure Purview does not support moving its account across regions. You can find out more information about this in [Move operation support for resources](../azure-resource-manager/management/move-support-resources.md).

1. On the **Basics** tab, do the following:
    1. Select a **Resource group**.
    1. Enter a **Purview account name** for your catalog. Spaces and symbols aren't allowed.
    1. Choose a  **Location** and Select **Review & Create**.
  
    
2. Select **Review & Create**, and then select **Create**. It takes a few minutes to complete the creation. The newly created Azure Purview account instance appears in the list on your **Purview accounts** page.

## Open Purview Studio

After your Azure Purview account is created, you have two ways to open Purview Studio:

* Open your Purview account  in the [Azure portal](https://portal.azure.com). On the top of the **Overview** section, select **Open Purview Studio**.
* Go to the `https://web.purview.azure.net` and sign in to your workspace.

## Next steps

In this quickstart, you learned how to create an Azure Purview account.

Advance to the next article to learn how to allow users to access your Azure Purview Account. 

> [!div class="nextstepaction"]
> [Add users to your Azure Purview Account](catalog-permissions.md)
