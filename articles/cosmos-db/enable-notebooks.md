---
title: Enable notebooks in the Azure Cosmos DB account
description: Azure Cosmos DB's built-in notebooks enable you to analyze and visualize your data from within the Portal. This article describes how to enable this feature for Cosmos accounts. 
author: deborahc
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/22/2019
ms.author: dech

---

# Enable notebooks in Azure Cosmos DB account

Built-in Jupyter notebooks in Azure Cosmos DB enable you to analyze and visualize your data from the Azure Portal. This article describes how to enable this feature in your Azure Cosmos DB account.

## Enable notebooks in a new Cosmos account
> [!IMPORTANT]
> Notebooks are currently only supported for new Cosmos accounts. 
1. Sign into the [Azure Portal](https://portal.azure.com/).
1. Select **Create a resource** > **Databases** > **Azure Cosmos DB**.
1. On the **Create Azure Cosmos DB Account** page, select **Notebooks**. 
 
    ![Select notebooks option in Azure Cosmos DB Create blade](media/enable-notebooks/create-new-account-with-notebooks.png)
1. Select **Review + create**. You can skip the **Network** and **Tags** option. 
1. Review the account settings, and then select **Create**. It takes a few minutes to create the account. Wait for the portal page to display **Your deployment is complete**. 

    ![The Azure portal Notifications pane](../../includes/media/cosmos-db-create-dbaccount/azure-cosmos-db-account-created.png)
1. Select **Go to resource** to go to the Azure Cosmos DB account page. 

    ![The Azure Cosmos DB account page](../../includes/media/cosmos-db-create-dbaccount/azure-cosmos-db-account-created-2.png)

## Create a new notebooks workspace
After enabling notebooks on a new account, you will need to create your notebooks workspace. This needs to be done only once per account. 

1. Navigate to the **Data Explorer** pane in your Cosmos account.
1. Select **Enable Notebooks**.

    ![Create a new notebooks workspace in Data Explorer](media/enable-notebooks/enable-notebooks-workspace.png)
1. This will prompt you to create a new notebooks workspace. Select **Complete setup.**
1. Your account is now enabled to use notebooks!

## Create your first notebook

To verify that you can use notebooks, select one of notebooks under Sample Notebooks, e.g. **GettingStarted.ipynb**. This will save a copy of the notebook to your workspace and open it.

![View GettingStarted.ipynb notebook](media/enable-notebooks/select-getting-started-notebook.png)

You can also select **New Notebook** to create a new notebook or upload an existing notebook  (.ipynb) file by selecting **Upload File** from the **My Notebooks** menu. 

![Create or upload a new notebook](media/enable-notebooks/create-or-upload-new-notebook.png)

