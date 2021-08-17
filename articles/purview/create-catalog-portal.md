---
title: 'Quickstart: Create an Azure Purview account in the Azure portal'
description: This Quickstart describes how to create an Azure Purview account and configure permissions to begin using it.
author: nayenama
ms.author: nayenama
ms.date: 08/18/2021
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
    > Azure Purview does not support moving accounts across regions, so be sure to deploy to the correction region. You can find out more information about this in [move operation support for resources](../azure-resource-manager/management/move-support-resources.md).

1. On the **Basics** tab, do the following:
    1. Select a **resource group**.
    1. Enter a **Purview account name**. Spaces and symbols aren't allowed.
    1. Choose a **location**.
    1. Enter a **managed resource group name** for a resource group that Purview will create to house a storage account and an Eventhub for catalog ingestion.
1. Select **Review & Create**, and then select **Create**. It takes a few minutes to complete the creation. The newly created Azure Purview account instance appears in the list on your **Purview accounts** page.

## Open Purview Studio

After your Azure Purview account is created, you have two ways to open Purview Studio:

* Open your Purview account  in the [Azure portal](https://portal.azure.com). On the top of the **Overview** section, select **Open Purview Studio**.
* Go to the `https://web.purview.azure.net` and sign in to your workspace.

## Next steps

In this quickstart, you learned how to create an Azure Purview account.

Advance to the next articles to learn how to allow users to access your Azure Purview Account, how to navigate the Purview Studio, and how to create and manage collections.

* [Using the Purview Studio](use-purview-studio.md)
* [Add users to your Azure Purview account](catalog-permissions.md)
* [Create and manage collections](how-to-create-and-manage-collections.md)
