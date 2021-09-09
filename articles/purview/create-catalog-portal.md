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

Azure Purview is a unified data governance tool that helps you to manage your data landscape. This quickstart describes the steps to create an Azure Purview account in the Azure portal and get started on the process of classifying, securing, and discovering your data in Purview!

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The user account that you use to sign in to Azure must be a contributor, owner, or an administrator of the Azure subscription.

* Your own [Azure Active Directory tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md).

* No [Azure Policies](../governance/policy/overview.md) preventing creation of **Storage accounts** or **Event Hub namespaces**. Purview will deploy a managed Storage account and Event Hub when it is created. If a blocking policy exists and needs to remain in place, please follow our [Purview exception tag guide](create-purview-portal-faq.md) to prepare your environment.

## Create an Azure Purview account

1. Go to the **Purview accounts** page in the [Azure portal](https://portal.azure.com).

    :::image type="content" source="media/create-catalog-portal/purview-accounts-page.png" alt-text="Screenshot showing the purview accounts page in the Azure Portal":::

1. Select **Create** to create a new Azure Purview account.

   :::image type="content" source="media/create-catalog-portal/select-create.png" alt-text="Screenshot with the create button highlighted an Azure Purview in the Azure portal.":::
  
      Or instead, you can go to the marketplace, search for **Azure Purview**, and select **Create**.

     :::image type="content" source="media/create-catalog-portal/search-marketplace.png" alt-text="Screenshot showing Azure Purview in the Azure marketplace, with the create button highlighted.":::

1. On the new Create Purview account page, under the **Basics** tab, select the Azure subscription where you want to create your Purview account.

1. Select an existing **resource group** or create a new one to hold your Purview account.

    To learn more about resource groups, see our article on [using resource groups to manage your Azure resources](../azure-resource-manager/management/manage-resource-groups-portal.md#what-is-a-resource-group).

1. Enter a **Purview account name**. Spaces and symbols aren't allowed.
    The name of the Purview account must be globally unique. If you see the following error, change the name of Purview account and try creating again.

    :::image type="content" source="media/create-catalog-portal/name-error.png" alt-text="Screenshot showing the Create Purview account screen with an account name that is already in use, and the error message highlighted.":::

1. Choose a **location**.
    The list shows only locations that support Purview. The location you choose will be the region where your Purview account and meta data will be stored. Sources can be housed in other regions.

      > [!Note]
      > Azure Purview does not support moving accounts across regions, so be sure to deploy to the correction region. You can find out more information about this in [move operation support for resources](../azure-resource-manager/management/move-support-resources.md).

1. Select **Review & Create**, and then select **Create**. It takes a few minutes to complete the creation. The newly created Azure Purview account instance will appear in the list on your **Purview accounts** page.

    :::image type="content" source="media/create-catalog-portal/create-resource.png" alt-text="Screenshot showing the Create Purview account screen with the Review + Create button highlighted":::

## Open Purview Studio

After your Azure Purview account is created, you'll use the Purview Studio to access and manage it. There are two ways to open Purview Studio:

* Open your Purview account in the [Azure portal](https://portal.azure.com). Select the "Open Purview Studio" tile on the overview page.
    :::image type="content" source="media/create-catalog-portal/open-purview-studio.png" alt-text="Screenshot showing the Purview account overview page, with the Purview Studio tile highlighted.":::

* Alternatively, you can browse to [https://web.purview.azure.com](https://web.purview.azure.com), select your Purview account, and sign in to your workspace.

## Next steps

In this quickstart, you learned how to create an Azure Purview account and how to access it through the Purview Studio.

Follow these next articles to learn how to navigate the Purview Studio, create a collection, and grant access to Purview.

* [Using the Purview Studio](use-purview-studio.md)
* [Create a collection](quickstart-create-collection.md)
* [Add users to your Azure Purview account](catalog-permissions.md)
