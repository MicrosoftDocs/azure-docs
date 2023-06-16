---
title: |
  Tutorial: Import Jupyter notebooks from GitHub into Azure Cosmos DB for NoSQL (preview)
description: |
  Learn how to connect to GitHub and import the notebooks from a GitHub repository to your Azure Cosmos DB for NoSQL account.
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: overview 
ms.date: 09/29/2022
author: seesharprun
ms.author: sidandrews
ms.reviewer: dech
---

# Tutorial: Import Jupyter notebooks from GitHub into Azure Cosmos DB for NoSQL (preview)

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!IMPORTANT]
> The Jupyter Notebooks feature of Azure Cosmos DB is currently in a preview state and is progressively rolling out to all customers over time.

This tutorial walks through how to import Jupyter notebooks from a GitHub repository and run them in an Azure Cosmos DB for NoSQL account. After importing the notebooks, you can run, edit them, and persist your changes back to the same GitHub repository.

## Prerequisites

- An existing Azure Cosmos DB for NoSQL account.
  - If you have an existing Azure subscription, [create a new account](how-to-create-account.md?tabs=azure-portal).
  - No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required.

## Create a copy of a GitHub repository

1. Navigate to the [azure-samples/cosmos-db-nosql-notebooks](https://github.com/azure-samples/cosmos-db-nosql-notebooks) template repository.

1. Create a new copy of the template repository in your own GitHub account or organization.

## Pull notebooks from GitHub

Instead of creating new notebooks each time you start a workspace, you can import existing notebooks from GitHub. In this section, you'll connect to an existing GitHub repository with sample notebooks.

1. Navigate to your Azure Cosmos DB account and open the **Data Explorer.**

1. Select **Connect to GitHub**.

    :::image type="content" source="media/tutorial-import-notebooks/connect-github-option.png" lightbox="media/tutorial-import-notebooks/connect-github-option.png" alt-text="Screenshot of the Data Explorer with the 'Connect to GitHub' option highlighted.":::

1. In the **Connect to GitHub** dialog, select the access option appropriate to your GitHub repository and then select **Authorize access**.

    :::image type="content" source="media/tutorial-import-notebooks/authorize-access.png" alt-text="Screenshot of the 'Connect to GitHub' dialog with options for various levels of access.":::

1. Complete the GitHub third-party authorization workflow granting access to the organization\[s\] required to access your GitHub repository. For more information, see [Authorizing GitHub Apps](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/authorizing-github-apps).

1. In the **Manage GitHub settings** dialog, select the GitHub repository you created earlier.

    :::image type="content" source="media/tutorial-import-notebooks/select-pinned-repositories.png" alt-text="Screenshot of the 'Manage GitHub settings' dialog with a list of unpinned and pinned repositories.":::

1. Back in the Data Explorer, locate the new tree of nodes for your pinned repository and open the **website-metrics-python.ipynb** file.

    :::image type="content" source="media/tutorial-import-notebooks/open-notebook-pinned-repositories.png" alt-text="Screenshot of the pinned repositories in the Data Explorer.":::

1. In the editor for the notebook, locate the following cell.

    ```python
    import pandas as pd
    pd.options.display.html.table_schema = True
    pd.options.display.max_rows = None
    
    df_cosmos.groupby("Item").size()
    ```

1. The cell currently outputs the number of unique items. Replace the final line of the cell with a new line to output the number of unique actions in the dataset.

    ```python
    df_cosmos.groupby("Action").size()
    ```

1. Run all the cells sequentially to see the new dataset. The new dataset should only include three potential values for the **Action** column. Optionally, you can select a data visualization for the results.

    :::image type="content" source="media/tutorial-import-notebooks/updated-visualization.png" alt-text="Screenshot of the Pandas dataframe visualization for the data.":::

## Push notebook changes to GitHub

> [!TIP]
> Currently, temporary workspaces will be de-allocated if left idle for 20 minutes. The maximum amount of usage time per day is 60 minutes. These limits are subject to change in the future.

To save your work permanently, save your notebooks back to the GitHub repository. In this section, you'll persist your changes from the temporary workspace to GitHub as a new commit.

1. Select **Save** to create a commit for your change to the notebook.

    :::image type="content" source="media/tutorial-import-notebooks/save-option.png" alt-text="Screenshot of the 'Save' option in the Data Explorer menu.":::

1. In the **Save** dialog, add a descriptive commit message.

    :::image type="content" source="media/tutorial-import-notebooks/commit-message-dialog.png" alt-text="Screenshot of the 'Save' dialog with an example of a commit message.":::

1. Navigate to the GitHub repository you created using your browser. The new commit should now be visible in the online repository.

    :::image type="content" source="media/tutorial-import-notebooks/updated-github-repository.png" alt-text="Screenshot of the updated notebook on the GitHub website.":::

## Next steps

- [Learn about the Jupyter Notebooks feature in Azure Cosmos DB](../notebooks-overview.md)
- [Create your first notebook in an Azure Cosmos DB for NoSQL account](tutorial-create-notebook.md)
- [Review the FAQ on Jupyter Notebook support](../notebooks-faq.yml)
