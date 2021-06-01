---
title: Enable notebooks in the Azure Cosmos DB account (preview)
description: Azure Cosmos DB's built-in notebooks enable you to analyze and visualize your data from within the Portal. This article describes how to enable this feature for Cosmos accounts. 
author: deborahc
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: how-to
ms.date: 02/22/2021
ms.author: dech
ms.custom: references_regions

---

# Enable notebooks for Azure Cosmos DB accounts (preview)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

> [!IMPORTANT]
> Built-in notebooks for Azure Cosmos DB are currently available in [29 regions](#supported-regions). To use notebooks, [create a new Cosmos account](#create-a-new-cosmos-account) or [enable notebooks on an existing account](#enable-notebooks-in-an-existing-cosmos-account) in one of these regions. 

Built-in Jupyter notebooks in Azure Cosmos DB enable you to analyze and visualize your data from the Azure portal. This article describes how to enable this feature for your Azure Cosmos DB account.

## Create a new Cosmos account
Starting February 10, 2021, new Azure Cosmos accounts created in one of the [supported region](#supported-regions) will automatically have notebooks enabled. There is no additional configuration needed to enable notebooks. Use the following instructions to create a new account:
1. Sign into the [Azure portal](https://portal.azure.com/).
1. Select **Create a resource** > **Databases** > **Azure Cosmos DB**.
1. Enter the basic settings for the account.

   :::image type="content" source="./media/create-cosmosdb-resources-portal/azure-cosmos-db-create-new-account-detail-2.png" alt-text="The new account page for Azure Cosmos DB":::

1. Select **Review + create**. You can skip the **Network** and **Tags** option. 
1. Review the account settings, and then select **Create**. It takes a few minutes to create the account. Wait for the portal page to display **Your deployment is complete**.

   :::image type="content" source="media/enable-notebooks/create-new-account-with-notebooks-complete.png" alt-text="The Azure portal Notifications pane":::

1. Select **Go to resource** to go to the Azure Cosmos DB account page.

   :::image type="content" source="../../includes/media/cosmos-db-create-dbaccount/azure-cosmos-db-account-created-3.png" alt-text="The Azure Cosmos DB account page":::

1. Navigate to the **Data Explorer** pane. You should now see your notebooks workspace.

    :::image type="content" source="media/enable-notebooks/new-notebooks-workspace.png" alt-text="New Azure Cosmos DB notebooks workspace":::

## Enable notebooks in an existing Cosmos account

You can also enable notebooks on existing accounts. This step needs to be done only once per account.

1. Navigate to the **Data Explorer** pane in your Cosmos account.
1. Select **Enable Notebooks**.

    :::image type="content" source="media/enable-notebooks/enable-notebooks-workspace.png" alt-text="Create a new notebooks workspace in Data Explorer":::

1. This will prompt you to create a new notebooks workspace. Select **Complete setup.**
1. Your account is now enabled to use notebooks!

## Create and run your first notebook

To verify that you can use notebooks, select one of notebooks under Sample Notebooks. This will save a copy of the notebook to your workspace and open it.

In this example, we'll use **GettingStarted.ipynb**.

:::image type="content" source="media/enable-notebooks/select-getting-started-notebook.png" alt-text="View GettingStarted.ipynb notebook":::

To run the notebook:
1. Select the first code cell that contains Python code.
1. Select **Run** to run the cell. You can also use **Shift + Enter** to run the cell.
1. Refresh the resource pane to see the database and container that has been created.

    :::image type="content" source="media/enable-notebooks/run-first-notebook-cell.png" alt-text="Run getting started notebook":::

You can also select **New Notebook** to create a new notebook or upload an existing notebook  (.ipynb) file by selecting **Upload File** from the **My Notebooks** menu. 

:::image type="content" source="media/enable-notebooks/create-or-upload-new-notebook.png" alt-text="Create or upload a new notebook":::

## Supported regions
Built-in notebooks for Azure Cosmos DB are currently available in 29 Azure regions. New Azure Cosmos accounts created in these regions will have notebooks automatically enabled. Notebooks are free with your account. 

- Australia Central
- Australia Central 2
- Australia East
- Australia Southeast
- Brazil South
- Canada Central
- Canada East
- Central India
- Central US
- East US
- East US 2
- France Central
- France South
- Germany North
- Germany West Central
- Japan West
- Korea South
- North Central US
- North Europe
- South Central US
- Southeast Asia
- Switzerland North
- UAE Central
- UK South
- UK West
- West Central US
- West Europe
- West India
- West US 2

## Next steps

* Learn about the benefits of [Azure Cosmos DB Jupyter Notebooks](cosmosdb-jupyter-notebooks.md)
* [Explore notebook samples gallery](https://cosmos.azure.com/gallery.html)
* [Publish notebooks to the Azure Cosmos DB notebook gallery](publish-notebook-gallery.md)
* [Use Python notebook features and commands](use-python-notebook-features-and-commands.md)
* [Use C# notebook features and commands](use-csharp-notebook-features-and-commands.md)
* [Import notebooks from a GitHub repo](import-github-notebooks.md)
